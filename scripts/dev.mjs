import { spawn } from "child_process";
import { cleanCache } from "./clean-cache.mjs";
import { killPort } from "./kill-port.mjs";

const PORT = 3000;
const BASE = `http://localhost:${PORT}`;
const shouldOpen =
  !process.argv.includes("--no-open") && process.env.NO_OPEN !== "1";

function openBrowser(url) {
  const cmd =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  spawn(cmd, { shell: true, stdio: "ignore", detached: true }).unref();
}

async function pageLooksStyled(html) {
  if (!html.includes("TechCare Connects")) return false;
  // Tailwind / layout classes from our app shell
  return (
    html.includes("font-sans") ||
    html.includes("antialiased") ||
    html.includes("hero-headline")
  );
}

async function staticAssetsOk(html) {
  const assetPaths = [
    ...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"?]+)[^"]*"/g),
  ].map((m) => m[1]);

  if (assetPaths.length === 0) {
    return pageLooksStyled(html);
  }

  for (const path of assetPaths.slice(0, 4)) {
    const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
    if (!res.ok) return false;
  }

  return true;
}

async function waitForHealthyServer(maxMs = 120_000) {
  const started = Date.now();
  let lastError = "Server not responding";

  while (Date.now() - started < maxMs) {
    try {
      const res = await fetch(BASE, { redirect: "follow" });
      const html = await res.text();

      if (res.ok && (await staticAssetsOk(html))) {
        return true;
      }

      lastError = res.ok
        ? "HTML loaded but static assets missing (stale cache)"
        : `HTTP ${res.status}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }

    await new Promise((r) => setTimeout(r, 600));
  }

  console.error(`Timed out waiting for a healthy dev server: ${lastError}`);
  return false;
}

async function main() {
  console.log("Preparing TechCare Connects dev server…");

  // A second `npm run dev` used to wipe `.next` while the old server kept running → CSS 404.
  for (const port of [PORT, 3001]) {
    killPort(port);
  }
  await new Promise((r) => setTimeout(r, 400));

  await cleanCache({ force: true });

  console.log(`Starting Next.js at ${BASE}`);
  const child = spawn("npx", ["next", "dev", "-p", String(PORT)], {
    shell: true,
    stdio: "inherit",
  });

  child.on("exit", (code) => process.exit(code ?? 0));

  process.on("SIGINT", () => child.kill("SIGINT"));
  process.on("SIGTERM", () => child.kill("SIGTERM"));

  const ready = await waitForHealthyServer();
  if (ready) {
    console.log("Dev server ready — styles verified.");
    if (shouldOpen) {
      openBrowser(BASE);
    }
  } else {
    console.error(
      "Dev server is running but assets look broken. Try Ctrl+C and run `npm run dev` again."
    );
  }
}

main();

import { rmSync, existsSync } from "fs";
import net from "net";

const force = process.argv.includes("--force");

function portBusy(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once("error", () => resolve(true));
    probe.once("listening", () => {
      probe.close(() => resolve(false));
    });
    probe.listen(port, "127.0.0.1");
  });
}

async function devServerRunning() {
  return (await portBusy(3000)) || (await portBusy(3001));
}

export async function cleanCache(options = {}) {
  const { force: forceClean = force } = options;
  const devUp = await devServerRunning();

  if (devUp && !forceClean) {
    console.log(
      "Dev server is running — skipping .next/ cleanup so styles keep working."
    );
    console.log("Stop dev first, or run build (which restarts cleanly).");
    if (existsSync("out")) {
      rmSync("out", { recursive: true, force: true });
      console.log("Removed out/");
    }
    return false;
  }

  for (const dir of [".next", "out"]) {
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      console.log(`Removed ${dir}/`);
    }
  }
  return true;
}

if (process.argv[1]?.includes("clean-cache.mjs")) {
  cleanCache().then(() => process.exit(0));
}

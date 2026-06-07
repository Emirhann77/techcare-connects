import { spawnSync } from "child_process";
import { killPort } from "./kill-port.mjs";
import { cleanCache } from "./clean-cache.mjs";

const PORTS = [3000, 3001];

async function main() {
  console.log("Production build — stopping dev servers first…");
  for (const port of PORTS) {
    killPort(port);
  }
  await new Promise((r) => setTimeout(r, 500));

  await cleanCache({ force: true });

  console.log("Building static export…");
  const result = spawnSync("npx", ["next", "build"], {
    shell: true,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_STATIC_EXPORT: "1",
    },
  });

  process.exit(result.status ?? 1);
}

main();

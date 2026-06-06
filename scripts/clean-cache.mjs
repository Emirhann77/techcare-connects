import { rmSync, existsSync } from "fs";

for (const dir of [".next", "out"]) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`Removed ${dir}/`);
  }
}

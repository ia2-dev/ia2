import { execFile } from "node:child_process";
import { mkdir, readFile, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactsRoot = resolve(packageRoot, "artifacts");
const { version } = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8"));

await mkdir(artifactsRoot, { recursive: true });
for (const target of ["chrome", "firefox"]) {
  const archive = resolve(artifactsRoot, `ia2-navigator-${target}-${version}.zip`);
  await rm(archive, { force: true });
  await run("zip", ["-qr", archive, "."], { cwd: resolve(packageRoot, "dist", target) });
  console.log(`Created ${archive}`);
}

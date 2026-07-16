import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = resolve(packageRoot, "artifacts/safari");
await mkdir(projectRoot, { recursive: true });

const args = [
  "safari-web-extension-packager",
  "--project-location", projectRoot,
  "--app-name", "IA² Navigator",
  "--bundle-identifier", "dev.ia2.navigator",
  "--swift",
  "--copy-resources",
  "--no-open",
  "--no-prompt",
  "--force",
  resolve(packageRoot, "dist/safari"),
];

const child = spawn("xcrun", args, { stdio: "inherit" });
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});

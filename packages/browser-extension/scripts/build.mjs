import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import sharp from "sharp";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(packageRoot, "../..");
const e2e = process.argv.includes("--e2e");
const distRoot = resolve(packageRoot, e2e ? "dist-e2e" : "dist");
const targets = ["chrome", "firefox", "safari"];
const iconSizes = [16, 32, 48, 128, 512];

const packageJson = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8"));
const baseManifest = JSON.parse(await readFile(resolve(packageRoot, "manifest.base.json"), "utf8"));
baseManifest.version = packageJson.version;

function manifestFor(target) {
  const manifest = structuredClone(baseManifest);
  if (target === "chrome" || target === "safari") {
    manifest.background = { service_worker: "background.js" };
  } else {
    manifest.background = { persistent: false, scripts: ["background.js"] };
  }
  if (target === "chrome") manifest.minimum_chrome_version = "111";
  if (target === "firefox") {
    manifest.browser_specific_settings = {
      gecko: {
        data_collection_permissions: {
          required: ["none"],
        },
        id: "navigator@ia2.dev",
        strict_min_version: "113.0",
      },
    };
  }
  if (e2e) {
    manifest.host_permissions = ["http://127.0.0.1/*"];
    if (target !== "chrome") {
      manifest.content_scripts = [
        {
          js: ["content.js"],
          matches: ["http://127.0.0.1/*"],
          run_at: "document_idle",
          world: "MAIN",
        },
        {
          js: ["status.js"],
          matches: ["http://127.0.0.1/*"],
          run_at: "document_idle",
          world: "ISOLATED",
        },
      ];
    }
  }
  return manifest;
}

async function bundle(entryPoint, outputName) {
  const result = await build({
    absWorkingDir: packageRoot,
    bundle: true,
    entryPoints: [entryPoint],
    format: "iife",
    legalComments: "none",
    logLevel: "silent",
    outfile: outputName,
    platform: "browser",
    target: ["chrome111", "firefox113", "safari16.4"],
    write: false,
  });
  const output = result.outputFiles.find((file) => file.path.endsWith(outputName));
  if (!output) throw new Error(`esbuild did not produce ${outputName}`);
  return output.contents;
}

await rm(distRoot, { force: true, recursive: true });
const [background, content, status] = await Promise.all([
  bundle("src/background.js", "background.js"),
  bundle("src/content.js", "content.js"),
  bundle("src/status.js", "status.js"),
]);
const iconSource = resolve(repositoryRoot, "site/assets/ia2-mark-512.png");
const icons = new Map(await Promise.all(iconSizes.map(async (size) => [
  size,
  await sharp(iconSource).resize(size, size).png().toBuffer(),
])));
const mutedIcons = new Map(await Promise.all(iconSizes.map(async (size) => [
  size,
  await sharp(iconSource).resize(size, size).grayscale().png().toBuffer(),
])));

for (const target of targets) {
  const targetRoot = resolve(distRoot, target);
  await mkdir(resolve(targetRoot, "icons"), { recursive: true });
  await Promise.all([
    writeFile(resolve(targetRoot, "background.js"), background),
    writeFile(resolve(targetRoot, "content.js"), content),
    writeFile(resolve(targetRoot, "status.js"), status),
    writeFile(resolve(targetRoot, "manifest.json"), `${JSON.stringify(manifestFor(target), null, 2)}\n`),
    copyFile(resolve(repositoryRoot, "LICENSE"), resolve(targetRoot, "LICENSE")),
    ...iconSizes.map((size) => writeFile(resolve(targetRoot, `icons/ia2-mark-${size}.png`), icons.get(size))),
    ...iconSizes.map((size) => writeFile(resolve(targetRoot, `icons/ia2-mark-muted-${size}.png`), mutedIcons.get(size))),
  ]);
}

console.log(`Built IA² Navigator ${e2e ? "AE2E " : ""}extension ${packageJson.version} for ${targets.join(", ")}.`);

import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const fixture = await readFile(join(root, "fixture/index.html"));
const expected = (await readFile(join(root, "expected.tsv"), "utf8")).trimEnd();
const manifest = JSON.parse(await readFile(join(root, "manifest.json"), "utf8"));
const guide = await readFile(join(root, "../../site/guide/index.html"), "utf8");
const githubBase = "https://github.com/ia2-dev/ia2/blob/main/examples/html-rdf-libraries";
const requireAll = process.argv.includes("--require-all");
const generated = spawnSync(process.execPath, [
  join(root, "../../scripts/generate-html-rdf-binding-profile.mjs"),
  "--check",
], { encoding: "utf8" });
if (generated.status !== 0) {
  throw new Error((generated.stderr || generated.stdout).trim());
}

if (manifest.length !== 15 || new Set(manifest.map(({ id }) => id)).size !== 15) {
  throw new Error("manifest.json must describe exactly fifteen unique language examples");
}

for (const example of manifest) {
  await access(join(root, example.source));
  await access(join(root, example.run));
  const href = `${githubBase}/${example.source}`;
  if (!guide.includes(`href="${href}"`)) {
    throw new Error(`${example.label} source is not linked from the authoring guide`);
  }
  if (!guide.includes(`data-library-source="${example.source}"`)) {
    throw new Error(`${example.label} source disclosure is missing from the authoring guide`);
  }
}

const server = createServer((request, response) => {
  if (request.url !== "/fixture") {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "content-length": fixture.byteLength,
  });
  response.end(fixture);
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});

const address = server.address();
const fixtureUrl = `http://127.0.0.1:${address.port}/fixture`;
let passed = 0;
let skipped = 0;

try {
  for (const example of manifest) {
    const run = join(root, example.run);
    const probe = spawnSync(run, ["--probe"], { cwd: root, encoding: "utf8" });
    if (probe.status !== 0) {
      if (requireAll) {
        throw new Error(`${example.label} is unavailable: ${(probe.stderr || probe.stdout).trim()}`);
      }
      console.log(`SKIP ${example.label}: ${(probe.stderr || probe.stdout).trim()}`);
      skipped += 1;
      continue;
    }

    const output = await new Promise((resolve, reject) => {
      const child = spawn(run, [fixtureUrl], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
      let stdout = "";
      let stderr = "";
      child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
      child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; });
      child.once("error", reject);
      child.once("exit", (code) => {
        if (code === 0) resolve(stdout.trimEnd());
        else reject(new Error(`${example.label} exited ${code}: ${stderr.trim()}`));
      });
    });

    if (output !== expected) {
      throw new Error(`${example.label} did not produce expected.tsv\n--- expected\n${expected}\n--- actual\n${output}`);
    }
    console.log(`PASS ${example.label}`);
    passed += 1;
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

console.log(`HTML/RDF library examples: ${passed} passed, ${skipped} unavailable`);

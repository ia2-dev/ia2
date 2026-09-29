import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const fixture = await readFile(join(root, "fixture/index.html"));
const expected = (await readFile(join(root, "expected.tsv"), "utf8")).trimEnd();
const manifest = JSON.parse(await readFile(join(root, "manifest.json"), "utf8"));
const generated = spawnSync(process.execPath, [
  join(root, "../../scripts/generate-html-rdf-binding-profile.mjs"),
  "--check",
], { encoding: "utf8" });
if (generated.status !== 0) {
  throw new Error((generated.stderr || generated.stdout).trim());
}

function execute(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
    child.stderr.setEncoding("utf8").on("data", (chunk) => { stderr += chunk; process.stderr.write(chunk); });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve(stdout.trimEnd()) : reject(new Error(`${command} exited ${code}\n${stderr}`)));
  });
}

const server = createServer((request, response) => {
  if (request.url !== "/fixture") return response.writeHead(404).end();
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(fixture);
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "0.0.0.0", resolve); });
const fixtureUrl = `http://host.docker.internal:${server.address().port}/fixture`;

let suites = [
  { id: "javascript-typescript", label: "JavaScript / TypeScript", image: "node:24", command: `npm ci --silent && node extract.mjs "${fixtureUrl}"` },
  { id: "python", label: "Python", image: "python:3.13", command: `python -m pip install --quiet --disable-pip-version-check --root-user-action=ignore -r requirements.txt && python extract.py "${fixtureUrl}"` },
  { id: "java", label: "Java", image: "maven:3.9-eclipse-temurin-21", command: `mvn -q compile exec:java -Dexec.args="${fixtureUrl}"` },
  { id: "kotlin", label: "Kotlin", image: "gradle:8.14-jdk21", command: `gradle --no-daemon -q run --args="${fixtureUrl}"` },
  { id: "scala", label: "Scala", image: "virtuslab/scala-cli:latest", entrypoint: "/bin/sh", command: `scala-cli run Extract.scala CarrierProfile.scala --quiet --java-opt -Dfile.encoding=UTF-8 -- "${fixtureUrl}"` },
  { id: "csharp", label: "C# / .NET", image: "mcr.microsoft.com/dotnet/sdk:8.0", command: `dotnet run -- "${fixtureUrl}"` },
  { id: "go", label: "Go", image: "golang:1.24", command: `/usr/local/go/bin/go run . "${fixtureUrl}"` },
  { id: "rust", label: "Rust", image: "rust:1.88", command: `/usr/local/cargo/bin/cargo run --quiet -- "${fixtureUrl}"` },
  { id: "php", label: "PHP 8.4+", image: "ia2-html-rdf-php", command: `composer install --quiet --no-interaction && php extract.php "${fixtureUrl}"` },
  { id: "ruby", label: "Ruby", image: "ruby:3.4", command: `gem install bundler -v 4.0.3 --no-document >/dev/null && bundle config set path vendor/bundle >/dev/null && bundle install --quiet && bundle exec ruby extract.rb "${fixtureUrl}"` },
  { id: "swift", label: "Swift", image: "swift:6.1", command: `swift run --scratch-path /tmp/html-rdf-swift-build --disable-sandbox --quiet HtmlRdfExample "${fixtureUrl}"` },
  { id: "dart", label: "Dart", image: "dart:stable", entrypoint: "/bin/sh", command: `/usr/lib/dart/bin/dart pub get >/dev/null && /usr/lib/dart/bin/dart run bin/extract.dart "${fixtureUrl}"` },
  { id: "c", label: "C", image: "ia2-html-rdf-lexbor", command: `cmake -S . -B .build >/dev/null && cmake --build .build >/dev/null && .build/html-rdf-c "${fixtureUrl}"` },
  { id: "cpp", label: "C++", image: "ia2-html-rdf-lexbor", command: `cmake -S . -B .build >/dev/null && cmake --build .build >/dev/null && .build/html-rdf-cpp "${fixtureUrl}"` },
  { id: "elixir", label: "Elixir", image: "elixir:1.18", command: `mix local.hex --force >/dev/null && mix deps.get >/dev/null && mix compile >/dev/null && mix run --no-compile -e 'HtmlRdfExample.main(System.argv())' -- "${fixtureUrl}"` },
];

const manifestIds = manifest.map(({ id }) => id).sort();
const suiteIds = suites.map(({ id }) => id).sort();
if (JSON.stringify(suiteIds) !== JSON.stringify(manifestIds)) {
  throw new Error("Container suites must cover every manifest entry exactly once");
}

if (process.env.HTML_RDF_ONLY) {
  suites = suites.filter(({ id }) => id === process.env.HTML_RDF_ONLY);
  if (suites.length !== 1) throw new Error(`Unknown HTML_RDF_ONLY value: ${process.env.HTML_RDF_ONLY}`);
}
if (process.env.HTML_RDF_FROM) {
  const start = suites.findIndex(({ id }) => id === process.env.HTML_RDF_FROM);
  if (start < 0) throw new Error(`Unknown HTML_RDF_FROM value: ${process.env.HTML_RDF_FROM}`);
  suites = suites.slice(start);
}

try {
  if (suites.some(({ id }) => id === "php")) {
    await execute("docker", ["build", "-q", "-f", join(root, "containers/php.Dockerfile"), "-t", "ia2-html-rdf-php", root]);
  }
  if (suites.some(({ id }) => id === "c" || id === "cpp")) {
    await execute("docker", ["build", "-q", "-f", join(root, "containers/lexbor.Dockerfile"), "-t", "ia2-html-rdf-lexbor", root]);
  }
  for (const suite of suites) {
    const invocation = [
      "run", "--rm", "--add-host=host.docker.internal:host-gateway",
      "-e", "LANG=C.UTF-8", "-e", "LC_ALL=C.UTF-8",
      "-v", `${root}:/suite`, "-w", `/suite/${suite.id}`,
      ...(suite.entrypoint ? ["--entrypoint", suite.entrypoint] : []),
      suite.image,
      ...(suite.entrypoint ? ["-lc", suite.command] : ["/bin/sh", "-lc", suite.command]),
    ];
    const output = await execute("docker", invocation);
    if (output !== expected) throw new Error(`${suite.label} did not produce expected.tsv\n--- expected\n${expected}\n--- actual\n${output}`);
    console.log(`PASS ${suite.label}`);
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

function usage() {
  return "Usage: node byte-commitment.mjs [--base64] <file> [file ...]";
}

const argumentsList = process.argv.slice(2);
const includeBase64 = argumentsList.includes("--base64");
const unknownOptions = argumentsList.filter(
  (argument) => argument.startsWith("-") && argument !== "--base64",
);
const paths = argumentsList.filter((argument) => !argument.startsWith("-"));

if (unknownOptions.length > 0 || paths.length === 0) {
  if (unknownOptions.length > 0) {
    console.error(`Unknown option: ${unknownOptions[0]}`);
  }
  console.error(usage());
  process.exitCode = 2;
} else {
  const commitments = [];

  for (const inputPath of paths) {
    const bytes = await readFile(inputPath);
    const digest = createHash("sha256").update(bytes).digest("base64");
    const commitment = {
      path: resolve(inputPath),
      byteLength: bytes.byteLength,
      digestSRI: `sha256-${digest}`,
    };

    if (includeBase64) {
      commitment.base64 = bytes.toString("base64");
    }

    commitments.push(commitment);
  }

  console.log(JSON.stringify(commitments, null, 2));
}

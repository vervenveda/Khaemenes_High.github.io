import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const courseRoot = resolve(here, "..");
const manifestPath = resolve(here, "component-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

function gitBlobSha(bytes) {
  return createHash("sha1")
    .update(Buffer.from(`blob ${bytes.length}\0`))
    .update(bytes)
    .digest("hex");
}

let failures = 0;
for (const component of manifest.components || []) {
  const absolute = resolve(courseRoot, component.path);
  try {
    const bytes = await readFile(absolute);
    const actual = gitBlobSha(bytes);
    if (actual !== component.sha) {
      failures += 1;
      console.error(`MISMATCH ${component.path}\n  expected ${component.sha}\n  actual   ${actual}`);
    } else {
      console.log(`OK ${component.path} ${actual}`);
    }
  } catch (error) {
    failures += 1;
    console.error(`MISSING ${component.path}: ${error.message}`);
  }
}

if (failures) {
  console.error(`\nPre-Algebra component validation failed: ${failures} problem(s).`);
  process.exit(1);
}

console.log(`\nPre-Algebra component validation passed for ${(manifest.components || []).length} files.`);

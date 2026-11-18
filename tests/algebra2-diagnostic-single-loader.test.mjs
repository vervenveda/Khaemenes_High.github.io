import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("Algebra II diagnostic has exactly one readiness gate script", () => {
  const html = read("courses/mathematics/algebra-2/diagnostic/index.html");
  const gateScripts = [...html.matchAll(/<script\b[^>]*\bsrc=["'][^"']*\bmath-entry-gate\.js(?:\?[^"']*)?["'][^>]*>\s*<\/script>/gi)];
  assert.equal(gateScripts.length, 1, "duplicate math-entry-gate loaders can create duplicate readiness intervals");
  assert.match(html, /mathEntry\s*:\s*["']diagnostic["']/);
  assert.match(html, /mathCourseId\s*:\s*["']math-algebra2["']/);
  assert.match(html, /\.\.\/assets\/assessment-engine\.js/);
});

test("readiness gate remains a protected diagnostic integration", () => {
  const gate = read("courses/shared/math-entry-gate.js");
  assert.match(gate, /publishReadiness/);
  assert.match(gate, /entryMode\s*===\s*["']diagnostic["']/);
  assert.match(gate, /readinessKey/);
});

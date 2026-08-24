import fs from "node:fs";
import assert from "node:assert/strict";

const legacy=fs.readFileSync("grades/grade-10/algebra-1/index.html","utf8");
const course=fs.readFileSync("courses/mathematics/algebra-1/index.html","utf8");
const diagnostic=fs.readFileSync("courses/mathematics/algebra-1/diagnostic/index.html","utf8");

assert.match(legacy,/Algebra I is placement-based\./);
assert.match(legacy,/Begin Readiness Assessment/);
assert.match(legacy,/courses\/mathematics\/algebra-1\/diagnostic\//);
assert.match(legacy,/courses\/mathematics\/algebra-1\//);
assert.doesNotMatch(legacy,/Grade 10 Mathematics/i);
assert.doesNotMatch(legacy,/tenth-grade mathematics/i);

assert.match(course,/Placement-Based/i);
assert.match(course,/open by readiness, not age/i);
assert.match(course,/Begin Week 1 Readiness/);
assert.match(course,/diagnostic\//);
assert.match(diagnostic,/Algebra I/i);

console.log("PASS: Algebra I has one grade-neutral canonical course entrance and preserves the readiness assessment as the first-time learner doorway.");

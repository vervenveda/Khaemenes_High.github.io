import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const course = resolve(here, "..");
const read = path => readFileSync(resolve(course, path), "utf8");

test("course map states the real build boundary and Eiren authority", () => {
  const map = JSON.parse(read("course-map.json"));
  assert.equal(map.course.mapping_status, "units-01-02-complete-units-03-12-mapped");
  assert.equal(map.course.mentor.public_name, "Eiren");
  assert.equal(map.course.mentor.authority.awards_mastery, false);
  assert.equal(map.course.mentor.authority.changes_grades, false);
  assert.equal(map.course.mentor.authority.changes_placement, false);
});

test("Unit 1 and Unit 2 use the same 80 percent mastery authority", () => {
  for (const unit of ["01", "02"]) {
    const page = read(`units/unit-${unit}/coursebook.html`);
    assert.match(page, new RegExp(`data-mastery-unit=["']unit-${unit}["']`));
    assert.match(page, /data-mastery-threshold=["']80["']/);
    assert.match(page, /assets\/mastery-engine\.js/);
  }
});

test("attempt history preserves the A+++ evidence fields and best score", () => {
  const engine = read("assets/mastery-engine.js");
  for (const field of ["firstScore", "latestScore", "bestScore", "attemptCount", "masteredAt", "updatedAt"]) {
    assert.match(engine, new RegExp(`\\b${field}\\b`));
  }
  assert.match(engine, /Math\.max\(Number\(prior\.bestScore\), score\)/);
  assert.match(engine, /delete unit\.completedLessons/);
});

test("page review cannot impersonate mastery or open unfinished coursebooks", () => {
  const shell = read("assets/course.js");
  assert.match(shell, /review is not mastery/);
  assert.match(shell, /Instructional Build Pending/);
  assert.match(shell, /new Set\(\["unit-01","unit-02"\]\)/);
  assert.doesNotMatch(shell, /Mark Complete/);
});

test("public mentor is Eiren and disclaims grading authority", () => {
  const mentor = read("mentor.html");
  assert.match(mentor, /Eiren/);
  assert.match(mentor, /cannot award mastery/i);
  assert.match(mentor, /cannot (?:award mastery or )?change a grade/i);
  assert.doesNotMatch(mentor, /Archaemenes/);
});

test("legacy portal loads the evidence reconciler and labels activity as non-authoritative", () => {
  const portal = read("index.html");
  assert.match(portal, /assets\/evidence-reconciler\.js/);
  assert.match(portal, /Canonical coursebook evidence determines mastery/);
  assert.match(portal, /legacy activities reviewed/i);
  assert.doesNotMatch(portal, /Course grade to date/);
});

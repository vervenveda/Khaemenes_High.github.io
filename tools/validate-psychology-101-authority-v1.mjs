#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";

const ownership=JSON.parse(fs.readFileSync("courses/shared/high-school-course-ownership-manifest-v1.json","utf8"));
const release=JSON.parse(fs.readFileSync("courses/shared/high-school-release-certification-v1.json","utf8"));
const map=JSON.parse(fs.readFileSync("electives/grades/grade-09/psych-101/course-map.json","utf8"));
const validation=JSON.parse(fs.readFileSync("electives/grades/grade-09/psych-101/VALIDATION_REPORT.json","utf8"));
const gateway=fs.readFileSync("courses/electives/psychology-101/index.html","utf8");

const owner=ownership.courses.find(x=>x.id==="psychology-101");
assert(owner,"Psychology 101 missing ownership record");
assert.equal(owner.canonicalEntry,"courses/electives/psychology-101/index.html");
assert.equal(owner.contentRoot,"electives/grades/grade-09/psych-101/");
assert.equal(owner.classification,"active-course-compatibility-content-root");
assert.equal(owner.authority,"course-specific");
assert.equal(map.canonicalGateway,owner.canonicalEntry);
assert.equal(map.contentRoot,owner.contentRoot);
assert.equal(map.status,"active-course");
assert.equal(map.weeks,13);
assert.equal(map.lessons,65);
assert.equal(map.masteryThreshold,80);
assert.equal(validation.lessonCount,65);
assert.equal(validation.weeklyAssessments,13);
assert.equal(validation.cumulativeAssessments,3);
assert.equal(validation.result,"PASS");
assert.equal(validation.failures.length,0);
assert(gateway.includes('../../../electives/grades/grade-09/psych-101/'),"Gateway lost canonical production-course route");
assert(!gateway.includes('data-lesson-id='),"Gateway must remain a doorway, not a duplicate lesson engine");
const releaseRow=release.courses.find(x=>x.id==="psychology-101");
assert(releaseRow,"Psychology 101 missing release row");
assert.equal(releaseRow.curriculum,"pass-static-contract");
console.log("PASS: Psychology 101 has one gateway, one production content root, 65 certified lessons, and no duplicate course authority.");

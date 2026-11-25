#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";
const p="courses/electives/plans/critical-thinking-course-map-v1.json";
const c=JSON.parse(fs.readFileSync(p,"utf8"));
assert.equal(c.schema,"khaemenes-high-school-elective-course-map-v1");
assert.equal(c.id,"critical-thinking");
assert.equal(c.durationWeeks,13);
assert.equal(c.plannedLessons,65);
assert.equal(c.masteryThreshold,80);
assert.equal(c.status,"curriculum-architecture-complete-student-production-pending");
assert.equal(c.authority,"catalog-plan-until-promotion-gate-passes");
assert.equal(c.weeks.length,13);
assert.deepEqual(c.weeks.filter(w=>w.cumulativeCheckpoint).map(w=>w.week),[4,8,12]);
assert.equal(c.weeks.filter(w=>w.culminating).length,1);
for(const w of c.weeks){
 assert.equal(w.days.length,5,`Week ${w.week} must have five planned days`);
 assert.equal(w.masteryCheck.threshold,80);
 assert(typeof w.weeklyEvidence==="string"&&w.weeklyEvidence.length>12);
}
assert.equal(fs.existsSync("courses/electives/critical-thinking/index.html"),false,"Architecture-only plan must not create a live route");
console.log("PASS: Critical Thinking has a 13-week/65-lesson architecture, three cumulative checkpoints, a culminating defense, and no false live route.");

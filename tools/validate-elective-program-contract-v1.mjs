#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";

const p="courses/electives/elective-program-contract-v1.json";
const c=JSON.parse(fs.readFileSync(p,"utf8"));
assert.equal(c.schema,"khaemenes-high-school-elective-program-contract-v1");
assert.equal(c.academicYear.instructionalWeeks,36);
assert.equal(c.academicYear.flexibleCompletionWindowWeeks,42);
assert.equal(c.academicYear.standardRequiredClassLoad,6);
assert.equal(c.academicYear.maximumActiveClassLoad,8);
assert(c.academicYear.maximumActiveClassLoad>=c.academicYear.standardRequiredClassLoad);
assert.equal(c.electives.standardDurationWeeks,13);
assert.equal(c.electives.standardLessons,65);
assert.equal(c.electives.standardDaysPerWeek,5);
assert.equal(c.electives.standardDurationWeeks*c.electives.standardDaysPerWeek,c.electives.standardLessons);
assert.equal(c.electives.masteryFloorPercent,80);
assert.equal(c.electives.sequentialBlocksWithinFlexibleWindow,3);
assert(c.electives.standardDurationWeeks*c.electives.sequentialBlocksWithinFlexibleWindow<=c.academicYear.flexibleCompletionWindowWeeks);
assert.equal(c.electives.summer.available,true);
assert.equal(c.electives.summer.academyNumericalCap,null);
for(const family of c.plannedFamilies){
  assert.equal(typeof family.id,"string");
  assert.equal(typeof family.title,"string");
  assert.equal(typeof family.intent,"string");
  if(family.status==="planned-no-route"){
    const route=`courses/electives/${family.id}/index.html`;
    assert.equal(fs.existsSync(route),false,route+" must not exist before production architecture is intentionally created");
  }
}
for(const id of c.current.productionCompleteRuntimePending){
  assert(!c.current.active.includes(id),id+" cannot be active before runtime promotion");
}
console.log("PASS: elective program contract preserves 36/42-week pacing, 6–8 class load, 13-week compact electives, summer flexibility, and fail-closed planned families.");

#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";

const contract=JSON.parse(fs.readFileSync("courses/electives/elective-program-contract-v2.json","utf8"));
assert.equal(contract.schema,"khaemenes-high-school-elective-program-contract-v2");

const planned=new Map(contract.plannedFamilies.map(x=>[x.id,x]));
for(const id of ["critical-thinking","writing-studio","life-skills","trades"]){
  assert(planned.has(id),id+" must remain registered in the elective program contract");
  assert.equal(planned.get(id).status,"planned-no-route",id+" must remain fail-closed before production");
}

const architecture={
  "critical-thinking":{
    map:"courses/electives/plans/critical-thinking-course-map-v1.json",
    blueprint:"courses/electives/plans/CRITICAL_THINKING_BLUEPRINT_V1.md",
    live:"courses/electives/critical-thinking/index.html"
  },
  "writing-studio":{
    map:"courses/electives/plans/writing-studio-course-map-v1.json",
    blueprint:"courses/electives/plans/WRITING_STUDIO_BLUEPRINT_V1.md",
    live:"courses/electives/writing-studio/index.html"
  }
};
for(const [id,p] of Object.entries(architecture)){
  assert(fs.existsSync(p.map),id+" course map missing");
  assert(fs.existsSync(p.blueprint),id+" blueprint missing");
  assert.equal(fs.existsSync(p.live),false,id+" must not acquire a live route before production promotion");
  const map=JSON.parse(fs.readFileSync(p.map,"utf8"));
  assert.equal(map.id,id);
  assert.equal(map.durationWeeks,13);
  assert.equal(map.plannedLessons,65);
  assert.equal(map.masteryThreshold,80);
  assert.equal(map.status,"curriculum-architecture-complete-student-production-pending");
  assert.equal(map.authority,"catalog-plan-until-promotion-gate-passes");
}

for(const id of ["life-skills","trades"]){
  assert.equal(fs.existsSync("courses/electives/"+id+"/index.html"),false,id+" must remain route-free until architecture/production is intentionally created");
}

const required=new Set(contract.classification.requiredCompactCourses||[]);
assert(required.has("psychology-101"),"Psychology 101 required-course classification drifted");
assert(!(contract.classification.activeOrEstablishedElectives||[]).includes("psychology-101"),"Psychology 101 must not drift into elective-choice authority");

console.log("PASS: planned elective inventory is complete, 13-week architectures remain intact, and unproduced families stay fail-closed.");

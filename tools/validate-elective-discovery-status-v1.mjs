#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";

const html=fs.readFileSync("courses/electives/index.html","utf8");
const js=fs.readFileSync("courses/electives/discovery-hall.js","utf8");
const release=JSON.parse(fs.readFileSync("courses/shared/high-school-release-certification-v1.json","utf8"));

const expected={
 "fine-arts-visual-studio":"planned",
 "music-music-theory":"planned",
 "computing-digital-technology":"planned",
 "world-languages-linguistics":"federated",
 "career-professional-studies":"runtime-pending",
 "health-wellness-human-development":"planned",
 "psychology-101":"live"
};
for(const [id,status] of Object.entries(expected)){
 assert(html.includes(`data-course-id="${id}" data-course-status="${status}"`),`${id} Discovery Hall status drifted`);
}
assert(html.includes('data-course-id="personal-finance" data-course-status="live"'));
assert(html.includes('data-course-id="physical-education" data-course-status="live"'));
assert(!js.includes("/view course plan/i"),"Availability must not be inferred from visible button wording");
assert(js.includes("card.dataset.courseStatus"),"Discovery filter must use explicit status metadata");

const catalog=new Map((release.catalogAndFederatedSurfaces||[]).map(x=>[x.id,x]));
for(const id of ["fine-arts-visual-studio","music-music-theory","computing-digital-technology","health-wellness-human-development"]){
 assert.equal(catalog.get(id)?.classification,"catalog-plan",id+" release classification drifted");
 assert.equal(catalog.get(id)?.authority,"none",id+" must not have course authority while planned");
}
assert.equal(catalog.get("career-professional-studies")?.runtimeCertification,"pending");
assert.equal(catalog.get("career-professional-studies")?.authority,"none-until-promotion");
assert.equal(catalog.get("world-languages-linguistics")?.classification,"catalog-plan-federated");
assert.equal(catalog.get("world-languages-linguistics")?.authority,"federated");
const psychology=release.courses.find(x=>x.id==="psychology-101");
assert.equal(psychology?.releaseState,"curriculum-pass");
console.log("PASS: Discovery Hall availability is explicit, fail-closed, and aligned to release authority.");

#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";

const html=fs.readFileSync("courses/electives/index.html","utf8");
const js=fs.readFileSync("courses/electives/discovery-hall.js","utf8");
const release=JSON.parse(fs.readFileSync("courses/shared/high-school-release-certification-v1.json","utf8"));

const expected={
 "art-101":"live-source",
 "art-201":"planned",
 "music-music-theory":"planned",
 "computing-digital-technology":"planned",
 "world-languages-linguistics":"federated",
 "personal-finance":"extended",
 "career-professional-studies":"runtime-pending",
 "health-wellness-human-development":"planned",
 "physical-education":"required",
 "psychology-101":"required"
};
for(const [id,status] of Object.entries(expected)){
 assert(html.includes(`data-course-id="${id}" data-course-status="${status}"`),`${id} Discovery Hall status drifted`);
}
assert(!js.includes("/view course plan/i"),"Availability must not be inferred from visible button wording");
assert(js.includes("card.dataset.courseStatus"),"Discovery filter must use explicit status metadata");

const catalog=new Map((release.catalogAndFederatedSurfaces||[]).map(x=>[x.id,x]));
assert.equal(catalog.get("art-101")?.classification,"live-source-course");
assert.equal(catalog.get("art-101")?.authority,"high-school-elective-doorway-with-bazaar-source");
assert.equal(catalog.get("art-201")?.classification,"catalog-plan");
assert.equal(catalog.get("art-201")?.authority,"none");
for(const id of ["music-music-theory","computing-digital-technology","health-wellness-human-development"]){
 assert.equal(catalog.get(id)?.classification,"catalog-plan",id+" release classification drifted");
 assert.equal(catalog.get(id)?.authority,"none",id+" must not have course authority while planned");
}
assert.equal(catalog.get("career-professional-studies")?.runtimeCertification,"pending");
assert.equal(catalog.get("world-languages-linguistics")?.authority,"federated");
const psychology=release.courses.find(x=>x.id==="psychology-101");
assert.equal(psychology?.releaseState,"curriculum-pass");
console.log("PASS: Discovery Hall status is explicit, Art 101/201 aware, and required-course crosslinks are not misrepresented as elective choice.");

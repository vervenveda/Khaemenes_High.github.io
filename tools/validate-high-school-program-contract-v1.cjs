#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const program=JSON.parse(read("courses/shared/high-school-program-contract-v1.json"));
const registry=JSON.parse(read("courses/shared/high-school-learning-registry.json"));
const ownership=JSON.parse(read("courses/shared/high-school-course-ownership-manifest-v1.json"));
const release=JSON.parse(read("courses/shared/high-school-release-certification-v1.json"));
const federation=JSON.parse(read("courses/shared/high-school-federated-return-record-v1.json"));
const runtime=JSON.parse(read("courses/shared/high-school-runtime-certification-matrix-v1.json"));
const languages=JSON.parse(read("courses/shared/high-school-world-languages-federation-v1.json"));

assert.equal(program.schema,"khaemenes-high-school-program-contract-v1");
assert.equal(program.masteryFloorPercent,80);
assert.deepEqual(program.authority.independentSubjectEngines,["language-arts","mathematics","science","social-studies"]);
assert(program.authority.sharedProgramLayerDoesNotOwn.includes("subject-mastery-decisions"));
assert.equal(program.pathwaySlots.length,8,"High School pathway must preserve eight program slots");
for(const id of ["mathematics","english","social-studies","science","pe-health","psychology-life-skills","world-language","elective"]){
  assert(program.pathwaySlots.some(x=>x.id===id),"Program slot missing "+id);
}
const wl=program.pathwaySlots.find(x=>x.id==="world-language");
assert.equal(wl.requirementYears,2);
assert.equal(wl.continuationYearsSupported,4);
assert.equal(program.graduation.seniorCapstone.required,true);
assert.equal(program.graduation.seniorCapstone.grade,12);
assert.equal(program.graduation.routePresenceNeverEqualsCompletion,true);

for(const p of Object.values(program.canonical)) assert(exists(p),"Missing canonical High School program artifact: "+p);
const progression=read(program.canonical.progression);
for(const token of ["Grade 9","Grade 10","Grade 11","Grade 12","Senior Capstone role","Higher Learning transition"]) assert(progression.includes(token),"Whole-student progression missing "+token);

assert.equal(registry.programContract,"courses/shared/high-school-program-contract-v1.json");
assert.equal(registry.courses.length,22,"Expected 22 locally owned High School learning authorities");
for(const id of ["physical-education-9","physical-education-10","physical-education-11","physical-education-12","psychology-101","senior-capstone"]){
  assert(registry.courses.some(x=>x.id===id),"Learning registry missing "+id);
}
assert.equal(registry.formativeLessonEvidence.totalSurfaces,1482,"Academic formative evidence census changed unexpectedly");
assert.deepEqual(registry.formativeLessonEvidence.registeredNonBridgeAuthorities,["physical-education","psychology-life-skills","capstone"]);

assert.equal(federation.schema,"khaemenes-high-school-federated-return-record-v1");
assert.equal(federation.safeguards.noAutomaticTranscriptCreditUntilValidated,true);
assert.equal(federation.safeguards.learnerMismatchFailClosed,true);
assert(federation.consumers.some(x=>x.id==="world-languages"));
assert(federation.consumers.some(x=>x.id==="precalculus-trigonometry"));
assert(federation.consumers.some(x=>x.id==="calculus-1"));
assert.equal(languages.recordBoundary.highSchoolTranscriptReturn,"pending-audited-record-bridge");

assert.equal(runtime.schema,"khaemenes-high-school-runtime-certification-matrix-v1");
for(const cls of ["english","mathematics","science","social-studies","physical-education","psychology","capstone"]) assert(runtime.classes.some(x=>x.id===cls),"Runtime matrix missing "+cls);
assert.equal(runtime.policy.sourceOrCurriculumPassCannotImplyRuntimePass,true);
assert(runtime.representativeAcceptance.device.includes("tablet landscape"));
assert(runtime.representativeAcceptance.interaction.includes("assessment resume/recovery"));

for(const row of runtime.classes){
  for(const id of row.courses){
    const cert=release.courses.find(x=>x.id===id);
    assert(cert,"Runtime matrix course missing from release certification: "+id);
    if(cert.releaseState==="release-certified"){
      assert.equal(row.browserRuntime,"pass",id+" release-certified without class browser PASS");
      assert.equal(row.deviceAcceptance,"pass",id+" release-certified without class device PASS");
      assert.equal(row.offlineAcceptance,"pass",id+" release-certified without class offline PASS");
    }
  }
}

const ownershipIds=new Set(ownership.courses.filter(x=>x.classification==="active-course"||x.classification==="active-course-compatibility-content-root").map(x=>x.id));
for(const id of ["physical-education-9","physical-education-10","physical-education-11","physical-education-12","psychology-101","senior-capstone"]) assert(ownershipIds.has(id),"Ownership manifest lost "+id);

console.log("PASS High School program contract: eight-slot pathway, 22 local learning authorities, whole-student progression, federated return protocol, and runtime certification matrix are coherent.");

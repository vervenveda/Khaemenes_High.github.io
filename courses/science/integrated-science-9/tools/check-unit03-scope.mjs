import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const dir=new URL("../units/unit-03/",import.meta.url);
for(const file of ["unit03.js","quiz-app.js","assessment-app.js","circulation-app.js","feedback-app.js","lessons/assessment-app.js"]){
  const source=fs.readFileSync(new URL(file,dir),"utf8");
  new vm.Script(source,{filename:file});
  assert.ok(source.includes("KhaemenesScienceU03Scope"),file+" must use the shared Unit 03 scope contract");
  const hasScopedKey=source.includes("KhaemenesScienceU03Scope.key()") ||
    /SCOPE\?\.key\?\.\(\)/.test(source) ||
    /scienceActivityKey=window\.KhaemenesScienceU03Scope\.key\(\)/.test(source);
  assert.ok(hasScopedKey,file+" must obtain its storage key from the Unit 03 scope helper");
  if(/quiz-app\.js|assessment-app\.js|circulation-app\.js|feedback-app\.js|lessons\/assessment-app\.js/.test(file)){
    assert.ok(/unselected_v1/.test(source),file+" must use a separate unselected fallback namespace");
  }
}
const quiz=fs.readFileSync(new URL("quiz-app.js",dir),"utf8");
const assessment=fs.readFileSync(new URL("assessment-app.js",dir),"utf8");
for(const [name,source] of [["quiz-app.js",quiz],["assessment-app.js",assessment]]){
  assert.ok(source.includes("activitySnapshot"),name+" must snapshot the learner record");
  assert.ok(source.includes("MC.isActive(MC_KEY,SESSION.id)"),name+" must reject stale/completed assessment sessions");
  assert.ok(source.includes("MC.saveResponse(MC_KEY,q.id,answers[current],SESSION.id)"),name+" must persist answers through the session-aware API");
  assert.ok(source.includes("MC.complete(MC_KEY,"),name+" must close the active attempt through the shared engine");
}
const controller=fs.readFileSync(new URL("unit03.js",dir),"utf8");
assert.ok(controller.includes("recoverLegacy"),"recovery path should remain available");
assert.ok(controller.includes("kh_sci9_learner_v1:"),"root course record namespace is required");
console.log("PASS: Unit 03 syntax, scoped keys, fallback namespaces, session guards, and recovery/root contract.");

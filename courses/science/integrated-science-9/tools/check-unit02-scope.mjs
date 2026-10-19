import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const folder=new URL("../units/unit-02/",import.meta.url);
for(const name of ["unit02.js","quiz-app.js","assessment-app.js","microscopy-app.js"]){
  const source=fs.readFileSync(new URL(name,folder),"utf8");
  new vm.Script(source,{filename:name});
  assert.ok(source.includes("KhaemenesScienceU02Scope"),name+" must use the shared Unit 02 scope contract");
  const hasScopedKey=source.includes("KhaemenesScienceU02Scope.key()") ||
    /SCOPE\?\.key\?\.\(\)/.test(source) ||
    /scienceActivityKey=window\.KhaemenesScienceU02Scope\.key\(\)/.test(source);
  assert.ok(hasScopedKey,name+" must obtain its storage key from the Unit 02 scope helper");
  if(/quiz-app\.js|assessment-app\.js|microscopy-app\.js/.test(name)){
    assert.ok(/unselected_v1/.test(source),name+" must use a distinct unselected fallback namespace");
  }
}
const quiz=fs.readFileSync(new URL("quiz-app.js",folder),"utf8");
const assessment=fs.readFileSync(new URL("assessment-app.js",folder),"utf8");
for(const [name,source] of [["quiz-app.js",quiz],["assessment-app.js",assessment]]){
  assert.ok(source.includes("activitySnapshot"),name+" must snapshot the learner record");
  assert.ok(source.includes("MC.isActive(MC_KEY,SESSION.id)"),name+" must reject a stale or completed assessment session");
  assert.ok(source.includes("MC.saveResponse(MC_KEY,q.id,answers[current],SESSION.id)"),name+" must persist responses through the session-aware assessment API");
  assert.ok(source.includes("MC.complete(MC_KEY,"),name+" must close the active assessment through the shared engine");
}
console.log("PASS: Unit 02 syntax, shared learner scope, unselected namespace, response persistence, and stale-session guards.");

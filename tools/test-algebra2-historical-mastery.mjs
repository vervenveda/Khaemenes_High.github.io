import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
/* Only fictional records: no real learner, storage migration or grade mutation. */
const path="courses/mathematics/algebra-2/assets/algebra2-progression.js";
const script=fs.readFileSync(path,"utf8");
const engine=fs.readFileSync("courses/mathematics/algebra-2/assets/assessment-engine.js","utf8");
new vm.Script(script);new vm.Script(engine);
const data=new Map();
const localStorage={
 getItem:key=>data.has(key)?data.get(key):null,
 setItem:(key,val)=>data.set(key,String(val))
};
const win={},doc={body:{dataset:{}},readyState:"loading",addEventListener(){}};
vm.runInNewContext(script,{window:win,document:doc,localStorage,console},{timeout:2500});
const P=win.KhaemenesAlgebra2Progression;
assert.ok(P,"Algebra II progression adapter absent");
const is=P.recordMastered;
assert.equal(is({mastery:true}),false,"Legacy boolean without a numeric grade cannot award mastery");
assert.equal(is({bestScore:80}),true,"Legacy numeric summary-only passing grade remains recognized");
assert.equal(is({score:80}),true,"Legacy numeric score-only pass remains recognized");
assert.equal(is({bestScore:79,mastery:true}),false,"79% plus boolean pass cannot award mastery");
assert.equal(is({bestScore:99,attempts:[{score:79,mastery:true}]}),false,
 "A stale bestScore or boolean cannot override failed historical attempt evidence");
assert.equal(is({bestScore:75,attempts:[{score:80},{score:79}]}),true,
 "A genuine earlier pass survives a later failed retake");
assert.equal(is({attempts:[{score:79},{score:80}]}),true,"A new passing retake can unlock");
assert.equal(is({attempts:[{score:79,mastery_met:true}]}),false,"Misleading attempt flag cannot confer mastery");
for(const bad of [null,false,true,"",{},[],{bestScore:"Infinity"},{bestScore:101},
 {bestScore:-1},{attempts:[{score:"not-a-number",mastery:true}]},
 {attempts:[{score:999,mastery:true}]}]){
 assert.equal(is(bad),false,"Invalid or unscored historical record must stay locked: "+JSON.stringify(bad));
}
const key="khaemenes-algebra2-assessment-records-v1";
data.set(key,JSON.stringify({
 "readiness-diagnostic":{bestScore:95,attempts:[{score:79,mastery:true}]},
 "unit-01-mastery":{attempts:[{score:95}]}
}));
assert.equal(P.readinessRecorded(),false,"Conflicting diagnostic grade must not bypass 80%");
assert.equal(P.unitUnlocked(1),false,"Unit 01 gated by verified readiness");
data.set(key,JSON.stringify({"readiness-diagnostic":{attempts:[{score:80}]},
 "unit-01-mastery":{attempts:[{score:79,mastery:true}]} }));
assert.equal(P.unitUnlocked(1),true,"Passing readiness unlocks the first unit");
assert.equal(P.unitUnlocked(2),false,"Contradictory previous unit record does not unlock Unit 02");
data.set(key,JSON.stringify({"readiness-diagnostic":{attempts:[{score:80}]},
 "unit-01-mastery":{attempts:[{score:90},{score:70}]} }));
assert.equal(P.unitUnlocked(2),true,"Valid historical passing unit score survives a failed later retake");
win.KhaemenesCourseEntryContract={readAcademyProfile:()=>null};
assert.equal(P.readinessRecorded(),false,"Absent Academy profile must not consume anonymous legacy grades");
assert.equal(P.writeJSON("test",{success:true}),false,"No writes without Academy learner identity");
assert.equal(data.has("test"),false,"No anonymous assessment write occurred");
assert.match(engine,/answer_locked:\s*true/);
assert.match(engine,/question_ids:\s*set\.map/);
assert.match(engine,/attempt_id:/);
assert.match(engine,/if \(!save\(data\)\)/);
assert.match(engine,/submitted = true;[\s\S]*?radio\.disabled = true/);
assert.match(engine,/Start a new attempt\?/);
console.log("PASS Algebra II historical mastery & retake: numeric evidence over boolean flags, failed attempts cannot fake passing, real legacy passes preserved, no anonymous authority, locked attempts and save-error fail closed.");

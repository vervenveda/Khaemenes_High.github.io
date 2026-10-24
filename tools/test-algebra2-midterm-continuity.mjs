import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

/* Read-only fictional learner progression. No real account or grades touched. */
const source=fs.readFileSync("courses/mathematics/algebra-2/assets/algebra2-progression.js","utf8");
const records={
 "readiness-diagnostic":{bestScore:90,attempts:[{score:90}]},
 "unit-06-mastery":{bestScore:88,mastery:true},
 "unit-07-mastery":{bestScore:86,mastery:true},
 "unit-12-mastery":{bestScore:83,mastery:true}
};
const backing=new Map([["khaemenes-algebra2-assessment-records-v1",JSON.stringify(records)]]);
const localStorage={getItem:key=>backing.get(key)||null,setItem:(key,val)=>backing.set(key,String(val))};
const window={};
const document={body:{dataset:{}},readyState:"loading",addEventListener(){}};
vm.runInNewContext(source,{window,document,localStorage,console},{timeout:2500});
const P=window.KhaemenesAlgebra2Progression;
assert.ok(P,"Algebra II progression authority missing");
function setMidterm(score){
 if(score===null)delete records.midterm;
 else records.midterm={bestScore:score,mastery:score>=80,attempts:[{score}]};
 backing.set("khaemenes-algebra2-assessment-records-v1",JSON.stringify(records));
}
for(const score of [null,0,79]){
 setMidterm(score);
 assert.equal(P.unitUnlocked(7),false,"Unit 07 without a passing midterm should be locked");
 assert.equal(P.unitUnlocked(8),false,"Unit 08 without passing midterm should be locked");
 assert.equal(P.unitUnlocked(13),false,"Unit 13 without passing midterm should be locked");
 assert.ok(P.missingFor({recordKey:"u07-mastery"}).some(x=>x.includes("midterm")),"Unit 07 assessment missing midterm prerequisite");
 assert.ok(P.missingFor({recordKey:"u08-mastery"}).some(x=>x.includes("midterm")),"Unit 08 assessment missing midterm prerequisite");
 assert.ok(P.missingFor({recordKey:"u13-mastery"}).some(x=>x.includes("midterm")),"Unit 13 assessment missing midterm prerequisite");
}
setMidterm(80);
for(const n of [7,8,13]){
 assert.equal(P.unitUnlocked(n),true,"Passing 80% should release prerequisite midterm for Unit "+n);
 assert.ok(!P.missingFor({recordKey:"u"+String(n).padStart(2,"0")+"-mastery"}).some(x=>x.includes("midterm")),"Passing midterm still reported missing");
}
assert.equal(P.lessonUnlocked(8,1),true,"Unit 08 first lesson should be available with prior mastery");
records["unit-07-mastery"].bestScore=79;records["unit-07-mastery"].mastery=false;
records["unit-07-mastery"].attempts=[{score:79}];
backing.set("khaemenes-algebra2-assessment-records-v1",JSON.stringify(records));
assert.equal(P.unitUnlocked(8),false,"Prior unit at 79% cannot unlock Unit 08");
console.log("PASS Algebra II fictional learner: Units 07–13 require midterm >=80, 79% fails, 80% passes, prior-unit mastery still enforced.");

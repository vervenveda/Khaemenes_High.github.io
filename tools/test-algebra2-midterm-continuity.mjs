import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

/* Read-only fictional learner progression. No real account or grades touched. */
const source=fs.readFileSync("courses/mathematics/algebra-2/assets/algebra2-progression.js","utf8");
const records={"readiness-diagnostic":{bestScore:90,attempts:[{score:90}]}};
const lessonCounts={1:6,2:8,3:7,4:8,5:6,6:7,7:7,12:7};
const unitWeeks={1:[2,3],2:[4,5,6],3:[7,8,9],4:[10,11,12],5:[13,14],6:[15,16,17],7:[19,20,21],12:[34,35]};
const lessonRecords={},weekly={weeks:{}};
function seedUnit(unit,score=80){
 records["unit-"+String(unit).padStart(2,"0")+"-mastery"]={bestScore:score,mastery:score>=80,attempts:[{score}]};
 for(let n=1;n<=lessonCounts[unit];n++)lessonRecords["u"+String(unit).padStart(2,"0")+"-l"+String(n).padStart(2,"0")]={bestScore:score,score,mastery:score>=80,complete:score>=80,attempts:[{score}]};
 for(const week of unitWeeks[unit])weekly.weeks[week]={best:score,attempts:[{score,mastery_met:score>=80}]};
}
for(let unit=1;unit<=7;unit++)seedUnit(unit);
seedUnit(12);
const backing=new Map([
 ["khaemenes-algebra2-assessment-records-v1",JSON.stringify(records)],
 ["khaemenes-algebra2-lesson-progress-v1",JSON.stringify(lessonRecords)],
 ["khaemenes-algebra2-weekly-mastery-v1",JSON.stringify(weekly)]
]);
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
console.log("PASS Algebra II fictional learner: full first-half evidence chain plus Midterm >=80 unlocks second-half entry; 79% prior-unit mastery remains locked.");

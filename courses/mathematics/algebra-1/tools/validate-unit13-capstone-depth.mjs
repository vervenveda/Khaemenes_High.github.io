import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const base=path.resolve(import.meta.dirname,"..");
const read=rel=>fs.readFileSync(path.join(base,rel),"utf8");
const json=rel=>JSON.parse(read(rel));
const ctx={window:{}};vm.createContext(ctx);

vm.runInContext(read("course-data.js"),ctx,{filename:"course-data.js"});
vm.runInContext(read("assets/question-bank.js"),ctx,{filename:"assets/question-bank.js"});
const shared=[...ctx.window.ALGEBRA1_QUESTIONS];
vm.runInContext(read("assets/late-unit-abundant-bank-v1.js"),ctx,{filename:"assets/late-unit-abundant-bank-v1.js"});
const abundant=[...ctx.window.ALGEBRA1_LATE_ABUNDANT_QUESTIONS];
vm.runInContext(read("assets/unit13-capstone-depth-bank-v1.js"),ctx,{filename:"assets/unit13-capstone-depth-bank-v1.js"});
const depth=[...ctx.window.ALGEBRA1_UNIT13_CAPSTONE_DEPTH];
const meta=ctx.window.ALGEBRA1_UNIT13_CAPSTONE_META;
const pool=[
 ...shared.filter(q=>Number(q.unit)===13),
 ...abundant.filter(q=>Number(q.unit)===13),
 ...depth
];

assert.equal(pool.length,80,"Unit 13 formal pool must contain 80 items");
assert.equal(new Set(pool.map(q=>q.id)).size,80,"Unit 13 formal pool IDs must be unique");
assert.equal(depth.length,20,"Unit 13 depth bank must contain 20 quantitative items");
assert.equal(meta?.targetEligible,80,"Unit 13 depth metadata target pool drift");
assert.equal(meta?.delivered,20,"Unit 13 delivered form size drift");
assert.equal(meta?.quantitativeMinimumPerForm,10,"Unit 13 quantitative minimum drift");

for(let lesson=1;lesson<=5;lesson++){
 const rows=pool.filter(q=>Number(q.lesson)===lesson);
 const deep=depth.filter(q=>Number(q.lesson)===lesson);
 assert.equal(rows.length,16,"Unit 13 Lesson "+lesson+" must expose 16 eligible items");
 assert.equal(deep.length,4,"Unit 13 Lesson "+lesson+" must expose four dedicated quantitative capstone items");
 assert.ok(deep.every(q=>q.capstoneDepth==="quantitative"),"Unit 13 Lesson "+lesson+" has untagged capstone-depth items");
 assert.ok(deep.every(q=>[2,3].includes(Number(q.difficulty))),"Unit 13 Lesson "+lesson+" capstone-depth items must be medium/high difficulty");
 assert.ok(deep.every(q=>Array.isArray(q.options)&&q.options.length===4&&new Set(q.options).size===4),"Unit 13 Lesson "+lesson+" depth items must have four distinct options");
 assert.ok(deep.every(q=>Number(q.answer)===0),"Unit 13 depth source items must keep canonical answer index 0 before display balancing");
 assert.ok(deep.every(q=>String(q.explanation||"").length>=45),"Unit 13 Lesson "+lesson+" depth explanations are too thin");
}

const quantitativeSignal=/\d|\$|%|≤|≥|=|slope|residual|error|interval|break-even|prediction|model/i;
assert.ok(depth.every(q=>quantitativeSignal.test(q.prompt+" "+q.explanation)),"Every Unit 13 depth item must contain an explicit quantitative/modeling signal");

const engine=read("assets/legacy-mastery-engine-v2.js");
for(const marker of [
 "ALGEBRA1_UNIT13_CAPSTONE_DEPTH",
 "selectCapstoneLesson",
 'q.capstoneDepth==="quantitative"',
 'targetPoolSize=Number(R.unit)===11?120:Number(R.unit)===13?80:60',
 '"lesson-balanced-capstone-depth-low-overlap-v1"',
 '"algebra1-unit13-capstone-depth-v1"',
 "capstoneQuantitativeMinimum:Number(R.unit)===13?10:null",
 "capstoneQuantitativeCount:Number(R.unit)===13?",
 "capstoneLessonQuantitativeCounts:Number(R.unit)===13?"
]) assert.ok(engine.includes(marker),"Unit 13 capstone engine contract missing "+marker);

const page=read("units/unit-13/assessment/mastery-check.html");
const qIndex=page.indexOf("assets/question-bank.js");
const abundanceIndex=page.indexOf("assets/late-unit-abundant-bank-v1.js");
const depthIndex=page.indexOf("assets/unit13-capstone-depth-bank-v1.js");
const resolverIndex=page.indexOf("assets/misconception-resolver-v1.js");
const engineIndex=page.indexOf("assets/legacy-mastery-engine-v2.js");
assert.ok(qIndex>=0&&abundanceIndex>qIndex&&depthIndex>abundanceIndex&&resolverIndex>depthIndex&&engineIndex>resolverIndex,"Unit 13 mastery script load order drift");

const key=json("units/unit-13/assessment/answer-key.json");
assert.equal(key.schemaVersion,"2.0","Unit 13 answer key schema drift");
assert.equal(key.eligibleItemCount,80,"Unit 13 answer key eligible count drift");
assert.equal(key.deliveredPerAttempt,20,"Unit 13 answer key delivered count drift");
assert.equal(key.capstoneQuantitativeMinimumPerAttempt,10,"Unit 13 answer key depth minimum drift");
assert.equal(key.items.length,80,"Unit 13 answer key item coverage drift");
const keyById=new Map(key.items.map(x=>[x.id,x]));
for(const q of pool){
 const k=keyById.get(q.id);
 assert.ok(k,"Unit 13 answer key missing "+q.id);
 assert.equal(k.answerIndex,Number(q.answer),q.id+": answer index drift");
 assert.equal(k.answer,q.options[Number(q.answer)],q.id+": answer text drift");
 assert.equal(k.explanation,q.explanation,q.id+": explanation drift");
}

const projectPage=read("units/unit-13/projects/algebra-i-integrated-modelling-portfolio-oral-defence.html");
const projectUpgrade=read("units/unit-13/projects/unit-13-project-upgrade.js");
assert.ok(projectPage.includes("unit-13-project-upgrade.js"),"Unit 13 project enhancement is not active on the portfolio page");
for(const phrase of [
 "create at least three complementary representations",
 "verify key calculations independently",
 "document at least one model or assumption change made because of evidence",
 "vary at least two important inputs or assumptions",
 "Address uncertainty and fairness",
 "80-item pool"
]) assert.ok(projectUpgrade.includes(phrase),"Unit 13 project depth contract missing: "+phrase);

for(const rel of ["service-worker.js","service-worker-precache-v1.js"]){
 const src=read(rel);
 assert.ok(src.includes("unit13-capstone-depth-bank-v1.js"),rel+" does not cache the Unit 13 depth bank");
 assert.ok(src.includes("unit-13-project-upgrade.js"),rel+" does not cache the active Unit 13 project enhancement");
}

console.log("PASS Unit 13 capstone depth: 80-item pool, 20 dedicated quantitative items, 10 quantitative items guaranteed per 20-question form, four depth items per lesson, active portfolio enhancement, and synchronized answer key");

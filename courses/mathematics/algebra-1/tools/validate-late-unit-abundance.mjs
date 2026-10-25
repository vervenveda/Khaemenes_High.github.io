import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const base=path.resolve(import.meta.dirname,"..");
const read=rel=>fs.readFileSync(path.join(base,rel),"utf8");
const run=(rel,ctx)=>vm.runInContext(read(rel),ctx,{filename:rel});

const ctx={window:{}};
vm.createContext(ctx);
run("course-data.js",ctx);
run("assets/question-bank.js",ctx);
const baseQuestions=[...ctx.window.ALGEBRA1_QUESTIONS];
run("assets/late-unit-abundant-bank-v1.js",ctx);
const extra=[...ctx.window.ALGEBRA1_LATE_ABUNDANT_QUESTIONS];
assert.equal(extra.length,80,"late-unit abundant bank must contain exactly 80 new items");
assert.deepEqual(
  Object.fromEntries([10,12,13].map(unit=>[unit,extra.filter(q=>q.unit===unit).length])),
  {"10":20,"12":25,"13":35},
  "late-unit abundance allocation drift"
);
for(const q of extra){
  assert.ok(typeof q.id==="string"&&q.id,"abundant item missing stable id");
  assert.ok([10,12,13].includes(Number(q.unit)),"abundant item has invalid unit");
  assert.ok(Number.isInteger(q.lesson)&&q.lesson>0,"abundant item has invalid lesson");
  assert.ok([1,2,3].includes(Number(q.difficulty)),"abundant item has invalid difficulty");
  assert.ok(Array.isArray(q.options)&&q.options.length===4&&new Set(q.options).size===4,"abundant item must have four distinct options");
  assert.equal(q.answer,0,"abundant source items use canonical answer index 0 before display balancing");
  assert.equal(q.reviewStatus,"generated-provisional-v1","abundant item review boundary drift");
  assert.equal(q.generatorVersion,"late-unit-abundant-v1","abundant item generator version drift");
}

run("assets/unit-11-content-upgrade.js",ctx);
const upgradedQuestions=ctx.window.ALGEBRA1_QUESTIONS;
const data=ctx.window.ALGEBRA1_DATA;
const expected={10:60,11:120,12:60,13:60};

for(const unit of [10,11,12,13]){
  const lessons=data.lessons.filter(l=>Number(l.unit)===unit);
  const pool=unit===11
    ? upgradedQuestions.filter(q=>Number(q.unit)===unit)
    : [...baseQuestions.filter(q=>Number(q.unit)===unit),...extra.filter(q=>Number(q.unit)===unit)];
  assert.equal(pool.length,expected[unit],"Unit "+unit+" eligible pool size drift");
  assert.equal(new Set(pool.map(q=>q.id)).size,pool.length,"Unit "+unit+" has duplicate eligible item IDs");
  const baseQuota=Math.floor(20/lessons.length),remainder=20%lessons.length;
  lessons.forEach((lesson,index)=>{
    const need=baseQuota+(index<remainder?1:0);
    const available=pool.filter(q=>Number(q.lesson)===Number(lesson.number)).length;
    assert.ok(available>=need*2,"Unit "+unit+" Lesson "+lesson.number+" cannot support a zero-overlap immediate retake: needs at least "+(need*2)+", has "+available);
  });
}

const engine=read("assets/legacy-mastery-engine-v2.js");
for(const marker of [
  "randomSeed()",
  "selectForm(previousIds,seed)",
  "targetPoolSize=Number(R.unit)===11?120:60",
  "x.available>=x.need*2",
  'selectionPolicy:"lesson-balanced-low-overlap-v1"',
  'formVersion:"algebra1-late-unit-monte-carlo-v1"',
  "immediatePriorOverlap",
  "formSeed",
  "previousIds=current.map(q=>q.id)",
  "balancedOrder(q,target,seed)"
]) assert.ok(engine.includes(marker),"late-unit Monte Carlo engine missing "+marker);

for(const unit of [10,11,12,13]){
  const page=read("units/unit-"+unit+"/assessment/mastery-check.html");
  const qIndex=page.indexOf('assets/question-bank.js');
  const engineIndex=page.indexOf('assets/legacy-mastery-engine-v2.js');
  assert.ok(qIndex>=0&&engineIndex>qIndex,"Unit "+unit+" mastery script order is invalid");
  if(unit===11){
    const upgradeIndex=page.indexOf('assets/unit-11-content-upgrade.js');
    assert.ok(upgradeIndex>qIndex&&upgradeIndex<engineIndex,"Unit 11 rebuild must load between base bank and mastery engine");
  }else{
    const abundanceIndex=page.indexOf('assets/late-unit-abundant-bank-v1.js');
    assert.ok(abundanceIndex>qIndex&&abundanceIndex<engineIndex,"Unit "+unit+" abundance bank must load before mastery engine");
  }
}

for(const rel of ["service-worker.js","service-worker-precache-v1.js"]){
  const src=read(rel);
  assert.ok(src.includes("late-unit-abundant-bank-v1.js"),rel+" does not cache the late-unit abundant bank");
  assert.ok(src.includes("unit-11-content-upgrade.js"),rel+" does not cache the Unit 11 rebuild");
}

console.log("PASS Units 10–13 expose 60/120/60/60 eligible items with lesson-balanced zero-overlap retake capacity");

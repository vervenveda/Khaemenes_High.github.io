import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const base=path.resolve(import.meta.dirname,"..");
const read=rel=>fs.readFileSync(path.join(base,rel),"utf8");
const readJson=rel=>JSON.parse(read(rel));
const ctx={window:{}};vm.createContext(ctx);

vm.runInContext(read("course-data.js"),ctx,{filename:"course-data.js"});
vm.runInContext(read("assets/question-bank.js"),ctx,{filename:"assets/question-bank.js"});
const baseQuestions=[...ctx.window.ALGEBRA1_QUESTIONS];
vm.runInContext(read("assets/late-unit-abundant-bank-v1.js"),ctx,{filename:"assets/late-unit-abundant-bank-v1.js"});
const lateAbundant=[...ctx.window.ALGEBRA1_LATE_ABUNDANT_QUESTIONS];
vm.runInContext(read("assets/unit13-capstone-depth-bank-v1.js"),ctx,{filename:"assets/unit13-capstone-depth-bank-v1.js"});
const unit13Depth=[...ctx.window.ALGEBRA1_UNIT13_CAPSTONE_DEPTH];

const u11ctx={window:{ALGEBRA1_QUESTIONS:[...baseQuestions]}};
vm.createContext(u11ctx);
vm.runInContext(read("assets/unit-11-content-upgrade.js"),u11ctx,{filename:"assets/unit-11-content-upgrade.js"});
const unit11=u11ctx.window.ALGEBRA1_QUESTIONS.filter(q=>Number(q.unit)===11);

const pool=[
 ...baseQuestions.filter(q=>Number(q.unit)===10),
 ...lateAbundant.filter(q=>Number(q.unit)===10),
 ...unit11,
 ...baseQuestions.filter(q=>Number(q.unit)===12),
 ...lateAbundant.filter(q=>Number(q.unit)===12),
 ...baseQuestions.filter(q=>Number(q.unit)===13),
 ...lateAbundant.filter(q=>Number(q.unit)===13),
 ...unit13Depth
];
assert.equal(pool.length,320,"late-unit formal pool must contain 320 items");
assert.equal(new Set(pool.map(q=>String(q.id))).size,320,"late-unit formal pool IDs must be unique");

const shared=readJson("assets/assessment-misconceptions-v1.json");
const late=readJson("assets/late-unit-misconceptions-v1.json");
const sharedRows=Array.isArray(shared.items)?shared.items:Object.values(shared.items||{});
const lateRows=Array.isArray(late.items)?late.items:Object.values(late.items||{});
const sharedById=new Map(sharedRows.map(x=>[String(x.itemId),x]));
const lateById=new Map(lateRows.map(x=>[String(x.itemId),x]));
const poolById=new Map(pool.map(q=>[String(q.id),q]));
const reviewedStatuses=new Set(["reviewed-v1","lesson-family-reviewed-v1"]);

assert.equal(lateRows.length,287,"late provisional misconception map count drift");
assert.equal(late.provisionalItemCount,287,"late provisional metadata count drift");
assert.equal(late.provisionalDistractorRationaleCount,861,"late provisional distractor count drift");
assert.equal(late.lateFormalPoolItemCount,320,"late formal pool metadata drift");
assert.equal(late.reviewedCoverageFromSharedMap,33,"reviewed shared coverage metadata drift");
const overrides=[...lateById.keys()].filter(id=>sharedById.has(id));
assert.equal(overrides.length,19,"late provisional map must override exactly the 19 rebuilt Unit 11 ID collisions");
for(const id of overrides){
 const q=poolById.get(id),old=sharedById.get(id);
 assert.ok(q&&old&&(old.prompt!==q.prompt||Number(old.answerIndex)!==Number(q.answer)||old.correctRationale!==q.explanation),id+": late override exists without active-content drift");
}

let reviewed=0,provisional=0,reviewedRationales=0,provisionalRationales=0;
for(const q of pool){
 const id=String(q.id),rec=lateById.get(id)||sharedById.get(id);
 assert.ok(rec,"late formal item missing misconception coverage: "+id);
 assert.equal(rec.prompt,q.prompt,id+": prompt drift");
 assert.equal(Number(rec.answerIndex),Number(q.answer),id+": answer-key drift");
 assert.equal(rec.correctRationale,q.explanation,id+": correct-rationale drift");
 const ds=Array.isArray(rec.distractors)?rec.distractors:[];
 const expected=q.options.map((_,i)=>i).filter(i=>i!==Number(q.answer)).sort((a,b)=>a-b);
 const actual=ds.map(d=>Number(d.optionIndex)).sort((a,b)=>a-b);
 assert.equal(JSON.stringify(actual),JSON.stringify(expected),id+": distractor-index coverage drift");
 for(const d of ds){
   assert.equal(q.options[Number(d.optionIndex)],d.optionText,id+" option "+d.optionIndex+": option-text drift");
   assert.match(String(d.misconceptionTag||""),/^[a-z0-9]+(?:-[a-z0-9]+)*$/,id+" option "+d.optionIndex+": invalid tag");
   assert.ok(String(d.rationale||"").trim().length>=24,id+" option "+d.optionIndex+": rationale too thin");
 }
 if(reviewedStatuses.has(rec.reviewStatus)){reviewed++;reviewedRationales+=ds.length}
 else{
   assert.equal(rec.reviewStatus,"family-provisional-v1",id+": unsupported provisional review status");
   provisional++;provisionalRationales+=ds.length;
 }
}
assert.equal(reviewed,33,"late reviewed misconception coverage drift");
assert.equal(provisional,287,"late provisional misconception coverage drift");
assert.equal(reviewedRationales,99,"late reviewed distractor rationale count drift");
assert.equal(provisionalRationales,861,"late provisional distractor rationale count drift");

const resolver=read("assets/misconception-resolver-v1.js");
for(const marker of [
  'late-unit-misconceptions-v1.json',
  'late=new Map(rows(l).map(x=>[x.itemId,x]))',
  'dedicated.get(itemId)||late.get(itemId)||shared.get(itemId)',
  'late.has(itemId)?"late":"shared"',
  'reviewedStatuses.has(rec.reviewStatus)'
]) assert.ok(resolver.includes(marker),"resolver missing "+marker);

const engine=read("assets/legacy-mastery-engine-v2.js");
for(const marker of [
  "async function score()",
  "KhaemenesAlgebra1Misconceptions",
  "await resolver.ready",
  "resolver?.lookup?.(q.id,selectedOriginalIndex)",
  "diagnostic?.learnerFeedbackEligible",
  "Misconception check:",
  "misconceptionMapSource:diagnostic?.mapSource",
  "misconceptionReviewStatus:diagnostic?.reviewStatus",
  "misconceptionLearnerFeedback:Boolean"
]) assert.ok(engine.includes(marker),"late mastery engine missing "+marker);

for(const unit of [10,11,12,13]){
 const page=read("units/unit-"+unit+"/assessment/mastery-check.html");
 const resolverIndex=page.indexOf("assets/misconception-resolver-v1.js");
 const engineIndex=page.indexOf("assets/legacy-mastery-engine-v2.js");
 assert.ok(resolverIndex>=0&&engineIndex>resolverIndex,"Unit "+unit+" must load misconception resolver before mastery engine");
}

for(const rel of ["service-worker.js","service-worker-precache-v1.js"]){
 const src=read(rel);
 assert.ok(src.includes("assets/misconception-resolver-v1.js"),rel+" does not cache the resolver");
 assert.ok(src.includes("assets/late-unit-misconceptions-v1.json"),rel+" does not cache the late misconception map");
}

console.log("PASS Units 10–13 misconception coverage: 320/320 active items mapped = 33 exact reviewed + 287 provisional, including 19 stale-ID overrides and 20 Unit 13 capstone-depth items; learner-facing feedback remains reviewed-only");

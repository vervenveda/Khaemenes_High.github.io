#!/usr/bin/env node
"use strict";

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../../../..");
const failures=[];
const warnings=[];

function read(rel){return fs.readFileSync(path.join(ROOT,rel),"utf8")}
function loadWindow(rel){
  const ctx={window:{}};vm.createContext(ctx);vm.runInContext(read(rel),ctx,{filename:rel});
  const keys=Object.keys(ctx.window);
  if(keys.length!==1)throw new Error(`${rel}: expected one window export, found ${keys.length}`);
  return ctx.window[keys[0]];
}
function posCounts(items){
  const out=[0,0,0,0];
  for(const q of items)if(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4)out[q.answer]++;
  return out;
}

const dedicated=[];
let lessonCount=0;
const perUnit={};

for(let unit=1;unit<=9;unit++){
  const u=String(unit).padStart(2,"0");
  const rel=`courses/mathematics/algebra-1/units/unit-${u}/assets/unit${u}-data.js`;
  const data=loadWindow(rel);
  const qs=Array.isArray(data.questions)?data.questions:[];
  const lessons=Array.isArray(data.lessons)?data.lessons:[];
  dedicated.push(...qs);
  lessonCount+=lessons.length;
  perUnit[unit]={items:qs.length,lessons:lessons.length,authoredAnswerPositions:posCounts(qs)};
  for(const lesson of lessons){
    const rows=qs.filter(q=>Number(q.lesson)===Number(lesson.number));
    if(rows.length!==10)failures.push(`Unit ${u} lesson ${lesson.number}: expected 10 dedicated questions, found ${rows.length}`);
  }
}
if(dedicated.length!==610)failures.push(`Units 01-09 dedicated total: expected 610, found ${dedicated.length}`);
if(lessonCount!==61)failures.push(`Units 01-09 lesson count: expected 61, found ${lessonCount}`);

const ids=new Set();
for(const q of dedicated){
  if(!q.id||ids.has(q.id))failures.push(`duplicate/missing dedicated ID: ${q.id||"(missing)"}`);
  ids.add(q.id);
  if(!Array.isArray(q.options)||q.options.length!==4)failures.push(`${q.id}: expected four options`);
  if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=4)failures.push(`${q.id}: invalid answer index ${q.answer}`);
}

const unit01=read("courses/mathematics/algebra-1/units/unit-01/assets/unit01.js");
for(const marker of ["blueprintSelect","selectedOriginalIndex",'formVersion:"algebra1-runtime-balanced-v2"','evidenceSchema:"algebra1-answer-evidence-v2"','"unit01-abundant-v1"','"blueprint-low-overlap-v1"',"eligiblePoolSize","KhaemenesAlgebra1Misconceptions","misconceptionMapVersion","misconceptionLearnerFeedback"])if(!unit01.includes(marker))failures.push(`Unit 01 runtime missing abundant-retake/evidence marker: ${marker}`);
if(unit01.includes('chosen.length>8')||unit01.includes('chosen.slice(0,8)'))failures.push("Unit 01 legacy 8-question slice is still present");

const shared=loadWindow("courses/mathematics/algebra-1/assets/question-bank.js");
const unit01Abundant=loadWindow("courses/mathematics/algebra-1/units/unit-01/assets/unit01-abundant-bank-v1.js");
if(!Array.isArray(unit01Abundant)||unit01Abundant.length!==75)failures.push(`Unit 01 abundant bank: expected 75 items, found ${Array.isArray(unit01Abundant)?unit01Abundant.length:"non-array"}`);
let unit01EligibleTotal=0;
for(let lesson=1;lesson<=5;lesson++){const dedicatedRows=dedicated.filter(q=>Number(q.lesson)===lesson&&String(q.id).startsWith("u01-")),sharedRows=shared.filter(q=>Number(q.unit)===1&&Number(q.lesson)===lesson),abundantRows=Array.isArray(unit01Abundant)?unit01Abundant.filter(q=>Number(q.lesson)===lesson):[],eligible=dedicatedRows.length+sharedRows.length+abundantRows.length;unit01EligibleTotal+=eligible;if(dedicatedRows.length!==10)failures.push(`Unit 01 lesson ${lesson}: expected 10 dedicated items, found ${dedicatedRows.length}`);if(sharedRows.length!==5)failures.push(`Unit 01 lesson ${lesson}: expected 5 shared alternates, found ${sharedRows.length}`);if(abundantRows.length!==15)failures.push(`Unit 01 lesson ${lesson}: expected 15 abundant alternates, found ${abundantRows.length}`);if(eligible!==30)failures.push(`Unit 01 lesson ${lesson}: expected 30 eligible questions, found ${eligible}`);for(const q of abundantRows)if(!q.generatorId||q.generatorVersion!=="unit01-abundant-v1"||!q.misconceptionTag)failures.push(`${q.id}: missing stable generator/misconception metadata`)}
const unit01LessonFiles=["lesson-01-algebraic-habits-notation-mathematical-argument.html","lesson-02-the-real-number-system-interval-representations.html","lesson-03-operations-properties-order-of-operations.html","lesson-04-units-rates-dimensional-analysis.html","lesson-05-precision-rounding-significant-figures-percent-error.html","lesson-06-algebra-readiness-synthesis-error-analysis.html"];
for(let lesson=1;lesson<=6;lesson++){const html=read(`courses/mathematics/algebra-1/units/unit-01/lessons/${unit01LessonFiles[lesson-1]}`);if(!html.includes("../../../assets/question-bank.js"))failures.push(`Unit 01 lesson ${lesson}: shared alternate bank is not loaded`);if(!html.includes("../assets/unit01-abundant-bank-v1.js"))failures.push(`Unit 01 lesson ${lesson}: abundant bank is not loaded`)}
if(!Array.isArray(shared)||shared.length!==435)failures.push(`Shared Algebra I bank: expected 435 items, found ${Array.isArray(shared)?shared.length:"non-array"}`);

const abundantByUnit=new Map([
 [2,loadWindow("courses/mathematics/algebra-1/units/unit-02/assets/unit02-abundant-bank-v1.js")],
 [3,loadWindow("courses/mathematics/algebra-1/units/unit-03/assets/unit03-abundant-bank-v1.js")],
 [4,loadWindow("courses/mathematics/algebra-1/units/unit-04/assets/unit04-abundant-bank-v1.js")],
 [5,loadWindow("courses/mathematics/algebra-1/units/unit-05/assets/unit05-abundant-bank-v1.js")]
]);
for(const [unit,rows] of abundantByUnit)if(!Array.isArray(rows))failures.push(`Unit ${String(unit).padStart(2,"0")} abundant bank is not an array`);
let alignedLessons=0,alignedItems=0;
const abundantItemCounts=new Map([...abundantByUnit.keys()].map(unit=>[unit,0]));
for(let unit=2;unit<=9;unit++){
  const u=String(unit).padStart(2,"0");
  const data=loadWindow(`courses/mathematics/algebra-1/units/unit-${u}/assets/unit${u}-data.js`);
  const core=read(`courses/mathematics/algebra-1/units/unit-${u}/assets/unit${u}-core.js`);
  const loader=read(`courses/mathematics/algebra-1/units/unit-${u}/assets/unit${u}.js`);
  const abundantBank=abundantByUnit.get(unit);
  const abundantEnabled=Boolean(abundantBank);
  const requiredCore=abundantEnabled?[
    "const balanceOptions=(chosen)=>",
    'key.startsWith("lesson-")',
    "blueprintSelect",
    `KHAE_UNIT${u}_ABUNDANT_BANK`,
    '_formSource:"aligned-alternate"',
    '_formSource:"abundant-alternate"',
    "answerSnapshot:snapshots",
    "selectedOriginalIndex",
    'formVersion:"algebra1-runtime-balanced-v2"',
    `bankVersion:lessonNumber?"unit${u}-abundant-v1"`,
    '"blueprint-low-overlap-v1"',
    "eligiblePoolSize",
    "KhaemenesAlgebra1Misconceptions",
    "misconceptionMapVersion",
    "misconceptionLearnerFeedback",
    "fresh();"
  ]:[
    "const balanceOptions=(chosen)=>",
    'key.startsWith("lesson-")',
    "supplementalCount",
    '_formSource:"aligned-alternate"',
    "answerSnapshot:snapshots",
    "selectedOriginalIndex",
    'formVersion:"algebra1-runtime-balanced-v2"',
    "KhaemenesAlgebra1Misconceptions",
    "misconceptionMapVersion",
    "misconceptionLearnerFeedback",
    "fresh();"
  ];
  for(const marker of requiredCore)if(!core.includes(marker))failures.push(`Unit ${u} core missing runtime marker: ${marker}`);
  if(!loader.includes("../../../assets/question-bank.js"))failures.push(`Unit ${u} loader does not load aligned shared question bank`);
  if(!loader.includes("Array.isArray(window.ALGEBRA1_QUESTIONS)"))failures.push(`Unit ${u} loader does not verify shared question bank before core launch`);
  if(!loader.includes("misconception-resolver-v1.js"))failures.push(`Unit ${u} loader does not load misconception resolver`);
  if(abundantEnabled&&!loader.includes(`unit${u}-abundant-bank-v1.js`))failures.push(`Unit ${u} loader does not load abundant bank`);

  for(const lesson of data.lessons||[]){
    const alt=shared.filter(q=>Number(q.unit)===unit&&Number(q.lesson)===Number(lesson.number));
    if(alt.length!==5)failures.push(`Unit ${u} lesson ${lesson.number}: expected 5 aligned alternate items, found ${alt.length}`);
    else {alignedLessons++;alignedItems+=alt.length;}
    const dedicatedRows=(data.questions||[]).filter(q=>Number(q.lesson)===Number(lesson.number));
    if(abundantEnabled){
      const abundantRows=abundantBank.filter(q=>Number(q.lesson)===Number(lesson.number));
      abundantItemCounts.set(unit,(abundantItemCounts.get(unit)||0)+abundantRows.length);
      if(abundantRows.length!==15)failures.push(`Unit ${u} lesson ${lesson.number}: expected 15 abundant items, found ${abundantRows.length}`);
      if(dedicatedRows.length+alt.length+abundantRows.length!==30)failures.push(`Unit ${u} lesson ${lesson.number}: expected 30-item runtime pool, found ${dedicatedRows.length+alt.length+abundantRows.length}`);
      for(const q of abundantRows)if(!q.generatorId||q.generatorVersion!==`unit${u}-abundant-v1`||!q.misconceptionTag)failures.push(`${q.id}: missing Unit ${u} stable generator/misconception metadata`);
    }else if(dedicatedRows.length+alt.length!==15)failures.push(`Unit ${u} lesson ${lesson.number}: expected 15-item runtime pool, found ${dedicatedRows.length+alt.length}`);
  }
}
if(alignedLessons!==55)failures.push(`Aligned alternate lesson coverage: expected 55/55, found ${alignedLessons}/55`);
if(alignedItems!==275)failures.push(`Aligned alternate item coverage: expected 275, found ${alignedItems}`);
for(const [unit,count] of abundantItemCounts){const expected=(perUnit[unit]?.lessons||0)*15,rows=abundantByUnit.get(unit)||[];if(count!==expected||rows.length!==expected)failures.push(`Unit ${String(unit).padStart(2,"0")} abundant lesson coverage: expected ${expected}, lesson-counted ${count}, bank ${rows.length}`);}

for(const rel of [
 "courses/mathematics/algebra-1/service-worker.js",
 "courses/mathematics/algebra-1/service-worker-precache-v1.js"
]){
 if(!read(rel).includes("assets/question-bank.js"))failures.push(`${rel}: shared alternate bank is not offline-cached`);
 if(!read(rel).includes("unit01-abundant-bank-v1.js"))failures.push(`${rel}: Unit 01 abundant bank is not offline-cached`);
 for(const unit of abundantByUnit.keys()){const u=String(unit).padStart(2,"0");if(!read(rel).includes(`unit${u}-abundant-bank-v1.js`))failures.push(`${rel}: Unit ${u} abundant bank is not offline-cached`);}
 for(const asset of ["misconception-resolver-v1.js","assessment-misconceptions-v1.json","dedicated-assessment-misconceptions-v1.json"])if(!read(rel).includes(asset))failures.push(`${rel}: misconception runtime dependency is not offline-cached: ${asset}`);
}

const sharedMap=JSON.parse(read("courses/mathematics/algebra-1/assets/assessment-misconceptions-v1.json"));
const sharedMapItems=Array.isArray(sharedMap.items)?sharedMap.items:Object.values(sharedMap.items||{});
const sharedMapById=new Map(sharedMapItems.map(x=>[x.itemId,x]));
let alignedMapped=0,alignedReviewed=0,alignedProvisional=0,alignedDistractorRationales=0;
for(const q of shared.filter(q=>Number(q.unit)>=2&&Number(q.unit)<=9)){
 const rec=sharedMapById.get(q.id);
 if(!rec){failures.push(`${q.id}: missing shared alternate misconception map`);continue}
 alignedMapped++;
 if(rec.prompt!==q.prompt||Number(rec.answerIndex)!==Number(q.answer)||rec.correctRationale!==q.explanation)failures.push(`${q.id}: shared misconception map drift`);
 const ds=Array.isArray(rec.distractors)?rec.distractors:[];
 alignedDistractorRationales+=ds.length;
 if(ds.length!==3)failures.push(`${q.id}: expected three shared distractor rationales, found ${ds.length}`);
 if(rec.reviewStatus==="reviewed-v1")alignedReviewed++;
 else if(rec.reviewStatus==="family-provisional-v1")alignedProvisional++;
 else failures.push(`${q.id}: invalid shared misconception reviewStatus ${rec.reviewStatus}`);
}
if(alignedMapped!==275)failures.push(`Shared alternate misconception coverage: expected 275/275, found ${alignedMapped}/275`);
if(alignedReviewed!==205)failures.push(`Shared alternate reviewed coverage: expected 205, found ${alignedReviewed}`);
if(alignedProvisional!==70)failures.push(`Shared alternate provisional coverage: expected 70, found ${alignedProvisional}`);
if(alignedDistractorRationales!==825)failures.push(`Shared alternate distractor rationales: expected 825, found ${alignedDistractorRationales}`);

const dedicatedMap=JSON.parse(read("courses/mathematics/algebra-1/units/dedicated-assessment-misconceptions-v1.json"));
const dedicatedMapItems=Object.values(dedicatedMap.items||{});
if(dedicatedMapItems.length!==610)failures.push(`Dedicated misconception map: expected 610 items, found ${dedicatedMapItems.length}`);
const dedicatedMapById=new Map(dedicatedMapItems.map(x=>[x.itemId,x]));
let dedicatedRationales=0,representativeReviewed=0,provisionalMapped=0;
for(const q of dedicated){
  const rec=dedicatedMapById.get(q.id);
  if(!rec){failures.push(`${q.id}: missing dedicated misconception map`);continue}
  if(rec.prompt!==q.prompt||Number(rec.answerIndex)!==Number(q.answer)||rec.correctRationale!==q.explanation)failures.push(`${q.id}: dedicated misconception map drift`);
  const ds=Array.isArray(rec.distractors)?rec.distractors:[];
  dedicatedRationales+=ds.length;
  if(ds.length!==3)failures.push(`${q.id}: expected three dedicated distractor rationales, found ${ds.length}`);
  if(rec.reviewStatus==="lesson-family-reviewed-v1")representativeReviewed++;
  else if(rec.reviewStatus==="lesson-family-provisional-v1")provisionalMapped++;
  else failures.push(`${q.id}: invalid dedicated misconception reviewStatus`);
}
if(dedicatedRationales!==1830)failures.push(`Dedicated misconception rationales: expected 1830, found ${dedicatedRationales}`);
if(representativeReviewed!==200)failures.push(`Dedicated representative reviewed coverage: expected 200, found ${representativeReviewed}`);
if(provisionalMapped!==410)failures.push(`Dedicated provisional coverage: expected 410, found ${provisionalMapped}`);

const authored=posCounts(dedicated);
const summary={
  dedicated:{items:dedicated.length,lessons:lessonCount,authoredAnswerPositions:authored,perUnit},
  repairedUnit01LessonLength:10,
  unit01AbundantRetakes:{lessons:5,eligibleItemsPerLesson:30,eligibleItemsAcrossLessons01to05:unit01EligibleTotal,deliveredItems:10,immediatePriorFormOverlap:"minimized by unseen-first blueprint selection",evidenceSchema:"algebra1-answer-evidence-v2",bankVersion:"unit01-abundant-v1"},
  unit02AbundantRetakes:{lessons:7,eligibleItemsPerLesson:30,abundantItems:abundantItemCounts.get(2),deliveredItems:10,immediatePriorFormOverlap:"minimized by unseen-first blueprint selection",evidenceSchema:"algebra1-answer-evidence-v2",bankVersion:"unit02-abundant-v1"},
  unit03AbundantRetakes:{lessons:7,eligibleItemsPerLesson:30,abundantItems:abundantItemCounts.get(3),deliveredItems:10,immediatePriorFormOverlap:"minimized by unseen-first blueprint selection",evidenceSchema:"algebra1-answer-evidence-v2",bankVersion:"unit03-abundant-v1"},
  unit04AbundantRetakes:{lessons:6,eligibleItemsPerLesson:30,abundantItems:abundantItemCounts.get(4),deliveredItems:10,immediatePriorFormOverlap:"minimized by unseen-first blueprint selection",evidenceSchema:"algebra1-answer-evidence-v2",bankVersion:"unit04-abundant-v1"},
  unit05AbundantRetakes:{lessons:7,eligibleItemsPerLesson:30,abundantItems:abundantItemCounts.get(5),deliveredItems:10,immediatePriorFormOverlap:"minimized by unseen-first blueprint selection",evidenceSchema:"algebra1-answer-evidence-v2",bankVersion:"unit05-abundant-v1"},
  units02to09:{
    units:8,
    lessons:55,
    dedicatedItems:550,
    alignedAlternateItems:alignedItems,
    runtimePoolPerLesson:"Units 02–05 = 30; Units 06–09 = 15",
    firstAttempt:"10 dedicated items with balanced learner-visible answer positions",
    retake:"Units 02–05 use 10-of-30 low-overlap blueprint retakes; Units 06–09 use 5 aligned alternates + 5 dedicated items",
    answerEvidence:"versioned immutable answerSnapshot with delivered/original option mapping"
  },
  offlineAlternateBankCached:true,
  sharedAlternateMisconceptionMap:{mapped:alignedMapped,reviewed:alignedReviewed,provisional:alignedProvisional,distractorRationales:alignedDistractorRationales},
  learnerMisconceptionRuntime:{resolver:"reviewed-only learner feedback",evidence:"stores misconception tag/map version/review status when mapped",offlineCached:true},
  dedicatedMisconceptionMap:{mappedItems:dedicatedMapItems.length,distractorRationales:dedicatedRationales,representativeReviewed,provisionalMapped,representativeUnits:[1,5,9]}
};

if(failures.length){
  console.error("ALGEBRA I RUNTIME-ASSESSMENT FORENSIC VALIDATION: FAIL");
  failures.forEach(x=>console.error("- "+x));
  process.exit(1);
}
console.log("ALGEBRA I RUNTIME-ASSESSMENT FORENSIC VALIDATION: PASS");
if(warnings.length){console.log("Warnings:");warnings.forEach(x=>console.log("- "+x));}
console.log(JSON.stringify(summary,null,2));

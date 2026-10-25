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
if(!unit01.includes('chosen.length>10')||!unit01.includes('chosen.slice(0,10)'))failures.push("Unit 01 runtime does not enforce the repaired 10-question lesson form");
if(unit01.includes('chosen.length>8')||unit01.includes('chosen.slice(0,8)'))failures.push("Unit 01 legacy 8-question slice is still present");

const shared=loadWindow("courses/mathematics/algebra-1/assets/question-bank.js");
if(!Array.isArray(shared)||shared.length!==435)failures.push(`Shared Algebra I bank: expected 435 items, found ${Array.isArray(shared)?shared.length:"non-array"}`);

let alignedLessons=0,alignedItems=0;
for(let unit=2;unit<=9;unit++){
  const u=String(unit).padStart(2,"0");
  const data=loadWindow(`courses/mathematics/algebra-1/units/unit-${u}/assets/unit${u}-data.js`);
  const core=read(`courses/mathematics/algebra-1/units/unit-${u}/assets/unit${u}-core.js`);
  const loader=read(`courses/mathematics/algebra-1/units/unit-${u}/assets/unit${u}.js`);
  const requiredCore=[
    "function balanceOptions",
    'key.startsWith("lesson-")',
    "supplementalCount",
    '_formSource:"aligned-alternate"',
    "answerSnapshot:snapshots",
    "selectedOriginalIndex",
    'formVersion:"algebra1-runtime-balanced-v2"',
    "fresh();"
  ];
  for(const marker of requiredCore)if(!core.includes(marker))failures.push(`Unit ${u} core missing runtime marker: ${marker}`);
  if(!loader.includes("../../../assets/question-bank.js"))failures.push(`Unit ${u} loader does not load aligned shared question bank`);
  if(!loader.includes("Array.isArray(window.ALGEBRA1_QUESTIONS)"))failures.push(`Unit ${u} loader does not verify shared question bank before core launch`);

  for(const lesson of data.lessons||[]){
    const alt=shared.filter(q=>Number(q.unit)===unit&&Number(q.lesson)===Number(lesson.number));
    if(alt.length!==5)failures.push(`Unit ${u} lesson ${lesson.number}: expected 5 aligned alternate items, found ${alt.length}`);
    else {alignedLessons++;alignedItems+=alt.length;}
    const dedicatedRows=(data.questions||[]).filter(q=>Number(q.lesson)===Number(lesson.number));
    if(dedicatedRows.length+alt.length!==15)failures.push(`Unit ${u} lesson ${lesson.number}: expected 15-item runtime pool, found ${dedicatedRows.length+alt.length}`);
  }
}
if(alignedLessons!==55)failures.push(`Aligned alternate lesson coverage: expected 55/55, found ${alignedLessons}/55`);
if(alignedItems!==275)failures.push(`Aligned alternate item coverage: expected 275, found ${alignedItems}`);

for(const rel of [
 "courses/mathematics/algebra-1/service-worker.js",
 "courses/mathematics/algebra-1/service-worker-precache-v1.js"
]){
 if(!read(rel).includes("assets/question-bank.js"))failures.push(`${rel}: shared alternate bank is not offline-cached`);
}

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
  units02to09:{
    units:8,
    lessons:55,
    dedicatedItems:550,
    alignedAlternateItems:alignedItems,
    runtimePoolPerLesson:15,
    firstAttempt:"10 dedicated items with balanced learner-visible answer positions",
    retake:"5 aligned alternate items + 5 dedicated items, with balanced learner-visible answer positions",
    answerEvidence:"versioned immutable answerSnapshot with delivered/original option mapping"
  },
  offlineAlternateBankCached:true,
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

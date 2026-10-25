#!/usr/bin/env node
"use strict";

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const MAP_REL="courses/mathematics/algebra-1/units/dedicated-assessment-misconceptions-v1.json";
const failures=[];
const warnings=[];

function read(rel){return fs.readFileSync(path.join(ROOT,rel),"utf8")}
function loadWindow(rel){
  const ctx={window:{}};vm.createContext(ctx);vm.runInContext(read(rel),ctx,{filename:rel});
  const keys=Object.keys(ctx.window);
  if(keys.length!==1)throw new Error(`${rel}: expected one window export`);
  return ctx.window[keys[0]];
}

const map=JSON.parse(read(MAP_REL));
if(map.schema!=="khaemenes.algebra1-dedicated-misconception-map.v1")failures.push("wrong dedicated-map schema");

const bankById=new Map();
const perUnit={};
for(let unit=1;unit<=9;unit++){
  const u=String(unit).padStart(2,"0");
  const data=loadWindow(`courses/mathematics/algebra-1/units/unit-${u}/assets/unit${u}-data.js`);
  const qs=Array.isArray(data.questions)?data.questions:[];
  perUnit[unit]={items:qs.length,reviewed:0,provisional:0,rationales:0};
  for(const q of qs){
    if(bankById.has(q.id))failures.push(`duplicate dedicated bank id ${q.id}`);
    bankById.set(q.id,{...q,unit});
  }
}
if(bankById.size!==610)failures.push(`expected 610 dedicated items, found ${bankById.size}`);

const entries=Object.values(map.items||{});
if(entries.length!==610)failures.push(`expected 610 mapped items, found ${entries.length}`);
let rationales=0,reviewed=0,provisional=0;

for(const rec of entries){
  const q=bankById.get(rec.itemId);
  if(!q){failures.push(`${rec.itemId}: mapped item missing from dedicated banks`);continue}
  if(Number(rec.unit)!==Number(q.unit))failures.push(`${rec.itemId}: unit drift`);
  if(Number(rec.lesson)!==Number(q.lesson))failures.push(`${rec.itemId}: lesson drift`);
  if(rec.prompt!==q.prompt)failures.push(`${rec.itemId}: prompt drift requires re-review`);
  if(Number(rec.answerIndex)!==Number(q.answer))failures.push(`${rec.itemId}: answer-key drift requires re-review`);
  if(rec.correctRationale!==q.explanation)failures.push(`${rec.itemId}: explanation drift requires re-review`);
  const status=String(rec.reviewStatus||"");
  if(status==="lesson-family-reviewed-v1"){reviewed++;perUnit[q.unit].reviewed++}
  else if(status==="lesson-family-provisional-v1"){provisional++;perUnit[q.unit].provisional++}
  else failures.push(`${rec.itemId}: unsupported reviewStatus ${status||"(missing)"}`);
  const ds=Array.isArray(rec.distractors)?rec.distractors:[];
  rationales+=ds.length;perUnit[q.unit].rationales+=ds.length;
  const expected=q.options.map((_,i)=>i).filter(i=>i!==q.answer).sort((a,b)=>a-b);
  const actual=ds.map(d=>Number(d.optionIndex)).sort((a,b)=>a-b);
  if(JSON.stringify(expected)!==JSON.stringify(actual))failures.push(`${rec.itemId}: wrong-option coverage is incomplete`);
  for(const d of ds){
    const i=Number(d.optionIndex);
    if(q.options[i]!==d.optionText)failures.push(`${rec.itemId} option ${i}: option-text drift requires re-review`);
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(d.misconceptionTag||"")))failures.push(`${rec.itemId} option ${i}: invalid misconception tag`);
    if(String(d.rationale||"").trim().length<40)failures.push(`${rec.itemId} option ${i}: rationale is too thin`);
  }
}
if(rationales!==1830)failures.push(`expected 1830 distractor rationales, found ${rationales}`);
if(reviewed!==200)failures.push(`expected 200 representative reviewed items, found ${reviewed}`);
if(provisional!==410)failures.push(`expected 410 provisional items, found ${provisional}`);

for(const unit of [1,5,9]){
  if(perUnit[unit].reviewed!==perUnit[unit].items)failures.push(`Unit ${String(unit).padStart(2,"0")}: representative reviewed coverage is incomplete`);
}
for(const unit of [2,3,4,6,7,8]){
  if(perUnit[unit].provisional!==perUnit[unit].items)failures.push(`Unit ${String(unit).padStart(2,"0")}: provisional lesson-family coverage is incomplete`);
}

if(failures.length){
  console.error("ALGEBRA I DEDICATED MISCONCEPTION MAP: FAIL");
  failures.forEach(x=>console.error("- "+x));
  process.exit(1);
}
console.log("ALGEBRA I DEDICATED MISCONCEPTION MAP: PASS");
console.log(JSON.stringify({
  dedicatedItems:bankById.size,
  mappedItems:entries.length,
  distractorRationales:rationales,
  representativeReviewedItems:reviewed,
  provisionalItems:provisional,
  representativeReviewedUnits:[1,5,9],
  perUnit
},null,2));

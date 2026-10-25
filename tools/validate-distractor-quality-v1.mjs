#!/usr/bin/env node
"use strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const specs=[
 {
  label:"Algebra I",
  bank:"courses/mathematics/algebra-1/assets/question-bank.js",
  map:"courses/mathematics/algebra-1/assets/assessment-misconceptions-v1.json",
  expectedItems:271,
  expectedDistractors:813,
  coverageKey:q=>String(q.unit),
  expectedCoverageKeys:Array.from({length:13},(_,i)=>String(i+1))
 },
 {
  label:"Chemistry 11",
  bank:"courses/science/chemistry-11/question-bank.js",
  map:"courses/science/chemistry-11/assessment-misconceptions-v1.json",
  expectedItems:339,
  expectedDistractors:1017,
  coverageKey:q=>String(q.unit),
  expectedCoverageKeys:["U1","U2","U3","U4","U5","U6","U7","U8","U9","CAP"]
 }
];

function read(rel){return fs.readFileSync(path.join(ROOT,rel),"utf8")}
function loadBank(rel){
 const ctx={window:{}};vm.createContext(ctx);vm.runInContext(read(rel),ctx,{filename:rel});
 const keys=Object.keys(ctx.window);
 if(keys.length!==1||!Array.isArray(ctx.window[keys[0]]))throw new Error(rel+": expected one window array");
 return ctx.window[keys[0]];
}
const failures=[],summary=[];
for(const spec of specs){
 const bank=loadBank(spec.bank),byId=new Map(bank.map(q=>[String(q.id),q]));
 const map=JSON.parse(read(spec.map)),entries=Object.values(map.items||{});
 let distractors=0;const coveredKeys=new Set();
 if(map.schema!=="khaemenes.assessment-misconception-map.v1")failures.push(spec.label+": wrong schema");
 if(spec.label==="Chemistry 11"&&map.distractorMappingRequired!==true)failures.push(spec.label+": distractorMappingRequired must be true after complete public-bank review");
 if(map.sourceBank!==spec.bank)failures.push(spec.label+": sourceBank drift");
 if(entries.length!==spec.expectedItems)failures.push(`${spec.label}: expected ${spec.expectedItems} reviewed items, found ${entries.length}`);
 if(spec.label==="Chemistry 11"&&map.distractorMappingRequired===true&&entries.length!==bank.length)failures.push(spec.label+": required misconception mapping no longer covers the complete public bank");
 for(const rec of entries){
  const q=byId.get(String(rec.itemId));
  if(!q){failures.push(`${spec.label}: mapped item missing from bank: ${rec.itemId}`);continue}
  coveredKeys.add(spec.coverageKey(q));
  if(rec.reviewStatus!=="reviewed-v1")failures.push(`${spec.label} ${rec.itemId}: reviewStatus must be reviewed-v1`);
  if(rec.prompt!==q.prompt)failures.push(`${spec.label} ${rec.itemId}: prompt drift requires re-review`);
  if(Number(rec.answerIndex)!==Number(q.answer))failures.push(`${spec.label} ${rec.itemId}: keyed-answer drift requires re-review`);
  if(!String(rec.correctRationale||"").trim())failures.push(`${spec.label} ${rec.itemId}: missing correct rationale`);
  if(rec.correctRationale!==q.explanation)failures.push(`${spec.label} ${rec.itemId}: correct rationale no longer matches bank explanation`);
  const ds=Array.isArray(rec.distractors)?rec.distractors:[];
  distractors+=ds.length;
  const expectedIndexes=q.options.map((_,i)=>i).filter(i=>i!==q.answer).sort((a,b)=>a-b);
  const actualIndexes=ds.map(d=>Number(d.optionIndex)).sort((a,b)=>a-b);
  if(JSON.stringify(expectedIndexes)!==JSON.stringify(actualIndexes))failures.push(`${spec.label} ${rec.itemId}: distractor indexes do not cover every wrong option exactly once`);
  for(const d of ds){
    const i=Number(d.optionIndex);
    if(q.options[i]!==d.optionText)failures.push(`${spec.label} ${rec.itemId} option ${i}: option text drift requires re-review`);
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(d.misconceptionTag||"")))failures.push(`${spec.label} ${rec.itemId} option ${i}: misconceptionTag must be kebab-case`);
    const rationale=String(d.rationale||"").trim();
    if(rationale.length<24)failures.push(`${spec.label} ${rec.itemId} option ${i}: rationale is too thin`);
    if(/^incorrect\.?$/i.test(rationale))failures.push(`${spec.label} ${rec.itemId} option ${i}: rationale must explain the reasoning error`);
  }
 }
 if(distractors!==spec.expectedDistractors)failures.push(`${spec.label}: expected ${spec.expectedDistractors} distractor rationales, found ${distractors}`);
 if(spec.label==="Algebra I"){
  const normTemplate=s=>String(s??"").toLowerCase().replace(/−/g,"-").replace(/-?\d+(?:\.\d+)?/g,"#").replace(/[^\p{L}\p{N}#]+/gu," ").replace(/\s+/g," ").trim();
  const families=new Map();
  for(const q of bank){const k=normTemplate(q.prompt);if(!families.has(k))families.set(k,[]);families.get(k).push(q)}
  const mappedIds=new Set(entries.map(x=>String(x.itemId)));
  const gaps=[...families.entries()].filter(([,group])=>group.length>=3&&group.some(q=>!mappedIds.has(String(q.id))));
  if(gaps.length)failures.push(spec.label+": repeated-family mapping gaps remain: "+gaps.map(([k,g])=>k+" ["+g.filter(q=>!mappedIds.has(String(q.id))).map(q=>q.id).join(",")+"]").join("; "));
 }
 const missingCoverage=spec.expectedCoverageKeys.filter(k=>!coveredKeys.has(k));
 if(missingCoverage.length)failures.push(`${spec.label}: year-spanning anchor coverage missing ${missingCoverage.join(", ")}`);
 summary.push({
  course:spec.label,
  bankItems:bank.length,
  reviewedItems:entries.length,
  reviewedItemPct:Number((100*entries.length/bank.length).toFixed(1)),
  distractorRationales:distractors,
  yearSpanCoverage:`${coveredKeys.size}/${spec.expectedCoverageKeys.length}`
 });
}
if(failures.length){
 console.error("DISTRACTOR QUALITY & MISCONCEPTION MAPPING V1: FAIL");
 failures.forEach(x=>console.error("- "+x));
 process.exit(1);
}
console.log("DISTRACTOR QUALITY & MISCONCEPTION MAPPING V1: PASS");
console.log(JSON.stringify({
 reviewedItems:summary.reduce((n,x)=>n+x.reviewedItems,0),
 distractorRationales:summary.reduce((n,x)=>n+x.distractorRationales,0),
 courses:summary
},null,2));

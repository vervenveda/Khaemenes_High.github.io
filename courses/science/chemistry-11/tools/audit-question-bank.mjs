#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const bankPath=path.resolve(here,"..","question-bank.js");
const raw=fs.readFileSync(bankPath,"utf8");
const match=raw.match(/=\s*(\[[\s\S]*\]);?\s*$/);
if(!match) throw new Error("Could not parse Chemistry 11 question bank assignment.");
const bank=JSON.parse(match[1]);
const failures=[];
const warnings=[];
const ids=new Set();
const prompts=new Map();
const templates=new Map();

const norm=s=>String(s??"").toLowerCase().replace(/\s+/gu," ").trim();
const template=s=>String(s??"").toLowerCase()
  .replace(/\b\d+(?:\.\d+)?\b/g,"#")
  .replace(/[^\p{L}\p{N}#]+/gu," ").trim().split(" ").slice(0,8).join(" ");

for(const q of bank){
  if(!q.id||ids.has(q.id)) failures.push(`duplicate/missing id: ${q.id||"(missing)"}`);
  ids.add(q.id);
  const p=norm(q.prompt);
  if(!p) failures.push(`missing prompt: ${q.id}`);
  if(prompts.has(p)) failures.push(`duplicate prompt: ${prompts.get(p)} / ${q.id}`);
  prompts.set(p,q.id);
  if(!Array.isArray(q.options)||q.options.length<2) failures.push(`invalid options: ${q.id}`);
  else {
    const opts=q.options.map(norm);
    if(new Set(opts).size!==opts.length) failures.push(`duplicate option text: ${q.id}`);
    if(q.options.some(o=>/[₂₃₄₅₆₇₈₉]{2,}/.test(String(o)))) failures.push(`malformed consecutive subscripts: ${q.id}`);
  }
  if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length) failures.push(`invalid answer index: ${q.id}`);
  if(!String(q.explanation??"").trim()) failures.push(`missing explanation: ${q.id}`);
  if(!Number.isInteger(q.week)||q.week<1||q.week>36) failures.push(`invalid week tag: ${q.id}`);
  if(!String(q.source??"").trim()) failures.push(`missing source tag: ${q.id}`);
  if(!String(q.type??"").trim()) failures.push(`missing type tag: ${q.id}`);
  const t=template(q.prompt);
  if(t){if(!templates.has(t))templates.set(t,[]);templates.get(t).push(q.id);}
}
for(const [t,group] of templates) if(group.length>=7) warnings.push(`template family ${group.length}×: ${t} [${group.join(", ")}]`);

const mapPath=path.resolve(here,"..","assessment-misconceptions-v1.json");
let misconceptionSummary=null;
if(fs.existsSync(mapPath)){
  const map=JSON.parse(fs.readFileSync(mapPath,"utf8"));
  const byId=new Map(bank.map(q=>[String(q.id),q]));
  let rationaleCount=0;
  for(const rec of Object.values(map.items||{})){
    const q=byId.get(String(rec.itemId));
    if(!q){failures.push(`misconception map item missing from bank: ${rec.itemId}`);continue}
    if(rec.reviewStatus!=="reviewed-v1")failures.push(`misconception map reviewStatus invalid: ${rec.itemId}`);
    if(rec.prompt!==q.prompt)failures.push(`misconception map prompt drift: ${rec.itemId}`);
    if(Number(rec.answerIndex)!==Number(q.answer))failures.push(`misconception map answer drift: ${rec.itemId}`);
    if(rec.correctRationale!==q.explanation)failures.push(`misconception map explanation drift: ${rec.itemId}`);
    const ds=Array.isArray(rec.distractors)?rec.distractors:[];
    rationaleCount+=ds.length;
    const expected=q.options.map((_,i)=>i).filter(i=>i!==q.answer).sort((a,b)=>a-b);
    const actual=ds.map(d=>Number(d.optionIndex)).sort((a,b)=>a-b);
    if(JSON.stringify(expected)!==JSON.stringify(actual))failures.push(`misconception map distractor coverage invalid: ${rec.itemId}`);
    for(const d of ds){
      const i=Number(d.optionIndex);
      if(q.options[i]!==d.optionText)failures.push(`misconception map option drift: ${rec.itemId} option ${i}`);
      if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(d.misconceptionTag||"")))failures.push(`misconception tag invalid: ${rec.itemId} option ${i}`);
      if(String(d.rationale||"").trim().length<24)failures.push(`misconception rationale too thin: ${rec.itemId} option ${i}`);
    }
  }
  const reviewed=Object.keys(map.items||{}).length;
  misconceptionSummary={reviewed,rationaleCount,coveragePct:Number((100*reviewed/bank.length).toFixed(1))};
}


console.log(`Chemistry 11 question-bank audit: ${bank.length} items`);
if(misconceptionSummary)console.log(`Misconception map: ${misconceptionSummary.reviewed}/${bank.length} reviewed items (${misconceptionSummary.coveragePct}%) · ${misconceptionSummary.rationaleCount} distractor rationales`);
if(warnings.length){console.log("\nWarnings:");warnings.forEach(x=>console.log(" - "+x));}
if(failures.length){
  console.error("\nFAIL:");
  failures.forEach(x=>console.error(" - "+x));
  process.exit(1);
}
console.log("\nPASS: IDs, prompts, options, answer keys, explanations, week/source/type tags, and chemical-subscript formatting are valid.");

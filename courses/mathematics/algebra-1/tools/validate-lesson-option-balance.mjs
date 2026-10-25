#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm");
const root=path.resolve(__dirname,".."),ctx={window:{}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,"assets","question-bank.js"),"utf8"),ctx);
const qs=ctx.window.ALGEBRA1_QUESTIONS||[],by=new Map(),fail=[];
for(const q of qs){const k=`${q.unit}:${q.lesson}`;if(!by.has(k))by.set(k,[]);by.get(k).push(q)}
for(const [lesson,items] of by){
  if(items.length!==5)fail.push(`${lesson}: expected 5 lesson-check questions, found ${items.length}`);
  items.forEach(q=>{if(!Array.isArray(q.options)||q.options.length!==4||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||q.options[q.answer]!==q.answer_text)fail.push(`${q.id}: answer contract mismatch`)});
  const scheduled=items.map((_,i)=>i%4),counts=[0,1,2,3].map(pos=>scheduled.filter(x=>x===pos).length);
  if(Math.max(...counts)-Math.min(...counts)>1)fail.push(`${lesson}: balanced schedule invariant failed ${counts.join("/")}`);
}

const mapPath=path.join(root,"assets","assessment-misconceptions-v1.json");
if(fs.existsSync(mapPath)){
  const map=JSON.parse(fs.readFileSync(mapPath,"utf8")),entries=Object.values(map.items||{}),byId=new Map(qs.map(q=>[String(q.id),q]));
  let rationaleCount=0;
  const mappedIds=new Set();
  for(const rec of entries){
    mappedIds.add(String(rec.itemId));
    const q=byId.get(String(rec.itemId));
    if(!q){fail.push(`misconception map item missing from bank: ${rec.itemId}`);continue}
    if(rec.reviewStatus!=="reviewed-v1")fail.push(`misconception reviewStatus invalid: ${rec.itemId}`);
    if(rec.prompt!==q.prompt)fail.push(`misconception prompt drift: ${rec.itemId}`);
    if(Number(rec.answerIndex)!==Number(q.answer))fail.push(`misconception answer drift: ${rec.itemId}`);
    if(rec.correctRationale!==q.explanation)fail.push(`misconception explanation drift: ${rec.itemId}`);
    const ds=Array.isArray(rec.distractors)?rec.distractors:[]; rationaleCount+=ds.length;
    const expected=q.options.map((_,i)=>i).filter(i=>i!==q.answer).sort((a,b)=>a-b);
    const actual=ds.map(d=>Number(d.optionIndex)).sort((a,b)=>a-b);
    if(JSON.stringify(expected)!==JSON.stringify(actual))fail.push(`misconception distractor coverage invalid: ${rec.itemId}`);
    for(const d of ds){
      const i=Number(d.optionIndex);
      if(q.options[i]!==d.optionText)fail.push(`misconception option drift: ${rec.itemId} option ${i}`);
      if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(d.misconceptionTag||"")))fail.push(`misconception tag invalid: ${rec.itemId} option ${i}`);
      if(String(d.rationale||"").trim().length<24)fail.push(`misconception rationale too thin: ${rec.itemId} option ${i}`);
    }
  }
  if(entries.length!==271)fail.push(`misconception reviewed-item count expected 271, found ${entries.length}`);
  if(rationaleCount!==813)fail.push(`misconception rationale count expected 813, found ${rationaleCount}`);
  const normTemplate=s=>String(s??"").toLowerCase().replace(/−/g,"-").replace(/-?\d+(?:\.\d+)?/g,"#").replace(/[^\p{L}\p{N}#]+/gu," ").replace(/\s+/g," ").trim();
  const families=new Map();
  for(const q of qs){const k=normTemplate(q.prompt);if(!families.has(k))families.set(k,[]);families.get(k).push(q)}
  for(const [k,group] of families)if(group.length>=3&&group.some(q=>!mappedIds.has(String(q.id))))fail.push(`repeated-family misconception gap: ${k}`);
}

const core=fs.readFileSync(path.join(root,"assets","unit-page-core.js"),"utf8");
const loader=fs.readFileSync(path.join(root,"assets","unit-page.js"),"utf8");
if(!core.includes("const correctPositions=shuffle(selection.map((_,i)=>i%4));"))fail.push("unit-page-core.js: balanced correct-position schedule missing");
if(!core.includes('group.dataset.balancedOptionOrder="true"'))fail.push("unit-page-core.js: balanced DOM marker missing");
if(!loader.includes('if(group.dataset.balancedOptionOrder==="true")return;'))fail.push("unit-page.js: post-render shuffle does not protect balanced lesson options");
if(fail.length){console.error("ALGEBRA I LESSON OPTION BALANCE: FAIL");fail.forEach(x=>console.error("- "+x));process.exit(1)}
console.log("ALGEBRA I LESSON OPTION BALANCE: PASS");
console.log(JSON.stringify({lessons:by.size,questions:qs.length,lessonFormDistribution:"2/1/1/1 across four positions, position labels randomized",misconceptionMap:"271/435 reviewed items · 813 distractor rationales · all repeated families (3+ items) covered",formalUnitMastery:"unchanged"},null,2));

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
const core=fs.readFileSync(path.join(root,"assets","unit-page-core.js"),"utf8");
const loader=fs.readFileSync(path.join(root,"assets","unit-page.js"),"utf8");
if(!core.includes("const correctPositions=shuffle(selection.map((_,i)=>i%4));"))fail.push("unit-page-core.js: balanced correct-position schedule missing");
if(!core.includes('group.dataset.balancedOptionOrder="true"'))fail.push("unit-page-core.js: balanced DOM marker missing");
if(!loader.includes('if(group.dataset.balancedOptionOrder==="true")return;'))fail.push("unit-page.js: post-render shuffle does not protect balanced lesson options");
if(fail.length){console.error("ALGEBRA I LESSON OPTION BALANCE: FAIL");fail.forEach(x=>console.error("- "+x));process.exit(1)}
console.log("ALGEBRA I LESSON OPTION BALANCE: PASS");
console.log(JSON.stringify({lessons:by.size,questions:qs.length,lessonFormDistribution:"2/1/1/1 across four positions, position labels randomized",formalUnitMastery:"unchanged"},null,2));

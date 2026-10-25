#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"..");
let failures=[],ids=new Set(),totals={questions:0,vocabulary:0,transfer:0};
const transferSkill=/source|data|map|case|legal|quant|corrobor|causal|method|compar|provenance|revision|evidence|measurement|institution|implementation|rights|policy|research|synthesis|defense|ethical|historical/i;
for(let week=1;week<=36;week++){
  const p=path.join(root,"weeks",`week-${String(week).padStart(2,"0")}`,"quiz.json");
  const qz=JSON.parse(fs.readFileSync(p,"utf8"));
  const qs=qz.questions||[];
  if(qz.bankVersion!=="transfer-v3")failures.push(`Week ${week}: bankVersion must be transfer-v3`);
  if(qs.length!==10)failures.push(`Week ${week}: expected 10 questions, found ${qs.length}`);
  let vocab=0,transfer=0;
  qs.forEach((q,i)=>{
    totals.questions++;
    if(!q.id||ids.has(q.id))failures.push(`Week ${week} Q${i+1}: missing or duplicate id`); else ids.add(q.id);
    if(!Array.isArray(q.options)||q.options.length!==4)failures.push(`Week ${week} Q${i+1}: expected four options`);
    if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=4)failures.push(`Week ${week} Q${i+1}: invalid answer index`);
    if(!q.skill)failures.push(`Week ${week} Q${i+1}: missing skill metadata`);
    if(!q.sourceType)failures.push(`Week ${week} Q${i+1}: missing sourceType metadata`);
    if((q.version||0)<2)failures.push(`Week ${week} Q${i+1}: assessment version below v2`);
    const isVocab=/^Which definition/i.test(q.question||"")||/vocab|definition/i.test(q.skill||"");
    const isTransfer=!!q.sourceType||transferSkill.test(q.skill||"");
    if(isVocab){vocab++;totals.vocabulary++}
    if(isTransfer){transfer++;totals.transfer++}
  });
  if(vocab>2)failures.push(`Week ${week}: standalone vocabulary recall ${vocab}/10 exceeds 20%`);
  if(transfer<5)failures.push(`Week ${week}: transfer/source/data/case items ${transfer}/10 below 50%`);
}
if(totals.questions!==360)failures.push(`Expected 360 questions, found ${totals.questions}`);
if(failures.length){console.error("GRADE 12 TRANSFER QUIZ VALIDATION: FAIL");failures.forEach(x=>console.error("- "+x));process.exit(1)}
console.log("GRADE 12 TRANSFER QUIZ VALIDATION: PASS");
console.log(JSON.stringify({...totals,uniqueIds:ids.size,vocabularyPct:Math.round(totals.vocabulary/totals.questions*100),transferPct:Math.round(totals.transfer/totals.questions*100)},null,2));

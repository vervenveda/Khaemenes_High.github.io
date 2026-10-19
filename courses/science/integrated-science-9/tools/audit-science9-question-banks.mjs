import fs from "node:fs";
import vm from "node:vm";

const base=new URL("../units/",import.meta.url);
let banks=0,questions=0;
const sourceTotals={quiz:0,assessment:0};
const findings=[];
const globalIds=new Set();

function normalizePrompt(value){
  return String(value??"").normalize("NFKC").toLowerCase().replace(/\s+/gu," ").trim();
}
function normalizeOption(value){
  // Preserve capitalization and scientific notation. Alleles/genotypes such as RR, Rr, and rr are distinct.
  return String(value??"").normalize("NFKC").replace(/\s+/gu," ").trim();
}
function loadBank(source,file){
  const match=source.match(/window\.KhaemenesScience9QuestionBanks\["unit-\d{2}"\]\s*=\s*(\[[\s\S]*\])\s*;?\s*$/);
  if(!match){
    findings.push(file+": canonical shared question-bank assignment not found");
    return null;
  }
  try{
    const rows=JSON.parse(match[1]);
    if(!Array.isArray(rows))throw new Error("payload is not an array");
    return rows;
  }catch(error){
    findings.push(file+": invalid shared question-bank JSON ("+error.message+")");
    return null;
  }
}

for(let u=1;u<=12;u++){
  const n=String(u).padStart(2,"0");
  const relative="unit-"+n+"/question-bank.js";
  const source=fs.readFileSync(new URL(relative,base),"utf8");
  new vm.Script(source,{filename:relative});
  const rows=loadBank(source,relative);
  if(!rows)continue;
  banks++;
  questions+=rows.length;

  if(rows.length<50){
    findings.push(relative+": expected an abundant bank of at least 50 items, found "+rows.length);
  }
  const ids=new Set(),prompts=new Set(),bySource={quiz:0,assessment:0};
  rows.forEach((q,i)=>{
    const label=q?.id||("row "+(i+1));
    if(!q||typeof q!=="object"||Array.isArray(q)){
      findings.push(relative+" "+label+": item is not an object");
      return;
    }
    if(typeof q.id!=="string"||!q.id.trim()){
      findings.push(relative+" "+label+": missing stable question ID");
    }else{
      if(ids.has(q.id))findings.push(relative+" "+q.id+": duplicate ID within unit");
      if(globalIds.has(q.id))findings.push(relative+" "+q.id+": duplicate ID across unit banks");
      ids.add(q.id);globalIds.add(q.id);
    }
    const prompt=normalizePrompt(q.prompt);
    if(!prompt){
      findings.push(relative+" "+label+": missing prompt");
    }else if(prompts.has(prompt)){
      findings.push(relative+" "+label+": duplicate normalized prompt");
    }else prompts.add(prompt);

    if(!Array.isArray(q.options)||q.options.length<2){
      findings.push(relative+" "+label+": fewer than two answer options");
    }else{
      const optionKeys=q.options.map(normalizeOption);
      if(new Set(optionKeys).size!==optionKeys.length){
        findings.push(relative+" "+label+": repeated option text");
      }
      if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length){
        findings.push(relative+" "+label+": answer index outside option range");
      }
    }
    if(typeof q.explanation!=="string"||!q.explanation.trim()){
      findings.push(relative+" "+label+": missing explanation");
    }
    if(q.source!=="quiz"&&q.source!=="assessment"){
      findings.push(relative+" "+label+": unknown or missing source class");
    }else{
      bySource[q.source]++;
      sourceTotals[q.source]++;
    }
  });
  if(bySource.quiz<20)findings.push(relative+": quiz source should have at least 20 bank items; found "+bySource.quiz);
  if(bySource.assessment<30)findings.push(relative+": assessment source should have at least 30 bank items; found "+bySource.assessment);
}
const report={
  banks,
  questions,
  questionsBySource:sourceTotals,
  structuralFindings:findings.slice(0,50),
  findingCount:findings.length,
  contract:"Audit the canonical shared bank imported by the Monte Carlo engine; quizzes and assessments sample from source-tagged items rather than embedding private arrays."
};
console.log(JSON.stringify(report,null,2));
if(banks!==12||findings.length)process.exitCode=1;

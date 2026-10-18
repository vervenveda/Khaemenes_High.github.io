#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const scienceRoot=path.resolve(here,"..");
const repoRoot=path.resolve(scienceRoot,"..","..");
const failures=[],warnings=[],passes=[];
const exists=p=>fs.existsSync(p);
const read=p=>fs.readFileSync(p,"utf8");
const rel=p=>path.relative(repoRoot,p).replaceAll(path.sep,"/");
const need=(ok,msg)=>(ok?passes:failures).push(msg);
const warn=(ok,msg)=>{if(!ok)warnings.push(msg)};
const norm=s=>String(s??"").toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim();

function parseAssignedArray(file){
  const raw=read(file),m=raw.match(/=\s*(\[[\s\S]*\]);?\s*$/);
  if(!m)throw new Error("Could not parse assigned JSON array: "+rel(file));
  return JSON.parse(m[1]);
}
function auditBank(file,label,{min=1}={}){
  need(exists(file),label+" bank exists");
  if(!exists(file))return;
  let bank;
  try{bank=parseAssignedArray(file)}catch(e){failures.push(label+" bank parse: "+e.message);return;}
  need(bank.length>=min,label+" bank size >= "+min+" ("+bank.length+")");
  const ids=new Set(),prompts=new Map();
  for(const q of bank){
    need(Boolean(q.id)&&!ids.has(q.id),label+" unique id "+String(q.id));
    ids.add(q.id);
    const p=norm(q.prompt);
    need(Boolean(p)&&!prompts.has(p),label+" unique prompt "+String(q.id));
    prompts.set(p,q.id);
    need(Array.isArray(q.options)&&q.options.length>=2,label+" options "+String(q.id));
    if(Array.isArray(q.options)){
      const opts=q.options.map(norm);
      need(new Set(opts).size===opts.length,label+" unique options "+String(q.id));
      need(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length,label+" answer index "+String(q.id));
    }
    need(Boolean(String(q.explanation??"").trim()),label+" explanation "+String(q.id));
  }
  return bank;
}
function auditUpperCourse(slug,label){
  const root=path.join(scienceRoot,slug);
  need(exists(path.join(root,"index.html")),label+" portal exists");
  let totalLessons=0;
  for(let w=1;w<=36;w++){
    const wp=String(w).padStart(2,"0"),week=path.join(root,"weeks","week-"+wp),index=path.join(week,"index.html");
    need(exists(index),label+" Week "+wp+" index exists");
    if(exists(index)){
      const c=read(index);
      for(let d=1;d<=5;d++)need(c.includes(`lessons/day-${String(d).padStart(2,"0")}.html`),label+" Week "+wp+" routes Day "+d);
      need(c.includes("course-entry-contract.js"),label+" Week "+wp+" entry contract");
      need(c.includes("learner-scope-v1.js"),label+" Week "+wp+" learner scope");
      need(c.includes("khae_high_science_evidence_v1"),label+" Week "+wp+" evidence namespace");
    }
    for(let d=1;d<=5;d++){
      const f=path.join(week,"lessons",`day-${String(d).padStart(2,"0")}.html`);
      need(exists(f),label+" Week "+wp+" Day "+d+" exists");
      if(exists(f)){
        totalLessons++;
        const c=read(f);
        warn(c.includes("high-school-learning-context-v1.js")||/stos\/mentor|Archaemenes/i.test(c),label+" Week "+wp+" Day "+d+" has shared learning context or static mentor");
        warn(c.includes("high-school-formative-evidence-v1.js")||/Lesson Evidence/i.test(c),label+" Week "+wp+" Day "+d+" has formative evidence bridge");
      }
    }
  }
  need(totalLessons===180,label+" has 180/180 daily modules ("+totalLessons+")");
  const portal=path.join(root,"index.html");
  if(exists(portal)){
    const c=read(portal);
    need(c.includes("monte-carlo-assessment-v1.js"),label+" portal uses Monte Carlo engine");
    need(c.includes("assessmentHistory"),label+" portal retains assessment history");
    need(/masteryScore|state\.mastery|mastery\s*:/.test(c),label+" portal has weekly mastery state");
    need(c.includes("Corrections/Reassessment"),label+" report distinguishes remediation from mastery");
    need(c.includes("Reviewed"),label+" report distinguishes review/evidence from mastery");
  }
  auditBank(path.join(root,"question-bank.js"),label,{min:180});
}
function auditGrade9(){
  const root=path.join(scienceRoot,"integrated-science-9");
  for(let u=1;u<=12;u++){
    const up=String(u).padStart(2,"0"),unit=path.join(root,"units","unit-"+up);
    const bank=auditBank(path.join(unit,"question-bank.js"),"Science 9 Unit "+up,{min:50});
    if(bank)need(bank.length===50,"Science 9 Unit "+up+" bank has exactly 50 items");
    for(const [name,count] of [["quiz-app.js",15],["assessment-app.js",25]]){
      const f=path.join(unit,name);need(exists(f),"Science 9 Unit "+up+" "+name+" exists");
      if(exists(f)){
        const c=read(f);
        need(c.includes("KhaeMonteCarloAssessment"),"Science 9 Unit "+up+" "+name+" uses Monte Carlo");
        need(c.includes("saveResponse"),"Science 9 Unit "+up+" "+name+" persists responses");
        need(c.includes("newAttempt"),"Science 9 Unit "+up+" "+name+" supports fresh attempts");
        need(c.includes("FORM_COUNT="+count),"Science 9 Unit "+up+" "+name+" form count "+count);
      }
    }
  }
  auditBank(path.join(root,"assessments","final-exam","final-question-bank.js"),"Science 9 final",{min:700});
  const finalIndex=path.join(root,"assessments","final-exam","index.html");
  need(exists(finalIndex),"Science 9 final index exists");
  if(exists(finalIndex)){
    const c=read(finalIndex);
    need(c.includes("KhaeMonteCarloAssessment")||c.includes("monte-carlo-assessment-v1.js"),"Science 9 final uses Monte Carlo");
    need(c.includes("openSession"),"Science 9 final persists generated form");
    need(c.includes("saveResponse"),"Science 9 final persists responses");
    need(c.includes("newAttempt"),"Science 9 final supports unseen-item retakes");
    need(/supervised|official/i.test(c),"Science 9 final states official/supervised boundary");
  }
}

auditGrade9();
auditUpperCourse("biology-10","Biology 10");
auditUpperCourse("chemistry-11","Chemistry 11");
auditUpperCourse("physics-engineering-12","Physics 12");

console.log("Khaemenes High School Science Regression Audit");
console.log("PASS checks:",passes.length);
console.log("Warnings:",warnings.length);
if(warnings.length){for(const x of warnings.slice(0,120))console.log("WARN:",x);if(warnings.length>120)console.log("WARN: ... "+(warnings.length-120)+" more");}
if(failures.length){
  console.error("FAIL checks:",failures.length);
  for(const x of failures.slice(0,200))console.error("FAIL:",x);
  if(failures.length>200)console.error("FAIL: ... "+(failures.length-200)+" more");
  process.exit(1);
}
console.log("RESULT: PASS");

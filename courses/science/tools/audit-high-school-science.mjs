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
const normOption=s=>String(s??"").normalize("NFKC").replace(/\s+/gu," ").trim(); // Preserve case: RR, Rr, and rr are different genotypes.
const sharedFormative=path.join(repoRoot,"courses","shared","high-school-formative-evidence-v1.js");
need(exists(sharedFormative),"shared formative evidence layer exists");
if(exists(sharedFormative))need(read(sharedFormative).includes("attachScienceInvestigationNotebook"),"science investigation loader exists in shared formative layer");
const sharedInquiry=path.join(scienceRoot,"inquiry-ledger","index.html");
need(exists(sharedInquiry),"shared Grades 10–12 inquiry ledger exists");

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
      const opts=q.options.map(normOption);
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
    need(c.includes("../inquiry-ledger/?course="+slug),label+" links shared inquiry-time ledger");
    need(c.includes("monte-carlo-assessment-v1.js"),label+" portal uses Monte Carlo engine");
    need(c.includes("assessmentHistory"),label+" portal retains assessment history");
    need(/masteryScore|state\.mastery|mastery\s*:/.test(c),label+" portal has weekly mastery state");
    need(c.includes("Corrections/Reassessment"),label+" report distinguishes remediation from mastery");
    need(c.includes("Reviewed"),label+" report distinguishes review/evidence from mastery");
  }
  const mapFile=path.join(root,"course-map.json");
  if(exists(mapFile)){
    try{
      const parsed=JSON.parse(read(mapFile)),weeks=Array.isArray(parsed)?parsed:(parsed.weeks||[]);
      const vague=weeks.filter(w=>/(open text|teacher-approved|trusted source|trusted educational|student-selected trusted|prepared micrographs)/i.test(String(w.reading||""))&&!/linked Deep Lesson|lesson page is the required reading/i.test(String(w.reading||"")));
      need(vague.length===0,label+" canonical Tuesday Deep Lesson reading contract ("+vague.length+" vague)");
    }catch(e){failures.push(label+" course map parse: "+e.message)}
  }
  if(slug==="biology-10"||slug==="physics-engineering-12"){
    need(c.includes("science-misconception-guidance-v1.js"),label+" loads reasoning diagnostic guidance");
    need(c.includes("diagnostic=window.KhaeScienceMisconceptionGuidance")||c.includes("const diagnostic=reviewed||window.KhaeScienceMisconceptionGuidance"),label+" practice corrections capture diagnostic route");
    need(c.includes("assessment-misconceptions-v1.js"),label+" loads reviewed anchor misconception map");
    const misconceptionFile=path.join(root,"assessment-misconceptions-v1.json");
    need(exists(misconceptionFile),label+" reviewed anchor misconception map exists");
    if(exists(misconceptionFile)){
      try{
        const map=JSON.parse(read(misconceptionFile));
        need(map?.schema==="khaemenes.assessment-misconception-map.v1",label+" misconception map schema");
        need(Number(map?.reviewedItemCount)>=50,label+" reviewed anchor misconception count >= 50 ("+String(map?.reviewedItemCount)+")");
        need(Object.keys(map?.items||{}).length===Number(map?.reviewedItemCount),label+" misconception map item count matches reviewed count");
        const bank=parseAssignedArray(path.join(root,"question-bank.js")),byId=new Map(bank.map(q=>[String(q.id),q]));
        let valid=true;
        for(const item of Object.values(map?.items||{})){
          const q=byId.get(String(item?.itemId||""));if(!q){valid=false;break}
          if(!Array.isArray(item?.distractors)||item.distractors.some(d=>!Number.isInteger(d?.optionIndex)||d.optionIndex<0||d.optionIndex>=q.options.length||d.optionIndex===q.answer||!String(d?.misconceptionTag||"").trim()||!String(d?.rationale||"").trim())){valid=false;break}
        }
        need(valid,label+" misconception distractor option indexes remain valid");
      }catch(e){failures.push(label+" misconception map parse: "+e.message)}
    }
  }
  auditBank(path.join(root,"question-bank.js"),label,{min:180});
}
function auditGrade9(){
  const root=path.join(scienceRoot,"integrated-science-9");
  const u01=path.join(root,"units","unit-01"),u01js=path.join(u01,"unit01.js");
  need(exists(u01js),"Science 9 Unit 01 identity adapter exists");
  if(exists(u01js)){
    const identity=read(u01js);
    need(identity.includes("Academy-first, legacy-preserving"),"Science 9 Unit 01 Academy-first identity adapter");
    need(identity.includes("if(academy?.learnerId)return String(academy.learnerId)"),"Science 9 Unit 01 Academy identity authority");
    need(identity.includes("return legacyActive()"),"Science 9 Unit 01 legacy recovery fallback preserved");
  }
  for(const rel of ["index.html","dataset-laboratory.html","investigation-design-task.html","paper-helicopter-investigation.html","student-record.html","mastery-quiz.html","unit-assessment.html",...Array.from({length:10},(_,i)=>"lessons/day-"+String(i+1).padStart(2,"0")+".html")]){
    const file=path.join(u01,rel);if(!exists(file))continue;const source=read(file),contract=source.indexOf("course-entry-contract.js"),unit=source.indexOf("unit01.js");
    if(unit>=0)need(contract>=0&&contract<unit,"Science 9 Unit 01 Academy identity contract before state on "+rel);
  }
  for(let u=1;u<=12;u++){
    const up=String(u).padStart(2,"0"),unit=path.join(root,"units","unit-"+up);
    const bank=auditBank(path.join(unit,"question-bank.js"),"Science 9 Unit "+up,{min:50});
    if(bank)need(bank.length>=50,"Science 9 Unit "+up+" bank has at least 50 items (abundant bank)");
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

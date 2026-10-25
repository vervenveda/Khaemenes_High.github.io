#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const failures=[],warnings=[],passes=[];
const exists=p=>fs.existsSync(path.join(root,p));
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const json=p=>JSON.parse(read(p));
const need=(ok,msg)=>(ok?passes:failures).push(msg);
const warn=(ok,msg)=>{if(!ok)warnings.push(msg)};
const uniq=a=>new Set(a).size===a.length;

function termShape(item){
 if(typeof item==="string")return {term:item,definition:""};
 return {term:String(item?.term??item?.en??"").trim(),definition:String(item?.definition??"").trim()};
}
function checkBank(file,label){
 need(exists(file),label+" exists");
 if(!exists(file))return null;
 let data;
 try{data=json(file)}catch(e){failures.push(label+" parses: "+e.message);return null}
 const raw=Array.isArray(data)?data:(Array.isArray(data.terms)?data.terms:[]);
 need(raw.length>0,label+" has terms");
 const labels=[];
 for(const item of raw){
  const t=termShape(item);
  need(Boolean(t.term),label+" term label present");
  labels.push(t.term.toLocaleLowerCase());
  if(typeof item!=="string")need(Boolean(t.definition),label+" definition for "+t.term);
 }
 need(uniq(labels),label+" has unique term labels");
 return data;
}

function auditEnglish(){
 for(const grade of [9,10,11,12]){
  const base="courses/language-arts/english-"+grade;
  const curriculumFile=base+"/curriculum.json";
  need(exists(curriculumFile),"English "+grade+" curriculum exists");
  if(!exists(curriculumFile))continue;
  let curriculum;
  try{curriculum=json(curriculumFile)}catch(e){failures.push("English "+grade+" curriculum parse: "+e.message);continue}
  const weeks=grade===9?curriculum.weekPlans:curriculum.weeks;
  need(Array.isArray(weeks)&&weeks.length===36,"English "+grade+" has 36 vocabulary-bearing weeks");
  const bankByUnit=new Map();
  for(let u=1;u<=12;u++){
   const file=base+"/units/unit-"+String(u).padStart(2,"0")+"/vocabulary.json";
   const bank=checkBank(file,"English "+grade+" Unit "+String(u).padStart(2,"0")+" vocabulary");
   if(bank)bankByUnit.set(u,bank);
  }
  if(Array.isArray(weeks)){
   for(const w of weeks){
    const no=Number(w.week||w.n),unit=Number(w.unit),assigned=w.vocabulary||w.vocab||[];
    need(Number.isInteger(no)&&no>=1&&no<=36,"English "+grade+" valid week number "+String(no));
    need(Array.isArray(assigned)&&assigned.length>=5,"English "+grade+" Week "+String(no)+" has at least five assigned terms");
    const bank=bankByUnit.get(unit),byTerm=new Map((bank?.terms||[]).map(t=>[String(t.term).toLocaleLowerCase(),t]));
    for(const term of assigned){
     const entry=byTerm.get(String(term).toLocaleLowerCase());
     need(Boolean(entry),"English "+grade+" Week "+String(no)+" maps term "+String(term));
     if(entry){
      need(Boolean(String(entry.definition||"").trim()),"English "+grade+" definition "+String(term));
      need(Array.isArray(entry.weeks)&&entry.weeks.includes(no),"English "+grade+" week metadata "+String(term)+" / "+String(no));
     }
    }
   }
  }
 }
 const regression="tests/vocabulary-studio-four-grade-regression.cjs";
 need(exists(regression),"English four-grade vocabulary regression exists");
}

function auditMath(){
 const configs={"pre-algebra":[0,13],"algebra-1":[1,13],"geometry":[1,13],"algebra-2":[1,13]};
 for(const [course,[start,end]] of Object.entries(configs)){
  for(let u=start;u<=end;u++){
   const file="courses/mathematics/"+course+"/units/unit-"+String(u).padStart(2,"0")+"/vocabulary.json";
   checkBank(file,course+" Unit "+String(u).padStart(2,"0")+" vocabulary");
  }
 }
 need(exists("courses/shared/math-lesson-vocabulary-link.js"),"Math lesson vocabulary bridge exists");
 need(exists("tools/validate-math-vocabulary.mjs"),"Math vocabulary validator exists");
 need(exists("tools/validate-math-lesson-vocabulary.mjs"),"Math lesson vocabulary validator exists");
 const bridge=exists("courses/shared/math-lesson-vocabulary-link.js")?read("courses/shared/math-lesson-vocabulary-link.js"):"";
 warn(/week/i.test(new URLSearchParams((bridge.match(/linkUrl\.search=new URLSearchParams\(([^)]*)\)/)||[])[1]||"").toString()),"Math bridge carries explicit week context");
 warn(bridge.includes("week"),"Math lesson vocabulary bridge remains unit-focused; week/lesson routing is still open");
}

function auditSocialStudies(){
 need(exists("courses/social-studies/grade-09/data/glossary.json"),"Social Studies 9 glossary exists");
 const ss9=checkBank("courses/social-studies/grade-09/data/vocabulary-studio.json","Social Studies 9 vocabulary studio bank");
 if(ss9){
  const covered=new Set();
  for(const item of ss9.terms||ss9.entries||[]){
   for(const w of (Array.isArray(item.weeks)?item.weeks:(item.week?[item.week]:[])))covered.add(Number(w));
  }
  need([...Array(36)].every((_,i)=>covered.has(i+1)),"Social Studies 9 vocabulary covers Weeks 1-36");
 }
 const covered10=new Set();
 for(let u=1;u<=8;u++){
  const file="courses/social-studies/grade-10/units/unit-"+String(u).padStart(2,"0")+"/vocabulary.json";
  const bank=checkBank(file,"Social Studies 10 Unit "+String(u).padStart(2,"0")+" vocabulary");
  for(const t of bank?.terms||[])if(t.week)covered10.add(Number(t.week));
 }
 need([...Array(36)].every((_,i)=>covered10.has(i+1)),"Social Studies 10 vocabulary covers Weeks 1-36");
 warn(exists("courses/social-studies/grade-11/data/vocabulary-studio.json")||exists("courses/social-studies/grade-11/units/unit-01/vocabulary.json"),"Social Studies 11 canonical vocabulary pathway is still open");
 warn(exists("courses/social-studies/grade-12/data/vocabulary-studio.json")||exists("courses/social-studies/grade-12/units/unit-01/vocabulary.json"),"Social Studies 12 canonical vocabulary pathway is still open");
}

function auditScience(){
 need(exists("courses/science/integrated-science-9/science-vocabulary-integration.js"),"Science 9 vocabulary integration exists");
 for(const [slug,label] of [["biology-10","Biology 10"],["chemistry-11","Chemistry 11"],["physics-engineering-12","Physics 12"]]){
  const has=exists("courses/science/"+slug+"/vocabulary.json")||exists("courses/science/"+slug+"/data/vocabulary.json")||exists("courses/science/"+slug+"/units/unit-01/vocabulary.json");
  warn(has,label+" canonical vocabulary pathway is still open");
 }
}

function auditStudio(){
 const file="courses/mathematics/tools/vocabulary-studio.html";
 need(exists(file),"Shared Vocabulary Studio exists");
 if(!exists(file))return;
 const s=read(file);
 need(/Practice does not update official mastery or assessment records|does not replace.*mastery|formative/i.test(s),"Vocabulary Studio preserves formative/mastery boundary");
 for(const c of ["pre-algebra","algebra-1","geometry","algebra-2","social-studies-09","social-studies-10","english-9","english-10","english-11","english-12"]){
  need(s.includes('value="'+c+'"')||s.includes('"'+c+'"'),"Vocabulary Studio exposes "+c);
 }
 for(const c of ["biology-10","chemistry-11","physics-engineering-12","social-studies-11","social-studies-12"]){
  warn(s.includes(c),"Vocabulary Studio route for "+c+" is still open");
 }
}

auditEnglish();
auditMath();
auditSocialStudies();
auditScience();
auditStudio();

console.log("Khaemenes High School Vocabulary Audit");
console.log("PASS checks:",passes.length);
console.log("Tracked open bubbles:",warnings.length);
for(const w of warnings)console.log("WARN:",w);
if(failures.length){
 console.error("FAIL checks:",failures.length);
 for(const f of failures)console.error("FAIL:",f);
 process.exit(1);
}
console.log("RESULT: PASS with tracked open bubbles");

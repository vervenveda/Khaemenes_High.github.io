/**
 * Khaemenes Academy English II–IV weekly quiz authority.
 * Default/--check: verify authored banks, canonical JSON, browser bundles, offline
 * fallbacks and cache release names. --write: regenerate those surfaces; never
 * touch any student records, assessment logic, mastery thresholds, or English 9.
 */
import fs from "node:fs";
import assert from "node:assert/strict";
const write=process.argv.includes("--write");
if(process.argv.some(a=>a.startsWith("--")&&!["--write","--check"].includes(a)))throw Error("Use --check or --write");
const courses=[
 {slug:"english-10",grade:10,title:"English II",global:"ELA10_COURSE"},
 {slug:"english-11",grade:11,title:"English III",global:"ENGLISH_11_CURRICULUM"},
 {slug:"english-12",grade:12,title:"English IV",global:"ENGLISH_12_CURRICULUM"}
];
const read=path=>fs.readFileSync(path,"utf8");
const save=(path,value)=>{if(write)fs.writeFileSync(path,value);};
const equal=(actual,expected,msg)=>assert.deepEqual(actual,expected,msg);
function fingerprint(value){
 let hash=2166136261;
 for(let i=0;i<value.length;i++)hash=Math.imul(hash^value.charCodeAt(i),16777619)>>>0;
 return hash.toString(16).padStart(8,"0");
}
function toQuestion(seed,week,course,kind){
 assert(Array.isArray(seed)&&seed.length===4,"Question authored-source row invalid");
 const [stem,choices,explanation,skill]=seed;
 assert(typeof stem==="string"&&stem.length>=25);
 assert(Array.isArray(choices)&&choices.length===4&&new Set(choices).size===4);
 assert(typeof explanation==="string"&&explanation.length>=15);
 assert(typeof skill==="string"&&skill.length>=3);
 const rotation=(week.week+course.grade+2*kind)%4;
 const rotated=[...choices.slice(4-rotation),...choices.slice(0,4-rotation)];
 return {
  question:course.title+" · Week "+String(week.week).padStart(2,"0")+" ("+week.title+"): "+stem,
  choices:rotated,answer:rotated.indexOf(choices[0]),explanation,skill
 };
}
let checked=0;
for(const course of courses){
 const base="courses/language-arts/"+course.slug+"/";
 const curriculumPath=base+"curriculum.json";
 const bank=JSON.parse(read(base+"assets/quiz-specific-bank.json"));
 assert.equal(bank.course,course.slug);
 assert.equal(bank.version,"v3-instructional");
 assert.equal(bank.rows.length,36);
 const current=JSON.parse(read(curriculumPath));
 const next=structuredClone(current);
 assert.equal(next.weeks.length,36);
 for(let i=0;i<36;i++){
  const week=next.weeks[i];
  assert.equal(week.week,i+1);
  assert.equal(week.quiz.length,5);
  assert.equal(bank.rows[i].length,2);
  for(let k=0;k<2;k++)week.quiz[k+3]=toQuestion(bank.rows[i][k],week,course,k);
 }
 next.quizBankVersion="2026-10-16-v3-instructional";
 if(!write)equal(current,next,course.slug+" canonical quiz drift");
 save(curriculumPath,JSON.stringify(next,null,2)+"\n");
 const browserPath=base+"assets/curriculum-data.js";
 const browser='window.'+course.global+' = '+JSON.stringify(next)+';\n';
 if(!write)assert.equal(read(browserPath),browser,course.slug+" browser curriculum drift");
 save(browserPath,browser);
 const pattern=/(<script type="application\/json" id="quiz-data">)([\s\S]*?)(<\/script>)/;
 for(let i=0;i<36;i++){
  const page=base+"weeks/week-"+String(i+1).padStart(2,"0")+"/index.html";
  const currentHtml=read(page);
  const match=currentHtml.match(pattern);
  assert(match,"Missing fallback quiz JSON: "+page);
  const expected=next.weeks[i].quiz;
  if(!write)equal(JSON.parse(match[2]),expected,"Offline fallback quiz drift: "+page);
  save(page,currentHtml.replace(pattern,(_whole,start,_old,end)=>start+JSON.stringify(expected)+end));
  checked++;
 }
 const swPath=base+"service-worker.js";
 const currentSw=read(swPath);
 const expectedName="khae-"+course.slug+"-ela-curriculum-20261016-v3-quiz72-"+fingerprint(JSON.stringify(bank.rows));
 const cacheRe=/(const CACHE_NAME = ")[^"]+(";)/;
 assert(cacheRe.test(currentSw),"Service worker cache name absent: "+course.slug);
 if(!write)assert(currentSw.includes('const CACHE_NAME = "'+expectedName+'";'),course.slug+" offline cache not bumped for bank");
 save(swPath,currentSw.replace(cacheRe,(_all,a,z)=>a+expectedName+z));
}
console.log("PASS: "+checked+" English 10–12 quiz pages, 216 authored prompts, canonical JS/JSON and offline fallback parity, deterministic cache stamps. Mode "+(write?"write":"check"));

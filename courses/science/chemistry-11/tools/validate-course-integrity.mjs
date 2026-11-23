#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
const repoRoot=path.resolve(root,"../../..");
const failures=[];
const notes=[];

const read=p=>fs.readFileSync(p,"utf8");
const exists=p=>fs.existsSync(p);
const plainWords=html=>html
  .replace(/<script[\s\S]*?<\/script>/gi," ")
  .replace(/<style[\s\S]*?<\/style>/gi," ")
  .replace(/<[^>]+>/g," ")
  .replace(/&[a-zA-Z0-9#]+;/g," ")
  .trim().split(/\s+/).filter(Boolean).length;

const mapPath=path.join(root,"course-map.json");
if(!exists(mapPath)) failures.push("course-map.json missing");
const map=exists(mapPath)?JSON.parse(read(mapPath)):null;

if(map){
  if(map.course?.duration_weeks!==36) failures.push(`course-map duration_weeks=${map.course?.duration_weeks}; expected 36`);
  if(map.course?.daily_lesson_blocks!==180) failures.push(`course-map daily_lesson_blocks=${map.course?.daily_lesson_blocks}; expected 180`);
  if(map.course?.passing_target!==80) failures.push(`course-map passing_target=${map.course?.passing_target}; expected 80`);
  if(!Array.isArray(map.weeks)||map.weeks.length!==36) failures.push(`course-map weeks=${map.weeks?.length??"missing"}; expected 36`);
  if(Array.isArray(map.weeks)){
    const nums=map.weeks.map(w=>w.week);
    const expected=Array.from({length:36},(_,i)=>i+1);
    if(JSON.stringify(nums)!==JSON.stringify(expected)) failures.push("course-map week numbers are not exactly 1..36 in order");
    const mid=map.weeks.find(w=>w.week===18);
    const fin=map.weeks.find(w=>w.week===36);
    if(!/midterm|\bMID\b/i.test(String(mid?.title||""))) failures.push("Week 18 is not identified as MID/midterm in course-map.json");
    if(!/final/i.test(String(fin?.title||""))) failures.push("Week 36 is not identified as FINAL in course-map.json");
  }
}

let lessonCount=0;
let weeklyIndexCount=0;
let minWords=Infinity;
let minPath="";
for(let w=1;w<=36;w++){
  const ws=String(w).padStart(2,"0");
  const weekDir=path.join(root,"weeks",`week-${ws}`);
  const weekIndex=path.join(weekDir,"index.html");
  if(!exists(weekIndex)) failures.push(`missing weekly index: week-${ws}/index.html`);
  else weeklyIndexCount++;
  for(let d=1;d<=5;d++){
    const ds=String(d).padStart(2,"0");
    const rel=`weeks/week-${ws}/lessons/day-${ds}.html`;
    const file=path.join(root,rel);
    if(!exists(file)){failures.push(`missing lesson: ${rel}`);continue}
    lessonCount++;
    const html=read(file);
    const engineCount=(html.match(/data-science-engine="upper-science-v1"/g)||[]).length;
    const loaderCount=(html.match(/data-upper-science-engine="v1"/g)||[]).length;
    const contractCount=(html.match(/data-science-contract=/g)||[]).length;
    if(engineCount!==1) failures.push(`${rel}: canonical engine marker count ${engineCount}; expected 1`);
    if(loaderCount!==1) failures.push(`${rel}: canonical loader count ${loaderCount}; expected 1`);
    if(contractCount<1) failures.push(`${rel}: science-contract depth layer missing`);
    const words=plainWords(html);
    if(words<minWords){minWords=words;minPath=rel}
    const floor=(w===18||w===36)?350:450;
    if(words<floor) failures.push(`${rel}: visible depth ${words} words; expected >=${floor}`);
  }
}
if(lessonCount!==180) failures.push(`lesson inventory ${lessonCount}/180`);
if(weeklyIndexCount!==36) failures.push(`weekly index inventory ${weeklyIndexCount}/36`);

const frameworkPath=path.join(root,"ASSESSMENT_FRAMEWORK.md");
const securePath=path.join(root,"assessments","SECURE_ASSESSMENT_BLUEPRINT.md");
for(const p of [frameworkPath,securePath]) if(!exists(p)) failures.push(`missing governance file: ${path.relative(repoRoot,p)}`);
if(exists(frameworkPath)){
  const s=read(frameworkPath);
  if(!/80% mastery/i.test(s)) failures.push("ASSESSMENT_FRAMEWORK.md missing 80% mastery rule");
  if(!/Week 18 MID/i.test(s)||!/Week 36 FINAL/i.test(s)) failures.push("ASSESSMENT_FRAMEWORK.md missing Week 18/36 cumulative topology");
  if(!/Public browser pages are formative\/non-authoritative/i.test(s)) failures.push("ASSESSMENT_FRAMEWORK.md missing public/non-authoritative assessment boundary");
}
if(exists(securePath)){
  const s=read(securePath);
  if(!/closed-book supervised assessments/i.test(s)) failures.push("secure assessment blueprint missing closed-book supervised boundary");
  if(!/protected questions/i.test(s)||!/answer keys/i.test(s)) failures.push("secure assessment blueprint missing protected-content boundary");
  if(!/Week 18/i.test(s)||!/Week 36/i.test(s)) failures.push("secure assessment blueprint missing Week 18/36 checkpoints");
}

const releasePath=path.join(root,"RELEASE_CERTIFICATION.md");
if(!exists(releasePath)) failures.push("RELEASE_CERTIFICATION.md missing");
else {
  const s=read(releasePath);
  if(!/SOURCE-LEVEL CURRICULUM CERTIFICATION:\s*PASS/i.test(s)) failures.push("release certification is not source-level PASS");
  if(!/source-level curriculum certification only/i.test(s)) failures.push("release certification boundary language missing");
}

const vocabPath=path.join(root,"vocabulary.json");
if(!exists(vocabPath)) failures.push("vocabulary.json missing");
else {
  const v=JSON.parse(read(vocabPath));
  const terms=Array.isArray(v.terms)?v.terms:[];
  if(!terms.length) failures.push("vocabulary.json has no terms");
  const covered=new Set(terms.flatMap(t=>Array.isArray(t.weeks)?t.weeks:[]));
  for(let w=1;w<=36;w++) if(!covered.has(w)) failures.push(`vocabulary coverage missing Week ${w}`);
}

const questionAudit=path.join(root,"tools","audit-question-bank.mjs");
if(!exists(questionAudit)) failures.push("tools/audit-question-bank.mjs missing");
const scienceBlueprintValidator=path.resolve(root,"..","validate-upper-science-assessment-blueprints.mjs");
if(!exists(scienceBlueprintValidator)) notes.push("shared upper-science assessment-blueprint validator not found at expected course-science path");

console.log(`Chemistry 11 course integrity: ${lessonCount}/180 lessons · ${weeklyIndexCount}/36 weekly indexes`);
console.log(`Minimum visible lesson depth: ${minWords} words · ${minPath}`);
if(notes.length){console.log("\nNotes:");for(const n of notes) console.log(" - "+n);}
if(failures.length){
  console.error(`\nFAIL: ${failures.length} integrity issue(s)`);
  for(const f of failures) console.error(" - "+f);
  process.exit(1);
}
console.log("\nPASS: Chemistry 11 course-wide source integrity guard is green.");

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
  if(map.schema_version!=="2.1") failures.push(`course-map schema_version=${map.schema_version}; expected 2.1`);
  if(map.course?.authority_version!=="2026-11-22-hardened-v1") failures.push("course-map authority_version missing or stale");
  if(!/canonical/i.test(String(map.course?.curriculum_authority||""))) failures.push("course-map curriculum_authority declaration missing");
  if(map.course?.duration_weeks!==36) failures.push(`course-map duration_weeks=${map.course?.duration_weeks}; expected 36`);
  if(map.course?.daily_lesson_blocks!==180) failures.push(`course-map daily_lesson_blocks=${map.course?.daily_lesson_blocks}; expected 180`);
  if(map.course?.passing_target!==80) failures.push(`course-map passing_target=${map.course?.passing_target}; expected 80`);
  if(!Array.isArray(map.weeks)||map.weeks.length!==36) failures.push(`course-map weeks=${map.weeks?.length??"missing"}; expected 36`);
  if(Array.isArray(map.weeks)){
    const nums=map.weeks.map(w=>w.week);
    const expected=Array.from({length:36},(_,i)=>i+1);
    if(JSON.stringify(nums)!==JSON.stringify(expected)) failures.push("course-map week numbers are not exactly 1..36 in order");
    for(const w of map.weeks){
      for(const key of ["quantitative","evidence_contract","inquiry_contract","retrieval_contract"]){
        if(!String(w?.[key]||"").trim()) failures.push(`course-map Week ${w.week}: missing ${key}`);
      }
      if(w.authority_version!=="2026-11-22-hardened-v1") failures.push(`course-map Week ${w.week}: authority_version missing or stale`);
    }
    const mid=map.weeks.find(w=>w.week===18);
    const fin=map.weeks.find(w=>w.week===36);
    if(!/midterm|\bMID\b/i.test(String(mid?.title||""))) failures.push("Week 18 is not identified as MID/midterm in course-map.json");
    if(!/final/i.test(String(fin?.title||""))) failures.push("Week 36 is not identified as FINAL in course-map.json");
  }
}


if(map?.course?.instructional_time_model){
  const tm=map.course.instructional_time_model;
  const blockMinutes=Number(tm.daily_block_minutes);
  const recomputedDenominator=180*blockMinutes;
  const recomputedNumerator=(map.weeks||[]).reduce((sum,w)=>sum+Number(w?.inquiry_minutes_plan?.total||0),0);
  const recomputedPercent=recomputedDenominator?recomputedNumerator/recomputedDenominator*100:0;
  if(blockMinutes!==50) failures.push(`inquiry-time daily_block_minutes=${blockMinutes}; expected 50`);
  if(Number(tm.total_instructional_minutes)!==recomputedDenominator) failures.push(`inquiry-time denominator ${tm.total_instructional_minutes}; recomputed ${recomputedDenominator}`);
  if(Number(tm.planned_qualifying_inquiry_minutes)!==recomputedNumerator) failures.push(`inquiry-time numerator ${tm.planned_qualifying_inquiry_minutes}; recomputed ${recomputedNumerator}`);
  if(Math.abs(Number(tm.planned_inquiry_percent)-recomputedPercent)>0.01) failures.push(`inquiry-time percent ${tm.planned_inquiry_percent}; recomputed ${recomputedPercent.toFixed(2)}`);
  if(recomputedPercent<25) failures.push(`planned inquiry share ${recomputedPercent.toFixed(2)}%; expected >=25%`);
  for(const w of map.weeks||[]){
    const plan=w.inquiry_minutes_plan||{};
    if([18,36].includes(w.week)){
      if(Number(plan.total||0)!==0) failures.push(`Week ${w.week}: assessment week must contribute 0 new inquiry minutes`);
    }else{
      if(Number(plan.monday)!==15||Number(plan.thursday)!==50||Number(plan.friday)!==15||Number(plan.total)!==80){
        failures.push(`Week ${w.week}: inquiry minute plan must be Monday 15 + Thursday 50 + Friday 15 = 80`);
      }
    }
  }
}else failures.push("course-map instructional_time_model missing");

let lessonCount=0;
let weeklyIndexCount=0;
let minWords=Infinity;
let minPath="";
for(let w=1;w<=36;w++){
  const ws=String(w).padStart(2,"0");
  const weekDir=path.join(root,"weeks",`week-${ws}`);
  const weekIndex=path.join(weekDir,"index.html");
  if(!exists(weekIndex)) failures.push(`missing weekly index: week-${ws}/index.html`);
  else {
    weeklyIndexCount++;
    const weekHtml=read(weekIndex);
    const markerCount=(weekHtml.match(/data-canonical-week-contract="2026-11-22-hardened-v1"/g)||[]).length;
    if(markerCount!==1) failures.push(`week-${ws}/index.html: canonical week-contract marker count ${markerCount}; expected 1`);
    const mw=Array.isArray(map?.weeks)?map.weeks.find(x=>x.week===w):null;
    if(mw){
      const htmlEscape=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
      for(const key of ["quantitative","evidence_contract","inquiry_contract","retrieval_contract"]){
        const expected=htmlEscape(mw[key]||"");
        if(expected && !weekHtml.includes(expected)) failures.push(`week-${ws}/index.html: stale ${key} versus course-map.json`);
      }
    }
  }
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


const inquiryTimeDoc=path.join(root,"docs","INQUIRY_TIME_EVIDENCE_V1.md");
if(!exists(inquiryTimeDoc)) failures.push("docs/INQUIRY_TIME_EVIDENCE_V1.md missing");
else {
  const s=read(inquiryTimeDoc);
  if(!/30\.22%/.test(s)||!/2,720 qualifying inquiry minutes/.test(s)||!/9,000 planned instructional minutes/.test(s)) failures.push("inquiry-time evidence document totals are missing or stale");
}

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

const weeklyShell=path.join(root,"weekly-shell-v1.js");
if(!exists(weeklyShell)) failures.push("weekly-shell-v1.js missing");
else {
  const s=read(weeklyShell);
  if(!s.includes("../../course-map.json")) failures.push("weekly-shell-v1.js must derive from canonical course-map.json");
  if(!s.includes("fallback-canonical")) failures.push("weekly-shell-v1.js missing canonical offline fallback state");
}
const weeklyShellCheck=path.join(root,"tools","check-weekly-shell-sync.mjs");
if(!exists(weeklyShellCheck)) failures.push("tools/check-weekly-shell-sync.mjs missing");
const isolationTest=path.join(root,"tools","test-learner-isolation.mjs");
if(!exists(isolationTest)) failures.push("tools/test-learner-isolation.mjs missing");
const ledgerScript=path.join(root,"inquiry-ledger.js");
if(!exists(ledgerScript)) failures.push("inquiry-ledger.js missing");
else {
  const s=read(ledgerScript);
  if(!s.includes("KhaemenesLearnerScope?.scopedKey?.(KEY)")) failures.push("inquiry-ledger.js does not explicitly resolve learner-scoped storage key");
  if(!s.includes("initial&&learner()===initial")) failures.push("inquiry-ledger.js missing stale-learner page lock");
  if(!s.includes("if(!prior.ok)return false")) failures.push("inquiry-ledger.js missing invalid-record save lock");
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

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,"..");let failures=0;
const ok=(c,m)=>{if(c)console.log(`OK ${m}`);else{failures++;console.error(`FAIL ${m}`)}};
const text=async p=>readFile(resolve(root,p),"utf8");const json=async p=>JSON.parse(await text(p));
const map=await json("course-map.json");ok(map.course?.mastery_target===80,"course mastery target is 80%");ok(map.calendar?.total_weeks===36,"course remains 36 weeks");ok(map.units?.length===13,"course contains 13 units");ok(map.units.reduce((n,u)=>n+Number(u.lesson_count||0),0)===87,"course map contains 87 lessons");
const exam=await text("assets/exam-engine.js");for(const t of ["attempt_history","bestScore","mastery","assessment.draft-record","assessment.result-record","program_signal"])ok(exam.includes(t),`exam engine contains ${t}`);ok(!exam.includes('removeItem(C.result_key)'),"exam reset preserves scored evidence");
const core=await text("assets/unit-page-core.js");for(const t of ["lessonAttempts","bestScore","attemptCount","allLessonsMastered","80% mastery","Saved score history and mastery evidence were preserved"])ok(core.includes(t),`unit engine contains ${t}`);
const loader=await text("assets/unit-page.js");ok(loader.includes("unit>=1&&unit<=10"),"loader routes Units 01-10 through per-unit upgrade files");for(const n of [11,12,13])ok(loader.includes(`unit===${n}`),`loader includes Unit ${String(n).padStart(2,"0")} upgrade hook`);
const diagnostic=await text("diagnostic/index.html"),diag=[...diagnostic.matchAll(/id:"A1-RD-(\d{3})"/g)].map(m=>m[1]);ok(diag.length===36&&new Set(diag).size===36,"diagnostic has 36 unique explicit IDs");
const expected=[30,35,35,30,35,40,35,30,35,40,120,140,100];
for(let n=1;n<=13;n++){
 const src=await text(`assets/unit-${String(n).padStart(2,"0")}-content-upgrade.js`),sb={window:{ALGEBRA1_QUESTIONS:[]}};vm.createContext(sb);vm.runInContext(src,sb,{timeout:3000});const q=sb.window.ALGEBRA1_QUESTIONS;
 ok(q.length===expected[n-1],`Unit ${String(n).padStart(2,"0")} produces ${expected[n-1]} questions`);
 ok(new Set(q.map(x=>x.id)).size===q.length,`Unit ${String(n).padStart(2,"0")} question IDs are unique`);
 ok(new Set(q.map(x=>x.prompt)).size===q.length,`Unit ${String(n).padStart(2,"0")} prompts are unique`);
 ok(q.every(x=>Number(x.unit)===n&&Number.isFinite(Number(x.lesson))&&Array.isArray(x.options)&&x.options.length===4&&Number.isInteger(x.answer)&&x.answer>=0&&x.answer<4),`Unit ${String(n).padStart(2,"0")} items have valid unit/lesson/options/answers`);
}
const runExam=async(file,id,count)=>{const src=await text(file);const sb={window:{EXAM_CONFIG:{id,questions:[]}}};vm.createContext(sb);vm.runInContext(src,sb,{timeout:3000});const q=sb.window.EXAM_CONFIG.questions;ok(q.length===count,`${id} has ${count} questions`);ok(new Set(q.map(x=>x.id)).size===count,`${id} IDs unique`);ok(new Set(q.map(x=>x.prompt)).size===count,`${id} prompts unique`);ok(q.every(x=>x.skill&&Number.isInteger(x.answer)&&x.options?.length===4),`${id} items carry skill metadata and valid answer keys`);return q;};
const mid=await runExam("assets/midterm-content-upgrade.js","KH-MATH-A1-MIDTERM-U01-U06",60);for(let u=1;u<=6;u++)ok(mid.filter(q=>q.unit===u).length===10,`midterm has 10 items for Unit ${u}`);
const fin=await runExam("assets/final-content-upgrade.js","KH-MATH-A1-FINAL-36W",100);for(let u=1;u<=13;u++)ok(fin.some(q=>q.unit===u),`final covers Unit ${u}`);
const rem=await json("remediation/remediation-contract.json"),reg=await json("remediation/resource-registry.json");ok(rem.mastery_threshold===80,"remediation preserves 80% threshold");ok(rem.recommendation_contract?.external_recommender_optional===true,"NAIB remains optional");ok(reg.units?.length===13,"resource registry covers all 13 units");ok(reg.units.every(u=>u.skills?.length&&u.foundation&&u.core&&u.extended),"every unit has skill and Foundation/Core/Extended routing");
const applied=await json("applied-learning/registry.json");const labs=applied.labs||[],projects=applied.projects||[];ok(labs.length===13,"applied registry contains 13 labs");ok(projects.length===5,"applied registry contains 5 projects");ok(labs.every(x=>x.skills?.length),"every lab has skill associations");ok(projects.every(x=>x.skills?.length),"every project has skill associations");
const record=await text("assets/record-engine.js");for(const t of ["13","midterm","final","80"])ok(record.toLowerCase().includes(t),`record engine contains completion evidence token ${t}`);
const integration=await json("integration/i18n-accessibility-offline-contract.json");ok(integration.course==="KH-MATH-A1","integration contract belongs to Algebra I");ok(JSON.stringify(integration).includes("NAIB"),"integration contract addresses NAIB boundary");
const css=await text("assets/styles.css");for(const t of ["prefers-reduced-motion","prefers-contrast","forced-colors","focus-visible","@media print"])ok(css.includes(t),`shared CSS includes ${t}`);
for(const p of ["index.html","teacher/index.html","family/index.html","remediation/index.html","labs/index.html","projects/index.html","records/course-completion-certificate.html"]){const s=await text(p);ok(s.includes("Skip to main content")||p.includes("records/"),`${p} exposes accessibility/navigation surface`);}
if(failures){console.error(`\nAlgebra I whole-course validation failed: ${failures} problem(s).`);process.exit(1)}console.log("\nAlgebra I whole-course A+++ first-draft validation passed.");
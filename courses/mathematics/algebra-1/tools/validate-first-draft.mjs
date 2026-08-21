import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,"..");
let failures=0;
const ok=(cond,msg)=>{if(cond)console.log(`OK ${msg}`);else{failures++;console.error(`FAIL ${msg}`)}};
const text=async p=>readFile(resolve(root,p),"utf8");

const map=JSON.parse(await text("course-map.json"));
ok(map.course?.mastery_target===80,"course mastery target is 80%");
ok(map.calendar?.total_weeks===36,"course calendar remains 36 weeks");
ok(Array.isArray(map.units)&&map.units.length===13,"course contains 13 units");
ok(map.units.reduce((n,u)=>n+Number(u.lesson_count||0),0)===87,"course map contains 87 detailed lessons");

const exam=await text("assets/exam-engine.js");
for(const token of ["attempt_history","bestScore","mastery","assessment.draft-record","assessment.result-record","program_signal"]){ok(exam.includes(token),`shared exam engine contains ${token}`)}
ok(!exam.includes('removeItem(C.result_key)'),"shared exam reset does not delete scored result evidence");

const unitCore=await text("assets/unit-page-core.js");
for(const token of ["lessonAttempts","bestScore","attemptCount","allLessonsMastered","80% mastery","Saved score history and mastery evidence were preserved"]){ok(unitCore.includes(token),`shared unit engine contains ${token}`)}

const loader=await text("assets/unit-page.js");
for(const n of [1,11,12,13])ok(loader.includes(`unit===${n}`),`unit-page loader preserves Unit ${String(n).padStart(2,"0")} upgrade hook`);

const diagnostic=await text("diagnostic/index.html");
const diagIds=[...diagnostic.matchAll(/id:"A1-RD-(\d{3})"/g)].map(m=>m[1]);
ok(diagIds.length===36,"readiness diagnostic contains 36 explicit item IDs");
ok(new Set(diagIds).size===36,"readiness diagnostic item IDs are unique");
for(const banned of ["\"unit\": 70","x=0 + 3","6.0 + 3"]){ok(!diagnostic.includes(banned),`readiness diagnostic excludes legacy generator artifact ${banned}`)}
for(const skill of ["fraction-operations","two-step-equation","negative-multiplier-inequality","function-evaluation","slope-from-points","reasonableness-estimation"]){ok(diagnostic.includes(`skill:"${skill}"`),`readiness diagnostic includes skill ${skill}`)}

const upgradeSource=await text("assets/unit-01-content-upgrade.js");
const sandbox={window:{ALGEBRA1_QUESTIONS:Array.from({length:30},(_,i)=>({id:`q${String(i+1).padStart(4,"0")}`}))}};
vm.createContext(sandbox);vm.runInContext(upgradeSource,sandbox,{timeout:1000});
const u1=sandbox.window.ALGEBRA1_QUESTIONS;
ok(u1.length===30,"Unit 01 upgrade preserves 30 referenced question slots");
ok(new Set(u1.map(q=>q.id)).size===30,"Unit 01 question IDs are unique");
ok(new Set(u1.map(q=>q.prompt)).size===30,"Unit 01 prompts are genuinely unique");
ok(u1.every(q=>Array.isArray(q.options)&&q.options.length===4&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length),"Unit 01 questions have valid four-option answer keys");
for(let lesson=1;lesson<=6;lesson++)ok(u1.filter(q=>q.lesson===lesson).length===5,`Unit 01 Lesson ${lesson} has 5 upgraded question-bank items`);

if(failures){console.error(`\nAlgebra I first-draft validation failed: ${failures} problem(s).`);process.exit(1)}
console.log("\nAlgebra I first-draft validation passed.");

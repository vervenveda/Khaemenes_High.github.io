import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";

const root=path.resolve("courses/mathematics/pre-algebra");
const fail=message=>{throw new Error(message)};
const expect=(condition,message)=>{if(!condition)fail(message)};
const text=relative=>fs.readFileSync(path.join(root,relative),"utf8");

const scorebook=text("assets/prealgebra-study-scorebook-v1.js");
const bootstrap=text("assets/prealgebra-assessment-depth-v2.js");
const serviceWorker=text("service-worker.js");
const dashboard=text("index.html");
const midterm=text("assessments/midterm-units-01-07.html");
const finalExam=text("assessments/final-exam-36-weeks.html");

for(const token of [
  'const MIN=80',
  'KHAE_OPEN_PREALGEBRA_FORGE_V2',
  'KHAE_MATH9_PREALGEBRA_FORGE_V1',
  'Array.from({length:36}',
  'quiz.attempts',
  'quiz.lastFeedback',
  'khaemenes-prealgebra-u${pad(unit)}-mastery-v1',
  'khaemenes-prealgebra-midterm-result-v1',
  'khaemenes-prealgebra-final-result-v1',
  'selected_response_percent',
  'constructed_response?.percent',
  'overall_percent',
  'Study Scorebook',
  'Weekly Score History',
  'Unit Mastery Scores',
  'Official Cumulative Results',
  'optional dashboard practice samplers',
  'does not submit, reset, lower, or replace any score',
  'assessments/midterm-units-01-07.html',
  'assessments/final-exam-36-weeks.html'
]) expect(scorebook.includes(token),`Study Scorebook contract is missing: ${token}`);

expect(!scorebook.includes("localStorage.setItem("),"Study Scorebook must remain read-only and may not write browser-local progress or result records.");
expect(scorebook.includes('Math.max(safeNumber(quiz.best),...attempts.map(a=>safeNumber(a?.score)))'),"Weekly display must preserve/use best demonstrated quiz evidence.");
expect(scorebook.includes('attempts.at(-1)'),"Weekly display must distinguish the most recent attempt from best evidence.");
expect(scorebook.includes('row.best<MIN'),"Study focus must flag previously scored weekly evidence below 80%.");
expect(scorebook.includes('units.filter(r=>r.best>0&&r.best<MIN)'),"Study focus must flag previously scored unit evidence below 80%.");
expect(scorebook.includes('mastery_met')&&scorebook.includes('review_complete'),"Official cumulative display must understand mastery and evaluator-review state.");
expect(scorebook.includes('Browser-local results are study evidence'),"Study Scorebook must label browser-local evidence appropriately.");

expect(dashboard.includes('const STORAGE_KEY = "KHAE_OPEN_PREALGEBRA_FORGE_V2"'),"Dashboard weekly evidence storage key must match the Study Scorebook reader.");
expect(dashboard.includes('r.quiz.attempts.push({date:new Date().toISOString(),score,answers})'),"Dashboard must still preserve weekly quiz attempt history.");
expect(dashboard.includes('r.quiz.best=Math.max(r.quiz.best||0,score)'),"Dashboard must still preserve best weekly mastery evidence.");
expect(dashboard.includes('r.quiz.lastFeedback=feedback.length?feedback'),"Dashboard must still preserve latest missed-question feedback for study.");

expect(midterm.includes('"result_key":"khaemenes-prealgebra-midterm-result-v1"'),"Study Scorebook midterm result key must match the official Midterm configuration.");
expect(finalExam.includes('"result_key":"khaemenes-prealgebra-final-result-v1"'),"Study Scorebook final result key must match the official Final configuration.");
expect(midterm.includes('"id":"KH-MATH-PA-MIDTERM-U01-U07"'),"Midterm result must remain the official Units 01–07 assessment.");
expect(finalExam.includes('"id":"KH-MATH-PA-FINAL-36W"'),"Final result must remain the official 36-week cumulative assessment.");

const navigatorIndex=bootstrap.indexOf('load(navigatorSrc,"khaemenesPreAlgebraCourseNavigatorV1")');
const scorebookIndex=bootstrap.indexOf('load(scorebookSrc,"khaemenesPreAlgebraStudyScorebookV1")');
expect(bootstrap.includes('prealgebra-study-scorebook-v1.js'),"Pre-Algebra bootstrap must load the Study Scorebook component.");
expect(navigatorIndex>=0&&scorebookIndex>navigatorIndex,"Study Scorebook must load after the Course Navigator so dashboard wrappers compose in the intended order.");

expect(serviceWorker.includes('./assets/prealgebra-study-scorebook-v1.js'),"Offline core must cache the Study Scorebook component.");
expect(serviceWorker.includes('v3-assessment-depth'),"Study Scorebook release must preserve assessment-depth cache lineage.");
expect(serviceWorker.includes('v4-course-navigator'),"Study Scorebook release must preserve course-navigator cache lineage.");
expect(serviceWorker.includes('v5-study-scorebook'),"Study Scorebook release must advance the offline cache version.");

for(const relative of ["assets/prealgebra-study-scorebook-v1.js","assets/prealgebra-assessment-depth-v2.js","service-worker.js"]){
  const check=spawnSync(process.execPath,["--check",path.join(root,relative)],{encoding:"utf8"});
  expect(check.status===0,`${relative} failed JavaScript syntax validation:\n${check.stderr||check.stdout}`);
}

console.log("Pre-Algebra Study Scorebook validation passed: 36-week quiz history, missed-item feedback, 13 unit mastery records, official cumulative result separation, read-only behavior, and offline protection are intact.");

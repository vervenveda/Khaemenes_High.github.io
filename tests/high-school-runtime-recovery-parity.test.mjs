import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read=p=>fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");

const corePages=[
 "index.html",
 "grades/grade-09/index.html","grades/grade-10/index.html","grades/grade-11/index.html","grades/grade-12/index.html",
 "grades/grade-09/student-profile/index.html","grades/grade-10/student-profile/index.html","grades/grade-11/student-profile/index.html","grades/grade-12/student-profile/index.html",
 "courses/mathematics/pre-algebra/index.html","courses/mathematics/algebra-1/index.html","courses/mathematics/geometry/index.html","courses/mathematics/algebra-2/index.html",
 "courses/language-arts/english-9/index.html","courses/language-arts/english-10/index.html","courses/language-arts/english-11/index.html","courses/language-arts/english-12/index.html",
 "courses/science/integrated-science-9/index.html","courses/science/biology-10/index.html","courses/science/chemistry-11/index.html","courses/science/physics-engineering-12/index.html",
 "courses/social-studies/grade-09/index.html","courses/social-studies/grade-10/index.html","courses/social-studies/grade-11/index.html","courses/social-studies/grade-12/index.html",
 "courses/physical-education/index.html","courses/electives/index.html"
];

const workers=[
 ["service-worker.js","khaemenes-high-v42-runtime-recovery-20261118"],
 ["courses/mathematics/pre-algebra/service-worker.js","v23-runtime-recovery-20261118"],
 ["courses/mathematics/algebra-1/service-worker.js","v45-runtime-recovery-20261118"],
 ["courses/mathematics/geometry/service-worker.js","v18-runtime-recovery-20261118"],
 ["courses/mathematics/algebra-2/service-worker.js","v14-runtime-recovery-20261118"],
 ["courses/language-arts/english-10/service-worker.js","khae-english10-v7-runtime-recovery-20261118"],
 ["courses/language-arts/english-11/service-worker.js","khae-english11-v7-runtime-recovery-20261118"],
 ["courses/language-arts/english-12/service-worker.js","khae-english12-v7-runtime-recovery-20261118"]
];

test("major High School landings avoid document MutationObservers",()=>{
 for(const path of corePages) assert.doesNotMatch(read(path),/new\s+MutationObserver/,path);
});

test("all active High School workers use recovery releases",()=>{
 for(const [path,version] of workers) assert.ok(read(path).includes(version),path+" missing "+version);
});

test("all active High School workers use network-first mutable runtime",()=>{
 for(const [path] of workers){
  const sw=read(path);
  assert.match(sw,/function (?:mutableRuntimeRequest|isMutableRuntime)/,path);
  assert.match(sw,/function networkFirst/,path);
  assert.match(sw,/destination==="script"/,path);
  assert.match(sw,/destination==="style"/,path);
  assert.match(sw,/cache:"no-store"/,path);
 }
});

test("course-specific worker entrances update and recover existing clients",()=>{
 const entrances=[
  "courses/mathematics/pre-algebra/index.html",
  "courses/mathematics/algebra-1/index.html",
  "courses/mathematics/geometry/index.html",
  "courses/mathematics/algebra-2/index.html",
  "courses/language-arts/english-10/index.html",
  "courses/language-arts/english-11/index.html",
  "courses/language-arts/english-12/index.html"
 ];
 for(const path of entrances){
  const page=read(path);
  assert.match(page,/updateViaCache:"none"/,path);
  assert.match(page,/registration\.update\(\)/,path);
  assert.match(page,/controllerchange/,path);
  assert.match(page,/location\.reload\(\)/,path);
 }
});

test("root High School entrance recovers the shared worker",()=>{
 const page=read("index.html");
 assert.match(page,/updateViaCache:"none"/);
 assert.match(page,/registration\.update\(\)/);
 assert.match(page,/controllerchange/);
 assert.match(page,/location\.reload\(\)/);
});

test("English 9 repeating timer is only the reading timer",()=>{
 const page=read("courses/language-arts/english-9/index.html");
 assert.equal((page.match(/setInterval\s*\(/g)||[]).length,1);
 assert.match(page,/readingTimer=setInterval\(updateTimerDisplay,1000\)/);
});

test("Electives loads High School navigation only once",()=>{
 const page=read("courses/electives/index.html");
 const loads=page.match(/<script[^>]+src=["']\.\.\/\.\.\/assets\/high-navigation-v1\.js["'][^>]*>/g)||[];
 assert.equal(loads.length,1);
});


const sharedWorkerDirectEntries=[
 "grades/grade-09/index.html","grades/grade-10/index.html","grades/grade-11/index.html","grades/grade-12/index.html",
 "grades/grade-09/student-profile/index.html","grades/grade-10/student-profile/index.html","grades/grade-11/student-profile/index.html","grades/grade-12/student-profile/index.html",
 "courses/language-arts/english-9/index.html",
 "courses/science/integrated-science-9/index.html","courses/science/biology-10/index.html","courses/science/chemistry-11/index.html","courses/science/physics-engineering-12/index.html",
 "courses/social-studies/grade-09/index.html","courses/social-studies/grade-10/index.html","courses/social-studies/grade-11/index.html","courses/social-studies/grade-12/index.html",
 "courses/physical-education/index.html","courses/electives/index.html"
];

test("all shared-worker direct entries load exactly one root recovery hook",()=>{
 for(const path of sharedWorkerDirectEntries){
  const page=read(path);
  const loads=page.match(/high-school-root-worker-recovery-v1\.js/g)||[];
  assert.equal(loads.length,1,path+" must load one root worker recovery hook");
 }
});

test("English 9 loads the left class-tools runtime only once",()=>{
 const page=read("courses/language-arts/english-9/index.html");
 const loads=page.match(/<script[^>]+src=["']\.\.\/\.\.\/shared\/high-school-class-tools-left-v1\.js["'][^>]*>/g)||[];
 assert.equal(loads.length,1);
});


const universalClassToolPages=[
 "courses/science/integrated-science-9/index.html","courses/science/biology-10/index.html","courses/science/chemistry-11/index.html","courses/science/physics-engineering-12/index.html",
 "courses/social-studies/grade-09/index.html","courses/social-studies/grade-10/index.html","courses/social-studies/grade-11/index.html","courses/social-studies/grade-12/index.html",
 "courses/physical-education/index.html","courses/electives/index.html"
];

test("non-math High School course landings load exactly one universal Class Tools runtime",()=>{
 for(const path of universalClassToolPages){
  const page=read(path);
  const loads=page.match(/high-school-class-tools-universal-v1\.js/g)||[];
  assert.equal(loads.length,1,path+" must load one universal Class Tools runtime");
 }
});

test("Grade 10 Social Studies uses centered-course desktop parity",()=>{
 const css=read("courses/social-studies/grade-10/styles.css");
 assert.match(css,/Grade 10 centered-course parity recovery/);
 assert.match(css,/\.app\{\s*display:block;/);
 assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
});


test("Algebra I diagnostic uses canonical assessment runtime without legacy journey theme",()=>{
 const page=read("courses/mathematics/algebra-1/diagnostic/index.html");
 assert.doesNotMatch(page,/academy-math-journey-v1/);
 assert.match(page,/math-assessment-workspace-v1\.css\?v=20261118-assessment-recovery-1/);
 assert.match(page,/exam-engine\.js\?v=20261118-assessment-recovery-1/);
 assert.match(page,/algebra1-worker-recovery-v1\.js/);
});


const mathAssessmentRecoverySets={
 "pre-algebra":{
  hook:"prealgebra-worker-recovery-v1.js",
  pages:[
   "courses/mathematics/pre-algebra/diagnostic/index.html",
   "courses/mathematics/pre-algebra/assessments/index.html",
   "courses/mathematics/pre-algebra/assessments/midterm-units-01-07.html",
   "courses/mathematics/pre-algebra/assessments/final-exam-36-weeks.html",
   "courses/mathematics/pre-algebra/units/unit-00/assessment/exit-mastery.html",
   ...Array.from({length:13},(_,i)=>`courses/mathematics/pre-algebra/units/unit-${String(i+1).padStart(2,"0")}/assessment/mastery-check.html`)
  ]
 },
 "algebra-1":{
  hook:"algebra1-worker-recovery-v1.js",
  pages:[
   "courses/mathematics/algebra-1/diagnostic/index.html",
   "courses/mathematics/algebra-1/readiness/index.html",
   "courses/mathematics/algebra-1/assessments/index.html",
   "courses/mathematics/algebra-1/assessments/weekly-mastery.html",
   "courses/mathematics/algebra-1/assessments/midterm-units-01-06.html",
   "courses/mathematics/algebra-1/assessments/final-exam-36-weeks.html",
   ...Array.from({length:13},(_,i)=>`courses/mathematics/algebra-1/units/unit-${String(i+1).padStart(2,"0")}/assessment/mastery-check.html`)
  ]
 },
 "geometry":{
  hook:"geometry-worker-recovery-v1.js",
  pages:[
   "courses/mathematics/geometry/diagnostic/index.html",
   "courses/mathematics/geometry/assessments/index.html",
   "courses/mathematics/geometry/assessments/weekly-mastery.html",
   "courses/mathematics/geometry/assessments/midterm.html",
   "courses/mathematics/geometry/assessments/final.html",
   "courses/mathematics/geometry/assessments/retention-lab.html",
   ...Array.from({length:13},(_,i)=>`courses/mathematics/geometry/units/unit-${String(i+1).padStart(2,"0")}/assessment/mastery-check.html`)
  ]
 },
 "algebra-2":{
  hook:"algebra2-worker-recovery-v1.js",
  pages:[
   "courses/mathematics/algebra-2/diagnostic/index.html",
   "courses/mathematics/algebra-2/assessments/index.html",
   "courses/mathematics/algebra-2/assessments/midterm.html",
   "courses/mathematics/algebra-2/assessments/final.html",
   ...Array.from({length:13},(_,i)=>`courses/mathematics/algebra-2/units/unit-${String(i+1).padStart(2,"0")}/assessment/mastery-check.html`)
  ]
 }
};

test("all interactive High School math assessment entries recover their course worker exactly once",()=>{
 for(const [course,config] of Object.entries(mathAssessmentRecoverySets)){
  for(const path of config.pages){
   const page=read(path);
   const loads=page.match(new RegExp(config.hook.replace(/[.*+?^$\{\}()|[\]\\]/g,"\\$&"),"g"))||[];
   assert.equal(loads.length,1,`${course}: ${path}`);
  }
 }
});

test("Geometry and Algebra II diagnostics use fresh cache-distinct assessment assets",()=>{
 const geometry=read("courses/mathematics/geometry/diagnostic/index.html");
 const algebra2=read("courses/mathematics/algebra-2/diagnostic/index.html");
 for(const [name,page] of [["geometry",geometry],["algebra2",algebra2]]){
  assert.match(page,/styles\.css\?v=20261118-assessment-recovery-1/,name);
  assert.match(page,/assessment-engine\.js\?v=20261118-assessment-recovery-1/,name);
 }
});

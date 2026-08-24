import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";

const root=path.resolve("courses/mathematics/pre-algebra");
const fail=message=>{throw new Error(message)};
const text=relative=>fs.readFileSync(path.join(root,relative),"utf8");
const json=relative=>JSON.parse(text(relative));
const expect=(condition,message)=>{if(!condition)fail(message)};

const course=json("course-map.json");
const units=(course.units||[]).filter(u=>Number(u.number)>=1&&Number(u.number)<=13).sort((a,b)=>Number(a.number)-Number(b.number));
expect(Number(course.course?.duration_weeks)===36,"Course map must preserve the official 36-week duration.");
expect(Number(course.course?.official_instructional_units)===13,"Course map must preserve 13 official instructional units.");
expect(units.length===13,"Course navigator requires exactly 13 official unit records.");
expect(units.reduce((sum,u)=>sum+Number(u.weeks||0),0)===36,"Official Unit 1–13 week durations must total 36.");

for(const unit of units){
  const n=String(Number(unit.number)).padStart(2,"0");
  const unitRoot=`units/unit-${n}`;
  const map=json(`${unitRoot}/unit-map.json`);
  expect(Number(map.unit?.number)===Number(unit.number),`Unit ${n} map number must match course-map.json.`);
  expect(typeof map.unit?.progress_key==="string"&&map.unit.progress_key.length>0,`Unit ${n} must expose its authoritative progress_key.`);
  expect(Array.isArray(map.lessons)&&map.lessons.length>0,`Unit ${n} must expose real lesson records for review navigation.`);
  for(const lesson of map.lessons){
    expect(typeof lesson.id==="string"&&lesson.id,`Unit ${n} contains a lesson without an id.`);
    expect(typeof lesson.file==="string"&&lesson.file,`Unit ${n} lesson ${lesson.id||"?"} lacks a canonical lesson file.`);
    expect(fs.existsSync(path.join(root,unitRoot,lesson.file)),`Unit ${n} lesson ${lesson.id} must resolve to a real canonical lesson file.`);
  }
  const assessmentFile=typeof map.assessment?.file==="string"&&map.assessment.file.trim()?map.assessment.file:"assessment/mastery-check.html";
  expect(fs.existsSync(path.join(root,unitRoot,assessmentFile)),`Unit ${n} must resolve to a real mastery assessment file (${assessmentFile}).`);
  const threshold=map.assessment?.threshold??map.unit?.mastery_threshold;
  expect(Number(threshold)===80,`Unit ${n} must explicitly preserve the 80% mastery threshold.`);
}

const nav=text("assets/prealgebra-course-navigator-v1.js");
const bootstrap=text("assets/prealgebra-assessment-depth-v2.js");
const serviceWorker=text("service-worker.js");

for(const token of [
  'COURSE_MAP_URL="course-map.json"',
  'Number(u.number)>=1&&Number(u.number)<=13',
  'progress_key',
  'lessonBestScores',
  'lessonLatestScores',
  'lessonAttempts',
  'khaemenes-prealgebra-u${pad(n)}-mastery-v1',
  'khaemenes-naib-readiness-profile-v1',
  'khaemenes-prealgebra-unit00-exit-v1',
  'Review lesson',
  'Prior lesson needs ${MIN}%',
  'Midterm Review Center',
  'Final Course Review',
  'Units 1–7',
  'Units 1–13',
  'assessments/midterm-units-01-07.html',
  'assessments/final-exam-36-weeks.html',
  'Midterm Practice Sampler',
  'Final Practice Sampler',
  'Optional dashboard practice',
  'does not erase, lower, or replace stored mastery evidence',
  'unit.map?.assessment?.file||"assessment/mastery-check.html"'
]) expect(nav.includes(token),`Course navigator contract is missing: ${token}`);

expect(!nav.includes("localStorage.setItem("),"Course navigator must remain read-only with respect to mastery/progress records.");
expect(nav.includes('unitMastered=allLessons&&unitBest>=MIN'),"A unit may be marked mastered only after lessons and the unit assessment satisfy mastery.");
expect(nav.includes('prior?.unitMastered?{open:true}'),"Future units must remain dependent on prior-unit mastery.");
expect(nav.includes('return !!record.rows[index-1]?.mastered'),"Future lessons must remain dependent on prior-lesson mastery.");
expect(nav.includes('Completed lessons stay open for study with their scores; future lessons remain mastery-gated.'),"Dashboard must explain historical review versus future gating.");
expect(nav.includes('reviewStatus(units,max)'),"Review centers must be derived from real unit lesson evidence.");
expect(nav.includes('max=mid?7:13'),"Midterm and final review scopes must remain Units 1–7 and Units 1–13.");

expect(bootstrap.includes('prealgebra-course-navigator-v1.js'),"Existing Pre-Algebra bootstrap must load the course navigator.");
expect(bootstrap.includes('khaemenesPreAlgebraCourseNavigatorV1'),"Navigator bootstrap must use a stable component id.");

for(const required of [
  './assets/prealgebra-assessment-depth-v2-core.js',
  './assets/prealgebra-course-gates-v1.js',
  './assets/prealgebra-course-navigator-v1.js'
]) expect(serviceWorker.includes(required),`Offline core must cache ${required}.`);
for(let i=1;i<=13;i++){
  const required=`./units/unit-${String(i).padStart(2,"0")}/unit-map.json`;
  expect(serviceWorker.includes(required),`Offline core must cache canonical ${required}.`);
}
expect(serviceWorker.includes('v4-course-navigator'),"Navigator release must advance the Pre-Algebra offline cache version.");

for(const relative of ["assets/prealgebra-course-navigator-v1.js","assets/prealgebra-assessment-depth-v2.js","service-worker.js"]){
  const check=spawnSync(process.execPath,["--check",path.join(root,relative)],{encoding:"utf8"});
  expect(check.status===0,`${relative} failed JavaScript syntax validation:\n${check.stderr||check.stdout}`);
}

console.log("Pre-Algebra Course Navigator validation passed: 36 weeks / 13 units, authoritative score review, canonical assessment fallback, fail-closed future navigation, cumulative midterm/final review boundaries, and offline navigator metadata are intact.");

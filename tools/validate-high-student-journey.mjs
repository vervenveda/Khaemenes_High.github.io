import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const failures=[];
const pass=(condition,message)=>{if(!condition)failures.push(message);else console.log("OK "+message)};

const catalog=read("courses/shared/high-school-eight-class.js");
pass(/const SUBJECTS=Object\.freeze\(\[/.test(catalog),"eight-subject schedule catalog exists");
for(const label of ["Mathematics","Science","Language Arts","Social Studies","PE / Health","Psychology / Life Skills","Foreign Language","Elective"])
 pass(catalog.includes(label),"eight-subject catalog contains "+label);
for(const grade of ["10","11","12"]){
 const data=JSON.parse(read("grades/grade-"+grade+"/course-catalog.json"));
 pass(data.schedule_contract?.totalSubjects===8,"Grade "+grade+" catalog declares eight subjects");
 pass(Array.isArray(data.schedule)&&data.schedule.length===8,"Grade "+grade+" catalog exposes eight schedule slots");
}

for(const grade of ["09","10","11","12"]){
 const page="grades/grade-"+grade+"/student-profile/index.html";
 pass(fs.existsSync(path.join(ROOT,page)),"Grade "+grade+" has a Student Profile home");
 const html=read(page);
 pass(html.includes("vnv-ecosystem-toolbar.js"),"Grade "+grade+" profile loads the official ecosystem toolbar");
}

const grade9Layout=read("grades/grade-09/student-profile/dashboard-layout.js");
pass(fs.existsSync("grades/grade-09/student-profile/schedule/index.html"),"Grade 09 owns the dedicated Schedule page");
pass(grade9Layout.includes('label:"Schedule",href:"schedule/"'),"Grade 09 toolbar opens the canonical Schedule page");
pass(grade9Layout.includes("grade09PinnedClasses"),"Grade 09 profile exposes pinned current classes");

const registry=read("grades/grade-09/student-profile/student-course-registry.js");
pass(registry.includes('FIRST_STEPS?.["pre-algebra"]'),"Pre-Algebra begins at its canonical readiness step");
pass(registry.includes("units/unit-01/lessons/lesson-01-algebraic-habits-notation-mathematical-argument.html"),"Passed Algebra I readiness advances to Unit 01 Lesson 01");
pass(registry.includes('repoPath("courses/science/integrated-science-9/units/unit-01/lessons/day-01.html")'),"Science continuation evidence advances to Unit 01 Lesson 01");
pass(registry.includes("window.KhaemenesLearningContinuation?.readLearner"),"Grade 09 reads learner-owned continuation records");

for(const grade of ["10","11","12"]){
 const classes=read("grades/grade-"+grade+"/student-profile/grade"+grade+"-profile-classes.js");
 pass(classes.includes("continuation=window.KhaemenesLearningContinuation"),"Grade "+grade+" class cards read learner continuation");
 pass(classes.includes("snap?.nextHref||slot.firstStepHref||slot.href"),"Grade "+grade+" class cards prefer continuation, then first step, then course home");
}
if(failures.length){
 console.error("\nHigh School four-grade student journey: FAILED");
 failures.forEach(x=>console.error(" - "+x));
 process.exit(1);
}
console.log("\nHigh School four-grade student journey: PASSED");
console.log("Flow: profile -> schedule -> class -> current instructional step, with readiness/mastery authority preserved.");

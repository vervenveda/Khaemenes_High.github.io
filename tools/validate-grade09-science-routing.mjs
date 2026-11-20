#!/usr/bin/env node
import fs from "node:fs";

const fail=[];
const courseDataPath="courses/science/integrated-science-9/science9-course-data-v1.js";
const continuationPath="courses/shared/high-school-science-continuation.js";
const registryPath="grades/grade-09/student-profile/student-course-registry.js";
const dailyPath="grades/grade-09/student-profile/daily-lessons/index.html";
const eightClassPath="courses/shared/high-school-eight-class.js";

const data=fs.readFileSync(courseDataPath,"utf8");
const weeks=[...data.matchAll(/"week":(\d+),"unitNumber":(\d+)/g)].map(m=>({week:Number(m[1]),unit:Number(m[2])}));
if(weeks.length!==36)fail.push("Science 9 course data must contain exactly 36 week records");
const byUnit=new Map();
for(const row of weeks)byUnit.set(row.unit,(byUnit.get(row.unit)||0)+1);
const expected=new Map([[0,1],[1,2],...Array.from({length:11},(_,i)=>[i+2,3])]);
for(const [unit,count] of expected){
 if(byUnit.get(unit)!==count)fail.push(`Unit ${String(unit).padStart(2,"0")} week count expected ${count}, found ${byUnit.get(unit)||0}`);
 const index=unit===0
  ?"courses/science/integrated-science-9/diagnostic/index.html"
  :`courses/science/integrated-science-9/units/unit-${String(unit).padStart(2,"0")}/index.html`;
 const html=fs.readFileSync(index,"utf8");
 const hrefs=[...new Set([...html.matchAll(/href=["']([^"']*lessons\/day-\d+\.html)["']/g)].map(m=>m[1]))];
 const want=count*5;
 if(hrefs.length!==want)fail.push(`${index} lesson links expected ${want}, found ${hrefs.length}`);
 if(!hrefs.includes("lessons/day-01.html"))fail.push(index+" missing day-01 lesson link");
 if(!hrefs.includes(`lessons/day-${String(want).padStart(2,"0")}.html`))fail.push(index+" missing final detailed lesson link");
}

const continuation=fs.readFileSync(continuationPath,"utf8");
for(const token of [
 'const VERSION="1.2.0"',
 "function science9DetailedLessonHref",
 'cfg.home+"diagnostic/lessons/day-"+day+".html"',
 'cfg.home+"units/unit-"+String(unit).padStart(2,"0")+"/lessons/day-"+day+".html"',
 'nextHref:science9DetailedLessonHref(cfg,w,dayIndex)'
]) if(!continuation.includes(token))fail.push("Science continuation missing "+token);
if(!continuation.includes('nextHref:cfg.home+"?view=week&week="+w'))fail.push("Weekly mastery/reassessment must remain in the Science 9 week workspace");

const registry=fs.readFileSync(registryPath,"utf8");
for(const token of [
 '["integrated-science-9","global-studies-9"].includes(course.id)',
 "window.KhaemenesLearningContinuation?.readLearner",
 'repoPath("courses/science/integrated-science-9/diagnostic/lessons/day-01.html")',
 "async function resolveContinueFor(id)"
]) if(!registry.includes(token))fail.push("Grade 09 course registry missing "+token);
if(registry.includes('repoPath("courses/science/integrated-science-9/units/unit-01/lessons/day-01.html")'))fail.push("Science 9 post-readiness fallback still skips Unit 00");

const daily=fs.readFileSync(dailyPath,"utf8");
if(!daily.includes("registry.resolveContinueFor(course.id)"))fail.push("Grade 09 Daily Lessons is not resolving course-owned continuation");
if(!daily.includes('data-launch-course="${course.id}"'))fail.push("Grade 09 Daily Lessons launch buttons are not course-owned");

const eight=fs.readFileSync(eightClassPath,"utf8");
if(!eight.includes('"integrated-science-9":"https://vervenveda.com/Khaemenes_High.github.io/courses/science/integrated-science-9/diagnostic/readiness-diagnostic.html"'))fail.push("Science 9 pre-readiness first step changed");

if(fail.length){
 console.error(JSON.stringify({status:"FAIL",fail},null,2));
 process.exit(1);
}
console.log(JSON.stringify({
 status:"PASS",
 scope:"Grade 09 Science 9 course continuation and detailed lesson routing",
 weeks:weeks.length,
 unit_lesson_contract:"Unit 00=5, Unit 01=10, Units 02-12=15",
 continuation:"first incomplete detailed lesson; weekly mastery remains in week workspace"
},null,2));
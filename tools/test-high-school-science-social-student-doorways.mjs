// Science and Social Studies · student-facing instructional doorway guard.
// Read-only checks only. Never touches assessment or learner storage.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const read=p=>fs.readFileSync(p,"utf8");
const exists=p=>fs.existsSync(p);
const root="https://vervenveda.com/Khaemenes_High.github.io/";
const sandbox={window:{}};
vm.runInNewContext(read("courses/shared/high-school-eight-class.js"),sandbox);
const first=sandbox.window.KhaemenesHighEightClass.FIRST_STEPS;
const routes={
 "integrated-science-9":"courses/science/integrated-science-9/diagnostic/readiness-diagnostic.html",
 "biology-10":"courses/science/biology-10/weeks/week-01/lessons/day-01.html",
 "chemistry-11":"courses/science/chemistry-11/weeks/week-01/lessons/day-01.html",
 "physics-engineering-12":"courses/science/physics-engineering-12/weeks/week-01/lessons/day-01.html",
 "global-studies-9":"courses/social-studies/grade-09/week-01/student-packet.html",
 "social-studies-10":"courses/social-studies/grade-10/week-01/student-packet.html",
 "social-studies-11":"courses/social-studies/grade-11/weeks/week-01/student-packet.html",
 "social-studies-12":"courses/social-studies/grade-12/weeks/week-01/student-packet.html"
};
for(const [id,path] of Object.entries(routes)){
 assert.equal(first[id],root+path,id+" first-step mismatch");
 assert.ok(exists(path),id+" instructional route missing");
}
for(const id of ["biology-10","chemistry-11","physics-engineering-12"]){
 const path="courses/science/"+id+"/weeks/week-02/lessons/day-01.html";
 assert.ok(exists(path),id+" Week 02 day-one lesson missing");
}
for(const grade of [10,11,12]){
 assert.ok(exists("courses/social-studies/grade-"+grade+"/weeks/week-02/student-packet.html"),"Social Studies "+grade+" Week 02 packet missing");
 const html=read("grades/grade-"+grade+"/student-profile/index.html");
 assert.ok(html.includes("grade09-blueprint-upper-grade.js?v="),"Grade "+grade+" needs new Class resolver version");
 const daily=read("grades/grade-"+grade+"/student-profile/daily-lessons/index.html");
 assert.ok(daily.includes('const scienceId=/^(biology-10|chemistry-11|physics-engineering-12)$/.test(slot.id||"");'),"Grade "+grade+" science Daily Lessons guard absent");
 assert.ok(daily.includes('const socialId=/^social-studies-(10|11|12)$/.test(slot.id||"");'),"Grade "+grade+" social Daily Lessons guard absent");
 assert.ok(daily.includes("const leaf=scienceId?"),"Grade "+grade+" native lesson mapping absent");
 assert.ok(daily.includes('if(snap?.status==="paused")href=home;'),"Grade "+grade+" must preserve explicit course record-recovery route");
 assert.ok(daily.includes("const week=target.pathname.match(")&&daily.includes("weeks")&&daily.includes("day-01.html"),"Grade "+grade+" native week matcher missing");
}
const science9App=read("courses/science/integrated-science-9/science9-dashboard-app-v1.js");
assert.ok(science9App.includes('COURSE_QUERY.get("week")')&&science9App.includes('COURSE_QUERY.get("view")'),"Science 9 course-owned weekly view route must exist");
const manager=read("grades/shared/grade09-blueprint-upper-grade.js");
assert.ok(manager.includes("const scienceCourse=/^(biology-10|chemistry-11|physics-engineering-12)$/"),"Science shared Class safeguard missing");
assert.ok(manager.includes('const socialCourse=/^social-studies-(10|11|12)$/'),"Social shared Class safeguard missing");
assert.ok(manager.includes('const url=step(item).dest;if(url&&identity())'),"Schedule must reuse guarded Class resolver");
const focus=read("grades/shared/upper-grade-daily-focus.js");
assert.ok(focus.includes("window.KhaemenesUpperGradeClassRoute"),"Daily Focus must reuse shared Class destination");
const grade09=read("grades/grade-09/student-profile/student-course-registry.js");
assert.ok(grade09.includes('["english-9","integrated-science-9","global-studies-9"]'),"Grade 09 saved public landing fallback missing");
const scheduleBar=read("grades/grade-09/student-profile/student-schedule-bar.js");
assert.ok(scheduleBar.includes("KhaemenesHighEightClass?.FIRST_STEPS"),"Grade 09 schedule must resolve canonical first-step routes");
assert.ok(scheduleBar.includes("current?.url||first"),"Grade 09 schedule must prefer learner continuation before the canonical first step");
assert.ok(scheduleBar.includes("open.dataset.launchCourse=id"),"Grade 09 schedule must preserve course-scoped launch evidence");
for(const path of [
 "courses/science/integrated-science-9/index.html",
 "courses/science/biology-10/index.html",
 "courses/science/chemistry-11/index.html",
 "courses/science/physics-engineering-12/index.html",
 "courses/social-studies/grade-09/index.html",
 "courses/social-studies/grade-10/index.html",
 "courses/social-studies/grade-11/index.html",
 "courses/social-studies/grade-12/index.html"
]){
}
console.log("PASS Science/Social 8 first steps, 6 Week 02 lessons, four grade student doors and retired regulator guards");

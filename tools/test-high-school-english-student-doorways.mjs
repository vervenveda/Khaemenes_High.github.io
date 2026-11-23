// Read-only Class/Schedule/Checkpoint contract for student English 9–12.
// Student data, assessments, and public course landings are not modified.
import assert from "node:assert/strict";
import fs from "node:fs";
const read=file=>fs.readFileSync(file,"utf8");
const exists=file=>fs.existsSync(file);
const root="courses/language-arts/";
const paths={
  9:"weeks/week-01/day-01/index.html",
  10:"weeks/week-01/monday/index.html",
  11:"weeks/week-01/lessons/day-01.html",
  12:"weeks/week-01/lessons/day-01.html"
};
for(const [grade,lesson] of Object.entries(paths)){
  assert.ok(exists(root+"english-"+grade+"/"+lesson),"Missing English "+grade+" first-day lesson");
}
for(const grade of [10,11,12]){
 const week=read(root+"english-"+grade+"/weeks/week-02/index.html");
 assert.match(week,/id=["']monday["']/,"Week 02 must provide the existing Monday lesson anchor");
 const dailyRoom=read("grades/grade-"+grade+"/student-profile/daily-lessons/index.html");
 assert.ok(dailyRoom.includes('const englishId={"english-10":"ela10","english-11":"ela11","english-12":"ela12"}'),"Grade "+grade+" Daily Lessons must recognize canonical English record ID");
 assert.ok(dailyRoom.includes('const week=target.pathname.match('),"Grade "+grade+" Daily Lessons must select the native weekly lesson");
 assert.ok(dailyRoom.includes('"#monday"')&&dailyRoom.includes('"#quiz"'),"Grade "+grade+" Daily Lessons must preserve native lesson/quiz anchors");
 assert.ok(dailyRoom.includes('href=home; // Explicit existing record-recovery surface'),"Grade "+grade+" recovery must be explicit and fail closed");
 const profile=read("grades/grade-"+grade+"/student-profile/index.html");
 assert.ok(profile.includes("grade09-blueprint-upper-grade.js?v="),"Grade "+grade+" must refresh course-door script");
 assert.ok(profile.includes("upper-grade-daily-focus.js?v="),"Grade "+grade+" must refresh Daily Focus script");
}
const upper=read("grades/shared/grade09-blueprint-upper-grade.js");
assert.ok(upper.includes("const url=step(item).dest;if(url&&identity())"),"Upper-grade Schedule Open must use continuing lesson");
assert.ok(upper.includes('const url=step(item).dest;if(url&&identity())c.append(link("Open "+item.title,url,"btn secondary"));'),"Today secondary course shortcut must use continuing lesson");
assert.ok(upper.includes("KhaemenesUpperGradeClassRoute=Object.freeze"),"Upper-grade student destination owner missing");
assert.ok(upper.includes('const englishRecordId={"english-10":"ela10","english-11":"ela11","english-12":"ela12"}'),"Legacy English learner snapshots must stay readable");
assert.ok(upper.includes('week[1]==="01"'),"Week 01 must use native first-day file");
assert.ok(upper.includes('"#monday"'),"Later weeks must use native instructional day anchors");
assert.ok(upper.includes('const needQuiz=snap?.status==="mastery"||snap?.status==="corrections"'),"Pending quiz/corrections must not route back to the Monday lesson");
assert.ok(upper.includes('(englishCourse||scienceCourse||socialCourse)&&snap?.status==="paused"'),"Saved-record recovery must not be bypassed");
assert.ok(upper.includes('"#quiz"'),"Mastery and corrections must enter native weekly quiz section");
const daily=read("grades/shared/upper-grade-daily-focus.js");
assert.ok(daily.includes("const shared=window.KhaemenesUpperGradeClassRoute"),"Daily Focus must reuse Schedule lesson resolver");
assert.ok(daily.includes("const destination=courseDestination(slot);"),"Classwork/Review must use lesson destination");
assert.ok(!daily.includes('const link=slot.href&&/^https:'),"Old public course-home daily link returned");
const grade09=read("grades/grade-09/student-profile/student-course-registry.js");
assert.ok(grade09.includes('learnerSubject&&saved===course.home'),"English 9 public-landing resume guard missing");
const schedule=read("grades/grade-09/student-profile/student-schedule-bar.js");
assert.ok(schedule.includes("const current=await registry.resolveContinueFor(id)"),"Grade 09 Schedule must resolve continuing lesson");
assert.ok(schedule.includes("KhaemenesHighEightClass?.FIRST_STEPS"),"Grade 09 Schedule must use the canonical eight-class first-step registry");
assert.ok(schedule.includes("current?.url||first"),"Grade 09 Schedule must prefer learner continuation over a public course home");
const grade09Daily=read("grades/grade-09/student-profile/daily-lessons/index.html");
assert.ok(grade09Daily.includes("../student-schedule-bar.js"),"Grade 09 Daily Lessons must load the current schedule bar");
assert.ok(!grade09Daily.includes("seven-class-schedule.js"),"Grade 09 Daily Lessons must not load the retired seven-class schedule");
console.log("PASS: English 9–12 student-facing Schedule, Class, pinned, Daily Focus, and Week 02 learning doors");

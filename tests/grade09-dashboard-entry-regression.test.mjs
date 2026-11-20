import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source=fs.readFileSync(new URL("../grades/grade-09/student-profile/index.html",import.meta.url),"utf8");
const layout=fs.readFileSync(new URL("../grades/grade-09/student-profile/dashboard-layout.js",import.meta.url),"utf8");

test("Grade 09 identifies itself to visitor and profile-tool routing",()=>{
 assert.match(source,/<body[^>]*data-grade="09"/);
 assert.match(source,/id="learningTodayActions"/);
});
test("Start Daily Lessons is always a direct local route before asynchronous course resolution",()=>{
 assert.match(source,/const start=document\.createElement\("a"\);start\.className="btn gold";start\.href="daily-lessons\/";start\.textContent="Start Daily Lessons";/);
 assert.match(source,/actions\.replaceChildren\(start\);/);
 assert.match(source,/const next=await registry\.resolveContinueFor\(priority\.id\)/);
 assert.ok(source.indexOf("actions.replaceChildren(start)")<source.indexOf("const next=await registry.resolveContinueFor(priority.id)"));
 assert.doesNotMatch(source,/const daily=document\.createElement\("a"\);daily\.className="btn secondary";daily\.href="daily-lessons\/"/);
});
test("Profile toolbar keeps expected interaction surfaces and daily rooms",()=>{
 for(const label of ["Student Progress","Schedule","KlasaiPeer","Student Portfolio","Edit Profile","Creative Tools","Yearbook"]){
   assert.ok(layout.includes('label:"'+label+'"'),label);
 }
 for(const id of ["grade09ClassProgressDialog","grade09StudyStudioDialog"]){
   assert.ok(layout.includes(id),id);
 }
 const schedule=fs.readFileSync(new URL("../grades/grade-09/student-profile/schedule/index.html",import.meta.url),"utf8");
 assert.match(layout,/\{label:"Schedule",href:"schedule\/"\}/);
 assert.match(schedule,/id="scheduleGrid"/);
 assert.match(schedule,/My Eight Classes/);
 assert.doesNotMatch(layout,/grade09ScheduleDialog/);
 assert.match(source,/href="daily-lessons\/"/);
});

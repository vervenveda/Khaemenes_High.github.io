/* Academy High School Student Progress source regression.
 * Run: node --test grades/tests/high-school-student-progress-parity-v1.test.cjs
 * Does not claim live browser/record synchronization testing.
 */
"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const count=(s,r)=>(s.match(r)||[]).length;
for(let grade=9;grade<=12;grade++){
 const id=String(grade).padStart(2,"0");
 test("Grade "+grade+" Student Progress popup, summary and official ledger",()=>{
  const html=read("grade-"+id+"/student-profile/index.html");
  assert.equal(count(html,/high-school-student-progress-summary-v1\.js/g),1);
  assert.equal(count(html,/high-school-student-progress-summary-v1\.css/g),1);
  assert.match(html,/khaemenes-learning-continuation\.js/);
  assert.match(html,/khaemenes-student-profile-v2\.js/);
  assert.match(html,grade===9?/class-progress-dialog\.js/:/upper-grade-class-progress-dialog\.js/);
 });
}
test("Grade 9 Student Progress retains and exposes existing sixteen checkpoint cards",()=>{
 const source=read("grade-09/student-profile/class-progress-dialog.js");
 assert.match(source,/checkpointDisclosure\.append\(summary,checkpoints\)/);
 assert.match(source,/checkpointDisclosure\.open=true/);
 assert.match(source,/grade09AcademicCheckpoints/);
 assert.match(read("grade-09/student-profile/dashboard-layout.js"),/label:"Student Progress"/);
});
test("Upper grades use the same toolbar Student Progress label and preserve dialog route",()=>{
 const source=read("shared/grade09-blueprint-upper-grade.js");
 assert.match(source,/label:"Student Progress"/);
 assert.match(source,/if\(action\.label==="Student Progress"\)/);
 assert.match(read("shared/upper-grade-class-progress-dialog.js"),/Student Progress/);
});
test("Shared grid never modifies assessment or learner record owners",()=>{
 const source=read("shared/high-school-student-progress-summary-v1.js");
 assert.doesNotMatch(source,/localStorage\.setItem|sessionStorage\.setItem|\.publish\(|\.updateLearnerGrade\(|\.grantAdultAccess\(/);
 assert.match(source,/KhaemenesLearningContinuation\?\.readLearner/);
 assert.match(source,/KhaemenesCourseEntryContract\?\.readAcademyProfile/);
 assert.match(source,/progress\?\.percent/);
 assert.match(source,/assessments/);
 assert.match(source,/Not reported/);
 assert.match(source,/Stale report/);
 assert.match(source,/khaeStudentProgressClassGrid/);
 assert.doesNotThrow(()=>new vm.Script(source));
});
test("High School class cards remain readable on mobile",()=>{
 const css=read("shared/high-school-student-progress-summary-v1.css");
 for(const part of ["#grade09ClassProgressDialog","grid-template-columns:repeat(2,minmax(0,1fr))","@media(max-width:760px)","color:#27302d","color:#536158"])assert.ok(css.includes(part),part);
});

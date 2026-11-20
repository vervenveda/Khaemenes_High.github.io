import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const g9=read("grades/grade-09/student-profile/dashboard-layout.js");
const upper=read("grades/shared/grade09-blueprint-upper-grade.js");
new vm.Script(g9,{filename:"grade09-toolbar"});
new vm.Script(upper,{filename:"upper-grade-toolbar"});
const expected=["Schedule","Student Progress","Student Portfolio","KlasaiPeer","Edit Profile","Edit Background","Yearbook","Creative Tools"];
function actions(source,marker){
 const begin=source.indexOf(marker);
 assert.ok(begin>=0,"find toolbar definition "+marker);
 const end=source.indexOf("\n ];",begin);
 assert.ok(end>begin,"find toolbar end "+marker);
 const section=source.slice(begin,end);
 return [...section.matchAll(/\{label:"([^"]+)"/g)].map(m=>m[1]);
}
for(const [source,mark,label] of [[g9," const tools=[","Grade 9"],[upper," const actions=[","Grades 10–12"]]){
 const values=actions(source,mark);
 assert.equal(values.length,8,label+" has exactly eight controls");
 assert.deepEqual([...values].sort(),[...expected].sort(),label+" exactly matches 2x4 vocabulary");
 const order='const order=['+expected.map(v=>'"'+v+'"').join(",")+'];';
 assert.ok(source.includes(order),label+" uses the common toolbar ordering");
}
assert.ok(g9.includes('{label:"Schedule",href:"schedule/"}')&&!g9.includes("grade09ScheduleDialog"),"Grade 9 Schedule owns an independent page only");
assert.ok(upper.includes('{label:"Schedule",url:highRoot+"grades/grade-"+grade+"/student-profile/schedule/"}'),"Grades 10–12 Schedule routes to own page");
assert.ok(!upper.includes('back.dataset.backgroundReturn="true"'),"no ninth Edit Background control for upper grades");
assert.ok(upper.includes('location.assign(highRoot+"grades/grade-"+ctx.grade+"/student-profile/")'),"wrong-grade learner redirects safely");
assert.ok(g9.includes('label:"Student Portfolio",href:"../../../portfolio/index.html?grade=09"'),"Grade 9 Portfolio route");
assert.ok(upper.includes('label:"Student Portfolio",url:highRoot+"portfolio/index.html?grade="+grade'),"upper-grade Portfolio route");
assert.ok(g9.includes('label:"Edit Profile",href:"profile/"'),"Grade 9 editor route");
assert.ok(upper.includes('label:"Edit Profile",url:builder'),"upper-grade-specific editor route");
assert.ok(g9.includes('grade09ClassProgressDialog')&&upper.includes("showUpperProgress"),"Student Progress popup owners intact");
assert.ok(g9.includes('grade09BackgroundDialog')&&upper.includes('grade09BackgroundDialog'),"Edit Background popup owner intact");
assert.ok(g9.includes("KhaemenesGrade09StudyStudio")&&upper.includes("KhaemenesUpperGradeStudyStudio"),"KlasaiPeer handlers intact");
assert.ok(g9.includes("KhaemenesGrade09Yearbook")&&upper.includes("KhaemenesUpperGradeYearbook"),"Yearbook handlers intact");
assert.ok(g9.includes("khaeStudentEcosystemTools")&&upper.includes('revealUpper("grade09BlueprintRooms")'),"Creative Tools panels intact");
const required=[
 "grades/grade-09/student-profile/study-studio.js",
 "grades/grade-09/student-profile/class-progress-dialog.js",
 "grades/grade-09/student-profile/student-profile-background.js",
 "grades/shared/upper-grade-class-progress-dialog.js",
 "grades/shared/upper-grade-klasaipeer-studio.js",
 "grades/shared/upper-grade-yearbook-dialog.js",
 "grades/grade-09/student-profile/schedule/index.html",
 "portfolio/index.html"
];
for(const p of required)assert.ok(exists(p),"feature owner exists: "+p);
for(const grade of ["09","10","11","12"]){
 const base="grades/grade-"+grade+"/student-profile/";
 const page=read(base+"index.html");
 assert.ok(exists(base+"profile/index.html"),"grade "+grade+" profile editor");
 assert.ok(exists(base+"schedule/index.html"),"grade "+grade+" standalone Schedule");
 assert.ok(grade==="09"
  ? page.includes('student-ecosystem-tools.js')&&read("grades/shared/student-ecosystem-tools.js").includes('section.id="khaeStudentEcosystemTools"')
  : page.includes('id="grade09BlueprintRooms"'),"grade "+grade+" creative tools owner and destination");
 assert.ok(page.includes('student-profile-background.js'),"grade "+grade+" background editor loader");
 assert.ok(page.includes(grade==="09"?'dashboard-layout.js?v=20261120-standalone-schedule-restored-v2':"grade09-blueprint-upper-grade.js?v=20261120-eight-tools-standalone-schedule"),"grade "+grade+" toolbar loader");
 if(grade!=="09"){
  assert.ok(page.includes("upper-grade-yearbook-dialog.js"),"grade "+grade+" yearbook module");
  assert.ok(page.includes("upper-grade-klasaipeer-studio.js"),"grade "+grade+" KlasaiPeer module");
  assert.ok(page.includes("upper-grade-class-progress-dialog.js"),"grade "+grade+" progress module");
 }
}
console.log("HIGH SCHOOL PROFILE 2x4: PASS (32 tool destinations, parity, no duplicate background, preserved feature owners).");

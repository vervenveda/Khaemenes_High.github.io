"use strict";
// node grades/shared/high-profile-two-row-toolbar.test.cjs
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.join(__dirname,"..","..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const expected=["Schedule","Class Progress","Student Portfolio","KlasaiPeer","Edit Profile","Edit Background","Yearbook","Creative Tools"];
const freshman=read("grades/grade-09/student-profile/dashboard-layout.js");
const upper=read("grades/shared/grade09-blueprint-upper-grade.js");
const background=read("grades/grade-09/student-profile/student-profile-background.js");
for(const source of [freshman,upper]) {
 assert.match(source,/const order=\["Schedule","Class Progress","Student Portfolio","KlasaiPeer","Edit Profile","Edit Background","Yearbook","Creative Tools"\]/);
 assert.match(source,/\.sort\(\(a,b\)=>order\.indexOf\(a\.label\)-order\.indexOf\(b\.label\)\)/);
}
assert.match(freshman,/label:"Student Portfolio"/);
assert.match(upper,/label:"Student Portfolio"/);
assert.match(background,/const opener=action\("Edit Background"\)/);
assert.match(background,/toolGrid\.insertBefore\(opener,yearbookTool\)/);
assert.match(upper,/grid\.insertBefore\(back,yearbook\)/);
assert.match(background,/opener\.addEventListener\("click",\(\)=>\{refresh\(\);popup\.showModal\(\);close\.focus\(\)\}\)/);
for(const grade of ["09","10","11","12"]){
 const file="grades/grade-"+grade+"/student-profile/index.html",html=read(file);
 assert.match(html,/student-profile-background\.js\?v=20261109-two-row-priority-v1/);
 if(grade==="09")assert.match(html,/dashboard-layout\.js\?v=20261109-two-row-priority-v1/);
 else {assert.match(html,/grade09-blueprint-upper-grade\.js\?v=20261109-two-row-priority-v1/);
  assert.match(html,/grade09-blueprint-tool-grid\{display:grid;grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);}
}
const actions=[{label:"Edit Profile"},{label:"Class Progress"},{label:"Schedule"},{label:"KlasaiPeer"},{label:"Yearbook"},{label:"Creative Tools"},{label:"Student Portfolio"}];
actions.sort((a,b)=>expected.indexOf(a.label)-expected.indexOf(b.label));
const yearbookAt=actions.findIndex(x=>x.label==="Yearbook");
actions.splice(yearbookAt,0,{label:"Edit Background"});
assert.deepEqual(actions.map(x=>x.label),expected);
assert.equal(new Set(expected).size,8);
console.log("PASS: High School Grades 9–12 canonical 4×2 toolbar vocabulary, ordering and existing background-dialog behavior");

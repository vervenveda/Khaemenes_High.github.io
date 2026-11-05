import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const root=path.resolve(".");
const base="grades/";
const editor=fs.readFileSync(path.join(root,base,"shared/upper-grade-profile-editor.js"),"utf8");
assert.match(editor,/student\.learnerId!==id/);
assert.match(editor,/student\.stage!=="high"/);
assert.match(editor,/actual!==grade/);
assert.match(editor,/student\.learnerId!==loadedOwner/);
assert.match(editor,/khaemenes-high-profile-v1:learner:/);
assert.doesNotMatch(editor,/localStorage\.clear\(/);
const shared=fs.readFileSync(path.join(root,base,"shared/grade09-blueprint-upper-grade.js"),"utf8");
assert.match(shared,/const builder="profile\/"/);
for(const grade of ["10","11","12"]){
 const prefix=path.join(root,base,"grade-"+grade,"student-profile");
 const page=fs.readFileSync(path.join(prefix,"index.html"),"utf8");
 const profile=fs.readFileSync(path.join(prefix,"profile/index.html"),"utf8");
 assert.match(page,/href="profile\/"/,"Grade "+grade+" dashboard must link to own editor");
 assert.doesNotMatch(page,/href="games\/"/,"Grade "+grade+" must not link to nonexistent local games directory");
 assert.doesNotMatch(page,/href="https:\/\/vervenveda\.com\/Khaemenes_High\.github\.io\/grades\/grade-09\/student-profile\/profile\//);
 assert.equal((page.match(/VNV_HEADER\.mount\(/g)||[]).length,1);
 assert.match(profile,new RegExp('data-grade="'+grade+'"'));
 assert.match(profile,/src="\.\.\/\.\.\/\.\.\/shared\/upper-grade-profile-editor\.js"/);
 assert.match(profile,/id="saveProfile"/);
 assert.match(profile,/id="exportProfile"/);
 assert.match(profile,/id="profileStatus"/);
 assert.match(profile,/\{label:"PORTFOLIO",href:"\.\.\/\.\.\/\.\.\/\.\.\/portfolio\/"\}/,"Grade "+grade+" portfolio nav must have a valid local route");
 assert.doesNotMatch(profile,new RegExp('label:"'+grade+'S"'),"Grade "+grade+" must not produce a substituted menu label");
 assert.match(profile,/vnv-header-autopopulate\.js/);
 assert.match(profile,/vnv-ecosystem-toolbar\.js/);
 for(const url of ["../../../shared/upper-grade-profile-editor.js"]){
  const resolved=path.resolve(prefix,"profile",url);
  assert.ok(fs.existsSync(resolved),"Missing shared editor from Grade "+grade+": "+resolved);
 }
}
const gateway=fs.readFileSync(path.join(root,base,"student-profile/index.html"),"utf8");
assert.match(gateway,/base\+grade\+"\/student-profile\/"/);
assert.doesNotMatch(gateway,/actions\.append\(a\("Open My High School Profile Editor","https:\/\/vervenveda\.com\/Khaemenes_High\.github\.io\/grades\/grade-09\/student-profile\/profile\//);
console.log("PASS: Grade 09 protected, Grades 10–12 have grade-owned editable profile routes and learner-scoped storage.");

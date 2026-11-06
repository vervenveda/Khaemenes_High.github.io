#!/usr/bin/env node
"use strict";
/* Source-level regression gates: Grade 09 remains the canonical blueprint.
 * No account writes, browser storage access, or production navigation.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const grade09=read("grades/grade-09/student-profile/index.html");
assert.match(grade09,/<h1>My Student Profile<\/h1>/);
assert.match(grade09,/student-achievements-dreams\.js/);
assert.match(grade09,/student-course-progress-bars\.js/);
const adapter=read("grades/shared/grade09-blueprint-upper-grade.js");
assert.match(adapter,/if\(window\.KhaemenesUpperGrade09Blueprint\)return;/);
assert.match(adapter,/window\.addEventListener\("pageshow",render\)/);
assert.match(adapter,/window\.addEventListener\("khaemenes-family-changed",render\)/);
const catalog=read("courses/shared/high-school-eight-class.js");
for(const name of ["math","science","languageArts","socialStudies","peHealth","psychology","foreignLanguage","elective"]){
 assert.match(catalog,new RegExp("\\[\""+name+"\""),"Missing canonical subject "+name);
}
const dreams=read("grades/shared/student-achievements-dreams.js");
const progress=read("grades/shared/student-course-progress-bars.js");
assert.match(dreams,/getElementById\("khaeDreamsAchievements"\)/);
assert.match(dreams,/KhaemenesHighProfileGradeContext/);
assert.match(progress,/KhaemenesHighEightClass\?\.slots/);
assert.match(progress,/KhaemenesHighProfileGradeContext/);
for(const grade of [10,11,12]){
 const file="grades/grade-"+grade+"/student-profile/index.html";
 const html=read(file);
 assert.match(html,new RegExp('data-grade="'+grade+'"'),file);
 assert.match(html,/<h1>My Student Profile<\/h1>/,file);
 for(const token of [
  'data-grade09-schedule-bar',
  'aria-label="Student Learning Portfolio"',
  'aria-labelledby="doorsTitle"',
  "course-entry-contract.js",
  "grade09-blueprint-upper-grade.js",
  "student-achievements-dreams.js",
  "student-course-progress-bars.js"
 ])assert.ok(html.includes(token),file+" missing "+token);
 assert.equal((html.match(/<script[^>]+src="[^"]*student-achievements-dreams\.js/g)||[]).length,1,file+" duplicate achievements");
 assert.equal((html.match(/<script[^>]+src="[^"]*student-course-progress-bars\.js/g)||[]).length,1,file+" duplicate progress");
 assert.ok(!html.includes("grades/grade-09/student-profile/profile/"),file+" routes to Grade 09 editor");
 assert.equal((html.match(/VNV_HEADER\.mount\(\{/g)||[]).length,1,file+" header mounts");
 const editorPath="grades/grade-"+grade+"/student-profile/profile/index.html";
 const chooserPath="grades/grade-"+grade+"/student-profile/grade"+grade+"-look-chooser.js";
 assert.ok(fs.existsSync(path.join(root,editorPath)),file+" editor missing");
 assert.ok(fs.existsSync(path.join(root,chooserPath)),file+" picture studio missing");
 const editor=read(editorPath),chooser=read(chooserPath);
 assert.ok(html.includes('href="profile/"'),file+" no same-grade editor button");
 assert.ok(editor.includes('data-grade="'+grade+'"'),editorPath+" wrong grade marker");
 assert.ok(editor.includes("String(Number(learner.grade))!=='"+grade+"'"),editorPath+" missing grade guard");
 assert.ok(chooser.includes('String(Number(record.grade))!=="'+grade+'"'),chooserPath+" missing photo grade guard");
 assert.ok(editor.includes("loadedOwner!==learner.learnerId||loadedGrade!==registeredGrade()"),editorPath+" missing learner-switch guard");
 assert.ok(editor.includes("grade"+grade+"-look-chooser.js"),editorPath+" missing photo studio");
 assert.ok(editor.includes("khaemenes-grade"+grade+"-student-profile.json"),editorPath+" export labeled wrong grade");
 console.log("PASS Grade "+grade+" — blueprint structure, one-time imports, grade-aware routes");
}
console.log("PASS Upper-grade profile source-level parity (browser behavior requires separate tests)");

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const read=p=>fs.readFileSync(p,"utf8");
const catalog=read("courses/shared/high-school-eight-class.js");
const blueprint=read("grades/shared/grade09-blueprint-upper-grade.js");
const pins=read("courses/shared/high-school-course-pins.js");
new vm.Script(catalog);
new vm.Script(blueprint);
new vm.Script(pins);

for(const subject of ['"math"','"science"','"languageArts"','"socialStudies"','"peHealth"','"psychology"','"foreignLanguage"','"elective"']){
 assert.ok(catalog.includes(subject),"Shared eight-class catalog missing subject "+subject);
}
assert.match(blueprint,/KhaemenesHighEightClass|eight-class/i,"Upper-grade profile must have an eight-class source");
for(const grade of [10,11,12]){
 const page=`grades/grade-${grade}/student-profile/index.html`;
 const html=read(page);
 assert.match(read(`grades/grade-${grade}/index.html`),/href="student-profile\/"/,"Grade "+grade+" profile link missing");
 for(const rel of ["../../../courses/shared/high-school-course-pins.js","../../../courses/shared/high-school-eight-class.js","../../shared/grade09-blueprint-upper-grade.js"]){
  assert.ok(html.includes('src="'+rel),"Grade "+grade+" missing "+rel);
  assert.ok(fs.existsSync(path.join(path.dirname(page),rel)),"Grade "+grade+" missing file "+rel);
 }
 assert.ok(html.includes("vnv-language.js"),"Grade "+grade+" missing VNV translator");
 assert.ok(html.includes("khaemenes-learning-continuation.js"),"Grade "+grade+" missing continuation reader");
 assert.ok(html.includes("upper-grade-class-progress-dialog.js"),"Grade "+grade+" missing student progress dialog");
 for(const course of [
  `courses/language-arts/english-${grade}/index.html`,
  `courses/social-studies/grade-${grade}/index.html`,
  `courses/science/${({10:"biology-10",11:"chemistry-11",12:"physics-engineering-12"})[grade]}/index.html`
 ])assert.ok(fs.existsSync(course),"Missing Grade "+grade+" course route "+course);
}
assert.match(pins,/readLanguageChoices/,"Language selection must remain learner-scoped");
assert.match(pins,/writeLanguageChoices/,"Language choice persistence must remain available");
console.log("PASS: Grades 10–12 eight-class profile routes, Student Progress and learner-scoped pins");

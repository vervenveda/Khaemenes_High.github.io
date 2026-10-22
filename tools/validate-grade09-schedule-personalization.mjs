import fs from "node:fs";
import assert from "node:assert/strict";

const read=path=>fs.readFileSync(path,"utf8");
const dashboard=read("grades/grade-09/student-profile/index.html");
const daily=read("grades/grade-09/student-profile/daily-lessons/index.html");
const games=read("grades/grade-09/student-profile/games/index.html");
const profile=read("grades/grade-09/student-profile/profile/index.html");
const css=read("grades/grade-09/student-profile/student-profile.css");
const quick=read("grades/grade-09/student-profile/student-quick-pins.js");
const bar=read("grades/grade-09/student-profile/student-schedule-bar.js");
const design=read("grades/grade-09/student-profile/student-profile-preferences.js");
const registry=read("grades/grade-09/student-profile/student-course-registry.js");
const seven=read("grades/grade-09/student-profile/seven-class-schedule.js");

assert.match(dashboard,/data-grade09-schedule-bar/,"dashboard surfaces schedule rail");
assert.match(daily,/data-grade09-schedule-bar/,"Daily Lessons surfaces schedule rail");
assert.match(dashboard,/student-quick-pins\.js/,"dashboard loads Quick Pins");
assert.match(dashboard,/student-schedule-bar\.js/,"dashboard loads schedule renderer");

for(const id of ["prealgebra-games","academy-arcade","scientific-calculator","the-verifier","citation-studio","electives-hall"]){
  assert.match(quick,new RegExp('"'+id+'"'),id+" is a registered Quick Pin");
  assert.match(games,new RegExp('data-quick-pin="'+id+'"'),id+" can be pinned from Games");
}
assert.match(quick,/khaemenes-grade09-quick-pins-v1/,"Quick Pins use a dedicated learner preference store");
assert.match(quick,/scopedKey/,"Quick Pins are learner scoped");
assert.match(bar,/const slots=\[\["Mathematics"/,"schedule keeps seven academic slot definitions");
assert.match(bar,/schedule-quick/,"Quick Pins render separately from academic classes");
assert.match(bar,/do not change enrollment, grades, or mastery/,"schedule explains Quick Pin academic boundary");

for(const control of ["designTheme","designAccent","designDensity","avatarShape","avatarMark"]){
  assert.match(profile,new RegExp('id="'+control+'"'),control+" exists in Profile Design Studio");
}
assert.match(profile,/Restore Academy Layout/,"student can safely restore Academy presentation");
assert.match(design,/new Set\(\["parchment","forest","midnight"\]\)/,"themes are whitelisted");
assert.match(design,/new Set\(\["gold","teal","plum"\]\)/,"accents are whitelisted");
assert.match(design,/khaemenes-grade09-profile-design-v1/,"design preferences are learner owned");
assert.match(css,/data-student-theme="midnight"/,"Midnight Study theme is styled");
assert.match(css,/data-student-density="compact"/,"compact dashboard density is styled");

assert.match(registry,/course=hs1/,"formal Grade 09 language links request the High School I program");
assert.match(registry,/mode=atlas/,"exploration languages request the Linguistics Atlas");
assert.match(registry,/Arabic · Exploration/,"Arabic is not misrepresented as a complete formal course");
assert.match(registry,/Russian · Exploration/,"Russian is not misrepresented as a complete formal course");
assert.match(seven,/Arabic \(exploration\)/,"schedule selector labels Arabic exploration");
assert.match(seven,/Russian \(exploration\)/,"schedule selector labels Russian exploration");

console.log("PASS Grade 09 schedule, Quick Pins, design personalization, and language handoff contract.");

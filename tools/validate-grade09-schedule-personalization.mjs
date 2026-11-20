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
const eight=read("grades/grade-09/student-profile/eight-class-schedule.js");

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
assert.match(bar,/const catalog=window\.KhaemenesHighEightClass/,"schedule uses the shared canonical eight-class catalog");
assert.match(bar,/catalog\?\.slots\(9,/,"Grade 09 schedule resolves all eight academic slots from the canonical catalog");
assert.match(bar,/schedule-quick/,"Quick Pins render separately from academic classes");
assert.match(bar,/do not change enrollment, grades, or mastery/,"schedule explains Quick Pin academic boundary");

for(const control of ["grade09LookPanel","grade09BadgeChoices","grade09FrameChoices","grade09ColorChoices","grade09PhotoInput","grade09RemovePhoto"]){
  assert.match(profile,new RegExp('id="'+control+'"'),control+" exists in the current My Picture & Colors editor");
}
assert.match(design,/khaemenes-grade09-profile-design-v1/,"profile visual preferences remain learner owned");
for(const shape of ["oval","rhombus","semicircle","kite"]){
  assert.match(design,new RegExp('"'+shape+'"'),shape+" remains an approved photo-frame shape");
}
assert.match(profile,/Your picture, frame, badge, and color stay with your student profile/,"profile explains learner-owned visual choices");
assert.match(css,/data-student-theme="midnight"/,"legacy-compatible Midnight Study rendering remains supported");
assert.match(css,/data-student-density="compact"/,"legacy-compatible compact density remains supported");

assert.match(registry,/course=hs1/,"formal Grade 09 language links request the High School I program");
assert.match(registry,/"arabic":"arabic-1","russian":"russian-1"/,"Arabic and Russian route to their dedicated year-one instructional drafts");
assert.match(registry,/courseMode:formal\?"formal":"instructional-draft"/,"language registry distinguishes formal courses from instructional drafts");
assert.match(registry,/Instructional Draft/,"instructional-draft language titles are explicit");
assert.match(eight,/Arabic \(exploration\)/,"schedule selector clearly labels Arabic as exploration-stage");
assert.match(eight,/Russian \(exploration\)/,"schedule selector clearly labels Russian as exploration-stage");

console.log("PASS Grade 09 schedule, Quick Pins, design personalization, and language handoff contract.");

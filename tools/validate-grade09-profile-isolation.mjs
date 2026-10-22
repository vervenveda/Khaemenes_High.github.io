import fs from "node:fs";
import assert from "node:assert/strict";

const read=path=>fs.readFileSync(path,"utf8");
const dashboard=read("grades/grade-09/student-profile/index.html");
const profile=read("grades/grade-09/student-profile/profile/index.html");
const daily=read("grades/grade-09/student-profile/daily-lessons/index.html");
const settings=read("grades/grade-09/student-profile/settings/index.html");
const registry=read("grades/grade-09/student-profile/student-course-registry.js");
const pins=read("courses/shared/high-school-course-pins.js");

assert.match(profile,/khaemenes-high-profile-v1:learner:/,"editable profile uses learner-scoped storage");
assert.match(profile,/khaemenes_active_learner_v1/,"editable profile resolves Academy learner");
assert.match(dashboard,/scoped\('khaemenes-high-profile-v1'\)/,"dashboard reads learner-scoped profile");
assert.match(dashboard,/scoped\('khaemenes-grade09-daily-note-v1'\)/,"dashboard reads learner-scoped focus note");
assert.match(daily,/scoped\('khaemenes-grade09-daily-note-v1'\)/,"daily note is learner scoped");
assert.match(daily,/scoped\('khaemenes-grade09-daily-checks-v1'\)/,"daily checklist is learner scoped");
assert.match(settings,/khaemenes-grade09-parent-alerts-v1:learner:/,"settings alerts are learner scoped");
assert.doesNotMatch(settings,/innerHTML\s*=\s*alerts/,"student-entered alert text is not injected through innerHTML");
assert.match(settings,/textContent=String\(text/,"settings renders alert text with textContent");
assert.match(settings,/Acknowledged on this device/,"static settings do not claim authenticated parent review");
assert.match(registry,/An identified learner never inherits another browser user's legacy record/,"identified learners do not fall back to unscoped legacy course state");
assert.match(pins,/ACADEMY_PIN_KEY="khaemenes_course_pins_v1"/,"High School pin store bridges to Academy pin contract");
assert.match(pins,/syncAcademyPins/,"High School pins publish to Academy Student Portal");

console.log("PASS Grade 09 profile isolation, safe settings rendering, and Academy pin bridge.");

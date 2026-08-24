import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root=process.cwd();
const read=rel=>fs.readFileSync(path.join(root,rel),"utf8");
const courseRoot="courses/mathematics/pre-algebra";
const helperPath=`${courseRoot}/assets/prealgebra-student-navigation.js`;
const helper=read(helperPath);

new Function(helper);
assert.ok(helper.includes('const THEME_KEY="khaemenes-theme"'),"student navigation must use the canonical theme key");
assert.ok(helper.includes('const PIN_KEY="khaemenes-high-pinned-courses-v2"'),"student navigation must use the course-home pin key");
assert.ok(helper.includes('const COURSE_ID="pre-algebra"'),"student navigation must identify Pre-Algebra consistently");
assert.ok(helper.includes('const CONTINUE_KEY="khaemenes-grade09-last-open-v1"'),"student navigation must preserve the Grade 9 continue key");
assert.ok(helper.includes('a.id="studentHomeButton"'),"lesson helper must add Student Home");
assert.ok(helper.includes('a.id="mentorHelpButton"'),"lesson helper must add Ask Mentor");
assert.ok(helper.includes('button.id="pinPreAlgebraClass"'),"lesson helper must add Pin Class");
assert.ok(helper.includes('stopImmediatePropagation'),"theme control must prevent the legacy double-toggle path");
assert.ok(helper.includes('window.addEventListener("load",recordContinue'),"continue record must be written after lesson engines and gates settle");
assert.ok(helper.includes('academyDirectGate')&&helper.includes('academyUnit1Gate'),"locked lessons must not replace the Continue Pre-Algebra target");
assert.ok(helper.includes('#studentHomeButton,#mentorHelpButton,#pinPreAlgebraClass{display:inline-flex!important}'),"essential student controls must remain visible on small screens");
assert.ok(!helper.includes("artist1970.github.io"),"student navigation must not use the legacy cross-origin mentor route");

const courseHome=read(`${courseRoot}/index.html`);
assert.ok(courseHome.includes('id="pinCourseButton"'),"Pre-Algebra course home must expose its Pin to Profile control");
assert.ok(courseHome.includes('PROFILE_PIN_KEY = "khaemenes-high-pinned-courses-v2"'),"course home and lesson helper must share the pin key");
assert.ok(courseHome.includes('PROFILE_COURSE_ID = "pre-algebra"'),"course home and lesson helper must share the course id");

for(let unit=1;unit<=13;unit++){
  const n=String(unit).padStart(2,"0");
  const wrapperPath=`${courseRoot}/units/unit-${n}/assets/lesson-engine.js`;
  const source=read(wrapperPath);
  new Function(source);
  assert.ok(source.includes("prealgebra-student-navigation.js"),`Unit ${n} lessons must load the shared student navigation helper`);
  assert.ok(source.includes("startCore"),`Unit ${n} lesson wrapper must retain the mastery-engine start boundary`);
}

const profilePath="grades/grade-09/student-profile/index.html";
const profile=read(profilePath);
assert.ok(profile.includes('id="pinnedClassCard"'),"Grade 9 dashboard must expose the pinned-class surface");
assert.ok(profile.includes("khaemenes-high-pinned-courses-v2"),"Grade 9 dashboard must read the shared pin key");
assert.ok(profile.includes("khaemenes-grade09-last-open-v1"),"Grade 9 dashboard must read the continue-learning record");
assert.ok(profile.includes("Continue Pre-Algebra"),"Grade 9 dashboard must provide a Continue Pre-Algebra action");
assert.ok(profile.includes("/Khaemenes_High.github.io/mentor/"),"Grade 9 dashboard must expose the same-ecosystem Mentor");
assert.ok(!profile.includes("artist1970.github.io/Archaemenes"),"Grade 9 dashboard must not restore the legacy Mentor URL");

const dailyPath="grades/grade-09/student-profile/daily-lessons/index.html";
const daily=read(dailyPath);
assert.ok(daily.includes('id="pinnedDailyCard"'),"Daily Lessons must expose the pinned-class surface");
assert.ok(daily.includes("khaemenes-high-pinned-courses-v2"),"Daily Lessons must read the shared pin key");
assert.ok(daily.includes("khaemenes-grade09-last-open-v1"),"Daily Lessons must read the continue-learning record");
assert.ok(daily.includes("Continue Pre-Algebra"),"Daily Lessons must provide a Continue Pre-Algebra action");
assert.ok(daily.includes("/Khaemenes_High.github.io/mentor/"),"Daily Lessons must expose the same-ecosystem Mentor");
assert.ok(!daily.includes("artist1970.github.io/Archaemenes"),"Daily Lessons must not use the legacy Mentor URL");

console.log("Pre-Algebra student navigation validation: PASS");
console.log("Checked: theme, mobile controls, pin key, continue safety, Student Home, Mentor, course home, Grade 9 dashboard, Daily Lessons, Units 01–13.");

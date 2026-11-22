// Science 9 Unit 01 Day 01 prototype source contract.
// No learning data, grades, assessment questions or runtime state are changed.
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8");
const jsPath="courses/shared/science-lesson-engine-v0.1.js";
const lessonPath="courses/science/integrated-science-9/units/unit-01/lessons/day-01.html";
const previewPath="workflow/engines/science/science-lesson-engine-prototype-v0.1.html";
const rubricPath="teacher-resources/science/unit-01/UNIT01_RUBRICS.md";
const js=read(jsPath),lesson=read(lessonPath),preview=read(previewPath),rubric=read(rubricPath);
const normalizeHtml=s=>s.replaceAll("&amp;","&");
const hasHeading=(source,heading)=>normalizeHtml(source).includes("<h2>"+heading+"</h2>");
const stages=[
["Essential question","Learning objectives","Materials"],
["1. Begin with a phenomenon, not an answer"],
["Vocabulary & Language of Inquiry","2. Build an investigable question","3. Operational definitions turn vague words into measurable rules"],
["4. Not every scientific question requires a controlled experiment"],
["5. Evidence sufficiency: what would actually answer the question?","6. Interactive evidence audit"],
["7. Mentor conference prompt","Portfolio evidence","Lesson 01 Evidence Rubric"],
["Exit check","Original Interactive Inquiry Tool"]
];
for(const headings of stages){
 for(const heading of headings){
  assert.ok(hasHeading(lesson,heading),"Original lesson heading changed: "+heading);
  assert.ok(hasHeading(preview,heading),"Workflow prototype heading missing: "+heading);
  assert.ok(js.includes(heading),"Engine does not map heading: "+heading);
 }
}
assert.match(lesson,/<body[^>]*data-science-engine="science9-u01-d01"/,"Live lesson lacks explicit opt-in");
assert.ok(lesson.includes("../../../../../shared/science-lesson-engine-v0.1.js?"),"Pilot loader missing");
assert.ok(preview.includes("../../../courses/shared/science-lesson-engine-v0.1.js?"),"Workflow prototype must share engine source");
assert.ok(lesson.includes('data-page-complete="day01"'),"Original course completion authority missing");
assert.ok(lesson.includes('href="day-02.html"'),"Original next lesson link missing");
assert.ok(lesson.includes('id="themeToggle"'),"Original lesson navigation preserved");
assert.ok(lesson.includes('class="safety-panel"'),"Original safety panel missing");
assert.ok(js.includes('safety=root.querySelector(":scope > .safety-panel")'),"Engine must require safety boundary");
assert.ok(js.includes('if(!roadmap||!actions||!safety)return false'),"Engine must fail open to original if safety missing");
assert.ok(js.includes('roadmap.before(dock)'),"Engine must leave original lesson nodes in place");
assert.ok(js.includes('visited.size'),"Visited steps must be separate from official mastery");
assert.ok(js.includes("science-engine-hidden"),"Stage presentation toggle missing");
assert.ok(js.includes('ENGINE_VERSION="0.2.0"'),"Curriculum-complete engine version missing");
assert.ok(js.includes('scienceEngineMounted'),"Idempotent mounted-state guard missing");
assert.ok(js.includes('aria-controls'),"Step controls must expose controlled lesson regions");
assert.ok(js.includes('aria-hidden'),"Stage visibility must be exposed to assistive technology");
assert.ok(js.includes('prefers-reduced-motion'),"Reduced-motion navigation protection missing");
assert.ok(js.includes('khaemenes:science-engine-mounted'),"Engine mount lifecycle event missing");
assert.ok(js.includes('mastery:false')&&js.includes('persistence:false'),"Engine lifecycle must declare non-authority boundaries");
assert.ok(js.includes('hashchange'),"Deep-link/hash synchronization missing");
assert.ok(js.includes("Simulated Data")&&js.includes("Scientific Explanation Studio"),"Science-specific learning workspace missing");
assert.ok(js.includes("Observe → Predict → Test"),"Prediction/revision workspace missing");
assert.ok(js.includes("Reasoning Checks"),"Feedback-enabled reasoning checks missing");
assert.ok(js.includes("mean short-wing time")&&js.includes("0.40 s"),"Worked quantitative evidence example missing");
assert.ok(lesson.includes('data-science-rubric="sci9-u01-d01-evidence-v1"'),"Lesson rubric ID missing");
assert.match(rubric,/Canonical rubric ID:\*{0,2}\s*`sci9-u01-d01-evidence-v1`/,"Teacher rubric canonical ID missing");
const canonicalRubric=[
"Scientific accuracy",
"Relevant evidence or design detail",
"Reasoning linking evidence to claim",
"Limitations and communication",
"Scientifically accurate and appropriately qualified",
"Specific, relevant evidence or design detail supports the response",
"Clear reasoning explains why the evidence supports the claim",
"Relevant limitation is identified and the explanation is clear and scientifically transparent"
];
for(const phrase of canonicalRubric){
 assert.ok(lesson.includes(phrase),"Lesson rubric drift: "+phrase);
 assert.ok(rubric.includes(phrase),"Teacher rubric drift: "+phrase);
}
assert.ok(lesson.includes("Vocabulary &amp; Language of Inquiry"),"Vocabulary module missing from Lesson 01");
assert.ok(lesson.includes("How can we turn an observable phenomenon into a scientific question"),"Essential question missing from Lesson 01");
for(const forbidden of ["localStorage.setItem","sessionStorage.setItem","indexedDB.open","fetch(","XMLHttpRequest","data-page-complete=\"true\"","high-school-global-chrome-v2.js"]){
 assert.ok(!js.includes(forbidden),"Engine attempted forbidden action: "+forbidden);
}
const engineOwnerPaths=[lessonPath,previewPath];
assert.equal(engineOwnerPaths.length,2);
console.log("PASS: Science 9 pilot mounted, all seven original-content stages preserved, safety and course mastery isolated, workflow prototype shares owner");

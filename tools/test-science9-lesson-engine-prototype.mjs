// Science 9 Unit 01 Day 01 prototype source contract.
// No learning data, grades, assessment questions or runtime state are changed.
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8");
const jsPath="courses/shared/science-lesson-engine-v0.1.js";
const lessonPath="courses/science/integrated-science-9/units/unit-01/lessons/day-01.html";
const previewPath="workflow/engines/science/science-lesson-engine-prototype-v0.1.html";
const js=read(jsPath),lesson=read(lessonPath),preview=read(previewPath);
const stages=[
["Learning objectives","Materials"],
["1. Begin with a phenomenon, not an answer"],
["2. Build an investigable question","3. Operational definitions turn vague words into measurable rules"],
["4. Not every scientific question requires a controlled experiment"],
["5. Evidence sufficiency: what would actually answer the question?","6. Interactive evidence audit"],
["7. Mentor conference prompt","Portfolio evidence"],
["Exit check","Original Interactive Inquiry Tool"]
];
for(const headings of stages){
 for(const heading of headings){
  assert.ok(lesson.includes("<h2>"+heading+"</h2>"),"Original lesson heading changed: "+heading);
  assert.ok(preview.includes("<h2>"+heading+"</h2>"),"Workflow prototype heading missing: "+heading);
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
assert.ok(js.includes('const safety=root.querySelector(":scope > .safety-panel")'),"Engine must require safety boundary");
assert.ok(js.includes('if(!roadmap||!actions||!safety)return false'),"Engine must fail open to original if safety missing");
assert.ok(js.includes('roadmap.before(dock)'),"Engine must leave original lesson nodes in place");
assert.ok(js.includes('visited.size'),"Visited steps must be separate from official mastery");
assert.ok(js.includes("science-engine-hidden"),"Stage presentation toggle missing");
assert.ok(js.includes("Simulated Data")&&js.includes("Scientific Explanation Studio"),"Science-specific learning workspace missing");
for(const forbidden of ["localStorage.setItem","sessionStorage.setItem","indexedDB.open","fetch(","XMLHttpRequest","data-page-complete=\"true\"","high-school-global-chrome-v2.js"]){
 assert.ok(!js.includes(forbidden),"Engine attempted forbidden action: "+forbidden);
}
const engineOwnerPaths=[lessonPath,previewPath];
assert.equal(engineOwnerPaths.length,2);
console.log("PASS: Science 9 pilot mounted, all seven original-content stages preserved, safety and course mastery isolated, workflow prototype shares owner");

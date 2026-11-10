"use strict";
/* Source-only checks for High School portfolio and Yearbook learner identity.
 * Run: node --test grades/tests/high-portfolio-yearbook-family-guard.test.cjs
 */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const portfolio=fs.readFileSync(path.join(root,"shared/student-achievements-dreams.js"),"utf8");
const yearbook=fs.readFileSync(path.join(root,"shared/upper-grade-yearbook-dialog.js"),"utf8");
test("dream board and portfolio evidence require registered grade and family ownership",()=>{
 assert.ok(portfolio.includes("activeForGrade?.(grade)"));
 assert.ok(portfolio.includes("registered.learnerId"));
 assert.ok(portfolio.includes("activeForGrade?.(grade)?.learnerId===id"));
 assert.ok(portfolio.includes('window.addEventListener("khaemenes-family-changed",refresh)'));
});
test("grade 10–12 Yearbook doorway refuses absent learner and closes on a switch",()=>{
 assert.ok(yearbook.includes("activeForGrade?.(String(grade).padStart(2,\"0\"))"));
 assert.ok(yearbook.includes("if(!owner)return false"));
 assert.ok(yearbook.includes("if(dialog.open&&(!openedLearner||activeLearner()!==openedLearner))dialog.close()"));
 assert.ok(yearbook.includes('frame.src="about:blank"'));
 assert.ok(yearbook.includes('window.addEventListener("storage",event=>'));
});

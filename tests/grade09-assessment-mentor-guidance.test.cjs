/* Static integrity of the Grade 9 mentor guidance rollout.
 * No browser, course engines, learner records or answer banks are executed.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const pilot=fs.readFileSync(path.join(root,"assets/grade09-assessment-mentor-guidance-v1.js"),"utf8");
new Function(pilot);
const targets=[
 ["courses/mathematics/pre-algebra/assessments/index.html","pre-algebra"],
 ["courses/mathematics/pre-algebra/diagnostic/index.html","pre-algebra"],
 ["courses/language-arts/english-9/assessments/index.html","english-9"],
 ["courses/language-arts/english-9/assessments/diagnostic/index.html","english-9"],
 ["courses/science/integrated-science-9/assessments/index.html","science-9"],
 ["courses/science/integrated-science-9/diagnostic/index.html","science-9"],
 ["courses/social-studies/grade-09/assessments/readiness-v3.html","social-studies-9"],
 ["courses/social-studies/grade-09/assessments/midterm.html","social-studies-9"],
 ["courses/social-studies/grade-09/assessments/final.html","social-studies-9"]
];
assert.equal((pilot.match(/id="kaGrade09AssessmentMentors"/g)||[]).length,0);
assert.match(pilot,/getElementById\("kaGrade09AssessmentMentors"\)/);
assert.match(pilot,/hero\.insertAdjacentElement\("afterend",section\)/);
assert.match(pilot,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.doesNotMatch(pilot,/localStorage|sessionStorage|indexedDB|\.setItem\(|\.removeItem\(|fetch\(|question-bank|answer-key|masteryAward|gradeChange/);
assert.match(pilot,/Archaemenes/);
assert.match(pilot,/NAIB/);
for(const [p,subject] of targets){
 const html=fs.readFileSync(path.join(root,p),"utf8");
 const tags=[...html.matchAll(/<script\b[^>]*grade09-assessment-mentor-guidance-v1\.js[^>]*><\/script>/g)];
 assert.equal(tags.length,1,p+" must include exactly one mentor guide");
 assert.match(tags[0][0],new RegExp('data-assessment-subject="'+subject+'"'));
 assert.match(html,/<main\b/i);
 console.log("PASS",p);
}
console.log("PASS grade 09 mentor assessment guidance — 9 surfaces, read-only");

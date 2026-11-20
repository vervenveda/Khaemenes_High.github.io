/* Grade 12 isolated assessment mentor guidance regression. */
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const guide=read("assets/grade12-assessment-mentor-guidance-v1.js");
new Function(guide);
const targets=[
 ["courses/language-arts/english-12/assessments/index.html","english-12"],
 ["courses/language-arts/english-12/assessments/diagnostic/index.html","english-12"],
 ["courses/science/physics-engineering-12/assessments/index.html","physics-engineering-12"],
 ["courses/social-studies/grade-12/assessments/semester_exam.html","social-studies-12"],
 ["courses/social-studies/grade-12/assessments/cumulative_final.html","social-studies-12"]
];
assert.match(guide,/section\.id="kaGrade12AssessmentMentors"/);
assert.match(guide,/getElementById\("kaGrade12AssessmentMentors"\)/);
assert.match(guide,/hero\.insertAdjacentElement\("afterend",section\)/);
assert.match(guide,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.doesNotMatch(guide,/localStorage|sessionStorage|indexedDB|\.setItem\(|\.removeItem\(|fetch\(|question-bank|answer-key|masteryAward|gradeChange/);
assert.match(guide,/NAIB/);assert.match(guide,/Archaemenes/);
for(const [p,subject] of targets){
 const html=read(p);
 const tags=[...html.matchAll(/<script\b[^>]*grade12-assessment-mentor-guidance-v1\.js[^>]*><\/script>/g)];
 assert.equal(tags.length,1,p+" must have one Grade 12 guide");
 assert.match(tags[0][0],new RegExp('data-assessment-subject="'+subject+'"'));
 assert.match(html,/<main\b/i);
 console.log("PASS",p);
}
const english=JSON.parse(read("courses/language-arts/english-12/03_assessment_schema.json"));
assert.equal(english.masteryThreshold,0.8);
assert.equal(english.completionGrantsMastery,false);
for(const name of ["essay","research","speech","debate","portfolio","oral_defense"])assert(english.humanReviewRequired.includes(name),name);
console.log("PASS English 12 mastery and review policy");
assert.match(read("courses/science/physics-engineering-12/assessments/index.html"),/80% mastery floor/);
console.log("PASS Physics and Engineering assessment boundary");
for(const p of ["semester_exam.html","cumulative_final.html"]){
 const html=read("courses/social-studies/grade-12/assessments/"+p);
 assert.match(html,/Required score: 70%/);
}
assert.match(guide,/currently specify 70% required scores/);
console.log("PASS Social Studies stated 70 percent examination rule preserved and flagged");
for(const p of ["courses/mathematics/precalculus-trigonometry/index.html","courses/mathematics/calculus-1/index.html"]){
 const html=read(p);
 assert.match(html,/Higher Learning/);
 assert.doesNotMatch(html,/grade12-assessment-mentor-guidance-v1/);
}
console.log("PASS Senior mathematics Higher Learning handoff untouched");
console.log("PASS Grade 12 guidance regression: 5 assessment surfaces / 3 hosted departments");

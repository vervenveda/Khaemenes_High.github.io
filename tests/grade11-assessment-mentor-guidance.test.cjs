/* Grade 11 isolated mentor guidance and existing course authority integrity. */
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const guide=read("assets/grade11-assessment-mentor-guidance-v1.js");
new Function(guide);
const targets=[
 ["courses/mathematics/algebra-2/assessments/index.html","algebra-2"],
 ["courses/mathematics/algebra-2/diagnostic/index.html","algebra-2"],
 ["courses/language-arts/english-11/assessments/index.html","english-11"],
 ["courses/language-arts/english-11/assessments/diagnostic/index.html","english-11"],
 ["courses/science/chemistry-11/assessments/index.html","chemistry-11"],
 ["courses/social-studies/grade-11/assessments/government-final.html","social-studies-11"],
 ["courses/social-studies/grade-11/assessments/economics-final.html","social-studies-11"]
];
assert.match(guide,/section\.id="kaGrade11AssessmentMentors"/);
assert.match(guide,/getElementById\("kaGrade11AssessmentMentors"\)/);
assert.match(guide,/hero\.insertAdjacentElement\("afterend",section\)/);
assert.match(guide,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.doesNotMatch(guide,/localStorage|sessionStorage|indexedDB|\.setItem\(|\.removeItem\(|fetch\(|question-bank|answer-key|masteryAward|gradeChange/);
assert.match(guide,/NAIB/);assert.match(guide,/Archaemenes/);
for(const [p,subject] of targets){
 const html=read(p);
 const tags=[...html.matchAll(/<script\b[^>]*grade11-assessment-mentor-guidance-v1\.js[^>]*><\/script>/g)];
 assert.equal(tags.length,1,p+" must have exactly one grade11 guide");
 assert.match(tags[0][0],new RegExp('data-assessment-subject="'+subject+'"'));
 assert.match(html,/<main\b/i);
 console.log("PASS",p);
}
const english=JSON.parse(read("courses/language-arts/english-11/03_assessment_schema.json"));
assert.equal(english.masteryThreshold,0.8);
assert.equal(english.completionGrantsMastery,false);
for(const name of ["essay","research","speech","debate","portfolio","oral_defense"])assert(english.humanReviewRequired.includes(name),name);
console.log("PASS English 11 mastery and human-review contract");
assert.match(read("courses/mathematics/algebra-2/assessments/index.html"),/data-assessment-runtime="gateway-single-owner"/);
console.log("PASS Algebra II single owner");
assert.match(read("courses/science/chemistry-11/assessments/index.html"),/80% mastery floor/);
console.log("PASS Chemistry 11 course-owned threshold description");
const mid=read("courses/social-studies/grade-11/assessments/midterm.html"),
 fin=read("courses/social-studies/grade-11/assessments/final.html");
assert.match(mid,/url=government-final\.html/);
assert.match(fin,/url=economics-final\.html/);
assert.doesNotMatch(mid,/grade11-assessment-mentor-guidance/);
assert.doesNotMatch(fin,/grade11-assessment-mentor-guidance/);
console.log("PASS Social Studies real examination destination routing");
console.log("PASS Grade 11 mentor guidance regression: 7 entry surfaces, 4 departments");

/* Grade 10 mentor assessment presentation and boundary regression.
 * No browser, answer bank, grade storage, or production profile is modified.
 */
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const guide=read("assets/grade10-assessment-mentor-guidance-v1.js");
new Function(guide);
const targets=[
 ["courses/mathematics/geometry/assessments/index.html","geometry"],
 ["courses/mathematics/geometry/diagnostic/index.html","geometry"],
 ["courses/language-arts/english-10/assessments/index.html","english-10"],
 ["courses/language-arts/english-10/assessments/diagnostic/index.html","english-10"],
 ["courses/science/biology-10/assessments/index.html","biology-10"],
 ["courses/social-studies/grade-10/assessments/midterm.html","social-studies-10"],
 ["courses/social-studies/grade-10/assessments/final.html","social-studies-10"]
];
assert.match(guide,/section\.id="kaGrade10AssessmentMentors"/);
assert.match(guide,/getElementById\("kaGrade10AssessmentMentors"\)/);
assert.match(guide,/hero\.insertAdjacentElement\("afterend",section\)/);
assert.match(guide,/document\.querySelector\("body > section\.hero"\)/);
assert.match(guide,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.doesNotMatch(guide,/localStorage|sessionStorage|indexedDB|\.setItem\(|\.removeItem\(|fetch\(|question-bank|answer-key|masteryAward|gradeChange/);
assert.match(guide,/NAIB/);assert.match(guide,/Archaemenes/);
for(const [p,subject] of targets){
 const html=read(p);
 const tags=[...html.matchAll(/<script\b[^>]*grade10-assessment-mentor-guidance-v1\.js[^>]*><\/script>/g)];
 assert.equal(tags.length,1,p+" must contain exactly one guide");
 assert.match(tags[0][0],new RegExp('data-assessment-subject="'+subject+'"'));
 assert.match(html,/<main\b/i);
 console.log("PASS guide mounted",p);
}
const schema=JSON.parse(read("courses/language-arts/english-10/03_assessment_schema.json"));
assert.equal(schema.masteryThreshold,0.8);
assert.equal(schema.completionGrantsMastery,false);
assert(schema.humanReviewRequired.includes("essay")&&schema.humanReviewRequired.includes("oral_defense"));
console.log("PASS English 10 human-review contract");
const geometry=read("courses/mathematics/geometry/assessments/index.html");
assert.match(geometry,/data-assessment-runtime="gateway-single-owner"/);
console.log("PASS Geometry single-owner assessment runtime");
const biology=read("courses/science/biology-10/assessments/index.html");
assert.match(biology,/80% mastery floor/);
console.log("PASS Biology 10 subject-owned mastery description");
console.log("PASS Grade 10 guidance regression — 7 surfaces and subject contracts");

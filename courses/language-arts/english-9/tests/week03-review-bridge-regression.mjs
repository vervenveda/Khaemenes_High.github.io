import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const script=fs.readFileSync(path.join(base,"assets/week03-review-contract.js"),"utf8");
const gradeScript=fs.readFileSync(path.join(base,"assets/week03-gradebook-bridge.js"),"utf8");
const gradeHtml=fs.readFileSync(path.join(base,"records/gradebook.html"),"utf8");
const day15Html=fs.readFileSync(path.join(base,"weeks/week-03/day-15/index.html"),"utf8");
const dailyScript=fs.readFileSync(path.join(base,"assets/week03-daily.js"),"utf8");
new vm.Script(script);new vm.Script(gradeScript);new vm.Script(dailyScript);
const holder={exports:{}};vm.runInNewContext(script,{module:holder,Date,Number,String,JSON,Object,Set});
const A=holder.exports;
assert.equal(A.scoreRows({inquiry:2,evidence:2,synthesis:2,reasoning:1,clarity:1}),8);
assert.equal(A.scoreRows({inquiry:2,evidence:2,synthesis:2,reasoning:2}),null);
assert.equal(A.scoreRows({inquiry:2,evidence:2,synthesis:2,reasoning:2,clarity:3}),null);
assert.equal(A.scoreRows({inquiry:2,evidence:2,synthesis:2,reasoning:2,clarity:null}),null);
const submitted={schema:A.schema,submittedAt:"2026-10-15T12:00:00Z",
 learnerId:"LearnerA",day:15,independentDraftWordCount:520,finalWordCount:570,
 conventionsEntered:10,gradeStatus:"awaiting-evaluator",masteryAwarded:false};
assert.ok(A.validateSubmission(submitted));
const rows={inquiry:2,evidence:2,synthesis:2,reasoning:1,clarity:1};
const human=A.makeReview(submitted,rows,"Parent Teacher","Reasoning needs stronger links between Text C and Text D.","2026-10-15T12:45:00Z");
assert.equal(human.rubricScore,8);assert.equal(human.gradeStatus,"passed");
assert.equal(human.masteryAwarded,true);assert.ok(A.validateReview(human));
const below=A.makeReview(submitted,{inquiry:2,evidence:1,synthesis:1,reasoning:1,clarity:2},"Parent Teacher",
 "Return to source relationships and revise the supporting evidence.","2026-10-15T12:46:00Z");
assert.equal(below.rubricScore,7);assert.equal(below.gradeStatus,"revision-required");assert.equal(below.masteryAwarded,false);
assert.equal(A.validateReview({...human,rubricScore:10}),false,"Score must equal five rows");
assert.equal(A.validateReview({...human,learnerId:""}),false,"Learner required");
assert.equal(A.validateReview({...human,rubricRows:{...human.rubricRows,inquiry:3}}),false,"Row scores constrained");
assert.equal(A.reviewMatchesSubmission(human,submitted),true);
assert.equal(A.reviewMatchesSubmission(human,{...submitted,learnerId:"LearnerB"}),false);
assert.equal(A.reviewMatchesSubmission(human,{...submitted,submittedAt:"2026-10-15T13:00:00Z"}),false);
assert.equal(A.reviewMatchesSubmission(human,{...submitted,finalWordCount:571}),false);
const file={schema:A.exportSchema,exportedAt:"2026-10-15T12:50:00Z",review:human};
assert.equal(A.parseEvaluationFile(file).rubricScore,8);
assert.throws(()=>A.parseEvaluationFile({...file,review:{...human,masteryAwarded:false}}));
assert.throws(()=>A.makeReview(submitted,{inquiry:2,evidence:2,synthesis:2,reasoning:2,clarity:2},"","Not enough"));
for(const id of ["w3-review","w3-evaluator","w3-feedback","w3-import-evidence","w3-export-review","w3-save-review","w3-load-local","w3-review-status","w3-score"]){
 assert.match(gradeHtml,new RegExp('id="'+id+'"'));
}
for(const [id] of A.labels){
 assert.match(gradeHtml,new RegExp('id="w3-row-'+id+'"'));
}
assert.match(gradeHtml,/data-save-field="grade-score-1"/);
assert.match(gradeHtml,/week03-gradebook-bridge\.js/);
assert.match(gradeHtml,/week03-review-contract\.js/);
assert.match(day15Html,/id="week3-import-evaluation"/);
assert.match(day15Html,/week03-review-contract\.js/);
assert.match(gradeHtml,/does not authenticate reviewers/);
assert.match(day15Html,/does not authenticate educator identities/);
assert.match(dailyScript,/reviewContract\.reviewMatchesSubmission/);
assert.match(dailyScript,/if\(!write\(receiptKey,JSON\.stringify\(reviewed\)\)/);
assert.match(gradeScript,/localStorage\.getItem\(receiptKey\)!==sourceSnapshot/);
console.log("PASS English 9 Day15 review bridge: five criteria, 8/10 pass, 7/10 corrective route, exact submission binding, safe export/import contracts and gradebook links");

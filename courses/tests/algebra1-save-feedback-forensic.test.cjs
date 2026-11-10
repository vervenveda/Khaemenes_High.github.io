"use strict";
/* Algebra I cumulative and weekly save-feedback contract
 * node --test courses/tests/algebra1-save-feedback-forensic.test.cjs
 */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exam=read("mathematics/algebra-1/assets/exam-engine.js");
const weekly=read("mathematics/algebra-1/assessments/assets/weekly-mastery-engine-v2.js");
test("Cumulative Save Draft never reports a successful save when the writer failed",()=>{
 const match=exam.match(/\$\("#saveButton"\)\.onclick=\(\)=>\{[^\n]+\};/);
 assert.ok(match,"cumulative Save Draft handler not found");
 const status={textContent:"original"};
 const controls={"#status":status};
 const fn=vm.runInNewContext('let saveDraft=()=>false;const $=id=>controls[id];'+match[0]+';controls["#saveButton"].onclick', {controls:{"#saveButton":{},...controls}});
 fn();
 assert.equal(status.textContent,"original","failed writer cannot show 'Saved'");
 const success={textContent:""};
 const successControls={"#saveButton":{},"#status":success};
 const successful=vm.runInNewContext('let saveDraft=()=>true;const $=id=>controls[id];'+match[0]+';controls["#saveButton"].onclick',{controls:successControls});
 successful();
 assert.match(success.textContent,/verified/i);
});
test("weekly draft feedback reflects actual storage outcome",()=>{
 assert.ok(weekly.includes('saveDraft()?"Draft saved in this browser.":"Draft could not be saved.'));
 assert.ok(weekly.includes("if(localStorage.getItem(STORE)!==serialized)"));
});
test("Algebra I review confirms both sources of legacy completion-only mastery inference",()=>{
 const src=read("mathematics/algebra-1/assets/mastery-authority-v1.js");
 assert.ok(src.includes('source:"shared-progress-completed"'));
 assert.ok(src.includes('scores?.[id]'));
 assert.ok(src.includes('scores?.mastery'));
});

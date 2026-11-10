"use strict";
/* Synthetic-only High School family/grade context tests.
 * Run: node --test grades/tests/high-profile-family-context.test.cjs
 */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const contextCode=fs.readFileSync(path.join(root,"shared/high-school-profile-grade-context.js"),"utf8");
const upperCode=fs.readFileSync(path.join(root,"shared/grade09-blueprint-upper-grade.js"),"utf8");
const grade09=fs.readFileSync(path.join(root,"grade-09/student-profile/index.html"),"utf8");
const KEY={family:"khaemenes_active_family_v1",learner:"khaemenes_active_learner_v1",registry:"khaemenes_family_registry_v1"};
const fixture=()=>({
 families:{"family-a":{familyId:"family-a",learnerIds:["learner-09","learner-11"]}},
 learners:{"learner-09":{learnerId:"learner-09",familyId:"family-a",stage:"high",grade:"09",nickname:"Learner Nine"},
 "learner-11":{learnerId:"learner-11",familyId:"family-a",stage:"high",grade:"11",nickname:"Learner Eleven"},
 "outside":{learnerId:"outside",familyId:"family-b",stage:"high",grade:"10",nickname:"Outsider"}}
});
function load(state,{family="family-a",learner="learner-09"}={}){
 const values=new Map([[KEY.family,JSON.stringify(family)],[KEY.learner,JSON.stringify(learner)],[KEY.registry,JSON.stringify(state)]]);
 const window={localStorage:{getItem:k=>values.has(k)?values.get(k):null}};
 vm.runInNewContext(contextCode,{window,Date,Object,Set,String,Number,JSON});
 return {api:window.KhaemenesHighProfileGradeContext,values};
}
test("registered Grade 09 learner is accepted by family and grade",()=>{
 const {api}=load(fixture());const a=api.activeForGrade("09");
 assert.equal(a.learnerId,"learner-09");assert.equal(api.activeForGrade("10"),null);
});
test("active learner must be linked to active family, including exact membership",()=>{
 const state=fixture();state.families["family-a"].learnerIds=["learner-11"];
 assert.equal(load(state).api.active(),null);
 assert.equal(load(fixture(),{family:"family-b"}).api.active(),null);
 assert.equal(load(fixture(),{learner:"outside"}).api.active(),null);
});
test("invalid stage or adult learner cannot be shown as a High School student",()=>{
 const state=fixture();state.learners["learner-09"].selfDirectedAdult=true;
 assert.equal(load(state).api.active(),null);
 state.learners["learner-09"].selfDirectedAdult=false;state.learners["learner-09"].stage="middle";
 assert.equal(load(state).api.active(),null);
});
test("Grade 10–12 blueprint blocks missing or mismatched identity",()=>{
 assert.ok(upperCode.includes("const wrong=!info||info.gradeNumber!==Number(grade)"));
 assert.ok(upperCode.includes("p?.learnerId&&p.learnerId!==info.learnerId"));
 assert.ok(upperCode.includes("id&&id!==info.learnerId"));
});
test("Grade 09 refreshes identity instead of displaying cached sibling info",()=>{
 assert.ok(grade09.includes('activeForGrade?.("09")'));
 assert.ok(grade09.includes("window.addEventListener('khaemenes-family-changed'"));
 assert.ok(grade09.includes("khaemenes_active_learner_v1"));
 assert.ok(grade09.includes("if(!id){"));
 assert.ok(grade09.includes("document.getElementById('courseManagerGrid').replaceChildren()"));
});
test("Grade 09 discards stale async course updates",()=>{
 assert.ok(grade09.includes("shownLearnerId!==expectedId||activeGrade09()?.learnerId!==expectedId"));
 assert.ok(grade09.includes("if(!activeGrade09()||activeGrade09().learnerId!==shownLearnerId){event.preventDefault();return}"));
});

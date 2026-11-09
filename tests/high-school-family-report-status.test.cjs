"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"grades/shared/high-school-family-report-status.js"),"utf8");
function mock(grade="09",chosen="learner-a",rows=[]){
 const listeners={};
 const context={
  location:{pathname:"/Khaemenes_High.github.io/grades/grade-"+grade+"/student-profile/"},
  KhaemenesHighProfileGradeContext:{active:()=>chosen?{grade,learnerId:chosen}:null},
  KhaemenesLearningContinuation:{readLearner:()=>rows},
  addEventListener:(name,fn)=>{listeners[name]=fn}
 };
 context.window=context;
 const document={readyState:"loading",addEventListener:(name,fn)=>{listeners["document:"+name]=fn}};
 vm.runInNewContext(source,{window:context,document},{timeout:3000});
 return {api:context.KhaemenesHighFamilyReportStatus,listeners};
}
test("reports only chosen learner in matching registered grade",()=>{
 const rows=[
  {learnerId:"learner-a",grade:"09",courseId:"math",status:"continue",updatedAt:"2026-11-09T06:00:00Z",stale:false},
  {learnerId:"learner-b",grade:"09",courseId:"secret",status:"complete",stale:false},
  {learnerId:"learner-a",grade:"10",courseId:"prior",status:"mastery",stale:false},
  {learnerId:"learner-a",grade:"09",courseId:"english",status:"mastery",stale:true}
 ];
 const s=mock("09","learner-a",rows).api.overview();
 assert.equal(s.valid,true);assert.equal(s.reported,2);assert.equal(s.attention,1);assert.equal(s.stale,1);
});
test("missing or mismatched learner fails closed",()=>{
 assert.equal(mock("09",null,[]).api.overview().valid,false);
 const x=mock("09","learner-c",[]).api.overview();
 assert.equal(x.reported,0);
});
test("read-only module never writes school, grade, or family records",()=>{
 assert.doesNotMatch(source,/\blocalStorage\.setItem\s*\(/);
 assert.doesNotMatch(source,/\bpublish\s*\(/);
 assert.doesNotMatch(source,/\bregisterLearner\s*\(/);
 for(const grade of ["09","10","11","12"]){
  const s=fs.readFileSync(path.join(root,"grades/grade-"+grade+"/student-profile/index.html"),"utf8");
  assert.match(s,/high-school-family-report-status\.js/);
  assert.match(s,/high-school-profile-grade-context\.js/);
  assert.match(s,/khaemenes-learning-continuation\.js/);
 }
});

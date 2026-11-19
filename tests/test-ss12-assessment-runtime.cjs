#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),memory=new Map();
const storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
const w={localStorage:storage,crypto:require("node:crypto").webcrypto};w.window=w;
const ctx=vm.createContext({window:w,localStorage:storage,Uint32Array,Date,Math,Set,Map,Array,Object,Number,String,JSON});
for(const file of ["monte-carlo-assessment-v1.js","high-school-assessment-adapter-v1.js"]){
 vm.runInContext(fs.readFileSync(path.join(root,"courses/shared",file),"utf8"),ctx,{filename:file});
}
const raw=fs.readFileSync(path.join(root,"courses/social-studies/grade-12/course-data.js"),"utf8");
const prefix="window.KHAEMENES_GRADE12_DATA = ";
assert(raw.startsWith(prefix),"Runtime senior course export missing");
const app=JSON.parse(raw.slice(prefix.length).trim().replace(/;$/,""));
const adapter=w.KhaemenesHighAssessmentAdapter;
assert.equal(adapter.masteryThreshold,80);

const key="fictional-learner-one-ss12-w13";
const bank=app.weeks[12].quiz.questions;
const first=adapter.open({courseId:"global-politics-12",storageKey:key,kind:"weekly",bank,count:10});
assert.equal(first.questions.length,10);
const resume=adapter.open({courseId:"global-politics-12",storageKey:key,kind:"weekly",bank,count:10});
assert.equal(resume.sessionId,first.sessionId,"Refreshing altered active quiz");
assert.deepEqual(JSON.stringify(resume.questions),JSON.stringify(first.questions),"Option order changed during resume");
assert(first.questions.every(q=>q.choices[q.answer]===bank.find(b=>b.id===q.id).explanation),"Answer remapping failed");
const positions=[0,0,0,0];first.questions.forEach(q=>positions[q.answer]++);
assert(positions.every(n=>n>=2),"Correct answers not balanced");

const before=first.sessionId;
adapter.complete(first,{score:80,mastered:true});
assert(memory.get(key).includes(before),"Historical attempt not persisted");
const second=adapter.open({courseId:"global-politics-12",storageKey:key,kind:"weekly",bank,count:10});
assert.notEqual(second.sessionId,before,"Retake did not create new session");
adapter.complete(second,{score:60,mastered:false});
const record=JSON.parse(memory.get(key));
assert.equal(record.attempts.length,2);
assert.equal(record.attempts[0].summary.score,80);
assert.equal(record.attempts[1].summary.score,60);

const otherKey="fictional-learner-two-ss12-w13";
const other=adapter.open({courseId:"global-politics-12",storageKey:otherKey,kind:"weekly",bank,count:10});
assert.notEqual(other.sessionId,second.sessionId,"Learner sessions collided");
assert.equal(JSON.parse(memory.get(otherKey)).attempts.length,0);

for(const week of [17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]){
 const weekBank=app.weeks[week-1].quiz.questions;
 const storageKey="fictional-engine-audit-week-"+week;
 const session=adapter.open({courseId:"global-politics-12",storageKey,kind:"weekly",bank:weekBank,count:10});
 assert.equal(session.questions.length,10,"Week "+week+" quiz size");
 assert(session.questions.every(q=>q.choices[q.answer]===weekBank.find(x=>x.id===q.id).explanation),
   "Week "+week+" shuffled answer mapping");
 const restored=adapter.open({courseId:"global-politics-12",storageKey,kind:"weekly",bank:weekBank,count:10});
 assert.equal(restored.sessionId,session.sessionId,"Week "+week+" refresh session drift");
}
console.log("PASS SS12 external runtime banks: fictional two-learner sessions, option-key remapping, refresh, retake and immutable recorded scores");

#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),memory=new Map();
const storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
const w={localStorage:storage,crypto:require("node:crypto").webcrypto};
w.window=w;
const ctx=vm.createContext({window:w,localStorage:storage,Uint32Array,Date,Math,Set,Map,Array,Object,Number,String,JSON});
for(const file of ["monte-carlo-assessment-v1.js","high-school-assessment-adapter-v1.js"]){
 vm.runInContext(fs.readFileSync(path.join(root,"courses/shared",file),"utf8"),ctx,{filename:file});
}
const html=fs.readFileSync(path.join(root,"courses/social-studies/grade-12/index.html"),"utf8");
const i=html.indexOf("const APP = "),j=html.indexOf(";\n",i),app=JSON.parse(html.slice(i+12,j));
const adapter=w.KhaemenesHighAssessmentAdapter;
assert.equal(adapter.masteryThreshold,80);
const key="fictional-learner-one-ss12-w13";
const bank=app.weeks[12].quiz;
const first=adapter.open({courseId:"global-politics-12",storageKey:key,kind:"weekly",bank,count:10});
assert.equal(first.questions.length,10);
const resume=adapter.open({courseId:"global-politics-12",storageKey:key,kind:"weekly",bank,count:10});
assert.equal(resume.sessionId,first.sessionId,"Refreshing altered active quiz");
assert.deepEqual(JSON.stringify(resume.questions),JSON.stringify(first.questions),"Option order changed during resume");
assert(first.questions.every(q=>q.choices[q.answer]===bank.find(b=>b.id===q.id).explain),"Answer remapping failed");
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
const other=adapter.open({courseId:"global-politics-12",storageKey:"fictional-learner-two-ss12-w13",kind:"weekly",bank,count:10});
assert.notEqual(other.sessionId,second.sessionId,"Learner sessions collided");
assert.equal(JSON.parse(memory.get("fictional-learner-two-ss12-w13")).attempts.length,0);
console.log("PASS SS12 fictional two-learner sessions, option-key remapping, session refresh, retake and immutable recorded scores");

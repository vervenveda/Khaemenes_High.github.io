import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(p,'utf8');
const app=read('courses/social-studies/grade-10/app.js');
const data=JSON.parse(read('courses/social-studies/grade-10/course-data.js')
  .replace(/^window[.]KHAEMENES_SOCIAL_STUDIES_DATA\s*=\s*/, '').trim().replace(/;$/, ''));
assert.equal(data.weeks.length,36,'canonical 36-week course retained');
new vm.Script(app,{filename:'grade10-app.js'});

const start=app.indexOf('function highAssessmentDraw(');
const end=app.indexOf('function quizHTML(w,s){',start);
assert.ok(start>=0 && end>start,'actual session bridge extracted');
const bridge=app.slice(start,end);
const sourceEngine=read('courses/shared/monte-carlo-assessment-v1.js');
const sourceAdapter=read('courses/shared/high-school-assessment-adapter-v1.js');

const stored=new Map();
const localStorage={
 getItem:k=>stored.has(k)?stored.get(k):null,
 setItem(k,v){stored.set(String(k),String(v))},
 removeItem:k=>stored.delete(k)
};
const context={localStorage,Math,Date,console,URL,encodeURIComponent,
 KEY:data.metadata.storageKey,window:{},document:{},alert(){throw Error('Unexpected alert')}};
context.window.window=context.window;
context.window.KhaemenesHighLearningContext={recordAssessment(){}};
vm.createContext(context);
vm.runInContext(sourceEngine,context);
vm.runInContext(sourceAdapter,context);
vm.runInContext(bridge+';window.grade10Test={highAssessmentDraw,highAssessmentComplete,highAssessmentReviewSkills};',context);
const api=context.window.grade10Test;
const mc=context.window.KhaeMonteCarloAssessment;
const adapter=context.window.KhaemenesHighAssessmentAdapter;

assert.equal(adapter.masteryThreshold,80);
assert.ok(app.includes('score>=80'),'80% objective boundary remains explicit');
assert.ok(app.includes('constructedResponsePendingReview:true'),'human review remains separate');
const legacyKey=data.metadata.storageKey;
const legacy='{"version":2,"students":[{"id":"original","quizzes":{"1":{"bestPercent":90,"attempts":2}}}]}';
stored.set(legacyKey,legacy);

for(const week of data.weeks){
 const questions=week.quiz.questions;
 assert.equal(questions.length,10,'10 questions in week '+week.week);
 assert.equal(new Set(questions.map(q=>q.id)).size,10);
 const a=api.highAssessmentDraw(week.week,{id:'learner-A'},questions);
 assert.ok(!a.error,a.error||'');
 assert.equal(a.questions.length,10);
 assert.equal(new Set(a.opened.questionIds).size,10);
 assert.equal(a.opened.kind,'weekly');
 const again=api.highAssessmentDraw(week.week,{id:'learner-A'},questions);
 assert.equal(again.opened.sessionId,a.opened.sessionId,'refresh must preserve form');
 assert.deepEqual(Array.from(again.opened.questionIds),Array.from(a.opened.questionIds));
 const b=api.highAssessmentDraw(week.week,{id:'learner-B'},questions);
 assert.ok(!b.error,b.error||'');
 assert.notEqual(a.storageKey,b.storageKey,'learner storage isolated');
 assert.notEqual(a.opened.sessionId,b.opened.sessionId,'independent learner sessions');
 // Preserve an actual answer and recover it on refresh.
 assert.equal(mc.saveResponse(a.storageKey,a.questions[0].id,0,a.opened.sessionId),true);
 const resumed=api.highAssessmentDraw(week.week,{id:'learner-A'},questions);
 assert.equal(resumed.responses[a.questions[0].id],0);
 const answers=a.questions.map(q=>q.answer);
 assert.deepEqual(Array.from(api.highAssessmentReviewSkills(a.questions,answers)),[]);
 const missed=answers.slice();missed[0]=(missed[0]+1)%a.questions[0].choices.length;
 assert.ok(api.highAssessmentReviewSkills(a.questions,missed).length>0);
 // All source-derived correct choices must score full points under the randomized form.
 assert.equal(a.questions.filter((q,i)=>answers[i]===q.answer).length,10);
 assert.equal(mc.isActive(a.storageKey,a.opened.sessionId),true);
 const summary={attemptId:a.opened.sessionId,questionIds:Array.from(a.opened.questionIds),
   reviewSkills:[],score:100,mastered:true,constructedResponsePendingReview:true};
 assert.equal(api.highAssessmentComplete(a,summary),true);
 assert.equal(mc.isActive(a.storageKey,a.opened.sessionId),false);
 const retake=api.highAssessmentDraw(week.week,{id:'learner-A'},questions);
 assert.ok(!retake.error,retake.error||'');
 assert.notEqual(retake.opened.sessionId,a.opened.sessionId,'retake must create new form');
 assert.equal(mc.isActive(b.storageKey,b.opened.sessionId),true,'other learner unchanged');
}
assert.equal(stored.get(legacyKey),legacy,'legacy gradebook bytes must not be migrated or overwritten by session bridge');

const missing=api.highAssessmentDraw(1,null,data.weeks[0].quiz.questions);
assert.ok(missing.error,'unbound learner must fail closed');
const before=stored.size;
const originalSet=localStorage.setItem;
localStorage.setItem=()=>{throw Error('quota exceeded')};
const fail=api.highAssessmentDraw(1,{id:'storage-denied'},data.weeks[0].quiz.questions);
assert.ok(fail.error,'unpersisted session must not be graded');
localStorage.setItem=originalSet;
assert.equal(stored.size,before,'storage failure must not alter records');
assert.equal(adapter.policy('weekly').bookMode,'open-book');
assert.equal(adapter.policy('final').bookMode,'closed-book');
console.log('PASS: Grade 10 · 36×10 question banks; learner-bound sessions; refresh; response recovery; shuffled answer scoring; reviews; distinct retakes; storage failures; legacy gradebook preserved; 80% policy.');

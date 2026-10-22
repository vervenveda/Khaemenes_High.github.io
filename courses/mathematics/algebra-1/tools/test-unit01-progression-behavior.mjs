// Exercise the actual Unit 01 progression functions without a browser or changing learner records.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root='courses/mathematics/algebra-1/units/unit-01/assets/';
const data={window:{}};
vm.runInNewContext(fs.readFileSync(root+'unit01-data.js','utf8'),data);
const storage=new Map();
const localStorage={
 getItem:key=>storage.has(key)?storage.get(key):null,
 setItem:(key,value)=>storage.set(key,String(value)),
 removeItem:key=>storage.delete(key)
};
const window={KHAE_UNIT01:data.window.KHAE_UNIT01,KhaemenesAlgebra1StudentExperience:{enhance(){}}};
const document={body:{dataset:{mode:'audit'}},querySelector(){return null},querySelectorAll(){return []}};
const ctx=vm.createContext({window,document,localStorage,console,URL,URLSearchParams,Date,Math});
vm.runInContext(fs.readFileSync(root+'unit01.js','utf8'),ctx,{filename:'unit01.js'});
const unlocked=n=>vm.runInContext('lessonUnlocked('+n+')',ctx);
const mastered=n=>vm.runInContext('lessonMastered('+n+')',ctx);
const week=n=>vm.runInContext('weekMastered('+n+')',ctx);
const allUnitWeeks=()=>vm.runInContext('allUnitWeeksMastered()',ctx);
const allLessons=()=>vm.runInContext('allLessonsMastered()',ctx);
const KEY='khaemenes-algebra1-unit01-a3-v1';
const WEEK='khaemenes-algebra1-weekly-mastery-v2';
function scores(values){localStorage.setItem(KEY,JSON.stringify({attempts:[],best:values}));}
function weeks(values){localStorage.setItem(WEEK,JSON.stringify({weeks:values}));}
assert.equal(unlocked(1),true);
for(let n=2;n<=6;n++)assert.equal(unlocked(n),false,'unearned lesson '+n+' must remain locked');
scores({'lesson-1':79});assert.equal(unlocked(2),false,'79% must not unlock');
scores({'lesson-1':80});assert.equal(unlocked(2),true,'80% unlocks lesson 02');
scores({'lesson-1':80,'lesson-2':80,'lesson-3':80});
assert.equal(unlocked(3),true);
assert.equal(unlocked(4),false,'Lesson 04 must require Week 02 mastery');
weeks({2:{best:79}});assert.equal(unlocked(4),false);
weeks({2:{best:80}});assert.equal(unlocked(4),true);
assert.equal(week(2),true);assert.equal(week(3),false);
scores({'lesson-1':80,'lesson-2':80,'lesson-3':80,'lesson-4':79});
assert.equal(unlocked(5),false,'Lesson 05 requires Lesson 04 mastery');
scores({'lesson-1':80,'lesson-2':80,'lesson-3':80,'lesson-4':80,'lesson-5':80});
assert.equal(unlocked(6),true);
assert.equal(allLessons(),false);assert.equal(allUnitWeeks(),false);
scores(Object.fromEntries(Array.from({length:6},(_,i)=>['lesson-'+(i+1),80])));
weeks({2:{best:80},3:{best:79}});
assert.equal(allLessons(),true);assert.equal(allUnitWeeks(),false,'Week 03 mastery required for unit check');
weeks({2:{best:80},3:{best:80}});
assert.equal(allUnitWeeks(),true);
localStorage.setItem(WEEK,'{invalid json');assert.equal(allUnitWeeks(),false,'Malformed weekly records must fail closed');
localStorage.removeItem(KEY);assert.equal(mastered(1),false,'Missing scores do not award mastery');
console.log('PASS Unit 01 behavioral gates: lessons 01-06, 79/80 thresholds, Week 02/03 boundaries, malformed storage');

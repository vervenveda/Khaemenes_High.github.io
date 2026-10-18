import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const records=fs.readFileSync('courses/shared/upper-english-records.js','utf8');
const scope=fs.readFileSync('courses/shared/learner-scope-v1.js','utf8');
function harness(grade,values=new Map(),id='a'){
 class Store {getItem(k){return values.get(String(k))??null}setItem(k,v){if(this.fail)throw Error('Storage is full');values.set(String(k),String(v))}removeItem(k){values.delete(String(k))}key(i){return [...values.keys()][i]}get length(){return values.size}}
 let profile={learnerId:id,name:id};const local=new Store();
 const document={currentScript:{dataset:{learnerScope:`english-${grade}`}},scripts:[],readyState:'loading',addEventListener(){},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createElement:()=>({dataset:{},setAttribute(){},addEventListener(){}}),head:{appendChild(){},append(){}},documentElement:{dataset:{},append(){}}};
 const c={window:{localStorage:local,addEventListener(){},KhaemenesCourseEntryContract:{readAcademyProfile:()=>profile}},document,Storage:Store,localStorage:local,location:{protocol:'file:'},navigator:{},Date,console,Blob,URL,setTimeout:()=>0};vm.createContext(c);vm.runInContext(scope,c);vm.runInContext(records,c);
 const engine=fs.readFileSync(`courses/language-arts/english-${grade}/assets/course.js`,'utf8').replace(/\}\)\(\);\s*$/,';window.engineAudit={calcStats,average,weekState,unitState,examState,getState:()=>state,save,recordStore};})();');
 vm.runInContext(engine,c);
 return {c,api:c.window.engineAudit,local,values,key:`khae-ela${grade}-state-v1:learner:${id}`,switchTo:next=>profile={learnerId:next,name:next}};
}
for(const grade of [10,11,12]){
 const a=harness(grade);assert.equal(a.api.average([100,0]),50);
 assert.equal(a.api.calcStats().grade,null,'Missing scores cannot become zeros');
 a.api.weekState(1).quiz={best:100,attempts:[{score:100}]};a.api.weekState(2).quiz={best:0,attempts:[{score:0}]};
 assert.equal(a.api.calcStats().quizAvg,50);assert.equal(a.api.calcStats().grade,50);
 a.api.examState('midterm').best=0;a.api.examState('midterm').attempts.push({score:0});assert.equal(a.api.calcStats().mid,0);
 assert.equal(a.api.save(),true);const saved=a.values.get(a.key);
 const b=harness(grade,a.values,'b');assert.equal(b.api.calcStats().quizAvg,null,'A separate learner starts with separate evidence');
 assert.equal(b.api.save(),true);assert.equal(a.values.get(a.key),saved);
 const tab1=harness(grade,a.values),tab2=harness(grade,a.values);
 tab1.api.getState().studentName='changed';assert.equal(tab1.api.save(),true);
 tab2.api.getState().studentName='stale';assert.equal(tab2.api.save(),false,'A stale tab cannot overwrite current saved data');
 assert.equal(JSON.parse(a.values.get(a.key)).studentName,'changed');
 const before=a.values.get(a.key),importer=harness(grade,a.values);
 assert.equal(importer.api.recordStore.replace({courseId:'ela'+grade}),false);
 assert.equal(a.values.get(a.key),before,'Malformed imports must not replace data');
 const full=JSON.parse(before);full.studentName='imported';assert.equal(importer.api.recordStore.replace(full),true);
 assert.ok([...a.values.keys()].some(k=>k.includes(':recovery:')),'Import retains a prior-record recovery copy');
 const quota=harness(grade,a.values);quota.local.fail=true;assert.equal(quota.api.save(),false);quota.local.fail=false;assert.equal(quota.api.save(),true);
 const switched=harness(grade,a.values);switched.switchTo('b');assert.equal(switched.api.save(),false,'Profile switches stop stale saves');
 const corrupt=new Map([[a.key,JSON.stringify({courseId:'ela'+grade})]]),recovered=harness(grade,corrupt);
 assert.equal(recovered.api.recordStore.blocked,true);assert.equal(recovered.api.save(),false);
 assert.equal(corrupt.get(a.key),JSON.stringify({courseId:'ela'+grade}));
 assert.equal(recovered.api.recordStore.replace(full),true,'A valid explicit import can recover a preserved malformed record');
 const week=recovered.api.weekState(3);week.days={Monday:true,Tuesday:true,Wednesday:true,Thursday:true,Friday:true};week.quiz={best:0,attempts:[{score:0}]};
 assert.equal(recovered.c.window.KhaemenesEnglishRecords.weeksComplete(recovered.api.getState())[2],false);
 week.quiz={best:80,attempts:[{score:80}]};assert.equal(recovered.c.window.KhaemenesEnglishRecords.weeksComplete(recovered.api.getState())[2],true);
 console.log(`PASS: English ${grade} zero grades, separate learners, stale tabs, imports/recovery, failed saves and evidence-based dashboard weeks`);
}

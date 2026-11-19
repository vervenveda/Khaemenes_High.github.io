import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
import path from "node:path";

const here=path.dirname(fileURLToPath(import.meta.url));
const enginePath=path.resolve(here,"../../assets/algebra2-progression.js");
const engine=fs.readFileSync(enginePath,"utf8");

class Storage {
  constructor(seed={}){this.map=new Map(Object.entries(seed))}
  get length(){return this.map.size}
  key(i){return [...this.map.keys()][i]??null}
  getItem(k){return this.map.has(k)?this.map.get(k):null}
  setItem(k,v){this.map.set(String(k),String(v))}
  removeItem(k){this.map.delete(k)}
}
const learner="fixture-learner";
const baseSeed={
  khaemenes_active_learner_v1:JSON.stringify(learner),
  khaemenes_family_registry_v1:JSON.stringify({learners:{"fixture-learner":{learnerId:"fixture-learner"}}})
};
const scoped=key=>key+":learner:"+encodeURIComponent(learner);
const A="khaemenes-algebra2-assessment-records-v1";
const L="khaemenes-algebra2-lesson-progress-v1";
const W="khaemenes-algebra2-weekly-mastery-v1";
const pass=(score=80)=>({attempts:[{score}],bestScore:score,score,mastery:true});
const lessonPass=(score=80)=>({attempts:[{score}],bestScore:score,score,mastery:true,complete:true});
const weekPass=(score=80)=>({attempts:[{score}],best:score});
const counts={1:6,2:8,3:7,4:8,5:6,6:7,7:7,8:6,9:7,10:10,11:8,12:7,13:5};
const weeks={1:[2,3],2:[4,5,6],3:[7,8,9],4:[10,11,12],5:[13,14],6:[15,16,17],7:[19,20,21],8:[22,23],9:[24,25,26],10:[27,28,29,30],11:[31,32,33],12:[34,35],13:[36]};

function fullUnit(unit){
  const assessments={},lessons={},weekly={weeks:{}};
  assessments["unit-"+String(unit).padStart(2,"0")+"-mastery"]=pass();
  for(let i=1;i<=counts[unit];i++)lessons["u"+String(unit).padStart(2,"0")+"-l"+String(i).padStart(2,"0")]=lessonPass();
  for(const w of weeks[unit])weekly.weeks[w]=weekPass();
  return {assessments,lessons,weekly};
}
function mergeState(parts){
  const assessments={},lessons={},weekly={weeks:{}};
  for(const p of parts){Object.assign(assessments,p.assessments||{});Object.assign(lessons,p.lessons||{});Object.assign(weekly.weeks,p.weekly?.weeks||{})}
  return {assessments,lessons,weekly};
}
function boot(state={}){
  const assessments=state.assessments||{},lessons=state.lessons||{},weekly=state.weekly||{weeks:{}};
  const storage=new Storage({...baseSeed,[scoped(A)]:JSON.stringify(assessments),[scoped(L)]:JSON.stringify(lessons),[scoped(W)]:JSON.stringify(weekly)});
  const document={body:{dataset:{}},readyState:"complete",querySelector(){return null},querySelectorAll(){return []},addEventListener(){}};
  const context={
    window:{KhaemenesCourseEntryContract:{readAcademyProfile:()=>({id:learner})}},
    document,localStorage:storage,console,setTimeout,clearTimeout,encodeURIComponent,JSON,Number,String,Array,Object,Math,Date
  };
  context.window.window=context.window;context.window.document=document;context.window.localStorage=storage;
  vm.createContext(context);vm.runInContext(engine,context,{filename:"algebra2-progression.js"});
  return {P:context.window.KhaemenesAlgebra2Progression,storage,context};
}
const results=[];
function test(name,fn){try{fn();results.push({name,pass:true})}catch(error){results.push({name,pass:false,error:error.message})}}

test("corrupted weekly best is rejected",()=>{
  const s=fullUnit(1);s.weekly.weeks[2]={best:"not-a-score",attempts:[]};
  assert.equal(boot(s).P.weekMastered(2),false);
  s.weekly.weeks[2]={best:101,attempts:[]};
  assert.equal(boot(s).P.weekMastered(2),false);
});

test("unit summary cannot bypass missing lesson evidence",()=>{
  const s=fullUnit(1);delete s.lessons["u01-l06"];const {P}=boot(s);
  assert.equal(P.unitMastered(1),true);assert.equal(P.unitProgressionComplete(1),false);assert.equal(P.unitUnlocked(2),false);
});

test("unit summary cannot bypass missing weekly evidence",()=>{
  const s=fullUnit(1);delete s.weekly.weeks[3];const {P}=boot(s);
  assert.equal(P.unitProgressionComplete(1),false);assert.equal(P.unitUnlocked(2),false);
});

test("week boundary blocks next instructional week",()=>{
  const s=fullUnit(1);delete s.weekly.weeks[2];const {P}=boot(s);
  assert.equal(P.lessonUnlocked(1,4),false);
  const target=P.nextTarget(1,3);assert.equal(target.kind,"weekly");assert.match(target.href,/week=2$/);
});

test("Unit 10 boundaries route to weeks 27 28 29",()=>{
  const s=fullUnit(10);
  for(const pair of [[2,27],[5,28],[8,29]]){
    const lesson=pair[0],week=pair[1];delete s.weekly.weeks[week];
    const target=boot(s).P.nextTarget(10,lesson);assert.equal(target.kind,"weekly");assert.match(target.href,new RegExp("week="+week+"$"));
    s.weekly.weeks[week]=weekPass();
  }
});

test("Unit 07 requires full first-half chain plus Midterm",()=>{
  const parts=[];for(let u=1;u<=6;u++)parts.push(fullUnit(u));
  const s=mergeState(parts);s.assessments["readiness-diagnostic"]=pass();s.assessments.midterm=pass();
  delete s.weekly.weeks[17];assert.equal(boot(s).P.unitUnlocked(7),false);
  s.weekly.weeks[17]=weekPass();assert.equal(boot(s).P.unitUnlocked(7),true);
  delete s.assessments.midterm;assert.equal(boot(s).P.unitUnlocked(7),false);
});

test("Unit 06 final lesson routes to Midterm",()=>{
  const s=mergeState([fullUnit(6)]);s.assessments["readiness-diagnostic"]=pass();
  const target=boot(s).P.nextTarget(6,7);assert.equal(target.kind,"midterm");assert.match(target.href,/midterm\.html$/);
});

test("Unit 13 final lesson routes Unit mastery to Final to Completion",()=>{
  const parts=[];for(let u=1;u<=13;u++)parts.push(fullUnit(u));
  const s=mergeState(parts);s.assessments["readiness-diagnostic"]=pass();s.assessments.midterm=pass();
  delete s.assessments["unit-13-mastery"];assert.equal(boot(s).P.nextTarget(13,5).kind,"unit");
  s.assessments["unit-13-mastery"]=pass();assert.equal(boot(s).P.nextTarget(13,5).kind,"final");
  s.assessments.final=pass();assert.equal(boot(s).P.nextTarget(13,5).kind,"completion");
});

test("Midterm rechecks underlying lesson evidence",()=>{
  const parts=[];for(let u=1;u<=6;u++)parts.push(fullUnit(u));
  const s=mergeState(parts);s.assessments["readiness-diagnostic"]=pass();delete s.lessons["u03-l07"];
  assert.ok(boot(s).P.missingFor({recordKey:"midterm"}).some(x=>/Unit 03 lesson evidence/.test(x)));
});

test("Final rechecks underlying weekly evidence",()=>{
  const parts=[];for(let u=1;u<=13;u++)parts.push(fullUnit(u));
  const s=mergeState(parts);s.assessments["readiness-diagnostic"]=pass();s.assessments.midterm=pass();delete s.weekly.weeks[30];
  assert.ok(boot(s).P.missingFor({recordKey:"final"}).some(x=>/Unit 10 weekly mastery evidence/.test(x)));
});

test("storage adapter verified false is rejected",()=>{
  const {P,context}=boot({});
  context.window.KhaemenesMathStorageAdapter={writeJSON(){return {persisted:true,verified:false}}};
  assert.equal(P.writeJSON(L,{x:1}),false);
});

const failures=results.filter(r=>!r.pass);
for(const r of results)console.log((r.pass?"PASS":"FAIL")+" · "+r.name+(r.error?" · "+r.error:""));
if(failures.length){console.error("ALGEBRA2_HOLD_VALIDATION=FAIL ("+failures.length+"/"+results.length+")");process.exit(1)}
console.log("ALGEBRA2_HOLD_VALIDATION=PASS ("+results.length+"/"+results.length+")");

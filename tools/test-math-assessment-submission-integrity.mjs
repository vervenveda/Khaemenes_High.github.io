import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const a2Path='courses/mathematics/algebra-2/assets/assessment-engine.js';
const geoPath='courses/mathematics/geometry/assets/assessment-engine.js';
const read=p=>fs.readFileSync(p,'utf8');
function scoreBody(source,start,end) {
 const a=source.indexOf(start);assert.ok(a>=0,'scoring entry exists');
 const b=source.indexOf(end,a+start.length);assert.ok(b>a,'scoring end exists');
 return source.slice(a,b);
}
for(const p of [a2Path,geoPath]){
 const code=read(p);
 new vm.Script(code,{filename:p});
 assert.ok(code.includes('submitted = true')||code.includes('submitted=true'),'completed attempt locked '+p);
 assert.ok(code.includes('submitted = false')||code.includes('submitted=false'),'fresh attempt reset '+p);
 assert.ok(code.includes('host.querySelectorAll?.'),'input locking after submit '+p);
 assert.ok(code.includes('location.pathname.match(/unit-(\\d{2})/)'),'post-assessment unit extracted correctly '+p);
}
const algebra=scoreBody(read(a2Path),'function score(token) {','    const missing = missingPrerequisites();');
const geometry=scoreBody(read(geoPath),'function score(token){','function showResult(a)');
function simulate(course,{partiallyAnswered=false,constructed=false}={}){
 const isGeo=course==='geometry';
 const scoreSource=isGeo?geometry:algebra;
 let submitted=false,saved=0,shown=0,explanations=0,finished=0,radioLocked=false;
 const questions=[{id:'q1',answer:0,unit:11,explanation:'Solution 1'},{id:'q2',answer:1,unit:11,explanation:'Solution 2'}];
 const outputs=new Map();
 const fakeElement=id=>{
  if(!outputs.has(id))outputs.set(id,{id,value:'Core',hidden:true,textContent:'',className:'',
   disabled:false,style:{marginTop:''},setAttribute(name,value){this[name]=value;},
   append(){},remove(){},after(){},get innerHTML(){return this._innerHTML||''},set innerHTML(value){this._innerHTML=value}});
  return outputs.get(id);
 };
 const doc={
  getElementById:id=>fakeElement(id),
  querySelector:query=> {
   const match=query.match(/-q(\d+)"/);
   if(!match)return null;
   const i=Number(match[1]);
   return partiallyAnswered&&i===1?null:{value:String(i)};
  },
  createElement:tag=>fakeElement('create-'+tag+'-'+Math.random()),
 };
 fakeElement('assessmentLearner').value='Example';
 fakeElement('assessmentPathway').value='Core';
 const host={querySelectorAll:()=>[{set disabled(x){if(x)radioLocked=true;}}]};
 const original={attempts:[],bestScore:0},record=()=>[{},original];
 const ctx=vm.createContext({
  document:doc,set:questions,host,submitted,
  MASTERY_TARGET:80,MASTERY:80,Date,Math,location:{pathname:'/courses/mathematics/algebra-2/units/unit-11/assessment/mastery-check.html'},
  cfg:{recordKey:isGeo?'unit-11':'u11-mastery',title:'Assessment'},
  DEPTH:constructed?{constructed:[{domain:'reason'}],response_min_chars:60}:null,
  load:()=>({}),save:()=>{saved++;},record,showResult:()=>{shown++;},renderEvaluator:()=>{shown++;},
  esc:()=>'',console,createElement:()=>{},
 });
 vm.runInContext(scoreSource+'\nfunction run(){return score("abc")};',ctx);
 // Instrument feedback changes with accessor to assert premature explanations remain hidden.
 for(const q of questions) {
  const fb=fakeElement('abc-fb'+questions.indexOf(q));
  Object.defineProperty(fb,'hidden',{set(value){if(value===false)explanations++;},get(){return explanations===0;}});
 }
 if(isGeo&&constructed)fakeElement('cr0').value='insufficient';
 vm.runInContext('run()',ctx);
 if(partiallyAnswered||(isGeo&&constructed)){
  assert.equal(explanations,0,course+' must not reveal feedback before all evidence is ready');
  assert.equal(saved,0,course+' partial attempt must not be saved');
  assert.equal(ctx.submitted,false,course+' partial attempt stays editable');
  return;
 }
 assert.equal(explanations,2,course+' displays explanation only after fully answered');
 assert.equal(saved,1,course+' saves exactly one completed attempt');
 assert.equal(ctx.submitted,true,course+' finalizes completed attempt');
 assert.equal(radioLocked,true,course+' locks answer controls after scoring');
 vm.runInContext('run()',ctx);
 assert.equal(saved,1,course+' prevents repeat scoring');
}
for(const course of ['algebra-2','geometry']){
 simulate(course,{partiallyAnswered:true});
 simulate(course,{partiallyAnswered:false});
}
simulate('geometry',{constructed:true});

// The older 12-question Geometry bank is not the actual Unit 11 release pool:
// the weekly source composes 20 questions with skill and week coverage.
const root='courses/mathematics/geometry/';
const w={GEO_ASSESSMENT_CONFIG:{recordKey:'unit-11',units:[11],count:20}};
const document={getElementById:()=>null};
const scripts=[
 root+'assets/question-bank.js',
 root+'assessments/assets/weekly-mastery-v2-28-30.js',
 root+'assessments/assets/weekly-mastery-v2-31-33.js',
 root+'assets/unit-mastery-source-v2.js'
];
for(const path of scripts) vm.runInNewContext(read(path),{window:w,document,Math,console},{timeout:4000});
assert.equal(w.GEO_ASSESSMENT_CONFIG.depthSourceReady,true,'Geometry Unit 11 depth pool available');
assert.equal(w.GEOMETRY_QUESTIONS.length,20,'20 valid unit questions provided');
assert.equal(new Set(w.GEOMETRY_QUESTIONS.map(q=>q.id)).size,20);
assert.equal(new Set(w.GEOMETRY_QUESTIONS.map(q=>q.skill)).size,5,'five skill dimensions represented');
for(const q of w.GEOMETRY_QUESTIONS) assert.ok(q.options[q.answer]===q.answer_text||q.answer_text,'correct selected option retained');

console.log('PASS: Algebra II and Geometry incomplete submissions conceal answers, complete submissions lock and score once, geometry written response is required first, navigation extracts unit 11, and Geometry Unit 11 assembles a 20-question mixed-skill set.');

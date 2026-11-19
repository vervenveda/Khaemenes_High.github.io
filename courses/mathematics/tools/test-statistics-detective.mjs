import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const slug='statistics-detective';
const path='courses/mathematics/assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(path,'utf8');
const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(Boolean);
assert.equal(scripts.length,1,'one standalone inline runtime');
const code=scripts[0];new vm.Script(code,{filename:path});
const pure=code.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(pure,'mathematical kernel isolated');
const M=vm.runInNewContext(pure+';({near,mean,median,popSD,box,percent,linearFit,normalPercentile,makeTask,expected,correct})');
const close=(a,b,eps=1e-8)=>Math.abs(a-b)<=eps;
assert.equal(M.mean([1,2,3,4,5]),3);
assert.equal(M.median([7,1,3,5]),4);
assert.equal(M.median([5,8,1]),5);
assert.ok(close(M.popSD([2,2,4,4]),1),'population SD uses N, not N−1');
assert.ok(close(M.popSD([3,3,3]),0));
const b=M.box([2,3,4,5,6,7,8,9,10]);
assert.deepEqual([b.min,b.q1,b.median,b.q3,b.max,b.iqr],[2,3.5,6,8.5,10,5]);
assert.equal(M.percent(3,12),25);
const fit=M.linearFit([[1,2],[2,4],[3,6],[4,8]]);
assert.ok(close(fit.slope,2)&&close(fit.intercept,0)&&close(fit.r,1)&&close(fit.predict(8),16));
assert.ok(close(M.normalPercentile(0),50));
assert.ok(close(M.normalPercentile(-1)+M.normalPercentile(1),100,.0001));
assert.ok(close(M.normalPercentile(1),84.1345,.01));
assert.ok(close(M.normalPercentile(2),97.725,.01));
assert.ok(close(M.normalPercentile(-2),2.275,.01));

const modes=['design','center','box','regression','conditional','claims','zscore','sampling'];
for(const mode of modes){
 const seen=new Set();const kinds=new Set();
 for(let i=0;i<350;i++){
  const t=M.makeTask(mode),e=M.expected(t);
  assert.ok(Number.isFinite(e.one),mode+' finite primary');
  assert.equal(M.correct(t,e.one,e.two,e.choice),true,mode+' true answer accepted');
  assert.equal(M.correct(t,e.one+10,e.two,e.choice),false,mode+' wrong primary rejected');
  assert.equal(M.correct(t,NaN,e.two,e.choice),false,mode+' NaN rejected');
  if('two' in e){
   assert.ok(Number.isFinite(e.two),mode+' finite second');
   assert.equal(M.correct(t,e.one,e.two+10,e.choice),false,mode+' wrong second rejected');
  }
  if('choice' in e)assert.equal(M.correct(t,e.one,e.two,'bogus'),false,mode+' wrong classification rejected');
  if(mode==='center')assert.ok(close(e.one,M.mean(t.a))&&close(e.two,M.popSD(t.a)));
  if(mode==='box')assert.ok(close(e.two,M.box(t.a).q3-M.box(t.a).q1));
  if(mode==='regression'){
   const fit=M.linearFit(t.points);
   assert.ok(close(e.one,fit.slope)&&close(e.two,fit.intercept+8*fit.slope));
  }
  if(mode==='conditional'){
   assert.ok(close(e.one,M.percent(t.ay,t.ay+t.an)));
   assert.ok(close(e.two,M.percent(t.ay+t.by,t.ay+t.an+t.by+t.bn)));
  }
  if(mode==='claims'){
   assert.ok(close(e.one,100*(t.after-t.before)/t.before));
   assert.equal(e.choice,t.baseline===0?'zero':'truncated');
   kinds.add(e.choice);
  }
  if(mode==='design')kinds.add(e.choice);
  if(mode==='sampling'){
   assert.equal(e.choice,t.method);
   assert.ok(close(e.two,e.one-M.percent(t.popYes,t.popTotal)));
   kinds.add(e.choice);
  }
  if(mode==='zscore'){
   assert.ok(close(e.one,(t.value-t.mu)/t.sd));
   assert.ok(e.two>0&&e.two<100);
  }
  seen.add(t.id);
 }
 assert.ok(seen.size>=35,mode+' missions varied');
 if(['claims','design','sampling'].includes(mode))assert.ok(kinds.size>=2,mode+' meaningfully different classifications');
}
const reg=JSON.parse(fs.readFileSync('courses/mathematics/assets/learning-games/game-registry.json','utf8'));
const placements=reg.games[slug]?.placements||[];
const byCourse=course=>placements.filter(p=>p.course===course);
assert.ok(byCourse('algebra-1').length>=6,'Algebra I statistics/regression placements remain registered');
assert.ok(byCourse('algebra-2').length>=3,'Algebra II statistics placements remain registered');
assert.ok(byCourse('pre-algebra').length>=1,'Pre-Algebra data/statistics progression placements are registered');
assert.ok(placements.every(p=>p.wired===true),'every Statistics Detective placement is marked wired');
assert.equal(new Set(placements.map(p=>[p.course,p.unit,p.lesson,p.mode].join('|'))).size,placements.length,'registry placements are unique');
const entryContract=fs.readFileSync('courses/shared/course-entry-contract.js','utf8');
assert.ok(entryContract.includes('math-shared-game-bridge-v1.js'),'canonical registry-driven lesson bridge is installed');
const uniquePlacements=new Set();
for(const p of placements.filter(p=>p.course==='algebra-2'||(p.course==='algebra-1'&&String(p.unit)==='12'))){
 const u=String(p.unit).padStart(2,'0'),l=String(p.lesson).match(/\d+$/)[0].padStart(2,'0');
 const base='courses/mathematics/'+p.course+'/units/unit-'+u+'/lessons/';
 let file;
 if(p.course==='algebra-2')file=base+'u'+u+'-l'+l+'.html';
 else{
  const map=JSON.parse(fs.readFileSync('courses/mathematics/algebra-1/units/unit-'+u+'/unit-map.json','utf8'));
  const hit=map.lessons.find(x=>String(x.id||'').toLowerCase()==='u'+u+'-l'+l||String(x.number??'').padStart(2,'0')===l);
  file=base+(hit.file||hit.path).replace(/^lessons\//,'');
 }
 const contents=fs.readFileSync(file,'utf8');
 const explicit=contents.includes('data-game="'+slug+'"')&&contents.includes('data-mode="'+p.mode+'"')&&contents.includes('shared-game-launcher.js');
 const bridged=contents.includes('course-entry-contract.js');
 assert.ok(explicit||bridged,file+' has explicit launcher or canonical registry bridge');
 assert.ok(!uniquePlacements.has(file+'|'+p.mode),file+' no duplicate mode entry');
 uniquePlacements.add(file+'|'+p.mode);
}

const nodes=new Map(),store=new Map();
function get(id){
 if(nodes.has(id))return nodes.get(id);
 const events=new Map(),node={id,value:'',textContent:'',innerHTML:'',className:'',hidden:false,disabled:false,checked:false,events,
 addEventListener:(name,handler)=>events.set(name,handler),setAttribute(){},appendChild(){},replaceChildren(){}};
 nodes.set(id,node);return node;
}
const document={getElementById:get,createElement:()=>({value:'',textContent:''})};
const context={document,window:{matchMedia:()=>({matches:true})},location:{search:'?course=algebra1&unit=12&lesson=02&mode=center'},
 localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
 URLSearchParams,Math,console};
const runtime=code.replace(/\}\)\(\);\s*$/,';globalThis.audit={challenge,check,load,switchMode,state:()=>({task,record})};})();');
assert.notEqual(runtime,code,'game instrumentation');
vm.runInNewContext(runtime,context,{timeout:2500});
let state=context.audit.state();assert.ok(state.task,'initial case created');
const initial=state.task.id;
get('answer').value='9999';get('second').value='9999';context.audit.check();
state=context.audit.state();
assert.equal(state.record.attempted,1,'one attempt counted');
assert.equal(state.record.solved,0,'no false score');
assert.equal(state.task.id,initial,'incorrect response does not change problem');
const truth=M.expected(state.task);
get('answer').value=String(truth.one);get('second').value=String(truth.two);context.audit.check();
state=context.audit.state();
assert.equal(state.record.solved,1,'corrected answer succeeds');
assert.equal(state.record.firstTries,0,'correction not first-try credit');
assert.equal(state.record.attempted,1,'correction not double counted');
context.audit.challenge();state=context.audit.state();assert.notEqual(state.task.id,initial,'new case differs');
const active=state.task.id;context.audit.load();
assert.equal(context.audit.state().task.id,active,'reload restores case');
context.audit.switchMode('claims');state=context.audit.state();
const counts=[state.task.before,state.task.after];
const initialChoice=state.task.baseline===0?'zero':'truncated';
get('baseline').value='zero';get('baseline').events.get('change')();
assert.deepEqual([state.task.before,state.task.after],counts,'toggle cannot change underlying counts');
assert.equal(M.expected(state.task).choice,initialChoice,'correct interpretation based on original presented axis');
console.log('PASS: Statistics Detective 8 mathematical modes, registry-driven placements, distribution / regression / sampling / CDF calculations, retry, persistence and honest graph comparison');

import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const slug='triangle-law-expedition';
const path='courses/mathematics/assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(path,'utf8');
const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
assert.equal(scripts.length,1,'standalone dependency-free game script');
const source=scripts[0];new vm.Script(source,{filename:path});
const pure=source.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(pure,'pure mathematical kernel isolated');
const m=vm.runInNewContext(pure+';({near,rad,deg,normalize,lawSines,lawCosines,angleCosines,heron,includedArea,ambiguousSSA,bearingComponents,bearingFrom,resultant,makeTask,expected,correct})');
const close=(a,b,eps=1e-8)=>Math.abs(a-b)<=eps;
const pi=Math.PI,r=d=>d*pi/180;

assert.ok(close(m.lawSines(10,30,60),10*Math.sqrt(3)));
assert.ok(close(m.lawCosines(3,4,90),5));
assert.ok(close(m.lawCosines(5,5,60),5));
assert.ok(close(m.angleCosines(3,4,5),Math.asin(3/5)*180/pi));
assert.ok(close(m.angleCosines(5,3,4),90));
assert.ok(close(m.heron(3,4,5),6));
assert.ok(close(m.heron(5,5,6),12));
assert.equal(m.heron(1,2,3),null,'degenerate triangle is not valid');
assert.equal(m.heron(1,1,3),null,'triangle inequality enforced');
assert.equal(m.heron(0,3,4),null,'positive sides enforced');
assert.ok(close(m.includedArea(4,3,90),6));
assert.ok(close(m.includedArea(5,5,0),0));

assert.equal(m.ambiguousSSA(30,3,10).length,0,'acute SSA impossible when a is below altitude');
assert.equal(m.ambiguousSSA(30,5,10).length,1,'acute SSA tangent case has one right triangle');
assert.equal(m.ambiguousSSA(30,7,10).length,2,'acute SSA two valid triangles');
assert.equal(m.ambiguousSSA(30,10,10).length,1,'equal opposite and adjacent sides gives one nondegenerate triangle');
assert.equal(m.ambiguousSSA(110,8,8).length,0,'obtuse angle needs longest opposite side');
assert.equal(m.ambiguousSSA(110,12,8).length,1,'obtuse SSA can form a single triangle');
assert.equal(m.ambiguousSSA(30,0,10).length,0,'nonpositive side impossible');
for(const A of [25,30,35,40,45,60,100,110,120]){
 for(let a=2;a<=17;a++)for(let b=3;b<=15;b++){
  const solutions=m.ambiguousSSA(A,a,b);
  assert.ok(solutions.length<=2,'SSA has at most two triangles');
  for(let i=0;i<solutions.length;i++){
   const B=solutions[i],C=180-A-B;
   assert.ok(B>0&&C>0&&A>0,'positive triangle angles');
   assert.ok(close(Math.sin(r(B))/b,Math.sin(r(A))/a),'Law of Sines consistency');
   const c=m.lawSines(a,A,C);
   assert.ok(a+b>c-1e-8&&a+c>b-1e-8&&b+c>a-1e-8,'strict triangle inequality');
  }
  if(solutions.length===2)assert.ok(solutions[0]<solutions[1],'ascending SSA angles');
 }
}
assert.ok(close(m.bearingComponents(10,90).east,10));
assert.ok(close(m.bearingComponents(10,90).north,0));
assert.ok(close(m.bearingComponents(10,0).north,10));
assert.ok(close(m.bearingComponents(10,270).east,-10));
assert.ok(close(m.bearingFrom(1,0),90));
assert.ok(close(m.bearingFrom(-1,0),270));
assert.ok(close(m.bearingFrom(0,-1),180));
assert.ok(close(m.bearingFrom(-1,1),315));
assert.ok(close(m.normalize(-90),270));
let result=m.resultant([{length:10,bearing:90},{length:10,bearing:0}]);
assert.ok(close(result.east,10)&&close(result.north,10));
assert.ok(close(m.bearingFrom(result.east,result.north),45));
assert.ok(close(Math.hypot(result.east,result.north),10*Math.sqrt(2)));
for(const bearing of [0,15,45,60,90,120,180,210,270,315]){
 const v=m.bearingComponents(12,bearing);
 assert.ok(close(Math.hypot(v.east,v.north),12),'bearings preserve length');
 assert.ok(close(m.bearingFrom(v.east,v.north),bearing),'bearing roundtrip');
}
const modes=['sines','ssa-count','ssa-pair','cosine-sas','cosine-sss','heron','area','bearings','navigation'];
for(const mode of modes){
 const seen=new Set(),kinds=new Set();
 for(let i=0;i<440;i++){
  const t=m.makeTask(mode),e=m.expected(t);seen.add(t.id);
  assert.ok(Number.isFinite(e.one),mode+' finite primary');
  assert.equal(m.correct(t,e.one,e.two),true,mode+' accepts correct');
  assert.equal(m.correct(t,e.one+20,e.two),false,mode+' rejects wrong primary');
  assert.equal(m.correct(t,NaN,e.two),false,mode+' rejects NaN');
  if('two' in e){
   assert.ok(Number.isFinite(e.two),mode+' finite second');
   assert.equal(m.correct(t,e.one,e.two+20),false,mode+' rejects wrong second');
  }
  if(mode==='sines'){
   assert.ok(close(e.one+t.A+t.B,180));
   assert.ok(close(e.two,m.lawSines(t.a,t.A,e.one)));
  }
  if(mode==='ssa-count'){kinds.add(e.one);assert.equal(e.one,m.ambiguousSSA(t.A,t.a,t.b).length);}
  if(mode==='ssa-pair'){
   const B=m.ambiguousSSA(t.A,t.a,t.b);
   assert.equal(B.length,2,'two SSA solutions present');
   assert.ok(close(e.one,B[0])&&close(e.two,B[1]));
  }
  if(mode==='cosine-sas'){
   assert.ok(close(e.one,m.lawCosines(t.b,t.c,t.A)));
   assert.ok(close(e.two,m.includedArea(t.b,t.c,t.A)));
  }
  if(mode==='cosine-sss'){
   const C=180-e.one-e.two;
   assert.ok(C>0,'valid triangle angle sum');
   assert.ok(close(m.lawCosines(t.b,t.c,e.one),t.a));
  }
  if(mode==='heron')assert.ok(close(e.two,m.heron(t.a,t.b,t.c)));
  if(mode==='area')assert.ok(close(.5*t.c*e.two,e.one),'height-to-base area');
  if(mode==='bearings'){
   assert.ok(close(Math.hypot(e.one,e.two),t.length),'correct single leg length');
  }
  if(mode==='navigation'){
   const v=m.resultant(t.legs);
   assert.ok(e.one>.1&&e.two>=0&&e.two<360,'valid distance and bearing');
   assert.ok(close(Math.hypot(v.east,v.north),e.one));
   assert.ok(close(m.bearingFrom(v.east,v.north),e.two));
  }
 }
 assert.ok(seen.size>=22,mode+' varied problems');
 if(mode==='ssa-count')assert.equal(kinds.size,3,'all SSA zero, one and two cases reached');
}
const registry=JSON.parse(fs.readFileSync('courses/mathematics/assets/learning-games/game-registry.json','utf8'));
const placements=registry.games[slug]?.placements||[];
assert.equal(placements.length,3,'three Unit 11 lesson placements');
const target=['sines','cosine-sas','navigation'];
for(let i=0;i<3;i++){
 const lesson='u11-l'+String(i+6).padStart(2,'0');
 const p=placements[i];assert.equal(p.course,'algebra-2');assert.equal(p.unit,'11');
 assert.equal(p.lesson,lesson);assert.equal(p.mode,target[i]);
 const file='courses/mathematics/algebra-2/units/unit-11/lessons/'+lesson+'.html';
 const text=fs.readFileSync(file,'utf8');
 assert.ok(text.includes('data-game="'+slug+'"'),'new launcher '+file);
 assert.ok(text.includes('data-mode="'+p.mode+'"'),'correct mode');
 assert.ok(text.includes('src="../../../../assets/shared-game-launcher.js"'),'correct relative launcher');
 if(i===2)assert.ok(text.includes('data-game="coordinated-mission-control"'),'existing navigation game preserved');
}
const nodes=new Map(),storage=new Map();
function get(id){if(nodes.has(id))return nodes.get(id);
 const handlers=new Map(),n={value:'',textContent:'',innerHTML:'',className:'',hidden:false,disabled:false,checked:false,handlers,
 addEventListener:(name,cb)=>handlers.set(name,cb),replaceChildren(){},appendChild(){},setAttribute(){}};
 nodes.set(id,n);return n;
}
const document={getElementById:get,createElement:()=>({value:'',textContent:''})};
const ctx={document,window:{matchMedia:()=>({matches:true})},location:{search:'?course=algebra2&unit=11&lesson=u11-l06&mode=sines'},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
 URLSearchParams,Math,console};
const injected=source.replace(/\}\)\(\);\s*$/,';globalThis.audit={challenge,check,load,switchMode,workshop,state:()=>({task,record,exploring})};})();');
assert.notEqual(injected,source,'testing hooks installed');
vm.runInNewContext(injected,ctx,{timeout:3000});
let state=ctx.audit.state(),initial=state.task.id;
get('answer').value='999';get('second').value='999';ctx.audit.check();
state=ctx.audit.state();assert.equal(state.record.attempted,1);
assert.equal(state.record.solved,0);assert.equal(state.task.id,initial,'retry stays on problem');
const e=m.expected(state.task);get('answer').value=String(e.one);get('second').value=String(e.two);
ctx.audit.check();state=ctx.audit.state();
assert.equal(state.record.solved,1);assert.equal(state.record.firstTries,0);
assert.equal(state.record.attempted,1,'not double-counting corrections');
ctx.audit.challenge();state=ctx.audit.state();assert.notEqual(state.task.id,initial,'varied next problem');
const active=state.task.id;ctx.audit.load();assert.equal(ctx.audit.state().task.id,active,'reload restores active problem');
ctx.audit.switchMode('ssa-count');state=ctx.audit.state();
assert.equal(get('secondBlock').hidden,true,'classification uses one answer');
ctx.audit.switchMode('cosine-sas');state=ctx.audit.state();
const prev=state.record.solved;ctx.audit.workshop();
get('angleSlider').value='25';get('angleSlider').handlers.get('input')();
assert.equal(ctx.audit.state().record.solved,prev,'workshop does not award score');
assert.ok(get('description').textContent.includes('Workshop:'),'workshop geometry drawn');
console.log('PASS: Triangle Law Expedition 9 modes, SSA zero/one/two, sine and cosine laws, Heron, bearings, vectors, 3 routes, preserved navigation, retry and workshop');

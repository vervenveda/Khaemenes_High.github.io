import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const slug='trigonometric-wave-studio';
const path='courses/mathematics/assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(path,'utf8');
const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
assert.equal(scripts.length,1,'a single vanilla JavaScript game module');
const source=scripts[0];
new vm.Script(source,{filename:path});
const pure=source.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(pure,'pure mathematical core available for independent tests');
const m=vm.runInNewContext(pure+';({near,model,properties,periodicValue,asymptotePi,inverseValue,fitPeriodic,makeTask,expected,correct})');
const close=(a,b,tol=1e-8)=>Math.abs(a-b)<=tol;
const pi=Math.PI;
assert.ok(close(m.model({family:'sin',A:2,B:1,C:0,D:1},pi/2),3));
assert.ok(close(m.model({family:'cos',A:-3,B:2,C:0,D:-1},0),-4));
const p=m.properties({family:'sin',A:-4,B:.5,C:-.5,D:2});
assert.equal(p.amplitude,4);assert.equal(p.midline,2);
assert.equal(p.periodPi,4);assert.equal(p.phasePi,-.5);
assert.equal(p.min,-2);assert.equal(p.max,6);
for(const A of [-4,-2,-1,1,2,4])for(const B of [.5,1,1.5,2,2.5,3])for(const C of [-.75,-.25,0,.5,1])for(const family of ['sin','cos']){
 const mod={A,B,C,D:1,family},info=m.properties(mod);
 for(let x=-2*pi;x<=2*pi;x+=.431){
  const y=m.model(mod,x),period=info.periodPi*pi;
  assert.ok(close(y,m.model(mod,x+period)),'periodicity for '+family);
  assert.ok(y<=info.max+1e-8&&y>=info.min-1e-8,'range respects amplitude and midline');
 }
}
assert.equal(m.periodicValue('tan',pi/2),null);
assert.equal(m.periodicValue('sec',pi/2),null);
assert.equal(m.periodicValue('cot',0),null);
assert.equal(m.periodicValue('csc',pi),null);
assert.ok(close(m.periodicValue('tan',pi/4),1));
assert.ok(close(m.periodicValue('cot',pi/4),1));
assert.ok(close(m.periodicValue('sec',0),1));
assert.ok(close(m.periodicValue('csc',pi/2),1));
assert.equal(JSON.stringify(m.asymptotePi('tan')),'[0.5,1.5]');
assert.equal(JSON.stringify(m.asymptotePi('sec')),'[0.5,1.5]');
assert.equal(JSON.stringify(m.asymptotePi('cot')),'[0,1]');
assert.equal(JSON.stringify(m.asymptotePi('csc')),'[0,1]');
assert.equal(m.inverseValue('asin',1),90);
assert.equal(m.inverseValue('asin',-1),-90);
assert.equal(m.inverseValue('asin',1.01),null);
assert.equal(m.inverseValue('acos',2),null);
assert.ok(close(m.inverseValue('acos',-.5),120));
assert.ok(close(m.inverseValue('atan',1),45));
assert.ok(close(m.inverseValue('atan',-1),-45));
for(const degree of [-90,-60,-45,-30,0,30,45,60,90]){
 const x=Math.sin(degree*pi/180);
 assert.ok(close(m.inverseValue('asin',x),degree),'arcsin principal branch');
}
for(const degree of [0,30,45,60,90,120,135,150,180]){
 const x=Math.cos(degree*pi/180);
 assert.ok(close(m.inverseValue('acos',x),degree),'arccos principal branch');
}
for(const degree of [-60,-45,-30,0,30,45,60]){
 const x=Math.tan(degree*pi/180);
 assert.ok(close(m.inverseValue('atan',x),degree),'arctan principal branch');
}
const ideal=Array.from({length:8},(_,k)=>{const x=k*pi/4;return [x,2+3*Math.sin(x)-2*Math.cos(x)];});
const fit=m.fitPeriodic(ideal);
assert.ok(close(fit.D,2));assert.ok(close(fit.sin,3));
assert.ok(close(fit.cos,-2));assert.ok(close(fit.amplitude,Math.sqrt(13)));
assert.ok(close(fit.predict(pi/2),5));
for(let a=1;a<=4;a++)for(let b=-2;b<=2;b++)for(let D=-3;D<=3;D++){
 const pts=Array.from({length:8},(_,k)=>{const x=k*pi/4;return [x,D+a*Math.sin(x)+b*Math.cos(x)];});
 const f=m.fitPeriodic(pts);
 assert.ok(close(f.D,D)&&close(f.sin,a)&&close(f.cos,b),'least-squares orthogonal coefficients');
 assert.ok(close(f.amplitude,Math.hypot(a,b)),'regression amplitude');
}
const modes=['waves','amplitude','period','phase','vertical','asymptotes','inverse','fit','tangent'];
for(const mode of modes){
 const ids=new Set(),kind=new Set();
 for(let i=0;i<420;i++){
  const t=m.makeTask(mode),e=m.expected(t);
  assert.ok(Number.isFinite(e.one)&&Number.isFinite(e.two),mode+' finite answers');
  assert.equal(m.correct(t,e.one,e.two),true,mode+' correct answer accepted');
  assert.equal(m.correct(t,e.one+7,e.two),false,mode+' wrong first rejected');
  assert.equal(m.correct(t,e.one,e.two+7),false,mode+' wrong second rejected');
  assert.equal(m.correct(t,NaN,e.two),false,mode+' nonnumber rejected');
  assert.equal(m.correct(t,e.one,NaN),false,mode+' missing second rejected');
  ids.add(t.id);
  if(mode==='period'||mode==='phase')assert.ok(close(e.two,2/t.B)||mode==='period'&&close(e.two,t.B),'period identity');
  if(mode==='asymptotes'){kind.add(t.fn);assert.ok(e.two>e.one,'two distinct asymptotes');}
  if(mode==='fit'){const f=m.fitPeriodic(t.points);assert.ok(close(f.amplitude,e.one)&&close(f.D,e.two));}
  if(mode==='inverse')assert.ok(close(e.two,e.one/180),'radian π coefficient exact');
  if(mode==='tangent')assert.ok(close(e.one*e.two,1),'tan and cot reciprocal');
 }
 assert.ok(ids.size>=4,mode+' multiple generated cases');
 if(mode==='asymptotes')assert.equal(kind.size,4,'all four reciprocal families');
}
const registry=JSON.parse(fs.readFileSync('courses/mathematics/assets/learning-games/game-registry.json','utf8'));
const placements=registry.games[slug]?.placements||[];
assert.equal(placements.length,5,'five Unit 10 lesson placements');
const launch=['waves','amplitude','asymptotes','inverse','fit'];
for(let i=0;i<5;i++){
 const lesson='u10-l'+String(i+5).padStart(2,'0'),p=placements[i],file='courses/mathematics/algebra-2/units/unit-10/lessons/'+lesson+'.html';
 assert.equal(p.course,'algebra-2');assert.equal(p.unit,'10');assert.equal(p.lesson,lesson);assert.equal(p.mode,launch[i]);
 const contents=fs.readFileSync(file,'utf8');
 assert.ok(contents.includes('data-game="'+slug+'"'),'missing launcher '+file);
 assert.ok(contents.includes('data-mode="'+p.mode+'"'),'wrong mission '+file);
 assert.ok(contents.includes('src="../../../../assets/shared-game-launcher.js"'),'wrong launcher relative path '+file);
}
const nodes=new Map(),storage=new Map();
function get(id){
 if(nodes.has(id))return nodes.get(id);
 const callbacks=new Map(),node={value:'',textContent:'',innerHTML:'',className:'',disabled:false,hidden:false,checked:false,
  callbacks,addEventListener:(event,cb)=>callbacks.set(event,cb),replaceChildren(){},appendChild(){},setAttribute(){}};
 nodes.set(id,node);return node;
}
const document={getElementById:get,createElement:()=>({textContent:''})};
const context={document,window:{matchMedia:()=>({matches:true})},location:{search:'?course=algebra2&unit=10&lesson=u10-l05&mode=waves'},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
 URLSearchParams,Math,console};
const injected=source.replace(/\}\)\(\);\s*$/,';globalThis.audit={challenge,check,load,explore,switchMode,state:()=>({task,record,exploring})};})();');
assert.notEqual(injected,source,'testing hook inserted');
vm.runInNewContext(injected,context,{timeout:2500});
let state=context.audit.state(),original=state.task.id;
get('answer').value='998';get('second').value='999';
context.audit.check();state=context.audit.state();
assert.equal(state.record.attempted,1,'wrong attempt counted once');
assert.equal(state.record.solved,0,'wrong answer no credit');
assert.equal(state.task.id,original,'wrong answer preserves case');
let truth=m.expected(state.task);
get('answer').value=String(truth.one);get('second').value=String(truth.two);
context.audit.check();state=context.audit.state();
assert.equal(state.record.solved,1,'retry completes case');
assert.equal(state.record.attempted,1,'retry is not counted twice');
assert.equal(state.record.firstTries,0,'retry is not first-try');
context.audit.challenge();state=context.audit.state();
assert.notEqual(state.task.id,original,'next case varied');
const open=state.task.id;context.audit.load();
assert.equal(context.audit.state().task.id,open,'unfinished case restored after refresh');
context.audit.explore();
assert.equal(context.audit.state().exploring,true,'workshop accessible');
const count=context.audit.state().record.solved;
get('amp').value='-4';get('amp').callbacks.get('input')({target:{value:'-4'}});
get('phase').value='1';get('phase').callbacks.get('input')({target:{value:'1'}});
assert.equal(context.audit.state().record.solved,count,'workshop remains unscored');
assert.ok(get('description').textContent.includes('Workshop:'),'wave transform visible');
console.log('PASS: Trigonometric Wave Studio 9 mathematical missions, 5 lesson links, periodicity, exact reciprocal gaps, inverse branches, sinusoidal least squares, saved retries and workshop');

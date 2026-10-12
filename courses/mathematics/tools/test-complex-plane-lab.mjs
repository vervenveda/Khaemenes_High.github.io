import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const slug='complex-plane-lab',path='courses/mathematics/assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(path,'utf8');
const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
assert.equal(scripts.length,1,'one standalone JavaScript game program');
const source=scripts[0];new vm.Script(source,{filename:path});
const pure=source.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(pure,'pure complex-math module present');
const m=vm.runInNewContext(pure+';({near,z,add,sub,mul,conj,modulus,div,powerI,rotate,quadrant,makeTask,expected,correct})');
const close=(a,b)=>Math.abs(a-b)<1e-9;
const Z=(a,b)=>({re:a,im:b});
const same=(a,b)=>close(a.re,b.re)&&close(a.im,b.im);
assert.ok(same(m.add(Z(1,2),Z(3,-4)),Z(4,-2)));
assert.ok(same(m.sub(Z(1,2),Z(3,-4)),Z(-2,6)));
assert.ok(same(m.mul(Z(1,2),Z(3,-4)),Z(11,2)));
assert.ok(same(m.div(Z(1,2),Z(3,-4)),Z(-5/25,10/25)));
assert.equal(m.div(Z(5,2),Z(0,0)),null);
assert.ok(same(m.conj(Z(2,-3)),Z(2,3)));
assert.ok(close(m.modulus(Z(3,4)),5));
assert.equal(m.quadrant(Z(-2,3)),'II');
assert.equal(m.quadrant(Z(-2,-3)),'III');
assert.equal(m.quadrant(Z(0,3)),'axis');
for(let n=-200;n<=200;n++){
 const v=m.powerI(n),next=m.powerI(n+4);
 assert.ok(same(v,next),'i exponents cycle modulo 4 even for negatives');
 assert.ok(same(m.mul(v,m.powerI(-n)),Z(1,0)),'inverse exponent works');
}
for(const a of [-4,-2,0,2,4])for(const b of [-4,-2,0,2,4])for(const c of [-3,0,3])for(const d of [-3,0,3]){
 const v=Z(a,b),w=Z(c,d),p=m.mul(v,w);
 assert.ok(close(m.modulus(v)**2,a*a+b*b),'modulus identity');
 assert.ok(same(m.conj(m.conj(v)),v),'double conjugation');
 assert.ok(same(m.mul(m.conj(v),m.conj(w)),m.conj(p)),'conjugate product');
 assert.ok(close(m.modulus(p),m.modulus(v)*m.modulus(w)),'product norm');
 if(c!==0||d!==0){
  const result=m.div(v,w);
  assert.ok(same(m.mul(result,w),v),'division round-trip');
 }
 for(let q=0;q<4;q++)assert.ok(same(m.rotate(v,q),m.mul(v,m.powerI(q))),'rotation identity');
}
const modes=['powers','add','multiply','divide','quadratic','conjugate','modulus','rotate'];
for(const mode of modes){
 const seen=new Set();
 for(let i=0;i<360;i++){
  const t=m.makeTask(mode),v=m.expected(t);
  assert.ok(Number.isFinite(v.re),'finite real value '+mode);
  if('im' in v)assert.ok(Number.isFinite(v.im),'finite imaginary value');
  assert.equal(m.correct(t,v.re,v.im,v.quadrant),true,mode+' accepts true answer');
  assert.equal(m.correct(t,v.re+8,v.im,v.quadrant),false,mode+' rejects false real');
  assert.equal(m.correct(t,NaN,v.im,v.quadrant),false,'reject NaN');
  if('im' in v)assert.equal(m.correct(t,v.re,v.im+8,v.quadrant),false,'reject false imaginary');
  if('quadrant' in v)assert.equal(m.correct(t,v.re,v.im,'axis'),false,'reject false quadrant');
  if(mode==='quadratic'){
   const discr=(-2*t.p)**2-4*t.c;
   assert.ok(discr<0,'nonreal quadratic root');
   assert.ok(close(discr,-4*t.q*t.q));
   assert.ok(close(t.p*t.p-t.q*t.q-2*t.p*t.p+t.c,0),'real quadratic residual');
  }
  if(mode==='conjugate')assert.equal(v.im,-t.a.im);
  if(mode==='divide')assert.ok(t.b.re!==0||t.b.im!==0,'valid nonzero divisor');
  if(mode==='modulus')assert.ok(close(v.re,Math.hypot(t.a.re,t.a.im)),'Pythagorean distance');
  seen.add(t.id);
 }
 assert.ok(seen.size>=18,'enough unique '+mode+' missions');
}
const root='courses/mathematics/assets/learning-games';
const reg=JSON.parse(fs.readFileSync(root+'/game-registry.json','utf8'));
const placements=reg.games[slug]?.placements||[];
assert.equal(placements.length,4,'complex lab has four placements');
for(const p of placements){
 assert.equal(p.course,'algebra-2');assert.equal(p.unit,'02');
 const number=String(p.lesson).match(/\d+$/)[0].padStart(2,'0');
 const file='courses/mathematics/algebra-2/units/unit-02/lessons/u02-l'+number+'.html';
 const contents=fs.readFileSync(file,'utf8');
 assert.ok(contents.includes('data-game="'+slug+'"'),file+' linked');
 assert.ok(contents.includes('data-mode="'+p.mode+'"'),file+' correct mode');
 assert.ok(contents.includes('src="../../../../assets/shared-game-launcher.js"'),file+' correct relative path');
}
for(const p of reg.games['number-family'].placements){
 assert.ok(!(p.course==='algebra-2'&&p.unit==='02'&&['04','07'].includes(p.lesson)),'old number-family duplicate removed from registry');
}
for(const p of reg.games['integer-sum-lab'].placements){
 assert.ok(!(p.course==='algebra-2'&&p.unit==='02'&&p.lesson==='05'),'old integer-sum duplicate removed from registry');
}
for(const lesson of ['06','07']){
 const contents=fs.readFileSync('courses/mathematics/algebra-2/units/unit-02/lessons/u02-l'+lesson+'.html','utf8');
 assert.ok(contents.includes('data-game="polynomial-zeros-explorer"'),'existing polynomial explorer preserved');
}
const nodes=new Map(),storage=new Map();
function get(id){if(nodes.has(id))return nodes.get(id);
 const handlers=new Map(),node={value:'',textContent:'',innerHTML:'',hidden:false,disabled:false,checked:false,className:'',handlers,
  addEventListener:(event,handler)=>handlers.set(event,handler),replaceChildren(){},appendChild(){},setAttribute(){}};
 nodes.set(id,node);return node;
}
const document={getElementById:get,createElement:()=>({value:'',textContent:''})};
const context={document,window:{matchMedia:()=>({matches:true})},location:{search:'?course=algebra2&unit=02&lesson=u02-l04&mode=powers'},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
 URLSearchParams,Math,console};
const injected=source.replace(/\}\)\(\);\s*$/,';globalThis.audit={challenge,check,load,explore,state:()=>({task,record})};})();');
assert.notEqual(injected,source,'test hooks inserted');
vm.runInNewContext(injected,context,{timeout:2000});
let state=context.audit.state();const first=state.task.id;
get('answer').value='9999';get('second').value='9999';context.audit.check();
state=context.audit.state();assert.equal(state.record.attempted,1,'wrong answer counts once');
assert.equal(state.record.solved,0,'wrong answer does not score');assert.equal(state.task.id,first,'mission not restarted');
const v=m.expected(state.task);get('answer').value=String(v.re);get('second').value=String(v.im);
context.audit.check();state=context.audit.state();assert.equal(state.record.solved,1,'retry succeeds');
assert.equal(state.record.firstTries,0,'retry not first try');assert.equal(state.record.attempted,1,'no duplicate attempt');
context.audit.challenge();state=context.audit.state();assert.notEqual(state.task.id,first,'no immediate repeat');
const saved=state.task.id;context.audit.load();assert.equal(context.audit.state().task.id,saved,'reload recovers exact challenge');
context.audit.explore();assert.equal(context.audit.state().record.solved,1,'free exploration is unscored');
console.log('PASS: Complex Plane Lab 8 modes, complex identities, division, quadratics, 4 lessons, preserved related games, freshness, retries, persistence');

import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const slug='trigonometric-identity-forge';
const page='courses/mathematics/assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(page,'utf8');
const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
assert.equal(scripts.length,1,'game uses one dependency-free inline JavaScript program');
const source=scripts[0];new vm.Script(source,{filename:page});
const pure=source.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(pure,'core mathematically testable apart from UI');
const m=vm.runInNewContext(pure+';({DEG,HALF,near,normalize,components,quotient,reciprocal,pythagorean,sumAngle,diffAngle,doubleAngle,halfAngle,proofCatalog,equationSolutions,makeTask,expected,correct})');
const pi=Math.PI,close=(a,b,epsilon=1e-8)=>Math.abs(a-b)<=epsilon;
const rad=d=>d*pi/180;
assert.equal(m.normalize(-30),330);assert.equal(m.normalize(750),30);
assert.equal(m.quotient(1,0),null);assert.equal(m.reciprocal(0),null);
assert.equal(m.quotient(4,2),2);assert.equal(m.reciprocal(.5),2);
assert.equal(m.proofCatalog.length,5);
const proofIds=new Set(m.proofCatalog.map(x=>x.id));
assert.equal(proofIds.size,5);
for(const p of m.proofCatalog){
 assert.ok(p.right&&p.wrong.length>=3&&p.step.length>=20,'symbolic proof guidance');
 assert.ok(!p.wrong.includes(p.right),'proof distractors are genuinely incorrect transformations');
}
for(let degree=-720;degree<=720;degree+=15){
 const v=m.components(degree),p=m.pythagorean(degree);
 assert.ok(close(v.c*v.c+v.s*v.s,1),'Pythagorean identity for '+degree);
 assert.ok(close(p.sum,1),'Pythagorean computed check');
 assert.ok(close(m.components(degree).s,m.components(degree+360).s),'periodicity');
 assert.ok(close(m.components(degree).c,m.components(degree+360).c),'cos periodicity');
 const db=m.doubleAngle(degree);
 assert.ok(close(db.s,Math.sin(2*rad(degree))),'double sine');
 assert.ok(close(db.c,Math.cos(2*rad(degree))),'double cosine');
}
for(let a=-360;a<=360;a+=30)for(let b=-360;b<=360;b+=30){
 const sum=m.sumAngle(a,b),diff=m.diffAngle(a,b);
 assert.ok(close(sum.s,Math.sin(rad(a+b))),'sum sine identity');
 assert.ok(close(sum.c,Math.cos(rad(a+b))),'sum cosine identity');
 assert.ok(close(diff.s,Math.sin(rad(a-b))),'difference sine identity');
 assert.ok(close(diff.c,Math.cos(rad(a-b))),'difference cosine identity');
}
for(const deg of m.HALF){
 const v=m.halfAngle(deg);
 assert.ok(close(v.s,Math.sin(rad(deg/2))),'half-angle signed sin '+deg);
 assert.ok(close(v.c,Math.cos(rad(deg/2))),'half-angle signed cos '+deg);
 assert.ok(close(v.s*v.s+v.c*v.c,1),'half angle normalization');
}
for(const fn of ['sin','cos'])for(const deg of m.DEG){
 const answers=m.equationSolutions(fn,deg);
 assert.equal(answers.length,2,'exactly two distinct off-axis answers');
 assert.ok(answers[0]>=0&&answers[1]<360&&answers[0]<answers[1],'sorted and within [0,360)');
 const fun=fn==='sin'?Math.sin:Math.cos;
 const target=fun(rad(deg));
 assert.ok(close(fun(rad(answers[0])),target),'first root correct');
 assert.ok(close(fun(rad(answers[1])),target),'second root correct');
}
for(const p of m.proofCatalog)for(const deg of m.DEG){
 const t={mode:'proof',proofId:p.id,deg},want=m.expected(t);
 assert.ok(close(want.one,p.evaluate(deg)),'proof numerical check');
 assert.equal(want.choice,p.right,'proof requires a correct symbolic transformation');
 assert.equal(m.correct(t,want.one,NaN,p.right),true,'single numeric field and symbolic step');
 for(const distractor of p.wrong)assert.equal(m.correct(t,want.one,NaN,distractor),false,'distractor rejected');
}
const modes=['fundamental','reciprocal','quotient','proof','sum','difference','double','half','equations'];
for(const mode of modes){
 const seen=new Set(),categories=new Set();
 for(let i=0;i<480;i++){
  const t=m.makeTask(mode),e=m.expected(t);
  assert.ok(Number.isFinite(e.one),mode+' finite first response');
  assert.equal(m.correct(t,e.one,e.two,e.choice||''),true,mode+' generated solution accepted');
  assert.equal(m.correct(t,e.one+17,e.two,e.choice||''),false,mode+' incorrect first rejected');
  assert.equal(m.correct(t,NaN,e.two,e.choice||''),false,mode+' reject NaN');
  if('two' in e){
   assert.ok(Number.isFinite(e.two),mode+' finite second response');
   assert.equal(m.correct(t,e.one,e.two+17,e.choice||''),false,mode+' incorrect second rejected');
  }
  if('choice' in e)assert.equal(m.correct(t,e.one,e.two,'not-an-identity'),false,'wrong symbolic choice rejected');
  if(mode==='fundamental')assert.ok(close(e.one+e.two,1),'complement squares total one');
  if(mode==='reciprocal')assert.ok(close(e.one*e.two,1),'reciprocal nonzero domain and product');
  if(mode==='quotient')assert.ok(close(e.one*e.two,1),'tan and cot reciprocals');
  if(mode==='proof')categories.add(t.proofId);
  if(mode==='sum'||mode==='difference'){
   const degree=mode==='sum'?t.a+t.b:t.a-t.b;
   assert.ok(close(e.one,Math.sin(rad(degree))),'addition/subtraction sine is correct');
   assert.ok(close(e.two,Math.cos(rad(degree))),'addition/subtraction cosine is correct');
  }
  if(mode==='equations'){
   assert.ok(e.one<e.two&&e.one>=0&&e.two<360,'all roots sorted and bounded');
  }
  seen.add(t.id);
 }
 assert.ok(seen.size>=10,mode+' has varied generated cases');
 if(mode==='proof')assert.equal(categories.size,5,'all proof pathways reachable');
}
const reg=JSON.parse(fs.readFileSync('courses/mathematics/assets/learning-games/game-registry.json','utf8'));
const placements=reg.games[slug]?.placements||[];
assert.equal(placements.length,5,'five relevant Unit 11 lessons linked');
const starts=['fundamental','proof','sum','double','equations'];
for(let i=0;i<5;i++){
 const lesson='u11-l'+String(i+1).padStart(2,'0'),p=placements[i];
 assert.equal(p.course,'algebra-2');assert.equal(p.unit,'11');assert.equal(p.lesson,lesson);
 assert.equal(p.mode,starts[i],'correct entry mission');
 const file='courses/mathematics/algebra-2/units/unit-11/lessons/'+lesson+'.html',body=fs.readFileSync(file,'utf8');
 assert.ok(body.includes('data-game="'+slug+'"'),file+' game launcher');
 assert.ok(body.includes('data-mode="'+starts[i]+'"'),file+' correct initial lesson mode');
 assert.ok(body.includes('src="../../../../assets/shared-game-launcher.js"'),file+' relative route');
}
const navigation=fs.readFileSync('courses/mathematics/algebra-2/units/unit-11/lessons/u11-l08.html','utf8');
assert.ok(navigation.includes('data-game="coordinated-mission-control"'),'preexisting vector navigation game preserved');

const nodes=new Map(),storage=new Map();
function el(id){
 if(nodes.has(id))return nodes.get(id);
 const handlers=new Map(),node={value:'',textContent:'',innerHTML:'',className:'',hidden:false,disabled:false,checked:false,handlers,
 addEventListener:(name,fn)=>handlers.set(name,fn),replaceChildren(){},appendChild(){},setAttribute(){}};
 nodes.set(id,node);return node;
}
const document={getElementById:el,createElement:()=>({value:'',textContent:''})};
const context={document,window:{matchMedia:()=>({matches:true})},location:{search:'?course=algebra2&unit=11&lesson=u11-l01&mode=fundamental'},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
 URLSearchParams,Math,console};
const instrument=source.replace(/\}\)\(\);\s*$/,';globalThis.audit={challenge,check,load,hint,worked,changeMode,state:()=>({task,record})};})();');
assert.notEqual(instrument,source,'test hook injected');
vm.runInNewContext(instrument,context,{timeout:2500});
let state=context.audit.state(),first=state.task.id;
el('answer').value='99999';el('second').value='99999';context.audit.check();
state=context.audit.state();
assert.equal(state.record.attempted,1,'one first check');
assert.equal(state.record.solved,0,'wrong response not solved');
assert.equal(state.task.id,first,'error never restarts question');
const expected=m.expected(state.task);
el('answer').value=String(expected.one);el('second').value=String(expected.two);
context.audit.check();state=context.audit.state();
assert.equal(state.record.solved,1,'correction completes same mission');
assert.equal(state.record.attempted,1,'retry not double-counted');
assert.equal(state.record.firstTries,0,'corrected answer does not earn unaided first-try');
context.audit.challenge();state=context.audit.state();assert.notEqual(state.task.id,first,'new challenge avoids repeat');
const active=state.task.id;context.audit.load();assert.equal(context.audit.state().task.id,active,'reload preserves active case');
context.audit.changeMode('proof');state=context.audit.state();
assert.equal(state.task.mode,'proof','symbolic proof mode selectable');
assert.equal(el('choiceBlock').hidden,false,'proof choice is exposed');
assert.equal(el('secondBlock').hidden,true,'proof uses a single numerical check');
assert.ok(el('choice').value==='','choice requires explicit selection');
context.audit.hint();assert.equal(context.audit.state().record.helped,true,'hint tracked before submission');
const proofExpected=m.expected(state.task);
el('answer').value=String(proofExpected.one);el('choice').value=proofExpected.choice;
context.audit.check();state=context.audit.state();
assert.equal(state.record.solved,1,'proof with numeric check and valid symbolic transformation completes');
assert.equal(state.record.firstTries,0,'hinted proof does not count unaided');
console.log('PASS: Trigonometric Identity Forge 9 mathematical modes, symbolic proofs, sum/difference/double/half identities, bounded equation roots, 5 lesson routes, retries, saved state and hints');

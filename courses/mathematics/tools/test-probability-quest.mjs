import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const slug='probability-quest';
const path='courses/mathematics/assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(path,'utf8');
const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
assert.equal(scripts.length,1,'one standalone game JavaScript program');
const code=scripts[0];new vm.Script(code,{filename:path});
const core=code.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(core,'pure, independently testable mathematics');
const M=vm.runInNewContext(core+';({near,factorial,permutation,combination,percentage,unionProbability,conditionalProbability,independent,bayesPosterior,binomialProbability,expectedNet,makeTask,expected,correct})');
const close=(x,y,eps=1e-8)=>Math.abs(x-y)<=eps;

assert.equal(M.factorial(0),1);assert.equal(M.factorial(5),120);
assert.ok(Number.isNaN(M.factorial(-1)));
assert.equal(M.permutation(7,3),210);assert.equal(M.combination(7,3),35);
assert.equal(M.combination(8,0),1);assert.equal(M.combination(8,8),1);
assert.ok(Number.isNaN(M.combination(3,4)),'reject impossible sample size');
for(let n=1;n<=12;n++)for(let k=0;k<=n;k++){
 assert.equal(M.combination(n,k),M.combination(n,n-k),'combination symmetry');
 assert.equal(M.permutation(n,k),M.combination(n,k)*M.factorial(k),'ordered vs unordered distinction');
 if(k>0&&k<n)assert.equal(M.combination(n,k),M.combination(n-1,k-1)+M.combination(n-1,k),'Pascal recurrence');
}
assert.equal(M.unionProbability(20,30,10,100),40);
assert.equal(M.conditionalProbability(15,60),25);
assert.equal(M.independent(10,20,15,30),true);
assert.equal(M.independent(10,20,14,30),false);
assert.ok(close(M.bayesPosterior(.1,.8,.2),30.76923076923077));
assert.ok(close(M.bayesPosterior(.5,.8,.2),80));
assert.ok(close(M.expectedNet(.25,20,3),2));
assert.ok(close(M.expectedNet(.25,20,8),-3));
assert.ok(close(M.binomialProbability(4,2,.5),.375));

for(const p of [.1,.2,.25,.4,.5,.7,.75,.9])for(let n=1;n<=10;n++){
 let sum=0,expected=0;
 for(let k=0;k<=n;k++){const mass=M.binomialProbability(n,k,p);
  assert.ok(mass>=0&&mass<=1,'valid PMF');sum+=mass;expected+=k*mass;}
 assert.ok(close(sum,1),'binomial probabilities sum to one');
 assert.ok(close(expected,n*p),'binomial expected number of successes');
}

const modes=['counting','permutations','combinations','complement','union','conditional','independence','bayes','binomial','expectation'];
for(const mode of modes){
 const seen=new Set(),branches=new Set();
 for(let i=0;i<350;i++){
  const t=M.makeTask(mode),e=M.expected(t);seen.add(t.id);
  assert.ok(Number.isFinite(e.one),mode+' finite primary answer');
  assert.equal(M.correct(t,e.one,e.two,e.choice),true,mode+' correct answers accepted');
  assert.equal(M.correct(t,e.one+10,e.two,e.choice),false,mode+' wrong primary rejected');
  assert.equal(M.correct(t,NaN,e.two,e.choice),false,mode+' NaN rejected');
  if('two' in e){
   assert.ok(Number.isFinite(e.two),mode+' finite second');
   assert.equal(M.correct(t,e.one,e.two+10,e.choice),false,mode+' wrong second rejected');
  }
  if('choice' in e){branches.add(e.choice);assert.equal(M.correct(t,e.one,e.two,'bogus'),false,'false classification rejected');}
  if(mode==='permutations')assert.equal(e.one,e.two*M.factorial(t.r),'ordered answer');
  if(mode==='complement')assert.ok(close(e.one+e.two,100),'complement partition');
  if(mode==='union'){
   assert.ok(close(e.one,M.unionProbability(t.onlyA+t.both,t.onlyB+t.both,t.both,t.total)),'no double-count');
   assert.ok(e.one<=100&&e.one>=e.two,'union covers intersection');
  }
  if(mode==='conditional'){
   assert.ok(close(e.one,100*t.ay/(t.ay+t.by)),'correct P(A|yes) denominator');
   assert.ok(close(e.two,100*t.ay/(t.ay+t.an)),'correct P(yes|A) denominator');
  }
  if(mode==='independence')assert.equal(e.choice,M.independent(t.aYes,t.aTotal,t.bYes,t.bTotal)?'independent':'dependent');
  if(mode==='bayes'){
   assert.ok(close(e.one,M.bayesPosterior(t.prev,t.sens,t.falsePositive)));
   assert.ok(close(e.two,100*(1-t.prev)*t.falsePositive));
   assert.ok(e.one>0&&e.one<100);
  }
  if(mode==='binomial'){assert.ok(close(e.one,100*M.binomialProbability(t.n,t.k,t.p)));assert.ok(close(e.two,t.n*t.p));}
  if(mode==='expectation'){assert.ok(close(e.one,e.two-t.fee),'net subtracts fee');}
 }
 assert.ok(seen.size>=20,mode+' varied missions');
 if(mode==='independence')assert.equal(branches.size,2,'both independence decisions generated');
}
const reg=JSON.parse(fs.readFileSync('courses/mathematics/assets/learning-games/game-registry.json','utf8'));
const placements=reg.games[slug]?.placements||[];
assert.equal(placements.length,4,'four Algebra II probability lessons');
const expectedModes=['counting','union','bayes','binomial'];
for(let i=0;i<4;i++){
 const p=placements[i],num=String(i+1).padStart(2,'0');
 assert.equal(p.course,'algebra-2');assert.equal(p.unit,'12');assert.equal(p.mode,expectedModes[i]);
 const file='courses/mathematics/algebra-2/units/unit-12/lessons/u12-l'+num+'.html',contents=fs.readFileSync(file,'utf8');
 assert.ok(contents.includes('data-game="'+slug+'"'),file+' launcher');
 assert.ok(contents.includes('data-mode="'+p.mode+'"'),file+' matching mode');
 assert.ok(contents.includes('src="../../../../assets/shared-game-launcher.js"'),file+' correct relative path');
}
const nodes=new Map(),storage=new Map();
function get(id){
 if(nodes.has(id))return nodes.get(id);
 const events=new Map(),node={value:'',textContent:'',innerHTML:'',hidden:false,disabled:false,checked:false,className:'',events,
 addEventListener:(name,fn)=>events.set(name,fn),setAttribute(){},appendChild(){},replaceChildren(){}};
 nodes.set(id,node);return node;
}
const document={getElementById:get,createElement:()=>({value:'',textContent:''})};
const context={document,window:{matchMedia:()=>({matches:true})},location:{search:'?course=algebra2&unit=12&lesson=u12-l01&mode=counting'},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
 URLSearchParams,Math,console};
const injected=code.replace(/\}\)\(\);\s*$/,';globalThis.audit={challenge,check,load,hint,switchMode,state:()=>({task,record})};})();');
assert.notEqual(injected,code,'testing instrumentation injected');
vm.runInNewContext(injected,context,{timeout:2500});
let state=context.audit.state();assert.ok(state.task,'initial task created');
const first=state.task.id;
get('answer').value='99999';context.audit.check();
state=context.audit.state();
assert.equal(state.record.attempted,1,'wrong first attempt counted once');
assert.equal(state.record.solved,0,'wrong answer no score');
assert.equal(state.task.id,first,'wrong answer does not restart');
get('answer').value=String(M.expected(state.task).one);context.audit.check();
state=context.audit.state();
assert.equal(state.record.solved,1,'correct retry succeeds');
assert.equal(state.record.firstTries,0,'retry not first try');
assert.equal(state.record.attempted,1,'retry not double-counted');
context.audit.challenge();state=context.audit.state();assert.notEqual(state.task.id,first,'no immediate repeat');
const active=state.task.id;context.audit.load();
assert.equal(context.audit.state().task.id,active,'browser reload restores task');
context.audit.switchMode('expectation');state=context.audit.state();
assert.equal(state.task.mode,'expectation','other mode selectable');
context.audit.hint();state=context.audit.state();
assert.equal(state.record.helped,true,'hint use tracked');
console.log('PASS: Probability Quest 10 mathematical modes, independent and dependent tables, Bayes, binomial PMF, money expectation, four routes, retries, uniqueness and persistence');

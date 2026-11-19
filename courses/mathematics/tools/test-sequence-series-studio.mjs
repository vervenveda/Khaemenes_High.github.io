import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const slug='sequence-series-studio',path='courses/mathematics/assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(path,'utf8');
const chunks=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(Boolean);
assert.equal(chunks.length,1,'one standalone game program');
const code=chunks[0];new vm.Script(code,{filename:path});
const pure=code.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(pure,'mathematics functions isolated');
const m=vm.runInNewContext(pure+';({arithmetic,geometric,sumArithmetic,sumGeometric,infiniteSum,choose,sigmaLinear,makeTask,expected,correct})');
const near=(a,b)=>Math.abs(a-b)<1e-7;
assert.equal(m.arithmetic(4,-3,7),-14);
assert.equal(m.geometric(3,-2,5),48);
assert.equal(m.sumArithmetic(3,2,5),35);
assert.ok(near(m.sumGeometric(3,-.5,4),1.875));
assert.equal(m.sumGeometric(7,1,8),56);
assert.ok(near(m.infiniteSum(6,-.5),4));
assert.ok(Number.isNaN(m.infiniteSum(10,1)));
assert.ok(Number.isNaN(m.infiniteSum(10,-1)));
assert.equal(m.choose(8,3),56);
assert.equal(m.choose(8,0),1);
assert.equal(m.choose(8,9),0);
assert.equal(m.sigmaLinear(1,5,2,1),35);
for(let n=1;n<35;n++)for(let k=0;k<=n;k++){
 assert.equal(m.choose(n,k),m.choose(n,n-k));
 if(k>0&&k<n)assert.equal(m.choose(n,k),m.choose(n-1,k-1)+m.choose(n-1,k));
}
for(const a of [-3,2,7])for(const d of [-4,0,2,5])for(let n=1;n<14;n++){
 const sum=Array.from({length:n},(_,i)=>m.arithmetic(a,d,i+1)).reduce((a,b)=>a+b,0);
 assert.ok(near(m.sumArithmetic(a,d,n),sum),'arithmetic closed form');
}
for(const a of [-3,2,10])for(const r of [-2,-.75,-.5,.5,1,1.5,2])for(let n=1;n<13;n++){
 const sum=Array.from({length:n},(_,i)=>m.geometric(a,r,i+1)).reduce((a,b)=>a+b,0);
 assert.ok(near(m.sumGeometric(a,r,n),sum),'geometric closed form');
}
const modes=['arithmetic','geometric','patterns','finite','infinite','sigma','binomial','growth'];
for(const mode of modes){const seen=new Set();
 for(let i=0;i<300;i++){
  const t=m.makeTask(mode),e=m.expected(t);
  assert.ok(Number.isFinite(e.one),mode+' finite');
  assert.equal(m.correct(t,e.one,e.two,e.choice),true,mode+' valid');
  assert.equal(m.correct(t,e.one+10,e.two,e.choice),false,mode+' wrong');
  assert.equal(m.correct(t,NaN,e.two,e.choice),false,mode+' no NaN');
  if('two' in e)assert.equal(m.correct(t,e.one,e.two+5,e.choice),false,mode+' checks second');
  if('choice' in e)assert.equal(m.correct(t,e.one,e.two,'wrong'),false,mode+' checks classification');
  if(mode==='infinite')assert.equal(e.choice,Math.abs(t.r)<1?'converges':'diverges');
  if(mode==='binomial')assert.ok(near(e.one,m.choose(t.n,t.k)*t.a**(t.n-t.k)));
  seen.add(t.id);
 }
 assert.ok(seen.size>=20,mode+' varied questions');
}
const reg=JSON.parse(fs.readFileSync('courses/mathematics/assets/learning-games/game-registry.json','utf8'));
const placements=reg.games[slug]?.placements||[];
const algebra2Placements=placements.filter(p=>p.course==='algebra-2');
const algebra1Placements=placements.filter(p=>p.course==='algebra-1');
const prealgebraPlacements=placements.filter(p=>p.course==='pre-algebra');
assert.ok(algebra2Placements.length>=7,'seven Algebra II sequence/series lesson placements remain registered');
assert.ok(algebra1Placements.length>=2,'Algebra I sequence/exponential placements remain registered');
assert.ok(prealgebraPlacements.length>=1,'Pre-Algebra sequence-pattern placement is registered');
assert.ok(placements.every(p=>p.wired===true),'every Sequence & Series Studio registry placement is marked wired');
const entryContract=fs.readFileSync('courses/shared/course-entry-contract.js','utf8');
assert.ok(entryContract.includes('math-shared-game-bridge-v1.js'),'canonical registry-driven lesson bridge is installed');
for(const p of [...algebra2Placements,...algebra1Placements.filter(p=>String(p.unit)==='08')]){
 const u=String(p.unit).padStart(2,'0'),l=String(p.lesson).match(/\d+$/)[0].padStart(2,'0');
 const file=p.course==='algebra-2'
 ?'courses/mathematics/algebra-2/units/unit-'+u+'/lessons/u'+u+'-l'+l+'.html'
 :'courses/mathematics/algebra-1/units/unit-08/lessons/lesson-'+l+(l==='04'?'-arithmetic-geometric-sequences':'-exponential-functions-growth-decay')+'.html';
 const page=fs.readFileSync(file,'utf8');
 const explicit=page.includes('data-game="'+slug+'"')&&page.includes('data-mode="'+p.mode+'"')&&page.includes('shared-game-launcher.js');
 const bridged=page.includes('course-entry-contract.js');
 assert.ok(explicit||bridged,file+' has explicit launcher or canonical registry bridge');
}
const nodes=new Map(),storage=new Map();
function get(id){
 if(nodes.has(id))return nodes.get(id);
 const events=new Map(),n={id,value:'',textContent:'',innerHTML:'',className:'',hidden:false,disabled:false,checked:false,events,
  addEventListener:(name,fn)=>events.set(name,fn),setAttribute(){},appendChild(){},replaceChildren(){}};
 nodes.set(id,n);return n;
}
const document={getElementById:get,createElement:()=>({value:'',textContent:''})};
const ctx={document,window:{matchMedia:()=>({matches:true})},location:{search:'?course=algebra2&unit=09&lesson=u09-l01&mode=arithmetic'},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
 URLSearchParams,Math,console};
const injected=code.replace(/\}\)\(\);\s*$/,';globalThis.audit={challenge,check,load,hint,explore,state:()=>({task,record})};})();');
assert.notEqual(injected,code,'test hook');
vm.runInNewContext(injected,ctx,{timeout:2000});
let state=ctx.audit.state(),first=state.task.id;
get('answer').value='99999';get('second').value='99999';ctx.audit.check();state=ctx.audit.state();
assert.equal(state.record.attempted,1);
assert.equal(state.record.solved,0);
assert.equal(state.task.id,first,'wrong answer retains mission');
const correct=m.expected(state.task);get('answer').value=String(correct.one);get('second').value=String(correct.two);
ctx.audit.check();state=ctx.audit.state();
assert.equal(state.record.solved,1,'correct retry passes');
assert.equal(state.record.firstTries,0,'retry not first try');
assert.equal(state.record.attempted,1,'no duplicate attempt');
ctx.audit.challenge();state=ctx.audit.state();assert.notEqual(state.task.id,first,'avoid immediate repetition');
const active=state.task.id;ctx.audit.load();assert.equal(ctx.audit.state().task.id,active,'restore mission');
ctx.audit.explore();assert.equal(ctx.audit.state().record.solved,1,'free exploration is unscored');
console.log('PASS: sequence-series formulas, 8 modes, registry-driven placements, retries, local progress and syntax');

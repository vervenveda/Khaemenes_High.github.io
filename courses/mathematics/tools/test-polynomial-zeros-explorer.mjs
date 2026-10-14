import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const slug='polynomial-zeros-explorer';
const path='courses/mathematics/assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(path,'utf8');
const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
assert.equal(scripts.length,1,'one self-contained game program');
const program=scripts[0];new vm.Script(program,{filename:path});
const pure=program.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(pure,'independent polynomial model library');
const math=vm.runInNewContext(pure+';({near,multiply,polyFromRoots,evaluate,conjugateFactor,synthetic,endBehavior,makeTask,expected,correct})');
const eq=(a,b)=>Math.abs(a-b)<1e-9;
assert.equal(JSON.stringify([...math.multiply([1,2],[3,4])]),JSON.stringify([3,10,8]));
assert.equal(JSON.stringify([...math.polyFromRoots([2,-3])]),JSON.stringify([-6,1,1]));
for(const x of [-4,-2,0,1,2,3])assert.ok(eq(math.evaluate(math.polyFromRoots([2,-3]),x),(x-2)*(x+3)));
assert.equal(JSON.stringify([...math.conjugateFactor(2,3)]),JSON.stringify([13,-4,1]));
assert.ok(eq(math.evaluate(math.conjugateFactor(2,3),2),9),'complex quadratic positive on real line');
for(const coeff of [[1,2,3],[3,0,-2,1],[4,-1,0,-2,1]])for(const r of [-3,-1,0,1,2,3]){
 const division=math.synthetic(coeff,r);
 assert.ok(eq(division.remainder,math.evaluate(coeff,r)),'remainder theorem');
 for(const x of [-2,0,1,4]){
  const left=math.evaluate(coeff,x),right=(x-r)*math.evaluate(division.quotient,x)+division.remainder;
  assert.ok(eq(left,right),'synthetic division identity');
 }
}
for(const n of [2,3,4,5])for(const a of [-2,-1,1,2]){
 const expected=(n%2===0?(a>0?'up/up':'down/down'):(a>0?'down/up':'up/down'));
 assert.equal(math.endBehavior(n,a),expected);
}
const modes=['structure','expand','end','complex','conjugate','fta','division','remainder','rational','roots','multiplicity','factorgraph','model'];
for(const mode of modes){
 const seen=new Set();
 for(let i=0;i<280;i++){
  const t=math.makeTask(mode);const answer=math.expected(t);
  assert.ok(Number.isFinite(answer.one),mode+' primary answer finite');
  if('two' in answer)assert.ok(Number.isFinite(answer.two),mode+' second answer finite');
  assert.equal(math.correct(t,answer.one,answer.two,answer.choice),true,mode+' correct answer');
  assert.equal(math.correct(t,answer.one+10,answer.two,answer.choice),false,mode+' reject wrong answer');
  assert.equal(math.correct(t,NaN,answer.two,answer.choice),false,mode+' reject NaN');
  if('choice' in answer)assert.equal(math.correct(t,answer.one,answer.two,'wrong'),false,mode+' reject wrong behavior');
  if('two' in answer)assert.equal(math.correct(t,answer.one,answer.two+10,answer.choice),false,mode+' reject wrong second part');
  if(mode==='rational')assert.ok(!Number.isInteger(answer.one),'rational mission requires noninteger rational zero');
  if(mode==='roots')assert.equal(new Set(t.roots).size,3,'exactly three distinct real roots');
  if(mode==='fta')assert.equal(t.degree,t.coeff.length-1,'polynomial degree');
  if(mode==='factorgraph'){
   assert.equal(t.degree,t.mult+1,'factor multiplicity adds to total degree');
   assert.equal(answer.choice,t.mult%2===0?'touch':'cross','crossing follows multiplicity parity');
   assert.ok(eq(math.evaluate(t.coeff,t.r),0),'repeated zero evaluates to zero');
   assert.ok(eq(math.evaluate(t.coeff,t.other),0),'distinct simple zero evaluates to zero');
  }
  seen.add(t.id);
 }
 assert.ok(seen.size>=12,'question variation for '+mode);
}
const registry=JSON.parse(fs.readFileSync('courses/mathematics/assets/learning-games/game-registry.json','utf8'));
const placements=registry.games[slug]?.placements||[];
assert.equal(placements.length,13,'13 relevant polynomial and complex-zero lessons');
for(const p of placements){
 assert.equal(p.course,'algebra-2');
 const u=String(p.unit).padStart(2,'0'),l=String(p.lesson).match(/\d+$/)[0].padStart(2,'0');
 const file='courses/mathematics/algebra-2/units/unit-'+u+'/lessons/u'+u+'-l'+l+'.html';
 const content=fs.readFileSync(file,'utf8');
 assert.ok(content.includes('data-game="'+slug+'"'),file+' game');
 assert.ok(content.includes('data-mode="'+p.mode+'"'),file+' mode');
 assert.ok(content.includes('src="../../../../assets/shared-game-launcher.js"'),file+' launcher route');
}
const nodes=new Map(),store=new Map();
function get(id){
 if(nodes.has(id))return nodes.get(id);
 const handlers=new Map();
 const o={id,value:'',textContent:'',innerHTML:'',checked:false,hidden:false,disabled:false,className:'',
   handlers,addEventListener:(name,fn)=>handlers.set(name,fn),
   setAttribute(){},appendChild(){},replaceChildren(){},getBoundingClientRect:()=>({width:620,left:0}),
   setPointerCapture(){}};nodes.set(id,o);return o;
}
const document={getElementById:get,createElement:()=>({value:'',textContent:'',appendChild(){}})};
const sandbox={document,window:{matchMedia:()=>({matches:true})},location:{search:'?course=algebra2&unit=03&lesson=u03-l06&mode=multiplicity'},
 localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
 URLSearchParams,Math,console,confirm:()=>false,performance:{now:()=>0},requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{},Blob,URL};
const instrumented=program.replace(/\}\)\(\);\s*$/,';globalThis.audit={challenge,correctCurrent,hint,load,explore,state:()=>({task,record})};})();');
assert.notEqual(instrumented,program,'attach isolated test hooks');
vm.runInNewContext(instrumented,sandbox,{timeout:2000});
let state=sandbox.audit.state();assert.ok(state.task,'initial mission exists');
const original=state.task.id;
get('answer').value='999';get('choice').value='cross';
sandbox.audit.correctCurrent();
state=sandbox.audit.state();
assert.equal(state.record.attempted,1,'wrong answer counts once');
assert.equal(state.record.solved,0,'wrong answer not success');
assert.equal(state.task.id,original,'same challenge retained');
const answer=math.expected(state.task);
get('answer').value=String(answer.one);get('choice').value=answer.choice;
sandbox.audit.correctCurrent();state=sandbox.audit.state();
assert.equal(state.record.solved,1,'corrected answer succeeds');
assert.equal(state.record.firstTries,0,'wrong-first then correct never counts first try');
assert.equal(state.record.attempted,1,'retry does not double-count');
sandbox.audit.challenge();state=sandbox.audit.state();
assert.notEqual(state.task.id,original,'avoid immediately repeated question');
const active=state.task.id;sandbox.audit.load();
assert.equal(sandbox.audit.state().task.id,active,'reload restores mission');
sandbox.audit.explore();assert.equal(sandbox.audit.state().record.solved,1,'explore does not modify scores');
console.log('PASS: polynomial zeros math, 12 mission types, division identities, conjugates, 13 routes, retries, freshness, persistence, script syntax');

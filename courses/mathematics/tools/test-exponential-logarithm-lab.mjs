import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const slug='exponential-logarithm-lab';
const path='courses/mathematics/assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(path,'utf8');
const chunks=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
assert.equal(chunks.length,1,'standalone HTML game has one inline runtime');
const code=chunks[0];new vm.Script(code,{filename:path});
const pure=code.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(pure,'pure mathematics is isolatable for independent testing');
const m=vm.runInNewContext(pure+';({near,exponential,compound,continuous,logBase,modelValue,makeTask,expected,checkAnswer})');
const close=(a,b)=>Math.abs(a-b)<1e-8;
assert.ok(close(m.exponential(100,.2,3),172.8));
assert.ok(close(m.exponential(100,-.2,3),51.2));
assert.ok(close(m.compound(1000,.12,12,1),1000*Math.pow(1.01,12)));
assert.ok(close(m.continuous(1000,.1,2),1000*Math.exp(.2)));
assert.ok(close(m.logBase(8,2),3));
assert.ok(close(m.logBase(.25,2),-2));
assert.ok(close(m.logBase(100,10),2));
assert.ok(Number.isNaN(m.logBase(0,2)));
assert.ok(Number.isNaN(m.logBase(-1,2)));
assert.ok(Number.isNaN(m.logBase(3,1)));
assert.ok(Number.isNaN(m.logBase(3,-2)));
for(const [f,p,d,x,v] of [['linear',5,3,4,17],['quadratic',5,3,4,53],['exponential',5,.2,2,7.2],['logarithmic',5,3,Math.E-1,8]])assert.ok(close(m.modelValue(f,p,d,x),v));
const modes=['growth','finance','continuous','exp-common','model-compare','log-inverse','log-laws','exp-log','log-domain','change-base'];
for(const mode of modes){
 const seen=new Set();
 for(let i=0;i<350;i++){
  const t=m.makeTask(mode);seen.add(t.id);
  const v=m.expected(t);assert.ok(Number.isFinite(v),mode+' finite result');
  const extras={rate:t.rate,method:mode==='continuous'?'continuous':String(t.n),property:t.law,model:t.family,domain:'valid'};
  assert.equal(m.checkAnswer(t,v,extras),true,mode+' correct answer');
  assert.equal(m.checkAnswer(t,v+10,extras),false,mode+' wrong answer rejected');
  assert.equal(m.checkAnswer(t,NaN,extras),false,mode+' NaN rejected');
  if(mode==='finance'||mode==='continuous')assert.equal(m.checkAnswer(t,v,{...extras,method:'invalid'}),false,'wrong compounding denied');
  if(mode==='log-domain')assert.equal(m.checkAnswer(t,v,{...extras,domain:'invalid'}),false,'invalid log domain denied');
  if(mode==='log-laws')assert.equal(m.checkAnswer(t,v,{...extras,property:'wrong'}),false,'wrong identity denied');
  if(mode==='growth')assert.equal(m.checkAnswer(t,v,{...extras,rate:0}),false,'wrong graph rate denied');
  if(mode==='model-compare')assert.equal(m.checkAnswer(t,v,{...extras,model:'wrong'}),false,'wrong family denied');
 }
 assert.ok(seen.size>=12,mode+' questions varied');
}
const registry=JSON.parse(fs.readFileSync('courses/mathematics/assets/learning-games/game-registry.json','utf8'));
const placements=registry.games[slug]?.placements||[];
assert.equal(placements.length,14,'all Algebra II Units 06 and 07 lessons covered');
for(const p of placements){
 assert.equal(p.course,'algebra-2');
 const unit=String(p.unit).padStart(2,'0'),l=String(p.lesson).match(/\d+$/)[0].padStart(2,'0');
 const filename='courses/mathematics/algebra-2/units/unit-'+unit+'/lessons/u'+unit+'-l'+l+'.html';
 const contents=fs.readFileSync(filename,'utf8');
 assert.ok(contents.includes('data-game="'+slug+'"'),filename+' game connected');
 assert.ok(contents.includes('data-mode="'+p.mode+'"'),filename+' mode connected');
 assert.ok(contents.includes('src="../../../../assets/shared-game-launcher.js"'),filename+' proper relative route');
}
const nodes=new Map(),store=new Map();
const get=id=>{
 if(nodes.has(id))return nodes.get(id);
 const handlers=new Map();
 const o={id,value:'',textContent:'',innerHTML:'',disabled:false,hidden:false,checked:false,className:'',style:{},
   addEventListener:(name,fn)=>handlers.set(name,fn),
   setAttribute(){},replaceChildren(){},appendChild(){},handlers};
 nodes.set(id,o);return o;
};
const document={getElementById:get,createElement:()=>({textContent:'',appendChild(){}})};
const context={document,window:{matchMedia:()=>({matches:true})},location:{search:'?course=algebra2&unit=06&lesson=u06-l02&mode=growth'},
 localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
 URLSearchParams,Math,console,setTimeout,clearTimeout};
let runtime=code.replace(/\}\)\(\);\s*$/, ';globalThis.labAudit={challenge,check,hint,load,state:()=>({task,record})};})();');
assert.notEqual(runtime,code,'runtime test hooks injected');
vm.runInNewContext(runtime,context,{timeout:1500});
let before=context.labAudit.state();assert.ok(before.task,'mission initialized');
get('answer').value=String(m.expected(before.task)+100);
context.labAudit.check();
let after=context.labAudit.state();
assert.equal(after.record.attempted,1,'wrong answer counts one attempted mission');
assert.equal(after.record.solved,0,'wrong answer does not score');
assert.equal(after.task.id,before.task.id,'wrong answer does not restart');
after.record.entry.rate=after.task.rate;get('answer').value=String(m.expected(after.task));
context.labAudit.check();after=context.labAudit.state();
assert.equal(after.record.solved,1,'corrected answer completes mission');
assert.equal(after.record.firstTries,0,'retry cannot become first-try credit');
assert.equal(after.record.attempted,1,'retry does not double count');
context.labAudit.challenge();after=context.labAudit.state();
assert.notEqual(after.task.id,before.task.id,'new mission does not immediately repeat');
const active=after.task.id;context.labAudit.load();
assert.equal(context.labAudit.state().task.id,active,'refresh recovers current mission');
console.log('PASS: exponential/log lab 10 mathematical modes, domains, validation, 14 placements, retry scoring, freshness, persistence and syntax');

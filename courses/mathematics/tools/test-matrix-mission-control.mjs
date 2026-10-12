import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const slug='matrix-mission-control';
const root='courses/mathematics/assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(root,'utf8');
const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(x=>x.trim());
assert.equal(scripts.length,1,'exactly one inline game program');
const program=scripts[0];new vm.Script(program,{filename:root});
const pure=program.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(pure,'math core separated for deterministic tests');
const f=vm.runInNewContext(pure+';({near,det,add,multiply,inverse,matVec,solve2,makeTask,expected,correct})');
const eq=(a,b)=>Math.abs(a-b)<1e-9;
assert.equal(f.det([[1,2],[3,4]]),-2);
assert.equal(f.det([[2,4],[1,2]]),0);
assert.equal(JSON.stringify([...f.add([[1,2],[3,4]],[[5,6],[7,8]])].map(r=>[...r])),JSON.stringify([[6,8],[10,12]]));
assert.equal(JSON.stringify([...f.multiply([[1,2],[3,4]],[[5,6],[7,8]])].map(r=>[...r])),JSON.stringify([[19,22],[43,50]]));
const inv=f.inverse([[4,7],[2,6]]);
assert.ok(eq(inv[0][0],.6)&&eq(inv[0][1],-.7)&&eq(inv[1][0],-.2)&&eq(inv[1][1],.4));
assert.equal(f.inverse([[1,2],[2,4]]),null);
for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)for(let c=-3;c<=3;c++)for(let d=-3;d<=3;d++){
 const A=[[a,b],[c,d]],dt=f.det(A),I=f.inverse(A);
 if(dt===0){assert.equal(I,null);continue;}
 assert.ok(I,'invertible matrix inverse exists');
 const prod=f.multiply(A,I),prod2=f.multiply(I,A);
 for(const z of [prod,prod2])for(let i=0;i<2;i++)for(let j=0;j<2;j++)
  assert.ok(eq(z[i][j],i===j?1:0),'inverse product is identity');
 const answer=f.solve2(A,[5,-3]);
 assert.ok(eq(f.matVec(A,answer)[0],5)&&eq(f.matVec(A,answer)[1],-3));
}
const modes=['graph','substitution','radical','operations','rows','det-inverse'];
for(const mode of modes){
 const seen=new Set();
 for(let i=0;i<350;i++){
  const t=f.makeTask(mode),answer=f.expected(t);
  assert.ok(Number.isFinite(answer.one),'finite expected answer for '+mode);
  if('two' in answer)assert.ok(Number.isFinite(answer.two),'finite second answer');
  assert.equal(f.correct(t,answer.one,answer.two,answer.choice),true,'generated answer accepted '+mode);
  assert.equal(f.correct(t,answer.one+4,answer.two,answer.choice),false,'incorrect answer rejected '+mode);
  assert.equal(f.correct(t,NaN,answer.two,answer.choice),false,'NaN rejected');
  if('two' in answer)assert.equal(f.correct(t,answer.one,answer.two+3,answer.choice),false,'wrong second answer rejected');
  if('choice' in answer)assert.equal(f.correct(t,answer.one,answer.two,'invalid'),false,'false domain/invertibility rejected');
  if(mode==='graph'){
   for(const x of t.roots)assert.ok(eq(x*x,t.m*x+t.b),'generated parabola-line intersection');
   assert.ok(t.roots[0]<t.roots[1]);
  }
  if(mode==='substitution')assert.ok(eq(t.x*t.x+t.y*t.y,t.radius*t.radius)&&t.x>0);
  if(mode==='radical'){
   assert.ok(t.x+t.s>=0&&t.y>=0);
   assert.ok(eq(Math.sqrt(t.x+t.s),t.y)&&eq(t.x-t.k,t.y));
   const invalidY=1-t.y,invalidX=invalidY+t.k;
   assert.ok(invalidY<0,'squared extraneous candidate excluded by y≥0');
   assert.ok(!eq(Math.sqrt(invalidX+t.s),invalidY),'extraneous candidate fails original equation');
  }
  if(mode==='rows')assert.ok(eq(f.matVec(t.A,t.solution)[0],t.b[0])&&eq(f.matVec(t.A,t.solution)[1],t.b[1])&&f.det(t.A)!==0);
  if(mode==='det-inverse'&&t.kind==='inverse')assert.ok(f.det(t.A)!==0);
  seen.add(t.id);
 }
 assert.ok(seen.size>=15,'question variation in '+mode);
}
const reg=JSON.parse(fs.readFileSync('courses/mathematics/assets/learning-games/game-registry.json','utf8'));
const placements=reg.games[slug]?.placements||[];
assert.equal(placements.length,6,'every Algebra II U08 lesson connected');
for(const p of placements){
 assert.equal(p.course,'algebra-2');assert.equal(p.unit,'08');
 const lesson=String(p.lesson).match(/\d+$/)[0].padStart(2,'0');
 const path='courses/mathematics/algebra-2/units/unit-08/lessons/u08-l'+lesson+'.html';
 const page=fs.readFileSync(path,'utf8');
 assert.ok(page.includes('data-game="'+slug+'"'),path+' has shared launcher');
 assert.ok(page.includes('data-mode="'+p.mode+'"'),path+' uses correct mission');
 assert.ok(page.includes('src="../../../../assets/shared-game-launcher.js"'),path+' path resolves');
}
const nodes=new Map(),store=new Map();
function get(id){if(nodes.has(id))return nodes.get(id);
 const events=new Map(),node={id,value:'',textContent:'',innerHTML:'',disabled:false,hidden:false,checked:false,className:'',events,
 addEventListener:(key,fn)=>events.set(key,fn),setAttribute(){},replaceChildren(){},appendChild(){}};
 nodes.set(id,node);return node;}
const document={getElementById:get,createElement:()=>({value:'',textContent:''})};
const ctx={document,window:{matchMedia:()=>({matches:true})},location:{search:'?course=algebra2&unit=08&lesson=u08-l04&mode=operations'},
 localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
 URLSearchParams,Math,console};
const run=program.replace(/\}\)\(\);\s*$/,';globalThis.audit={challenge,check,load,hint,switchMode:changeMode,state:()=>({task,record})};})();');
assert.notEqual(run,program,'testing hooks attached');
vm.runInNewContext(run,ctx,{timeout:2000});
let state=ctx.audit.state(),initial=state.task.id;
assert.ok(state.task,'initial mission');
get('answer').value='99999';ctx.audit.check();
state=ctx.audit.state();
assert.equal(state.record.attempted,1,'wrong answer checked once');
assert.equal(state.record.solved,0,'wrong answer not scored');
assert.equal(state.task.id,initial,'no forced restart');
get('answer').value=String(f.expected(state.task).one);ctx.audit.check();
state=ctx.audit.state();
assert.equal(state.record.solved,1,'correct retry passes');
assert.equal(state.record.firstTries,0,'retry never counted as first attempt');
assert.equal(state.record.attempted,1,'no double-count');
ctx.audit.challenge();state=ctx.audit.state();
assert.notEqual(state.task.id,initial,'new mission distinct');
const resumed=state.task.id;ctx.audit.load();
assert.equal(ctx.audit.state().task.id,resumed,'recover saved task after refresh');
console.log('PASS: Matrix Mission Control six game modes, matrix identities, domain checks, 6 lesson routes, retries, question variety, persistence and script');

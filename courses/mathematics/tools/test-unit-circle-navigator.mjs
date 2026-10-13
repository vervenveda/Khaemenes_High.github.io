import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const slug='unit-circle-navigator';
const page='courses/mathematics/assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(page,'utf8');
const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(match=>match[1]).filter(Boolean);
assert.equal(scripts.length,1,'exactly one local game program');
const source=scripts[0];new vm.Script(source,{filename:page});
const pure=source.split('// PURE_MODEL_BEGIN')[1]?.split('// PURE_MODEL_END')[0];
assert.ok(pure,'pure mathematical core isolated');
const m=vm.runInNewContext(pure+';({SPECIAL,TOKEN_VALUES,TOKEN_LABELS,normalize,near,gcd,piToken,components,refAngle,quadrant,numericToken,trigValue,makeTask,expected,correct})');
const near=(a,b,tol=1e-9)=>Math.abs(a-b)<=tol;
assert.equal(m.SPECIAL.length,16);
assert.equal(m.normalize(-30),330);assert.equal(m.normalize(750),30);assert.equal(m.normalize(360),0);
assert.equal(m.piToken(30),'π/6');assert.equal(m.piToken(45),'π/4');
assert.equal(m.piToken(90),'π/2');assert.equal(m.piToken(120),'2π/3');
assert.equal(m.piToken(180),'π');assert.equal(m.piToken(270),'3π/2');
assert.equal(m.piToken(360),'2π');assert.equal(m.piToken(-450),'−5π/2');
assert.equal(m.piToken(0),'0');assert.equal(m.piToken(15),'π/12');
assert.equal(m.refAngle(150),30);assert.equal(m.refAngle(210),30);
assert.equal(m.refAngle(315),45);assert.equal(m.refAngle(270),90);
assert.equal(m.quadrant(90),'axis');assert.equal(m.quadrant(120),'II');
assert.equal(m.quadrant(225),'III');assert.equal(m.quadrant(315),'IV');
assert.equal(m.quadrant(-30),'IV');assert.equal(m.quadrant(30),'I');
assert.ok(near(m.components(30).x,Math.sqrt(3)/2));assert.ok(near(m.components(30).y,.5));
assert.ok(near(m.components(225).x,-Math.SQRT1_2));assert.ok(near(m.components(225).y,-Math.SQRT1_2));
assert.ok(near(m.components(330).x,Math.sqrt(3)/2));assert.ok(near(m.components(330).y,-.5));
assert.equal(m.trigValue(90,'tan').toString(),'NaN');
assert.equal(m.trigValue(180,'csc').toString(),'NaN');
assert.equal(m.trigValue(0,'cot').toString(),'NaN');
assert.equal(m.numericToken(m.trigValue(30,'tan')),'sqrt3/3');
assert.equal(m.numericToken(m.trigValue(60,'tan')),'sqrt3');
assert.equal(m.numericToken(m.trigValue(30,'sec')),'2sqrt3/3');
assert.equal(m.numericToken(m.trigValue(45,'csc')),'sqrt2');
assert.equal(m.numericToken(m.trigValue(150,'cot')),'-sqrt3');
assert.equal(m.numericToken(m.trigValue(90,'sec')),'undefined');
for(let theta=-1080;theta<=1080;theta+=15){
 const v=m.components(theta),w=m.components(theta+360);
 assert.ok(near(v.x,w.x)&&near(v.y,w.y),'periodic circle coords '+theta);
 assert.ok(near(v.x*v.x+v.y*v.y,1),'unit radius invariant');
 assert.ok(near(m.trigValue(theta,'sin'),v.y)&&near(m.trigValue(theta,'cos'),v.x));
 const rotated=m.components(theta+90);
 assert.ok(near(rotated.x,-v.y)&&near(rotated.y,v.x),'quarter-turn identity');
}
for(const angle of m.SPECIAL){
 const c=m.components(angle);
 for(const fn of ['sin','cos','tan','cot','sec','csc']){
  const v=m.trigValue(angle,fn);
  const token=m.numericToken(v);
  assert.ok(token==='undefined'?Number.isNaN(v):near(m.TOKEN_VALUES[token],v),'exact token maps to value '+angle+' '+fn);
 }
}
const modes=['radians','coterminal','coordinates','reference','exact','tangent','reciprocal','rotation'];
for(const mode of modes){
 const seen=new Set(),branch=new Set();
 for(let i=0;i<480;i++){
  const t=m.makeTask(mode),expected=m.expected(t);
  assert.ok(Number.isFinite(expected.one),mode+' finite first answer');
  assert.equal(m.correct(t,expected.one,expected.two,expected.choice),true,'generated answer accepted '+mode);
  assert.equal(m.correct(t,expected.one+8,expected.two,expected.choice),false,'incorrect first rejected');
  assert.equal(m.correct(t,NaN,expected.two,expected.choice),false,'NaN rejected');
  if('two' in expected){
   assert.ok(Number.isFinite(expected.two),'finite second '+mode);
   assert.equal(m.correct(t,expected.one,expected.two+3,expected.choice),false,'wrong second rejected');
  }
  if('choice' in expected){
   assert.equal(m.correct(t,expected.one,expected.two,'wrong'),false,'wrong exact symbol rejected');
   branch.add(expected.choice);
  }
  if(mode==='radians')assert.equal(expected.choice,m.piToken(t.raw),'π notation exact');
  if(mode==='coterminal')assert.equal(t.raw,expected.one+360*expected.two,'signed turns identity');
  if(mode==='reference')assert.ok(['I','II','III','IV'].includes(expected.choice),'non-axial reference');
  if(mode==='exact'||mode==='tangent'||mode==='reciprocal')
   assert.ok(Object.hasOwn(m.TOKEN_VALUES,expected.choice),'exact symbol included');
  if(mode==='rotation'){
   const a=m.components(t.deg+t.turn);
   assert.ok(near(a.x,expected.one)&&near(a.y,expected.two));
  }
  seen.add(t.id);
 }
 assert.ok(seen.size>=12,mode+' variation');
 if(['tangent','reciprocal'].includes(mode))assert.ok(branch.has('undefined')&&branch.size>=5,mode+' defined and undefined variants');
}
const reg=JSON.parse(fs.readFileSync('courses/mathematics/assets/learning-games/game-registry.json','utf8'));
const placements=reg.games[slug]?.placements||[];
assert.equal(placements.length,4,'four relevant Algebra II Unit 10 lessons connected');
const launchModes=['radians','coordinates','reference','reciprocal'];
for(let i=0;i<4;i++){
 const lesson='u10-l'+String(i+1).padStart(2,'0'),p=placements[i],file='courses/mathematics/algebra-2/units/unit-10/lessons/'+lesson+'.html';
 assert.equal(p.course,'algebra-2');assert.equal(p.unit,'10');assert.equal(p.lesson,lesson);assert.equal(p.mode,launchModes[i]);
 const page=fs.readFileSync(file,'utf8');
 assert.ok(page.includes('data-game="'+slug+'"'),file+' game launcher');
 assert.ok(page.includes('data-mode="'+p.mode+'"'),file+' correct initial mission');
 assert.ok(page.includes('src="../../../../assets/shared-game-launcher.js"'),file+' correct relative route');
}
const nodes=new Map(),store=new Map();
function element(id){if(nodes.has(id))return nodes.get(id);
 const handlers=new Map(),item={id,value:'',textContent:'',innerHTML:'',className:'',disabled:false,hidden:false,checked:false,handlers,
 addEventListener:(k,fn)=>handlers.set(k,fn),replaceChildren(){},appendChild(){},setAttribute(){}};
 nodes.set(id,item);return item;
}
const document={getElementById:element,createElement:()=>({value:'',textContent:''})};
const context={document,window:{matchMedia:()=>({matches:true})},location:{search:'?course=algebra2&unit=10&lesson=u10-l01&mode=radians'},
 localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
 URLSearchParams,Math,console};
const instrument=source.replace(/\}\)\(\);\s*$/,';globalThis.audit={challenge,check,load,explore,switchMode,state:()=>({task,record})};})();');
assert.notEqual(instrument,source,'test hook added');
vm.runInNewContext(instrument,context,{timeout:2500});
let state=context.audit.state();const initial=state.task.id;
element('answer').value='99999';element('choice').value='wrong';context.audit.check();
state=context.audit.state();
assert.equal(state.record.attempted,1);
assert.equal(state.record.solved,0);
assert.equal(state.task.id,initial,'wrong answers never restart');
let correct=m.expected(state.task);
element('answer').value=String(correct.one);element('choice').value=correct.choice;context.audit.check();
state=context.audit.state();assert.equal(state.record.solved,1,'corrected mission solved');
assert.equal(state.record.firstTries,0,'wrong-first attempt not credited as perfect');
assert.equal(state.record.attempted,1,'corrected attempt not double counted');
context.audit.challenge();state=context.audit.state();assert.notEqual(state.task.id,initial,'varied next mission');
const active=state.task.id;context.audit.load();
assert.equal(context.audit.state().task.id,active,'reload preserves unfinished mission');
context.audit.explore();
let before=context.audit.state().record.solved;
element('probe').value='15';
element('probe').handlers.get('input')({target:{value:'15'}});
assert.equal(context.audit.state().record.solved,before,'free workshop leaves score intact');
assert.ok(element('visualText').textContent.includes('approximately'),'intermediate workshop angles use safe approximate values');
console.log('PASS: Unit Circle Navigator 8 modes, π fractions, quadrants, exact trig symbols, zero-denominator safety, unit-circle rotation, 4 lesson routes, retries, persistent progress and 15° workshop');

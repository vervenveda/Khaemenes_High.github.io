import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root='courses/mathematics/',slug='algebra-evidence-interval-lab';
const path=root+'assets/learning-games/'+slug+'/index.html';
const html=fs.readFileSync(path,'utf8');
const script=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean)[0];
assert.ok(script,'authored game logic');new vm.Script(script);
const bankMatch=script.match(/const BANK=(\{[\s\S]*?\});\s*const MODES=/);
assert.ok(bankMatch,'question bank exposes inspectable authored cases');
const BANK=vm.runInNewContext('('+bankMatch[1]+')');
assert.equal(BANK.argument.length,12);assert.equal(BANK.interval.length,16);
for(const [mode,items] of Object.entries(BANK)){
 const seen=new Set();
 for(const [i,q] of items.entries()){
  assert.equal(q.length,7,mode+' case '+i+' includes question, options, reasoning, hint, and skill');
  assert.ok(q.every(x=>typeof x==='string'&&x.trim().length>0),mode+' complete case '+i);
  assert.equal(new Set(q.slice(1,4)).size,3,mode+' unique options '+i);
  assert.ok(q[4].length>55,mode+' worked explanation is not vague');
  assert.ok(q[5].length>20,mode+' hint is actionable');
  assert.ok(!seen.has(q[0]),mode+' duplicate question');seen.add(q[0]);
 }
}
const lessonPaths=[
 'algebra-1/units/unit-01/lessons/lesson-01-algebraic-habits-notation-mathematical-argument.html',
 'algebra-1/units/unit-01/lessons/lesson-02-the-real-number-system-interval-representations.html'
];
for(let i=0;i<2;i++){
 const lesson=fs.readFileSync(root+lessonPaths[i],'utf8');
 assert.ok(lesson.includes('data-game="'+slug+'"'),'game linked in lesson '+(i+1));
 assert.ok(lesson.includes('data-mode="'+(['argument','interval'][i])+'"'),'lesson-specific mission');
 assert.ok(lesson.includes('data-lesson="0'+(i+1)+'"'),'correct launch context');
}
const l2=fs.readFileSync(root+lessonPaths[1],'utf8');
assert.ok(l2.includes('data-game="number-family"'),'classification reinforcement retained');
const reg=JSON.parse(fs.readFileSync(root+'assets/learning-games/game-registry.json','utf8'));
assert.equal(reg.games[slug].placements.length,2);
for(let i=0;i<2;i++)assert.equal(reg.games[slug].placements[i].mode,['argument','interval'][i]);
function storage(){const values=new Map();return {getItem:k=>values.has(k)?values.get(k):null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k),values};}
function open(query,store){
 const nodes=new Map();let n=0;
 function make(id){
  if(nodes.has(id))return nodes.get(id);
  const el={id,value:'',textContent:'',hidden:false,disabled:false,href:'',children:[],attrs:{},handlers:{},
   addEventListener(type,fn){this.handlers[type]=fn;},setAttribute(name,value){this.attrs[name]=value;},
   appendChild(c){this.children.push(c);return c;},replaceChildren(...c){this.children=c;},
   click(){this.handlers.click?.();}};
  nodes.set(id,el);return el;
 }
 const document={getElementById:make,createElement:tag=>make('generated-'+n++)};
 const ctx={document,location:{search:query},localStorage:store,URLSearchParams,Math,console,Date};
 vm.createContext(ctx);
 const hooked=script.replace(/\}\)\(\);?\s*$/,';globalThis.qa={mode:()=>mode,state:()=>state,chooseNext,next,check,hint,showWorked,switchMode,questions};})();');
 assert.notEqual(hooked,script,'test hooks installed');
 vm.runInContext(hooked,ctx,{timeout:4000});
 return {qa:ctx.qa,nodes,store,document};
}
for(const mode of ['argument','interval']){
 const store=storage();
 const url='?course=algebra1&unit=01&lesson='+(mode==='argument'?'01':'02')+'&mode='+mode;
 let a=open(url,store);assert.equal(a.qa.mode(),mode);
 assert.ok(a.nodes.get('lessonTarget').textContent.includes('Lesson 0'+(mode==='argument'?1:2)));
 assert.equal(a.nodes.get('choices').children.length,3);
 const key=[...store.values.keys()][0];
 assert.ok(key?.includes(mode),'progress stored under lesson-specific key');
 const initial=a.qa.state().active;
 a.nodes.get('choices').children[0].handlers.click();
 assert.equal(a.qa.state().selection,0);
 a=open(url,store);
 assert.equal(a.qa.state().active,initial,'unfinished question persists');
 assert.equal(a.qa.state().selection,0,'selected answer persists');
 a.nodes.get('hint').handlers.click();
 const correct=(initial*7+2)%3;
 a.nodes.get('choices').children[correct].handlers.click();
 a.nodes.get('check').handlers.click();
 assert.equal(a.qa.state().checked,true);
 assert.equal(a.qa.state().attempts,1);
 assert.equal(a.qa.state().independent,0,'hint not unaided');
 a=open(url,store);assert.equal(a.qa.state().checked,true,'checked solution restored');
 a.nodes.get('next').handlers.click();const second=a.qa.state().active;
 assert.notEqual(second,initial,'fresh problem rather than immediate repeat');
 const answer=(second*7+2)%3,wrong=(answer+1)%3;
 a.nodes.get('choices').children[wrong].handlers.click();a.nodes.get('check').handlers.click();
 assert.equal(a.qa.state().attempts,2);
 assert.equal(a.qa.state().checked,false,'wrong choice stays on same problem');
 assert.equal(a.qa.state().selection,null);
 a.nodes.get('choices').children[answer].handlers.click();a.nodes.get('check').handlers.click();
 assert.equal(a.qa.state().attempts,2,'correction does not double count');
 assert.equal(a.qa.state().independent,0);
 assert.ok(a.nodes.get('workedText').textContent.length>55);
 a.qa.next();const third=a.qa.state().active;
 a.nodes.get('choices').children[(third*7+2)%3].handlers.click();a.nodes.get('check').handlers.click();
 assert.equal(a.qa.state().independent,1,'unaided first attempt credited');
 assert.equal(a.qa.state().attempts,3);
}
const mixed=storage(),start=open('?mode=argument',mixed);
start.qa.switchMode('interval');
assert.equal(start.qa.mode(),'interval');
assert.ok(start.nodes.get('lessonReturn').href.endsWith('lesson-02-the-real-number-system-interval-representations.html'));
start.qa.switchMode('argument');
assert.ok(start.nodes.get('lessonReturn').href.endsWith('lesson-01-algebraic-habits-notation-mathematical-argument.html'));
assert.equal(mixed.values.size,2,'two lesson modes save separately');
console.log('PASS: Algebra I Lessons 01–02 subject alignment, 28 authored reasoning cases, exact route, hint, retry, persistence and independent scoring.');

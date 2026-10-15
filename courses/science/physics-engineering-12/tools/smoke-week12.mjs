import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),read=p=>fs.readFileSync(path.join(base,p),'utf8');
class Element{
constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.attrs={};this.style={};this.textContent='';this.value='';this.checked=false;this.disabled=false;this.files=[];this.name='';this.parent=null}
appendChild(x){x.parent=this;this.children.push(x);return x}replaceChildren(...items){this.children=[];for(const x of items)this.appendChild(x)}
addEventListener(k,f){this.events[k]=f}trigger(k,x={}){return this.events[k]?.({target:this,...x})}click(){return this.trigger('click')}
setAttribute(k,v){this.attrs[k]=String(v)}remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}
}
const flat=e=>[e,...e.children.flatMap(flat)];
function mock(kind='rate',day=1){const nodes=new Map(),mem=new Map();const document={body:new Element('body'),createElement:tag=>new Element(tag),createElementNS:(_,tag)=>new Element(tag),
getElementById(id){if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id)},
querySelectorAll(selector){if(selector==='textarea[data-note]')return[this.getElementById('mainNote'),this.getElementById('thoughtNote')];const m=selector.match(/^input\[name="([^"]+)"\]$/);return m?flat(this.getElementById('quiz')).filter(x=>x.tag==='input'&&x.name===m[1]):[]},
querySelector(selector){const m=selector.match(/^input\[name="([^"]+)"\]:checked$/);return m?this.querySelectorAll('input[name="'+m[1]+'"]').find(x=>x.checked)||null:null}};
document.body.dataset.lab=kind;document.body.dataset.week='12';document.body.dataset.day=String(day);
document.getElementById('mainNote').dataset.note='main';document.getElementById('thoughtNote').dataset.note='thought';
for(const [k,v]of Object.entries({energy:kind==='rate'?360:400,time:kind==='rate'?6:5,efficiency:75}))document.getElementById(k).value=String(v);
const localStorage={getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k)};
const ctx=vm.createContext({document,localStorage,Math,Number,String,Date,JSON,Blob,console,confirm:()=>true,setTimeout:f=>f(),window:{print(){}},URL:{createObjectURL:()=> 'blob:lesson',revokeObjectURL(){}}});return{document,localStorage,ctx}}
const near=(a,b,title)=>assert.ok(Math.abs(a-b)<1e-8,title+' received '+a+' expected '+b);
const quiz=read('weeks/week-12/assets/week12-lesson.js'),data=JSON.parse(quiz.slice(quiz.indexOf('const Q=')+8,quiz.indexOf(';let picked=')));
for(const day of [1,3,5]){const e=mock('rate',day);vm.runInContext(quiz,e.ctx,{timeout:9000});const fields=e.document.getElementById('quiz').children;
assert.equal(fields.length,day===5?10:4,'expected question count');const seen=new Set();
for(const field of fields){const prompt=field.children.find(x=>x.tag==='legend').textContent.replace(/^\d+\. /,'');assert.ok(!seen.has(prompt),'unique questions within attempt');seen.add(prompt);
const q=data.find(x=>x[1]===prompt);assert.ok(q);if(day<5){const n=data.findIndex(x=>x[1]===prompt);assert.ok(n>=(day-1)*4&&n<day*4,'correct day question bank')}
const correct=field.children.find(x=>x.tag==='label'&&x.children.some(child=>child.tag==='span'&&child.textContent===q[2][q[3]]));assert.ok(correct);correct.children.find(x=>x.tag==='input').checked=true}
e.document.getElementById('submitQuiz').click();assert.match(e.document.getElementById('results').textContent,/100%/,'correct answers scored');
const first=e.document.getElementById('results').textContent;e.document.getElementById('submitQuiz').click();assert.equal(e.document.getElementById('results').textContent,first,'repeat submit blocked');
e.document.getElementById('newQuiz').click();assert.equal(e.document.getElementById('submitQuiz').disabled,false,'retry available');
const note=e.document.getElementById('mainNote');note.value='Week 12 evidence '+day;note.trigger('input');assert.equal(e.localStorage.getItem('khae:phys12:w12:efficiency:day:'+day+':v1:main'),note.value);
e.document.getElementById('exportNotes').click();console.log('PASS Week 12 lesson '+day+' scoring, retries, journals and export')}
const js=read('weeks/week-12/labs/power-engine.js'),marker='render();history();',i=js.lastIndexOf(marker);
assert.ok(i>0);const injected=js.slice(0,i)+'globalThis.__probe={solve,valid,params,CASES};'+js.slice(i);
for(const kind of ['rate','efficiency']){const e=mock(kind);vm.runInContext(injected,e.ctx,{timeout:12000});const model=e.ctx.__probe;
assert.equal(model.CASES.length,11,'eleven distinct game scenarios');
if(kind==='rate'){near(model.solve({E:360,t:6}).power,60,'same work 6s');near(model.solve({E:360,t:3}).power,120,'same work 3s');near(model.solve({E:400,t:5}).power,80,'400J / 5s');
assert.throws(()=>model.solve({E:400,t:0}),'zero duration invalid')}else{
const x=model.solve({E:400,eta:75,t:5});near(x.useful,300,'useful energy');near(x.other,100,'other energy');near(x.inputPower,80,'input W');near(x.usefulPower,60,'useful W');near(x.otherPower,20,'other W');assert.equal(x.energyBalanced,true);assert.equal(x.feasible,true);
assert.equal(model.solve({E:400,eta:60,t:5}).feasible,false,'insufficient useful output fails');
assert.equal(model.solve({E:500,eta:60,t:6}).feasible,true,'constraints exact boundary passes');
assert.equal(model.solve({E:600,eta:90,t:5}).feasible,false,'input budget fails');
near(model.solve({E:400,eta:0,t:5}).other,400,'zero efficiency');
near(model.solve({E:400,eta:100,t:5}).useful,400,'ideal full efficiency');
assert.throws(()=>model.solve({E:400,eta:105,t:5}),'over 100 percent rejects')}
assert.ok(e.document.getElementById('diagram').children.length>=4,'SVG diagram rendered');
assert.ok(e.document.getElementById('graph').children.length>=10,'SVG calculated graph rendered');
assert.equal(e.document.getElementById('comparisonRows').children.length,10,'accessible numeric alternatives');
e.document.getElementById('record').click();assert.equal(e.document.getElementById('historyRows').children.length,1,'record saved');
assert.ok(e.localStorage.getItem('khae:phys12:w12:'+kind+':v1'),'local data exists');
e.document.getElementById('newGame').click();assert.equal(e.document.getElementById('choices').children.length,4,'four answer options');
e.document.getElementById('choices').children[0].click();const score=e.document.getElementById('gameScore').textContent;
e.document.getElementById('choices').children[0].click();assert.equal(e.document.getElementById('gameScore').textContent,score,'duplicate scoring blocked');
e.document.getElementById('next').click();assert.equal(e.document.getElementById('choices').children.length,4,'next challenge');
e.document.getElementById('export').click();e.document.getElementById('reset').click();e.document.getElementById('clear').click();assert.equal(e.document.getElementById('historyRows').children.length,0,'clear button');
console.log('PASS Week 12 '+kind+' formulas, visual graphs, controls, saved work and games')}
console.log('PHYSICS12_WEEK12_INTERACTION_SMOKE=PASS');

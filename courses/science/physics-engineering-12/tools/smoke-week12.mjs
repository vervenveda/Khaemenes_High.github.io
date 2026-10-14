import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),read=p=>fs.readFileSync(path.join(base,p),'utf8');
class E{constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.attrs={};this.style={};this.value='';this.textContent='';this.checked=false;this.disabled=false;this.files=[];this.parent=null;this.name=''}
appendChild(x){x.parent=this;this.children.push(x);return x}replaceChildren(...items){this.children=[];for(const x of items)this.appendChild(x)}
addEventListener(k,f){this.events[k]=f}trigger(k,more={}){return this.events[k]?.({target:this,...more})}click(){return this.trigger('click')}setAttribute(k,v){this.attrs[k]=String(v)}
remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}}
const traverse=e=>[e,...e.children.flatMap(traverse)];
function browser(kind='rate',day=1){const elements=new Map(),storage=new Map();const document={body:new E('body'),createElement:t=>new E(t),createElementNS:(_ns,t)=>new E(t),
getElementById(id){if(!elements.has(id))elements.set(id,new E());return elements.get(id)},
querySelectorAll(s){if(s==='textarea[data-note]')return[this.getElementById('mainNote'),this.getElementById('thoughtNote')];const m=s.match(/^input\[name="([^"]+)"\]$/);return m?traverse(this.getElementById('quiz')).filter(x=>x.tag==='input'&&x.name===m[1]):[]},
querySelector(s){const m=s.match(/^input\[name="([^"]+)"\]:checked$/);return m?this.querySelectorAll('input[name="'+m[1]+'"]').find(x=>x.checked)||null:null}};
document.body.dataset.lab=kind;document.body.dataset.week='12';document.body.dataset.day=String(day);
document.getElementById('mainNote').dataset.note='main';document.getElementById('thoughtNote').dataset.note='thought';
for(const [k,v] of Object.entries(kind==='rate'?{energy:360,time:6}:{energy:400,efficiency:75,time:5}))document.getElementById(k).value=String(v);
const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)};
const ctx=vm.createContext({document,localStorage,Math,Number,String,Date,JSON,Blob,console,confirm:()=>true,window:{print(){}},setTimeout:f=>f(),URL:{createObjectURL:()=> 'blob:demo',revokeObjectURL(){}}});
return{document,localStorage,ctx}}
const near=(a,b,msg)=>assert.ok(Math.abs(a-b)<1e-8,msg+': '+a+' versus '+b);
const lesson=read('weeks/week-12/assets/week12-lesson.js'),from=lesson.indexOf('const Q=')+8,to=lesson.indexOf(';let picked=',from),bank=JSON.parse(lesson.slice(from,to));
for(const day of [1,3,5]){const b=browser('rate',day);vm.runInContext(lesson,b.ctx,{timeout:9000});const fields=b.document.getElementById('quiz').children;assert.equal(fields.length,day===5?10:4,'question count');const titles=new Set();
for(const field of fields){const name=field.children.find(x=>x.tag==='legend').textContent.replace(/^\d+\. /,'');assert.ok(!titles.has(name));titles.add(name);const q=bank.find(x=>x[1]===name);assert.ok(q,'matching question in bank');
if(day<5){const idx=bank.findIndex(x=>x[1]===name);assert.ok(idx>=(day-1)*4&&idx<day*4,'daily topic boundaries')}
const label=field.children.find(x=>x.tag==='label'&&x.children.some(y=>y.tag==='span'&&y.textContent===q[2][q[3]]));assert.ok(label,'answer in choices');label.children.find(x=>x.tag==='input').checked=true}
b.document.getElementById('submitQuiz').click();assert.match(b.document.getElementById('results').textContent,/100%/);
const scored=b.document.getElementById('results').textContent;b.document.getElementById('submitQuiz').click();assert.equal(b.document.getElementById('results').textContent,scored,'duplicate scoring blocked');
b.document.getElementById('newQuiz').click();assert.equal(b.document.getElementById('submitQuiz').disabled,false,'quiz retry');
const note=b.document.getElementById('mainNote');note.value='Week 12 Day '+day+' energy and power';note.trigger('input');assert.equal(b.localStorage.getItem('khae:phys12:w12:efficiency:day:'+day+':v1:main'),note.value,'notes saved under new key');b.document.getElementById('exportNotes').click();
console.log('PASS Week 12 Day '+day+' quiz, repeated click protection, note save and export')}
const engine=read('weeks/week-12/labs/power-engine.js'),marker='render();history();',pos=engine.lastIndexOf(marker);assert.ok(pos>0);const source=engine.slice(0,pos)+'globalThis.__test={solve,valid,params,CASES};'+engine.slice(pos);
for(const kind of ['rate','efficiency']){const b=browser(kind);vm.runInContext(source,b.ctx,{timeout:10000});const m=b.ctx.__test;
assert.equal(m.CASES.length,11,'eleven game cases');
if(kind==='rate'){near(m.solve({E:360,t:6}).power,60,'six seconds');near(m.solve({E:360,t:3}).power,120,'three seconds');near(m.solve({E:500,t:10}).power,50,'ten seconds');assert.equal(m.valid({E:360,t:0}),false,'no divide by zero')}else{
const r=m.solve({E:400,eta:75,t:5});near(r.useful,300,'useful energy');near(r.other,100,'other transfer');near(r.inputPower,80,'input power');near(r.usefulPower,60,'useful output power');near(r.otherPower,20,'other power');assert.equal(r.feasible,true,'all constraints met');assert.equal(r.energyBalanced,true,'conserved');
assert.equal(m.solve({E:400,eta:60,t:5}).feasible,false,'output below minimum');
assert.equal(m.solve({E:600,eta:75,t:5}).feasible,false,'input over budget');
assert.equal(m.solve({E:400,eta:75,t:7}).feasible,false,'deadline exceeded');
const zero=m.solve({E:400,eta:0,t:5});near(zero.useful,0,'zero useful conversion');near(zero.other,400,'all other transfers');assert.equal(m.valid({E:400,eta:101,t:5}),false,'no >100% efficiency')}
assert.ok(b.document.getElementById('diagram').children.length>=6,'energy diagram produced');
assert.ok(b.document.getElementById('graph').children.length>10,'comparison graph produced');
assert.equal(b.document.getElementById('comparisonRows').children.length,10,'numerical alternatives present');
b.document.getElementById('record').click();assert.equal(b.document.getElementById('historyRows').children.length,1,'trial recorded');assert.ok(b.localStorage.getItem('khae:phys12:w12:'+kind+':v1'),'local notebook persisted');
b.document.getElementById('newGame').click();assert.equal(b.document.getElementById('choices').children.length,4,'game choices available');
b.document.getElementById('choices').children[0].click();const score=b.document.getElementById('gameScore').textContent;
b.document.getElementById('choices').children[0].click();assert.equal(b.document.getElementById('gameScore').textContent,score,'one award per round');
b.document.getElementById('next').click();assert.equal(b.document.getElementById('choices').children.length,4,'next challenge');
b.document.getElementById('export').click();b.document.getElementById('reset').click();b.document.getElementById('clear').click();assert.equal(b.document.getElementById('historyRows').children.length,0,'cleared trials');
console.log('PASS Week 12 '+kind+' calculator, SVG, comparison table, seven-round progression and local evidence')}
console.log('PHYSICS12_WEEK12_INTERACTION_SMOKE=PASS');

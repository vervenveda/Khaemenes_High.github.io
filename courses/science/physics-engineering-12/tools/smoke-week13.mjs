import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),read=p=>fs.readFileSync(path.join(base,p),'utf8');
class E{constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.style={};this.attrs={};this.value='';this.textContent='';this.disabled=false;this.checked=false;this.name='';this.parent=null;this.files=[]}
appendChild(e){e.parent=this;this.children.push(e);return e}replaceChildren(...es){this.children=[];for(const e of es)this.appendChild(e)}
addEventListener(k,f){this.events[k]=f}trigger(k,obj={}){return this.events[k]?.({target:this,...obj})}click(){this.trigger('click')}setAttribute(k,v){this.attrs[k]=String(v)}remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}}
const flat=e=>[e,...e.children.flatMap(flat)];
function browser(mode='flow',day=1){const map=new Map(),mem=new Map();const doc={body:new E('body'),createElement:t=>new E(t),createElementNS:(_n,t)=>new E(t),getElementById(k){if(!map.has(k))map.set(k,new E(k));return map.get(k)},querySelectorAll(s){if(s==='textarea[data-note]')return[this.getElementById('mainNote'),this.getElementById('thoughtNote')];const m=s.match(/^input\[name="([^"]+)"\]$/);return m?flat(this.getElementById('quiz')).filter(e=>e.tag==='input'&&e.name===m[1]):[]},querySelector(s){const m=s.match(/^input\[name="([^"]+)"\]:checked$/);return m?this.querySelectorAll('input[name="'+m[1]+'"]').find(e=>e.checked)||null:null}};
doc.body.dataset.week='13';doc.body.dataset.day=String(day);doc.body.dataset.lab=mode;
doc.getElementById('mainNote').dataset.note='main';doc.getElementById('thoughtNote').dataset.note='thought';
for(const[k,v]of Object.entries({inputEnergy:500,useful:60,thermal:25,duration:5}))doc.getElementById(k).value=String(v);
const localStorage={getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k)};
const ctx=vm.createContext({document:doc,localStorage,Math,Number,String,Date,JSON,Blob,console,confirm:()=>true,setTimeout:f=>f(),URL:{createObjectURL:()=> 'blob:offline',revokeObjectURL(){}},window:{print(){}}});return{document:doc,localStorage,ctx}}
const near=(a,b,m)=>assert.ok(Math.abs(a-b)<1e-8,m+' actual='+a+' expected='+b);
const script=read('weeks/week-13/assets/week13-lesson.js'),bank=JSON.parse(script.slice(script.indexOf('const Q=')+8,script.indexOf(';let picked=')));
for(const day of [1,3,5]){const b=browser('flow',day);vm.runInContext(script,b.ctx,{timeout:9000});const fields=b.document.getElementById('quiz').children;assert.equal(fields.length,day===5?10:4);const seen=new Set();
for(const field of fields){const name=field.children.find(e=>e.tag==='legend').textContent.replace(/^\d+\. /,'');assert.ok(!seen.has(name),'no repeated question');seen.add(name);const q=bank.find(x=>x[1]===name);assert.ok(q);if(day<5){const idx=bank.findIndex(x=>x[1]===name);assert.ok(idx>=(day-1)*4&&idx<day*4,'day aligned question')}
const opt=field.children.find(e=>e.tag==='label'&&e.children.some(y=>y.tag==='span'&&y.textContent===q[2][q[3]]));assert.ok(opt);opt.children.find(x=>x.tag==='input').checked=true}
b.document.getElementById('submitQuiz').click();assert.match(b.document.getElementById('results').textContent,/100%/);const result=b.document.getElementById('results').textContent;b.document.getElementById('submitQuiz').click();assert.equal(b.document.getElementById('results').textContent,result,'one submission');
b.document.getElementById('newQuiz').click();assert.equal(b.document.getElementById('submitQuiz').disabled,false,'retry enabled');
const note=b.document.getElementById('mainNote');note.value='Week 13 working evidence day '+day;note.trigger('input');assert.equal(b.localStorage.getItem('khae:phys12:w13:systems:day:'+day+':v1:main'),note.value);
b.document.getElementById('exportNotes').click();console.log('PASS Week 13 day '+day+' quiz, mastery, journals and export')}
const engine=read('weeks/week-13/labs/systems-engine.js'),mark='render();history();',ix=engine.lastIndexOf(mark);assert.ok(ix>0);const tested=engine.slice(0,ix)+'globalThis.__probe={solve,valid,settings,CASES};'+engine.slice(ix);
for(const mode of ['flow','design']){const b=browser(mode);vm.runInContext(tested,b.ctx,{timeout:10000});const p=b.ctx.__probe;
const result=p.solve({E:500,u:60,h:25,t:5});near(result.useful,300,'useful 300');near(result.thermal,125,'thermal 125');near(result.other,75,'other 75');near(result.total,500,'total 500');near(result.pu,60,'useful power 60');assert.equal(result.pass,true,'feasible baseline');
const failing=p.solve({E:500,u:70,h:30,t:5});near(failing.useful,350,'improved useful');near(failing.thermal,150,'thermal too high');assert.equal(failing.pass,false,'constraint fails');
const excessive=p.solve({E:650,u:60,h:20,t:5});assert.equal(excessive.requirements[0],false,'input cap');
assert.equal(p.CASES.length,11,'eleven game cases');for(const c of p.CASES){assert.ok(p.valid(c));const z=p.solve(c);near(z.total,c.E,'all scenarios balanced');assert.ok(z.other>=0,'nonnegative other pathway')}
assert.ok(b.document.getElementById('sankey').children.length>=4,'proportional sankey built');assert.ok(b.document.getElementById('graph').children.length>=10,'sensitivity graph drawn');assert.equal(b.document.getElementById('comparisonRows').children.length,11,'accessible numeric comparison table');
if(mode==='design')assert.equal(b.document.getElementById('constraints').children.length,4,'all constraints announced');
b.document.getElementById('useful').value='90';b.document.getElementById('useful').trigger('input');assert.equal(b.document.getElementById('thermal').value,'10','interactive fraction cap');assert.match(b.document.getElementById('readout').textContent,/Input 500 J/);
b.document.getElementById('record').click();assert.equal(b.document.getElementById('trialRows').children.length,1,'save one trial');assert.ok(b.localStorage.getItem('khae:phys12:w13:'+mode+':v1'),'persist model');
b.document.getElementById('newGame').click();assert.equal(b.document.getElementById('choices').children.length,mode==='design'?2:4,'game choices');
b.document.getElementById('choices').children[0].click();const before=b.document.getElementById('gameScore').textContent;b.document.getElementById('choices').children[0].click();assert.equal(b.document.getElementById('gameScore').textContent,before,'duplicate scoring blocked');
b.document.getElementById('next').click();assert.equal(b.document.getElementById('choices').children.length,mode==='design'?2:4,'game advances');
b.document.getElementById('export').click();b.document.getElementById('reset').click();assert.equal(b.document.getElementById('thermal').value,'25','reset');b.document.getElementById('clear').click();assert.equal(b.document.getElementById('trialRows').children.length,0,'clear');
console.log('PASS Week 13 '+mode+' conservation, scoring, design dashboard, sliders and JSON')}
console.log('PHYSICS12_WEEK13_INTERACTION_SMOKE=PASS');

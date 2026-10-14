import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const home=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),read=p=>fs.readFileSync(path.join(home,p),'utf8');
class El{constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.style={};this.attrs={};this.value='';this.textContent='';this.checked=false;this.disabled=false;this.files=[];this.name='';this.parent=null}
appendChild(x){x.parent=this;this.children.push(x);return x}replaceChildren(...a){this.children=[];for(const item of a)this.appendChild(item)}
addEventListener(k,f){this.events[k]=f}trigger(k,extra={}){return this.events[k]?.({target:this,...extra})}
click(){return this.trigger('click')}setAttribute(k,v){this.attrs[k]=String(v)}remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}}
const traverse=e=>[e,...e.children.flatMap(traverse)];
function browser(lab='gravity',day=1){const items=new Map(),mem=new Map();const document={body:new El('body'),createElement:t=>new El(t),createElementNS:(_ns,t)=>new El(t),getElementById(id){if(!items.has(id))items.set(id,new El());return items.get(id)},querySelectorAll(s){if(s==='textarea[data-note]')return[this.getElementById('mainNote'),this.getElementById('thoughtNote')];const m=s.match(/^input\[name="([^"]+)"\]$/);return m?traverse(this.getElementById('quiz')).filter(x=>x.tag==='input'&&x.name===m[1]):[]},querySelector(s){const m=s.match(/^input\[name="([^"]+)"\]:checked$/);return m?this.querySelectorAll('input[name="'+m[1]+'"]').find(x=>x.checked)||null:null}};
document.body.dataset.lab=lab;document.body.dataset.week='9';document.body.dataset.day=String(day);
document.getElementById('mainNote').dataset.note='main';document.getElementById('thoughtNote').dataset.note='thought';
for(const[k,v]of Object.entries({body:'earth',alt:lab==='orbit'?400:0,mass:lab==='orbit'?500:10,phase:0}))document.getElementById(k).value=String(v);
const localStorage={getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k)};
const ctx=vm.createContext({document,localStorage,Math,Number,String,Date,JSON,Blob,console,confirm:()=>true,window:{print(){}},setTimeout:f=>f(),URL:{createObjectURL:()=> 'blob:demo',revokeObjectURL(){}}});return{document,ctx,localStorage}}
const lesson=read('weeks/week-09/assets/week09-lesson.js'),qstart=lesson.indexOf('const Q=')+8,qend=lesson.indexOf(';let picked=',qstart),bank=JSON.parse(lesson.slice(qstart,qend));
for(const day of [1,3,5]){const b=browser('gravity',day);vm.runInContext(lesson,b.ctx,{timeout:8000});const fields=b.document.getElementById('quiz').children;
assert.equal(fields.length,day===5?10:4,'proper number of questions');const seen=new Set();
for(const [i,field]of fields.entries()){const label=field.children.find(x=>x.tag==='legend').textContent.replace(/^\d+\. /,'');assert.ok(!seen.has(label));seen.add(label);const q=bank.find(x=>x[1]===label);assert.ok(q,'question sourced');if(day<5){const k=bank.findIndex(x=>x[1]===label);assert.ok(k>=(day-1)*4&&k<day*4,'aligned content')}
const choice=field.children.find(x=>x.tag==='label'&&x.children.some(y=>y.tag==='span'&&y.textContent===q[2][q[3]]));assert.ok(choice,'correct answer present');choice.children.find(x=>x.tag==='input').checked=true}
b.document.getElementById('submitQuiz').click();assert.match(b.document.getElementById('results').textContent,/100%/);
const score=b.document.getElementById('results').textContent;b.document.getElementById('submitQuiz').click();assert.equal(b.document.getElementById('results').textContent,score,'no duplicate scoring');
b.document.getElementById('newQuiz').click();assert.equal(b.document.getElementById('submitQuiz').disabled,false,'retry unlock');
const area=b.document.getElementById('mainNote');area.value='Orbital free fall evidence '+day;area.trigger('input');assert.equal(b.localStorage.getItem('khae:phys12:w09:orbit:day:'+day+':v1:main'),area.value,'journal persisted');
b.document.getElementById('exportNotes').click();console.log('PASS Physics 12 W09 Day '+day+' quiz answers, new set, local evidence and export')}
const engine=read('weeks/week-09/labs/lab-engine.js');const marker='render();history();';const pos=engine.lastIndexOf(marker);assert.ok(pos>0);const injected=engine.slice(0,pos)+'globalThis.__probe={calculate,params,BODIES,CASES};'+engine.slice(pos);
const near=(v,expected,label,tol=1e-6)=>assert.ok(Math.abs(v-expected)<tol,label+' actual='+v+' expected='+expected);
for(const mode of ['gravity','orbit']){const b=browser(mode);vm.runInContext(injected,b.ctx,{timeout:9000});const model=b.ctx.__probe;
const earth=model.calculate('earth',400,10,0),R=(6371+400)*1000,mu=3.986004418e14;
near(earth.r,R,'center radius');near(earth.g,mu/R**2,'inverse square field');near(earth.F,10*earth.g,'gravity force');near(earth.v,Math.sqrt(mu/R),'circular speed');near(earth.T,2*Math.PI*Math.sqrt(R**3/mu),'circular period');
near(earth.vx,0,'velocity x at 0');near(earth.vy,earth.v,'velocity y tangent');near(earth.fx,-earth.F,'force x inward');
const radial90=model.calculate('earth',400,10,90);near(radial90.vx,-radial90.v,'tangent x 90°');near(radial90.fy,-radial90.F,'force y inward 90°');
const moon=model.calculate('moon',0,10,0);assert.ok(moon.g>1.6&&moon.g<1.7,'lunar surface field');
const higher=model.calculate('earth',1000,10,0);assert.ok(higher.g<earth.g&&higher.v<earth.v&&higher.T>earth.T,'higher circular orbit has lower field and speed, longer period');
assert.ok(b.document.getElementById('diagram').children.length>=4,'SVG vector model');assert.ok(b.document.getElementById('plot').children.length>10,'SVG graph');assert.ok(b.document.getElementById('tableRows').children.length===7,'accessible table');
b.document.getElementById('record').click();assert.equal(b.document.getElementById('history').children.length,1,'trial recorded');assert.ok(b.localStorage.getItem('khae:phys12:w09:'+mode+':v1'),'browser-local record');
b.document.getElementById('body').value='moon';b.document.getElementById('body').trigger('change');assert.match(b.document.getElementById('readout').textContent,/Moon/,'switch to Moon updates model');
b.document.getElementById('newGame').click();assert.equal(b.document.getElementById('choices').children.length,4,'four choices from randomized challenge');
b.document.getElementById('choices').children[0].click();const prior=b.document.getElementById('score').textContent;
b.document.getElementById('choices').children[0].click();assert.equal(b.document.getElementById('score').textContent,prior,'no repeated score');
b.document.getElementById('next').click();assert.equal(b.document.getElementById('choices').children.length,4,'next randomized challenge');
b.document.getElementById('export').click();b.document.getElementById('reset').click();assert.equal(b.document.getElementById('body').value,'earth','reset central body');
b.document.getElementById('clear').click();assert.equal(b.document.getElementById('history').children.length,0,'clear evidence');
console.log('PASS Week 09 '+mode+' fields, orbit formulas, vectors, graph, score guard, trial saving and controls')}
console.log('PHYSICS12_WEEK09_INTERACTION_SMOKE=PASS');

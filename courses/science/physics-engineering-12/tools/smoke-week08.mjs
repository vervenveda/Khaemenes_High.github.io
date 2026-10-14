import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
class E{
 constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.style={};this.attrs={};this.value='';this.textContent='';this.disabled=false;this.checked=false;this.name='';this.id='';this.files=[];this.parent=null}
 appendChild(e){e.parent=this;this.children.push(e);return e}
 replaceChildren(...items){this.children=[];for(const e of items)this.appendChild(e)}
 addEventListener(name,f){this.events[name]=f}
 trigger(name,extra={}){return this.events[name]?.({target:this,...extra})}
 click(){return this.trigger('click')}
 setAttribute(k,v){this.attrs[k]=String(v)}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}
}
const flatten=e=>[e,...e.children.flatMap(flatten)];
function browser(day=1){const items=new Map(),mem=new Map();const document={body:new E('body'),createElement:t=>new E(t),createElementNS:(_ns,t)=>new E(t),
getElementById(id){if(!items.has(id)){const e=new E();e.id=id;items.set(id,e)}return items.get(id)},
querySelectorAll(s){if(s==='textarea[data-note]')return[this.getElementById('mainNote'),this.getElementById('thoughtNote')];const m=s.match(/^input\[name="([^"]+)"\]$/);return m?flatten(this.getElementById('quiz')).filter(x=>x.tag==='input'&&x.name===m[1]):[]},
querySelector(s){const m=s.match(/^input\[name="([^"]+)"\]:checked$/);return m?this.querySelectorAll('input[name="'+m[1]+'"]').find(x=>x.checked)||null:null}};
document.body.dataset.week='8';document.body.dataset.day=String(day);
document.getElementById('mainNote').dataset.note='main';document.getElementById('thoughtNote').dataset.note='thought';
for(const [k,v]of Object.entries({mass:5,push:12,muS:.4,muK:.3,speed:4,radius:8,phase:0}))document.getElementById(k).value=String(v);
const localStorage={getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k)};
const ctx=vm.createContext({document,localStorage,Math,Number,String,Date,JSON,Blob,console,confirm:()=>true,setTimeout:f=>f(),URL:{createObjectURL:()=> 'blob:simulation',revokeObjectURL(){}}});return{document,ctx,localStorage}}
const near=(a,b,info)=>assert.ok(Math.abs(a-b)<1e-8,info+': '+a+' versus '+b);
const script=read('weeks/week-08/assets/week08-lesson.js');
const s=script.indexOf('const Q=')+8,e=script.indexOf(';let picked=',s),bank=JSON.parse(script.slice(s,e));
for(const day of [1,3,5]){const b=browser(day);vm.runInContext(script,b.ctx,{timeout:9000});const fields=b.document.getElementById('quiz').children;assert.equal(fields.length,day===5?10:4,'practice count');const titles=new Set();
for(const [i,field]of fields.entries()){const title=field.children.find(x=>x.tag==='legend').textContent.replace(/^\d+\. /,'');assert.ok(!titles.has(title),'no duplicates in attempt');titles.add(title);const q=bank.find(x=>x[1]===title);assert.ok(q);if(day<5){const idx=bank.findIndex(x=>x[1]===title);assert.ok(idx>=(day-1)*4&&idx<day*4,'daily content match')}
const label=field.children.find(x=>x.tag==='label'&&x.children.some(y=>y.tag==='span'&&y.textContent===q[2][q[3]]));assert.ok(label,'correct option exists');label.children.find(x=>x.tag==='input').checked=true}
b.document.getElementById('submitQuiz').click();assert.match(b.document.getElementById('results').textContent,/100%/);const result=b.document.getElementById('results').textContent;b.document.getElementById('submitQuiz').click();assert.equal(b.document.getElementById('results').textContent,result,'one submission only');
b.document.getElementById('newQuiz').click();assert.equal(b.document.getElementById('submitQuiz').disabled,false,'quiz retry');
const note=b.document.getElementById('mainNote');note.value='week08 lesson '+day+' evidence';note.trigger('input');assert.equal(b.localStorage.getItem('khae:phys12:w08:motion:day:'+day+':v1:main'),note.value,'journal persisted');
b.document.getElementById('exportNotes').click();console.log('PASS Week 08 day '+day+' quiz, journal and export')}
function engine(name,marker){const html=read('weeks/week-08/labs/'+name+'.html'),m=html.match(/<script>([\s\S]*?)<\/script>/);assert.ok(m);const script=m[1],at=script.lastIndexOf(marker);assert.ok(at>=0,'init marker '+name);return script.slice(0,at)+'globalThis.__test={solve,valid,params,cases};'+script.slice(at)}
const f=browser(),fScript=engine('friction-contact-lab','render();history();');vm.runInContext(fScript,f.ctx,{timeout:9000});const fm=f.ctx.__test;
const p={m:5,push:12,muS:.4,muK:.3},r=fm.solve(p);near(r.normal,49,'block normal');near(r.max,19.6,'static max');assert.equal(r.slip,false,'below threshold static');near(r.friction,-12,'actual static friction');near(r.acceleration,0,'block rest');
const atLimit=fm.solve({...p,push:19.6});assert.equal(atLimit.slip,false,'at limit static');
const sliding=fm.solve({...p,push:25});assert.equal(sliding.slip,true,'sliding');near(sliding.friction,-14.7,'kinetic magnitude');near(sliding.acceleration,2.06,'initial kinetic acceleration');
const negative=fm.solve({...p,push:-25});near(negative.friction,14.7,'opposite motion');near(negative.acceleration,-2.06,'negative acceleration');
assert.equal(f.document.getElementById('forceRows').children.length,5,'friction ledger');assert.ok(f.document.getElementById('sweepGraph').children.length>=10,'friction chart');
f.document.getElementById('record').click();assert.equal(f.document.getElementById('trialRows').children.length,1,'friction trial recorded');
assert.ok(f.localStorage.getItem('khae:phys12:w08:friction:v1'),'friction stored');
f.document.getElementById('push').value='25';f.document.getElementById('push').trigger('input');assert.match(f.document.getElementById('numbers').textContent,/kinetic approximation/);
f.document.getElementById('newGame').click();assert.equal(f.document.getElementById('choices').children.length,2);
f.document.getElementById('choices').children[0].click();const fsScore=f.document.getElementById('gameScore').textContent;f.document.getElementById('choices').children[0].click();assert.equal(f.document.getElementById('gameScore').textContent,fsScore,'friction double click locked');
f.document.getElementById('nextGame').click();assert.equal(f.document.getElementById('choices').children.length,2);f.document.getElementById('export').click();f.document.getElementById('reset').click();assert.equal(f.document.getElementById('push').value,'12');f.document.getElementById('clear').click();assert.equal(f.document.getElementById('trialRows').children.length,0);
console.log('PASS friction static threshold, kinetic branch, signs, game, storage and reset');
const c=browser(),cScript=engine('circular-motion-studio','render();history();');c.document.getElementById('mass').value='2';vm.runInContext(cScript,c.ctx,{timeout:9000});const cm=c.ctx.__test;
const p0={m:2,v:4,r:8,mu:.4,phase:0},c0=cm.solve(p0);near(c0.a,2,'centripetal acceleration');near(c0.force,4,'inward net force');near(c0.capacity,7.84,'flat friction max');assert.equal(c0.within,true);near(c0.velocity.x,0,'tangent vx at 0');near(c0.velocity.y,4,'tangent vy at 0');near(c0.acceleration.x,-2,'radial accel x');
const doubled=cm.solve({...p0,v:8});near(doubled.force,16,'speed doubled quadruples F');assert.equal(doubled.within,false);
near(cm.solve({...p0,r:16}).force,2,'radius doubled halves F');
near(cm.solve({...p0,m:4}).force,8,'mass doubled doubles F');
const quarter=cm.solve({...p0,phase:90});near(quarter.velocity.x,-4,'90 degree tangent vx');near(quarter.acceleration.y,-2,'90 degree radial acceleration');
assert.ok(c.document.getElementById('circle').children.length>=5,'circle diagram');assert.ok(c.document.getElementById('forceGraph').children.length>10,'force versus speed chart');assert.equal(c.document.getElementById('vectors').children.length,3,'accessible vector table');assert.equal(c.document.getElementById('sweepRows').children.length,8,'accessible sweep data');
c.document.getElementById('record').click();assert.equal(c.document.getElementById('trialRows').children.length,1,'circle trial recorded');
assert.ok(c.localStorage.getItem('khae:phys12:w08:circle:v1'),'circle stored');
c.document.getElementById('newGame').click();assert.equal(c.document.getElementById('choices').children.length,4);
c.document.getElementById('choices').children[0].click();const csScore=c.document.getElementById('gameScore').textContent;c.document.getElementById('choices').children[0].click();assert.equal(c.document.getElementById('gameScore').textContent,csScore,'circle duplicate score prevention');
c.document.getElementById('nextGame').click();assert.equal(c.document.getElementById('choices').children.length,4,'next circle puzzle');
c.document.getElementById('export').click();c.document.getElementById('reset').click();assert.equal(c.document.getElementById('speed').value,'4');c.document.getElementById('clear').click();assert.equal(c.document.getElementById('trialRows').children.length,0);
console.log('PHYSICS12_WEEK08_INTERACTION_SMOKE=PASS');
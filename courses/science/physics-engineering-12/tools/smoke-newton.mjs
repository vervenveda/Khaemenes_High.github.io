import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
class E{constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.value='';this.textContent='';this.disabled=false;this.checked=false;this.style={};this.attrs={};this.parent=null;this.files=[];this.name='';this.id=''}
appendChild(x){this.children.push(x);x.parent=this;return x}replaceChildren(...a){this.children=[];a.forEach(x=>this.appendChild(x))}addEventListener(k,f){this.events[k]=f}trigger(k,obj={}){this.events[k]?.({target:this,...obj})}click(){this.trigger('click')}setAttribute(k,v){this.attrs[k]=String(v)}remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}}
const flat=e=>[e,...e.children.flatMap(flat)];
function environment(day=1){const el=new Map(),mem=new Map();const document={body:new E('body'),createElement:t=>new E(t),createElementNS:(_,t)=>new E(t),getElementById(k){if(!el.has(k)){const x=new E();x.id=k;el.set(k,x)}return el.get(k)},querySelectorAll(s){if(s==='textarea[data-note]')return[this.getElementById('mainNote'),this.getElementById('thoughtNote')];const m=s.match(/^input\[name="([^"]+)"\]$/);return m?flat(this.getElementById('quiz')).filter(x=>x.tag==='input'&&x.name===m[1]):[]},querySelector(s){const m=s.match(/^input\[name="([^"]+)"\]:checked$/);return m?this.querySelectorAll('input[name="'+m[1]+'"]').find(x=>x.checked)||null:null}};
document.body.dataset.week='7';document.body.dataset.day=String(day);for(const [k,v]of Object.entries({mass:3,force:12,velocity:0,duration:2,massA:3,massB:6,interaction:12}))document.getElementById(k).value=String(v);
document.getElementById('mainNote').dataset.note='main';document.getElementById('thoughtNote').dataset.note='thought';
const storage={getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k)};
const ctx=vm.createContext({document,localStorage:storage,Math,Number,String,Date,JSON,Blob,console,confirm:()=>true,setTimeout:f=>f(),URL:{createObjectURL:()=> 'blob:local',revokeObjectURL(){}}});return{document,ctx,storage}}
const js=read('weeks/week-07/assets/newton-lesson.js');const bank=JSON.parse(js.slice(js.indexOf('const Q=')+8,js.indexOf(';let picked=')));
for(const d of [1,3,5]){const env=environment(d);vm.runInContext(js,env.ctx,{timeout:6000});const fields=env.document.getElementById('quiz').children;assert.equal(fields.length,d===5?10:4);const seen=new Set();
fields.forEach((field,i)=>{const title=field.children.find(x=>x.tag==='legend').textContent.replace(/^\d+\. /,'');assert.ok(!seen.has(title),'no repeated question');seen.add(title);const q=bank.find(q=>q[1]===title);assert.ok(q);if(d<5){const k=bank.findIndex(x=>x[1]===title);assert.ok(k>=(d-1)*4&&k<d*4,'topic aligned')}const label=field.children.find(x=>x.tag==='label'&&x.children.some(y=>y.tag==='span'&&y.textContent===q[2][q[3]]));assert.ok(label,'correct choice present');label.children.find(x=>x.tag==='input').checked=true});
env.document.getElementById('submitQuiz').click();assert.match(env.document.getElementById('results').textContent,/100%/);const one=env.document.getElementById('results').textContent;env.document.getElementById('submitQuiz').click();assert.equal(env.document.getElementById('results').textContent,one,'submission locked');
env.document.getElementById('newQuiz').click();assert.equal(env.document.getElementById('submitQuiz').disabled,false,'retry resets');
const area=env.document.getElementById('mainNote');area.value='Student evidence for day '+d;area.trigger('input');assert.equal(env.storage.getItem('khae:phys12:w07:newton:day:'+d+':v1:main'),area.value);env.document.getElementById('exportNotes').click();console.log('PASS Newton day '+d+' scoring, randomized selections, retries and note storage')}
const html=read('weeks/week-07/labs/newtons-laws-studio.html'),script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(script);
const anchor='renderCart();showPair();history();';const pos=script.lastIndexOf(anchor);assert.ok(pos>0);
const injected=script.slice(0,pos)+'globalThis.__probe={cart,pair,CASES,cartInputs,pairInputs};'+script.slice(pos);
const b=environment();vm.runInContext(injected,b.ctx,{timeout:7000});const p=b.ctx.__probe;
const near=(got,want,title)=>assert.ok(Math.abs(got-want)<1e-8,title+' actual='+got+' expected='+want);
const c=p.cart({m:3,f:12,v:0,T:2});near(c.a,4,'F=ma');near(c.finalV,8,'final velocity');near(c.displacement,8,'displacement');
const z=p.cart({m:4,f:0,v:-2,T:3});near(z.a,0,'balanced net');near(z.finalV,-2,'constant velocity');near(z.displacement,-6,'negative displacement');
const pair=p.pair({mA:3,mB:6,F:12});near(pair.forceOnA,-12,'reaction on A');near(pair.forceOnB,12,'action on B');near(pair.aA,-4,'A acceleration');near(pair.aB,2,'B acceleration');
for(const item of p.CASES)assert.ok(item.type==='reaction'?Number.isFinite(-item.f):Number.isFinite(item.f/item.m));
assert.ok(b.document.getElementById('forceGraph').children.length>20);assert.ok(b.document.getElementById('massGraph').children.length>20);assert.ok(b.document.getElementById('pairGraph').children.length>=6);
assert.equal(b.document.getElementById('comparisonRows').children.length,8,'accessible comparison table');
b.document.getElementById('recordCart').click();b.document.getElementById('recordPair').click();assert.equal(b.document.getElementById('trialRows').children.length,2,'records saved');
assert.ok(b.storage.getItem('khae:phys12:w07:dynamics:v1'),'local notebook persisted');
b.document.getElementById('presetBalance').click();assert.equal(b.document.getElementById('force').value,'0');assert.equal(b.document.getElementById('velocity').value,'3');
b.document.getElementById('newGame').click();assert.equal(b.document.getElementById('challengeChoices').children.length,4);
b.document.getElementById('challengeChoices').children[0].click();const score=b.document.getElementById('gameScore').textContent;b.document.getElementById('challengeChoices').children[0].click();assert.equal(b.document.getElementById('gameScore').textContent,score,'cannot double score');
b.document.getElementById('nextGame').click();assert.equal(b.document.getElementById('challengeChoices').children.length,4,'next challenge available');
b.document.getElementById('export').click();b.document.getElementById('clear').click();assert.equal(b.document.getElementById('trialRows').children.length,0);
console.log('PHYSICS12_WEEK07_INTERACTION_SMOKE=PASS');
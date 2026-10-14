import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const lesson=read('shared-motion/advanced-lesson.js'),proj=read('shared-motion/projectile-explorer.html'),detect=read('shared-motion/model-detective.html');
class Elem{constructor(tag='div'){this.tag=tag;this.children=[];this.style={};this.dataset={};this.attrs={};this.listeners={};this.value='';this.textContent='';this.checked=false;this.disabled=false;this.name='';this.id='';this.parent=null;this.files=[]}appendChild(x){this.children.push(x);x.parent=this;return x}replaceChildren(...xs){this.children=[];xs.forEach(x=>this.appendChild(x))}addEventListener(t,f){this.listeners[t]=f}setAttribute(k,v){this.attrs[k]=String(v)}trigger(t,extra={}){this.listeners[t]?.({target:this,...extra})}click(){this.trigger('click')}remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}}
const walk=x=>[x,...x.children.flatMap(walk)];
function browser(week=4,day=1){const elements=new Map(),memory=new Map();
const doc={body:new Elem('body'),createElement:t=>new Elem(t),createElementNS:(_ns,t)=>new Elem(t),
getElementById(id){if(!elements.has(id)){const x=new Elem();x.id=id;elements.set(id,x)}return elements.get(id)},
querySelectorAll(s){if(s==='textarea[data-note]')return[this.getElementById('mainNote'),this.getElementById('thoughtNote')];const m=s.match(/^input\[name="([^"]+)"\]$/);return m?walk(this.getElementById('quiz')).filter(x=>x.tag==='input'&&x.name===m[1]):[]},
querySelector(s){const m=s.match(/^input\[name="([^"]+)"\]:checked$/);return m?this.querySelectorAll('input[name="'+m[1]+'"]').find(x=>x.checked)||null:null}};
doc.body.dataset.week=String(week);doc.body.dataset.day=String(day);doc.getElementById('mainNote').dataset.note='main';doc.getElementById('thoughtNote').dataset.note='thought';
for(const[k,v]of Object.entries({speed:10,angle:30,height:0,gravity:9.8}))doc.getElementById(k).value=String(v);
doc.getElementById('dataset').value='uniform';doc.getElementById('showModel').value='both';
const localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
const ctx=vm.createContext({document:doc,localStorage,console,window:{print(){}},confirm(){return true},Math,Number,String,Date,JSON,Blob,setTimeout(fn){fn()},URL:{createObjectURL(){return'blob:stub'},revokeObjectURL(){}},Uint8Array});return{doc,ctx,localStorage}}
const marker='const Q=',qstart=lesson.indexOf(marker)+marker.length,qend=lesson.indexOf(';let picked=',qstart),BANK=JSON.parse(lesson.slice(qstart,qend));
for(const w of [4,5])for(const day of [1,3,5]){const o=browser(w,day);vm.runInContext(lesson,o.ctx,{timeout:6500});const el=o.doc.getElementById('quiz');assert.equal(el.children.length,day===5?10:4,'question count');
const seen=new Set();for(const [i,field] of el.children.entries()){const title=field.children.find(x=>x.tag==='legend').textContent.replace(/^\d+\. /,'');assert.ok(!seen.has(title),'no duplicate question');seen.add(title);const q=BANK.find(q=>q[0]===w&&q[1]===title);assert.ok(q,'question in matching week');if(day<5){const index=BANK.filter(q=>q[0]===w).findIndex(x=>x[1]===title);assert.ok(index>=(day-1)*4&&index<day*4,'day aligned');}
const correct=q[2][q[3]],label=field.children.find(x=>x.tag==='label'&&x.children.some(y=>y.tag==='span'&&y.textContent===correct));assert.ok(label);label.children.find(x=>x.tag==='input').checked=true}
o.doc.getElementById('submitQuiz').click();assert.match(o.doc.getElementById('results').textContent,/100%/);const result=o.doc.getElementById('results').textContent;o.doc.getElementById('submitQuiz').click();assert.equal(result,o.doc.getElementById('results').textContent,'double submission guard');
o.doc.getElementById('newQuiz').click();assert.equal(o.doc.getElementById('submitQuiz').disabled,false,'retry');
const note=o.doc.getElementById('mainNote');note.value='Saved Physics W'+w+'D'+day;note.trigger('input');
assert.equal(o.localStorage.getItem('khae:phys12:w'+w+':advanced:day:'+day+':v1:main'),note.value,'persisted journal');o.doc.getElementById('exportNotes').click();
console.log('PASS Week '+w+' Day '+day+' question selection, 100% grading, no double score, retry, record, export')}
function script(h){const m=h.match(/<script>([\s\S]*?)<\/script>/);assert.ok(m);return m[1]}
const P=browser();let ps=script(proj);let at=ps.lastIndexOf('render();renderTrials();');assert.ok(at>0,'projectile init marker');ps=ps.slice(0,at)+'globalThis.__probe={trajectory,valid,input};'+ps.slice(at);
vm.runInContext(ps,P.ctx,{timeout:8000});const pr=P.ctx.__probe;
function close(actual,expected,context,tolerance=1e-6){assert.ok(Math.abs(actual-expected)<tolerance,context+' actual='+actual+' expected='+expected)}
const r=pr.trajectory({v:10,deg:30,h:0,g:9.8});close(r.vx,8.660254037844387,'projectile vx');close(r.vy,5,'projectile vy');close(r.t,10/9.8,'level-ground flight time');close(r.range,100*Math.sin(Math.PI/3)/9.8,'level-ground range');close(r.apexHeight,25/19.6,'apex height');close(r.at(r.t).y,0,'landing height');
const same=pr.trajectory({v:20,deg:0,h:19.6,g:9.8});close(same.t,2,'horizontal-launch fall time');close(same.range,40,'horizontal launch range');
const still=pr.trajectory({v:0,deg:0,h:0,g:9.8});close(still.t,0,'edge case zero displacement');
assert.equal(P.doc.getElementById('samples').children.length,9,'projectile numeric table');assert.ok(P.doc.getElementById('graph').children.length>14,'projectile SVG plotted');
P.doc.getElementById('record').click();assert.equal(P.doc.getElementById('trialRows').children.length,1);P.doc.getElementById('speed').value='20';P.doc.getElementById('speed').trigger('input');P.doc.getElementById('record').click();assert.equal(P.doc.getElementById('trialRows').children.length,2);assert.ok(P.localStorage.getItem('khae:phys12:projectile-explorer:v1'));
P.doc.getElementById('challengeStart').click();assert.ok(P.doc.getElementById('challengeAnswers').children.length===4,'challenge presents four options');P.doc.getElementById('challengeAnswers').children[0].click();const scoreText=P.doc.getElementById('challengeScore').textContent;P.doc.getElementById('challengeAnswers').children[0].click();assert.equal(P.doc.getElementById('challengeScore').textContent,scoreText,'no repeated challenge scoring');
P.doc.getElementById('challengeNext').click();P.doc.getElementById('export').click();P.doc.getElementById('reset').click();close(Number(P.doc.getElementById('speed').value),10,'reset speed');P.doc.getElementById('clear').click();assert.equal(P.doc.getElementById('trialRows').children.length,0,'reset clears records');
console.log('PASS projectile math, graph, samples, challenge, no double scoring, records, local storage and reset');
const M=browser();let ms=script(detect),mt=ms.lastIndexOf('render();history();');assert.ok(mt>0,'model init marker');ms=ms.slice(0,mt)+'globalThis.__probe={fit,report,DATA};'+ms.slice(mt);
vm.runInContext(ms,M.ctx,{timeout:8500});const md=M.ctx.__probe;
const perfectLinear=[1,3,5,7,9,11],l=md.fit(perfectLinear,1);close(l.coeff[0],1,'linear intercept');close(l.coeff[1],2,'linear slope');close(l.rmse,0,'linear residual');close(l.holdout,0,'linear holdout');
const perfectQuadratic=[0,1,4,9,16,25],q=md.fit(perfectQuadratic,2);close(q.coeff[0],0,'quadratic intercept');close(q.coeff[1],0,'quadratic linear coefficient');close(q.coeff[2],1,'quadratic coefficient');close(q.rmse,0,'quadratic residual');close(q.holdout,0,'quadratic holdout');
const li=md.report(md.DATA[0]),qu=md.report(md.DATA[1]);assert.ok(li.lin.rmse<.2,'synthetic linear case fits line');assert.ok(qu.quad.rmse<.2,'synthetic curved case fits parabola');assert.ok(qu.quad.rmse<qu.lin.rmse,'quadratic improves curved training fit');
assert.ok(M.doc.getElementById('positionGraph').children.length>15&&M.doc.getElementById('residualGraph').children.length>12,'two SVG plots');assert.equal(M.doc.getElementById('dataRows').children.length,6,'six numerical rows');
M.doc.getElementById('record').click();assert.equal(M.doc.getElementById('history').children.length,1,'fit recorded');
M.doc.getElementById('dataset').value='accelerated';M.doc.getElementById('dataset').trigger('change');M.doc.getElementById('record').click();assert.equal(M.doc.getElementById('history').children.length,2,'second model recorded');assert.ok(M.localStorage.getItem('khae:phys12:model-detective:v1'));
M.doc.getElementById('newGame').click();assert.equal(M.doc.getElementById('challengeOptions').children.length,2,'model game two choices');M.doc.getElementById('challengeOptions').children[0].click();const gs=M.doc.getElementById('gameScore').textContent;M.doc.getElementById('challengeOptions').children[0].click();assert.equal(M.doc.getElementById('gameScore').textContent,gs,'model scoring locked');
M.doc.getElementById('nextGame').click();M.doc.getElementById('export').click();M.doc.getElementById('clear').click();assert.equal(M.doc.getElementById('history').children.length,0,'clear comparisons');
console.log('PASS least-squares math, residuals, holdout, two plots, accessible table, randomized game, no double scoring, records, export, clear');
console.log('PHYSICS12_ADVANCED_INTERACTION_SMOKE=PASS');
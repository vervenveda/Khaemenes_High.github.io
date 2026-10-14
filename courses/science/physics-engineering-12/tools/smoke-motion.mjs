import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),lessonJS=read('shared-motion/lesson.js'),studioHTML=read('shared-motion/motion-graph-studio.html');
class Elem{constructor(tag='div'){this.tag=tag;this.children=[];this.style={};this.dataset={};this.attrs={};this.listeners={};this.value='';this.textContent='';this.checked=false;this.disabled=false;this.id='';this.name='';this.files=[];this.parent=null}
appendChild(x){this.children.push(x);x.parent=this;return x}replaceChildren(...xs){this.children=[];for(const x of xs)this.appendChild(x)}addEventListener(ev,fn){this.listeners[ev]=fn}setAttribute(k,v){this.attrs[k]=String(v)}trigger(ev,extra={}){this.listeners[ev]?.({target:this,...extra})}click(){this.trigger('click')}remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}}
const flatten=e=>[e,...e.children.flatMap(flatten)];
function env(week=2,day=1){const map=new Map(),store=new Map();
const doc={body:new Elem('body'),createElement:n=>new Elem(n),createElementNS:(ns,n)=>new Elem(n),getElementById(id){for(const e of map.values()){const match=flatten(e).find(x=>x.id===id);if(match)return match}if(!map.has(id)){const x=new Elem();x.id=id;map.set(id,x)}return map.get(id)},
querySelectorAll(sel){if(sel==='textarea[data-note]')return[this.getElementById('mainNote'),this.getElementById('thoughtNote')];const m=sel.match(/^input\[name="([^"]+)"\]$/);if(m)return flatten(this.getElementById('quiz')).filter(x=>x.tag==='input'&&x.name===m[1]);return []},
querySelector(sel){const m=sel.match(/^input\[name="([^"]+)"\]:checked$/);return m?this.querySelectorAll('input[name="'+m[1]+'"]').find(x=>x.checked)||null:null}};
doc.body.dataset.week=String(week);doc.body.dataset.day=String(day);
for(const k of ['mainNote','thoughtNote'])doc.getElementById(k).dataset.note=k==='mainNote'?'main':'thought';
for(const [k,v] of Object.entries({x0:0,v0:4,acceleration:-2,duration:4,frame:0}))doc.getElementById(k).value=String(v);doc.getElementById('overlay').checked=true;
const localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
const ctx=vm.createContext({document:doc,localStorage,window:{print(){}},confirm(){return true},Math,Number,String,Date,JSON,console,Blob,setTimeout(f){f()},URL:{createObjectURL(){return'blob:test'},revokeObjectURL(){}},Uint8Array});
return{doc,ctx,localStorage}}
const qStart=lessonJS.indexOf('const Q=')+8,qEnd=lessonJS.indexOf(';let current=',qStart),questions=JSON.parse(lessonJS.slice(qStart,qEnd));
for(const week of [2,3])for(const day of [1,3,5]){const o=env(week,day);vm.runInContext(lessonJS,o.ctx,{timeout:6000});const quiz=o.doc.getElementById('quiz');assert.equal(quiz.children.length,day===5?10:4,'quiz count');const texts=[];
quiz.children.forEach((field,i)=>{const name=field.children.find(x=>x.tag==='legend').textContent.replace(/^\d+\. /,'');texts.push(name);const q=questions.find(x=>x[0]===week&&x[1]===name);assert.ok(q,'question exists in correct week');if(day!==5){const seq=questions.filter(x=>x[0]===week).findIndex(x=>x[1]===name);assert.ok(seq>=(day-1)*4&&seq<day*4,'daily quiz constrained to its topic')}const choice=q[2][q[3]];const label=field.children.find(x=>x.tag==='label'&&x.children.some(z=>z.tag==='span'&&z.textContent===choice));assert.ok(label,'correct answer displayed');label.children.find(z=>z.tag==='input').checked=true});assert.equal(new Set(texts).size,texts.length,'no repeated question in one attempt');
o.doc.getElementById('submitQuiz').click();assert.match(o.doc.getElementById('results').textContent,/100%/);
const before=o.doc.getElementById('results').textContent;o.doc.getElementById('submitQuiz').click();assert.equal(o.doc.getElementById('results').textContent,before,'one score per attempt');
o.doc.getElementById('newQuiz').click();assert.equal(o.doc.getElementById('submitQuiz').disabled,false,'new set available');
o.doc.getElementById('mainNote').value='Physics observation preserved';o.doc.getElementById('mainNote').trigger('input');assert.equal(o.localStorage.getItem('khae:phys12:w'+week+':lesson:'+day+':v1:main'),'Physics observation preserved');o.doc.getElementById('exportNotes').click();console.log('PASS Physics '+week+'/'+day+' grading retry journal and export')}
const script=studioHTML.match(/<script>([\s\S]*?)<\/script>/)[1];const modified=script.replace(/render\(\);renderTrials\(\);\s*\}\)\(\);\s*$/, 'globalThis.__physicsTest={at,distance,evaluate};render();renderTrials();})();');assert.notEqual(modified,script,'test hook injected into running studio engine');
const o=env();vm.runInContext(modified,o.ctx,{timeout:7000});const api=o.ctx.__physicsTest;assert.ok(api,'model functions callable');
function close(actual,expected,desc){assert.ok(Math.abs(actual-expected)<1e-8,desc+': '+actual+' expected '+expected)}
const reverse={x0:0,v0:4,a:-2,T:4,u:0},e=api.evaluate(reverse);close(e.groundDx,0,'reversal displacement');close(e.frameDist,8,'reversal distance');close(e.signedArea,0,'signed area');close(e.turnTime,2,'turn time');
const frames={x0:2,v0:3,a:0,T:4,u:1},f=api.evaluate(frames);close(f.groundDx,12,'ground displacement');close(f.frameDx,8,'moving-frame displacement');close(f.frameAvgV,2,'moving frame average velocity');close(f.acceleration,0,'acceleration unaffected');
const offset={x0:-4,v0:-2,a:-1,T:3,u:-3};close(api.distance(offset,true),2.5,'frame reversal distance with nonzero u');
assert.ok(o.doc.getElementById('positionGraph').children.length>10,'position SVG graph drawn');assert.ok(o.doc.getElementById('velocityGraph').children.length>10,'velocity SVG graph drawn');
assert.equal(o.doc.getElementById('samples').children.length,9,'9 accessible calculated table rows');
o.doc.getElementById('record').click();assert.equal(o.doc.getElementById('trialRows').children.length,1,'trial saved to table');
assert.ok(o.localStorage.getItem('khae:phys12:motion-studio:v1'),'notebook persisted');
o.doc.getElementById('frame').value='1';o.doc.getElementById('frame').trigger('input');assert.match(o.doc.getElementById('results').textContent,/displacement/);
o.doc.getElementById('record').click();assert.equal(o.doc.getElementById('trialRows').children.length,2,'second trial recorded');
o.doc.getElementById('export').click();o.doc.getElementById('reset').click();assert.equal(o.doc.getElementById('frame').value,'0','reset restored default frame');o.doc.getElementById('clear').click();assert.equal(o.doc.getElementById('trialRows').children.length,0,'clear works after confirmation');
console.log('PASS SVG rendering, physical math, frame transformation, reversals, signed area, data table, recording, storage, exports and reset');
console.log('PHYSICS12_MOTION_INTERACTION_SMOKE=PASS');

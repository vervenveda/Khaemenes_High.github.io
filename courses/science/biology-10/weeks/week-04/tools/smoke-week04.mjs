import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const here=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const lessonJS=fs.readFileSync(path.join(here,'assets/lesson.js'),'utf8');
const labHTML=fs.readFileSync(path.join(here,'labs/enzyme-rate-studio.html'),'utf8');
const scriptMatch=labHTML.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch,'inline laboratory script exists');

class Element{
  constructor(tag='div'){this.tag=tag;this.children=[];this.listeners={};this.dataset={};this.style={};this.textContent='';this.value='';this.id='';this.name='';this.disabled=false;this.checked=false;this.parent=null;this.files=[];}
  appendChild(el){this.children.push(el);el.parent=this;return el;}
  replaceChildren(...els){this.children=[];for(const el of els)this.appendChild(el);}
  addEventListener(type,cb){this.listeners[type]=cb;}
  trigger(type,detail={}){this.listeners[type]?.({target:this,...detail});}
  click(){this.trigger('click');}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);}
}
function flatten(root){return [root,...root.children.flatMap(flatten)];}
function createBrowser(opts={}){
  const map=new Map();const mem=new Map();const doc={body:new Element('body'),querySelectorAll(s){
    if(s==='textarea[data-note]')return [this.getElementById('mainNote'),this.getElementById('thoughtNote')];
    const m=s.match(/^input\[name="([^"]+)"\]$/);return m?flatten(this.getElementById('quiz')).filter(x=>x.tag==='input'&&x.name===m[1]):[];
  },querySelector(s){const m=s.match(/^input\[name="([^"]+)"\]:checked$/);return m?this.querySelectorAll('input[name="'+m[1]+'"]').find(x=>x.checked)||null:null;},
  createElement(tag){return new Element(tag)},
  getElementById(id){if(!map.has(id)){let el=new Element();el.id=id;map.set(id,el)}return map.get(id)}};
  doc.getElementById('mainNote').dataset.note='main';doc.getElementById('thoughtNote').dataset.note='thought';
  for(const [id,value] of Object.entries({temp:'37',ph:'7',substrate:'6'}))doc.getElementById(id).value=value;
  const ls={getItem(k){return mem.get(k)??null},setItem(k,v){mem.set(k,String(v))},removeItem(k){mem.delete(k)}};
  const browser={document:doc,localStorage:ls,window:{print(){}},confirm(){return true},console,Math,Number,String,Date,JSON,Blob,setTimeout(fn){fn()},URL:{createObjectURL(){return 'blob:test'},revokeObjectURL(){}},Uint8Array};
  const ctx=vm.createContext(browser);
  ctx.document.body.dataset.day=String(opts.day||1);
  return {ctx,doc,ls,map};
}
function checkLesson(day){
 const {ctx,doc,ls}=createBrowser({day});
 vm.runInContext(lessonJS,ctx,{timeout:4000});
 const quizzes=doc.getElementById('quiz');
 assert.equal(quizzes.children.length,day===5?10:4,'question count');
 const legends=quizzes.children.map(x=>x.children.find(y=>y.tag==='legend').textContent);
 assert.equal(new Set(legends).size,legends.length,'no same question twice in attempt');
 const marker='const Q=';const st=lessonJS.indexOf(marker)+marker.length;const ed=lessonJS.indexOf(';let current=',st);
 const all=JSON.parse(lessonJS.slice(st,ed));
 for(const box of quizzes.children){
   const legend=box.children.find(x=>x.tag==='legend').textContent;
   const question=legend.replace(/^\d+\. /,'');
   const actual=all.find(x=>x[1]===question);
   assert.ok(actual,'quiz question found in source');
   const right=actual[2][actual[3]];
   const label=box.children.find(x=>x.tag==='label'&&x.children.some(y=>y.tag==='span'&&y.textContent===right));
   assert.ok(label,'correct option shown');
   label.children.find(x=>x.tag==='input').checked=true;
 }
 doc.getElementById('submitQuiz').click();
 assert.match(doc.getElementById('results').textContent,/100%/,'perfect score when correct answers chosen');
 assert.ok(doc.getElementById('submitQuiz').disabled,'submit locked');
 const snapshot=doc.getElementById('results').textContent;
 doc.getElementById('submitQuiz').click();
 assert.equal(doc.getElementById('results').textContent,snapshot,'double submission cannot alter score');
 doc.getElementById('newQuiz').click();
 assert.equal(doc.getElementById('quiz').children.length,day===5?10:4,'retry renders new questions');
 assert.equal(doc.getElementById('submitQuiz').disabled,false,'retry unlocks submit');
 doc.getElementById('mainNote').value='My prediction text';
 doc.getElementById('mainNote').trigger('input');
 assert.equal(ls.getItem('khae:bio10:w04:lesson:'+day+':v1:main'),'My prediction text','notes persisted in storage');
 doc.getElementById('exportNotes').click();
 console.log('PASS Day '+day+' question correctness, 100% score, double-grade prevention, retry, notebook and export');
}
checkLesson(1);checkLesson(5);
const {ctx,doc,ls}=createBrowser();vm.runInContext(scriptMatch[1],ctx,{timeout:4000});
assert.equal(doc.getElementById('predictionRate').textContent,'60.00','expected baseline rate at 37 C pH7 substrate6');
doc.getElementById('run').click();assert.equal(doc.getElementById('log').children.length,1,'trial recorded');
assert.match(doc.getElementById('statistics').textContent,/n=1/,'group statistics updated');
doc.getElementById('temp').value='25';doc.getElementById('temp').trigger('input');
assert.ok(Number(doc.getElementById('predictionRate').textContent)<60,'cooler model predicts lower output');
doc.getElementById('run').click();assert.equal(doc.getElementById('log').children.length,2,'second condition logged');
assert.ok(ls.getItem('khae:bio10:w04:lab:v1'),'lab persists data');
doc.getElementById('export').click();doc.getElementById('clear').click();assert.equal(doc.getElementById('log').children.length,0,'clear removes trials');
console.log('PASS Model baseline, single and second trials, parameter updates, statistics, export, persistence and clear');
console.log('BIOLOGY10_WEEK04_INTERACTION_SMOKE=PASS');
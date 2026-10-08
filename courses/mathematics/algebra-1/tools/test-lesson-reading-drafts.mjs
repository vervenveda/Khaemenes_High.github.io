import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root='courses/mathematics/algebra-1';
const source=fs.readFileSync(`${root}/assets/deep-lesson-engine-v1.js`,'utf8');
const content={window:{}};vm.createContext(content);vm.runInContext(fs.readFileSync(`${root}/course-data.js`,'utf8'),content);
const lessons=content.window.ALGEBRA1_DATA.lessons;
for(const [u,n] of [[10,5],[10,6],[11,5]]){
 const l=lessons.find(l=>l.unit===u&&l.number===n);
 assert.ok(l.reading_sections.length>=3&&l.examples.every(e=>e.steps.length>=4||e.steps.length>=3));
 assert.ok(l.guided_practice.length>=3&&l.transfer_task);
}
// Independently check the roots and geometry in the authored examples.
for(const x of [0,6])assert.equal(2*(x-3)**2,18);
for(const x of [3-Math.sqrt(7),3+Math.sqrt(7)])assert.ok(Math.abs(x*x-6*x+2)<1e-12);
for(const x of [(3-Math.sqrt(17))/4,(3+Math.sqrt(17))/4])assert.ok(Math.abs(2*x*x-3*x-1)<1e-12);
assert.equal(2**2-4*2+4,0);assert.ok(2**2-4*1*5<0);
assert.equal(Math.hypot(4-(-2),9-1),10);
assert.deepEqual([(-2+4)/2,(1+9)/2],[1,5]);
assert.deepEqual([(0+6)/2,(0+3)/2],[(4+2)/2,(0+3)/2]);
// Confirm the revised checks retain valid keys and test the promised methods.
const bankContext={window:{}};vm.createContext(bankContext);vm.runInContext(fs.readFileSync(`${root}/assets/question-bank.js`,'utf8'),bankContext);
const revised=bankContext.window.ALGEBRA1_QUESTIONS.filter(q=>q.unit===10&&[5,6].includes(q.lesson));
assert.equal(revised.length,10);assert.equal(new Set(revised.map(q=>q.prompt)).size,10);
for(const q of revised){assert.equal(q.answer_text,q.options[q.answer]);assert.equal(new Set(q.options).size,4)}
for(const x of [3,-5])assert.equal(3*(x+1)**2,48);
for(const x of [2-Math.sqrt(6),2+Math.sqrt(6)])assert.ok(Math.abs(x*x-4*x-2)<1e-12);
for(const x of [(3-Math.sqrt(13))/2,(3+Math.sqrt(13))/2])assert.ok(Math.abs(x*x-3*x-1)<1e-12);
assert.equal(5**2-4*2*(-3),49);assert.equal((-6)**2-4*9,0);assert.equal(4**2-4*8,-16);
class Node {
 constructor(tag='DIV'){this.tagName=tag;this.dataset={};this.attrs={};this.events={};this.children=[];this.value='';this.type='';this.textContent='';this.classList={add(){}};this.labels=[];}
 setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]??null}
 addEventListener(k,cb){(this.events[k]??=[]).push(cb)}
 fire(k){for(const cb of this.events[k]||[])cb({})}
 appendChild(n){this.children.push(n)}prepend(n){this.children.unshift(n)}append(...n){this.children.push(...n)}
 querySelector(s){return this.select?.(s)||null}querySelectorAll(s){return this.selectAll?.(s)||[]}
 closest(s){return this.closestNode?.(s)||null}after(n){this.sibling=n}focus(){}remove(){this.removed=true}
}
function fixture({lesson=lessons.find(l=>l.unit===10&&l.number===5),storage=new Map(),throwRead=false,throwWrite=false,locked=false,dedicated=false}={}){
 const main=new Node(),card=new Node(),learn=new Node(),grid=new Node(),exampleSection=new Node(),readerDetails=new Node('DETAILS');readerDetails.open=false;
 const notes=new Node('TEXTAREA');notes.value='';notes.id='notes';
 const reflection=new Node('TEXTAREA');reflection.id='reflection';reflection.setAttribute('aria-label','Reflection');
 const heading=new Node('H2');heading.textContent='Experiment';const activity=new Node();activity.select=s=>s==='h2,h3'?heading:null;
 notes.closestNode=()=>activity;
 const prompt=new Node('LEGEND');prompt.textContent='1. Choose a justified step.';const question=new Node();question.select=()=>prompt;
 const optionLabel=new Node('LABEL');optionLabel.textContent='Add the same quantity to both sides';
 const radio=new Node('INPUT');radio.type='radio';radio.name='q0';radio.value='0';radio.checked=false;radio.closestNode=s=>s==='.question'?question:optionLabel;
 const fields=[notes,reflection,radio];const reset=new Node('BUTTON');
 main.select=s=>s==='.concept-grid'?(dedicated?null:grid):s==='#reset,#resetButton'?reset:s==='.example-grid'?grid:null;
 main.selectAll=s=>s.startsWith('textarea,input')?fields:s==='article.card.full'?[learn]:[];
 const eyebrow=new Node();eyebrow.textContent='3 · Learn';learn.select=s=>s==='.eyebrow'?eyebrow:null;learn.selectAll=()=>locked?[]:[card];
 grid.closestNode=()=>exampleSection;
 const created=[];const document={readyState:'loading',body:new Node(),head:new Node(),addEventListener(){},createElement(tag){const n=new Node(tag.toUpperCase());if(tag==='section')n.selectAll=s=>s==='details'?[readerDetails]:[];created.push(n);return n;},getElementById(id){return id==='main'?main:created.find(n=>n.id===id)||null},querySelector(){return null},querySelectorAll(s){return s==='.concept-grid > .card'?(locked?[]:[card]):s==='article.card.full'?[learn]:[]}};
 document.body.dataset.lesson=String(lesson.number);
 const w={ALGEBRA1_DATA:{lessons:[lesson],units:[{number:lesson.unit}]},ALGEBRA1_QUESTIONS:[],PAGE_REF:{type:'lesson',unit:lesson.unit,lesson:lesson.number},events:{},addEventListener(k,cb){(this.events[k]??=[]).push(cb)}};
 if(dedicated){delete w.PAGE_REF;w[`KHAE_UNIT${String(lesson.unit).padStart(2,'0')}`]={unit:{number:lesson.unit},lessons:[lesson],questions:[]}}
 const localStorage={getItem(k){if(throwRead)throw Error('blocked');return storage.get(k)||null},setItem(k,v){if(throwWrite)throw Error('quota');storage.set(k,v)}};
 const callbacks=[];const c={window:w,document,location:{pathname:`/units/unit-${String(lesson.unit).padStart(2,'0')}/lessons/example.html`},localStorage,setTimeout(cb){callbacks.push(cb)},console};vm.createContext(c);vm.runInContext(source,c);w.KhaemenesAlgebra1LearningExperience.enhanceConcepts();
 return {main,fields,notes,reflection,radio,storage,created,reset,callbacks,w,readerDetails};
}
const a=fixture();const reader=a.created.find(n=>n.id==='lessonReading');assert.ok(reader.innerHTML.includes('Completing')||reader.innerHTML.includes('perfect square'));assert.ok(reader.innerHTML.includes('Add 9 to both sides'));assert.ok(reader.innerHTML.includes('Check your reasoning'));
a.notes.value='My unfinished explanation';a.reflection.value='Need to check the sign';a.radio.checked=true;a.main.fire('input');
assert.equal(a.storage.size,1);assert.ok([...a.storage.keys()][0].startsWith('khaemenes-algebra1-lesson-draft-v1:'));
assert.ok(a.created.find(n=>n.className==='lesson-draft-status').textContent.includes('does not submit'));
const b=fixture({storage:a.storage});assert.equal(b.notes.value,a.notes.value);assert.equal(b.reflection.value,a.reflection.value);assert.equal(b.radio.checked,true);
b.radio.checked=false;b.reset.fire('click');b.callbacks.forEach(cb=>cb());const after=fixture({storage:b.storage});assert.equal(after.radio.checked,false);assert.equal(after.notes.value,a.notes.value);
const failed=fixture({throwRead:true,throwWrite:true});failed.notes.value='Still editable';failed.main.fire('input');assert.equal(failed.notes.value,'Still editable');assert.ok(failed.created.find(n=>n.className==='lesson-draft-status').textContent.includes('could not be saved'));
const gate=fixture({locked:true});assert.ok(!gate.created.some(n=>n.id==='lessonReading'));assert.equal(gate.storage.size,0);
const dedicated=fixture({dedicated:true,lesson:{unit:2,number:1,title:'Expressions',concepts:['Read each term.'],objectives:['Explain structure.'],mystery:'Why?',mystery_answer:'Because.'}});assert.ok(dedicated.created.find(n=>n.id==='lessonReading').innerHTML.includes('shared study guide'));assert.ok(dedicated.notes.getAttribute('aria-label'));
a.w.events.beforeprint[0]();assert.equal(a.readerDetails.open,true);a.w.events.afterprint[0]();assert.equal(a.readerDetails.open,false);
// Draft identity follows question/option text even if options or question positions shuffle.
const api=a.w.KhaemenesAlgebra1LearningExperience;const before=api.draftFieldKey(a.radio,2);a.radio.name='q9';assert.equal(api.draftFieldKey(a.radio,5),before);
const family=new Map([['khaemenes_active_learner_v1',JSON.stringify('A')],['khaemenes_family_registry_v1',JSON.stringify({learners:{A:{learnerId:'A'},B:{learnerId:'B'}}})]]);
const studentA=fixture({storage:family});studentA.notes.value='A private notes';studentA.main.fire('input');
family.set('khaemenes_active_learner_v1',JSON.stringify('B'));
studentA.notes.value='Do not write A work into B';studentA.main.fire('input');assert.ok(studentA.created.find(n=>n.className==='lesson-draft-status').textContent.includes('learner changed'));
const studentB=fixture({storage:family});assert.equal(studentB.notes.value,'');studentB.notes.value='B notes';studentB.main.fire('input');
family.set('khaemenes_active_learner_v1',JSON.stringify('A'));assert.equal(fixture({storage:family}).notes.value,'A private notes');
console.log('PASS: priority example mathematics; inline reading; draft reload/reset/storage failure; locked-page protection; writing labels; print expansion; stable question identity.');

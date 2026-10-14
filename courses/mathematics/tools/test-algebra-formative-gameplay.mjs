/* Independent gameplay regression checks for five ungraded Algebra I learning games.
   Run: node courses/mathematics/tools/test-algebra-formative-gameplay.mjs
   No web browser, learner storage, external runtime, or official mastery updates. */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../assets/learning-games');
const entries=[
 ['algebra-reasoning-foundations',4],
 ['algebra-structure-balance-challenge',9],
 ['algebra-functions-systems-challenge',12],
 ['algebra-exponents-radicals-challenge',16],
 ['algebra-evidence-modelling-challenge',16]
];
let totalChecks=0;
for(const [slug,expected] of entries){
 const file=path.join(root,slug,'index.html'),html=fs.readFileSync(file,'utf8');
 const source=html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i)?.[1];
 assert.ok(source,slug+': script exists');
 assert.ok(fs.existsSync(path.join(root,slug,'README.md')),slug+': README exists');
 assert.ok(!/\b(?:localStorage|sessionStorage|indexedDB)\s*[.(]/.test(source),slug+': no learner storage');
 let inputs=[];
 class Element{
  constructor(tag='div'){this.tag=tag;this.children=[];this.listeners={};this.textContent='';this.disabled=false;this.value='';this.name='';this.checked=false}
  append(...nodes){this.children.push(...nodes);if(this===elements.options||this===elements.choices||this===elements.gameChoices)inputs=this.children.flatMap(c=>c.children.filter(x=>x.tag==='input'))}
  replaceChildren(...nodes){this.children=[];this.append(...nodes)}
  addEventListener(event,handler){this.listeners[event]=handler}
  click(){if(!this.disabled)this.listeners.click?.()}
 }
 const ids=['count','prompt','choices','feedback','check','next','restart','options','status','gameQuestion','gameChoices'];
 const elements=Object.fromEntries(ids.map(x=>[x,new Element()]));
 const document={
  getElementById(id){return elements[id]??null},
  createElement(tag){return new Element(tag)},
  createTextNode(text){const node=new Element('text');node.textContent=text;return node},
  querySelector(selector){return /input\[name=/.test(selector)?inputs.find(x=>x.checked&&!x.disabled):null},
  querySelectorAll(selector){return /input\[name=/.test(selector)?inputs:[]}
 };
 const context=vm.createContext({document,console});
 vm.runInContext(source,context,{filename:file,timeout:5000});
 const bank=vm.runInContext('typeof bank!=="undefined"?bank:tasks',context);
 assert.equal(bank.length,expected,slug+': question count');totalChecks++;
 const check=elements.check,next=elements.next,restart=elements.restart;
 assert.equal(next.disabled,true,slug+': cannot skip unanswered question');totalChecks++;
 // Unanswered check must preserve question state and provide guidance.
 check.click();assert.equal(next.disabled,true,slug+': unanswered check blocked');totalChecks++;
 assert.ok((elements.feedback.textContent||elements.status.textContent).length>0,slug+': unanswered feedback');totalChecks++;
 const first=bank[0],correctIndex=typeof first==='object'&&!Array.isArray(first)?first.correct:first[3];
 assert.ok(Number.isInteger(correctIndex),slug+': canonical correct answer defined');
 // Complete the entire round with mixed correct and wrong responses.
 for(let i=0;i<expected;i++){
  assert.equal(next.disabled,true,slug+': next gated on question '+i);
  assert.ok(inputs.length>=3,slug+': choices rendered on question '+i);
  const q=bank[i],key=Array.isArray(q)?q[3]:q.correct;
  const selected=i%2===0?key:(key+1)%inputs.length;
  inputs[selected].checked=true;
  check.click();
  assert.equal(check.disabled,true,slug+': score only once on question '+i);
  assert.equal(next.disabled,false,slug+': continue allowed after checked question '+i);
  assert.ok((elements.feedback.textContent||elements.status.textContent).length>=8,slug+': mathematical explanation '+i);
  next.click();totalChecks+=4;
 }
 assert.equal(check.disabled,true,slug+': complete cannot score again');totalChecks++;
 assert.equal(next.disabled,true,slug+': complete cannot go beyond bank');totalChecks++;
 restart.click();
 assert.equal(next.disabled,true,slug+': restart resets next gate');totalChecks++;
 assert.equal(check.disabled,false,slug+': restart returns to first question');totalChecks++;
 assert.ok(inputs.length>=3,slug+': restart repopulates choices');totalChecks++;
 console.log('PASS '+slug+': '+expected+' questions, mixed answers, gating, completion, restart.');
}
console.log('PASS formative gameplay: '+totalChecks+' behavioral assertions for '+entries.length+' games.');

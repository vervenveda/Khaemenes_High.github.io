import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const code=source.slice(source.indexOf('function recordError'),source.indexOf('function activeStudent'));
const valid={students:[{id:'A',name:'Learner',progress:{weeks:{1:{quiz:{best:0,attempts:[{score:0}]}}},exams:{}}}],activeId:'A'};
function setup(raw){
 let stored=raw,writes=0;const box={setAttribute(){}};
 const ctx=vm.createContext({document:{getElementById:()=>box,createElement:()=>box,body:{prepend(){}}},localStorage:{getItem:()=>stored,setItem:(k,v)=>{stored=v;writes++;}}});
 vm.runInContext('const STORAGE_KEY="test";let lastStoredState=null;let recordWritesBlocked=false;let state;',ctx);
 vm.runInContext(code,ctx);vm.runInContext('state=loadState()',ctx);
 return {ctx,raw:()=>stored,writes:()=>writes,change:v=>{stored=v;}};
}
for(const bad of ['{broken',JSON.stringify({students:[{id:'A',name:'Learner',progress:{weeks:[]}}]}),JSON.stringify({...valid,students:[valid.students[0],valid.students[0]]})]){
 const x=setup(bad);assert.equal(vm.runInContext('recordWritesBlocked',x.ctx),true);assert.throws(()=>vm.runInContext('saveState()',x.ctx));assert.equal(x.raw(),bad);assert.equal(x.writes(),0);
}
const x=setup(JSON.stringify(valid));vm.runInContext('saveState()',x.ctx);assert.equal(x.writes(),1);
x.change('other-tab-record');assert.throws(()=>vm.runInContext('saveState()',x.ctx));assert.equal(x.raw(),'other-tab-record');assert.equal(x.writes(),1);
const y=setup(JSON.stringify(valid));vm.runInContext('localStorage.setItem=()=>{throw Error("quota")}',y.ctx);assert.throws(()=>vm.runInContext('saveState()',y.ctx));assert.equal(vm.runInContext('recordWritesBlocked',y.ctx),true);
for(const script of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
console.log('PASS: corrupt and invalid records preserved; zero scores valid; stale-tab writes blocked; storage failure pauses editing; inline syntax valid');

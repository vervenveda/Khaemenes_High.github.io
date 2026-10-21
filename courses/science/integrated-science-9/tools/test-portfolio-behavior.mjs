import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const src=fs.readFileSync(new URL("../science-evidence-portfolio.js",import.meta.url),"utf8");
class Element{
 constructor(){this.textContent="";this.disabled=true;this.value="";this.files=[];this.children=[];this.listeners={};this.style={};}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(){this.children=[]}
 addEventListener(type,fn){this.listeners[type]=fn}
 async fire(type){return this.listeners[type]?.()}
}
function run(initial=[],learner="student01"){
 const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id)};
 const entries=new Map(initial),session={id:learner},events={},downloads=[];
 const localStorage={get length(){return entries.size},key(i){return [...entries.keys()][i]??null},getItem(k){return entries.get(k)??null},setItem(k,v){entries.set(k,v)}};
 const document={readyState:"complete",getElementById:get,createElement:()=>new Element(),addEventListener:(e,f)=>{events[e]=f},hidden:false};
 const window={addEventListener:(e,f)=>{events[e]=f},confirm:()=>true,print:()=>{}};
 const URLMock={createObjectURL:()=>"/download",revokeObjectURL:()=>{}};
 const context={document,window,localStorage,sessionStorage:{getItem:()=>session.id},URL:URLMock,Blob:class{},console,setTimeout:()=>{},Date};
 vm.runInNewContext(src,context);
 return {get,entries,session,events};
}
const key=(id,path)=>"kh_sci9_formative_v1:"+id+":"+path;
const paths=["units/unit-02/virtual-microscopy.html","units/unit-06/atomic-composition-lab.html","units/unit-09/circuit-data-lab.html","units/unit-12/decision-matrix-lab.html"];
const records=paths.map((activity,i)=>({activity,notes:"Evidence "+(i+1),observation:"Data "+(i+1),updatedAt:"2026-10-20T22:00:00.000Z"}));
const original=JSON.stringify({schema:"khaemenes-science-formative-v1",learner:"student01",...records[0]});
const env=run([[key("student01",paths[0]),original],[key("student02",paths[1]),JSON.stringify({schema:"khaemenes-science-formative-v1",learner:"student02",...records[1]})]]);
assert.match(env.get("portfolioStatus").textContent,/1 saved/);
const file={size:5000,text:async()=>JSON.stringify({schema:"khaemenes-science-formative-portfolio-v1",learner:"student01",records})};
env.get("portfolioImport").files=[file];
await env.get("portfolioImport").fire("change");
assert.match(env.get("portfolioPreview").textContent,/3 missing/);
await env.get("portfolioRestore").fire("click");
assert.match(env.get("portfolioPreview").textContent,/Restored 3/);
for(const p of paths)assert(env.entries.has(key("student01",p)),p);
assert.equal(env.entries.get(key("student01",paths[0])),original,"existing notes overwritten");
assert.equal(env.entries.get(key("student02",paths[1]))!==undefined,true,"other learner touched");
env.session.id="student02";env.events.focus();
assert.equal(env.get("portfolioRecords").children.length,0,"switched learner data visible");
assert.equal(env.get("portfolioImport").disabled,true,"switched learner can import");
const rejected=run();rejected.get("portfolioImport").files=[{size:100,text:async()=>JSON.stringify({schema:"khaemenes-science-formative-portfolio-v1",learner:"student02",records})}];
await rejected.get("portfolioImport").fire("change");
assert.match(rejected.get("portfolioPreview").textContent,/not accepted/);
assert.equal(rejected.entries.size,0,"wrong learner wrote a record");
console.log("PASS portfolio behavior: 4-unit restore, no overwrite, second learner isolation, switch clearing, wrong-learner rejection");

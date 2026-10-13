import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const sw=fs.readFileSync("service-worker.js","utf8");
const lesson=fs.readFileSync("courses/mathematics/algebra-2/assets/lesson-tools.js","utf8");
new vm.Script(sw);new vm.Script(lesson);
const host="https://academy.example/Khaemenes_High.github.io/";
function worker(){
 const handlers={};const contents=new Map();let installed;
 class Request {
  constructor(src,{mode="navigate",method="GET"}={}){
   this.url=new URL(typeof src==="string"?src:src.url,host).href;
   this.method=method;this.mode=mode;
  }
 }
 const canonical=x=>new URL(typeof x==="string"?x:x.url,host).href;
 const cache={
  async addAll(paths){for(const p of paths)contents.set(canonical(p),{url:canonical(p),kind:"precache"});},
  async add(path){contents.set(canonical(path),{url:canonical(path),kind:"precache"});},
  async match(path){return contents.get(canonical(path))||null;},
  async put(path,value){contents.set(canonical(path),value)}
 };
 const ctx=vm.createContext({URL,Request,Promise,console,self:{
  location:{origin:new URL(host).origin},
  addEventListener:(key,cb)=>handlers[key]=cb,
  skipWaiting:()=>Promise.resolve(),clients:{claim:()=>Promise.resolve()}
 },caches:{open:async()=>cache,keys:async()=>[],delete:async()=>true},
 fetch:async()=>{throw Error("offline");}});
 vm.runInContext(sw,ctx);
 return {
  handlers,contents,context:ctx,cache,
  async install(){handlers.install({waitUntil:promise=>installed=promise});await installed;},
  async navigate(path){
   let promise;const request=new Request(new URL(path,host).href);
   handlers.fetch({request,respondWith:p=>promise=p});
   assert.ok(promise,"navigation intercepted");return promise;
  }
 };
}
const w=worker();await w.install();
const courseNames=["pre-algebra","algebra-1","geometry","algebra-2"];
for(const course of courseNames){
 const start=host+"courses/mathematics/"+course+"/index.html";
 assert.ok(w.contents.has(start),"offline entrance installed for "+course);
 // An uncached lesson in any course must never fall back to Pre-Algebra.
 const found=await w.navigate("./courses/mathematics/"+course+"/units/unit-11/lessons/a-not-previously-visited.html");
 assert.ok(found?.url.includes("/courses/mathematics/"+course+"/"),"cross-course fallback detected for "+course);
 const choices=Array.from(vm.runInContext("fallbackFor(new URL("+JSON.stringify(new URL("./courses/mathematics/"+course+"/units/unit-11/lessons/missing.html",host).href)+"))",w.context));
 assert.deepEqual(choices.slice(0,2),[
  "./courses/mathematics/"+course+"/units/unit-11/index.html",
  "./courses/mathematics/"+course+"/index.html"
 ],"unit then correct course fallback for "+course);
}
for(const sample of ["algebra-2","geometry","algebra-1"]){
 const p="./courses/mathematics/"+sample+"/units/unit-11/index.html";
 assert.ok(!w.contents.has(new URL(p,host).href),"test begins with uncached "+sample+" unit");
 const result=await w.navigate("./courses/mathematics/"+sample+"/units/unit-11/lessons/unavailable.html");
 assert.equal(result.url,new URL("./courses/mathematics/"+sample+"/index.html",host).href,
  "correct mathematics home fallback "+sample);
 // When the unit is present, it takes priority over the course entrance.
 w.contents.set(new URL(p,host).href,{url:new URL(p,host).href});
 const withUnit=await w.navigate("./courses/mathematics/"+sample+"/units/unit-11/lessons/unavailable.html");
 assert.equal(withUnit.url,new URL(p,host).href,"cached unit preferred "+sample);
}
const pre=await w.navigate("./courses/mathematics/pre-algebra/units/unit-11/lessons/not-cached.html");
assert.equal(pre.url,new URL("./courses/mathematics/pre-algebra/units/unit-11/index.html",host).href,
 "existing Pre-Algebra unit cache preserved");
const noMath=Array.from(vm.runInContext("fallbackFor(new URL("+JSON.stringify(host+"courses/science/integrated-science-9/units/unit-11/lessons/missing.html")+"))",w.context));
assert.deepEqual(noMath,["./index.html"],"nonmathematics unit must not be redirected to Pre-Algebra");
const page9=await w.navigate("./grades/grade-09/not-previously-visited.html");
assert.equal(page9.url,host+"grades/grade-09/index.html","grade 9 fallback remains intact");
for(const rel of [
 "./courses/mathematics/algebra-2/diagnostic/unavailable.html",
 "./courses/mathematics/geometry/units/unit-10/lessons/unavailable.html",
 "./courses/mathematics/algebra-1/units/unit-02/lessons/unavailable.html"
]){
 const found=await w.navigate(rel);
 assert.ok(found&&found.url.includes("/courses/mathematics/"),"course fallback returns content "+rel);
}
assert.equal(new Set(Array.from(vm.runInContext("PRECACHE_FILES",w.context))).size,
 Array.from(vm.runInContext("PRECACHE_FILES",w.context)).length,"offline bundle stays duplicate-free");

// Lesson script failure simulation: existing content must never be removed.
function page({progression=null,currentScript=true}={}){
 const elements=new Map(),rootChildren=[],callbacks=new Map(),written=[];
 function el(id){
  if(elements.has(id))return elements.get(id);
  const item={id,disabled:false,checked:false,value:"draft remains",textContent:"",attrs:{},children:[],listeners:{},
   style:{cssText:""},addEventListener(k,fn){this.listeners[k]=fn;},
   setAttribute(k,v){this.attrs[k]=v;},
   append(...items){this.children.push(...items);},
   insertBefore(node,before){const index=this.children.indexOf(before);this.children.splice(index<0?0:index,0,node);},
   get firstChild(){return this.children[0]||null}};
  elements.set(id,item);return item;
 }
 const main=el("main");main.innerHTML="<section><h2>Original complete lesson</h2><p>Keep every worked example and practice question.</p></section>";
 const lessonBody=el("originalLesson");main.children=[lessonBody];
 const doc={
  body:{dataset:{lessonId:"u11-l08"}},
  currentScript:currentScript?{src:host+"courses/mathematics/algebra-2/assets/lesson-tools.js"}:null,
  getElementById:id=>id==="algebra2ProgressionRecovery" ? ([...elements.values()].find(item=>item.id===id)||null) : el(id),
  querySelector:q=>q==="main"?main:null,
  createElement:tag=>{const n=el("generated-"+elements.size);n.tagName=tag;return n;},
  head:{appendChild:n=>written.push(n)}
 };
 const window={KhaemenesAlgebra2Progression:progression};
 const location={reload:()=>callbacks.set("reload",true)};
 const ctx=vm.createContext({document:doc,window,URL,location,console,print:()=>callbacks.set("print",true),alert:()=>{}});
 return {doc,window,ctx,main,el,written,callbacks};
}
for(const outcome of ["download-error","silent-loader","missing-script"]){
 const p=page({currentScript:outcome!=="missing-script"});
 vm.runInContext(lesson,p.ctx);
 if(outcome==="download-error"){
  assert.equal(p.written.length,1);p.written[0].onerror();
 }else if(outcome==="silent-loader"){assert.equal(p.written.length,1);p.written[0].onload();}
 const message=p.doc.getElementById("algebra2ProgressionRecovery");
 assert.ok(p.main.children.includes(message),"warning inserted inside lesson "+outcome);
 assert.equal(message.attrs.role,"alert");
 assert.ok(message.children.some(c=>c.textContent?.includes("verification")),"read-only explanation");
 assert.ok(p.main.innerHTML.includes("Original complete lesson"),"lesson content retained "+outcome);
 assert.ok(p.main.children.includes(p.el("originalLesson")),"lesson DOM preserved "+outcome);
 for(const id of ["lessonComplete","lessonNote","saveLessonNote"]){
  assert.equal(p.el(id).disabled,true,"course record control disabled "+outcome);
  assert.equal(p.el(id).attrs["aria-disabled"],"true","accessibility state "+outcome);
 }
 assert.ok(p.el("lessonStatus").textContent.includes("read-only"));
 assert.equal(p.el("lessonNote").value,"draft remains","unsaved text not cleared");
 const retry=message.children.find(c=>c.tagName==="button");
 assert.ok(retry?.listeners.click,"retry button functional");
 retry.listeners.click();assert.equal(p.callbacks.get("reload"),true);
 p.el("printLesson").listeners.click();assert.equal(p.callbacks.get("print"),true);
 assert.equal(p.written.length,outcome==="missing-script"?0:1);
}
// Successful progression authority should retain regular save/mark behavior.
const source={
 readJSON:(key,fallback)=>({"u11-l08":{complete:true,note:"Existing record"}}),
 writeJSON:()=>true
};
const ok=page({progression:source});
vm.runInContext(lesson,ok.ctx);
assert.equal(ok.written.length,0,"no duplicate progression injection when loaded");
assert.equal(ok.el("lessonComplete").checked,true);
assert.equal(ok.el("lessonNote").value,"Existing record");
assert.ok(!ok.main.children.some(c=>c.id==="algebra2ProgressionRecovery"),"no false warning on success");
assert.ok(ok.el("printLesson").listeners.click,"normal print still active");
console.log("PASS: course-aware offline fallback across four math courses, unit precedence, Grade 9 isolation, fail-safe read-only lesson recovery, print/retry controls and normal progression behavior.");

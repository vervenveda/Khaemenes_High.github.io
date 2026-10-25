#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"courses/language-arts/assets/original-source-evidence-bridge-v1.js"),"utf8");
for(const grade of [9,10,11,12])for(let week=1;week<=8;week++){
 const filename=path.join(root,"courses/language-arts/english-"+grade,"weeks","week-"+String(week).padStart(2,"0"),"index.html");
 const html=fs.readFileSync(filename,"utf8");
 assert(html.includes('src="../../assets/original-source-evidence-bridge-v1.js"'),"Missing evidence bridge "+grade+"/"+week);
 assert(/id="academy-(original-source|week01-source)-studio"/.test(html),"Missing studio "+grade+"/"+week);
}
let active="fictional-A",calls={};
const storage=new Map();
function mount(grade,week,withLearner=true){
 const section={dataset:{academyGrade:String(grade),academyWeek:String(week)},children:[],querySelector:()=>({textContent:"Original reading"}),appendChild(el){this.children.push(el)}};
 const listeners={};
 function node(tag){return {tag,style:{},children:[],disabled:false,value:"",textContent:"",setAttribute(){},append(...args){this.children.push(...args)},appendChild(x){this.children.push(x)},remove(){},addEventListener(ev,fn){this["on"+ev]=fn}}}
 const document={querySelector:()=>section,createElement:node};
 const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v))};
 const window={KhaemenesCourseEntryContract:{readAcademyProfile:()=>withLearner?{learnerId:active}:null},addEventListener:(name,fn)=>{listeners[name]=fn},print:()=>{calls.print=(calls.print||0)+1}};
 const ctx={window,document,localStorage,location:{pathname:"/courses/language-arts/english-"+grade+"/weeks/week-"+String(week).padStart(2,"0")+"/index.html"},console};
 vm.runInNewContext(source,ctx,{filename:"bridge"});
 const bridge=section.children[0];const field=bridge.children[2],button=bridge.children[4];return {field,button,listeners};
}
const a=mount(10,5);a.field.value="fictional-A academic evidence";a.field.oninput();
assert([...storage.values()].includes("fictional-A academic evidence"));
active="fictional-B";a.field.value="cross-learner write";a.field.oninput();assert.equal(a.field.disabled,true);
const b=mount(10,5);assert.equal(b.field.value,"");b.field.value="fictional-B response";b.field.oninput();
active="fictional-A";const again=mount(10,5);assert.equal(again.field.value,"fictional-A academic evidence");
const distinctWeek=mount(10,6);assert.equal(distinctWeek.field.value,"");
const noLearner=mount(9,1,false);assert.equal(noLearner.field.disabled,true);
assert.equal(storage.size,2);
console.log("PASS 32 Grade 9–12 studio routes, fictional A/B draft separation, reload, week partition and no-learner lock");

#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
for(const week of [1,3,5,10,15,20,25,32]){
 const file=path.join(root,"courses/science/chemistry-11/weeks/week-"+String(week).padStart(2,"0")+"/index.html");
 const html=fs.readFileSync(file,"utf8");
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(x=>x.includes("data-evidence-key"));
 assert.equal(scripts.length,1,"Expected one inline journal handler Week "+week);
 const key="sci-chemistry-11-w"+String(week).padStart(2,"0")+"-thursday";
 const memory=new Map();
 const store={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v))};
 function mount(){
  const field={dataset:{evidenceKey:key},value:"",addEventListener:(name,fn)=>{assert.equal(name,"input");field.input=fn;}};
  const ctx={document:{querySelectorAll:()=>[field]},localStorage:store};
  vm.runInNewContext(scripts[0],ctx,{filename:"journal-week-"+week});
  return field;
 }
 const first=mount();assert.equal(first.value,"");
 first.value="fictional evidence week "+week;first.input();
 const reloaded=mount();assert.equal(reloaded.value,first.value,"Week "+week+" lost saved content on reload");
 assert.equal(memory.size,1,"Unexpected extra storage writes Week "+week);
}
console.log("PASS Chemistry 11 anchor journals save and restore fictional Thursday notes under unchanged local keys");
console.log("NOT CERTIFIED: learner isolation or authenticated evidence storage.");

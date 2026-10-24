#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),dir=path.join(root,"courses/science/chemistry-11");
const page=fs.readFileSync(path.join(dir,"inquiry-ledger.html"),"utf8");
const src=fs.readFileSync(path.join(dir,"inquiry-ledger.js"),"utf8");
assert(page.includes('data-learner-scope="chemistry-11"'));
assert(page.includes('src="inquiry-ledger.js"'));
const memory=new Map();
let active="fictional-A";
function mount(){
 const listeners={};const ids=new Map();
 function node(){return {value:"",checked:false,hidden:false,textContent:"",children:[],appendChild(x){this.children.push(x)},addEventListener(k,f){listeners[k]=f}}}
 for(const id of ["ledger","status","total","records","week","day","minutes","inquiry","evidence"])ids.set(id,node());
 const doc={getElementById:id=>ids.get(id),createElement:()=>node()};
 const storage={getItem:k=>memory.get(active+"|"+k)??null,setItem:(k,v)=>memory.set(active+"|"+k,String(v))};
 const context={window:{KhaemenesCourseEntryContract:{readAcademyProfile:()=>({learnerId:active})},KhaemenesLearnerScope:{course:"chemistry-11"},addEventListener:()=>{}},document:doc,localStorage:storage,Date,Number,Math,JSON,Object};
 vm.runInNewContext(src,context);
 return context.window.KhaeInquiryLedger;
}
const a=mount();
assert.equal(a.append({week:1,day:"Thursday",minutes:90,inquiry:true,evidence:"fictional measurement table"}),true);
assert.equal(a.append({week:1,day:"Friday",minutes:30,inquiry:false,evidence:"fictional reading"}),true);
assert.equal(a.totals(a.read()).percent,75);
active="fictional-B";
assert.equal(a.canUse(),false);
assert.equal(a.append({week:1,day:"Thursday",minutes:20,inquiry:true,evidence:"wrong learner"}),false);
const b=mount();assert.equal(b.read().length,0);
assert.equal(b.append({week:3,day:"Thursday",minutes:40,inquiry:true,evidence:"fictional isotope data"}),true);
active="fictional-A";
const again=mount();assert.equal(again.read().length,2);
assert.equal(again.totals(again.read()).all,120);
assert.equal(memory.size,2);
console.log("PASS Chemistry 11 fictional two-learner inquiry ledger: A/B separation, reload, mid-session switch denied, 75% calculation");
console.log("Mocked learner-scoped storage only: this is not authenticated profile authorization or browser certification.");

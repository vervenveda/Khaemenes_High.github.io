#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),dir=path.join(root,"courses/science/chemistry-11");
const page=fs.readFileSync(path.join(dir,"inquiry-ledger.html"),"utf8");
const src=fs.readFileSync(path.join(dir,"inquiry-ledger.js"),"utf8");
assert(page.includes('data-learner-scope="chemistry-11"'));
assert(page.includes('src="inquiry-ledger.js"'));
assert(page.includes('id="printReview"'));
assert(page.includes('Formal electronic review requires authenticated educator authority.'));
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
assert.equal(a.append({week:37,day:"Monday",minutes:20,inquiry:true,evidence:"invalid week"}),false);
assert.equal(a.append({week:1,day:"Sunday",minutes:20,inquiry:true,evidence:"invalid weekday"}),false);
assert.equal(a.append({week:1,day:"Monday",minutes:-4,inquiry:true,evidence:"invalid minutes"}),false);
assert.equal(a.append({week:1,day:"Monday",minutes:5,inquiry:true,evidence:""}),false);
assert.equal(a.totals([{minutes:90,inquiry:true},{minutes:-500,inquiry:true}]).all,90);
active="fictional-B";
assert.equal(a.canUse(),false);
assert.equal(a.append({week:1,day:"Thursday",minutes:20,inquiry:true,evidence:"wrong learner"}),false);
const b=mount();assert.equal(b.read().length,0);
assert.equal(b.append({week:3,day:"Thursday",minutes:40,inquiry:true,evidence:"fictional isotope data"}),true);
active="fictional-A";
const again=mount();assert.equal(again.read().length,2);
assert.equal(again.totals(again.read()).all,120);
assert.equal(memory.size,2);
const original=memory.get("fictional-A|khaemenes-chemistry-11-v1:inquiry-ledger");
memory.set("fictional-A|khaemenes-chemistry-11-v1:inquiry-ledger","{broken json");
const damaged=mount();
assert.equal(damaged.load().ok,false);
assert.equal(damaged.append({week:2,day:"Monday",minutes:30,inquiry:true,evidence:"must not overwrite damaged work"}),false);
assert.equal(memory.get("fictional-A|khaemenes-chemistry-11-v1:inquiry-ledger"),"{broken json");
memory.set("fictional-A|khaemenes-chemistry-11-v1:inquiry-ledger",original);
const preserved=mount();
assert.equal(preserved.read().length,2,"Restored fictional learner A record differs");
assert.equal(preserved.append({week:2,day:"Monday",minutes:30,inquiry:"true",evidence:"invalid type"}),false);

console.log("PASS Chemistry 11 fictional two-learner inquiry ledger: A/B separation, reload, mid-session switch denied, 75% calculation");
console.log("Mocked learner-scoped storage only: this is not authenticated profile authorization or browser certification.");

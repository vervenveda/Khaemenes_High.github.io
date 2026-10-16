import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const code=fs.readFileSync(path.join(base,"assets/week01-studios.js"),"utf8");
class El{
 constructor(){this.value="";this.textContent="";this.hidden=true;this.disabled=false;this.checked=false;this.events=new Map();this.children=[];this.dataset={};}
 addEventListener(t,fn){const a=this.events.get(t)||[];a.push(fn);this.events.set(t,a);}
 emit(t){for(const fn of this.events.get(t)||[])fn({type:t,preventDefault(){}});}
 append(...x){this.children.push(...x);}
 appendChild(x){this.children.push(x);return x;}
 setAttribute(){}remove(){}click(){}
 querySelector(selector){return this.query?.(selector)||null}
}
function boot(day,profile="A",record){
 const state=record||{days:{},quiz:{best:0,attempts:[]},notes:{},studios:{}};
 const map=new Map(),el=id=>{if(!map.has(id))map.set(id,new El());return map.get(id);};
 const selections=[];
 const form=el("ela10-w01-quiz");
 form.query=selector=>{
  if(selector==='button[type="submit"]')return el("submit-button");
  const m=selector.match(/input\[name="studio-([a-z]+)-(\d+)"\]:checked/);
  return m&&selections[Number(m[2])]!==undefined?{value:String(selections[Number(m[2])])}:null;
 };
 const html=fs.readFileSync(path.join(base,"weeks/week-01/"+(day||"index")+(day?"/index.html":".html")),"utf8");
 const bank=day?JSON.parse(html.match(/id="ela10-w01-bank">([\s\S]*?)<\/script>/)[1]):null;
 if(bank)el("ela10-w01-bank").textContent=JSON.stringify(bank);
 el("ela10-w01-evidence").value="";el("ela10-w01-next").hidden=true;el("ela10-w01-week-next").hidden=true;
 const bridge={read:()=>JSON.parse(JSON.stringify(state)),commit:next=>{Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,JSON.parse(JSON.stringify(next)));return true;},
  score:()=>state.quiz?.best||null};
 const doc={body:{dataset:{english10Week01Day:day||""},appendChild(){}},getElementById:el,
  querySelector:sel=>{
   if(sel==='[data-quiz-form]')return el("weekly-form");
   const m=sel.match(/data-progress-key="week-01"/);
   if(m)return el("master");
   if(sel.startsWith('[data-english10-day-state='))return el("day-"+sel);
   if(sel.startsWith('[data-week-day='))return el("daily-checkbox");
   return null;
  },
  createElement:()=>new El(),createTextNode:t=>({textContent:t})};
 const win={KhaemenesEnglish10Week01Bridge:bridge,
  KhaemenesCourseEntryContract:{readAcademyProfile:()=>profile?{learnerId:profile}:null},addEventListener(){}};
 const ctx={window:win,document:doc,Date,JSON,Number,Math,console,Blob,
  setTimeout(){},URL:{createObjectURL(){return"blob:test";},revokeObjectURL(){} }};
 vm.createContext(ctx);vm.runInContext(code,ctx);
 return {state,el,bank,selections,form};
}
const a=boot("Monday");
assert.equal(a.el("ela10-w01-next").hidden,true);
a.bank.forEach((q,i)=>a.selections[i]=i===0?(q.answer+1)%3:q.answer);
a.form.emit("submit");
assert.equal(a.state.studios.monday.best,80);
assert.equal(a.el("ela10-w01-next").hidden,false,"4/5 reveals next lesson");
assert.equal(a.state.days.Monday,undefined,"Quiz score does not pretend writing was completed");
a.el("ela10-w01-evidence").value="I observed the limits of Nadia's first broad claim and explained how the interviews support a revised conclusion.";
a.el("ela10-w01-evidence").emit("input");
a.el("ela10-w01-prepared").emit("click");
assert.equal(a.state.days.Monday,true,"Evidence prepared after practice and independent writing");
assert.equal(boot("Monday","A",a.state).el("ela10-w01-next").hidden,false,"Mastery persists");
assert.equal(boot("Monday","B").el("ela10-w01-next").hidden,true,"Different learner is independent");
const hub=boot("", "A", {days:{Monday:true,Tuesday:true,Wednesday:true,Thursday:true,Friday:true},
 quiz:{best:60,attempts:[{score:60}]},notes:{},studios:{}});
assert.equal(hub.el("ela10-w01-week-next").hidden,true,"Weekly quiz under 80 blocks Week 2");
const legacy=boot("", "A", {days:{Monday:true,Tuesday:true,Wednesday:true,Thursday:true,Friday:true},
 quiz:{best:80,attempts:[{score:80}]},notes:{},studios:{}});
assert.equal(legacy.el("ela10-w01-week-next").hidden,false,"Legacy completed records remain recognized");
console.log("PASS English10 Week01 behavior: 80% lesson unlock, writing-evidence guard, persistence, learner isolation, weekly quiz gate, legacy recognition.");

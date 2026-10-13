import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";

const root="courses/mathematics/pre-algebra/units/";
const pad=n=>String(n).padStart(2,"0");
const lessonData=(html,file)=>{
 const match=/window\.LESSON_DATA\s*=\s*/.exec(html);
 assert.ok(match,file+" has embedded lesson data");
 const start=html.indexOf("{",match.index+match[0].length);
 let level=0,inside=false,slash=false;
 for(let i=start;i<html.length;i++){
  const c=html[i];
  if(inside){if(slash)slash=false;else if(c==="\\")slash=true;else if(c==='"')inside=false;continue;}
  if(c==='"'){inside=true;continue;}
  if(c==="{")level++;
  if(c==="}"&&--level===0)return JSON.parse(html.slice(start,i+1));
 }
 throw Error("Missing lesson JSON closing brace: "+file);
};
const banks=[],patterns=new Map();
let totalQuestions=0;
for(let unit=1;unit<=13;unit++){
 const base=root+"unit-"+pad(unit)+"/";
 const files=fs.readdirSync(base+"lessons").filter(f=>/^lesson-\d{2}-.*\.html$/.test(f));
 const core=fs.readFileSync(base+"assets/lesson-engine-core.js","utf8");
 new vm.Script(core);
 assert.ok(core.includes("const QUESTION_ORDERS="),"Unit "+unit+" randomized render");
 assert.ok(core.includes("Number(selected.value)"),"Unit "+unit+" unchanged scoring");
 for(const name of files){
  const file=base+"lessons/"+name,bank=lessonData(fs.readFileSync(file,"utf8"),file);
  assert.ok(Array.isArray(bank.questions)&&bank.questions.length,"Question bank "+file);
  for(const [i,q] of bank.questions.entries()){
   assert.equal(q.options?.length,4,"Four options "+file+" #"+i);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,"Key "+file+" #"+i);
   assert.ok(String(q.options[q.answer]).trim(),"Nonblank correct choice "+file+" #"+i);
   assert.ok(String(q.explanation||"").trim(),"Explanation "+file+" #"+i);
  }
  totalQuestions+=bank.questions.length;
  const pattern=bank.questions.map(q=>q.answer).join("");
  patterns.set(pattern,(patterns.get(pattern)||0)+1);
  banks.push({file,bank,core,unit});
 }
}
assert.equal(banks.length,97,"Full 97-lesson sweep Units 01–13");
assert.ok(Math.max(...patterns.values())>20,"Audit keeps recognizing authored-position repetition");
const unit00=fs.readdirSync(root+"unit-00/lessons").filter(f=>f.endsWith(".html"));
assert.equal(unit00.length,6,"Unit 00 six refresher lessons");
const numeric=fs.readFileSync(root+"unit-00/assets/refresher-engine.js","utf8");
assert.ok(numeric.includes('inputmode="decimal"'),"Refresher uses numerical inputs and needs no choice shuffle");

function run({bank,core,unit},rng,stored=null,submit=false){
 const host={innerHTML:""},quick={innerHTML:""},score={textContent:""},callbacks={};
 const saved=new Map(stored?Object.entries(stored):[]);
 const key="audit-prealgebra-unit-"+pad(unit);
 const localStorage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,String(v))};
 const responses={};
 const document={
  documentElement:{dataset:{}},body:{appendChild(){}},
  querySelector(s){
   if(s==="#questionList")return host;
   if(s==="#quickCheckList")return quick;
   if(s==="#masteryModal")return {hidden:true};
   if(s==="#scoreMessage")return score;
   if(s==="#submitPractice")return submit?{addEventListener:(event,fn)=>{callbacks[event]=fn}}:null;
   const f=/^#feedback-(\d+)$/.exec(s);
   if(f)return {hidden:true,className:"",textContent:""};
   const ans=/^input\[name="q(\d+)"\]:checked$/.exec(s);
   if(ans)return responses[+ans[1]]===undefined?null:{value:String(responses[+ans[1]])};
   return null;
  },
  querySelectorAll:()=>[],addEventListener(){},
  createElement:()=>({firstElementChild:{}})
 };
 const map={unit:{id:"unit-"+pad(unit),number:unit,progress_key:key,mastery_threshold:80},
   lessons:[{id:bank.id,file:"lessons/lesson-01.html"}]};
 const randomMath=Object.create(Math);randomMath.random=()=>rng;
 const win={LESSON_DATA:bank,UNIT_MAP_FALLBACK:map,VOCAB_FALLBACK:{},
  matchMedia:()=>({matches:false}),location:{pathname:"/unit-"+pad(unit)+"/"},print(){}};
 const ctx={window:win,document,localStorage,matchMedia:()=>({matches:false}),
  Math:randomMath,Date,URL,setTimeout:()=>0,location:{href:"https://example.test/"},console};
 vm.runInNewContext(core,ctx,{timeout:3000});
 const orders=Array.from({length:bank.questions.length},()=>[]);
 for(const m of host.innerHTML.matchAll(/name="q(\d+)" value="(\d+)"/g))orders[+m[1]].push(+m[2]);
 orders.forEach((indices,i)=>{
  assert.deepEqual([...indices].sort(),[0,1,2,3],"Original IDs retained "+bank.id+" #"+i);
 });
 return {orders,quick:quick.innerHTML,host:host.innerHTML,responses,callbacks,saved,key,score};
}
let varied=0,checkedChoices=0;
for(const entry of banks){
 const one=run(entry,.125),two=run(entry,.814);
 assert.ok(one.orders.some((items,i)=>items.some((v,j)=>v!==j)),"Do not show original pattern: "+entry.file);
 assert.ok(one.orders.some((items,i)=>items.some((v,j)=>v!==two.orders[i][j])),
  "Reload must change order: "+entry.file);
 for(let i=0;i<entry.bank.questions.length;i++){
  assert.ok(one.orders[i].includes(entry.bank.questions[i].answer),"Key survives shuffle");
  checkedChoices++;
 }
 varied++;
}
const u1=banks.find(x=>x.unit===1),draft={practiceDrafts:{},lessonScores:{},completedLessons:[]};
draft.practiceDrafts[u1.bank.id]={"0":u1.bank.questions[0].answer};
draft.lessonScores[u1.bank.id]=80;draft.completedLessons=[u1.bank.id];
const u1key="audit-prealgebra-unit-01";
const resumed=run(u1,.72,{[u1key]:JSON.stringify(draft)});
assert.ok(resumed.host.includes('value="'+u1.bank.questions[0].answer+'" checked'),
 "Saved Unit 01 choice restores by original answer value");
assert.equal(JSON.parse(resumed.saved.get(u1key)).lessonScores[u1.bank.id],80);
assert.ok(resumed.quick.includes('name="quick0"'),"Unit 01 quick-check choices are still shown");
const s=banks.find(x=>x.unit===8);
const scored=run(s,.812,{},true);
s.bank.questions.forEach((q,i)=>scored.responses[i]=q.answer);
assert.ok(scored.callbacks.click,"Lesson submit remains wired");
scored.callbacks.click();
const grade=JSON.parse(scored.saved.get(scored.key));
assert.equal(grade.lessonScores[s.bank.id],100,"Correct answers still score 100%");
assert.ok(grade.lessonBestScores[s.bank.id]>=80,"80% unlock remains effective");
console.log("PASS Pre-Algebra answer integrity: "+varied+" official lesson engines, "+
 totalQuestions+" keyed answers, "+checkedChoices+" visual answer choices, "+
 unit00.length+" numeric refresher lessons, original-ID draft compatibility, and mastery scoring.");

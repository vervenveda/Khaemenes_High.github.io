"use strict";
/* Run with Node: node --test courses/tests/english9-evaluator-callback-recovery.test.cjs
 * Actual production handler bodies run inside isolated synthetic controls and state.
 * No learner data or live network access is used.
 */
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..","language-arts","english-9","assets");
const cases=[
 {week:"03",file:"week03-daily.js",button:"week3-finish",day:15,status:"week3-assessment-status",receiptKey:"receipt"},
 {week:"04",file:"week04-assessment.js",button:"week4-submit",day:20,status:"week4-submission-status",receiptKey:"submission"},
 {week:"12",file:"week12-assessment.js",button:"week12-submit",day:60,status:"week12-submission-status",receiptKey:"submission"},
 {week:"13",file:"week13-assessment.js",button:"week13-submit",day:65,status:"week13-submission-status",receiptKey:"submission"}
];
function handlerSource(file,button){
 const source=fs.readFileSync(path.join(root,file),"utf8");
 const prefix='$("'+button+'").addEventListener("click",()=>{';
 const start=source.indexOf(prefix);
 assert.notEqual(start,-1,"Missing "+button);
 const end=source.indexOf("\n });",start); // Week 03 handler ends without semicolon
 const endWithSemi=source.indexOf("\n});",start);
 const finish=end>=0&&(endWithSemi<0||end<endWithSemi)?end+4:endWithSemi+4;
 assert.ok(finish>start,"Handler boundary missing");
 return source.slice(start,finish);
}
for(const c of cases){
 test("English 9 Week "+c.week+": partial-save retry preserves the submission",()=>{
  const raw=handlerSource(c.file,c.button);
  let click,progressFailure=true,receipt=null,submissionWrites=0;
  const records=new Map(),controls={};
  const $=id=>controls[id]||(controls[id]={
   textContent:"",
   addEventListener:(type,callback)=>{if(id===c.button&&type==="click")click=callback}
  });
  const ctx={
   $,ready:true,frozen:false,prepared:()=>true,evidenceReady:()=>true,
   eligibleToSubmit:()=>true,evaluatorPassed:()=>false,
   consistent:()=>receipt!==null,matches:()=>receipt!==null,match:()=>receipt!==null,
   reviewContract:{validateSubmission:v=>!!v?.submittedAt},
   profile:{learnerId:"synthetic-learner"},locked:{wordCount:500},
   final:{value:"synthetic final"},draft:{value:"synthetic draft"},
   field:{translation:{value:"synthetic"},reflection:{value:"synthetic"},sourceMode:{value:"simulation"}},
   f:{analysis:{value:"synthetic"},reflection:{value:"synthetic"}},
   fields:()=>({draft:"draft",final:"final",pattern:"pattern",reflection:"reflection"}),
   materials:()=>({writing:"unchanged"}),count:()=>300,wc:()=>300,countWords:()=>500,
   conventionsCount:()=>10,hash:s=>"hash-"+s,
   W:{progress:{},progressKey:"progress",flag:n=>"day"+n},
   progress:{},progressKey:"progress",receiptKey:"receipt",dayFlag:"day15",
   key:"submission",subKey:"submission",receipt:null,
   sync(){if(c.week==="12")$("week12-submission-status").textContent="Synced"},
   update(){},updateIndex(){},
   write(k,v){
    if(k==="progress"&&progressFailure)return false;
    records.set(k,v);
    if(k===c.receiptKey){submissionWrites++;receipt=JSON.parse(v);ctx.receipt=receipt}
    return true;
   },
   JSON,Date,Object
  };
  new Function("ctx","with(ctx){"+raw+"}")(ctx);
  assert.equal(typeof click,"function");
  click();
  assert.equal(records.has(c.receiptKey),true);
  assert.equal(records.has("progress"),false);
  assert.match($(c.status).textContent,/completion marker|completion is not yet confirmed/i);
  const first=records.get(c.receiptKey),originalTime=JSON.parse(first).submittedAt;
  progressFailure=false;
  click();
  assert.equal(records.get(c.receiptKey),first);
  assert.equal(JSON.parse(records.get(c.receiptKey)).submittedAt,originalTime);
  assert.equal(submissionWrites,1);
  assert.equal(JSON.parse(records.get("progress"))["day"+c.day],true);
 });
}

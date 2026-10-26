#!/usr/bin/env node
// Real Chromium Unit 01 launch audit: six lessons, fictional isolated learner only.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import vm from "node:vm";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../../../..");
const unit="courses/mathematics/algebra-1/units/unit-01";
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,unit,"assets/unit01-data.js"),"utf8"),sandbox);
const D=sandbox.window.KHAE_UNIT01;
assert.equal(D.lessons.length,6);
assert.equal(D.questions.length,60);
for(const l of D.lessons){
 assert(l.objectives.length>=4&&l.concepts.length>=4);
 assert.equal(D.questions.filter(q=>q.lesson===l.number).length,10);
 assert(fs.existsSync(path.join(root,unit,"lessons",l.file)),l.file+" missing");
}
const server=http.createServer((req,res)=>{
 try{
  const p=path.resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
  if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()){
    res.writeHead(404);res.end();return;
  }
  const mime=p.endsWith(".js")?"application/javascript":p.endsWith(".css")?"text/css":p.endsWith(".html")?"text/html":"text/plain";
  res.writeHead(200,{"content-type":mime+"; charset=utf-8","cache-control":"no-store"});
  fs.createReadStream(p).pipe(res);
 }catch{res.writeHead(400);res.end()}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const origin="http://127.0.0.1:"+server.address().port;
let browser;
try{
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 for(const lesson of D.lessons){
  const context=await browser.newContext({viewport:{width:1200,height:820},serviceWorkers:"block"});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.addInitScript(()=>{
   const id="fictional-unit01-regression";
   localStorage.setItem("khaemenes_active_learner_v1",JSON.stringify(id));
   localStorage.setItem("khaemenes_family_registry_v1",JSON.stringify({learners:{[id]:{learnerId:id,nickname:"Test Learner"}}}));
   const best={};for(let n=1;n<=6;n++)best["lesson-"+n]=100;
   localStorage.setItem("khaemenes-algebra1-unit01-a3-v1:learner:"+id,JSON.stringify({attempts:[],best}));
   localStorage.setItem("khaemenes-algebra1-weekly-mastery-v2:learner:"+id,JSON.stringify({weeks:{"2":{best:100},"3":{best:100}}}));
  });
  await page.route("**/*",route=>route.request().url().startsWith(origin)?route.continue():route.abort());
  await page.goto(origin+"/"+unit+"/lessons/"+lesson.file,{waitUntil:"domcontentloaded",timeout:15000});
  await page.waitForFunction(()=>["ready","error"].includes(document.body.dataset.algebra1LessonRender||""),{timeout:12000});
  const got=await page.evaluate(()=>{
   const main=document.getElementById("main");
   return {status:document.body.dataset.algebra1LessonRender,
    h1:main?.querySelector("h1")?.textContent.trim(),text:main?.innerText.length||0,
    visible:!!main&&getComputedStyle(main).display!=="none"&&main.getBoundingClientRect().height>0,
    heads:[...main.querySelectorAll("h2")].map(h=>h.textContent.trim()),
    questions:main.querySelectorAll(".question").length,submit:!!main.querySelector("#score"),
    overlay:document.getElementById("vnvEcosystemMenuOverlay")?.dataset.open==="true"};
  });
  assert.equal(got.status,"ready",JSON.stringify({lesson:lesson.number,got,errors}));
  assert(got.visible&&got.text>1000,"Lesson "+lesson.number+" missing/invisible "+JSON.stringify(got));
  assert(got.h1.includes(lesson.title),"Lesson "+lesson.number+" title missing");
  for(const required of ["Notice before naming","What structure do you notice?","Objectives","Algebra Lab","Wrong Answer Museum","Arch's Scratchpad","Lesson Check"])
   assert(got.heads.includes(required),"Lesson "+lesson.number+" missing "+required);
  assert(got.submit&&got.questions>=10,"Lesson "+lesson.number+" assessment missing");
  assert(!got.overlay,"Unexpected ecosystem overlay over lesson "+lesson.number);
  console.log("PASS Unit 01 Lesson "+lesson.number+": "+lesson.title+" ("+got.questions+" questions)");
  await context.close();
 }
 console.log("PASS all six complete lessons; real Chromium with isolated fictional data. No production records accessed.");
}finally{await browser?.close();await new Promise(done=>server.close(done))}

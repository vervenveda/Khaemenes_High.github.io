#!/usr/bin/env node
import {createServer} from "node:http";
import {readFile,stat} from "node:fs/promises";
import {extname,join,normalize} from "node:path";
import {chromium} from "playwright";

const root=process.cwd();
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".webmanifest":"application/manifest+json"};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,"http://127.0.0.1");
    let rel=decodeURIComponent(url.pathname).replace(/^\/+/, "");
    if(!rel)rel="index.html";
    let file=normalize(join(root,rel));
    if(!file.startsWith(root)){res.writeHead(403);return res.end("forbidden");}
    try{if((await stat(file)).isDirectory())file=join(file,"index.html");}catch{}
    const body=await readFile(file);
    res.writeHead(200,{"content-type":mime[extname(file).toLowerCase()]||"application/octet-stream","cache-control":"no-store","service-worker-allowed":"/"});
    res.end(body);
  }catch{res.writeHead(404);res.end("not found");}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const {port}=server.address();
const base=`http://127.0.0.1:${port}/courses/electives/career-professional-studies/`;

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({acceptDownloads:true});
const failures=[];
const page=await context.newPage();
const pageErrors=[];
page.on("pageerror",err=>pageErrors.push(err.message));

await page.goto(base,{waitUntil:"domcontentloaded"});
await page.waitForLoadState("load");
await page.waitForFunction(async()=>!!(await navigator.serviceWorker.getRegistration()));
const registration=await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();return r?{scope:r.scope,active:!!r.active}:null});
if(!registration||!registration.scope.includes("/courses/electives/career-professional-studies/"))failures.push("Course service worker was not registered at course scope");

for(let week=1;week<=13;week++){
  for(let day=1;day<=5;day++){
    const path=`lessons/week-${String(week).padStart(2,"0")}/day-${String(day).padStart(2,"0")}.html`;
    const response=await page.goto(base+path,{waitUntil:"domcontentloaded",timeout:30000});
    if(!response||response.status()!==200){failures.push("HTTP failure "+path);continue}
    if(await page.locator("main").count()!==1)failures.push("Missing main landmark "+path);
    if(await page.locator("[data-career-draft]").count()<4)failures.push("Insufficient learner evidence fields "+path);
    if(!(await page.locator("body").getAttribute("data-lesson-id")))failures.push("Missing lesson identity "+path);
  }
}

await page.goto(base+"lessons/week-01/day-01.html",{waitUntil:"domcontentloaded"});
await page.evaluate(()=>{
  localStorage.setItem("khaemenes_family_registry_v1",JSON.stringify({learners:{careerTest:{learnerId:"careerTest"}}}));
  localStorage.setItem("khaemenes_active_learner_v1",JSON.stringify("careerTest"));
});
await page.reload({waitUntil:"domcontentloaded"});
const firstDraft=page.locator("[data-career-draft]").first();
await firstDraft.fill("Learner-scoped Career runtime evidence");
await page.waitForFunction(()=>Object.keys(localStorage).some(k=>k.includes("khae-career-v1:careerTest:w01-d01")));
await page.reload({waitUntil:"domcontentloaded"});
if(await firstDraft.inputValue()!=="Learner-scoped Career runtime evidence")failures.push("Learner-scoped draft did not restore after reload");
withDownload: {
  try{
    const [download]=await Promise.all([
      page.waitForEvent("download",{timeout:10000}),
      page.locator("[data-export]").click()
    ]);
    if(!download.suggestedFilename().endsWith(".json"))failures.push("Lesson export did not create JSON");
  }catch{failures.push("Lesson export did not trigger a Chromium download")}
}

const assessmentPaths=[
 ...Array.from({length:13},(_,i)=>`assessments/week-${String(i+1).padStart(2,"0")}.html`),
 ...Array.from({length:3},(_,i)=>`assessments/cumulative-${String(i+1).padStart(2,"0")}.html`)
];
for(const path of assessmentPaths){
  const before=pageErrors.length;
  const response=await page.goto(base+path,{waitUntil:"domcontentloaded",timeout:30000});
  if(!response||response.status()!==200){failures.push("Assessment HTTP failure "+path);continue}
  await page.locator("#assessmentRoot form").waitFor({state:"visible",timeout:10000}).catch(()=>{});
  const questions=await page.locator("#assessmentRoot form > section").count();
  if(questions<10)failures.push("Assessment failed to render expected question set "+path);
  if(pageErrors.length>before)failures.push("Assessment page error "+path+": "+pageErrors.slice(before).join(" | "));
}

await page.goto(base+"portfolio/",{waitUntil:"domcontentloaded"});
if(await page.locator("[data-career-draft]").count()<2)failures.push("Portfolio defense lacks expected evidence fields");
if(!/32\/40/.test(await page.locator("body").innerText()))failures.push("Portfolio defense lost 80% evaluator mastery target");

await page.goto(base+"offline.html",{waitUntil:"domcontentloaded"});
if(!/Previously visited cached lessons may still be available/i.test(await page.locator("body").innerText()))failures.push("Offline fallback contract missing");

await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));
if(failures.length){console.error(failures.map(x=>"FAIL: "+x).join("\n"));process.exit(1)}
console.log("PASS: Career & Professional Studies renders all 65 lessons, 16 mastery surfaces, learner-scoped draft recovery/export, portfolio defense, and commissioned offline registration in Chromium.");

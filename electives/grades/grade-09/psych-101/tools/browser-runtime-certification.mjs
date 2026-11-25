#!/usr/bin/env node
import {createServer} from "node:http";
import {readFile,stat} from "node:fs/promises";
import {extname,join,normalize} from "node:path";
import {chromium} from "playwright";

const root=process.cwd();
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".webmanifest":"application/manifest+json"};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,"http://127.0.0.1");let rel=decodeURIComponent(url.pathname).replace(/^\/+/, "")||"index.html";
  let file=normalize(join(root,rel));if(!file.startsWith(root)){res.writeHead(403);return res.end("forbidden")}
  try{if((await stat(file)).isDirectory())file=join(file,"index.html")}catch{}
  const body=await readFile(file);res.writeHead(200,{"content-type":mime[extname(file).toLowerCase()]||"application/octet-stream","cache-control":"no-store","service-worker-allowed":"/"});res.end(body);
 }catch{res.writeHead(404);res.end("not found")}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const {port}=server.address(),origin=`http://127.0.0.1:${port}`;
const gateway=origin+"/courses/electives/psychology-101/";
const course=origin+"/electives/grades/grade-09/psych-101/";
const browser=await chromium.launch({headless:true});
const context=await browser.newContext();
const page=await context.newPage();
const failures=[],errors=[];
page.on("pageerror",e=>errors.push(e.message));

let response=await page.goto(gateway,{waitUntil:"domcontentloaded"});
if(!response||response.status()!==200)failures.push("Psychology gateway failed");
const full=page.locator('a[href*="electives/grades/grade-09/psych-101/"]').first();
if(await full.count()!==1)failures.push("Gateway lost canonical full-course link");

await page.goto(course,{waitUntil:"domcontentloaded"});
if(!/65\/65 Lessons/.test(await page.locator("body").innerText()))failures.push("Production course no longer reports 65/65 lessons");

for(let week=1;week<=13;week++){
 for(let day=1;day<=5;day++){
  const path=`lessons/week-${String(week).padStart(2,"0")}/day-${String(day).padStart(2,"0")}.html`;
  const before=errors.length;
  response=await page.goto(course+path,{waitUntil:"domcontentloaded",timeout:30000});
  if(!response||response.status()!==200){failures.push("HTTP failure "+path);continue}
  if(await page.locator("main").count()!==1)failures.push("Missing main "+path);
  if((await page.locator("body").innerText()).length<600)failures.push("Shallow lesson "+path);
  if(errors.length>before)failures.push("Page error "+path+": "+errors.slice(before).join(" | "));
 }
}
for(const path of [
 ...Array.from({length:13},(_,i)=>`assessments/week-${String(i+1).padStart(2,"0")}.html`),
 "assessments/cumulative-01.html","assessments/cumulative-02.html","assessments/cumulative-03.html",
 "progress/index.html","research-notebook/index.html","journal/index.html","word-lab/index.html","project/index.html"
]){
 const before=errors.length;
 response=await page.goto(course+path,{waitUntil:"domcontentloaded",timeout:30000});
 if(!response||response.status()!==200)failures.push("HTTP failure "+path);
 if((await page.locator("body").innerText()).trim().length<150)failures.push("Shallow render "+path);
 if(errors.length>before)failures.push("Page error "+path+": "+errors.slice(before).join(" | "));
}
await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));
if(failures.length){console.error(failures.map(x=>"FAIL: "+x).join("\n"));process.exit(1)}
console.log("PASS: Psychology 101 gateway, all 65 lessons, 16 assessment surfaces, progress, notebook, journal, Word Lab, and final research brief render in Chromium.");

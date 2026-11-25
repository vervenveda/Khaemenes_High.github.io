#!/usr/bin/env node
import {createServer} from "node:http";
import {readFile,stat} from "node:fs/promises";
import {extname,join,normalize} from "node:path";
import {chromium} from "playwright";

const root=process.cwd();
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg"};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,"http://127.0.0.1");
    let rel=decodeURIComponent(url.pathname).replace(/^\/+/, "");
    if(!rel)rel="index.html";
    let file=normalize(join(root,rel));
    if(!file.startsWith(root)){res.writeHead(403);return res.end("forbidden");}
    try{if((await stat(file)).isDirectory())file=join(file,"index.html");}catch{}
    const body=await readFile(file);
    res.writeHead(200,{"content-type":mime[extname(file).toLowerCase()]||"application/octet-stream","cache-control":"no-store"});
    res.end(body);
  }catch{res.writeHead(404);res.end("not found");}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const {port}=server.address();
const origin=`http://127.0.0.1:${port}`;
const browser=await chromium.launch({headless:true});
const context=await browser.newContext();
const routes={
  9:["courses/language-arts/english-9/index.html","courses/language-arts/english-9/weeks/week-01/day-01/index.html","courses/language-arts/english-9/assessments/index.html","courses/language-arts/english-9/records/progress-report.html"],
  10:["courses/language-arts/english-10/index.html","courses/language-arts/english-10/weeks/week-01/monday/index.html","courses/language-arts/english-10/assessments/index.html","courses/language-arts/english-10/records/progress-report.html"],
  11:["courses/language-arts/english-11/index.html","courses/language-arts/english-11/weeks/week-01/lessons/day-01.html","courses/language-arts/english-11/assessments/index.html","courses/language-arts/english-11/records/progress-report.html"],
  12:["courses/language-arts/english-12/index.html","courses/language-arts/english-12/weeks/week-01/lessons/day-01.html","courses/language-arts/english-12/assessments/index.html","courses/language-arts/english-12/records/progress-report.html"]
};
const failures=[];
for(const [grade,paths] of Object.entries(routes)){
  const page=await context.newPage();
  for(const path of paths){
    const response=await page.goto(`${origin}/${path}`,{waitUntil:"domcontentloaded",timeout:30000});
    if(!response||response.status()!==200)failures.push(`English ${grade}: HTTP failure ${path}`);
    const bodyText=(await page.locator("body").innerText()).trim();
    if(bodyText.length<120)failures.push(`English ${grade}: shallow/blank render ${path}`);
    if(await page.locator("main").count()===0)failures.push(`English ${grade}: missing main landmark ${path}`);
  }
  await page.close();
}
await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));
if(failures.length){console.error(failures.map(x=>"FAIL: "+x).join("\n"));process.exit(1);}
console.log("PASS: English 9–12 representative course, lesson, assessment, and progress routes render in Chromium.");

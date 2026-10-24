#!/usr/bin/env node
/* Read-only Geometry lesson browser smoke via Chrome DevTools Protocol.
   Uses a fresh disposable browser profile and never reads a real learner profile.
   Inspect DOM readiness directly instead of waiting for --dump-dom to terminate. */
import {spawn} from "node:child_process";
import {mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {setTimeout as sleep} from "node:timers/promises";
const chrome=process.argv[2],pageUrl=process.argv[3];
if(!chrome||!/^http:\/\/127\.0\.0\.1:\d+\/courses\/mathematics\/geometry\/units\/unit-01\/lessons\/u01-l01\.html$/.test(pageUrl||"")){
 console.error("Usage: node tests/math-browser-geometry-cdp.mjs CHROME LOCAL_GEOMETRY_LESSON_URL");
 process.exit(2);
}
const profile=mkdtempSync(join(tmpdir(),"khae-geometry-smoke-"));
const flags=["--headless=new","--no-first-run","--no-default-browser-check","--disable-gpu",
 "--disable-extensions","--disable-background-networking","--disable-dev-shm-usage",
 "--no-proxy-server","--remote-debugging-pipe", "--user-data-dir="+profile,"about:blank"];
if(typeof process.getuid==="function"&&process.getuid()===0)flags.push("--no-sandbox");
const browser=spawn(chrome,flags,{stdio:["ignore","ignore","pipe","pipe","pipe"]});
const pending=new Map();let nextId=0,buffer="",stderr="",last=null,dead=false;
browser.on("exit",()=>{dead=true;for(const p of pending.values())p.reject(new Error("Chrome exited before DOM verification"));pending.clear();});
browser.stderr.on("data",data=>{stderr+=String(data);if(stderr.length>6000)stderr=stderr.slice(-6000)});
browser.stdio[3].on("error",()=>{dead=true;});
browser.stdio[4].on("data",bytes=>{
 buffer+=bytes.toString("utf8");
 let end;
 while((end=buffer.indexOf("\0"))!==-1){
  const line=buffer.slice(0,end);buffer=buffer.slice(end+1);
  if(!line.trim())continue;
  let message;try{message=JSON.parse(line)}catch{continue}
  if(!message.id||!pending.has(message.id))continue;
  const p=pending.get(message.id);pending.delete(message.id);
  message.error?p.reject(new Error(message.error.message)):p.resolve(message.result||{});
 }
});
function send(method,params={},sessionId){
 return new Promise((resolve,reject)=>{
  if(dead)return reject(new Error("Chrome is no longer running"));
  const id=++nextId,timeout=setTimeout(()=>{pending.delete(id);reject(new Error("CDP timeout: "+method))},6500);
  pending.set(id,{resolve:v=>{clearTimeout(timeout);resolve(v)},reject:e=>{clearTimeout(timeout);reject(e)}});
  const request={id,method,params};if(sessionId)request.sessionId=sessionId;
  browser.stdio[3].write(JSON.stringify(request)+"\0");
 });
}
async function verify(label="standard", blocked=[], requireMastery=true){
 const target=await send("Target.createTarget",{url:"about:blank"});
 const attached=await send("Target.attachToTarget",{targetId:target.targetId,flatten:true});
 const session=attached.sessionId;
 await send("Page.enable",{},session);
 await send("Runtime.enable",{},session);
 await send("Network.enable",{},session);
 if(blocked.length)await send("Network.setBlockedURLs",{urls:blocked},session);
 const navigation=await send("Page.navigate",{url:pageUrl},session);
 if(navigation.errorText)throw new Error(label+" navigation failed: "+navigation.errorText);
 for(let i=0;i<12;i++){
  await sleep(250);
  const evaluated=await send("Runtime.evaluate",{expression:
   'JSON.stringify({ready:document.readyState,title:document.title,lesson:document.body?.dataset.lessonId||"",main:!!document.getElementById("lessonMain"),mastery:!!document.getElementById("lessonMasteryScore"),status:!!document.getElementById("lessonStatus")})',
   returnByValue:true},session);
  try{last=JSON.parse(evaluated.result?.value||"null")}catch{}
  if(last?.main&&(!requireMastery||(last?.mastery&&last?.status))&&last?.lesson==="u01-l01"&&last?.ready!=="loading"){
   console.log("PASS Geometry "+label+" DOM "+(requireMastery?"and mastery controls":"first paint"),JSON.stringify(last));
   return;
  }
 }
 throw new Error("Geometry "+label+" controls did not initialize: "+JSON.stringify(last));
}
let ok=false;
try{await verify();ok=true}
catch(e){
 console.error("FAIL Geometry CDP lesson load:",e.message,stderr.slice(-1000));
 // Read-only isolation on fresh targets. These cannot turn a failed standard test green.
 const probes=[
  ["without-remote-resources",["https://*"],true],
  ["without-learner-scope",["*learner-scope-v1.js*"],true],
  ["without-course-entry",["*course-entry-contract.js*"],true],
  ["static-html-no-javascript",["*.js","*.js?*"],false]
 ];
 for(const [name,blocked,requireMastery] of probes){
  try{await verify(name,blocked,requireMastery);console.error("DIAGNOSTIC: "+name+" recovers Geometry first paint/controls")}
  catch(error){console.error("DIAGNOSTIC: "+name+" still fails: "+error.message)}
 }
}
finally{
 browser.kill("SIGKILL");
 await Promise.race([new Promise(resolve=>browser.once("close",resolve)),sleep(1250)]);
 try{rmSync(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100})}catch(e){console.error("Temporary browser profile cleanup failed:",e.message)}
}
if(!ok)process.exitCode=1;

"use strict";
const CACHE_VERSION="khaemenes-algebra1-v2-assessment-depth";
const LEGACY_SOURCE="./service-worker-precache-v1.js";
const ASSESSMENT_FILES=[
 "./",
 "./index.html",
 "./offline.html",
 "./assessments/index.html",
 "./assessments/administration-guide.html",
 "./assessments/assessment-map.json",
 "./assessments/weekly-mastery.html",
 "./assessments/midterm-units-01-06.html",
 "./assessments/final-exam-36-weeks.html",
 "./assessments/assets/weekly-mastery-v2-a.js",
 "./assessments/assets/weekly-mastery-v2-b.js",
 "./assessments/assets/weekly-mastery-v2-c.js",
 "./assessments/assets/weekly-mastery-v2-d.js",
 "./assessments/assets/weekly-mastery-quality-patch-v2.js",
 "./assessments/assets/weekly-mastery-engine-v2.js",
 "./assessments/assets/exam-depth-v2.js",
 "./assets/exam-engine.js",
 "./assets/styles.css",
 "./course-map.json",
 LEGACY_SOURCE
];
function normalizeLegacyPath(path){return path==="./assessments/answer-keys.json"?"./assessments/answer-key.json":path}
async function legacyFiles(){
 try{
  const response=await fetch(new Request(LEGACY_SOURCE,{cache:"reload"}));
  if(!response.ok)throw new Error(`precache source ${response.status}`);
  const text=await response.text();
  const match=text.match(/const PRECACHE=(\[[\s\S]*?\]);/);
  if(!match)throw new Error("legacy PRECACHE array not found");
  const parsed=JSON.parse(match[1]);
  return Array.isArray(parsed)?parsed.map(normalizeLegacyPath):[];
 }catch(error){
  console.warn("Algebra I legacy precache list could not be recovered; assessment core will still be cached.",error);
  return [];
 }
}
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
  const old=await legacyFiles();
  const files=[...new Set([...old,...ASSESSMENT_FILES])];
  const cache=await caches.open(CACHE_VERSION);
  await Promise.allSettled(files.map(path=>cache.add(new Request(path,{cache:"reload"}))));
  await self.skipWaiting();
 })());
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("khaemenes-algebra1-")&&key!==CACHE_VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET")return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 if(request.mode==="navigate"){
  event.respondWith(fetch(request).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put(request,copy))}
   return response;
  }).catch(async()=>await caches.match(request)||await caches.match("./offline.html")||await caches.match("./index.html")));
  return;
 }
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put(request,copy))}
  return response;
 }).catch(()=>cached)));
});
self.addEventListener("message",event=>{if(event.data==="SKIP_WAITING")self.skipWaiting()});

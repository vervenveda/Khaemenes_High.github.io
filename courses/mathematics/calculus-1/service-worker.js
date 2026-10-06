"use strict";
const CACHE="khaemenes-calculus-1-v2-math-entry";
const CORE=["./","index.html","offline.html","../../shared/course-entry-contract.js","../../shared/math-entry-gate.js","manifest.webmanifest","course-data.js","course-map.json","assets/styles.css","assets/app.js","assets/question-bank.js","assets/assessment-engine.js","assets/lesson-tools.js","assets/unit-progress.js","diagnostic/","assessments/","teacher/","teacher-keys/"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 if(event.request.mode==="navigate"){
   event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(r=>r||caches.match("offline.html"))));
   return;
 }
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}return response})));
});

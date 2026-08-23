"use strict";
const CACHE="khaemenes-geometry-v4-final-strict-release";
const CORE=[
 "./","./index.html","./offline.html","./assets/styles.css","./assets/app.js","./assets/question-bank.js","./assets/assessment-engine.js","./assets/lesson-tools.js","./assets/unit-progress.js","./course-data.js","./course-map.json","./manifest.webmanifest","./diagnostic/","./assessments/","./teacher/","./teacher-keys/",
 "./assets/geometry-archaemenes-upgrade.js","./assets/strict-course-progression.js","./assets/unit-index-gates.js","./assets/unit-mastery-source-v2.js",
 "./assessments/index.html","./assessments/administration-guide.html","./assessments/assessment-map.json","./assessments/weekly-mastery.html","./assessments/midterm.html","./assessments/final.html",
 "./assessments/assets/exam-depth-v2.js","./assessments/assets/weekly-mastery-engine-v2.js",
 "./assessments/assets/weekly-mastery-v2-01-03.js","./assessments/assets/weekly-mastery-v2-04-06.js","./assessments/assets/weekly-mastery-v2-07-09.js","./assessments/assets/weekly-mastery-v2-10-12.js","./assessments/assets/weekly-mastery-v2-13-15.js","./assessments/assets/weekly-mastery-v2-16-18.js","./assessments/assets/weekly-mastery-v2-19-21.js","./assessments/assets/weekly-mastery-v2-22-24.js","./assessments/assets/weekly-mastery-v2-25-27.js","./assessments/assets/weekly-mastery-v2-28-30.js","./assessments/assets/weekly-mastery-v2-31-33.js","./assessments/assets/weekly-mastery-v2-34-36.js",
 "./records/course-completion-certificate.html","./records/record-engine-v2.js",
 "./units/unit-01/index.html","./units/unit-01/assessment/mastery-check.html","./units/unit-02/index.html","./units/unit-02/assessment/mastery-check.html","./units/unit-03/index.html","./units/unit-03/assessment/mastery-check.html","./units/unit-04/index.html","./units/unit-04/assessment/mastery-check.html","./units/unit-05/index.html","./units/unit-05/assessment/mastery-check.html","./units/unit-06/index.html","./units/unit-06/assessment/mastery-check.html","./units/unit-07/index.html","./units/unit-07/assessment/mastery-check.html","./units/unit-08/index.html","./units/unit-08/assessment/mastery-check.html","./units/unit-09/index.html","./units/unit-09/assessment/mastery-check.html","./units/unit-10/index.html","./units/unit-10/assessment/mastery-check.html","./units/unit-11/index.html","./units/unit-11/assessment/mastery-check.html","./units/unit-12/index.html","./units/unit-12/assessment/mastery-check.html","./units/unit-13/index.html","./units/unit-13/assessment/mastery-check.html"
];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(CORE.map(url=>cache.add(new Request(url,{cache:"reload"}))))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url); if(url.origin!==location.origin)return;
 if(event.request.mode==="navigate"){
   event.respondWith(fetch(event.request,{cache:"no-store"}).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match("./index.html")).then(hit=>hit||caches.match("./offline.html"))));return;
 }
 event.respondWith(caches.match(event.request).then(hit=>{const network=fetch(event.request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>null);if(hit){event.waitUntil(network);return hit}return network.then(response=>response||caches.match("./offline.html"))}));
});
"use strict";
const CACHE_VERSION="khaemenes-algebra1-v6-applied-labs-landing-v1";
const LEGACY_SOURCE="./service-worker-precache-v1.js";
const RELEASE_FILES=[
 "./","./index.html","./offline.html","./service-worker-precache-v1.js","./diagnostic/index.html","./readiness/index.html","./readiness/transition-contract.json",
 "./assessments/index.html","./assessments/administration-guide.html","./assessments/assessment-map.json","./assessments/weekly-mastery.html","./assessments/midterm-units-01-06.html","./assessments/final-exam-36-weeks.html",
 "./assessments/assets/weekly-mastery-v2-a.js","./assessments/assets/weekly-mastery-v2-b.js","./assessments/assets/weekly-mastery-v2-c.js","./assessments/assets/weekly-mastery-v2-d.js","./assessments/assets/weekly-mastery-quality-patch-v2.js","./assessments/assets/weekly-mastery-engine-v2.js","./assessments/assets/exam-depth-v2.js",
 "./assets/mastery-authority-v1.js","./assets/dedicated-unit-gates-v1.js","./assets/exam-engine.js","./assets/legacy-mastery-engine-v2.js","./assets/record-engine.js","./assets/strict-mastery-gates.js","./assets/course-progression-gates.js","./assets/unit-page.js","./assets/unit-page-core.js","./assets/unit-13-content-upgrade.js","./assets/styles.css","./course-map.json","./course-data.js","./assets/question-bank.js",
 "./labs/index.html","./labs/assets/lab-engine-v1.js","./labs/linear-model-lab.html","./labs/systems-constraints-lab.html","./labs/exponential-change-lab.html","./labs/quadratic-design-lab.html","./labs/financial-evidence-lab.html","./labs/integrated-modelling-lab.html",
 "./units/unit-01/unit-map.json","./units/unit-02/unit-map.json","./units/unit-03/unit-map.json","./units/unit-04/unit-map.json","./units/unit-05/unit-map.json","./units/unit-06/unit-map.json","./units/unit-07/unit-map.json","./units/unit-08/unit-map.json","./units/unit-09/unit-map.json","./units/unit-10/unit-map.json","./units/unit-11/unit-map.json","./units/unit-12/unit-map.json","./units/unit-13/unit-map.json",
 "./units/unit-01/assets/unit01.js",
 "./units/unit-02/assets/unit02.js","./units/unit-02/assets/unit02-core.js",
 "./units/unit-03/assets/unit03.js","./units/unit-03/assets/unit03-core.js",
 "./units/unit-04/assets/unit04.js","./units/unit-04/assets/unit04-core.js",
 "./units/unit-05/assets/unit05.js","./units/unit-05/assets/unit05-core.js",
 "./units/unit-06/assets/unit06.js","./units/unit-06/assets/unit06-core.js",
 "./units/unit-07/assets/unit07.js","./units/unit-07/assets/unit07-core.js",
 "./units/unit-08/assets/unit08.js","./units/unit-08/assets/unit08-core.js",
 "./units/unit-09/assets/unit09.js","./units/unit-09/assets/unit09-core.js",
 "./units/unit-13/projects/algebra-i-integrated-modelling-portfolio-oral-defence.html","./units/unit-13/projects/unit-13-project-upgrade.js",
 "./records/course-completion-certificate.html"
];
function normalizeLegacyPath(p){if(p==="./assessments/answer-keys.json")return"./assessments/answer-key.json";if(p==="./assessments/unit-13-mastery-blueprint.js")return null;if(p.startsWith("./units/unit-12/unit-12/"))return null;return p}
async function legacyFiles(){try{const response=await fetch(new Request(LEGACY_SOURCE,{cache:"reload"}));if(!response.ok)throw new Error(`precache source ${response.status}`);const text=await response.text(),match=text.match(/const PRECACHE=(\[[\s\S]*?\]);/);if(!match)throw new Error("legacy PRECACHE array not found");const parsed=JSON.parse(match[1]);return Array.isArray(parsed)?parsed.map(normalizeLegacyPath).filter(Boolean):[]}catch(error){console.warn("Algebra I legacy precache list could not be recovered; release core will still be cached.",error);return[]}}
self.addEventListener("install",event=>{event.waitUntil((async()=>{const old=await legacyFiles(),files=[...new Set([...old,...RELEASE_FILES])],cache=await caches.open(CACHE_VERSION);await Promise.allSettled(files.map(p=>cache.add(new Request(p,{cache:"reload"}))));await self.skipWaiting()})())});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("khaemenes-algebra1-")&&key!==CACHE_VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{const request=event.request;if(request.method!=="GET")return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;if(request.mode==="navigate"){event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put(request,copy))}return response}).catch(async()=>await caches.match(request)||await caches.match("./offline.html")||await caches.match("./index.html")));return}event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put(request,copy))}return response}).catch(()=>cached))) });
self.addEventListener("message",event=>{if(event.data==="SKIP_WAITING")self.skipWaiting()});

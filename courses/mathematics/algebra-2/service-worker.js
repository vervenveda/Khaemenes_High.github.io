"use strict";
// Applied Mission Studio v1.7.0 · compact pop-out evidence recovery.
const CACHE_PREFIX="khaemenes-algebra2-";
const CACHE=`${CACHE_PREFIX}v15-hardening-20261119`;
const CORE=["../../shared/course-entry-contract.js","../../shared/learner-scope-v1.js",
 "../assets/math-course-shell-v1.js","../assets/math-learning-tools-v2.js","../assets/math-progress-contract-v1.js","../assets/math-compatibility-v1.js","./course-map-v2.json",
  "../assets/applied-mission-studio-v1.js",
  "../../shared/course-entry-contract.js","../../shared/math-entry-gate.js",
  "./","./index.html","./offline.html","./assets/styles.css","./assets/app.js",
  "./assets/question-bank.js","./assets/assessment-engine.js","./assets/lesson-tools.js","./assets/algebra2-presentation-unifier-v1.js","./assets/algebra2-workflow-adapter-v1.js","./assets/algebra2-dark-dashboard-v1.css","../assets/course-lesson-workflow-v1.js","../assets/course-lesson-workflow-v1.css","../assets/math-dashboard-parity-v1.css","../assets/math-student-journey-v1.js","../assets/math-student-journey-v1.css","./video-map.json","../assets/video-companion-v1.js",
  "./assets/unit-progress.js","./assets/algebra2-progression.js","./course-data.js","./course-map.json",
  "./manifest.webmanifest","./diagnostic/","./assessments/",
  "./units/unit-01/projects/01-project.html",
  "./units/unit-02/projects/02-project.html",
  "./units/unit-03/projects/03-project.html",
  "./units/unit-04/projects/04-project.html",
  "./units/unit-05/projects/05-project.html",
  "./units/unit-06/projects/06-project.html",
  "./units/unit-07/projects/07-project.html",
  "./units/unit-08/projects/08-project.html",
  "./units/unit-09/projects/09-project.html",
  "./units/unit-10/projects/10-project.html",
  "./units/unit-11/projects/11-project.html",
  "./units/unit-12/projects/12-project.html",
  "./units/unit-13/projects/13-project.html"];


const VIDEO_FILES=["../assets/video-library/functions-introduction.json","../assets/video-library/parent-functions-transformations-organic.json","../assets/video-library/solving-logarithmic-equations-organic.json","../assets/video-library/conditional-probability-independence-khan.json","../assets/video-library/rational-functions-asymptotes-holes-organic.json","../assets/video-library/geometric-series-introduction-khan.json","../assets/video-library/trig-equations-multiple-angles-organic.json","../assets/video-library/law-of-cosines-organic.json","../assets/video-library/normal-distribution-introduction-khan.json","../assets/video-library/matrix-row-operations-organic.json","../assets/video-library/infinite-geometric-series-khan.json","../assets/video-library/complex-numbers-basic-operations-organic.json","../assets/video-library/polynomial-long-division-organic.json","../assets/video-library/synthetic-division-polynomials-organic.json","../assets/video-library/exponential-growth-decay-organic.json","../assets/video-library/rational-zero-theorem-organic.json","../assets/video-library/solving-exponential-equations-organic.json","../assets/video-library/matrix-inverse-row-reduction-organic.json","../assets/video-library/sigma-notation-sums-khan.json","../assets/video-library/law-of-sines-ambiguous-case-organic.json","../assets/video-library/polynomial-multiplicity-graph-organic.json","../assets/video-library/determinant-3x3-organic.json","../assets/video-library/binomial-theorem-khan-india.json","../assets/video-library/pythagorean-identities-organic.json","../assets/video-library/zscore-comparison-khan.json"];

const MISSION_OFFLINE_RELEASE="ams-v1.7.0-recovery-popout-r1-20261015";
const MISSION_CRITICAL=["./","./index.html","./offline.html","../assets/applied-mission-studio-v1.js","./units/unit-01/projects/01-project.html","./units/unit-02/projects/02-project.html","./units/unit-03/projects/03-project.html","./units/unit-04/projects/04-project.html","./units/unit-05/projects/05-project.html","./units/unit-06/projects/06-project.html","./units/unit-07/projects/07-project.html","./units/unit-08/projects/08-project.html","./units/unit-09/projects/09-project.html","./units/unit-10/projects/10-project.html","./units/unit-11/projects/11-project.html","./units/unit-12/projects/12-project.html","./units/unit-13/projects/13-project.html"];
async function installMissionCritical(){
  const cache=await caches.open(CACHE);
  try{await cache.addAll(MISSION_CRITICAL.map(file=>new Request(file,{cache:"reload"})))}
  catch(error){await caches.delete(CACHE);throw error}
}
self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    await installMissionCritical();
    const cache=await caches.open(CACHE),extras=[...new Set([...CORE,...VIDEO_FILES])].filter(file=>!MISSION_CRITICAL.includes(file));
    await Promise.allSettled(extras.map(file=>cache.add(new Request(file,{cache:"reload"}))));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

function mutableRuntimeRequest(request,url){
  const path=url.pathname.toLowerCase();
  return request.destination==="script"||
    request.destination==="style"||
    path.endsWith(".json")||
    path.includes("/courses/shared/")||
    path.includes("/courses/mathematics/assets/")||
    path.endsWith("/assets/high-school-global-chrome-v2.js")||
    path.endsWith("/assets/vnv-dual-ticker-v1.js");
}
async function networkFirst(request){
  try{
    const response=await fetch(new Request(request,{cache:"no-store"}));
    if(response?.ok){
      const copy=response.clone();
      const cache=await caches.open(CACHE);
      await cache.put(request,copy);
    }
    return response;
  }catch(error){
    const cached=await matchReleaseCache(request);
    if(cached)return cached;
    throw error;
  }
}
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;

  if(event.request.mode==="navigate"){
    event.respondWith(networkFirst(event.request).catch(()=>matchReleaseCache("./index.html").then(hit=>hit||matchReleaseCache("./offline.html"))));
    return;
  }
  if(mutableRuntimeRequest(event.request,url)){
    event.respondWith(networkFirst(event.request));
    return;
  }
  event.respondWith(matchReleaseCache(event.request).then(hit=>{
    if(hit)return hit;
    return networkFirst(event.request).catch(()=>matchReleaseCache("./offline.html"));
  }));
});

function matchReleaseCache(request){return caches.open(CACHE).then(cache=>cache.match(request));}

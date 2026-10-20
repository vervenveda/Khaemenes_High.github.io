"use strict";
// Applied Mission Studio v1.7.0 · compact pop-out evidence recovery.
const CACHE_PREFIX="khaemenes-algebra2-";
const CACHE=`${CACHE_PREFIX}v9-full-lesson-path-v1-20261020`;
const CORE=["../../shared/course-entry-contract.js","../../shared/learner-scope-v1.js",
  "../assets/applied-mission-studio-v1.js",
  "../../shared/course-entry-contract.js","../../shared/math-entry-gate.js",
  "./","./index.html","./offline.html","./assets/styles.css","./assets/app.js",
  "./assets/question-bank.js","./assets/assessment-engine.js","./assets/lesson-tools.js","./assets/algebra2-workflow-adapter-v1.js","./assets/algebra2-dark-dashboard-v1.css","../assets/course-lesson-workflow-v1.js","../assets/course-lesson-workflow-v1.css","../assets/math-dashboard-parity-v1.css","../assets/math-student-journey-v1.js","../assets/math-student-journey-v1.css",
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
    const cache=await caches.open(CACHE),extras=CORE.filter(file=>!MISSION_CRITICAL.includes(file));
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

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;

  if(event.request.mode==="navigate"){
    event.respondWith(
      fetch(event.request,{cache:"no-store"})
        .then(response=>{
          if(response&&response.ok){
            const copy=response.clone();
            caches.open(CACHE).then(cache=>cache.put(event.request,copy));
          }
          return response;
        })
        .catch(()=>matchReleaseCache(event.request)
          .then(hit=>hit||matchReleaseCache("./index.html"))
          .then(hit=>hit||matchReleaseCache("./offline.html")))
    );
    return;
  }

  event.respondWith(
    matchReleaseCache(event.request).then(hit=>{
      const network=fetch(event.request).then(response=>{
        if(response&&response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        }
        return response;
      }).catch(()=>null);
      if(hit){
        event.waitUntil(network);
        return hit;
      }
      return network.then(response=>response||matchReleaseCache("./offline.html"));
    })
  );
});

function matchReleaseCache(request){return caches.open(CACHE).then(cache=>cache.match(request));}

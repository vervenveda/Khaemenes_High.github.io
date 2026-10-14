"use strict";
// Applied Mission Studio v1.4.0 · SHA-256 portable evidence integrity refresh.
const CACHE_PREFIX="khaemenes-algebra2-";
const CACHE=`${CACHE_PREFIX}v3-math-entry`;
const CORE=["../../shared/course-entry-contract.js","../../shared/learner-scope-v1.js",
  "../assets/applied-mission-studio-v1.js",
  "../../shared/course-entry-contract.js","../../shared/math-entry-gate.js",
  "./","./index.html","./offline.html","./assets/styles.css","./assets/app.js",
  "./assets/question-bank.js","./assets/assessment-engine.js","./assets/lesson-tools.js",
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

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>Promise.allSettled(CORE.map(url=>cache.add(new Request(url,{cache:"reload"})))))
      .then(()=>self.skipWaiting())
  );
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

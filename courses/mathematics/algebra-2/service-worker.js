"use strict";
const CACHE_PREFIX="khaemenes-algebra2-";
const CACHE=`${CACHE_PREFIX}v3-math-entry`;
const CORE=[
  "../../shared/course-entry-contract.js","../../shared/math-entry-gate.js",
  "./","./index.html","./offline.html","./assets/styles.css","./assets/app.js",
  "./assets/question-bank.js","./assets/assessment-engine.js","./assets/lesson-tools.js",
  "./assets/unit-progress.js","./assets/algebra2-progression.js","./course-data.js","./course-map.json",
  "./manifest.webmanifest","./diagnostic/","./assessments/"
];

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
        .catch(()=>caches.match(event.request)
          .then(hit=>hit||caches.match("./index.html"))
          .then(hit=>hit||caches.match("./offline.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(hit=>{
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
      return network.then(response=>response||caches.match("./offline.html"));
    })
  );
});

"use strict";
// Applied Mission Studio v1.4.0 · SHA-256 portable evidence integrity refresh.

const CACHE_PREFIX="khaemenes-prealgebra-core-";
const CACHE_NAME=`${CACHE_PREFIX}v7-compact-course-shell-math-canonical-20261008`;
const CORE_FILES=["../../shared/course-entry-contract.js","../../shared/learner-scope-v1.js",
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./course-map.json",
  "./video-map.json",
  "./records/",
  "./records/course-completion-certificate.html",
  "./assets/prealgebra-course-gates-v1.js",
  "./assets/prealgebra-course-navigator-v1.js",
  "./assets/prealgebra-student-navigation.js",
  "./assets/prealgebra-study-scorebook-v1.js",
  "../assets/applied-mission-studio-v1.js",
  "./units/unit-01/projects/number-systems-investigation.html",
  "./units/unit-02/projects/signed-data-investigation.html",
  "./units/unit-03/projects/rational-quantity-investigation.html",
  "./units/unit-04/projects/community-scale-rate-investigation.html",
  "./units/unit-05/projects/consumer-financial-decision-investigation.html",
  "./units/unit-06/projects/scale-of-universe-investigation.html",
  "./units/unit-07/projects/algebraic-model-design-investigation.html",
  "./units/unit-08/projects/equation-formula-design-investigation.html",
  "./units/unit-09/projects/constraint-design-investigation.html",
  "./units/unit-10/projects/linear-relationship-data-story-investigation.html",
  "./units/unit-11/projects/accessible-space-scale-design-investigation.html",
  "./units/unit-12/projects/community-data-evidence-investigation.html",
  "./units/unit-13/projects/mathematical-modelling-capstone-portfolio.html"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE_FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(names=>Promise.all(names.filter(name=>name.startsWith(CACHE_PREFIX)&&name!==CACHE_NAME).map(name=>caches.delete(name))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(request.mode==="navigate"){
    event.respondWith(
      fetch(request)
        .then(response=>response)
        .catch(async()=>{
          const cache=await caches.open(CACHE_NAME);
          return (await cache.match(request,{ignoreSearch:true}))||
            (await cache.match("./offline.html"));
        })
    );
    return;
  }

  if(CORE_FILES.some(file=>new URL(file,self.registration.scope).href===url.href)){
    event.respondWith(matchReleaseCache(request,{ignoreSearch:true}).then(cached=>cached||fetch(request)));
  }
});

function matchReleaseCache(request){return caches.open(CACHE_NAME).then(cache=>cache.match(request));}

"use strict";
// Applied Mission Studio v1.7.0 · compact pop-out evidence recovery.

const CACHE_PREFIX="khaemenes-prealgebra-core-";
const CACHE_NAME=`${CACHE_PREFIX}v10-ams-v1.7.0-recovery-popout-r1-20261015-lesson-cache-20261016`;
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


const MISSION_OFFLINE_RELEASE="ams-v1.7.0-recovery-popout-r1-20261015";
const MISSION_CRITICAL=["./","./index.html","./offline.html","../assets/applied-mission-studio-v1.js","./units/unit-01/projects/number-systems-investigation.html","./units/unit-02/projects/signed-data-investigation.html","./units/unit-03/projects/rational-quantity-investigation.html","./units/unit-04/projects/community-scale-rate-investigation.html","./units/unit-05/projects/consumer-financial-decision-investigation.html","./units/unit-06/projects/scale-of-universe-investigation.html","./units/unit-07/projects/algebraic-model-design-investigation.html","./units/unit-08/projects/equation-formula-design-investigation.html","./units/unit-09/projects/constraint-design-investigation.html","./units/unit-10/projects/linear-relationship-data-story-investigation.html","./units/unit-11/projects/accessible-space-scale-design-investigation.html","./units/unit-12/projects/community-data-evidence-investigation.html","./units/unit-13/projects/mathematical-modelling-capstone-portfolio.html"];
async function installMissionCritical(){
  const cache=await caches.open(CACHE_NAME);
  try{await cache.addAll(MISSION_CRITICAL.map(file=>new Request(file,{cache:"reload"})))}
  catch(error){await caches.delete(CACHE_NAME);throw error}
}
self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    await installMissionCritical();
    const cache=await caches.open(CACHE_NAME);
    const extras=CORE_FILES.filter(file=>!MISSION_CRITICAL.includes(file));
    await Promise.allSettled(extras.map(file=>cache.add(new Request(file,{cache:"reload"}))));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(names=>Promise.all(names.filter(name=>name.startsWith(CACHE_PREFIX)&&name!==CACHE_NAME).map(name=>caches.delete(name))))
      .then(()=>self.clients.claim())
  );
});

// Capture successfully visited course lessons and local support assets only.
// Local learner scores, notes, and mastery remain solely in existing record storage.
const scopeURL=new URL(self.registration.scope);
function isCourseAsset(url){
  return url.href.startsWith(scopeURL.href)&&/\.(?:css|js|json|svg|png|jpg|jpeg|webp)$/i.test(url.pathname);
}
async function cacheGoodResponse(request,response){
  if(!response || !response.ok || response.type==="opaque")return;
  try{const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone());}
  catch(error){console.warn("Pre-Algebra offline copy unavailable; online lesson is still usable.",error);}
}
function releaseMatch(request,options={ignoreSearch:true}){
  return caches.open(CACHE_NAME).then(cache=>cache.match(request,options));
}
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(request.mode==="navigate"){
    if(!url.href.startsWith(scopeURL.href))return;
    event.respondWith((async()=>{
      try{
        const response=await fetch(request);
        await cacheGoodResponse(request,response);
        return response;
      }catch{
        const cached=await releaseMatch(request,{ignoreSearch:true});
        return cached || await releaseMatch(new URL("./offline.html",scopeURL.href).href,{ignoreSearch:true}) || Response.error();
      }
    })());
    return;
  }

  const isCore=CORE_FILES.some(file=>new URL(file,scopeURL.href).href===url.href);
  if(isCore||isCourseAsset(url)){
    event.respondWith((async()=>{
      const cached=await releaseMatch(request,{ignoreSearch:true});
      if(cached)return cached;
      const response=await fetch(request);
      if(isCourseAsset(url))await cacheGoodResponse(request,response);
      return response;
    })());
  }
});

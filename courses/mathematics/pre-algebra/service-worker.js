"use strict";

const CACHE_PREFIX="khaemenes-prealgebra-core-";
const CACHE_NAME=`${CACHE_PREFIX}v3-assessment-depth-v4-course-navigator-v5-study-scorebook`;
const CORE_FILES=[
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./course-map.json",
  "./records/",
  "./records/course-completion-certificate.html",
  "./assets/prealgebra-archaemenes-upgrade.js",
  "./assets/prealgebra-archaemenes-upgrade-core.js",
  "./assets/prealgebra-assessment-depth-v2.js",
  "./assets/prealgebra-assessment-depth-v2-core.js",
  "./assets/prealgebra-course-gates-v1.js",
  "./assets/prealgebra-course-navigator-v1.js",
  "./assets/prealgebra-study-scorebook-v1.js",
  "./assets/assessment-depth/prealgebra-weekly-quizzes-v2-a.js",
  "./assets/assessment-depth/prealgebra-weekly-quizzes-v2-b.js",
  "./assets/assessment-depth/prealgebra-weekly-quizzes-v2-c.js",
  "./assets/assessment-depth/prealgebra-weekly-quizzes-v2-d.js",
  "./units/unit-01/unit-map.json",
  "./units/unit-02/unit-map.json",
  "./units/unit-03/unit-map.json",
  "./units/unit-04/unit-map.json",
  "./units/unit-05/unit-map.json",
  "./units/unit-06/unit-map.json",
  "./units/unit-07/unit-map.json",
  "./units/unit-08/unit-map.json",
  "./units/unit-09/unit-map.json",
  "./units/unit-10/unit-map.json",
  "./units/unit-11/unit-map.json",
  "./units/unit-12/unit-map.json",
  "./units/unit-13/unit-map.json",
  "./assessments/",
  "./assessments/index.html",
  "./assessments/assessment-map.json",
  "./assessments/administration-guide.html",
  "./assessments/midterm-units-01-07.html",
  "./assessments/final-exam-36-weeks.html",
  "./assessments/assets/assessment-suite.css",
  "./assessments/assets/exam-engine.js",
  "./assessments/assets/exam-depth-v2.js"
];

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
    event.respondWith(caches.match(request,{ignoreSearch:true}).then(cached=>cached||fetch(request)));
  }
});

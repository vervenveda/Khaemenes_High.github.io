const CACHE_NAME = "khae-english-10-ela-curriculum-20261016-v3-quiz72";
const PRECACHE = ["../../shared/course-entry-contract.js","../../shared/learner-scope-v1.js","../../shared/upper-english-records.js",
  "./404.html",
  "./assessments/diagnostic/index.html",
  "./assessments/final/index.html",
  "./assessments/index.html",
  "./assessments/midterm/index.html",
  "./assessments/unit-01/index.html",
  "./assessments/unit-02/index.html",
  "./assessments/unit-03/index.html",
  "./assessments/unit-04/index.html",
  "./assessments/unit-05/index.html",
  "./assessments/unit-06/index.html",
  "./assessments/unit-07/index.html",
  "./assessments/unit-08/index.html",
  "./assessments/unit-09/index.html",
  "./assessments/unit-10/index.html",
  "./assessments/unit-11/index.html",
  "./assessments/unit-12/index.html",
  "../../shared/daily-instruction.css",
  "./assets/course.css",
  "./assets/course.js",
  "./assets/week01-studios.js",
  "./assets/week01-studios.css",
  "./assets/curriculum-data.js",
  "./curriculum.json",
  "./grades/grade-10/index.html",
  "./index.html",
  "./manifest.webmanifest",
  "./offline.html",
  "./portfolio/index.html",
  "./reading-list.html",
  "./records/annual-calendar.html",
  "./records/attendance-log.html",
  "./records/completion-certificate.html",
  "./records/gradebook.html",
  "./records/index.html",
  "./records/reading-log.html",
  "./rubrics/argument.html",
  "./rubrics/index.html",
  "./rubrics/literary-analysis.html",
  "./rubrics/narrative.html",
  "./rubrics/research.html",
  "./rubrics/speaking.html",
  "./standards.html",
  "./teacher-guide.html",
  "./units/unit-01/index.html",
  "./units/unit-02/index.html",
  "./units/unit-03/index.html",
  "./units/unit-04/index.html",
  "./units/unit-05/index.html",
  "./units/unit-05/reading-dossier.html",
  "./units/unit-06/reading-dossier.html",
  "./units/unit-06/index.html",
  "./units/unit-07/index.html",
  "./units/unit-08/index.html",
  "./units/unit-09/index.html",
  "./units/unit-10/index.html",
  "./units/unit-11/index.html",
  "./units/unit-12/index.html",
  "./weeks/week-01/index.html",
  "./weeks/week-01/monday/index.html",
  "./weeks/week-01/tuesday/index.html",
  "./weeks/week-01/wednesday/index.html",
  "./weeks/week-01/thursday/index.html",
  "./weeks/week-01/friday/index.html",
  "./weeks/week-02/index.html",
  "./weeks/week-03/index.html",
  "./weeks/week-04/index.html",
  "./weeks/week-05/index.html",
  "./weeks/week-06/index.html",
  "./weeks/week-07/index.html",
  "./weeks/week-08/index.html",
  "./weeks/week-09/index.html",
  "./weeks/week-10/index.html",
  "./weeks/week-11/index.html",
  "./weeks/week-12/index.html",
  "./weeks/week-13/index.html",
  "./weeks/week-14/index.html",
  "./weeks/week-15/index.html",
  "./weeks/week-16/index.html",
  "./weeks/week-17/index.html",
  "./weeks/week-18/index.html",
  "./weeks/week-19/index.html",
  "./weeks/week-20/index.html",
  "./weeks/week-21/index.html",
  "./weeks/week-22/index.html",
  "./weeks/week-23/index.html",
  "./weeks/week-24/index.html",
  "./weeks/week-25/index.html",
  "./weeks/week-26/index.html",
  "./weeks/week-27/index.html",
  "./weeks/week-28/index.html",
  "./weeks/week-29/index.html",
  "./weeks/week-30/index.html",
  "./weeks/week-31/index.html",
  "./weeks/week-32/index.html",
  "./weeks/week-33/index.html",
  "./weeks/week-34/index.html",
  "./weeks/week-35/index.html",
  "./weeks/week-36/index.html"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key=>key.startsWith("khae-english10-")&&key!==CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return;
  if(event.request.mode === "navigate"){
    event.respondWith(
      fetch(event.request).then(response => {
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
        return response;
      }).catch(()=>matchReleaseCache(event.request).then(hit=>hit||matchReleaseCache("./offline.html")))
    );
    return;
  }
  event.respondWith(
    matchReleaseCache(event.request).then(hit => hit || fetch(event.request).then(response => {
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
      return response;
    }))
  );
});

function matchReleaseCache(request){return caches.open(CACHE_NAME).then(cache=>cache.match(request));}

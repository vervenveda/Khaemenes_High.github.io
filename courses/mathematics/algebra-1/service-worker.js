"use strict";
// Applied Mission Studio v1.7.0 · compact pop-out evidence recovery.
const CACHE_VERSION="khaemenes-algebra1-v25-access-reader-recovery-20261022";
const LEGACY_SOURCE="./service-worker-precache-v1.js";
const RELEASE_FILES=["../../shared/course-entry-contract.js","../../shared/learner-scope-v1.js",
 "../../shared/course-entry-contract.js","../../shared/math-entry-gate.js",
 "./","./index.html","./offline.html","./service-worker-precache-v1.js","./diagnostic/index.html","./readiness/index.html","./transition-contract.html","./readiness/transition-contract.json",
 "./assessments/index.html","./assessments/administration-guide.html","./assessments/assessment-map.json","./assessments/weekly-mastery.html","./assessments/midterm-units-01-06.html","./assessments/final-exam-36-weeks.html",
 "./assessments/assets/weekly-mastery-v2-a.js","./assessments/assets/weekly-mastery-v2-b.js","./assessments/assets/weekly-mastery-v2-c.js","./assessments/assets/weekly-mastery-v2-d.js","./assessments/assets/weekly-mastery-quality-patch-v2.js","./assessments/assets/weekly-mastery-engine-v2.js","./assessments/assets/exam-depth-v2.js",
 "../assets/applied-mission-studio-v1.js","./assets/mastery-authority-v1.js","./assets/deep-lesson-engine-v1.js","./assets/lesson-resource-map.js","./assets/lesson-resource-bridge-v1.js","./assets/algebra1-workflow-adapter-v1.js","./assets/algebra1-student-experience-v2.js","./assets/algebra1-student-experience-v2.css","./assets/algebra1-dark-dashboard-v1.css","../assets/course-lesson-workflow-v1.js","../assets/course-lesson-workflow-v1.css","../assets/math-dashboard-parity-v1.css","../assets/math-student-journey-v1.js","../assets/math-student-journey-v1.css","./video-map.json","../assets/video-companion-v1.js","./assets/applied-mission-studio-v1.js","./assets/readiness-entry-gate-v1.js","./assets/dedicated-unit-gates-v1.js","./assets/deep-lesson-engine-v1.js","./assets/focused-assessment-v1.js","./assets/responsive-layout-v1.css","./assets/exam-engine.js","./assets/legacy-mastery-engine-v2.js","./assets/record-engine.js","./assets/strict-mastery-gates.js","./assets/course-progression-gates.js","./assets/unit-page.js","./assets/unit-page-core.js","./assets/unit-13-content-upgrade.js","./assets/styles.css","./course-map.json","./course-data.js","./assets/question-bank.js",
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
 "./records/course-completion-certificate.html",
  "./units/unit-01/projects/precision-measurement-audit.html",
  "./units/unit-02/projects/expression-structure-design-brief.html",
  "./units/unit-03/projects/equation-based-decision-model.html",
  "./units/unit-04/projects/constraint-tolerance-design.html",
  "./units/unit-05/projects/multiple-representation-function-portfolio.html",
  "./units/unit-06/projects/linear-data-story-model-defence.html",
  "./units/unit-07/projects/systems-feasible-region-decision-lab.html",
  "./units/unit-08/projects/exponential-change-investigation.html",
  "./units/unit-09/projects/polynomial-design-factor-analysis.html",
  "./units/unit-10/projects/quadratic-model-optimization-defence.html",
  "./units/unit-11/projects/coordinate-geometry-accessibility-design.html",
  "./units/unit-12/projects/evidence-financial-decision-audit.html"];
function normalizeLegacyPath(p){if(p==="./assessments/answer-keys.json")return"./assessments/answer-key.json";if(p==="./assessments/unit-13-mastery-blueprint.js")return null;if(p.startsWith("./units/unit-12/unit-12/"))return null;return p}
async function legacyFiles(){try{const response=await fetch(new Request(LEGACY_SOURCE,{cache:"reload"}));if(!response.ok)throw new Error(`precache source ${response.status}`);const text=await response.text(),match=text.match(/const PRECACHE=(\[[\s\S]*?\]);/);if(!match)throw new Error("legacy PRECACHE array not found");const parsed=JSON.parse(match[1]);return Array.isArray(parsed)?parsed.map(normalizeLegacyPath).filter(Boolean):[]}catch(error){console.warn("Algebra I legacy precache list could not be recovered; release core will still be cached.",error);return[]}}

const VIDEO_FILES=["../assets/video-library/number-systems.json","../assets/video-library/order-of-operations.json","../assets/video-library/solving-linear-equations.json","../assets/video-library/linear-inequalities-introduction.json","../assets/video-library/evaluating-functions-introduction.json","../assets/video-library/slope-formula.json","../assets/video-library/systems-elimination-substitution.json","../assets/video-library/factoring-trinomials-introduction.json","../assets/video-library/quadratic-equations-factoring.json"];

const MISSION_OFFLINE_RELEASE="ams-v1.7.0-recovery-popout-r1-20261015";
const MISSION_CRITICAL=["./","./index.html","./offline.html","../assets/applied-mission-studio-v1.js","./units/unit-01/projects/precision-measurement-audit.html","./units/unit-02/projects/expression-structure-design-brief.html","./units/unit-03/projects/equation-based-decision-model.html","./units/unit-04/projects/constraint-tolerance-design.html","./units/unit-05/projects/multiple-representation-function-portfolio.html","./units/unit-06/projects/linear-data-story-model-defence.html","./units/unit-07/projects/systems-feasible-region-decision-lab.html","./units/unit-08/projects/exponential-change-investigation.html","./units/unit-09/projects/polynomial-design-factor-analysis.html","./units/unit-10/projects/quadratic-model-optimization-defence.html","./units/unit-11/projects/coordinate-geometry-accessibility-design.html","./units/unit-12/projects/evidence-financial-decision-audit.html","./units/unit-13/projects/algebra-i-integrated-modelling-portfolio-oral-defence.html"];
async function installMissionCritical(){
  const cache=await caches.open(CACHE_VERSION);
  try{await cache.addAll(MISSION_CRITICAL.map(file=>new Request(file,{cache:"reload"})))}
  catch(error){await caches.delete(CACHE_VERSION);throw error}
}
self.addEventListener("install",event=>{event.waitUntil((async()=>{await installMissionCritical();const old=await legacyFiles(),files=[...new Set([...old,...RELEASE_FILES,...VIDEO_FILES])],cache=await caches.open(CACHE_VERSION),extras=files.filter(file=>!MISSION_CRITICAL.includes(file));await Promise.allSettled(extras.map(p=>cache.add(new Request(p,{cache:"reload"}))));await self.skipWaiting()})())});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("khaemenes-algebra1-")&&key!==CACHE_VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{const request=event.request;if(request.method!=="GET")return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;if(request.mode==="navigate"){event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put(request,copy))}return response}).catch(async()=>await matchReleaseCache(request)||await matchReleaseCache("./offline.html")||await matchReleaseCache("./index.html")));return}event.respondWith(matchReleaseCache(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put(request,copy))}return response}).catch(()=>cached))) });
self.addEventListener("message",event=>{if(event.data==="SKIP_WAITING")self.skipWaiting()});

function matchReleaseCache(request){return caches.open(CACHE_VERSION).then(cache=>cache.match(request));}

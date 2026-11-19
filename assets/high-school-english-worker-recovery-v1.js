/* Khaemenes High · English direct-entry worker recovery v1.0.0
   English 9 inherits the High School root worker.
   English 10–12 use course-scoped workers.
   Recovery only: no learner records, grades, mastery, or storage are cleared. */
(()=>{"use strict";
if(window.__KHAE_ENGLISH_WORKER_RECOVERY_V1__)return;
window.__KHAE_ENGLISH_WORKER_RECOVERY_V1__=true;
if(!("serviceWorker" in navigator))return;

const path=location.pathname.toLowerCase();
const match=path.match(/\/courses\/language-arts\/english-(9|10|11|12)(?:\/|$)/);
if(!match)return;

const grade=match[1];
let script,scope;
if(grade==="9"){
  if(window.__KHAEMENES_HIGH_ROOT_WORKER_RECOVERY_V1__)return;
  script="/Khaemenes_High.github.io/service-worker.js";
  scope="/Khaemenes_High.github.io/";
}else{
  script=`/Khaemenes_High.github.io/courses/language-arts/english-${grade}/service-worker.js`;
  scope=`/Khaemenes_High.github.io/courses/language-arts/english-${grade}/`;
}

const hadController=Boolean(navigator.serviceWorker.controller);
let reloaded=false;
navigator.serviceWorker.addEventListener("controllerchange",()=>{
  if(!hadController||reloaded)return;
  reloaded=true;
  location.reload();
},{once:true});

const recover=()=>navigator.serviceWorker
  .register(script,{scope,updateViaCache:"none"})
  .then(registration=>registration.update())
  .catch(()=>{});

if(document.readyState==="complete")recover();
else window.addEventListener("load",recover,{once:true});
})();
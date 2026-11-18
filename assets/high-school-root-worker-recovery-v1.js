/* Khaemenes High · shared root service-worker recovery v1.0.0
   Purpose: recover stale root High School runtime from any direct-entry page
   that inherits /Khaemenes_High.github.io/service-worker.js.
   Does not clear learner data, storage, grades, or course records. */
(()=>{"use strict";
if(window.__KHAEMENES_HIGH_ROOT_WORKER_RECOVERY_V1__)return;
window.__KHAEMENES_HIGH_ROOT_WORKER_RECOVERY_V1__=true;
if(!("serviceWorker" in navigator))return;

const SCRIPT="/Khaemenes_High.github.io/service-worker.js";
const SCOPE="/Khaemenes_High.github.io/";
const hadController=Boolean(navigator.serviceWorker.controller);
let recoveryReload=false;

navigator.serviceWorker.addEventListener("controllerchange",()=>{
  if(!hadController||recoveryReload)return;
  recoveryReload=true;
  location.reload();
},{once:true});

const recover=()=>navigator.serviceWorker
  .register(SCRIPT,{scope:SCOPE,updateViaCache:"none"})
  .then(registration=>registration.update())
  .catch(()=>{});

if(document.readyState==="complete")recover();
else window.addEventListener("load",recover,{once:true});
})();
/* Algebra I direct-entry service-worker recovery v1.0.0
   Assessment/diagnostic pages may be entered without visiting the course landing.
   Recover the canonical Algebra I worker without clearing learner data. */
(()=>{"use strict";
if(window.__KHAE_ALGEBRA1_WORKER_RECOVERY_V1__)return;
window.__KHAE_ALGEBRA1_WORKER_RECOVERY_V1__=true;
if(!("serviceWorker" in navigator))return;
const SCRIPT="/Khaemenes_High.github.io/courses/mathematics/algebra-1/service-worker.js";
const SCOPE="/Khaemenes_High.github.io/courses/mathematics/algebra-1/";
const hadController=Boolean(navigator.serviceWorker.controller);
let reloaded=false;
navigator.serviceWorker.addEventListener("controllerchange",()=>{
 if(!hadController||reloaded)return;
 reloaded=true;
 location.reload();
},{once:true});
const recover=()=>navigator.serviceWorker
 .register(SCRIPT,{scope:SCOPE,updateViaCache:"none"})
 .then(registration=>registration.update())
 .catch(()=>{});
if(document.readyState==="complete")recover();
else window.addEventListener("load",recover,{once:true});
})();
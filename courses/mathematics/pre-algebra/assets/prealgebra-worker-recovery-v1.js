/* Pre-Algebra direct-entry service-worker recovery v1.0.0
   Assessment/diagnostic pages may be entered without visiting the course landing.
   Recover the canonical course worker without clearing learner data. */
(()=>{"use strict";
if(window.__KHAE_PREALGEBRA_WORKER_RECOVERY_V1__)return;
window.__KHAE_PREALGEBRA_WORKER_RECOVERY_V1__=true;
if(!("serviceWorker" in navigator))return;
const SCRIPT="/Khaemenes_High.github.io/courses/mathematics/pre-algebra/service-worker.js";
const SCOPE="/Khaemenes_High.github.io/courses/mathematics/pre-algebra/";
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
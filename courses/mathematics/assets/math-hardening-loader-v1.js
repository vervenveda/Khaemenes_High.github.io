/* Khaemenes Academy · shared High School mathematics hardening loader v1 */
(()=>{"use strict";
if(window.KhaemenesMathHardeningLoader)return;
const self=document.currentScript,base=new URL("./",self?.src||location.href);
function css(){
 if(document.querySelector('link[data-khae-math-hardening-css]'))return;
 const l=document.createElement("link");l.rel="stylesheet";l.href=new URL("math-responsive-hardening-v1.css",base).href;l.dataset.khaeMathHardeningCss="v1";document.head.appendChild(l);
}
function script(name,id){
 if(document.getElementById(id))return Promise.resolve();
 return new Promise(resolve=>{const s=document.createElement("script");s.id=id;s.src=new URL(name,base).href;s.async=false;s.onload=resolve;s.onerror=()=>{console.warn("Mathematics hardening dependency unavailable:",name);resolve()};document.head.appendChild(s)});
}
async function boot(){
 css();
 await script("math-assessment-directive-config-v1.js","khaeMathAssessmentDirectiveConfigV1");
 await script("math-assessment-directive-v1.js","khaeMathAssessmentDirectiveV1");
 await script("math-storage-adapter-v1.js","khaeMathStorageAdapterV1");
 await script("math-learner-record-v1.js","khaeMathLearnerRecordV1");
 await script("math-progress-contract-v1.js","khaeMathProgressContractV1");
 await script("math-storage-health-v2.js","khaeMathStorageHealthV2");
 await script("math-evidence-authority-v1.js","khaeMathEvidenceAuthorityV1");
 await script("math-progression-ledger-v1.js","khaeMathProgressionLedgerV1");
 try{window.KhaemenesMathLearnerRecord?.captureLegacy?.("hardening-loader");window.KhaemenesMathProgressionLedger?.capture?.("hardening-loader")}catch(e){console.warn("Mathematics hardening capture incomplete.",e)}
 window.dispatchEvent(new CustomEvent("khaemenes-math-hardening-ready",{detail:{version:"1.3.0"}}));
}
window.KhaemenesMathHardeningLoader=Object.freeze({boot,version:"1.2.0"});
boot();
})();
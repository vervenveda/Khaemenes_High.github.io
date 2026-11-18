/* Khaemenes Academy · mathematics storage health v2 */
(()=>{"use strict";
if(window.KhaemenesMathStorageHealth)return;
const ID="khaeMathStorageHealth",rec=()=>window.KhaemenesMathLearnerRecord;
function status(){
 const r=rec(),h=r?.storageHealth?.()||{available:false,verified:false,mode:"unknown"};
 return {schema:"khaemenes-math-storage-health-v2",course:r?.course||null,learner:r?.learner?.()||null,...h,online:navigator.onLine};
}
function mount(){
 if(document.getElementById(ID))return;
 const s=status(),box=document.createElement("section");box.id=ID;box.setAttribute("role","status");box.setAttribute("aria-live","polite");
 box.style.cssText="position:relative;z-index:1150;width:min(100% - 24px,1120px);margin:10px auto;padding:11px 14px;border:1px solid #b49a68;border-radius:7px;background:#fff8e8;color:#2d2923;font:400 16px/1.45 Nunito,Arial,sans-serif;text-align:center";
 const label=s.verified?"Protected local record":"Export recommended";
 box.innerHTML='<strong style="font-weight:444">'+label+'</strong> · '+(s.verified?"Course writes can be verified in this browser. Keep exports for device changes.":"Persistent browser storage is unavailable or unverified. Reading remains available, but do not rely on this browser alone.");
 const btn=document.createElement("button");btn.type="button";btn.textContent="Export Course Record";btn.style.cssText="min-height:44px;margin-left:10px;padding:8px 12px;border:1px solid #6d5d43;border-radius:7px;background:#302c28;color:#fff;font:inherit;cursor:pointer";
 btn.addEventListener("click",()=>rec()?.exportRecord?.());box.append(btn);
 (document.querySelector("main")||document.body).prepend(box);
}
function verifyWrite(label="manual"){
 const r=rec();if(!r)return {ok:false,error:"record-adapter-unavailable"};
 const h=r.storageHealth();r.append?.("storage-health",{label,...h},"math-storage-health-v2");return {ok:h.verified,health:h};
}
window.KhaemenesMathStorageHealth=Object.freeze({status,mount,verifyWrite,version:"2.0.0"});
const boot=()=>mount();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();
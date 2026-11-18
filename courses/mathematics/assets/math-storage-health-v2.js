/* Khaemenes Academy · mathematics storage health v2.2 */
(()=>{"use strict";
if(window.KhaemenesMathStorageHealth)return;
const ID="khaeMathStorageHealth",rec=()=>window.KhaemenesMathLearnerRecord,store=()=>window.KhaemenesMathStorageAdapter;
function status(){
 const r=rec(),current=store()?.status?.(),h=current&&current.available!==null?current:(store()?.probe?.()||r?.storageHealth?.()||{available:false,verified:false,mode:"unknown"});
 return {schema:"khaemenes-math-storage-health-v2",course:r?.course||null,learner:r?.learner?.()||null,...h,online:navigator.onLine};
}
function language(s){
 const scoped=s.learner?.verified===true;
 if(s.persisted===false||s.verified===false){
  return s.memory===true
   ?{label:"Export Recommended · Memory Only",message:"Persistent storage could not be verified. Current work is retained in this page memory when possible; export or copy it before closing or reloading."}
   :{label:"Read Only · Export Recommended",message:"Persistent browser storage is unavailable or unverified. Course reading remains available, but this browser must not be trusted to retain new work."};
 }
 if(s.verified&&scoped)return {label:"Protected · Local Only",message:"Course writes are being read-back verified and consolidated under the active learner in this browser. This is local protection, not Account Cloud synchronization; keep exports for device changes."};
 if(s.verified)return {label:"Local Only · Learner Binding Needed",message:"Browser writes are read-back verified, but no verified active learner identity is bound to this record. Select the intended learner before relying on this device for progress."};
 return {label:"Storage Check Pending",message:"Storage state has not yet been verified."};
}
function render(){
 let box=document.getElementById(ID);
 if(!box){
  box=document.createElement("section");box.id=ID;box.setAttribute("role","status");box.setAttribute("aria-live","polite");
  box.style.cssText="position:relative;z-index:1150;width:min(100% - 24px,1120px);margin:10px auto;padding:11px 14px;border:1px solid #b49a68;border-radius:7px;background:#fff8e8;color:#2d2923;font:400 16px/1.45 Nunito,Arial,sans-serif;text-align:center";
  (document.querySelector("main")||document.body).prepend(box);
 }
 const s=status(),copy=language(s);
 box.innerHTML='<strong style="font-weight:444">'+copy.label+'</strong> · '+copy.message;
 const btn=document.createElement("button");btn.type="button";btn.textContent="Export Course Record";
 btn.style.cssText="min-height:44px;margin-left:10px;padding:8px 12px;border:1px solid #6d5d43;border-radius:7px;background:#302c28;color:#fff;font:inherit;cursor:pointer";
 btn.addEventListener("click",()=>rec()?.exportRecord?.());box.append(btn);
 return s;
}
function mount(){return render()}
function verifyWrite(label="manual"){
 const r=rec();if(!r)return {ok:false,error:"record-adapter-unavailable"};
 const h=store()?.probe?.()||r.storageHealth();r.append?.("storage-health",{label,...h},"math-storage-health-v2.2");render();return {ok:h.verified,health:h};
}
window.KhaemenesMathStorageHealth=Object.freeze({status,mount,render,verifyWrite,version:"2.2.0"});
const boot=()=>{render();window.addEventListener("khaemenes-math-storage-state",()=>render());window.addEventListener("khaemenes-math-learner-changed",()=>render());window.addEventListener("online",()=>render());window.addEventListener("offline",()=>render())};
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();
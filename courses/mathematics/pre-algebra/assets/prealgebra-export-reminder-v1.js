/* Nonblocking after-unit ZIP reminder; uses only selected student's recorded 36-week course evidence.
   It does NOT infer mastery from browser-global legacy unit records. */
(()=>{"use strict";const COURSE="KHAE_OPEN_PREALGEBRA_FORGE_V2",PREFIX="khaemenes-prealgebra-unit-export-reminded-v1:";
const ARCHIVE="records/learner-archive.html?mode=course";
function get(){try{return JSON.parse(localStorage.getItem(COURSE)||"null")}catch{return null}}
function complete(w){
 if(!w||Number(w.quiz?.best)<80)return false;
 const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
 return days.every(d=>w.lessons?.[d]===true)&&[0,1,2].every(i=>w.assignments?.[i]===true||w.assignments?.[String(i)]===true);
}
let showing=false;
function check(){
 if(showing||typeof APP==="undefined"||!Array.isArray(APP.weeks))return;
 const s=get(),learner=s?.students?.find(x=>x.id===s.activeId);if(!learner)return;
 const groups=new Map();
 APP.weeks.forEach(w=>{const n=Number(w.unitNumber);if(!Number.isInteger(n)||n<1||n>13)return;const row=groups.get(n)||[];row.push(Number(w.week));groups.set(n,row)});
 for(const [unit,weeks] of groups){
  if(!weeks.length||!weeks.every(n=>complete(learner.progress?.weeks?.[n]||learner.progress?.weeks?.[String(n)])))continue;
  const key=PREFIX+learner.id+":u"+String(unit).padStart(2,"0");if(localStorage.getItem(key))continue;
  showing=true;
  const wrap=document.createElement("div");wrap.id="prealgebraUnitExportReminder";wrap.style.cssText="position:fixed;inset:0;z-index:99997;display:grid;place-items:center;padding:16px;background:rgba(25,29,28,.66)";
  wrap.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="archiveReminderTitle" style="width:min(100%,520px);background:#f7f1e5;color:#27302d;border:2px solid #b8995c;border-radius:7px;padding:26px;text-align:center"><p style="font-size:18px">Khaemenes Academy · Student Records</p><h2 id="archiveReminderTitle" style="font:400 24px Cinzel,Georgia,serif">Save your Unit '+unit+' progress</h2><p style="font-size:18px">Your selected course learner has completed the recorded weekly checkpoints for this unit. Export a fresh ZIP to protect work, quizzes and reports. Independent unit assessment records may still require reconciliation.</p><div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap"><a href="'+ARCHIVE+'" style="background:#292d2b;color:#fff9ed;border-radius:7px;padding:12px 18px;text-decoration:none">Export Full Student ZIP</a><button type="button" id="archiveReminderLater" style="background:#f7f1e5;color:#27302d;border:1px solid #292d2b;border-radius:7px;padding:12px 18px;cursor:pointer">Remind me later</button></div></section>';
  document.body.appendChild(wrap);
  const dismiss=()=>{showing=false;wrap.remove()};
  // This is a notification marker, not a mastery record. "Later" reappears on next page visit.
  wrap.querySelector("a").addEventListener("click",()=>{try{localStorage.setItem(key,new Date().toISOString())}catch{}});
  wrap.querySelector("button").addEventListener("click",dismiss);
  wrap.addEventListener("keydown",e=>{if(e.key==="Escape")dismiss()});
  wrap.querySelector("button").focus();
  break;
 }
}
window.addEventListener("load",()=>setTimeout(check,500),{once:true});
window.addEventListener("khaemenes-high-course-state-changed",()=>setTimeout(check,0));
})();
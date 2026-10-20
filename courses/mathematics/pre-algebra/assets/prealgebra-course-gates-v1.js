(()=>{"use strict";
const MIN=80,NAIB_KEY="khaemenes-naib-readiness-profile-v1",EXIT_KEY="khaemenes-prealgebra-unit00-exit-v1";
function read(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}}function learner(){try{return typeof student==="function"?student():null}catch{return null}}function weekly(n){const s=learner();if(!s)return null;try{return typeof weekRec==="function"?weekRec(s,n):s.progress?.weeks?.[n]||null}catch{return s.progress?.weeks?.[n]||null}}
function lessonDone(n){const s=learner();if(!s)return false;try{if(typeof lessonPct==="function")return Number(lessonPct(s,n))>=100}catch{}const r=weekly(n),done=r?.lessons;if(Array.isArray(done))return done.length>=5&&done.every(Boolean);if(done&&typeof done==="object")return Object.values(done).filter(Boolean).length>=5;return false}
function quizBest(n){const r=weekly(n);return Number(r?.quiz?.best)||0}function weekMastered(n){return lessonDone(n)&&quizBest(n)>=MIN}
function entrance(){const p=read(NAIB_KEY);if(!p)return{ok:false,href:"diagnostic/",message:"Complete the NAIB pre-course readiness assessment first."};if(p.route==="unit_0_refresher"){const exit=read(EXIT_KEY);if(!(exit?.passed&&Number(exit.best_percent)>=MIN))return{ok:false,href:"units/unit-00/",message:"NAIB assigned the six-week refresher. Complete Unit 0 and its 80% exit mastery gate before Week 1."}}return{ok:true}}
function allowedWeek(n){const e=entrance();if(!e.ok)return e;if(n<=1)return{ok:true};if(weekMastered(n-1))return{ok:true};return{ok:false,href:`#week-${n-1}`,message:`Week ${n} is locked. Week ${n-1} requires all lesson work plus at least 80% on its weekly quiz.`}}

function ensureGateUI(){
  let style=document.getElementById("academyMasteryGateStyle");
  if(!style){
    style=document.createElement("style");style.id="academyMasteryGateStyle";
    style.textContent=`
      #academyMasteryGateNotice{background:#fff8e8!important;color:#20241f!important;border:1px solid #b99657!important;border-left:4px solid #967342!important;box-shadow:0 8px 24px rgba(34,31,27,.12)!important}
      #academyMasteryGateNotice *{color:#20241f!important}
      #academyMasteryGateNotice a{color:#5e431b!important;text-decoration:underline!important;text-underline-offset:3px}
      #academyMasteryGateDialog{width:min(520px,calc(100vw - 28px));max-width:none;border:1px solid #967342;border-radius:7px;padding:0;background:#fff8e8!important;color:#20241f!important;box-shadow:0 24px 70px rgba(0,0,0,.38)}
      #academyMasteryGateDialog::backdrop{background:rgba(4,8,12,.72)}
      #academyMasteryGateDialog .gate-shell{padding:22px}
      #academyMasteryGateDialog *{color:#20241f!important}
      #academyMasteryGateDialog h2{margin:0;font-family:Cinzel,"Palatino Linotype",Georgia,serif;font-size:24px!important;font-weight:400!important;line-height:1.2}
      #academyMasteryGateDialog p{margin:12px 0 0;line-height:1.6}
      #academyMasteryGateDialog .gate-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
      #academyMasteryGateDialog .gate-actions a,#academyMasteryGateDialog .gate-actions button{min-height:42px;display:inline-flex;align-items:center;justify-content:center;padding:9px 13px;border:1px solid #967342;border-radius:7px;background:#faf7ef!important;color:#20241f!important;box-shadow:none!important;font:inherit;font-weight:600;text-decoration:none}
      #academyMasteryGateDialog .gate-actions a{background:#ead9b6!important}
    `;
    document.head.appendChild(style);
  }
  let dialog=document.getElementById("academyMasteryGateDialog");
  if(!dialog){
    dialog=document.createElement("dialog");dialog.id="academyMasteryGateDialog";
    dialog.innerHTML='<div class="gate-shell"><h2>Pre-Algebra Mastery Gate</h2><p id="academyMasteryGateMessage"></p><div class="gate-actions"><a id="academyMasteryGateAction" href="diagnostic/">Open Required Step</a><button id="academyMasteryGateClose" type="button">Close</button></div></div>';
    document.body.appendChild(dialog);
    dialog.querySelector("#academyMasteryGateClose").addEventListener("click",()=>dialog.close?.());
    dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close?.()});
  }
  return dialog;
}
function showGate(g){
  const dialog=ensureGateUI(),message=dialog.querySelector("#academyMasteryGateMessage"),action=dialog.querySelector("#academyMasteryGateAction");
  message.textContent=g?.message||"Complete the required mastery step before continuing.";
  if(g?.href){action.hidden=false;action.href=g.href}else{action.hidden=true}
  if(typeof dialog.showModal==="function"){if(!dialog.open)dialog.showModal()}else dialog.setAttribute("open","");
}

function decorate(){
  ensureGateUI();
  document.querySelectorAll(".weekBtn[data-week]").forEach(b=>{const n=Number(b.dataset.week),g=allowedWeek(n);b.dataset.masteryLocked=String(!g.ok);b.setAttribute("aria-disabled",String(!g.ok));if(!g.ok){b.title=g.message;b.style.opacity=".48"}else{b.title="";b.style.opacity=""}});
  const e=entrance();let note=document.getElementById("academyMasteryGateNotice");
  if(!note){note=document.createElement("div");note.id="academyMasteryGateNotice";note.className="notice";note.setAttribute("role","status");note.setAttribute("aria-live","polite");const host=document.querySelector(".sidebar .panel")||document.querySelector(".sidebar");host?.appendChild(note)}
  if(note)note.innerHTML=e.ok?`<strong>Academy mastery gate active.</strong> Each new week requires the prior week's lesson work and an 80%+ weekly quiz.`:`<strong>Course entrance locked.</strong> ${e.message} <a href="${e.href}">Open required step</a>.`;
}
document.addEventListener("click",e=>{const b=e.target.closest?.('.weekBtn[data-week][data-mastery-locked="true"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();showGate(allowedWeek(Number(b.dataset.week)))},true);
const observer=new MutationObserver(()=>decorate());const list=document.getElementById("weekList");if(list)observer.observe(list,{childList:true,subtree:true});window.addEventListener("storage",decorate);window.addEventListener("pageshow",decorate);setTimeout(decorate,0);
})();

(() => {
"use strict";
const unit=Number(document.body.dataset.unit);
if(!unit)return;
const current=document.currentScript;
const run=()=>{
const KEY="khaemenes-algebra2-lesson-progress-v1";
let data=window.KhaemenesAlgebra2Progression?.readJSON?.(KEY,{})||{};
const cards=[...document.querySelectorAll("[data-lesson-id]")];
let done=0;
cards.forEach(card=>{
 const id=card.dataset.lessonId,on=window.KhaemenesAlgebra2Progression?.lessonMastered?.(id)===true;
 if(on){done++;card.classList.add("completed");const p=card.querySelector(".lesson-state");if(p)p.textContent="80% lesson mastery met";}
});
const out=document.getElementById("unitProgress");
if(out)out.textContent=`${done}/${cards.length} detailed lessons at 80% mastery`;
};
if(window.KhaemenesAlgebra2Progression)run();
else if(current){
 const script=document.createElement("script");
 script.src=new URL("./algebra2-progression.js",current.src).href;
 script.onload=run;
 script.onerror=()=>{
  const main=document.querySelector("main");if(!main)return;
  main.querySelectorAll('a[href*="lessons/"],a[href*="assessment/mastery-check.html"]').forEach(link=>{link.dataset.progressionRecoveryLocked="true";link.removeAttribute("href");link.setAttribute("aria-disabled","true");link.style.opacity=".55";link.style.pointerEvents="none"});
  if(document.getElementById("algebra2UnitProgressionRecovery"))return;
  const banner=document.createElement("section");banner.id="algebra2UnitProgressionRecovery";banner.setAttribute("role","alert");banner.className="notice";
  banner.innerHTML='<p class="eyebrow">Progression check unavailable</p><h2>Unit remains available in read-only mode</h2><p>Lesson and mastery navigation is paused until the local progression authority loads. Reading, review, and printing remain available; no progression credit is granted in this state.</p><button class="btn" type="button" id="algebra2UnitProgressionRetry">Retry verification</button>';
  main.prepend(banner);document.getElementById("algebra2UnitProgressionRetry")?.addEventListener("click",()=>location.reload());
 };
 document.head.appendChild(script);
}else run();
})();


/* Algebra II Academy screen readability floor. Print rules remain independent. */
;(()=>{
 if(document.getElementById("algebra2MinScreenTypeV1"))return;
 const style=document.createElement("style");
 style.id="algebra2MinScreenTypeV1";
 style.textContent='@media screen{html:root:root body{font-size:16px!important}html:root:root body :is(button,input,select,textarea,a,p,li,label,summary){font-size:max(16px,1em)}html:root:root body :is(.eyebrow,.kicker,.dialog-eyebrow,.dialog-kicker,.worksheet-kicker){font-size:14px!important;line-height:1.35!important;letter-spacing:.12em!important;text-transform:uppercase!important}html:root:root body :is(button,input,select,textarea){min-height:44px}}';
 (document.head||document.documentElement).appendChild(style);
})();

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
 const id=card.dataset.lessonId,on=!!data[id]?.complete;
 if(on){done++;card.classList.add("completed");const p=card.querySelector(".lesson-state");if(p)p.textContent="Completed on this device";}
});
const out=document.getElementById("unitProgress");
if(out)out.textContent=`${done}/${cards.length} detailed lessons marked complete`;
};
if(window.KhaemenesAlgebra2Progression)run();
else if(current){
 const script=document.createElement("script");
 script.src=new URL("./algebra2-progression.js",current.src).href;
 script.onload=run;
 script.onerror=()=>{const main=document.querySelector("main");if(main&&!document.getElementById("a2ProgressRecovery")){const note=document.createElement("aside");note.id="a2ProgressRecovery";note.setAttribute("role","status");note.style.cssText="margin:16px auto;padding:14px 18px;max-width:960px;border:1px solid #a67b35;border-radius:7px;background:#fff8e8;color:#282016";note.textContent="Progression status could not be loaded. Lesson navigation remains visible, but completion and mastery status cannot be verified. Reload the page before submitting graded work.";main.prepend(note)}};
 document.head.appendChild(script);
}else run();
})();

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
 script.onerror=()=>{const main=document.querySelector("main");if(main)main.innerHTML='<section class="unit-hero"><div class="wrap"><p class="eyebrow">Progression check unavailable</p><h1>Unit paused</h1><p>Refresh this page before continuing; the local progression check could not be loaded.</p></div></section>'};
 document.head.appendChild(script);
}else run();
})();


/* Algebra II Academy screen readability floor. Print rules remain independent. */
;(()=>{
 if(document.getElementById("algebra2MinScreenTypeV1"))return;
 const style=document.createElement("style");
 style.id="algebra2MinScreenTypeV1";
 style.textContent='@media screen{html:root:root body{font-size:16px!important}html:root:root body :is(button,input,select,textarea,a,p,li,label,summary){font-size:max(16px,1em)}html:root:root body :is(button,input,select,textarea){min-height:44px}}';
 (document.head||document.documentElement).appendChild(style);
})();

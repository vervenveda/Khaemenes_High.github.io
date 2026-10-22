(()=>{
"use strict";
const current=document.currentScript;
const base=new URL(".",current?.src||location.href);
const ref=window.PAGE_REF||{};
const unit=Number(ref.unit);
const scripts=[];
if(unit===11) scripts.push(new URL("unit-11-content-upgrade.js",base).href);
if(unit===12) scripts.push(new URL("unit-12-content-upgrade.js",base).href);
if(unit===13) scripts.push(new URL("unit-13-content-upgrade.js",base).href);
scripts.push(new URL("mastery-authority-v1.js",base).href);
scripts.push(new URL("unit-page-core.js",base).href);
scripts.push(new URL("algebra1-student-experience-v2.js",base).href);
if(ref.type==="project") scripts.push(new URL("../../assets/applied-mission-studio-v1.js",base).href);
if(unit===13) scripts.push(new URL("../units/unit-13/projects/unit-13-project-upgrade.js",base).href);
if(ref.type==="project"&&unit!==13) scripts.push(new URL("applied-mission-studio-v1.js",base).href);
scripts.push(new URL("strict-mastery-gates.js",base).href);
scripts.push(new URL("deep-lesson-engine-v1.js",base).href);
function loadAt(i){
 if(i>=scripts.length){shuffleVisibleOptions();window.KhaemenesAlgebra1StudentExperience?.enhance();window.KhaemenesAlgebra1LearningExperience?.enhance();return}
 const s=document.createElement("script");s.src=scripts[i];s.async=false;
 s.onload=()=>loadAt(i+1);
 s.onerror=()=>{
  const failed=scripts[i];console.error("Algebra I unit renderer dependency could not load:",failed);
  // Fail closed on required renderer/mastery scripts; keep optional companions separate.
  if(/(?:mastery-authority-v1|unit-page-core|strict-mastery-gates)\\.js(?:$|\\?)/.test(failed)){
   document.body.dataset.algebra1LoadFailed="true";
   const main=document.getElementById("main");
   if(main)main.innerHTML='<section class="hero"><div class="wrap"><p class="eyebrow">Algebra I · Lesson loading</p><h1>The lesson engine could not finish loading.</h1><p class="lead">Saved work was not reset. Reconnect or refresh to load the required teaching and mastery safeguards.</p><div class="actions"><button class="btn primary" type="button" id="algebra1RetryLoad">Retry lesson</button><a class="btn" href="'+(ref.root||"../../")+'">Course Home</a></div></div></section>';
   document.getElementById("algebra1RetryLoad")?.addEventListener("click",()=>location.reload());
   return;
  }
  console.warn("Optional Algebra I lesson companion unavailable:",failed);
  loadAt(i+1);
 };
 document.head.appendChild(s);
}
function shuffleVisibleOptions(){
 document.querySelectorAll(".options").forEach(group=>{
  const items=[...group.children];
  for(let i=items.length-1;i>0;i--){
   const j=Math.floor(Math.random()*(i+1));
   [items[i],items[j]]=[items[j],items[i]];
  }
  items.forEach(item=>group.appendChild(item));
 });
}
loadAt(0);
})();

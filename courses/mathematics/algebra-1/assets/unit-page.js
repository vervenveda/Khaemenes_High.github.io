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
 s.onerror=()=>{console.error("Algebra I unit renderer dependency could not load:",scripts[i]);showRecovery();};
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
function showRecovery(){
 const main=document.getElementById("main");
 if(!main||main.children.length||main.textContent.trim())return;
 const home=new URL(ref.root||"../../",location.href).href;
 main.innerHTML='<section class="hero"><div class="wrap"><h1>Algebra I is taking longer than expected</h1><p>The unit could not finish loading. Your saved progress remains unchanged. Try again or return to the course directory.</p><p><a class="btn primary" href="'+home+'">Algebra I home</a> <button class="btn" type="button" onclick="location.reload()">Retry loading</button></p></div></section>';
}
loadAt(0);
setTimeout(showRecovery,12000);
})();

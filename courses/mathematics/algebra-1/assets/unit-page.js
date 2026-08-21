(()=>{
"use strict";
const current=document.currentScript;
const base=new URL(".",current?.src||location.href);
const ref=window.PAGE_REF||{};
const unit=Number(ref.unit);
const scripts=[];
if(unit===1) scripts.push(new URL("unit-01-content-upgrade.js",base).href);
if(unit===2) scripts.push(new URL("unit-02-content-upgrade.js",base).href);
if(unit===11) scripts.push(new URL("unit-11-content-upgrade.js",base).href);
if(unit===12) scripts.push(new URL("unit-12-content-upgrade.js",base).href);
if(unit===13) scripts.push(new URL("unit-13-content-upgrade.js",base).href);
scripts.push(new URL("unit-page-core.js",base).href);
function loadAt(i){
 if(i>=scripts.length){shuffleVisibleOptions();return}
 const s=document.createElement("script");s.src=scripts[i];s.async=false;
 s.onload=()=>loadAt(i+1);
 s.onerror=()=>console.error("Algebra I unit renderer dependency could not load:",scripts[i]);
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
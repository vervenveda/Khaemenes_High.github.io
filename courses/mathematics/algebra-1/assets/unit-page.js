(()=>{
"use strict";
const current=document.currentScript;
const coreSrc=new URL("unit-page-core.js",current?.src||location.href).href;

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

const core=document.createElement("script");
core.src=coreSrc;
core.async=false;
core.onload=shuffleVisibleOptions;
core.onerror=()=>console.error("Algebra I unit renderer could not load.");
document.head.appendChild(core);
})();

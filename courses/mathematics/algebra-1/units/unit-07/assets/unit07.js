(()=>{
"use strict";
const current=document.currentScript;
const base=new URL(".",current?.src||location.href);
window.KhaemenesAlgebra1DedicatedGateConfig={unit:7,lesson_weeks:[19,19,19,20,20,21,21]};
const deps=[new URL("../../../assets/mastery-authority-v1.js",base).href,new URL("../../../assets/dedicated-unit-gates-v1.js",base).href];
function fail(message){const main=document.getElementById("main");if(main)main.innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Strict 80% Mastery Gate</p><h1>Unit 07 is temporarily locked</h1><p class="lead">${message}</p><div class="nav"><a class="btn" href="../../index.html">Course Home</a></div></div></section>`}
function load(src,onload){const s=document.createElement("script");s.src=src;s.async=false;s.onload=onload;s.onerror=()=>fail("A required mastery dependency could not be loaded. Reload before continuing.");document.head.appendChild(s)}
function loadCore(){const gate=window.KhaemenesAlgebra1DedicatedGate;if(!gate||gate.before()!==true)return;if(document.body?.dataset?.masteryLocked==="true")return;load(new URL("unit07-core.js",base).href,()=>gate.after())}
function loadGate(){if(window.KhaemenesAlgebra1DedicatedGate)return loadCore();load(deps[1],loadCore)}
if(window.KhaemenesAlgebra1MasteryAuthority)loadGate();else load(deps[0],loadGate);
})();

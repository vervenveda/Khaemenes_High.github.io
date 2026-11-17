/* Khaemenes Academy · universal mathematics compatibility contract v1
   Responsive/browser/storage diagnostics only. Never mutates learner records or mastery. */
(()=>{"use strict";
if(window.KhaemenesMathCompatibility)return;
const STORAGE_TEST="__khae_math_storage_test__";
function storageStatus(){
 let available=false,reason=null;
 try{localStorage.setItem(STORAGE_TEST,"1");localStorage.removeItem(STORAGE_TEST);available=true;}
 catch(error){reason=String(error?.name||error?.message||"storage-unavailable");}
 return {available,reason};
}
function viewport(){
 const w=Math.max(document.documentElement.clientWidth||0,window.innerWidth||0);
 const h=Math.max(document.documentElement.clientHeight||0,window.innerHeight||0);
 return {width:w,height:h,orientation:w>h?"landscape":"portrait",compact:w<=760,narrow:w<=330};
}
function overflow(){
 const doc=document.documentElement;
 return {horizontal:doc.scrollWidth>doc.clientWidth+2,scrollWidth:doc.scrollWidth,clientWidth:doc.clientWidth};
}
function touch(){return {coarse:matchMedia?.("(pointer: coarse)")?.matches===true,maxTouchPoints:navigator.maxTouchPoints||0};}
function snapshot(){return {schema:"khaemenes-math-compat-v1",viewport:viewport(),overflow:overflow(),touch:touch(),storage:storageStatus(),service_worker:"serviceWorker" in navigator,online:navigator.onLine};}
function mountBanner(){
 const s=storageStatus();
 if(s.available||document.getElementById("khae-math-storage-warning"))return;
 const box=document.createElement("div");box.id="khae-math-storage-warning";box.setAttribute("role","status");
 box.textContent="Local course storage is unavailable in this browser. You can continue reading lessons, but saved progress may not be accessible here. Use the course export/records tools from a browser where your learner record is available before changing or clearing browser data.";
 box.style.cssText="position:relative;z-index:1100;margin:0;padding:14px 18px;background:#fff3cd;color:#332a14;border-bottom:1px solid #b39a6b;font:400 16px/1.5 Nunito,Arial,sans-serif;text-align:center";
 document.body.prepend(box);
}
function installResponsiveGuards(){
 const style=document.createElement("style");style.id="khae-math-compat-style";
 style.textContent=
 "html,body{max-width:100%;overflow-x:hidden}"+
 "img,svg,canvas,video,iframe{max-width:100%}"+
 "button,a,input,select,textarea,summary{touch-action:manipulation}"+
 "button,.button,.btn,a[role=button],summary{min-height:44px}"+
 "table{max-width:100%}"+
 ".table-wrap{max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}"+
 "@media(max-width:1024px) and (orientation:landscape){.wrap,.main{max-width:100%!important}.lesson-layout,.practice-layout{grid-template-columns:minmax(0,1fr)!important}.lesson-side,.practice-side{position:static!important}.header-tools{max-width:100%!important}}"+
 "@media(max-width:760px){.grid,.unit-grid,.resource-grid,.lesson-grid,.daily-grid,.form-grid,.pathway-grid{grid-template-columns:minmax(0,1fr)!important}.col3,.col4,.col5,.col6,.col7,.col8,.col12{grid-column:1/-1!important}}";
 document.head.append(style);
}
function announce(){window.dispatchEvent(new CustomEvent("khaemenes-math-compatibility",{detail:snapshot()}));}
function boot(){installResponsiveGuards();mountBanner();announce();window.addEventListener("resize",announce,{passive:true});window.addEventListener("orientationchange",announce,{passive:true});window.addEventListener("online",announce);window.addEventListener("offline",announce);}
window.KhaemenesMathCompatibility={snapshot,storageStatus,viewport,overflow};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
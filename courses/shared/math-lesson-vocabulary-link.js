/* Khaemenes Academy mathematics lesson Vocabulary Studio link · local and read-only */
(() => {
 "use strict";
 const match=location.pathname.match(/\/courses\/mathematics\/(pre-algebra|algebra-1|geometry|algebra-2)\/units\/unit-(0[0-9]|1[0-3])\/lessons\/[^/]+\.html$/);
 if(!match)return;
 const course=match[1],unit=match[2];
 if(unit==="00"&&course!=="pre-algebra")return;
 const linkUrl=new URL("../../../../tools/vocabulary-studio.html",location.href);
 linkUrl.search=new URLSearchParams({course,unit}).toString();
 const id="khae-lesson-vocabulary-studio-link";
 const styleId="khae-lesson-vocabulary-style";
 const names={"pre-algebra":"Pre-Algebra","algebra-1":"Algebra I","geometry":"Geometry","algebra-2":"Algebra II"};
 function addStyle(){
   if(document.getElementById(styleId))return;
   const style=document.createElement("style");
   style.id=styleId;
   style.textContent=".khae-vocabulary-lesson-link{display:inline-flex!important;align-items:center;justify-content:center;flex-wrap:wrap;gap:5px;max-width:100%;min-width:0;padding:7px 11px!important;margin:5px 3px!important;border:1px solid #9ca9a3!important;border-radius:7px!important;background:#fcfbf7!important;color:#242d33!important;font:400 14px/1.45 \"Brandon Grotesque\",\"Avenir Next\",Arial,sans-serif!important;letter-spacing:0!important;text-transform:none!important;text-decoration:none!important;text-align:center!important;white-space:normal!important;word-break:normal!important;overflow-wrap:normal!important;box-shadow:none!important}.khae-vocabulary-lesson-link:hover{background:#f0f3ef!important;border-color:#516c66!important}.khae-vocabulary-lesson-link:focus-visible{outline:2px solid #244f5c!important;outline-offset:3px!important}.khae-vocabulary-unit{font-size:12px;color:#4a5657}@media print{.khae-vocabulary-lesson-link{display:none!important}}";
   document.head.appendChild(style);
 }
 function destination(){
   const main=document.querySelector("main");
   if(course==="pre-algebra")
     return document.querySelector(".site-header .header-actions")||
       document.querySelector("header .actions")||main?.querySelector(".hero .actions")||main;
   if(course==="algebra-1")
     return main?.querySelector(".hero .nav, .hero .actions, .hero .hero-actions, .hero .wrap, .lesson-header")||null;
   if(course==="geometry")
     return main?.querySelector(".lesson-sidebar .visual-card")||
       document.querySelector(".site-header .header-tools")||main;
   return main?.querySelector(".lesson-hero .actions")||
       document.querySelector(".site-header .header-tools")||main;
 }
 function install(){
   if(document.getElementById(id))return true;
   const host=destination();
   if(!host)return false;
   addStyle();
   const link=document.createElement("a");
   link.id=id;
   link.className="khae-vocabulary-lesson-link";
   link.href=linkUrl.href;
   link.target="_blank";
   link.rel="noopener noreferrer";
   link.setAttribute("aria-label","Open "+names[course]+" Unit "+unit+" vocabulary in a new tab");
   link.append(document.createTextNode("Vocabulary Studio"));
   const unitTag=document.createElement("span");
   unitTag.className="khae-vocabulary-unit";
   unitTag.textContent="Unit "+unit;
   link.append(unitTag);
   host.appendChild(link);
   return true;
 }
 function boot(){
   if(install())return;
   const main=document.querySelector("main");
   if(!main||course!=="algebra-1"||typeof MutationObserver!=="function")return;
   const observer=new MutationObserver(()=>{if(install())observer.disconnect()});
   observer.observe(main,{childList:true,subtree:true});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
 else boot();
})();

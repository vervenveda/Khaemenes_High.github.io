/* Geometry presentation unifier v1
   Presentation/navigation only. No learner records, grades, assessments, gates, or storage are modified.
*/
(()=>{"use strict";
if(window.__KHAEMENES_GEOMETRY_PRESENTATION_UNIFIER_V1__)return;
window.__KHAEMENES_GEOMETRY_PRESENTATION_UNIFIER_V1__=true;

const root="/Khaemenes_High.github.io/";
const load=(src,key)=>{
  if([...document.scripts].some(s=>{try{return new URL(s.src,location.href).pathname===new URL(src,location.href).pathname}catch{return false}}))return;
  const s=document.createElement("script");s.src=src;s.defer=true;if(key)s.dataset[key]="true";(document.head||document.documentElement).appendChild(s);
};

function canonicalUtilities(){
  load(root+"assets/vnv-dual-ticker-v1.js","geometryDualTicker");
  load(root+"assets/vnv-language.js","officialVnvLanguage");
}

function demoteLegacyHeader(){
  const old=document.querySelector("body > header.site-header, body > header.screen-only.site-header, header.site-header");
  if(!old||old.dataset.geometryLocalNav==="true")return;
  const tools=old.querySelector(".header-tools");
  const nav=document.createElement("nav");
  nav.className="geometry-local-nav"+(old.classList.contains("screen-only")?" screen-only":"");
  nav.dataset.geometryLocalNav="true";
  nav.setAttribute("aria-label","Geometry course navigation");
  const inner=document.createElement("div");
  inner.className="wrap geometry-local-nav-inner";
  const title=document.createElement("span");
  title.className="geometry-local-nav-title";
  title.textContent="Geometry";
  inner.appendChild(title);
  if(tools){
    tools.classList.add("geometry-local-nav-links");
    inner.appendChild(tools);
  }
  nav.appendChild(inner);
  old.replaceWith(nav);
}

function removeRepeatedHeroBadge(){
  document.querySelectorAll(".hero-badge").forEach(el=>el.remove());
}

function boot(){
  canonicalUtilities();
  demoteLegacyHeader();
  removeRepeatedHeroBadge();
  document.documentElement.dataset.geometryPresentation="unified-v1";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
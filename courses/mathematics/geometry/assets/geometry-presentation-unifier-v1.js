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

function installReadableFloor(){
  if(document.getElementById("geometry-readable-floor-v1"))return;
  const style=document.createElement("style");
  style.id="geometry-readable-floor-v1";
  style.textContent=`
html:root:root:root body{font-size:16px!important}
html:root:root:root body :is(
  p,li,label,a,button,input,select,textarea,option,output,td,th,legend,small,summary,
  .pill,.day,.metric span,.breadcrumb,.breadcrumb *,.header-control,.course-menu>summary,
  .problem-prompt,.feedback,.notice,.lesson-meta,.formula-chip
){font-size:max(16px,1em)!important;line-height:1.55}
@media print{html:root:root:root body{font-size:16px!important}}
`;
  document.head.appendChild(style);
}
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
  installReadableFloor();
  canonicalUtilities();
  demoteLegacyHeader();
  removeRepeatedHeroBadge();
  document.documentElement.dataset.geometryPresentation="unified-v1";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
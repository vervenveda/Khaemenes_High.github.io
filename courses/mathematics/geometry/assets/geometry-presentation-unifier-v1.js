/* Geometry presentation unifier v1.1
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
html:root:root:root body :is(.eyebrow,.kicker,.dialog-eyebrow,.dialog-kicker,.worksheet-kicker){
  font-size:16px!important;line-height:1.35!important;letter-spacing:.12em!important;text-transform:uppercase!important
}
@media print{html:root:root:root body{font-size:16px!important}}
`;
  document.head.appendChild(style);
}
function compactLessonSupport(){
  const host=document.querySelector(".lesson-sidebar");
  if(!host||host.dataset.geometrySupportCompact==="true")return;
  host.dataset.geometrySupportCompact="true";
  host.classList.add("geometry-support-grid");

  [...host.children].forEach(card=>{
    if(!(card instanceof HTMLElement))return;
    const heading=card.querySelector(":scope > h2, :scope > h3");
    if(!heading)return;
    const title=(heading.textContent||"").trim();

    if(/local completion/i.test(title)){
      card.classList.add("geometry-support-persistent");
      return;
    }

    const details=document.createElement("details");
    details.className="visual-card geometry-support-card";
    details.dataset.geometrySupport=title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

    const summary=document.createElement("summary");
    summary.textContent=title;
    details.appendChild(summary);

    const body=document.createElement("div");
    body.className="geometry-support-body";
    [...card.childNodes].forEach(node=>{if(node!==heading)body.appendChild(node)});
    details.appendChild(body);
    card.replaceWith(details);
  });

  if(!document.getElementById("geometry-support-grid-v1")){
    const style=document.createElement("style");
    style.id="geometry-support-grid-v1";
    style.textContent=`
.lesson-sidebar.geometry-support-grid{
  display:grid!important;
  grid-template-columns:repeat(3,minmax(0,1fr))!important;
  gap:14px!important;
  align-items:start!important;
  position:static!important;
}
.geometry-support-card{
  min-width:0;
  padding:0!important;
  overflow:hidden;
}
.geometry-support-card>summary{
  min-height:58px;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:14px 16px;
  cursor:pointer;
  color:var(--ink);
  font-family:var(--display,"Cinzel",Georgia,serif);
  font-size:16px!important;
  font-weight:400!important;
  text-align:center;
  list-style:none;
  white-space:nowrap;
}
.geometry-support-card>summary::-webkit-details-marker{display:none}
.geometry-support-card>summary::after{
  content:"+";
  margin-left:10px;
  color:var(--gold2,var(--gold));
  font-family:inherit;
}
.geometry-support-card[open]>summary::after{content:"−"}
.geometry-support-card[open]>summary{border-bottom:1px solid var(--soft)}
.geometry-support-body{padding:0 18px 18px;text-align:center}
.geometry-support-body .actions{justify-content:center}
.geometry-support-persistent{
  grid-column:1/-1!important;
  text-align:center;
}
.geometry-support-persistent .actions{justify-content:center}
@media(max-width:900px){
  .lesson-sidebar.geometry-support-grid{grid-template-columns:1fr!important}
  .geometry-support-persistent{grid-column:auto!important}
}
`;
    document.head.appendChild(style);
  }
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
  compactLessonSupport();
  removeRepeatedHeroBadge();
  document.documentElement.dataset.geometryPresentation="unified-v1";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
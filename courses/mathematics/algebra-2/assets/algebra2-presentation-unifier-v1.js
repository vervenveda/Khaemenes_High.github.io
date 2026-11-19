/* Algebra II presentation unifier v1.0
   Presentation/navigation only. No learner records, grades, assessments, gates, or storage are modified.
*/
(()=>{"use strict";
if(window.__KHAEMENES_ALGEBRA2_PRESENTATION_UNIFIER_V1__)return;
window.__KHAEMENES_ALGEBRA2_PRESENTATION_UNIFIER_V1__=true;

function installReadableFloor(){
  if(document.getElementById("algebra2-readable-floor-v1"))return;
  const style=document.createElement("style");
  style.id="algebra2-readable-floor-v1";
  style.textContent=`
html:root:root:root body{font-size:16px!important}
html:root:root:root body :is(
  p,li,label,a,button,input,select,textarea,option,output,td,th,legend,small,summary,
  .pill,.day,.metric span,.breadcrumb,.breadcrumb *,.header-control,.course-menu>summary,
  .notice,.feedback,.lesson-meta
){font-size:max(16px,1em)!important;line-height:1.55}
html:root:root:root body :is(.eyebrow,.kicker,.dialog-eyebrow,.dialog-kicker,.worksheet-kicker){
  font-size:16px!important;line-height:1.35!important;letter-spacing:.12em!important;text-transform:uppercase!important
}
@media print{html:root:root:root body{font-size:16px!important}}
`;
  document.head.appendChild(style);
}

function centerLessonSupport(){
  const layout=document.querySelector(".lesson-layout");
  const side=document.querySelector(".lesson-side");
  if(!layout||!side||side.dataset.algebra2SupportCentered==="true")return;
  side.dataset.algebra2SupportCentered="true";
  side.classList.add("algebra2-support-grid");
  layout.classList.add("algebra2-centered-layout");

  if(!document.getElementById("algebra2-support-grid-v1")){
    const style=document.createElement("style");
    style.id="algebra2-support-grid-v1";
    style.textContent=`
.lesson-layout.algebra2-centered-layout{
  display:grid!important;
  grid-template-columns:minmax(0,1fr)!important;
  gap:18px!important;
}
.lesson-side.algebra2-support-grid{
  position:static!important;
  top:auto!important;
  display:grid!important;
  grid-template-columns:repeat(3,minmax(0,1fr))!important;
  gap:14px!important;
  align-items:stretch!important;
}
.lesson-side.algebra2-support-grid>.card{
  min-width:0;
  text-align:center;
}
.lesson-side.algebra2-support-grid .actions{justify-content:center}
.lesson-side.algebra2-support-grid .btn{white-space:nowrap}
@media(max-width:900px){
  .lesson-side.algebra2-support-grid{grid-template-columns:1fr!important}
}
`;
    document.head.appendChild(style);
  }
}

function boot(){
  installReadableFloor();
  centerLessonSupport();
  document.documentElement.dataset.algebra2Presentation="unified-v1";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
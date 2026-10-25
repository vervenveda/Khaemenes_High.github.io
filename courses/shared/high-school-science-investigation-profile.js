/* Khaemenes High · Scientific Investigation Notebook profile bridge · v1 */
(()=>{
"use strict";
const NOTEBOOK="https://vervenveda.com/Khaemenes_High.github.io/courses/science/investigation-notebook/";
const SCIENCES=["integrated-science-9","biology-10","chemistry-11","physics-engineering-12"];
function grade(){const g=Number(document.body?.dataset?.grade);if(g>=9&&g<=12)return g;const m=location.pathname.match(/grade-(09|10|11|12)/i);return m?Number(m[1]):0}
function scienceId(href){const low=String(href||"").toLowerCase();return SCIENCES.find(id=>low.includes(id))||""}
function enhance(root=document){
 const hosts=[root.querySelector?.("#pinnedCoursesGrid"),root.querySelector?.("#upperClasses")].filter(Boolean);
 hosts.forEach(host=>host.querySelectorAll("a[href]").forEach(a=>{
  const id=scienceId(a.getAttribute("href"));if(!id)return;
  const card=a.closest("article,.lesson-card,.ug-card")||a.parentElement;if(!card||card.querySelector("[data-science-investigation-notebook]"))return;
  const target=card.querySelector(".actions,.ug-actions")||a.parentElement;
  const link=document.createElement("a");link.dataset.scienceInvestigationNotebook="true";link.className=a.className&&a.className.includes("btn")?a.className:"btn secondary";
  link.href=NOTEBOOK+"?grade="+encodeURIComponent(grade()||"")+"&course="+encodeURIComponent(id);link.textContent="Scientific Investigation Notebook";
  link.setAttribute("aria-label","Open the Scientific Investigation Notebook for this science course");link.title="Your four-year science research notebook";target.append(link);
 }));
}
function init(){enhance();if(typeof MutationObserver==="function"){const obs=new MutationObserver(()=>enhance());obs.observe(document.body,{childList:true,subtree:true})}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
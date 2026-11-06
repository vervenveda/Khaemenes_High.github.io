/* Khaemenes High School · 09/11/12 checkpoint disclosure.
 * Presentation only. One existing academic checkpoint node, moved not cloned.
 * Never creates or modifies course, mastery, habit or learner records.
 * Grade 10 retains its already approved local disclosure implementation.
 */
(()=>{"use strict";
const grade=String(document.body?.dataset.grade||(/\/grade-(09|11|12)\/student-profile\//.exec(location.pathname)||[])[1]||"").padStart(2,"0");
if(!["09","11","12"].includes(grade)||window.KhaemenesHighCheckpointsDisclosure)return;
const checkpointId=grade==="09"?"grade09AcademicCheckpoints":"upperGradeAcademicCheckpoints";
const node=document.getElementById(checkpointId);
if(!node)return;
const host=document.createElement("details");
host.id="khaeCheckpointsDisclosure";
host.className="khae-checkpoints-disclosure";
const summary=document.createElement("summary");
summary.textContent="Today's Class Checkpoints";
summary.setAttribute("aria-label","Expand or collapse today's sixteen class checkpoints");
host.append(summary);
const originalTitle=[...node.children].find(el=>el.matches?.("h2,h3"));
if(originalTitle)originalTitle.hidden=true;
host.append(node);
document.body.classList.add("khae-checkpoints-disclosure-enabled");
let observer=null;
function findSupport(){
 const headings=[...document.querySelectorAll("h2,h3,h4,div,span,p")]
  .filter(el=>el.children.length===0&&/^support free access$/i.test((el.textContent||"").trim()));
 for(const heading of headings){
  for(let candidate=heading.parentElement;candidate&&candidate!==document.body;candidate=candidate.parentElement){
   if(candidate.contains(host))continue;
   const copy=candidate.textContent||"";
   if(!/everything here is free/i.test(copy)||!/voluntary/i.test(copy))continue;
   if([...candidate.querySelectorAll("a,button")]
    .some(a=>/support with stripe|stripe/i.test((a.textContent||"")+" "+(a.getAttribute("href")||""))))
    return candidate;
  }
 }
 const fallback=document.querySelector(".grade09-contribute-panel");
 return fallback&&!fallback.contains(host)?fallback:null;
}
function place(){
 const support=findSupport();
 if(support?.parentElement){
  if(host.parentElement!==support.parentElement||host.nextElementSibling!==support)
   support.insertAdjacentElement("beforebegin",host);
  if(observer){observer.disconnect();observer=null;}
  return true;
 }
 // Until the support card loads, remain after the existing Explore section.
 const main=document.querySelector("main");
 const explore=main?.querySelector(":scope > #grade09Explore");
 if(explore&&(host.parentElement!==main||explore.nextElementSibling!==host))
  explore.insertAdjacentElement("afterend",host);
 else if(main&&!host.parentElement)main.append(host);
 return false;
}
function watch(){
 if(place()||observer)return;
 observer=new MutationObserver(()=>place());
 observer.observe(document.body,{childList:true,subtree:true});
}
window.KhaemenesHighCheckpointsDisclosure=Object.freeze({version:"1.0.0",place});
watch();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",watch,{once:true});
window.addEventListener("load",watch,{once:true});
window.addEventListener("pageshow",watch);
})();

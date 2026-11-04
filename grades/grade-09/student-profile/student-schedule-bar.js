/* Grade 09 persistent schedule rail: eight canonical subjects plus independent Quick Pins. */
(()=>{
"use strict";
const registry=window.KhaemenesGrade09Courses;
const pins=window.KhaemenesHighCoursePins;
const quick=window.KhaemenesGrade09QuickPins;
if(!registry||!pins)return;
const languages=[["spanish","Spanish"],["french","French"],["german","German"],["mandarin","Mandarin Chinese"],["japanese","Japanese"],["arabic","Arabic"],["russian","Russian"]];
const catalog=window.KhaemenesHighEightClass;
function language(){const value=pins.readLanguageChoices()["9"];return languages.some(([id])=>id===value)?value:""}
function slots(){return catalog?.slots(9,{mathId:registry.mathPathway()||null,language:language()})||[]}
function idFor(index){return slots()[index]?.id||null}
function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node}

const SCIENCE_NOTEBOOK="https://vervenveda.com/Khaemenes_High.github.io/courses/science/investigation-notebook/";
function addCourseActions(card,course,id,current,pinned){
 const actions=el("div","schedule-actions");
 const open=el("a","schedule-open",current?.actionLabel||"Open class");
 open.href=current?.url||course.home;
 open.dataset.launchCourse=id;
 open.addEventListener("click",()=>registry.recordLaunch(id,open.href.replace(location.origin,""),course.title));
 actions.append(open);
 const toggle=el("button","schedule-open schedule-secondary",pinned?"Unpin":"Pin Class");
 toggle.type="button";
 toggle.setAttribute("aria-pressed",String(pinned));
 toggle.setAttribute("aria-label",(pinned?"Unpin ":"Pin ")+course.title);
 toggle.addEventListener("click",()=>{
  if(registry.setPinned(id,!registry.isPinned(id))){
   window.dispatchEvent(new CustomEvent("khaemenes-course-pins-changed"));
   void renderAll();
  }
 });
 if(id==="integrated-science-9"){
  const notebook=el("a","schedule-open schedule-secondary","Scientific Notebook");
  notebook.href=SCIENCE_NOTEBOOK+"?grade=9&course="+encodeURIComponent(id);
  notebook.dataset.scienceInvestigationNotebook="true";
  notebook.setAttribute("aria-label","Open the Scientific Notebook for Integrated Science 9");
  notebook.title="Your four-year science research notebook";
  actions.append(notebook);
 }
 actions.append(toggle); // Pin/Unpin is the final, aligned bottom action on every course card.
 card.append(actions);
}

async function renderHost(host){
 host.replaceChildren();
 // The surrounding card already has the "My Schedule Bar" title and explanation.
 // Keep the live class/pin count without repeating the section heading.
 const intro=el("div","schedule-bar-head");
 const status=el("span","schedule-status");
 intro.append(status);host.append(intro);

 // Foreign-language selection remains on its dedicated profile/landing page.
 // Read its existing saved choice above; do not duplicate selectors inside this popup.
 const rail=el("div","schedule-rail");rail.setAttribute("aria-label","Eight academic classes");
 let pinnedCount=0;
 for(let index=0;index<slots().length;index++){
   const entry=slots()[index],subject=entry.label,id=idFor(index),course=id?registry.getCourse(id):null;
   if(!course){
     const card=el("article","schedule-tile");card.dataset.scheduleKind="class";
     const top=el("div","schedule-tile-top");
     top.append(el("span","schedule-number",String(index+1)),el("span","schedule-kind",subject));
     const info=el("div","schedule-course-info");
     info.append(el("h3","",entry.title),el("p","","Select a course before pinning this subject."));
     const actions=el("div","schedule-actions");
     const choose=el("a","schedule-open","Choose Course");choose.href="profile/";
     actions.append(choose);
     const unavailable=el("button","schedule-open schedule-secondary","Pin Class");
     unavailable.type="button";unavailable.disabled=true;
     unavailable.title="Choose a course before pinning it";
     actions.append(unavailable);
     card.append(top,info,actions);rail.append(card);
     continue;
   }
   const current=await registry.resolveContinueFor(id);
   const pinned=registry.isPinned(id);if(pinned)pinnedCount++;
   const card=el("article","schedule-tile");
   card.dataset.scheduleKind="class";
   const top=el("div","schedule-tile-top");
   top.append(el("span","schedule-number",String(index+1)),el("span","schedule-kind",subject));
   card.append(top);
   const info=el("div","schedule-course-info");
   info.append(el("h3","",course.title),el("p","",current?.detail||"Ready to open."));
   card.append(info);
   addCourseActions(card,course,id,current,pinned);
   rail.append(card);
 }
 host.append(rail);
 if(quick && quick.list().length){
   const quickSection=el("section","schedule-quick-section");
   quickSection.setAttribute("aria-label","Personal Quick Pins");
   quickSection.append(el("h3","schedule-quick-title","Personal Quick Pins"));
   const quickGrid=el("div","schedule-quick-grid");
   for(const resource of quick.list()){
     const card=el("article","schedule-tile schedule-quick");
     card.dataset.scheduleKind="quick";
     const top=el("div","schedule-tile-top");
     top.append(el("span","schedule-number",resource.mark||"✦"),el("span","schedule-kind",resource.category||"Quick Pin"));
     const star=el("button","schedule-pin","★");star.type="button";star.title="Remove Quick Pin";star.setAttribute("aria-label","Remove "+resource.title+" from Quick Pins");star.setAttribute("aria-pressed","true");
     star.addEventListener("click",()=>{quick.setPinned(resource.id,false);renderAll()});
     top.append(star);card.append(top);
     card.append(el("h3","",resource.title),el("p","",resource.subtitle||"Personal shortcut"));
     const link=el("a","schedule-open","Open");link.href=resource.href;card.append(link);quickGrid.append(card);
   }
   quickSection.append(quickGrid);
   host.append(quickSection);
 }
 const quickCount=quick?.list?.().length||0;
 status.textContent=`${pinnedCount} of 8 classes pinned · ${quickCount} Quick Pin${quickCount===1?"":"s"}`;
}
async function renderAll(){
 const hosts=[...document.querySelectorAll("[data-grade09-schedule-bar]")];
 await Promise.all(hosts.map(renderHost));
}
window.KhaemenesGrade09ScheduleBar=Object.freeze({render:renderAll});
window.addEventListener("storage",event=>{
 const key=String(event.key||"");
 if(registry.shouldRefreshForStorageKey(key)||key.includes("khaemenes-high-language-choices-v1")||key.includes("khaemenes-grade09-quick-pins-v1"))void renderAll();
});
window.addEventListener("khaemenes-grade09-quick-pins-changed",()=>void renderAll());
window.addEventListener("khaemenes-course-pins-changed",()=>void renderAll());
window.addEventListener("khaemenes-grade09-language-changed",()=>void renderAll());
void renderAll();
})();

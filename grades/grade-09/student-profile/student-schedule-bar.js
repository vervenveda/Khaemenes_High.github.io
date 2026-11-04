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
 const mentor=el("a","schedule-open schedule-secondary","Ask Mentor");
 mentor.href=registry.mentorFor(id);
 actions.append(mentor);
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
 actions.append(toggle);
 if(id==="integrated-science-9"){
  const notebook=el("a","schedule-open schedule-secondary","Scientific Notebook");
  notebook.href=SCIENCE_NOTEBOOK+"?grade=9&course="+encodeURIComponent(id);
  notebook.dataset.scienceInvestigationNotebook="true";
  notebook.setAttribute("aria-label","Open the Scientific Notebook for Integrated Science 9");
  notebook.title="Your four-year science research notebook";
  actions.append(notebook);
 }
 card.append(actions);
}

async function renderHost(host){
 host.replaceChildren();
 const intro=el("div","schedule-bar-head");
 const copy=el("div");
 copy.append(el("strong","","My Schedule"),el("span","","Eight classes stay academic. Quick Pins are personal shortcuts and do not change enrollment, grades, or mastery."));
 const status=el("span","schedule-status");
 intro.append(copy,status);host.append(intro);

 // Keep the foreign-language choice available on the dashboard itself.
 // Previously this selector existed only in My Profile, so the schedule tile
 // looked fixed even though the learner was allowed to choose a language.
 const controls=el("div","schedule-choice-row");
 controls.style.cssText="display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin:12px 0 16px";
 const langLabel=el("label","schedule-language-label","Foreign language");
 langLabel.setAttribute("for","grade09DashboardLanguageChoice");
 const langSelect=el("select","schedule-language-select");
 langSelect.id="grade09DashboardLanguageChoice";
 langSelect.setAttribute("aria-label","Choose Grade 09 foreign language");
 const placeholder=el("option","","Choose a language");placeholder.value="";langSelect.append(placeholder);
 languages.forEach(([value,label])=>{
   const option=el("option","",label);
   option.value=value;
   langSelect.append(option);
 });
 langSelect.value=language();
 langSelect.addEventListener("change",()=>{
   const previous=language();
   const choices=pins.readLanguageChoices();
   choices["9"]=langSelect.value;
   if(!pins.writeLanguageChoices(choices)){
     langSelect.value=previous;
     status.textContent="Language choice could not be saved on this device.";
     return;
   }
   const oldId="world-language-9-"+previous;
   const nextId="world-language-9-"+langSelect.value;
   if(registry.isPinned(oldId)){
     registry.setPinned(oldId,false);
     registry.setPinned(nextId,true);
   }
   window.dispatchEvent(new CustomEvent("khaemenes-grade09-language-changed",{detail:{grade:"9",language:langSelect.value}}));
   void renderAll();
 });
 langLabel.append(langSelect);
 controls.append(langLabel);
 const profileLink=el("a","schedule-open","Language details");
 profileLink.href="profile/";
 controls.append(profileLink);
 host.append(controls);

 const rail=el("div","schedule-rail");rail.setAttribute("aria-label","Eight academic classes");
 let pinnedCount=0;
 for(let index=0;index<slots().length;index++){
   const entry=slots()[index],subject=entry.label,id=idFor(index),course=id?registry.getCourse(id):null;
   if(!course){
     const card=el("article","schedule-tile");card.dataset.scheduleKind="class";
     const top=el("div","schedule-tile-top");
     top.append(el("span","schedule-number",String(index+1)),el("span","schedule-kind",subject));
     card.append(top,el("h3","",entry.title),el("p","","Select a course before pinning this subject."));
     const choose=el("a","schedule-open","Choose course");choose.href="profile/";card.append(choose);rail.append(card);
     continue;
   }
   const current=await registry.resolveContinueFor(id);
   const pinned=registry.isPinned(id);if(pinned)pinnedCount++;
   const card=el("article","schedule-tile");
   card.dataset.scheduleKind="class";
   const top=el("div","schedule-tile-top");
   top.append(el("span","schedule-number",String(index+1)),el("span","schedule-kind",subject));
   const star=el("button","schedule-pin",pinned?"★":"☆");star.type="button";star.title=pinned?"Unpin class":"Pin class";star.setAttribute("aria-label",(pinned?"Unpin ":"Pin ")+course.title);star.setAttribute("aria-pressed",String(pinned));
   star.addEventListener("click",()=>{registry.setPinned(id,!registry.isPinned(id));renderAll()});
   top.append(star);card.append(top);
   card.append(el("h3","",course.title));
   card.append(el("p","",current?.detail||"Ready to open."));
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

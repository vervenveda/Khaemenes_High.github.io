/* Grade 09 persistent schedule rail: seven academic slots plus learner Quick Pins. */
(()=>{
"use strict";
const registry=window.KhaemenesGrade09Courses;
const pins=window.KhaemenesHighCoursePins;
const quick=window.KhaemenesGrade09QuickPins;
if(!registry||!pins)return;
const languages=[["spanish","Spanish"],["french","French"],["german","German"],["mandarin","Mandarin Chinese"],["japanese","Japanese"],["arabic","Arabic"],["russian","Russian"]];
const slots=[["Mathematics",null],["Literature","english-9"],["Social Studies","global-studies-9"],["Science","integrated-science-9"],["Physical Education","physical-education-9"],["Foreign Language",null],["Psychology","psychology-101"]];
function language(){const value=pins.readLanguageChoices()["9"];return languages.some(([id])=>id===value)?value:"spanish"}
function idFor(index){return index===0?(registry.mathPathway()||"pre-algebra"):index===5?"world-language-9-"+language():slots[index][1]}
function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node}
async function renderHost(host){
 host.replaceChildren();
 const intro=el("div","schedule-bar-head");
 const copy=el("div");
 copy.append(el("strong","","My Schedule"),el("span","","Seven classes stay academic. Quick Pins are personal shortcuts and do not change enrollment, grades, or mastery."));
 const status=el("span","schedule-status");
 intro.append(copy,status);host.append(intro);
 const rail=el("div","schedule-rail");rail.setAttribute("aria-label","Grade 09 schedule");
 let pinnedCount=0;
 for(let index=0;index<slots.length;index++){
   const subject=slots[index][0],id=idFor(index),course=registry.getCourse(id);
   if(!course)continue;
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
   const link=el("a","schedule-open",current?.actionLabel||"Open class");link.href=current?.url||course.home;link.dataset.launchCourse=id;
   link.addEventListener("click",()=>registry.recordLaunch(id,link.href.replace(location.origin,""),course.title));
   card.append(link);rail.append(card);
 }
 if(quick){
   for(const resource of quick.list()){
     const card=el("article","schedule-tile schedule-quick");
     card.dataset.scheduleKind="quick";
     const top=el("div","schedule-tile-top");
     top.append(el("span","schedule-number",resource.mark||"✦"),el("span","schedule-kind",resource.category||"Quick Pin"));
     const star=el("button","schedule-pin","★");star.type="button";star.title="Remove Quick Pin";star.setAttribute("aria-label","Remove "+resource.title+" from Quick Pins");star.setAttribute("aria-pressed","true");
     star.addEventListener("click",()=>{quick.setPinned(resource.id,false);renderAll()});
     top.append(star);card.append(top);
     card.append(el("h3","",resource.title),el("p","",resource.subtitle||"Personal shortcut"));
     const link=el("a","schedule-open","Open");link.href=resource.href;card.append(link);rail.append(card);
   }
 }
 host.append(rail);
 const quickCount=quick?.list?.().length||0;
 status.textContent=`${pinnedCount} of 7 classes pinned · ${quickCount} Quick Pin${quickCount===1?"":"s"}`;
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
void renderAll();
})();

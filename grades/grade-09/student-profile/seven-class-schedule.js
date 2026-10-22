/* Grade 09 seven-class schedule. Uses existing learner-scoped pins; never writes grades. */
(()=>{
"use strict";
const registry=window.KhaemenesGrade09Courses;
const pins=window.KhaemenesHighCoursePins;
const host=document.getElementById("grade09SevenClassSchedule");
if(!registry||!pins||!host)return;
const languages=[["spanish","Spanish"],["french","French"],["german","German"],["mandarin","Mandarin Chinese"],["japanese","Japanese"],["arabic","Arabic (exploration)"],["russian","Russian (exploration)"]];
const slots=[["Mathematics",null],["Literature","english-9"],["Social Studies","global-studies-9"],["Science","integrated-science-9"],["Physical Education","physical-education-9"],["Foreign Language",null],["Psychology","psychology-101"]];
const firstLessons={
 "pre-algebra":"courses/mathematics/pre-algebra/diagnostic/",
 "algebra-1":"courses/mathematics/algebra-1/diagnostic/",
 "english-9":"courses/language-arts/english-9/weeks/week-01/day-01/",
 "global-studies-9":"courses/social-studies/grade-09/week-01/student-packet.html",
 "integrated-science-9":"courses/science/integrated-science-9/units/unit-01/lessons/day-01.html",
 "physical-education-9":"courses/physical-education/",
 "psychology-101":"electives/grades/grade-09/psych-101/lessons/week-01/day-01.html"
};
function repositoryRoot(){const at=location.pathname.indexOf("/grades/grade-09/");return at<0?"/":location.pathname.slice(0,at+1)}
const languageStarts={
 spanish:"apps/language-worlds/spanish/foundation-01.html",
 french:"apps/French_101_index.html",
 german:"apps/German_hub_index.html",
 mandarin:"apps/language-worlds/mandarin/foundation-01.html",
 japanese:"apps/language-worlds/japanese/foundation-01.html",
 arabic:"Halls/courses/arabic-1/week-01/",
 russian:"Halls/courses/russian-1/week-01/"
};
function languageStart(id){const code=id.replace("world-language-9-","");return languageStarts[code]?"https://vervenveda.github.io/Khaemenes_Linguistics.github.io/"+languageStarts[code]:null}
function firstLessonFor(id){const route=firstLessons[id];return route?repositoryRoot()+route:null}
const el=(tag,txt)=>{const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;return e};
function language(){const value=pins.readLanguageChoices()["9"];return languages.some(([id])=>id===value)?value:"spanish"}
function idFor(index){return index===0?(registry.mathPathway()||"pre-algebra"):index===5?"world-language-9-"+language():slots[index][1]}
function render(){
 host.replaceChildren();
 const intro=el("p","Your seven Grade 09 classes. Pin the classes you study; choices are saved for the selected learner on this device. Course mastery and assessments remain independent.");
 host.append(intro);
 const config=el("div");config.style.cssText="display:flex;flex-wrap:wrap;gap:14px;margin:16px 0";
 const mathLabel=el("label","Mathematics pathway ");
 const math=el("select");math.setAttribute("aria-label","Choose current math pathway");
 [["","Use existing placement"],["pre-algebra","Pre-Algebra"],["algebra-1","Algebra I"]].forEach(([v,t])=>{let o=el("option",t);o.value=v;math.append(o)});
 math.value=registry.mathPathway()||"";
 math.addEventListener("change",()=>{if(math.value){registry.setMathPathway(math.value,{pin:true})}render()});
 mathLabel.append(math);config.append(mathLabel);
 const langLabel=el("label","Foreign language ");
 const select=el("select");select.setAttribute("aria-label","Choose Grade 09 foreign language");
 languages.forEach(([v,t])=>{let o=el("option",t);o.value=v;select.append(o)});
 select.value=language();
 select.addEventListener("change",()=>{
  const old="world-language-9-"+language(),next="world-language-9-"+select.value;
  const choices=pins.readLanguageChoices();choices["9"]=select.value;
  if(!pins.writeLanguageChoices(choices)){alert("Language choice could not be saved on this device.");return}
  if(registry.isPinned(old)){registry.setPinned(old,false);registry.setPinned(next,true)}
  render();
 });
 langLabel.append(select);config.append(langLabel);host.append(config);
 const list=el("div");list.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:12px";
 slots.forEach(([subject],index)=>{
  const id=idFor(index),course=registry.getCourse(id);
  const card=el("article");card.style.cssText="border:1px solid #c6b99e;border-radius:7px;padding:16px;background:rgba(255,255,255,.06)";
  const title=el("h3",(index+1)+". "+subject);title.style.cssText="font-size:19px;margin:0 0 7px";
  card.append(title,el("p",course?.title||"Choose a course"));
  if(course){
   const link=el("a","Open class");link.href=course.home;link.style.cssText="display:inline-block;margin-right:12px;text-decoration:underline";
   const button=el("button",registry.isPinned(id)?"★ Pinned":"☆ Pin class");button.type="button";button.setAttribute("aria-pressed",String(registry.isPinned(id)));
   button.addEventListener("click",()=>{registry.setPinned(id,!registry.isPinned(id));render()});
   card.append(link,button);
   const first=firstLessonFor(id);
   if(first){const start=el("a",id==="physical-education-9"?"Open PE learning hall":id==="pre-algebra"||id==="algebra-1"?"Start mathematics readiness":"Week 01 · First lesson");start.href=first;start.style.cssText="display:inline-block;margin-right:12px;text-decoration:underline";card.append(start)}
   else if(id.startsWith("world-language-9-")){const target=languageStart(id);if(target){const a=el("a",["french","german"].includes(id.replace("world-language-9-",""))?"Open language course":"Week 01 · Language lesson");a.href=target;card.append(a)}else card.append(el("p","Open Linguistics Halls to select the appropriate first-language lesson."));}
  }
  list.append(card);
 });
 host.append(list);
 const setup=el("button","Pin all seven classes");
 setup.type="button";setup.style.cssText="margin-top:16px;padding:11px 16px;border-radius:7px";
 setup.addEventListener("click",()=>{
  let successful=0;
  for(let i=0;i<slots.length;i++){
   const id=idFor(i);
   if(registry.isPinned(id)||registry.setPinned(id,true))successful++;
  }
  render();
  const feedback=document.getElementById("grade09ScheduleSaveStatus");
  if(feedback)feedback.textContent=successful===7?"Seven classes pinned for this learner. Open Daily Lessons to begin.":"Some classes could not be saved. Check available browser storage and the active learner.";
 });
 host.append(setup);
 const status=el("p",slots.filter((_,i)=>registry.isPinned(idFor(i))).length+" of 7 classes pinned");status.setAttribute("role","status");status.style.marginTop="12px";status.id="grade09ScheduleSaveStatus";host.append(status);
}
render();
window.addEventListener("storage",()=>render());
})();

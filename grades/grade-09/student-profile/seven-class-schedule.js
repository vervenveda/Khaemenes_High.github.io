/* Grade 09 seven-class schedule. Uses existing learner-scoped pins; never writes grades. */
(()=>{
"use strict";
const registry=window.KhaemenesGrade09Courses;
const pins=window.KhaemenesHighCoursePins;
const host=document.getElementById("grade09SevenClassSchedule");
if(!registry||!pins||!host)return;
const languages=[["spanish","Spanish"],["french","French"],["german","German"],["mandarin","Mandarin Chinese"],["japanese","Japanese"],["arabic","Arabic"],["russian","Russian"]];
const slots=[["Mathematics",null],["Literature","english-9"],["Social Studies","global-studies-9"],["Science","integrated-science-9"],["Physical Education","physical-education-9"],["Foreign Language",null],["Psychology","psychology-101"]];
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
  }
  list.append(card);
 });
 host.append(list);
 const status=el("p",slots.filter((_,i)=>registry.isPinned(idFor(i))).length+" of 7 classes pinned");status.setAttribute("role","status");status.style.marginTop="12px";host.append(status);
}
render();
window.addEventListener("storage",()=>render());
})();

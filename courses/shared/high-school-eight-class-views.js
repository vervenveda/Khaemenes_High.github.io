/* High School eight-class views: student pin controls and permission-checked
 * family read-only snapshots. All displays use one catalog and the existing
 * learner-scoped pin storage; no lesson, enrollment or grading mutations.
 * Works across the High School front hall and Academy Family Learning Center.
 */
(()=>{"use strict";
if(window.KhaemenesHighEightClassViews)return;
const plan=window.KhaemenesHighEightClass;
const pin=window.KhaemenesHighCoursePins;
const family=window.KhaemenesFamilyRegistry;
if(!plan||!pin||!family)return;
const css={
 section:"box-sizing:border-box;width:100%;max-width:100%;padding:15px;margin:16px 0;border:1px solid #ae976e;border-radius:7px;background:#fbf8ef;color:#243038;text-align:left",
 h:"margin:0 0 6px;color:#243038;font:400 23px/1.3 Cinzel,Georgia,serif",
 p:"margin:4px 0 12px;color:#344842;font:400 16px/1.5 Nunito,Arial,sans-serif",
 list:"display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:8px",
 tile:"box-sizing:border-box;min-width:0;padding:11px;border:1px solid #bfb49d;border-radius:7px;background:#fffdf8",
 button:"box-sizing:border-box;min-height:44px;padding:8px 12px;border:1px solid #354849;border-radius:7px;background:#283c3d;color:#fff8e9;font:400 16px/1.3 Nunito,Arial,sans-serif;cursor:pointer",
 link:"color:#244e60;font:400 16px/1.4 Nunito,Arial,sans-serif;text-decoration:underline"
};
function create(tag,value,style){const node=document.createElement(tag);if(value!==undefined)node.textContent=value;if(style)node.style.cssText=style;return node}
function parseJSON(raw,fallback){try{const value=raw?JSON.parse(raw):fallback;return value??fallback}catch{return fallback}}
function scopedRead(base,id,fallback){
 if(!id)return fallback;
 try{return parseJSON(localStorage.getItem(pin.scopedKey(base,id)),fallback)}catch{return fallback}
}
function active(){
 const id=family.activeIds?.().learnerId;
 const student=id?family.getLearner?.(id):null;
 if(!student||student.learnerId!==id||student.stage!=="high"||!plan.gradeOf(student.grade))return null;
 if(pin.activeLearner?.()!==id)return null;
 return student;
}
function adultCanSee(id){
 const adult=family.getAdult?.(),learner=family.getLearner?.(id);
 return !!(adult&&learner&&family.canAdult?.(adult.adultId,id,"progress.view"));
}
function cleanPins(id){
 const local=scopedRead(pin.PIN_KEY,id,[]);
 const items=Array.isArray(local)?local.slice():[];
 // Existing Academy mirror may contain a valid high-school pin that was
 // saved on a different Academy page. Read it, never rewrite it here.
 const academy=parseJSON(localStorage.getItem(pin.ACADEMY_PIN_KEY),{});
 const mirror=academy?.learners?.[id];
 if(Array.isArray(mirror))for(const item of mirror){
  const key=typeof item==="string"?item:(item?.courseId||item?.id);
  if(pin.COURSE_META[key])items.push(key);
 }
 return [...new Set(items.filter(id=>typeof id==="string"&&pin.COURSE_META[id]))];
}
function stateFor(student){
 const grade=plan.gradeOf(student.grade),id=student.learnerId,pinned=cleanPins(id);
 const languageValues=scopedRead(pin.LANGUAGE_KEY,id,{});
 let language=typeof languageValues?.[grade]==="string"?languageValues[grade]:null;
 if(grade==="9"){
  const pinnedLanguages=pinned.filter(k=>k.startsWith("world-language-9-"));
  if(pinnedLanguages.length===1)language=pinnedLanguages[0].slice("world-language-9-".length);
 }
 const mathChoice=scopedRead("khaemenes-high-math-pathway-v1",id,null);
 const selectedMath=grade==="9"?(["pre-algebra","algebra-1"].includes(mathChoice)?mathChoice:
  (pinned.filter(k=>k==="pre-algebra"||k==="algebra-1").length===1?pinned.find(k=>k==="pre-algebra"||k==="algebra-1"):null)):null;
 return plan.summary(grade,pinned,{mathId:selectedMath,language:language});
}
function cardFor(entry,student,editable){
 const box=create("article",undefined,css.tile);
 const name=create("strong",entry.index+". "+entry.label,"display:block;color:#243038;font:400 17px/1.4 Cinzel,Georgia,serif");
 const info=create("p",entry.title,css.p);
 info.style.margin="6px 0";
 const summary=create("span",entry.pinned?"★ Pinned":"Not pinned","display:block;font:400 16px/1.45 Nunito,Arial,sans-serif;color:#344842;margin-bottom:6px");
 box.append(name,info,summary);
 if(entry.resourceOnly)box.append(create("p","Resource doorway while the grade-specific course is developed.",css.p));
 const row=create("div",undefined,"display:flex;flex-wrap:wrap;gap:7px;align-items:center");
 const grade=plan.gradeOf(student.grade),profileUrl="https://vervenveda.com/Khaemenes_High.github.io/grades/grade-"+String(grade).padStart(2,"0")+"/student-profile/";
 const link=create("a",entry.href?"Open":"Choose",css.link);
 link.href=entry.href||profileUrl+(grade==="9"?"profile/":"");
 row.append(link);
 if(editable){
  const button=create("button",entry.pinned?"Unpin":"Pin class",css.button);
  button.type="button";button.disabled=!entry.pinAvailable;
  button.setAttribute("aria-pressed",String(entry.pinned));
  button.setAttribute("aria-label",(entry.pinned?"Unpin ":"Pin ")+entry.label);
  button.addEventListener("click",()=>{
   const current=active();
   if(!current||current.learnerId!==student.learnerId||plan.gradeOf(current.grade)!==grade)return;
   const prior=pin.readPins();
   const next=entry.pinned?prior.filter(id=>id!==entry.id):[...prior,entry.id];
   if(!pin.writePins([...new Set(next)])){summary.textContent="Save unavailable; previous selection preserved.";return}
   render();
  });
  row.append(button);
 }
 box.append(row);
 return box;
}
// Collapsible by default: preserve compact High School and Family landing cards.
const expanded=new Set();
function panel(title,student,editable,readOnlyLabel){
 const state=stateFor(student),key=(editable?"student:":"family:")+student.learnerId;
 const section=create("details",undefined,css.section);
 section.setAttribute("aria-label",title);
 section.open=expanded.has(key);
 section.addEventListener("toggle",()=>{
  if(section.open)expanded.add(key);else expanded.delete(key);
 });
 const summary=create("summary",title+" · "+state.count+" of "+state.total+" pinned",
  "cursor:pointer;color:#243038;font:400 19px/1.5 Cinzel,Georgia,serif;min-height:44px;padding:7px 0");
 section.append(summary);
 section.append(create("p","Grade "+state.grade+
  (editable?" · Select a class to pin or unpin it.":readOnlyLabel||" · Read-only family view.")+
  " Pins are shortcuts, not enrollment, grades, or mastery.",css.p));
 const list=create("div",undefined,css.list);
 for(const entry of state.items)list.append(cardFor(entry,student,editable));
 section.append(list);
 return section;
}
function renderHigh(){
 const learner=active(),studentHost=document.getElementById("student-portal"),
       familyHost=document.getElementById("parent-portal");
 if(studentHost){
  let current=document.getElementById("highEightStudentSchedule");
  if(!current){current=create("div");current.id="highEightStudentSchedule";studentHost.querySelector("#profileSummary")?.insertAdjacentElement("afterend",current)}
  if(current){current.replaceChildren();if(learner)current.append(panel("My Eight Classes",learner,true));}
 }
 if(familyHost){
  let current=document.getElementById("highEightFamilySchedule");
  if(!current){current=create("div");current.id="highEightFamilySchedule";familyHost.querySelector(".portal-links")?.insertAdjacentElement("afterend",current)}
  if(current){
   current.replaceChildren();
   if(learner&&adultCanSee(learner.learnerId))current.append(panel("Family Eight-Class Snapshot",learner,false," · Family viewing permission confirmed."));
   else current.append(create("p","Class selections appear here only for an authorized adult and an active High School learner.",css.p));
  }
 }
}
function renderFamily(){
 const host=document.getElementById("familyApp");if(!host)return;
 let current=document.getElementById("familyHighEightClassSnapshot");
 if(!current){current=create("section");current.id="familyHighEightClassSnapshot";host.append(current)}
 current.replaceChildren();
 const people=family.getFamily?.()?.learners||[];
 const students=people.filter(person=>person&&person.stage==="high"&&plan.gradeOf(person.grade)&&adultCanSee(person.learnerId));
 if(!students.length)return;
 const heading=create("h2","High School · Eight-Class Overview",css.h);
 current.append(heading,create("p","Read-only learner-specific class pins. Only learners this adult may view are shown; no course records are modified.",css.p));
 for(const student of students)current.append(panel((student.nickname||"Learner")+" · Grade "+Number(student.grade),student,false));
}
function render(){renderHigh();renderFamily()}
window.KhaemenesHighEightClassViews=Object.freeze({render,stateFor,version:1});
for(const event of ["khaemenes-family-changed","khaemenes-learner-placement-changed",
 "khaemenes-course-pins-changed","khaemenes-grade09-language-changed",
 "khaemenes-upper-grade-language-changed","storage","pageshow"])
 window.addEventListener(event,render);
render();
})();
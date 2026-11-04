/* Grade 09 Student Daily Focus · eight schedule classes and two daily habits.
 * Self-reported checklist only; no enrollment, grades, or mastery changes.
 * Uses the exact existing Daily Lessons learner-scoped daily check record.
 */
(()=>{"use strict";
if(window.KhaemenesGrade09DailyFocus)return;
const card=document.getElementById("todayTitle")?.closest(".card");
const plan=window.KhaemenesHighEightClass,courses=window.KhaemenesGrade09Courses,
      pinStore=window.KhaemenesHighCoursePins,contract=window.KhaemenesCourseEntryContract;
if(!card||!plan||!courses||!pinStore||!contract)return;
const BASE="khaemenes-grade09-daily-checks-v1";
const today=()=>new Date().toISOString().slice(0,10);
const node=(tag,cls,text)=>{
 const n=document.createElement(tag);
 if(cls)n.className=cls;
 if(text!==undefined)n.textContent=text;
 return n;
};
function learner(){
 try{
  const p=contract.readAcademyProfile?.();
  if(!p?.learnerId||typeof contract.scopedKey!=="function")return null;
  const fromProfile=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
  if(fromProfile&&String(fromProfile)!==String(p.learnerId))return null;
  if(p.grade&&Number(p.grade)!==9)return null;
  return p;
 }catch{return null}
}
function read(p){
 if(!p)return {date:today(),items:{}};
 try{
  const obj=JSON.parse(localStorage.getItem(contract.scopedKey(BASE,p))||"null");
  return obj?.date===today()&&obj.items&&typeof obj.items==="object"&&!Array.isArray(obj.items)
   ?{date:today(),items:{...obj.items}}:{date:today(),items:{}};
 }catch{return {date:today(),items:{}}}
}
function save(p,key,val){
 if(!p||learner()?.learnerId!==p.learnerId)return false;
 const rec=read(p);rec.items[key]=!!val;
 try{localStorage.setItem(contract.scopedKey(BASE,p),JSON.stringify(rec));return true}
 catch{return false}
}
const root=node("div","grade09-daily-focus");root.id="grade09DailyFocus";
root.setAttribute("aria-label","Ten-item daily learning plan");
const title=node("h3","","My Daily Focus · Eight Classes");
const help=node("p","grade09-daily-focus-explanation",
 "Eight class checkpoints plus two daily habits. Check off your own focus activities; this is not an official assignment or mastery record.");
const status=node("p","grade09-daily-focus-count");
status.id="grade09DailyFocusCount";status.setAttribute("role","status");
const list=node("ol","grade09-daily-focus-list");list.id="grade09DailyFocusList";
const note=node("p","grade09-daily-focus-note",
 "Daily checks belong to the selected learner on this device. They do not modify class placement, grades, or completed lessons.");
root.append(title,help,status,list,note);
card.append(root);
let generation=0;
function recount(){
 let n=0;for(const item of list.children){if(item.querySelector("input[type=checkbox]")?.checked)n++}
 status.textContent=n+" of "+list.children.length+" daily focus items checked · personal planning only.";
}
function display(item,i,p,record){
 const row=node("li","grade09-daily-task");
 const index=node("span","grade09-daily-task-number",String(i+1).padStart(2,"0"));
 const label=node("label","grade09-daily-task-check");
 const checkbox=node("input");checkbox.type="checkbox";
 checkbox.checked=record.items[item.key]===true;
 checkbox.disabled=!p||!item.ready;
 checkbox.setAttribute("aria-label","Check daily focus: "+item.title);
 label.append(checkbox,node("span","grade09-daily-task-name",item.title));
 const detail=node("p","grade09-daily-task-detail",item.detail);
 const link=node("a","grade09-daily-task-link",item.action);
 link.href=item.href;
 if(item.id)link.addEventListener("click",()=>{
  if(learner()?.learnerId!==p?.learnerId)return;
  courses.recordLaunch?.(item.id,link.href,item.courseTitle);
  save(p,"open-first",true);
 });
 checkbox.addEventListener("change",()=>{
  if(!save(p,item.key,checkbox.checked)){
   checkbox.checked=!checkbox.checked;
   status.textContent="Could not save this check. Select a learner or check device storage.";
   return;
  }
  recount();
 });
 row.append(index,label,detail,link);list.append(row);
}
async function render(){
 const ticket=++generation,p=learner(),saved=read(p);
 let lang="";
 try{lang=pinStore.readLanguageChoices()?.["9"]||""}catch{}
 const slots=plan.slots(9,{mathId:courses.mathPathway()||null,language:lang});
 const items=[];
 for(const slot of slots){
  const course=slot.id?courses.getCourse(slot.id):null;
  let next=null;
  if(course)try{next=await courses.resolveContinueFor(slot.id)}catch{}
  const ready=!!course,pinned=ready&&courses.isPinned(slot.id);
  const actionTitle=ready?(slot.subject==="elective"?"Explore elective options":"Continue "+course.title)
    :slot.subject==="math"?"Choose mathematics pathway":slot.subject==="foreignLanguage"?"Choose foreign language":"Choose class";
  items.push({
   key:"focus-subject:"+slot.subject,id:course?.id,courseTitle:course?.title,
   title:slot.label+" · "+actionTitle,ready,
   detail:ready?(next?.detail||(pinned?"Pinned to your schedule.":"Ready to open; pin for quicker access.")):
     "Select this subject's course before checking it.",
   href:next?.url||course?.home||"profile/",
   action:ready?(next?.actionLabel||"Open class"):"Choose class"
  });
 }
 items.push(
  {key:"open-first",title:"Open your first class",ready:true,
   detail:"Choose a starting class. This syncs with the existing Daily Lessons checklist.",
   href:"daily-lessons/",action:"Open Daily Lessons"},
  {key:"saved-note",title:"Save today's learning note",ready:true,
   detail:"Capture what you learned or what needs attention. This syncs with your Daily Lessons note.",
   href:"daily-lessons/#todaysNote",action:"Write note"}
 );
 if(ticket!==generation)return;
 list.replaceChildren();
 items.forEach((item,i)=>display(item,i,p,saved));
 recount();
 if(!p)status.textContent="Select an Academy learner to save checks. Ten focus items are available for preview.";
}
window.KhaemenesGrade09DailyFocus=Object.freeze({render,version:1});
for(const event of ["khaemenes-course-pins-changed","khaemenes-grade09-language-changed",
 "khaemenes-student-profile-changed","pageshow"])
 window.addEventListener(event,()=>void render());
window.addEventListener("storage",event=>{
 const key=String(event.key||"");
 if(!key||key.includes("khaemenes-grade09")||key.includes("khaemenes-high")||
  key.includes("khaemenes_active_learner")||key.includes("khaemenes_family_registry"))void render();
});
void render();
})();
/* Khaemenes High · Grade 12 Senior-Year Success & Beyond
   Personal planning only: no credits, verified mastery, graduation clearance,
   public publication, yearbook upload, or backend write.
   Local browser data is NOT an authenticated private vault.
*/
(()=>{"use strict";
if(document.body?.dataset.grade!=="12"||window.KhaemenesGrade12SeniorSuccess)return;
const main=document.querySelector("main"),context=window.KhaemenesHighProfileGradeContext;
const profile=window.KhaemenesStudentProfileV2;
if(!main||!context)return;
const PREFIX="khaemenes-grade12-senior-success-v1:learner:";
const DRAFT="khaemenes-grade12-senior-success-draft-v1:learner:";
const tasks=[
 ["courseReview","Review each current course and outstanding work"],
 ["assessmentReview","Review remaining assessments with the official course records"],
 ["portfolioReview","Select final work for my Student Portfolio"],
 ["graduationQuestion","Write down graduation questions for authorized school staff"],
 ["capstonePlan","Prepare my Senior Capstone question and milestones"],
 ["nextChapter","Explore possible pathways beyond high school"],
 ["transition","Create a personal transition checklist"],
 ["legacy","Select memories and accomplishments to reflect upon"]
];
const fields=[
 ["capstoneQuestion","Senior Capstone question or project idea",500],
 ["capstoneMilestones","Project milestones and next steps",1600],
 ["capstoneSources","Research notes and source references",2000],
 ["capstoneReflection","Final presentation or reflection ideas",1600],
 ["pathways","Paths I want to explore",1600],
 ["applications","Opportunities, application tasks, and deadlines I entered",1600],
 ["transition","My personal next-chapter checklist",1600],
 ["legacy","Achievements, memories, and senior-year reflections",2000]
];
const make=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const host=document.getElementById("grade12SeniorSuccess")||make("section","khae-senior-success");
host.id="grade12SeniorSuccess";host.classList.add("khae-senior-success");
host.setAttribute("aria-labelledby","grade12SeniorSuccessTitle");
host.replaceChildren();
host.append(make("p","khae-senior-eyebrow","Grade 12 · Senior-Year Development"));
const title=make("h2","","Senior-Year Success & Beyond");title.id="grade12SeniorSuccessTitle";host.append(title);
host.append(make("p","khae-senior-intro","Plan your graduation year, prepare a capstone, explore your next chapter, and preserve your favorite memories. This is your personal workspace—not an official graduation decision."));
const status=make("p","khae-senior-status");status.setAttribute("role","status");status.setAttribute("aria-live","polite");host.append(status);
const grid=make("div","khae-senior-grid");host.append(grid);
function panel(name,description){
 const box=make("section","khae-senior-card");
 box.append(make("h3","",name),make("p","",description));
 grid.append(box);return box;
}
const readiness=panel("Graduation Readiness","Personal reminders only. Course credits, exam results, and graduation clearance must come from authorized Academy records.");
const tally=make("p","khae-senior-count");tally.setAttribute("aria-live","polite");readiness.append(tally);
const checks=make("div","khae-senior-checklist");readiness.append(checks);
const boxes=new Map();
for(const [id,label] of tasks){
 const row=make("label","khae-senior-check"),input=make("input");input.type="checkbox";
 row.append(input,make("span","",label));checks.append(row);boxes.set(id,input);
}
const capstone=panel("Senior Capstone & Portfolio","Shape a meaningful final project and prepare work you may choose to place in your official Student Portfolio.");
const chapter=panel("My Next Chapter","Explore Higher Learning, apprenticeships, careers, entrepreneurship, and independent study. These choices remain yours.");
const legacy=panel("My Senior Legacy","Keep private reflections and meaningful achievements. Nothing is automatically posted to the Yearbook or shared.");
const areas=new Map();
for(const [key,label,limit] of fields){
 const card=key.startsWith("capstone")?capstone:["pathways","applications","transition"].includes(key)?chapter:legacy;
 const wrapper=make("label","khae-senior-field"),area=make("textarea");
 area.rows=key==="legacy"?5:3;area.maxLength=limit;area.setAttribute("aria-label",label);
 wrapper.append(make("span","",label),area);card.append(wrapper);areas.set(key,area);
}
const portfolio=make("a","khae-senior-link","Open Student Portfolio");
portfolio.href="../../../portfolio/index.html";capstone.append(portfolio);
const yearbook=make("a","khae-senior-link","Open Academy Yearbook");
yearbook.href="https://vervenveda.com/Academy-Yearbook.github.io/";
yearbook.target="_blank";yearbook.rel="noopener noreferrer";legacy.append(yearbook);
const footer=make("div","khae-senior-footer");
const save=make("button","khae-senior-save","Save my senior-year plans");save.type="button";
const clear=make("button","khae-senior-clear","Clear local plans");clear.type="button";
const saveStatus=make("span","khae-senior-save-status");saveStatus.setAttribute("role","status");
footer.append(save,clear,saveStatus);host.append(footer);
host.append(make("p","khae-senior-privacy","Saved notes remain in this browser, where other people using the same browser profile may be able to access them. In-tab drafts are temporary. This workspace is not an official academic record."));
let activeId=null,baseline="",dirty=false;
function learner(){
 const c=context.active?.(),p=profile?.activeLearner?.();
 if(!c||c.gradeNumber!==12||typeof c.learnerId!=="string"||!c.learnerId||!p)return null;
 return String(p.learnerId)===c.learnerId?c.learnerId:null;
}
const storeKey=id=>PREFIX+encodeURIComponent(id),draftKey=id=>DRAFT+encodeURIComponent(id);
function read(key,id,kind){
 try{
  const raw=(kind==="draft"?sessionStorage:localStorage).getItem(key(id));
  const obj=JSON.parse(raw||"null");
  return obj?.version===1&&obj.grade===12&&obj.learnerId===id?obj:null;
 }catch{return null}
}
function snapshot(id){
 return {version:1,grade:12,learnerId:id,
  checks:Object.fromEntries([...boxes].map(([key,input])=>[key,input.checked])),
  ...Object.fromEntries(fields.map(([key,,limit])=>[key,areas.get(key).value.slice(0,limit)]))};
}
function normalized(item){
 return JSON.stringify({checks:Object.fromEntries(tasks.map(([key])=>[key,Boolean(item?.checks?.[key])])),
  ...Object.fromEntries(fields.map(([key])=>[key,typeof item?.[key]==="string"?item[key]:""]))});
}
function updateTally(){tally.textContent=[...boxes.values()].filter(input=>input.checked).length+" of "+tasks.length+" personal planning steps selected — not graduation clearance."}
function keepDraft(id){
 if(!id||learner()!==id)return false;
 try{sessionStorage.setItem(draftKey(id),JSON.stringify(snapshot(id)));return true}
 catch{return false}
}
function track(){
 if(!activeId||learner()!==activeId)return;
 dirty=normalized(snapshot(activeId))!==baseline;save.disabled=!dirty;
 saveStatus.textContent=dirty?(keepDraft(activeId)?"Unsaved draft retained in this tab.":"Unsaved changes; draft storage unavailable."):"All changes saved.";
}
function refresh(){
 const id=learner();
 if(id===activeId&&dirty)return; // preserve active writing on profile notifications
 activeId=id;const saved=id?read(storeKey,id,"saved"):null;
 const draft=id?read(draftKey,id,"draft"):null;
 const value=draft||saved;
 for(const [key,input] of boxes){input.checked=Boolean(value?.checks?.[key]);input.disabled=!id}
 for(const [key,area] of areas){area.value=typeof value?.[key]==="string"?value[key]:"";area.disabled=!id}
 baseline=normalized(saved);dirty=Boolean(draft&&normalized(draft)!==baseline);
 save.disabled=!id||!dirty;clear.disabled=!id;
 updateTally();
 saveStatus.textContent=!id?"":dirty?"Unsaved draft restored from this tab.":saved?"Saved plans loaded.":"No saved plans yet.";
 status.textContent=id?"Planning for the selected Grade 12 learner. Your official academic records remain separate.":"Select your registered Grade 12 learner to edit or save personal plans. Visitors may explore the section.";
 if(id&&!dirty&&draft)try{sessionStorage.removeItem(draftKey(id))}catch{}
}
save.addEventListener("click",()=>{
 const id=learner();if(!id||id!==activeId){refresh();return}
 const doc={...snapshot(id),updatedAt:new Date().toISOString()};
 try{
  if(learner()!==id)return;
  localStorage.setItem(storeKey(id),JSON.stringify(doc));
  try{sessionStorage.removeItem(draftKey(id))}catch{}
  baseline=normalized(doc);dirty=false;save.disabled=true;
  saveStatus.textContent="Saved "+new Date(doc.updatedAt).toLocaleString();
  status.textContent="Personal Grade 12 plans saved on this browser. No course or graduation record was changed.";
 }catch{saveStatus.textContent="Save failed; draft retained in this tab where supported."}
});
clear.addEventListener("click",()=>{
 const id=learner();if(!id||id!==activeId)return;
 if(!window.confirm("Delete this learner's saved senior-year plans and in-tab draft from this browser? This cannot be undone."))return;
 if(learner()!==id)return;
 try{localStorage.removeItem(storeKey(id));sessionStorage.removeItem(draftKey(id))}
 catch{status.textContent="Unable to clear this browser's local plans.";return}
 activeId=null;dirty=false;refresh();
 status.textContent="Local plans cleared for the selected learner.";
});
for(const input of [...boxes.values()])input.addEventListener("change",()=>{updateTally();track()});
for(const area of areas.values())area.addEventListener("input",track);
window.addEventListener("beforeunload",e=>{
 if(!dirty||!activeId||learner()!==activeId)return;
 keepDraft(activeId);e.preventDefault();e.returnValue="";
});
function place(){
 const rooms=document.getElementById("studentRoomsAfterPortfolio");
 const portfolio=main.querySelector('aside[aria-label="Student Learning Portfolio"]');
 const anchor=rooms?.parentElement===main?rooms:portfolio?.parentElement===main?portfolio:null;
 if(anchor&&host.previousElementSibling!==anchor)anchor.insertAdjacentElement("afterend",host);
 else if(!host.isConnected)main.append(host);
}
place();refresh();
for(const event of ["pageshow","khaemenes-family-changed","khaemenes-student-profile-changed"])
 window.addEventListener(event,()=>{place();refresh()});
window.addEventListener("storage",e=>{
 if(!e.key||e.key.includes("learner")||e.key.includes("family_registry")||e.key.startsWith(PREFIX))refresh();
});
window.KhaemenesGrade12SeniorSuccess=Object.freeze({version:"1.0.0",refresh});
})();
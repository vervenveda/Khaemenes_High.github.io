/* Khaemenes High · Grade 11 Junior-Year Planning v1.
 * Optional local planning only; never credits, mastery, enrollment or transcripts.
 * Fails closed on absent/mismatched learner identity. No network writes.
 */
(()=>{"use strict";
if(document.body?.dataset.grade!=="11"||window.KhaemenesGrade11JuniorPlanning)return;
const ctxApi=window.KhaemenesHighProfileGradeContext;
const profile=window.KhaemenesStudentProfileV2;
const main=document.querySelector("main");
if(!main||!ctxApi)return;
const KEY="khaemenes-grade11-junior-planning-v1:learner:";
const tasks=[
 ["courses","Review current courses and areas needing attention"],
 ["research","Choose a meaningful junior-year research question"],
 ["evidence","Gather reliable sources and organize citations"],
 ["portfolio","Select work to carry into a senior-year portfolio"],
 ["pathways","Explore at least two higher-learning or career pathways"],
 ["senior","Write three priorities for Grade 12"]
];
const make=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n};
const host=document.getElementById("grade11JuniorPlanning")||make("section","khae-junior-planning");
host.id="grade11JuniorPlanning";host.classList.add("khae-junior-planning");
// The HTML owns the visible fallback; swap in controls only after initialization.
host.replaceChildren();
host.setAttribute("aria-labelledby","grade11JuniorPlanningTitle");
const eyebrow=make("p","khae-junior-eyebrow","Grade 11 · Junior-Year Development");
const title=make("h2","","Junior-Year Planning");title.id="grade11JuniorPlanningTitle";
const intro=make("p","","Prepare for senior year at your own pace. These are personal planning notes—not grades, graduation requirements, or verified academic records.");
const status=make("p","khae-junior-status");status.setAttribute("role","status");status.setAttribute("aria-live","polite");
host.append(eyebrow,title,intro,status);
const grid=make("div","khae-junior-grid");host.append(grid);
function panel(heading,description){
 const section=make("section","khae-junior-card");
 section.append(make("h3","",heading),make("p","",description));
 grid.append(section);return section;
}
const ready=panel("Senior-Year Readiness","Use this optional checklist to organize goals. It does not change course completion or graduation status.");
const counter=make("p","khae-junior-counter");counter.setAttribute("aria-live","polite");
const checklist=make("div","khae-junior-checklist");
ready.append(counter,checklist);
const research=panel("Junior Research Portfolio","Capture a research question, working notes, and source references. Keep graded submissions in the official course workspace.");
const question=make("textarea");question.rows=2;question.maxLength=500;
const notes=make("textarea");notes.rows=4;notes.maxLength=3000;
const sources=make("textarea");sources.rows=3;sources.maxLength=1500;
for(const [label,input] of [["Research question",question],["Research notes",notes],["Source and citation notes",sources]]){
 const wrapper=make("label","khae-junior-field");wrapper.append(make("span","",label),input);research.append(wrapper);
}
const pathways=panel("Higher Learning & Career Exploration","Compare possible academic, apprenticeship, creative, technical, and professional directions without committing to one.");
const interests=make("textarea");interests.rows=3;interests.maxLength=1600;
const nextSteps=make("textarea");nextSteps.rows=3;nextSteps.maxLength=1600;
for(const [label,input] of [["Pathways I want to explore",interests],["Questions and next steps",nextSteps]]){
 const wrapper=make("label","khae-junior-field");wrapper.append(make("span","",label),input);pathways.append(wrapper);
}
// No external pathway is presumed verified; students can record resources here.
const footer=make("div","khae-junior-footer");const save=make("button","khae-junior-save","Save my planning notes");save.type="button";
const message=make("span","khae-junior-message","Planning notes stay on this browser and are not submitted to your teachers.");
const clear=make("button","khae-junior-clear","Clear my planning notes");clear.type="button";
const draftStatus=make("span","khae-junior-message");draftStatus.setAttribute("role","status");
footer.append(save,clear,message,draftStatus);host.append(footer);
let activeId=null;
const allFields=[question,notes,sources,interests,nextSteps];
const boxes=new Map();
for(const [code,label] of tasks){
 const row=make("label","khae-junior-check");
 const checkbox=make("input");checkbox.type="checkbox";
 row.append(checkbox,make("span","",label));checklist.append(row);boxes.set(code,checkbox);
}
function learnerId(){
 const info=ctxApi.active?.(),current=profile?.activeLearner?.();
 if(!info||info.gradeNumber!==11||typeof info.learnerId!=="string"||!info.learnerId)return null;
 if(!current||String(current.learnerId)!==info.learnerId)return null;
 return info.learnerId;
}
const storageKey=id=>KEY+encodeURIComponent(id);
const DRAFT_KEY="khaemenes-grade11-junior-draft-v1:learner:";
const draftKey=id=>DRAFT_KEY+encodeURIComponent(id);
const keys=["question","notes","sources","interests","nextSteps"];
let baseline="",dirty=false;
function read(id){
 try{const v=JSON.parse(localStorage.getItem(storageKey(id))||"null");
  return v&&v.version===1&&v.learnerId===id&&v.grade===11?v:null;
 }catch{return null}
}
function readDraft(id){
 try{const v=JSON.parse(sessionStorage.getItem(draftKey(id))||"null");
  return v&&v.version===1&&v.learnerId===id&&v.grade===11?v:null;
 }catch{return null}
}
function record(id){
 return {version:1,grade:11,learnerId:id,
  checks:Object.fromEntries([...boxes].map(([key,el])=>[key,el.checked])),
  question:question.value.slice(0,500),notes:notes.value.slice(0,3000),
  sources:sources.value.slice(0,1500),interests:interests.value.slice(0,1600),
  nextSteps:nextSteps.value.slice(0,1600)};
}
const normalized=v=>JSON.stringify({checks:v?.checks||{},...Object.fromEntries(keys.map(k=>[k,typeof v?.[k]==="string"?v[k]:""]))});
function progress(){counter.textContent=[...boxes.values()].filter(el=>el.checked).length+" of "+tasks.length+" personal planning steps selected";}
function saveDraft(id){
 if(!id||learnerId()!==id)return;
 try{sessionStorage.setItem(draftKey(id),JSON.stringify(record(id)));draftStatus.textContent="Unsaved draft retained in this browser tab."}
 catch{draftStatus.textContent="Unsaved changes: browser draft storage unavailable."}
}
function changed(){
 if(!activeId||learnerId()!==activeId)return;
 dirty=normalized(record(activeId))!==baseline;
 save.disabled=!dirty;
 draftStatus.textContent=dirty?"Unsaved changes":"All changes saved";
 if(dirty)saveDraft(activeId);
}
function refresh(){
 const id=learnerId();
 if(activeId&&activeId!==id&&dirty)saveDraft(activeId);
 // Never overwrite live edits on same-learner notifications or returning focus.
 if(id===activeId&&dirty){place();return;}
 activeId=id;
 const saved=id?read(id):null,draft=id?readDraft(id):null;
 const source=draft||saved;
 for(const [key,checkbox] of boxes){checkbox.checked=Boolean(source?.checks?.[key]);checkbox.disabled=!id;}
 for(const [field,key] of [[question,"question"],[notes,"notes"],[sources,"sources"],[interests,"interests"],[nextSteps,"nextSteps"]]){
  field.value=typeof source?.[key]==="string"?source[key]:"";field.disabled=!id;
 }
 clear.disabled=!id;dirty=false;
 baseline=normalized(saved);
 if(draft&&normalized(draft)!==baseline){
  dirty=true;save.disabled=false;
  draftStatus.textContent="Unsaved draft restored from this tab.";
 }else{
  save.disabled=true;
  draftStatus.textContent=id?(saved?"Saved notes loaded":"No saved notes yet"):"";
  if(id&&draft)try{sessionStorage.removeItem(draftKey(id))}catch{}
 }
 status.textContent=id?"Personal planning workspace for the selected Grade 11 learner.":"Select your registered Grade 11 learner to use these private planning controls. Guests may explore the overview.";
 progress();
}
save.addEventListener("click",()=>{
 const id=learnerId();
 if(!id||id!==activeId){refresh();status.textContent="Learner selection changed. Review the current profile before saving.";return;}
 const next={...record(id),updatedAt:new Date().toISOString()};
 try{
  // Reconfirm identity immediately before the browser write.
  if(learnerId()!==id)return;
  localStorage.setItem(storageKey(id),JSON.stringify(next));
  try{sessionStorage.removeItem(draftKey(id))}catch{}
  baseline=normalized(next);dirty=false;save.disabled=true;
  draftStatus.textContent="Saved "+new Date(next.updatedAt).toLocaleString();
  status.textContent="Planning notes saved on this device for the selected Grade 11 learner. This is not secure cross-device storage.";
 }catch{status.textContent="Unable to save. Your in-tab draft is retained where browser storage permits.";}
});
clear.addEventListener("click",()=>{
 const id=learnerId();
 if(!id||id!==activeId)return;
 if(!window.confirm("Clear this learner's saved planning notes and temporary draft from this browser? This cannot be undone."))return;
 if(learnerId()!==id)return;
 try{localStorage.removeItem(storageKey(id));sessionStorage.removeItem(draftKey(id))}
 catch{status.textContent="Unable to clear this browser's planning records.";return}
 dirty=false;activeId=null;refresh();
 status.textContent="Local planning notes cleared for this learner.";
});
for(const field of allFields)field.addEventListener("input",changed);
checklist.addEventListener("change",()=>{progress();changed()});
window.addEventListener("beforeunload",event=>{
 if(!dirty||!activeId||learnerId()!==activeId)return;
 saveDraft(activeId);event.preventDefault();event.returnValue="";
});
function place(){
 const rooms=document.getElementById("studentRoomsAfterPortfolio");
 const portfolio=main.querySelector('aside[aria-label="Student Learning Portfolio"]');
 const anchor=rooms?.parentElement===main?rooms:portfolio?.parentElement===main?portfolio:null;
 if(anchor&&host.previousElementSibling!==anchor)anchor.insertAdjacentElement("afterend",host);
 else if(!host.isConnected)main.append(host);
}
place();refresh();
for(const event of ["pageshow","khaemenes-family-changed","khaemenes-student-profile-changed"])window.addEventListener(event,()=>{place();refresh();});
window.addEventListener("storage",event=>{if(!event.key||event.key.includes("learner")||event.key.includes("family_registry")||event.key.startsWith(KEY))refresh();});
window.KhaemenesGrade11JuniorPlanning=Object.freeze({version:"1.0.0",refresh});
})();
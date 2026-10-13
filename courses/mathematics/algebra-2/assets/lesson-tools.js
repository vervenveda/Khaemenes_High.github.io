(() => {
"use strict";
const id=document.body.dataset.lessonId;
if(!id)return;
const current=document.currentScript;
const run=()=>{
const KEY="khaemenes-algebra2-lesson-progress-v1";
function load(){return window.KhaemenesAlgebra2Progression?.readJSON?.(KEY,{})||{}}
function save(data){window.KhaemenesAlgebra2Progression?.writeJSON?.(KEY,data)}
let data=load(),rec=data[id]||{complete:false,note:"",updated:null};
const box=document.getElementById("lessonComplete");
const note=document.getElementById("lessonNote");
const status=document.getElementById("lessonStatus");
if(box)box.checked=!!rec.complete;
if(note)note.value=rec.note||"";
function updateStatus(){if(status)status.textContent=rec.complete?"Marked complete on this device.":"Not yet marked complete."}
box?.addEventListener("change",()=>{rec.complete=box.checked;rec.updated=new Date().toISOString();data[id]=rec;save(data);updateStatus()});
document.getElementById("saveLessonNote")?.addEventListener("click",()=>{rec.note=note.value.trim();rec.updated=new Date().toISOString();data[id]=rec;save(data);alert("Lesson note saved locally.")});
document.getElementById("printLesson")?.addEventListener("click",()=>print());
updateStatus();
};
function showReadOnlyRecovery(){
  // Do not erase the lesson when the progression authority cannot be verified.
  // Keep reading and printing possible, but never record unverified completion.
  const main=document.querySelector("main");
  const completion=document.getElementById("lessonComplete");
  const note=document.getElementById("lessonNote");
  const saveButton=document.getElementById("saveLessonNote");
  for(const control of [completion,note,saveButton]){
    if(control){control.disabled=true;control.setAttribute("aria-disabled","true");}
  }
  const state=document.getElementById("lessonStatus");
  if(state)state.textContent="Progress verification unavailable; this lesson is read-only.";
  if(!main||document.getElementById("algebra2ProgressionRecovery"))return;
  document.getElementById("printLesson")?.addEventListener("click",()=>print());
  const banner=document.createElement("section");
  banner.id="algebra2ProgressionRecovery";
  banner.setAttribute("role","alert");
  banner.setAttribute("aria-live","assertive");
  banner.style.cssText="margin:16px 0;padding:16px;border:1px solid #a57943;border-radius:7px;background:#fff4dd;color:#29231b;text-align:left;";
  const heading=document.createElement("h2");
  heading.textContent="Progress verification temporarily unavailable";
  heading.style.cssText="font-size:24px;line-height:1.35;margin:0 0 8px;font-weight:400;color:#29231b;";
  const message=document.createElement("p");
  message.textContent="The lesson remains available to read or print. Completing lessons, saving course notes, and progression-related actions are paused until the local verification script loads. No lesson completion or assessment credit is granted in this mode.";
  const retry=document.createElement("button");
  retry.type="button";
  retry.textContent="Retry course verification";
  retry.style.cssText="min-height:44px;padding:9px 14px;border:1px solid #a57943;border-radius:7px;background:#44372b;color:white;cursor:pointer;";
  retry.addEventListener("click",()=>location.reload());
  banner.append(heading,message,retry);
  main.insertBefore(banner,main.firstChild);
}
if(window.KhaemenesAlgebra2Progression?.readJSON&&window.KhaemenesAlgebra2Progression?.writeJSON)run();
else if(current){
 const script=document.createElement("script");
 script.src=new URL("./algebra2-progression.js",current.src).href;
 script.onload=()=>{
   if(window.KhaemenesAlgebra2Progression?.readJSON&&window.KhaemenesAlgebra2Progression?.writeJSON)run();
   else showReadOnlyRecovery();
 };
 script.onerror=showReadOnlyRecovery;
 try{document.head.appendChild(script);}catch{showReadOnlyRecovery();}
}else showReadOnlyRecovery();
})();

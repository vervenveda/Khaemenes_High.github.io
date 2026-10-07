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
if(window.KhaemenesAlgebra2Progression)run();
else if(current){
 const script=document.createElement("script");
 script.src=new URL("./algebra2-progression.js",current.src).href;
 script.onload=run;
 script.onerror=()=>{const main=document.querySelector("main");if(main)main.innerHTML='<section class="lesson-hero"><p class="eyebrow">Progression check unavailable</p><h1>Lesson paused</h1><p>Refresh this page before continuing; the local progression check could not be loaded.</p></section>'};
 document.head.appendChild(script);
}else run();
})();

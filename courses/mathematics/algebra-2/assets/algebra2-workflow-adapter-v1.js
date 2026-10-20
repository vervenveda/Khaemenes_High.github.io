(()=>{
"use strict";
const current=document.currentScript;
function identity(){
 const id=String(document.body?.dataset?.lessonId||"");
 const m=id.match(/^u(\d{2})-l(\d{2})$/);if(!m)return null;
 return {id,unit:Number(m[1]),lesson:Number(m[2]),unitLabel:m[1],lessonLabel:m[2],title:document.querySelector("#main .lesson-hero h1,#main h1")?.textContent?.trim()||document.title};
}
function fallback(x){
 try{
  const p=window.KhaemenesAlgebra2Progression;
  const all=p?.readJSON?.("khaemenes-algebra2-lesson-progress-v1",{})||{};
  const rec=all[x.id]||{},scores=[Number(rec.bestScore),Number(rec.score),...(Array.isArray(rec.attempts)?rec.attempts.map(a=>Number(a?.score)):[])].filter(Number.isFinite);
  const best=scores.length?Math.max(...scores):null;
  return {best,mastery:rec.mastery===true||(best!==null&&best>=80),source:"algebra2-lesson-progress-v1"};
 }catch{return {best:null,mastery:false,source:null}}
}
window.KhaemenesLessonWorkflowConfig={
 courseId:"KH-MATH-A2",courseTitle:"Algebra II",filePrefix:"algebra2",storageKey:"khaemenes-algebra2-lesson-workflow-v1",masteryTarget:80,
 getIdentity:identity,
 canRender:()=>!!document.getElementById("lessonMasteryScore"),
 getMastery:x=>window.KhaemenesAlgebra2Progression?.lessonEvidence?.(x.id)||fallback(x),
 getSubmitButton:()=>document.getElementById("saveLessonMastery"),
 getContinueLink:()=>{const a=document.querySelector('.lesson-hero .actions a.primary[href],#lessonNextStep a.primary[href]');return a?{href:a.href,label:a.textContent.trim()}:null},
 getInsertAfter:()=>document.querySelector("#main .lesson-hero")
};
function style(){if(document.querySelector('link[data-khae-workflow="v1"]'))return;const l=document.createElement("link");l.rel="stylesheet";l.dataset.khaeWorkflow="v1";l.href=new URL("../../assets/course-lesson-workflow-v1.css",current?.src||location.href).href;document.head.appendChild(l)}
function load(){style();if(window.KhaemenesLessonWorkflow?.version)return window.KhaemenesLessonWorkflow.refresh?.();if(document.getElementById("khaeWorkflowEngineV1"))return;const s=document.createElement("script");s.id="khaeWorkflowEngineV1";s.src=new URL("../../assets/course-lesson-workflow-v1.js",current?.src||location.href).href;s.async=false;document.head.appendChild(s)}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",load,{once:true}):load();
})();
(()=>{
"use strict";
const current=document.currentScript;
const pad=n=>String(Number(n)).padStart(2,"0");
function identity(){
  const unit=(location.pathname.match(/unit-(\d+)/i)||[])[1];
  const lesson=document.body?.dataset?.lesson||(location.pathname.match(/lesson-(\d+)/i)||[])[1];
  if(!unit||!lesson)return null;
  return {id:"u"+pad(unit)+"-l"+pad(lesson),unit:Number(unit),lesson:Number(lesson),unitLabel:pad(unit),lessonLabel:pad(lesson),title:document.querySelector("#main h1")?.textContent?.trim()||document.title};
}
function fallbackEvidence(x){
  try{
    const dedicated=JSON.parse(localStorage.getItem("khaemenes-algebra1-unit"+pad(x.unit)+"-a3-v1")||"null")||{};
    const shared=JSON.parse(localStorage.getItem("khaemenes-algebra1-unit"+pad(x.unit)+"-progress-v1")||"null")||{};
    const values=[Number(dedicated?.best?.["lesson-"+x.lesson]),Number(shared?.scores?.[x.id])].filter(Number.isFinite);
    const best=values.length?Math.max(...values):null;
    return {best,mastery:best!==null&&best>=80,source:"algebra1-local-evidence"};
  }catch{return {best:null,mastery:false,source:null}}
}
window.KhaemenesLessonWorkflowConfig={
  courseId:"KH-MATH-A1",courseTitle:"Algebra I",filePrefix:"algebra1",storageKey:"khaemenes-algebra1-lesson-workflow-v1",masteryTarget:80,
  getIdentity:identity,
  canRender:()=>!!document.querySelector("#main #score,#main .question"),
  getMastery:x=>window.KhaemenesAlgebra1MasteryAuthority?.lessonEvidence?.(x.unit,x.lesson,x.id)||fallbackEvidence(x),
  getSubmitButton:()=>document.querySelector("#main #score"),
  getContinueLink:()=>{const a=document.querySelector("#lessonNextStep a[href],#main a[data-next-step][href]");return a?{href:a.href,label:a.textContent.trim()}:null},
  getInsertAfter:()=>document.querySelector("#main .hero")
};
function loadStyle(){
 if(document.querySelector('link[data-khae-workflow="v1"]'))return;
 const l=document.createElement("link");l.rel="stylesheet";l.dataset.khaeWorkflow="v1";l.href=new URL("../../assets/course-lesson-workflow-v1.css",current?.src||location.href).href;document.head.appendChild(l);
}
function loadEngine(){
 loadStyle();
 if(window.KhaemenesLessonWorkflow?.version)return window.KhaemenesLessonWorkflow.refresh?.();
 if(document.getElementById("khaeWorkflowEngineV1"))return;
 const s=document.createElement("script");s.id="khaeWorkflowEngineV1";s.src=new URL("../../assets/course-lesson-workflow-v1.js",current?.src||location.href).href;s.async=false;document.head.appendChild(s);
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",loadEngine,{once:true}):loadEngine();
})();
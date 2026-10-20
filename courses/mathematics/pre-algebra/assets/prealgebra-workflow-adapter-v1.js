(()=>{
"use strict";
if(window.KhaemenesPreAlgebraWorkflowAdapter)return;
const adapterScript=document.currentScript;
const map=window.UNIT_MAP_FALLBACK;
const lesson=window.LESSON_DATA;
if(!map?.unit||!lesson)return;
const TARGET=80;
const pad=n=>String(Number(n)||0).padStart(2,"0");
const unitNo=Number(map.unit.number)||Number(location.pathname.match(/unit-(\d+)/)?.[1])||0;
const lessonNo=Number(lesson.number)||Number(String(lesson.id||"").match(/(?:l|lesson[-_ ]?)(\d+)$/i)?.[1])||0;
const rawId=String(lesson.id||"").trim();
const canonicalId=/^u\d{2}-l\d{2}$/i.test(rawId)?rawId:`u${pad(unitNo)}-l${pad(lessonNo)}`;
const candidateIds=[rawId,canonicalId,`l${pad(lessonNo)}`].filter(Boolean);
function safe(raw,fallback={}){try{const value=JSON.parse(raw||"null");return value&&typeof value==="object"?value:fallback}catch{return fallback}}
function progress(){return safe(localStorage.getItem(map.unit.progress_key),{})}
function bestScore(){
  const p=progress();
  let best=0;
  for(const id of candidateIds){
    best=Math.max(best,Number(p.lessonBestScores?.[id])||0,Number(p.lessonScores?.[id])||0,Number(p.lessonLatestScores?.[id])||0);
    const attempts=Array.isArray(p.lessonAttempts?.[id])?p.lessonAttempts[id]:[];
    for(const attempt of attempts)best=Math.max(best,Number(attempt?.percent)||0,Number(attempt?.score)||0);
  }
  return best;
}
function nextLink(){
  const a=document.getElementById("nextLesson");
  if(!a||a.getAttribute("aria-disabled")==="true"||a.dataset.locked==="true")return null;
  const href=a.getAttribute("href");
  if(!href||href==="#"||href.startsWith("#practice"))return null;
  return {href:a.href,label:(a.textContent||"Continue").trim()};
}
window.KhaemenesLessonWorkflowConfig={
  courseId:"KH-MATH-PA",
  courseTitle:"Pre-Algebra",
  masteryTarget:TARGET,
  storageKey:"khaemenes-prealgebra-lesson-workflow-v1",
  filePrefix:"khaemenes-prealgebra",
  getIdentity:()=>({
    id:canonicalId,
    unit:unitNo,
    unitLabel:pad(unitNo),
    lesson:lessonNo,
    lessonLabel:pad(lessonNo),
    title:String(lesson.title||document.querySelector("h1")?.textContent||"").trim()
  }),
  getMastery:()=>{const best=bestScore();return {mastery:best>=TARGET,best,source:map.unit.progress_key}},
  getSubmitButton:()=>document.getElementById("submitPractice"),
  getContinueLink:()=>nextLink(),
  getInsertAfter:()=>document.querySelector(".hero")||document.querySelector(".lesson-hero")||document.querySelector("header")||null
};
function ensureStyle(){
  if(document.querySelector('link[data-khae-workflow-style="v1"]'))return;
  const link=document.createElement("link");
  link.rel="stylesheet";
  link.href=new URL("../../assets/course-lesson-workflow-v1.css",adapterScript?.src||location.href).href;
  link.dataset.khaeWorkflowStyle="v1";
  document.head.appendChild(link);
}
function ensureWorkflow(){
  if(window.KhaemenesLessonWorkflow||document.querySelector('script[data-khae-workflow-core="v1"]'))return;
  const script=document.createElement("script");
  script.src=new URL("../../assets/course-lesson-workflow-v1.js",adapterScript?.src||location.href).href;
  script.async=false;
  script.dataset.khaeWorkflowCore="v1";
  document.head.appendChild(script);
}
ensureStyle();
ensureWorkflow();
window.KhaemenesPreAlgebraWorkflowAdapter=Object.freeze({course:"pre-algebra",version:"1.0.0",canonicalId});
})();
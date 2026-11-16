(function(){ "use strict";
const q=s=>document.querySelector(s);
function parse(text,fallback){try{return JSON.parse(text)}catch{return fallback}}
function scoped(base){
  try{return window.KhaemenesEnglish9Records?.storageKey?.(base)||base}catch{return base}
}
function bestFromAssessment(kind){
  const key=scoped("khae-ela9-assessment-v2:"+kind);
  const rec=parse(localStorage.getItem(key)||"null",null);
  const scores=(rec?.attempts||[]).map(a=>Number(a?.summary?.score)).filter(Number.isFinite);
  return scores.length?Math.max(...scores):null;
}
function render(){
  const progress=parse(localStorage.getItem(scoped("khae-ela9-progress-v1"))||"{}",{});
  const done=Array.from({length:36},(_,i)=>Boolean(progress["week-"+String(i+1).padStart(2,"0")])).filter(Boolean).length;
  const pct=Math.round(done/36*100);
  if(q("[data-e9-weeks]"))q("[data-e9-weeks]").textContent=done+" / 36";
  if(q("[data-e9-percent]"))q("[data-e9-percent]").textContent=pct+"%";
  const mid=bestFromAssessment("midterm"),fin=bestFromAssessment("final");
  if(q("[data-e9-midterm]"))q("[data-e9-midterm]").textContent=mid==null?"—":mid+"%";
  if(q("[data-e9-final]"))q("[data-e9-final]").textContent=fin==null?"—":fin+"%";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
})();
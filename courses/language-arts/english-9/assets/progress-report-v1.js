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
function readingDevelopment(){
  const portal=parse(localStorage.getItem(scoped("ELA9_36_WEEK_PORTAL_V2"))||"null",null);
  const student=portal?.students?.find(s=>s.id===portal.activeId)||portal?.students?.[0]||null;
  const weeks=student?.progress?.weeks||{};
  let readWeeks=0,minutes=0,reflections=0;
  for(let w=1;w<=36;w++){const r=weeks[w]?.reading||weeks[String(w)]?.reading;if(!r)continue;const active=String(r.status||"").toLowerCase()!=="not started"||Number(r.minutes)>0||String(r.pages||"").trim()||String(r.reflection||"").trim();if(active)readWeeks++;minutes+=Number(r.minutes)||0;if(String(r.reflection||"").trim())reflections++;}
  // Expand alongside the learner-scoped reading ledger without changing legacy field keys.
  // A missing row-count key means the original 30-row record is still authoritative.
  let availableRows=30;
  try{
    const raw=localStorage.getItem(scoped("khae-ela9-reading-rows-v2"));
    const n=Number.parseInt(raw||"30",10);
    if(Number.isFinite(n))availableRows=Math.min(500,Math.max(30,n));
  }catch{}
  let logEntries=0;
  for(let i=1;i<=availableRows;i++){
    try{
      if(String(localStorage.getItem(scoped("khae-ela9-field:reading-title-"+i))||"").trim())logEntries++;
    }catch{}
  }
  return {readWeeks,minutes,reflections,logEntries};
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
  const rd=readingDevelopment();
  if(q("[data-e9-reading-weeks]"))q("[data-e9-reading-weeks]").textContent=rd.readWeeks+" / 36";
  if(q("[data-e9-reading-minutes]"))q("[data-e9-reading-minutes]").textContent=rd.minutes||"—";
  if(q("[data-e9-reading-reflections]"))q("[data-e9-reading-reflections]").textContent=rd.reflections+" / 36";
  if(q("[data-e9-reading-log]"))q("[data-e9-reading-log]").textContent=String(rd.logEntries);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
})();
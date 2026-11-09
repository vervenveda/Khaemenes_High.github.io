/* Grade 09–12 student-to-family reporting visibility.
 * Read-only. No grade, placement, family, course, or vault writes.
 * Family Portal reads the same learner-scoped continuation snapshots.
 */
(function(global){
 "use strict";
 if(global.KhaemenesHighFamilyReportStatus)return;
 const ID="highSchoolFamilyReportStatus",KEY="khaemenes.learning.continuation.v1";
 const FAMILY="https://vervenveda.com/Khaemenes_Academy.github.io/family/#family-progress";
 const safeGrade=raw=>String(raw||"").trim().replace(/^grade[\s-]*/i,"").padStart(2,"0");
 function gradeFromPath(){
  const match=global.location.pathname.match(/\/grades\/grade-(09|10|11|12)\/student-profile\//i);
  return match?.[1]||null;
 }
 function context(){
  const c=global.KhaemenesHighProfileGradeContext?.active?.();
  const g=gradeFromPath();
  return c&&g&&c.grade===g&&c.learnerId?c:null;
 }
 function overview(){
  const c=context();
  if(!c)return {valid:false,grade:gradeFromPath(),reported:0,stale:0,attention:0,last:null};
  const api=global.KhaemenesLearningContinuation;
  if(typeof api?.readLearner!=="function")return {valid:true,available:false,grade:c.grade,reported:0,stale:0,attention:0,last:null};
  const rows=api.readLearner(c.learnerId).filter(s=>s?.learnerId===c.learnerId&&(!s.grade||safeGrade(s.grade)===c.grade));
  return {
   valid:true,available:true,grade:c.grade,reported:rows.length,
   stale:rows.filter(s=>s.stale).length,
   attention:rows.filter(s=>s.family?.needsAction===true||s.status==="mastery"||s.status==="corrections").length,
   last:rows.reduce((n,s)=>Math.max(n,Date.parse(s.updatedAt||"")||0),0)||null
  };
 }
 function render(){
  const main=document.querySelector("main");if(!main)return;
  let node=document.getElementById(ID);
  if(!node){
   node=document.createElement("section");node.id=ID;node.className="high-family-report-status";
   node.setAttribute("aria-label","Family report publication status");
   node.innerHTML='<h2>Family Report Status</h2><p data-family-status aria-live="polite"></p><p data-family-detail></p><a class="high-family-report-link" href="'+FAMILY+'">Open Family Learning Center</a>';
   main.append(node);
  }
  const o=overview(),status=node.querySelector("[data-family-status]"),detail=node.querySelector("[data-family-detail]");
  if(!o.valid){
   status.textContent="Choose the registered student for this grade to view family report status.";
   detail.textContent="No learner reports have been accessed. A local profile selection is not authenticated guardian access.";
  }else if(!o.available){
   status.textContent="Family reporting module unavailable on this page.";
   detail.textContent="No grade or cloud synchronization is implied.";
  }else if(!o.reported){
   status.textContent="No Grade "+o.grade+" course summaries have been published on this browser.";
   detail.textContent="This does not mean the student has made no progress. Open each course for its records; no grades are inferred.";
  }else{
   status.textContent=o.reported+" Grade "+o.grade+" course summary"+(o.reported===1?" is":"ies are")+" available to the Family Center on this browser.";
   detail.textContent=o.attention+" family review signal(s) · "+o.stale+" snapshot(s) need refreshing · Last published "+(o.last?new Date(o.last).toLocaleString():"not reported")+".";
  }
 }
 function init(){
  if(!document.getElementById("highFamilyReportStyle")){
   const style=document.createElement("style");style.id="highFamilyReportStyle";
   style.textContent=`.high-family-report-status{box-sizing:border-box;max-width:1080px;margin:28px auto;padding:25px;border:1px solid #c5b494;border-radius:7px;background:#fffdf8;color:#243038;text-align:center}
   .high-family-report-status h2{font:400 24px/1.35 Cinzel,Georgia,serif;margin:0 0 12px;color:#243038}
   .high-family-report-status p{font-size:16px;line-height:1.55;margin:9px auto}
   .high-family-report-link{display:inline-flex;justify-content:center;align-items:center;min-height:48px;margin-top:8px;padding:10px 18px;border-radius:7px;background:#243038;color:#fff8e9!important;font-size:16px;text-decoration:none}
   .high-family-report-link:focus-visible{outline:3px solid #a87930;outline-offset:3px}`;
   document.head.append(style);
  }
  render();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
 for(const event of ["pageshow","khaemenes-learning-continuation-changed","khaemenes-family-changed","khaemenes-learner-placement-changed"])global.addEventListener(event,render);
 global.addEventListener("storage",e=>{if(e.key===KEY||e.key==="khaemenes_family_registry_v1"||e.key==="khaemenes_active_learner_v1")render()});
 global.KhaemenesHighFamilyReportStatus=Object.freeze({version:"1.0.0",overview,render});
})(window);

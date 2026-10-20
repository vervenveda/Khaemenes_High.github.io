(()=>{
"use strict";
const VERSION="1.0.0";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const now=()=>new Date().toISOString();
const safeJSON=(raw,fallback)=>{try{const v=JSON.parse(raw||"null");return v&&typeof v==="object"?v:fallback}catch{return fallback}};
function activeLearner(){
  try{
    const id=safeJSON(localStorage.getItem("khaemenes_active_learner_v1"),null);
    const registry=safeJSON(localStorage.getItem("khaemenes_family_registry_v1"),null);
    const learner=typeof id==="string"?registry?.learners?.[id]:null;
    if(learner?.learnerId===id)return {id,name:String(learner.displayName||learner.name||"").trim()};
  }catch{}
  try{
    const p=safeJSON(localStorage.getItem("khaemenes-high-profile-v1"),null);
    if(p)return {id:null,name:String(p.displayName||p.name||"").trim()};
  }catch{}
  return {id:null,name:""};
}
function scopedKey(base){const learner=activeLearner();return learner.id?base+":learner:"+encodeURIComponent(learner.id):base}
function normalizeEvidence(value,target){
  const best=Number(value?.best);
  return {mastery:value?.mastery===true||(Number.isFinite(best)&&best>=target),best:Number.isFinite(best)?best:null,source:value?.source||null};
}
function enhance(){
  const cfg=window.KhaemenesLessonWorkflowConfig;
  if(!cfg||document.getElementById("khaeLessonWorkflow"))return false;
  if(typeof cfg.canRender==="function"&&!cfg.canRender())return false;
  const identity=cfg.getIdentity?.();
  if(!identity?.id)return false;
  const target=Number(cfg.masteryTarget)||80;
  const key=scopedKey(cfg.storageKey||("khaemenes-"+String(cfg.courseId||"math").toLowerCase()+"-lesson-workflow-v1"));
  const readAll=()=>safeJSON(localStorage.getItem(key),{schema:1,lessons:{}});
  const read=()=>{const all=readAll();return all.lessons?.[identity.id]||{}};
  const write=patch=>{
    const all=readAll();all.schema=1;all.courseId=cfg.courseId||"";all.updatedAt=now();all.lessons=all.lessons&&typeof all.lessons==="object"?all.lessons:{};
    all.lessons[identity.id]={...all.lessons[identity.id],...patch,lessonId:identity.id,updatedAt:now()};
    try{localStorage.setItem(key,JSON.stringify(all));return true}catch{return false}
  };
  const host=cfg.getInsertAfter?.()||document.querySelector("#main .hero,#main .lesson-hero,#lessonMain .lesson-header,.lesson-header,.lesson-hero");
  if(!host)return false;
  const section=document.createElement("section");
  section.id="khaeLessonWorkflow";section.className="khae-workflow";
  section.innerHTML='<div class="khae-workflow-print-head"><strong>Khaemenes Academy · '+esc(cfg.courseTitle||"Mathematics")+' · Unit '+esc(identity.unitLabel||identity.unit||"—")+' · Lesson '+esc(identity.lessonLabel||identity.lesson||"—")+'</strong><div class="khae-workflow-print-lines"><span>Name: <b id="khaeWorkflowPrintName"></b></span><span>Date: ____________________</span></div></div>'+
  '<div class="khae-workflow-head"><p class="khae-workflow-kicker">Khaemenes Mathematics · Lesson Workflow</p><h2>Learn → Practice → Submit → Mastery → Review</h2><p>Completion and mastery are separate. Practice supports learning; only the course’s canonical evidence system determines whether the '+target+'% mastery gate has been met.</p></div>'+
  '<div class="khae-workflow-stages">'+
    '<article class="khae-workflow-stage" data-stage="learn" data-step="1"><strong>Learn</strong><span>Read, study examples, and identify the governing ideas.</span></article>'+
    '<article class="khae-workflow-stage" data-stage="practice" data-step="2"><strong>Practice</strong><span>Work problems, explain reasoning, and correct errors.</span></article>'+
    '<article class="khae-workflow-stage" data-stage="submit" data-step="3"><strong>Submit</strong><span>Submit the lesson assignment or evaluated evidence.</span></article>'+
    '<article class="khae-workflow-stage" data-stage="mastery" data-step="4"><strong>Mastery</strong><span>The canonical course record must show at least '+target+'%.</span></article>'+
    '<article class="khae-workflow-stage" data-stage="review" data-step="5"><strong>Review & Continue</strong><span>Save a local review note, then follow the existing course gate.</span></article>'+
  '</div>'+
  '<div class="khae-workflow-record"><article class="khae-workflow-panel"><h3>Assignment state</h3><div class="khae-workflow-states">'+
    '<span class="khae-workflow-chip" data-state="draft">Draft</span><span class="khae-workflow-chip" data-state="submitted">Submitted</span><span class="khae-workflow-chip" data-state="scored">Scored</span><span class="khae-workflow-chip" data-state="mastered">Mastered</span><span class="khae-workflow-chip" data-state="reviewed">Reviewed</span>'+
    '</div><p class="khae-workflow-score" id="khaeWorkflowScore"></p><p class="khae-workflow-note">These workflow markers are browser-local organizational evidence. They do not replace graded attempts, evaluator judgment, or the course mastery authority.</p></article>'+
    '<article class="khae-workflow-panel"><h3>Reflection & local review</h3><label>What did you learn, correct, verify, or still need to practice?<textarea id="khaeWorkflowReflection" maxlength="12000"></textarea></label><div class="khae-workflow-actions"><button class="khae-workflow-button" id="khaeWorkflowSaveReview" type="button">Save Review Note</button></div><p class="khae-workflow-note">A saved review is a local marker only. It never grants mastery or unlocks a lesson.</p></article></div>'+
  '<div class="khae-workflow-actions"><button class="khae-workflow-button" id="khaeWorkflowLearn" type="button">Mark Learn Complete</button><button class="khae-workflow-button" id="khaeWorkflowPractice" type="button">Mark Practice Complete</button><button class="khae-workflow-button primary" id="khaeWorkflowSubmitJump" type="button">Submit Assignment</button><a class="khae-workflow-link primary" id="khaeWorkflowContinue" href="#" hidden>Continue</a><button class="khae-workflow-button" id="khaeWorkflowExport" type="button">Export Lesson Record</button><button class="khae-workflow-button" id="khaeWorkflowPrint" type="button">Print Evidence</button></div>'+
  '<p class="khae-workflow-status" id="khaeWorkflowStatus" role="status" aria-live="polite"></p>';
  host.after(section);
  const $=id=>document.getElementById(id);
  const reflection=$("khaeWorkflowReflection"),status=$("khaeWorkflowStatus");
  reflection.value=String(read().reflection||"");
  const learner=activeLearner();$("khaeWorkflowPrintName").textContent=learner.name||"____________________";
  let submitButton=null;
  function canonical(){
    try{return normalizeEvidence(cfg.getMastery?.(identity)||{},target)}catch{return {mastery:false,best:null,source:null}}
  }
  function continueLink(){
    try{return cfg.getContinueLink?.(identity)||null}catch{return null}
  }
  function markPractice(){
    const rec=read();if(rec.practiceComplete||rec.practiceStarted)return;
    write({practiceStarted:true});refresh();
  }
  function bindSubmit(){
    const next=cfg.getSubmitButton?.()||null;
    if(!next||next===submitButton)return;
    submitButton=next;
    if(cfg.submitLabel!==false){submitButton.textContent="Submit Assignment";submitButton.setAttribute("aria-label","Submit Assignment");}
    submitButton.addEventListener("click",()=>{
      const rec=read();
      write({submittedAt:rec.submittedAt||now(),lastSubmittedAt:now(),submissionCount:(Number(rec.submissionCount)||0)+1,reviewComplete:false});
      setTimeout(refresh,0);setTimeout(refresh,120);
    });
  }
  function refresh(){
    bindSubmit();
    const rec=read(),ev=canonical();
    const submitted=!!rec.submittedAt,scored=ev.best!==null,mastered=ev.mastery,reviewed=rec.reviewComplete===true;
    const done={learn:rec.learnComplete===true,practice:rec.practiceComplete===true||rec.practiceStarted===true,submit:submitted,mastery:mastered,review:reviewed};
    const firstIncomplete=["learn","practice","submit","mastery","review"].find(x=>!done[x]);
    section.querySelectorAll("[data-stage]").forEach(el=>{const name=el.dataset.stage;el.classList.toggle("is-done",!!done[name]);el.classList.toggle("is-active",name===firstIncomplete)});
    const states={draft:!submitted,submitted,scored,mastered,reviewed};
    section.querySelectorAll("[data-state]").forEach(el=>el.classList.toggle("is-on",!!states[el.dataset.state]));
    $("khaeWorkflowScore").innerHTML=scored?'<strong>Recorded score: '+Math.round(ev.best*10)/10+'%</strong> · '+(mastered?"Mastery gate met.":"Below "+target+"%; review, correct, and submit a new attempt."):'<strong>No canonical score recorded yet.</strong>';
    const native=submitButton;
    $("khaeWorkflowSubmitJump").disabled=!native;
    $("khaeWorkflowSaveReview").disabled=!submitted&&!scored;
    const c=continueLink(),a=$("khaeWorkflowContinue");
    if(mastered&&c?.href){a.href=c.href;a.textContent=c.label||"Continue to next required step";a.hidden=false}else a.hidden=true;
    status.textContent=mastered?(reviewed?"Mastery and local review are recorded. Continue using the course’s existing gate.":"Mastery is recorded. A local review note may be saved before continuing."):(submitted?(scored?"Assignment scored below mastery; corrections and a new submission are available.":"Assignment submitted; awaiting a recorded score."):"Work remains in draft until the assignment is submitted.");
  }
  $("khaeWorkflowLearn").addEventListener("click",()=>{write({learnComplete:true,learnCompletedAt:now()});refresh()});
  $("khaeWorkflowPractice").addEventListener("click",()=>{write({practiceComplete:true,practiceStarted:true,practiceCompletedAt:now()});refresh()});
  $("khaeWorkflowSubmitJump").addEventListener("click",()=>{bindSubmit();if(!submitButton){status.textContent="The lesson submission control is not available yet.";return}submitButton.scrollIntoView({behavior:"smooth",block:"center"});submitButton.focus({preventScroll:true})});
  $("khaeWorkflowSaveReview").addEventListener("click",()=>{
    const ev=canonical(),rec=read();
    if(!rec.submittedAt&&ev.best===null){status.textContent="Submit or score the assignment before recording review.";return}
    write({reflection:reflection.value.trim(),reviewComplete:true,reviewedAt:now()});refresh();
  });
  reflection.addEventListener("input",()=>{const rec=read();if(rec.reflection===reflection.value)return;clearTimeout(reflection._timer);reflection._timer=setTimeout(()=>write({reflection:reflection.value}),350)});
  section.addEventListener("input",e=>{if(e.target===reflection||e.target.closest?.(".khae-workflow"))return;markPractice()});
  const main=document.getElementById("main")||document.getElementById("lessonMain");
  main?.addEventListener("change",e=>{if(section.contains(e.target))return;markPractice()},{passive:true});
  main?.addEventListener("input",e=>{if(section.contains(e.target))return;markPractice()},{passive:true});
  $("khaeWorkflowExport").addEventListener("click",()=>{
    const ev=canonical(),rec=read(),payload={schema:"khaemenes-math-lesson-workflow-v1",courseId:cfg.courseId||"",courseTitle:cfg.courseTitle||"",lesson:identity,learner:{name:activeLearner().name||null},workflow:{...rec},canonicalMastery:ev,masteryTarget:target,exportedAt:now(),trust:{classification:"browser-local-supporting-evidence",authoritative:false,digitallySigned:false}};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=(cfg.filePrefix||"khaemenes-math")+"-"+identity.id+"-lesson-record.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),700);status.textContent="Lesson record exported. It remains supporting local evidence, not a self-authenticating transcript.";
  });
  $("khaeWorkflowPrint").addEventListener("click",()=>window.print());
  const observer=new MutationObserver(()=>{bindSubmit();refresh()});
  const observeRoot=document.getElementById("main")||document.getElementById("lessonMain")||document.body;
  observer.observe(observeRoot,{childList:true,subtree:true});
  window.addEventListener("storage",refresh);
  bindSubmit();refresh();
  window.KhaemenesLessonWorkflow={version:VERSION,refresh};
  return true;
}
function boot(){if(!enhance()){setTimeout(enhance,80);setTimeout(enhance,260)}}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();
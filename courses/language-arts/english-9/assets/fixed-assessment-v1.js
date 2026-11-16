/*
 * English 9 Fixed Assessment Runtime v1.0.0
 * Uses the shared high-school assessment adapter in fixed-form mode.
 * Same question and option order on retry; 80% objective mastery target.
 * Complex writing remains human-reviewed and separate from objective score.
 */
(function(global){
"use strict";
if(global.KhaemenesEnglish9FixedAssessment)return;
const PASS=80;
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function readBank(){
 const el=$("#assessment-data"); if(!el)return[];
 try{return JSON.parse(el.textContent||"[]")}catch{return[]}
}
function baseStorage(kind){
 const raw="khae-ela9-assessment-v2:"+kind;
 return global.KhaemenesEnglish9Records?.storageKey?.(raw)||raw;
}
function record(key){
 try{return JSON.parse(localStorage.getItem(key)||'{"attempts":[]}')}catch{return{attempts:[]}}
}
function bestScore(key){
 const rows=record(key).attempts||[];
 const scores=rows.map(x=>Number(x?.summary?.score)).filter(Number.isFinite);
 return scores.length?Math.max(...scores):null;
}
function render(container,questions,kind){
 container.replaceChildren();
 questions.forEach((q,i)=>{
  const box=document.createElement("fieldset");box.className="question";box.dataset.question=String(i);
  const legend=document.createElement("legend");legend.innerHTML="<strong>"+(i+1)+".</strong> "+esc(q.question||q.prompt||"");
  box.append(legend);
  const choices=document.createElement("div");choices.className="choices";
  (q.choices||q.options||[]).forEach((choice,ci)=>{
   const label=document.createElement("label");label.className="choice";
   const input=document.createElement("input");input.type="radio";input.name=kind+"-"+i;input.value=String(ci);
   const span=document.createElement("span");span.textContent=String(choice);
   label.append(input,span);choices.append(label);
  });
  box.append(choices);
  const fb=document.createElement("p");fb.className="quiz-feedback";fb.hidden=true;box.append(fb);
  container.append(box);
 });
}
function mount(){
 const form=$("[data-e9-fixed-assessment]");if(!form)return;
 const kind=form.dataset.kind||"assessment",bank=readBank(),adapter=global.KhaemenesHighAssessmentAdapter,mc=global.KhaeMonteCarloAssessment;
 const result=$("[data-assessment-result]"),best=$("[data-assessment-best]"),container=$("[data-question-container]",form);
 if(!bank.length||!adapter||!mc||!container){if(result)result.textContent="Assessment runtime unavailable.";return}
 const key=baseStorage(kind);
 let opened;
 try{opened=adapter.open({courseId:"english-9",storageKey:key,bank,kind,fixedOrder:true,count:bank.length})}
 catch(err){if(result)result.textContent="Assessment bank validation failed.";return}
 render(container,opened.questions,kind);
 const prior=mc.getResponses(key,opened.sessionId);
 opened.questions.forEach((q,i)=>{
   const v=prior[q.id]; if(Number.isInteger(v)){const input=form.querySelector('input[name="'+kind+'-'+i+'"][value="'+v+'"]');if(input)input.checked=true}
 });
 form.addEventListener("change",e=>{
   const input=e.target;if(!(input instanceof HTMLInputElement)||input.type!=="radio")return;
   const i=Number(input.name.split("-").pop()),q=opened.questions[i];if(q)mc.saveResponse(key,q.id,Number(input.value),opened.sessionId);
 });
 const syncBest=()=>{if(best){const v=bestScore(key);best.textContent=v===null?"—":v+"%"}};
 syncBest();
 const note=document.createElement("p");note.className="notice";
 note.textContent="Closed-book fixed-form assessment · same questions and answer order on correction attempt · 80% objective mastery target · writing remains evaluator-reviewed.";
 form.prepend(note);
 form.addEventListener("submit",e=>{
  e.preventDefault();let correct=0,complete=true;const reviewSkills=[];
  opened.questions.forEach((q,i)=>{
    const field=form.querySelector('[data-question="'+i+'"]'),feedback=$(".quiz-feedback",field),selected=form.querySelector('input[name="'+kind+'-'+i+'"]:checked');
    if(!selected){complete=false;feedback.hidden=false;feedback.textContent="Choose an answer.";return}
    const ok=Number(selected.value)===q.answer;if(ok)correct++;else reviewSkills.push(q.skill||q.domain||"objective-review");
    feedback.hidden=false;feedback.className="quiz-feedback "+(ok?"good":"bad");
    feedback.textContent=ok?"Correct.":"Review this item against the passage or course evidence.";
  });
  if(!complete){if(result)result.textContent="Please answer every question.";return}
  const score=Math.round(correct/opened.questions.length*100);
  adapter.complete(opened,{score,correct,total:opened.questions.length,mastered:score>=PASS,reviewSkills:[...new Set(reviewSkills)]});
  syncBest();
  if(result)result.innerHTML="Score: <strong>"+score+"%</strong> ("+correct+"/"+opened.questions.length+"). Best retained: <strong>"+(bestScore(key)??score)+"%</strong>. "+(score<PASS?"Correct missed skills, then retry the same form.":"Objective mastery target met. Written work still requires human review.");
 });
 $("[data-new-attempt]",form)?.addEventListener("click",()=>{adapter.newAttempt(key);location.reload()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
global.KhaemenesEnglish9FixedAssessment=Object.freeze({version:"1.0.0",masteryThreshold:PASS});
})(window);

(()=>{
"use strict";

const C=window.EXAM_CONFIG||{};
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const RESULT_SCHEMA="khaemenes.algebra1.assessment-result.v1";
const DRAFT_SCHEMA="khaemenes.algebra1.assessment-draft.v1";
const SIGNAL_SCHEMA="khaemenes-curriculum-signal-v1";
const HISTORY_LIMIT=24;
const threshold=Number.isFinite(Number(C.threshold))?Math.max(1,Math.min(100,Number(C.threshold))):80;

function readJSON(key,fallback=null){
 try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw)??fallback:fallback}catch{return fallback}
}
function writeJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
function slug(value){return String(value||"general").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"general"}
function isDiagnostic(){return /diagnostic|readiness/i.test(`${C.id||""} ${C.title||""}`)}
function draftKey(){return C.storage_key}
function resultKey(){return C.result_key||`${C.storage_key}-result`}
function historyKey(){return `${resultKey()}-history`}
function loadDraft(){
 const raw=readJSON(draftKey(),null);
 if(raw&&raw.record_type===DRAFT_SCHEMA&&raw.answers&&typeof raw.answers==="object")return raw;
 if(raw&&raw.answers&&typeof raw.answers==="object")return{record_type:DRAFT_SCHEMA,answers:raw.answers,saved_at:raw.saved_at||null};
 return{record_type:DRAFT_SCHEMA,answers:{},saved_at:null};
}
let draft=loadDraft();

function shuffledOptions(q){
 const items=(q.options||[]).map((text,original)=>({text,original}));
 for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]]}
 return items;
}

function render(){
 const host=$("#questionHost");if(!host)return;
 host.innerHTML=(C.questions||[]).map((q,i)=>{
  const options=shuffledOptions(q);
  return `<article class="question"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend><div class="options">${options.map(o=>`<label class="option"><input type="radio" name="q${i}" value="${o.original}" ${Number(draft.answers?.[i])===o.original?"checked":""}><span>${esc(o.text)}</span></label>`).join("")}</div><div class="feedback" id="fb${i}" hidden></div></fieldset></article>`;
 }).join("");
 host.onchange=e=>{const m=e.target.name?.match(/^q(\d+)$/);if(m){draft.answers[m[1]]=Number(e.target.value);updateProgress()}};
 updateProgress();
 const existing=normalizeStoredResult(readJSON(resultKey(),null));
 if(existing)showResult(existing,false);
}
function updateProgress(){
 const answered=Object.keys(draft.answers||{}).length,total=(C.questions||[]).length;
 if($("#progressLabel"))$("#progressLabel").textContent=`${answered}/${total} answered`;
 if($("#progressBar"))$("#progressBar").style.width=`${total?answered/total*100:0}%`;
}
function compactAttempt(r){return{score:Number(r.score)||0,total:Number(r.total)||0,percent:Number(r.percent)||0,passed:Number(r.percent)>=threshold,submitted:r.submitted||null,breakdown:r.breakdown||{},skills:r.skills||{},item_evidence:Array.isArray(r.item_evidence)?r.item_evidence:[]}}
function normalizeStoredResult(raw){
 if(!raw||typeof raw!=="object"||!Number.isFinite(Number(raw.percent)))return null;
 if(raw.record_type===RESULT_SCHEMA&&raw.mastery&&raw.attempt_history)return raw;
 const percent=Math.max(0,Math.min(100,Number(raw.percent))),submitted=raw.submitted||new Date().toISOString(),mastered=percent>=threshold;
 return{...raw,record_type:RESULT_SCHEMA,threshold,latest_passed:mastered,passed:mastered,mastery:{threshold,mastered,mastered_at:mastered?submitted:null},attempt_history:{firstScore:percent,latestScore:percent,bestScore:percent,attemptCount:1,masteredAt:mastered?submitted:null,bestSubmittedAt:submitted,attempts:[compactAttempt({...raw,percent,submitted})]}};
}
function mergeAttempt(attempt){
 const prior=normalizeStoredResult(readJSON(resultKey(),null)),h=prior?.attempt_history||null;
 const previousBest=h?Number(h.bestScore):null,bestScore=Number.isFinite(previousBest)?Math.max(previousBest,attempt.percent):attempt.percent;
 const mastered=bestScore>=threshold,masteredAt=h?.masteredAt||prior?.mastery?.mastered_at||(attempt.percent>=threshold?attempt.submitted:null);
 const attempts=[...(h?.attempts||[]),compactAttempt(attempt)].slice(-HISTORY_LIMIT);
 return{...attempt,record_type:RESULT_SCHEMA,threshold,latest_passed:attempt.percent>=threshold,passed:mastered,mastery:{threshold,mastered,mastered_at:masteredAt},attempt_history:{firstScore:h?Number(h.firstScore):attempt.percent,latestScore:attempt.percent,bestScore,attemptCount:Number(h?.attemptCount||0)+1,masteredAt,bestSubmittedAt:!Number.isFinite(previousBest)||attempt.percent>previousBest?attempt.submitted:(h?.bestSubmittedAt||prior?.submitted||null),attempts},trust:{class:"unscoped_browser_course_evidence",evidence_origin:"canonical_course_engine_evidence",learner_scoped:false,independently_authenticated:false,official_record_without_validation:false,storage:"browser_localStorage"}};
}
function scoreAttempt(){
 if(Object.keys(draft.answers||{}).length<(C.questions||[]).length)return null;
 let correct=0;const breakdown={},skills={},items=[];
 (C.questions||[]).forEach((q,i)=>{
  const ok=Number(draft.answers[i])===Number(q.answer);if(ok)correct++;
  const category=q.category||q.domain||"Readiness",skill=q.skill||slug(category);
  const key=isDiagnostic()?category:(q.unit&&Number(q.unit)<=20?`Unit ${String(q.unit).padStart(2,"0")}`:category);
  breakdown[key]??={correct:0,total:0};breakdown[key].total++;if(ok)breakdown[key].correct++;
  skills[skill]??={correct:0,total:0};skills[skill].total++;if(ok)skills[skill].correct++;
  items.push({id:q.id||`${C.id||"ASSESSMENT"}-Q${String(i+1).padStart(3,"0")}`,category,skill,unit:q.unit&&Number(q.unit)<=20?Number(q.unit):null,lesson:q.lesson||null,correct:ok,difficulty:q.difficulty||null});
 });
 const total=(C.questions||[]).length,percent=total?Math.round(correct/total*100):0,submitted=new Date().toISOString();
 return{id:C.id,title:C.title,score:correct,total,percent,threshold,answers:{...draft.answers},breakdown,skills,item_evidence:items,submitted,assessment_version:C.assessment_version||"1.0",program_signal:{schema:SIGNAL_SCHEMA,resource_id:C.id||C.result_key,assessment_version:C.assessment_version||"1.0",assessment_type:isDiagnostic()?"readiness_diagnostic":"formal_assessment",score_summary:{correct,total,percent,threshold,passed:percent>=threshold},domains:breakdown,skills,item_outcomes:items.map(({id,category,skill,unit,lesson,correct,difficulty})=>({id,category,skill,unit,lesson,correct,difficulty})),privacy:"No learner name, family identifier, free-response text, browser identifier, credentials, or answer keys are included in this curriculum-quality signal."}};
}
function revealFeedback(r){
 (C.questions||[]).forEach((q,i)=>{const f=$(`#fb${i}`);if(!f)return;const ok=Number(r.answers?.[i])===Number(q.answer);f.hidden=false;f.className=`feedback ${ok?"good":"bad"}`;f.textContent=`${ok?"Correct.":"Review."} ${q.explanation||""}`});
}
function showResult(r,scroll=true){
 if(!r)return;const latest=Number(r.attempt_history?.latestScore??r.percent),best=Number(r.attempt_history?.bestScore??r.percent),count=Number(r.attempt_history?.attemptCount||1),mastered=best>=threshold;
 if($("#results"))$("#results").hidden=false;
 if($("#resultTitle"))$("#resultTitle").textContent=latest>=threshold?"Mastery demonstrated":mastered?"Mastery preserved · review this retake":"Review and corrections recommended";
 if($("#resultScore"))$("#resultScore").textContent=`${latest}% latest · ${best}% best · ${r.score}/${r.total} · attempt ${count}`;
 if($("#breakdown"))$("#breakdown").innerHTML=Object.entries(r.breakdown||{}).map(([k,v])=>`<p><strong>${esc(k)}:</strong> ${v.correct}/${v.total} (${v.total?Math.round(v.correct/v.total*100):0}%)</p>`).join("");
 if($("#status"))$("#status").textContent=`Result saved locally. ${mastered?"Best mastery evidence is preserved.":"Continue targeted review and retake when ready."}`;
 if(scroll)$("#results")?.scrollIntoView({behavior:"smooth",block:"start"});
}
function saveDraft(){draft.record_type=DRAFT_SCHEMA;draft.saved_at=new Date().toISOString();writeJSON(draftKey(),draft);if($("#status"))$("#status").textContent="Draft saved locally. Drafts do not grant mastery."}
function resetForm(){
 if(!confirm("Clear the current answers and draft? Saved scored assessment evidence will be preserved."))return;
 localStorage.removeItem(draftKey());draft={record_type:DRAFT_SCHEMA,answers:{},saved_at:null};render();document.querySelectorAll(".feedback").forEach(n=>n.hidden=true);if($("#results"))$("#results").hidden=true;if($("#status"))$("#status").textContent="Form reset. Saved scored evidence was preserved.";
}
function downloadJSON(name,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
function exportRecord(){
 const result=normalizeStoredResult(readJSON(resultKey(),null));
 if(result){downloadJSON(C.export_name||`${C.id||"algebra1-assessment"}-result.json`,{schema_version:"1.0",record_type:"khaemenes.assessment.result-record",exported_at:new Date().toISOString(),trust:result.trust||{class:"unscoped_browser_course_evidence",learner_scoped:false,independently_authenticated:false,official_record_without_validation:false},assessment:{id:C.id,title:C.title,type:isDiagnostic()?"readiness_diagnostic":"formal_assessment"},mastery:result.mastery,attempt_history:result.attempt_history,latest_result:{score:result.score,total:result.total,percent:result.percent,submitted:result.submitted},diagnostic_evidence:{breakdown:result.breakdown||{},skills:result.skills||{},item_evidence:result.item_evidence||[]},program_signal:result.program_signal||null});return}
 downloadJSON((C.export_name||`${C.id||"algebra1-assessment"}-draft.json`).replace(/result(?=\.json$)/i,"draft"),{schema_version:"1.0",record_type:"khaemenes.assessment.draft-record",exported_at:new Date().toISOString(),assessment:{id:C.id,title:C.title},draft:{answers:{...draft.answers},saved_at:draft.saved_at},mastery:{threshold,state:"not_assessed",may_grant_mastery:false},trust:{class:"learner_created_browser_draft",learner_scoped:false,independently_authenticated:false,official_record_without_validation:false}});
}

$("#saveButton")&&( $("#saveButton").onclick=saveDraft );
$("#resetButton")&&( $("#resetButton").onclick=resetForm );
$("#submitButton")&&( $("#submitButton").onclick=()=>{
 const attempt=scoreAttempt();if(!attempt){if($("#status"))$("#status").textContent="Answer every question before scoring.";return}
 revealFeedback(attempt);const result=mergeAttempt(attempt);writeJSON(resultKey(),result);writeJSON(historyKey(),result.attempt_history);localStorage.removeItem(draftKey());draft={record_type:DRAFT_SCHEMA,answers:{...attempt.answers},saved_at:null};showResult(result,true);
});
$("#exportButton")&&( $("#exportButton").onclick=exportRecord );
$("#themeToggle")?.addEventListener("click",()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==="light"?"dark":"light"});
$("#printButton")?.addEventListener("click",()=>window.print());
render();
})();
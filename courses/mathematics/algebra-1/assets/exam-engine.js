(()=>{
"use strict";
const C=window.EXAM_CONFIG,$=s=>document.querySelector(s),MASTERY=80;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeParse=(raw,fallback)=>{try{return JSON.parse(raw)||fallback}catch{return fallback}};
function loadDraft(){return safeParse(localStorage.getItem(C.storage_key),{answers:{}})}
function loadEvidence(){
 const prior=safeParse(localStorage.getItem(C.result_key),null);
 if(!prior)return {attempt_history:[],bestScore:null,mastery:false};
 if(Array.isArray(prior.attempt_history))return prior;
 return {attempt_history:[prior],bestScore:Number.isFinite(prior.percent)?prior.percent:null,mastery:(prior.percent||0)>=MASTERY,lastResult:prior};
}
let draft=loadDraft();

function shuffledOptions(q){
 const items=q.options.map((text,original)=>({text,original}));
 for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]]}
 return items;
}
function render(){
 const host=$("#questionHost");
 host.innerHTML=C.questions.map((q,i)=>`<article class="question"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend><div class="options">${shuffledOptions(q).map(o=>`<label class="option"><input type="radio" name="q${i}" value="${o.original}" ${draft.answers[i]===o.original?"checked":""}><span>${esc(o.text)}</span></label>`).join("")}</div><div class="feedback" id="fb${i}" hidden></div></fieldset></article>`).join("");
 host.onchange=e=>{const m=e.target.name?.match(/^q(\d+)$/);if(m){draft.answers[m[1]]=Number(e.target.value);updateProgress()}};
 updateProgress();
}
function updateProgress(){const answered=Object.keys(draft.answers).length,total=C.questions.length;$("#progressLabel").textContent=`${answered}/${total} answered`;$("#progressBar").style.width=`${answered/total*100}%`}
$("#saveButton").onclick=()=>{localStorage.setItem(C.storage_key,JSON.stringify(draft));$("#status").textContent="Draft saved locally."};
$("#resetButton").onclick=()=>{
 if(!confirm("Clear this assessment draft? Saved scored evidence will be preserved."))return;
 localStorage.removeItem(C.storage_key);
 draft={answers:{}};render();$("#results").hidden=true;$("#status").textContent="Draft reset. Saved score history and mastery evidence were preserved.";
};
$("#submitButton").onclick=()=>{
 if(Object.keys(draft.answers).length<C.questions.length){$("#status").textContent="Answer every question before scoring.";return}
 let correct=0,breakdown={};
 C.questions.forEach((q,i)=>{const isCorrect=draft.answers[i]===q.answer;if(isCorrect)correct++;const key=q.unit?`Unit ${String(q.unit).padStart(2,"0")}`:(q.category||"Readiness");breakdown[key]||(breakdown[key]={correct:0,total:0});breakdown[key].total++;if(isCorrect)breakdown[key].correct++;const f=$(`#fb${i}`);f.hidden=false;f.className=`feedback ${isCorrect?"good":"bad"}`;f.textContent=`${isCorrect?"Correct.":"Review."} ${q.explanation}`});
 const percent=Math.round(correct/C.questions.length*100);
 const attempt={id:C.id,title:C.title,score:correct,total:C.questions.length,percent,breakdown,mastery:percent>=MASTERY,submitted:new Date().toISOString()};
 const evidence=loadEvidence();
 const attempt_history=[...(evidence.attempt_history||[]),attempt];
 const priorBest=Number.isFinite(evidence.bestScore)?evidence.bestScore:-Infinity;
 const bestScore=Math.max(priorBest,percent);
 const result={id:C.id,title:C.title,attempt_history,bestScore,mastery:bestScore>=MASTERY,lastResult:attempt,updated:new Date().toISOString()};
 localStorage.setItem(C.storage_key,JSON.stringify(draft));localStorage.setItem(C.result_key,JSON.stringify(result));
 $("#results").hidden=false;$("#resultTitle").textContent=attempt.mastery?"Mastery demonstrated":"Review and corrections recommended";$("#resultScore").textContent=`${percent}% · ${correct}/${C.questions.length} · Best ${bestScore}%`;
 $("#breakdown").innerHTML=Object.entries(breakdown).map(([k,v])=>`<p><strong>${esc(k)}:</strong> ${v.correct}/${v.total} (${Math.round(v.correct/v.total*100)}%)</p>`).join("");
 $("#status").textContent="Result and attempt history saved locally.";$("#results").scrollIntoView({behavior:"smooth"});
};
$("#exportButton").onclick=()=>{const result=safeParse(localStorage.getItem(C.result_key),null)||{draft,exported:new Date().toISOString()};const blob=new Blob([JSON.stringify(result,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=(C.export_name||`${C.id}.json`);a.click();setTimeout(()=>URL.revokeObjectURL(url),500)};
$("#themeToggle")?.addEventListener("click",()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==="light"?"dark":"light"});
$("#printButton")?.addEventListener("click",()=>window.print());
render();
})();

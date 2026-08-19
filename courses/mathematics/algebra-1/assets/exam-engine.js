(()=>{
"use strict";
const C=window.EXAM_CONFIG,$=s=>document.querySelector(s);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function loadDraft(){try{return JSON.parse(localStorage.getItem(C.storage_key))||{answers:{}}}catch{return{answers:{}}}}
let draft=loadDraft();

/*
  Present choices in a fresh order while keeping each radio value tied to
  the option's original index. Saved drafts therefore remain valid even if
  the visible order changes on a later visit.
*/
function shuffledOptions(q){
 const items=q.options.map((text,original)=>({text,original}));
 for(let i=items.length-1;i>0;i--){
   const j=Math.floor(Math.random()*(i+1));
   [items[i],items[j]]=[items[j],items[i]];
 }
 return items;
}

function render(){
 const host=$("#questionHost");
 host.innerHTML=C.questions.map((q,i)=>{
   const options=shuffledOptions(q);
   return `<article class="question"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend>
 <div class="options">${options.map(o=>`<label class="option"><input type="radio" name="q${i}" value="${o.original}" ${draft.answers[i]===o.original?"checked":""}><span>${esc(o.text)}</span></label>`).join("")}</div>
 <div class="feedback" id="fb${i}" hidden></div></fieldset></article>`;
 }).join("");
 host.onchange=e=>{
   const m=e.target.name?.match(/^q(\d+)$/);
   if(m){draft.answers[m[1]]=Number(e.target.value);updateProgress()}
 };
 updateProgress();
}
function updateProgress(){
 const answered=Object.keys(draft.answers).length,total=C.questions.length;
 $("#progressLabel").textContent=`${answered}/${total} answered`;
 $("#progressBar").style.width=`${answered/total*100}%`;
}
$("#saveButton").onclick=()=>{
 localStorage.setItem(C.storage_key,JSON.stringify(draft));
 $("#status").textContent="Draft saved locally.";
};
$("#resetButton").onclick=()=>{
 if(!confirm("Clear this assessment draft and saved result?"))return;
 localStorage.removeItem(C.storage_key);localStorage.removeItem(C.result_key);
 draft={answers:{}};render();$("#results").hidden=true;$("#status").textContent="Assessment reset.";
};
$("#submitButton").onclick=()=>{
 if(Object.keys(draft.answers).length<C.questions.length){
   $("#status").textContent="Answer every question before scoring.";return;
 }
 let correct=0,breakdown={};
 C.questions.forEach((q,i)=>{
   const ok=draft.answers[i]===q.answer;if(ok)correct++;
   const key=q.unit?`Unit ${String(q.unit).padStart(2,"0")}`:(q.category||"Readiness");
   breakdown[key]||(breakdown[key]={correct:0,total:0});
   breakdown[key].total++;if(ok)breakdown[key].correct++;
   const f=$(`#fb${i}`);f.hidden=false;f.className=`feedback ${ok?"good":"bad"}`;
   f.textContent=`${ok?"Correct.":"Review."} ${q.explanation}`;
 });
 const percent=Math.round(correct/C.questions.length*100);
 const result={id:C.id,title:C.title,score:correct,total:C.questions.length,percent,breakdown,submitted:new Date().toISOString()};
 localStorage.setItem(C.storage_key,JSON.stringify(draft));
 localStorage.setItem(C.result_key,JSON.stringify(result));
 $("#results").hidden=false;
 $("#resultTitle").textContent=percent>=80?"Mastery demonstrated":"Review and corrections recommended";
 $("#resultScore").textContent=`${percent}% · ${correct}/${C.questions.length}`;
 $("#breakdown").innerHTML=Object.entries(breakdown).map(([k,v])=>`<p><strong>${esc(k)}:</strong> ${v.correct}/${v.total} (${Math.round(v.correct/v.total*100)}%)</p>`).join("");
 $("#status").textContent="Result saved locally.";
 $("#results").scrollIntoView({behavior:"smooth"});
};
$("#exportButton").onclick=()=>{
 const result=JSON.parse(localStorage.getItem(C.result_key)||"null")||{draft,exported:new Date().toISOString()};
 const blob=new Blob([JSON.stringify(result,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=(C.export_name||`${C.id}.json`);a.click();
 setTimeout(()=>URL.revokeObjectURL(url),500);
};
$("#themeToggle")?.addEventListener("click",()=>{
 document.documentElement.dataset.theme=document.documentElement.dataset.theme==="light"?"dark":"light";
});
$("#printButton")?.addEventListener("click",()=>window.print());
render();
})();

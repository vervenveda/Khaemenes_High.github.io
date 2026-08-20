/* Khaemenes Academy Exam Engine · Public cumulative self-check engine */

"use strict";
(function(){
 const C=window.EXAM_CONFIG;if(!C)return;
 const $=id=>document.getElementById(id), stateKey=C.storage_key, resultKey=C.result_key;
 const DISPLAY_VERSION="balanced-option-order-v2";
 const RESULT_SCHEMA="khaemenes-assessment-result-v2";
 const PUBLIC_CLASSIFICATION="public-self-check-nonconfidential";
 const state={answers:{},submitted:false};
 function load(){try{const d=JSON.parse(localStorage.getItem(stateKey)||"{}");Object.assign(state,d)}catch{}}
 function save(){localStorage.setItem(stateKey,JSON.stringify(state));updateProgress()}
 function theme(v){document.documentElement.dataset.theme=v;localStorage.setItem("khaemenes-theme",v)}
 theme(localStorage.getItem("khaemenes-theme")||(matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"));
 $("themeToggle").onclick=()=>theme(document.documentElement.dataset.theme==="light"?"dark":"light");

 function hashSeed(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
 function nextSeed(x){x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0}
 function shuffled(values,seed){const a=values.slice();let x=seed>>>0;for(let i=a.length-1;i>0;i--){x=nextSeed(x);const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
 function balancedTargets(total){const pool=Array.from({length:total},(_,i)=>i%4);return shuffled(pool,hashSeed(`${C.id}:${total}:balanced-targets-v283`))}
 const targetPositions=balancedTargets(C.questions.length);
 function optionOrder(q,i){
  const answer=Number(q.answer), rest=q.options.map((_,j)=>j).filter(j=>j!==answer);
  const mixed=shuffled(rest,hashSeed(`${C.id}:${i}:distractors-v21`));
  const target=(targetPositions[i]??0)%q.options.length;
  mixed.splice(target,0,answer);
  return mixed;
 }

 function installClassificationNotice(){
  const submit=$("submitButton"),exp=$("exportButton");
  if(submit)submit.textContent="Submit & Self-Check";
  if(exp)exp.textContent="Export Unverified Result";
  const hero=document.querySelector("main .hero .wrap");
  if(hero&&!document.getElementById("publicAssessmentClassification")){
   const p=document.createElement("p");p.id="publicAssessmentClassification";p.className="notice";
   p.innerHTML="<strong>Public self-check form:</strong> this browser-delivered assessment is not confidential. Its score is editable local data and is not a digitally signed course record. Use an administrator-issued supervised form when confidential summative testing is required.";
   hero.appendChild(p);
  }
  const resultSection=$("results");
  const existing=resultSection?.querySelector(".notice");
  if(existing)existing.textContent="This public self-check result may be retained as learning evidence after parent/administrator review. It is not confidential, digitally signed, or independently authenticated.";
  document.querySelectorAll(".footer-inner span").forEach(span=>{if(/Local-only scoring|Printable|Exportable/i.test(span.textContent))span.textContent="Public self-check · Local-only · Unverified"});
 }

 function group(){const m=new Map();C.questions.forEach((q,i)=>{const k=`Unit ${q.unit}`;if(!m.has(k))m.set(k,[]);m.get(k).push([q,i])});return m}
 function render(){const host=$("questionHost");host.innerHTML="";for(const [label,items] of group()){
  const sec=document.createElement("section");sec.className="section-block";const head=document.createElement("div");head.className="section-title";head.innerHTML=`<strong>${label}</strong><span>${items.length} questions</span>`;sec.append(head);
  const list=document.createElement("div");list.className="question-list";
  items.forEach(([q,i])=>{const art=document.createElement("article");art.className="question";const fs=document.createElement("fieldset");const legend=document.createElement("legend");legend.innerHTML=`<span class="qmeta">Question ${i+1} · ${escapeHtml(q.domain)}</span>${escapeHtml(q.prompt)}`;fs.append(legend);const opts=document.createElement("div");opts.className="options";
   optionOrder(q,i).forEach(j=>{const o=q.options[j];const lab=document.createElement("label");lab.className="option";lab.innerHTML=`<input type="radio" name="q${i}" value="${j}"> <span>${escapeHtml(o)}</span>`;const inp=lab.querySelector("input");if(Number(state.answers[i])===j)inp.checked=true;inp.disabled=state.submitted;inp.onchange=()=>{state.answers[i]=j;save()};opts.append(lab)});fs.append(opts);
   if(state.submitted){const ok=Number(state.answers[i])===q.answer;const fb=document.createElement("div");fb.className=`feedback ${ok?"correct":"incorrect"}`;fb.textContent=(ok?"Correct. ":`Correct answer: ${q.options[q.answer]}. `)+q.explanation;fs.append(fb)}art.append(fs);list.append(art)});sec.append(list);host.append(sec)}updateProgress()}
 function escapeHtml(s){return String(s).replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]))}
 function updateProgress(){const n=Object.keys(state.answers).length,total=C.questions.length,p=Math.round(n/total*100);$("progressLabel").textContent=`${n}/${total}`;$("progressBar").style.width=p+"%";$("status").textContent=state.submitted?"Self-check submitted. Browser-local result is not digitally verified.":`${total-n} questions remaining.`}
 function grade(p){return p>=90?"A":p>=80?"B":p>=70?"C":p>=60?"D":"F"}
 function submit(){if(Object.keys(state.answers).length!==C.questions.length){$("status").textContent="Answer every question before submitting.";return}state.submitted=true;let correct=0;const by={};C.questions.forEach((q,i)=>{const k=`Unit ${q.unit}`;by[k]??={correct:0,total:0};by[k].total++;if(Number(state.answers[i])===q.answer){correct++;by[k].correct++}});const percent=Math.round(correct/C.questions.length*1000)/10;const threshold=Number.isFinite(Number(C.mastery_threshold))?Number(C.mastery_threshold):null;const result={result_schema:RESULT_SCHEMA,assessment_id:C.id,title:C.title,assessment_classification:PUBLIC_CLASSIFICATION,correct,total:C.questions.length,percent,letter_grade:grade(percent),submitted_at:new Date().toISOString(),section_scores:by,option_order_version:DISPLAY_VERSION,trust:{classification:"browser-local-self-scored",authoritative:false,confidential:false,cryptographically_verified:false,digitally_signed:false,editable_storage:true,review_required:true}};if(threshold!==null){result.mastery_threshold=threshold;result.mastery_met=percent>=threshold}localStorage.setItem(resultKey,JSON.stringify(result));save();render();showResult(result)}
 function showResult(r){$("results").hidden=false;$("resultScore").textContent=r.percent+"%";const mastery=(typeof r.mastery_met==="boolean")?` · ${r.mastery_met?"Mastery met":"Review recommended"}`:"";$("resultTitle").textContent=`${r.correct} of ${r.total} correct · Grade ${r.letter_grade}${mastery}`;const grid=$("breakdown");grid.innerHTML="";Object.entries(r.section_scores||{}).forEach(([k,v])=>{const a=document.createElement("article");a.innerHTML=`<strong>${v.correct}/${v.total}</strong><span>${k}</span>`;grid.append(a)});$("status").textContent="Result saved locally as an unverified public self-check. It is editable browser data and is not an authoritative or digitally signed record.";$("results").scrollIntoView({behavior:"smooth"})}
 function reset(){if(!confirm("Clear all answers and the saved result for this assessment?"))return;localStorage.removeItem(stateKey);localStorage.removeItem(resultKey);state.answers={};state.submitted=false;$("results").hidden=true;render()}
 function exportResult(){const raw=localStorage.getItem(resultKey);if(!raw){$("status").textContent="Submit the assessment before exporting a result.";return}const blob=new Blob([raw],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=C.export_name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);$("status").textContent="Unverified public self-check result exported for parent/administrator review."}
 load();installClassificationNotice();render();const saved=localStorage.getItem(resultKey);if(saved){try{showResult(JSON.parse(saved))}catch{}}
 $("submitButton").onclick=submit;$("saveButton").onclick=()=>{save();$("status").textContent="Draft saved in this browser."};$("resetButton").onclick=reset;$("exportButton").onclick=exportResult;$("printButton").onclick=()=>window.print();
})();

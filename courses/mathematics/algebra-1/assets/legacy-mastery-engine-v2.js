(()=>{
"use strict";
const D=window.ALGEBRA1_DATA,Q=window.ALGEBRA1_QUESTIONS,R=window.PAGE_REF,$=s=>document.querySelector(s),MASTERY=80,COUNT=20;
if(!D||!Q||!R||R.type!=="mastery")return;
const unit=D.units.find(u=>u.number===R.unit),lessons=D.lessons.filter(l=>l.unit===R.unit),root=R.root||"",KEY=`khaemenes-algebra1-unit${String(R.unit).padStart(2,"0")}-progress-v1`;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeParse=(raw,fallback)=>{try{const v=JSON.parse(raw);return v&&typeof v==="object"?v:fallback}catch{return fallback}};
function state(){const p=safeParse(localStorage.getItem(KEY),{pathway:"Core",completed:[],scores:{},reflections:{},attempts:[]});p.completed=Array.isArray(p.completed)?p.completed:[];p.scores=p.scores&&typeof p.scores==="object"?p.scores:{};p.attempts=Array.isArray(p.attempts)?p.attempts:[];return p}
function save(p){try{localStorage.setItem(KEY,JSON.stringify(p));return true}catch{return false}}
function hashSeed(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function nextSeed(x){x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0}
function shuffled(values,seed){const a=[...values];let x=(seed>>>0)||0x9e3779b9;for(let i=a.length-1;i>0;i--){x=nextSeed(x);const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function randomSeed(){try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]||1}catch{return (Date.now()^Math.floor(Math.random()*0xffffffff))>>>0||1}}
function difficultyOf(q){const n=Number(q?.difficulty);return n>=1&&n<=3?n:2}
function lessonQuota(index){const base=Math.floor(COUNT/lessons.length),remainder=COUNT%lessons.length;return base+(index<remainder?1:0)}
function targetDifficulties(need){if(need>=4)return [1,2,2,3].slice(0,need);if(need===3)return [1,2,3];if(need===2)return [2,3];return [2]}
function uniqueById(rows){const seen=new Set();return rows.filter(q=>{const id=String(q?.id||"");if(!id||seen.has(id))return false;seen.add(id);return true})}
const baseSource=Number(R.unit)===11?"unit11-rebuild":"shared-base";
const basePool=Q.filter(q=>Number(q.unit)===Number(R.unit)).map(q=>({...q,_formSource:baseSource}));
const lateExtra=(Array.isArray(window.ALGEBRA1_LATE_ABUNDANT_QUESTIONS)?window.ALGEBRA1_LATE_ABUNDANT_QUESTIONS:[]).filter(q=>Number(q.unit)===Number(R.unit)).map(q=>({...q,_formSource:"late-abundant"}));
const eligiblePool=uniqueById([...basePool,...lateExtra]);
const bankVersion=Number(R.unit)===11&&basePool.length>=120?"unit11-content-rebuild-v2":lateExtra.length?`unit${String(R.unit).padStart(2,"0")}-late-abundant-v1`:"shared-question-bank-v1";
function selectLesson(pool,need,previousSet,seed,lessonNumber){
 const selected=[],used=new Set(),targets=targetDifficulties(need);
 const pick=(predicate,salt)=>{const candidates=pool.filter(q=>!used.has(q.id)&&predicate(q));if(!candidates.length)return false;const chosen=shuffled(candidates,hashSeed(`${seed}:${lessonNumber}:${salt}:${selected.length}`))[0];selected.push(chosen);used.add(chosen.id);return true};
 for(const target of targets){
  if(pick(q=>!previousSet.has(q.id)&&difficultyOf(q)===target,`unseen-d${target}`))continue;
  if(pick(q=>!previousSet.has(q.id),"unseen-any"))continue;
  if(pick(q=>difficultyOf(q)===target,`seen-d${target}`))continue;
  pick(()=>true,"fallback");
 }
 return selected;
}
function selectForm(previousIds,seed){
 const previousSet=new Set(previousIds||[]),selected=[];
 lessons.forEach((lesson,index)=>{const pool=eligiblePool.filter(q=>Number(q.lesson)===Number(lesson.number));selected.push(...selectLesson(pool,lessonQuota(index),previousSet,seed,lesson.number))});
 return shuffled(selected,hashSeed(`${seed}:form-order`)).slice(0,COUNT);
}
function balancedOrder(q,target,seed){const answer=Number(q.answer),others=q.options.map((_,i)=>i).filter(i=>i!==answer),rest=shuffled(others,hashSeed(`${seed}:${q.id}:options`)),order=[...rest];order.splice(target,0,answer);return order}
function prepareForm(previousIds){const seed=randomSeed(),selected=selectForm(previousIds,seed),targets=shuffled(Array.from({length:COUNT},(_,i)=>i%4),hashSeed(`${seed}:answer-positions`));return {seed,items:selected.map((q,i)=>({...q,_optionOrder:balancedOrder(q,targets[i],seed)}))}}
function lock(title,detail,href){$("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Strict 80% Mastery Gate</p><h1>${esc(title)}</h1><p class="lead">${esc(detail)}</p><div class="actions"><a class="btn primary" href="${esc(href)}">Return to required mastery step</a><a class="btn" href="${root}">Course Home</a></div></div></section><section class="block"><div class="wrap"><article class="card"><h2>Formal mastery remains locked</h2><p>A below-target attempt may remain in the learner record, but it does not substitute for the required lesson, weekly, unit, or cumulative mastery evidence.</p></article></div></section>`}
function prerequisites(A){
 if(!A)return {title:"Mastery evidence unavailable",detail:"The canonical Algebra I mastery authority could not be loaded. This formal assessment is locked rather than guessing at progression.",href:root};
 if(R.unit>1&&!A.unitMastered(R.unit-1))return {title:`Unit ${String(R.unit).padStart(2,"0")} mastery is locked`,detail:`Reach ${MASTERY}% mastery on Unit ${String(R.unit-1).padStart(2,"0")} first.`,href:`${root}units/unit-${String(R.unit-1).padStart(2,"0")}/assessment/mastery-check.html`};
 if(R.unit>=7&&!A.midtermMastered())return {title:`Unit ${String(R.unit).padStart(2,"0")} mastery is locked`,detail:`Reviewed mixed-evidence Midterm mastery at ${MASTERY}% is required throughout second-half Algebra I progression.`,href:`${root}assessments/midterm-units-01-06.html`};
 const missingLessons=lessons.filter(l=>!A.lessonMastered(R.unit,l.number,l.id));
 if(missingLessons.length)return {title:`Unit ${String(R.unit).padStart(2,"0")} mastery is locked`,detail:`Every lesson check in this unit must reach ${MASTERY}% before formal unit mastery opens. ${missingLessons.length} lesson gate(s) remain.`,href:`${root}units/unit-${String(R.unit).padStart(2,"0")}/`};
 const weeks=[...new Set(lessons.map(l=>Number(l.week)).filter(Number.isFinite))],missingWeeks=weeks.filter(w=>!A.weekMastered(w));
 if(missingWeeks.length)return {title:`Unit ${String(R.unit).padStart(2,"0")} mastery is locked`,detail:`Every graded weekly mastery gate in this unit must reach ${MASTERY}% before formal unit mastery opens.`,href:`${root}assessments/weekly-mastery.html?week=${missingWeeks[0]}`};
 return null;
}
function run(){
 const A=window.KhaemenesAlgebra1MasteryAuthority,p=prerequisites(A);if(p){lock(p.title,p.detail,p.href);return}
 const quotas=lessons.map((lesson,index)=>({lesson:Number(lesson.number),need:lessonQuota(index),available:eligiblePool.filter(q=>Number(q.lesson)===Number(lesson.number)).length}));
 const targetPoolSize=Number(R.unit)===11?120:60;
 const complete=eligiblePool.length>=targetPoolSize&&quotas.every(x=>x.available>=x.need*2);
 const existing=state(),last=existing.attempts[existing.attempts.length-1],initialPrevious=Array.isArray(last?.items)?last.items:Array.isArray(last?.item_ids)?last.item_ids:[];
 let graded=false,attemptNumber=existing.attempts.length+1,previousIds=[...initialPrevious],current=[],formSeed=0;
 $("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit ${String(R.unit).padStart(2,"0")} · Formal mastery evidence</p><h1>${esc(unit?.title||"Mastery Check")}</h1><p class="lead">20 lesson-balanced questions selected from ${eligiblePool.length} eligible items · 80% target</p><div class="actions no-print"><a class="btn" href="${root}">Course Home</a><a class="btn" href="${root}units/unit-${String(R.unit).padStart(2,"0")}/">Unit Home</a><button class="btn" id="printButton" type="button">Print</button></div></div></section><section class="block"><div class="wrap practice-layout"><article class="card">${complete?`<p id="formMeta" class="notice"></p><div id="questions"></div><div class="actions"><button class="btn primary" id="score">Submit & Score</button><button class="btn" id="reset">Clear current answers</button><button class="btn" id="export">Export Evidence</button></div><p id="scoreMsg" role="status" aria-live="polite" aria-atomic="true"></p>`:`<p class="notice"><strong>Assessment configuration incomplete.</strong> This unit does not currently provide the certified abundant pool needed for a low-overlap 20-question mastery record. Do not issue mastery from this page.</p>`}</article><aside class="card practice-side"><h3>Blueprint contract</h3><p>Every lesson is represented. Forms use difficulty-balanced selection from an abundant bank and prefer questions not seen on the immediately previous attempt.</p><p><strong>Eligible pool:</strong> ${eligiblePool.length} items. <strong>Delivered:</strong> 20. <strong>Mastery:</strong> 16/20 correct (80%).</p><p class="notice">Browser-local results are editable learning evidence, not digitally signed or independently authenticated records.</p></aside></div></section>`;
 if(!complete){$("#printButton")?.addEventListener("click",()=>print());return}
 function renderForm(){const form=prepareForm(previousIds);formSeed=form.seed;current=form.items;$("#questions").innerHTML=current.map((q,i)=>`<article class="question"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend><div class="options">${q._optionOrder.map(j=>`<label class="option"><input type="radio" name="q${i}" value="${j}"><span>${esc(q.options[j])}</span></label>`).join("")}</div><div class="feedback" id="fb${i}" hidden></div></fieldset></article>`).join("");const previousSet=new Set(previousIds),overlap=current.filter(q=>previousSet.has(q.id)).length;$("#formMeta").textContent=`Attempt ${attemptNumber} · 20 questions from ${eligiblePool.length} eligible items · immediate prior-form overlap: ${overlap}/20.`}
 function beginAttempt(){graded=false;renderForm();$("#score").disabled=false;$("#score").textContent="Submit & Score";$("#reset").textContent="Clear current answers";$("#scoreMsg").textContent=""}
 function score(){
  if(graded)return;
  let correct=0,all=true;
  const answerSnapshot=[];
  current.forEach((q,i)=>{
   const selected=document.querySelector(`input[name=q${i}]:checked`),f=$(`#fb${i}`);
   f.hidden=false;
   if(!selected){all=false;f.className="feedback bad";f.textContent="Choose an answer.";return}
   const selectedOriginalIndex=Number(selected.value),order=q._optionOrder,selectedDisplayIndex=order.indexOf(selectedOriginalIndex),correctOriginalIndex=Number(q.answer),correctDisplayIndex=order.indexOf(correctOriginalIndex),right=selectedOriginalIndex===correctOriginalIndex;
   if(right)correct++;
   f.className=`feedback ${right?"good":"bad"}`;
   f.textContent=`${right?"Correct.":"Review."} ${q.explanation}`;
   answerSnapshot.push({
    id:q.id,
    lesson:Number(q.lesson),
    category:q.category||null,
    difficulty:Number(q.difficulty)||null,
    source:q._formSource||"shared-base",
    selectedDisplayIndex,
    selectedOriginalIndex,
    correctDisplayIndex,
    correctOriginalIndex,
    optionOrder:[...order],
    selectedText:q.options[selectedOriginalIndex]??null,
    correctText:q.options[correctOriginalIndex]??q.answer_text??null,
    misconceptionTag:q.misconceptionTag||null,
    misconceptionMapVersion:null,
    misconceptionMapSource:null,
    misconceptionReviewStatus:q.reviewStatus||null,
    misconceptionLearnerFeedback:false,
    generatorId:q.generatorId||null,
    generatorVersion:q.generatorVersion||null,
    seed:q.seed??null
   });
  });
  if(!all){$("#scoreMsg").textContent="Answer every item before scoring.";return}
  const pct=Math.round(correct/current.length*100),record=state(),priorSet=new Set(previousIds),overlap=current.filter(q=>priorSet.has(q.id)).length;
  record.scores.mastery=Math.max(Number(record.scores.mastery)||0,pct);
  if(pct>=MASTERY&&!record.completed.includes("mastery"))record.completed.push("mastery");
  const attempt={
   result_schema:"khaemenes-algebra1-unit-mastery-v4",
   evidenceSchema:"algebra1-answer-evidence-v2",
   formVersion:"algebra1-late-unit-monte-carlo-v1",
   bankVersion,
   selectionPolicy:"lesson-balanced-low-overlap-v1",
   unit:R.unit,
   score:pct,
   correct,
   total:current.length,
   mastery_threshold:MASTERY,
   mastery_met:pct>=MASTERY,
   attemptNumber,
   eligiblePoolSize:eligiblePool.length,
   formSeed,
   immediatePriorOverlap:overlap,
   lessonBlueprint:quotas.map(x=>({lesson:x.lesson,count:x.need})),
   formSources:[...new Set(current.map(q=>q._formSource||"shared-base"))],
   items:current.map(q=>q.id),
   item_ids:current.map(q=>q.id),
   answerSnapshot,
   submitted_at:new Date().toISOString(),
   trust:{classification:"browser-local-public-self-check",authoritative:false,editable_storage:true,digitally_signed:false}
  };
  record.attempts.push(attempt);
  const persisted=save(record);
  graded=true;
  document.querySelectorAll('#questions input[type="radio"]').forEach(input=>input.disabled=true);
  const scoreButton=$("#score"),resetButton=$("#reset");
  if(scoreButton){scoreButton.disabled=true;scoreButton.textContent="Attempt graded"}
  if(resetButton)resetButton.textContent="Begin a new attempt";
  previousIds=current.map(q=>q.id);
  if(persisted){
   attemptNumber=record.attempts.length+1;
   $("#scoreMsg").innerHTML=`<span class="score">${pct}%</span> · ${correct}/${current.length} correct · Best ${record.scores.mastery}% saved.${pct>=MASTERY?" · Mastery demonstrated.":" · Review, correct, and begin a new attempt."}`;
  }else{
   attemptNumber+=1;
   $("#scoreMsg").innerHTML=`<span class="score">${pct}%</span> · ${correct}/${current.length} correct · <strong>No mastery credit was recorded because this browser could not save the attempt.</strong> Export evidence if needed, then restore browser storage before retrying.`;
  }
 }
 function reset(){
  if(graded){beginAttempt();return}
  document.querySelectorAll('#questions input[type="radio"]').forEach(x=>x.checked=false);
  document.querySelectorAll(".feedback").forEach(x=>x.hidden=true);
  $("#scoreMsg").textContent="";
 }
 function exportEvidence(){const s=state(),payload={schema:"khaemenes-algebra1-unit-mastery-export-v4",evidenceSchema:"algebra1-answer-evidence-v2",exported_at:new Date().toISOString(),unit:R.unit,record:s,trust:{authoritative:false,digitally_signed:false,editable_storage:true}};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`algebra1-unit-${String(R.unit).padStart(2,"0")}-mastery.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
 if(complete){$("#score").onclick=score;$("#reset").onclick=reset;$("#export").onclick=exportEvidence;beginAttempt()}
 $("#printButton")?.addEventListener("click",()=>print());
 $("#themeToggle")?.addEventListener("click",()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==="light"?"dark":"light"});
}
function start(){if(window.KhaemenesAlgebra1MasteryAuthority)return run();const s=document.createElement("script");s.src=new URL(`${root}assets/mastery-authority-v1.js`,location.href).href;s.async=false;s.onload=run;s.onerror=()=>{const p=prerequisites(null);lock(p.title,p.detail,p.href)};document.head.appendChild(s)}
start();
})();

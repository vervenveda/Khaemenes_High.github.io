(()=>{"use strict";const D=window.KHAE_UNIT03,$=s=>document.querySelector(s),KEY="khaemenes-algebra1-unit03-a3-v1",esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function state(){try{return JSON.parse(localStorage.getItem(KEY)||'{"attempts":[],"best":{}}')}catch{return{attempts:[],best:{}}}}function save(x){try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch{return false}}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function arch(extra={}){let q=new URLSearchParams({course:"Algebra I",unit:"Unit 03 — The Balance Laboratory",...extra});return "https://artist1970.github.io/Archaemenes.github.io/high/?"+q}
function qhtml(items){return items.map((q,i)=>`<div class="question"><strong>${i+1}. ${esc(q.prompt)}</strong>${q.options.map((o,j)=>`<label class="option"><input type="radio" name="q${i}" value="${j}"> ${esc(o)}</label>`).join("")}<div id="f${i}" class="feedback" hidden></div></div>`).join("")}
function installRetry(){
 const score=document.getElementById("score");
 if(!score)return null;
 const existing=document.getElementById("practiceRetry");
 if(existing)return existing;
 const retry=document.createElement("button");
 retry.type="button";retry.id="practiceRetry";retry.className="btn";
 retry.textContent="Begin a new shuffled attempt";
 retry.setAttribute("aria-label","Start a new attempt with reshuffled choices while preserving saved scores");
 retry.style.marginLeft="10px";
 retry.hidden=true;retry.disabled=true;
 score.after(retry);
 return retry;
}
function bind(items,key){
 const score=document.getElementById("score");
 if(!score)return;
 const retry=installRetry();
 if(retry){
  retry.textContent="Begin a fresh randomized attempt";
  retry.setAttribute("aria-label","Start a fresh attempt with a new aligned question form and balanced answer positions while preserving saved scores");
 }
 const readRecords=(typeof state==="function"?state:st);
 const saveRecords=(typeof save==="function"?save:sv);
 const container=score.closest(".card")||score.closest(".wrap")||document.getElementById("main");
 const dedicatedBank=[...items];
 const unitNumber=Number(D?.unit?.number)||3;
 const lessonNumber=key.startsWith("lesson-")?Number(key.slice(7)):null;
 const supplemental=lessonNumber&&Array.isArray(window.ALGEBRA1_QUESTIONS)
  ?window.ALGEBRA1_QUESTIONS.filter(q=>Number(q.unit)===unitNumber&&Number(q.lesson)===lessonNumber)
  :[];
 let current=[],graded=false,attempt=0;
 const shuffleForm=(source)=>{
  const arr=[...source];
  for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}
  return arr;
 };
 const renderQuestions=(rows)=>rows.map((q,i)=>`<div class="question"><strong>${i+1}. ${esc(q.prompt)}</strong>${q.options.map((o,j)=>`<label class="option"><input type="radio" name="q${i}" value="${j}"> ${esc(o)}</label>`).join("")}<div id="f${i}" class="feedback" hidden></div></div>`).join("");
 const inputs=()=>[...container.querySelectorAll('.question input[type="radio"]')];
 const balanceOptions=(chosen)=>{
  const targets=shuffleForm(chosen.map((_,i)=>i%4));
  return chosen.map((q,qi)=>{
   const sourceOptions=q.options.map((text,i)=>({text,i}));
   if(sourceOptions.length!==4){
    const order=shuffleForm(sourceOptions);
    return {...q,options:order.map(o=>o.text),answer:order.findIndex(o=>o.i===q.answer),_originalAnswer:q.answer,_optionOrder:order.map(o=>o.i)};
   }
   const correct=sourceOptions.find(o=>o.i===q.answer);
   const distractors=shuffleForm(sourceOptions.filter(o=>o.i!==q.answer));
   const target=targets[qi],order=[];let d=0;
   for(let pos=0;pos<4;pos++)order.push(pos===target?correct:distractors[d++]);
   return {...q,options:order.map(o=>o.text),answer:target,_originalAnswer:q.answer,_optionOrder:order.map(o=>o.i)};
  });
 };
 const chooseForm=()=>{
  if(!lessonNumber||!supplemental.length)return dedicatedBank.map(q=>({...q,_formSource:"dedicated"}));
  if(attempt===0)return dedicatedBank.map(q=>({...q,_formSource:"dedicated"}));
  const desired=dedicatedBank.length;
  const supplementalCount=Math.min(supplemental.length,Math.max(1,Math.floor(desired/2)));
  const previousIds=new Set(current.map(q=>q.id));
  const unseen=shuffleForm(dedicatedBank.filter(q=>!previousIds.has(q.id)));
  const seen=shuffleForm(dedicatedBank.filter(q=>previousIds.has(q.id)));
  const keep=shuffleForm([...unseen,...seen]).slice(0,desired-supplementalCount);
  const alternate=shuffleForm(supplemental).slice(0,supplementalCount).map(q=>({...q,_formSource:"aligned-alternate"}));
  return shuffleForm([...keep.map(q=>({...q,_formSource:"dedicated"})),...alternate]);
 };
 function fresh(){
  const chosen=chooseForm();
  current=balanceOptions(chosen);
  const old=[...container.querySelectorAll(".question")];
  if(!old.length)throw new Error("assessment-questions-missing");
  old[0].insertAdjacentHTML("beforebegin",renderQuestions(current));old.forEach(q=>q.remove());
  graded=false;attempt++;
  score.disabled=false;score.textContent="Submit & Score";
  if(retry){retry.hidden=true;retry.disabled=true;}
  const result=document.getElementById("result");
  if(result)result.textContent=lessonNumber
   ?`Attempt ${attempt} · ${current.length} questions · balanced answer positions${attempt>1?" · aligned alternate items included":""}. Answer all items before grading.`
   :`Attempt ${attempt} · fixed blueprint · balanced answer positions. Answer all items before grading.`;
 }
 retry?.addEventListener("click",()=>{if(graded)fresh()});
 score.addEventListener("click",async()=>{
  if(graded)return;
  const resolver=window.KhaemenesAlgebra1Misconceptions;
  if(resolver?.ready)await resolver.ready;
  let correct=0,complete=true;
  const snapshots=[];
  current.forEach((q,i)=>{
   const answer=container.querySelector('input[name="q'+i+'"]:checked');
   const feedback=container.querySelector("#f"+i);
   if(!answer){
    complete=false;
    if(feedback){feedback.hidden=false;feedback.className="feedback bad";feedback.textContent="Choose an answer.";}
    return;
   }
   const selectedDisplayIndex=Number(answer.value);
   const selectedOriginalIndex=Array.isArray(q._optionOrder)?q._optionOrder[selectedDisplayIndex]:selectedDisplayIndex;
   const correctOriginalIndex=Number.isInteger(q._originalAnswer)?q._originalAnswer:q.answer;
   const ok=selectedDisplayIndex===q.answer;
   const diagnostic=!ok?resolver?.lookup?.(q.id,selectedOriginalIndex):null;
   if(ok)correct++;
   snapshots.push({
    id:q.id,
    source:q._formSource||"dedicated",
    selectedDisplayIndex,
    selectedOriginalIndex,
    correctDisplayIndex:q.answer,
    correctOriginalIndex,
    selectedText:q.options[selectedDisplayIndex],
    correctText:q.options[q.answer],
    misconceptionTag:diagnostic?.misconceptionTag||null,
    misconceptionMapVersion:diagnostic?.mapVersion||null,
    misconceptionMapSource:diagnostic?.mapSource||null,
    misconceptionReviewStatus:diagnostic?.reviewStatus||null,
    misconceptionLearnerFeedback:Boolean(diagnostic?.learnerFeedbackEligible)
   });
   if(feedback){feedback.hidden=false;feedback.className="feedback "+(ok?"good":"bad");feedback.textContent=(ok?"Correct. ":"Review. ")+q.explanation+(!ok&&diagnostic?.learnerFeedbackEligible&&diagnostic.rationale?" Misconception check: "+diagnostic.rationale:"");}
  });
  if(!complete){const result=document.getElementById("result");if(result)result.textContent="Answer every item before scoring. Nothing was recorded.";return;}
  const percent=Math.round(100*correct/current.length);
  const record=readRecords();
  record.attempts=Array.isArray(record.attempts)?record.attempts:[];
  record.best=record.best&&typeof record.best==="object"?record.best:{};
  record.attempts.push({
   key,score:percent,correct,total:current.length,at:new Date().toISOString(),
   items:current.map(q=>q.id),
   answerSnapshot:snapshots,
   formVersion:"algebra1-runtime-balanced-v2",
   formSources:[...new Set(current.map(q=>q._formSource||"dedicated"))],
   mastery_threshold:80,mastery_met:percent>=80,attemptNumber:attempt
  });
  record.best[key]=Math.max(record.best[key]||0,percent);
  const persisted=saveRecords(record);
  graded=true;score.disabled=true;score.textContent="Attempt graded";
  inputs().forEach(input=>{input.disabled=true;});
  if(retry){retry.hidden=false;retry.disabled=false;}
  const result=document.getElementById("result");
  if(!persisted){
   if(result)result.textContent="Answer check finished, but this attempt was NOT saved on this device. No mastery credit was recorded. Check available browser storage, then begin a new attempt.";
   return;
  }
  if(result)result.innerHTML="<strong>"+percent+"%</strong> · "+correct+"/"+current.length+" · Best "+record.best[key]+"% · Answers locked. Start a fresh attempt to retry."+(key==="mastery"?(percent>=80?" · Mastery demonstrated":" · Target 80%"):"");
 });
 fresh();
}
function lesson(n){let l=D.lessons[n-1],items=D.questions.filter(q=>q.lesson===n);$("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 03 · Lesson ${String(n).padStart(2,"0")}</p><h1>${esc(l.title)}</h1><p class="lead">${esc(D.unit.essential)}</p><div class="nav"><a class="btn" href="../index.html">Unit Home</a><a class="btn" href="../../../index.html">Course Home</a><a class="btn" href="${arch({lesson:l.title})}">Ask Arch</a><button class="btn" onclick="print()">Print</button></div></div></section><section class="block"><div class="wrap grid"><article class="card movement"><p class="eyebrow">1 · Mystery</p><h2>Balance before procedure</h2><p>${esc(l.mystery)}</p><details><summary>Reveal after you reason</summary><p>${esc(l.mystery_answer)}</p></details></article><article class="card"><p class="eyebrow">2 · Discover</p><h2>What must stay equal?</h2><p>Mark each quantity, operation, unit, and constraint. Predict one operation that preserves the relationship and explain why.</p><textarea aria-label="Discovery notes"></textarea></article><article class="card full"><p class="eyebrow">3 · Learn</p><h2>Objectives</h2><ul>${l.objectives.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="grid">${l.concepts.map((x,i)=>`<div class="card"><h3>Balance Principle ${i+1}</h3><p>${esc(x)}</p></div>`).join("")}</div></article><article class="card lab"><p class="eyebrow">4 · Experiment</p><h2>Balance Laboratory</h2><p>Change one coefficient, constant, unit, or contextual constraint. Predict how the solution changes, solve, and verify your prediction in the original model.</p><textarea aria-label="Experiment notes"></textarea></article><article class="card boss"><p class="eyebrow">5 · Challenge</p><h2>Wrong Answer Museum</h2><p>${esc(l.wrong)}</p><details><summary>Repair exhibit</summary><p>${esc(l.wrong_answer)}</p></details></article><article class="card"><p class="eyebrow">6 · Defend</p><h2>Arch's Balance Defense</h2><p>Explain each transformation as an operation on equal quantities. Then state how you verified the solution or model.</p><textarea aria-label="Mathematical defense"></textarea></article><article class="card full"><p class="eyebrow">7 · Reflect & Retrieve</p><h2>Lesson Check</h2>${qhtml(items)}<div class="actions"><button class="btn primary" id="score">Submit & Score</button></div><p id="result" role="status" aria-live="polite" aria-atomic="true"></p></article></div></section>`;bind(items,`lesson-${n}`)}
function unit(){let u=D.unit;$("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Khaemenes Algebra I · Unit 03 · Open-Age</p><h1>${esc(u.title)}</h1><p class="balance">=</p><p class="lead"><strong>${esc(u.formal_title)}</strong><br>${esc(u.essential)}</p><div class="nav"><a class="btn primary" href="lessons/${D.lessons[0].file}">Begin Lesson 01</a><a class="btn" href="../../index.html">Course Home</a><a class="btn" href="boss-battle.html">Synthesis Challenge</a><a class="btn" href="assessment/mastery-check.html">Mastery Check</a><a class="btn" href="${arch()}">Ask Arch</a></div><div class="snapshot"><div class="metric"><strong>7</strong>Lessons</div><div class="metric"><strong>70</strong>Unique Items</div><div class="metric"><strong>3</strong>Pathways</div><div class="metric"><strong>80%</strong>Mastery</div></div></div></section><section class="block"><div class="wrap"><div class="lesson-grid">${D.lessons.map(l=>`<article class="card"><p class="eyebrow">Lesson ${String(l.number).padStart(2,"0")}</p><h3>${esc(l.title)}</h3><p>${esc(l.objectives[0])}</p><a class="btn primary" href="lessons/${l.file}">Open Lesson</a></article>`).join("")}</div><div class="lesson-grid" style="margin-top:14px"><a class="card" href="practice/foundation.html"><h3>Foundation Practice</h3><p>18 balanced questions.</p></a><a class="card" href="practice/core.html"><h3>Core Practice</h3><p>24 balanced questions.</p></a><a class="card" href="practice/extended.html"><h3>Extended Practice</h3><p>28 questions with modelling and reasoning.</p></a><a class="card" href="projects/equation-modeling-lab.html"><h3>Mission Board</h3><p>Equation Modeling Lab.</p></a><a class="card" href="teacher-guide.html"><h3>Teacher Guide</h3></a><a class="card" href="family-guide.html"><h3>Family Guide</h3></a></div></div></section>`}
function balanced(level){let cap={Foundation:1,Core:2,Extended:3}[level],quota={Foundation:[3,3,3,3,2,2,2],Core:[4,4,4,3,3,3,3],Extended:[4,4,4,4,4,4,4]}[level],out=[];for(let l=1;l<=7;l++){let pool=D.questions.filter(q=>q.lesson===l&&q.level<=cap),n=quota[l-1];if(level==="Extended"){let hard=shuffle(pool.filter(q=>q.level===3)).slice(0,1);out.push(...hard,...shuffle(pool.filter(q=>!hard.includes(q))).slice(0,n-hard.length))}else out.push(...shuffle(pool).slice(0,n))}return shuffle(out)}
function practice(level){let items=balanced(level);$("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 03 · ${level}</p><h1>${level} Practice</h1><p class="lead">${items.length} balanced equation and model questions spanning all seven lessons.</p><div class="nav"><a class="btn" href="../index.html">Unit Home</a><a class="btn" href="${arch({pathway:level})}">Ask Arch</a></div></div></section><section class="block"><div class="wrap">${qhtml(items)}<div class="actions"><button class="btn primary" id="score">Submit & Score</button></div><p id="result" role="status" aria-live="polite" aria-atomic="true"></p></div></section>`;bind(items,`practice-${level.toLowerCase()}`)}
const MASTERY=["u03-l01-q05","u03-l01-q09","u03-l01-q10","u03-l02-q05","u03-l02-q07","u03-l02-q09","u03-l03-q05","u03-l03-q06","u03-l03-q09","u03-l04-q02","u03-l04-q05","u03-l04-q09","u03-l05-q05","u03-l05-q06","u03-l05-q09","u03-l06-q05","u03-l06-q07","u03-l06-q09","u03-l07-q05","u03-l07-q06","u03-l07-q07","u03-l07-q08","u03-l07-q09","u03-l07-q10"];
function mastery(){let items=MASTERY.map(id=>D.questions.find(q=>q.id===id));$("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 03 · Formal Mastery Evidence</p><h1>Balance & Modeling Mastery Check</h1><p class="lead">24 fixed-blueprint questions · all seven lessons · equation reasoning + modelling · 80% target.</p><div class="nav"><a class="btn" href="../index.html">Unit Home</a></div></div></section><section class="block"><div class="wrap">${qhtml(items)}<div class="actions"><button class="btn primary" id="score">Submit & Score</button></div><p id="result" role="status" aria-live="polite" aria-atomic="true"></p></div></section>`;bind(items,"mastery")}
function boss(){const ids=["u03-l01-q10","u03-l02-q09","u03-l03-q09","u03-l04-q10","u03-l05-q10","u03-l06-q10","u03-l07-q10"],items=ids.map(id=>D.questions.find(q=>q.id===id)).filter(Boolean);
const draftKey="khaemenes-algebra1-unit03-synthesis-v1";
$("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 03 · Synthesis Challenge</p><h1>Balance & Modelling Review</h1><p class="lead">A rigorous synthesis of equation structure, proportional reasoning, formula rearrangement, contextual modelling, and verification.</p><div class="nav"><a class="btn" href="index.html">Unit Home</a><button class="btn" type="button" onclick="print()">Print Challenge</button></div></div></section><section class="block"><div class="wrap grid"><article class="card full"><p class="eyebrow">Part A · Precision</p><h2>Selected-response reasoning</h2><p>Complete the higher-reasoning items from across the unit. This score is useful evidence, but the written sections below are required for a complete synthesis review.</p>${qhtml(items)}<div class="actions"><button class="btn primary" id="score" type="button">Score Selected Response</button></div><p id="result" role="status" aria-live="polite" aria-atomic="true"></p></article><article class="card"><p class="eyebrow">Part B · Error Analysis</p><h2>Diagnose and repair</h2><p>A student solves 4(2x−3)=5x+9 by writing 8x−3=5x+9, then concludes x=4. Diagnose the first invalid step, solve the equation correctly, and verify the solution in the original equation.</p><textarea data-synthesis-field="error" aria-label="Error analysis response" style="min-height:220px"></textarea></article><article class="card"><p class="eyebrow">Part C · Transfer &amp; Modelling</p><h2>Use the mathematics in a new setting</h2><p>Two transportation plans charge A: $12 + $0.65 per mile and B: $4 + $0.85 per mile. Define variables, write both models, find the break-even distance, interpret the result, and identify which plan is cheaper on each side of the break-even point.</p><textarea data-synthesis-field="transfer" aria-label="Transfer and modelling response" style="min-height:220px"></textarea></article><article class="card full"><p class="eyebrow">Part D · Mathematical Defense</p><h2>Explain, verify, and qualify</h2><p>Rearrange a formula from this unit for a different variable, state any restrictions created by the rearrangement, and verify your new formula by substituting a consistent numerical example.</p><textarea data-synthesis-field="defense" aria-label="Mathematical defense response" style="min-height:220px"></textarea></article><article class="card full"><p class="eyebrow">Evidence Rubric · 20 points</p><h2>Evaluate the reasoning, not just the answer</h2><div class="grid"><div class="card"><strong>Correctness · 0–4</strong><p>Calculations, statements, and conclusions are mathematically sound.</p></div><div class="card"><strong>Reasoning · 0–4</strong><p>Steps are justified with definitions, properties, or mathematical relationships.</p></div><div class="card"><strong>Representation · 0–4</strong><p>Equations, tables, graphs, units, or diagrams are used accurately when appropriate.</p></div><div class="card"><strong>Verification · 0–4</strong><p>The learner checks results independently and addresses restrictions or boundary cases.</p></div><div class="card"><strong>Communication · 0–4</strong><p>The argument is clear, precise, and distinguishes evidence from assumption.</p></div></div><p class="notice"><strong>Recommended synthesis benchmark:</strong> 16/20 with no criterion below 2. This public page does not auto-grade the written reasoning. Parent, teacher, or learner review may be saved locally as unverified evidence. Formal course progression still depends on the canonical lesson, weekly, and Unit Mastery gates.</p><div class="grid"><label class="card">Correctness<select data-synthesis-rubric="correctness"><option value="">Not scored</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label><label class="card">Reasoning<select data-synthesis-rubric="reasoning"><option value="">Not scored</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label><label class="card">Representation<select data-synthesis-rubric="representation"><option value="">Not scored</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label><label class="card">Verification<select data-synthesis-rubric="verification"><option value="">Not scored</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label><label class="card">Communication<select data-synthesis-rubric="communication"><option value="">Not scored</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label></div><div class="actions"><button class="btn primary" id="saveSynthesis" type="button">Save Written Evidence</button><button class="btn" type="button" onclick="print()">Print / Save as PDF</button></div><p id="synthesisStatus" role="status" aria-live="polite"></p></article></div></section>`;
bind(items,"synthesis-challenge");
let draft={responses:{},rubric:{}};try{draft=JSON.parse(localStorage.getItem(draftKey)||"{}")||draft}catch{}draft.responses=draft.responses&&typeof draft.responses==="object"?draft.responses:{};draft.rubric=draft.rubric&&typeof draft.rubric==="object"?draft.rubric:{};
document.querySelectorAll("[data-synthesis-field]").forEach(el=>{el.value=draft.responses[el.dataset.synthesisField]||"";el.addEventListener("input",()=>{draft.responses[el.dataset.synthesisField]=el.value})});
document.querySelectorAll("[data-synthesis-rubric]").forEach(el=>{el.value=draft.rubric[el.dataset.synthesisRubric]??"";el.addEventListener("change",()=>{draft.rubric[el.dataset.synthesisRubric]=el.value===""?"":Number(el.value)})});
$("#saveSynthesis")?.addEventListener("click",()=>{draft.saved_at=new Date().toISOString();draft.assessment_id="KH-MATH-A1-U03-SYNTHESIS";draft.classification="browser-local-unverified-synthesis-evidence";try{localStorage.setItem(draftKey,JSON.stringify(draft));const vals=Object.values(draft.rubric).filter(v=>Number.isFinite(v));const total=vals.length===5?vals.reduce((a,b)=>a+b,0):null;$("#synthesisStatus").textContent=total===null?"Written evidence saved locally. Rubric is not yet complete.":`Written evidence saved locally · Rubric ${total}/20 · ${total>=16?"Recommended synthesis benchmark reached":"Revision recommended"}.`}catch{$("#synthesisStatus").textContent="This browser could not save the synthesis evidence. Print or copy the work before leaving."}});
}
let m=document.body.dataset.mode;if(m==="unit")unit();else if(m==="lesson")lesson(+document.body.dataset.lesson);else if(m==="practice")practice(document.body.dataset.pathway);else if(m==="mastery")mastery();else if(m==="boss")boss()})();
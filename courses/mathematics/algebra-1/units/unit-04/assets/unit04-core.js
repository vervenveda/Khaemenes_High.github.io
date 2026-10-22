(()=>{"use strict";const D=window.KHAE_UNIT04,$=s=>document.querySelector(s),KEY="khaemenes-algebra1-unit04-a3-v1",esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function state(){try{return JSON.parse(localStorage.getItem(KEY)||'{"attempts":[],"best":{}}')}catch{return{attempts:[],best:{}}}}function save(x){try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch{return false}}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function arch(extra={}){let q=new URLSearchParams({course:"Algebra I",unit:"Unit 04 — The World of Constraints",...extra});return "https://artist1970.github.io/Archaemenes.github.io/high/?"+q}
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
 let graded=false;
 const readRecords=(typeof state==="function"?state:st);
 const saveRecords=(typeof save==="function"?save:sv);
 const inputs=()=>[...document.querySelectorAll('#main .question input[type="radio"]')];
 const choiceShuffle=(source)=>{
  const arr=[...source];
  for(let i=arr.length-1;i>0;i--){
   const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];
  }
  // Make the display order different when at least two distinct options exist.
  if(arr.length>1&&arr.every((label,index)=>label===source[index])){
   arr.push(arr.shift());
  }
  return arr;
 };
 retry?.addEventListener("click",()=>{
  if(!graded)return;
  const targetQuestions=[...document.querySelectorAll("#main .question")];
  for(const question of targetQuestions){
   const feedback=question.querySelector(".feedback");
   const labels=[...question.querySelectorAll("label.option")];
   choiceShuffle(labels).forEach(label=>question.insertBefore(label,feedback));
   if(feedback){feedback.hidden=true;feedback.textContent="";feedback.classList.remove("good","bad");}
  }
  inputs().forEach(input=>{input.checked=false;input.disabled=false;});
  graded=false;score.disabled=false;score.textContent="Submit & Score";
  if(retry){retry.hidden=true;retry.disabled=true;}
  const result=document.getElementById("result");
  if(result)result.textContent="Fresh attempt: choices have been reshuffled. Saved earlier scores and mastery remain unchanged.";
  const first=inputs()[0];if(first){first.dispatchEvent(new Event("change",{bubbles:true}));first.focus();}
 });
 score.addEventListener("click",()=>{
  if(graded)return;
  let correct=0,complete=true;
  items.forEach((q,i)=>{
   const answer=document.querySelector('input[name="q'+i+'"]:checked');
   const feedback=document.getElementById("f"+i);
   if(!answer){
    complete=false;
    if(feedback){feedback.hidden=false;feedback.className="feedback bad";feedback.textContent="Choose an answer.";}
    return;
   }
   const ok=Number(answer.value)===q.answer;
   if(ok)correct++;
   if(feedback){feedback.hidden=false;feedback.className="feedback "+(ok?"good":"bad");feedback.textContent=(ok?"Correct. ":"Review. ")+q.explanation;}
  });
  if(!complete){const result=document.getElementById("result");if(result)result.textContent="Answer every item before scoring. Nothing was recorded.";return;}
  const percent=Math.round(100*correct/items.length);
  const record=readRecords();
  record.attempts.push({key,score:percent,correct,total:items.length,at:new Date().toISOString(),items:items.map(q=>q.id)});
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
  if(result)result.innerHTML="<strong>"+percent+"%</strong> · "+correct+"/"+items.length+" · Best "+record.best[key]+"% · Answers locked. Start a fresh attempt to retry."+(key==="mastery"?(percent>=80?" · Mastery demonstrated":" · Target 80%"):"");
 });
}
function lesson(n){let l=D.lessons[n-1],items=D.questions.filter(q=>q.lesson===n);$("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 04 · Lesson ${String(n).padStart(2,"0")}</p><h1>${esc(l.title)}</h1><p class="lead">${esc(D.unit.essential)}</p><div class="nav"><a class="btn" href="../index.html">Unit Home</a><a class="btn" href="../../../index.html">Course Home</a><a class="btn" href="${arch({lesson:l.title})}">Ask Arch</a><button class="btn" onclick="print()">Print</button></div></div></section><section class="block"><div class="wrap grid"><article class="card movement"><p class="eyebrow">1 · Mystery</p><h2>Find the boundary</h2><p>${esc(l.mystery)}</p><details><summary>Reveal after you reason</summary><p>${esc(l.mystery_answer)}</p></details></article><article class="card"><p class="eyebrow">2 · Discover</p><h2>Which values are allowed?</h2><p>Identify the boundary, decide whether it is included, and describe which side or region remains feasible.</p><textarea aria-label="Discovery notes"></textarea></article><article class="card full"><p class="eyebrow">3 · Learn</p><h2>Objectives</h2><ul>${l.objectives.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="grid">${l.concepts.map((x,i)=>`<div class="card"><h3>Constraint Lens ${i+1}</h3><p>${esc(x)}</p></div>`).join("")}</div></article><article class="card lab"><p class="eyebrow">4 · Experiment</p><h2>Constraint Laboratory</h2><p>Change one boundary, endpoint rule, multiplier, or tolerance. Predict how the feasible set changes, then verify on a number line or with test values.</p><textarea aria-label="Experiment notes"></textarea></article><article class="card boss"><p class="eyebrow">5 · Challenge</p><h2>Wrong Answer Museum</h2><p>${esc(l.wrong)}</p><details><summary>Repair exhibit</summary><p>${esc(l.wrong_answer)}</p></details></article><article class="card"><p class="eyebrow">6 · Defend</p><h2>Arch's Constraint Defense</h2><p>Explain the boundary, inclusion rule, direction, and any sign reversal. If context is involved, state what the feasible region means.</p><textarea aria-label="Mathematical defense"></textarea></article><article class="card full"><p class="eyebrow">7 · Reflect & Retrieve</p><h2>Lesson Check</h2>${qhtml(items)}<div class="actions"><button class="btn primary" id="score">Submit & Score</button></div><p id="result" role="status" aria-live="polite" aria-atomic="true"></p></article></div></section>`;bind(items,`lesson-${n}`)}
function unit(){let u=D.unit;$("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Khaemenes Algebra I · Unit 04 · Open-Age</p><h1>${esc(u.title)}</h1><p class="constraint">≤ · ≥ · |x|</p><p class="lead"><strong>${esc(u.formal_title)}</strong><br>${esc(u.essential)}</p><div class="nav"><a class="btn primary" href="lessons/${D.lessons[0].file}">Begin Lesson 01</a><a class="btn" href="../../index.html">Course Home</a><a class="btn" href="boss-battle.html">Synthesis Challenge</a><a class="btn" href="assessment/mastery-check.html">Mastery Check</a><a class="btn" href="${arch()}">Ask Arch</a></div><div class="snapshot"><div class="metric"><strong>6</strong>Lessons</div><div class="metric"><strong>60</strong>Unique Items</div><div class="metric"><strong>3</strong>Pathways</div><div class="metric"><strong>80%</strong>Mastery</div></div></div></section><section class="block"><div class="wrap"><div class="lesson-grid">${D.lessons.map(l=>`<article class="card"><p class="eyebrow">Lesson ${String(l.number).padStart(2,"0")}</p><h3>${esc(l.title)}</h3><p>${esc(l.objectives[0])}</p><a class="btn primary" href="lessons/${l.file}">Open Lesson</a></article>`).join("")}</div><div class="lesson-grid" style="margin-top:14px"><a class="card" href="practice/foundation.html"><h3>Foundation Practice</h3><p>15 balanced boundary and representation questions.</p></a><a class="card" href="practice/core.html"><h3>Core Practice</h3><p>20 mixed solving and interpretation questions.</p></a><a class="card" href="practice/extended.html"><h3>Extended Practice</h3><p>25 questions with reasoning and contextual constraints.</p></a><a class="card" href="projects/constraint-design-lab.html"><h3>Mission Board</h3><p>Constraint Design Lab.</p></a><a class="card" href="teacher-guide.html"><h3>Teacher Guide</h3></a><a class="card" href="family-guide.html"><h3>Family Guide</h3></a></div></div></section>`}
function balanced(level){let cap={Foundation:1,Core:2,Extended:3}[level],quota={Foundation:[3,3,3,2,2,2],Core:[4,4,3,3,3,3],Extended:[5,4,4,4,4,4]}[level],out=[];for(let l=1;l<=6;l++){let pool=D.questions.filter(q=>q.lesson===l&&q.level<=cap),n=quota[l-1];if(level==="Extended"){let hard=shuffle(pool.filter(q=>q.level===3)).slice(0,1);out.push(...hard,...shuffle(pool.filter(q=>!hard.includes(q))).slice(0,n-hard.length))}else out.push(...shuffle(pool).slice(0,n))}return shuffle(out)}
function practice(level){let items=balanced(level);$("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 04 · ${level}</p><h1>${level} Practice</h1><p class="lead">${items.length} balanced questions spanning all six lessons.</p><div class="nav"><a class="btn" href="../index.html">Unit Home</a><a class="btn" href="${arch({pathway:level})}">Ask Arch</a></div></div></section><section class="block"><div class="wrap">${qhtml(items)}<div class="actions"><button class="btn primary" id="score">Submit & Score</button></div><p id="result" role="status" aria-live="polite" aria-atomic="true"></p></div></section>`;bind(items,`practice-${level.toLowerCase()}`)}
const MASTERY=["u04-l01-q05","u04-l01-q08","u04-l01-q09","u04-l02-q05","u04-l02-q07","u04-l02-q10","u04-l03-q05","u04-l03-q08","u04-l03-q09","u04-l04-q05","u04-l04-q06","u04-l04-q10","u04-l05-q04","u04-l05-q07","u04-l05-q09","u04-l06-q05","u04-l06-q06","u04-l06-q08","u04-l06-q09","u04-l06-q10"];
function mastery(){let items=MASTERY.map(id=>D.questions.find(q=>q.id===id));$("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 04 · Formal Mastery Evidence</p><h1>Constraints & Absolute Value Mastery Check</h1><p class="lead">20 fixed-blueprint questions · all six lessons · 80% target.</p><div class="nav"><a class="btn" href="../index.html">Unit Home</a></div></div></section><section class="block"><div class="wrap">${qhtml(items)}<div class="actions"><button class="btn primary" id="score">Submit & Score</button></div><p id="result" role="status" aria-live="polite" aria-atomic="true"></p></div></section>`;bind(items,"mastery")}
function boss(){const ids=["u04-l01-q09","u04-l02-q10","u04-l03-q10","u04-l04-q10","u04-l05-q10","u04-l06-q10"],items=ids.map(id=>D.questions.find(q=>q.id===id)).filter(Boolean);
const draftKey="khaemenes-algebra1-unit04-synthesis-v1";
$("#main").innerHTML=`<section class="hero"><div class="wrap"><p class="eyebrow">Unit 04 · Synthesis Challenge</p><h1>Constraint Reasoning Review</h1><p class="lead">A rigorous synthesis of inequalities, compound conditions, absolute value, tolerances, and feasible regions.</p><div class="nav"><a class="btn" href="index.html">Unit Home</a><button class="btn" type="button" onclick="print()">Print Challenge</button></div></div></section><section class="block"><div class="wrap grid"><article class="card full"><p class="eyebrow">Part A · Precision</p><h2>Selected-response reasoning</h2><p>Complete the higher-reasoning items from across the unit. This score is useful evidence, but the written sections below are required for a complete synthesis review.</p>${qhtml(items)}<div class="actions"><button class="btn primary" id="score" type="button">Score Selected Response</button></div><p id="result" role="status" aria-live="polite" aria-atomic="true"></p></article><article class="card"><p class="eyebrow">Part B · Error Analysis</p><h2>Diagnose and repair</h2><p>A student solves −3x+7≤19 and writes x≤−4 because the inequality sign was not reversed after division by a negative number. Repair the solution, represent it on a number line, and explain exactly when and why an inequality reverses.</p><textarea data-synthesis-field="error" aria-label="Error analysis response" style="min-height:220px"></textarea></article><article class="card"><p class="eyebrow">Part C · Transfer &amp; Modelling</p><h2>Use the mathematics in a new setting</h2><p>A manufactured part should measure 50.0 mm with tolerance ±0.6 mm, and a shipment is accepted only when at least 95% of sampled parts lie within tolerance. Write the absolute-value and compound-inequality forms of the tolerance, test measurements 49.2, 49.5, 50.1, 50.6, and 50.8 mm, and explain what additional sample evidence would be needed for the 95% claim.</p><textarea data-synthesis-field="transfer" aria-label="Transfer and modelling response" style="min-height:220px"></textarea></article><article class="card full"><p class="eyebrow">Part D · Mathematical Defense</p><h2>Explain, verify, and qualify</h2><p>Create one contextual inequality with at least two constraints. Solve it, graph the feasible set, and explain how the boundary symbols and shading encode the original conditions.</p><textarea data-synthesis-field="defense" aria-label="Mathematical defense response" style="min-height:220px"></textarea></article><article class="card full"><p class="eyebrow">Evidence Rubric · 20 points</p><h2>Evaluate the reasoning, not just the answer</h2><div class="grid"><div class="card"><strong>Correctness · 0–4</strong><p>Calculations, statements, and conclusions are mathematically sound.</p></div><div class="card"><strong>Reasoning · 0–4</strong><p>Steps are justified with definitions, properties, or mathematical relationships.</p></div><div class="card"><strong>Representation · 0–4</strong><p>Equations, tables, graphs, units, or diagrams are used accurately when appropriate.</p></div><div class="card"><strong>Verification · 0–4</strong><p>The learner checks results independently and addresses restrictions or boundary cases.</p></div><div class="card"><strong>Communication · 0–4</strong><p>The argument is clear, precise, and distinguishes evidence from assumption.</p></div></div><p class="notice"><strong>Recommended synthesis benchmark:</strong> 16/20 with no criterion below 2. This public page does not auto-grade the written reasoning. Parent, teacher, or learner review may be saved locally as unverified evidence. Formal course progression still depends on the canonical lesson, weekly, and Unit Mastery gates.</p><div class="grid"><label class="card">Correctness<select data-synthesis-rubric="correctness"><option value="">Not scored</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label><label class="card">Reasoning<select data-synthesis-rubric="reasoning"><option value="">Not scored</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label><label class="card">Representation<select data-synthesis-rubric="representation"><option value="">Not scored</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label><label class="card">Verification<select data-synthesis-rubric="verification"><option value="">Not scored</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label><label class="card">Communication<select data-synthesis-rubric="communication"><option value="">Not scored</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label></div><div class="actions"><button class="btn primary" id="saveSynthesis" type="button">Save Written Evidence</button><button class="btn" type="button" onclick="print()">Print / Save as PDF</button></div><p id="synthesisStatus" role="status" aria-live="polite"></p></article></div></section>`;
bind(items,"synthesis-challenge");
let draft={responses:{},rubric:{}};try{draft=JSON.parse(localStorage.getItem(draftKey)||"{}")||draft}catch{}draft.responses=draft.responses&&typeof draft.responses==="object"?draft.responses:{};draft.rubric=draft.rubric&&typeof draft.rubric==="object"?draft.rubric:{};
document.querySelectorAll("[data-synthesis-field]").forEach(el=>{el.value=draft.responses[el.dataset.synthesisField]||"";el.addEventListener("input",()=>{draft.responses[el.dataset.synthesisField]=el.value})});
document.querySelectorAll("[data-synthesis-rubric]").forEach(el=>{el.value=draft.rubric[el.dataset.synthesisRubric]??"";el.addEventListener("change",()=>{draft.rubric[el.dataset.synthesisRubric]=el.value===""?"":Number(el.value)})});
$("#saveSynthesis")?.addEventListener("click",()=>{draft.saved_at=new Date().toISOString();draft.assessment_id="KH-MATH-A1-U04-SYNTHESIS";draft.classification="browser-local-unverified-synthesis-evidence";try{localStorage.setItem(draftKey,JSON.stringify(draft));const vals=Object.values(draft.rubric).filter(v=>Number.isFinite(v));const total=vals.length===5?vals.reduce((a,b)=>a+b,0):null;$("#synthesisStatus").textContent=total===null?"Written evidence saved locally. Rubric is not yet complete.":`Written evidence saved locally · Rubric ${total}/20 · ${total>=16?"Recommended synthesis benchmark reached":"Revision recommended"}.`}catch{$("#synthesisStatus").textContent="This browser could not save the synthesis evidence. Print or copy the work before leaving."}});
}
let m=document.body.dataset.mode;if(m==="unit")unit();else if(m==="lesson")lesson(+document.body.dataset.lesson);else if(m==="practice")practice(document.body.dataset.pathway);else if(m==="mastery")mastery();else if(m==="boss")boss()})();
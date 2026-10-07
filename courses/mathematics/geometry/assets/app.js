(() => {
"use strict";
const D=window.GEOMETRY_DATA;
const Q=window.GEOMETRY_QUESTIONS;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KEY=D.course.storage_key;
const PIN_KEY="khaemenes-high-pinned-courses-v2";
const COURSE_ID="geometry";
const VALID_VIEWS=["dashboard","week","scope","units","practice","assessments","gradebook","portfolio","teacher"];

function defaultStudent(id="learner-1",name="Learner 1"){
 return {id,name,pathway:"Core",weeks:{},formal:{diagnostic:null,midterm:null,final:null,capstone:null},notes:""};
}
function initialState(){
 return {version:1,activeId:"learner-1",selectedWeek:1,students:[defaultStudent()]};
}
function normalizeState(raw){
 if(!raw||!Array.isArray(raw.students)||!raw.students.length)return initialState();
 raw.version=1;
 raw.selectedWeek=Math.min(36,Math.max(1,Number(raw.selectedWeek)||1));
 raw.students=raw.students.map((s,i)=>({
   id:String(s.id||`learner-${i+1}`),name:String(s.name||`Learner ${i+1}`),
   pathway:D.course.pathways.includes(s.pathway)?s.pathway:"Core",
   weeks:s.weeks&&typeof s.weeks==="object"?s.weeks:{},
   formal:{diagnostic:scoreValue(s.formal?.diagnostic),midterm:scoreValue(s.formal?.midterm),final:scoreValue(s.formal?.final),capstone:scoreValue(s.formal?.capstone)},
   notes:String(s.notes||"")
 }));
 if(!raw.students.some(s=>s.id===raw.activeId))raw.activeId=raw.students[0].id;
 return raw;
}
function load(){
 try{return normalizeState(JSON.parse(localStorage.getItem(KEY)||"null"))}
 catch{return initialState()}
}
let state=load();
let activeSet=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{alert("This browser could not save local course records.")}}
function activeStudent(){return state.students.find(s=>s.id===state.activeId)||state.students[0]}
function scoreValue(v){if(v==null||v==="")return null;const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(100,n)):null}
function weekRecord(n){
 const s=activeStudent();
 const old=s.weeks[n]||{};
 return s.weeks[n]={
   days:old.days&&typeof old.days==="object"?old.days:{},
   classwork:scoreValue(old.classwork),masteryBest:scoreValue(old.masteryBest),
   portfolio:scoreValue(old.portfolio),attempts:Number(old.attempts)||0,
   reflection:String(old.reflection||""),evidence:String(old.evidence||"")
 };
}
function avg(vals){
 const clean=vals.map(scoreValue).filter(v=>v!=null);
 return clean.length?clean.reduce((a,b)=>a+b,0)/clean.length:null;
}
function pct(v){return v==null?"—":`${Math.round(v)}%`}
function courseGrade(){
 const s=activeStudent();
 const cw=avg(D.weeks.map(w=>weekRecord(w.week).classwork));
 const ms=avg(D.weeks.map(w=>weekRecord(w.week).masteryBest));
 const mid=scoreValue(s.formal.midterm),fin=scoreValue(s.formal.final),cap=scoreValue(s.formal.capstone);
 if([cw,ms,mid,fin,cap].some(v=>v==null))return null;
 return cw*.35+ms*.20+mid*.15+fin*.20+cap*.10;
}
function completeWeeks(){
 return D.weeks.filter(w=>Object.values(weekRecord(w.week).days).filter(Boolean).length===5).length;
}
function setTheme(t){
 document.documentElement.dataset.theme=t;
 try{localStorage.setItem("khaemenes-theme",t)}catch{}
}
const savedTheme=localStorage.getItem("khaemenes-theme");
setTheme(savedTheme||(matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"));
$("#themeToggle")?.addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));

function readPins(){
 try{const x=JSON.parse(localStorage.getItem(PIN_KEY)||"[]");return Array.isArray(x)?x:[]}
 catch{return []}
}
function renderPin(){
 const b=$("#pinCourseButton");if(!b)return;
 const on=readPins().includes(COURSE_ID);
 b.setAttribute("aria-pressed",String(on));
 b.textContent=on?"★ Pinned to Profile":"☆ Pin to Profile";
}
$("#pinCourseButton")?.addEventListener("click",()=>{
 const pins=readPins(),on=pins.includes(COURSE_ID);
 const next=on?pins.filter(x=>x!==COURSE_ID):[COURSE_ID,...pins.filter(x=>x!==COURSE_ID)];
 try{localStorage.setItem(PIN_KEY,JSON.stringify(next))}catch{return alert("This browser could not save the profile pin.")}
 renderPin();
 const status=$("#pinCourseStatus");
 if(status)status.textContent=on?"Geometry was removed from the future profile list.":"Geometry was pinned for the future High School profile refresh.";
});
renderPin();
window.addEventListener("storage",e=>{if(e.key===PIN_KEY)renderPin()});

function closeMenu(){const m=$("#courseMenu");if(m)m.open=false}
document.addEventListener("click",e=>{const m=$("#courseMenu");if(m?.open&&!m.contains(e.target))m.open=false});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});

function setView(view,push=true){
 if(!VALID_VIEWS.includes(view))view="dashboard";
 $$(".view").forEach(v=>{
   const active=v.id===`view-${view}`;
   v.classList.toggle("active",active);
   if(!active)v.innerHTML="";
 });
 $$("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
 render(view);
 if(push)history.replaceState(null,"",`#${view}`);
 closeMenu();
 const nav=$(".quick-nav");
 if(nav&&push)scrollTo({top:Math.max(0,nav.offsetTop-84),behavior:"smooth"});
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-view]");
 if(b){e.preventDefault();setView(b.dataset.view)}
});
window.addEventListener("hashchange",()=>setView(location.hash.slice(1)||"dashboard",false));

function studentControls(){
 const s=activeStudent();
 return `<div class="form-grid">
 <label>Active learner<select id="studentSelect">${state.students.map(x=>`<option value="${esc(x.id)}" ${x.id===s.id?"selected":""}>${esc(x.name)}</option>`).join("")}</select></label>
 <label>Learning pathway<select id="pathwaySelect">${D.course.pathways.map(x=>`<option ${x===s.pathway?"selected":""}>${x}</option>`).join("")}</select></label>
 </div>
 <div class="actions">
  <button class="btn" id="addLearner" type="button">Add Learner</button>
  <button class="btn" id="renameLearner" type="button">Rename</button>
  <button class="btn danger" id="deleteLearner" type="button">Delete</button>
 </div>`;
}
function bindStudentControls(){
 $("#studentSelect")?.addEventListener("change",e=>{state.activeId=e.target.value;save();renderCurrent()});
 $("#pathwaySelect")?.addEventListener("change",e=>{activeStudent().pathway=e.target.value;save();renderCurrent()});
 $("#addLearner")?.addEventListener("click",()=>{
   const name=prompt("Learner display name:");
   if(!name?.trim())return;
   const id=`learner-${Date.now()}`;
   state.students.push(defaultStudent(id,name.trim()));state.activeId=id;save();renderCurrent();
 });
 $("#renameLearner")?.addEventListener("click",()=>{
   const name=prompt("New learner display name:",activeStudent().name);
   if(name?.trim()){activeStudent().name=name.trim();save();renderCurrent()}
 });
 $("#deleteLearner")?.addEventListener("click",()=>{
   if(state.students.length===1)return alert("At least one local learner record is required.");
   if(confirm("Delete this learner's local Geometry record?")){
     state.students=state.students.filter(x=>x.id!==state.activeId);
     state.activeId=state.students[0].id;save();renderCurrent();
   }
 });
}
function nextWeek(){
 return D.weeks.find(w=>Object.values(weekRecord(w.week).days).filter(Boolean).length<5)||D.weeks.at(-1);
}
function renderDashboard(){
 const s=activeStudent(),done=completeWeeks(),next=nextWeek(),grade=courseGrade();
 $("#view-dashboard").innerHTML=`<div class="wrap">
 <div class="section-head"><p class="eyebrow">Local learner dashboard</p><h2>${esc(s.name)} · Geometry</h2>
 <p>Progress, mastery, assessment evidence, portfolio notes, and exports remain on this device unless deliberately downloaded or printed.</p></div>
 <div class="grid">
  <article class="card col4"><h3>Learner Record</h3>${studentControls()}<p class="notice">Prerequisite: Algebra I or equivalent demonstrated readiness. Placement is based on mastery, not age or grade.</p></article>
  <article class="card col8"><span class="pill good">Next recommended week</span><h3>Week ${next.week} · ${esc(next.title)}</h3><p>${esc(next.essential)}</p>
   <div class="progress"><span style="width:${done/36*100}%"></span></div><p>${done}/36 weeks fully checked · ${Math.round(done/36*100)}%</p>
   <div class="actions"><button class="btn primary" id="openNext" type="button">Open Week ${next.week}</button><a class="btn" href="${esc(next.unit_path)}">Open Detailed Route</a></div>
  </article>
  <article class="card col3"><h4>Coursework Average</h4><p class="score">${pct(avg(D.weeks.map(w=>weekRecord(w.week).classwork)))}</p></article>
  <article class="card col3"><h4>Mastery Average</h4><p class="score">${pct(avg(D.weeks.map(w=>weekRecord(w.week).masteryBest)))}</p></article>
  <article class="card col3"><h4>Final Examination</h4><p class="score">${pct(s.formal.final)}</p></article>
  <article class="card col3"><h4>Strict Completion Gates</h4><p class="score">Evidence-gated</p><p>Completion requires canonical lesson, weekly, unit, reviewed-exam, investigation, and capstone evidence.</p></article>
  <article class="card col4"><h3>90 Visual Printable Lessons</h3><p>Topic-specific explanations, large vector diagrams, worked examples, six-problem printable worksheets, differentiated pathways, misconceptions, applications, reflection, and local completion.</p><button class="btn" data-view="units">Browse Units</button></article>
  <article class="card col4"><h3>Scientific Calculator v4</h3><p>Use the connected calculator for exploration, logarithms, trigonometry, complex-number support, history, and verification. Written reasoning and domain checks remain required.</p><a class="btn primary" href="../tools/calculator" target="_blank" rel="noopener">Open Calculator</a></article>
  <article class="card col4"><h3>Formal Evidence</h3><p>40-question readiness diagnostic, 13 mastery checks, 60-question midterm, 100-question final, portfolio, and modelling defense.</p><button class="btn" data-view="assessments">Assessment Center</button></article>
 </div></div>`;
 bindStudentControls();
 $("#openNext")?.addEventListener("click",()=>{state.selectedWeek=next.week;save();setView("week")});
}
function dailyPlan(w){
 const focus=w.focus||w.title;
 return [
 {day:"Session 1",title:"Readiness & concept language",task:`Activate prerequisites and define the central language for ${focus}.`,work:["Complete a short retrieval warm-up.","Annotate definitions and domain conditions.","Create one example and one non-example."]},
 {day:"Session 2",title:"Concept development & worked examples",task:"Study the detailed lesson route and reconstruct at least two examples without copying steps.",work:["Name the governing property or formula.","Show transformations one line at a time.","Check exact and approximate forms."]},
 {day:"Session 3",title:"Guided practice & representation",task:"Connect symbolic, graphical, numerical, and contextual representations.",work:["Complete pathway practice.","Use technology only after setting up the mathematics.","Record units, assumptions, and restrictions."]},
 {day:"Session 4",title:"Application, error analysis & modelling",task:"Apply the week’s ideas to a defensible context and analyze a common misconception.",work:["Identify the first invalid step in an error.","Correct it with a rule or counterexample.","State one model limitation."]},
 {day:"Session 5",title:"Mastery, portfolio & reflection",task:"Complete a fresh mastery set, correct missed work, and select representative evidence.",work:["Reach 80% or document reteaching.","Save one portfolio artifact.","Write the next-step reflection."]}
 ];
}
function weekPicker(){
 return `<div class="week-picker">${D.weeks.map(w=>{
   const r=weekRecord(w.week),done=Object.values(r.days).filter(Boolean).length===5;
   return `<button class="week-chip ${state.selectedWeek===w.week?"active":""} ${done?"done":""}" data-week="${w.week}" type="button"><strong>${w.week}</strong>${w.unit?`U${String(w.unit).padStart(2,"0")}`:"M"}</button>`;
 }).join("")}</div>`;
}
function renderWeek(){
 const w=D.weeks[state.selectedWeek-1],r=weekRecord(w.week),days=dailyPlan(w),completed=Object.values(r.days).filter(Boolean).length;
 const routes=(w.lesson_ids||[]).map(id=>{
   const unit=D.units.find(u=>u.number===w.unit),lesson=unit?.lessons.find(l=>l.id===id);
   return lesson?`<a class="btn" href="units/unit-${String(w.unit).padStart(2,"0")}/lessons/${id}.html">${esc(lesson.title)}</a>`:"";
 }).join("");
 $("#view-week").innerHTML=`<div class="wrap">
 <div class="section-head"><p class="eyebrow">180-session classroom</p><h2>Weekly Classwork</h2><p>Five meaningful sessions per week combine instruction, guided work, modelling, error analysis, mastery, corrections, and portfolio evidence.</p></div>
 <article class="card no-print">${weekPicker()}</article>
 <article class="card" style="margin-top:16px"><span class="pill">Week ${w.week}</span><span class="pill">${w.unit?`Unit ${String(w.unit).padStart(2,"0")}`:"Course Milestone"}</span><span class="pill">${esc(activeStudent().pathway)} pathway</span><span class="pill good">${completed}/5 sessions</span>
 <h2>${esc(w.title)}</h2><p><strong>Essential question:</strong> ${esc(w.essential)}</p>${w.focus?`<p class="notice"><strong>Detailed focus:</strong> ${esc(w.focus)}</p>`:""}
 <div class="actions"><a class="btn primary" href="${esc(w.unit_path)}">Open Detailed Route</a>${routes}<button class="btn" id="printWeek" type="button">Print Week</button></div></article>
 <div class="daily-grid">${days.map(x=>`<article class="day-card"><span class="day">${x.day}</span><h4>${esc(x.title)}</h4><p>${esc(x.task)}</p><ul>${x.work.map(y=>`<li>${esc(y)}</li>`).join("")}</ul><label><input type="checkbox" data-day="${x.day}" ${r.days[x.day]?"checked":""}> Session complete</label></article>`).join("")}</div>
 <div class="grid" style="margin-top:16px">
  <article class="card col4"><h3>Weekly Scores</h3><label>Classwork score<input id="cw" type="number" min="0" max="100" value="${r.classwork??""}"></label><label>Portfolio score<input id="pf" type="number" min="0" max="100" value="${r.portfolio??""}"></label><p>Best generated mastery: ${pct(r.masteryBest)} · ${r.attempts} attempt(s)</p><button class="btn" id="saveWeek" type="button">Save Scores</button></article>
  <article class="card col4"><h3>Reflection</h3><textarea id="reflection" placeholder="What became clearer? What still requires work?">${esc(r.reflection)}</textarea><button class="btn" id="saveReflection" type="button">Save Reflection</button></article>
  <article class="card col4"><h3>Evidence Note</h3><textarea id="evidence" placeholder="Describe the work sample, model, correction, or explanation selected for the portfolio.">${esc(r.evidence)}</textarea><button class="btn" id="saveEvidence" type="button">Save Evidence</button></article>
 </div>
 <article class="card" style="margin-top:16px"><h3>Week ${w.week} Mastery Set</h3><div class="actions no-print"><select id="count" style="width:auto"><option>8</option><option>10</option><option>12</option></select><button class="btn primary" id="generate" type="button">Generate Set</button></div><div id="weekPractice"></div></article>
 </div>`;
 $$("[data-week]").forEach(b=>b.addEventListener("click",()=>{state.selectedWeek=Number(b.dataset.week);save();renderWeek()}));
 $$("[data-day]").forEach(c=>c.addEventListener("change",()=>{r.days[c.dataset.day]=c.checked;save();renderWeek()}));
 $("#saveWeek")?.addEventListener("click",()=>{r.classwork=scoreValue($("#cw").value);r.portfolio=scoreValue($("#pf").value);save();renderWeek()});
 $("#saveReflection")?.addEventListener("click",()=>{r.reflection=$("#reflection").value.trim();save();alert("Reflection saved locally.")});
 $("#saveEvidence")?.addEventListener("click",()=>{r.evidence=$("#evidence").value.trim();save();alert("Evidence note saved locally.")});
 $("#printWeek")?.addEventListener("click",()=>print());
 $("#generate")?.addEventListener("click",()=>{
   const units=w.unit?[w.unit]:[1,2,3,4,5,6,7,8,9,10,11,12,13];
   activeSet=makeSet(units,Number($("#count").value));
   renderSet($("#weekPractice"),activeSet,w.week,"week");
 });
}
function renderScope(){
 $("#view-scope").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Complete calendar</p><h2>36-Week Scope &amp; Sequence</h2><p>Week 1 establishes readiness, Week 18 provides midpoint synthesis and formal evidence, and Week 36 completes the modelling defense and comprehensive final.</p></div>
 <article class="card"><div class="table-wrap"><table><thead><tr><th>Week</th><th>Unit</th><th>Focus</th><th>Essential question</th><th>Route</th></tr></thead><tbody>${D.weeks.map(w=>`<tr><td>${w.week}</td><td>${w.unit?String(w.unit).padStart(2,"0"):"Milestone"}</td><td>${esc(w.title)}</td><td>${esc(w.essential)}</td><td><a href="${esc(w.unit_path)}">Open</a></td></tr>`).join("")}</tbody></table></div><div class="actions"><button class="btn" id="scopeCsv" type="button">Download CSV</button><button class="btn" id="printScope" type="button">Print</button></div></article></div>`;
 $("#scopeCsv")?.addEventListener("click",downloadScope);$("#printScope")?.addEventListener("click",()=>print());
}
function renderUnits(){
 const colors=["#426f91","#a67b35","#4f7657","#6e6387","#9a5b65","#3f7f82"];
 $("#view-units").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Deep instructional layer</p><h2>Diagnostic &amp; 13 Advanced Units</h2><p>Every unit contains complete lessons, Foundation/Core/Extended practice, a mastery check, applied investigation, family guide, teacher guide, vocabulary, and standards map.</p></div>
 <div class="unit-grid"><article class="card unit-card" style="--accent:#111"><span class="unit-number">D</span><h3>Algebra I Readiness Diagnostic</h3><p>Forty prerequisite questions with explanations and targeted review categories.</p><div class="actions"><a class="btn primary" href="diagnostic/">Open Diagnostic</a></div></article>
 ${D.units.map((u,i)=>`<article class="card unit-card" style="--accent:${colors[i%colors.length]}"><span class="unit-number">${String(u.number).padStart(2,"0")}</span><h3>${esc(u.title)}</h3><p>${esc(u.essential)}</p><p><span class="pill">${u.weeks} week${u.weeks===1?"":"s"}</span><span class="pill">${u.lessons.length} lessons</span><span class="pill">3 pathways</span></p><div class="actions"><a class="btn primary" href="units/unit-${String(u.number).padStart(2,"0")}/">Open Unit</a></div></article>`).join("")}</div></div>`;
}
function shuffled(arr){return [...arr].sort(()=>Math.random()-.5)}
function makeSet(units,count){
 const pool=Q.filter(q=>units.includes(q.unit));
 return shuffled(pool).slice(0,Math.min(count,pool.length));
}
function renderSet(host,set,weekNo,prefix){
 if(!host)return;
 const token=`${prefix}-${Date.now()}-${Math.floor(Math.random()*9999)}`;
 host.innerHTML=set.map((q,i)=>`<article class="question"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend><div class="options">${q.options.map((o,j)=>`<label class="option"><input type="radio" name="${token}-q${i}" value="${j}"><span>${esc(o)}</span></label>`).join("")}</div><div class="feedback" id="${token}-fb${i}" hidden></div></fieldset></article>`).join("")+`<div class="actions no-print"><button class="btn primary" id="${token}-score" type="button">Submit &amp; Score</button></div><p id="${token}-msg"></p>`;
 $(`#${token}-score`)?.addEventListener("click",()=>{
   let right=0,complete=true;
   set.forEach((q,i)=>{
     const selected=$(`input[name="${token}-q${i}"]:checked`),fb=$(`#${token}-fb${i}`);
     fb.hidden=false;
     if(!selected){complete=false;fb.className="feedback bad";fb.textContent="Choose an answer.";return}
     const ok=Number(selected.value)===q.answer;if(ok)right++;
     fb.className=`feedback ${ok?"good":"bad"}`;
     fb.textContent=`${ok?"Correct.":"Review."} ${q.explanation}`;
   });
   if(!complete){$(`#${token}-msg`).textContent="Answer every item before scoring.";return}
   const score=Math.round(right/set.length*100);
   $(`#${token}-msg`).innerHTML=`<span class="score">${score}%</span> · ${right}/${set.length}`;
   if(weekNo){const r=weekRecord(weekNo);r.attempts++;r.masteryBest=Math.max(r.masteryBest||0,score);save()}
 });
}
function renderPractice(){
 $("#view-practice").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Fresh definitive-answer practice</p><h2>Adaptive Practice Lab</h2><p>Select a unit or the whole course. Every scored item provides a correction explanation.</p></div>
 <div class="practice-layout"><article class="card"><div id="practiceHost"><p class="notice">Choose settings and generate a fresh set.</p></div></article>
 <aside class="card practice-side"><label>Content<select id="practiceUnit"><option value="all">Whole Course</option>${D.units.map(u=>`<option value="${u.number}">Unit ${String(u.number).padStart(2,"0")} · ${esc(u.title)}</option>`).join("")}</select></label><label>Count<select id="practiceCount"><option>10</option><option>20</option><option>30</option></select></label><div class="actions"><button class="btn primary" id="makePractice" type="button">Generate</button><button class="btn" id="audit" type="button">Run Bank Audit</button></div><pre id="auditLog" style="white-space:pre-wrap;color:var(--muted)">Audit not yet run.</pre></aside></div></div>`;
 $("#makePractice")?.addEventListener("click",()=>{
   const v=$("#practiceUnit").value,units=v==="all"?D.units.map(u=>u.number):[Number(v)];
   activeSet=makeSet(units,Number($("#practiceCount").value));
   renderSet($("#practiceHost"),activeSet,null,"lab");
 });
 $("#audit")?.addEventListener("click",runAudit);
}
function runAudit(){
 const errors=[];
 Q.forEach(q=>{
   if(!q.prompt||!q.explanation)errors.push(`${q.id}: missing text`);
   if(!Array.isArray(q.options)||q.options.length!==4)errors.push(`${q.id}: option count`);
   if(new Set(q.options.map(x=>x.trim().toLowerCase())).size!==4)errors.push(`${q.id}: duplicate choices`);
   if(q.options[q.answer]!==q.answer_text)errors.push(`${q.id}: key mismatch`);
 });
 $("#auditLog").textContent=errors.length?errors.join("\n"):`PASS\n${Q.length} questions\n${new Set(Q.map(q=>q.skill)).size} skill labels\n0 duplicate normalized choices\n0 answer-key mismatches`;
}
function renderAssessments(){
 const s=activeStudent();
 $("#view-assessments").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Formal evidence</p><h2>Assessment Center</h2><p>Assessments support mastery decisions and records; they do not replace jurisdiction-specific transcript, graduation, accreditation, or external testing requirements.</p></div>
 <div class="resource-grid">
  <a class="card" href="diagnostic/"><h3>Readiness Diagnostic</h3><p>40 prerequisite questions across equations, proportion/scale, coordinate graphing, radicals, measurement, and reasoning.</p></a>
  <a class="card" href="assessments/midterm.html"><h3>Midterm Examination</h3><p>60 questions covering Units 01–06 and geometric foundations, transformations, similarity, and trigonometry.</p></a>
  <a class="card" href="assessments/final.html"><h3>Comprehensive Final</h3><p>100 questions across the complete Geometry course.</p></a>
  <a class="card" href="records/course-completion-certificate.html"><h3>Completion Record</h3><p>Printable evaluator or family-issued completion and verification record.</p></a>
 </div>
 <article class="card" style="margin-top:17px"><h3>Verified local assessment evidence</h3><p class="notice">Manual formal score entry is retired. Diagnostic, Midterm, and Final records are written only by their assessment engines; capstone evidence is recorded through the completion record and evaluator attestation.</p><div class="actions"><a class="btn" href="assessments/administration-guide.html">Administration Guide</a><a class="btn" href="records/course-completion-certificate.html">Completion Record</a></div></article></div>`;
}
function renderGradebook(){
 const grade=courseGrade();
 $("#view-gradebook").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Transparent local records</p><h2>Gradebook</h2><p>Coursework 35% · generated or imported mastery 20% · midterm 15% · final 20% · capstone defense 10%.</p></div>
 <article class="card"><div class="table-wrap"><table><thead><tr><th>Week</th><th>Classwork</th><th>Mastery Best</th><th>Portfolio</th><th>Sessions</th></tr></thead><tbody>${D.weeks.map(w=>{const r=weekRecord(w.week);return `<tr><td>${w.week} · ${esc(w.title)}</td><td>${pct(r.classwork)}</td><td>${pct(r.masteryBest)}</td><td>${pct(r.portfolio)}</td><td>${Object.values(r.days).filter(Boolean).length}/5</td></tr>`}).join("")}</tbody></table></div><h3>Legacy planning average: ${pct(grade)}</h3><p class="notice">This local planning display cannot unlock progression or issue completion. Canonical credit comes only from the strict evidence chain.</p><div class="actions"><button class="btn" id="gradeCsv" type="button">Download Gradebook CSV</button><button class="btn" id="printGrade" type="button">Print</button></div></article></div>`;
 $("#gradeCsv")?.addEventListener("click",downloadGradebook);$("#printGrade")?.addEventListener("click",()=>print());
}
function renderPortfolio(){
 const s=activeStudent();
 $("#view-portfolio").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Representative evidence</p><h2>Portfolio Record</h2><p>Portfolio evidence should show reasoning, corrections, modelling, technology use, exact and approximate work, communication, and reflection—not merely scores.</p></div><div class="unit-grid">${D.weeks.map(w=>{const r=weekRecord(w.week);return `<article class="card"><span class="pill">Week ${w.week}</span><h3>${esc(w.title)}</h3><p><strong>Evidence:</strong> ${esc(r.evidence||"Not yet recorded.")}</p><p><strong>Reflection:</strong> ${esc(r.reflection||"Not yet recorded.")}</p><p>Classwork ${pct(r.classwork)} · Mastery ${pct(r.masteryBest)} · Portfolio ${pct(r.portfolio)}</p></article>`}).join("")}</div><div class="actions"><button class="btn" id="portfolioJson" type="button">Export Portfolio JSON</button><button class="btn" id="printPortfolio" type="button">Print</button></div></div>`;
 $("#portfolioJson")?.addEventListener("click",()=>download("geometry-portfolio.json",JSON.stringify({course:D.course,learner:s,exported:new Date().toISOString()},null,2),"application/json"));$("#printPortfolio")?.addEventListener("click",()=>print());
}
function renderTeacher(){
 $("#view-teacher").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Administration &amp; records</p><h2>Teacher and Home-Education Tools</h2><p>Use multiple evidence sources: diagnostic data, lesson work, mastery checks, corrections, midterm, final, modelling exploration, oral defense, and representative portfolio artifacts.</p></div>
 <div class="grid"><article class="card col6"><h3>Local learner records</h3>${studentControls()}<div class="actions"><button class="btn" id="backup" type="button">Export Complete Backup</button><label class="btn">Import Backup<input id="import" type="file" accept=".json" hidden></label><button class="btn" id="report" type="button">Export Progress Report</button></div></article>
 <article class="card col6"><h3>Course documentation</h3><p>The package includes a curriculum map, standards union, assessment model, calculator, CAD, and Arcade policy, accessibility/privacy guidance, pacing guide, gradebook template, mastery template, and completion record.</p><div class="actions"><a class="btn" href="docs/CURRICULUM_MAP.md">Curriculum Map</a><a class="btn" href="docs/STANDARDS_UNION.md">Standards Union</a><a class="btn" href="teacher/">Teacher Center</a></div></article>
 <article class="card col6"><h3>Scientific Calculator v4</h3><p>Use for radicals, trigonometry, measurement, precision, surface area, volume, and verification while preserving formulas, substitutions, units, and interpretation.</p><a class="btn primary" href="../tools/calculator" target="_blank" rel="noopener">Open Calculator</a></article><article class="card col6"><h3>OHMIC CAD &amp; Geometry Arcade</h3><p>Use technical drafting, radial design, symmetry, and coordinate games as documented mathematical laboratories—not unrecorded extras.</p><div class="actions"><a class="btn primary" href="https://vervenveda.com/proresource_hub.github.io/Protools/Ohmic_CAD_Studio.html" target="_blank" rel="noopener">Open CAD</a><a class="btn" href="https://vervenveda.com/arcade.github.io/Geometry/sacred_geometry_game_index.html" target="_blank" rel="noopener">Open Geometry Studio</a></div></article>
 <article class="card col6"><h3>Profile integration</h3><p>This course stores the future High School profile ID <code>geometry</code>. The refreshed High School page can add that course to its catalog after the next courses are complete.</p><a class="btn" href="PROFILE_INTEGRATION_NOTES.md">Read Integration Notes</a></article>
 </div></div>`;
 bindStudentControls();
 $("#backup")?.addEventListener("click",()=>download("geometry-complete-backup.json",JSON.stringify(state,null,2),"application/json"));
 $("#import")?.addEventListener("change",async e=>{
   try{const file=e.target.files?.[0];if(!file)return;state=normalizeState(JSON.parse(await file.text()));save();renderTeacher();alert("Backup imported.")}
   catch{alert("That file is not a valid Geometry backup.")}
 });
 $("#report")?.addEventListener("click",downloadReport);
}
function render(v){({dashboard:renderDashboard,week:renderWeek,scope:renderScope,units:renderUnits,practice:renderPractice,assessments:renderAssessments,gradebook:renderGradebook,portfolio:renderPortfolio,teacher:renderTeacher}[v]||renderDashboard)()}
function renderCurrent(){render($(".view.active")?.id.replace("view-","")||"dashboard")}
function csvCell(v){return `"${String(v??"").replace(/"/g,'""')}"`}
function download(name,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),800)}
function downloadScope(){const rows=[["Week","Unit","Focus","Essential Question","Route"],...D.weeks.map(w=>[w.week,w.unit||"Milestone",w.title,w.essential,w.unit_path])];download("geometry-36-week-scope.csv",rows.map(r=>r.map(csvCell).join(",")).join("\n"),"text/csv")}
function downloadGradebook(){const rows=[["Week","Focus","Classwork","Mastery Best","Portfolio","Sessions"],...D.weeks.map(w=>{const r=weekRecord(w.week);return [w.week,w.title,r.classwork??"",r.masteryBest??"",r.portfolio??"",Object.values(r.days).filter(Boolean).length]})];download("geometry-gradebook.csv",rows.map(r=>r.map(csvCell).join(",")).join("\n"),"text/csv")}
function downloadReport(){
 const s=activeStudent(),g=courseGrade();
 const body=`<!doctype html><meta charset="utf-8"><title>Geometry Progress Report</title><style>body{font:16px Arial;max-width:1000px;margin:40px auto}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:7px;text-align:left}</style><h1>${esc(s.name)} · Geometry Progress Report</h1><p>Exported ${new Date().toLocaleString()}</p><p>Pathway: ${esc(s.pathway)} · Calculated course grade: ${pct(g)}</p><p>Diagnostic ${pct(s.formal.diagnostic)} · Midterm ${pct(s.formal.midterm)} · Final ${pct(s.formal.final)} · Capstone ${pct(s.formal.capstone)}</p><table><thead><tr><th>Week</th><th>Focus</th><th>Classwork</th><th>Mastery</th><th>Portfolio</th></tr></thead><tbody>${D.weeks.map(w=>{const r=weekRecord(w.week);return `<tr><td>${w.week}</td><td>${esc(w.title)}</td><td>${pct(r.classwork)}</td><td>${pct(r.masteryBest)}</td><td>${pct(r.portfolio)}</td></tr>`}).join("")}</tbody></table>`;
 download("geometry-progress-report.html",body,"text/html");
}
setView(VALID_VIEWS.includes(location.hash.slice(1))?location.hash.slice(1):"dashboard",false);
})();

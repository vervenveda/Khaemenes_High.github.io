
(()=>{
"use strict";
const D=window.ALGEBRA1_DATA,Q=window.ALGEBRA1_QUESTIONS;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KEY=D.course.storage_key;

function initialState(){
 return {version:1,activeId:"learner-1",selectedWeek:1,students:[
  {id:"learner-1",name:"Learner 1",pathway:"Core",weeks:{},
   formal:{diagnostic:null,midterm:null,final:null,capstone:null},notes:""}
 ]};
}
function loadState(){
 try{
   const x=JSON.parse(localStorage.getItem(KEY));
   return x&&Array.isArray(x.students)&&x.students.length?x:initialState();
 }catch{return initialState()}
}
let state=loadState(),activeSet=[];
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function activeStudent(){return state.students.find(x=>x.id===state.activeId)||state.students[0]}
function weekRecord(n){
 const s=activeStudent();
 return s.weeks[n]||(s.weeks[n]={days:{},classwork:null,masteryBest:null,portfolio:null,attempts:0,reflection:"",evidence:""});
}
function num(v){const n=Number(v);return Number.isFinite(n)?n:null}
function validScore(v){if(v==="")return null;const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(100,n)):null}
function percent(v){return v==null?"—":`${Math.round(v)}%`}
function average(vals){const a=vals.map(num).filter(x=>x!=null);return a.length?a.reduce((x,y)=>x+y,0)/a.length:null}
function courseGrade(){
 const s=activeStudent(),coursework=average(D.weeks.map(w=>weekRecord(w.week).classwork));
 const mid=num(s.formal.midterm),fin=num(s.formal.final),cap=num(s.formal.capstone);
 if([coursework,mid,fin,cap].some(x=>x==null))return null;
 return coursework*.40+mid*.20+fin*.30+cap*.10;
}
function setTheme(t){document.documentElement.dataset.theme=t;localStorage.setItem("khaemenes-theme",t)}
$("#themeToggle").onclick=()=>setTheme(document.documentElement.dataset.theme==="light"?"dark":"light");
setTheme(localStorage.getItem("khaemenes-theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));

function setView(v){
 $$(".view").forEach(x=>x.classList.toggle("active",x.id===`view-${v}`));
 $$("[data-view]").forEach(x=>x.classList.toggle("active",x.dataset.view===v));
 render(v);
 const nav=$(".quick-nav");
 if(nav)scrollTo({top:Math.max(0,nav.offsetTop-76),behavior:"smooth"});
}
$$("[data-view]").forEach(b=>b.onclick=()=>setView(b.dataset.view));

function studentControls(){
 const s=activeStudent();
 return `<div class="form-grid">
 <div class="field"><label>Active learner</label><select id="studentSelect">${
   state.students.map(x=>`<option value="${esc(x.id)}" ${x.id===s.id?"selected":""}>${esc(x.name)}</option>`).join("")
 }</select></div>
 <div class="field"><label>Learning pathway</label><select id="pathwaySelect">${
   ["Foundation","Core","Extended"].map(x=>`<option ${x===s.pathway?"selected":""}>${x}</option>`).join("")
 }</select></div></div>
 <div class="actions">
 <button class="btn" id="addLearner">Add Learner</button>
 <button class="btn" id="renameLearner">Rename</button>
 <button class="btn danger" id="deleteLearner">Delete</button>
 </div>`;
}
function bindStudentControls(){
 if(!$("#studentSelect"))return;
 $("#studentSelect").onchange=e=>{state.activeId=e.target.value;save();renderCurrent()};
 $("#pathwaySelect").onchange=e=>{activeStudent().pathway=e.target.value;save();renderCurrent()};
 $("#addLearner").onclick=()=>{
   const name=prompt("Learner name:");
   if(!name?.trim())return;
   const id=`learner-${Date.now()}`;
   state.students.push({id,name:name.trim(),pathway:"Core",weeks:{},formal:{diagnostic:null,midterm:null,final:null,capstone:null},notes:""});
   state.activeId=id;save();renderCurrent();
 };
 $("#renameLearner").onclick=()=>{
   const name=prompt("New learner name:",activeStudent().name);
   if(name?.trim()){activeStudent().name=name.trim();save();renderCurrent()}
 };
 $("#deleteLearner").onclick=()=>{
   if(state.students.length===1)return alert("At least one learner record is required.");
   if(confirm("Delete this local learner record?")){
     state.students=state.students.filter(x=>x.id!==state.activeId);
     state.activeId=state.students[0].id;save();renderCurrent();
   }
 };
}

function dailyPlan(w){
 return [
  {day:"Monday",title:"Concept language & prerequisite reasoning",
   task:`Build a concept record for ${w.title}. Define central terms and connect them to the essential question.`,
   work:["Complete a prerequisite warm-up.","Annotate the governing rule.","Create one correct example and one non-example."]},
  {day:"Tuesday",title:"Worked examples & guided classwork",
   task:"Study at least four worked examples and identify the property, operation, representation, and verification used.",
   work:["Complete 10–15 pathway problems.","Show transformations one line at a time.","Verify at least two answers independently."]},
  {day:"Wednesday",title:"Application & modelling laboratory",
   task:w.application,
   work:["Define quantities and units.","Create at least two representations.","Interpret the result and state one limitation."]},
  {day:"Thursday",title:"Error analysis & mixed review",
   task:`Analyze this misconception: ${w.misconception}`,
   work:["Identify the first invalid step or assumption.","Correct it using a rule or counterexample.","Complete current and prerequisite mixed practice."]},
  {day:"Friday",title:"Mastery, portfolio & next-step decision",
   task:`Complete a definitive-answer mastery set for ${w.title}.`,
   work:["Reach 80% or document reteaching.","Select a portfolio work sample.","Write a reflection and next strategy."]}
 ];
}

function renderDashboard(){
 const s=activeStudent();
 const done=D.weeks.filter(w=>Object.values(weekRecord(w.week).days||{}).filter(Boolean).length===5).length;
 const next=D.weeks.find(w=>Object.values(weekRecord(w.week).days||{}).filter(Boolean).length<5)||D.weeks.at(-1);
 const grade=courseGrade();
 $("#view-dashboard").innerHTML=`<div class="wrap">
 <div class="section-head"><p class="eyebrow">Local learner dashboard</p><h2>${esc(s.name)} · Algebra I</h2>
 <p>Progress, mastery, assessments, portfolio evidence, and course records remain in this browser unless exported.</p></div>
 <div class="grid">
 <article class="card col4">${studentControls()}</article>
 <article class="card col8"><span class="pill good">Next recommended week</span>
 <h3>Week ${next.week} · ${esc(next.title)}</h3><p>${esc(next.essential)}</p>
 <div class="progress"><span style="width:${done/36*100}%"></span></div>
 <p>${done}/36 weeks fully checked · ${Math.round(done/36*100)}%</p>
 <div class="actions"><button class="btn primary" id="openNext">Open Week ${next.week}</button><a class="btn" href="${next.unit_path}">Open Detailed Material</a></div></article>
 <article class="card col3"><h4>Coursework</h4><p class="score">${percent(average(D.weeks.map(w=>weekRecord(w.week).classwork)))}</p></article>
 <article class="card col3"><h4>Midterm</h4><p class="score">${percent(s.formal.midterm)}</p></article>
 <article class="card col3"><h4>Final</h4><p class="score">${percent(s.formal.final)}</p></article>
 <article class="card col3"><h4>Course Grade</h4><p class="score">${percent(grade)}</p></article>
 <article class="card col3"><h4>87 Detailed Lessons</h4><p>Full explanations, examples, vocabulary, practice, and reflections.</p><button class="btn" data-go="units">Browse Units</button></article>
 <article class="card col3"><h4>180 Class Sessions</h4><p>Five substantial sessions per week with evidence requirements.</p><button class="btn" data-go="week">Weekly Classroom</button></article>
 <article class="card col3"><h4>Formal Assessments</h4><p>Diagnostic, 60-question midterm, 100-question final, and records.</p><button class="btn" data-go="assessments">Assessment Center</button></article>
 <article class="card col3 future-tool"><h4>Scientific Calculator</h4><p>The root calculator remains under development and is not required.</p><button class="btn disabled" disabled>In Development</button></article>
 </div></div>`;
 bindStudentControls();
 $("#openNext").onclick=()=>{state.selectedWeek=next.week;save();setView("week")};
 $$("[data-go]").forEach(b=>b.onclick=()=>setView(b.dataset.go));
}

function weekPicker(){
 return `<div class="week-picker">${D.weeks.map(w=>{
   const r=weekRecord(w.week),done=Object.values(r.days||{}).filter(Boolean).length===5;
   return `<button class="week-chip ${state.selectedWeek===w.week?"active":""} ${done?"done":""}" data-week="${w.week}"><strong>${w.week}</strong>${w.unit?`U${String(w.unit).padStart(2,"0")}`:"D"}</button>`;
 }).join("")}</div>`;
}
function renderWeek(){
 const w=D.weeks[state.selectedWeek-1],r=weekRecord(w.week),days=dailyPlan(w);
 const completed=Object.values(r.days||{}).filter(Boolean).length;
 $("#view-week").innerHTML=`<div class="wrap">
 <div class="section-head"><p class="eyebrow">180-session classroom</p><h2>Weekly Classwork</h2>
 <p>Every week combines concept development, guided classwork, modelling, error analysis, mastery, and portfolio evidence.</p></div>
 <article class="card no-print">${weekPicker()}</article>
 <article class="card">
 <span class="pill">Week ${w.week}</span><span class="pill">${w.unit?`Unit ${String(w.unit).padStart(2,"0")}`:"Diagnostic"}</span>
 <span class="pill">${esc(activeStudent().pathway)} pathway</span><span class="pill good">${completed}/5 complete</span>
 <h2>${esc(w.title)}</h2><p><strong>Essential question:</strong> ${esc(w.essential)}</p>
 <p class="notice"><strong>Governing relationship:</strong> ${esc(w.rule)}</p>
 <div class="actions"><a class="btn primary" href="${w.unit_path}">Open Detailed Material</a><button class="btn" id="printWeek">Print Week</button></div></article>
 <div class="daily-grid">${days.map(x=>`<article class="day-card"><span class="day">${x.day}</span><h4>${esc(x.title)}</h4>
 <p>${esc(x.task)}</p><ul>${x.work.map(y=>`<li>${esc(y)}</li>`).join("")}</ul>
 <p><strong>Required evidence:</strong> annotated work, verification, correction, and reflection.</p>
 <div class="checkline"><label><input type="checkbox" data-day="${x.day}" ${r.days[x.day]?"checked":""}> Session complete</label></div></article>`).join("")}</div>
 <div class="grid" style="margin-top:14px">
 <article class="card col4"><h3>Weekly Scores</h3><label>Classwork<input id="cw" type="number" min="0" max="100" value="${r.classwork??""}"></label>
 <label>Portfolio<input id="pf" type="number" min="0" max="100" value="${r.portfolio??""}"></label>
 <p>Best generated mastery: ${percent(r.masteryBest)} · ${r.attempts||0} attempt(s)</p><button class="btn" id="saveWeek">Save Scores</button></article>
 <article class="card col4"><h3>Reflection</h3><textarea id="reflection">${esc(r.reflection||"")}</textarea><button class="btn" id="saveReflection">Save Reflection</button></article>
 <article class="card col4"><h3>Evidence Note</h3><textarea id="evidence">${esc(r.evidence||"")}</textarea><button class="btn" id="saveEvidence">Save Evidence</button></article>
 </div>
 <article class="card" style="margin-top:14px"><h3>Week ${w.week} Mastery Set</h3>
 <div class="actions no-print"><select id="count" style="width:auto"><option>10</option><option>15</option><option>20</option></select><button class="btn primary" id="generate">Generate Set</button></div>
 <div id="weekPractice"></div></article></div>`;
 $$("[data-week]").forEach(b=>b.onclick=()=>{state.selectedWeek=Number(b.dataset.week);save();renderWeek()});
 $$("[data-day]").forEach(c=>c.onchange=()=>{r.days[c.dataset.day]=c.checked;save();renderWeek()});
 $("#saveWeek").onclick=()=>{r.classwork=validScore($("#cw").value);r.portfolio=validScore($("#pf").value);save();renderCurrent()};
 $("#saveReflection").onclick=()=>{r.reflection=$("#reflection").value.trim();save();alert("Reflection saved locally.")};
 $("#saveEvidence").onclick=()=>{r.evidence=$("#evidence").value.trim();save();alert("Evidence note saved locally.")};
 $("#printWeek").onclick=()=>window.print();
 $("#generate").onclick=()=>{activeSet=makeSet(w.skills,Number($("#count").value));renderSet($("#weekPractice"),activeSet,w.week)};
}

function renderScope(){
 $("#view-scope").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Complete calendar</p>
 <h2>36-Week Scope &amp; Sequence</h2></div><article class="card"><div class="table-wrap"><table>
 <thead><tr><th>Week</th><th>Unit</th><th>Focus</th><th>Essential question</th><th>Detailed route</th></tr></thead>
 <tbody>${D.weeks.map(w=>`<tr><td>${w.week}</td><td>${w.unit?String(w.unit).padStart(2,"0"):"Diagnostic"}</td><td>${esc(w.title)}</td><td>${esc(w.essential)}</td><td><a href="${w.unit_path}">Open</a></td></tr>`).join("")}</tbody></table></div>
 <div class="actions"><button class="btn" id="scopeCsv">Download CSV</button><button class="btn" onclick="print()">Print</button></div></article></div>`;
 $("#scopeCsv").onclick=downloadScope;
}
function renderUnits(){
 const colors=["#426f91","#a67b35","#4f7657","#6e6387","#9a5b65"];
 $("#view-units").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Deep instructional layer</p><h2>Diagnostic &amp; 13 Units</h2>
 <p>87 detailed lessons, three pathways per unit, mastery checks, projects, guides, maps, vocabulary, and answer keys.</p></div>
 <div class="unit-grid"><article class="card unit-card" style="--accent:#111"><span class="unit-number">D</span><h3>Readiness Diagnostic</h3><p>Prerequisite evidence and targeted learning plan.</p><div class="actions"><a class="btn primary" href="diagnostic/">Open Diagnostic</a></div></article>
 ${D.units.map((u,i)=>`<article class="card unit-card" style="--accent:${colors[i%colors.length]}"><span class="unit-number">${String(u.number).padStart(2,"0")}</span>
 <h3>${esc(u.title)}</h3><p>${esc(u.essential)}</p><p><span class="pill">${u.weeks} week${u.weeks===1?"":"s"}</span><span class="pill">${u.lessons.length} lessons</span><span class="pill">3 pathways</span></p>
 <div class="actions"><a class="btn primary" href="units/unit-${String(u.number).padStart(2,"0")}/">Open Unit</a></div></article>`).join("")}</div></div>`;
}
function makeSet(skills,count){
 let pool=Q.filter(q=>skills.includes(q.category));
 if(!pool.length)pool=Q;
 return [...pool].sort(()=>Math.random()-.5).slice(0,Math.min(count,pool.length));
}
function questionHTML(set){
 return set.map((q,i)=>`<article class="question"><fieldset><legend>${i+1}. ${esc(q.prompt)}</legend><div class="options">${
 q.options.map((o,j)=>`<label class="option"><input type="radio" name="lab${i}" value="${j}"><span>${esc(o)}</span></label>`).join("")
 }</div><div class="feedback" id="labfb${i}" hidden></div></fieldset></article>`).join("");
}
function renderSet(host,set,weekNo){
 host.innerHTML=questionHTML(set)+`<div class="actions no-print"><button class="btn primary" id="scoreSet">Submit &amp; Score</button></div><p id="setMsg"></p>`;
 $("#scoreSet").onclick=()=>{
   let right=0,complete=true;
   set.forEach((q,i)=>{
     const selected=document.querySelector(`input[name=lab${i}]:checked`),f=$(`#labfb${i}`);
     f.hidden=false;
     if(!selected){complete=false;f.className="feedback bad";f.textContent="Choose an answer.";return}
     const ok=Number(selected.value)===q.answer;if(ok)right++;
     f.className=`feedback ${ok?"good":"bad"}`;f.textContent=`${ok?"Correct.":"Review."} ${q.explanation}`;
   });
   if(!complete)return $("#setMsg").textContent="Answer every item before scoring.";
   const score=Math.round(right/set.length*100);
   $("#setMsg").innerHTML=`<span class="score">${score}%</span> · ${right}/${set.length}`;
   if(weekNo){const r=weekRecord(weekNo);r.attempts=(r.attempts||0)+1;r.masteryBest=Math.max(r.masteryBest||0,score);save()}
 };
}
function renderPractice(){
 $("#view-practice").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Definitive-answer generation</p><h2>Adaptive Practice Lab</h2></div>
 <div class="practice-layout"><article class="card"><div id="practiceHost"><p class="notice">Choose settings and generate a fresh set.</p></div></article>
 <aside class="card practice-side"><label>Week<select id="practiceWeek">${D.weeks.map(x=>`<option value="${x.week}" ${x.week===state.selectedWeek?"selected":""}>Week ${x.week} · ${esc(x.title)}</option>`).join("")}<option value="all">Whole course</option></select></label>
 <label>Count<select id="practiceCount"><option>10</option><option>20</option><option>30</option></select></label>
 <div class="actions"><button class="btn primary" id="makePractice">Generate</button><button class="btn" id="audit">Run Audit</button></div>
 <div class="audit-log" id="auditLog">Audit not yet run.</div></aside></div></div>`;
 $("#makePractice").onclick=()=>{
   const v=$("#practiceWeek").value;
   const skills=v==="all"?[...new Set(Q.map(q=>q.category))]:D.weeks[Number(v)-1].skills;
   activeSet=makeSet(skills,Number($("#practiceCount").value));
   renderSet($("#practiceHost"),activeSet,v==="all"?null:Number(v));
 };
 $("#audit").onclick=runAudit;
}
function runAudit(){
 const errors=[];
 Q.forEach(q=>{
   if(!q.prompt||!q.explanation)errors.push(`${q.id}: missing text`);
   if(q.options.length!==4||new Set(q.options.map(x=>x.trim().toLowerCase())).size!==4)errors.push(`${q.id}: option uniqueness`);
   if(q.options[q.answer]!==q.answer_text)errors.push(`${q.id}: key mismatch`);
 });
 $("#auditLog").textContent=errors.length?errors.join("\n"):`PASS
${Q.length} lesson-bank questions
${new Set(Q.map(q=>q.category)).size} skill categories
0 duplicate normalized choices
0 key mismatches`;
}
function renderAssessments(){
 const s=activeStudent();
 $("#view-assessments").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Formal evidence</p><h2>Assessment Center</h2></div>
 <div class="resource-grid"><a class="card" href="diagnostic/"><h3>Readiness Diagnostic</h3><p>36 prerequisite questions with targeted review.</p></a>
 <a class="card" href="assessments/midterm-units-01-06.html"><h3>Midterm</h3><p>60 questions covering Units 01–06 through Week 18.</p></a>
 <a class="card" href="assessments/final-exam-36-weeks.html"><h3>Comprehensive Final</h3><p>100 questions covering the complete 36-week course.</p></a>
 <a class="card" href="records/course-completion-certificate.html"><h3>Completion Record</h3><p>Parent-issued certificate and verification record.</p></a></div>
 <article class="card" style="margin-top:14px"><h3>Manual or imported formal scores</h3><div class="form-grid">
 <label>Diagnostic<input id="diagScore" type="number" min="0" max="100" value="${s.formal.diagnostic??""}"></label>
 <label>Midterm<input id="midScore" type="number" min="0" max="100" value="${s.formal.midterm??""}"></label>
 <label>Final<input id="finalScore" type="number" min="0" max="100" value="${s.formal.final??""}"></label>
 <label>Capstone<input id="capScore" type="number" min="0" max="100" value="${s.formal.capstone??""}"></label>
 </div><div class="actions"><button class="btn primary" id="saveFormal">Save Scores</button></div></article></div>`;
 $("#saveFormal").onclick=()=>{
   s.formal={diagnostic:validScore($("#diagScore").value),midterm:validScore($("#midScore").value),final:validScore($("#finalScore").value),capstone:validScore($("#capScore").value)};
   save();renderCurrent();
 };
}
function renderGradebook(){
 const grade=courseGrade();
 $("#view-gradebook").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Transparent records</p><h2>Gradebook</h2>
 <p>Coursework 40% · Midterm 20% · Final 30% · Capstone 10%</p></div>
 <article class="card"><div class="table-wrap"><table><thead><tr><th>Week</th><th>Classwork</th><th>Mastery Best</th><th>Portfolio</th><th>Sessions</th></tr></thead>
 <tbody>${D.weeks.map(w=>{const r=weekRecord(w.week);return `<tr><td>${w.week} · ${esc(w.title)}</td><td>${percent(r.classwork)}</td><td>${percent(r.masteryBest)}</td><td>${percent(r.portfolio)}</td><td>${Object.values(r.days||{}).filter(Boolean).length}/5</td></tr>`}).join("")}</tbody></table></div>
 <h3>Calculated course grade: ${percent(grade)}</h3><div class="actions"><button class="btn" id="gradeCsv">Download Gradebook CSV</button><button class="btn" onclick="print()">Print</button></div></article></div>`;
 $("#gradeCsv").onclick=downloadGradebook;
}
function appliedMissionPortfolio(){
 try{
  const x=JSON.parse(localStorage.getItem("khaemenes-algebra1-applied-mission-portfolio-v1")||'{"units":{}}');
  return x&&x.units&&typeof x.units==="object"?x:{units:{}};
 }catch{return{units:{}}}
}
function renderPortfolio(){
 const s=activeStudent(),missions=appliedMissionPortfolio(),missionRows=Object.values(missions.units||{}).sort((a,b)=>(a.unit||0)-(b.unit||0));
 $("#view-portfolio").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Representative evidence</p><h2>Portfolio Record</h2></div>
 <div class="grid">${D.weeks.map(w=>{const r=weekRecord(w.week);return `<article class="card col4"><span class="pill">Week ${w.week}</span><h3>${esc(w.title)}</h3>
 <p><strong>Evidence:</strong> ${esc(r.evidence||"Not yet recorded.")}</p><p><strong>Reflection:</strong> ${esc(r.reflection||"Not yet recorded.")}</p>
 <p>Classwork ${percent(r.classwork)} · Mastery ${percent(r.masteryBest)} · Portfolio ${percent(r.portfolio)}</p></article>`}).join("")}</div>
 <div class="section-head" style="margin-top:34px"><p class="eyebrow">Applied Connection</p><h2>Mission Studio Evidence</h2><p>These entries are learner-selected portfolio evidence. They do not replace formal lesson, weekly, unit, Midterm, Final, or capstone mastery.</p></div>
 <div class="grid">${missionRows.length?missionRows.map(r=>`<article class="card col4"><span class="pill">Unit ${String(r.unit||"").padStart(2,"0")}</span><h3>${esc(r.project||"Applied Mission")}</h3><p><strong>Mission:</strong> ${esc(r.mission||"Saved mission")}</p><p><strong>Best evaluator review:</strong> ${r.best_review==null?"Not yet reviewed":percent(r.best_review)}</p><p><strong>Portfolio saved:</strong> ${r.saved_at?esc(new Date(r.saved_at).toLocaleString()):"Saved locally"}</p></article>`).join(""):`<article class="card full"><p>No Applied Mission Studio evidence has been added yet. Open an Applied Connection from a lesson, complete the evidence workspace, then choose <strong>Add to Algebra I Portfolio</strong>.</p></article>`}</div>
 <div class="actions"><button class="btn" id="portfolioJson">Export Portfolio JSON</button><button class="btn" onclick="print()">Print</button></div></div>`;
 $("#portfolioJson").onclick=()=>download("algebra1-portfolio.json",JSON.stringify({course:D.course,learner:s,applied_missions:missions,exported:new Date().toISOString()},null,2),"application/json");
}
function renderTeacher(){
 $("#view-teacher").innerHTML=`<div class="wrap"><div class="section-head"><p class="eyebrow">Administration &amp; records</p><h2>Teacher and Home-Education Tools</h2></div>
 <div class="grid"><article class="card col6"><h3>Course records</h3>${studentControls()}
 <div class="actions"><button class="btn" id="backup">Export Complete Backup</button><label class="btn">Import Backup<input id="import" type="file" accept=".json" hidden></label><button class="btn" id="report">Export Progress Report</button></div></article>
 <article class="card col6"><h3>Assessment and documentation</h3><p>Use diagnostic evidence, unit mastery, midterm, final, capstone rubric, corrections, and representative work together. This course does not replace local graduation, testing, transcript, annual-evaluation, or accreditation requirements.</p>
 <div class="actions"><a class="btn" href="assessments/administration-guide.html">Administration Guide</a><a class="btn" href="records/course-completion-certificate.html">Completion Record</a></div></article>
 <article class="card col6"><h3>Standards union</h3><p>Florida B.E.S.T., Texas TEKS, New York Next Generation Algebra I, Virginia 2023 SOL, California Algebra I / Integrated Math I, Common Core, and international modelling expectations.</p><a class="btn" href="docs/STANDARDS_UNION.md">Read Crosswalk</a></article>
 <article class="card col6 future-tool"><h3>Scientific Calculator Policy</h3><p>The root calculator is under development. It is not required until parsing, modes, accessibility, history, and error handling are validated.</p><button class="btn disabled" disabled>In Development</button></article></div></div>`;
 bindStudentControls();
 $("#backup").onclick=()=>download("algebra1-complete-backup.json",JSON.stringify(state,null,2),"application/json");
 $("#import").onchange=async e=>{
   try{const data=JSON.parse(await e.target.files[0].text());if(!data.students)throw Error();state=data;save();renderCurrent();alert("Backup imported.")}
   catch{alert("Invalid backup file.")}
 };
 $("#report").onclick=downloadReport;
}
function render(v){({dashboard:renderDashboard,week:renderWeek,scope:renderScope,units:renderUnits,practice:renderPractice,assessments:renderAssessments,gradebook:renderGradebook,portfolio:renderPortfolio,teacher:renderTeacher}[v]||renderDashboard)()}
function currentView(){return $(".view.active")?.id.replace("view-","")||"dashboard"}
function renderCurrent(){render(currentView())}
function csvCell(v){return `"${String(v??"").replace(/"/g,'""')}"`}
function download(name,text,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
function downloadScope(){const rows=[["Week","Unit","Focus","Essential Question","Rule","Route"],...D.weeks.map(w=>[w.week,w.unit||"Diagnostic",w.title,w.essential,w.rule,w.unit_path])];download("algebra1-36-week-scope.csv",rows.map(r=>r.map(csvCell).join(",")).join("\n"),"text/csv")}
function downloadGradebook(){const rows=[["Week","Focus","Classwork","Mastery Best","Portfolio","Sessions"],...D.weeks.map(w=>{const r=weekRecord(w.week);return [w.week,w.title,r.classwork??"",r.masteryBest??"",r.portfolio??"",Object.values(r.days||{}).filter(Boolean).length]})];download("algebra1-gradebook.csv",rows.map(r=>r.map(csvCell).join(",")).join("\n"),"text/csv")}
function downloadReport(){const s=activeStudent(),g=courseGrade(),body=`<!doctype html><meta charset=utf-8><title>Algebra I Progress Report</title><h1>${esc(s.name)} · Algebra I Progress Report</h1><p>Exported ${new Date().toLocaleString()}</p><p>Course grade: ${percent(g)}</p><p>Midterm: ${percent(s.formal.midterm)} · Final: ${percent(s.formal.final)} · Capstone: ${percent(s.formal.capstone)}</p><table border=1 cellpadding=6>${D.weeks.map(w=>{const r=weekRecord(w.week);return `<tr><td>Week ${w.week}</td><td>${esc(w.title)}</td><td>${percent(r.classwork)}</td><td>${percent(r.masteryBest)}</td><td>${percent(r.portfolio)}</td></tr>`}).join("")}</table>`;download("algebra1-progress-report.html",body,"text/html")}
renderDashboard();
})();

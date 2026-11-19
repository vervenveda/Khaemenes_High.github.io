const STORAGE_KEY = "KHAE_OPEN_PREALGEBRA_FORGE_V2";
const LEGACY_STORAGE_KEYS = ["KHAE_MATH9_PREALGEBRA_FORGE_V1"];
const PROFILE_PIN_KEY = "khaemenes-high-pinned-courses-v2";
const PROFILE_COURSE_ID = "pre-algebra";
let state=loadState(),view="dashboard",activeWeek=1;
let weeklyMasteryMode=false;
let activeQuiz=[];
let activeExams={};
let activeExamName="midterm";
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
function validState(candidate){
  return !!candidate && typeof candidate==="object" && Array.isArray(candidate.students) && candidate.students.every(s=>s&&typeof s.id==="string"&&typeof s.name==="string");
}
function loadState(){
  try{
    const S=window.KhaemenesMathStorageAdapter;
    const current=S?.readJSON?S.readJSON(STORAGE_KEY,null):JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(validState(current)) return current;
    for(const key of LEGACY_STORAGE_KEYS){
      const legacy=S?.readJSON?S.readJSON(key,null):JSON.parse(localStorage.getItem(key));
      if(validState(legacy)){
        const result=S?.writeJSON?S.writeJSON(STORAGE_KEY,legacy):(()=>{const raw=JSON.stringify(legacy);localStorage.setItem(STORAGE_KEY,raw);return{persisted:localStorage.getItem(STORAGE_KEY)===raw,verified:localStorage.getItem(STORAGE_KEY)===raw}})();
        if(result.persisted===true&&result.verified===true)return legacy;
      }
    }
  }catch(error){console.warn("Progress could not be loaded.",error)}
  return{schemaVersion:3,students:[],activeId:null};
}
function save(){
  state.schemaVersion=3;
  let result={persisted:false,verified:false};
  try{
    const S=window.KhaemenesMathStorageAdapter;
    if(S?.writeJSON)result=S.writeJSON(STORAGE_KEY,state);
    else{
      const raw=JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY,raw);
      const ok=localStorage.getItem(STORAGE_KEY)===raw;
      result={persisted:ok,verified:ok};
    }
  }catch(error){console.warn("Pre-Algebra state write could not be verified.",error)}
  window.dispatchEvent(new CustomEvent("khaemenes-high-course-state-changed",{detail:{courseId:"pre-algebra",persisted:result.persisted===true,verified:result.verified===true}}));
  if(result.persisted!==true||result.verified!==true)console.warn("Pre-Algebra progress is not verified as persistent; use Export Student ZIP before leaving.");
  return result.persisted===true&&result.verified===true;
}
function uid(){return"s_"+Math.random().toString(36).slice(2,9)+Date.now().toString(36)}
function student(){return state.students.find(s=>s.id===state.activeId)||null}
function ensure(s){
  if(!s.progress)s.progress={weeks:{},exams:{},capstone:{logs:[],score:0,rubric:{}}};
  s.progress.weeks??={};s.progress.exams??={};s.progress.capstone??={logs:[],score:0,rubric:{}};
  s.progress.capstone.logs??=[];s.progress.capstone.rubric??={};
}
function weekRec(s,w){ensure(s);return s.progress.weeks[w]??={lessons:{},assignments:{},notes:{},quiz:{best:0,attempts:[],lastFeedback:[]},work:"",repeats:0}}
function lessonPct(s,w){let r=weekRec(s,w);return Math.round(["Monday","Tuesday","Wednesday","Thursday","Friday"].filter(d=>r.lessons[d]).length/5*100)}
function assignPct(s,w){let r=weekRec(s,w);return Math.round([0,1,2].filter(i=>r.assignments[i]).length/3*100)}
const WEEKLY_MASTERY_VERSION="prealgebra-weekly-mastery-v2";
function validWeeklyMasteryAttempt(a){
  return a&&a.assessment_version===WEEKLY_MASTERY_VERSION&&Number(a.question_count)===10&&
    Array.isArray(a.question_ids)&&a.question_ids.length===10&&new Set(a.question_ids).size===10&&
    Array.isArray(a.dimensions)&&a.dimensions.length===10&&Number.isFinite(Number(a.score));
}
function quizBest(s,w){
  const r=weekRec(s,w),valid=(r.quiz.attempts||[]).filter(validWeeklyMasteryAttempt);
  return valid.length?Math.max(...valid.map(a=>Math.round(Number(a.score)||0))):0;
}
function weekCompletion(s,w){return Math.round(lessonPct(s,w)*.6+assignPct(s,w)*.4)}
function weekScore(s,w){let q=quizBest(s,w);return q||weekCompletion(s,w)}
function average(values){return values.length?values.reduce((a,b)=>a+b,0)/values.length:0}
function weightedMastery(parts){
  const available=parts.filter(p=>p.value!==null&&Number.isFinite(p.value));
  const weight=available.reduce((sum,p)=>sum+p.weight,0);
  return weight?Math.round(available.reduce((sum,p)=>sum+p.value*p.weight,0)/weight):0;
}
function stats(s){
  if(!s)return{lessons:0,assignments:0,quizzes:0,course:0,completion:0,done:0,total:180,needs:[]};
  ensure(s);
  let done=0,assignments=[],quizzes=[],completion=[],needs=[];
  APP.weeks.forEach(w=>{
    let lp=lessonPct(s,w.week),ap=assignPct(s,w.week),qb=quizBest(s,w.week),started=lp||ap||qb;
    done+=Math.round(lp/20);
    if(ap)assignments.push(ap);if(qb||weekRec(s,w.week).quiz.attempts.length)quizzes.push(qb);if(started)completion.push(weekCompletion(s,w.week));
    if((qb&&qb<APP.passingTarget)||(started&&(lp<100||ap<100)))needs.push(w.week);
  });
  const mid=s.progress.exams.midterm?.best||0,fin=s.progress.exams.final?.best||0,cap=s.progress.capstone.score||0;
  const quizAvg=Math.round(average(quizzes));
  return{
    lessons:Math.round(done/180*100),assignments:Math.round(average(assignments)),quizzes:quizAvg,
    completion:Math.round(average(completion)),course:weightedMastery([{value:quizzes.length?quizAvg:null,weight:55},{value:s.progress.exams.midterm?.attempts?.length?Number(mid):null,weight:15},{value:s.progress.exams.final?.attempts?.length?Number(fin):null,weight:20},{value:Object.keys(s.progress.capstone.rubric||{}).length?Number(cap):null,weight:10}]),
    done,total:180,midterm:Math.round(mid),final:Math.round(fin),capstone:Math.round(cap),needs
  };
}
/* Read-only unit evidence. Never blends lesson/unit self-checks into the central 36-week grade. */
function unitEvidenceView(){
 const owner=window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId;
 if(!owner||!window.KhaemenesLearnerScope)return '<div class="card col12"><h3>Individual Unit Evidence</h3><p class="small">Select your Academy learner to view their separately saved unit results. No existing records are changed.</p></div>';
 const parseRecord=key=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch{return null}};
 const rows=Array.from({length:13},(_,i)=>{
   const n=String(i+1).padStart(2,"0");
   const progress=parseRecord("khaemenes-prealgebra-unit"+n+"-progress-v1");
   const check=parseRecord("khaemenes-prealgebra-u"+n+"-mastery-v1");
   const scores=Object.values(progress?.lessonBestScores||progress?.lessonScores||{}).filter(v=>Number.isFinite(Number(v))&&Number(v)>=80).length;
   const attempts=Array.isArray(check?.attempts)?check.attempts:[];
   const values=[check?.best_percent,check?.percent,...attempts.map(a=>a?.percent)].filter(v=>v!==null&&v!==undefined&&Number.isFinite(Number(v))).map(Number);
   const best=values.length?Math.max(...values):null;
   const hasRecord=Boolean(progress||check);
   return {n,scores,best,hasRecord};
 });
 const present=rows.filter(r=>r.hasRecord).length,passed=rows.filter(r=>r.best!==null&&r.best>=80).length;
 return `<div class="card col12"><h3>Individual Unit Evidence · Read Only</h3><p class="small">Academy learner unit records: ${present} of 13 units have locally saved evidence; ${passed} unit mastery self-checks have best scores at or above 80%. These are separate from the 36-week activity record, practice estimate, and any official grade. Missing records are not scored as zero.</p><div class="table-wrap"><table><thead><tr><th>Unit</th><th>Lesson checks ≥80%</th><th>Unit mastery self-check</th></tr></thead><tbody>${rows.map(r=>`<tr><td><a href="units/unit-${r.n}/">Unit ${r.n}</a></td><td>${r.hasRecord?r.scores:"—"}</td><td>${r.best===null?"Not recorded":r.best+"%"}</td></tr>`).join("")}</tbody></table></div><p class="small">Read-only display: no data is migrated, edited, imported or awarded as official mastery.</p></div>`;
}
function readPinnedCourses(){return window.KhaemenesHighCoursePins?.readPins()||[]}
function courseIsPinned(){return readPinnedCourses().includes(PROFILE_COURSE_ID)}
function updatePinButton(){const button=$("pinCourseButton");if(!button)return;const ready=!!window.KhaemenesHighCoursePins;const pinned=ready&&courseIsPinned();button.disabled=!ready;button.setAttribute("aria-pressed",String(pinned));button.textContent=!ready?"Pin unavailable":pinned?"★ Pinned to Profile":"☆ Pin to Profile";button.title=!ready?"Course pin storage is temporarily unavailable":pinned?"Remove Pre-Algebra from the student profile":"Pin Pre-Algebra to the student profile"}
function toggleCoursePin(){const store=window.KhaemenesHighCoursePins;if(!store)return alert("Course pin storage is unavailable; reload the page.");let pinned=readPinnedCourses();const wasPinned=pinned.includes(PROFILE_COURSE_ID);pinned=wasPinned?pinned.filter(id=>id!==PROFILE_COURSE_ID):[PROFILE_COURSE_ID,...pinned.filter(id=>id!==PROFILE_COURSE_ID)];if(!store.writePins(pinned))return alert("This browser could not save the profile pin.");updatePinButton();const status=$("pinCourseStatus");if(status)status.textContent=wasPinned?"Pre-Algebra was removed from the student profile.":"Pre-Algebra was pinned to the student profile."}
function syncAssessmentSurface(){
  const enabled=view==="exams"||(view==="week"&&weeklyMasteryMode);
  const mode=view==="exams"?activeExamName:(weeklyMasteryMode?"weekly":null);
  document.body.classList.toggle("math-assessment-surface",enabled);
  if(enabled&&mode)document.body.dataset.mathAssessmentMode=mode;
  else delete document.body.dataset.mathAssessmentMode;
  window.dispatchEvent(new CustomEvent("khaemenes-math-assessment-mode",{detail:{enabled,mode}}));
}
function render(){
  syncAssessmentSurface();
  renderStudentSelect();renderWeekList();setActiveButtons();updatePinButton();
  ({dashboard,overview,week,scope,tools,games,exams,capstone,reports,standards}[view]||dashboard)();
  window.dispatchEvent(new CustomEvent("khaemenes-prealgebra-rendered",{detail:{view,activeWeek}}));
}function setActiveButtons(){document.querySelectorAll("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===view))}function renderStudentSelect(){$("studentSelect").innerHTML=state.students.map(s=>`<option value="${s.id}" ${s.id===state.activeId?"selected":""}>${esc(s.name)}</option>`).join("")}function renderWeekList(){let s=student();$("weekList").innerHTML=APP.weeks.map(w=>{let qb=s?quizBest(s,w.week):0,tag=qb>=APP.passingTarget?"good":qb?"bad":"";return`<button class="weekBtn ${w.week===activeWeek?"active":""}" data-week="${w.week}"><span><strong>${w.week}</strong> ${esc(w.title)}</span><span class="pill ${tag}">${qb||"—"}</span></button>`}).join("");document.querySelectorAll("[data-week]").forEach(b=>b.onclick=()=>{activeWeek=+b.dataset.week;view="week";weeklyMasteryMode=false;render()})}

function dashboard(){
  let s=student(),st=stats(s),needs=st.needs.length?`Recommended review: Weeks ${st.needs.slice(0,12).join(", ")}${st.needs.length>12?"…":""}`:"No review flags yet.";
  $("content").innerHTML=`<div class="grid">
    <div class="card kpi"><strong>${st.lessons}%</strong><span>Lesson Completion</span></div>
    <div class="card kpi"><strong>${st.assignments||"—"}</strong><span>Assignment Completion</span></div>
    <div class="card kpi"><strong>${st.quizzes||"—"}</strong><span>Weekly Quiz Average</span></div>
    <div class="card kpi"><strong>${st.course||"—"}</strong><span>Practice Score Estimate</span></div>
    <div class="card col8"><h3>Welcome, ${esc(s.name)}</h3>
      <p>The Numerica Forge is an open-age pathway. Learners may begin whenever pre-algebra is the appropriate next step and move through complete unit lessons, guided practice, tools, applications, assessments, corrections, reports, and a mathematical-modelling capstone.</p>
      <div class="progress" aria-label="Lesson completion"><span style="width:${st.lessons}%"></span></div>
      <p class="small">${st.done}/${st.total} planned study sessions complete. Completion and mastery are reported separately.</p>
      <p class="notice">${needs}</p>
      <div class="actions"><button type="button" onclick="view='week';render()">Continue Week ${activeWeek}</button><button class="secondary" type="button" onclick="view='overview';render()">Read Course Guide</button><button class="secondary" type="button" onclick="view='tools';render()">Open Tools</button><a class="button secondary" href="records/learner-archive.html?mode=course">Export Student ZIP</a><button class="ghost" type="button" onclick="downloadBackup()">Export Backup</button></div>
    </div>
    <div class="card col4"><h3>Games &amp; Connected Tools</h3><p>Use the Khaemenes Scientific Calculator, built-in mini-tools, visual pattern games, logic practice, and OHMIC CAD without losing your place in the course.</p><div class="actions"><button class="secondary" type="button" data-launch-title="Khaemenes Scientific Calculator" data-launch-url="../tools/calculator">Open Calculator</button><button class="ghost" type="button" onclick="view='games';render()">Browse Games</button></div></div>
    ${unitEvidenceView()}
    <div class="card col12"><h3>Upcoming Weeks</h3><div class="table-wrap">${scopeTable(APP.weeks.slice(Math.max(0,activeWeek-1),Math.min(APP.weeks.length,activeWeek+5)))}</div></div>
  </div>`;
}
function overview(){
  $("content").innerHTML=`<div class="grid">
    <div class="card col12"><span class="pill">Open age</span><span class="pill">36 weeks</span><span class="pill">Foundation · Core · Extended</span><h3>How to Use This Course</h3><p>This is a level-based course rather than a grade-based course. It is appropriate for any learner who needs a complete bridge from arithmetic and proportional reasoning into Algebra I.</p><div class="notice"><strong>Placement principle:</strong> begin with the diagnostic, use its evidence to choose Foundation, Core, or Extended support, and advance by demonstrated mastery rather than age.</div></div>
    <div class="card col6"><h3>Learning Cycle</h3><ol><li>Open the complete unit page and lesson sequence.</li><li>Study concept development and worked examples.</li><li>Complete practice while showing reasoning and units.</li><li>Use a tool to explore or verify—not replace—the mathematics.</li><li>Analyze errors, revise work, and retake for mastery.</li><li>Save a reflection or portfolio sample.</li></ol></div>
    <div class="card col6"><h3>Evidence of Learning</h3><p><strong>Completion</strong> tracks lesson and assignment participation. The <strong>practice score estimate</strong> summarizes attempted quizzes, public self-check examinations, and capstone rubric entries; a zero-score attempt counts. It is not an independently authenticated official grade or approval of mastery.</p><p>Best scores are retained, but every attempt remains in the local record so growth is visible.</p></div>
    <div class="card col4"><h3>Foundation</h3><p>Concrete models, smaller steps, vocabulary support, worked examples, and additional practice.</p></div>
    <div class="card col4"><h3>Core</h3><p>The full pre-algebra pathway with conceptual understanding, fluency, application, and explanation.</p></div>
    <div class="card col4"><h3>Extended</h3><p>Proof, generalization, unfamiliar contexts, deeper modelling, and early Algebra I connections.</p></div>
    <div class="card col12"><h3>Course Exit Evidence</h3><p>A learner is ready to move into Algebra I after completing the full scope, earning sustained mastery on equations, proportional relationships, functions, graphs, and number operations, passing cumulative assessments, and defending a capstone model with correct reasoning and stated limitations.</p><div class="actions"><a class="button" href="diagnostic/">Begin Diagnostic</a><button class="secondary" type="button" onclick="view='scope';render()">View Full Scope</button></div></div>
  </div>`;
}

function unitHref(w){return w.path||"#"}
function lessonsHTML(w,r){
  let days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
  let titles=["Complete Unit Lesson & Vocabulary","Worked Examples & Guided Practice","Tool, Model, or Representation Lab","Application, Error Analysis & Revision","Mastery Check, Corrections & Portfolio"];
  let objectives=[
    `Open the complete unit page and study the lesson sequence connected to ${esc(w.title)}.`,
    "Solve representative problems accurately and explain why each step is valid.",
    "Use a table, graph, number line, diagram, manipulative, or calculator to investigate and verify.",
    "Apply the mathematics in context, preserve units, and correct at least one misconception.",
    "Demonstrate mastery, complete corrections, and decide whether to advance or repeat."
  ];
  let activities=[
    `Use the full unit page for instruction, definitions, worked examples, pathway support, and lesson practice.`,
    "Complete written practice before checking answers. Compare at least two strategies when possible.",
    "Record what the representation reveals, what assumptions it makes, and what it cannot establish by itself.",
    "Solve contextual problems, justify reasonableness, and rewrite one incorrect solution as a correct explanation.",
    "Take the weekly check, review feedback, complete corrections, and save a strong work sample."
  ];
  return days.map((d,i)=>`<div class="lesson"><div class="lessonHead"><div><h4>${d}: ${titles[i]}</h4><p><strong>Objective:</strong> ${objectives[i]}</p></div><label class="check"><input id="l_${d}" type="checkbox" ${r.lessons[d]?"checked":""}> Done</label></div><p>${activities[i]}</p>${i===0?`<div class="actions"><a class="button" href="${esc(unitHref(w))}">Open Complete ${w.unitNumber===0?"Diagnostic":"Unit"}</a></div>`:""}<label for="n_${d}">Notes, reasoning, or correction record</label><textarea id="n_${d}">${esc(r.notes[d]||"")}</textarea></div>`).join("");
}

function weeklyMasterySummary(w,r){
  const official=quizBest(student(),w.week),valid=(r.quiz.attempts||[]).filter(validWeeklyMasteryAttempt),draft=r.quiz.draft;
  const stateLabel=draft?"Resume current draft":"Start mastery check";
  return`<div class="unit-link-card weekly-mastery-launch"><h3>Weekly Mastery Check</h3><p class="section-note">10 questions · 2 in each reasoning dimension · mastery target ${APP.passingTarget}%. Open the check in the dedicated one-column assessment workspace.</p><p><strong>Official v2 best:</strong> ${official?official+"%":"—"} · <strong>Valid attempts:</strong> ${valid.length}</p><div class="actions"><button type="button" onclick="startWeeklyMastery()">${stateLabel}</button></div></div>`;
}
function startWeeklyMastery(){weeklyMasteryMode=true;syncAssessmentSurface();render()}
function closeWeeklyMastery(){weeklyMasteryMode=false;syncAssessmentSurface();render()}
function week(){
  let s=student(),w=APP.weeks.find(x=>x.week===activeWeek),r=weekRec(s,w.week),qb=quizBest(s,w.week),completion=weekCompletion(s,w.week);
  if(weeklyMasteryMode){weeklyMasteryAssessment(w,r);return}
  $("content").innerHTML=`<div class="card"><span class="pill">Week ${w.week}</span><span class="pill">Unit ${w.unitNumber}</span><span class="pill">${esc(w.domain)}</span><h3>${esc(w.title)}</h3><p><strong>Unit:</strong> ${esc(w.unitTitle)}</p><p><strong>Big Idea:</strong> ${esc(w.bigIdea)}</p><p>${w.tags.map(x=>`<span class="pill">${esc(x)}</span>`).join("")}</p><div class="progress" aria-label="Weekly completion"><span style="width:${completion}%"></span></div><p class="small">${lessonPct(s,w.week)}% lesson plan · ${assignPct(s,w.week)}% assignments · ${qb||0}% quiz mastery · ${completion}% completion</p>${qb&&qb<APP.passingTarget?`<p class="notice">Below ${APP.passingTarget}% mastery. Review the complete unit lesson, correct errors, and retake. The best score and attempt history are preserved.</p>`:""}<div class="unit-link-card"><strong>Complete instruction lives in the unit.</strong><p class="section-note">The full unit page connects the actual lessons, worked examples, pathway support, practice, projects, and assessments. The planner below helps organize the week; it does not replace those lessons.</p><div class="actions"><a class="button" href="${esc(unitHref(w))}">Open Full ${w.unitNumber===0?"Diagnostic":"Unit"}</a><a class="button secondary" target="_blank" rel="noopener" href="${APP.tools[0].url}">Scientific Calculator</a></div></div><div class="actions"><button class="secondary" type="button" onclick="weeklyMasteryMode=false;activeWeek=Math.max(1,activeWeek-1);render()">← Previous</button><button class="secondary" type="button" onclick="weeklyMasteryMode=false;activeWeek=Math.min(APP.weeks.length,activeWeek+1);render()">Next →</button><button class="ghost" type="button" onclick="repeatWeek()">Log a Review Cycle</button></div></div><div class="grid"><div class="card col8"><h3>Weekly Study Planner</h3><p class="section-note">Use these five sessions flexibly. A learner may combine or repeat sessions based on diagnostic evidence and mastery.</p>${lessonsHTML(w,r)}</div><div class="card col4"><h3>Assignments</h3>${[["Practice & Corrections",20,"Complete the linked unit practice with written work, checking, and corrections."],["Tool / Model Lab",20,"Use a calculator, graph, table, number line, diagram, or model to investigate and explain."],["Application & Reflection",30,"Solve contextual problems with units, judge reasonableness, and reflect on readiness."]].map((a,i)=>`<div class="assignment"><label class="check"><input id="a_${i}" type="checkbox" ${r.assignments[i]?"checked":""}> Complete</label><h4>${a[0]}</h4><p>${a[2]}</p><p class="small">Suggested evidence: ${a[1]} points</p></div>`).join("")}${weeklyMasterySummary(w,r)}<h3>Work Space</h3><label for="work">Calculations, explanations, questions, or correction notes</label><textarea id="work">${esc(r.work||"")}</textarea></div></div>`;
  ["Monday","Tuesday","Wednesday","Thursday","Friday"].forEach(d=>{$(`l_${d}`).onchange=e=>{r.lessons[d]=e.target.checked;save();render()};$(`n_${d}`).oninput=e=>{r.notes[d]=e.target.value;save()}});
  [0,1,2].forEach(i=>$(`a_${i}`).onchange=e=>{r.assignments[i]=e.target.checked;save();render()});
  $("work").oninput=e=>{r.work=e.target.value;save()};
}

function shuffle(items){
  const a=items.slice();
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
function prepareQuestion(q){
  const mixed=shuffle(q[1].map((text,original)=>({text,original})));
  return{prompt:q[0],choices:mixed.map(x=>x.text),answer:mixed.findIndex(x=>x.original===q[2]),id:q[3]||null,dimension:q[4]||null,retrievalFromWeek:q[5]??null};
}
function ensureWeeklyQuizDraft(w,r){
  const sourceIds=w.quiz.map(q=>q[3]).filter(Boolean);
  const prior=r.quiz.draft;
  const valid=prior&&prior.schema==="prealgebra-weekly-mastery-draft-v1"&&prior.assessmentVersion===WEEKLY_MASTERY_VERSION&&prior.week===w.week&&Array.isArray(prior.questions)&&prior.questions.length===10&&
    prior.questions.every(q=>q?.id)&&sourceIds.length===10&&prior.questions.every(q=>sourceIds.includes(q.id));
  if(valid){
    prior.answers??={};prior.work??={};activeQuiz=prior.questions;return prior;
  }
  const questions=w.quiz.map(prepareQuestion);
  const draft={schema:"prealgebra-weekly-mastery-draft-v1",assessmentVersion:WEEKLY_MASTERY_VERSION,week:w.week,createdAt:new Date().toISOString(),questions,answers:{},work:{}};
  r.quiz.draft=draft;activeQuiz=questions;
  if(!save())console.warn("Pre-Algebra weekly mastery draft could not be verified as persistent.");
  return draft;
}
function recordWeeklyAnswer(index,value){
  const w=APP.weeks.find(x=>x.week===activeWeek),r=weekRec(student(),w.week),draft=ensureWeeklyQuizDraft(w,r);
  draft.answers[String(index)]=Number(value);
  const ok=save(),status=document.getElementById("weeklyMasteryDraftStatus");
  if(status)status.textContent=ok?"Answer saved and verified.":"Answer is retained on this page, but browser storage could not be verified.";
}
function recordWeeklyWork(index,value,persistNow=false){
  const w=APP.weeks.find(x=>x.week===activeWeek),r=weekRec(student(),w.week),draft=ensureWeeklyQuizDraft(w,r);
  draft.work[String(index)]=String(value??"");
  if(!persistNow)return;
  const ok=save(),status=document.getElementById("weeklyMasteryDraftStatus");
  if(status)status.textContent=ok?"Problem-solving work saved and verified.":"Problem-solving work is retained on this page, but browser storage could not be verified.";
}
function clearWeeklyMasteryDraft(){
  const w=APP.weeks.find(x=>x.week===activeWeek),r=weekRec(student(),w.week);
  if(!confirm("Clear this Week "+w.week+" mastery-check draft? Submitted attempt history will be preserved."))return;
  const prior=r.quiz.draft;r.quiz.draft=null;activeQuiz=[];
  if(!save()){r.quiz.draft=prior;activeQuiz=prior?.questions||[];return alert("The draft reset could not be verified, so the current draft was kept.");}
  weeklyMasteryAssessment(w,r);
}
function quizForm(w,r){
  const draft=ensureWeeklyQuizDraft(w,r),s=student(),official=quizBest(s,w.week),valid=(r.quiz.attempts||[]).filter(validWeeklyMasteryAttempt),legacy=(r.quiz.attempts||[]).length-valid.length;
  const feedback=(r.quiz.lastFeedback||[]).length?`<div class="feedback-list"><strong>Last-attempt review</strong><ul>${r.quiz.lastFeedback.map(f=>`<li>${esc(f)}</li>`).join("")}</ul></div>`:"";
  const blueprint=w.week===1?"10 current-focus questions":"8 current-focus + 2 delayed-retrieval questions";
  return`<p class="notice"><strong>Canonical weekly mastery v2:</strong> 10 questions · 2 in each reasoning dimension · ${blueprint}. Legacy five-question attempts remain history only.</p><p class="score">Official v2 best: ${official||"—"}%</p><p class="small">${valid.length?`Valid v2 attempts: ${valid.map(a=>Math.round(a.score)+"%").join(" | ")}`:"No canonical v2 attempts yet."}${legacy? ` · Legacy attempts preserved: ${legacy}`:""}</p><p id="weeklyMasteryDraftStatus" class="small" role="status" aria-live="polite">Draft started ${new Date(draft.createdAt).toLocaleString()} · selections and work remain stable until submitted or cleared.</p><form onsubmit="return false">${activeQuiz.map((q,i)=>`<fieldset class="q"><legend><strong>${i+1}. ${esc(q.prompt)}</strong></legend>${q.retrievalFromWeek?`<p class="small">Retrieval bridge · Week ${q.retrievalFromWeek}</p>`:""}${q.choices.map((choice,j)=>`<label class="choice"><input type="radio" name="q${i}" value="${j}" ${Number(draft.answers[String(i)])===j?"checked":""} onchange="recordWeeklyAnswer(${i},this.value)"> ${esc(choice)}</label>`).join("")}<label class="math-work-label" for="weekly_work_${i}">Show your work · ungraded workspace</label><textarea class="math-workspace" id="weekly_work_${i}" oninput="recordWeeklyWork(${i},this.value,false)" onchange="recordWeeklyWork(${i},this.value,true)" placeholder="Use this space for calculations, representations, checks, or reasoning…">${esc(draft.work[String(i)]||"")}</textarea></fieldset>`).join("")}<div class="actions"><button type="button" onclick="submitQuiz()">Submit Mastery Check</button><button class="secondary" type="button" onclick="clearWeeklyMasteryDraft()">Clear Draft</button><button class="ghost" type="button" onclick="closeWeeklyMastery()">Return to Weekly Planner</button></div></form>${feedback}`;
}
function weeklyMasteryAssessment(w,r){
  const objective=w.week===1?"Demonstrate current readiness across the week’s five reasoning dimensions.":"Demonstrate current-week mastery while retrieving earlier mathematics and explaining reasoning.";
  $("content").innerHTML=`<div class="grid"><div class="card col12" id="assessmentWorkspace" tabindex="-1"><p class="eyebrow">Week ${w.week} · Pre-Algebra Mastery</p><h3>${esc(w.title)}</h3><p class="section-note">${esc(objective)}</p><div class="notice"><strong>Directions:</strong> Complete all 10 questions. Use the large workspace beneath each problem for calculations, representations, checks, or corrections. A score of ${APP.passingTarget}% or higher meets the weekly mastery target.</div>${quizForm(w,r)}</div></div>`;
}

function scope(){ $("content").innerHTML=`<div class="card"><h3>36-Week Scope & Sequence</h3><p class="section-note">Every row opens the corresponding complete unit or diagnostic page.</p><div class="actions"><button type="button" onclick="downloadScope()">Download Scope CSV</button></div><div class="table-wrap">${scopeTable(APP.weeks)}</div></div>`}
function scopeTable(list){return`<table><tr><th>Week</th><th>Unit</th><th>Focus</th><th>Open</th><th>Framework Tags</th></tr>${list.map(w=>`<tr><td>${w.week}</td><td>${esc(w.unitTitle)}</td><td>${esc(w.title)}</td><td><a class="button secondary" href="${esc(unitHref(w))}">Open</a></td><td>${w.tags.map(t=>`<span class="pill">${esc(t)}</span>`).join("")}</td></tr>`).join("")}</table>`}

function tools(){ $("content").innerHTML=`<div class="grid"><div class="card col12"><h3>Math Tool Dock</h3><p>Use tools to explore, represent, and verify. A tool result is evidence only when the learner can explain the inputs, method, units, assumptions, and reasonableness.</p><div class="actions"><button type="button" data-launch-title="Khaemenes Scientific Calculator" data-launch-url="../tools/calculator">Open Scientific Calculator Here</button><button class="secondary" type="button" data-launch-title="OHMIC CAD Studio" data-launch-url="https://vervenveda.com/proresource_hub.github.io/Protools/Ohmic_CAD_Studio.html">Open OHMIC CAD</button><button class="ghost" type="button" onclick="view='games';render()">Browse Math Games</button></div></div><div class="card col12"><div class="toolGrid">${toolHTML()}</div></div><div class="card col12"><h3>Tool Inventory</h3><div class="table-wrap"><table><tr><th>Tool</th><th>Type</th><th>Use</th></tr>${APP.tools.map(t=>`<tr><td>${esc(t.name)}</td><td>${esc(t.kind)}</td><td>${esc(t.description)}</td></tr>`).join("")}</table></div></div></div>`}

function games(){
  const activities=[
    ["Pattern Pirates","⋯","Sequence recognition, number patterns, and flexible reasoning.","https://vervenveda.com/arcade.github.io/games/kids/Pattern_Pirates_index.html"],
    ["Jenny’s Sudoku","#","Logic, constraints, deduction, and strategic persistence.","https://vervenveda.com/arcade.github.io/Jenny%27s_Sudoku_index.html"],
    ["Six by Six","6×6","Compact number logic and pattern practice.","https://vervenveda.com/arcade.github.io/SixbySix_index.html"],
    ["Sacred Geometry","◇","Symmetry, proportion, visual structure, and geometric relationships.","https://vervenveda.com/arcade.github.io/a_sacred_geometry_game_index.html"],
    ["Mandala Rings","◎","Rotational reasoning, pattern recognition, and spatial focus.","https://vervenveda.com/arcade.github.io/a_mandala_rings_game_index.html"],
    ["Scientific Calculator","∑","Degree and radian modes, functions, constants, history, and keyboard support.","../tools/calculator"],
    ["OHMIC CAD Studio","⌑","Scale, measurement, coordinates, dimensions, and design thinking.","https://vervenveda.com/proresource_hub.github.io/Protools/Ohmic_CAD_Studio.html"],
    ["Verve N Veda Arcade","A","Open the complete internal Arcade collection in the activity window.","https://vervenveda.com/arcade.github.io/"]
  ];
  $("content").innerHTML=`<div class="grid"><div class="card col12"><h3>Math Games &amp; Learning Tools</h3><p>Choose a focused activity. It opens in a large in-page window so learner records and the current Pre-Algebra view remain in place.</p><p class="notice">Games support practice and visualization; they do not replace written reasoning, lessons, or mastery evidence.</p><div class="games-launch-grid">${activities.map(([title,symbol,description,url])=>`<button class="activity-card" type="button" data-launch-title="${esc(title)}" data-launch-url="${esc(url)}"><span class="activity-symbol">${esc(symbol)}</span><strong>${esc(title)}</strong><small>${esc(description)}</small><em>Launch activity</em></button>`).join("")}</div></div></div>`;
}

function toolHTML(){return `<div class="toolBox"><h4>Fraction Lab</h4><label for="fracN">Integer numerator</label><input id="fracN" type="number" step="1" value="18"><label for="fracD">Nonzero integer denominator</label><input id="fracD" type="number" step="1" value="24"><button type="button" onclick="fractionTool()">Reduce</button><div class="toolResult" role="status" aria-live="polite" id="fracOut"></div></div><div class="toolBox"><h4>Proportion Solver</h4><p class="small">Solve a/b = c/x</p><label for="pa">a</label><input id="pa" type="number" value="3"><label for="pb">b</label><input id="pb" type="number" value="5"><label for="pc">c</label><input id="pc" type="number" value="12"><button type="button" onclick="proportionTool()">Solve x</button><div class="toolResult" role="status" aria-live="polite" id="propOut"></div></div><div class="toolBox"><h4>Percent Lab</h4><label for="perP">Percent</label><input id="perP" type="number" value="20"><label for="perQ">Quantity</label><input id="perQ" type="number" value="80"><label for="oldVal">Original value</label><input id="oldVal" type="number" value="30"><label for="newVal">New value</label><input id="newVal" type="number" value="36"><button type="button" onclick="percentTool()">Calculate</button><div class="toolResult" role="status" aria-live="polite" id="percentOut"></div></div><div class="toolBox"><h4>Equation Checker</h4><p class="small">Check whether x solves ax + b = c</p><label for="eqA">a</label><input id="eqA" type="number" value="2"><label for="eqB">b</label><input id="eqB" type="number" value="5"><label for="eqC">c</label><input id="eqC" type="number" value="13"><label for="eqX">Proposed x</label><input id="eqX" type="number" value="4"><button type="button" onclick="equationTool()">Check</button><div class="toolResult" role="status" aria-live="polite" id="eqOut"></div></div><div class="toolBox"><h4>Slope Finder</h4><label for="x1">x₁</label><input id="x1" type="number" value="1"><label for="y1">y₁</label><input id="y1" type="number" value="2"><label for="x2">x₂</label><input id="x2" type="number" value="5"><label for="y2">y₂</label><input id="y2" type="number" value="10"><button type="button" onclick="slopeTool()">Find Slope</button><div class="toolResult" role="status" aria-live="polite" id="slopeOut"></div></div><div class="toolBox"><h4>Geometry Lab</h4><label for="geoL">Length / first right-triangle leg</label><input id="geoL" type="number" min="0" value="8"><label for="geoW">Width / second right-triangle leg</label><input id="geoW" type="number" min="0" value="5"><label for="geoH">Prism height</label><input id="geoH" type="number" min="0" value="3"><button type="button" onclick="geometryTool()">Calculate</button><div class="toolResult" role="status" aria-live="polite" id="geoOut"></div></div><div class="toolBox"><h4>Data Lab</h4><label for="dataSet">Comma-separated data</label><input id="dataSet" value="2, 4, 6, 8, 10"><button type="button" onclick="dataTool()">Analyze</button><div class="toolResult" role="status" aria-live="polite" id="dataOut"></div></div><div class="toolBox"><h4>Scientific Notation</h4><label for="sciNum">Number</label><input id="sciNum" type="number" value="320000"><button type="button" onclick="sciTool()">Convert</button><div class="toolResult" role="status" aria-live="polite" id="sciOut"></div></div>`}

function makeExam(domains){
  let arr=[];
  domains.forEach(d=>shuffle(APP.quizBank[d]).slice(0,4).forEach(q=>{const p=prepareQuestion(q);arr.push({skill:d,title:p.prompt,choices:p.choices,answer:p.answer})}));
  return arr;
}
function examRecord(name){
  let s=student();ensure(s);
  s.progress.exams[name]??={best:0,attempts:[]};
  s.progress.exams[name].attempts??=[];
  return s.progress.exams[name];
}
function ensureExamDraft(name){
  const rec=examRecord(name),domains=name==="midterm"?APP.midtermDomains:APP.finalDomains,expected=domains.length*4;
  if(rec.draft&&Array.isArray(rec.draft.questions)&&rec.draft.questions.length===expected){
    activeExams[name]=rec.draft.questions;
    rec.draft.answers??={};
    rec.draft.work??={};
    return rec.draft;
  }
  const questions=makeExam(domains);
  rec.draft={schema:"khae-prealgebra-cumulative-draft-v1",createdAt:new Date().toISOString(),questions,answers:{},work:{}};
  activeExams[name]=questions;
  if(!save())console.warn("Pre-Algebra cumulative draft could not be verified as persistent.");
  return rec.draft;
}
function selectExam(name){
  if(!["midterm","final"].includes(name))return;
  activeExamName=name;
  syncAssessmentSurface();
  exams();
  document.getElementById("assessmentWorkspace")?.focus({preventScroll:true});
}
function recordExamAnswer(name,index,value){
  const draft=ensureExamDraft(name);
  draft.answers[String(index)]=Number(value);
  const ok=save(),status=document.getElementById("assessmentDraftStatus");
  if(status)status.textContent=ok?"Answer saved.":"Answer is retained on this page, but browser storage could not be verified.";
}
function recordExamWork(name,index,value,persistNow=false){
  const draft=ensureExamDraft(name);
  draft.work[String(index)]=String(value??"");
  if(!persistNow)return;
  const ok=save(),status=document.getElementById("assessmentDraftStatus");
  if(status)status.textContent=ok?"Problem-solving work saved.":"Problem-solving work is retained on this page, but browser storage could not be verified.";
}
function clearExamDraft(name){
  if(!confirm("Clear the current "+name+" draft? Previous submitted attempts will be preserved."))return;
  const rec=examRecord(name),priorDraft=rec.draft,priorActive=activeExams[name];
  rec.draft=null;activeExams[name]=[];
  if(!save()){rec.draft=priorDraft;activeExams[name]=priorActive;return alert("The draft reset could not be verified, so the current draft was kept.");}
  exams();
}
function exams(){
  let s=student();ensure(s);
  const name=activeExamName,mid=examRecord("midterm"),fin=examRecord("final"),draft=ensureExamDraft(name),qs=draft.questions;
  const label=name==="midterm"?"Midterm":"Final Examination";
  const best=Math.round(examRecord(name).best||0)||"—";
  $("content").innerHTML=`<div class="grid"><div class="card col12" id="assessmentWorkspace" tabindex="-1">
    <p class="eyebrow">Cumulative Assessment Center</p>
    <h3>${label}</h3>
    <p class="section-note">Work on one assessment at a time. Your current randomized form and selections are preserved as a local draft until you submit or deliberately clear it.</p>
    <div class="tabs" role="tablist" aria-label="Choose cumulative assessment">
      <button class="tab ${name==="midterm"?"active":""}" type="button" onclick="selectExam('midterm')" aria-selected="${name==="midterm"}">Midterm · 28 Questions · Best ${Math.round(mid.best||0)||"—"}%</button>
      <button class="tab ${name==="final"?"active":""}" type="button" onclick="selectExam('final')" aria-selected="${name==="final"}">Final · 52 Questions · Best ${Math.round(fin.best||0)||"—"}%</button>
    </div>
    <div class="notice"><strong>Current assessment:</strong> ${label} · ${qs.length} questions · mastery target ${APP.passingTarget}%. Question order remains stable for this draft.</div>
    <p id="assessmentDraftStatus" class="small" role="status" aria-live="polite">Draft started ${new Date(draft.createdAt).toLocaleString()} · Best recorded score: ${best}%.</p>
    ${examForm(name,qs,draft.answers||{},draft.work||{})}
  </div></div>`;
}
function examForm(name,qs,answers={},work={}){
  const blocks=[];
  for(let start=0;start<qs.length;start+=10){
    const slice=qs.slice(start,start+10),end=start+slice.length;
    blocks.push(`<section class="panel"><h4>Questions ${start+1}–${end} of ${qs.length}</h4><div class="question-list">${slice.map((q,offset)=>{const i=start+offset;return`<fieldset class="q"><legend><strong>${i+1}. ${esc(q.skill)}: ${esc(q.title)}</strong></legend>${q.choices.map((c,j)=>`<label class="choice"><input type="radio" name="${name}_${i}" value="${j}" ${Number(answers[String(i)])===j?"checked":""} onchange="recordExamAnswer('${name}',${i},this.value)"> ${esc(c)}</label>`).join("")}<label class="math-work-label" for="${name}_work_${i}">Show your work · ungraded workspace</label><textarea class="math-workspace" id="${name}_work_${i}" oninput="recordExamWork('${name}',${i},this.value,false)" onchange="recordExamWork('${name}',${i},this.value,true)" placeholder="Use this space for calculations, graphs, checks, or reasoning…">${esc(work[String(i)]||"")}</textarea></fieldset>`}).join("")}</div></section>`);
  }
  return`<form onsubmit="return false">${blocks.join("")}<div class="actions"><button type="button" onclick="submitExam('${name}')">Submit ${name==="midterm"?"Midterm":"Final"}</button><button class="secondary" type="button" onclick="clearExamDraft('${name}')">Clear Draft</button><button class="ghost" type="button" onclick="window.print()">Print Current Form</button></div></form>`;
}

function capstone(){
  let s=student();ensure(s);const rubric=s.progress.capstone.rubric;
  const criteria=[["question",20,"Question, variables, and purpose"],["evidence",20,"Data, measurement, or evidence quality"],["model",25,"Representation and mathematical model"],["accuracy",20,"Calculations, verification, and reasonableness"],["communication",15,"Assumptions, limitations, conclusion, and defense"]];
  $("content").innerHTML=`<div class="grid"><div class="card col7"><h3>Mathematical Modelling Capstone</h3><p>Define a personal, scientific, environmental, financial, or civic question. Select variables and representations, calculate carefully, explain assumptions and limitations, and show readiness for the next mathematics course.</p><ol><li>Question and variables</li><li>Data or measurement plan</li><li>Model: table, graph, equation, diagram, or calculation chain</li><li>Solution and reasonableness check</li><li>Limitations and assumptions</li><li>Presentation and readiness reflection</li></ol><h4>Analytic Rubric</h4><div class="rubric-grid">${criteria.map(([id,max,label])=>`<div class="rubric-item"><label for="rub_${id}">${label} — ${max} points</label><input id="rub_${id}" data-rubric="${id}" data-max="${max}" type="number" min="0" max="${max}" step="1" value="${esc(rubric[id]??0)}"></div>`).join("")}</div><p class="score">Capstone score: <span id="capScoreDisplay">${esc(s.progress.capstone.score||0)}</span>/100</p><button type="button" onclick="downloadCapstoneGuide()">Download Capstone Guide</button></div><div class="card col5"><h3>Capstone Log</h3><label for="capStage">Stage</label><select id="capStage"><option>Question</option><option>Data</option><option>Model</option><option>Calculation</option><option>Limitations</option><option>Presentation</option><option>Reflection</option></select><label for="capNote">Evidence or next step</label><textarea id="capNote"></textarea><button type="button" onclick="addCapstone()">Save Log</button>${capstoneTable(s)}</div></div>`;
  document.querySelectorAll("[data-rubric]").forEach(input=>input.oninput=e=>{const max=Number(e.target.dataset.max),value=Math.max(0,Math.min(max,Number(e.target.value||0)));e.target.value=value;rubric[e.target.dataset.rubric]=value;s.progress.capstone.score=Object.values(rubric).reduce((sum,n)=>sum+Number(n||0),0);$("capScoreDisplay").textContent=s.progress.capstone.score;save()});
}
function capstoneTable(s){return(s.progress.capstone.logs||[]).length?`<div class="table-wrap"><table><tr><th>Date</th><th>Stage</th><th>Note</th></tr>${s.progress.capstone.logs.slice().reverse().map(l=>`<tr><td>${new Date(l.date).toLocaleDateString()}</td><td>${esc(l.stage)}</td><td>${esc(l.note)}</td></tr>`).join("")}</table></div>`:`<p class="small">No capstone logs yet.</p>`}

function reports(){let s=student(),st=stats(s);$("content").innerHTML=`<div class="grid"><div class="card kpi"><strong>${st.course||"—"}%</strong><span>Practice Score Estimate</span></div><div class="card kpi"><strong>${st.lessons}%</strong><span>Lesson Completion</span></div><div class="card kpi"><strong>${st.midterm||"—"}</strong><span>Midterm</span></div><div class="card kpi"><strong>${st.final||"—"}</strong><span>Final</span></div><div class="card col12"><span class="pill">Course Records Office</span><h3>A+++ Reports & Administrative Records</h3><p class="section-note">The Academy Family Learning Center is the parent-facing front door. This course Records Office supplies its detailed Pre-Algebra progress, mastery, activity, portfolio, and completion evidence.</p><div class="actions"><a class="button" href="records/">Open Pre-Algebra Records</a><a class="button secondary" href="https://vervenveda.com/Khaemenes_Academy.github.io/family/">Open Family Learning Center</a><a class="button secondary" href="records/course-completion-certificate.html">Course Certificate</a><a class="button secondary" href="records/learner-archive.html?mode=course">Export Student ZIP &amp; Printable Report</a><button class="ghost" type="button" onclick="downloadBackup()">Export Full JSON Backup</button><label class="button secondary">Import JSON Backup <input type="file" accept=".json,application/json" style="display:none" onchange="importBackup(event)"></label></div></div>${unitEvidenceView()}<div class="card col12"><h3>Current Weekly Evidence</h3><div class="table-wrap">${progressTable(s)}</div></div></div>`}
function progressTable(s){return`<table><tr><th>Week</th><th>Focus</th><th>Lesson Plan</th><th>Assignments</th><th>Quiz Mastery</th><th>Attempts</th><th>Review Cycles</th></tr>${APP.weeks.map(w=>{let r=weekRec(s,w.week);return`<tr><td>${w.week}</td><td><a href="${esc(unitHref(w))}">${esc(w.title)}</a></td><td>${lessonPct(s,w.week)}%</td><td>${assignPct(s,w.week)}%</td><td>${quizBest(s,w.week)||"—"}</td><td>${r.quiz.attempts.length}</td><td>${r.repeats||0}</td></tr>`}).join("")}</table>`}

function standards(){
  let coverage={};APP.weeks.forEach(w=>w.tags.forEach(t=>{coverage[t]??=[];coverage[t].push(w.week)}));
  $("content").innerHTML=`<div class="grid"><div class="card col12"><h3>Repository Sources & Standards Evidence</h3><p>This portal follows the repository course map and connects to the complete unit architecture. Framework tags are useful crosswalk evidence, but they are not a substitute for a jurisdiction-specific adoption review or transcript decision.</p></div><div class="card col6"><h3>Sources</h3><ul>${APP.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a><br><span class="small">${esc(s.note)}</span></li>`).join("")}</ul></div><div class="card col6"><h3>Architecture Notes</h3><ul><li>Open-age, level-based course identity.</li><li>Complete unit pages are linked from every week and scope row.</li><li>Completion and mastery are reported separately.</li><li>Answer positions are randomized for portal quizzes and exams.</li><li>Retakes preserve best score and attempt history.</li><li>Local records support JSON, CSV, HTML, and print exports.</li><li>Built-in tools validate inputs and do not replace written reasoning.</li></ul></div><div class="card col12"><h3>Framework Coverage</h3><div class="table-wrap"><table><tr><th>Tag</th><th>Weeks</th></tr>${Object.entries(coverage).sort().map(([tag,weeks])=>`<tr><td>${esc(tag)}</td><td>${weeks.join(", ")}</td></tr>`).join("")}</table></div></div></div>`;
}

function num(id){const raw=$(id).value.trim();return raw===""?NaN:Number(raw)}
function need(values,out,message="Enter a valid number in every field."){if(values.some(v=>!Number.isFinite(v))){$(out).textContent=message;return false}return true}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a||1}
function fractionTool(){let n=num("fracN"),d=num("fracD");if(!need([n,d],"fracOut"))return;if(!Number.isInteger(n)||!Number.isInteger(d))return $("fracOut").textContent="Fraction reduction requires integer numerator and denominator.";if(d===0)return $("fracOut").textContent="The denominator cannot be 0.";if(d<0){n=-n;d=-d}let g=gcd(n,d);$("fracOut").textContent=`${n}/${d} = ${n/g}/${d/g}; decimal ≈ ${(n/d).toFixed(6)}`}
function proportionTool(){let a=num("pa"),b=num("pb"),c=num("pc");if(!need([a,b,c],"propOut"))return;if(a===0)return $("propOut").textContent="a cannot be 0 because it is a denominator.";let x=b*c/a;$("propOut").textContent=`x = (b×c)/a = (${b}×${c})/${a} = ${x}`}
function percentTool(){let p=num("perP"),q=num("perQ"),oldv=num("oldVal"),newv=num("newVal");if(!need([p,q,oldv,newv],"percentOut"))return;let part=p/100*q,change=oldv!==0?((newv-oldv)/oldv*100):NaN;$("percentOut").textContent=`${p}% of ${q} = ${part}. Percent change ${oldv} → ${newv}: ${Number.isFinite(change)?change.toFixed(2)+"%":"undefined because the original value is 0"}.`}
function equationTool(){let a=num("eqA"),b=num("eqB"),c=num("eqC"),x=num("eqX");if(!need([a,b,c,x],"eqOut"))return;let left=a*x+b;$("eqOut").textContent=`Left side = ${a}(${x}) + ${b} = ${left}. ${Math.abs(left-c)<1e-9?"Yes, x is a solution.":"No; the left side does not equal "+c+"."}`}
function slopeTool(){let x1=num("x1"),y1=num("y1"),x2=num("x2"),y2=num("y2");if(!need([x1,y1,x2,y2],"slopeOut"))return;if(x2===x1)return $("slopeOut").textContent="Undefined slope: the x-values are equal, so the run is 0.";$("slopeOut").textContent=`m = (${y2}−${y1})/(${x2}−${x1}) = ${(y2-y1)/(x2-x1)}`}
function geometryTool(){let l=num("geoL"),w=num("geoW"),h=num("geoH");if(!need([l,w,h],"geoOut"))return;if([l,w,h].some(v=>v<0))return $("geoOut").textContent="Lengths cannot be negative.";$("geoOut").textContent=`Rectangle area = ${l*w}; perimeter = ${2*l+2*w}; rectangular-prism volume = ${l*w*h}; right-triangle hypotenuse from legs ${l} and ${w} ≈ ${Math.hypot(l,w).toFixed(4)}.`}
function dataTool(){let tokens=$("dataSet").value.split(",").map(x=>x.trim()).filter(Boolean),arr=tokens.map(Number);if(!tokens.length||arr.some(x=>!Number.isFinite(x)))return $("dataOut").textContent="Enter a comma-separated list containing only valid numbers.";arr.sort((a,b)=>a-b);let mean=arr.reduce((a,b)=>a+b,0)/arr.length,med=arr.length%2?arr[(arr.length-1)/2]:(arr[arr.length/2-1]+arr[arr.length/2])/2;$("dataOut").textContent=`n=${arr.length}; mean=${mean.toFixed(4)}; median=${med}; min=${arr[0]}; max=${arr.at(-1)}; range=${arr.at(-1)-arr[0]}.`}
function sciTool(){let n=num("sciNum");if(!need([n],"sciOut"))return;if(n===0)return $("sciOut").textContent="0 is written as 0 × 10^0 by convention.";let e=Math.floor(Math.log10(Math.abs(n))),a=n/10**e;$("sciOut").textContent=`${n} = ${a.toFixed(8).replace(/0+$/,'').replace(/\.$/,'')} × 10^${e}`}

function submitQuiz(){
  let s=student(),w=APP.weeks.find(x=>x.week===activeWeek),r=weekRec(s,w.week),draft=ensureWeeklyQuizDraft(w,r),correct=0,answers=[],feedback=[];
  if(activeQuiz.length!==10||activeQuiz.some(item=>!item.id||!item.dimension)){
    alert("The canonical 10-question weekly mastery form is not available. Refresh this page before submitting; no mastery attempt was recorded.");
    return;
  }
  for(let i=0;i<activeQuiz.length;i++){
    const raw=draft.answers?.[String(i)];
    if(raw===undefined||raw===null)return alert("Please answer every mastery-check question. Question "+(i+1)+" is unanswered.");
    const val=Number(raw);answers.push(val);
    if(val===activeQuiz[i].answer)correct++;else feedback.push(`${i+1}. Review: ${activeQuiz[i].prompt} Correct answer: ${activeQuiz[i].choices[activeQuiz[i].answer]}`);
  }
  document.querySelectorAll("[id^=\"weekly_work_\"]").forEach((node,i)=>{draft.work[String(i)]=node.value});
  const score=Math.round(correct/activeQuiz.length*100);
  if(r.quiz.attempts.length&&!r.quiz.legacyBest&&Number(r.quiz.best)>0)r.quiz.legacyBest=Number(r.quiz.best);
  const attempt={
    date:new Date().toISOString(),score,answers,work_snapshot:{...(draft.work||{})},
    question_count:activeQuiz.length,
    assessment_version:WEEKLY_MASTERY_VERSION,
    question_ids:activeQuiz.map(item=>item.id),
    dimensions:activeQuiz.map(item=>item.dimension),
    retrieval_from_weeks:[...new Set(activeQuiz.map(item=>item.retrievalFromWeek).filter(Number.isFinite))]
  };
  const priorQuiz=JSON.parse(JSON.stringify(r.quiz));
  r.quiz.attempts.push(attempt);
  r.quiz.v2Best=Math.max(Number(r.quiz.v2Best)||0,score);
  r.quiz.best=Math.max(Number(r.quiz.best)||0,score);
  r.quiz.lastFeedback=feedback.length?feedback:["All answers were correct. Explain one solution in writing to preserve the reasoning."];
  r.quiz.draft=null;activeQuiz=[];
  if(!save()){r.quiz=priorQuiz;activeQuiz=priorQuiz.draft?.questions||[];return alert("Mastery-check submission paused because browser storage could not be verified. Your current draft was restored; export your learner record before leaving if storage remains unavailable.");}
  weeklyMasteryMode=false;syncAssessmentSurface();
  alert(`Mastery check submitted: ${score}%. Official v2 best: ${quizBest(s,w.week)}%.`);
  render();
}
function submitExam(name){
  let s=student(),draft=ensureExamDraft(name),qs=draft.questions||[],correct=0,answers=[];
  if(!qs.length)return alert("Reopen the assessment page to generate this assessment.");
  for(let i=0;i<qs.length;i++){
    const value=draft.answers?.[String(i)];
    if(value===undefined||value===null)return alert("Please answer every question before submitting. Question "+(i+1)+" is unanswered.");
    const val=Number(value);answers.push(val);if(val===qs[i].answer)correct++;
  }
  const score=Math.round(correct/qs.length*100);ensure(s);
  const rec=examRecord(name),attempt={date:new Date().toISOString(),score,answers,work_snapshot:{...(draft.work||{})},version:qs.map(q=>q.title),question_count:qs.length,mastery_met:score>=APP.passingTarget},priorBest=Number(rec.best)||0;
  rec.attempts.push(attempt);rec.best=Math.max(priorBest,score);rec.draft=null;activeExams[name]=[];
  if(!save()){rec.attempts.pop();rec.best=priorBest;rec.draft=draft;activeExams[name]=qs;return alert("Submission paused because browser storage could not be verified. Your draft remains available on this page.");}
  alert(`${name==="midterm"?"Midterm":"Final"} submitted: ${score}%. ${score>=APP.passingTarget?"Mastery target met.":"Review and retake when ready."}`);
  exams();
}
function repeatWeek(){let r=weekRec(student(),activeWeek);r.repeats=(r.repeats||0)+1;r.lastRepeat=new Date().toISOString();save();alert("Review cycle logged. Reopen the complete unit, correct work, and retake when ready.");render()}
function addCapstone(){let s=student();ensure(s);let note=$("capNote").value.trim();if(!note)return alert("Add a capstone note.");s.progress.capstone.logs.push({date:new Date().toISOString(),stage:$("capStage").value,note});save();render()}
function addStudent(name){let s={id:uid(),name,created:new Date().toISOString(),progress:{weeks:{},exams:{},capstone:{logs:[],score:0,rubric:{}}}};state.students.push(s);state.activeId=s.id;save();render()}

function reportHTML(){let s=student(),st=stats(s);return`<!doctype html><html><head><meta charset="utf-8"><title>Pre-Algebra Report - ${esc(s.name)}</title><style>body{font-family:Aptos,"Segoe UI",Arial,sans-serif;padding:32px;color:#111;line-height:1.55}table{width:100%;border-collapse:collapse}td,th{border:1px solid #aaa;padding:8px;vertical-align:top}.kpi{display:inline-block;border:1px solid #999;padding:12px;margin:5px}th{background:#eee}a{color:#123e77}</style></head><body><h1>Khaemenes Open-Age Pre-Algebra Report</h1><p><strong>Learner:</strong> ${esc(s.name)}<br><strong>Date:</strong> ${new Date().toLocaleDateString()}</p><div class="kpi"><strong>Overall mastery:</strong> ${st.course||"—"}%</div><div class="kpi"><strong>Lesson completion:</strong> ${st.lessons}%</div><div class="kpi"><strong>Assignment completion:</strong> ${st.assignments||"—"}%</div><div class="kpi"><strong>Quiz mastery:</strong> ${st.quizzes||"—"}%</div>${progressTable(s)}<h2>Capstone Logs</h2>${capstoneTable(s)}
</body></html>`}
function printReport(){let w=window.open("","_blank");if(!w)return alert("Allow pop-ups to print the report.");w.document.write(reportHTML());w.document.close();w.focus();setTimeout(()=>w.print(),400)}
function downloadReport(){download(`PreAlgebra_Report_${safe(student().name)}.html`,reportHTML(),"text/html")}
function downloadCSV(){let s=student(),rows=[["Learner","Week","Unit","Focus","Lesson Completion","Assignment Completion","Quiz Mastery","Attempts","Review Cycles"]];APP.weeks.forEach(w=>{let r=weekRec(s,w.week);rows.push([s.name,w.week,w.unitTitle,w.title,lessonPct(s,w.week),assignPct(s,w.week),quizBest(s,w.week)||"",r.quiz.attempts.length,r.repeats||0])});download(`PreAlgebra_Progress_${safe(s.name)}.csv`,rows.map(r=>r.map(csv).join(",")).join("\n"),"text/csv")}
function downloadScope(){let rows=[["Week","Unit","Focus","Big Idea","Tags","Path"]];APP.weeks.forEach(w=>rows.push([w.week,w.unitTitle,w.title,w.bigIdea,w.tags.join("; "),w.path]));download("Open_Age_PreAlgebra_36_Week_Scope.csv",rows.map(r=>r.map(csv).join(",")).join("\n"),"text/csv")}
function downloadCapstoneGuide(){download("PreAlgebra_Modelling_Capstone_Guide.txt","Open-Age Pre-Algebra Mathematical Modelling Capstone\n\nChoose a personal, scientific, environmental, financial, or civic question. Define variables, gather or create data, select a representation, calculate carefully, verify results, explain assumptions and limitations, and defend readiness for the next mathematics course.\n\nRubric: question and variables 20; evidence 20; model 25; accuracy and reasonableness 20; communication and limitations 15.\n","text/plain")}
function downloadBackup(){if(!confirm("Legacy family-wide JSON includes every Pre-Algebra student stored in this browser. For a single child, use Export Student ZIP instead. Continue only if authorized for all of these learners and able to keep this sensitive family file private."))return;download("Open_Age_PreAlgebra_Backup.json",JSON.stringify(state,null,2),"application/json")}
function importBackup(e){let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{const candidate=JSON.parse(r.result);if(!validState(candidate))throw Error("Invalid structure");state=candidate;state.activeId=state.activeId||state.students[0]?.id||null;save();render()}catch(error){console.warn(error);alert("Could not import backup. The file does not contain a valid Pre-Algebra learner record.")}};r.readAsText(f)}
function safe(s){return String(s||"learner").replace(/[^a-z0-9_-]+/gi,"_").slice(0,60)}
function csv(v){return`"${String(v??"").replaceAll('"','""')}"`}
function download(name,text,type){let b=new Blob([text],{type}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800)}
const courseMenus=[...document.querySelectorAll(".course-menu")];
const activityDialog=$("activityDialog"),activityFrame=$("activityFrame"),activityTitle=$("activityDialogTitle"),activityStatus=$("activityDialogStatus"),activityExternal=$("activityDialogExternal"),activityClose=$("activityDialogClose");
let lastActivityLauncher=null;
function closeCourseMenus(except=null){courseMenus.forEach(menu=>{if(menu!==except)menu.open=false})}
function openActivity(launcher){
  const url=launcher?.dataset?.launchUrl;if(!url||!activityDialog||!activityFrame)return;
  lastActivityLauncher=launcher;activityTitle.textContent=launcher.dataset.launchTitle||"Math Activity";activityStatus.textContent="Loading selected activity…";activityExternal.href=url;activityFrame.title=activityTitle.textContent;activityFrame.src=url;closeCourseMenus();document.body.classList.add("activity-open");
  if(typeof activityDialog.showModal==="function")activityDialog.showModal();else activityDialog.setAttribute("open","");
}
function closeActivity(){if(!activityDialog)return;activityFrame.src="about:blank";if(typeof activityDialog.close==="function"&&activityDialog.open)activityDialog.close();else activityDialog.removeAttribute("open");document.body.classList.remove("activity-open");lastActivityLauncher?.focus()}
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>openCourseView(b.dataset.view));
function openCourseView(target,{moveFocus=true}={}){
  weeklyMasteryMode=false;
  view=target;
  closeCourseMenus();
  render();
  if(moveFocus){
    const content=$("content");
    content?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
    if(content){
      content.setAttribute("tabindex","-1");
      setTimeout(()=>content.focus({preventScroll:true}),220);
    }
  }
}
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>openCourseView(b.dataset.go,{moveFocus:true}));
courseMenus.forEach(menu=>menu.addEventListener("toggle",()=>{if(menu.open)closeCourseMenus(menu)}));
document.addEventListener("click",event=>{
  const launcher=event.target.closest("[data-launch-url]");if(launcher){event.preventDefault();openActivity(launcher);return}
  courseMenus.forEach(menu=>{if(menu.open&&!menu.contains(event.target))menu.open=false});
});
activityFrame?.addEventListener("load",()=>{if(activityFrame.src!=="about:blank")activityStatus.textContent="Activity ready. Course progress remains open behind this window."});
activityClose?.addEventListener("click",closeActivity);
activityDialog?.addEventListener("cancel",event=>{event.preventDefault();closeActivity()});
activityDialog?.addEventListener("click",event=>{if(event.target===activityDialog)closeActivity()});
$("pinCourseButton").onclick=toggleCoursePin;window.addEventListener("storage",event=>{const pins=window.KhaemenesHighCoursePins;if(event.key===pins?.scopedKey(PROFILE_PIN_KEY)||event.key==="khaemenes_active_learner_v1")updatePinButton()});window.addEventListener("pageshow",updatePinButton);window.addEventListener("focus",updatePinButton);$("addStudent").onclick=()=>{let n=$("studentName").value.trim();if(!n)return alert("Enter a learner name.");addStudent(n);$("studentName").value=""};$("studentSelect").onchange=e=>{state.activeId=e.target.value;save();render()};$("deleteStudent").onclick=()=>{let s=student();if(!s)return;if(!confirm(`Delete ${s.name}?`))return;state.students=state.students.filter(x=>x.id!==s.id);state.activeId=state.students[0]?.id||null;if(!state.students.length)addStudent("First Learner");save();render()};$("demo").onclick=()=>{addStudent("Demo Learner");let s=student();for(let i=1;i<=4;i++){let r=weekRec(s,i);["Monday","Tuesday","Wednesday"].forEach(d=>r.lessons[d]=true);r.assignments[0]=true;r.quiz.best=[100,80,85,70][i-1];r.quiz.attempts.push({date:new Date().toISOString(),score:r.quiz.best})}save();render()};
try{
  const params=new URLSearchParams(location.search),requestedWeek=Number(params.get("week")),requestedView=params.get("view");
  if(Number.isInteger(requestedWeek)&&requestedWeek>=1&&requestedWeek<=36)activeWeek=requestedWeek;
  if(["dashboard","overview","week","scope","tools","games","exams","capstone","reports","standards"].includes(requestedView))view=requestedView;
}catch{}
if(!state.students.length)addStudent("First Learner");else render();

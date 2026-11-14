/* Biology 10 dashboard runtime · externalized from index.html for maintainability */
const COURSE=window.KhaemenesBiology10CourseData;
const KEY="khaemenes-biology-10-v1";
let state={profile:{name:"Student",pathway:"Core"},week:1,completed:{},mastery:{},masteryHistory:{},scores:{},notes:{},assessmentHistory:[],misconceptionHistory:[],view:"dashboard"};
let stateSnapshot=null,storageWarning="",lastSaveWarning="",stateRepairNotice="",storageRecordCorrupt=false;
const BIOLOGY_VIEWS=new Set(["dashboard","week","scope","lab","assess","report","standards"]);
function biologyRecordNotice(){
 const node=$("biologyRecordNotice");if(!node)return;
 const messages=[];
 if(storageWarning)messages.push(storageWarning);
 if(lastSaveWarning)messages.push(lastSaveWarning);
 if(stateRepairNotice)messages.push(stateRepairNotice);
 try{
  const profile=window.KhaemenesCourseEntryContract?.readAcademyProfile?.();
  if(!profile)messages.push("No verified Academy learner is selected. Lessons remain readable, but course progress cannot be saved until you select a learner in Student Profile.");
 }catch{messages.push("Academy learner identity could not be verified. Course records will not be written.")}
 node.hidden=!messages.length;node.textContent=messages.join(" ");
}

function load(){
 let raw=null;storageWarning="";storageRecordCorrupt=false;
 try{raw=localStorage.getItem(KEY)}catch(e){storageWarning="Browser storage is unavailable. The course can be read, but your changes cannot be saved here."}
 stateSnapshot=raw;
 if(raw!==null){
  try{
   const record=JSON.parse(raw);
   if(!record||typeof record!=="object"||Array.isArray(record))throw Error("Invalid saved record");
   state={...state,...record};
  }catch(e){
   storageRecordCorrupt=true;
   storageWarning="The saved Biology record could not be read. Its original content was not changed; do not reset the course. Export and recover the preserved record before saving.";
  }
 }
 const repairs=[];
 if(!BIOLOGY_VIEWS.has(state.view)){state.view="dashboard";repairs.push("Unrecognized saved view recovered to Dashboard")}
 const w=Number(state.week);
 if(!Number.isInteger(w)||w<1||w>COURSE.weeks.length){state.week=1;repairs.push("Invalid saved week recovered to Week 1")}else state.week=w;
 stateRepairNotice=repairs.length?repairs.join(". ")+". Existing records were not deleted.":"";
 state.profile=state.profile&&typeof state.profile==="object"&&!Array.isArray(state.profile)?state.profile:{name:"Student",pathway:"Core"};
 state.completed=state.completed&&typeof state.completed==="object"&&!Array.isArray(state.completed)?state.completed:{};
 state.mastery=state.mastery&&typeof state.mastery==="object"&&!Array.isArray(state.mastery)?state.mastery:{};
 state.masteryHistory=state.masteryHistory&&typeof state.masteryHistory==="object"&&!Array.isArray(state.masteryHistory)?state.masteryHistory:{};
 state.scores=state.scores&&typeof state.scores==="object"&&!Array.isArray(state.scores)?state.scores:{};
 state.notes=state.notes&&typeof state.notes==="object"&&!Array.isArray(state.notes)?state.notes:{};
 state.assessmentHistory=Array.isArray(state.assessmentHistory)?state.assessmentHistory:[];
 state.misconceptionHistory=Array.isArray(state.misconceptionHistory)?state.misconceptionHistory:[];
}
function save(){
 if(storageRecordCorrupt){lastSaveWarning="An unreadable saved record was not overwritten. Export or recover the preserved record first.";biologyRecordNotice();return false}
 try{
  if(!window.KhaemenesCourseEntryContract?.readAcademyProfile?.())throw Error("Select a verified Academy learner from Student Profile before saving.");
  const serialized=JSON.stringify(state);
  localStorage.setItem(KEY,serialized);
  const confirmed=localStorage.getItem(KEY);
  if(confirmed!==serialized)throw Error("Storage did not confirm the saved record.");
  stateSnapshot=confirmed;lastSaveWarning="";biologyRecordNotice();return true;
 }catch(e){
  lastSaveWarning="Your change was not saved. "+String(e?.message||"Storage is unavailable")+". No records were cleared.";
  biologyRecordNotice();return false;
 }
}
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function lessonsFor(w){return[
{day:"Monday",title:"Phenomenon · Notice/Wonder · Initial Model",objective:`Use observations to frame ${w.title.toLowerCase()}.`,activity:`Analyze: ${w.phenomenon} Record two observations, two questions, an initial explanation, and a labeled model.`,assignment:"Submit phenomenon notes, vocabulary preview, and initial model."},
{day:"Tuesday",title:"Concept · Reading · Model Revision",objective:`Explain the core ideas for ${w.title}.`,activity:`Read: ${w.reading} Build notes around: ${w.concepts}. Revise the model and identify one assumption or limitation.`,assignment:"Submit annotated reading notes and revised model."},
{day:"Wednesday",title:"Data · Mathematics · Evidence",objective:"Use quantitative reasoning and data as evidence.",activity:`Quantitative focus: ${w.quantitative} Interpret a table/graph, show units, state uncertainty, and identify what the evidence can and cannot support.`,assignment:"Submit one calculation/graph and an evidence statement."},
{day:"Thursday",title:"Investigation · Fieldwork · Engineering",objective:"Plan or conduct a safe investigation/design task.",activity:`${w.lab} Complete question, variables/criteria, method, safety controls, data plan, observations, anomalies, and limitations.`,assignment:"Submit laboratory/design record. Teacher approval is required for any activity beyond explicitly safe household-level work."},
{day:"Friday",title:"CER · Mastery · Portfolio",objective:"Construct an evidence-based explanation and identify repair work.",activity:`Answer: ${w.essentialQuestion} Use Claim–Evidence–Reasoning, cite at least two pieces of evidence, state uncertainty/limitations, and connect the week to ${w.standards}.`,assignment:"Complete corrections; essential outcomes below 80% require reassessment or documented remediation."}
]}
function doneCount(){return Object.values(state.completed||{}).filter(Boolean).length}
function masteryScore(week){const n=Number(state.mastery?.[week]);return Number.isFinite(n)&&n>=0&&n<=100?n:null}
function masteryHistoryFor(week){return Array.isArray(state.masteryHistory?.[week])?state.masteryHistory[week]:[]}
function masterySourceLabel(source){return({"weekly-open-book":"Weekly open-book mastery check","educator-review":"Educator-reviewed result","reassessment":"Correction / reassessment","imported-record":"Imported / prior record"}[source]||"Recorded result")}
function appendMasteryRecord(week,score,source,note){state.masteryHistory[week]=masteryHistoryFor(week);state.masteryHistory[week].push({score,source,recordedAt:new Date().toISOString(),note:String(note||"").trim()});state.masteryHistory[week]=state.masteryHistory[week].slice(-12)}
let activeWeeklySession=null,activeWeeklyQuestions=[],activeWeeklyWeek=null;
function weeklyAssessmentKey(week){return KEY+"::mc::weekly::"+String(week)}
function weeklyQuestionBank(week){return (window.KhaemenesBiology10QuestionBank||[]).filter(q=>Number(q.week)===Number(week))}
function weeklyMasteryMarkup(w){
 const MC=window.KhaeMonteCarloAssessment,bank=weeklyQuestionBank(w.week);
 if(!MC||bank.length<5)return '<div class="notice"><strong>Weekly mastery check unavailable:</strong> the public practice engine or five-question weekly bank did not load. No mastery will be recorded and the next week remains locked.</div>';
 const key=weeklyAssessmentKey(w.week);
 activeWeeklyWeek=w.week;
 activeWeeklySession=MC.openSession(key,bank,{kind:"biology-week-"+w.week,count:bank.length});
 activeWeeklyQuestions=MC.materialize(bank,activeWeeklySession);
 const prior=MC.getResponses(key,activeWeeklySession.id),best=masteryScore(w.week);
 return `<form id="weeklyMasteryForm"><p class="small">Open-book formative mastery · ${activeWeeklyQuestions.length} questions · 80% required · the same form and option order remain in place for corrections until mastery is reached.</p>${best!==null?`<div class="notice"><strong>Best demonstrated weekly mastery:</strong> ${best}%. ${best>=COURSE.passingTarget?"This week is mastered; optional review cannot remove that mastery.":"Correct missed reasoning below and resubmit this same form."}</div>`:""}${activeWeeklyQuestions.map((q,i)=>`<section class="question" role="group" aria-labelledby="weekly-question-title-${i}"><p id="weekly-question-title-${i}"><strong>${i+1}. ${esc(q.prompt)}</strong></p><p class="small">${esc(q.type)} · ${esc(q.topic||("Week "+w.week))}</p>${q.options.map((o,oi)=>`<label><input type="radio" name="wq${i}" value="${oi}" data-weekly-qid="${esc(q.id)}" required ${Number(prior[q.id])===oi?"checked":""}> <span>${esc(o)}</span></label>`).join("")}</section>`).join("")}<button type="submit">Score Weekly Mastery Check</button></form><div id="weeklyMasteryFeedback" role="status" aria-live="polite" aria-atomic="true"></div>`;
}
function wireWeeklyMastery(){
 const form=$("weeklyMasteryForm");
 if(!form||!activeWeeklySession)return;
 const MC=window.KhaeMonteCarloAssessment,key=weeklyAssessmentKey(activeWeeklyWeek);
 form.querySelectorAll("input[data-weekly-qid]").forEach(input=>input.onchange=()=>{
  if(!MC.saveResponse(key,input.dataset.weeklyQid,+input.value,activeWeeklySession.id)){
   assessmentConflict=true;
   alert("This weekly mastery form changed in another tab. Reload before continuing.");
  }
 });
 form.onsubmit=e=>{e.preventDefault();scoreWeeklyMastery(e.currentTarget)};
}
function scoreWeeklyMastery(form){
 const MC=window.KhaeMonteCarloAssessment,week=Number(activeWeeklyWeek),key=weeklyAssessmentKey(week);
 if(!MC||!activeWeeklySession||assessmentConflict||localStorage.getItem(KEY)!==stateSnapshot||!MC.isActive(key,activeWeeklySession.id)){
  alert("This learner or weekly mastery record changed in another tab. Reload before submitting to protect newer work.");return;
 }
 let correct=0,misses=[];
 activeWeeklyQuestions.forEach((q,i)=>{
  const chosen=form.querySelector(`input[name="wq${i}"]:checked`),selected=chosen?+chosen.value:null;
  if(chosen&&selected===q.answer)correct++;
  else misses.push({n:i+1,week:q.week,type:q.type,answer:q.options[q.answer],why:q.explanation});
 });
 const pct=Math.round(correct/activeWeeklyQuestions.length*100),prior=masteryScore(week),best=Math.max(prior===null?0:prior,pct);
 state.mastery[week]=best;
 appendMasteryRecord(week,pct,"weekly-open-book",pct>=COURSE.passingTarget?"Mastery check passed.":"Correction attempt preserved; same form retained without reshuffling.");
 if(!save())return;
 const passed=pct>=COURSE.passingTarget;
 if(passed)MC.complete(key,{score:correct,total:activeWeeklyQuestions.length,percent:pct,passed:true,week},activeWeeklySession.id);
 const feedback=$("weeklyMasteryFeedback");
 if(feedback)feedback.innerHTML=`<div class="feedback ${passed?"good":"bad"}"><strong>${pct}% · ${correct}/${activeWeeklyQuestions.length}</strong><p>${passed?"Weekly mastery target met. The next week is now available.":"Below 80%. Correct the missed reasoning and resubmit this same form; questions and option order will not reshuffle."}</p>${misses.length?`<details open><summary>Correction guidance</summary><ol>${misses.map(m=>`<li>Question ${m.n}: ${esc(m.why)} <span class="small">Correct response: ${esc(m.answer)}</span></li>`).join("")}</ol></details>`:""}</div>`;
 if(passed){
  form.querySelectorAll("input,button[type=submit]").forEach(el=>el.disabled=true);
 }
 renderWeekList();
}

function masteryCount(){return COURSE.weeks.filter(w=>{const s=masteryScore(w.week);return s!==null&&s>=COURSE.passingTarget}).length}
function firstUnmasteredBefore(week){for(let n=1;n<week;n++){const s=masteryScore(n);if(s===null||s<COURSE.passingTarget)return n}return null}
function weekUnlocked(week){return Number(week)<=1||firstUnmasteredBefore(Number(week))===null}
function weekLockReason(week){const blocker=firstUnmasteredBefore(Number(week));return blocker===null?"":`Week ${week} is locked until Week ${blocker} reaches at least ${COURSE.passingTarget}% mastery.`}
function applyCertifiedDirectoryGates(){document.querySelectorAll('#certified-week-directory a[href*="weeks/week-"],#certified-week-directory a[data-week-href]').forEach(a=>{const original=a.dataset.weekHref||a.getAttribute("href")||"";if(original&&!a.dataset.weekHref)a.dataset.weekHref=original;const m=original.match(/week-(\d+)/);if(!m)return;const week=Number(m[1]),open=weekUnlocked(week);if(open){a.setAttribute("href",a.dataset.weekHref);a.classList.remove("mastery-locked");a.removeAttribute("aria-disabled");a.removeAttribute("title");a.removeAttribute("tabindex");a.onclick=null;a.onkeydown=null}else{a.removeAttribute("href");a.classList.add("mastery-locked");a.setAttribute("aria-disabled","true");a.setAttribute("tabindex","0");a.setAttribute("title",weekLockReason(week));const explain=e=>{e.preventDefault();alert(weekLockReason(week))};a.onclick=explain;a.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){explain(e)}}}})}

function renderWeekList(){$("weekList").innerHTML=COURSE.weeks.map(w=>{const score=masteryScore(w.week),mastered=score!==null&&score>=COURSE.passingTarget,open=weekUnlocked(w.week),blocker=open?null:firstUnmasteredBefore(w.week);const mark=mastered?`✓ ${score}%`:(open?(state.completed[w.week]?"• reviewed":""):`🔒 W${blocker} ≥${COURSE.passingTarget}%`);return `<button type="button" class="weekBtn ${state.week===w.week?'active':''}" data-week="${w.week}" aria-disabled="${open?"false":"true"}" ${open?"":'disabled'} title="${open?"":esc(weekLockReason(w.week))}"><span><strong>Week ${w.week}</strong><small>${esc(w.title)}</small></span><span>${mark}</span></button>`}).join("");document.querySelectorAll("[data-week]").forEach(b=>{if(b.disabled)return;b.onclick=()=>{state.week=+b.dataset.week;state.view="week";save();render()}});applyCertifiedDirectoryGates()}
function setView(v){state.view=v;save();render()}
function navState(){document.querySelectorAll("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===state.view))}
function dashboard(){const best=Object.values(state.scores).filter(Number.isFinite);const avg=best.length?Math.round(best.reduce((a,b)=>a+b,0)/best.length):0;return `<div class="grid"><article class="card c12"><h3>Continue Biology Learning</h3><p>Begin with the next week awaiting mastery, then open its five daily lessons and evidence workspace. Your existing student records remain unchanged.</p><div class="biology-daily-links"><a href="weeks/week-${String(COURSE.weeks.find(w=>masteryScore(w.week)===null||masteryScore(w.week)<COURSE.passingTarget)?.week||36).padStart(2,"0")}/">Open Weekly Classroom</a><a href="weeks/week-${String(COURSE.weeks.find(w=>masteryScore(w.week)===null||masteryScore(w.week)<COURSE.passingTarget)?.week||36).padStart(2,"0")}/lessons/day-01.html">Open Monday Deep Lesson</a></div></article><article class="card c3 metric"><strong>${masteryCount()}/36</strong><span>Weeks at ≥${COURSE.passingTarget}% mastery</span></article><article class="card c3 metric"><strong>${doneCount()}/36</strong><span>Weeks reviewed / evidence assembled</span></article><article class="card c3 metric"><strong>${avg||"—"}${avg?"%":""}</strong><span>Cumulative practice average</span></article><article class="card c3 metric"><strong>≥25%</strong><span>Inquiry / lab target</span></article><article class="card c12"><h3>Course Charter</h3><p>${esc(COURSE.description)}</p><p><span class="pill">Foundation</span><span class="pill">Core</span><span class="pill">Extended</span><span class="pill">80% mastery</span><span class="pill">CER</span><span class="pill">Data</span><span class="pill">Engineering</span></p><div class="notice"><strong>Mastery record:</strong> A reviewed/completed checkbox means work has been assembled; it is not the same as mastery. A week is displayed as mastered only when its recorded weekly mastery result is at least ${COURSE.passingTarget}%. These browser-local records remain non-authoritative until reviewed under Academy process.</div><div class="notice"><strong>Laboratory policy:</strong> ${esc(COURSE.labPolicy)}</div></article></div>`}
function weekView(){const w=COURSE.weeks.find(x=>x.week===state.week);if(!weekUnlocked(w.week)){const blocker=firstUnmasteredBefore(w.week);return `<article class="card"><p class="kicker">Week ${w.week} · Locked</p><h3>${esc(w.title)}</h3><div class="notice"><strong>80% mastery gate:</strong> ${esc(weekLockReason(w.week))}</div><p>Complete corrections or reassessment for Week ${blocker}, record the reviewed mastery result, then return here. Earlier mastered weeks remain available for review.</p><div class="row"><button type="button" id="lockedPrevWeek">Return to Week ${blocker}</button><button type="button" class="secondary" data-view-jump="report">Open Progress Report</button></div></article>`}const score=masteryScore(w.week);const mastered=score!==null&&score>=COURSE.passingTarget;const history=masteryHistoryFor(w.week);return `<article class="card"><p class="kicker">Week ${w.week} · ${esc(w.unit)}</p><h3>${esc(w.title)}</h3><p><strong>Essential question:</strong> ${esc(w.essentialQuestion)}</p><div class="notice"><strong>Phenomenon:</strong> ${esc(w.phenomenon)}</div><p>${w.standards.split(";").map(x=>`<span class="pill">${esc(x.trim())}</span>`).join("")}</p>${lessonsFor(w).map(l=>`<section class="lesson"><span class="day">${l.day}</span><h4>${esc(l.title)}</h4><p><strong>Objective:</strong> ${esc(l.objective)}</p><p>${esc(l.activity)}</p><p class="small"><strong>Assignment:</strong> ${esc(l.assignment)}</p></section>`).join("")}<section class="lesson"><h4>Open the five detailed daily lessons</h4><p>Follow the complete Monday–Friday Biology instructional sequence. Each printable lesson provides instruction, worked examples, practice, and a link back to the weekly evidence workspace.</p><div class="biology-daily-links">${["Monday","Tuesday","Wednesday","Thursday","Friday"].map((day,i)=>`<a href="weeks/week-${String(w.week).padStart(2,"0")}/lessons/day-${String(i+1).padStart(2,"0")}.html">Day ${i+1} · ${day}</a>`).join("")}</div><p><a href="weeks/week-${String(w.week).padStart(2,"0")}/">Open Week ${w.week} Evidence Workspace</a></p></section><div class="notice"><strong>Weekly evidence status:</strong> ${mastered?`Mastered · ${score}%`:(score!==null?`Recorded ${score}% · below the ${COURSE.passingTarget}% mastery floor; complete corrections/reassessment.`:`No weekly mastery score recorded yet.`)} The next week unlocks only after this week reaches the 80% mastery floor; earlier mastered weeks remain available for review. Browser-local evidence does not become an official grade by itself.</div><label><input style="width:auto" type="checkbox" id="weekDone" ${state.completed[w.week]?'checked':''}> Week ${w.week} reviewed / evidence assembled</label><section class="lesson weekly-mastery-check"><h4>Weekly Open-Book Mastery Check</h4><p>Mastery is calculated from the scored weekly check below. Learners cannot type a percentage to unlock coursework. A score below 80% preserves the same question and option order for correction and retry; prior attempts remain in mastery history.</p>${weeklyMasteryMarkup(w)}</section><label for="weekNote">Portfolio note / correction record</label><textarea id="weekNote">${esc(state.notes[w.week]||"")}</textarea>${history.length?`<details><summary>Mastery history · ${history.length} record${history.length===1?"":"s"}</summary><ol>${history.slice().reverse().map(h=>`<li><strong>${Number(h.score)}%</strong> · ${esc(masterySourceLabel(h.source))} · ${esc(h.recordedAt||"")}${h.note?`<br><span class="small">${esc(h.note)}</span>`:""}</li>`).join("")}</ol></details>`:(score!==null?`<p class="small">Existing mastery score preserved as a legacy record. Its provenance will be added the next time the score is changed or explicitly re-recorded.</p>`:"")}<div class="row"><button type="button" id="saveWeek">Save Week Evidence</button><button type="button" class="secondary" id="prevWeek">Previous</button><button type="button" class="secondary" id="nextWeek">Next</button></div></article>`}
function scopeView(){return COURSE.units.map(u=>`<article class="card unit"><div class="unitHead"><div><p class="kicker">${esc(u.id)}</p><h3>${esc(u.week_titles[0])}${u.week_titles.length>1?" → "+esc(u.week_titles[u.week_titles.length-1]):""}</h3></div><span class="pill">Weeks ${u.weeks.join(", ")}</span></div><p>${u.week_titles.map(t=>`<span class="pill">${esc(t)}</span>`).join("")}</p><p><strong>Unit assessment:</strong> ${esc(u.assessment)}</p><details><summary>Unit objectives</summary><ul>${u.objectives.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details></article>`).join("")}
function labView(){return `<div class="grid"><article class="card c6"><h3>Laboratory & Inquiry Standard</h3><p>${esc(COURSE.labPolicy)}</p><p>Every investigation record should include: question/problem, variables or design criteria, materials/data source, hazards and controls, method, raw data/observations, processed data, graph/model, conclusion, uncertainty, limitations, and revision.</p><div class="notice"><strong>Safety boundary:</strong> No hazardous procedure should be improvised. Chemistry never uses household-cleaner mixing. Physics never uses mains voltage, dangerous projectiles, high-energy rotation, or eye-hazard lasers. Biology does not culture unknown microorganisms or conduct diagnostic/medical experiments.</div></article><article class="card c6"><h3>Inquiry Portfolio</h3><p>Recommended evidence: at least one meaningful investigation/design/data inquiry each instructional week, with a substantial fraction of course time devoted to inquiry. Simulations must require manipulation, data collection/analysis, and scientific reasoning—not passive demonstration.</p><table><tr><th>Evidence</th><th>Expectation</th></tr><tr><td>Lab notebook</td><td>Dates, methods, data, uncertainty, corrections</td></tr><tr><td>Graphs/models</td><td>Units, labels, assumptions, limitations</td></tr><tr><td>Communication</td><td>CER, report, poster, oral/visual defense</td></tr><tr><td>Safety</td><td>Hazards/controls before procedure</td></tr></table></article></div>`}
function assessmentView(){return `<article class="card"><h3>Monte Carlo Practice Assessments</h3><p>The public Practice Midterm draws 20 persisted randomized questions from Weeks 01–17 with concept, model, quantitative, and evidence quotas. The Practice Comprehensive Final draws 30 questions split evenly across both halves of the course and across reasoning types. Completed attempts feed unseen-question preference. Official examinations remain separately supervised and authenticated.</p><div class="row"><button type="button" data-test="midterm">Practice Midterm</button><button type="button" data-test="final">Practice Final</button></div><div id="testArea"></div></article>`}
let activeTestQuestions=[],activeTestSession=null,assessmentConflict=false;
window.addEventListener("storage",e=>{if(e.key===KEY||String(e.key||"").startsWith(KEY+"::mc::"))assessmentConflict=true});
function assessmentConfig(kind){return kind==="midterm"?{count:20,sourceQuotas:{"H1-concept":5,"H1-model":3,"H1-quantitative":6,"H1-evidence":6}}:{count:30,sourceQuotas:{"H1-concept":4,"H1-model":2,"H1-quantitative":5,"H1-evidence":4,"H2-concept":3,"H2-model":5,"H2-quantitative":5,"H2-evidence":2}}}
function testMarkup(kind){const cfg=assessmentConfig(kind),MC=window.KhaeMonteCarloAssessment,BANK=window.KhaemenesBiology10QuestionBank||[],mcKey=KEY+"::mc::"+kind;activeTestSession=MC.openSession(mcKey,BANK,{kind:"biology-"+kind,count:cfg.count,sourceQuotas:cfg.sourceQuotas});activeTestQuestions=MC.materialize(BANK,activeTestSession);assessmentConflict=false;const prior=MC.getResponses(mcKey,activeTestSession.id);return `<form id="testForm"><h3>${kind==="midterm"?"Practice Midterm":"Practice Comprehensive Final"}</h3><p class="small">Generated form ${esc(activeTestSession.id)} · ${activeTestQuestions.length} questions · source bank ${BANK.length}.</p>${activeTestQuestions.map((q,i)=>`<section class="question" role="group" aria-labelledby="question-title-${i}"><p id="question-title-${i}"><strong>${i+1}. ${esc(q.prompt)}</strong></p><p class="small">Week ${q.week} · ${esc(q.type)}</p>${q.options.map((o,oi)=>`<label><input type="radio" name="q${i}" value="${oi}" data-qid="${esc(q.id)}" required ${Number(prior[q.id])===oi?"checked":""}> <span>${esc(o)}</span></label>`).join("")}</section>`).join("")}<button type="submit">Score Assessment</button></form><div id="testFeedback" role="status" aria-live="polite" aria-atomic="true"></div>`}
function wireTestPersistence(kind){const MC=window.KhaeMonteCarloAssessment,mcKey=KEY+"::mc::"+kind;document.querySelectorAll("#testForm input[data-qid]").forEach(x=>x.onchange=()=>MC.saveResponse(mcKey,x.dataset.qid,+x.value,activeTestSession.id)||((assessmentConflict=true),alert("This practice form changed in another tab. Reload before continuing.")))}
function scoreTest(kind,form){const MC=window.KhaeMonteCarloAssessment,mcKey=KEY+"::mc::"+kind,pool=activeTestQuestions;if(assessmentConflict||localStorage.getItem(KEY)!==stateSnapshot||!MC.isActive(mcKey,activeTestSession?.id)){alert("This learner or practice record changed in another tab. Reload before submitting to protect newer work.");return}let correct=0,misses=[],domains={};pool.forEach((q,i)=>{const chosen=form.querySelector(`input[name="q${i}"]:checked`);domains[q.type]||={correct:0,total:0};domains[q.type].total++;if(chosen&&+chosen.value===q.answer){correct++;domains[q.type].correct++}else{const selected=chosen?+chosen.value:null;const reviewed=window.KhaeScienceMisconceptionGuidance?.reviewed(window.KhaemenesBiology10Misconceptions,q,selected)||null;const diagnostic=reviewed||window.KhaeScienceMisconceptionGuidance?.forQuestion("biology-10",q,selected)||null;misses.push({n:i+1,itemId:q.id,week:q.week,type:q.type,topic:q.topic||"",selectedIndex:selected,answer:q.options[q.answer],why:q.explanation,diagnostic})}});const pct=Math.round(correct/pool.length*100),passed=pct>=80;state.scores[kind]=Math.max(state.scores[kind]||0,pct);state.assessmentHistory=Array.isArray(state.assessmentHistory)?state.assessmentHistory:[];const completedAt=new Date().toISOString();
  const diagnosticMisses=misses.filter(m=>m.diagnostic).map(m=>({itemId:m.itemId,week:m.week,type:m.type,selectedIndex:m.selectedIndex,tag:m.diagnostic.tag,label:m.diagnostic.label,remediationRoute:m.diagnostic.remediationRoute,certainty:m.diagnostic.certainty}));
  state.assessmentHistory.push({kind,formId:activeTestSession.id,score:correct,total:pool.length,pct,passed,completedAt,questionIds:activeTestSession.questionIds,domains,diagnosticMisses});
  state.assessmentHistory=state.assessmentHistory.slice(-24);
  state.misconceptionHistory.push(...diagnosticMisses.map(d=>({...d,kind,formId:activeTestSession.id,completedAt})));
  state.misconceptionHistory=state.misconceptionHistory.slice(-240);
  if(!save())return;MC.complete(mcKey,{score:correct,total:pool.length,percent:pct,passed,domains},activeTestSession.id);$("testFeedback").innerHTML=`<div class="feedback ${passed?'good':'bad'}"><strong>${pct}% · ${correct}/${pool.length}</strong><p>${passed?'Mastery target met for this practice form.':'Below 80%. Complete corrections before another randomized attempt.'}</p><p class="small">${Object.entries(domains).map(([k,v])=>esc(k)+": "+v.correct+"/"+v.total).join(" · ")}</p>${misses.length?`<details><summary>Correction guidance</summary><ol>${misses.map(m=>`<li>Week ${m.week} — Correct answer: ${esc(m.answer)}. ${esc(m.why)}${m.diagnostic?` <strong>${esc(m.diagnostic.label)}:</strong> ${esc(m.diagnostic.guidance)} Review ${esc(m.diagnostic.remediationRoute)}.`:""}</li>`).join("")}</ol></details>`:""}</div>`}

function misconceptionSummary(){
 const hist=Array.isArray(state.misconceptionHistory)?state.misconceptionHistory:[];
 if(!hist.length)return '<div class="notice"><strong>Reasoning diagnostic history:</strong> No reviewed misconception patterns recorded yet. Complete a randomized practice assessment to begin the longitudinal record.</div>';
 const counts=new Map();
 for(const x of hist){const key=String(x.tag||x.label||"review-needed");const row=counts.get(key)||{count:0,label:x.label||key,route:x.remediationRoute||"",weeks:new Set()};row.count++;if(x.week)row.weeks.add(Number(x.week));if(x.remediationRoute)row.route=x.remediationRoute;counts.set(key,row)}
 const top=[...counts.values()].sort((a,b)=>b.count-a.count).slice(0,7);
 return '<article class="card"><h3>Reasoning Pattern History</h3><p class="small">Browser-local practice diagnostic only. This does not create an official grade or prove a fixed misconception.</p><table><tr><th>Pattern</th><th>Occurrences</th><th>Weeks</th><th>Suggested correction</th></tr>'+top.map(x=>'<tr><td>'+esc(x.label)+'</td><td>'+x.count+'</td><td>'+esc([...x.weeks].sort((a,b)=>a-b).join(", ")||"—")+'</td><td>'+esc(x.route||"Review the related lesson evidence.")+'</td></tr>').join("")+'</table></article>';
}
function reportView(){const rows=COURSE.weeks.map(w=>{const score=masteryScore(w.week);return `<tr><td>${w.week}</td><td>${esc(w.title)}</td><td>${state.completed[w.week]?"Reviewed":"Open"}</td><td>${score===null?"—":score+"%"+(score>=COURSE.passingTarget?" · Mastered":" · Corrections/Reassessment")}</td><td>${esc(state.notes[w.week]||"")}</td></tr>`}).join("");return `<article class="card"><h3>Progress Report</h3><p><strong>Student:</strong> ${esc(state.profile.name)} · <strong>Pathway:</strong> ${esc(state.profile.pathway)}</p><p><strong>Weeks mastered:</strong> ${masteryCount()}/36 · <strong>Midterm practice best:</strong> ${state.scores.midterm??"—"} · <strong>Final practice best:</strong> ${state.scores.final??"—"}</p><p class="small"><strong>Assessment boundary:</strong> Midterm/final values shown here are browser-local practice only and never constitute an official supervised grade.</p><div class="bar"><span style="width:${Math.round(masteryCount()/36*100)}%"></span></div><table><tr><th>Week</th><th>Topic</th><th>Evidence status</th><th>Mastery</th><th>Portfolio / correction note</th></tr>${rows}</table>${misconceptionSummary()}<div class="row noPrint"><button type="button" onclick="window.print()">Print</button><button type="button" class="secondary" id="export2">Export JSON</button></div></article>`}
function standardsView(){return `<div class="grid"><article class="card c6"><h3>National Framework Alignment</h3><ul>${COURSE.standards.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><p>The National Academies Framework and NGSS emphasize three-dimensional learning: disciplinary core ideas, scientific/engineering practices, and crosscutting concepts. This course uses all eight science/engineering practices throughout the year.</p></article><article class="card c6"><h3>College-Readiness Benchmark</h3><p>${esc(COURSE.benchmark)}</p><p>Benchmarking against public AP course frameworks does <strong>not</strong> make this an AP course. AP designation requires College Board Course Audit authorization.</p><p><strong>Credit note:</strong> Jurisdiction-specific review remains required for formal credit, graduation, scholarship, athletic-eligibility, or accreditation claims.</p></article></div>`}
function render(){navState();renderWeekList();biologyRecordNotice();$("studentName").value=state.profile.name||"";$("pathway").value=state.profile.pathway||"Core";let out="";if(state.view==="dashboard")out=dashboard();if(state.view==="week")out=weekView();if(state.view==="scope")out=scopeView();if(state.view==="lab")out=labView();if(state.view==="assess")out=assessmentView();if(state.view==="report")out=reportView();if(state.view==="standards")out=standardsView();$("content").innerHTML=out;
if(state.view==="week"&&$("weekDone")){$("weekDone").onchange=e=>{state.completed[state.week]=e.target.checked};$("saveWeek").onclick=()=>{state.notes[state.week]=$("weekNote").value;save();render()};$("prevWeek").onclick=()=>{state.week=Math.max(1,state.week-1);save();render()};$("nextWeek").onclick=()=>{const target=Math.min(36,state.week+1);if(target>state.week&&!weekUnlocked(target)){alert(weekLockReason(target));return}state.week=target;save();render()};wireWeeklyMastery()}
if(state.view==="week"&&$("lockedPrevWeek")){$("lockedPrevWeek").onclick=()=>{state.week=firstUnmasteredBefore(state.week)||1;save();render()};document.querySelectorAll("[data-view-jump]").forEach(b=>b.onclick=()=>setView(b.dataset.viewJump))}
if(state.view==="assess")document.querySelectorAll("[data-test]").forEach(b=>b.onclick=()=>{const kind=b.dataset.test;$("testArea").innerHTML=testMarkup(kind);wireTestPersistence(kind);$("testForm").onsubmit=e=>{e.preventDefault();scoreTest(kind,e.currentTarget)}});
if(state.view==="report"&&$("export2"))$("export2").onclick=exportData;
}
function exportData(){const payload={course:COURSE.code,title:COURSE.title,exportedAt:new Date().toISOString(),state};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${COURSE.code.toLowerCase()}-progress.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800)}
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>setView(b.dataset.view));
$("saveProfile").onclick=()=>{state.profile={name:$("studentName").value.trim()||"Student",pathway:$("pathway").value};save();render()};
$("exportBtn").onclick=exportData;
$("themeBtn").onclick=()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;$("themeBtn").textContent=next==="dark"?"Light":"Dark"};
load();render();
document.addEventListener("DOMContentLoaded",applyCertifiedDirectoryGates);

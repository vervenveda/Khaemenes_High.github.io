(() => {
'use strict';
const COURSE = window.KHAEMENES_SOCIAL_STUDIES_DATA;
const META = COURSE.metadata;
const KEY = META.storageKey;
let selectedWeek = Math.max(1, Math.min(36, Math.floor(Number(new URLSearchParams(location.search).get('week'))) || 1));
let view = ['dashboard','week','scope','exams','reports','standards'].includes(new URLSearchParams(location.search).get('view')) ? new URLSearchParams(location.search).get('view') : 'dashboard';
let examType = 'midterm';

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = (v='') => String(v).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const id = () => 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const today = () => new Date().toISOString().slice(0,10);

function freshDB(){
  return {version:1,teacherPasscode:'KHAE09',activeId:null,students:[],settings:{theme:'dark',fontScale:100}};
}
function loadDB(){
  try{
    const saved = JSON.parse(window.KhaemenesSS9Records.storage.getItem(KEY));
    if(saved) return window.KhaemenesSS9Records.prepareDB(window.KhaemenesSS9Records.validDB(saved));
  }catch(e){ console.warn('Could not read saved course data',e); }
  return window.KhaemenesSS9Records.prepareDB(freshDB());
}
let db = loadDB();
if(view==='week'&&!new URLSearchParams(location.search).has('week'))selectedWeek=currentWeek(activeStudent());
function saveDB(){ window.KhaemenesSS9Records.storage.setItem(KEY, JSON.stringify(db)); }
function activeStudent(){ return db.students.find(s=>s.id===db.activeId) || null; }
function normalizeStudent(s){
  s.completedLessons ||= {};
  s.assignments ||= {};
  s.quizzes ||= {};
  s.exams ||= {};
  s.journal ||= {};
  s.attendance ||= {};
  return s;
}
function createStudent(name){
  const s = normalizeStudent({id:id(),name:name.trim(),created:today()});
  db.students.push(s); db.activeId=s.id; saveDB(); return s;
}
function demoStudent(){
  const s=createStudent('Demo Scholar');
  COURSE.weeks.slice(0,3).forEach(w=>{
    s.completedLessons[w.week]=[true,true,true,true,true];
    w.assignments.forEach(a=>s.assignments[`${w.week}-${a.number}`]={text:'Sample completed response for demonstration.',submitted:true,score:a.points,feedback:'Demonstration record'});
    s.quizzes[w.week]={score:20,bestScore:22,percent:88,attempts:1,completed:true,shortResponse:'Sample evidence-based response.'};
  });
  saveDB();
}
function lessonStats(s){
  const total=180;
  let done=0;
  if(s) Object.values(s.completedLessons||{}).forEach(arr=>done+=arr.filter(Boolean).length);
  return {done,total,percent:Math.round(done/total*100)};
}
function assignmentStats(s){
  let submitted=0, total=108, points=0, possible=0;
  if(s) Object.values(s.assignments||{}).forEach(a=>{if(a.submitted) submitted++; if(Number.isFinite(+a.score)){points+=+a.score; possible+=30;}});
  return {submitted,total,percent:Math.round(submitted/total*100),points,possible};
}
function quizStats(s){
  const entries=s?Object.values(s.quizzes||{}):[];
  const completed=entries.filter(q=>q.completed).length;
  const avg=completed?Math.round(entries.filter(q=>q.completed).reduce((a,q)=>a+(q.bestPercent??q.percent??0),0)/completed):0;
  return {completed,total:36,avg};
}
function combinedProgress(s){
  if(!s) return 0;
  const l=lessonStats(s).percent, a=assignmentStats(s).percent, q=Math.round(quizStats(s).completed/36*100);
  return Math.round(l*.35+a*.40+q*.25);
}
function currentWeek(s){return window.KhaemenesSS9Records.nextWeek(s);}
function setView(next){
  view=next;
  $$('.navBtn,.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  render();
}
function setWeek(n){
  selectedWeek=Math.max(1,Math.min(36,Math.floor(+n)||1));
  view='week';
  history.replaceState(null,'',`?week=${selectedWeek}`);
  renderSidebarWeeks();
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderStudentControls(){
  const select=$('#studentSelect');
  select.innerHTML = db.students.length ? db.students.map(s=>`<option value="${esc(s.id)}" ${s.id===db.activeId?'selected':''}>${esc(s.name)}</option>`).join('') : '<option value="">No student added</option>';
}
function renderSidebarWeeks(){
  const s=activeStudent();
  $('#weekList').innerHTML=COURSE.weeks.map(w=>{
    const done=(s?.completedLessons?.[w.week]||[]).filter(Boolean).length;
    return `<button class="weekBtn ${selectedWeek===w.week?'active':''}" data-week="${w.week}">
      <span><strong>Week ${w.week}</strong><br><small>${esc(w.title)}</small></span><span>${done}/5</span></button>`;
  }).join('');
  $$('#weekList .weekBtn').forEach(b=>b.onclick=()=>setWeek(b.dataset.week));
}
function render(){
  $$('.navBtn,.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  applySettings();
  const c=$('#content');
  if(view==='dashboard') c.innerHTML=dashboardHTML();
  if(view==='week') c.innerHTML=weekHTML(COURSE.weeks[selectedWeek-1]);
  if(view==='scope') c.innerHTML=scopeHTML();
  if(view==='exams') c.innerHTML=examsHTML();
  if(view==='reports') c.innerHTML=reportsHTML();
  if(view==='standards') c.innerHTML=standardsHTML();
  wireView();
}
function dashboardHTML(){
  const s=activeStudent(), ls=lessonStats(s), as=assignmentStats(s), qs=quizStats(s), overall=combinedProgress(s), cw=currentWeek(s);
  return `
  <div class="grid">
    <section class="card col12">
      <h2>${s?`Welcome, ${esc(s.name)}`:'Welcome to Global Studies Honors'}</h2>
      <p>${s?'Continue your inquiry through world history, geography, civics, economics, and media literacy.':'Add a student in the sidebar to begin recording progress in this browser.'}</p>
      <div class="progress" aria-label="Overall progress"><span style="width:${overall}%"></span></div>
      <p class="small">Estimated course completion: ${overall}%</p>
      <div class="actions">
        <button id="continueBtn">Continue Week ${cw}</button>
        <button class="secondary" data-go="scope">View 36-Week Scope</button>
        <button class="ghost" id="readCourseBtn">Read Course Introduction</button>
      </div>
    </section>
    <section class="card col3 kpi"><strong>${ls.done}/180</strong><span>Daily lessons completed</span></section>
    <section class="card col3 kpi"><strong>${as.submitted}/108</strong><span>Assignments submitted</span></section>
    <section class="card col3 kpi"><strong>${qs.completed}/36</strong><span>Weekly quizzes completed</span></section>
    <section class="card col3 kpi"><strong>${qs.completed?qs.avg+"%":"Pending"}</strong><span>Objective quiz average</span></section>
    <section class="card col8">
      <h3>Course Architecture</h3>
      <div class="tableWrap"><table><thead><tr><th>Component</th><th>Total</th><th>Purpose</th></tr></thead><tbody>
        <tr><td>Daily lessons</td><td>180</td><td>Five-day inquiry rhythm across 36 weeks</td></tr>
        <tr><td>Principal assignments</td><td>108</td><td>Source analysis, map/data reasoning, and argumentation</td></tr>
        <tr><td>Weekly quizzes</td><td>36</td><td>Ten definitive-response questions plus a constructed response</td></tr>
        <tr><td>Major examinations</td><td>2</td><td>Stimulus-based midterm and cumulative final</td></tr>
        <tr><td>Civic capstone</td><td>1</td><td>Nonpartisan, evidence-based public problem investigation</td></tr>
      </tbody></table></div>
    </section>
    <section class="card dark col4">
      <h3>Weekly Rhythm</h3>
      <ol>
        <li>Monday: frame time, place, and inquiry.</li>
        <li>Tuesday: read and corroborate sources.</li>
        <li>Wednesday: map, measure, and interpret data.</li>
        <li>Thursday: discuss, debate, and write.</li>
        <li>Friday: synthesize, quiz, and correct.</li>
      </ol>
      <p class="small">Each week contains an original offline reading, vocabulary, source study, three assignments, support options, honors extensions, and a retake-ready quiz.</p>
    </section>
    <section class="card col12">
      <h3>Academic Integrity and Responsible AI Use</h3>
      <p>Students may use tools to brainstorm questions, define unfamiliar terms, or receive feedback when the teacher permits it. Submitted work must accurately represent the student’s own reasoning. Any AI-assisted claim, quotation, statistic, or citation must be verified against a trustworthy original source. Invented citations receive no evidence credit.</p>
    </section>
  </div>`;
}
function lessonBlock(w,l,i,s){
  const checked=!!s?.completedLessons?.[w.week]?.[i];
  return `<article class="lesson">
    <div class="lessonHeader"><div><span class="pill">${l.day} · ${l.minutes} min</span><h3>${esc(l.title)}</h3></div>
      <label class="checkline"><input type="checkbox" class="lessonCheck" data-index="${i}" ${checked?'checked':''}> Complete</label></div>
    <p><strong>Objective:</strong> ${esc(l.objective)}</p>
    <details><summary>Warm-up</summary><p>${esc(l.warmup)}</p></details>
    <details open><summary>Daily lesson</summary><p>${esc(l.instruction)}</p></details>
    <details><summary>Guided practice</summary><p>${esc(l.guidedPractice)}</p></details>
    <details><summary>Independent practice</summary><p>${esc(l.independentPractice)}</p></details>
    <details><summary>Check for understanding</summary><p>${esc(l.checkForUnderstanding)}</p></details>
    <details><summary>Materials, support, and honors extension</summary>
      <p><strong>Materials:</strong> ${l.materials.map(esc).join('; ')}</p><p><strong>Support:</strong> ${esc(l.support)}</p><p><strong>Honors:</strong> ${esc(l.extension)}</p></details>
  </article>`;
}
function assignmentBlock(w,a,s){
  const key=`${w.week}-${a.number}`, saved=s?.assignments?.[key]||{};
  return `<article class="assignment">
    <span class="pill">Assignment ${a.number} · ${a.points} points</span><h3>${esc(a.title)}</h3>
    <p><strong>${esc(a.type)}</strong></p><p>${esc(a.instructions)}</p>
    <ul>${a.deliverables.map(d=>`<li>${esc(d)}</li>`).join('')}</ul>
    <label for="assignment-${key}">Student response or teacher note</label>
    <textarea id="assignment-${key}" data-assignment="${key}" placeholder="Write or paste the response here. A printed attachment may also be submitted.">${esc(saved.text||'')}</textarea>
    <div class="actions">
      <button class="saveAssignment" data-key="${key}">Save Draft</button>
      <button class="secondary submitAssignment" data-key="${key}">${saved.submitted?'Submitted ✓':'Mark Submitted'}</button>
    </div>
    <p class="assignmentStatus" id="status-${key}">${saved.updated?`Last saved ${esc(saved.updated)}`:'Not yet saved'}${saved.score!==undefined?` · Teacher score: ${esc(saved.score)}`:''}</p>
    <details><summary>Four-part rubric</summary>${Object.entries(a.rubric).map(([k,v])=>`<p><strong>${esc(k)}:</strong> ${esc(v)}</p>`).join('')}</details>
  </article>`;
}
function quizHTML(w,s){
  const saved=s?.quizzes?.[w.week]||{};
  return `<section class="card col12" id="weeklyQuiz">
    <h2>${esc(w.quiz.title)}</h2>
    <p>Ten automatically scored questions (20 points) and one teacher-scored constructed response (5 points). Retakes are permitted; the report preserves the best objective score.</p>
    ${w.quiz.questions.map((q,qi)=>`<div class="quizQ"><p><strong>${qi+1}. ${esc(q.prompt)}</strong></p>
      ${q.choices.map((ch,ci)=>`<label class="choice"><input type="radio" name="q${qi}" value="${ci}" ${saved.answers?.[qi]===ci?'checked':''}> ${esc(ch)}</label>`).join('')}
      <div id="fb-${qi}"></div></div>`).join('')}
    <div class="quizQ"><p><strong>Constructed Response.</strong> ${esc(w.quiz.shortResponse.prompt)}</p>
      <textarea id="quizShort" aria-label="Weekly constructed response">${esc(saved.shortResponse||'')}</textarea></div>
    <div class="actions"><button id="submitQuiz">Score Objective Questions</button><button class="secondary" id="saveQuiz">Save Without Scoring</button></div>
    <div id="quizResult">${saved.completed?`<p class="score">Best objective score: ${saved.bestScore}/20 (${saved.bestPercent}%)</p><p class="small">Attempts: ${saved.attempts||1}</p>`:''}</div>
  </section>`;
}
function packetPath(w){return w.week===27?'weeks/week-27/student-packet-v2.html':`weeks/week-${String(w.week).padStart(2,'0')}/student-packet.html`}
function localLabHTML(w){if(w.week===26)return '<section class="card col12"><h2>Local Industrialization Simulation Lab</h2><p>Run the Academy local growth and supply/demand models, then corroborate model behavior with the historical record. No network connection is required.</p><div class="actions"><a class="button secondary" href="weeks/week-26/simulation-lab.html">Open Local Week 26 Lab</a></div></section>';if(w.week===27)return '<section class="card col12"><h2>Local Economic Reasoning Lab</h2><p>Test controlled market scenarios locally, record distributional effects and limitations, then compare the model with Week 27 historical evidence.</p><div class="actions"><a class="button secondary" href="weeks/week-27/economic-lab.html">Open Local Week 27 Lab</a></div></section>';return ''}
function weekHTML(w){
  const s=activeStudent();
  const readingText=w.readingSections.map(x=>`${x.heading}. ${x.text}`).join(' ');
  return `<div class="grid">
    <section class="card col12">
      <div class="pills"><span class="pill">Week ${w.week}</span><span class="pill">${esc(w.unit)}</span><span class="pill">${esc(w.period)}</span><span class="pill">${esc(w.regions)}</span></div>
      <h2>${esc(w.title)}</h2><div class="notice"><strong>Essential Question:</strong> ${esc(w.essentialQuestion)}</div>
      <div class="actions noPrint"><button id="speakReading">Read Weekly Text</button><button class="secondary" onclick="window.print()">Print Week Packet</button>
      <a class="button ghost" href="${packetPath(w)}">Open Standalone Packet</a></div>
      <p class="small">Standards: ${w.standards.map(x=>esc(x.code)).join(' · ')}</p>
    </section>
    <section class="card col8">
      <h2>Original Weekly Reading</h2>
      ${w.readingSections.map(r=>`<article class="readingSection"><h4>${esc(r.heading)}</h4><p>${esc(r.text)}</p></article>`).join('')}
      <div class="sourceBox"><h3>Source Study: ${esc(w.sourceStudy.title)}</h3><p>${esc(w.sourceStudy.context)}</p></div>
      <input type="hidden" id="readingText" value="${esc(readingText)}">
    </section>
    <aside class="card col4">
      <h3>Academic Vocabulary</h3><div class="vocabGrid">${Object.entries(w.vocabulary).map(([k,v])=>`<div class="vocabItem"><strong>${esc(k)}</strong>${esc(v)}</div>`).join('')}</div>
      <h3>Key Understandings</h3><ul>${w.keyUnderstandings.map(k=>`<li>${esc(k)}</li>`).join('')}</ul>
      <h3>Optional Resources</h3><ul>${w.resources.map((r,i)=>`<li><a href="${esc(r)}" target="_blank" rel="noopener">Supplemental resource ${i+1}</a></li>`).join('')}</ul>
    </aside>
    <section class="card col12"><h2>Five Daily Lessons</h2>${w.week===1?'<p>Read the complete source set and work one day at a time. Your assignment writing uses this learner’s course record.</p><a class="button" href="weeks/week-01/student-packet.html">Open Week 1 Daily Workspace</a>':w.dailyLessons.map((l,i)=>lessonBlock(w,l,i,s)).join('')}</section>
    ${localLabHTML(w)}
    <section class="card col12"><h2>Three Weekly Assignments</h2>${w.assignments.map(a=>assignmentBlock(w,a,s)).join('')}</section>
    ${quizHTML(w,s)}
    <section class="card col12"><h3>Teacher Notes for Week ${w.week}</h3>
      <p>Teacher guide, sample answers, scoring notes, accommodations, and the complete quiz key are included in <code>weeks/week-${String(w.week).padStart(2,'0')}/teacher-guide.html</code> and in the local evaluator dashboard (classroom passcode only).</p>
    </section>
  </div>`;
}
function scopeHTML(){
  return `<section class="card"><h2>36-Week Scope and Sequence</h2><p>The sequence moves from disciplinary foundations through early societies, regional worlds, early modern connections, revolution, industry, imperialism, global conflict, human rights, globalization, comparative government, and civic action.</p>
  <div class="tableWrap"><table><thead><tr><th>Week</th><th>Unit</th><th>Topic</th><th>Period / Region</th><th>Essential Question</th></tr></thead><tbody>
  ${COURSE.weeks.map(w=>`<tr><td><button class="secondary scopeWeek" data-week="${w.week}">${w.week}</button></td><td>${esc(w.unit)}</td><td>${esc(w.title)}</td><td>${esc(w.period)}<br><span class="small">${esc(w.regions)}</span></td><td>${esc(w.essentialQuestion)}</td></tr>`).join('')}
  </tbody></table></div></section>`;
}
function examsHTML(){
  const s=activeStudent(), ex=COURSE[examType], saved=s?.exams?.[examType]||{};
  return `<div class="grid">
    <section class="card col12">
      <h2>Midterm and Final Examinations</h2>
      <div class="actions"><button class="${examType==='midterm'?'':'secondary'} examType" data-type="midterm">Midterm</button>
      <button class="${examType==='final'?'':'secondary'} examType" data-type="final">Final</button>
      <a class="button ghost" href="assessments/${examType}.html">Open Printable Standalone Exam</a></div>
      <p>Recommended time: ${ex.recommendedMinutes} minutes. Objective questions are automatically scored. Constructed responses and the essay require teacher scoring.</p>
      ${saved.completed?`<p class="score">Best objective score: ${saved.bestScore}/${ex.multipleChoice.length*2} (${saved.bestPercent}%)</p>`:''}
    </section>
    <section class="card col12">
      <h3>${esc(ex.title)} — Multiple Choice</h3>
      ${ex.multipleChoice.map((q,qi)=>`<div class="quizQ"><p><strong>${qi+1}. ${esc(q.prompt)}</strong> <span class="small">(Week ${q.sourceWeek})</span></p>
        ${q.choices.map((ch,ci)=>`<label class="choice"><input type="radio" name="examq${qi}" value="${ci}" ${saved.answers?.[qi]===ci?'checked':''}> ${esc(ch)}</label>`).join('')}</div>`).join('')}
      <h3>Short Responses</h3>${ex.shortResponses.map((q,i)=>`<div class="quizQ"><p><strong>${i+1}. ${esc(q.prompt)}</strong></p><textarea id="short-${i}">${esc(saved.shortResponses?.[i]||'')}</textarea></div>`).join('')}
      <h3>Evidence-Based Essay</h3><div class="quizQ"><p>${esc(ex.essay.prompt)}</p><textarea id="examEssay" aria-label="Examination essay" style="min-height:260px">${esc(saved.essay||'')}</textarea></div>
      <div class="actions"><button id="submitExam">Score and Save ${examType==='midterm'?'Midterm':'Final'}</button><button class="secondary" id="saveExam">Save Draft</button></div>
      <div id="examResult"></div>
    </section>
  </div>`;
}
function reportData(s){
  const ls=lessonStats(s), as=assignmentStats(s), qs=quizStats(s);
  const mid=s?.exams?.midterm, fin=s?.exams?.final;
  return {ls,as,qs,mid,fin,overall:combinedProgress(s)};
}
function reportsHTML(){
  const s=activeStudent();
  if(!s) return `<section class="card"><h2>Reports</h2><p>Add a student to create a progress report.</p></section>`;
  const r=reportData(s);
  return `<section class="reportSheet" id="reportSheet">
    <h1>Khaemenes High</h1><h2>Grade 9 Global Studies Honors Progress Report</h2>
    <p><strong>Student:</strong> ${esc(s.name)}<br><strong>Report date:</strong> ${today()}<br><strong>Course code:</strong> ${esc(META.courseCode)} · 1 high-school credit</p>
    <table><tbody>
      <tr><th>Daily lessons</th><td>${r.ls.done} of 180 (${r.ls.percent}%)</td></tr>
      <tr><th>Assignments submitted</th><td>${r.as.submitted} of 108 (${r.as.percent}%)</td></tr>
      <tr><th>Weekly quizzes</th><td>${r.qs.completed} of 36 · objective average ${r.qs.completed?r.qs.avg+"%":"Pending"}</td></tr>
      <tr><th>Midterm objective score</th><td>${r.mid?.completed?`${r.mid.bestPercent}%`:'Not completed'}</td></tr>
      <tr><th>Final objective score</th><td>${r.fin?.completed?`${r.fin.bestPercent}%`:'Not completed'}</td></tr>
      <tr><th>Estimated completion</th><td>${r.overall}%</td></tr>
    </tbody></table>
    <h3>Standards and Skill Evidence</h3><p>Course work includes source analysis, corroboration, historical context, chronology, map interpretation, quantitative reasoning, economic analysis, comparative government, evidence-based writing, discussion, research, media literacy, and informed civic action.</p>
    <h3>Teacher Comment</h3><p>________________________________________________________________________________</p>
    <p>________________________________________________________________________________</p>
    <p style="margin-top:50px">Teacher signature: ________________________________ Date: __________________</p>
    <p class="small">This report documents work saved in this browser. Verify local district, umbrella-school, scholarship, or homeschool requirements before using it as an official transcript record.</p>
  </section>
  <div class="actions noPrint"><button onclick="window.print()">Print Report</button><button class="secondary" id="exportJSON">Export Full Backup</button><button class="secondary" id="exportCSV">Export Gradebook CSV</button><label class="button ghost" for="importFile">Import Backup</label><input class="hidden" type="file" id="importFile" accept=".json"></div>`;
}
function standardsHTML(){
  return `<div class="grid">
    <section class="card col12"><h2>Standards, Rigor, and Responsible Use</h2>
      <p>There is no single nationwide Grade 9 social studies course. This integrated program intentionally exceeds a narrow single-state survey by combining world history, geography, economics, civics, disciplinary literacy, media literacy, research, and civic action. It is designed for crosswalk and adaptation, not as a claim of automatic legal approval in every jurisdiction.</p>
      <div class="notice">Teachers and families should verify current local course-credit, required-instruction, recordkeeping, testing, and umbrella-school rules.</div></section>
    <section class="card col6"><h3>Inquiry and Disciplinary Practice</h3><ul>${[...new Map(c3Unique().map(x=>[x.code,x])).values()].map(x=>`<li><strong>${esc(x.code)}</strong> — ${esc(x.description)}</li>`).join('')}</ul></section>
    <section class="card col6"><h3>History/Social Studies Literacy</h3><ul>${[...new Map(litUnique().map(x=>[x.code,x])).values()].map(x=>`<li><strong>${esc(x.code)}</strong> — ${esc(x.description)}</li>`).join('')}</ul></section>
    <section class="card col12"><h3>Official and Professional Frameworks</h3><ul>${COURSE.frameworks.map(f=>`<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.name)}</a></li>`).join('')}</ul>
      <p>Detailed mapping is included in <code>docs/STANDARDS_CROSSWALK.md</code>.</p></section>
    <section class="card col12"><h3>Coursewide Performance Expectations</h3><ol>
      <li>Develop compelling and supporting questions.</li><li>Source, contextualize, corroborate, and interpret evidence.</li>
      <li>Explain causation, comparison, continuity, change, and historical significance.</li><li>Interpret maps, graphs, timelines, demographic data, budgets, and economic tradeoffs.</li>
      <li>Compare governmental institutions, rights protections, and systems of accountability.</li><li>Write and speak in defensible claims supported by evidence.</li>
      <li>Verify digital information, distinguish misinformation from disinformation, and document AI assistance.</li><li>Design a lawful, nonpartisan, evidence-based civic action project.</li>
    </ol></section>
  </div>`;
}
function c3Unique(){return COURSE.weeks.flatMap(w=>w.standards.filter(s=>s.code.startsWith('D')))}
function litUnique(){return COURSE.weeks.flatMap(w=>w.standards.filter(s=>s.code.startsWith('CCSS')))}
function wireView(){
  $$('[data-go]').forEach(b=>b.onclick=()=>setView(b.dataset.go));
  $('#continueBtn')?.addEventListener('click',()=>setWeek(currentWeek(activeStudent())));
  $('#readCourseBtn')?.addEventListener('click',()=>speak('Grade 9 Global Studies Honors integrates world history, geography, civics, economics, primary source analysis, media literacy, and informed civic action across thirty-six weeks.'));
  $$('.scopeWeek').forEach(b=>b.onclick=()=>setWeek(b.dataset.week));
  $$('.lessonCheck').forEach(ch=>ch.onchange=()=>{
    const s=activeStudent(); if(!s){ch.checked=false;return alert('Add a student first.');}
    s.completedLessons[selectedWeek] ||= [false,false,false,false,false];
    s.completedLessons[selectedWeek][+ch.dataset.index]=ch.checked; saveDB(); renderSidebarWeeks();
  });
  $$('.saveAssignment').forEach(b=>b.onclick=()=>saveAssignment(b.dataset.key,false));
  $$('.submitAssignment').forEach(b=>b.onclick=()=>saveAssignment(b.dataset.key,true));
  $('#speakReading')?.addEventListener('click',()=>speak($('#readingText')?.value||''));
  $('#saveQuiz')?.addEventListener('click',()=>saveQuiz(false));
  $('#submitQuiz')?.addEventListener('click',()=>saveQuiz(true));
  $$('.examType').forEach(b=>b.onclick=()=>{examType=b.dataset.type;render();});
  $('#saveExam')?.addEventListener('click',()=>saveExam(false));
  $('#submitExam')?.addEventListener('click',()=>saveExam(true));
  $('#exportJSON')?.addEventListener('click',exportJSON);
  $('#exportCSV')?.addEventListener('click',exportCSV);
  $('#importFile')?.addEventListener('change',importJSON);
}
function saveAssignment(key,submit){
  const s=activeStudent(); if(!s)return alert('Add a student first.');
  const ta=$(`[data-assignment="${key}"]`); const old=s.assignments[key]||{};
  s.assignments[key]={...old,text:ta.value,submitted:submit||old.submitted||false,updated:new Date().toLocaleString()};
  if(old.text!==ta.value){if(typeof old.score==='number')s.assignments[key].previousEvaluation={score:old.score,feedback:old.feedback||'',text:old.text||'',evaluatedAt:old.evaluatedAt||null};delete s.assignments[key].score;delete s.assignments[key].evaluatedAt;}
  saveDB(); const status=$(`#status-${key}`); if(status)status.textContent=`Saved ${s.assignments[key].updated}${s.assignments[key].submitted?' · Submitted':''}`;
  if(submit) render();
}
function collectAnswers(prefix,count){
  return Array.from({length:count},(_,i)=>{
    const x=$(`input[name="${prefix}${i}"]:checked`); return x?+x.value:null;
  });
}
function saveQuiz(scoreIt){
  const s=activeStudent(); if(!s)return alert('Add a student first.');
  const w=COURSE.weeks[selectedWeek-1], answers=collectAnswers('q',w.quiz.questions.length);
  const prev=s.quizzes[selectedWeek]||{};
  const next={...prev,answers,shortResponse:$('#quizShort').value,updated:new Date().toISOString()};
  if(next.shortResponse!==prev.shortResponse||scoreIt){delete next.shortScore;delete next.shortFeedback;delete next.shortEvaluatedAt;}
  if(scoreIt){
    let correct=0;
    w.quiz.questions.forEach((q,i)=>{
      const ok=answers[i]===q.answer; if(ok)correct++;
      const fb=$(`#fb-${i}`); if(fb)fb.innerHTML=`<div class="feedback ${ok?'good':'bad'}">${ok?'Correct.':'Review:'} ${esc(q.explanation)}</div>`;
    });
    const score=correct*2, percent=Math.round(score/20*100);
    next.score=score;next.percent=percent;next.attempts=(prev.attempts||0)+1;next.completed=true;
    next.bestScore=Math.max(prev.bestScore||0,score);next.bestPercent=Math.max(prev.bestPercent||0,percent);
    $('#quizResult').innerHTML=`<p class="score">Objective score: ${score}/20 (${percent}%)</p><p>Best: ${next.bestScore}/20 · Attempts: ${next.attempts}</p>`;
  }
  s.quizzes[selectedWeek]=next;saveDB();
}
function saveExam(scoreIt){
  const s=activeStudent();if(!s)return alert('Add a student first.');
  const ex=COURSE[examType], prev=s.exams[examType]||{}, answers=collectAnswers('examq',ex.multipleChoice.length);
  const next={...prev,answers,shortResponses:ex.shortResponses.map((_,i)=>$(`#short-${i}`).value),essay:$('#examEssay').value,updated:new Date().toISOString()};
  if(scoreIt||next.essay!==prev.essay||JSON.stringify(next.shortResponses)!==JSON.stringify(prev.shortResponses)||JSON.stringify(next.answers)!==JSON.stringify(prev.answers)){delete next.writtenPercent;delete next.teacherPercent;delete next.totalPercent;delete next.evaluatedAt;}
  if(scoreIt){
    const correct=ex.multipleChoice.reduce((n,q,i)=>n+(answers[i]===q.answer?1:0),0), score=correct*2, total=ex.multipleChoice.length*2, percent=Math.round(score/total*100);
    next.score=score;next.percent=percent;next.attempts=(prev.attempts||0)+1;next.completed=true;
    next.bestScore=Math.max(prev.bestScore||0,score);next.bestPercent=Math.max(prev.bestPercent||0,percent);
    $('#examResult').innerHTML=`<p class="score">Objective score: ${score}/${total} (${percent}%)</p><p>Constructed responses and essay await teacher scoring.</p>`;
  }
  s.exams[examType]=next;saveDB();
}
function speak(text){
  if(!('speechSynthesis'in window))return alert('Read-aloud is not supported in this browser.');
  speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.rate=.94;u.pitch=1;speechSynthesis.speak(u);
}
function download(name,content,type='application/octet-stream'){
  const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);
}
function exportJSON(){download(`grade09-social-studies-backup-${today()}.json`,JSON.stringify({...window.KhaemenesSS9Records.exportDB(db),visibleDrafts:[...document.querySelectorAll('textarea')].map(f=>({id:f.id,value:f.value}))},null,2),'application/json')}
function exportCSV(){
  const rows=[['Student','Lessons','Assignments','Quizzes','Quiz Average','Midterm %','Final %','Estimated Completion %']];
  db.students.forEach(s=>{const r=reportData(s);rows.push([s.name,r.ls.done,r.as.submitted,r.qs.completed,r.qs.avg,r.mid?.bestPercent??'',r.fin?.bestPercent??'',r.overall])});
  const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
  download(`grade09-social-studies-gradebook-${today()}.csv`,csv,'text/csv');
}
function importJSON(e){
  const f=e.target.files[0];if(!f)return;const reader=new FileReader();
  reader.onload=()=>{try{if(f.size>8*1024*1024)throw new Error('Backup is too large');const next=window.KhaemenesSS9Records.importDB(JSON.parse(reader.result));window.KhaemenesSS9Records.storage.setItem(KEY,JSON.stringify(next));db=next;renderStudentControls();renderSidebarWeeks();render();alert('Backup imported.');}catch(err){alert('Could not import this backup: '+err.message);}};
  reader.readAsText(f);
}
function applySettings(){
  document.body.classList.toggle('light',db.settings?.theme==='light');
  document.documentElement.style.fontSize=`${db.settings?.fontScale||100}%`;
}
function wireGlobal(){
  $('#heroContinueBtn')?.addEventListener('click',()=>setWeek(currentWeek(activeStudent())));
  $('#heroReadCourseBtn')?.addEventListener('click',()=>speak('Work at your own pace. Follow the lessons in order and preserve your evidence.'));
  if(window.KhaemenesSS9Records.profile){['studentName','addStudentBtn','demoBtn','deleteStudentBtn'].forEach(id=>{$('#'+id).hidden=true;});$('#studentSelect').disabled=true;}

  $$('.navBtn,.tab').forEach(b=>b.onclick=()=>setView(b.dataset.view));
  $('#addStudentBtn').onclick=()=>{const n=$('#studentName').value.trim();if(!n)return;createStudent(n);$('#studentName').value='';renderStudentControls();renderSidebarWeeks();render();};
  $('#demoBtn').onclick=()=>{demoStudent();renderStudentControls();renderSidebarWeeks();render();};
  $('#deleteStudentBtn').onclick=()=>{const s=activeStudent();if(!s)return;if(confirm(`Delete local records for ${s.name}?`)){db.students=db.students.filter(x=>x.id!==s.id);db.activeId=db.students[0]?.id||null;saveDB();renderStudentControls();renderSidebarWeeks();render();}};
  $('#studentSelect').onchange=e=>{db.activeId=e.target.value||null;saveDB();renderSidebarWeeks();render();};
  $('#themeBtn').onclick=()=>{db.settings.theme=db.settings.theme==='light'?'dark':'light';saveDB();applySettings();};
  $('#fontUp').onclick=()=>{db.settings.fontScale=Math.min(130,(db.settings.fontScale||100)+5);saveDB();applySettings();};
  $('#fontDown').onclick=()=>{db.settings.fontScale=Math.max(85,(db.settings.fontScale||100)-5);saveDB();applySettings();};
}
renderStudentControls();renderSidebarWeeks();wireGlobal();render();
if('serviceWorker'in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('service-worker.js?v=20261007').catch(()=>{});
})();

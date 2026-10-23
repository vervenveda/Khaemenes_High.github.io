(() => {
'use strict';
const COURSE=window.KHAEMENES_SOCIAL_STUDIES_DATA;
const META=COURSE.metadata, KEY=META.storageKey;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const uid=()=>`s_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`;
const stamp=()=>new Date().toLocaleString();
let selectedWeek=Math.max(1,Math.min(36,Number(new URLSearchParams(location.search).get('week'))||1));
let view='dashboard';

function freshDB(){return{version:1,activeId:null,students:[],settings:{theme:'dark',fontScale:100}}}
function loadDB(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&Array.isArray(x.students))return Object.assign(freshDB(),x)}catch(e){}return freshDB()}
let db=loadDB();
function saveDB(){localStorage.setItem(KEY,JSON.stringify(db))}
function normalize(s){s.completedLessons||={};s.assignments||={};s.quizzes||={};s.exams||={};s.journal||={};s.attendance||={};return s}
function activeStudent(){return db.students.find(s=>s.id===db.activeId)||null}
function createStudent(name){const s=normalize({id:uid(),name:name.trim(),created:new Date().toISOString().slice(0,10)});db.students.push(s);db.activeId=s.id;saveDB();return s}
function demoStudent(){
 const s=createStudent('Demo Scholar');
 COURSE.weeks.slice(0,3).forEach(w=>{
   s.completedLessons[w.week]=[true,true,true,true,true];
   w.assignments.forEach(a=>s.assignments[`${w.week}-${a.number}`]={text:'Demonstration response saved for portal testing.',submitted:true,score:a.points,updated:stamp()});
   s.quizzes[w.week]={answers:w.quiz.questions.map(q=>q.answer),score:20,bestScore:20,percent:100,bestPercent:100,attempts:1,completed:true,shortResponse:'Demonstration evidence-based response.'};
 });
 saveDB();
}
function lessonStats(s){let done=0;if(s)Object.values(s.completedLessons||{}).forEach(a=>done+=a.filter(Boolean).length);return{done,total:180,percent:Math.round(done/180*100)}}
function assignmentStats(s){const arr=s?Object.values(s.assignments||{}):[];const submitted=arr.filter(a=>a.submitted).length;let earned=0,possible=0;arr.forEach(a=>{if(Number.isFinite(+a.score)){earned+=+a.score;possible+=30}});return{submitted,total:108,percent:Math.round(submitted/108*100),earned,possible}}
function quizStats(s){const arr=s?Object.values(s.quizzes||{}).filter(q=>q.completed):[];return{completed:arr.length,total:36,avg:arr.length?Math.round(arr.reduce((n,q)=>n+(q.bestPercent??q.percent??0),0)/arr.length):0}}
function overall(s){if(!s)return 0;const l=lessonStats(s).percent,a=assignmentStats(s).percent,q=Math.round(quizStats(s).completed/36*100);return Math.round(l*.35+a*.40+q*.25)}
function weekMastered(s,w){
 if(!s)return false;
 const lessons=(s.completedLessons?.[w.week]||[]).filter(Boolean).length===5;
 const assignments=w.assignments.every(a=>s.assignments?.[`${w.week}-${a.number}`]?.submitted);
 const quiz=s.quizzes?.[w.week];
 const quizMastery=!!quiz?.completed&&(quiz.bestPercent??quiz.percent??0)>=80&&String(quiz.shortResponse||'').trim().length>0;
 if(!lessons||!assignments||!quizMastery)return false;
 if(w.week===18&&(s.exams?.midterm?.bestPercent??0)<80)return false;
 return true;
}
function currentWeek(s){if(!s)return 1;for(const w of COURSE.weeks){if(!weekMastered(s,w))return w.week}return 36}
function setView(v){view=v;$$('.navBtn,.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===v));render()}
function setWeek(n){
 const requested=Math.max(1,Math.min(36,+n)),unlocked=currentWeek(activeStudent());
 if(requested>unlocked){alert(`Week ${requested} is locked. Complete Week ${unlocked}: five lessons, three submitted assignments, the constructed response, and the weekly quiz at 80%+. Week 19 also requires the midterm at 80%+.`);selectedWeek=unlocked;}
 else selectedWeek=requested;
 view='week';history.replaceState(null,'',`?week=${selectedWeek}`);renderSidebarWeeks();render();scrollTo({top:0,behavior:'smooth'})
}
function renderStudentControls(){
 const s=$('#studentSelect');
 s.innerHTML=db.students.length?db.students.map(x=>`<option value="${x.id}" ${x.id===db.activeId?'selected':''}>${esc(x.name)}</option>`).join(''):'<option value="">No student added</option>';
}
function renderSidebarWeeks(){
 const s=activeStudent(),unlocked=currentWeek(s);
 $('#weekList').innerHTML=COURSE.weeks.map(w=>{const locked=!!s&&w.week>unlocked;return `<button class="weekBtn ${selectedWeek===w.week?'active':''} ${locked?'locked':''}" data-week="${w.week}" ${locked?'disabled aria-disabled="true"':''}><span><strong>Week ${w.week}</strong><br><small>${esc(w.title)}</small></span><span>${locked?'🔒':(s?.completedLessons?.[w.week]||[]).filter(Boolean).length+'/5'}</span></button>`}).join('');
 $('#weekList .weekBtn:not([disabled])').forEach(b=>b.onclick=()=>setWeek(b.dataset.week));
}
function render(){
 applySettings();
 const c=$('#content');
 if(view==='dashboard')c.innerHTML=dashboardHTML();
 if(view==='week')c.innerHTML=weekHTML(COURSE.weeks[selectedWeek-1]);
 if(view==='scope')c.innerHTML=scopeHTML();
 if(view==='exams')c.innerHTML=examsHTML();
 if(view==='reports')c.innerHTML=reportsHTML();
 if(view==='standards')c.innerHTML=standardsHTML();
 wireView();
}
function dashboardHTML(){
 const s=activeStudent(),ls=lessonStats(s),as=assignmentStats(s),qs=quizStats(s),pct=overall(s),cw=currentWeek(s);
 return `<div class="grid">
 <section class="card col12"><h2>${s?`Welcome, ${esc(s.name)}`:'Welcome to United States History Honors'}</h2>
 <p>${s?'Continue the evidence-based study of American history and constitutional development.':'Add a student in the sidebar to record progress in this browser.'}</p>
 <div class="progress"><span style="width:${pct}%"></span></div><p class="small">Estimated course completion: ${pct}%</p>
 <div class="actions"><button id="continueBtn">Continue Week ${cw}</button><button class="secondary" data-go="scope">View 36-Week Scope</button><a class="button ghost" href="docs/COURSE_RATIONALE.md">Read Course Rationale</a></div></section>
 <section class="card col3 kpi"><strong>${ls.done}/180</strong><span>Daily lessons completed</span></section>
 <section class="card col3 kpi"><strong>${as.submitted}/108</strong><span>Assignments submitted</span></section>
 <section class="card col3 kpi"><strong>${qs.completed}/36</strong><span>Weekly quizzes completed</span></section>
 <section class="card col3 kpi"><strong>${qs.avg}%</strong><span>Quiz average</span></section>
 <section class="card col8"><h3>Course Architecture</h3><div class="tableWrap"><table><thead><tr><th>Component</th><th>Total</th><th>Purpose</th></tr></thead><tbody>
 <tr><td>Daily lessons</td><td>180</td><td>Five-day inquiry rhythm across 36 weeks</td></tr>
 <tr><td>Principal assignments</td><td>108</td><td>Source analysis, map/data reasoning, and argumentation</td></tr>
 <tr><td>Weekly quizzes</td><td>36</td><td>Ten definitive-response questions plus a constructed response</td></tr>
 <tr><td>Major examinations</td><td>2</td><td>Stimulus-based midterm and cumulative final</td></tr>
 <tr><td>Civic capstone</td><td>1</td><td>Nonpartisan investigation of a public problem</td></tr></tbody></table></div></section>
 <section class="card dark col4"><h3>Weekly Rhythm</h3><ol><li>Monday: frame time, place, and inquiry.</li><li>Tuesday: source and corroborate.</li><li>Wednesday: map, measure, and model.</li><li>Thursday: deliberate and write.</li><li>Friday: synthesize, assess, and correct.</li></ol><p class="small">Every week includes an original reading, vocabulary, source study, three assignments, supports, honors extensions, and a retake-ready quiz.</p></section>
 <section class="card col12"><h3>Academic Integrity and Responsible AI Use</h3><p>Students may use approved tools to brainstorm questions, define terms, or receive feedback. Submitted work must represent the student’s own reasoning. Every AI-assisted factual claim, quotation, statistic, and citation must be verified against a trustworthy original source. Invented citations receive no evidence credit.</p></section>
 </div>`;
}
function lessonBlock(w,l,i,s){
 const checked=!!s?.completedLessons?.[w.week]?.[i];
 return `<article class="lesson"><div class="lessonHeader"><div><span class="pill">${l.day} · ${l.minutes} min</span><h3>${esc(l.title)}</h3></div><label class="checkline"><input type="checkbox" class="lessonCheck" data-index="${i}" ${checked?'checked':''}> Complete</label></div>
 <p><strong>Objective:</strong> ${esc(l.objective)}</p><details><summary>Warm-up</summary><p>${esc(l.warmup)}</p></details><details open><summary>Daily lesson</summary><p>${esc(l.instruction)}</p></details><details><summary>Guided practice</summary><p>${esc(l.guidedPractice)}</p></details><details><summary>Independent practice</summary><p>${esc(l.independentPractice)}</p></details><details><summary>Check for understanding</summary><p>${esc(l.checkForUnderstanding)}</p></details><details><summary>Materials, support, and honors extension</summary><p><strong>Materials:</strong> ${l.materials.map(esc).join('; ')}</p><p><strong>Support:</strong> ${esc(l.support)}</p><p><strong>Honors:</strong> ${esc(l.extension)}</p></details></article>`;
}
function assignmentBlock(w,a,s){
 const key=`${w.week}-${a.number}`,sv=s?.assignments?.[key]||{};
 return `<article class="assignment"><span class="pill">Assignment ${a.number} · ${a.points} points</span><h3>${esc(a.title)}</h3><p><strong>${esc(a.type)}</strong></p><p>${esc(a.instructions)}</p><ul>${a.deliverables.map(d=>`<li>${esc(d)}</li>`).join('')}</ul>
 <label>Student response or teacher note</label><textarea data-assignment="${key}" placeholder="Write or paste the response here. A printed attachment may also be submitted.">${esc(sv.text||'')}</textarea>
 <div class="actions"><button class="saveAssignment" data-key="${key}">Save Draft</button><button class="secondary submitAssignment" data-key="${key}">${sv.submitted?'Submitted ✓':'Mark Submitted'}</button></div>
 <p class="small" id="status-${key}">${sv.updated?`Last saved ${esc(sv.updated)}`:'Not yet saved'}${sv.score!==undefined?` · Teacher score: ${esc(sv.score)}`:''}</p>
 <details><summary>Four-part rubric</summary>${Object.entries(a.rubric).map(([k,v])=>`<p><strong>${esc(k)}:</strong> ${esc(v)}</p>`).join('')}</details></article>`;
}
function quizHTML(w,s){
 const sv=s?.quizzes?.[w.week]||{};
 return `<section class="card col12" id="weeklyQuiz"><h2>${esc(w.quiz.title)}</h2><p>Ten automatically scored questions (20 points) and one teacher-scored constructed response (5 points). Retakes are permitted; the best objective score is retained.</p>
 ${w.quiz.questions.map((q,qi)=>`<div class="quizQ"><p><strong>${qi+1}. ${esc(q.prompt)}</strong></p>${q.choices.map((ch,ci)=>`<label class="choice"><input type="radio" name="q${qi}" value="${ci}" ${sv.answers?.[qi]===ci?'checked':''}> ${esc(ch)}</label>`).join('')}<div id="fb-${qi}"></div></div>`).join('')}
 <div class="quizQ"><p><strong>Constructed Response.</strong> ${esc(w.quiz.shortResponse.prompt)}</p><textarea id="quizShort">${esc(sv.shortResponse||'')}</textarea></div>
 <div class="actions"><button id="submitQuiz">Score Objective Questions</button><button class="secondary" id="saveQuiz">Save Without Scoring</button></div>
 <div id="quizResult">${sv.completed?`<p class="score">Best objective score: ${sv.bestScore}/20 (${sv.bestPercent}%)</p><p class="small">Attempts: ${sv.attempts||1}</p>`:''}</div></section>`;
}
function weekHTML(w){
 const s=activeStudent(),reading=w.readingSections.map(x=>`${x.heading}. ${x.text}`).join(' ');
 return `<div class="grid"><section class="card col12"><div class="pills"><span class="pill">Week ${w.week}</span><span class="pill">${esc(w.unit)}</span><span class="pill">${esc(w.period)}</span><span class="pill">${esc(w.regions)}</span></div><h2>${esc(w.title)}</h2><div class="notice"><strong>Essential Question:</strong> ${esc(w.essentialQuestion)}</div><div class="actions noPrint"><button id="speakReading">Read Weekly Text</button><button class="secondary" onclick="window.print()">Print Week</button><a class="button ghost" href="weeks/week-${String(w.week).padStart(2,'0')}/student-packet.html">Standalone Packet</a></div><p class="small">Standards: ${w.standards.map(x=>esc(x.code)).join(' · ')}</p></section>
 <section class="card col8"><h2>Original Weekly Reading</h2>${w.readingSections.map(r=>`<article class="readingSection"><h4>${esc(r.heading)}</h4><p>${esc(r.text)}</p></article>`).join('')}<div class="sourceBox"><h3>Source Study: ${esc(w.sourceStudy.title)}</h3><p>${esc(w.sourceStudy.context)}</p></div><input type="hidden" id="readingText" value="${esc(reading)}"></section>
 <aside class="card col4"><h3>Academic Vocabulary</h3><div class="vocabGrid">${Object.entries(w.vocabulary).map(([k,v])=>`<div class="vocabItem"><strong>${esc(k)}</strong>${esc(v)}</div>`).join('')}</div><h3>Key Understandings</h3><ul>${w.keyUnderstandings.map(k=>`<li>${esc(k)}</li>`).join('')}</ul><h3>Optional Official Resources</h3><ul>${w.resources.map((r,i)=>`<li><a href="${esc(r)}" target="_blank" rel="noopener">Resource ${i+1}</a></li>`).join('')}</ul></aside>
 <section class="card col12"><h2>Daily Lessons</h2>${w.dailyLessons.map((l,i)=>lessonBlock(w,l,i,s)).join('')}</section>
 <section class="card col12"><h2>Principal Assignments</h2>${w.assignments.map(a=>assignmentBlock(w,a,s)).join('')}</section>${quizHTML(w,s)}</div>`;
}
function scopeHTML(){
 const groups={};COURSE.weeks.forEach(w=>(groups[w.unit]??=[]).push(w));
 return `<section class="card"><h2>36-Week Scope and Sequence</h2><p>The course deliberately gives the largest share of time to Reconstruction through the present while retaining a concise foundation from 1491 through the Civil War.</p>${Object.entries(groups).map(([u,ws])=>`<div class="scopeUnit"><h3>${esc(u)}</h3>${ws.map(w=>`<div class="scopeWeek"><strong>Week ${w.week}</strong><div><strong>${esc(w.title)}</strong><br><span class="small">${esc(w.period)} · ${esc(w.essentialQuestion)}</span></div><button class="secondary" data-week="${w.week}">Open</button></div>`).join('')}</div>`).join('')}</section>`;
}
function examsHTML(){
 return `<div class="grid"><section class="card col6"><h2>Midterm Examination</h2><p>Covers Weeks 1–18: foundations through the New Deal. Includes 50 objective questions, short responses, and source-based analysis.</p><a class="button" href="assessments/midterm.html">Open Midterm</a></section><section class="card col6"><h2>Cumulative Final</h2><p>Covers all 36 weeks with emphasis on Reconstruction to the present, constitutional development, and historical reasoning.</p><a class="button" href="assessments/final.html">Open Final</a></section><section class="card col12"><h3>Correction and Reassessment</h3><p>Use the correction form after quizzes or examinations. Students must identify the original error, provide the correct answer, cite evidence, and explain the reasoning change.</p><a class="button secondary" href="assessments/correction-form.html">Open Correction Form</a></section></div>`;
}
function reportsHTML(){
 const s=activeStudent();if(!s)return`<section class="card"><h2>Reports and Backups</h2><p>Add or select a student to create a report.</p></section>`;
 const ls=lessonStats(s),as=assignmentStats(s),qs=quizStats(s),pct=overall(s);
 return `<div class="grid"><section class="card col12" id="printReport"><div class="reportHeader"><div class="eyebrow" style="color:#775e2b">Khaemenes High</div><h2>Grade 10 United States History Honors Progress Report</h2><p><strong>Student:</strong> ${esc(s.name)} · <strong>Date:</strong> ${new Date().toLocaleDateString()}</p></div>
 <div class="tableWrap"><table><tbody><tr><th>Daily lessons</th><td>${ls.done}/180 (${ls.percent}%)</td></tr><tr><th>Assignments submitted</th><td>${as.submitted}/108 (${as.percent}%)</td></tr><tr><th>Weekly quizzes</th><td>${qs.completed}/36 · average ${qs.avg}%</td></tr><tr><th>Estimated completion</th><td>${pct}%</td></tr><tr><th>Midterm</th><td>${s.exams?.midterm?.percent??'Not recorded'}</td></tr><tr><th>Final</th><td>${s.exams?.final?.percent??'Not recorded'}</td></tr></tbody></table></div>
 <h3>Weekly Record</h3><div class="tableWrap"><table><thead><tr><th>Week</th><th>Lessons</th><th>Assignments</th><th>Quiz best</th></tr></thead><tbody>${COURSE.weeks.map(w=>`<tr><td>${w.week}. ${esc(w.title)}</td><td>${(s.completedLessons?.[w.week]||[]).filter(Boolean).length}/5</td><td>${w.assignments.filter(a=>s.assignments?.[`${w.week}-${a.number}`]?.submitted).length}/3</td><td>${s.quizzes?.[w.week]?.bestPercent!==undefined?s.quizzes[w.week].bestPercent+'%':'—'}</td></tr>`).join('')}</tbody></table></div></section>
 <section class="card col12 noPrint"><div class="actions"><button onclick="window.print()">Print Report</button><button class="secondary" id="exportBtn">Export Student Backup</button><label class="button ghost" style="cursor:pointer">Import Backup<input type="file" id="importFile" accept=".json" hidden></label></div></section></div>`;
}
function standardsHTML(){
 return `<div class="grid"><section class="card col12"><h2>Standards and Research Basis</h2><p>The portal uses a standards-overlay approach: one coherent universal course, with Florida content requirements, C3 inquiry practices, grades 9–10 disciplinary literacy, AP-style honors skills, and an international evidence-analysis overlay.</p><div class="tableWrap"><table><thead><tr><th>Framework</th><th>Role</th></tr></thead><tbody>${COURSE.frameworks.map(f=>`<tr><td><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.name)}</a></td><td>${esc(frameworkRole(f.name))}</td></tr>`).join('')}</tbody></table></div></section>
 <section class="card col6"><h3>Historical Thinking</h3><ul><li>Developments and processes</li><li>Sourcing and situation</li><li>Claims and evidence</li><li>Contextualization</li><li>Comparison, causation, continuity and change</li><li>Argumentation</li></ul></section>
 <section class="card col6"><h3>Required-Inclusion Audit</h3><ul><li>Constitution and founding documents</li><li>African American history from African heritage and slavery through the present</li><li>Holocaust education</li><li>Asian American and Pacific Islander history</li><li>Hispanic and women’s contributions</li><li>Florida history in each major era</li><li>History of communism and democratic comparison</li><li>Media, misinformation, and civic literacy</li></ul></section>
 <section class="card col12"><div class="notice"><strong>Important:</strong> No single locally authored course can guarantee acceptance by every state, nation, district, accreditor, or examination board. The included crosswalk documents the intended alignment and makes local review possible.</div></section></div>`;
}
function frameworkRole(name){
 if(name.includes('Florida'))return'Primary state content and required-instruction overlay.';
 if(name.includes('C3'))return'Inquiry Arc, disciplinary reasoning, evidence, communication, and civic action.';
 if(name.includes('Common Core'))return'Reading and writing in history/social studies for grades 9–10.';
 if(name.includes('AP United'))return'Honors extension through historical thinking skills and broad thematic coverage; not an AP-authorized course claim.';
 if(name.includes('Cambridge'))return'International evidence interpretation and structured historical explanation; not an exam-entry claim.';
 return'Supporting framework.';
}
function wireView(){
 $$('[data-go]').forEach(b=>b.onclick=()=>setView(b.dataset.go));
 $$('[data-week]').forEach(b=>b.onclick=()=>setWeek(b.dataset.week));
 $('#continueBtn')?.addEventListener('click',()=>setWeek(currentWeek(activeStudent())));
 $$('.lessonCheck').forEach(ch=>ch.onchange=()=>{const s=activeStudent();if(!s){alert('Add a student first.');ch.checked=false;return}const arr=s.completedLessons[selectedWeek]||[false,false,false,false,false];arr[+ch.dataset.index]=ch.checked;s.completedLessons[selectedWeek]=arr;saveDB();renderSidebarWeeks()});
 $$('.saveAssignment').forEach(b=>b.onclick=()=>saveAssignment(b.dataset.key,false));
 $$('.submitAssignment').forEach(b=>b.onclick=()=>saveAssignment(b.dataset.key,true));
 $('#submitQuiz')?.addEventListener('click',()=>scoreQuiz(true));
 $('#saveQuiz')?.addEventListener('click',()=>scoreQuiz(false));
 $('#speakReading')?.addEventListener('click',()=>{if(!('speechSynthesis'in window))return alert('Text-to-speech is unavailable in this browser.');speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance($('#readingText').value))});
 $('#exportBtn')?.addEventListener('click',exportBackup);
 $('#importFile')?.addEventListener('change',importBackup);
}
function saveAssignment(key,submit){
 const s=activeStudent();if(!s)return alert('Add a student first.');
 const ta=$(`[data-assignment="${key}"]`),prev=s.assignments[key]||{};
 s.assignments[key]={...prev,text:ta.value,submitted:submit||prev.submitted||false,updated:stamp()};saveDB();render();
}
function scoreQuiz(doScore){
 const s=activeStudent();if(!s)return alert('Add a student first.');
 const w=COURSE.weeks[selectedWeek-1],answers=w.quiz.questions.map((q,i)=>{const x=$(`input[name="q${i}"]:checked`);return x?+x.value:null});
 const prev=s.quizzes[w.week]||{},base={...prev,answers,shortResponse:$('#quizShort').value};
 if(doScore){
   let correct=0;
   w.quiz.questions.forEach((q,i)=>{const ok=answers[i]===q.answer;if(ok)correct++;const fb=$(`#fb-${i}`);fb.innerHTML=`<p class="${ok?'good':'bad'}">${ok?'Correct':'Review'}: ${esc(q.explanation)}</p>`});
   const score=correct*2,percent=Math.round(correct/10*100);
   base.score=score;base.percent=percent;base.bestScore=Math.max(prev.bestScore||0,score);base.bestPercent=Math.max(prev.bestPercent||0,percent);base.attempts=(prev.attempts||0)+1;base.completed=true;
 }
 s.quizzes[w.week]=base;saveDB();render();
}
function exportBackup(){
 const s=activeStudent();if(!s)return;
 const blob=new Blob([JSON.stringify({course:META.courseCode,version:1,student:s},null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${s.name.replace(/[^a-z0-9]+/gi,'_')}_grade10_us_history_backup.json`;a.click();URL.revokeObjectURL(a.href);
}
function importBackup(e){
 const f=e.target.files[0];if(!f)return;const rd=new FileReader();
 rd.onload=()=>{try{const x=JSON.parse(rd.result);if(!x.student?.name)throw Error();const s=normalize(x.student);s.id=uid();db.students.push(s);db.activeId=s.id;saveDB();renderStudentControls();renderSidebarWeeks();render();}catch(err){alert('That file is not a valid Grade 10 student backup.')}};
 rd.readAsText(f);
}
function applySettings(){
 document.documentElement.style.setProperty('--font-scale',db.settings.fontScale/100);
 document.documentElement.classList.toggle('light',db.settings.theme==='light');
}
function init(){
 renderStudentControls();renderSidebarWeeks();render();
 $('#studentSelect').onchange=e=>{db.activeId=e.target.value||null;saveDB();renderSidebarWeeks();render()};
 $('#addStudentBtn').onclick=()=>{const n=$('#studentName').value.trim();if(!n)return;createStudent(n);$('#studentName').value='';renderStudentControls();renderSidebarWeeks();render()};
 $('#demoBtn').onclick=()=>{demoStudent();renderStudentControls();renderSidebarWeeks();render()};
 $('#deleteStudentBtn').onclick=()=>{const s=activeStudent();if(!s)return;if(confirm(`Delete ${s.name}'s local record?`)){db.students=db.students.filter(x=>x.id!==s.id);db.activeId=db.students[0]?.id||null;saveDB();renderStudentControls();renderSidebarWeeks();render()}};
 $$('.navBtn,.tab').forEach(b=>b.onclick=()=>setView(b.dataset.view));
 $('#themeBtn').onclick=()=>{db.settings.theme=db.settings.theme==='dark'?'light':'dark';saveDB();render()};
 $('#fontDown').onclick=()=>{db.settings.fontScale=Math.max(85,db.settings.fontScale-5);saveDB();applySettings()};
 $('#fontUp').onclick=()=>{db.settings.fontScale=Math.min(130,db.settings.fontScale+5);saveDB();applySettings()};
}
init();
})();
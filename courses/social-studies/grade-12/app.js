(() => {
'use strict';
const COURSE=window.KHAEMENES_GRADE12_DATA;
const META=COURSE.metadata, KEY=META.storageKey;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const uid=()=>`s12_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`;
const today=()=>new Date().toISOString().slice(0,10);
const stamp=()=>new Date().toLocaleString();
let view='dashboard';
let selectedWeek=Math.max(1,Math.min(36,Number(new URLSearchParams(location.search).get('week'))||1));

function freshDB(){return{version:1,activeId:null,students:[],settings:{theme:'dark',fontScale:100}}}
function loadDB(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&Array.isArray(x.students))return Object.assign(freshDB(),x)}catch(e){}return freshDB()}
let db=loadDB();
function saveDB(){localStorage.setItem(KEY,JSON.stringify(db))}
function normalize(s){
 s.completedLessons||={};s.assignments||={};s.quizzes||={};s.major||={};s.capstone||={};s.weekApprovals||={};s.journal||={};
 s.teacher=Object.assign({hours:0,integrity:false,evaluator:false,issued:false,issuedDate:'',notes:''},s.teacher||{});
 return s;
}
db.students.forEach(normalize);
function activeStudent(){return db.students.find(s=>s.id===db.activeId)||null}
function createStudent(name){const s=normalize({id:uid(),name:name.trim(),created:today()});db.students.push(s);db.activeId=s.id;saveDB();return s}
function demoStudent(){
 const s=createStudent('Demo Senior Scholar');
 COURSE.weeks.slice(0,4).forEach(w=>{
  s.completedLessons[w.week]=[true,true,true,true,true];
  w.assignments.forEach(a=>s.assignments[`${w.week}-${a.number}`]={text:'Demonstration response with a claim, evidence, limitation, and revision condition.',submitted:true,updated:stamp()});
  s.quizzes[w.week]={answers:w.quiz.questions.map(q=>q.answer),score:10,percent:100,bestPercent:100,attempts:1,completed:true,shortResponse:'Demonstration constructed response.'};
 });
 saveDB();
}
const pct=(n,d)=>d?Math.round(n/d*100):0;
function lessonStats(s){let done=0;if(s)Object.values(s.completedLessons||{}).forEach(a=>done+=a.filter(Boolean).length);return{done,total:180,percent:pct(done,180)}}
function assignmentStats(s){const arr=s?Object.values(s.assignments||{}):[];const submitted=arr.filter(a=>a.submitted).length;return{submitted,total:108,percent:pct(submitted,108)}}
function quizStats(s,from=1,to=36){
 const vals=[];if(s)for(let w=from;w<=to;w++){const q=s.quizzes?.[w];if(q?.completed)vals.push(q.bestPercent??q.percent??0)}
 return{completed:vals.length,total:to-from+1,avg:vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0,mastered:vals.filter(x=>x>=META.weeklyMastery).length};
}
function majorStats(s,from=1,to=36){
 const req=COURSE.majorAssessments.filter(m=>m.week>=from&&m.week<=to), vals=[];
 req.forEach(m=>{const x=s?.major?.[m.id];if(Number.isFinite(+x?.score))vals.push(+x.score)});
 return{completed:vals.length,total:req.length,avg:vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0,required:req};
}
function semesterGrade(s,from,to){
 const q=quizStats(s,from,to),m=majorStats(s,from,to);
 if(!q.completed&&!m.completed)return 0;
 if(!m.completed)return q.avg;
 if(!q.completed)return m.avg;
 return Math.round(q.avg*.4+m.avg*.6);
}
function overallGrade(s){
 if(!s)return 0;
 const q=quizStats(s).avg, a=assignmentStats(s).percent;
 let earned=0,weights=0;
 COURSE.majorAssessments.forEach(m=>{const score=+s.major?.[m.id]?.score;if(Number.isFinite(score)){earned+=score*m.weight;weights+=m.weight}});
 const maj=weights?earned/weights:0;
 return Math.round(q*.15+a*.15+maj*.70);
}
function currentWeek(s){if(!s)return 1;for(const w of COURSE.weeks){if((s.completedLessons[w.week]||[]).filter(Boolean).length<5)return w.week}return 36}

function gateAudit(s,includeIssue=true){
 const ls=lessonStats(s),as=assignmentStats(s),qs=quizStats(s),s1=semesterGrade(s,1,18),s2=semesterGrade(s,19,36),ov=overallGrade(s);
 const allQuizMastery=!!s&&COURSE.weeks.every(w=>(s.quizzes?.[w.week]?.bestPercent??0)>=META.weeklyMastery);
 const majors=COURSE.majorAssessments.map(m=>({m,score:+s?.major?.[m.id]?.score||0,pass:(+s?.major?.[m.id]?.score||0)>=m.threshold,submitted:!!s?.major?.[m.id]?.submitted}));
 const allMajors=majors.every(x=>x.pass&&x.submitted);
 const cps=COURSE.capstoneCheckpoints.map(c=>({c,pass:!!s?.capstone?.[c.id]?.approved}));
 const allCps=cps.every(x=>x.pass);
 const approvedWeeks=COURSE.weeks.filter(w=>s?.weekApprovals?.[w.week]?.approved).length;
 const gates=[
  {id:'hours',label:`${META.minimumHours} documented instructional hours`,pass:+s?.teacher?.hours>=META.minimumHours,value:`${+s?.teacher?.hours||0}/${META.minimumHours}`},
  {id:'lessons',label:`At least ${META.lessonMinimum} of 180 daily lessons`,pass:ls.done>=META.lessonMinimum,value:`${ls.done}/180`},
  {id:'assignments',label:'All 108 principal assignments submitted',pass:as.submitted>=108,value:`${as.submitted}/108`},
  {id:'weeklyApproval',label:'All 36 weekly portfolios approved by evaluator',pass:approvedWeeks===36,value:`${approvedWeeks}/36 approved`},
  {id:'quizzes',label:`All 36 weekly quizzes mastered at ${META.weeklyMastery}% or higher`,pass:allQuizMastery,value:`${qs.mastered}/36 mastered`},
  {id:'semester1',label:`Semester 1 average at least ${META.semesterMinimum}%`,pass:s1>=META.semesterMinimum,value:`${s1}%`},
  {id:'semester2',label:`Semester 2 average at least ${META.semesterMinimum}%`,pass:s2>=META.semesterMinimum,value:`${s2}%`},
  {id:'overall',label:`Overall course grade at least ${META.passingOverall}%`,pass:ov>=META.passingOverall,value:`${ov}%`},
  {id:'majors',label:'Every major assessment meets its individual threshold',pass:allMajors,value:`${majors.filter(x=>x.pass&&x.submitted).length}/${majors.length}`},
  {id:'capstone',label:'All 10 capstone checkpoints approved',pass:allCps,value:`${cps.filter(x=>x.pass).length}/10`},
  {id:'integrity',label:'Academic integrity and AI disclosure verified',pass:!!s?.teacher?.integrity,value:s?.teacher?.integrity?'Verified':'Not verified'},
  {id:'evaluator',label:'Teacher or homeschool evaluator verification',pass:!!s?.teacher?.evaluator,value:s?.teacher?.evaluator?'Verified':'Not verified'}
 ];
 if(includeIssue)gates.push({id:'issued',label:'Final transcript credit issued by evaluator',pass:!!s?.teacher?.issued,value:s?.teacher?.issued?(s.teacher.issuedDate||'Issued'):'Not issued'});
 return{gates,majors,cps,ready:gates.filter(g=>g.id!=='issued').every(g=>g.pass),complete:gates.every(g=>g.pass),s1,s2,ov};
}

function setView(v){view=v;$$('.navBtn,.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===v));render()}
function setWeek(n){selectedWeek=Math.max(1,Math.min(36,+n));history.replaceState(null,'',`?week=${selectedWeek}`);view='week';renderSidebarWeeks();render();scrollTo({top:0,behavior:'smooth'})}
function renderStudentControls(){
 const el=$('#studentSelect');
 el.innerHTML=db.students.length?db.students.map(s=>`<option value="${s.id}" ${s.id===db.activeId?'selected':''}>${esc(s.name)}</option>`).join(''):'<option value="">No student added</option>';
}
function renderSidebarWeeks(){
 const s=activeStudent();
 $('#weekList').innerHTML=COURSE.weeks.map(w=>`<button class="weekBtn ${w.week===selectedWeek?'active':''}" data-week="${w.week}"><span><strong>Week ${w.week}</strong><br><small>${esc(w.title)}</small></span><span>${(s?.completedLessons?.[w.week]||[]).filter(Boolean).length}/5</span></button>`).join('');
 $$('#weekList .weekBtn').forEach(b=>b.onclick=()=>setWeek(b.dataset.week));
}
function render(){
 applySettings();const c=$('#content');
 if(view==='dashboard')c.innerHTML=dashboardHTML();
 if(view==='week')c.innerHTML=weekHTML(COURSE.weeks[selectedWeek-1]);
 if(view==='scope')c.innerHTML=scopeHTML();
 if(view==='assessments')c.innerHTML=assessmentsHTML();
 if(view==='capstone')c.innerHTML=capstoneHTML();
 if(view==='graduation')c.innerHTML=graduationHTML();
 if(view==='reports')c.innerHTML=reportsHTML();
 if(view==='standards')c.innerHTML=standardsHTML();
 wireView();
}
function dashboardHTML(){
 const s=activeStudent(),ls=lessonStats(s),as=assignmentStats(s),qs=quizStats(s),audit=gateAudit(s),cw=currentWeek(s);
 return `<div class="grid">
 <section class="card col12"><h2>${s?`Welcome, ${esc(s.name)}`:'Welcome to the Senior Social Studies Capstone'}</h2>
 <p>${s?'Continue the nationally portable senior study of comparative politics, international relations, law, rights, global challenges, and independent research.':'Add a student in the sidebar to begin a verified senior record.'}</p>
 <div class="progress"><span style="width:${audit.ov}%"></span></div><p class="small">Current weighted grade estimate: ${audit.ov}% · credit is governed by mandatory gates.</p>
 <div class="actions"><button id="continueBtn">Continue Week ${cw}</button><button class="secondary" data-go="graduation">View Graduation Audit</button><a class="button ghost" href="docs/CAPSTONE_RESEARCH_HANDBOOK.md">Capstone Handbook</a></div></section>
 <section class="card col3 kpi"><strong>${ls.done}/180</strong><span>Daily lessons</span></section>
 <section class="card col3 kpi"><strong>${as.submitted}/108</strong><span>Assignments submitted</span></section>
 <section class="card col3 kpi"><strong>${qs.mastered}/36</strong><span>Weekly mastery gates</span></section>
 <section class="card col3 kpi"><strong>${audit.gates.filter(g=>g.pass).length}/${audit.gates.length}</strong><span>Graduation gates passed</span></section>
 <section class="card col6"><h3>Semester Record</h3><p><strong>Semester 1:</strong> ${audit.s1}% · minimum 70%</p><p><strong>Semester 2:</strong> ${audit.s2}% · minimum 70%</p><p><strong>Overall:</strong> ${audit.ov}% · minimum 75%</p></section>
 <section class="card col6"><h3>Graduation Status</h3><div class="gateSummary"><strong>${audit.complete?'CREDIT ISSUED':audit.ready?'READY FOR EVALUATOR ISSUANCE':'REQUIREMENTS REMAIN'}</strong><p>${audit.complete?'Every gate is verified and final credit is recorded.':audit.ready?'All pre-issuance gates pass. The evaluator must review and issue final credit.':'Open the graduation audit for the exact unmet requirements.'}</p></div></section>
 <section class="card col12 integrity"><h3>National portability statement</h3><p>${esc(META.disclaimer)}</p></section>
 </div>`;
}
function readingHTML(w){return w.reading.map(s=>`<details class="reading"><summary>${esc(s.heading)}</summary>${s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</details>`).join('')}
function weekHTML(w){
 const s=activeStudent(),done=s?.completedLessons?.[w.week]||[], qrec=s?.quizzes?.[w.week]||{};
 return `<div class="grid">
 <section class="card col12"><span class="pill">Week ${w.week}</span><span class="pill">${esc(w.unit)}</span><h2>${esc(w.title)}</h2><p class="lead"><strong>Essential question:</strong> ${esc(w.essentialQuestion)}</p><p>${esc(w.focus)}</p>
 <div class="actions noPrint"><a class="button secondary" href="weeks/week-${String(w.week).padStart(2,'0')}/student-packet.html">Printable Student Packet</a><a class="button ghost" href="weeks/week-${String(w.week).padStart(2,'0')}/teacher-guide.html">Teacher Guide</a><button id="speakBtn">Read Aloud</button></div></section>
 <section class="card col8"><h3>Original Senior Reading</h3>${readingHTML(w)}</section>
 <section class="card col4"><h3>Vocabulary</h3><dl>${w.vocabulary.map(v=>`<dt>${esc(v.term)}</dt><dd>${esc(v.definition)}</dd>`).join('')}</dl><h3>Key Understandings</h3><ul>${w.keyUnderstandings.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>
 <section class="card col12"><h3>Five-Day Instructional Sequence</h3><div class="grid">${w.lessons.map((l,i)=>`<article class="card col6 lesson"><label class="checkline"><input type="checkbox" data-lesson="${i}" ${done[i]?'checked':''} ${s?'':'disabled'}><strong>${esc(l.day)} · ${esc(l.title)}</strong></label><p>${esc(l.objective)}</p><ol>${l.activities.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p><strong>Deliverable:</strong> ${esc(l.deliverable)} · ${l.minutes} minutes</p></article>`).join('')}</div></section>
 ${w.capstoneCheckpoint?`<section class="card col12"><div class="checkpoint"><strong>Capstone Checkpoint ${esc(w.capstoneCheckpoint.id.toUpperCase())} · ${esc(w.capstoneCheckpoint.title)}</strong><p>${esc(w.capstoneCheckpoint.requirement)}</p><p>Status: ${s?.capstone?.[w.capstoneCheckpoint.id]?.approved?'<span class="statusPass">Teacher approved</span>':'<span class="statusFail">Awaiting teacher approval</span>'}</p></div></section>`:''}
 <section class="card col12"><h3>Principal Assignments</h3>${w.assignments.map(a=>assignmentHTML(w,a,s)).join('')}</section>
 <section class="card col12"><h3>${esc(w.quiz.title)}</h3><p>Mastery threshold: ${META.weeklyMastery}%. Retakes preserve the highest score. A constructed response is required.</p>${quizHTML(w,qrec,s)}</section>
 <section class="card col12"><h3>Standards Evidence</h3><div class="pills">${w.standards.map(x=>`<span class="pill">${esc(x)}</span>`).join('')}</div></section>
 </div>`;
}
function assignmentHTML(w,a,s){
 const key=`${w.week}-${a.number}`,rec=s?.assignments?.[key]||{};
 return `<details class="assignment"><summary>Assignment ${a.number} · ${esc(a.title)} · ${a.points} points ${rec.submitted?'✓ Submitted':''}</summary>
 <p><strong>Type:</strong> ${esc(a.type)}</p><p>${esc(a.instructions)}</p><h4>Required deliverables</h4><ul>${a.deliverables.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
 <h4>Rubric</h4><ul>${a.rubric.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
 <label>Draft or response<textarea data-assignment="${key}" rows="8" ${s?'':'disabled'}>${esc(rec.text||'')}</textarea></label>
 <div class="actions noPrint"><button class="saveAssignment secondary" data-key="${key}" ${s?'':'disabled'}>Save Draft</button><button class="submitAssignment" data-key="${key}" ${s?'':'disabled'}>${rec.submitted?'Update Submission':'Submit Assignment'}</button></div><p class="small">${rec.updated?`Last updated ${esc(rec.updated)}`:'Not yet saved.'}</p></details>`;
}
function quizHTML(w,qrec,s){
 return `<form id="quizForm">${w.quiz.questions.map((q,qi)=>`<fieldset><legend>${qi+1}. ${esc(q.question)}</legend>${q.options.map((o,oi)=>`<label class="choice"><input type="radio" name="q${qi}" value="${oi}" ${qrec.answers?.[qi]===oi?'checked':''} ${s?'':'disabled'}> ${esc(o)}</label>`).join('')}</fieldset>`).join('')}
 <label><strong>Constructed response</strong><textarea id="shortResponse" rows="8" ${s?'':'disabled'}>${esc(qrec.shortResponse||'')}</textarea></label><p class="small">${esc(w.quiz.rubric)}</p>
 <div class="actions noPrint"><button type="submit" ${s?'':'disabled'}>Score and Save Attempt</button><a class="button secondary" href="assessments/correction-form.html">Open Correction Form</a></div></form>
 ${qrec.completed?`<div class="notice"><strong>Best objective score: ${qrec.bestPercent}%</strong> · ${qrec.attempts} attempt(s) · ${qrec.bestPercent>=META.weeklyMastery?'Mastery gate passed':'Correction and reassessment required'}</div>`:''}`;
}
function scopeHTML(){
 return `<section class="card"><h2>36-Week Scope and Sequence</h2><p>Every week contains five lessons, three principal assignments, an original reading, evidence laboratory, comparative analysis, mastery quiz, constructed response, and teacher guidance.</p>
 <div class="tableWrap"><table><thead><tr><th>Week</th><th>Unit</th><th>Topic</th><th>Essential Question</th><th>Performance</th></tr></thead><tbody>
 ${COURSE.weeks.map(w=>`<tr><td><button class="linkBtn" data-week="${w.week}">${w.week}</button></td><td>${esc(w.unit)}</td><td>${esc(w.title)}</td><td>${esc(w.essentialQuestion)}</td><td>${esc(w.performance)}</td></tr>`).join('')}
 </tbody></table></div></section>`;
}
function assessmentsHTML(){
 const s=activeStudent();
 return `<div class="grid"><section class="card col12"><h2>Mandatory Major Assessments</h2><p>Every assessment must be submitted and meet its individual threshold. These requirements cannot be averaged away.</p></section>
 ${COURSE.majorAssessments.map(m=>{const r=s?.major?.[m.id]||{};return `<article class="card col6"><span class="pill">Week ${m.week}</span><span class="pill">${esc(m.type)}</span><h3>${esc(m.title)}</h3><p>${esc(m.description)}</p><p><strong>Required score:</strong> ${m.threshold}% · <strong>Current:</strong> ${Number.isFinite(+r.score)?`${+r.score}%`:'Not scored'} · ${r.submitted?'Submitted':'Not submitted'}</p><a class="button" href="assessments/${m.id}.html">Open Assessment</a></article>`}).join('')}</div>`;
}
function capstoneHTML(){
 const s=activeStudent(), thesis=s?.major?.thesis||{};
 return `<div class="grid"><section class="card col12"><h2>Year-Long Senior Research Capstone</h2><p>The capstone requires an ethical, independent 4,000–5,000-word research thesis, public product, presentation, and oral defense. Teacher approval is required at every checkpoint.</p><div class="thesisMeter">${COURSE.capstoneCheckpoints.map(c=>`<span class="${s?.capstone?.[c.id]?.approved?'on':''}" title="${esc(c.title)}"></span>`).join('')}</div></section>
 <section class="card col8"><h3>Ten Enforced Checkpoints</h3>${COURSE.capstoneCheckpoints.map(c=>`<div class="checkpoint"><strong>Week ${c.week} · ${esc(c.title)}</strong><p>${esc(c.requirement)}</p><p>${s?.capstone?.[c.id]?.approved?'<span class="statusPass">Approved</span>':'<span class="statusFail">Not yet approved</span>'}</p></div>`).join('')}</section>
 <section class="card col4"><h3>Thesis Requirements</h3><ul><li>4,000–5,000 words</li><li>Student-generated question</li><li>Ethical methodology</li><li>Primary and credible secondary evidence</li><li>Competing explanations</li><li>Findings and limitations</li><li>Standard citations</li><li>AI-assistance disclosure</li><li>Public communication product</li><li>Oral defense</li></ul>
 <a class="button" href="docs/CAPSTONE_RESEARCH_HANDBOOK.md">Research Handbook</a><a class="button secondary" href="resources/capstone-planner.html">Capstone Planner</a></section>
 <section class="card col12"><h3>Current Thesis Record</h3><p>Submission: ${thesis.submitted?'Submitted':'Not submitted'} · Score: ${Number.isFinite(+thesis.score)?`${+thesis.score}%`:'Not scored'} · Required: 80%</p></section></div>`;
}
function graduationHTML(){
 const s=activeStudent(),a=gateAudit(s);
 if(!s)return `<section class="card"><h2>Graduation Audit</h2><p>Add or select a student to generate the enforced graduation audit.</p></section>`;
 return `<div class="grid"><section class="card col12"><h2>Enforced Graduation-Credit Audit · ${esc(s.name)}</h2><div class="gateSummary"><strong>${a.complete?'FINAL CREDIT ISSUED':a.ready?'PRE-ISSUANCE AUDIT PASSED':'CREDIT NOT YET ELIGIBLE'}</strong><p>${a.gates.filter(g=>g.pass).length} of ${a.gates.length} gates passed. Semester 1: ${a.s1}% · Semester 2: ${a.s2}% · Overall: ${a.ov}%.</p></div></section>
 <section class="card col12"><div class="auditGrid">${a.gates.map(g=>`<div class="auditItem ${g.pass?'pass':'fail'}"><strong>${g.pass?'✓':'○'} ${esc(g.label)}</strong><span>${esc(g.value)}</span></div>`).join('')}</div></section>
 <section class="card col12"><h3>Major Assessment Gates</h3>${a.majors.map(x=>`<div class="majorRow"><span><strong>${esc(x.m.title)}</strong><br><small>Week ${x.m.week} · threshold ${x.m.threshold}%</small></span><span>${x.submitted?'Submitted':'Missing'}</span><span class="${x.pass?'statusPass':'statusFail'}">${x.score||0}%</span></div>`).join('')}</section>
 <section class="card col12"><h3>Evaluator Authority</h3><p>Students cannot self-issue credit. The teacher or homeschool evaluator must verify integrity, hours, checkpoints, major scores, and final portfolio in the Teacher Portal before issuing transcript credit.</p>
 ${a.complete?`<a class="button" href="certificate.html?student=${encodeURIComponent(s.name)}">Open Completion Certificate</a>`:'<a class="button secondary" href="teacher/index.html">Teacher Portal</a>'}</section></div>`;
}
function reportsHTML(){
 const s=activeStudent();if(!s)return `<section class="card"><h2>Reports and Backups</h2><p>Add a student to create a report.</p></section>`;
 const a=gateAudit(s);
 return `<div class="grid"><section class="card col12"><h2>Student Record Report</h2><p><strong>Student:</strong> ${esc(s.name)} · <strong>Course:</strong> ${esc(META.courseCode)} · <strong>Credit:</strong> ${META.credit}</p>
 <p>Lessons ${lessonStats(s).done}/180 · Assignments ${assignmentStats(s).submitted}/108 · Weekly mastery ${quizStats(s).mastered}/36 · Hours ${s.teacher.hours}/${META.minimumHours}</p>
 <p>Semester 1 ${a.s1}% · Semester 2 ${a.s2}% · Overall ${a.ov}% · Final status: ${a.complete?'Credit issued':a.ready?'Ready for evaluator issuance':'Incomplete'}</p>
 <div class="actions noPrint"><button onclick="window.print()">Print Report</button><button class="secondary" id="exportBtn">Export JSON Backup</button><label class="button ghost">Import JSON<input type="file" id="importFile" accept=".json" hidden></label></div></section>
 <section class="card col12"><h3>Required documentary record</h3><ul><li>Attendance and instructional hours</li><li>Weekly completion and mastery</li><li>Major assessment scores</li><li>Capstone checkpoint approvals</li><li>Thesis and oral-defense rubrics</li><li>Integrity and evaluator verification</li><li>Final-credit decision</li></ul></section></div>`;
}
function standardsHTML(){
 return `<div class="grid"><section class="card col12"><h2>National Portability and Standards</h2><p>This Khaemenes course is designed to exceed a typical one-credit senior social-studies elective through advanced disciplinary literacy, comparative political analysis, international studies, research, performance assessment, and verified mastery. It does not claim automatic acceptance by every jurisdiction.</p>
 <div class="actions"><a class="button" href="docs/NATIONAL_PORTABILITY_CROSSWALK.md">National Portability Crosswalk</a><a class="button secondary" href="docs/SCED_TRANSCRIPT_PROFILE.md">SCED Transcript Profile</a><a class="button ghost" href="docs/CREDIT_AND_ALIGNMENT.md">Credit and Alignment</a></div></section>
 <section class="card col6"><h3>Frameworks</h3><ul><li>NCSS C3 Inquiry Arc</li><li>Grades 11–12 History/Social Studies Literacy</li><li>AP Comparative Government skill model</li><li>AP Research process and defense model</li><li>IB Global Politics breadth as a benchmark</li><li>NCSS thematic strands</li></ul></section>
 <section class="card col6"><h3>Neutrality and evidence</h3><p>Students are graded on accuracy, evidence, source evaluation, reasoning, calculation, comparison, citation, integrity, revision, and oral defense—not political position, party, candidate preference, religion, or ideology.</p><a class="button secondary" href="docs/NONPARTISAN_INSTRUCTION.md">Instruction Policy</a></section></div>`;
}

function wireView(){
 $$('[data-go]').forEach(b=>b.onclick=()=>setView(b.dataset.go));
 $$('.linkBtn[data-week]').forEach(b=>b.onclick=()=>setWeek(b.dataset.week));
 const cont=$('#continueBtn');if(cont)cont.onclick=()=>setWeek(currentWeek(activeStudent()));
 const speak=$('#speakBtn');if(speak)speak.onclick=()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance($('#content').innerText);u.rate=.92;speechSynthesis.speak(u)};
 $$('[data-lesson]').forEach(ch=>ch.onchange=()=>{const s=activeStudent();if(!s)return;s.completedLessons[selectedWeek]||=[false,false,false,false,false];s.completedLessons[selectedWeek][+ch.dataset.lesson]=ch.checked;saveDB();renderSidebarWeeks()});
 $$('.saveAssignment,.submitAssignment').forEach(b=>b.onclick=()=>{const s=activeStudent();if(!s)return;const key=b.dataset.key,ta=$(`[data-assignment="${key}"]`);s.assignments[key]=Object.assign(s.assignments[key]||{},{text:ta.value,updated:stamp(),submitted:b.classList.contains('submitAssignment')?true:(s.assignments[key]?.submitted||false)});saveDB();render()});
 const qf=$('#quizForm');if(qf)qf.onsubmit=e=>{e.preventDefault();const s=activeStudent();if(!s)return;const w=COURSE.weeks[selectedWeek-1],answers=[],missing=[];w.quiz.questions.forEach((q,i)=>{const x=qf.querySelector(`[name="q${i}"]:checked`);if(!x)missing.push(i+1);answers.push(x?+x.value:null)});if(missing.length){alert(`Complete questions: ${missing.join(', ')}`);return}const score=answers.filter((x,i)=>x===w.quiz.questions[i].answer).length,percent=Math.round(score/w.quiz.questions.length*100),old=s.quizzes[w.week]||{};s.quizzes[w.week]={answers,score,percent,bestPercent:Math.max(old.bestPercent||0,percent),attempts:(old.attempts||0)+1,completed:true,shortResponse:$('#shortResponse').value,updated:stamp()};saveDB();render();};
 const ex=$('#exportBtn');if(ex)ex.onclick=()=>downloadJSON(`${safename(activeStudent().name)}-grade12-social-studies-backup.json`,{exported:new Date().toISOString(),course:META,student:activeStudent()});
 const imp=$('#importFile');if(imp)imp.onchange=async()=>{try{const x=JSON.parse(await imp.files[0].text());const student=normalize(x.student||x);if(!student.id)student.id=uid();const idx=db.students.findIndex(y=>y.id===student.id);if(idx>=0)db.students[idx]=student;else db.students.push(student);db.activeId=student.id;saveDB();renderStudentControls();renderSidebarWeeks();render()}catch(err){alert('That file could not be imported.')}};
}
function safename(s){return String(s||'student').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function downloadJSON(name,obj){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function applySettings(){document.documentElement.dataset.theme=db.settings.theme;document.documentElement.style.setProperty('--font-scale',db.settings.fontScale/100)}
function wireShell(){
 renderStudentControls();renderSidebarWeeks();render();
 $('#studentSelect').onchange=e=>{db.activeId=e.target.value||null;saveDB();renderSidebarWeeks();render()};
 $('#addStudentBtn').onclick=()=>{const i=$('#studentName');if(i.value.trim()){createStudent(i.value);i.value='';renderStudentControls();renderSidebarWeeks();render()}};
 $('#studentName').onkeydown=e=>{if(e.key==='Enter')$('#addStudentBtn').click()};
 $('#demoBtn').onclick=()=>{demoStudent();renderStudentControls();renderSidebarWeeks();render()};
 $('#deleteStudentBtn').onclick=()=>{const s=activeStudent();if(s&&confirm(`Delete the local record for ${s.name}?`)){db.students=db.students.filter(x=>x.id!==s.id);db.activeId=db.students[0]?.id||null;saveDB();renderStudentControls();renderSidebarWeeks();render()}};
 $$('.navBtn,.tab').forEach(b=>b.onclick=()=>setView(b.dataset.view));
 $('#themeBtn').onclick=()=>{db.settings.theme=db.settings.theme==='dark'?'light':'dark';saveDB();applySettings()};
 $('#fontDown').onclick=()=>{db.settings.fontScale=Math.max(80,db.settings.fontScale-10);saveDB();applySettings()};
 $('#fontUp').onclick=()=>{db.settings.fontScale=Math.min(140,db.settings.fontScale+10);saveDB();applySettings()};
}
wireShell();
})();
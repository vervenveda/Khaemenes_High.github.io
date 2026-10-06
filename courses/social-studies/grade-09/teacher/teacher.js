(() => {
'use strict';

const COURSE = window.KHAEMENES_SOCIAL_STUDIES_DATA;
if(!COURSE?.metadata?.storageKey) return;
const KEY = COURSE.metadata.storageKey;
const DEFAULT_PASSCODE = 'KHAE09';
const root = document.getElementById('teacherContent');

const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const n=v=>v!==null&&v!==undefined&&String(v).trim()!==''&&Number.isFinite(Number(v))?Number(v):null;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

function freshDB(){return {version:1,teacherPasscode:DEFAULT_PASSCODE,activeId:null,students:[],settings:{}};}
function loadDB(){
  try{const d=JSON.parse(window.KhaemenesSS9Records.storage.getItem(KEY));return d?window.KhaemenesSS9Records.prepareDB(window.KhaemenesSS9Records.validDB(d)):window.KhaemenesSS9Records.prepareDB(freshDB());}
  catch{return freshDB();}
}
function saveDB(db){window.KhaemenesSS9Records.storage.setItem(KEY,JSON.stringify(db));}
let db=loadDB(), unlocked=sessionStorage.getItem(window.KhaemenesSS9Records.key(KEY+'_teacher_unlocked'))==='yes', selectedId=db.activeId||db.students[0]?.id||null;

function student(){return db.students.find(s=>s.id===selectedId)||null;}
function setStatus(msg,kind='good'){
  const el=document.getElementById('teacherStatus');
  if(el){el.className=`notice ${kind}`;el.textContent=msg;}
}

function loginHTML(){
  return `<section class="card" style="max-width:620px;margin:30px auto">
    <h2>Evaluator Access</h2>
    <p>This passcode is a local classroom convenience only. It is not secure server authentication.</p>
    <label for="teacherPasscode">Local teacher passcode</label>
    <input id="teacherPasscode" type="password" autocomplete="off">
    <div class="actions" style="margin-top:14px"><button id="unlockTeacher" type="button">Open Teacher Tools</button></div>
    <div id="teacherStatus"></div>
  </section>`;
}

function gradeSnapshot(s){
  if(window.KHAEMENES_SS9_GRADE_ENGINE?.gradeSnapshot) return window.KHAEMENES_SS9_GRADE_ENGINE.gradeSnapshot(s);
  return null;
}

function portalHTML(){
  const s=student();
  return `<div class="grid">
    <section class="card col12">
      <div class="actions" style="justify-content:space-between">
        <div><h2 style="margin-bottom:6px">Evaluator Gradebook</h2><p class="small">Score academic evidence; never substitute completion for achievement.</p></div>
        <button class="secondary" id="lockTeacher" type="button">Lock Portal</button>
      </div>
      <label for="teacherStudent">Student</label>
      <select id="teacherStudent">${db.students.length?db.students.map(x=>`<option value="${esc(x.id)}" ${x.id===selectedId?'selected':''}>${esc(x.name)}</option>`).join(''):'<option>No student records found</option>'}</select>
      <div id="teacherStatus"></div>
    </section>
    ${s?summaryHTML(s)+workspaceEvidenceHTML(s)+assignmentsHTML(s)+weeklyHTML(s)+journalHTML(s)+examsHTML(s)+backupHTML():`<section class="card col12"><h3>No student records</h3><p>Create a student from the student portal first.</p></section>`}
  </div>`;
}

function summaryHTML(s){
  const snap=gradeSnapshot(s);
  return `<section class="card col12">
    <h3>Academic Status · ${esc(s.name)}</h3>
    ${snap?`<p><strong>${snap.officialReady?`Official weighted grade: ${snap.officialGrade}%`:`Evaluated-work grade: ${snap.evaluatedGrade??'Pending'}${snap.evaluatedGrade!=null?'%':''}`}</strong></p>
    <p class="small">Evaluated weight currently represented: ${snap.availableWeight}% of 100%. Official grade remains withheld until the required assignment, weekly quiz, reflection and examination evidence has been evaluated.</p>`:'<p>Scores entered here use the same browser record as the student portal.</p>'}
  </section>`;
}

function workspaceEvidenceHTML(s){
 const ws=s.week1Workspace;if(!ws)return '';
 return `<section class="card col12"><details><summary>Week 1 baseline and learning notes</summary><h4>Preserved starting claim</h4><pre style="white-space:pre-wrap">${esc(ws.baseline||'Not preserved')}</pre>${Object.entries(ws.notes||{}).map(([key,text])=>`<h4>${esc(key)}</h4><pre style="white-space:pre-wrap">${esc(text)}</pre>`).join('')}</details></section>`;
}
function weeklyHTML(s){
 return `<section class="card col12"><h3>Weekly constructed responses · 5 points each</h3><p>Objective answers are 20 points; the evaluated response contributes 5. A pending response is not zero.</p>${COURSE.weeks.filter(w=>s.quizzes?.[w.week]?.completed).map(w=>{const q=s.quizzes[w.week];return `<details><summary>Week ${w.week} · ${esc(w.title)}</summary><p>${esc(w.quiz.shortResponse.prompt)}</p><pre style="white-space:pre-wrap">${esc(q.shortResponse||'No response supplied')}</pre><label for="qscore-${w.week}">Response score (0–5)</label><input id="qscore-${w.week}" type="number" min="0" max="5" value="${q.shortScore??''}"><label for="qfeedback-${w.week}">Feedback</label><textarea id="qfeedback-${w.week}">${esc(q.shortFeedback||'')}</textarea><button class="saveWeekly" data-week="${w.week}">Save response evaluation</button></details>`}).join('')}</section>`;
}
function saveWeekly(button){
 const s=student(),week=button.dataset.week,q=s?.quizzes?.[week];if(!q)return;
 const value=n(document.getElementById('qscore-'+week).value);if(value===null||value<0||value>5)return setStatus('Enter a score from 0 to 5.','bad');
 q.shortScore=value;q.shortFeedback=document.getElementById('qfeedback-'+week).value;q.shortEvaluatedAt=new Date().toISOString();saveDB(db);render();
}
function assignmentRows(s){
  const rows=[];
  for(const w of COURSE.weeks){
    for(const a of w.assignments){
      const key=`${w.week}-${a.number}`, r=s.assignments?.[key]||{};
      if(!r.submitted && r.score===undefined) continue;
      rows.push({w,a,key,r});
    }
  }
  return rows;
}
function assignmentsHTML(s){
  const rows=assignmentRows(s);
  return `<section class="card col12">
    <h3>Assignments · 45%</h3>
    <p>Use the published rubric. Score only work actually evaluated. Possible points default to the assignment's course-data value.</p>
    ${rows.length?`<div class="tableWrap"><table><thead><tr><th>Week</th><th>Assignment</th><th>Submitted</th><th>Score</th><th>Possible</th><th>Feedback</th><th></th></tr></thead><tbody>
      ${rows.map(({w,a,key,r})=>`<tr><td>${w.week}</td><td>${esc(a.title)}</td><td>${r.submitted?'Yes':'No'}</td>
      <td><input id="ascore-${key}" type="number" min="0" step="0.5" value="${r.score??''}" style="min-width:88px"></td>
      <td><input id="amax-${key}" type="number" min="1" step="0.5" value="${r.possiblePoints??a.points}" style="min-width:88px"></td>
      <td><textarea id="afb-${key}" style="min-height:72px">${esc(r.feedback||'')}</textarea></td>
      <td><button class="saveAssignmentScore" data-key="${key}" type="button">Save</button></td></tr>`).join('')}
      </tbody></table></div>`:'<p class="notice">No submitted/evaluated assignments yet. Submission is intentionally not treated as a score.</p>'}
  </section>`;
}

function journalHTML(s){
  return `<section class="card col12">
    <h3>Journal · Discussion · Reflection · 5%</h3>
    <p>Record an evaluator percentage for weekly discussion/reflection evidence when there is enough work to judge. Blank weeks remain pending rather than becoming zeroes or automatic credit.</p>
    <div class="tableWrap"><table><thead><tr><th>Week</th><th>Focus</th><th>Evaluator %</th><th>Comment</th><th></th></tr></thead><tbody>
      ${COURSE.weeks.map(w=>{const r=s.journal?.[w.week]||{};return `<tr><td>${w.week}</td><td>${esc(w.title)}</td>
      <td><input id="jscore-${w.week}" type="number" min="0" max="100" step="1" value="${r.percent??r.score??''}" style="min-width:88px"></td>
      <td><input id="jfb-${w.week}" value="${esc(r.feedback||'')}"></td>
      <td><button class="saveJournal" data-week="${w.week}" type="button">Save</button></td></tr>`}).join('')}
    </tbody></table></div>
  </section>`;
}

function examCard(s,type,label){
  const r=s.exams?.[type]||{};
  const obj=n(r.bestPercent??r.percent);
  return `<div class="card col6"><h3>${label} · ${type==='midterm'?'12':'18'}%</h3>
    <p><strong>Objective best:</strong> ${obj==null?'Not scored':obj+'%'}</p>
    <label for="${type}Written">Evaluator score for required written portions (%)</label>
    <input id="${type}Written" type="number" min="0" max="100" step="1" value="${r.writtenPercent??''}">
    <label for="${type}Total">Evaluator-approved total examination grade (%)</label>
    <input id="${type}Total" type="number" min="0" max="100" step="1" value="${r.totalPercent??''}">
    <label for="${type}Feedback">Evaluator feedback</label><textarea id="${type}Feedback">${esc(r.teacherFeedback||'')}</textarea>
    <button class="saveExamEvaluation" data-type="${type}" type="button">Save ${label} Evaluation</button>
    <p class="small">No unstated formula is imposed between objective and written components. Enter the evaluator-approved total after scoring the complete examination according to the assessment rubric.</p>
  </div>`;
}
function examsHTML(s){return `<section class="col12"><div class="grid">${examCard(s,'midterm','Midterm')}${examCard(s,'final','Final')}</div></section>`;}
function backupHTML(){return `<section class="card col12"><h3>Audit & Backup</h3><p>Evaluator changes are saved to the same local browser record used by the student portal.</p><div class="actions"><button id="teacherExport" type="button">Export Full JSON Backup</button><button class="secondary" id="teacherRefresh" type="button">Reload Records</button><a class="button secondary" href="RUBRICS.md">Open Rubrics</a><a class="button secondary" href="ANSWER_KEY_INDEX.html">Answer Keys</a></div></section>`;}

function render(){root.innerHTML=unlocked?portalHTML():loginHTML();wire();}

function wire(){
  document.getElementById('unlockTeacher')?.addEventListener('click',()=>{
    const pass=document.getElementById('teacherPasscode').value;
    const expected=db.teacherPasscode||DEFAULT_PASSCODE;
    if(pass!==expected) return setStatus('Passcode not accepted.','bad');
    unlocked=true;sessionStorage.setItem(window.KhaemenesSS9Records.key(KEY+'_teacher_unlocked'),'yes');render();
  });
  document.getElementById('lockTeacher')?.addEventListener('click',()=>{unlocked=false;sessionStorage.removeItem(window.KhaemenesSS9Records.key(KEY+'_teacher_unlocked'));render();});
  document.getElementById('teacherStudent')?.addEventListener('change',e=>{selectedId=e.target.value;db.activeId=selectedId;saveDB(db);render();});
  document.querySelectorAll('.saveAssignmentScore').forEach(b=>b.addEventListener('click',()=>saveAssignmentScore(b)));
  document.querySelectorAll('.saveWeekly').forEach(b=>b.addEventListener('click',()=>saveWeekly(b)));
  document.querySelectorAll('.saveJournal').forEach(b=>b.addEventListener('click',()=>saveJournal(b)));
  document.querySelectorAll('.saveExamEvaluation').forEach(b=>b.addEventListener('click',()=>saveExamEvaluation(b)));
  document.getElementById('teacherRefresh')?.addEventListener('click',()=>{db=loadDB();selectedId=db.activeId||db.students[0]?.id||null;render();});
  document.getElementById('teacherExport')?.addEventListener('click',exportBackup);
}

function saveAssignmentScore(btn){
  const s=student(), key=btn.dataset.key; if(!s)return;
  s.assignments ||= {}; const r=s.assignments[key]||{};
  const score=n(document.getElementById('ascore-'+key).value), max=n(document.getElementById('amax-'+key).value);
  if(score==null || max==null || max<=0 || score<0 || score>max) return setStatus('Assignment score must be between 0 and possible points.','bad');
  r.score=score;r.possiblePoints=max;r.feedback=document.getElementById('afb-'+key).value.trim();r.evaluatedAt=new Date().toISOString();
  s.assignments[key]=r;saveDB(db);render();
}
function saveJournal(btn){
  const s=student(), week=btn.dataset.week; if(!s)return;
  const field=document.getElementById('jscore-'+week), raw=field.value.trim();
  s.journal ||= {};
  if(raw===''){delete s.journal[week];saveDB(db);return render();}
  const score=n(raw);if(score==null || score<0 || score>100)return setStatus('Journal/discussion score must be 0–100.','bad');
  s.journal[week]={percent:clamp(score,0,100),feedback:document.getElementById('jfb-'+week).value.trim(),evaluatedAt:new Date().toISOString()};
  saveDB(db);render();
}
function saveExamEvaluation(btn){
  const s=student(), type=btn.dataset.type;if(!s)return;
  s.exams ||= {}; const r=s.exams[type]||{};
  const wrRaw=document.getElementById(type+'Written').value.trim(), totalRaw=document.getElementById(type+'Total').value.trim();
  if(wrRaw!==''){const wr=n(wrRaw);if(wr==null||wr<0||wr>100)return setStatus('Written examination percentage must be 0–100.','bad');r.writtenPercent=wr;} else delete r.writtenPercent;
  if(totalRaw!==''){const total=n(totalRaw);if(total==null||total<0||total>100)return setStatus('Total examination percentage must be 0–100.','bad');r.totalPercent=total;} else delete r.totalPercent;
  r.teacherFeedback=document.getElementById(type+'Feedback').value.trim();r.evaluatedAt=new Date().toISOString();s.exams[type]=r;
  saveDB(db);render();
}
function exportBackup(){
  const blob=new Blob([JSON.stringify(window.KhaemenesSS9Records.exportDB(db),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=`grade09-socialstudies-evaluator-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);
}

render();
})();

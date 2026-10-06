(() => {
'use strict';

/*
  Grade 9 Global Studies Honors — Academic Grade Engine v1
  Purpose: keep completion, submission, mastery, and academic grading separate.
  This layer never converts a checkbox/submission into an academic score.
*/

const COURSE = window.KHAEMENES_SOCIAL_STUDIES_DATA;
if(!COURSE?.metadata?.storageKey) return;

const KEY = COURSE.metadata.storageKey;
const WEIGHTS = Object.freeze({
  assignments: 45,
  weeklyQuizzes: 20,
  midterm: 12,
  final: 18,
  journalDiscussion: 5
});

function readDB(){
  try{
    const db = JSON.parse(window.KhaemenesSS9Records.storage.getItem(KEY));
    return db && Array.isArray(db.students) ? db : null;
  }catch{return null;}
}

function activeStudent(db){
  return db?.students?.find(s => s.id === db.activeId) || null;
}

function pct(n,d){ return d > 0 ? (n/d)*100 : null; }
function round(n){ return n == null ? null : Math.round(n*10)/10; }

function assignmentPossiblePoints(key, record){
  const explicit=Number(record?.possiblePoints ?? record?.points);
  if(Number.isFinite(explicit) && explicit>0) return explicit;
  const [weekRaw,numRaw]=String(key).split('-');
  const week=Number(weekRaw), num=Number(numRaw);
  const canonical=COURSE.weeks?.find(w=>w.week===week)?.assignments?.find(a=>a.number===num)?.points;
  return Number.isFinite(Number(canonical)) && Number(canonical)>0 ? Number(canonical) : null;
}

const score=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0?x:null;
function assignmentCategory(s){
 let earned=0,possible=0,evaluated=0,submitted=0;
 for(const w of COURSE.weeks)for(const a of w.assignments){const record=s?.assignments?.[`${w.week}-${a.number}`];if(record?.submitted)submitted++;const n=score(record?.score),max=assignmentPossiblePoints(`${w.week}-${a.number}`,record);if(n!==null&&max!==null&&n<=max){earned+=n;possible+=max;evaluated++;}}
 return {percent:round(pct(earned,possible)),earned,possible,evaluated,submitted,total:108};
}
function quizCategory(s){
 const rows=[];
 for(const w of COURSE.weeks){const q=s?.quizzes?.[w.week],objective=score(q?.score),written=score(q?.shortScore);if(q?.completed&&objective!==null&&objective<=20&&written!==null&&written<=5)rows.push((objective+written)/25*100);}
 return {percent:rows.length?round(rows.reduce((a,b)=>a+b,0)/rows.length):null,evaluated:rows.length,total:36};
}
function examCategory(s,name){
 const ex=s?.exams?.[name],spec=COURSE[name];
 const objective=score(ex?.percent),written=score(ex?.writtenPercent);
 const valid=ex?.completed&&objective!==null&&objective<=100&&written!==null&&written<=100;
 const objectivePoints=spec.multipleChoice.length*2,writtenPoints=spec.shortResponses.reduce((n,q)=>n+q.points,0)+spec.essay.points;
 // Derive the total from the published point values. A typed total cannot replace missing evidence.
 const total=valid?(objective*objectivePoints+written*writtenPoints)/(objectivePoints+writtenPoints):null;
 return {percent:round(total),evaluated:Boolean(valid),objective:round(objective),written:round(written)};
}
function journalCategory(s){
 const vals=COURSE.weeks.map(w=>score(s?.journal?.[w.week]?.percent)).filter(p=>p!==null&&p<=100);
 return {percent:vals.length?round(vals.reduce((a,b)=>a+b,0)/vals.length):null,evaluated:vals.length,total:36};
}
function gradeSnapshot(s){
 const cat={assignments:assignmentCategory(s),weeklyQuizzes:quizCategory(s),midterm:examCategory(s,'midterm'),final:examCategory(s,'final'),journalDiscussion:journalCategory(s)};
 let weightedPoints=0,availableWeight=0;const pending=[];
 for(const [name,weight] of Object.entries(WEIGHTS)){const p=cat[name].percent;if(Number.isFinite(p)){weightedPoints+=p*weight/100;availableWeight+=weight;}else pending.push(name);}
 const complete=cat.assignments.evaluated===108&&cat.weeklyQuizzes.evaluated===36&&cat.journalDiscussion.evaluated===36&&cat.midterm.evaluated&&cat.final.evaluated;
 return {cat,weightedPoints:round(weightedPoints),availableWeight,evaluatedGrade:availableWeight?round(weightedPoints/availableWeight*100):null,officialReady:complete,officialGrade:complete?round(weightedPoints):null,pending,requiredEvidence:{assignments:108,weeklyQuizzes:36,journal:36}};
}

window.KHAEMENES_SS9_GRADE_ENGINE = Object.freeze({WEIGHTS, gradeSnapshot});

function label(name){
  return ({assignments:'Assignments',weeklyQuizzes:'Weekly quizzes',midterm:'Midterm',final:'Final',journalDiscussion:'Journal / discussion / reflection'})[name] || name;
}
function value(p){return Number.isFinite(p)?`${round(p)}%`:'Pending evaluation';}

function renderPanel(){
  const db=readDB(), s=activeStudent(db);
  const content=document.getElementById('content');
  if(!s || !content) return;
  const snap=gradeSnapshot(s);
  const reportsActive=[...document.querySelectorAll('.navBtn.active,.tab.active')].some(x=>/report/i.test(x.textContent||''));
  const dashboardActive=[...document.querySelectorAll('.navBtn.active,.tab.active')].some(x=>/dashboard/i.test(x.textContent||''));
  if(!reportsActive && !dashboardActive) return;
  if(document.getElementById('ss9AcademicGradeIntegrity')) return;

  const panel=document.createElement('section');
  panel.className='card col12';
  panel.id='ss9AcademicGradeIntegrity';
  panel.innerHTML=`
    <h2>Academic Grade Integrity</h2>
    <p><strong>${snap.officialReady ? `Official weighted grade: ${snap.officialGrade}%` : `Current evaluated-work grade: ${value(snap.evaluatedGrade)}`}</strong></p>
    <p class="small">Published weights are enforced exactly: Assignments 45% · Weekly quizzes 20% · Midterm 12% · Final 18% · Journal/discussion/reflection 5%.</p>
    <div class="tableWrap"><table><thead><tr><th>Category</th><th>Weight</th><th>Evaluated score</th><th>Status</th></tr></thead><tbody>
      ${Object.entries(WEIGHTS).map(([k,w])=>`<tr><td>${label(k)}</td><td>${w}%</td><td>${value(snap.cat[k]?.percent)}</td><td>${Number.isFinite(snap.cat[k]?.percent)?'Evidence recorded':'Not converted from completion/submission'}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="notice">${snap.officialReady
      ? 'All weighted categories contain evaluated evidence. The displayed grade is the published weighted course grade.'
      : `Official course grade is intentionally withheld until all 108 assignments, 36 complete weekly quizzes, 36 journal/reflection records, and both complete examinations have been evaluated${snap.pending.length?`: ${snap.pending.map(label).join(', ')}`:''}. Completion and submission remain visible elsewhere but do not count as academic scores.`}</div>`;
  const grid=content.querySelector('.grid');
  if(grid) grid.appendChild(panel); else content.appendChild(panel);
}

function schedule(){ requestAnimationFrame(()=>setTimeout(renderPanel,0)); }
const mo=new MutationObserver(schedule);
mo.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('storage',schedule);
document.addEventListener('change',schedule,true);
document.addEventListener('click',schedule,true);
schedule();
})();

(() => {
'use strict';
const records=window.KhaemenesSS9Records,KEY='khaemenes_grade09_social_studies_v1', $=id=>document.getElementById(id),status=$('workspace-save-status');
let db;
try{const raw=records.storage.getItem(KEY);db=records.prepareDB(raw?JSON.parse(raw):{version:1,teacherPasscode:'KHAE09',activeId:null,students:[],settings:{theme:'light',fontScale:100}});}catch{status.textContent='Stored work needs attention. Saving is paused.';return;}
const student=db.students.find(s=>s.id===db.activeId);
if(!student){status.textContent='Choose or add your learner in the course application before recording work.';return;}
student.assignments ||= {};student.completedLessons ||= {};student.week1Workspace ||= {notes:{},position:{day:1,phase:'read'}};
const ws=student.week1Workspace;ws.notes ||= {};
function save(){try{records.storage.setItem(KEY,JSON.stringify(db));status.textContent='Saved on this device · '+new Date().toLocaleTimeString();return true;}catch{status.textContent='This change is not saved. Keep your draft and export a backup.';return false;}}
const fields=Array.from(document.querySelectorAll('[data-week1-field]'));
fields.forEach(field=>{
 const name=field.dataset.week1Field,assignment=field.dataset.assignmentKey;
 field.value=assignment?student.assignments[assignment]?.text||'':ws.notes[name]||'';
 field.addEventListener('input',()=>{
  if(assignment){const prev=student.assignments[assignment]||{};const next={...prev,text:field.value,updated:new Date().toLocaleString(),submitted:false};if(prev.text!==field.value){if(typeof prev.score==='number')next.previousEvaluation={score:prev.score,feedback:prev.feedback||'',text:prev.text||'',evaluatedAt:prev.evaluatedAt||null};delete next.score;delete next.evaluatedAt;}student.assignments[assignment]=next;}
  else ws.notes[name]=field.value;
  save();
 });
});
function baseline(){ $('baseline-copy').textContent=ws.baseline||'';$('baseline-status').textContent=ws.baseline?'Original first claim preserved; later edits do not replace it.':'Preserve your first ledger and claim after writing it.';$('preserve-baseline').disabled=Boolean(ws.baseline);}
baseline();$('preserve-baseline').addEventListener('click',()=>{if(ws.baseline)return;const text=$('day1-baseline').value;if(!text.trim()){ $('baseline-status').textContent='Write your starting response first.';return;}ws.baseline=text;if(save())baseline();else delete ws.baseline;});
const phases=['read','practice','write','check'];let day=Number.isInteger(ws.position?.day)&&ws.position.day>=1&&ws.position.day<=5?ws.position.day:1;let phase=phases.includes(ws.position?.phase)?ws.position.phase:'read';
function render(focus=false){
 document.querySelectorAll('.phase').forEach(p=>p.hidden=!(Number(p.dataset.day)===day&&p.dataset.phase===phase));
 document.querySelectorAll('[data-day-select]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.daySelect)===day)));
 document.querySelectorAll('[data-phase-select]').forEach(b=>b.setAttribute('aria-current',b.dataset.phaseSelect===phase?'step':'false'));
 $('step-caption').textContent=`Day ${day} of 5 · ${phase[0].toUpperCase()+phase.slice(1)} · Work at your own pace`;
 $('previous-step').disabled=day===1&&phase==='read';$('next-step').disabled=day===5&&phase==='check';$('next-step').textContent=phase==='check'&&day<5?`Open Day ${day+1}`:'Next step';
 $('prepare-day').hidden=phase!=='check';$('prepare-day').textContent=student.completedLessons[1]?.[day-1]?'Today’s evidence prepared ✓':'Mark today’s evidence prepared';
 if(focus)$(`heading-${day}-${phase}`).focus();
}
function navigate(d,p){day=d;phase=p;ws.position={day,phase};save();render(true);}
document.querySelectorAll('[data-day-select]').forEach(b=>b.addEventListener('click',()=>navigate(Number(b.dataset.daySelect),'read')));
document.querySelectorAll('[data-phase-select]').forEach(b=>b.addEventListener('click',()=>navigate(day,b.dataset.phaseSelect)));
$('next-step').addEventListener('click',()=>{const n=(day-1)*4+phases.indexOf(phase)+1;if(n<20)navigate(Math.floor(n/4)+1,phases[n%4]);});
$('previous-step').addEventListener('click',()=>{const n=(day-1)*4+phases.indexOf(phase)-1;if(n>=0)navigate(Math.floor(n/4)+1,phases[n%4]);});
$('prepare-day').addEventListener('click',()=>{student.completedLessons[1] ||= [false,false,false,false,false];student.completedLessons[1][day-1]=true;if(save())render();});
document.querySelectorAll('[data-submit-assignment]').forEach(b=>b.addEventListener('click',()=>{const record=student.assignments[b.dataset.submitAssignment];if(!record?.text?.trim()){status.textContent='Save your assignment writing before preparing it for review.';return;}record.submitted=true;if(save())b.textContent='Prepared for evaluator review ✓';}));
document.querySelectorAll('a[href="#source-pack"],a[href="#meeting-map"]').forEach(a=>a.addEventListener('click',()=>{$('source-pack').open=true;}));
$('print-week').addEventListener('click',()=>window.print());
$('export-week1').addEventListener('click',()=>{const backup={...records.exportDB(db),containsUnsavedDrafts:records.isBlocked(),visibleDrafts:fields.map(f=>({id:f.id,value:f.value}))};const url=URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='global-studies-learner-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
render();status.textContent=records.isBlocked()?'Saving is paused.':'Workspace ready · Writing saves on this device.';
})();

/* Student Progress summary for Grades 09–12.
 * Read-only view of the same Academy continuation ledger used by family reports.
 * No inferred grades, no writes, no user-specific URL parameters.
 */
(()=>{"use strict";
const gradeMatch=location.pathname.match(/\/grades\/grade-(09|10|11|12)\/student-profile\//);
if(!gradeMatch)return;
const grade=Number(gradeMatch[1]),DIALOG_ID="grade09ClassProgressDialog";
const valid=n=>typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=100;
const make=(tag,cls,label)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(label!==undefined)n.textContent=String(label);return n};
const gradeAverage=record=>{
 const used=new Set();let earned=0,possible=0,count=0;
 for(const a of Array.isArray(record?.assessments)?record.assessments:[]){
  if(!a||!["quiz","test"].includes(a.kind)||typeof a.id!=="string"||used.has(a.id))continue;
  if(!Number.isFinite(a.earned)||!Number.isFinite(a.possible)||a.earned<0||a.possible<=0||a.earned>a.possible)continue;
  used.add(a.id);earned+=a.earned;possible+=a.possible;count++;
 }
 return {percent:possible?Math.round(earned/possible*1000)/10:null,count};
};
function learnerId(){
 const active=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
 const contract=window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId;
 if(!active||!contract||String(active)!==String(contract))return null;
 if(grade!==9){
  const ctx=window.KhaemenesHighProfileGradeContext?.active?.();
  if(!ctx||ctx.gradeNumber!==grade||String(ctx.learnerId)!==String(active))return null;
 }
 return String(active);
}
function slots(){
 const catalog=window.KhaemenesHighEightClass;
 if(!catalog?.slots)return [];
 if(grade!==9)return catalog.slots(grade);
 const math=window.KhaemenesGrade09Courses?.mathPathway?.()||null;
 return catalog.slots(9,{mathId:math});
}
const aliases=id=>{
 if(/^english-(10|11|12)$/.test(id||""))return [id,"ela"+id.slice(-2)];
 return id?[id]:[];
};
const latest=list=>list.slice().sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")))[0]||null;
function rowsFor(id){
 const all=id?(window.KhaemenesLearningContinuation?.readLearner?.(id)||[]).filter(s=>s?.learnerId===id&&s.courseId):[];
 const used=new Set();
 const rows=slots().map(slot=>{
  const candidates=all.filter(s=>aliases(slot.id).includes(s.courseId));
  for(const record of candidates)used.add(record.courseId);
  const record=candidates.find(s=>!s.stale)||null,old=latest(candidates);
  return {subject:slot.label,course:record?.courseTitle||old?.courseTitle||slot.title||slot.label,
   percent:record&&valid(record.progress?.percent)?record.progress.percent:null,
   average:gradeAverage(record),stale:!record&&!!old,courseSelected:Boolean(slot.id),
   updatedAt:record?.updatedAt||old?.updatedAt||"",type:"slot"};
 });
 for(const record of all){
  if(used.has(record.courseId))continue;used.add(record.courseId);
  const fresh=!record.stale?record:null;
  rows.push({subject:record.subject||"Additional class",course:record.courseTitle||record.courseId,
   percent:fresh&&valid(fresh.progress?.percent)?fresh.progress.percent:null,
   average:gradeAverage(fresh),stale:record.stale===true,courseSelected:true,updatedAt:record.updatedAt||"",type:"additional"});
 }
 return rows;
}
function render(){
 const dialog=document.getElementById(DIALOG_ID);
 if(!dialog?.open)return;
 const body=dialog.querySelector(".grade09-progress-dialog-content");
 if(!body)return;
 let section=dialog.querySelector("#khaeStudentProgressClassGrid");
 if(!section){
  section=make("section","khae-student-progress-class-section");
  section.id="khaeStudentProgressClassGrid";
  section.setAttribute("aria-labelledby","khaeStudentProgressClassTitle");
  body.append(section);
 }
 section.replaceChildren();
 const heading=make("h3","","Class-by-class report");heading.id="khaeStudentProgressClassTitle";
 section.append(heading,make("p","khae-student-progress-note","The grades shown here come from published quiz/test points. Completion is reported separately. Missing or stale records are never zero grades."));
 const learner=learnerId();
 if(!learner){
  section.append(make("p","khae-student-progress-note","Select the registered learner for this grade to see private class reports."));return;
 }
 const grid=make("div","khae-student-progress-class-grid");
 const rows=rowsFor(learner);
 for(const row of rows){
  const card=make("article","khae-student-progress-class-card");
  card.append(make("span","khae-student-progress-subject",row.subject));
  card.append(make("h4","",row.course));
  const stats=make("dl","khae-student-progress-class-stats");
  const add=(label,value)=>{stats.append(make("dt","",label),make("dd","",value))};
  add("Quiz/test grade",row.average.percent===null?"Not reported":row.average.percent+"% · "+row.average.count+" graded");
  add("Course complete",row.percent===null?"Not reported":row.percent+"%");
  card.append(stats);
  const status=row.stale?"Stale report — reopen class":row.average.count||row.percent!==null?"Course data received":row.courseSelected?"No current class statistics":"Choose class in Schedule";
  card.append(make("p","khae-student-progress-card-state",status));
  grid.append(card);
 }
 section.append(grid);
 const reported=rows.filter(r=>r.percent!==null).length;
 const withGrades=rows.filter(r=>r.average.percent!==null).length;
 section.append(make("p","khae-student-progress-note",reported+" classes report completion; "+withGrades+" classes report quiz/test grades. Values come from this browser's learner-scoped continuation records, not a certified transcript."));
}
let hooked=null;
function mount(){
 const dialog=document.getElementById(DIALOG_ID);
 if(!dialog||hooked===dialog)return;
 hooked=dialog;
 const observer=new MutationObserver(()=>{if(dialog.open)render()});
 observer.observe(dialog,{attributes:true,attributeFilter:["open"]});
 if(dialog.open)render();
}
const eventNames=["khaemenes-learning-continuation-changed","khaemenes-learning-continuation-ready","khaemenes-student-profile-changed","khaemenes-course-pins-changed","khaemenes-grade09-progress-refresh","pageshow","focus"];
for(const e of eventNames)window.addEventListener(e,()=>{mount();render()});
const init=()=>{mount();if(!hooked){
 const ob=new MutationObserver(()=>{mount();if(hooked)ob.disconnect()});
 ob.observe(document.body,{childList:true,subtree:true});
 }};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
window.KhaemenesHighStudentProgressSummary=Object.freeze({version:"1.0.0",refresh:render});
})();
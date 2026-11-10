/* Grades 10–12 · Grade 09 Class Progress presentation contract.
 * Independent registered-grade data only; no grades/mastery or storage writes.
 * Grade 09's established toolbar, modal and records remain untouched.
 */
(()=>{"use strict";
const grade=Number(document.body?.dataset.grade);
const grade10Copy=grade===10;
const grade11Copy=grade===11;
const grade12Copy=grade===12;
if(![10,11,12].includes(grade)||window.KhaemenesUpperGradeClassProgressDialog)return;
const $=(id)=>document.getElementById(id);
const make=(tag,cls,label)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(label!==undefined)n.textContent=label;return n};
const COLORS=["#D53E4F","#F46D43","#FDAE61","#FEE08B","#E6F598","#ABDDA4","#66C2A5","#3288BD"];
const dialog=make("dialog");dialog.id="grade09ClassProgressDialog";
dialog.setAttribute("aria-labelledby","grade09ClassProgressTitle");
dialog.setAttribute("aria-modal","true");
const header=make("header","grade09-progress-dialog-header");
const title=make("h2","","Class Progress");title.id="grade09ClassProgressTitle";
const close=make("button","grade09-progress-dialog-close","Close");close.type="button";
header.append(title,close);
const body=make("div","grade09-progress-dialog-content");
const checkpointsArea=make("div","grade09-progress-dialog-checkpoints");
const chartArea=make("div","grade09-progress-dialog-chart");
const chart=make("section","grade09-class-progress");chart.id="studentCourseProgress";
chart.setAttribute("aria-label","Eight-class progress dashboard");
const chartTitle=make("h2","","My Class Progress");
const intro=make("p","grade09-progress-intro",grade10Copy?"Progress shows how much of each class you have completed. Assessment progress shows how you are doing on mastery checks. If a class has no result yet, there is simply nothing to report yet.":grade11Copy?"Use this view to see where you are strong, where work is still in progress, and which classes may need extra attention as you plan ahead.":grade12Copy?"Use this view to finish strong. See what is complete, what still needs attention, and where to focus before you close out your senior-year work.":"Course completion and quiz mastery are different. Each subject keeps its own color; missing records are not zero grades.");
const filters=make("div","grade09-progress-controls");
const all=make("button","grade09-progress-filter",(grade10Copy||grade11Copy||grade12Copy)?"All Classes":"All eight subjects");
const review=make("button","grade09-progress-filter",(grade10Copy||grade11Copy||grade12Copy)?"Needs Attention":"Needs review");
all.type="button";review.type="button";
filters.append(all,review);
const status=make("p","grade09-progress-status");
status.setAttribute("role","status");
const graph=make("div","grade09-progress-graph");
const detail=make("div","grade09-progress-detail");
detail.setAttribute("aria-live","polite");
chart.append(chartTitle,intro,filters,status,graph,detail);
chartArea.append(chart);
/* Match the approved Grade 09 popup: graph first, checkpoints underneath. */
body.append(chartArea,checkpointsArea);
dialog.append(header,body);
document.body.append(dialog);
let selected=0,mode="all",lastLauncher=null;
close.addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
dialog.addEventListener("close",()=>lastLauncher?.isConnected&&lastLauncher.focus());
function registered(){
 const context=window.KhaemenesHighProfileGradeContext?.active?.();
 const active=window.KhaemenesStudentProfileV2?.activeLearner?.();
 const contract=window.KhaemenesCourseEntryContract?.readAcademyProfile?.();
 const id=active?.learnerId;
 return context?.gradeNumber===grade&&id&&contract?.learnerId&&String(id)===String(contract.learnerId)?String(id):null;
}
const slots=()=>window.KhaemenesHighEightClass?.slots?.(grade)||[];
const valid=n=>typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=100;
function readData(){
 const learner=registered();
 const snapshots=learner?window.KhaemenesLearningContinuation?.readLearner?.(learner)||[]:[];
 return {learner,rows:slots().map((item,index)=>{
  const snap=snapshots.find(s=>s.courseId===item.id&&!s.stale);
  const stale=snapshots.some(s=>s.courseId===item.id&&s.stale);
  const percent=valid(snap?.progress?.percent)?snap.progress.percent:null;
  const mastery=valid(snap?.mastery?.best)?snap.mastery.best:null;
  const threshold=valid(snap?.mastery?.threshold)?snap.mastery.threshold:80;
  const needsReview=Boolean(stale||snap?.status==="corrections"||snap?.status==="mastery"||snap?.family?.needsAction);
  return {index,item,snap,percent,mastery,threshold,stale,needsReview,color:COLORS[index%COLORS.length]};
 })};
}
function checkpointSnapshot(){
 checkpointsArea.replaceChildren();
 const source=$("upperGradeAcademicCheckpoints");
 // A visitor enrolled in another grade may see public course names,
 // but never another learner's checkpoints, results or private links.
 if(!registered()){
  const preview=make("section","grade09-academic-checkpoints");
  preview.id="grade09AcademicCheckpoints";
  preview.append(
   make("h3","","Today's Class Checkpoints"),
   make("p","grade09-daily-focus-explanation",grade10Copy?"Choose your Grade 10 student profile to see your personal checkpoints and class progress.":grade11Copy?"Choose your Grade 11 student profile to see your checkpoints and progress.":grade12Copy?"Choose your Grade 12 student profile to review your remaining checkpoints and progress.":"This Grade "+grade+" course-layout preview contains no learner scores or completion records. Select a registered Grade "+grade+" learner to view personal checkpoints.")
  );
  const grid=make("div","grade09-academic-grid");
  for(const [index,slot] of slots().slice(0,8).entries()){
   for(const kind of ["Classwork","Review & practice"]){
    const card=make("article","grade09-academic-box");
    card.append(
     make("span","grade09-academic-number",String(index*2+(kind==="Classwork"?1:2)).padStart(2,"0")),
     make("strong","",slot.label||"Subject"),
     make("small","",kind),
     make("small","",(grade10Copy||grade11Copy||grade12Copy)?"Choose your student profile":"Select a registered Grade "+grade+" learner")
    );
    grid.append(card);
   }
  }
  preview.append(grid);
  checkpointsArea.append(preview);
  return;
 }
 if(!source){checkpointsArea.append(make("p","","Class checkpoints are available on the profile page."));return;}
 // Display-only snapshot: the original accessible collapsed checkpoint component
 // remains immediately above Support Free Access. Avoid duplicate IDs.
 const clone=source.cloneNode(true);
 clone.id="grade09AcademicCheckpoints";clone.classList.add("upper-grade-checkpoints-dialog-copy");
 for(const el of clone.querySelectorAll("[id]"))el.removeAttribute("id");
 for(const el of clone.querySelectorAll("[hidden]"))el.removeAttribute("hidden");
 checkpointsArea.append(clone);
}
function showDetails(row){
 detail.replaceChildren();
 if(!row){detail.append(make("p","",grade10Copy?"Choose a class to see your progress details.":grade11Copy?"Choose a class to review its progress and next step.":grade12Copy?"Choose a class to review what is finished and what still needs your attention.":"Select a class to view its verified reports."));return;}
 detail.style.setProperty("--subject-color",row.color);
 detail.append(
  make("h3","",row.item.title||row.item.label),
  make("p","",row.percent===null?((grade10Copy||grade11Copy)?"Class progress: nothing to show yet.":"Course completion: not reported."):((grade10Copy||grade11Copy)?"Class progress: "+Math.round(row.percent)+"%.":"Course completion: "+Math.round(row.percent)+"%.")),
  make("p","",row.mastery===null?((grade10Copy||grade11Copy)?"Assessment progress: nothing to show yet.":"Assessment mastery: not reported."):((grade10Copy||grade11Copy)?"Best assessment score: "+Math.round(row.mastery)+"% · goal "+row.threshold+"%.":"Best reported assessment mastery: "+Math.round(row.mastery)+"% (target "+row.threshold+"%).")),
  make("p","",row.stale?((grade10Copy||grade11Copy)?"Open this class once to refresh its progress.":"Course snapshot needs refresh. Reopen the course."):row.snap?.nextTitle?"Next: "+row.snap.nextTitle:(grade10Copy?"Open the class to choose your next step.":grade11Copy?"Open the class to review what comes next.":"Open the class to review its learning plan."))
 );
 if(row.snap?.progress?.completed!=null&&row.snap?.progress?.total)
  detail.append(make("p","grade09-progress-units",(grade10Copy||grade11Copy||grade12Copy)?row.snap.progress.completed+" of "+row.snap.progress.total+" activities completed.":row.snap.progress.completed+" of "+row.snap.progress.total+" reported course items complete."));
 const href=row.snap?.nextHref||row.item.href;
 if(typeof href==="string"&&/^https:\/\//i.test(href)){
  const a=make("a","grade09-progress-open","Open "+row.item.label);
  a.href=href;detail.append(a);
 }
 detail.append(make("p","grade09-progress-forecast",grade10Copy?"Keep working in this class and your progress trend will appear here.":grade11Copy?"Your progress trend will become more useful as you build a little more history in this class.":grade12Copy?"Use your progress trend to decide where your remaining time and attention will matter most.":"Forecast unavailable: at least two dated completion snapshots spanning a day are required. No grade or prediction is inferred."));
 if(row.needsReview)detail.append(make("p","grade09-progress-review",grade10Copy?"This class needs a little attention. Check corrections, your next mastery goal, or the next assessment.":grade11Copy?"This class may need attention. Review corrections, your next mastery goal, or the next assessment before moving on.":grade12Copy?"This class still needs attention. Review corrections, your next mastery goal, or the next assessment so you can close it out well.":"Course reports attention needed. Check corrections, mastery requirements, or the next assessment."));
}
function render(){
 const {learner,rows}=readData();
 dialog.classList.toggle("grade09-progress-dialog-unregistered",!learner);
 for(const [b,k] of [[all,"all"],[review,"review"]])b.setAttribute("aria-pressed",String(mode===k));
 const reported=rows.filter(r=>r.percent!==null).length;
 const flagged=rows.filter(r=>r.needsReview).length;
 status.textContent=learner?(grade10Copy?reported+" of "+rows.length+" classes have progress to show · "+flagged+" may need attention.":grade11Copy?reported+" of "+rows.length+" classes have progress to review · "+flagged+" may need attention.":reported+" of "+rows.length+" course-completion records available · "+flagged+" with reported review needs. No score is inferred from missing data."):(grade10Copy?"Choose your Grade 10 student profile to see your progress.":grade11Copy?"Choose your Grade 11 student profile to review your progress.":"Select a registered Grade "+grade+" learner to view private progress. Missing results are not zero grades.");
 graph.replaceChildren();
 const visible=mode==="review"?rows.filter(r=>r.needsReview):rows;
 if(!visible.length)graph.append(make("p","grade09-progress-empty",grade10Copy?"Nothing needs attention right now.":grade11Copy?"Nothing needs attention right now. Use this space to keep an eye on your priorities.":grade12Copy?"Nothing needs attention right now. Keep using this view to make sure your final work stays on track.":"No course records currently report a review need."));
 for(const row of visible){
  const item=make("button","grade09-progress-row"+(row.index===selected?" is-selected":""));
  item.type="button";item.dataset.courseIndex=String(row.index);
  item.setAttribute("aria-pressed",String(row.index===selected));
  const label=make("span","grade09-progress-label",row.item.label);
  const track=make("span","grade09-progress-track");
  const fill=make("span","grade09-progress-fill");
  fill.style.width=(row.percent??0)+"%";fill.style.backgroundColor=row.color;track.append(fill);
  if(row.percent!==null){
   track.setAttribute("role","progressbar");
   track.setAttribute("aria-valuemin","0");track.setAttribute("aria-valuemax","100");
   track.setAttribute("aria-valuenow",String(row.percent));
  }else track.setAttribute("aria-label",row.item.label+" completion not reported");
  const value=make("span","grade09-progress-value",row.percent===null?(row.stale?"Needs refresh":"Not reported"):Math.round(row.percent)+"%");
  item.append(label,track,value);
  item.addEventListener("click",()=>{selected=row.index;render()});
  graph.append(item);
 }
 if(!rows.some(r=>r.index===selected))selected=0;
 showDetails(learner?rows.find(r=>r.index===selected):null);
}
all.addEventListener("click",()=>{mode="all";render()});
review.addEventListener("click",()=>{mode="review";render()});
function open(){
 const launcher=document.activeElement;
 if(launcher instanceof HTMLElement)lastLauncher=launcher;
 checkpointSnapshot();render();
 if(!dialog.open)dialog.showModal();
 close.focus();
}
for(const event of ["khaemenes-learning-continuation-changed","khaemenes-learning-continuation-ready","khaemenes-course-pins-changed","khaemenes-student-profile-changed","focus","pageshow"])
 window.addEventListener(event,()=>{if(dialog.open){checkpointSnapshot();render();}});
 window.addEventListener("storage",event=>{
  if(!dialog.open)return;
  const key=String(event.key||"");
  if(!key||key==="khaemenes.learning.continuation.v1"||key.includes("active_learner")||key.includes("pinned")||key.includes("language")||key.includes("family_registry")){
   checkpointSnapshot();render();
  }
 });
window.KhaemenesUpperGradeClassProgressDialog=Object.freeze({version:"1.0.0",open,close:()=>dialog.open&&dialog.close()});
})();

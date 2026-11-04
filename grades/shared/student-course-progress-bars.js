/* Read-only class completion summary; percentages exclusively from course continuation snapshots. */
(()=>{"use strict";
const grade=(location.pathname.match(/\/grade-(09|10|11|12)\/student-profile\//)||[])[1];
if(!grade)return;
// Grade 09 owns an eight-subject interactive chart; preserve this legacy view for Grades 10–12.
if(grade==="09"){mountGradeNineChart();return;}
function mountGradeNineChart(){
 const catalog=window.KhaemenesHighEightClass,registry=window.KhaemenesGrade09Courses;
 const pins=window.KhaemenesHighCoursePins,contract=window.KhaemenesCourseEntryContract;
 if(!catalog||!registry||!pins||!contract)return;
 const COLORS=["#D53E4F","#F46D43","#FDAE61","#FEE08B","#E6F598","#ABDDA4","#66C2A5","#3288BD"];
 const text=(tag,cls,label)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(label!==undefined)n.textContent=label;return n};
 const chart=text("section","grade09-class-progress");
 chart.id="studentCourseProgress";chart.setAttribute("aria-label","Eight-class progress dashboard");
 const title=text("h2","","My Class Progress");
 const introduction=text("p","grade09-progress-intro","Course completion and quiz mastery are different. Each subject keeps its own color; missing records are not zero grades.");
 const controls=text("div","grade09-progress-controls");
 const status=text("p","grade09-progress-status");
 const graph=text("div","grade09-progress-graph");
 const detail=text("div","grade09-progress-detail");detail.setAttribute("aria-live","polite");
 chart.append(title,introduction,controls,status,graph,detail);
 const schedule=document.querySelector(".grade09-priority-schedule");
 if(!schedule)return;
 schedule.insertAdjacentElement("afterend",chart);
 const active=()=>{const x=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
  const y=contract.readAcademyProfile?.()?.learnerId;
  return x&&y&&String(x)===String(y)?String(x):null};
 let selected=-1,mode="all";
 const allButton=text("button","grade09-progress-filter","All eight subjects");
 const needsButton=text("button","grade09-progress-filter","Needs review");
 for(const [button,value] of [[allButton,"all"],[needsButton,"review"]]){
  button.type="button";button.addEventListener("click",()=>{mode=value;render()});
 }
 controls.append(allButton,needsButton);
 function data(){
  const learner=active();
  const continuation=window.KhaemenesLearningContinuation;
  const snaps=learner?continuation?.readLearner?.(learner)||[]:[];
  const language=pins.readLanguageChoices()?.["9"]||"";
  const slots=catalog.slots(9,{mathId:registry.mathPathway()||null,language});
  return {learner,rows:slots.map((slot,index)=>{
   const course=slot.id?registry.getCourse(slot.id):null;
   const snap=course?snaps.find(s=>s.courseId===course.id&&!s.stale):null;
   const pct=snap?.progress?.percent;
   const percent=typeof pct==="number"&&Number.isFinite(pct)&&pct>=0&&pct<=100?pct:null;
   const best=snap?.mastery?.best;
   const mastery=typeof best==="number"&&Number.isFinite(best)&&best>=0&&best<=100?best:null;
   const threshold=snap?.mastery?.threshold??80;
   const mastered=Boolean(snap?.mastery?.mastered)&&mastery!==null&&mastery>=threshold;
   const stale=course?snaps.some(s=>s.courseId===course.id&&s.stale):false;
   return {index,subject:slot.label,course,snap,percent,mastery,threshold,mastered,stale,color:COLORS[index],
    needsReview:Boolean(stale||snap?.status==="corrections"||snap?.status==="mastery"||snap?.family?.needsAction)};
  })};
 }
 function render(){
  const {learner,rows}=data();
  for(const [b,k] of [[allButton,"all"],[needsButton,"review"]])b.setAttribute("aria-pressed",String(mode===k));
  graph.replaceChildren();
  if(!learner){
   status.textContent="Choose an Academy learner to view private progress. No personal scores are shown.";
   detail.replaceChildren();return;
  }
  const available=rows.filter(r=>r.percent!==null).length;
  const flagged=rows.filter(r=>r.needsReview).length;
  status.textContent=available+" of 8 course-completion records available · "+flagged+" with reported review needs. No score is inferred from missing data.";
  const displayed=mode==="review"?rows.filter(r=>r.needsReview):rows;
  if(!displayed.length)graph.append(text("p","grade09-progress-empty","No course records currently report a review need. Unreported progress is still shown under All eight subjects."));
  displayed.forEach(r=>{
   const item=text("button","grade09-progress-row"+(selected===r.index?" is-selected":""));
   item.type="button";item.dataset.courseIndex=String(r.index);
   item.setAttribute("aria-label",r.subject+": "+(r.percent===null?"completion not reported":Math.round(r.percent)+" percent completed")+"; view details");
   item.setAttribute("aria-pressed",String(selected===r.index));
   const label=text("span","grade09-progress-label",r.subject);
   const track=text("span","grade09-progress-track");
   const fill=text("span","grade09-progress-fill");
   fill.style.width=(r.percent===null?0:r.percent)+"%";
   fill.style.backgroundColor=r.color;
   track.append(fill);
   if(r.percent!==null){
    track.setAttribute("role","progressbar");
    track.setAttribute("aria-label",r.subject+" course completion");
    track.setAttribute("aria-valuemin","0");track.setAttribute("aria-valuemax","100");
    track.setAttribute("aria-valuenow",String(r.percent));
   }else track.setAttribute("aria-label",r.subject+" completion not reported");
   const value=text("span","grade09-progress-value",r.percent===null?(r.stale?"Needs refresh":"Not reported"):Math.round(r.percent)+"%");
   item.append(label,track,value);
   item.addEventListener("click",()=>{selected=r.index;showDetails(r);renderRowsSelection()});
   graph.append(item);
  });
  if(selected<0||!rows.some(r=>r.index===selected))selected=0;
  const current=rows.find(r=>r.index===selected);
  if(current)showDetails(current);
  renderRowsSelection();
  function renderRowsSelection(){
   for(const item of graph.querySelectorAll("[data-course-index]")){
    const yes=Number(item.dataset.courseIndex)===selected;
    item.classList.toggle("is-selected",yes);item.setAttribute("aria-pressed",String(yes));
   }
  }
 }
 function showDetails(r){
  detail.replaceChildren();
  detail.style.setProperty("--subject-color",r.color);
  const name=text("h3","",r.course?.title||r.subject);
  const state=text("p","",r.percent===null?"Course completion: not reported.":"Course completion: "+Math.round(r.percent)+"%.");
  const assessment=text("p","",r.mastery===null?"Assessment mastery: not reported.":"Best reported assessment mastery: "+Math.round(r.mastery)+"% (target "+r.threshold+"%).");
  const next=text("p","",r.stale?"This course snapshot is stale. Reopen the course to refresh progress.":r.snap?.nextTitle?"Next: "+r.snap.nextTitle:"Open the class to review its learning plan.");
  detail.append(name,state,assessment,next);
  if(r.course){
   const link=text("a","grade09-progress-open","Open "+r.subject);
   link.href=r.snap?.nextHref||r.course.home;detail.append(link);
  }
  if(r.snap?.progress?.completed!==null&&r.snap?.progress?.completed!==undefined&&r.snap?.progress?.total){
   const total=r.snap.progress.total,completed=r.snap.progress.completed;
   detail.append(text("p","grade09-progress-units",completed+" of "+total+" reported course items complete. Unit/week breakdown appears only when the course publishes it."));
  }
  if(r.needsReview)detail.append(text("p","grade09-progress-review","Course reports attention needed. Check corrections, mastery requirements, or the next assessment."));
 }
 render();
 for(const event of ["khaemenes-learning-continuation-changed","khaemenes-learning-continuation-ready","khaemenes-course-pins-changed","khaemenes-grade09-language-changed","khaemenes-student-profile-changed","focus","pageshow"])
  window.addEventListener(event,render);
 window.addEventListener("storage",e=>{if(!e.key||e.key.includes("continuation")||e.key.includes("active_learner")||e.key.includes("pinned")||e.key.includes("language"))render()});
}

const continuation=window.KhaemenesLearningContinuation;
const profile=window.KhaemenesStudentProfileV2;
const contract=window.KhaemenesCourseEntryContract;
const learnerId=()=>{const a=profile?.activeLearner?.()?.learnerId,b=contract?.readAcademyProfile?.()?.learnerId;return a&&b&&String(a)===String(b)?String(a):null};
const initial=learnerId();
const host=document.createElement("section");host.id="studentCourseProgress";host.style.cssText="margin:14px 0 22px;padding:15px;border:1px solid #aa9675;border-radius:7px;background:#182b3c;color:#f1ece3;font:400 15px/1.5 Arial,sans-serif";
const h=document.createElement("h2");h.textContent="My Class Progress";h.style.cssText="margin:0 0 6px;font-size:21px;font-weight:400;color:#f2e6cc";host.append(h);
const explanation=document.createElement("p");explanation.textContent="Completion is shown only when a course has reported a percentage. A blank record is not a zero grade.";explanation.style.margin="3px 0 12px";host.append(explanation);
const area=document.createElement("div");area.style.cssText="display:grid;gap:10px";host.append(area);
const gradeCourses={
"10":[["Mathematics","algebra-1"],["Language Arts","english-10"],["Social Studies","social-studies-10"],["Science","biology-10"],["Physical Education","physical-education-10"],["Foreign Language","world-language-10"],["Elective","elective-10"]],
"11":[["Mathematics","geometry"],["Language Arts","english-11"],["Social Studies","social-studies-11"],["Science","chemistry-11"],["Physical Education","physical-education-11"],["Foreign Language","world-language-11"],["Elective","elective-11"]],
"12":[["Mathematics","algebra-2"],["Language Arts","english-12"],["Social Studies","social-studies-12"],["Science","physics-engineering-12"],["Physical Education","physical-education-12"],["Foreign Language","world-language-12"],["Elective","elective-12"]]};
const classroom=document.getElementById("upperClasses");
const gradeNine=document.querySelector(".grade09-priority-schedule");
if(classroom)classroom.insertAdjacentElement("afterbegin",host);
else if(gradeNine)gradeNine.insertAdjacentElement("afterend",host);
else return;
function classes(){if(grade!=="09")return gradeCourses[grade]||[];
const reg=window.KhaemenesGrade09Courses;
return (reg?.pinnedCourses?.()||[]).map(c=>[String(c.title||c.name||"Class"),String(c.id||"")]).filter(c=>c[1]);}
function render(){
 area.replaceChildren();
 if(!initial||learnerId()!==initial){area.textContent="Select your learner and reload to display private class progress.";return}
 const snapshots=continuation?.readLearner?.(initial)||[];
 const rows=classes();
 if(!rows.length){area.textContent="Pin your classes to display their progress here.";return}
 rows.forEach(([name,id],idx)=>{
  const snap=snapshots.find(s=>s.courseId===id);
  const percentage=snap?.progress?.percent;
  const valid=typeof percentage==="number"&&Number.isFinite(percentage)&&percentage>=0&&percentage<=100;
  const row=document.createElement("div");row.style.cssText="display:grid;grid-template-columns:minmax(105px,190px) minmax(80px,1fr) 88px;gap:10px;align-items:center";
  const label=document.createElement("span");label.textContent=name;label.style.cssText="overflow-wrap:anywhere";
  const track=document.createElement("div");track.style.cssText="height:10px;border-radius:9px;background:#475363;overflow:hidden";
  const fill=document.createElement("div");fill.style.cssText="width:"+(valid?percentage:0)+"%;height:100%;border-radius:9px;background:"+["#7ec6b5","#cfae73","#7cadd4","#af94d5","#e5a2a2","#8ac8d6","#b7c87c"][idx%7];
  track.append(fill);track.setAttribute("role","progressbar");track.setAttribute("aria-label",name+" course completion");track.setAttribute("aria-valuemin","0");track.setAttribute("aria-valuemax","100");
  if(valid)track.setAttribute("aria-valuenow",String(percentage));else track.setAttribute("aria-valuetext","Completion not yet reported");
  const value=document.createElement("span");value.textContent=valid?Math.round(percentage)+"%":"Not reported";value.style.cssText="text-align:right;font-size:13px;color:#f5e8cc";
  row.append(label,track,value);area.append(row);
 });
}
render();
for(const name of ["khaemenes-learning-continuation-changed","khaemenes-course-pins-changed","khaemenes-student-profile-changed","focus","pageshow"])window.addEventListener(name,render);
window.addEventListener("storage",e=>{if(!e.key||e.key==="khaemenes.learning.continuation.v1"||e.key==="khaemenes_active_learner_v1")render()});
})();
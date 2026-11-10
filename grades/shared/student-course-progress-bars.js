/* Read-only class completion summary; percentages exclusively from course continuation snapshots. */
(()=>{"use strict";
const grade=(location.pathname.match(/\/grade-(09|10|11|12)\/student-profile\//)||[])[1];
if(!grade)return;
// Grade 09 remains the original fully featured owner.
// Grades 10–12 now use the same visual dialog model with independent
// registered-grade data; retire the outdated in-page chart entirely.
if(grade!=="09")return;
mountGradeNineChart();return;
function mountGradeNineChart(){
 const catalog=window.KhaemenesHighEightClass,registry=window.KhaemenesGrade09Courses;
 const pins=window.KhaemenesHighCoursePins,contract=window.KhaemenesCourseEntryContract;
 if(!catalog||!registry||!pins||!contract)return;
 const COLORS=["#D53E4F","#F46D43","#FDAE61","#FEE08B","#E6F598","#ABDDA4","#66C2A5","#3288BD"];
 const text=(tag,cls,label)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(label!==undefined)n.textContent=label;return n};
 const chart=text("section","grade09-class-progress");
 chart.id="studentCourseProgress";chart.setAttribute("aria-label","Eight-class progress dashboard");
 const title=text("h2","","My Class Progress");
 const introduction=text("p","grade09-progress-intro","This chart helps you see how far you have moved through each class. Assessment progress is separate, and a blank result simply means there is nothing to show yet.");
 const controls=text("div","grade09-progress-controls");
 const status=text("p","grade09-progress-status");
 const graph=text("div","grade09-progress-graph");
 const detail=text("div","grade09-progress-detail");detail.setAttribute("aria-live","polite");
 const overview=text("div","grade09-progress-overview");overview.setAttribute("aria-label","Class reporting summary");
 const connectionsButton=text("button","grade09-progress-filter","Class connections");
 connectionsButton.type="button";
 connectionsButton.setAttribute("aria-controls","grade09ProgressConnections");
 connectionsButton.setAttribute("aria-expanded","false");
 const connections=text("section","grade09-progress-connections");connections.id="grade09ProgressConnections";connections.hidden=true;
 connections.setAttribute("aria-label","Course reporting diagnostics");
 connectionsButton.addEventListener("click",()=>{
  connections.hidden=!connections.hidden;
  connectionsButton.setAttribute("aria-expanded",String(!connections.hidden));
  if(!connections.hidden)renderConnections();
 });
 chart.append(title,introduction,controls,overview,status,graph,detail,connections);
 const schedule=document.querySelector(".grade09-priority-schedule");
 if(!schedule)return;
 schedule.insertAdjacentElement("afterend",chart);
 const active=()=>{const x=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
  const y=contract.readAcademyProfile?.()?.learnerId;
  return x&&y&&String(x)===String(y)?String(x):null};
 // Idempotent Monte Carlo-style determinator: forecasts ONLY. It cannot award mastery.
 // Save only verified snapshot percentages and timestamps, never derived grades.
 const HISTORY_PREFIX="khaemenes-grade09-progress-observations-v1:";
 const historyKey=(learner,course)=>HISTORY_PREFIX+encodeURIComponent(learner)+":"+encodeURIComponent(course);
 const validPercent=n=>typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=100;
 function observations(learner,courseId,snap){
  if(!learner||!courseId)return [];
  const key=historyKey(learner,courseId);
  let rows=[];try{const raw=JSON.parse(localStorage.getItem(key)||"[]");if(Array.isArray(raw))rows=raw.filter(x=>Number.isFinite(x.at)&&validPercent(x.percent)&&x.at<=Date.now()+60000)}catch{}
  if(snap&&!snap.stale&&validPercent(snap.progress?.percent)){
   const at=Date.parse(snap.updatedAt||"");
   if(Number.isFinite(at)&&at<=Date.now()+60000&&!rows.some(x=>x.at===at)){
    rows.push({at,percent:snap.progress.percent});
    rows.sort((a,b)=>a.at-b.at);
    rows=rows.slice(-36);
    // No storage write here. Only the course publisher owns academic evidence.
   }
  }
  return rows.sort((a,b)=>a.at-b.at).slice(-36);
 }
 function hash(seed){
  let v=2166136261;
  for(let i=0;i<seed.length;i++){v=Math.imul(v^seed.charCodeAt(i),16777619)}
  return v>>>0;
 }
 function monteCarloForecast(rows,seed){
  if(rows.length<2)return null;
  const first=rows[0],last=rows[rows.length-1];
  const elapsed=(last.at-first.at)/86400000;
  if(elapsed<1||last.percent<first.percent)return null;
  const daily=(last.percent-first.percent)/elapsed;
  // 256 deterministic trial scenarios; multiplier spans 0.5–1.5 of observed pace.
  // This is a planning sensitivity range, NOT a validated success probability.
  let state=hash(seed+"|"+first.at+"|"+last.at+"|"+first.percent+"|"+last.percent)||1;
  const next=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296};
  const values=[];
  for(let i=0;i<256;i++){
   const factor=.5+next();
   values.push(Math.min(100,last.percent+daily*28*factor));
  }
  values.sort((a,b)=>a-b);
  return {lower:values[25],upper:values[230],base:Math.min(100,last.percent+daily*28),days:28,samples:256};
 }
 let selected=-1,mode="all";
 const allButton=text("button","grade09-progress-filter","All eight subjects");
 const needsButton=text("button","grade09-progress-filter","Needs review");
 for(const [button,value] of [[allButton,"all"],[needsButton,"review"]]){
  button.type="button";button.addEventListener("click",()=>{mode=value;render()});
 }
 const refreshButton=text("button","grade09-progress-filter","Recheck reports");
 refreshButton.type="button";refreshButton.title="Re-read saved progress from this browser; this does not submit or award grades.";
 refreshButton.addEventListener("click",render);
 controls.append(allButton,needsButton,connectionsButton,refreshButton);
 function data(){
  const learner=active();
  const continuation=window.KhaemenesLearningContinuation;
  const snaps=learner?continuation?.readLearner?.(learner)||[]:[];
  const language=pins.readLanguageChoices()?.["9"]||"";
  const slots=catalog.slots(9,{mathId:registry.mathPathway()||null,language});
  return {learner,rows:slots.map((slot,index)=>{
   const course=slot.id?registry.getCourse(slot.id):null;
   const snap=course?snaps.find(s=>s.courseId===course.id&&!s.stale):null;
   const latest=course?snaps.find(s=>s.courseId===course.id):null;
   const pct=snap?.progress?.percent;
   const percent=typeof pct==="number"&&Number.isFinite(pct)&&pct>=0&&pct<=100?pct:null;
   const best=snap?.mastery?.best;
   const mastery=typeof best==="number"&&Number.isFinite(best)&&best>=0&&best<=100?best:null;
   const threshold=snap?.mastery?.threshold??80;
   const mastered=Boolean(snap?.mastery?.mastered)&&mastery!==null&&mastery>=threshold;
   const stale=course?snaps.some(s=>s.courseId===course.id&&s.stale):false;
   const history=course&&learner?observations(learner,course.id,snap):[];
   const forecast=percent!==null&&course&&learner?monteCarloForecast(history,learner+"|"+course.id):null;
   return {index,subject:slot.label,course,snap,latest,percent,mastery,threshold,mastered,stale,color:COLORS[index],forecast,
    needsReview:Boolean(stale||snap?.status==="corrections"||snap?.status==="mastery"||snap?.family?.needsAction)};
  })};
 }
 function render(){
  const {learner,rows}=data();
  for(const [b,k] of [[allButton,"all"],[needsButton,"review"]])b.setAttribute("aria-pressed",String(mode===k));
  graph.replaceChildren();
  overview.replaceChildren();
  const metric=(label,value)=>{
   const card=text("div","grade09-progress-metric");
   card.append(text("span","",label),text("strong","",value));
   overview.append(card);
  };
  metric("Selected classes",rows.filter(r=>r.course).length+" / 8");
  metric("Reporting progress",learner?rows.filter(r=>r.percent!==null).length+" / 8":"—");
  metric("Needs attention",learner?String(rows.filter(r=>r.needsReview).length):"—");
  if(!connections.hidden)renderConnections(learner,rows);
  if(!learner){
   status.textContent="Choose your Grade 9 student profile to see your personal class progress.";
   for(const r of rows){
    const item=text("div","grade09-progress-row grade09-progress-placeholder");
    const label=text("span","grade09-progress-label",r.subject);
    const track=text("span","grade09-progress-track");
    track.setAttribute("role","img");
    track.setAttribute("aria-label",r.subject+" · completion not reported");
    const color=text("span","grade09-progress-placeholder-key");
    color.style.backgroundColor=r.color;
    track.append(color);
    const value=text("span","grade09-progress-value","Not reported");
    item.append(label,track,value);graph.append(item);
   }
   detail.replaceChildren(text("p","grade09-progress-empty","Choose your student profile, then pick a class to see what you have finished and what comes next."));
   return;
  }
  const available=rows.filter(r=>r.percent!==null).length;
  const flagged=rows.filter(r=>r.needsReview).length;
  status.textContent=available+" of 8 classes report completion · "+flagged+" need review. Unreported does not mean zero.";
  const displayed=mode==="review"?rows.filter(r=>r.needsReview):rows;
  if(!displayed.length)graph.append(text("p","grade09-progress-empty","Nothing needs attention right now. You can still look through all eight classes."));
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
   const value=text("span","grade09-progress-value",r.percent===null?(r.stale?"Needs refresh":r.course?"Not reported":"Select class"):Math.round(r.percent)+"%");
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
  const state=text("p","",r.percent===null?(r.stale?"This class has an older report that needs refreshing.":r.course?"No verified course completion percentage has been reported in this browser.":"Select this class from My Schedule to begin tracking."):"Course-reported completion: "+Math.round(r.percent)+"%.");
  const assessment=text("p","",r.mastery===null?"Assessment progress: nothing to show yet.":"Best assessment score: "+Math.round(r.mastery)+"% · goal "+r.threshold+"%.");
  const next=text("p","",r.stale?"Open this class once to refresh your progress.":r.snap?.nextTitle?"Next: "+r.snap.nextTitle:"Open the class when you are ready to choose your next step.");
  detail.append(name,state,assessment,next);
  const statusValue=r.snap?.status||r.latest?.status;
  const descriptors={continue:"Ready to continue",practice:"Practice in progress",corrections:"Corrections needed",mastery:"Mastery step pending",assessment:"Assessment pending",complete:"Course reported complete",paused:"Paused / recovery"};
  detail.append(text("p","grade09-progress-source","Course status: "+(descriptors[statusValue]||"No status report received")+"."));
  if(r.latest?.updatedAt){
   const stamp=new Date(r.latest.updatedAt);
   if(Number.isFinite(stamp.getTime()))detail.append(text("p","grade09-progress-source","Last report: "+stamp.toLocaleString()+"."));
  }
  if(r.latest?.source)detail.append(text("p","grade09-progress-source","Reporting source: "+String(r.latest.source)+"."));
  if(r.snap?.summary)detail.append(text("p","grade09-progress-summary",r.snap.summary));
  if(r.snap?.family?.needsAction)detail.append(text("p","grade09-progress-review","Family follow-up: "+(r.snap.family.label||"Action requested")+"."));
  if(r.mastered)detail.append(text("p","grade09-progress-mastery","This course report marks the current mastery threshold as reached; official grading remains in the course record."));
  if(r.course){
   const link=text("a","grade09-progress-open","Open "+r.subject);
   const suggested=r.snap?.nextHref;
   link.href=typeof suggested==="string"&&/^https:\/\//i.test(suggested)?suggested:r.course.home;
   detail.append(link);
  }
  if(r.snap?.progress?.completed!==null&&r.snap?.progress?.completed!==undefined&&r.snap?.progress?.total){
   const total=r.snap.progress.total,completed=r.snap.progress.completed;
   detail.append(text("p","grade09-progress-units",completed+" of "+total+" activities completed."));
  }
  const forecastText=r.forecast
   ?"Historical observation estimate: 28-day completion could range from "+Math.round(r.forecast.lower)+"–"+Math.round(r.forecast.upper)+"%. This estimate is not a grade or guarantee."
   :"A trend estimate requires at least two dated course reports over more than one day. No trend has been calculated.";
  detail.append(text("p","grade09-progress-forecast",forecastText));
  if(r.needsReview)detail.append(text("p","grade09-progress-review","This class needs a little attention. Check corrections, your next goal, or the next assessment."));
 }
 function renderConnections(givenLearner,givenRows){
  const value=givenRows?{learner:givenLearner,rows:givenRows}:data();
  connections.replaceChildren();
  connections.append(text("h3","","Reporting connections"));
  connections.append(text("p","","These are summaries provided by courses on this device, not certified Account Cloud transcripts."));
  if(!value.learner){
   connections.append(text("p","","Select the registered learner to inspect private course reporting."));return;
  }
  for(const row of value.rows){
   const item=text("div","grade09-progress-connection-row");
   let report="No current course report received";
   if(!row.course)report="Choose a class in My Schedule";
   else if(row.stale)report="Old report detected · revisit class to refresh";
   else if(row.percent!==null)report="Reporting · "+Math.round(row.percent)+"% completion";
   else if(row.latest)report="Connected · no completion percentage supplied";
   item.append(text("span","",row.subject+" · "+(row.course?.title||"Unselected")),text("span","",report));
   connections.append(item);
  }
 }
 render();
 for(const event of ["khaemenes-grade09-progress-refresh","khaemenes-learning-continuation-changed","khaemenes-learning-continuation-ready","khaemenes-course-pins-changed","khaemenes-grade09-language-changed","khaemenes-student-profile-changed","focus","pageshow"])
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
function classes(){if(grade!=="09"){
 const eight=window.KhaemenesHighEightClass?.slots?.(Number(grade));
 if(Array.isArray(eight)&&eight.length)return eight.map(item=>[item.label,item.id]).filter(row=>row[1]);
 return gradeCourses[grade]||[];
 }
const reg=window.KhaemenesGrade09Courses;
return (reg?.pinnedCourses?.()||[]).map(c=>[String(c.title||c.name||"Class"),String(c.id||"")]).filter(c=>c[1]);}
function render(){
 area.replaceChildren();
 if(!initial||learnerId()!==initial||window.KhaemenesHighProfileGradeContext?.active?.()?.gradeNumber!==Number(grade)){area.textContent="Select your registered Grade "+Number(grade)+" learner to display private class progress.";return}
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
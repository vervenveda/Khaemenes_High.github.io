/* Dedicated Schedule landing page. Read-only evidence; only canonical pin controls write. */
(()=>{"use strict";
const root=document.getElementById("scheduleApp");if(!root)return;
const grade=String(document.body.dataset.grade||"").padStart(2,"0");
const catalog=window.KhaemenesHighEightClass,pins=window.KhaemenesHighCoursePins,continuation=window.KhaemenesLearningContinuation;
const gradeCtx=window.KhaemenesHighProfileGradeContext;
const profile=window.KhaemenesStudentProfileV2,contract=window.KhaemenesCourseEntryContract;
const g9=window.KhaemenesGrade09Courses;
const pathBase="https://vervenveda.com/Khaemenes_High.github.io/grades/grade-"+grade+"/student-profile/";
const languageDirectory="https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/high-school-language-directory/?grade="+grade;
const $=id=>document.getElementById(id);
const valid=n=>typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=100;
const fmt=n=>Number.isInteger(n)?String(n):n.toFixed(1);
function student(){
 const ctx=gradeCtx?.active?.();
 const a=profile?.activeLearner?.()?.learnerId;
 const c=contract?.readAcademyProfile?.()?.learnerId;
 if(!ctx||ctx.grade!==grade||!a||!c||String(a)!==String(c)||String(a)!==String(ctx.learnerId))return null;
 return String(a);
}
function slots(){
 const gradeKey=String(Number(grade));
 const language=pins?.readLanguageChoices?.()?.[gradeKey]||null;
 const electiveId=pins?.readElectiveChoices?.()?.[gradeKey]||null;
 let math=grade==="09"?g9?.mathPathway?.()||null:null;
 if(grade==="10"){
  const id=student();
  const data=id?records(id):[];
  math=data.some(r=>r?.courseId==="geometry")?"geometry":data.some(r=>r?.courseId==="algebra-1")?"algebra-1":null;
 }
 const items=catalog?.slots?.(Number(grade),{mathId:math,language,electiveId})||[];
 if(grade==="09")return items;
 return items.map(item=>item.subject==="foreignLanguage"&&language
   ? {...item,title:language.charAt(0).toUpperCase()+language.slice(1)+" · Language Pathway"}
   : item);
}
const alias=id=>/^english-(10|11|12)$/.test(id||"")?[id,"ela"+id.slice(-2)]:id?[id]:[];
function records(id){try{return (continuation?.readLearner?.(id)||[]).filter(r=>r?.learnerId===id&&r?.courseId)}catch{return []}}
function latestFor(data,courseId){
 const matches=data.filter(r=>alias(courseId).includes(r.courseId));
 return matches.find(r=>!r.stale)||null;
}
function average(record){
 let earned=0,possible=0,count=0;const used=new Set();
 for(const a of Array.isArray(record?.assessments)?record.assessments:[]){
  if(!a||!["quiz","test"].includes(a.kind)||typeof a.id!=="string"||used.has(a.id))continue;
  if(!Number.isFinite(a.earned)||!Number.isFinite(a.possible)||a.earned<0||a.possible<=0||a.earned>a.possible)continue;
  used.add(a.id);earned+=a.earned;possible+=a.possible;count++;
 }
 return {percent:possible?Math.round(earned/possible*1000)/10:null,count};
}
function safeDestination(url,item){
 if(typeof url!=="string"||!url)return null;
 try{
  const dest=new URL(url,location.href);
  if(dest.protocol!=="https:"||dest.hostname!=="vervenveda.com")return null;
  if(item.id&&/^(pre-algebra|algebra-1|geometry|algebra-2|english-\d+|integrated-science-9|biology-10|chemistry-11|physics-engineering-12|global-studies-9|social-studies-\d+)$/.test(item.id)){
   const home=pins.COURSE_META[item.id]?.href;
   if(home){const base=new URL(home);if(dest.origin!==base.origin||!dest.pathname.startsWith(base.pathname))return null;}
  }
  return dest.href;
 }catch{return null}
}
function instructionalRoute(item,record){
 // Upper-grade world-language enrollment remains a selection doorway. A
 // grade alone never implies French 102 or Spanish 102 placement.
 if(item.subject==="foreignLanguage"&&grade!=="09")
  return Promise.resolve({url:languageDirectory,label:"Choose Language",
   detail:"Explore seven language pathways and choose the appropriate level or available lessons."});
 if(!item.id)return null;
 const first=catalog.FIRST_STEPS?.[item.id]||null;
 const home=item.href||null;
 let selected=null;
 if(grade==="09"&&g9?.resolveContinueFor){
  // Grade 09 registry resolves placement, gates and next instructional step.
  return Promise.resolve(g9.resolveContinueFor(item.id)).then(next=>{
   const proposed=safeDestination(next?.url,item);
   const toPath=value=>{try{return new URL(value).pathname.replace(new RegExp("/+$"),"/")}catch{return null}};
   const wasOverview=proposed&&home&&toPath(proposed)===toPath(home)&&next?.hasSpecificLocation!==true;
   const url=(wasOverview?safeDestination(first,item):proposed)||safeDestination(first,item)||safeDestination(home,item);
   return {url,detail:next?.detail||record?.nextTitle||"Select the next learning step.",label:labelFor(url,item),kind:next?.actionLabel||""};
  }).catch(()=>({url:safeDestination(first,item)||safeDestination(home,item),detail:"Open the required step.",label:labelFor(first||home,item)}));
 }
 if(record&&!record.stale&&record.status!=="paused")selected=record.nextHref;
 if(record?.status==="paused")selected=home;
 let url=safeDestination(selected,item)||safeDestination(first,item)||safeDestination(home,item);
 if(url&&record?.status!=="paused"){
  try{
   const target=new URL(url),course=new URL(home||first||url);
   const week=target.pathname.match(new RegExp("/weeks/week-([0-9]{2})/?$"));
   const quiz=record?.status==="mastery"||record?.status==="corrections";
   if(week){
    if(/^english-(10|11|12)$/.test(item.id)){
     if(quiz)url=target.href.split("#")[0]+"#quiz";
     else if(week[1]==="01")url=new URL("weeks/week-01/"+(item.id==="english-10"?"monday/":"lessons/day-01.html"),course).href;
     else url=target.href.split("#")[0]+"#monday";
    }else if(!quiz&&/^(biology-10|chemistry-11|physics-engineering-12)$/.test(item.id))
     url=new URL("weeks/week-"+week[1]+"/lessons/day-01.html",course).href;
    else if(!quiz&&/^social-studies-(10|11|12)$/.test(item.id))
     url=new URL("weeks/week-"+week[1]+"/student-packet.html",course).href;
   }
  }catch{}
 }
 url=safeDestination(url,item);
 return Promise.resolve({url,detail:record?.nextTitle||record?.summary||"Ready for your next step.",label:labelFor(url,item)});
}
function labelFor(url,item){
 if(!url)return "Choose Course";
 const home=item.href;
 try{if(home&&new URL(url).pathname.replace(/\/+$/,"/")===new URL(home).pathname.replace(/\/+$/,"/"))return "Course Options"}catch{}
 return "Class";
}
function element(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n}
function metric(card,title,value,colorClass,note){
 const group=element("div","metric");
 const head=element("div","metric-head");head.append(element("span","",title),element("span","",valid(value)?fmt(value)+"%":"Not yet reported"));
 const bar=element("div","metric-track");bar.setAttribute("role","progressbar");bar.setAttribute("aria-label",title);
 if(valid(value)){bar.setAttribute("aria-valuenow",String(value));bar.setAttribute("aria-valuemin","0");bar.setAttribute("aria-valuemax","100");}
 else bar.setAttribute("aria-valuetext","Not yet reported");
 const fill=element("div","metric-fill "+(colorClass||""));fill.style.width=(valid(value)?value:0)+"%";bar.append(fill);
 group.append(head,bar);if(note)group.append(element("div","metric-note",note));card.append(group);
}
// Source-owned Algebra I readiness review: no unscoped reads or academic writes.
function grade09ReadinessStatus(id){
 if(grade!=="09"||!id)return null;
 try{
  const person=contract?.readAcademyProfile?.();
  if(person?.learnerId!==id)return null;
  const result=contract?.readJSON?.("khaemenes-algebra1-diagnostic-result-v1",null,person);
  if(!result||result.assessment_id!=="KH-MATH-A1-DIAGNOSTIC"||
    (result.attribution?.learnerId&&result.attribution.learnerId!==id))return null;
  const validAttempt=a=>a?.id==="KH-MATH-A1-DIAGNOSTIC"&&a.total===36&&
    Number.isInteger(a.score)&&a.score>=0&&a.score<=36&&
    Number.isFinite(a.percent)&&Math.abs(a.percent-a.score*100/36)<0.2&&
    typeof a.submitted==="string"&&Number.isFinite(Date.parse(a.submitted));
  const all=Array.isArray(result.attempt_history)?result.attempt_history:[];
  const valid=all.filter(validAttempt);
  if(!valid.length&&validAttempt(result.lastResult))valid.push(result.lastResult);
  if(!valid.length)return null;
  return Object.freeze({best:Math.max(...valid.map(a=>a.score)),count:valid.length});
 }catch{return null;}
}
function updateGrade09Readiness(id){
 const panel=$("grade09ReadinessReview"),message=$("grade09ReadinessMessage");
 if(!panel||!message)return;
 if(!id){panel.hidden=true;message.textContent="";return;}
 const evidence=grade09ReadinessStatus(id);
 message.textContent=evidence
  ?"A learner-scoped Algebra I readiness attempt is saved on this device (best recorded score: "+evidence.best+"/36). Review its date and provenance in Student Portfolio. This is not a certified course grade or cloud record."
  :"No learner-linked Algebra I readiness attempt was found in the canonical browser records. Student Portfolio can review a separately saved result and offer explicit learner confirmation if eligible. Do not retake an assessment just to repair its link.";
 panel.hidden=false;
}
let sequence=0;
async function render(){
 const current=++sequence;
 const id=student(),grid=$("scheduleGrid"),message=$("scheduleNotice");
 grid.replaceChildren();
 if(!id){updateGrade09Readiness(null);message.hidden=false;message.textContent="Select your registered Grade "+Number(grade)+" learner in the Academy to view this private schedule. No other learner's records are displayed."; $("scheduleSummary").textContent="Registered learner required";return;}
 message.hidden=true;
 updateGrade09Readiness(id);
 const rows=slots(),all=records(id),chosen=pins.readPins?.()||[],pinned=new Set(chosen);
 $("scheduleSummary").textContent="Your eight subjects, current learning steps and available course evidence.";
 $("countClasses").textContent=String(rows.length);
 $("countPinned").textContent=String(rows.filter(r=>r.id&&pinned.has(r.id)).length);
 const gathered=[];
 for(const [i,item] of rows.entries()){
  const record=latestFor(all,item.id),pct=valid(record?.progress?.percent)?record.progress.percent:null,avg=average(record);
  const result=await instructionalRoute(item,record);
  if(current!==sequence)return;
  gathered.push({pct,average:avg.percent});
  const card=element("article","schedule-card");
  // Course title leads every card. A subject label is only shown when it adds
  // genuinely different information; never repeat the title or an ordinal.
  const title=element("h3","schedule-card-title",item.title||item.label);
  card.append(title);
  const subject=String(item.label||"").trim(),courseName=String(item.title||"").trim();
  const normalize=value=>value.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
  const category=normalize(subject),name=normalize(courseName);
  if(category&&name&&category!==name&&!name.includes(category))
   card.append(element("span","subject",subject));
  const detail=String(result?.detail||"").trim();
  const fallback="Choose a course to begin learning.";
  // Hide generic continuation filler if the actual Class/Options button
  // already explains the only action available.
  if(detail&&!/^(Ready for your next step\.|Open the required step\.|Select the next learning step\.)$/.test(detail))
   card.append(element("p","detail",detail));
  else if(!result?.url)card.append(element("p","detail",fallback));
  const metrics=element("div","metrics");
  metric(metrics,"Course completion",pct,"",record?.stale?"Saved record is stale; refresh course evidence.":null);
  metric(metrics,"Quiz and test average",avg.percent,"grade",avg.count?avg.count+" graded assessment"+(avg.count===1?"":"s"):"No published quiz/test points");
  card.append(metrics);
  const actions=element("div","card-actions");
  if(result?.url){
   const a=element("a","schedule-btn",result.label);
   a.href=result.url;
   a.setAttribute("aria-label",result.label+" — "+item.title);
   if(grade==="09"&&g9?.recordLaunch)a.addEventListener("click",()=>g9.recordLaunch(item.id,result.url,item.title));
   actions.append(a);
  }else{
   const isLanguage=item.subject==="foreignLanguage",isElective=item.subject==="elective";
   const choose=element("a","schedule-btn",isLanguage?"Choose Language":isElective?"Choose Elective":"Choose Course");
   choose.href=isLanguage?languageDirectory:isElective?"https://vervenveda.com/Khaemenes_High.github.io/courses/electives/":pathBase+"profile/";
   actions.append(choose);
  }
  if(item.id&&item.pinAvailable){
   const btn=element("button","schedule-btn secondary",pinned.has(item.id)?"Unpin":"Pin Class");
   btn.type="button";btn.setAttribute("aria-pressed",String(pinned.has(item.id)));
   btn.addEventListener("click",()=>{
    if(grade==="09"&&g9?.setPinned){
     if(!g9.setPinned(item.id,!g9.isPinned(item.id))){message.hidden=false;message.textContent="Unable to save this class choice.";return;}
    }else{
     const old=pins.readPins?.()||[],next=old.includes(item.id)?old.filter(x=>x!==item.id):[...old,item.id];
     if(!pins.writePins(next)){message.hidden=false;message.textContent="Unable to save this class choice.";return;}
    }
    window.dispatchEvent(new CustomEvent("khaemenes-course-pins-changed"));
    void render();
   });
   actions.append(btn);
  }
  card.append(actions);
  // Course selection is a separate authority from Pin/Unpin. Keep the
  // two-button class action row intact and expose language changes discreetly.
  if(item.subject==="foreignLanguage"&&item.id&&grade==="09"){
   const change=element("a","schedule-language-choice","Change language");
   change.href=languageDirectory;
   change.setAttribute("aria-label","Choose another foreign language");
   card.append(change);
  }
  grid.append(card);
 }
 const reported=gathered.map(x=>x.pct).filter(valid);
 const graded=gathered.map(x=>x.average).filter(valid);
 $("averageCompletion").textContent=reported.length?fmt(Math.round(reported.reduce((a,b)=>a+b,0)/reported.length*10)/10)+"%":"—";
 $("averageGrades").textContent=graded.length?fmt(Math.round(graded.reduce((a,b)=>a+b,0)/graded.length*10)/10)+"%":"—";
 $("evidenceCaption").textContent="Completion: "+reported.length+" of "+rows.length+" subjects reporting. Assessment averages: "+graded.length+" of "+rows.length+" subjects reporting. Missing evidence is not a zero grade.";
}
window.addEventListener("storage",e=>{if(!e.key||/khaemenes.*(pin|language|learner|continuation|profile)/i.test(e.key))void render()});
window.addEventListener("pageshow",()=>void render());
void render();
})();
/* Dedicated Schedule landing page. Read-only evidence; only canonical pin controls write. */
(()=>{"use strict";
const root=document.getElementById("scheduleApp");if(!root)return;
const grade=String(document.body.dataset.grade||"").padStart(2,"0");
const catalog=window.KhaemenesHighEightClass,pins=window.KhaemenesHighCoursePins,continuation=window.KhaemenesLearningContinuation;
const gradeCtx=window.KhaemenesHighProfileGradeContext;
const profile=window.KhaemenesStudentProfileV2,contract=window.KhaemenesCourseEntryContract;
const g9=window.KhaemenesGrade09Courses;
const pathBase="https://vervenveda.com/Khaemenes_High.github.io/grades/grade-"+grade+"/student-profile/";
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
 const language=pins?.readLanguageChoices?.()?.[String(Number(grade))]||null;
 const math=grade==="09"?g9?.mathPathway?.()||null:null;
 return catalog?.slots?.(Number(grade),{mathId:math,language})||[];
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
 if(!item.id)return null;
 const first=catalog.FIRST_STEPS?.[item.id]||null;
 const home=item.href||null;
 let selected=null;
 if(grade==="09"&&g9?.resolveContinueFor){
  // Grade 09 registry resolves placement, gates and next instructional step.
  return Promise.resolve(g9.resolveContinueFor(item.id)).then(next=>{
   const url=safeDestination(next?.url,item)||safeDestination(first,item)||safeDestination(home,item);
   return {url,detail:next?.detail||record?.nextTitle||"Select the next learning step.",label:labelFor(url,item),kind:next?.actionLabel||""};
  }).catch(()=>({url:safeDestination(first,item)||safeDestination(home,item),detail:"Open the required step.",label:labelFor(first||home,item)}));
 }
 if(record&&!record.stale&&record.status!=="paused")selected=record.nextHref;
 if(record?.status==="paused")selected=home;
 const url=safeDestination(selected,item)||safeDestination(first,item)||safeDestination(home,item);
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
let sequence=0;
async function render(){
 const current=++sequence;
 const id=student(),grid=$("scheduleGrid"),message=$("scheduleNotice");
 grid.replaceChildren();
 if(!id){message.hidden=false;message.textContent="Select your registered Grade "+Number(grade)+" learner in the Academy to view this private schedule. No other learner's records are displayed."; $("scheduleSummary").textContent="Registered learner required";return;}
 message.hidden=true;
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
  card.append(element("span","subject",(i+1)+". "+item.label),element("h3","",item.title));
  card.append(element("p","detail",result?.detail||"Choose your course before continuing."));
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
   const choose=element("a","schedule-btn","Choose Course");choose.href=pathBase+"profile/";actions.append(choose);
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
  card.append(actions);grid.append(card);
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
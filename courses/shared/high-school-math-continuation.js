(function attachKhaemenesHighMathContinuation(global){
"use strict";
const VERSION="1.0.0";
const PASS=80;
const ROOT="https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/";
const COURSE={
  "pre-algebra":{title:"Pre-Algebra",subject:"Mathematics",home:ROOT+"pre-algebra/"},
  "algebra-1":{title:"Algebra I",subject:"Mathematics",home:ROOT+"algebra-1/"},
  "algebra-2":{title:"Algebra II",subject:"Mathematics",home:ROOT+"algebra-2/"}
};
const A1_DIAGNOSTIC_KEY="khaemenes-algebra1-diagnostic-result-v1";
const A1_UNIT_END_WEEK=Object.freeze({1:3,2:6,3:9,4:11,5:14,6:18,7:21,8:23,9:26,10:30,11:32,12:35,13:36});

function courseId(){
  const m=String(global.location?.pathname||"").match(/\/courses\/mathematics\/(pre-algebra|algebra-1|algebra-2)(?:\/|$)/i);
  return m?m[1].toLowerCase():null;
}
function learner(){
  try{
    return global.KhaemenesLearnerScope?.profile?.()||global.KhaemenesCourseEntryContract?.readAcademyProfile?.()||null;
  }catch{return null}
}
function parse(key,fallback=null){
  try{
    const raw=global.localStorage.getItem(key);
    return raw?JSON.parse(raw):fallback;
  }catch{return fallback}
}
function number(v){
  if(v===null||v===undefined||v==="")return null;
  const n=Number(v);
  return Number.isFinite(n)?Math.max(0,Math.min(100,n)):null;
}
function abs(value,base){
  try{return new URL(value,base).href}catch{return base}
}
function activeStudent(state){
  if(!state||!Array.isArray(state.students)||!state.students.length)return null;
  return state.students.find(s=>s?.id===state.activeId)||state.students[0]||null;
}
function publishRecord(record){
  const C=global.KhaemenesLearningContinuation;
  const l=learner();
  if(!C?.publish||!l?.learnerId||!record)return false;
  try{
    C.publish({
      learnerId:l.learnerId,
      school:"Khaemenes High School",
      stage:"high",
      grade:l.grade||"High School",
      family:{needsAction:false,label:"",summary:"",href:""},
      ...record
    });
    return true;
  }catch{return false}
}

/* -------------------- Pre-Algebra -------------------- */
function preWeekRecord(student,n){
  return student?.progress?.weeks?.[n]||student?.progress?.weeks?.[String(n)]||{};
}
function preLessonPct(r){
  const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
  return Math.round(days.filter(d=>r?.lessons?.[d]).length/5*100);
}
function preAssignPct(r){
  return Math.round([0,1,2].filter(i=>r?.assignments?.[i]).length/3*100);
}
function preQuizBest(r){return Math.round(number(r?.quiz?.best)||0)}
function preAlgebraSnapshot(){
  const cfg=COURSE["pre-algebra"];
  const state=parse("KHAE_OPEN_PREALGEBRA_FORGE_V2",null);
  const s=activeStudent(state);
  if(!s)return null;

  const mid=number(s?.progress?.exams?.midterm?.best)||0;
  const fin=number(s?.progress?.exams?.final?.best)||0;
  const cap=number(s?.progress?.capstone?.score)||0;
  let mastered=0;
  let first=null;

  for(let w=1;w<=36;w++){
    const r=preWeekRecord(s,w),lp=preLessonPct(r),ap=preAssignPct(r),qb=preQuizBest(r);
    if(lp===100&&ap===100&&qb>=PASS)mastered++;
    else if(!first)first={week:w,record:r,lessonPct:lp,assignPct:ap,quizBest:qb};
  }

  let status="continue",nextLabel="Continue Pre-Algebra",nextTitle="",nextHref="",summary="",best=null;
  if(first&&first.week>18&&mastered>=18&&mid<PASS){
    best=mid||null;
    status=best?"corrections":"assessment";
    nextLabel=best?"Review Midterm":"Open Midterm";
    nextTitle="Pre-Algebra Midterm";
    nextHref=cfg.home+"?view=exams#content";
    summary=best?`Midterm best score is ${best}%. Review and retry to reach ${PASS}%.`:"Weeks 01–18 are mastered. The cumulative Midterm is the next formal step.";
  }else if(first){
    best=first.quizBest||null;
    nextHref=cfg.home+`?view=week&week=${first.week}#content`;
    nextTitle=`Week ${String(first.week).padStart(2,"0")}`;
    if(first.lessonPct<100||first.assignPct<100){
      status="continue";
      nextLabel="Continue Pre-Algebra";
      summary=`Week ${String(first.week).padStart(2,"0")} has ${first.lessonPct}% lesson-plan completion and ${first.assignPct}% assignment completion. Continue the learning work before treating the week as complete.`;
    }else if(first.quizBest<PASS){
      status=first.quizBest>0?"corrections":"assessment";
      nextLabel=first.quizBest>0?"Review & Retry":"Take Weekly Mastery";
      summary=first.quizBest>0?`Week ${String(first.week).padStart(2,"0")} quiz best is ${first.quizBest}%. Review corrections and retry to reach ${PASS}%.`:`Week ${String(first.week).padStart(2,"0")} learning work is complete. The weekly mastery check is next.`;
    }
  }else if(mid<PASS){
    best=mid||null;status=best?"corrections":"assessment";nextLabel=best?"Review Midterm":"Open Midterm";nextTitle="Pre-Algebra Midterm";nextHref=cfg.home+"?view=exams#content";summary="Complete the cumulative Midterm at 80% or higher.";
  }else if(fin<PASS){
    best=fin||null;status=best?"corrections":"assessment";nextLabel=best?"Review Final":"Open Final";nextTitle="Pre-Algebra Final";nextHref=cfg.home+"?view=exams#content";summary="Complete the cumulative Final at 80% or higher.";
  }else if(cap<PASS){
    best=cap||null;status=best?"corrections":"mastery";nextLabel=best?"Revise Capstone":"Complete Capstone";nextTitle="Mathematical Modelling Capstone";nextHref=cfg.home+"?view=capstone#content";summary="Complete or revise the modelling capstone to demonstrate Algebra I readiness.";
  }else{
    status="complete";nextLabel="Review Completion Record";nextTitle="Pre-Algebra Complete";nextHref=cfg.home+"records/course-completion-certificate.html";summary="All detected weekly, cumulative, and capstone evidence gates are complete.";best=100;
  }

  return {
    courseId:"pre-algebra",subject:cfg.subject,courseTitle:cfg.title,status,nextLabel,nextTitle,nextHref,summary,
    progress:{completed:mastered,total:36,percent:Math.round(mastered/36*100)},
    mastery:{best,threshold:PASS,mastered:status==="complete"},
    source:"pre-algebra-course-record-v2"
  };
}

/* -------------------- Algebra I -------------------- */
function a1DiagnosticEvidence(){
  const rec=parse(A1_DIAGNOSTIC_KEY,null);
  if(!rec)return null;
  const candidates=[
    rec?.overall_percent,
    rec?.percent,
    rec?.bestScore,
    rec?.result?.overall_percent,
    rec?.latest?.overall_percent
  ].map(number).filter(v=>v!==null);
  return candidates.length?Math.max(...candidates):0;
}
async function a1UnitMap(unit){
  const url=COURSE["algebra-1"].home+`units/unit-${String(unit).padStart(2,"0")}/unit-map.json`;
  try{
    const response=await fetch(url,{cache:"no-cache"});
    if(!response.ok)throw new Error(String(response.status));
    return await response.json();
  }catch{return null}
}
function a1UnitNumber(map,fallback){
  return Number(map?.unit?.number??map?.unit??fallback)||Number(fallback)||1;
}
function a1LessonInfo(map,lesson){
  const item=Array.isArray(map?.lessons)?map.lessons.find(x=>Number(x?.number)===Number(lesson)):null;
  return item||null;
}
async function algebra1Snapshot(){
  const cfg=COURSE["algebra-1"],A=global.KhaemenesAlgebra1MasteryAuthority;
  if(!A)return null;

  const diagnostic=a1DiagnosticEvidence();
  const anyCourseEvidence=(()=>{
    try{
      for(let u=1;u<=13;u++){
        const ev=A.unitEvidence?.(u);
        if(ev?.best!==null&&ev?.best!==undefined)return true;
        const refs=Object.values(A.weekLessonMap||{}).flat().filter(([unit])=>Number(unit)===u);
        for(const [,lesson] of refs){
          const le=A.lessonEvidence?.(u,lesson);
          if(le?.best!==null&&le?.best!==undefined)return true;
        }
      }
      for(let w=2;w<=36;w++){
        const we=A.weekEvidence?.(w);
        if(we?.best!==null&&we?.best!==undefined)return true;
      }
    }catch{}
    return false;
  })();

  if(diagnostic===null&&!anyCourseEvidence){
    return {
      courseId:"algebra-1",subject:cfg.subject,courseTitle:cfg.title,status:"assessment",
      nextLabel:"Begin Algebra I Readiness",nextTitle:"Week 01 · Readiness Diagnostic",nextHref:cfg.home+"diagnostic/",
      summary:"Begin with the Algebra I readiness diagnostic. Diagnostic evidence guides support and does not replace course mastery.",
      progress:{completed:0,total:36,percent:0},mastery:{best:null,threshold:PASS,mastered:false},source:"algebra1-mastery-authority-v1"
    };
  }

  let completed=(diagnostic!==null?1:0),action=null;
  for(let week=2;week<=36&&!action;week++){
    const refs=(A.weekLessonMap?.[week]||[]).map(([u,l])=>({unit:Number(u),lesson:Number(l)}));
    for(const ref of refs){
      const evidence=A.lessonEvidence?.(ref.unit,ref.lesson);
      if(!evidence?.mastery){
        const map=await a1UnitMap(ref.unit),info=a1LessonInfo(map,ref.lesson);
        const file=info?.file||"";
        const href=file?cfg.home+`units/unit-${String(ref.unit).padStart(2,"0")}/${file}`:cfg.home+`units/unit-${String(ref.unit).padStart(2,"0")}/`;
        const best=number(evidence?.best);
        action={
          status:best!==null&&best>0?"corrections":"continue",
          nextLabel:best!==null&&best>0?"Review & Retry":`Continue Algebra I · Week ${week}`,
          nextTitle:info?.title||`Unit ${String(ref.unit).padStart(2,"0")} · Lesson ${String(ref.lesson).padStart(2,"0")}`,
          nextHref:href,
          summary:best!==null&&best>0?`Lesson best score is ${Math.round(best)}%. Review the lesson and retry to reach ${PASS}%.`:`This is the next required Algebra I lesson in Week ${week}.`,
          best
        };
        break;
      }
    }
    if(action)break;
    const weekEvidence=A.weekEvidence?.(week);
    if(!weekEvidence?.mastery){
      const best=number(weekEvidence?.best);
      action={
        status:best!==null&&best>0?"corrections":"assessment",
        nextLabel:best!==null&&best>0?`Review Week ${week} Mastery`:`Take Week ${week} Mastery`,
        nextTitle:`Week ${String(week).padStart(2,"0")} Mastery`,
        nextHref:cfg.home+`assessments/weekly-mastery.html?week=${week}`,
        summary:best!==null&&best>0?`Weekly mastery best is ${Math.round(best)}%. Review and retry to reach ${PASS}%.`:`Week ${week} lessons are mastered. The weekly 80% check is next.`,
        best
      };
      break;
    }
    completed++;
    const unit=refs.length?refs[refs.length-1].unit:null;
    if(unit&&A1_UNIT_END_WEEK[unit]===week&&!A.unitMastered?.(unit)){
      const map=await a1UnitMap(unit),best=number(A.unitEvidence?.(unit)?.best);
      const mastery=map?.mastery||"assessment/mastery-check.html";
      action={
        status:best!==null&&best>0?"corrections":"assessment",
        nextLabel:best!==null&&best>0?`Review Unit ${String(unit).padStart(2,"0")} Mastery`:`Take Unit ${String(unit).padStart(2,"0")} Mastery`,
        nextTitle:`Unit ${String(unit).padStart(2,"0")} Mastery`,
        nextHref:cfg.home+`units/unit-${String(unit).padStart(2,"0")}/${mastery}`,
        summary:best!==null&&best>0?`Unit mastery best is ${Math.round(best)}%. Review corrections and retry.`:"The unit lessons and weekly work are complete. The unit mastery check is next.",
        best
      };
      break;
    }
    if(unit===6&&week===18&&!A.midtermMastered?.()){
      const best=number(A.midtermEvidence?.()?.best);
      action={
        status:best!==null&&best>0?"corrections":"assessment",
        nextLabel:best!==null&&best>0?"Review Algebra I Midterm":"Take Algebra I Midterm",
        nextTitle:"Algebra I Midterm",
        nextHref:cfg.home+"assessments/midterm-units-01-06.html",
        summary:best!==null&&best>0?`Reviewed Midterm best is ${Math.round(best)}%. Complete corrections and reassessment.`:"Units 01–06 are complete. The reviewed cumulative Midterm is next.",
        best
      };
      break;
    }
  }

  if(!action&&!A.finalMastered?.()){
    const best=number(A.finalEvidence?.()?.best);
    action={
      status:best!==null&&best>0?"corrections":"assessment",
      nextLabel:best!==null&&best>0?"Review Algebra I Final":"Open Algebra I Final",
      nextTitle:"Algebra I Final",
      nextHref:cfg.home+"assessments/final-exam-36-weeks.html",
      summary:best!==null&&best>0?`Reviewed Final best is ${Math.round(best)}%. Complete corrections and reassessment.`:"All detected instructional gates are complete. The cumulative Final is next.",
      best
    };
  }
  if(!action)action={status:"complete",nextLabel:"Review Algebra I Record",nextTitle:"Algebra I Complete",nextHref:cfg.home,summary:"All detected Algebra I mastery gates are complete.",best:100};

  return {
    courseId:"algebra-1",subject:cfg.subject,courseTitle:cfg.title,
    ...action,
    progress:{completed:Math.min(36,completed),total:36,percent:Math.round(Math.min(36,completed)/36*100)},
    mastery:{best:action.best,threshold:PASS,mastered:action.status==="complete"},
    source:"algebra1-mastery-authority-v1"
  };
}

/* -------------------- Algebra II -------------------- */
function algebra2Snapshot(){
  const cfg=COURSE["algebra-2"];
  const D=global.ALGEBRA2_DATA;
  const key=D?.course?.storage_key||"khaemenes-algebra2-course-v1";
  const state=parse(key,null),s=activeStudent(state);
  if(!s)return null;
  const weeks=Array.isArray(D?.weeks)?D.weeks:Array.from({length:36},(_,i)=>({week:i+1,title:`Week ${i+1}`,unit_path:"./"}));
  const target=number(D?.course?.mastery_target)||PASS;
  const diagnostic=number(s?.formal?.diagnostic);
  const mid=number(s?.formal?.midterm);
  const fin=number(s?.formal?.final);
  const cap=number(s?.formal?.capstone);

  let complete=0,first=null;
  for(const w of weeks){
    const r=s?.weeks?.[w.week]||s?.weeks?.[String(w.week)]||{};
    const sessions=Object.values(r?.days||{}).filter(Boolean).length;
    const mastery=number(r?.masteryBest);
    if(sessions===5&&mastery!==null&&mastery>=target)complete++;
    else if(!first)first={week:Number(w.week),title:w.title||`Week ${w.week}`,unitPath:w.unit_path||"./",sessions,mastery};
  }

  let status="continue",nextLabel="Continue Algebra II",nextTitle="",nextHref="",summary="",best=null;
  if(complete===0&&diagnostic===null){
    status="assessment";nextLabel="Begin Algebra II Readiness";nextTitle="Readiness Diagnostic";nextHref=cfg.home+"diagnostic/";summary="Begin with the Algebra II readiness diagnostic before the 36-week advanced-functions pathway.";
  }else if(first&&first.week>18&&complete>=18&&(mid===null||mid<target)){
    best=mid;status=best!==null&&best>0?"corrections":"assessment";nextLabel=status==="corrections"?"Review Midterm":"Open Midterm";nextTitle="Algebra II Midterm";nextHref=cfg.home+"assessments/midterm.html";summary=best!==null&&best>0?`Midterm is recorded at ${Math.round(best)}%. Review and retry to reach ${target}%.`:"The first half of the course is complete. The Midterm is the next formal step.";
  }else if(first){
    best=first.mastery;
    nextTitle=`Week ${String(first.week).padStart(2,"0")} · ${first.title}`;
    nextHref=cfg.home+`?continueWeek=${first.week}#week`;
    if(first.sessions<5){
      status="continue";nextLabel="Continue Algebra II";summary=`${first.sessions}/5 learning sessions are recorded for Week ${first.week}. Continue the weekly study sequence.`;
    }else{
      status=best!==null&&best>0?"corrections":"assessment";
      nextLabel=status==="corrections"?"Review Weekly Mastery":"Take Weekly Mastery";
      summary=best!==null&&best>0?`Week ${first.week} mastery best is ${Math.round(best)}%. Review and retry to reach ${target}%.`:`All five Week ${first.week} sessions are complete. The weekly mastery set is next.`;
    }
  }else if(mid===null||mid<target){
    best=mid;status=best!==null&&best>0?"corrections":"assessment";nextLabel=status==="corrections"?"Review Midterm":"Open Midterm";nextTitle="Algebra II Midterm";nextHref=cfg.home+"assessments/midterm.html";summary="Complete the Midterm at the 80% mastery target.";
  }else if(fin===null||fin<target){
    best=fin;status=best!==null&&best>0?"corrections":"assessment";nextLabel=status==="corrections"?"Review Final":"Open Final";nextTitle="Algebra II Final";nextHref=cfg.home+"assessments/final.html";summary="Complete the comprehensive Final at the 80% mastery target.";
  }else if(cap===null||cap<target){
    best=cap;status=best!==null&&best>0?"corrections":"mastery";nextLabel=status==="corrections"?"Revise Capstone":"Complete Capstone";nextTitle="Algebra II Capstone / Defense";nextHref=cfg.home+"#portfolio";summary="Complete or revise the capstone and defense evidence at the course mastery target.";
  }else{
    status="complete";nextLabel="Review Completion Record";nextTitle="Algebra II Complete";nextHref=cfg.home+"records/course-completion-certificate.html";summary="All detected Algebra II study and formal evidence gates are complete.";best=100;
  }

  return {
    courseId:"algebra-2",subject:cfg.subject,courseTitle:cfg.title,status,nextLabel,nextTitle,nextHref,summary,
    progress:{completed:complete,total:36,percent:Math.round(complete/36*100)},
    mastery:{best,threshold:target,mastered:status==="complete"},
    source:"algebra2-course-record-v1"
  };
}

async function publish(){
  const id=courseId();
  if(!id||!learner()?.learnerId||!global.KhaemenesLearningContinuation?.publish)return false;
  let snapshot=null;
  if(id==="pre-algebra")snapshot=preAlgebraSnapshot();
  else if(id==="algebra-1")snapshot=await algebra1Snapshot();
  else if(id==="algebra-2")snapshot=algebra2Snapshot();
  return snapshot?publishRecord(snapshot):false;
}

let timer=0;
function schedule(delay=100){
  clearTimeout(timer);
  timer=setTimeout(()=>{Promise.resolve(publish()).catch(()=>{})},delay);
}
function boot(){
  schedule(80);
  global.addEventListener("khaemenes-learning-continuation-ready",()=>schedule(30));
  global.addEventListener("khaemenes-high-course-state-changed",()=>schedule(40));
  global.addEventListener("pageshow",()=>schedule(30));
  global.addEventListener("focus",()=>schedule(80));
  global.addEventListener("storage",()=>schedule(80));
  document.addEventListener("change",()=>schedule(120),true);
  document.addEventListener("click",event=>{
    if(event.target?.closest?.("button,[type=submit],[data-view],[data-week]"))schedule(180);
  },true);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
global.KhaemenesHighMathContinuation=Object.freeze({version:VERSION,publish,courseId});
})(window);
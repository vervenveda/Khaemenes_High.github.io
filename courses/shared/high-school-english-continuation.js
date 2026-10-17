(function attachKhaemenesHighEnglishContinuation(global){
"use strict";
if(global.KhaemenesHighEnglishContinuation)return;
const VERSION="1.0.0",PASS=80;
const CONT_URL="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-learning-continuation.js";
const ROOT="https://vervenveda.com/Khaemenes_High.github.io/courses/language-arts/";
const CONFIG={
  "english-9":{courseId:"english-9",title:"English 9",grade:"Grade 9",home:ROOT+"english-9/"},
  "english-10":{courseId:"ela10",title:"English II",grade:"Grade 10",home:ROOT+"english-10/",stateKey:"khae-ela10-state-v1"},
  "english-11":{courseId:"ela11",title:"English III",grade:"Grade 11",home:ROOT+"english-11/",stateKey:"khae-ela11-state-v1"},
  "english-12":{courseId:"ela12",title:"English IV",grade:"Grade 12",home:ROOT+"english-12/",stateKey:"khae-ela12-state-v1"}
};
function courseName(){
  const m=String(global.location?.pathname||"").match(/\/courses\/language-arts\/(english-(?:9|10|11|12))(?:\/|$)/i);
  return m?m[1].toLowerCase():null;
}
function profile(){
  try{return global.KhaemenesCourseEntryContract?.readAcademyProfile?.()||global.KhaemenesLearnerScope?.profile?.()||global.KhaemenesEnglish9Records?.profile||null}catch{return null}
}
function readBase(key,fallback=null){
  try{
    const p=profile(),contract=global.KhaemenesCourseEntryContract;
    if(p&&contract?.scopedKey){
      const scoped=contract.scopedKey(key,p),raw=global.localStorage.getItem(scoped);
      if(raw!==null)return JSON.parse(raw);
    }
    const raw=global.localStorage.getItem(key);
    return raw===null?fallback:JSON.parse(raw);
  }catch{return fallback}
}
function numeric(value){
  if(value===null||value===undefined||value==="")return null;
  const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(100,n)):null;
}
async function ensureContinuation(){
  if(global.KhaemenesLearningContinuation)return global.KhaemenesLearningContinuation;
  const found=[...document.scripts].find(s=>s.src===CONT_URL);
  if(found)return new Promise(resolve=>{found.addEventListener("load",()=>resolve(global.KhaemenesLearningContinuation||null),{once:true});setTimeout(()=>resolve(global.KhaemenesLearningContinuation||null),1400)});
  return new Promise(resolve=>{const s=document.createElement("script");s.src=CONT_URL;s.async=false;s.onload=()=>resolve(global.KhaemenesLearningContinuation||null);s.onerror=()=>resolve(null);(document.head||document.documentElement).append(s)});
}
function publishRecord(record){
  const C=global.KhaemenesLearningContinuation,p=profile();
  if(!C?.publish||!p?.learnerId||!record)return false;
  try{
    C.publish({
      learnerId:p.learnerId,
      courseId:record.courseId,
      school:"Khaemenes High School",
      stage:"high",
      grade:record.grade,
      subject:"Language Arts",
      courseTitle:record.courseTitle,
      status:record.status,
      nextLabel:record.nextLabel,
      nextTitle:record.nextTitle,
      nextHref:record.nextHref,
      summary:record.summary,
      progress:record.progress||{completed:null,total:null,percent:null},
      mastery:{best:record.best??null,threshold:PASS,mastered:record.status==="complete"},
      family:record.family||{needsAction:false,label:"",summary:"",href:""},
      source:record.source
    });
    return true;
  }catch{return false}
}
function score(record){
  const helper=global.KhaemenesEnglishRecords?.score;
  if(helper)return helper(record);
  const values=(Array.isArray(record?.attempts)?record.attempts:[]).map(a=>numeric(a?.score)).filter(v=>v!==null);
  const best=numeric(record?.best);if(best!==null&&(best>0||values.length))values.push(best);
  return values.length?Math.max(...values):null;
}
function upperSnapshot(cfg){
  const state=readBase(cfg.stateKey,null),R=global.KhaemenesEnglishRecords;
  if(!state){
    return {courseId:cfg.courseId,courseTitle:cfg.title,grade:cfg.grade,status:"continue",nextLabel:"Begin "+cfg.title,nextTitle:"Week 01 · Course Launch",nextHref:cfg.home+"weeks/week-01/",summary:"Open Week 01 to begin the 36-week Language Arts pathway.",progress:{completed:0,total:36,percent:0},source:"upper-english-records-v1"};
  }
  if(!R?.valid?.(state,cfg.courseId)){
    return {courseId:cfg.courseId,courseTitle:cfg.title,grade:cfg.grade,status:"paused",nextLabel:"Recover Course Record",nextTitle:"Saved English record needs recovery",nextHref:cfg.home,summary:"The saved course record could not be validated. Use the Record Recovery control before continuing so existing work is preserved.",progress:{completed:null,total:36,percent:null},family:{needsAction:true,label:"Record recovery",summary:"The learner's English record needs recovery on this device before new progress should be saved.",href:cfg.home},source:"upper-english-records-v1"};
  }
  const complete=R.weeksComplete(state),completed=complete.filter(Boolean).length;
  const firstIndex=complete.findIndex(Boolean.bind(null,false));
  const first=firstIndex>=0?firstIndex+1:null;
  const mid=score(state.exams?.midterm),fin=score(state.exams?.final);

  if(first!==null&&first>18&&(mid===null||mid<PASS)){
    return {courseId:cfg.courseId,courseTitle:cfg.title,grade:cfg.grade,status:mid!==null&&mid>0?"corrections":"assessment",nextLabel:mid!==null&&mid>0?"Review Midterm":"Open Midterm",nextTitle:cfg.title+" Midterm",nextHref:cfg.home+"assessments/midterm/",summary:mid!==null&&mid>0?"Midterm best score is "+Math.round(mid)+"%. Review corrections and reassess to reach 80%.":"Weeks 01–18 have reached weekly mastery. The cumulative Midterm is the next formal step.",best:mid,progress:{completed,total:36,percent:Math.round(completed/36*100)},source:"upper-english-records-v1"};
  }
  if(first!==null){
    const w=state.weeks?.[first]||state.weeks?.[String(first)]||{},days=["Monday","Tuesday","Wednesday","Thursday","Friday"].filter(d=>w.days?.[d]).length,q=score(w.quiz);
    let status="continue",label="Continue "+cfg.title,summary=days+"/5 daily lessons are recorded for Week "+String(first).padStart(2,"0")+". Continue the lesson sequence and preserve the writing evidence.";
    if(days===5){
      status=q!==null&&q>0?"corrections":"mastery";
      label=q!==null&&q>0?"Review & Retry":"Take Weekly Mastery";
      summary=q!==null&&q>0?"Week "+String(first).padStart(2,"0")+" quiz best is "+Math.round(q)+"%. Review corrections and retry to reach 80%.":"All five daily lessons are complete. The weekly quiz is the next mastery step.";
    }
    return {courseId:cfg.courseId,courseTitle:cfg.title,grade:cfg.grade,status,nextLabel:label,nextTitle:"Week "+String(first).padStart(2,"0"),nextHref:cfg.home+"weeks/week-"+String(first).padStart(2,"0")+"/",summary,best:q,progress:{completed,total:36,percent:Math.round(completed/36*100)},source:"upper-english-records-v1"};
  }
  if(mid===null||mid<PASS){
    return {courseId:cfg.courseId,courseTitle:cfg.title,grade:cfg.grade,status:mid!==null&&mid>0?"corrections":"assessment",nextLabel:mid!==null&&mid>0?"Review Midterm":"Open Midterm",nextTitle:cfg.title+" Midterm",nextHref:cfg.home+"assessments/midterm/",summary:"Complete the cumulative Midterm and corrections at the course mastery target.",best:mid,progress:{completed:36,total:36,percent:100},source:"upper-english-records-v1"};
  }
  if(fin===null||fin<PASS){
    return {courseId:cfg.courseId,courseTitle:cfg.title,grade:cfg.grade,status:fin!==null&&fin>0?"corrections":"assessment",nextLabel:fin!==null&&fin>0?"Review Final":"Open Final",nextTitle:cfg.title+" Final Examination",nextHref:cfg.home+"assessments/final/",summary:fin!==null&&fin>0?"Final best score is "+Math.round(fin)+"%. Review corrections and reassess to reach 80%.":"The 36-week lesson and quiz pathway is mastered. Complete the cumulative Final.",best:fin,progress:{completed:36,total:36,percent:100},source:"upper-english-records-v1"};
  }
  return {courseId:cfg.courseId,courseTitle:cfg.title,grade:cfg.grade,status:"mastery",nextLabel:"Portfolio & Completion Review",nextTitle:cfg.title+" · Portfolio and Evaluator Record",nextHref:cfg.home+"portfolio/",summary:"Weekly mastery, Midterm, and Final evidence are recorded. Review unit products, writing revisions, portfolio artifacts, and evaluator documentation before issuing course completion.",best:fin,progress:{completed:36,total:36,percent:100},family:{needsAction:false,label:"",summary:"",href:""},source:"upper-english-records-v1"};
}
function english9Snapshot(cfg){
  const entry=global.KhaemenesEnglish9Entry?.decision?.();
  if(entry&&entry.allow===false){
    const foundation=/foundation/i.test(String(entry.href||""));
    return {courseId:cfg.courseId,courseTitle:cfg.title,grade:cfg.grade,status:foundation?"mastery":"assessment",nextLabel:entry.label||"Open Required Step",nextTitle:entry.title||"English 9 Readiness",nextHref:entry.href||cfg.home+"assessments/diagnostic/",summary:entry.message||"Complete the English 9 readiness step before the official weekly course.",progress:{completed:null,total:36,percent:null},source:"english9-entry-contract"};
  }
  const launches=readBase("khaemenes-grade09-course-launches-v1",{}),last=launches?.["english-9"];
  let href=cfg.home,title="English 9 Course Home",specific=false;
  if(last?.url){
    try{
      const u=new URL(last.url,cfg.home);
      if(u.href.startsWith(cfg.home)){href=u.href;title=String(last.title||"English 9");specific=true}
    }catch{}
  }
  const progress=readBase("khae-ela9-progress-v1",{}),prepared=Object.entries(progress||{}).filter(([k,v])=>/^week-\d+$/.test(k)&&v===true).length;
  return {courseId:cfg.courseId,courseTitle:cfg.title,grade:cfg.grade,status:"continue",nextLabel:specific?"Resume English 9":"Open English 9",nextTitle:title,nextHref:href,summary:specific?"Return to the learner's last English 9 course location. Educator-reviewed weekly assessments remain authoritative for mastery.":"Open English 9 to continue the readiness-gated course. Weekly evidence preparation is tracked separately from educator-reviewed mastery.",progress:{completed:prepared,total:36,percent:Math.round(prepared/36*100)},source:"english9-resume-evidence"};
}
async function publish(){
  const name=courseName(),cfg=CONFIG[name],p=profile();if(!cfg||!p?.learnerId)return false;
  await ensureContinuation();
  const snapshot=name==="english-9"?english9Snapshot(cfg):upperSnapshot(cfg);
  return publishRecord(snapshot);
}
let timer=0;function schedule(delay=100){clearTimeout(timer);timer=setTimeout(()=>{Promise.resolve(publish()).catch(()=>{})},delay)}
function boot(){
  schedule(120);
  global.addEventListener("khaemenes-learning-continuation-ready",()=>schedule(30));
  global.addEventListener("pageshow",()=>schedule(40));
  global.addEventListener("focus",()=>schedule(80));
  global.addEventListener("storage",()=>schedule(100));
  document.addEventListener("change",()=>schedule(120),true);
  document.addEventListener("click",e=>{if(e.target?.closest?.("button,[type=submit],[data-week-day],[data-assessment-form]"))schedule(180)},true);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
global.KhaemenesHighEnglishContinuation=Object.freeze({version:VERSION,publish,courseName});
})(window);
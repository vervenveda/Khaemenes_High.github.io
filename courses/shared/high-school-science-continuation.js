(function attachKhaemenesHighScienceContinuation(global){
"use strict";
if(global.KhaemenesHighScienceContinuation)return;
const VERSION="1.0.0",PASS=80;
const ROOT="https://vervenveda.com/Khaemenes_High.github.io/courses/science/";
const CONFIG={
 "integrated-science-9":{id:"integrated-science-9",title:"Integrated Science 9",grade:"Grade 9",home:ROOT+"integrated-science-9/",key:"khae-grade09-integrated-science-portal-v1",mode:"mastery"},
 "biology-10":{id:"biology-10",title:"Biology & Biotechnology 10",grade:"Grade 10",home:ROOT+"biology-10/",key:"khaemenes-biology-10-v1",mode:"planner"},
 "chemistry-11":{id:"chemistry-11",title:"Chemistry & Materials Science 11",grade:"Grade 11",home:ROOT+"chemistry-11/",key:"khaemenes-chemistry-11-v1",mode:"planner"},
 "physics-engineering-12":{id:"physics-engineering-12",title:"Physics & Engineering 12",grade:"Grade 12",home:ROOT+"physics-engineering-12/",key:"khaemenes-physics-engineering-12-v1",mode:"planner"}
};
function course(){const m=String(location.pathname||"").match(/\/courses\/science\/(integrated-science-9|biology-10|chemistry-11|physics-engineering-12)(?:\/|$)/i);return m?m[1].toLowerCase():null}
function profile(){try{return global.KhaemenesCourseEntryContract?.readAcademyProfile?.()||global.KhaemenesLearnerScope?.profile?.()||null}catch{return null}}
function read(key,cfg){
 try{
  const p=profile(),contract=global.KhaemenesCourseEntryContract;
  if(p&&contract?.scopedKey){
   const scoped=contract.scopedKey(key,p),raw=localStorage.getItem(scoped);
   if(raw!==null)return JSON.parse(raw);
  }
  const raw=localStorage.getItem(key);return raw===null?null:JSON.parse(raw);
 }catch{return null}
}
function num(v){if(v===null||v===undefined||v==="")return null;const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(100,n)):null}
function publish(x){
 const C=global.KhaemenesLearningContinuation,p=profile();if(!C?.publish||!p?.learnerId||!x)return false;
 try{C.publish({learnerId:p.learnerId,courseId:x.courseId,school:"Khaemenes High School",stage:"high",grade:x.grade,subject:"Science",courseTitle:x.courseTitle,status:x.status,nextLabel:x.nextLabel,nextTitle:x.nextTitle,nextHref:x.nextHref,summary:x.summary,progress:x.progress,mastery:{best:x.best??null,threshold:PASS,mastered:x.status==="complete"},family:x.family||{needsAction:false,label:"",summary:"",href:""},source:x.source});return true}catch{return false}
}
function science9(cfg){
 const entry=global.KhaemenesScience9Entry?.decision?.();
 if(entry&&entry.allow===false){
  return{courseId:cfg.id,courseTitle:cfg.title,grade:cfg.grade,status:/foundation/i.test(String(entry.href||""))?"mastery":"assessment",nextLabel:entry.label||"Open Required Step",nextTitle:entry.title||"Science 9 Readiness",nextHref:new URL(entry.href||"diagnostic/readiness-diagnostic.html",cfg.home).href,summary:entry.message||"Complete the Science 9 readiness step before the official course.",progress:{completed:null,total:36,percent:null},source:"science9-entry-gate"};
 }
 const state=read(cfg.key,cfg),p=profile();
 const s=state?.students?.find(x=>x?.id===state.activeId)||state?.students?.find(x=>x?.id===p?.learnerId)||state?.students?.[0]||null;
 if(!s)return{courseId:cfg.id,courseTitle:cfg.title,grade:cfg.grade,status:"continue",nextLabel:"Open Science 9",nextTitle:"Begin the Science 9 course record",nextHref:cfg.home,summary:"Readiness is satisfied. Open the course hall to begin the 36-week evidence pathway.",progress:{completed:0,total:36,percent:0},source:"science9-learner-record"};
 let mastered=0;
 for(let w=1;w<=36;w++){
  const days=Object.values(s.days?.[w]||{}).filter(Boolean).length,best=num(s.scores?.[w])||0;
  if(days===5&&best>=PASS){mastered++;continue}
  if(days<5)return{courseId:cfg.id,courseTitle:cfg.title,grade:cfg.grade,status:"continue",nextLabel:"Continue Science 9",nextTitle:"Week "+String(w).padStart(2,"0"),nextHref:cfg.home+"?view=week&week="+w,summary:days+"/5 daily science lessons are recorded. Continue the phenomenon, model, evidence, investigation, and CER sequence.",best:best||null,progress:{completed:mastered,total:36,percent:Math.round(mastered/36*100)},source:"science9-weekly-evidence"};
  return{courseId:cfg.id,courseTitle:cfg.title,grade:cfg.grade,status:best>0?"corrections":"mastery",nextLabel:best>0?"Review & Reassess":"Complete Weekly Mastery",nextTitle:"Week "+String(w).padStart(2,"0")+" Mastery",nextHref:cfg.home+"?view=week&week="+w,summary:best>0?"Weekly mastery best is "+Math.round(best)+"%. Complete corrections and reassess to reach 80%.":"The five-day evidence sequence is complete. The weekly mastery check is next.",best:best||null,progress:{completed:mastered,total:36,percent:Math.round(mastered/36*100)},source:"science9-weekly-evidence"};
 }
 return{courseId:cfg.id,courseTitle:cfg.title,grade:cfg.grade,status:"mastery",nextLabel:"Final Assessment & Portfolio Review",nextTitle:"Science 9 · Cumulative Evidence",nextHref:cfg.home+"assessments/",summary:"All 36 weekly lesson/mastery records meet the local benchmark. Complete the repository's cumulative assessment, capstone, laboratory portfolio, corrections, and evaluator review before course completion.",best:100,progress:{completed:36,total:36,percent:100},source:"science9-weekly-evidence"};
}
function upper(cfg){
 const state=read(cfg.key,cfg)||{completed:{},week:1,notes:{},scores:{}};
 const completed=Array.from({length:36},(_,i)=>i+1).filter(w=>state.completed?.[w]===true).length;
 const first=Array.from({length:36},(_,i)=>i+1).find(w=>state.completed?.[w]!==true)||null;
 if(first!==null){
  const selected=Math.max(1,Math.min(36,Number(state.week)||first));
  return{courseId:cfg.id,courseTitle:cfg.title,grade:cfg.grade,status:"continue",nextLabel:"Continue Science",nextTitle:"Week "+String(first).padStart(2,"0"),nextHref:cfg.home+"weeks/week-"+String(first).padStart(2,"0")+"/",summary:"Continue the next unfinished weekly science studio. The dashboard completion mark is a local planning/evidence marker; laboratory quality, CER work, unit performance tasks, and official examinations remain evaluator-reviewed.",progress:{completed,total:36,percent:Math.round(completed/36*100)},source:"upper-science-weekly-planner-v1"};
 }
 return{courseId:cfg.id,courseTitle:cfg.title,grade:cfg.grade,status:"mastery",nextLabel:"Assessment & Portfolio Review",nextTitle:cfg.title+" · Completion Evidence Review",nextHref:cfg.home+"assessments/",summary:"All 36 weekly planning/evidence markers are complete. Review laboratory records, CERs, unit performance tasks, capstone evidence, and the approved supervised assessment process. Public practice Midterm/Final scores are not treated as official exam grades.",progress:{completed:36,total:36,percent:100},source:"upper-science-weekly-planner-v1"};
}
function run(){const name=course(),cfg=CONFIG[name],p=profile();if(!cfg||!p?.learnerId||!global.KhaemenesLearningContinuation)return false;return publish(cfg.mode==="mastery"?science9(cfg):upper(cfg))}
let timer=0;function schedule(d=100){clearTimeout(timer);timer=setTimeout(run,d)}
function boot(){schedule(150);global.addEventListener("khaemenes-learning-continuation-ready",()=>schedule(30));global.addEventListener("pageshow",()=>schedule(50));global.addEventListener("focus",()=>schedule(80));global.addEventListener("storage",()=>schedule(100));document.addEventListener("change",()=>schedule(120),true);document.addEventListener("click",()=>schedule(180),true)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
global.KhaemenesHighScienceContinuation=Object.freeze({version:VERSION,run});
})(window);
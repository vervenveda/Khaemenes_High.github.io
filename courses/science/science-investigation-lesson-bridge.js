/* Khaemenes High · Science investigation lesson handoff · v1 */
(()=>{
"use strict";
const ACTIVE="khaemenes_active_learner_v1",FAMILY="khaemenes_family_registry_v1";
const DRAFT="khaemenes-science-investigation-draft-v1";
const NOTEBOOK="https://vervenveda.com/Khaemenes_High.github.io/courses/science/investigation-notebook/";
const safe=(v,n=4000)=>String(v??"").replace(/[\u0000-\u001f\u007f]/g,"").slice(0,n);
const readJSON=k=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):null}catch{return null}};
function learnerId(){const active=readJSON(ACTIVE),family=readJSON(FAMILY);const id=typeof active==="string"?active:active?.learnerId;return id&&family?.learners?.[id]?id:null}
function grade(){
 const m=(document.querySelector(".eyebrow")?.textContent||"").match(/Grade\s+(\d{1,2})/i);
 if(m)return Number(m[1]);
 return location.pathname.toLowerCase().includes("/integrated-science-9/")?9:0;
}
function week(){const m=(document.querySelector(".eyebrow")?.textContent||"").match(/Week\s+(\d{1,2})/i);return m?Number(m[1]):0}\nfunction unit(){const m=location.pathname.match(/unit-(\\d{1,2})/i);return m?Number(m[1]):0}
function day(){
 const direct=Number(document.body?.dataset?.day);if(direct)return direct;
 const m=(document.querySelector(".eyebrow")?.textContent||document.title||"").match(/Day\s*(\d{1,2})/i);
 return m?Number(m[1]):0;
}
function course(){const p=location.pathname.toLowerCase();for(const id of ["integrated-science-9","biology-10","chemistry-11","physics-engineering-12"])if(p.includes("/"+id+"/"))return id;return ""}
function text(selector){return safe(document.querySelector(selector)?.value||document.querySelector(selector)?.textContent||"")}
function buildDraft(){
 const id=learnerId();if(!id)return null;
 const title=text("h1")||"Science Investigation";
 let objective=safe([...document.querySelectorAll(".heading p")].find(p=>/Learning objective:/i.test(p.textContent||""))?.textContent?.replace(/Learning objective:\s*/i,"")||"");
 if(!objective&&course()==="integrated-science-9"){
   objective=safe(document.querySelector(".unit-lead")?.textContent||document.querySelector(".objective-list li")?.textContent||"");
 }
 const main=text("#mainNote"),thought=text("#thoughtNote");
 const d=day();
 const draft={version:1,learnerId:id,grade:grade(),week:week(),day:d,course:course(),title,sourceUrl:location.href,createdAt:new Date().toISOString(),question:objective,method:"",evidence:"",analysis:"",claim:"",limitations:"",next:""};
 const cid=draft.course;
 if(cid==="integrated-science-9"){
  draft.question=objective||title;
  if(d===5){
   draft.title="Paper Helicopter Investigation · Plan";
   draft.prediction="State your directional prediction and scientific reasoning before testing.";
   draft.variables="Independent variable, dependent variable, controls, variable levels, trial count, measurement rule, and safety boundary.";
   draft.method="Write the preregistered repeatable procedure you planned before collecting results.";
   draft.limitations="List likely confounders or measurement limitations you identified before testing.";
  }else if(d===6){
   draft.title="Paper Helicopter Investigation · Conduct & Analyze";
   draft.method="Record the procedure actually used and any deviations from the plan.";
   draft.evidence="Enter the raw observations or measurements you collected, with units and trial labels.";
   draft.analysis="Calculate summaries such as mean/range as directed and describe what the data show.";
   draft.limitations="Record measurement issues, anomalies, or procedural changes that affect interpretation.";
  }else if(d===7){
   draft.title="Paper Helicopter Investigation · Tables & Graphs";
   draft.evidence="Enter the organized data table or a concise reference to the saved/printed table.";
   draft.analysis="Describe the graph axes, units, scale, pattern, and any anomalies. Include calculations used to support the graph.";
   draft.limitations="Note how graph scale, missing trials, or measurement resolution could affect interpretation.";
  }else if(d===8){
   draft.title="Paper Helicopter Investigation · Patterns & Uncertainty";
   draft.analysis="Describe the pattern with scope, variation, anomalies, and whether the design supports causal language.";
   draft.limitations="Distinguish random variation, possible systematic bias, confounders, and alternative explanations.";
   draft.next="Identify additional evidence or a redesigned test that could distinguish competing explanations.";
  }else if(d===9){
   draft.title="Paper Helicopter Investigation · CER";
   draft.claim="Write a scoped claim, cite specific evidence, and explain the scientific reasoning connecting them.";
   draft.evidence="Enter the measurements, graph pattern, or sourced evidence that directly supports or limits the claim.";
   draft.limitations="State uncertainty, scope limits, and at least one alternative explanation or counterclaim.";
   draft.next="State the next test, additional evidence, or revision that would strengthen the conclusion.";
  }else{
   draft.evidence="";
  }
 }else if(cid==="physics-engineering-12"){
  if(d===1){draft.question=objective;draft.analysis=main;draft.limitations=thought;draft.evidence=main}
  else if(d===2){draft.analysis=main;draft.evidence=main;draft.limitations=thought}
  else if(d===3){draft.analysis=main;draft.evidence=main;draft.limitations=thought}
  else if(d===4){draft.prediction=main;draft.variables=main;draft.method=main;draft.analysis=main;draft.evidence=main;draft.limitations=thought}
  else if(d===5){draft.claim=main;draft.analysis=main;draft.evidence=main;draft.limitations=thought;draft.next=thought}
  else{draft.evidence=main;draft.limitations=thought}
 }else if(cid==="chemistry-11"){
  if(d===1){draft.prediction=main;draft.variables=main;draft.limitations=thought;draft.evidence=main}
  else if(d===2){draft.method=main;draft.analysis=main;draft.limitations=thought}
  else if(d===3){draft.analysis=main;draft.evidence=main;draft.limitations=thought}
  else if(d===4){draft.variables=main;draft.method=main;draft.evidence=main;draft.analysis=main;draft.limitations=thought}
  else if(d===5){draft.claim=main;draft.evidence=main;draft.analysis=main;draft.limitations=thought;draft.next=thought}
  else{draft.evidence=main;draft.limitations=thought}
 }else{
  if(d===1){draft.prediction=main;draft.variables=thought;draft.evidence=main}
  else if(d===2){draft.method=main;draft.limitations=thought;draft.evidence=main}
  else if(d===3){draft.analysis=main;draft.limitations=thought;draft.evidence=main}
  else if(d===4){draft.prediction=main;draft.variables=main;draft.method=main;draft.analysis=main;draft.limitations=thought;draft.evidence=main}
  else if(d===5){draft.claim=main;draft.limitations=thought;draft.next=main;draft.evidence=main}
  else{draft.evidence=main;draft.limitations=thought}
 }
 return draft;
}
function mount(){
 const panel=[...document.querySelectorAll("article.panel.full")].find(x=>/Course evidence bridge/i.test(x.querySelector("h2")?.textContent||""))||document.querySelector("article.panel.full")||document.querySelector("article.lesson-page");
 if(!panel||panel.querySelector("[data-science-investigation-handoff]"))return;
 let actions=panel.querySelector(".actions,.lesson-actions");
 if(!actions){actions=document.createElement("div");actions.className=panel.classList.contains("lesson-page")?"lesson-actions no-print":"actions no-print";panel.append(actions)}
 const a=document.createElement("button");a.type="button";a.className="btn";a.dataset.scienceInvestigationHandoff="true";a.textContent="Add to Scientific Investigation Notebook";
 a.addEventListener("click",()=>{const draft=buildDraft();if(!draft){alert("Open or select your Student Profile first so this investigation is attached to the correct learner.");return}try{sessionStorage.setItem(DRAFT,JSON.stringify(draft))}catch{}
   const u=new URL(NOTEBOOK);u.searchParams.set("grade",String(draft.grade||""));u.searchParams.set("course",draft.course);u.searchParams.set("draft","1");location.href=u.href;
 });
 actions.append(a);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
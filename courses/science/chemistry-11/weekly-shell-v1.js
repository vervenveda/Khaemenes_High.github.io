(()=>{"use strict";
const CURRENT=document.currentScript;
if(!CURRENT||window.KhaeChemistryWeeklyShell)return;
const VERSION="2026-11-22-weekly-shell-v1";
const week=Number(document.body?.dataset?.week||0);
const q=(root,sel)=>root?.querySelector?.(sel)||null;
const textAfterHeading=(article,label)=>{
  const headings=[...article.querySelectorAll("h3")];
  const h=headings.find(x=>x.textContent.trim()===label);
  if(!h)return null;
  let n=h.nextElementSibling;
  return n&&n.tagName==="P"?n:null;
};
function routeLabel(day){
 const names={monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday"};
 return `Open ${names[day]} Deep Lesson · Canonical Chemistry 11`;
}
function apply(w){
 if(!w||w.week!==week)return false;
 const hero=q(document,".hero");
 const title=q(hero,"h1");
 const lead=q(hero,".lead");
 if(title) title.textContent=w.title;
 if(lead) lead.innerHTML="<strong>Essential question:</strong> "+w.essentialQuestion;
 const contract=q(document,'[data-canonical-week-contract]');
 if(contract){
   contract.dataset.canonicalWeekContract=w.authority_version||VERSION;
   contract.innerHTML="<strong>Canonical week contract.</strong>"+
    "<p><strong>Quantitative:</strong> "+w.quantitative+"</p>"+
    "<p><strong>Evidence:</strong> "+w.evidence_contract+"</p>"+
    "<p><strong>Inquiry:</strong> "+w.inquiry_contract+"</p>"+
    "<p><strong>Retrieval / transfer:</strong> "+w.retrieval_contract+"</p>";
 }
 const monday=document.getElementById("monday");
 if(monday){
   const p=textAfterHeading(monday,"Learning target");
   if(p)p.textContent="Build and test an initial model for: "+w.essentialQuestion+" Retrieval focus: "+w.retrieval_contract;
 }
 const tuesday=document.getElementById("tuesday");
 if(tuesday){
   const core=textAfterHeading(tuesday,"Concept & Model Revision");
   if(core)core.textContent="Revise the week model using these core concepts: "+w.concepts+". Evidence focus: "+w.evidence_contract;
   const reading=textAfterHeading(tuesday,"Reading");
   if(reading)reading.textContent=w.reading||"Use the assigned Chemistry 11 reading and source dossier.";
 }
 const wednesday=document.getElementById("wednesday");
 if(wednesday){
   const p=textAfterHeading(wednesday,"Data & Quantitative Reasoning");
   if(p)p.textContent=w.quantitative;
 }
 const thursday=document.getElementById("thursday");
 if(thursday){
   const p=textAfterHeading(thursday,"Investigation / Engineering");
   if(p)p.textContent=w.inquiry_contract+" Source pathway: "+w.lab;
 }
 const friday=document.getElementById("friday");
 if(friday){
   const p=textAfterHeading(friday,"CER / Synthesis");
   if(p)p.textContent="Answer the essential question with evidence and revision: "+w.essentialQuestion+" Transfer focus: "+w.retrieval_contract;
 }
 for(const day of ["monday","tuesday","wednesday","thursday","friday"]){
   const a=q(document.getElementById(day),'a[href^="lessons/day-"]');
   if(a)a.textContent=routeLabel(day);
 }
 document.body.dataset.chemistryWeeklyShell=VERSION;
 window.dispatchEvent(new CustomEvent("chemistry-weekly-shell-ready",{detail:{week,version:VERSION}}));
 return true;
}
async function boot(){
 if(!Number.isInteger(week)||week<1||week>36)return;
 const fallback=document.body?.dataset?.weeklyShellFallback==="canonical";
 try{
   const url=new URL("../../course-map.json",CURRENT.src||location.href);
   const response=await fetch(url,{cache:"no-store",credentials:"same-origin"});
   if(!response.ok)throw new Error("course-map unavailable");
   const map=await response.json();
   const w=map?.weeks?.find?.(x=>Number(x.week)===week);
   if(!apply(w))throw new Error("week contract missing");
 }catch(error){
   document.body.dataset.chemistryWeeklyShell=fallback?"fallback-canonical":"fallback-unverified";
   console.warn("Chemistry 11 canonical weekly shell unavailable; using static fallback.",error);
 }
}
window.KhaeChemistryWeeklyShell=Object.freeze({version:VERSION,week,apply});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
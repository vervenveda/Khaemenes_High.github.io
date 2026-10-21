"use strict";
(()=>{
const $=id=>document.getElementById(id);
const safeId=v=>typeof v==="string"&&/^[a-z0-9_-]{3,32}$/i.test(v)?v.toLowerCase():null;
const keyPrefix="kh_sci9_formative_v1:";
function active(){try{const id=safeId(sessionStorage.getItem("kh_sci9_u04_active_learner_v1"));const profile=window.KhaemenesCourseEntryContract?.readAcademyProfile?.();if(profile&&safeId(String(profile.learnerId||""))!==id)return null;return id}catch{return null}}
function fetchRecords(id){
 const prefix=keyPrefix+id+":";const records=[];
 for(let i=0;i<localStorage.length;i++){
  const key=localStorage.key(i);if(!key?.startsWith(prefix))continue;
  try{const record=JSON.parse(localStorage.getItem(key));if(record?.schema!=="khaemenes-science-formative-v1"||record.learner!==id||typeof record.activity!=="string"||typeof record.notes!=="string"||record.notes.length>100000||key!==prefix+record.activity)continue;
  if(!/^units\/unit-0[2-6]\/[^/]+\.html$/.test(record.activity))continue;
  records.push({activity:record.activity,notes:record.notes,observation:typeof record.observation==="string"?record.observation:"",updatedAt:record.updatedAt||""});}catch{}
 }
 return records.sort((a,b)=>a.activity.localeCompare(b.activity));
}
function download(text){const u=URL.createObjectURL(new Blob([text],{type:"application/json"}));const a=document.createElement("a");a.href=u;a.download="Khaemenes-Science9-Formative-Portfolio.json";a.click();setTimeout(()=>URL.revokeObjectURL(u),30000)}
function init(){
 $("today").textContent=new Date().toLocaleDateString();
 const id=active();$("learner").textContent=id||"Not selected";
 if(!id){$("portfolioStatus").textContent="Select a learner on a Science 9 unit page before opening the portfolio. No student data has been displayed.";return}
 let rows;try{rows=fetchRecords(id)}catch{$("portfolioStatus").textContent="Browser evidence storage is unavailable.";return}
 $("portfolioStatus").textContent=rows.length+" saved formative investigation"+(rows.length===1?"":"s")+" for this learner.";
 const host=$("portfolioRecords");
 for(let unit=2;unit<=6;unit++){
  const sub=rows.filter(r=>r.activity.startsWith("units/unit-0"+unit+"/"));if(!sub.length)continue;
  const heading=document.createElement("h2");heading.textContent="Unit 0"+unit;host.append(heading);
  for(const record of sub){
   const item=document.createElement("article");item.className="portfolio-row";
   const h=document.createElement("h3");h.textContent=record.activity.split("/").pop().replace(/\.html$/,"").replace(/-/g," ");item.append(h);
   const date=document.createElement("p");date.textContent="Last saved: "+(record.updatedAt||"Not recorded");item.append(date);
   const note=document.createElement("pre");note.textContent=record.notes||"(No written observation)";item.append(note);host.append(item);
  }
 }
 $("exportPortfolio").disabled=false;$("printPortfolio").disabled=false;
 $("exportPortfolio").addEventListener("click",()=>{if(active()!==id)return;download(JSON.stringify({schema:"khaemenes-science-formative-portfolio-v1",learner:id,exportedAt:new Date().toISOString(),records:rows},null,2))});
 $("printPortfolio").addEventListener("click",()=>{if(active()===id)window.print()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
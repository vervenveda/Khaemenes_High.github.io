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
  if(!/^units\/unit-(?:0[2-9]|1[0-2])\/[^/]+\.html$/.test(record.activity))continue;
  records.push({activity:record.activity,notes:record.notes,observation:typeof record.observation==="string"?record.observation:"",updatedAt:record.updatedAt||""});}catch{}
 }
 return records.sort((a,b)=>a.activity.localeCompare(b.activity));
}
function download(text){const u=URL.createObjectURL(new Blob([text],{type:"application/json"}));const a=document.createElement("a");a.href=u;a.download="Khaemenes-Science9-Formative-Portfolio.json";a.click();setTimeout(()=>URL.revokeObjectURL(u),30000)}
function clearOnLearnerChange(id){if(active()===id)return false;document.getElementById("portfolioRecords").replaceChildren();document.getElementById("learner").textContent="Selection changed";document.getElementById("portfolioStatus").textContent="Learner changed. Reload the portfolio to view the currently selected learner.";document.getElementById("exportPortfolio").disabled=true;document.getElementById("printPortfolio").disabled=true;document.getElementById("portfolioImport").disabled=true;document.getElementById("portfolioRestore").disabled=true;return true}
function setupRestore(id){
 const picker=$("portfolioImport"),button=$("portfolioRestore"),preview=$("portfolioPreview");picker.disabled=false;let candidate=null;
 picker.addEventListener("change",async()=>{
  candidate=null;button.disabled=true;preview.textContent="";const file=picker.files?.[0];picker.value="";if(!file)return;
  if(active()!==id){preview.textContent="Learner changed. Reload this page.";return}
  if(file.size>2000000){preview.textContent="Backup exceeds the 2 MB limit.";return}
  try{
   const data=JSON.parse(await file.text());
   if(active()!==id){candidate=null;preview.textContent="Learner changed during file loading. Reload this page.";return}
   if(data?.schema!=="khaemenes-science-formative-portfolio-v1"||data.learner!==id||!Array.isArray(data.records)||data.records.length>200)throw Error("Wrong learner, schema, or record count.");
   const seen=new Set(),valid=[];
   for(const record of data.records){
    if(typeof record?.activity!=="string"||!/^units\/unit-(?:0[2-9]|1[0-2])\/[^/]+\.html$/.test(record.activity)||seen.has(record.activity)||typeof record.notes!=="string"||record.notes.length>100000||typeof record.observation!=="string"||record.observation.length>20000)throw Error("Invalid or duplicated activity entry.");
    seen.add(record.activity);valid.push(record);
   }
   const missing=valid.filter(r=>localStorage.getItem(keyPrefix+id+":"+r.activity)===null);
   candidate={valid,missing};
   preview.textContent=valid.length+" valid entries for learner "+id+": "+missing.length+" missing and eligible for restore; "+(valid.length-missing.length)+" existing entries will remain unchanged.";
   button.disabled=!missing.length;
  }catch(e){preview.textContent="Backup not accepted: "+e.message}
 });
 button.addEventListener("click",()=>{
  if(!candidate||active()!==id){preview.textContent="Learner changed or preview expired.";button.disabled=true;return}
  const pending=candidate.missing.filter(r=>localStorage.getItem(keyPrefix+id+":"+r.activity)===null);
  if(!pending.length){preview.textContent="Nothing missing to restore.";button.disabled=true;return}
  if(!window.confirm("Restore "+pending.length+" missing investigation records for learner "+id+"? Existing records will not be overwritten."))return;
  if(active()!==id){candidate=null;preview.textContent="Learner changed before restoration. No records were restored.";button.disabled=true;return}
  let count=0;
  try{for(const r of pending){if(active()!==id)throw Error("Learner changed during restore");const key=keyPrefix+id+":"+r.activity;if(localStorage.getItem(key)!==null)continue;
    localStorage.setItem(key,JSON.stringify({schema:"khaemenes-science-formative-v1",learner:id,activity:r.activity,notes:r.notes,observation:r.observation,updatedAt:r.updatedAt||new Date().toISOString()}));count++;
  }}catch{preview.textContent="Storage stopped after "+count+" records. Export your backup and review storage space.";button.disabled=true;return}
  preview.textContent="Restored "+count+" missing records. Reload to see the updated portfolio.";candidate=null;button.disabled=true;
 });
}
function init(){
 $("today").textContent=new Date().toLocaleDateString();
 const id=active();$("learner").textContent=id||"Not selected";
 if(!id){$("portfolioStatus").textContent="Select a learner on a Science 9 unit page before opening the portfolio. No student data has been displayed.";return}
 let rows;try{rows=fetchRecords(id)}catch{$("portfolioStatus").textContent="Browser evidence storage is unavailable.";return}
 $("portfolioStatus").textContent=rows.length+" saved formative investigation"+(rows.length===1?"":"s")+" for this learner.";
 const host=$("portfolioRecords");
 for(let unit=2;unit<=12;unit++){
  const sub=rows.filter(r=>r.activity.startsWith("units/unit-"+String(unit).padStart(2,"0")+"/"));if(!sub.length)continue;
  const heading=document.createElement("h2");heading.textContent="Unit "+String(unit).padStart(2,"0");host.append(heading);
  for(const record of sub){
   const item=document.createElement("article");item.className="portfolio-row";
   const h=document.createElement("h3");h.textContent=record.activity.split("/").pop().replace(/\.html$/,"").replace(/-/g," ");item.append(h);
   const date=document.createElement("p");date.textContent="Last saved: "+(record.updatedAt||"Not recorded");item.append(date);
   const note=document.createElement("pre");note.textContent=record.notes||"(No written observation)";item.append(note);host.append(item);
  }
 }
 $("exportPortfolio").disabled=false;$("printPortfolio").disabled=false;
 setupRestore(id);
 window.addEventListener("focus",()=>clearOnLearnerChange(id));
 window.addEventListener("pageshow",()=>clearOnLearnerChange(id));
 window.addEventListener("storage",()=>clearOnLearnerChange(id));
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)clearOnLearnerChange(id)});
 $("exportPortfolio").addEventListener("click",()=>{if(active()!==id)return;download(JSON.stringify({schema:"khaemenes-science-formative-portfolio-v1",learner:id,exportedAt:new Date().toISOString(),records:fetchRecords(id)},null,2))});
 $("printPortfolio").addEventListener("click",()=>{if(active()===id)window.print()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
"use strict";
/* Formative notes only. Namespaced by active Science 9 learner; NEVER writes unit grades. */
(()=>{
const rootKey="kh_sci9_u04_active_learner_v1";
const safeId=v=>typeof v==="string"&&/^[a-z0-9_-]{3,32}$/i.test(v)?v.toLowerCase():null;
const active=()=>{try{const id=safeId(sessionStorage.getItem(rootKey));const profile=window.KhaemenesCourseEntryContract?.readAcademyProfile?.();if(profile&&safeId(String(profile.learnerId||""))!==id)return null;return id}catch{return null}};
const sectionsSelector="#khaeExploration,#khaeU03Investigation,#u04Explore,#khEcologyExplorer,#khBiodiversityExplorer,#khAtomicStudio,#khUpperEvidence";
const download=(name,data,type)=>{const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)};
function init(){
for(const section of document.querySelectorAll(sectionsSelector)){
if(section.querySelector("[data-science-export]"))continue;
const field=section.querySelector("textarea"),out=section.querySelector('[role="status"]');if(!field)continue;
const id=active(),activity=location.pathname.split("/").filter(Boolean).slice(-3).join("/");
const key=id?"kh_sci9_formative_v1:"+id+":"+activity:null;
const controls=document.createElement("div");controls.className="science-formative-actions";
const label=document.createElement("p");label.textContent=id?"Notes are saved locally for learner "+id+". Export a copy for your portfolio.":"Select a Science 9 learner to enable local recovery. You can still download your notes.";
const status=document.createElement("p");status.setAttribute("role","status");status.setAttribute("aria-live","polite");
const save=document.createElement("button");save.type="button";save.textContent="Save notes locally";save.disabled=!key;
const exportText=document.createElement("button");exportText.type="button";exportText.dataset.scienceExport="true";exportText.textContent="Export evidence as text";
const exportJSON=document.createElement("button");exportJSON.type="button";exportJSON.textContent="Export restorable JSON";
const importLabel=document.createElement("label");importLabel.textContent="Restore from JSON backup (same learner and activity)";
const importInput=document.createElement("input");importInput.type="file";importInput.accept=".json,application/json";importInput.disabled=!key;importLabel.append(importInput);
const portfolioLink=document.createElement("a");portfolioLink.href=new URL("science-evidence-portfolio.html",document.currentScript?.src||new URL("../../science-formative-evidence.js",location.href)).href;portfolioLink.textContent="Open student evidence portfolio";portfolioLink.className="science-portfolio-link";
const unitMatch=activity.match(/^units\/unit-(\d{2})\/[^/]+\.html$/);
const unitLink=document.createElement("a");unitLink.href=unitMatch?"./index.html":"./";unitLink.textContent="Return to unit lessons";unitLink.className="science-portfolio-link";
const step=document.createElement("p");step.textContent="Suggested journey: investigate → save evidence → complete the laboratory's question check → review portfolio.";controls.append(label,step,save,exportText,exportJSON,importLabel,portfolioLink,unitLink,status);section.append(controls);
const printNotes=document.createElement("pre");printNotes.className="science-formative-print-notes";printNotes.setAttribute("aria-hidden","true");field.after(printNotes);
const sync=()=>{printNotes.textContent=field.value||"No written evidence entered."};field.addEventListener("input",sync);sync();
const current=()=>({schema:"khaemenes-science-formative-v1",learner:id,activity,notes:field.value,observation:out?.textContent||"",updatedAt:new Date().toISOString()});
if(key){try{const raw=localStorage.getItem(key);if(raw){const record=JSON.parse(raw);if(record?.schema==="khaemenes-science-formative-v1"&&record.learner===id&&record.activity===activity&&typeof record.notes==="string"){field.value=record.notes;sync();status.textContent="Recovered previously saved notes."}}}catch{status.textContent="Local recovery unavailable; existing saved data was not changed."}}
save.addEventListener("click",()=>{if(!key||active()!==id){status.textContent="Learner changed; no notes saved.";return}try{localStorage.setItem(key,JSON.stringify(current()));status.textContent="Saved locally. Export a backup for another device."}catch{status.textContent="Local storage unavailable or full. Export your notes instead."}});
exportText.addEventListener("click",()=>{const r=current();download("khaemenes-science-evidence.txt",["Khaemenes Academy | Grade 9 Science",r.activity,"Learner: "+(r.learner||"unselected"),"Date: "+r.updatedAt,r.observation,"Observations and reasoning:",r.notes].join("\n\n"),"text/plain;charset=utf-8")});
exportJSON.addEventListener("click",()=>download("khaemenes-science-formative.json",JSON.stringify(current(),null,2),"application/json"));
importInput.addEventListener("change",async()=>{const file=importInput.files?.[0];importInput.value="";if(!file||!key||active()!==id)return;if(file.size>1000000){status.textContent="Backup too large. No data changed.";return}
try{const r=JSON.parse(await file.text());if(r?.schema!=="khaemenes-science-formative-v1"||r.learner!==id||r.activity!==activity||typeof r.notes!=="string"||r.notes.length>100000){status.textContent="Backup does not match this learner and activity. Nothing changed.";return}
if(!window.confirm("Replace the visible notes with this matching backup? Current notes will be lost unless exported first."))return;
field.value=r.notes;sync();status.textContent="Imported into editor. Select Save notes locally to keep it on this device.";
}catch{status.textContent="Invalid JSON backup. Nothing changed."}});
}
const style=document.createElement("style");style.textContent='.science-formative-actions{margin-top:12px}.science-formative-actions button{margin:4px;padding:9px;border-radius:7px}.science-formative-actions label{display:block;margin-top:10px}.science-portfolio-link{display:inline-block;padding:9px;overflow-wrap:anywhere}.science-formative-print-notes{display:none;white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}@media print{.science-formative-actions{display:none!important}.science-formative-print-notes{display:block!important;min-height:65px;border:1px solid #666;padding:9px;white-space:pre-wrap;overflow-wrap:anywhere}}';document.head.append(style);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(init,0),{once:true});else setTimeout(init,0);
})();
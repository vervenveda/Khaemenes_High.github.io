"use strict";
/* Offline formative evidence: downloadable text, intentionally not persisted to localStorage or graded records. */
(()=>{
const escapeText=s=>String(s||"").replace(/\r\n?/g,"\n");
function init(){
 const sections=[...document.querySelectorAll("#khaeExploration,#khaeU03Investigation,#u04Explore,#khEcologyExplorer,#khBiodiversityExplorer,#khAtomicStudio")];
 for(const section of sections){
  if(section.querySelector("[data-science-export]"))continue;
  const field=section.querySelector("textarea"),out=section.querySelector('[role="status"]');
  if(!field)continue;
  const controls=document.createElement("div");controls.className="science-formative-actions";
  const exportButton=document.createElement("button");exportButton.type="button";exportButton.dataset.scienceExport="true";exportButton.textContent="Export evidence as text";controls.append(exportButton);section.append(controls);
  const printNotes=document.createElement("pre");printNotes.className="science-formative-print-notes";printNotes.setAttribute("aria-hidden","true");printNotes.hidden=true;field.after(printNotes);
  const sync=()=>{printNotes.textContent=field.value||"No written evidence entered.";};
  field.addEventListener("input",sync);sync();
  exportButton.addEventListener("click",()=>{
   const title="Khaemenes Academy | Grade 9 Science | "+location.pathname.split("/").pop();
   const report=[title,"Name: ____________________","Date: ____________________",out?.textContent||"","Observations and reasoning:",escapeText(field.value||"(none)")].join("\n\n");
   const blob=new Blob([report],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
   a.href=url;a.download="khaemenes-science-evidence.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
 }
 if(sections.length){const style=document.createElement("style");style.textContent='.science-formative-actions{margin-top:10px}.science-formative-actions button{padding:9px;border-radius:7px}.science-formative-print-notes{display:none;white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}@media print{.science-formative-actions{display:none!important}.science-formative-print-notes{display:block!important;min-height:65px;border:1px solid #666;padding:9px;white-space:pre-wrap;overflow-wrap:anywhere}section:has(>.science-formative-print-notes) textarea{display:none!important}}';document.head.append(style)}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(init,0),{once:true});else setTimeout(init,0);
})();
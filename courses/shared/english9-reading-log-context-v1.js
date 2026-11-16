/* Khaemenes Academy · English 9 Reading Log Curriculum Context v1
   Adds curriculum context fields to the existing fixed-row reading record.
   Existing saved title/author/type/date/amount/evidence fields are preserved. */
(()=>{"use strict";
if(window.__KHAE_E9_READING_CONTEXT_V1__)return;
window.__KHAE_E9_READING_CONTEXT_V1__=true;
if(!/\/english-9\/records\/reading-log\.html$/i.test(location.pathname))return;
const table=document.querySelector("table.standards-table");
if(!table)return;
const head=table.querySelector("thead tr");
if(head&&!head.querySelector("[data-reading-context-head]")){
  const cells=[["Week","week"],["Unit","unit"],["Reading Type","reading-type"],["Source Status","source-status"]];
  const before=head.children[1]||null;
  for(const [label,key] of cells){
    const th=document.createElement("th");th.textContent=label;th.dataset.readingContextHead=key;
    head.insertBefore(th,before);
  }
}
[...table.querySelectorAll("tbody tr")].forEach((row,i)=>{
  const n=i+1;
  if(row.querySelector("[data-reading-context-cell]"))return;
  const before=row.children[1]||null;
  const week=document.createElement("td");week.dataset.readingContextCell="week";
  week.innerHTML='<select data-save-field="reading-week-'+n+'" aria-label="Reading week '+n+'"><option value="">—</option>'+Array.from({length:36},(_,j)=>'<option value="'+(j+1)+'">W'+String(j+1).padStart(2,"0")+'</option>').join("")+'</select>';
  const unit=document.createElement("td");unit.dataset.readingContextCell="unit";
  unit.innerHTML='<select data-save-field="reading-unit-'+n+'" aria-label="Reading unit '+n+'"><option value="">—</option>'+Array.from({length:12},(_,j)=>'<option value="'+(j+1)+'">U'+String(j+1).padStart(2,"0")+'</option>').join("")+'</select>';
  const type=document.createElement("td");type.dataset.readingContextCell="type";
  type.innerHTML='<select data-save-field="reading-curriculum-type-'+n+'" aria-label="Reading type '+n+'"><option value="">—</option><option>Assigned</option><option>Independent</option><option>Research</option><option>Extension</option></select>';
  const source=document.createElement("td");source.dataset.readingContextCell="source";
  source.innerHTML='<select data-save-field="reading-source-status-'+n+'" aria-label="Reading source status '+n+'"><option value="">—</option><option>Teacher-approved / lawful source</option><option>Academy original</option><option>Public domain</option><option>Library / licensed access</option><option>Student-selected source</option></select>';
  for(const td of [week,unit,type,source])row.insertBefore(td,before);
});
const lead=document.querySelector(".hero .lead");
if(lead)lead.textContent="Track common and independent reading by week and unit, preserve the source pathway, and connect each work to annotations, a conference, a response, or a portfolio artifact.";
document.documentElement.dataset.englishReadingLogContext="v1";
})();
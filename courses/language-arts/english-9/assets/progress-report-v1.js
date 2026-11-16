(function(){ "use strict";
const q=s=>document.querySelector(s);
function parse(text,fallback){try{return JSON.parse(text)}catch{return fallback}}
function scoped(base){
  try{return window.KhaemenesEnglish9Records?.storageKey?.(base)||base}catch{return base}
}
function bestFromAssessment(kind){
  const key=scoped("khae-ela9-assessment-v2:"+kind);
  const rec=parse(localStorage.getItem(key)||"null",null);
  const scores=(rec?.attempts||[]).map(a=>Number(a?.summary?.score)).filter(Number.isFinite);
  return scores.length?Math.max(...scores):null;
}
function readingDevelopment(){
  // The Grade 9 ledger is intentionally not migrated to the upper-grade schema.
  // Missing week/type/source metadata is unknown, never inferred as assigned reading.
  const readField=name=>{try{return String(localStorage.getItem(scoped("khae-ela9-field:"+name))||"").trim()}catch{return ""}};
  const portal=parse((()=>{try{return localStorage.getItem(scoped("ELA9_36_WEEK_PORTAL_V2"))}catch{return null}})()||"null",null);
  const student=portal?.students?.find(s=>s.id===portal.activeId)||portal?.students?.[0]||null;
  const weeks=student?.progress?.weeks||{};
  const weekSet=new Set(),unitSet=new Set(),assignedSet=new Set(),sourceCounts={};
  let readWeeks=0,minutes=0,reflections=0,logEntries=0,independent=0,unclassified=0;
  for(let w=1;w<=36;w++){
    const r=weeks[w]?.reading||weeks[String(w)]?.reading;
    if(!r)continue;
    const n=Number(r.minutes);
    const active=String(r.status||"").toLowerCase()!=="not started"||n>0||String(r.pages||"").trim()||String(r.reflection||"").trim();
    if(active){readWeeks++;weekSet.add(w);unitSet.add(Math.ceil(w/3))}
    if(Number.isFinite(n)&&n>0)minutes+=n;
    if(String(r.reflection||"").trim())reflections++;
  }
  let availableRows=30;
  try{
    const n=Number.parseInt(localStorage.getItem(scoped("khae-ela9-reading-rows-v2"))||"30",10);
    if(Number.isFinite(n))availableRows=Math.min(500,Math.max(30,n));
  }catch{}
  for(let i=1;i<=availableRows;i++){
    if(!readField("reading-title-"+i))continue;
    logEntries++;
    const week=Number(readField("reading-week-"+i));
    const unit=Number(readField("reading-unit-"+i));
    const validWeek=Number.isInteger(week)&&week>=1&&week<=36;
    const validUnit=Number.isInteger(unit)&&unit>=1&&unit<=12;
    if(validWeek)weekSet.add(week);
    if(validUnit)unitSet.add(unit);
    else if(validWeek)unitSet.add(Math.ceil(week/3));
    const kind=readField("reading-curriculum-type-"+i).toLowerCase();
    if(kind==="assigned"&&validWeek)assignedSet.add(week);
    if(kind==="independent")independent++;
    if(!kind)unclassified++;
    const source=readField("reading-source-status-"+i)||"Not recorded";
    sourceCounts[source]=(sourceCounts[source]||0)+1;
    // Legacy amounts may be pages, minutes, or mixed text. Count minutes only
    // when the student explicitly labels them as minutes, never naked numbers.
    const amount=readField("reading-amount-"+i);
    const match=amount.match(/(?:^|\\s)(\\d+(?:\\.\\d+)?)\\s*(?:minutes?|mins?)(?:\\b|$)/i);
    if(match){const n=Number(match[1]);if(Number.isFinite(n)&&n>0&&n<=100000)minutes+=n}
  }
  return {readWeeks,minutes,reflections,logEntries,assignedWeeks:assignedSet.size,independent,weeks:weekSet.size,units:unitSet.size,sourceCounts,unclassified};
}
function render(){
  const progress=parse(localStorage.getItem(scoped("khae-ela9-progress-v1"))||"{}",{});
  const done=Array.from({length:36},(_,i)=>Boolean(progress["week-"+String(i+1).padStart(2,"0")])).filter(Boolean).length;
  const pct=Math.round(done/36*100);
  if(q("[data-e9-weeks]"))q("[data-e9-weeks]").textContent=done+" / 36";
  if(q("[data-e9-percent]"))q("[data-e9-percent]").textContent=pct+"%";
  const mid=bestFromAssessment("midterm"),fin=bestFromAssessment("final");
  if(q("[data-e9-midterm]"))q("[data-e9-midterm]").textContent=mid==null?"—":mid+"%";
  if(q("[data-e9-final]"))q("[data-e9-final]").textContent=fin==null?"—":fin+"%";
  const rd=readingDevelopment();
  if(q("[data-e9-reading-weeks]"))q("[data-e9-reading-weeks]").textContent=rd.readWeeks+" / 36";
  if(q("[data-e9-reading-minutes]"))q("[data-e9-reading-minutes]").textContent=rd.minutes||"—";
  if(q("[data-e9-reading-reflections]"))q("[data-e9-reading-reflections]").textContent=rd.reflections+" / 36";
  if(q("[data-e9-reading-log]"))q("[data-e9-reading-log]").textContent=String(rd.logEntries);
  const metrics={entries:rd.logEntries,assigned:rd.assignedWeeks+" / 36",independent:rd.independent,minutes:rd.minutes||"—",weeks:rd.weeks+" / 36",units:rd.units+" / 12"};
  for(const [key,value] of Object.entries(metrics)){
    const el=q('[data-reading-stat="'+key+'"]');if(el)el.textContent=String(value);
  }
  const source=q("[data-reading-source-distribution]");
  if(source){
    source.replaceChildren();
    const entries=Object.entries(rd.sourceCounts).sort((a,b)=>b[1]-a[1]);
    if(!entries.length)source.textContent="No source types recorded yet.";
    else entries.forEach(([name,count],i)=>{if(i)source.append(document.createTextNode(" · "));const label=document.createElement("span");label.textContent=name+": "+count;source.append(label)});
  }
  const note=q("[data-reading-development-note]");
  if(note)note.textContent="Assigned weeks are based only on explicitly labeled ledger entries. "+rd.unclassified+" older entr"+(rd.unclassified===1?"y has":"ies have")+" no reading type recorded; these are not automatically classified. Reading does not grant grades or mastery.";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
})();
/* Khaemenes Academy — Shared Reading-to-Writing Evidence Studio for English 9–12.
   Non-grading, local, learner-scoped, additive to existing course and portfolio records. */
(() => {
"use strict";
if(window.__KHAE_ENGLISH_EVIDENCE_STUDIO_V1__)return;
window.__KHAE_ENGLISH_EVIDENCE_STUDIO_V1__=true;
const grade=Number(document.documentElement.dataset.evidenceGrade||0);
if(![9,10,11,12].includes(grade))return;
const $=id=>document.getElementById(id);
const contract=window.KhaemenesCourseEntryContract;
const profile=contract?.readAcademyProfile?.()||null;
const validProfile=()=>Boolean(profile&&contract?.readAcademyProfile?.()?.learnerId===profile.learnerId);
const storageReady=Boolean(profile&&contract?.writeJSON&&contract?.readJSON);
const base="khae-english-evidence-studio-v1:english-"+grade;
const indexKey=base+":index";
const weekKey=w=>base+":week-"+String(w).padStart(2,"0");
const curriculum=window["ENGLISH_"+grade+"_CURRICULUM"]||{};
const source=grade===9?(curriculum.weekPlans||[]).map(w=>Object.assign({week:w.n,unit:w.unit,weekTitle:w.title,fallbackTitle:w.reading,fallbackPurpose:w.question},w.readingSuggestion||{})):(curriculum.readingAssignments||[]);
const plan=grade===9?(curriculum.weekPlans||[]):(curriculum.weeks||[]);
const getAssignment=w=>source.find(a=>Number(a.week)===w)||null;
const trim=v=>String(v??"").trim();
const words=v=>trim(v).split(/\s+/).filter(Boolean).length;
const fieldNames=["claim","evidence1","locator1","reason1","evidence2","locator2","reason2","evidence3","locator3","reason3","counter","sourceNotes","draft","feedback","revised","reflection","defense"];
const configs={
9:{label:"Claim → Evidence → Explanation",count:1,words:120,question:"What interpretation of the text can you support?",
 steps:["Make an arguable claim.","Select specific text evidence and a citation locator.","Explain how evidence supports the claim.","Revise for clarity and accurate attribution."]},
10:{label:"Comparison, Rhetoric & Counterclaim",count:2,words:180,question:"How do the author’s choices and differing perspectives shape meaning?",
 steps:["Compare two moments, perspectives, or sources.","Evaluate rhetorical choices and intended audience.","Answer a strong counterclaim.","Revise the reasoning and transitions."]},
11:{label:"Multiple-Source Synthesis & Qualification",count:3,words:240,question:"What conclusion survives comparison across sources?",
 steps:["Synthesize three attributed details or sources.","Qualify the claim and examine limitations.","Address a credible competing interpretation.","Revise for synthesis instead of summary."]},
12:{label:"Scholarly Argument & Oral Defense",count:3,words:300,question:"What independent position can you defend with precision?",
 steps:["Develop an original, qualified thesis.","Evaluate provenance and counter-evidence.","Prepare an oral defense under questioning.","Polish a publishable, properly attributed revision."]}
};
const config=configs[grade];
const empty=w=>({schema:"khae-english-evidence-studio-v1",grade,week:w,assignment:getAssignment(w)?.title||"",updatedAt:"",fields:Object.fromEntries(fieldNames.map(k=>[k,""]))});
const read=(key,fallback)=>{
 if(!storageReady||!validProfile())return fallback;
 try{return contract.readJSON(key,fallback,profile)}catch{return fallback}
};
const summary=document.querySelector("[data-evidence-studio-summary]");
function renderSummary(){
 if(!summary)return;
 if(!storageReady||!validProfile()){
  summary.textContent="Choose a valid Academy learner to see personal Evidence Studio activity. No scores or mastery are awarded here.";
  return;
 }
 const data=read(indexKey,null);
 const items=data&&data.grade===grade&&data.schema==="khae-english-evidence-studio-v1"?Object.values(data.weeks||{}):[];
 const started=items.filter(v=>v?.started).length;
 const revised=items.filter(v=>v?.revised).length;
 const reflected=items.filter(v=>v?.reflected).length;
 summary.textContent="Evidence Studio · "+started+" weeks started · "+revised+" revisions · "+reflected+" reflections · developmental records only; no course grades or mastery.";
}
const root=$("evidenceStudio");
if(!root){renderSummary();return}
const status=$("es-save-status");
const weekSelect=$("es-week");
const sourceBox=$("es-source");
const taskList=$("es-grade-goals");
const coaching=$("es-coaching");
const checklist=$("es-checklist");
const fields=Object.fromEntries(fieldNames.map(k=>[k,$("es-"+k)]));
let currentWeek=1;
let record=empty(1);
let modified=false;
let conflictLocked=false;
let autosaveTimer=null;
let indexNeedsSync=false;
const AUTOSAVE_DELAY_MS=700;
function clearPendingAutosave(){
 if(autosaveTimer!==null){clearTimeout(autosaveTimer);autosaveTimer=null}
}
function scheduleSave(){
 clearPendingAutosave();
 autosaveTimer=setTimeout(()=>{autosaveTimer=null;if(modified||indexNeedsSync)save()},AUTOSAVE_DELAY_MS);
}
function message(text,kind){
 status.textContent=text;status.dataset.status=kind||"neutral";
}
function countChains(d){
 return [1,2,3].filter(n=>trim(d["evidence"+n])&&trim(d["reason"+n])).length;
}
function checkpoints(d){
 return [
  ["Defensible claim",!!trim(d.claim)],
  ["At least "+config.count+" explained evidence chain(s)",countChains(d)>=config.count],
  ["Attribution or source locator",!!trim(d.locator1)],
  ["First draft",!!trim(d.draft)],
  ["Substantively revised draft",!!trim(d.revised)&&trim(d.revised)!==trim(d.draft)],
  ["Reflection on learning",!!trim(d.reflection)]
 ];
}
function renderReview(){
 const d=record.fields,notes=[];
 if(!trim(d.claim))notes.push("State an arguable claim rather than a summary.");
 if(!trim(d.evidence1))notes.push("Choose a precise passage and identify its location.");
 if(trim(d.evidence1)&&!trim(d.reason1))notes.push("Explain why the passage supports your claim.");
 if(countChains(d)<config.count)notes.push("Aim for "+config.count+" explained pieces of evidence at this grade.");
 if(trim(d.evidence1)&&!trim(d.locator1))notes.push("Provide a page, chapter, paragraph, stanza, or edition locator.");
 if(words(d.draft)<config.words)notes.push("Develop your first draft. Around "+config.words+" words is a planning target, not a passing threshold.");
 if(!trim(d.counter))notes.push("Consider a plausible competing interpretation or counterclaim.");
 if(trim(d.revised)===trim(d.draft))notes.push("Use feedback to make a substantive revision, not merely a new title.");
 if(!trim(d.feedback))notes.push("Record one teacher, peer, or self-review observation.");
 if(!trim(d.reflection))notes.push("Explain what improved and what needs more practice.");
 if(grade===12&&!trim(d.defense))notes.push("Prepare a question and your oral-defense response.");
 coaching.replaceChildren();
 const lead=document.createElement("p");
 lead.textContent=notes.length?"Revision prompts (not an automated grade):":"Your planning steps are documented. Ask a teacher to evaluate accuracy and quality.";
 coaching.append(lead);
 if(notes.length){const ul=document.createElement("ul");for(const note of notes.slice(0,7)){const li=document.createElement("li");li.textContent=note;ul.append(li)}coaching.append(ul)}
 checklist.replaceChildren();
 const ul=document.createElement("ul");
 for(const pair of checkpoints(d)){const li=document.createElement("li");li.textContent=(pair[1]?"✓ ":"○ ")+pair[0];ul.append(li)}
 checklist.append(ul);
 $("es-indicator").textContent=checkpoints(d).filter(v=>v[1]).length+"/6 planning checkpoints · "+words(d.draft)+" draft words · "+words(d.revised)+" revised words · not a grade";
}
function addText(tag,text,container,bold){
 const el=document.createElement(tag);
 if(bold){const b=document.createElement("strong");b.textContent=bold+": ";el.append(b,document.createTextNode(text))}
 else el.textContent=text;
 container.append(el);return el;
}
function renderSource(){
 const a=getAssignment(currentWeek),w=plan.find(x=>Number(x.week||x.n)===currentWeek)||{};
 sourceBox.replaceChildren();
 addText("h2","Week "+String(currentWeek).padStart(2,"0")+" · "+(a?.title||a?.fallbackTitle||"Assigned reading"),sourceBox);
 addText("p",(a?.author||"Course selection")+" · Unit "+String(a?.unit||Math.ceil(currentWeek/3)).padStart(2,"0"),sourceBox);
 for(const pair of [["Purpose",a?.purpose||a?.fallbackPurpose||w.essentialQuestion||w.question],["Assigned scope",a?.assignmentScope],["Source rights",a?.rightsStatus],["Offline preparation",a?.offlineAccess],["Citation expectation",a?.citationExpectation]]){
  if(trim(pair[1]))addText("p",pair[1],sourceBox,pair[0]);
 }
 const sources=Array.isArray(a?.sources)?a.sources:[];
 if(sources.length){const links=document.createElement("div");links.className="es-actions";
  for(const pair of sources){
   if(!Array.isArray(pair))continue;
   try{const url=new URL(pair[1]);if(!["https:","http:"].includes(url.protocol))continue;
    const link=document.createElement("a");link.href=url.href;link.target="_blank";link.rel="noopener noreferrer";link.textContent=pair[0]||"Source";links.append(link)}
   catch{}
  }
  sourceBox.append(links);
 }
 if(!a)addText("p","Canonical assignment details are unavailable. Check Reading Headquarters; your writing remains separate from grades.",sourceBox);
 $("es-week-heading").textContent="Week "+String(currentWeek).padStart(2,"0")+" · "+(w.title||a?.weekTitle||"Reading and writing");
 $("es-grade-heading").textContent="English "+grade+" · "+config.label;
 $("es-question").textContent=config.question;
 taskList.replaceChildren();for(const text of config.steps)addText("li",text,taskList);
 $("es-second-chain").hidden=false;
 $("es-third-chain").hidden=grade<11;
 $("es-defensive").hidden=grade!==12;
 $("es-evidence1").placeholder="Text detail with accurate quotation or paraphrase";
 $("es-reason1").placeholder="This evidence supports or complicates my claim because …";
 $("es-claim").placeholder=grade>=11?"My qualified interpretation is …":"My arguable interpretation is …";
 $("es-draft").placeholder="Draft a complete, cited analysis; do not stop at plot summary.";
 $("es-reading-link").href="reading-list.html";
 $("es-log-link").href="records/reading-log.html?week="+currentWeek;
 $("es-week-link").href="weeks/week-"+String(currentWeek).padStart(2,"0")+"/";
 $("es-portfolio-link").href="portfolio/index.html";
 $("es-progress-link").href="records/progress-report.html";
}
function renderFields(){for(const k of fieldNames)if(fields[k])fields[k].value=record.fields[k]||"";renderReview()}
function save(){
 clearPendingAutosave();
 if(conflictLocked){message("Save blocked: another tab changed this learner or record. Copy your work, then reload before saving again.","warning");return false}
 if(!modified&&!indexNeedsSync)return true;
 if(!storageReady||!validProfile()){message("Saving blocked: select the correct Academy learner. Your text stays on this page.","warning");return false}
 let next=record;
 if(modified){
  next=Object.assign({},record,{schema:"khae-english-evidence-studio-v1",grade,week:currentWeek,assignment:getAssignment(currentWeek)?.title||"",updatedAt:new Date().toISOString()});
  try{contract.writeJSON(weekKey(currentWeek),next,profile)}
  catch(error){message("Draft save failed: "+String(error?.message||"storage unavailable")+". Text remains visible; export or print a recovery copy.","warning");return false}
  record=next;modified=false;indexNeedsSync=true;
 }
 try{
  const prior=read(indexKey,{});
  const current=prior?.grade===grade&&prior?.schema===next.schema?prior.weeks||{}:{};
  const d=next.fields;
  const index={schema:next.schema,grade,weeks:Object.assign({},current)};
  index.weeks[String(currentWeek)]={started:fieldNames.some(k=>trim(d[k])),revised:!!trim(d.revised)&&trim(d.revised)!==trim(d.draft),reflected:!!trim(d.reflection),updatedAt:next.updatedAt};
  contract.writeJSON(indexKey,index,profile);
  indexNeedsSync=false;
  message("Saved to this Academy learner on this device. Download evidence packets for durable copies.","success");
  return true;
 }catch(error){
  message("Draft saved on this device, but the progress summary did not update: "+String(error?.message||"index unavailable")+". Retry Save or export a backup.","warning");
  return true;
 }
}
function loadWeek(n){
 if(!Number.isInteger(n)||n<1||n>36)return;
 if((modified||indexNeedsSync)&&!save()){weekSelect.value=String(currentWeek);return}
 if(indexNeedsSync){weekSelect.value=String(currentWeek);message("Draft saved but progress summary is pending. Retry Save or export a backup before switching weeks.","warning");return}
 currentWeek=n;
 const saved=read(weekKey(n),null);
 record=saved&&saved.schema==="khae-english-evidence-studio-v1"&&saved.grade===grade&&saved.week===n&&saved.fields?
  Object.assign(empty(n),saved,{fields:Object.assign(empty(n).fields,saved.fields)}):empty(n);
 modified=false;indexNeedsSync=false;
 renderSource();renderFields();
 message(storageReady&&validProfile()?"Ready. Work is stored separately for your selected Academy learner on this browser.":"Select an Academy learner to save. No unscoped student record will be created.",storageReady?"neutral":"warning");
}
function exportPacket(){
 if(conflictLocked){message("Export paused: another tab changed this learner or record. Copy your work and reload.","warning");return}
 if(!storageReady||!validProfile()){message("Select the correct Academy learner before exporting student records.","warning");return}
 const saved=!modified||save();
 // Storage failure must not prevent the current visible draft from being exported.
 // Preserve the same learner/week boundaries and explicitly mark an unsaved export.
 const snapshot=Object.assign({},record,{fields:Object.assign({},record.fields)});
 const exportData={schema:"khae-english-evidence-studio-v1",grade,week:currentWeek,learnerId:profile.learnerId,assignment:getAssignment(currentWeek)?.title||"",exportedAt:new Date().toISOString(),persistedOnDevice:saved,record:snapshot,warning:"Developmental artifact only; not a grade, teacher approval, or mastery result."};
 try{
  const blob=new Blob([JSON.stringify(exportData,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="english-"+grade+"-week-"+String(currentWeek).padStart(2,"0")+"-evidence-studio.json";document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
  message(saved?"Evidence export requested. Verify the file was downloaded; submit it with your portfolio for teacher review.":"Unsaved draft export requested because local saving failed. Verify the download before leaving; this draft is NOT safely stored on this device.",saved?"neutral":"warning");
 }catch(error){message("Evidence export failed. Your draft remains visible; copy it before leaving. "+String(error?.message||"Download unavailable"),"warning")}
}
for(let n=1;n<=36;n++){const opt=document.createElement("option");opt.value=String(n);opt.textContent="Week "+String(n).padStart(2,"0");weekSelect.append(opt)}
for(const field of fieldNames){
 const el=fields[field];if(!el)continue;
 if(!storageReady||!validProfile())el.disabled=true;
 el.addEventListener("input",()=>{if(conflictLocked)return;record.fields[field]=el.value.slice(0,30000);modified=true;renderReview();scheduleSave()});
}
weekSelect.addEventListener("change",()=>loadWeek(Number(weekSelect.value)));
$("es-save").addEventListener("click",()=>{for(const field of fieldNames)if(fields[field])record.fields[field]=fields[field].value.slice(0,30000);modified=true;save()});
$("es-export").addEventListener("click",exportPacket);
function buildPrintablePortfolio(){
 const host=$("es-print-evidence");
 if(!host)return;
 host.replaceChildren();
 addText("h2","English "+grade+" · Reading-to-Writing Evidence Studio · Week "+String(currentWeek).padStart(2,"0"),host);
 addText("p","Assigned reading: "+(getAssignment(currentWeek)?.title||"Teacher-selected text"),host);
 addText("p","This is a learner draft and revision record, not an academic grade or mastery certificate.",host);
 const labels=[
  ["Claim or thesis","claim"],["Source and edition notes","sourceNotes"],
  ["Evidence 1","evidence1"],["Source locator 1","locator1"],["Reasoning 1","reason1"],
  ["Evidence 2","evidence2"],["Source locator 2","locator2"],["Reasoning 2","reason2"],
  ["Evidence 3","evidence3"],["Source locator 3","locator3"],["Reasoning 3","reason3"],
  ["Alternative interpretation","counter"],["Original draft","draft"],
  ["Feedback and review notes","feedback"],["Revised draft","revised"],
  ["Reflection","reflection"],["Oral-defense preparation","defense"]
 ];
 for(const [label,key] of labels){
  if(!trim(record.fields[key]))continue;
  const section=document.createElement("section");
  section.className="es-print-entry";
  addText("h3",label,section);
  const p=addText("p",record.fields[key],section);
  p.style.whiteSpace="pre-wrap";
  host.append(section);
 }
}
$("es-print").addEventListener("click",()=>{
 if(conflictLocked){message("Print paused: another tab changed this learner or record. Copy your work and reload.","warning");return}
 if(!storageReady||!validProfile()){message("Select the correct Academy learner before printing student records.","warning");return}
 const saved=!modified||save();
 buildPrintablePortfolio();
 if(!saved)message("Local save failed. Printing the current unsaved draft; verify your printed or PDF copy before leaving.","warning");
 window.print();
});
window.addEventListener("pagehide",()=>{if(modified||indexNeedsSync)save()});
window.addEventListener("storage",event=>{
 const scoped=contract?.scopedKey?.(weekKey(currentWeek),profile);
 if(event.key==="khaemenes_active_learner_v1"||event.key===scoped){
  conflictLocked=true;
  clearPendingAutosave();
  for(const field of fieldNames)if(fields[field])fields[field].disabled=true;
  $("es-save").disabled=true;
  $("es-export").disabled=true;
  message("Learner or record changed in another tab; saving paused. Copy your text and reload with the correct learner.","warning");
 }
});
const requested=Number(new URLSearchParams(location.search).get("week"));
const start=Number.isInteger(requested)&&requested>=1&&requested<=36?requested:1;
weekSelect.value=String(start);loadWeek(start);
})();

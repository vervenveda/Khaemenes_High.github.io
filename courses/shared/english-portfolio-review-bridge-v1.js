/* Khaemenes Academy — English 9–12 Reading-to-Writing Portfolio Review Bridge.
 * Read-only learner-scoped preview and explicit offline educator handoff.
 * Does not issue approvals, grades, certifications, or mastery changes.
 */
(() => {
"use strict";
if(window.__KHAE_ENGLISH_PORTFOLIO_BRIDGE_V1__)return;
const grade=Number(document.documentElement.dataset.evidenceGrade||0);
if(![9,10,11,12].includes(grade))return;
const anchor=document.querySelector('[aria-label="Evidence Studio portfolio pathway"]');
if(!anchor)return;
window.__KHAE_ENGLISH_PORTFOLIO_BRIDGE_V1__=true;
const contract=window.KhaemenesCourseEntryContract;
const profile=contract?.readAcademyProfile?.()||null;
const eligible=()=>Boolean(profile?.learnerId&&contract?.readJSON&&contract?.readAcademyProfile?.()?.learnerId===profile.learnerId);
const prefix="khae-english-evidence-studio-v1:english-"+grade;
const key=week=>prefix+":week-"+String(week).padStart(2,"0");
const fieldNames=["claim","evidence1","locator1","reason1","evidence2","locator2","reason2","evidence3","locator3","reason3","counter","sourceNotes","draft","feedback","revised","reflection","defense"];
const sections=[
 ["Reading interpretation","claim"],
 ["Evidence chain 1","evidence1"],["Source locator 1","locator1"],["Explanation 1","reason1"],
 ["Evidence chain 2","evidence2"],["Source locator 2","locator2"],["Explanation 2","reason2"],
 ["Evidence chain 3","evidence3"],["Source locator 3","locator3"],["Explanation 3","reason3"],
 ["Counterargument / qualification","counter"],["Source and attribution notes","sourceNotes"],
 ["Original draft","draft"],["Feedback notes","feedback"],["Revised draft","revised"],
 ["Reflection","reflection"],["Oral defense","defense"]
];
function read(week){
 if(!eligible())return null;
 try{
  const record=contract.readJSON(key(week),null,profile);
  if(!record||record.schema!=="khae-english-evidence-studio-v1"||record.grade!==grade||Number(record.week)!==week||!record.fields||typeof record.fields!=="object")return null;
  return record;
 }catch{return null}
}
const nonempty=v=>typeof v==="string"&&v.trim().length>0;
function inspect(record){
 const f=record?.fields||{};
 const components={
  interpretation:nonempty(f.claim),
  citation:nonempty(f.evidence1)&&nonempty(f.locator1)&&nonempty(f.reason1),
  firstDraft:nonempty(f.draft),
  feedback:nonempty(f.feedback),
  revision:nonempty(f.revised)&&f.revised.trim()!==String(f.draft||"").trim(),
  reflection:nonempty(f.reflection)
 };
 return {components,ready:Object.values(components).every(Boolean)};
}
function el(tag,text,className){
 const node=document.createElement(tag);
 if(text!==undefined)node.textContent=text;
 if(className)node.className=className;
 return node;
}
const section=el("section",undefined,"khae-review-bridge");
section.setAttribute("aria-label","Reading-to-Writing Portfolio Review Bridge");
const title=el("h2","Portfolio Evidence Review Bridge");
const intro=el("p","Select a saved week to inspect your reading-to-writing evidence. Prepare a copy for teacher or parent educator review. Presence checks are not quality judgments or mastery.");
const controls=el("div",undefined,"khae-review-controls");
const label=el("label","Saved writing week");
label.htmlFor="khae-review-week";
const select=el("select");
select.id="khae-review-week";
const exportButton=el("button","Export review packet");
exportButton.type="button";
const printButton=el("button","Print review packet");
printButton.type="button";
const openLink=el("a","Open this week in Evidence Studio");
const status=el("p","", "khae-review-status");
status.setAttribute("role","status");
status.setAttribute("aria-live","polite");
const checklist=el("div",undefined,"khae-review-checks");
const preview=el("details",undefined,"khae-review-preview");
const previewSummary=el("summary","Review evidence content");
const previewBody=el("div",undefined,"khae-review-body");
preview.append(previewSummary,previewBody);
const instructions=el("p","Educator review is separate: inspect quotation accuracy, reasoning, authenticity, feedback, revision quality, and student reflection. Sign off only through the Academy's authorized assessment process, not this bridge.","khae-review-warning");
section.append(title,intro,controls,status,checklist,preview,instructions);
controls.append(label,select,openLink,exportButton,printButton);
anchor.insertAdjacentElement("afterend",section);
let selected=null;
let snapshot=null;
let conflictLocked=false;
function refresh(){
 if(conflictLocked)return;
 const old=Number(select.value);
 select.replaceChildren();
 const weeks=[];
 if(eligible())for(let w=1;w<=36;w++)if(read(w))weeks.push(w);
 if(!eligible()){
  const option=el("option","Select an Academy learner");
  option.value="";
  select.append(option);
  status.textContent="No verified learner selected. Private reading and writing records are not loaded.";
 }else if(!weeks.length){
  const option=el("option","No saved evidence yet");
  option.value="";
  select.append(option);
  status.textContent="Start an Evidence Studio week, then return here to prepare its review packet.";
 }else{
  for(const w of weeks){const option=el("option","Week "+String(w).padStart(2,"0"));option.value=String(w);select.append(option)}
  select.value=weeks.includes(old)?String(old):String(weeks[0]);
 }
 selected=Number(select.value)||null;
 show();
}
function show(){
 if(conflictLocked){exportButton.disabled=true;printButton.disabled=true;return}
 checklist.replaceChildren();previewBody.replaceChildren();
 if(!eligible()){snapshot=null;selected=null}
 else snapshot=selected?read(selected):null;
 exportButton.disabled=printButton.disabled=!snapshot;
 openLink.href="../evidence-studio.html"+(selected?"?week="+selected:"");
 if(!snapshot){preview.hidden=true;return}
 preview.hidden=false;
 const assessment=inspect(snapshot);
 for(const [name,present] of Object.entries(assessment.components)){
  const row=el("p",(present?"✓ ":"○ ")+({
   interpretation:"Interpretation claim",citation:"Attributed text evidence with explanation",
   firstDraft:"Original draft",feedback:"Recorded feedback",
   revision:"Substantively different revision",reflection:"Student reflection"
  }[name]||name));
  checklist.append(row);
 }
 status.textContent="Week "+String(selected).padStart(2,"0")+" · "+Object.values(assessment.components).filter(Boolean).length+"/6 preparation elements documented · "+(assessment.ready?"Ready to request an educator review.":"Continue building the missing elements.")+" This is not a passing grade.";
 for(const [name,field] of sections){
  const value=snapshot.fields[field];
  if(!nonempty(value))continue;
  const part=el("section");
  part.append(el("h3",name));
  const body=el("p",value);
  body.style.whiteSpace="pre-wrap";
  part.append(body);previewBody.append(part);
 }
}
function packet(){
 if(conflictLocked||!eligible()||!selected)return null;
 const current=read(selected);
 if(!current)return null;
 const fields={};
 for(const name of fieldNames)fields[name]=typeof current.fields[name]==="string"?current.fields[name]:"";
 return {
  schema:"khaemenes-english-portfolio-review-packet-v1",
  grade,week:selected,learnerId:profile.learnerId,
  assignedReading:String(current.assignment||""),
  evidenceUpdatedAt:String(current.updatedAt||""),
  preparedAt:new Date().toISOString(),
  evidence:fields,
  preparation:inspect(current),
  reviewStatus:"NOT REVIEWED",
  educatorApproval:false,
  academicGrade:null,
  mastery:null,
  instructions:"For authorized teacher/parent educator review only. No automatic portfolio acceptance, grade, or mastery."
 };
}
exportButton.addEventListener("click",()=>{
 const data=packet();
 if(!data){status.textContent="Review packet blocked: learner identity changed or the evidence is no longer available.";return}
 try{
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const link=el("a");link.href=url;
  link.download="english-"+grade+"-week-"+String(selected).padStart(2,"0")+"-portfolio-review.json";
  document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
  status.textContent="Review packet download requested. Confirm the file was saved before leaving; an educator must review it separately.";
 }catch(error){status.textContent="Export unavailable. Keep your evidence visible and use Evidence Studio's recovery copy."}
});
printButton.addEventListener("click",()=>{
 const data=packet();
 if(!data){status.textContent="Print blocked: the learner or saved evidence changed.";return}
 preview.open=true;
 status.textContent="Printing developmental evidence for human review; no grade or approval is issued.";
 window.print();
});
select.addEventListener("change",()=>{selected=Number(select.value)||null;show()});
window.addEventListener("storage",event=>{
 const scoped=selected?contract?.scopedKey?.(key(selected),profile):null;
 if(event.key==="khaemenes_active_learner_v1"||event.key===scoped){
  conflictLocked=true;
  select.disabled=true;
  exportButton.disabled=true;printButton.disabled=true;
  snapshot=null;selected=null;
  status.textContent="Learner or evidence changed in another tab. Reload before preparing a packet.";
 }
});
refresh();
})();

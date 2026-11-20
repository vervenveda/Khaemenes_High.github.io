/* Khaemenes Academy Student Records · connection preflight, read-only.
 * This is NOT a cloud sync, enrollment change, cross-device copy, course
 * assessment importer or transcript certificate. No persistence or uploads.
 */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const button=$("checkStudentRecords"),exportButton=$("downloadRecordInventory");
const output=$("studentRecordConnectionResults"),status=$("studentRecordConnectionStatus");
if(!button||!exportButton||!output||!status)return;
const label=(tag,content,cls)=>{const el=document.createElement(tag);el.textContent=String(content);if(cls)el.className=cls;return el};
let latest=null,run=0;
function snapshot(){
 // Each check re-reads identities and their source authorities, without ever
 // relying on the portfolio's initial learner selection.
 const contract=window.KhaemenesCourseEntryContract;
 const gradeCtx=window.KhaemenesHighProfileGradeContext;
 const pins=window.KhaemenesHighCoursePins;
 const learner=contract?.readAcademyProfile?.();
 const context=gradeCtx?.active?.();
 const active=pins?.activeLearner?.();
 if(!learner?.learnerId||!context?.learnerId||
    String(learner.learnerId)!==String(context.learnerId)||
    String(active)!==String(learner.learnerId)||
    !["09","10","11","12"].includes(String(context.grade)))
  return {ok:false,reason:"Registered learner and Grade 9–12 identity checks must agree. Select your existing Student Profile; no record was modified."};
 if(location.origin!=="https://vervenveda.com")
  return {ok:false,reason:"This copy is not on the canonical vervenveda.com origin. Browser-local records from another web origin cannot be checked here."};
 const id=String(learner.learnerId),grade=String(context.grade);
 const rows=[],issues=[];
 const add=(name,state,count,detail)=>{
  rows.push({name,state,count,detail});
  if(state==="MISSING"||state==="STALE"||state==="UNAVAILABLE")issues.push(name);
 };
 const ledger=window.KhaemenesLearningContinuation;
 if(typeof ledger?.readLearner!=="function"){
  add("Academy course continuation","UNAVAILABLE",null,"Course-record reader is not loaded; no assessments can be verified");
 }else{
  const records=ledger.readLearner(id);
  if(!Array.isArray(records))return {ok:false,reason:"Academy course-record reader returned an invalid result. No files changed."};
  const owned=records.filter(x=>x?.learnerId===id);
  const compatible=owned.filter(x=>!x.grade||String(Number(x.grade))===String(Number(grade)));
  const scored=compatible.reduce((sum,x)=>sum+(Array.isArray(x.assessments)?x.assessments.filter(a=>a&&["quiz","test"].includes(a.kind)&&
   typeof a.earned==="number"&&Number.isFinite(a.earned)&&a.earned>=0&&
   typeof a.possible==="number"&&Number.isFinite(a.possible)&&a.possible>0&&a.earned<=a.possible).length:0),0);
  const stale=compatible.filter(x=>x.stale===true).length;
  add("Academy course continuation",compatible.length?stale?"STALE":"FOUND":"MISSING",compatible.length,
    scored+" scored quiz/test record(s); "+stale+" stale course snapshot(s). Source-owned grades were not reassigned");
 }
 // Pin APIs can mirror preferences on a read. Inventory reads raw
 // learner-scoped bytes instead and never invokes a mutation-capable reader.
 const storage=window.localStorage;
 const readKey=key=>{try{return storage.getItem(key)}catch{return null}};
 const enc=encodeURIComponent(id);
 let highPins=null,academyPins=[];
 try{
  const a=JSON.parse(readKey("khaemenes-high-pinned-courses-v2:learner:"+enc)||"null");
  if(Array.isArray(a))highPins=a.filter(x=>typeof x==="string");
 }catch{}
 try{
  const all=JSON.parse(readKey("khaemenes_course_pins_v1")||"null");
  const a=all?.learners?.[id];
  if(Array.isArray(a))academyPins=a.map(x=>typeof x==="string"?x:x?.id||x?.courseId).filter(x=>typeof x==="string");
 }catch{}
 const distinct=[...new Set([...(highPins||[]),...academyPins])];
 add("Pinned classes",highPins!==null||academyPins.length?"FOUND":"MISSING",
   distinct.length,"Existing learner-scoped Academy/High School shortcuts; not enrollment or mastery");
 let langs=null;
 try{langs=JSON.parse(readKey("khaemenes-high-language-choices-v1:learner:"+enc)||"null")}catch{}
 const selected=langs?.[String(Number(grade))];
 add("Foreign-language selection",typeof selected==="string"&&selected?"FOUND":"MISSING",
  selected?1:0,selected?"Language choice recorded for registered grade":"No language preference recorded on this browser");
 const portfolioKey="khae-learning-portfolio-v1:learner:"+encodeURIComponent(id);
 let entries=null;
 try{const data=JSON.parse(readKey(portfolioKey)||"null");if(Array.isArray(data))entries=data.filter(x=>x&&typeof x.title==="string"&&typeof x.detail==="string").length;}catch{}
 add("Student Portfolio",entries===null?"MISSING":"FOUND",entries,
   entries===null?"No readable learner-scoped portfolio record found":"Private student-created evidence entries (not course grades)");
 const dailyKey="khaemenes-grade09-daily-parent-report-v1:"+encodeURIComponent(id);
 if(grade==="09"){
  let daily=null;
  try{daily=JSON.parse(readKey(dailyKey)||"null")}catch{}
  const dated=daily?.learnerId===id&&daily.reports&&typeof daily.reports==="object"?Object.keys(daily.reports).filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)).length:0;
  add("Daily parent reports",dated?"FOUND":"MISSING",dated,"Grade 9 dated family reports on this browser");
 }
 const keyPrefix="khaemenes.course:"+id+":";
 let courseKeys=0,unattributed=0;
 try{
  for(let i=0;i<storage.length;i++){
   const key=storage.key(i);
   if(typeof key!=="string")continue;
   if(key.startsWith(keyPrefix))courseKeys++;
   // Count only; never import, read, or attribute unscoped records.
   else if(/^khaemenes\.course:/.test(key)&&!key.includes(":learner:"))unattributed++;
  }
 }catch{add("Course-owned local storage","UNAVAILABLE",null,"Browser denied key enumeration");}
 if(!rows.some(x=>x.name==="Course-owned local storage"))add("Course-owned local storage",courseKeys?"FOUND":"MISSING",courseKeys,
  "Learner-tagged course evidence keys; "+unattributed+" other/unattributed key(s) withheld from this audit");
 // No transfer is made from independent course storage to scored reports.
 add("Verified Account Cloud synchronization","UNAVAILABLE",null,
 "T03 not commissioned; this browser cannot read or write a verified server record");
 return {ok:true,grade,origin:location.origin,items:rows,
  summary:{sourcesChecked:rows.length,needAttention:issues.length,sourceOnly:true,cloudSynced:false,
   mutationCount:0,unattributedKeysNeverImported:true},
  notice:"Local, read-only inventory. No identifiable learner information, scores, work or answers included."};
}
function paint(){
 ++run;latest=null;output.replaceChildren();
 let data;
 try{data=snapshot()}catch{
  status.textContent="Check #"+run+": Could not inspect this browser's selected learner. No student records were changed.";
  exportButton.disabled=true;return;
 }
 if(!data.ok){status.textContent="Check #"+run+": "+data.reason;exportButton.disabled=true;return;}
 latest=data;exportButton.disabled=false;
 status.textContent="Check #"+run+": "+data.summary.sourcesChecked+" record categories checked · "+
  data.summary.needAttention+" need attention. No records were copied, uploaded, rewritten, or removed.";
 for(const item of data.items){
  const card=label("article","","portfolio-report-course");
  card.append(label("h3",item.name),label("p",item.state+" · "+(item.count===null?"Not verified":item.count+" item(s)"),"portfolio-report-note"),
   label("p",item.detail,"portfolio-report-note"));
  output.append(card);
 }
}
function download(){
 // Re-check the active learner at the actual user gesture before exporting.
 let current;
 try{current=snapshot()}catch{return}
 if(!latest?.ok||!current?.ok||latest.grade!==current.grade)return;
 const payload={schema:"khaemenes-record-connection-inventory-v1",
  generatedAt:new Date().toISOString(),grade:current.grade,
  summary:current.summary,items:current.items.map(x=>({...x})),notice:current.notice};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="khaemenes-record-connection-inventory-grade-"+current.grade+".json";
 document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
button.addEventListener("click",paint);
exportButton.addEventListener("click",download);
window.addEventListener("pageshow",()=>{if(latest)paint()});
window.KhaemenesStudentRecordConnections=Object.freeze({check:paint,version:"1.0.0",writesStudentRecords:false,syncsCloud:false});
})();

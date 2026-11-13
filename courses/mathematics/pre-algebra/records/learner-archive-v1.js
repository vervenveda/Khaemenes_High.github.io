/* Khaemenes Academy learner-owned, browser-local archive v1.
 * ZIP STORE format (no third-party scripts). Export only. No import, score mutation or credential access.
 * Historical unscoped grade records are NOT assigned to any learner. */
(()=>{"use strict";
const COURSE="KHAE_OPEN_PREALGEBRA_FORGE_V2", BIND="khaemenes-prealgebra-family-course-binding-v1:",EVIDENCE="khaemenes-prealgebra-activity-v1:",VERSION="khaemenes-learner-archive-v1";
const $=id=>document.getElementById(id), esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const status=message=>{$("archiveStatus").textContent=message};
const params=new URLSearchParams(location.search),isParent=params.get("mode")==="parent";
const R=window.KhaemenesFamilyRegistry;
const active=R?.activeIds?.()||{}, familyId=params.get("learnerId")||active.learnerId||"";
let familyLearner=null,adult=null,authorized=!isParent;
if(familyId&&R?.getLearner){familyLearner=R.getLearner(familyId)||null;}
if(isParent){
 adult=R?.getAdult?.(active.adultId)||null;
 authorized=!!(adult&&familyLearner&&familyLearner.familyId&&R?.canAdult?.(adult.adultId,familyId,"progress.view"));
}
const root=read(COURSE),allStudents=Array.isArray(root?.students)?root.students.filter(s=>s&&typeof s.id==="string"&&s.id&&s.progress&&typeof s.progress==="object"):[];
const currentBinding=familyId?read(BIND+familyId):null;
const students=!authorized?[]:isParent?allStudents:familyLearner?(currentBinding?.courseLearnerId?allStudents.filter(s=>s.id===currentBinding.courseLearnerId):[]):allStudents;
const select=$("archiveLearner");
function savedBinding(){return familyId?read(BIND+familyId):null}
function entitled(s){
 if(!s||!authorized)return false;
 if(!isParent)return !familyLearner||(savedBinding()?.familyLearnerId===familyId&&savedBinding()?.courseLearnerId===s.id);
 const binding=savedBinding();
 return binding?.familyLearnerId===familyId&&binding?.courseLearnerId===s.id;
}
function selected(){return students.find(s=>s.id===select.value)||null}
function refreshIdentity(){
 const s=selected(), bound=entitled(s);
 if(isParent&&!authorized){
  $("archiveIdentity").textContent="Parent export unavailable: choose an authorized family adult and learner in the Family Portal. No records have been exposed.";
 }else if(isParent&&!bound){
  $("archiveIdentity").innerHTML="The selected family learner and Pre-Algebra student record are not linked on this browser. To avoid exporting another student's information, establish an explicit local association below. This is not an independently verified identity.";
 }else{
  $("archiveIdentity").textContent=(familyLearner?"Family profile: "+(familyLearner.nickname||"Learner")+". ":"")+"Course record: "+(s?.name||"None")+". Historic unscoped grades are excluded.";
 }
 $("downloadArchive").disabled=!s||!bound;
 $("printArchive").disabled=!s||!bound;
 const old=$("bindLocalLearner");
 if(old)old.remove();
 if(isParent&&authorized&&s&&!bound){
  const b=document.createElement("button");b.id="bindLocalLearner";b.type="button";b.textContent="Associate selected course learner with family profile (local only)";
  b.addEventListener("click",()=>{
   if(!confirm("Confirm this Pre-Algebra course record belongs to "+(familyLearner.nickname||"the selected learner")+". This is a local association only; it is not verified account ownership or a transfer of grades."))return;
   try{localStorage.setItem(BIND+familyId,JSON.stringify({familyLearnerId:familyId,courseLearnerId:s.id,associatedAt:new Date().toISOString(),status:"parent-asserted-local-only"}));refreshIdentity()}catch{status("Could not save the local learner association.")}
  });
  $("archiveIdentity").after(b);
 }
 if(bound&&s)$("archiveReport").innerHTML=reportHTML(s);
 else $("archiveReport").innerHTML="<h2>Report preview</h2><p>No report is available until learner selection and authorization are complete.</p>";
}
if(!students.length)status(!authorized?"Parent access not authorized on this browser.":familyLearner&&!isParent?"Your family learner is not yet linked to a course record. An authorized family adult can link it from the Parent Portal.":"No Pre-Algebra student record exists in this browser. Open the course dashboard first.");
students.forEach(s=>{const o=document.createElement("option");o.value=s.id;o.textContent=s.name||"Unnamed course learner";select.appendChild(o)});
const binding=savedBinding(),preferred=isParent?binding?.courseLearnerId:root?.activeId;
if(preferred&&students.some(s=>s.id===preferred))select.value=preferred;
select.addEventListener("change",refreshIdentity);refreshIdentity();

function unitCounts(progress){
 const weeks=progress?.weeks&&typeof progress.weeks==="object"?Object.values(progress.weeks):[];
 return {weeksRecorded:weeks.length,lessonChecks:weeks.reduce((n,w)=>n+Object.values(w?.lessons||{}).filter(Boolean).length,0),assignments:weeks.reduce((n,w)=>n+(Object.values(w?.assignments||{}).filter(Boolean).length),0),quizAttempts:weeks.reduce((n,w)=>n+(Array.isArray(w?.quiz?.attempts)?w.quiz.attempts.length:0),0)};
}
function activitiesFor(id){
 const record=read(EVIDENCE+id);
 if(!record||record.courseLearnerId!==id||!Array.isArray(record.events))return [];
 return record.events.filter(e=>e&&e.courseLearnerId===id&&["game_opened","video_opened","game_completed","video_completed"].includes(e.kind)).slice(-5000);
}
function scopedExtra(id){
 const records={};
 const prefix="khaemenes-prealgebra-lesson-draft-v2:"+id+":";
 for(let i=0;i<localStorage.length;i++){
  const k=localStorage.key(i);
  if(k&&k.startsWith(prefix)){const v=read(k);if(v?.learner===id)records[k]=v;}
 }
 return records;
}
function withheld(){
 let count=0;
 for(let i=0;i<localStorage.length;i++){
  const k=localStorage.key(i)||"";
  if(/^khaemenes-prealgebra-u\d{2}-mastery-v\d+/.test(k)||/^khaemenes-prealgebra-unit\d{2}-progress-v\d+/.test(k)||/prealgebra-(midterm|final)-result/.test(k))count++;
 }
 return {unassignedLocalRecordCount:count,reason:"These legacy records lack verified learner ownership and are deliberately excluded. No grade/achievement is inferred. Future authorized reconciliation is required."};
}
function snapshot(s){
 const activity=activitiesFor(s.id),drafts=scopedExtra(s.id);
 const evidence=unitCounts(s.progress);
 return {schema:VERSION,generatedAt:new Date().toISOString(),scope:{course:"KH-MATH-PA",courseStudentId:s.id,courseStudentName:s.name,requestedBy:isParent?"authorized-browser-local-family-adult":"student-or-course-browser",familyLearnerId:familyId||null,association:familyId?(savedBinding()?.status||"unlinked"):"course-only",authoritative:false},courseLearner:{id:s.id,name:s.name,created:s.created||null,progress:s.progress},summary:evidence,activities:activity,learnerScopedDrafts:drafts,unattributed:withheld()};
}
function n(v){return Number.isFinite(Number(v))?Number(v):0}
function reportHTML(s){
 const summary=unitCounts(s.progress),weeks=Object.entries(s.progress?.weeks||{}).sort((a,b)=>Number(a[0])-Number(b[0]));
 const rows=weeks.map(([w,v])=>{const q=v?.quiz||{},a=Array.isArray(q.attempts)?q.attempts:[];return "<tr><td>"+esc(w)+"</td><td>"+esc(Object.values(v?.lessons||{}).filter(Boolean).length)+"</td><td>"+esc(Object.values(v?.assignments||{}).filter(Boolean).length)+"</td><td>"+esc(q.best??"Not recorded")+"</td><td>"+esc(a.length)+"</td></tr>"}).join("");
 const activity=activitiesFor(s.id);const activityRows=activity.map(e=>"<tr><td>"+esc(e.at)+"</td><td>"+esc(e.kind.replaceAll("_"," "))+"</td><td>"+esc(e.title||e.resource||"Resource")+"</td><td>"+esc(e.status||"Opened only")+"</td></tr>").join("");
 return '<h2>Student Learning Report</h2><p><strong>Student:</strong> '+esc(s.name)+' · <strong>Course:</strong> Pre-Algebra · <strong>Generated:</strong> '+esc(new Date().toLocaleString())+'</p><p><strong>Weekly records:</strong> '+summary.weeksRecorded+' · <strong>Lesson checks:</strong> '+summary.lessonChecks+' · <strong>Recorded assignments:</strong> '+summary.assignments+' · <strong>Quiz attempts:</strong> '+summary.quizAttempts+'</p><h2>Lessons &amp; Quizzes</h2><table style="width:100%;border-collapse:collapse" border="1" cellpadding="7"><thead><tr><th>Week</th><th>Lessons checked</th><th>Assignments</th><th>Quiz best %</th><th>Attempts</th></tr></thead><tbody>'+rows+'</tbody></table><h2>Games &amp; Videos</h2><table style="width:100%;border-collapse:collapse" border="1" cellpadding="7"><tr><th>When</th><th>Event</th><th>Resource</th><th>Evidence</th></tr>'+activityRows+'</table><p><em>Opening a resource does not prove viewing, play completion, learning or mastery. Evidence absent from this browser is marked not recorded, not zero.</em></p><h2>Exams &amp; Capstone</h2><pre style="white-space:pre-wrap;overflow-wrap:anywhere">'+esc(JSON.stringify({exams:s.progress?.exams||{},capstone:s.progress?.capstone||{}},null,2))+'</pre><p><strong>Provenance:</strong> Browser-local, learner-selected course data; historical unscoped unit scores intentionally omitted. This printout is not an official transcript or authenticated T03 receipt.</p>';
}
function u16(a,n){a.push(n&255,(n>>>8)&255)}function u32(a,n){u16(a,n);u16(a,n>>>16)}
const utf=new TextEncoder();const crcTable=Array.from({length:256},(_,i)=>{let c=i;for(let j=0;j<8;j++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0});
function crc32(buf){let c=0xffffffff;for(const b of buf)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0}
function zip(entries){
 const parts=[],central=[];let position=0;
 function append(a){const v=Uint8Array.from(a);parts.push(v);position+=v.length}
 for(const [name,value] of entries){
  const filename=utf.encode(name),data=typeof value==="string"?utf.encode(value):value;
  if(filename.length>65535||data.length>25000000)throw Error("Archive entry too large");
  const offset=position,crc=crc32(data),h=[];
  u32(h,0x04034b50);u16(h,20);u16(h,0x0800);u16(h,0);u16(h,0);u16(h,0);u32(h,crc);u32(h,data.length);u32(h,data.length);u16(h,filename.length);u16(h,0);append(h);append(filename);append(data);
  const c=[];u32(c,0x02014b50);u16(c,20);u16(c,20);u16(c,0x0800);u16(c,0);u16(c,0);u16(c,0);u32(c,crc);u32(c,data.length);u32(c,data.length);u16(c,filename.length);u16(c,0);u16(c,0);u16(c,0);u16(c,0);u32(c,0);u32(c,offset);central.push(Uint8Array.from(c),filename);
 }
 const offset=position;for(const c of central)append(c);
 const end=[];u32(end,0x06054b50);u16(end,0);u16(end,0);u16(end,entries.length);u16(end,entries.length);u32(end,position-offset);u32(end,offset);u16(end,0);append(end);
 if(position>35000000)throw Error("Archive exceeds browser-local safety limit");
 return new Blob(parts,{type:"application/zip"});
}
async function digest(text){if(!crypto?.subtle)return null;const b=await crypto.subtle.digest("SHA-256",utf.encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
async function download(){
 const s=selected();if(!entitled(s))return;
 status("Preparing ZIP locally. No data is uploaded.");$("downloadArchive").disabled=true;
 try{
  const data=snapshot(s),report='<!doctype html><html><head><meta charset="utf-8"><title>Khaemenes Academy Student Report</title><style>body{font:16px/1.6 Arial;color:#252a27;margin:40px}h1,h2{font-family:Georgia;font-weight:400}h1{text-align:center;font-size:33px}th{background:#f3ead8}td,th{padding:8px}table{border-collapse:collapse}table td,table th{border:1px solid #777}@media print{@page{margin:0.65in}}</style></head><body><h1>Khaemenes Academy</h1><p style="text-align:center">Verve N Veda · Student Learning Report</p>'+reportHTML(s)+'</body></html>';
  const files=[["progress.json",JSON.stringify(data,null,2)],["report.html",report],["activity-evidence.json",JSON.stringify(data.activities,null,2)],["unattributed-record-notice.json",JSON.stringify(data.unattributed,null,2)],["README.txt","Khaemenes Academy - Pre-Algebra Student Archive\nSchema: "+VERSION+"\nThis ZIP contains one learner-selected course record, locally scoped drafts and activity evidence. Unscoped legacy scores are NOT attributed. No files in this archive certify identity or mastery. Future T03 restore must authenticate the learner, validate integrity and reconcile records without overwriting prior achievements.\n"]];
  const integrity={};for(const [name,content] of files)integrity[name]={bytes:utf.encode(content).length,sha256:await digest(content)};
  const manifest={schema:VERSION,createdAt:data.generatedAt,course:"KH-MATH-PA",learnerId:s.id,filenameList:files.map(x=>x[0]),integrity,encrypted:false,verifiedIdentity:false,importAuthority:"none",importReady:false};
  files.push(["manifest.json",JSON.stringify(manifest,null,2)]);
  const blob=zip(files),url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="Khaemenes_PreAlgebra_"+String(s.name||"Learner").replace(/[^a-z0-9_-]/gi,"_").slice(0,36)+"_"+new Date().toISOString().slice(0,10)+".zip";document.body.appendChild(link);link.click();setTimeout(()=>{URL.revokeObjectURL(url);link.remove()},10000);
  status("Your student ZIP was prepared. Keep it somewhere private and verify the file appears in Downloads.");
 }catch(e){console.error(e);status("Archive could not be created: "+String(e.message||e))}
 finally{$("downloadArchive").disabled=!entitled(selected())}
}
$("downloadArchive").addEventListener("click",download);
$("printArchive").addEventListener("click",()=>{const s=selected();if(!entitled(s))return;window.print()});
})();
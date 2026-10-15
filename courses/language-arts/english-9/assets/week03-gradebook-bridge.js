/* English 9 · educator-managed local review bridge.
   GitHub Pages cannot authorize educators; all actions are local and require human input. */
(function(){
"use strict";
const $=id=>document.getElementById(id), A=window.KhaemenesEnglish9Week03Review;
if(!A)return;
const source=$("w3-review");if(!source)return;
const profile=window.KhaemenesEnglish9Records?.profile||null;
const receiptKey=profile?window.KhaemenesEnglish9Records.storageKey(A.keyPrefix("week-03-day15-review-receipt-v1")):null;
const fieldKeys=["draft1","final","conventions","revision"];
const status=$("w3-review-status");
let submission=null,review=null,fromFile=false,sourceSnapshot=null,frozen=false;
function announce(t,error=false){status.textContent=t;status.classList.toggle("review-error",error)}
function readReceipt(){
 if(!receiptKey)return null;
 const raw=localStorage.getItem(receiptKey);sourceSnapshot=raw;
 return raw?JSON.parse(raw):null;
}
function collectLocal(){
 try{
  if(!profile){announce("Choose an Academy learner first, or import their Day 15 backup file.",true);return;}
  const raw=readReceipt();
  if(!A.validateSubmission(raw)){announce("No complete Day 15 submission exists for this learner on this browser. Import a student backup if reviewing another device.",true);return;}
  submission=raw;fromFile=false;
  const data={};
  for(const x of fieldKeys)data[x]=localStorage.getItem(window.KhaemenesEnglish9Records.storageKey(A.keyPrefix("week-03-day15-"+x)))||"";
  showEvidence(data);
  review=A.validateReview(raw)?raw:null;
  if(review)populateReview(review);
  announce("Loaded submitted evidence for learner "+profile.name+". Review the writing before scoring.");
 }catch{frozen=true;announce("Saved assessment data could not be read. No records were overwritten.",true)}
}
function showEvidence(responses){
 $("w3-evidence").hidden=false;
 $("w3-student").textContent="Learner record: "+submission.learnerId+" · Submitted "+new Date(submission.submittedAt).toLocaleString();
 for(const x of fieldKeys)$("w3-evidence-"+x).value=String(responses[x]||"");
 $("w3-review-evidence-note").textContent=
 "Draft "+submission.independentDraftWordCount+" words · Final "+submission.finalWordCount+
 " words · "+submission.conventionsEntered+" conventions corrections. Confirm the original text and final revision before grading.";
}
function populateReview(v){
 if(!A.validateReview(v))return;
 for(const [id] of A.labels)$("w3-row-"+id).value=String(v.rubricRows[id]);
 $("w3-evaluator").value=v.evaluatedBy;
 $("w3-feedback").value=v.teacherFeedback;
 updateScore();
}
function updateScore(){
 const rows={};for(const [id] of A.labels){const v=$("w3-row-"+id).value;rows[id]=v===""?null:Number(v);}
 const score=A.scoreRows(rows);
 $("w3-score").textContent=score===null?"Choose five scores":score+"/10 · "+(score>=8?"Mastery threshold reached":"Corrective revision required");
 return rows;
}
function make(){
 if(!submission)throw Error("Load a valid learner submission first.");
 const rows=updateScore();
 return A.makeReview(submission,rows,$("w3-evaluator").value,$("w3-feedback").value);
}
function writeSameDevice(value){
 if(fromFile||!receiptKey)throw Error("Imported work is not automatically synchronized. Download the review JSON for the learner.");
 if(frozen)throw Error("Local editing is paused because saved data is inconsistent.");
 if(localStorage.getItem("khaemenes_active_learner_v1")!==JSON.stringify(profile.learnerId))throw Error("Selected Academy learner has changed. Reopen this page.");
 if(localStorage.getItem(receiptKey)!==sourceSnapshot)throw Error("Another tab updated the review. Reload instead of overwriting.");
 const newData=JSON.stringify(value);
 localStorage.setItem(receiptKey,newData);
 sourceSnapshot=newData;
 review=value;
}
function syncPrintableGradebook(record){
 const score=document.querySelector('[data-save-field="grade-score-1"]');
 const date=document.querySelector('[data-save-field="grade-date-1"]');
 const note=document.querySelector('[data-save-field="grade-notes-1"]');
 if(!score||!date||!note)return;
 const proposed=record.rubricScore+"/10";
 if(score.value.trim()&&score.value.trim()!==proposed &&
    !confirm("Unit 01 already has a different recorded grade. Replace that grade with the new educator review?"))return;
 score.value=proposed;score.dispatchEvent(new Event("input",{bubbles:true}));
 date.value=record.evaluatedAt.slice(0,10);date.dispatchEvent(new Event("input",{bubbles:true}));
 note.value=record.gradeStatus==="passed"?"Day 15 rubric: "+proposed+" · "+record.evaluatedBy:
  "Day 15 rubric: "+proposed+" · corrective revision required · "+record.evaluatedBy;
 note.dispatchEvent(new Event("input",{bubbles:true}));
}
function download(name,payload){
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),link=document.createElement("a");
 link.href=url;link.download=name;document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function importEvidence(event){
 const file=event.target.files?.[0];event.target.value="";
 if(!file)return;
 try{
  if(file.size>2*1024*1024)throw Error("Backup file is too large for this short assessment.");
  const payload=JSON.parse(await file.text());
  if(payload.schema!=="english9-week03-day15-backup-v1"||
     !A.validateSubmission(payload.reviewReceipt)||
     !payload.responses||typeof payload.responses!=="object")throw Error("Incorrect or incomplete Day 15 backup.");
  const fields={};for(const x of fieldKeys)fields[x]=payload.responses["week-03-day15-"+x]||"";
  if(fields.draft1.trim().split(/\s+/).filter(Boolean).length!==payload.reviewReceipt.independentDraftWordCount ||
     fields.final.trim().split(/\s+/).filter(Boolean).length!==payload.reviewReceipt.finalWordCount)
     throw Error("Backup writing does not match recorded word counts.");
  submission=payload.reviewReceipt;fromFile=true;review=null;showEvidence(fields);
  $("w3-feedback").value="";for(const [id] of A.labels)$("w3-row-"+id).value="";
  $("w3-score").textContent="Choose five scores";
  announce("Imported evidence for offline educator review. Download the evaluation file to return to the learner; this import does not modify their device.");
 }catch(e){announce("Import not accepted: "+e.message,true)}
}
$("w3-load-local").addEventListener("click",collectLocal);
$("w3-import-evidence").addEventListener("change",importEvidence);
for(const [id] of A.labels)$("w3-row-"+id).addEventListener("change",updateScore);
$("w3-save-review").addEventListener("click",()=>{
 try{
  const result=make();
  if(fromFile){announce("This evidence came from another device. Use Download Evaluation JSON, then import it into the learner's Day 15 page.");return;}
  if(review&&!confirm("A previous review exists. Record a replacement evaluation for this same submission?"))return;
  writeSameDevice(result);
  syncPrintableGradebook(result);
  announce("Local review recorded: "+result.rubricScore+"/10. "+(result.masteryAwarded?
   "The learner's Day 15 continue button can now appear on this same browser.":
   "Corrective revision is required before progressing.")+" Export a copy for safekeeping.");
 }catch(e){announce("Review not recorded: "+e.message,true)}
});
$("w3-export-review").addEventListener("click",()=>{
 try{const result=make();download("english9-week03-day15-evaluation.json",{
   schema:A.exportSchema,exportedAt:new Date().toISOString(),review:result});
  announce("Evaluation JSON downloaded. It can be imported by the learner on the Day 15 page.");
 }catch(e){announce("Cannot export: "+e.message,true)}
});
$("w3-refresh-score").addEventListener("click",()=>{
 try{
  if(!profile)throw Error("Select an Academy learner before updating this gradebook.");
  const value=readReceipt();
  if(!A.validateReview(value))throw Error("A completed rubric review has not yet been recorded on this device.");
  syncPrintableGradebook(value);announce("Gradebook synchronized with the existing local Day 15 rubric review.");
 }catch(e){announce("Not synchronized: "+e.message,true)}
});
if(profile){try{const x=readReceipt();if(A.validateReview(x)){
 review=x;$("w3-review-summary").textContent="Recorded Day 15 review: "+x.rubricScore+"/10 · "+x.gradeStatus+" · "+x.evaluatedBy;
 }else if(A.validateSubmission(x))$("w3-review-summary").textContent="A Day 15 submission is awaiting human review for "+profile.name;
 }catch{announce("Assessment data requires recovery. Existing data has not been changed.",true)}}
else $("w3-review-summary").textContent="Select your Academy learner or import an assessment backup.";
})();

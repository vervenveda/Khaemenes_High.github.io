/* English 9 Week 11 · independent sound/form assessment; local human-entered reviews.
   Browser-local fingerprints detect changed text, not educator identity or cryptographic trust. */
(function(){
"use strict";
if(document.body.getAttribute("data-english9-week11-day")!=="55")return;
const W=window.KhaemenesEnglish9Week11,$=id=>document.getElementById(id);
if(!W)return;
const {profile,ready,scoped,read,write,load,writing,hash,validReview,validSubmission,halt,say}=W;
const saved=Object.fromEntries(writing.map(e=>[e.dataset.saveField,e]));
const suffix={analysis:"analysis",form:"form",rule:"rule",draft:"draft",final:"final",lengthNote:"length-note",
 craft:"craft",revision:"revision",reflection:"reflection",annotation1:"annotation-1",
 annotation2:"annotation-2",annotation3:"annotation-3",annotation4:"annotation-4"};
const field=Object.fromEntries(Object.entries(suffix).map(([k,v])=>[k,saved["week-11-day55-"+v]]));
if(Object.values(field).some(x=>!x)){halt("The original portfolio fields could not be loaded");return;}
const wc=t=>String(t||"").trim().split(/\s+/).filter(Boolean).length,
 lines=t=>String(t||"").split(/\r?\n/).filter(x=>x.trim()).length,
 isObj=x=>!!x&&typeof x==="object"&&!Array.isArray(x),
 inRange=(n,a,b)=>n>=a&&n<=b,forms=["quatrains","blankverse","volta","refrain"];
const lockKey=scoped("khae-ela9-field:week-11-day55-draft-lock-v1"),
 subKey=scoped("khae-ela9-field:week-11-day55-submission-v1"),
 reviewKey=scoped("khae-ela9-field:week-11-day55-review-v1");
const validLock=x=>isObj(x)&&x.version===1&&typeof x.text==="string"&&lines(x.text)>=1&&
 x.fingerprint===hash(x.text)&&typeof x.at==="string"&&!Number.isNaN(Date.parse(x.at));
let locked=lockKey?load(lockKey,null,validLock):null;
let submission=subKey?load(subKey,null,validSubmission):null;
let review=reviewKey?load(reviewKey,null,isObj):null;
const rubricKeys=["claim","evidence","poem","annotations","craft"];
function hasAnnotation(s){
 const v=String(s||"").toLowerCase();
 const tags=["line or quotation:","feature or decision:","effect on the reader:"];
 if(!tags.every(k=>v.includes(k)))return false;
 return tags.every((tag,i)=>{
  const part=v.split(tag)[1].split(tags[i+1]||"\n")[0].trim();
  return part.length>=10;
 })&&wc(v)>=18;
}
function materials(){return Object.fromEntries(Object.entries(field).map(([k,e])=>[k,e.value]));}
function consistent(){
 if(!validSubmission(submission)||submission.learnerId!==profile?.learnerId||
 !locked||hash(locked.text)!==submission.hashes.draft)return false;
 const now=materials();
 return Object.entries(submission.hashes).every(([k,v])=>hash(now[k]||"")===v);
}
const approved=()=>consistent()&&validReview(review,submission);
function criteriaScore(){
 const rows={};rubricKeys.forEach(k=>{const v=$("week11-rubric-"+k).value;rows[k]=v===""?null:Number(v);});
 const complete=rubricKeys.every(k=>Number.isInteger(rows[k])&&rows[k]>=0&&rows[k]<=2);
 return {rows,total:complete?rubricKeys.reduce((n,k)=>n+rows[k],0):null};
}
function scoreDisplay(){
 const {total}=criteriaScore();
 $("week11-review-total").textContent=total===null?"Select all five criteria (0–2).":
 total+"/10 · "+(total>=8?"Mastery threshold met":"Corrective revision required");
}
function acceptableLength(){
 const length=lines(field.final.value);
 return inRange(length,12,24)||(length>=4&&wc(field.lengthNote.value)>=15);
}
function readyToSubmit(){
 const annotated=[1,2,3,4].every(i=>hasAnnotation(field["annotation"+i].value));
 return ready&&!W.frozen&&!!locked&&
 inRange(wc(field.analysis.value),350,500)&&
 forms.includes(field.form.value)&&wc(field.rule.value)>=8&&
 acceptableLength()&&annotated&&inRange(wc(field.craft.value),160,220)&&
 wc(field.revision.value)>=12&&wc(field.reflection.value)>=12&&
 $("week11-independent").checked&&$("week11-revision-confirm").checked;
}
function sync(){
 $("week11-analysis-count").textContent=wc(field.analysis.value)+" words · 350–500 required";
 $("week11-draft-lines").textContent=lines(field.draft.value)+" nonblank lines · original preserved separately";
 $("week11-final-lines").textContent=lines(field.final.value)+" nonblank lines · normally 12–24, or documented form exception";
 $("week11-craft-count").textContent=wc(field.craft.value)+" words · 160–220 required";
 const n=[1,2,3,4].filter(i=>hasAnnotation(field["annotation"+i].value)).length;
 $("week11-annotations-count").textContent=n+" of 4 source-specific structure annotations prepared";
 const pass=approved()&&review.passed;
 $("week11-next-wrap").hidden=!pass;
 if(pass)$("week11-next-score").textContent="Human-entered mastery · "+review.score+"/10 for this exact submission.";
 $("week11-submit").disabled=!readyToSubmit()||pass;
 $("week11-record-review").disabled=!ready||W.frozen||!consistent();
 $("week11-submission-status").textContent=!submission?"Independent portfolio not submitted.":
 consistent()?"Portfolio submitted "+new Date(submission.submittedAt).toLocaleString()+"; rubric review is tracked separately.":
 "The current poem or analysis differs from the submitted record. Submit a revised portfolio for a new review.";
 $("week11-review-status").textContent=approved()?
 "Local educator review: "+review.score+"/10 · "+review.evaluator+"\nFeedback: "+review.feedback:
 "No matching completed review for this version. Submission or self-scoring alone never unlocks Week 12.";
}
function lockView(){
 if(locked){
  if(field.draft.value!==locked.text)halt("The original poem differs from its preserved lock record.");
  field.draft.value=locked.text;field.draft.readOnly=true;
  $("week11-lock-draft").disabled=true;
  $("week11-lock-status").textContent="Draft 1 preserved "+new Date(locked.at).toLocaleString()+".";
 }else{
  $("week11-lock-draft").disabled=!ready||W.frozen;
  $("week11-lock-status").textContent="Original poem Draft 1 not locked.";
 }
 field.final.readOnly=!ready||W.frozen||!locked;
}
if(!forms.includes(field.form.value)){
 field.form.value="quatrains";
 if(ready&&!W.frozen)write(scoped("khae-ela9-field:week-11-day55-form"),field.form.value);
}
field.form.addEventListener("change",()=>field.form.dispatchEvent(new Event("input",{bubbles:true})));
$("week11-import-day54").addEventListener("click",()=>{
 if(!ready||W.frozen||locked)return;
 const refs={draft:"week-11-day54-poem-draft",rule:"week-11-day54-rule",form:"week-11-day54-form"};
 const from={};
 for(const [k,suffix] of Object.entries(refs)){
  const key=scoped("khae-ela9-field:"+suffix);
  from[k]=key?read(key)||"":"";
 }
 if(lines(from.draft)<4||wc(from.rule)<4){
  $("week11-lock-status").textContent="A completed Day 54 draft and meaningful form rule are needed before importing.";return;
 }
 if(field.draft.value.trim()&&!confirm("Replace the unlocked portfolio poem with the saved Day 54 original?"))return;
 field.draft.value=from.draft;
 field.rule.value=from.rule;
 if(forms.includes(from.form))field.form.value=from.form;
 for(const k of ["draft","rule","form"])field[k].dispatchEvent(new Event("input",{bubbles:true}));
 $("week11-lock-status").textContent="Day 54 original imported without changing its source. Review and lock Draft 1.";
 sync();
});
$("week11-lock-draft").addEventListener("click",()=>{
 if(!ready||W.frozen||locked)return;
 if(lines(field.draft.value)<4){$("week11-lock-status").textContent="Finish the original poem before locking.";return;}
 const x={version:1,text:field.draft.value,fingerprint:hash(field.draft.value),at:new Date().toISOString()};
 if(write(lockKey,JSON.stringify(x))){locked=x;lockView();sync();}
});
Object.values(field).forEach(e=>e.addEventListener("input",sync));
["week11-independent","week11-revision-confirm"].forEach(id=>$(id).addEventListener("change",sync));
rubricKeys.forEach(id=>$("week11-rubric-"+id).addEventListener("change",()=>{scoreDisplay();sync();}));
$("week11-submit").addEventListener("click",()=>{
 if(!readyToSubmit())return;
 const content=materials(),next={schema:"english9-week11-day55-submission-v1",
  learnerId:profile.learnerId,day:55,submittedAt:new Date().toISOString(),
  analysisWords:wc(field.analysis.value),craftWords:wc(field.craft.value),
  draftLines:lines(field.draft.value),finalLines:lines(field.final.value),
  annotationsComplete:4,form:field.form.value,
  hashes:Object.fromEntries(Object.entries(content).map(([k,v])=>[k,hash(v)])),
  fingerprint:hash(Object.values(content).join("|"))};
 if(!write(subKey,JSON.stringify(next)))return;
 submission=next;
 const progress={...W.progress,[W.flag(55)]:true};
 if(write(W.progressKey,JSON.stringify(progress)))W.progress[W.flag(55)]=true;
 sync();
});
$("week11-record-review").addEventListener("click",()=>{
 if(!ready||W.frozen||!consistent())return;
 const {rows,total}=criteriaScore(),name=$("week11-evaluator").value.trim(),feedback=$("week11-feedback").value.trim();
 if(total===null||name.length<2||feedback.length<10){
  $("week11-review-status").textContent="Complete all five scores, evaluator name and evidence-specific feedback.";return;
 }
 if(approved()&&!confirm("Replace the previous locally recorded review?"))return;
 const next={schema:"english9-week11-day55-review-v1",learnerId:profile.learnerId,
 submittedAt:submission.submittedAt,fingerprint:submission.fingerprint,rows,score:total,
 passed:total>=8,evaluator:name,feedback,evaluatedAt:new Date().toISOString()};
 if(!validReview(next,submission)){halt("Rubric record failed validation");return;}
 if(write(reviewKey,JSON.stringify(next))){review=next;sync();}
});
function download(name,data){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
}
$("week11-export").addEventListener("click",()=>{
 download("english9-week11-day55-backup.json",{
  schema:"english9-week11-day55-backup-v1",exportedAt:new Date().toISOString(),
  learnerId:profile?.learnerId||null,answers:Object.fromEntries(writing.map(e=>[e.dataset.saveField,e.value])),
  lockedDraft:locked,submission,review,containsUnsavedDrafts:W.frozen
 });
});
$("week11-export-review").addEventListener("click",()=>{
 if(!approved()){$("week11-review-status").textContent="A matching educator review is required first.";return;}
 download("english9-week11-day55-evaluation.json",{
  schema:"english9-week11-evaluation-v1",learnerId:profile.learnerId,
  exportedAt:new Date().toISOString(),review
 });
});
$("week11-import-review").addEventListener("change",async event=>{
 const file=event.target.files?.[0];event.target.value="";if(!file)return;
 try{
  if(!ready||W.frozen||!consistent())throw Error("Submit matching learner evidence before importing a review.");
  if(file.size>150000)throw Error("Review file exceeds accepted size.");
  const payload=JSON.parse(await file.text());
  if(payload.schema!=="english9-week11-evaluation-v1"||payload.learnerId!==profile.learnerId||
   !validReview(payload.review,submission))throw Error("This evaluator record does not match the selected learner and submitted work.");
  if(approved()&&!confirm("Replace the current local review?"))return;
  if(!write(reviewKey,JSON.stringify(payload.review)))throw Error("Review cannot be saved; another tab may have changed it.");
  review=payload.review;sync();
  $("week11-review-status").textContent="Matching review imported: "+review.score+"/10. "+
    (review.passed?"Week 12 continuation unlocked.":"Corrective revision required.");
 }catch(err){$("week11-review-status").textContent="Evaluation not imported: "+err.message;}
});
window.addEventListener("storage",e=>{
 if(e.key===subKey||e.key===reviewKey){
  $("week11-next-wrap").hidden=true;
  say("Review or submission changed in another tab. Reload to verify the newest record.",true);
 }
});
lockView();scoreDisplay();sync();
})();
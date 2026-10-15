/* English 9 Week 07 · independent craft demonstration and locally recorded educator rubric.
 * Local integrity fingerprints are NOT authentication or cryptographic signatures. */
(function(){
"use strict";
if(document.body.getAttribute("data-english9-week7-day")!=="35")return;
const W=window.KhaemenesEnglish9Week07,$=id=>document.getElementById(id);
if(!W)return;
const {profile,ready,scoped,read,write,load,writing,hash,validReview,validSubmission,halt,say}=W;
const obj=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const map=Object.fromEntries(writing.map(f=>[f.dataset.saveField,f]));
const analysis=map["week-07-day35-analysis"],draft=map["week-07-day35-scene-draft"],
 final=map["week-07-day35-scene-final"],commentary=map["week-07-day35-commentary"],
 growth=map["week-07-day35-growth"];
if(!analysis||!draft||!final||!commentary||!growth){halt("Required assessment fields were not loaded");return;}
const lockKey=scoped("khae-ela9-field:week-07-day35-scene-lock-v1"),
 submissionKey=scoped("khae-ela9-field:week-07-day35-submission-v1"),
 reviewKey=scoped("khae-ela9-field:week-07-day35-review-v1");
const ids=["character","conflict","setting","craft","language"],wc=v=>String(v||"").trim().split(/\s+/).filter(Boolean).length;
const inRange=(v,low,high)=>wc(v)>=low&&wc(v)<=high;
const validLock=x=>obj(x)&&x.version===1&&typeof x.text==="string"&&
 inRange(x.text,350,550)&&x.fingerprint===hash(x.text)&&
 typeof x.at==="string"&&!Number.isNaN(Date.parse(x.at));
let locked=lockKey?load(lockKey,null,validLock):null;
let submission=submissionKey?load(submissionKey,null,validSubmission):null;
let review=reviewKey?load(reviewKey,null,obj):null;
const fields=()=>({analysis:analysis.value,sceneDraft:draft.value,sceneFinal:final.value,
 commentary:commentary.value,growth:growth.value});
function matches(){
 if(!validSubmission(submission)||submission.learnerId!==profile?.learnerId||!locked)return false;
 return hash(locked.text)===submission.hashes.sceneDraft&&
 Object.entries(submission.hashes).every(([k,h])=>hash(fields()[k]||"")===h);
}
function approved(){return matches()&&validReview(review,submission);}
function score(){
 const rows={};ids.forEach(k=>{const v=$("week7-rubric-"+k).value;rows[k]=v===""?null:Number(v);});
 const total=ids.every(k=>Number.isInteger(rows[k])&&rows[k]>=0&&rows[k]<=2)?
  ids.reduce((acc,k)=>acc+rows[k],0):null;
 return {rows,total};
}
function scoreMessage(){
 const n=score().total;
 $("week7-review-total").textContent=n===null?
  "Select all five criterion scores (0–2).":
  n+"/10 · "+(n>=8?"Mastery threshold reached":"Targeted revision required");
}
function prepared(){
 return ready&&!W.frozen&&!!locked&&
 inRange(analysis.value,300,450)&&inRange(final.value,350,550)&&
 inRange(commentary.value,100,150)&&wc(growth.value)>=12&&
 $("week7-independent").checked&&$("week7-evidence-confirm").checked;
}
function sync(){
 $("week7-analysis-count").textContent="Literary analysis: "+wc(analysis.value)+" words (300–450 required).";
 $("week7-draft-count").textContent="Original scene: "+wc(draft.value)+" words (350–550 required).";
 $("week7-final-count").textContent="Revised scene: "+wc(final.value)+" words (350–550 required).";
 $("week7-commentary-count").textContent="Craft commentary: "+wc(commentary.value)+" words (100–150 required).";
 const pass=approved()&&review.passed;
 $("week7-submit").disabled=!prepared()||pass;
 $("week7-record-review").disabled=!ready||W.frozen||!matches();
 $("week7-next-wrap").hidden=!pass;
 if(pass)$("week7-next-score").textContent="Locally recorded educator mastery: "+review.score+"/10.";
 $("week7-submission-status").textContent=!submission?"No assessment submission recorded.":
 matches()?"Evidence submitted "+new Date(submission.submittedAt).toLocaleString()+" · Awaiting or carrying a rubric review.":
 "The current work differs from the submitted writing. Submit a new version for reevaluation.";
 $("week7-review-status").textContent=approved()?
 "Educator-entered rubric: "+review.score+"/10 · "+review.evaluator+"\nFeedback: "+review.feedback:
 "There is no current matching review for this writing version. Submitting or selecting rubric scores alone cannot unlock Week 08.";
}
function lockView(){
 if(locked){
  if(draft.value!==locked.text)halt("Your original scene differs from its preserved locked copy.");
  draft.value=locked.text;draft.readOnly=true;
  $("week7-lock-draft").disabled=true;
  $("week7-lock-status").textContent="Original scene preserved "+new Date(locked.at).toLocaleString()+".";
 }else{
  $("week7-lock-draft").disabled=!ready||W.frozen;
  $("week7-lock-status").textContent="Original scene not locked.";
 }
 final.readOnly=!ready||W.frozen||!locked;
}
$("week7-import-day34").addEventListener("click",()=>{
 if(!ready||W.frozen||locked)return;
 const draftKey=scoped("khae-ela9-field:week-07-day34-scene-draft");
 const notesKey=scoped("khae-ela9-field:week-07-day34");
 const candidate=draftKey?read(draftKey)||"":"";
 const prior=inRange(candidate,350,550)?candidate:notesKey?read(notesKey)||"":"";
 if(!inRange(prior,350,550)){
  $("week7-lock-status").textContent="Day 34 response contains "+wc(prior)+" words; select a complete 350–550-word original scene (without its planning notes) to copy.";
  return;
 }
 if(draft.value.trim()&&!confirm("Replace this unlocked scene with your Day 34 saved writing?"))return;
 draft.value=prior;draft.dispatchEvent(new Event("input",{bubbles:true}));
 if(!W.frozen)$("week7-lock-status").textContent="Day 34 copied; source preserved. Lock it once you confirm this is the original independent scene.";
});
$("week7-lock-draft").addEventListener("click",()=>{
 if(!ready||W.frozen||locked)return;
 if(!inRange(draft.value,350,550)){
  $("week7-lock-status").textContent="Draft 1 must contain 350–550 words before being locked.";return;
 }
 const next={version:1,text:draft.value,at:new Date().toISOString(),fingerprint:hash(draft.value)};
 if(write(lockKey,JSON.stringify(next))){locked=next;lockView();sync();}
});
[analysis,draft,final,commentary,growth].forEach(el=>el.addEventListener("input",sync));
["week7-independent","week7-evidence-confirm"].forEach(id=>$(id).addEventListener("change",sync));
ids.forEach(k=>$("week7-rubric-"+k).addEventListener("change",()=>{scoreMessage();sync();}));
$("week7-submit").addEventListener("click",()=>{
 if(!prepared())return;
 const m=fields();
 const next={schema:"english9-week07-day35-submission-v1",day:35,learnerId:profile.learnerId,
  submittedAt:new Date().toISOString(),analysisWords:wc(analysis.value),
  sceneDraftWords:wc(draft.value),sceneFinalWords:wc(final.value),
  commentaryWords:wc(commentary.value),hashes:Object.fromEntries(Object.entries(m).map(([k,v])=>[k,hash(v)])),
  fingerprint:hash(Object.values(m).join("|"))};
 if(!write(submissionKey,JSON.stringify(next)))return;
 submission=next;
 const nextProgress={...W.progress,[W.flag(35)]:true};
 if(write(W.progressKey,JSON.stringify(nextProgress)))W.progress[W.flag(35)]=true;
 sync();
});
$("week7-record-review").addEventListener("click",()=>{
 if(!ready||W.frozen||!matches())return;
 const {rows,total}=score(),name=$("week7-evaluator").value.trim(),feedback=$("week7-feedback").value.trim();
 if(total===null||name.length<2||feedback.length<10){
  $("week7-review-status").textContent="Complete all five rubric scores, evaluator name, and meaningful specific feedback.";return;
 }
 if(approved()&&!confirm("Replace the existing review for this submitted version?"))return;
 const next={schema:"english9-week07-day35-review-v1",learnerId:profile.learnerId,
  submittedAt:submission.submittedAt,fingerprint:submission.fingerprint,rows,score:total,
  passed:total>=8,evaluator:name,feedback,evaluatedAt:new Date().toISOString()};
 if(!validReview(next,submission)){halt("The evaluation record did not pass validation.");return;}
 if(write(reviewKey,JSON.stringify(next))){review=next;sync();}
});
function download(filename,payload){
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const uri=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=uri;a.download=filename;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(uri),1200);
}
$("week7-export").addEventListener("click",()=>{
 download("english9-week07-day35-backup.json",{
  schema:"english9-week07-day35-backup-v1",learnerId:profile?.learnerId||null,
  exportedAt:new Date().toISOString(),responses:Object.fromEntries(writing.map(f=>[f.dataset.saveField,f.value])),
  lockedDraft:locked,submission,review,containsUnsavedDrafts:W.frozen
 });
});
$("week7-export-review").addEventListener("click",()=>{
 if(!approved()){$("week7-review-status").textContent="Record a matching educator review before exporting.";return;}
 download("english9-week07-day35-evaluation.json",{
  schema:"english9-week07-evaluation-v1",exportedAt:new Date().toISOString(),
  learnerId:profile.learnerId,review
 });
});
$("week7-import-review").addEventListener("change",async event=>{
 const file=event.target.files?.[0];event.target.value="";if(!file)return;
 try{
  if(!ready||W.frozen||!matches())throw Error("A submitted matching assessment is required first.");
  if(file.size>150000)throw Error("Review JSON is too large.");
  const payload=JSON.parse(await file.text());
  if(payload.schema!=="english9-week07-evaluation-v1"||
   payload.learnerId!==profile.learnerId||!validReview(payload.review,submission))
   throw Error("Review belongs to another learner, submission, or does not meet rubric requirements.");
  if(approved()&&!confirm("Replace this existing local review?"))return;
  if(!write(reviewKey,JSON.stringify(payload.review)))throw Error("Review storage is unavailable or another tab changed it.");
  review=payload.review;sync();
  $("week7-review-status").textContent="Matching review imported: "+review.score+"/10. "+
    (review.passed?"Week 08 continuation unlocked.":"Targeted corrective revision required.");
 }catch(e){$("week7-review-status").textContent="Evaluation not imported: "+e.message;}
});
window.addEventListener("storage",event=>{
 if(event.key===submissionKey||event.key===reviewKey){
  $("week7-next-wrap").hidden=true;
  say("This assessment changed in another tab. Reload before continuing.",true);
 }
});
lockView();scoreMessage();sync();
})();
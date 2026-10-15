/* English 9 Week 06 · Unit 02 independent portfolio assessment.
   Local parent/educator record; public GitHub Pages cannot authenticate evaluators. */
(function(){
"use strict";
if(document.body.getAttribute("data-english9-week6-day")!=="30")return;
const W=window.KhaemenesEnglish9Week06,$=id=>document.getElementById(id);
if(!W)return;
const {profile,ready,scoped,read,write,load,writing,hash,validReview,validSubmission,halt,say}=W;
const field=Object.fromEntries(writing.map(e=>[e.dataset.saveField,e]));
const draft=field["week-06-day-30-draft1"],final=field["week-06-day-30-final"],
 sources=field["week-06-day-30-sources"],defense=field["week-06-day-30-defense"],
 revision=field["week-06-day-30-revision"];
const patterns=Array.from({length:6},(_,i)=>field["week-06-day-30-pattern-"+(i+1)]);
if(!draft||!final||!sources||!defense||!revision||patterns.some(x=>!x)){halt("Assessment fields could not be loaded");return;}
const lockKey=scoped("khae-ela9-field:week-06-day30-draft1-lock-v1"),
 subKey=scoped("khae-ela9-field:week-06-day30-submission-v1"),
 reviewKey=scoped("khae-ela9-field:week-06-day30-review-v1");
const obj=x=>!!x&&typeof x==="object"&&!Array.isArray(x),
 count=s=>String(s||"").trim().split(/\s+/).filter(Boolean).length,
 inRange=n=>n>=700&&n<=900,
 defenseMode=$("week6-defense-mode");
if(defenseMode.value!=="written"&&defenseMode.value!=="oral")defenseMode.value="written";
const validLock=x=>obj(x)&&x.version===1&&typeof x.text==="string"&&
 inRange(count(x.text))&&x.fingerprint===hash(x.text)&&typeof x.at==="string";
let locked=lockKey?load(lockKey,null,validLock):null;
let submission=subKey?load(subKey,null,validSubmission):null;
let review=reviewKey?load(reviewKey,null,obj):null;
const keys=["thesis","evidence","synthesis","context","language"];
function hasPattern(v){
 if(!v.trim())return false;
 const lower=v.toLowerCase();
 return count(v)>=24&&
 ["pattern name:","text a:","text b:","similarity:","difference:","meaning:","evidence:"].every(k=>lower.includes(k))&&
 lower.split(/\n/).filter(z=>z.trim()).length>=7;
}
function material(){
 const result={draft:draft.value,final:final.value,sources:sources.value,
  defense:defense.value,revision:revision.value,mode:defenseMode.value};
 patterns.forEach((e,i)=>result["pattern"+(i+1)]=e.value);
 return result;
}
function match(){
 return validSubmission(submission)&&submission.learnerId===profile?.learnerId&&
 Object.entries(submission.hashes).every(([k,v])=>hash(material()[k]||"")===v)&&
 locked&&hash(locked.text)===submission.hashes.draft;
}
function evaluated(){return !!(match()&&validReview(review,submission));}
function scores(){
 const rows={};keys.forEach(k=>{const v=$("week6-rubric-"+k).value;rows[k]=v===""?null:Number(v);});
 return {rows,total:keys.every(k=>Number.isInteger(rows[k])&&rows[k]>=0&&rows[k]<=2)?
  keys.reduce((n,k)=>n+rows[k],0):null};
}
function updateRubric(){
 const n=scores().total;
 $("week6-review-total").textContent=n===null?"Choose all five rubric rows (0, 1 or 2).":
 n+"/10 · "+(n>=8?"Mastery threshold":"Corrective revision required");
}
function defenseReady(){
 if(defenseMode.value==="written")return count(defense.value)>=180&&count(defense.value)<=250;
 return $("week6-oral-attestation").checked&&count(defense.value)>=10;
}
function prepared(){
 const complete=patterns.filter(p=>hasPattern(p.value)).length;
 return ready&&!W.frozen&&!!locked&&inRange(count(final.value))&&
 complete>=4&&complete<=6&&count(sources.value)>=10&&defenseReady()&&
 count(revision.value)>=12&&$("week6-independent").checked&&$("week6-attribution-confirm").checked;
}
function sync(){
 const complete=patterns.filter(x=>hasPattern(x.value)).length;
 $("week6-map-status").textContent=complete+" of 6 entries complete; at least four and no more than six required.";
 $("week6-draft-count").textContent="Original Draft 1 · "+count(draft.value)+" words (700–900 required).";
 $("week6-final-count").textContent="Final response · "+count(final.value)+" words (700–900 required).";
 $("week6-defense-count").textContent=defenseMode.value==="written"?
 "Written defense · "+count(defense.value)+" words (180–250 required).":
 "Spoken defense · approximately two minutes, with an evaluator-verifiable record.";
 $("week6-submit").disabled=!prepared()||(evaluated()&&review.passed);
 $("week6-record-review").disabled=!ready||W.frozen||!match();
 const pass=evaluated()&&review.passed;
 $("week6-next-wrap").hidden=!pass;
 if(pass)$("week6-next-score").textContent="Evaluator-recorded Unit 02 mastery · "+review.score+"/10.";
 $("week6-submission-status").textContent=!submission?
 "No assessment submitted yet.":
 match()?"Evidence submitted "+new Date(submission.submittedAt).toLocaleString()+" · Rubric review tracked separately.":
 "The saved work has changed since submission. Resubmit the revised work for an updated review.";
 $("week6-review-status").textContent=evaluated()?
 "Human-entered rubric · "+review.score+"/10 · "+review.evaluator+"\nFeedback: "+review.feedback:
 "No valid review for this exact submission. Drafting, self-assessment, or submitting cannot automatically unlock Unit 03.";
}
function lockView(){
 if(locked){
  if(draft.value!==locked.text)halt("Original Draft 1 differs from its preserved copy.");
  draft.value=locked.text;draft.readOnly=true;
  $("week6-lock-draft").disabled=true;
  $("week6-lock-status").textContent="Draft 1 preserved at "+new Date(locked.at).toLocaleString()+".";
 }else{
  $("week6-lock-draft").disabled=!ready||W.frozen;
  $("week6-lock-status").textContent="Original 700–900-word draft has not yet been preserved.";
 }
 final.readOnly=!ready||W.frozen||!locked;
}
$("week6-import-day29").addEventListener("click",()=>{
 if(!ready||W.frozen||locked)return;
 const stored=scoped("khae-ela9-field:week-06-day-29"),prior=stored?read(stored)||"":"";
 if(!inRange(count(prior))){
  $("week6-lock-status").textContent="Day 29's original response is "+count(prior)+" words; preserve a complete 700–900-word independent essay before copying.";
  return;
 }
 if(draft.value.trim()&&!confirm("Replace this unlocked draft with your saved Day 29 essay?"))return;
 draft.value=prior;draft.dispatchEvent(new Event("input",{bubbles:true}));
 if(!W.frozen)$("week6-lock-status").textContent="Copied the Day 29 essay without changing the source. Review and lock your original draft.";
});
$("week6-lock-draft").addEventListener("click",()=>{
 if(!ready||W.frozen||locked)return;
 if(!inRange(count(draft.value))){$("week6-lock-status").textContent="Draft 1 must be 700–900 words.";return;}
 const record={version:1,text:draft.value,at:new Date().toISOString(),fingerprint:hash(draft.value)};
 if(write(lockKey,JSON.stringify(record))){locked=record;lockView();sync();}
});
[draft,final,sources,defense,revision,...patterns].forEach(el=>el.addEventListener("input",sync));
defenseMode.addEventListener("change",()=>{defenseMode.dispatchEvent(new Event("input",{bubbles:true}));sync();});
["week6-oral-attestation","week6-independent","week6-attribution-confirm"].forEach(id=>$(id).addEventListener("change",sync));
keys.forEach(k=>$("week6-rubric-"+k).addEventListener("change",()=>{updateRubric();sync();}));
$("week6-submit").addEventListener("click",()=>{
 if(!prepared())return;
 const m=material(),complete=patterns.filter(x=>hasPattern(x.value)).length;
 const next={schema:"english9-week06-day30-submission-v1",learnerId:profile.learnerId,day:30,
  submittedAt:new Date().toISOString(),draftWords:count(draft.value),finalWords:count(final.value),
  patternsComplete:complete,defenseMode:defenseMode.value,
  hashes:Object.fromEntries(Object.entries(m).map(([k,v])=>[k,hash(v)])),
  fingerprint:hash(Object.values(m).join("|"))};
 if(!write(subKey,JSON.stringify(next)))return;
 submission=next;
 const flags={...W.progress,[W.flag(30)]:true};
 if(write(W.progressKey,JSON.stringify(flags)))W.progress[W.flag(30)]=true;
 sync();
});
$("week6-record-review").addEventListener("click",()=>{
 if(!ready||W.frozen||!match())return;
 const {total,rows}=scores(),name=$("week6-evaluator").value.trim(),feedback=$("week6-feedback").value.trim();
 if(total===null||name.length<2||feedback.length<10){
  $("week6-review-status").textContent="Complete all five scores, the evaluator name, and detailed corrective feedback.";return;
 }
 if(evaluated()&&!confirm("Replace the prior locally recorded review?"))return;
 const next={schema:"english9-week06-day30-review-v1",learnerId:profile.learnerId,
  submittedAt:submission.submittedAt,fingerprint:submission.fingerprint,
  rows,score:total,passed:total>=8,evaluator:name,feedback,evaluatedAt:new Date().toISOString()};
 if(!validReview(next,submission)){halt("Rubric validation failed");return;}
 if(write(reviewKey,JSON.stringify(next))){review=next;sync();}
});
function download(name,payload){
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$("week6-export").addEventListener("click",()=>{
 download("english9-week06-day30-portfolio-backup.json",{
  schema:"english9-week06-day30-backup-v1",learnerId:profile?.learnerId||null,
  exportedAt:new Date().toISOString(),responses:Object.fromEntries(writing.map(x=>[x.dataset.saveField,x.value])),
  defenseMode:defenseMode.value,lockedDraft:locked,submission,review,
  evidencePrepared:!!W.progress[W.flag(30)],containsUnsavedDrafts:W.frozen
 });
});
$("week6-export-review").addEventListener("click",()=>{
 if(!evaluated()){$("week6-review-status").textContent="Complete and record the educator rubric before exporting.";return;}
 download("english9-week06-day30-evaluation.json",{
  schema:"english9-week06-evaluation-v1",learnerId:profile.learnerId,
  exportedAt:new Date().toISOString(),review
 });
});
$("week6-import-review").addEventListener("change",async event=>{
 const f=event.target.files?.[0];event.target.value="";if(!f)return;
 try{
  if(!ready||W.frozen||!match())throw Error("Submit the original evidence before importing an evaluation.");
  if(f.size>150000)throw Error("Review file is too large.");
  const payload=JSON.parse(await f.text());
  if(payload.schema!=="english9-week06-evaluation-v1"||
   payload.learnerId!==profile.learnerId||!validReview(payload.review,submission))
   throw Error("Review does not match this learner and exact submitted evidence.");
  if(evaluated()&&!confirm("Replace the current local review record?"))return;
  if(!write(reviewKey,JSON.stringify(payload.review)))throw Error("Could not save evaluation; another tab may have edited it.");
  review=payload.review;sync();
  $("week6-review-status").textContent="Matching review imported: "+review.score+"/10. "+
    (review.passed?"Unit 03 progression is ready.":"Corrective learning required before progressing.");
 }catch(e){$("week6-review-status").textContent="Import rejected: "+e.message;}
});
window.addEventListener("storage",e=>{
 if(e.key===subKey||e.key===reviewKey){
  $("week6-next-wrap").hidden=true;say("Assessment changed in another tab. Reload to verify the latest record.",true);
 }
});
lockView();updateRubric();sync();
})();
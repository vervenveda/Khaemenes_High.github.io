/* English 9 Week10 poetry assessment · local human rubric, learner-scoped saving */
(function(){
"use strict";
if(document.body.getAttribute("data-english9-week10-day")!=="50")return;
const W=window.KhaemenesEnglish9Week10,$=id=>document.getElementById(id);
if(!W)return;
const {profile,ready,scoped,read,write,load,writing,hash,validReview,validSubmission,halt,say}=W;
const store=Object.fromEntries(writing.map(f=>[f.dataset.saveField,f]));
const ids={analysis:"analysis",poem1Draft:"poem1-draft",poem1Final:"poem1-final",
 poem1Revision:"poem1-revision",poem2Draft:"poem2-draft",poem2Final:"poem2-final",
 poem2Revision:"poem2-revision",craftNote:"craft-note",reflection:"reflection"};
const field=Object.fromEntries(Object.entries(ids).map(([k,v])=>[k,store["week-10-day50-"+v]]));
if(Object.values(field).some(x=>!x)){halt("Assessment writing fields are incomplete");return;}
const obj=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const wc=s=>String(s||"").trim().split(/\s+/).filter(Boolean).length;
const lines=s=>String(s||"").split(/\r?\n/).filter(x=>x.trim()).length;
const between=(n,a,b)=>n>=a&&n<=b;
const locks={poem1:scoped("khae-ela9-field:week-10-day50-poem1-lock-v1"),poem2:scoped("khae-ela9-field:week-10-day50-poem2-lock-v1")};
const subKey=scoped("khae-ela9-field:week-10-day50-submission-v1"),
 reviewKey=scoped("khae-ela9-field:week-10-day50-review-v1");
const validLock=(x,min,max)=>obj(x)&&x.version===1&&typeof x.text==="string"&&between(lines(x.text),min,max)&&
 x.fingerprint===hash(x.text)&&typeof x.at==="string"&&!Number.isNaN(Date.parse(x.at));
const originals={
 poem1:locks.poem1?load(locks.poem1,null,x=>validLock(x,12,20)):null,
 poem2:locks.poem2?load(locks.poem2,null,x=>validLock(x,8,16)):null
};
let submission=subKey?load(subKey,null,validSubmission):null,
 review=reviewKey?load(reviewKey,null,obj):null;
const criteria=["claim","evidence","craft","revision","clarity"];
const material=()=>Object.fromEntries(Object.entries(field).map(([k,v])=>[k,v.value]));
function consistent(){
 if(!validSubmission(submission)||submission.learnerId!==profile?.learnerId||
 !originals.poem1||!originals.poem2||
 hash(originals.poem1.text)!==submission.hashes.poem1Draft||
 hash(originals.poem2.text)!==submission.hashes.poem2Draft)return false;
 const m=material();
 return Object.entries(submission.hashes).every(([k,h])=>hash(m[k]||"")===h);
}
const reviewed=()=>consistent()&&validReview(review,submission);
function scores(){
 const rows={};for(const k of criteria){const v=$("week10-rubric-"+k).value;rows[k]=v===""?null:Number(v);}
 return {rows,total:criteria.every(k=>Number.isInteger(rows[k])&&rows[k]>=0&&rows[k]<=2)?
 criteria.reduce((n,k)=>n+rows[k],0):null};
}
function showScore(){const n=scores().total;$("week10-review-total").textContent=n===null?
 "Select all five rubric rows (0–2).":n+"/10 · "+(n>=8?"Mastery threshold met":"Targeted corrective revision needed");}
function prepared(){
 return ready&&!W.frozen&&!!originals.poem1&&!!originals.poem2&&
 between(wc(field.analysis.value),300,450)&&
 between(lines(field.poem1Final.value),12,20)&&between(lines(field.poem2Final.value),8,16)&&
 between(wc(field.craftNote.value),120,180)&&wc(field.poem1Revision.value)>=10&&
 wc(field.poem2Revision.value)>=10&&wc(field.reflection.value)>=12&&
 $("week10-independent").checked&&$("week10-revision-check").checked;
}
function sync(){
 $("week10-analysis-count").textContent=wc(field.analysis.value)+" words · 300–450 required";
 $("week10-craft-note-count").textContent=wc(field.craftNote.value)+" words · 120–180 required";
 for(const n of [1,2]){
  for(const type of ["draft","final"]){
   const c=lines(field["poem"+n+(type==="draft"?"Draft":"Final")].value);
   $("week10-poem"+n+"-"+type+"-count").textContent=c+" nonblank lines · "+(n===1?"12–20":"8–16")+" required";
  }
 }
 const pass=reviewed()&&review.passed;
 $("week10-next-wrap").hidden=!pass;
 if(pass)$("week10-next-score").textContent="Educator-entered poetry mastery · "+review.score+"/10.";
 $("week10-submit").disabled=!prepared()||pass;
 $("week10-record-review").disabled=!ready||W.frozen||!consistent();
 $("week10-submission-status").textContent=!submission?"No assessment submitted yet.":
 consistent()?"Portfolio submitted "+new Date(submission.submittedAt).toLocaleString()+". Human review remains separate.":
 "The current writing differs from the submitted version. Submit a revised portfolio for reevaluation.";
 $("week10-review-status").textContent=reviewed()?
 "Local educator rubric · "+review.score+"/10 · "+review.evaluator+"\nFeedback: "+review.feedback:
 "No valid evaluator review for this exact version. Submission does not unlock Week 11.";
}
function lockView(n){
 const key="poem"+n,input=field[key+"Draft"],final=field[key+"Final"],record=originals[key];
 if(record){
  if(input.value!==record.text)halt("Original Poem "+n+" conflicts with its preserved copy.");
  input.value=record.text;input.readOnly=true;$("week10-lock-poem"+n).disabled=true;
  $("week10-poem"+n+"-lock-status").textContent="Original preserved "+new Date(record.at).toLocaleString();
 }else{
  $("week10-lock-poem"+n).disabled=!ready||W.frozen;
  $("week10-poem"+n+"-lock-status").textContent="Original not yet locked.";
 }
 final.readOnly=!ready||W.frozen||!record;
}
function lock(n){
 if(!ready||W.frozen||originals["poem"+n])return;
 const value=field["poem"+n+"Draft"].value,min=n===1?12:8,max=n===1?20:16;
 if(!between(lines(value),min,max)){$("week10-poem"+n+"-lock-status").textContent="Complete "+min+"–"+max+" nonblank lines before locking.";return;}
 const rec={version:1,text:value,fingerprint:hash(value),at:new Date().toISOString()};
 if(write(locks["poem"+n],JSON.stringify(rec))){originals["poem"+n]=rec;lockView(n);sync();}
}
for(const n of [1,2])$("week10-lock-poem"+n).addEventListener("click",()=>lock(n));
$("week10-import-day49").addEventListener("click",()=>{
 if(!ready||W.frozen)return;
 for(const n of [1,2]){
  const f=field["poem"+n+"Draft"];
  if(originals["poem"+n])continue;
  const key=scoped("khae-ela9-field:week-10-day49-poem"+n+"-draft"),
    prior=key?read(key)||"":"",min=n===1?12:8,max=n===1?20:16;
  if(!between(lines(prior),min,max)){
   $("week10-poem"+n+"-lock-status").textContent="Day 49 draft has "+lines(prior)+" lines; needs "+min+"–"+max+".";
   continue;
  }
  if(f.value.trim()&&!confirm("Replace unlocked Poem "+n+" with Day 49's saved original?"))continue;
  f.value=prior;f.dispatchEvent(new Event("input",{bubbles:true}));
  const rkey=scoped("khae-ela9-field:week-10-day49-poem"+n+"-revision"),note=rkey?read(rkey)||"":"";
  if(note&&!field["poem"+n+"Revision"].value.trim()){
   field["poem"+n+"Revision"].value=note;
   field["poem"+n+"Revision"].dispatchEvent(new Event("input",{bubbles:true}));
  }
 }
});
Object.values(field).forEach(f=>f.addEventListener("input",sync));
["week10-independent","week10-revision-check"].forEach(id=>$(id).addEventListener("change",sync));
criteria.forEach(k=>$("week10-rubric-"+k).addEventListener("change",()=>{showScore();sync();}));
$("week10-submit").addEventListener("click",()=>{
 if(!prepared())return;
 const m=material();
 const next={schema:"english9-week10-day50-submission-v1",day:50,learnerId:profile.learnerId,
  submittedAt:new Date().toISOString(),analysisWords:wc(field.analysis.value),
  poem1Lines:lines(field.poem1Final.value),poem2Lines:lines(field.poem2Final.value),
  craftWords:wc(field.craftNote.value),
  hashes:Object.fromEntries(Object.entries(m).map(([k,v])=>[k,hash(v)])),
  fingerprint:hash(Object.values(m).join("|"))};
 if(!write(subKey,JSON.stringify(next)))return;
 submission=next;
 const progress={...W.progress,[W.flag(50)]:true};
 if(write(W.progressKey,JSON.stringify(progress)))W.progress[W.flag(50)]=true;
 sync();
});
$("week10-record-review").addEventListener("click",()=>{
 if(!ready||W.frozen||!consistent())return;
 const {rows,total}=scores(),evaluator=$("week10-evaluator").value.trim(),feedback=$("week10-feedback").value.trim();
 if(total===null||evaluator.length<2||feedback.length<10){
  $("week10-review-status").textContent="Complete the five rubric rows, evaluator name and evidence-specific feedback.";return;
 }
 if(reviewed()&&!confirm("Replace the current local review?"))return;
 const next={schema:"english9-week10-day50-review-v1",learnerId:profile.learnerId,
  submittedAt:submission.submittedAt,fingerprint:submission.fingerprint,rows,score:total,
  passed:total>=8,evaluator,feedback,evaluatedAt:new Date().toISOString()};
 if(!validReview(next,submission)){halt("Review record validation failed");return;}
 if(write(reviewKey,JSON.stringify(next))){review=next;sync();}
});
function download(filename,data){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),
 url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
}
$("week10-export").addEventListener("click",()=>download("english9-week10-poetry-portfolio.json",{
 schema:"english9-week10-day50-backup-v1",learnerId:profile?.learnerId||null,
 exportedAt:new Date().toISOString(),responses:Object.fromEntries(writing.map(x=>[x.dataset.saveField,x.value])),
 originals,submission,review,containsUnsavedDrafts:W.frozen
}));
$("week10-export-review").addEventListener("click",()=>{
 if(!reviewed()){$("week10-review-status").textContent="Record a matching educator review before export.";return;}
 download("english9-week10-evaluation.json",{
  schema:"english9-week10-evaluation-v1",learnerId:profile.learnerId,
  exportedAt:new Date().toISOString(),review
 });
});
$("week10-import-review").addEventListener("change",async event=>{
 const file=event.target.files?.[0];event.target.value="";if(!file)return;
 try{
  if(!ready||W.frozen||!consistent())throw Error("Submit matching student evidence before importing a review.");
  if(file.size>150000)throw Error("Review file is too large.");
  const payload=JSON.parse(await file.text());
  if(payload.schema!=="english9-week10-evaluation-v1"||payload.learnerId!==profile.learnerId||
  !validReview(payload.review,submission))throw Error("The review does not match this learner and submission.");
  if(reviewed()&&!confirm("Replace existing review for this submission?"))return;
  if(!write(reviewKey,JSON.stringify(payload.review)))throw Error("Review storage changed or failed.");
  review=payload.review;sync();
  $("week10-review-status").textContent="Matching evaluation imported: "+review.score+"/10. "+
   (review.passed?"Week 11 navigation is available.":"Complete corrective learning.");
 }catch(err){$("week10-review-status").textContent="Review rejected: "+err.message;}
});
window.addEventListener("storage",ev=>{
 if(ev.key===subKey||ev.key===reviewKey){$("week10-next-wrap").hidden=true;say("Assessment records changed in another tab. Reload before continuing.",true);}
});
lockView(1);lockView(2);showScore();sync();
})();
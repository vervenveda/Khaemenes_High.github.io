/* English 9 Week 12 · Unit 04 original-poetry portfolio and locally entered human rubric.
 * Local fingerprints detect changed records; they do not authenticate educator identity. */
(function(){
"use strict";
if(document.body.getAttribute("data-english9-week12-day")!=="60")return;
const W=window.KhaemenesEnglish9Week12,$=id=>document.getElementById(id);
if(!W)return;
const {profile,ready,scoped,read,write,load,writing,hash,validSubmission,validReview,halt,say}=W;
const by=Object.fromEntries(writing.map(el=>[el.dataset.saveField,el]));
const names={translation:"translation",reflection:"reflection",sourceNote:"source-note",
 sourceMode:"source-mode",performancePoem:"performance-poem",performanceMap:"performance-map",delivery:"delivery"};
for(let i=1;i<=4;i++){
 names["poem"+i+"Draft"]="poem"+i+"-draft";
 names["poem"+i+"Final"]="poem"+i+"-final";
 names["poem"+i+"Revision"]="poem"+i+"-revision";
}
const field=Object.fromEntries(Object.entries(names).map(([k,v])=>[k,by["week-12-day60-"+v]]));
if(Object.values(field).some(v=>!v)){halt("One or more portfolio fields could not be loaded.");return;}
const obj=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const wc=s=>String(s||"").trim().split(/\s+/).filter(Boolean).length;
const lc=s=>String(s||"").split(/\r?\n/).filter(x=>x.trim()).length;
const hasRange=(s,a,b)=>wc(s)>=a&&wc(s)<=b;
const key=scoped("khae-ela9-field:week-12-day60-submission-v1"),
 reviewKey=scoped("khae-ela9-field:week-12-day60-review-v1"),
 criteria=["portfolio","translation","performance","craft","reflection"];
let submission=key?load(key,null,validSubmission):null;
let review=reviewKey?load(reviewKey,null,obj):null;
for(const [id,defaultValue,allowed] of [["sourceMode","authentic",["authentic","simulation"]],["performancePoem","1",["1","2","3","4"]]]){
 const el=field[id];
 if(!allowed.includes(el.value)){el.value=defaultValue;if(ready&&!W.frozen)el.dispatchEvent(new Event("input",{bubbles:true}));}
}
function materials(){return Object.fromEntries(Object.entries(field).map(([k,v])=>[k,v.value]));}
function matches(){
 if(!validSubmission(submission)||submission.learnerId!==profile?.learnerId)return false;
 const current=materials();
 return Object.entries(submission.hashes).every(([k,h])=>hash(current[k]||"")===h);
}
function approved(){return matches()&&validReview(review,submission);}
function hasPoem(i){
 const draft=field["poem"+i+"Draft"].value,final=field["poem"+i+"Final"].value,
 revision=field["poem"+i+"Revision"].value;
 return lc(draft)>=4&&lc(final)>=4&&wc(revision)>=12&&
 draft.trim()!==final.trim();
}
function meaningfulMap(){
 const map=field.performanceMap.value.toLowerCase();
 return wc(map)>=30&&["breath","emphasis","pace","turn"].every(k=>map.includes(k));
}
function sourceReady(){
 const text=field.sourceNote.value.toLowerCase();
 if(wc(text)<12)return false;
 return field.sourceMode.value==="simulation"?
  (text.includes("simulation")||text.includes("course-created")):
  field.sourceMode.value==="authentic";
}
function evidenceReady(){
 return ready&&!W.frozen&&[1,2,3,4].every(hasPoem)&&
 hasRange(field.translation.value,500,700)&&sourceReady()&&
 hasRange(field.reflection.value,200,300)&&
 ["1","2","3","4"].includes(field.performancePoem.value)&&meaningfulMap()&&
 wc(field.delivery.value)>=12&&$("week12-delivered").checked&&
 $("week12-independent").checked&&$("week12-portfolio-confirm").checked;
}
function rubric(){
 const rows={};
 for(const id of criteria){const v=$("week12-rubric-"+id).value;rows[id]=v===""?null:Number(v);}
 const valid=criteria.every(id=>Number.isInteger(rows[id])&&rows[id]>=0&&rows[id]<=2);
 return {rows,total:valid?criteria.reduce((n,id)=>n+rows[id],0):null};
}
function showRubric(){
 const {total}=rubric();
 $("week12-review-total").textContent=total===null?"Select all five rubric scores (0–2).":
 total+"/10 · "+(total>=8?"Mastery threshold reached":"Targeted corrective revision required");
}
function sync(){
 for(let i=1;i<=4;i++){
  const label=document.querySelector('[data-week12-poem-status="'+i+'"]');
  if(label)label.textContent=hasPoem(i)?"Original and revised versions with reasoning prepared":
   "Both original and revised poem (4+ nonblank lines) and revision rationale required";
 }
 $("week12-translation-count").textContent=wc(field.translation.value)+" words · 500–700 required";
 $("week12-reflection-count").textContent=wc(field.reflection.value)+" words · 200–300 required";
 const pass=approved()&&review.passed;
 $("week12-next-wrap").hidden=!pass;
 if(pass)$("week12-next-score").textContent="Human-entered Unit 04 mastery: "+review.score+"/10 for this exact portfolio.";
 $("week12-submit").disabled=!evidenceReady()||pass;
 $("week12-record-review").disabled=!ready||W.frozen||!matches();
 $("week12-submission-status").textContent=!submission?"No Unit 04 portfolio submitted.":
 matches()?"Portfolio submitted "+new Date(submission.submittedAt).toLocaleString()+"; review remains separate.":
 "The portfolio changed after submission. Resubmit the revised evidence for a new review.";
 $("week12-review-status").textContent=approved()?
 "Locally recorded educator review · "+review.score+"/10 · "+review.evaluator+"\nFeedback: "+review.feedback:
 "No current review for this exact submission. Self-assessment and submission do not unlock Unit 05.";
}
Object.values(field).forEach(el=>el.addEventListener("input",sync));
["week12-delivered","week12-independent","week12-portfolio-confirm"].forEach(id=>$(id).addEventListener("change",sync));
criteria.forEach(id=>$("week12-rubric-"+id).addEventListener("change",()=>{showRubric();sync();}));
const sourceMap={
 1:["week-10-day50-poem1-draft","week-10-day50-poem1-final","week-10-day50-poem1-revision"],
 2:["week-10-day50-poem2-draft","week-10-day50-poem2-final","week-10-day50-poem2-revision"],
 3:["week-11-day55-draft","week-11-day55-final","week-11-day55-revision"],
 4:["week-12-day59-poem-draft","week-12-day59-poem-final",null]
};
document.querySelectorAll("[data-week12-import]").forEach(button=>{
 button.addEventListener("click",()=>{
  const i=Number(button.getAttribute("data-week12-import")),src=sourceMap[i];
  if(!ready||W.frozen||!src)return;
  const targets=[field["poem"+i+"Draft"],field["poem"+i+"Final"],field["poem"+i+"Revision"]];
  const values=src.map(name=>name?read(scoped("khae-ela9-field:"+name))||"":"");
  if(!values[0].trim()&&!values[1].trim()){say("There is no saved earlier poem "+i+" to copy. You may paste your own original drafts manually.",true);return;}
  if(targets.some(el=>el.value.trim())&&!confirm("Replace existing Poem "+i+" portfolio fields with saved earlier work?"))return;
  targets.forEach((el,index)=>{if(!src[index])return;el.value=values[index];el.dispatchEvent(new Event("input",{bubbles:true}));});
  if(!W.frozen)say("Copied Poem "+i+" source records. They remain preserved in the original lesson. Add missing revision notes and check all versions.");
 });
});
$("week12-submit").addEventListener("click",()=>{
 if(!evidenceReady())return;
 const data=materials(),next={schema:"english9-week12-day60-submission-v1",day:60,
  learnerId:profile.learnerId,submittedAt:new Date().toISOString(),
  analysisWords:wc(field.translation.value),reflectionWords:wc(field.reflection.value),
  poemsComplete:4,sourceMode:field.sourceMode.value,
  hashes:Object.fromEntries(Object.entries(data).map(([k,v])=>[k,hash(v)])),
  fingerprint:hash(Object.values(data).join("|"))};
 if(!write(key,JSON.stringify(next)))return;
 submission=next;
 const progress={...W.progress,[W.flag(60)]:true};
 if(write(W.progressKey,JSON.stringify(progress)))W.progress[W.flag(60)]=true;
 sync();
});
$("week12-record-review").addEventListener("click",()=>{
 if(!ready||W.frozen||!matches())return;
 const {rows,total}=rubric(),name=$("week12-evaluator").value.trim(),feedback=$("week12-feedback").value.trim();
 if(total===null||name.length<2||feedback.length<10){$("week12-review-status").textContent="Complete five rubric scores, the evaluator's name and evidence-based feedback.";return;}
 if(approved()&&!confirm("Replace the currently recorded local evaluation?"))return;
 const next={schema:"english9-week12-day60-review-v1",learnerId:profile.learnerId,
  submittedAt:submission.submittedAt,fingerprint:submission.fingerprint,rows,
  score:total,passed:total>=8,evaluator:name,feedback,evaluatedAt:new Date().toISOString()};
 if(!validReview(next,submission)){halt("Rubric review failed record validation.");return;}
 if(write(reviewKey,JSON.stringify(next))){review=next;sync();}
});
function download(filename,data){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$("week12-export").addEventListener("click",()=>download("english9-week12-unit04-portfolio.json",{
 schema:"english9-week12-day60-backup-v1",exportedAt:new Date().toISOString(),
 learnerId:profile?.learnerId||null,responses:Object.fromEntries(writing.map(el=>[el.dataset.saveField,el.value])),
 submission,review,containsUnsavedDrafts:W.frozen
}));
$("week12-export-review").addEventListener("click",()=>{
 if(!approved()){$("week12-review-status").textContent="Record a matching evaluation before exporting.";return;}
 download("english9-week12-unit04-evaluation.json",{
  schema:"english9-week12-evaluation-v1",learnerId:profile.learnerId,
  exportedAt:new Date().toISOString(),review
 });
});
$("week12-import-review").addEventListener("change",async event=>{
 const file=event.target.files?.[0];event.target.value="";if(!file)return;
 try{
  if(!ready||W.frozen||!matches())throw Error("Submit matching student work first.");
  if(file.size>150000)throw Error("Review file is too large.");
  const data=JSON.parse(await file.text());
  if(data.schema!=="english9-week12-evaluation-v1"||data.learnerId!==profile.learnerId||
   !validReview(data.review,submission))throw Error("Evaluation does not match this student and submitted version.");
  if(approved()&&!confirm("Replace the existing local review?"))return;
  if(!write(reviewKey,JSON.stringify(data.review)))throw Error("Record changed in another tab or storage is unavailable.");
  review=data.review;sync();
  $("week12-review-status").textContent="Matching educator review imported: "+review.score+"/10. "+
   (review.passed?"Unit 05 progression is available.":"Corrective revision is required.");
 }catch(error){$("week12-review-status").textContent="Evaluation not imported: "+error.message;}
});
window.addEventListener("storage",event=>{
 if(event.key===key||event.key===reviewKey){$("week12-next-wrap").hidden=true;
  say("Review or submission changed in another tab. Reload to verify the latest record.",true);}
});
showRubric();sync();
})();
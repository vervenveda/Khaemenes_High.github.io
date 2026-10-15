
(function(){
"use strict";
const $=id=>document.getElementById(id);
const contract=window.KhaemenesCourseEntryContract;
const day=Number(document.body.getAttribute("data-english9-week3-day")||0);
const profile=contract?.readAcademyProfile?.()||null;
const scoped=base=>profile&&contract?.scopedKey?contract.scopedKey(base,profile):null;
let identity=null;try{identity=localStorage.getItem("khaemenes_active_learner_v1");}catch{}
const readiness=profile&&contract?.readJSON?.("khaemenes-english9-readiness-v1",null,profile);
const ready=!!(profile&&contract?.isReady?.(readiness,["close_reading_evidence","language_conventions","source_argument"],"english-9"));
const status=$("week3-status")||document.createElement("aside");
if(!status.id){
 status.id="week3-status";status.className="daily-status";status.setAttribute("role","status");
 (document.querySelector("[data-english9-week3-daily-index]")||document.querySelector("main"))?.prepend(status);
}
let frozen=false;const snapshot=new Map();
function report(message,error=false){status.textContent=message;status.classList.toggle("daily-warning",error);}
function freeze(reason){frozen=true;report("Saving paused: "+reason+" Export your current writing before leaving this page.",true);}
function read(key){
 if(!key)return null;
 try{const value=localStorage.getItem(key);snapshot.set(key,value);return value;}
 catch{freeze("Browser storage cannot be read.");return null;}
}
function write(key,value){
 if(frozen||!ready||!profile||!key)return false;
 try{
  if(localStorage.getItem("khaemenes_active_learner_v1")!==identity){freeze("Selected learner changed.");return false;}
  if(localStorage.getItem(key)!==snapshot.get(key)){freeze("A saved record changed in another tab.");return false;}
  localStorage.setItem(key,value);snapshot.set(key,value);
  report("Saved on this device · "+new Date().toLocaleTimeString());return true;
 }catch{freeze("Browser storage is unavailable or full.");return false;}
}
function validProgress(obj){return !!obj&&typeof obj==="object"&&!Array.isArray(obj)&&Object.values(obj).every(x=>typeof x==="boolean");}
function readJson(key,fallback,validator){
 const raw=read(key);if(raw===null)return fallback;
 try{const obj=JSON.parse(raw);if(!validator(obj))throw Error("invalid");return obj;}
 catch{freeze("An existing record is damaged; it was not overwritten.");return fallback;}
}
const progressKey=scoped("khae-ela9-progress-v1");
let progress=progressKey?readJson(progressKey,{},validProgress):{};
const writing=Array.from(document.querySelectorAll('[data-save-field][data-managed-save="week3"]'));
writing.forEach(field=>{
 const key=scoped("khae-ela9-field:"+field.dataset.saveField);
 field.value=key?read(key)||"":"";
 field.readOnly=!ready||frozen;
 field.addEventListener("input",()=>{write(key,field.value);if(day&&day!==15)refreshFinish();});
});
function dailyKey(d){return "week-03-day-"+String(d).padStart(2,"0");}
function updateIndex(){
 document.querySelectorAll("[data-week3-daily-status]").forEach(el=>{
  const d=Number(el.getAttribute("data-week3-daily-status"));
  el.textContent=!profile?"Select learner":progress[dailyKey(d)]?"Evidence prepared ✓":"Not yet prepared";
 });
}
updateIndex();
window.addEventListener("storage",ev=>{
 if(day===15 && ev.key===scoped("khae-ela9-field:week-03-day15-review-receipt-v1"))return;
 if(ev.key==="khaemenes_active_learner_v1"||snapshot.has(ev.key)){
  freeze("Learner selection or a saved record changed in another tab.");
  if(day&&day!==15)refreshFinish();
 }
});
if(!ready)report(profile?"Read-only preview · Complete English 9 readiness to save.":"Read-only preview · Choose your Academy learner to save.",true);
else report("Workspace ready · Original Week 3 fields are synchronized by Academy learner on this device.");

if(!day){
 const weekButton=document.querySelector('[data-managed-progress="week3"][data-progress-key="week-03"]');
 if(weekButton){
  const days=[11,12,13,14,15];
  const allReady=()=>days.every(d=>progress[dailyKey(d)]===true);
  function syncWeekButton(){
   const marked=progress["week-03"]===true;
   const ok=allReady();
   weekButton.disabled=!ready||frozen||(!ok&&!marked);
   weekButton.setAttribute("aria-pressed",String(marked));
   weekButton.textContent=marked?"Week 03 Evidence Prepared ✓":ok?"Mark Week 03 Evidence Prepared":"Complete Days 11–15 before preparing Week 03 evidence";
   weekButton.title=ok?"This records prepared evidence, not a passing grade.":"Five daily records, including Day 15 review submission, are required.";
  }
  weekButton.addEventListener("click",()=>{
   if(!ready||frozen||!allReady())return;
   const next=Object.assign({},progress,{"week-03":true});
   if(write(progressKey,JSON.stringify(next))){progress=next;syncWeekButton();}
  });
  syncWeekButton();
 }
 const draft=document.querySelector('[data-save-field="week-03-day15-draft1"]');
 if(draft){
  const key=scoped("khae-ela9-field:week-03-day15-draft1-locked-v1");
  const raw=key?read(key):null;
  if(raw){try{
   const lock=JSON.parse(raw);if(!lock||typeof lock.text!=="string"||!lock.text)throw Error("invalid lock");
   draft.value=lock.text;draft.readOnly=true;
  }catch{freeze("Original independent draft lock is damaged.");}}
 }
 return;
}
if(day===15){
 const items=Object.fromEntries(writing.map(field=>[field.dataset.saveField,field]));
 const getField=suffix=>items["week-03-day15-"+suffix];
 const draft=getField("draft1"),final=getField("final"),conventions=getField("conventions"),revision=getField("revision");
 const lockKey=scoped("khae-ela9-field:week-03-day15-draft1-locked-v1");
 const receiptKey=scoped("khae-ela9-field:week-03-day15-review-receipt-v1");
 const dayFlag="week-03-day-15";
 const lockState=$("week3-lock-state"),countWords=s=>String(s||"").trim().split(/\s+/).filter(Boolean).length;
 let locked=lockKey?readJson(lockKey,null,obj=>obj&&obj.version===1&&typeof obj.text==="string"&&obj.text.length>0&&Number.isFinite(obj.wordCount)):null;
 let receipt=receiptKey?readJson(receiptKey,null,obj=>obj&&obj.schema==="english9-week03-review-v1"&&typeof obj.submittedAt==="string"):null;
 const independent=$("week3-independent"),ack=$("week3-acknowledge");
 window.addEventListener("storage",event=>{
  if(event.key!==receiptKey)return;
  try{
   const parsed=event.newValue?JSON.parse(event.newValue):null;
   if(parsed && parsed.schema!=="english9-week03-review-v1")throw Error("unexpected schema");
   receipt=parsed;
   snapshot.set(receiptKey,event.newValue);
   update();
  }catch{
   receipt=null;
   nextWrap.hidden=true;
   $("week3-assessment-status").textContent="Assessment record changed but could not be validated. Reload after reviewing your local backup.";
  }
 });
 const nextWrap=$("week3-next-wrap");
 function evaluatorPassed(){
  return !!receipt && receipt.schema==="english9-week03-review-v1"
   && receipt.gradeStatus==="passed" && receipt.masteryAwarded===true
   && Number.isInteger(receipt.rubricScore) && receipt.rubricScore>=8 && receipt.rubricScore<=10
   && typeof receipt.evaluatedBy==="string" && receipt.evaluatedBy.trim().length>0
   && typeof receipt.evaluatedAt==="string" && !Number.isNaN(Date.parse(receipt.evaluatedAt));
 }
 function refreshAssessmentNext(){
  const passed=!!(ready&&!frozen&&evaluatorPassed());
  nextWrap.hidden=!passed;
  if(passed)$("week3-next-status").textContent="Evaluator-recorded mastery · "+receipt.rubricScore+"/10";
 }
 function updateCounts(){
  const wc1=countWords(draft.value),wc2=countWords(final.value);
  $("week3-draft1-count").textContent=wc1+" words · required 450–650";
  $("week3-final-count").textContent=wc2+" words · required 450–650";
 }
 function setLockView(){
  if(locked){
   if(draft.value!==locked.text){freeze("Original Draft 1 differs from its locked copy.");}
   draft.value=locked.text;
   draft.readOnly=true;
   lockState.textContent="Draft 1 preserved at "+new Date(locked.at).toLocaleString()+". Original locked; final draft is separate.";
   $("week3-lock-draft").disabled=true;
  }else{
   $("week3-lock-draft").disabled=!ready||frozen;
   lockState.textContent="Draft 1 has not been locked. Complete it independently before final revision.";
  }
  final.readOnly=!ready||frozen||!locked;
 }
 function conventionsCount(){
  const lines=String(conventions.value).split(/\n/);
  return new Set(lines.map(line=>line.trim().match(/^(10|[1-9])\s*[\).:\-]\s*\S/)?.[1]).filter(Boolean)).size;
 }
 function prepared(){
  return !!locked && countWords(locked.text)>=450&&countWords(locked.text)<=650
    &&countWords(final.value)>=450&&countWords(final.value)<=650
    &&conventionsCount()>=10&&revision.value.trim().length>0
    &&independent.checked&&ack.checked;
 }
 function update(){
  updateCounts();
  const has=!!progress[dayFlag];
  $("week3-finish").disabled=!ready||frozen||!prepared()||evaluatorPassed();
  refreshAssessmentNext();
  const reasons=[];
  if(!locked)reasons.push("preserve independent Draft 1");
  else if(locked.wordCount<450||locked.wordCount>650)reasons.push("original draft must meet 450–650 words");
  if(countWords(final.value)<450||countWords(final.value)>650)reasons.push("final analysis must be 450–650 words");
  if(conventionsCount()<10)reasons.push("record 10 numbered conventions corrections");
  if(!revision.value.trim())reasons.push("explain the revision");
  if(!independent.checked||!ack.checked)reasons.push("complete both declarations");
  $("week3-finish-hint").textContent=reasons.length?"Before review submission: "+reasons.join("; ")+".":
    "Evidence is ready for evaluator review. This is NOT an automatic 8/10 mastery judgment.";
  $("week3-assessment-status").textContent=evaluatorPassed()
  ?"Evaluator recorded "+receipt.rubricScore+"/10 on "+new Date(receipt.evaluatedAt).toLocaleString()+". Continue button unlocked."
  :receipt?"Evidence submitted for review on "+new Date(receipt.submittedAt).toLocaleString()+". Awaiting evaluator review; not automatically passed."
  :"No assessment submission recorded yet.";
 }
 $("week3-lock-draft").addEventListener("click",()=>{
  if(!ready||frozen||locked)return;
  const words=countWords(draft.value);
  if(words<450||words>650){
   lockState.textContent="Draft 1 must contain 450–650 words before being preserved.";return;
  }
  const copy={version:1,text:draft.value,wordCount:words,at:new Date().toISOString()};
  if(write(lockKey,JSON.stringify(copy))){locked=copy;setLockView();update();}
 });
 [draft,final,conventions,revision].forEach(field=>field.addEventListener("input",update));
 independent.addEventListener("change",update);ack.addEventListener("change",update);
 $("week3-finish").addEventListener("click",()=>{
  if(!ready||frozen||!prepared()||evaluatorPassed())return;
  const document={schema:"english9-week03-review-v1",submittedAt:new Date().toISOString(),
   learnerId:profile.learnerId,day:15,independentDraftWordCount:locked.wordCount,
   finalWordCount:countWords(final.value),conventionsEntered:conventionsCount(),
   gradeStatus:"awaiting-evaluator",masteryAwarded:false};
  if(!write(receiptKey,JSON.stringify(document)))return;
  receipt=document;
  const next=Object.assign({},progress,{[dayFlag]:true});
  if(!write(progressKey,JSON.stringify(next)))return;
  progress=next;update();updateIndex();
 });
 $("week3-export").addEventListener("click",()=>{
  const response={};writing.forEach(field=>response[field.dataset.saveField]=field.value);
  const payload={schema:"english9-week03-day15-backup-v1",learnerId:profile?.learnerId||null,
   exportedAt:new Date().toISOString(),responses:response,lockedDraft:locked,reviewReceipt:receipt,
   evidencePrepared:!!progress[dayFlag],containsUnsavedDrafts:frozen,masteryAwarded:false};
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
  const a=document.createElement("a");a.href=url;a.download="english9-week03-day15-backup.json";
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1400);
 });
 setLockView();update();return;
}

const nextWrap=$("week3-next-wrap");
function refreshFormativeNext(){
 nextWrap.hidden=!(ready&&!frozen&&practice.best>=80);
 if(!nextWrap.hidden)$("week3-next-status").textContent="Practice passed · Best score: "+practice.best+"%";
}
const bank=(()=>{try{
 const parsed=JSON.parse($("week3-questions-data").textContent);
 if(parsed.day!==day||!Array.isArray(parsed.questions)||parsed.questions.length!==5)throw Error("wrong day");
 return parsed.questions;
 }catch{freeze("Formative question bank is missing or damaged.");return [];}
})();
const practiceKey=scoped("khae-ela9-field:week-03-day"+day+"-exercise-v1");
let practice={version:1,best:0,latest:0,attemptCount:0,attempts:[]};
if(practiceKey)practice=readJson(practiceKey,practice,x=>x&&typeof x==="object"&&Array.isArray(x.attempts)&&
 Number.isFinite(x.best)&&Number.isFinite(x.latest)&&Number.isInteger(x.attemptCount));
const feedback=[];
bank.forEach((q,i)=>{
 const fieldset=document.createElement("fieldset");fieldset.className="practice-question";
 const legend=document.createElement("legend");legend.textContent=(i+1)+". "+q.question;fieldset.append(legend);
 q.options.forEach((option,j)=>{
  const label=document.createElement("label"),input=document.createElement("input");
  input.type="radio";input.name="w2q-"+i;input.value=String(j);
  label.append(input,document.createTextNode(" "+option));fieldset.append(label);
 });
 const out=document.createElement("p");out.className="practice-feedback";out.setAttribute("aria-live","polite");
 feedback.push(out);fieldset.append(out);$("week3-questions").append(fieldset);
});
function scoreLabel(){$("week3-score").textContent=practice.attemptCount?
 "Formative · latest "+practice.latest+"% · best "+practice.best+"% · "+practice.attemptCount+" attempt(s)":
 "Formative only · 5 questions · 4 correct answers earns 80% practice readiness.";}
scoreLabel();
refreshFormativeNext();
$("week3-check").disabled=!ready;
$("week3-check").addEventListener("click",()=>{
 if(!ready||frozen||bank.length!==5)return;
 const answers=[],count=bank.reduce((total,q,i)=>{
  const checked=document.querySelector('input[name="w2q-'+i+'"]:checked');
  if(!checked){answers.push(null);return total;}
  const ans=Number(checked.value);answers.push(ans);return total+Number(ans===q.answer);
 },0);
 if(answers.includes(null)){$("week3-score").textContent="Choose an answer for every question before checking.";return;}
 const score=Math.round(100*count/bank.length),next={
  version:1,best:Math.max(practice.best,score),latest:score,attemptCount:practice.attemptCount+1,
  attempts:practice.attempts.concat([{at:new Date().toISOString(),score,answers}]).slice(-30)
 };
 if(!write(practiceKey,JSON.stringify(next)))return;
 practice=next;
 feedback.forEach((el,i)=>{
  const ok=answers[i]===bank[i].answer;
  el.className="practice-feedback "+(ok?"good":"bad");
  el.textContent=(ok?"Correct. ":"Review. ")+bank[i].explanation;
 });
 scoreLabel();refreshFormativeNext();refreshFinish();
});
const lab=$("week3-lab"),pieces=lab?Array.from(lab.querySelectorAll("[data-workshop-part]")):[];
function preview(){
 if(pieces.length!==4||pieces.some(f=>!f.value.trim())){
  $("week3-preview-result").textContent="Write your own responses for all four parts first.";return null;
 }
 const content=pieces.map(f=>f.dataset.workshopPart+": "+f.value.trim()).join("\n");
 $("week3-preview-result").textContent=content;return content;
}
$("week3-preview").disabled=!ready;
$("week3-insert").disabled=!ready;
$("week3-preview").addEventListener("click",preview);
$("week3-insert").addEventListener("click",()=>{
 if(!ready||frozen)return;
 const draft=preview();if(!draft)return;
 const destination=writing.find(f=>f.dataset.saveField===lab.dataset.targetField);
 if(!destination){freeze("The lesson writing field cannot be found.");return;}
 if(destination.value.includes(draft)){
  $("week3-preview-result").textContent="This exact draft is already in your saved lesson response.";return;
 }
 destination.value=(destination.value.trim()?destination.value.trim()+"\n\n":"")+draft;
 destination.dispatchEvent(new Event("input",{bubbles:true}));
 if(!frozen)$("week3-preview-result").textContent="Added to your existing saved lesson response:\n\n"+draft;
});
const paper=$("week3-paper"),finish=$("week3-finish"),key=dailyKey(day);
function complete(){return practice.best>=80&&(paper.checked||writing.every(f=>f.value.trim().length>0));}
function refreshFinish(){
 finish.disabled=!ready||frozen||!complete()||!!progress[key];
 $("week3-finish-hint").textContent=progress[key]?
  "Daily evidence prepared. This does not confer a course grade or replace the independent Day 10 8/10 rubric.":
  "Finish the 80% practice check and save the original writing response (or preserve all of it on paper). Teacher review remains separate.";
}
paper.addEventListener("change",refreshFinish);
finish.addEventListener("click",()=>{
 if(!complete()||!ready||frozen)return;
 const update=Object.assign({},progress,{[key]:true});
 if(write(progressKey,JSON.stringify(update))){progress=update;refreshFinish();updateIndex();}
});
$("week3-export").addEventListener("click",()=>{
 const responses={};writing.forEach(field=>responses[field.dataset.saveField]=field.value);
 const payload={schema:"english9-week03-daily-v1",day,exportedAt:new Date().toISOString(),
  learnerId:profile?.learnerId||null,responses,practice,evidencePrepared:!!progress[key],
  containsUnsavedDrafts:frozen,paperEvidence:paper.checked};
 const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
 const a=document.createElement("a");a.href=url;a.download="english9-week03-day"+day+"-backup.json";
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
});
refreshFinish();
})();

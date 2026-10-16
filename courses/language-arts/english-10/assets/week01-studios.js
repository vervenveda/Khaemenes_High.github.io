/* English II Week 01 studio: one canonical learner-scoped state, no libraries or network. */
(function(){
"use strict";
const bridge=window.KhaemenesEnglish10Week01Bridge,entry=window.KhaemenesCourseEntryContract;
const day=document.body.dataset.english10Week01Day||"",days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const $=id=>document.getElementById(id);
if(!bridge)return;
const learner=entry?.readAcademyProfile?.();
const learnerReady=!!learner?.learnerId;
const key=day.toLowerCase();
const mark="studio-"+key;
const clone=()=>bridge.read();
const pass=(w,d)=>!!(w.studios&&w.studios[d]&&Number.isFinite(w.studios[d].best)&&w.studios[d].best>=80);
function write(update,messageEl){
 if(!learnerReady){if(messageEl)messageEl.textContent="Choose an Academy learner before recording progress.";return false;}
 const next=clone();next.studios ||= {};
 if(!update(next))return false;
 const ok=bridge.commit(next);
 if(!ok&&messageEl)messageEl.textContent="Not saved. Another tab or a learner change may have paused saving. Export your work before reloading.";
 return ok;
}
function exportData(){
 const snapshot=clone(),response={schema:"english10-week01-studio-backup-v1",day:day||"hub",
  learnerId:learner?.learnerId||null,date:new Date().toISOString(),
  week:snapshot,learnerScoped:true};
 const blob=new Blob([JSON.stringify(response,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="english10-week01-"+(key||"hub")+"-backup.json";
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),900);
}
function allComplete(w){
 // Legacy learner completions remain valid after the new studios are added.
 // Newly prepared days are still awarded only after their own 80% practice.
 return days.every(d=>w.days?.[d])&&bridge.score()>=80;
}
function hubSync(){
 const w=clone(),met=allComplete(w),indicator=$("ela10-w01-week-status"),next=$("ela10-w01-week-next");
 if(indicator)indicator.textContent=!learnerReady?"Select an Academy learner to save work.":
 "Daily evidence: "+days.filter(d=>w.days?.[d]).length+"/5 · Weekly quiz best: "+(bridge.score()??"Not taken")+"% · "+(met?"Ready for Week 02":"Finish five daily studios and pass the weekly quiz at 80%.");
 if(next)next.hidden=!met;
 const master=document.querySelector('[data-progress-key="week-01"][data-english10-studio-managed="week01"]');
 if(master){master.disabled=true;master.textContent=met?"Week 01 Mastery Complete ✓":"Week 01 · Complete daily evidence and 80% weekly quiz";}
 days.forEach(d=>{
  const el=document.querySelector('[data-english10-day-state="'+d+'"]');
  if(el)el.textContent=w.days?.[d]?"Evidence prepared ✓":pass(w,d.toLowerCase())?"Practice passed; preserve evidence":"Not yet prepared";
 });
}
if(!day){hubSync();document.querySelector('[data-quiz-form]')?.addEventListener("submit",()=>setTimeout(hubSync,0));
 window.addEventListener("storage",hubSync);return;}
if(!days.includes(day))return;
const bankNode=$("ela10-w01-bank"),form=$("ela10-w01-quiz"),status=$("ela10-w01-status"),
 score=$("ela10-w01-score"),result=$("ela10-w01-result"),next=$("ela10-w01-next"),
 prep=$("ela10-w01-prepared"),evidence=$("ela10-w01-evidence"),paper=$("ela10-w01-paper");
if(!form||!bankNode||!status||!result||!next||!prep||!evidence)return;
let questions=[];
try{const parsed=JSON.parse(bankNode.textContent);if(!Array.isArray(parsed)||parsed.length!==5||
 !parsed.every(q=>q&&typeof q.question==="string"&&Array.isArray(q.choices)&&q.choices.length===3&&
 Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3&&typeof q.explanation==="string"))throw Error("invalid quiz");
 questions=parsed;}catch{status.textContent="Practice questions unavailable. Keep your original work; no scores were changed.";form.hidden=true;return;}
const qbox=$("ela10-w01-questions"),feedback=[];
questions.forEach((q,i)=>{
 const fs=document.createElement("fieldset"),legend=document.createElement("legend"),note=document.createElement("p");
 legend.textContent=(i+1)+". "+q.question;fs.appendChild(legend);
 q.choices.forEach((choice,j)=>{
  const label=document.createElement("label"),radio=document.createElement("input");
  radio.type="radio";radio.name="studio-"+key+"-"+i;radio.value=String(j);
  label.appendChild(radio);label.appendChild(document.createTextNode(" "+choice));fs.appendChild(label);
 });
 note.className="ela10-w01-feedback";note.setAttribute("aria-live","polite");fs.append(note);feedback.push(note);qbox.append(fs);
});
function render(){
 const w=clone(),rec=w.studios?.[key],best=Number(rec?.best||0),ok=pass(w,key);
 const evidenceReady=(evidence.value.trim().length>=30)||!!paper?.checked;
 const legacy=!!w.days?.[day]&&!w.studios?.[key]&&bridge.score()>=80;
 const mastered=ok||legacy;
 const preserved=!!w.days?.[day]&&mastered;
 status.textContent=!learnerReady?"Select an Academy learner; the studio is read-only for progress until then.":
 preserved?"Your practice and independent evidence are recorded for this learner.":
 ok?"Practice passed. Continue immediately, and preserve your writing as evidence.":
 "Five formative questions · Four correct (80%) unlocks the next lesson.";
 if(score)score.textContent=rec?.attempts?.length?"Best "+best+"% · "+rec.attempts.length+" attempt(s)":"No practice score yet.";
 if(day!=="Friday"){next.hidden=!mastered;prep.disabled=!learnerReady||!ok||!evidenceReady||preserved;}
 else{
  const full=allComplete(w),weeklyScore=bridge.score();
  next.hidden=!full;
  prep.disabled=!learnerReady||!ok||!evidenceReady||preserved;
  const extra=$("ela10-w01-weekly-note");
  if(extra)extra.textContent="Official weekly quiz best: "+(weeklyScore??"Not taken")+"% · "+(full?"Week 02 unlocked.":"Finish daily evidence and pass the original weekly quiz at 80%.");
 }
 const button=form.querySelector('button[type="submit"]');
 if(button)button.disabled=!learnerReady;
}
form.addEventListener("submit",event=>{
 event.preventDefault();
 if(!learnerReady)return;
 let answers=questions.map((q,i)=>form.querySelector('input[name="studio-'+key+'-'+i+'"]:checked'));
 if(answers.some(x=>!x)){result.textContent="Answer all five questions before checking your work.";return;}
 const selected=answers.map(x=>Number(x.value)),correct=selected.filter((v,i)=>v===questions[i].answer).length,pct=correct*20;
 const ok=write(w=>{
  const prev=w.studios[key]||{best:0,attempts:[]};
  w.studios[key]={best:Math.max(prev.best||0,pct),attempts:[...(Array.isArray(prev.attempts)?prev.attempts:[]),
   {at:new Date().toISOString(),score:pct,answers:selected}].slice(-25)};
  return true;
 },result);
 if(!ok)return;
 feedback.forEach((el,i)=>{el.textContent=(selected[i]===questions[i].answer?"Correct. ":"Review. ")+questions[i].explanation;});
 result.textContent="Your formative result: "+pct+"%. "+(pct>=80?"Next lesson is available.":"Review your evidence and try again.");
 render();
});
prep.addEventListener("click",()=>{
 if(!pass(clone(),key)||!(evidence.value.trim().length>=30||paper.checked))return;
 if(write(w=>{w.days ||= {};w.days[day]=true;return true;},status))render();
});
evidence.addEventListener("input",render);paper?.addEventListener("change",render);
$("ela10-w01-export")?.addEventListener("click",exportData);
const check=document.querySelector('[data-week-day="'+day+'"][data-english10-studio-managed="week01"]');
function syncCheckbox(){if(check)check.checked=!!clone().days?.[day];}
function tick(){render();syncCheckbox();}
document.querySelector('[data-quiz-form]')?.addEventListener("submit",()=>setTimeout(tick,0));
window.addEventListener("storage",event=>{
 if(event.key==="khaemenes_active_learner_v1") {
  form.querySelector('button[type="submit"]').disabled=true;
  prep.disabled=true;next.hidden=true;
  status.textContent="Learner changed in another tab; export your work and reload.";
 }else tick();
});
tick();
})();

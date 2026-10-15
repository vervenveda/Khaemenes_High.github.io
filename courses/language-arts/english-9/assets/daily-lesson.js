
(function(){
 "use strict";
 var contract=window.KhaemenesCourseEntryContract;
 var day=Number(document.body.getAttribute("data-english9-day")||0);
 var hub=document.querySelector("[data-english9-daily-index]");
 function scoped(base,profile){return contract&&contract.scopedKey?contract.scopedKey(base,profile):base;}
 function getProfile(){return contract&&contract.readAcademyProfile?contract.readAcademyProfile():null;}
 function readProgress(profile){
   try{var raw=localStorage.getItem(scoped("khae-ela9-progress-v1",profile));var parsed=JSON.parse(raw||"{}");
     if(!parsed||typeof parsed!=="object"||Array.isArray(parsed)||Object.values(parsed).some(function(v){return typeof v!=="boolean";}))return null;
     return parsed;
   }catch(e){return null;}
 }
 function indexUpdate(){
   if(!hub)return;
   var profile=getProfile(),progress=profile?readProgress(profile):null;
   hub.querySelectorAll("[data-daily-status]").forEach(function(el){
     var num=String(el.getAttribute("data-daily-status")).padStart(2,"0");
     el.textContent=progress? (progress["week-01-day-"+num]?"Evidence prepared ✓":"Not yet prepared"):"Select learner to see progress";
   });
 }
 if(hub){indexUpdate();window.addEventListener("storage",indexUpdate);}
 if(!day)return;
 var profile=getProfile(),id=profile?profile.learnerId:null;
 var identity=localStorage.getItem("khaemenes_active_learner_v1");
 var r=profile&&contract&&contract.readJSON?contract.readJSON("khaemenes-english9-readiness-v1",null,profile):null;
 var ready=!!(profile&&contract&&contract.isReady&&contract.isReady(r,["close_reading_evidence","language_conventions","source_argument"],"english-9"));
 var status=document.getElementById("daily-status");
 var gate=document.getElementById("daily-gate");
 var fields=Array.from(document.querySelectorAll("[data-save-field]"));
 var snapshot=new Map(),frozen=false;
 var prefix="khae-ela9-field:",num=String(day).padStart(2,"0");
 var practiceKey=scoped(prefix+"week-01-day"+day+"-exercise-v1",profile);
 var progressKey=scoped("khae-ela9-progress-v1",profile);
 var baselineKey=scoped(prefix+"week-01-baseline-snapshot",profile);
 var progress={};var attempts={version:1,best:0,latest:0,attemptCount:0,attempts:[]};
 function alertSave(message){frozen=true;status.textContent="Saving paused: "+message+" Keep this page open and export your current writing before reloading.";status.classList.add("daily-warning");status.setAttribute("role","alert");}
 function read(key){
   if(!profile){snapshot.set(key,null);return null;}
   try{var value=localStorage.getItem(key);snapshot.set(key,value);return value;}
   catch(e){alertSave("Browser storage could not be read.");return null;}
 }
 function write(key,value){
   if(frozen||!ready)return false;
   try{
     if(localStorage.getItem("khaemenes_active_learner_v1")!==identity){alertSave("The selected learner changed.");return false;}
     if(localStorage.getItem(key)!==snapshot.get(key)){alertSave("This record changed in another tab.");return false;}
     localStorage.setItem(key,value);snapshot.set(key,value);status.textContent="Saved on this device · "+new Date().toLocaleTimeString();return true;
   }catch(e){alertSave("Browser storage is full or unavailable.");return false;}
 }
 function parseRecord(raw,fallback){
   if(raw===null)return fallback;
   try{return JSON.parse(raw);}catch(e){alertSave("A saved record is unreadable and was not overwritten.");return fallback;}
 }
 fields.forEach(function(field){
   var key=scoped(prefix+field.dataset.saveField,profile);
   field.value=read(key)||"";
   field.addEventListener("input",function(){write(key,field.value);checkFinish();});
 });
 attempts=parseRecord(read(practiceKey),attempts);
 progress=parseRecord(read(progressKey),{});
 if(!progress||typeof progress!=="object"||Array.isArray(progress)||Object.values(progress).some(function(v){return typeof v!=="boolean";})){
   alertSave("Course progress needs recovery.");progress={};
 }
 var exercise;
 try{exercise=JSON.parse(document.getElementById("daily-exercise-data").textContent);}
 catch(e){alertSave("Practice data could not load.");exercise={items:[]};}
 var questions=document.getElementById("daily-questions");
 (exercise.items||[]).forEach(function(q,i){
   var fs=document.createElement("fieldset");fs.className="practice-question";
   var legend=document.createElement("legend");legend.textContent=(i+1)+". "+q.question;fs.append(legend);
   q.choices.forEach(function(choice,j){
     var label=document.createElement("label"),radio=document.createElement("input");
     radio.type="radio";radio.name="exercise-"+i;radio.value=String(j);label.append(radio,document.createTextNode(" "+choice));fs.append(label);
   });
   var feedback=document.createElement("p");feedback.className="practice-feedback";feedback.setAttribute("aria-live","polite");fs.append(feedback);questions.append(fs);
 });
 var pscore=document.getElementById("daily-practice-score");
 function updateScore(){pscore.textContent=attempts.attemptCount?"Best formative practice: "+attempts.best+"% · Attempts: "+attempts.attemptCount:"Practice is not graded for course credit. Aim for 80% and try again as needed.";}
 updateScore();
 document.getElementById("check-practice").addEventListener("click",function(){
   var responses=[],correct=0,complete=true;
   (exercise.items||[]).forEach(function(q,i){
     var checked=document.querySelector('input[name="exercise-'+i+'"]:checked');
     if(!checked){complete=false;return;}responses.push(Number(checked.value));if(Number(checked.value)===q.answer)correct++;
   });
   if(!complete){pscore.textContent="Answer every practice question before checking.";return;}
   var score=Math.round(100*correct/exercise.items.length);
   var next={version:1,best:Math.max(Number(attempts.best)||0,score),latest:score,attemptCount:(Number(attempts.attemptCount)||0)+1,attempts:(attempts.attempts||[]).concat([{date:new Date().toISOString(),score:score,answers:responses}]).slice(-30)};
   if(!write(practiceKey,JSON.stringify(next)))return;
   attempts=next;
   exercise.items.forEach(function(q,i){
     var el=questions.querySelectorAll(".practice-feedback")[i],ok=responses[i]===q.answer;
     el.className="practice-feedback "+(ok?"good":"bad");
     el.textContent=(ok?"Correct. ":"Review. ")+q.explanation;
   });
   updateScore();checkFinish();
 });
 var paper=document.getElementById("daily-paper-evidence");
 paper.addEventListener("change",checkFinish);
 var evidenceKey="week-01-day-"+num;
 var evidenceButton=document.getElementById("daily-evidence-button");
 function isComplete(){return Number(attempts.best)>=80&&(paper.checked||fields.every(function(f){return f.value.trim().length>0;}))&&(day!==1||paper.checked||!!baselineSaved);}
 function checkFinish(){
   evidenceButton.disabled=!ready||frozen||!isComplete()||!!progress[evidenceKey];
   document.getElementById("daily-evidence-hint").textContent=progress[evidenceKey]?
     "Daily evidence prepared. Keep working and use the Week 1 hub to review the entire week.":
     "To prepare this day's evidence: complete the short practice to 80% and write in every response field, or confirm that the responses are preserved on paper. This does not award mastery.";
 }
 evidenceButton.addEventListener("click",function(){
   if(!isComplete()||frozen||!ready)return;
   var next=Object.assign({},progress);next[evidenceKey]=true;
   if(write(progressKey,JSON.stringify(next))){progress=next;checkFinish();}
 });
 
 // The Day 4 composer never grades writing and never stores a parallel essay.
 // It appends student-authored text through the exact original field's input handler.
 if(day===4){
   var composerPanel=document.getElementById("daily-claim-builder");
   if(composerPanel){
     var cClaim=document.getElementById("composer-claim"),cEvidence=document.getElementById("composer-evidence"),
       cReason=document.getElementById("composer-reason"),cOutput=document.getElementById("composer-output");
     function compose(){
       if(!cClaim.value.trim()||!cEvidence.value.trim()||!cReason.value.trim()){
         cOutput.textContent="Complete all three parts in your own words before assembling the analysis.";return null;
       }
       var draft="Claim: "+cClaim.value.trim()+"\nEvidence: "+cEvidence.value.trim()+"\nReasoning and limitation: "+cReason.value.trim();
       cOutput.textContent=draft;return draft;
     }
     document.getElementById("composer-preview").addEventListener("click",compose);
     document.getElementById("composer-append").addEventListener("click",function(){
       var draft=compose();if(!draft||!ready||frozen)return;
       var field=fields.find(function(f){return f.dataset.saveField==="week-01-day4-plan";});
       if(!field)return;
       if(field.value.includes(draft)){cOutput.textContent="This same passage is already in your Day 4 plan.";return;}
       field.value=(field.value.trim()?field.value.trim()+"\n\n":"")+draft;
       field.dispatchEvent(new Event("input",{bubbles:true}));
       if(!frozen)cOutput.textContent="Added to your original Day 4 plan and saved on this device.\n\n"+draft;
     });
   }
 }

 var baselineSaved=false;
 var baseline=document.getElementById("preserve-baseline");
 if(day===1&&baseline){
   var current=read(baselineKey),snap=document.getElementById("baseline-copy"),bs=document.getElementById("baseline-status");baselineSaved=!!current;
   function showBaseline(){snap.textContent=current||"";bs.textContent=current?"Original baseline preserved. Changes to your draft will not replace it.":"Preserve your original response before revising.";baseline.disabled=!!current||!ready||frozen;}
   showBaseline();
   baseline.addEventListener("click",function(){
     var field=fields.find(function(f){return f.dataset.saveField==="week-01-day1-baseline";});
     if(!field||!field.value.trim()){bs.textContent="Write your baseline before preserving it.";return;}
     if(write(baselineKey,field.value)){current=field.value;baselineSaved=true;showBaseline();checkFinish();}
   });
 }
 function saveFile(name,data){
   var blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
   a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1500);
 }
 document.getElementById("daily-export").addEventListener("click",function(){
   var writing={};fields.forEach(function(f){writing[f.dataset.saveField]=f.value;});
   saveFile("english9-week01-day"+num+"-backup.json",{schema:"english9-daily-lesson-v1",exportedAt:new Date().toISOString(),learnerId:id,day:day,writing:writing,practice:attempts,evidencePrepared:!!progress[evidenceKey],containsUnsavedDrafts:frozen,paperEvidence:paper.checked});
 });
 window.addEventListener("storage",function(event){
   if(event.key==="khaemenes_active_learner_v1"||snapshot.has(event.key)){alertSave("The learner or a saved field changed in another tab.");checkFinish();}
 });
 if(!ready){
   gate.hidden=false;gate.textContent=profile?"English 9 readiness is required before saving official Week 1 work. ":"Select your Academy learner before saving this lesson. ";
   var a=document.createElement("a");a.href=profile?"../../../assessments/diagnostic/index.html":"https://vervenveda.github.io/Khaemenes_Academy.github.io/";a.textContent=profile?"Open English 9 readiness":"Open Academy learner portal";gate.append(a);
   fields.forEach(function(f){f.readOnly=true;});document.getElementById("check-practice").disabled=true;
   if(baseline)baseline.disabled=true;
   status.textContent="Read-only preview: select learner and complete readiness to save.";
 }else if(!frozen){status.textContent="Workspace ready · Records stay with this Academy learner on this device.";}
 checkFinish();
})();

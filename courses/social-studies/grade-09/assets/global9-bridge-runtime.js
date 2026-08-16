(() => {
"use strict";
const cfg=window.__KHAEMENES_GLOBAL9_BRIDGE__||{mode:"preview",nickname:"Preview Scholar",record:null};
const RECORDS_KEY="khaemenes_globalstudies9_records_by_learner_v1";
const PASS=80;
const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const FRIENDLY="You’re almost there. This activity opens when the earlier learning step is complete. Finish the current lesson or reach 80% mastery on the required check, then come back — your progress is saved.";
const r=cfg.record||{};
const student={id:cfg.mode==="formal"?cfg.learnerId:"preview",name:cfg.nickname||"Scholar",created:r.created||new Date().toISOString(),progress:r.progress||{weeks:{},exams:{},capstone:{logs:[]}}};
state={students:[student],activeId:student.id};
APP.passingTarget=PASS;

save=function(){if(cfg.mode!=="formal")return;try{const raw=localStorage.getItem(RECORDS_KEY),records=raw?JSON.parse(raw):{};records[cfg.learnerId]={name:cfg.nickname,created:student.created,progress:student.progress,updatedAt:new Date().toISOString()};localStorage.setItem(RECORDS_KEY,JSON.stringify(records))}catch{}};
if(typeof addStudent==="function")addStudent=function(){};
if(typeof demo==="function")demo=function(){};
if(typeof del==="function")del=function(){};

const studentPanel=document.querySelector(".panel");
if(studentPanel){const n=document.createElement("div");n.className="notice";n.textContent=cfg.mode==="formal"?"Academy Family Profile active · Grade 09 learner-scoped honors record · 80% mastery progression":"Preview mode · exploration is temporary and does not alter formal Grade 09 records";studentPanel.replaceChildren(n)}

function remind(detail){alert(detail?FRIENDLY+"\n\n"+detail:FRIENDLY)}
function weekMastered(n){return cfg.mode!=="formal"||(lp(student,n)===100&&ap(student,n)===100&&qb(student,n)>=PASS)}
function midtermMastered(){return Number(student.progress.exams?.midterm?.best||0)>=PASS}
function weekUnlocked(n){if(cfg.mode!=="formal"||n<=1)return true;if(n>=19&&!midtermMastered())return false;for(let i=1;i<n;i++)if(!weekMastered(i))return false;return true}
function dayUnlocked(n,day){if(cfg.mode!=="formal")return true;if(!weekUnlocked(n))return false;const idx=DAYS.indexOf(day);if(idx<=0)return true;const p=wp(student,n);return DAYS.slice(0,idx).every(d=>Boolean(p.lessons[d]))}
function assignmentUnlocked(n,index){if(cfg.mode!=="formal")return true;const p=wp(student,n),prerequisiteDay=["Tuesday","Wednesday","Thursday"][index-1];return Boolean(p.lessons[prerequisiteDay])}
function weeklyEvidenceReady(n){const p=wp(student,n);return DAYS.every(d=>Boolean(p.lessons[d]))&&[1,2,3].every(i=>Boolean(p.assignments[i]))}
function masteredThrough(end){for(let i=1;i<=end;i++)if(!weekMastered(i))return false;return true}

const gateStyle=document.createElement("style");
gateStyle.textContent=".khaeGate{border:1px dashed rgba(216,180,95,.62);border-radius:14px;padding:15px;margin:10px 0;background:rgba(216,180,95,.08)}.khaeGate strong{display:block;margin-bottom:6px}.weekButton[aria-disabled=true]{opacity:.55}.weekButton[aria-disabled=true] .pill::before{content:'🔒 ';}.lesson[data-khae-locked=true],.assignment[data-khae-locked=true]{opacity:.58}";
document.head.appendChild(gateStyle);

const originalWeekList=weekList;
weekList=function(){originalWeekList();document.querySelectorAll(".weekButton").forEach((btn,i)=>{const n=i+1;btn.dataset.week=String(n);if(cfg.mode==="formal"&&!weekUnlocked(n)){btn.setAttribute("aria-disabled","true");btn.dataset.khaeGate=n>=19&&!midtermMastered()?"Semester II opens after Weeks 1–18 are mastered and the midterm reaches 80% or higher.":"Week "+n+" opens after every earlier week is complete and its mastery check reaches 80% or higher."}else{btn.removeAttribute("aria-disabled");delete btn.dataset.khaeGate}})};

const originalLessonCard=lessonCard;
lessonCard=function(w,d,p){if(cfg.mode==="formal"&&!dayUnlocked(w.week,d.day)){const idx=DAYS.indexOf(d.day),prior=DAYS[Math.max(0,idx-1)];return '<div class="khaeGate"><strong>🔒 '+d.day+' · '+esc(d.title)+'</strong><p>Complete '+prior+' before opening this lesson.</p><button type="button" class="secondary" data-khae-gate="Complete '+prior+' first. '+d.day+' will open automatically after that step is complete.">Why is this locked?</button></div>'}return originalLessonCard(w,d,p)};

const originalAssignments=assignments;
assignments=function(w,p){if(cfg.mode!=="formal")return originalAssignments(w,p);return w.assignments.map((a,i)=>{const idx=i+1,open=assignmentUnlocked(w.week,idx),day=["Tuesday","Wednesday","Thursday"][i];return '<div class="assignment" '+(open?'':'data-khae-locked="true"')+'><label class="check"><input id="assign_'+w.week+'_'+idx+'" type="checkbox" '+(p.assignments[idx]?'checked ':'')+(open?'':'disabled')+'> Assignment '+idx+'</label><h4>'+esc(a.title)+'</h4><p class="small">'+esc(a.type)+' · '+a.points+' pts</p><p>'+esc(a.instructions)+'</p><p class="small"><b>Evidence:</b> '+esc(a.evidence)+'</p>'+(open?'':'<button type="button" class="secondary" data-khae-gate="Assignment '+idx+' opens after the '+day+' lesson is complete.">Why is this locked?</button>')+'</div>'}).join("")};

const originalQuiz=quiz;
quiz=function(w){if(cfg.mode==="formal"&&!weeklyEvidenceReady(w.week))return '<div class="khaeGate"><strong>🔒 Weekly mastery check</strong><p>Complete all five lessons and all three evidence assignments before taking this mastery check.</p><button type="button" class="secondary" data-khae-gate="Finish the five lesson steps and three evidence assignments for Week '+w.week+'. Then the mastery check will open.">Why is this locked?</button></div>';return originalQuiz(w)};

const originalSubmitQuiz=submitQuiz;
submitQuiz=function(n){if(cfg.mode==="formal"&&!weeklyEvidenceReady(n)){remind("Complete all five lessons and all three evidence assignments for Week "+n+" first.");return}const result=originalSubmitQuiz(n);setTimeout(()=>{const best=qb(student,n);if(best>0&&best<PASS)remind("Your Week "+n+" best is "+best+"%. Review your evidence and reassess. Week "+(n+1)+" remains locked until you reach 80%.")},20);return result};

const originalExamForm=examForm;
examForm=function(name,qs){if(cfg.mode!=="formal")return originalExamForm(name,qs);const isMid=name==="midterm",ready=isMid?masteredThrough(18):(masteredThrough(36)&&midtermMastered());if(ready)return originalExamForm(name,qs);const detail=isMid?"The midterm opens after Weeks 1–18 are mastered at 80% or higher.":"The final opens after all 36 weeks are mastered and the midterm is 80% or higher.";return '<div class="khaeGate"><strong>🔒 '+(isMid?'Midterm':'Final')+'</strong><p>'+detail+'</p><button type="button" class="secondary" data-khae-gate="'+detail+'">Why is this locked?</button></div>'};

const originalSubmitExam=submitExam;
submitExam=function(name){if(cfg.mode==="formal"){const isMid=name==="midterm",ready=isMid?masteredThrough(18):(masteredThrough(36)&&midtermMastered());if(!ready){remind(isMid?"The midterm opens after Weeks 1–18 are mastered at 80% or higher.":"The final opens after all 36 weeks are mastered and the midterm is 80% or higher.");return}}const result=originalSubmitExam(name);if(name==="midterm"&&cfg.mode==="formal")setTimeout(()=>{const best=Number(student.progress.exams?.midterm?.best||0);if(best>0&&best<PASS)remind("Your midterm best is "+best+"%. Review and reassess. Semester II remains locked until the midterm reaches 80%.")},20);return result};

document.addEventListener("click",event=>{const gate=event.target.closest("[data-khae-gate]");if(!gate)return;event.preventDefault();event.stopImmediatePropagation();remind(gate.dataset.khaeGate||"")},true);
document.addEventListener("click",event=>{const btn=event.target.closest(".weekButton[data-week]");if(!btn||cfg.mode!=="formal")return;const n=Number(btn.dataset.week);if(!weekUnlocked(n)){event.preventDefault();event.stopImmediatePropagation();remind(btn.dataset.khaeGate||("Week "+n+" is still locked."))}},true);
window.__KHAEMENES_GLOBAL9_RUNTIME__={weekMastered,weekUnlocked,masteredThrough};
render();
})();
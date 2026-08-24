(()=>{
"use strict";

const map=window.UNIT_MAP_FALLBACK;
if(!map?.unit)return;

const MIN=Number(map?.assessment?.threshold)||Number(map?.unit?.mastery_threshold)||80;
const PROGRESS_KEY=map.unit.progress_key||"khaemenes-prealgebra-unit01-progress-v1";
const MASTERY_KEY="khaemenes-prealgebra-u01-mastery-v1";
const LESSONS=Array.isArray(map.lessons)?map.lessons:[];

function readJSON(key,fallback={}){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
function resultBest(result){if(!result||typeof result!=="object")return 0;const attempts=Array.isArray(result.attempts)?result.attempts:[];return Math.max(Number(result.best_percent)||0,Number(result.percent)||0,Number(result.latest_percent)||0,...attempts.map(attempt=>Number(attempt?.percent)||0))}
function progress(){return readJSON(PROGRESS_KEY,{})}
function bestFor(id){const p=progress();return Math.max(Number(p.lessonBestScores?.[id])||0,Number(p.lessonScores?.[id])||0)}
function allLessonsMastered(){return LESSONS.length>0&&LESSONS.every(lesson=>bestFor(lesson.id)>=MIN)}
function masteryBest(){return resultBest(readJSON(MASTERY_KEY,null))}
function unitReady(){return allLessonsMastered()&&masteryBest()>=MIN}
function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}

function addStyles(){
  if(document.getElementById("unit1StudentWorkroomStyles"))return;
  const style=document.createElement("style");
  style.id="unit1StudentWorkroomStyles";
  style.textContent=`
    .daily-assignment-hub{padding:34px 0 46px!important;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(247,245,239,.98));border-bottom:1px solid var(--line,#d8d8d2)}
    .daily-assignment-card{width:min(100%,880px);margin:auto;padding:clamp(25px,5vw,46px);border:1px solid var(--line,#d8d8d2);border-radius:11px;background:var(--panel,#fff);box-shadow:0 18px 44px rgba(22,42,54,.10);text-align:center}
    .daily-kicker{margin:0 0 10px;color:var(--gold2,#8c6b2d);font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
    .daily-assignment-card h2{max-width:760px;margin:0 auto 10px;font:400 clamp(30px,5vw,52px)/1.05 Georgia,"Times New Roman",serif;color:var(--text,#111)}
    .daily-assignment-card p{max-width:720px;margin:0 auto 20px;color:var(--muted,#596269)}
    .daily-assignment-cta{width:min(100%,620px);min-height:66px;display:inline-flex;align-items:center;justify-content:center;padding:15px 24px;border:1px solid var(--gold,#b48b45);border-radius:7px;background:var(--gold,#b48b45);color:#17120a!important;text-decoration:none;font-size:clamp(17px,2.5vw,21px);font-weight:700;line-height:1.25;box-shadow:0 12px 28px rgba(22,42,54,.12)}
    .daily-assignment-meta{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:17px;color:var(--muted,#596269);font-size:12px}
    .daily-assignment-meta span{padding:6px 9px;border:1px solid var(--line,#d8d8d2);border-radius:999px;background:var(--bg2,#f6f4ef)}
    .mastery-gate-panel[hidden]{display:none!important}
    body.student-workroom .site-header .header-actions>*{display:none!important}
    body.student-workroom .site-header #studentHomeButton{display:inline-flex!important}
    body.student-workroom .breadcrumb{display:none!important}
    body.student-workroom .hero{padding:42px 0 36px!important;text-align:center}
    body.student-workroom .hero .wrap{width:min(calc(100% - 28px),980px)}
    body.student-workroom .hero .eyebrow{margin-bottom:9px!important;letter-spacing:.17em}
    body.student-workroom .hero h1{max-width:900px;margin-inline:auto}
    body.student-workroom .hero .lead{max-width:780px;margin-inline:auto}
    body.student-workroom .hero .actions{justify-content:center;margin-top:20px}
    body.student-workroom .hero .actions>*{display:none!important}
    body.student-workroom .hero .actions>a:first-child{display:inline-flex!important;min-width:min(100%,520px);min-height:58px;justify-content:center;font-size:17px}
    body.student-workroom .lesson-layout{grid-template-columns:1fr!important;max-width:980px;margin:auto}
    body.student-workroom .lesson-side{display:none!important}
    body.student-workroom #learn .lesson-main{max-width:980px;margin:auto;text-align:left}
    body.student-workroom main>section>.wrap{width:min(calc(100% - 28px),1040px)}
    body.student-workroom .section-head{max-width:840px;margin-inline:auto;text-align:center}
    body.student-workroom .lesson-nav{display:none!important}
    .daily-lesson-status{width:min(100%,920px);margin:0 auto 28px;padding:12px 16px;border:1px solid var(--line,#d8d8d2);border-radius:7px;background:var(--bg2,#f6f4ef);text-align:center;color:var(--muted,#596269);font-size:13px}
    .daily-finish-panel{width:min(100%,920px);margin:28px auto 0;padding:24px;border:1px solid var(--line,#d8d8d2);border-radius:11px;background:var(--panel,#fff);box-shadow:0 14px 32px rgba(22,42,54,.08);text-align:center}
    .daily-finish-panel h3{margin:0 0 6px;font:400 28px/1.1 Georgia,"Times New Roman",serif}
    .daily-finish-panel p{margin:0 0 16px;color:var(--muted,#596269)}
    .daily-finish-actions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}
    .daily-finish-actions .btn{min-height:48px}.daily-finish-actions #submitPractice{min-width:240px}
    .daily-recovery,.daily-success,.daily-incomplete{width:min(100%,920px);margin:18px auto 0;padding:22px;border:1px solid var(--line,#d8d8d2);border-radius:11px;background:var(--panel,#fff);text-align:left}
    .daily-recovery{border-left:4px solid var(--gold,#b48b45)}.daily-success{border-left:4px solid var(--green,#4f7657)}.daily-incomplete{border-left:4px solid var(--blue,#426f91)}
    .daily-recovery h3,.daily-success h3,.daily-incomplete h3{margin:0 0 8px;font:400 25px/1.12 Georgia,"Times New Roman",serif}
    .daily-recovery p,.daily-success p,.daily-incomplete p{color:var(--muted,#596269)}
    .daily-recovery ol{display:grid;gap:8px;padding-left:22px}.daily-recovery li{padding:8px 10px;border:1px solid var(--line,#d8d8d2);border-radius:7px;background:var(--bg2,#f6f4ef)}
    .daily-support-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.daily-success .daily-assignment-cta{width:auto;min-height:52px;font-size:16px;padding-inline:18px}
    @media(max-width:700px){.daily-assignment-hub{padding:24px 0 34px!important}.daily-assignment-card{padding:22px 16px}.daily-assignment-cta{width:100%}.daily-finish-actions,.daily-support-actions{display:grid;grid-template-columns:1fr}.daily-finish-actions .btn,.daily-support-actions .btn,.daily-support-actions a{width:100%}body.student-workroom .site-header #studentHomeButton{min-height:40px}}
    @media print{.daily-assignment-hub,.daily-lesson-status,.daily-finish-panel,.daily-recovery,.daily-success,.daily-incomplete{display:none!important}}
  `;
  document.head.appendChild(style);
}

function assignmentState(){
  const mastered=LESSONS.filter(lesson=>bestFor(lesson.id)>=MIN).length;
  const current=LESSONS.find(lesson=>bestFor(lesson.id)<MIN);
  if(current){const best=bestFor(current.id);return{kind:"lesson",title:`Lesson ${current.number} · ${current.title}`,message:best>0?`Continue today’s lesson. Your best demonstrated score is ${best}%; ${MIN}% is required for mastery.`:`This is today’s assignment. Complete the lesson and submit the practice when you are ready.`,href:current.file,label:best>0?`Continue Lesson ${current.number}`:`Begin Lesson ${current.number}`,mastered,total:LESSONS.length}}
  if(masteryBest()<MIN)return{kind:"mastery",title:"Unit 1 Mastery Check",message:`All ${LESSONS.length} daily lessons are mastered. Complete the Unit 1 mastery check at ${MIN}% or higher before the next unit appears.`,href:map.assessment?.file||"assessment/mastery-check.html",label:"Take Unit 1 Mastery Check",mastered,total:LESSONS.length};
  return{kind:"next-unit",title:"Unit 1 Complete",message:`You have mastered all ${LESSONS.length} lessons and the Unit 1 mastery check. Unit 2 is now ready.`,href:"../unit-02/",label:"Continue to Unit 2",mastered,total:LESSONS.length};
}

function renderUnitHub(){
  const hero=document.querySelector("main .hero");if(!hero)return;
  let hub=document.getElementById("dailyAssignmentHub");
  if(!hub){hub=document.createElement("section");hub.id="dailyAssignmentHub";hub.className="daily-assignment-hub";hero.insertAdjacentElement("afterend",hub)}
  const state=assignmentState();
  hub.innerHTML=`<div class="wrap"><article class="daily-assignment-card"><p class="daily-kicker">Daily Assignment</p><h2>${escapeHTML(state.title)}</h2><p>${escapeHTML(state.message)}</p><a class="daily-assignment-cta" data-current-assignment href="${escapeHTML(state.href)}">${escapeHTML(state.label)}</a><div class="daily-assignment-meta"><span>${state.mastered} of ${state.total} lessons mastered</span><span>${MIN}% mastery standard</span>${state.kind==="next-unit"?`<span>Unit mastery ${masteryBest()}%</span>`:""}</div></article></div>`;
  const heroActions=hero.querySelector(".actions");if(heroActions)heroActions.hidden=true;
  const panel=document.querySelector(".mastery-gate-panel");if(panel)panel.hidden=!unitReady();
}

function mentorURL(missed){
  const params=new URLSearchParams({stage:"high",subject:"mathematics",course:"pre-algebra",unit:"unit-01",lesson:String(window.LESSON_DATA?.number||""),topic:window.LESSON_DATA?.title||"",missed:missed.join(","),source:location.pathname});
  return `/Khaemenes_High.github.io/mentor/?${params.toString()}`;
}

function ensureLessonWorkroom(){
  const lesson=window.LESSON_DATA;if(!lesson)return;
  document.body.classList.add("student-workroom");
  const eyebrow=document.querySelector(".hero .eyebrow");if(eyebrow)eyebrow.textContent=`Daily Assignment · Lesson ${lesson.number} · ${lesson.duration||""}`;
  const begin=document.querySelector(".hero .actions a[href='#learn']");if(begin){begin.textContent="Begin Today’s Assignment";begin.setAttribute("aria-label",`Begin daily assignment: ${lesson.title}`)}
  const learn=document.getElementById("learn");
  if(learn&&!document.getElementById("dailyLessonStatus")){const status=document.createElement("div");status.id="dailyLessonStatus";status.className="daily-lesson-status";learn.querySelector(".wrap")?.prepend(status)}
  renderLessonStatus();buildFinishPanel();renderOutcome(false,false);
}

function renderLessonStatus(){
  const lesson=window.LESSON_DATA,target=document.getElementById("dailyLessonStatus");if(!lesson||!target)return;
  const best=bestFor(lesson.id);
  target.textContent=best>=MIN?`Lesson ${lesson.number} mastered · best demonstrated score ${best}% · your next step is ready.`:best>0?`Lesson ${lesson.number} is still in progress · best demonstrated score ${best}% · reach ${MIN}% to move ahead.`:`Lesson ${lesson.number} is today’s assignment · work through the lesson, then submit the practice at the end.`;
}

function buildFinishPanel(){
  const wrap=document.getElementById("practice")?.querySelector(".wrap");if(!wrap||document.getElementById("dailyFinishPanel"))return;
  const panel=document.createElement("div");panel.id="dailyFinishPanel";panel.className="daily-finish-panel";
  panel.innerHTML=`<p class="daily-kicker">End of today’s work</p><h3>Finish Today’s Assignment</h3><p>Submit your practice when every problem is answered. You may also print the lesson or download your lesson record.</p><div class="daily-finish-actions"></div><div id="dailyOutcome" aria-live="polite"></div>`;
  const actions=panel.querySelector(".daily-finish-actions"),submit=document.getElementById("submitPractice"),reset=document.getElementById("resetPractice"),print=document.getElementById("printLesson"),download=document.getElementById("exportLesson");
  if(submit){submit.textContent="Submit Daily Assignment";actions.appendChild(submit)}if(print){print.textContent="Print Lesson";actions.appendChild(print)}if(download){download.textContent="Download Lesson Record";actions.appendChild(download)}if(reset){reset.textContent="Clear Answers";actions.appendChild(reset)}
  const score=document.getElementById("scoreMessage");if(score)score.insertAdjacentElement("afterend",panel);else wrap.appendChild(panel);
}

function latestAndBest(){const lesson=window.LESSON_DATA,p=progress(),rawLatest=p.lessonLatestScores?.[lesson?.id]??p.lessonScores?.[lesson?.id],latest=Number(rawLatest);return{latest:Number.isFinite(latest)?latest:null,best:lesson?bestFor(lesson.id):0}}
function allAnswered(){const questions=window.LESSON_DATA?.questions||[];return questions.length>0&&questions.every((_,index)=>Boolean(document.querySelector(`input[name="q${index}"]:checked`)))}
function missedProblems(){const questions=window.LESSON_DATA?.questions||[],missed=[];questions.forEach((question,index)=>{const selected=document.querySelector(`input[name="q${index}"]:checked`);if(selected&&Number(selected.value)!==Number(question.answer))missed.push({number:index+1,explanation:question.explanation||"Review this skill and try the problem again."})});return missed}
function nextLessonState(){const lesson=window.LESSON_DATA,index=LESSONS.findIndex(item=>item.id===lesson?.id),next=LESSONS[index+1];if(next)return{href:next.file.split("/").pop(),label:`Continue to Lesson ${next.number}`};return{href:"../assessment/mastery-check.html",label:"Take Unit 1 Mastery Check"}}

function renderOutcome(scroll,fromSubmission){
  const outcome=document.getElementById("dailyOutcome"),lesson=window.LESSON_DATA;if(!outcome||!lesson)return;
  if(fromSubmission&&!allAnswered()){
    outcome.innerHTML=`<article class="daily-incomplete"><p class="daily-kicker">Assignment still in progress</p><h3>Finish the unanswered problems first.</h3><p>Your earlier mastery record has not been changed. Answer every problem, then submit the daily assignment again.</p></article>`;
    if(scroll)outcome.scrollIntoView({behavior:"smooth",block:"center"});return;
  }
  const {latest,best}=latestAndBest();if(latest===null){outcome.innerHTML="";return}
  const missed=missedProblems();
  if(best>=MIN){
    const next=nextLessonState(),latestNote=latest<MIN?` Your latest attempt was ${latest}%, but your previously demonstrated ${best}% mastery is preserved.`:"";
    outcome.innerHTML=`<article class="daily-success"><p class="daily-kicker">Mastery reached</p><h3>${best}% demonstrated mastery</h3><p>Your best score meets the ${MIN}% standard.${latestNote} The next required step is available.</p><a class="daily-assignment-cta" href="${escapeHTML(next.href)}">${escapeHTML(next.label)}</a></article>`;
  }else{
    const missedNumbers=missed.map(item=>item.number);
    outcome.innerHTML=`<article class="daily-recovery"><p class="daily-kicker">Keep working · ${MIN}% is the goal</p><h3>You’re close. Let’s work the missed skills before trying again.</h3><p>Your latest score is ${latest}%. Nothing ahead unlocks yet. Review the problems below, use support if you need it, and resubmit when you are ready.</p>${missed.length?`<ol>${missed.map(item=>`<li><strong>Problem ${item.number}:</strong> ${escapeHTML(item.explanation)}</li>`).join("")}</ol>`:""}<div class="daily-support-actions"><a class="btn primary" href="${escapeHTML(mentorURL(missedNumbers))}">Ask Archaemenes About My Missed Problems</a><a class="btn" href="../practice/foundation.html">Open Foundation Practice</a><a class="btn" href="https://vervenveda.com/arcade.github.io/">Open Learning Arcade</a></div></article>`;
  }
  renderLessonStatus();if(scroll)outcome.scrollIntoView({behavior:"smooth",block:"center"});
}

function bindLessonOutcome(){
  const submit=document.getElementById("submitPractice");if(!submit||submit.dataset.dailyWorkroomBound==="true")return;
  submit.dataset.dailyWorkroomBound="true";submit.addEventListener("click",()=>setTimeout(()=>renderOutcome(true,true),0));
  window.addEventListener("storage",event=>{if(event.key===PROGRESS_KEY){renderLessonStatus();renderOutcome(false,false)}});
}

function init(){
  addStyles();
  if(window.LESSON_DATA){ensureLessonWorkroom();bindLessonOutcome();return}
  if(document.getElementById("lessonGrid")||document.querySelector(".mastery-gate-panel")){renderUnitHub();window.addEventListener("storage",event=>{if(event.key===PROGRESS_KEY||event.key===MASTERY_KEY)renderUnitHub()})}
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();

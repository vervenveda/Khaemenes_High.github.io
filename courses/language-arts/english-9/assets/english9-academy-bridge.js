(() => {
  "use strict";
  const RECORDS_KEY="khaemenes_english9_records_by_learner_v1";
  const CLAIM_KEY="khaemenes_english9_legacy_migration_claim_v1";
  const LEGACY_KEY="ELA9_36_WEEK_PORTAL_V2";
  const frame=document.getElementById("courseFrame");
  const status=document.getElementById("bridgeStatus");
  const identity=document.getElementById("bridgeIdentity");
  const badge=document.getElementById("bridgeBadge");
  const params=new URLSearchParams(location.search);
  const entry=String(params.get("entry")||"").trim();
  const readJSON=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
  const writeJSON=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
  const rawLegacy=localStorage.getItem(LEGACY_KEY);
  const continuity=()=>window.KhaemenesHighContinuity?.getSummary?.()||{eligible:false,reason:"continuity-unavailable",learner:null,mentor:null};
  const ctx=continuity();
  const formal=Boolean(ctx.eligible&&ctx.learner?.grade==="grade-09");
  const advancedPreview=entry==="grade08-advanced-preview"||entry==="middle-advanced-preview";

  function candidateFromLegacy(){
    const legacy=rawLegacy?(()=>{try{return JSON.parse(rawLegacy)}catch{return null}})():null;
    if(!legacy||!Array.isArray(legacy.students))return null;
    const candidates=legacy.students.filter(s=>s&&s.progress&& !["first student","demo student"].includes(String(s.name||"").trim().toLowerCase()));
    return candidates.length===1?candidates[0]:null;
  }

  function formalRecord(){
    if(!formal)return null;
    const id=ctx.learner.learnerId;
    const records=readJSON(RECORDS_KEY,{});
    if(records[id])return records[id];
    const claim=readJSON(CLAIM_KEY,null);
    const candidate=candidateFromLegacy();
    if(candidate&&(!claim||claim.learnerId===id)){
      const migrated={name:ctx.learner.nickname,progress:candidate.progress||{weeks:{},exams:{}},created:candidate.created||new Date().toISOString(),migratedAt:new Date().toISOString(),migration:{source:LEGACY_KEY,mode:"single-candidate-one-time-claim"}};
      records[id]=migrated;writeJSON(RECORDS_KEY,records);writeJSON(CLAIM_KEY,{learnerId:id,migratedAt:new Date().toISOString()});
      return migrated;
    }
    return {name:ctx.learner.nickname,progress:{weeks:{},exams:{}},created:new Date().toISOString()};
  }

  const record=formalRecord();
  if(formal){
    identity.innerHTML=`<strong>${ctx.learner.nickname} · English 9</strong><span>Archaemenes · Academy Scholar · formal Grade 09 course context</span>`;
    badge.textContent="Formal Grade 09";
    status.innerHTML="<strong>Academy-connected record.</strong> English 9 progress is learner-scoped. Complete the learning sequence, reach 80% on each weekly mastery check, and reach 80% on the midterm before Semester II opens.";
  }else{
    const name=ctx.learner?.nickname||"Scholar";
    identity.innerHTML=`<strong>${name} · English 9 Preview</strong><span>Archaemenes · Academy Scholar · exploration context</span>`;
    badge.textContent=advancedPreview?"Grade 08 Advanced Preview":"Preview Only";
    status.innerHTML="<strong>Preview mode.</strong> You may explore lessons and practice, but preview activity does not create formal English 9 mastery or unlock state. Formal Grade 09 progression begins from the Academy Family Registry.";
  }

  function restoreLegacy(){
    try{if(rawLegacy===null)localStorage.removeItem(LEGACY_KEY);else localStorage.setItem(LEGACY_KEY,rawLegacy)}catch{}
  }

  frame.addEventListener("load",()=>{
    const win=frame.contentWindow,doc=frame.contentDocument;
    if(!win||!doc)return;
    const config=formal?{
      mode:"formal",learnerId:ctx.learner.learnerId,nickname:ctx.learner.nickname,record
    }:{mode:"preview",learnerId:null,nickname:ctx.learner?.nickname||"Preview Scholar",record:null};
    win.__KHAEMENES_ENGLISH9_BRIDGE__=config;
    const script=doc.createElement("script");
    script.textContent=`(()=>{\n"use strict";\nconst cfg=window.__KHAEMENES_ENGLISH9_BRIDGE__||{mode:"preview",nickname:"Preview Scholar"};\nconst RECORDS_KEY="${RECORDS_KEY}";\nconst MASTERY_TARGET=80;\nconst LESSON_DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday"];\nconst notice=document.createElement("div");notice.className="notice";notice.textContent=cfg.mode==="formal"?"Academy Family Profile active · formal Grade 09 learner-scoped record · 80% mastery progression":"Preview mode · exploration does not alter formal Grade 09 records";\nconst box=document.querySelector(".studentBox");if(box){box.replaceChildren(notice);}\nconst student={id:cfg.mode==="formal"?cfg.learnerId:"preview",name:cfg.nickname||"Scholar",created:cfg.record?.created||new Date().toISOString(),progress:cfg.record?.progress||{weeks:{},exams:{}}};\nstate={students:[student],activeId:student.id};\nsaveState=function(){if(cfg.mode!=="formal")return;try{const raw=localStorage.getItem(RECORDS_KEY);const records=raw?JSON.parse(raw):{};records[cfg.learnerId]={name:cfg.nickname,created:student.created,progress:student.progress,updatedAt:new Date().toISOString()};localStorage.setItem(RECORDS_KEY,JSON.stringify(records));}catch{}};\naddStudent=function(){};addDemoStudent=function(){};deleteActiveStudent=function(){};\nfunction friendlyGate(detail){alert("You’re almost there. "+detail+" Finish the current learning step and come back — your progress is saved.");}\nfunction weekMastered(weekNo){if(cfg.mode!=="formal")return true;return lessonPct(student,weekNo)===100&&quizBest(student,weekNo)>=MASTERY_TARGET;}\nfunction midtermMastered(){return Number(student.progress.exams?.midterm?.best||0)>=MASTERY_TARGET;}\nfunction weekUnlocked(weekNo){if(cfg.mode!=="formal"||weekNo<=1)return true;if(weekNo>=19&&!midtermMastered())return false;for(let i=1;i<weekNo;i++){if(!weekMastered(i))return false;}return true;}\nfunction masteredThrough(endWeek){if(cfg.mode!=="formal")return true;for(let i=1;i<=endWeek;i++){if(!weekMastered(i))return false;}return true;}\nfunction lessonPrerequisiteMet(lesson,p){if(cfg.mode!=="formal")return true;const idx=LESSON_DAYS.indexOf(lesson.day);if(idx<=0)return true;return Boolean(p.lessons[LESSON_DAYS[idx-1]]);}\nconst gateStyle=doc.createElement("style");gateStyle.textContent=".khaeGate{border:1px dashed rgba(216,180,95,.55);border-radius:14px;padding:16px;margin:10px 0;background:rgba(216,180,95,.08)}.khaeGate strong{display:block;margin-bottom:6px}.weekButton[aria-disabled=true]{opacity:.58}.weekButton[aria-disabled=true] .pill::before{content:'🔒 ';}";doc.head.appendChild(gateStyle);\ndoc.addEventListener("click",function(event){const gate=event.target.closest("[data-khae-gate]");if(!gate)return;event.preventDefault();event.stopImmediatePropagation();friendlyGate(gate.getAttribute("data-khae-gate")||"This activity is still locked.");},true);\nconst originalRenderLesson=window.renderLesson;\nif(typeof originalRenderLesson==="function"){window.renderLesson=function(w,lesson,p){if(cfg.mode==="formal"&&!lessonPrerequisiteMet(lesson,p)){const idx=LESSON_DAYS.indexOf(lesson.day);const prior=LESSON_DAYS[Math.max(0,idx-1)];return '<div class="khaeGate"><strong>🔒 '+lesson.day+' lesson</strong><p>Complete '+prior+' before opening this lesson.</p><button type="button" class="secondary" data-khae-gate="Complete '+prior+' first. '+lesson.day+' will open automatically after that step is marked complete.">Why is this locked?</button></div>'; }return originalRenderLesson(w,lesson,p);};}\nconst originalRenderQuiz=window.renderQuiz;\nif(typeof originalRenderQuiz==="function"){window.renderQuiz=function(w){const p=weekProgress(student,w.week);const lessonsComplete=LESSON_DAYS.every(function(day){return Boolean(p.lessons[day]);});if(cfg.mode==="formal"&&!lessonsComplete){return '<div class="khaeGate"><strong>🔒 Weekly mastery check</strong><p>Reach the end of this week’s lesson sequence before taking the quiz.</p><button type="button" class="secondary" data-khae-gate="Complete all five lesson steps for Week '+w.week+' first. Then the mastery check will open.">Why is this locked?</button></div>'; }return originalRenderQuiz(w);};}\nconst originalRenderWeekList=window.renderWeekList;\nif(typeof originalRenderWeekList==="function"){window.renderWeekList=function(){originalRenderWeekList();if(cfg.mode!=="formal")return;doc.querySelectorAll(".weekButton[data-week]").forEach(function(btn){const wk=Number(btn.dataset.week);if(!weekUnlocked(wk)){btn.setAttribute("aria-disabled","true");const reason=wk>=19&&!midtermMastered()?"Week "+wk+" opens after Weeks 1–18 are mastered and the midterm reaches 80% or higher.":"Week "+wk+" opens after every earlier week is complete and its mastery check is 80% or higher.";btn.setAttribute("data-khae-gate",reason);}else{btn.removeAttribute("aria-disabled");btn.removeAttribute("data-khae-gate");}});};}\nconst originalNextWeek=window.nextWeek;\nif(typeof originalNextWeek==="function"){window.nextWeek=function(){const target=Math.min(APP.weeks.length,currentWeek+1);if(cfg.mode==="formal"&&!weekUnlocked(target)){friendlyGate(target>=19&&!midtermMastered()?"Semester II opens after Weeks 1–18 are mastered and the midterm reaches 80% or higher.":"Week "+target+" opens after Week "+currentWeek+" is complete and its mastery check reaches 80% or higher.");return;}originalNextWeek();};}\nconst originalRenderExamForm=window.renderExamForm;\nif(typeof originalRenderExamForm==="function"){window.renderExamForm=function(name,questions){if(cfg.mode!=="formal")return originalRenderExamForm(name,questions);const isMid=name==="midterm";const priorReady=isMid?masteredThrough(18):(masteredThrough(APP.weeks.length)&&midtermMastered());if(priorReady)return originalRenderExamForm(name,questions);const detail=isMid?"The midterm opens after Weeks 1–18 are completed and each required weekly mastery check is 80% or higher.":"The final opens after all 36 weeks are mastered and the midterm is 80% or higher.";return '<div class="khaeGate"><strong>🔒 '+(isMid?'Midterm':'Final')+'</strong><p>'+detail+'</p><button type="button" class="secondary" data-khae-gate="'+detail+'">Why is this locked?</button></div>';};}\nconst originalSubmitQuiz=window.submitQuiz;\nif(typeof originalSubmitQuiz==="function"){window.submitQuiz=function(weekNo){if(cfg.mode==="formal"){const p=weekProgress(student,weekNo);if(!LESSON_DAYS.every(function(day){return Boolean(p.lessons[day]);})){friendlyGate("Complete all five lesson steps for Week "+weekNo+" before submitting its mastery check.");return;}}return originalSubmitQuiz(weekNo);};}\nconst originalSubmitExam=window.submitExam;\nif(typeof originalSubmitExam==="function"){window.submitExam=function(name){if(cfg.mode==="formal"){const isMid=name==="midterm";const ready=isMid?masteredThrough(18):(masteredThrough(APP.weeks.length)&&midtermMastered());if(!ready){friendlyGate(isMid?"The midterm opens after Weeks 1–18 are mastered at 80% or higher.":"The final opens after all 36 weeks are mastered and the midterm is 80% or higher.");return;}}const result=originalSubmitExam(name);if(cfg.mode==="formal"&&name==="midterm"){setTimeout(function(){const best=Number(student.progress.exams?.midterm?.best||0);if(best>0&&best<MASTERY_TARGET)friendlyGate("Your midterm best is "+best+"%. Review and reassess. Semester II remains locked until the midterm reaches 80% or higher.");},20);}return result;};}\nrenderAll();\n})();`;
    doc.body.appendChild(script);
    restoreLegacy();
  },{once:true});

  try{localStorage.setItem(LEGACY_KEY,JSON.stringify({students:[{id:"bridge_boot",name:"Bridge Boot",created:new Date().toISOString(),progress:{weeks:{},exams:{}}}],activeId:"bridge_boot"}))}catch{}
  frame.src="legacy.html";

  try{window.KhaemenesHighContinuity?.subscribe?.(()=>location.reload())}catch{}
})();
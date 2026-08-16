(() => {
  "use strict";
  const RECORDS_KEY="khaemenes_globalstudies9_records_by_learner_v1";
  const CLAIM_KEY="khaemenes_globalstudies9_legacy_migration_claim_v1";
  const LEGACY_KEY="KHAE_SS9_ATLAS_ARCHIVE_PORTAL_V1";
  const frame=document.getElementById("courseFrame");
  const status=document.getElementById("bridgeStatus");
  const identity=document.getElementById("bridgeIdentity");
  const badge=document.getElementById("bridgeBadge");
  const params=new URLSearchParams(location.search);
  const entry=String(params.get("entry")||"").trim();
  const readJSON=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
  const writeJSON=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
  const rawLegacy=localStorage.getItem(LEGACY_KEY);
  const ctx=window.KhaemenesHighContinuity?.getSummary?.()||{eligible:false,learner:null,mentor:null};
  const formal=Boolean(ctx.eligible&&ctx.learner?.grade==="grade-09");
  const advancedPreview=entry==="grade08-advanced-preview"||entry==="middle-advanced-preview";

  function candidateFromLegacy(){
    const legacy=rawLegacy?(()=>{try{return JSON.parse(rawLegacy)}catch{return null}})():null;
    if(!legacy||!Array.isArray(legacy.students))return null;
    const candidates=legacy.students.filter(s=>s&&s.progress&&!["first student","demo student"].includes(String(s.name||"").trim().toLowerCase()));
    return candidates.length===1?candidates[0]:null;
  }
  function normalizeRecord(src={}){
    return {name:String(src.name||ctx.learner?.nickname||"Global Studies Scholar").slice(0,80),created:src.created||new Date().toISOString(),progress:src.progress&&typeof src.progress==="object"?src.progress:{weeks:{},exams:{},capstone:{logs:[]}}};
  }
  function formalRecord(){
    if(!formal)return null;
    const id=ctx.learner.learnerId;
    const records=readJSON(RECORDS_KEY,{});
    if(records[id])return normalizeRecord(records[id]);
    const claim=readJSON(CLAIM_KEY,null),candidate=candidateFromLegacy();
    if(candidate&&(!claim||claim.learnerId===id)){
      const migrated={...normalizeRecord(candidate),name:ctx.learner.nickname,migratedAt:new Date().toISOString(),migration:{source:LEGACY_KEY,mode:"single-candidate-one-time-claim"}};
      records[id]=migrated;writeJSON(RECORDS_KEY,records);writeJSON(CLAIM_KEY,{learnerId:id,migratedAt:new Date().toISOString()});return migrated;
    }
    return normalizeRecord({name:ctx.learner.nickname});
  }

  const record=formalRecord();
  if(formal){
    identity.innerHTML=`<strong>${ctx.learner.nickname} · Global Studies Honors 9</strong><span>Archaemenes · Academy Scholar · formal Grade 09 course context</span>`;
    badge.textContent="Formal Grade 09";
    status.innerHTML="<strong>Academy-connected honors record.</strong> Formal progression uses 80% mastery. Complete the week's learning and three evidence assignments, reach 80% on the mastery check, and the next week opens. Semester II also requires an 80% midterm.";
  }else{
    const name=ctx.learner?.nickname||"Scholar";
    identity.innerHTML=`<strong>${name} · Global Studies Honors 9 Preview</strong><span>Archaemenes · Academy Scholar · exploration context</span>`;
    badge.textContent=advancedPreview?"Grade 08 Advanced Preview":"Preview Only";
    status.innerHTML="<strong>Preview mode.</strong> You may explore the atlas, lessons, sources, and practice without creating formal Grade 09 mastery or unlock state.";
  }

  function restoreLegacy(){try{if(rawLegacy===null)localStorage.removeItem(LEGACY_KEY);else localStorage.setItem(LEGACY_KEY,rawLegacy)}catch{}}

  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument,win=frame.contentWindow;if(!doc||!win)return;
    win.__KHAEMENES_GLOBAL9_BRIDGE__=formal?{mode:"formal",learnerId:ctx.learner.learnerId,nickname:ctx.learner.nickname,record}:{mode:"preview",learnerId:null,nickname:ctx.learner?.nickname||"Preview Scholar",record:null};
    const script=doc.createElement("script");
    script.textContent=`(()=>{\n"use strict";\nconst cfg=window.__KHAEMENES_GLOBAL9_BRIDGE__||{mode:"preview",nickname:"Preview Scholar"};\nconst RECORDS_KEY="${RECORDS_KEY}";\nconst PASS=80;\nconst DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday"];\nconst FRIENDLY="You’re almost there. This activity opens when the earlier learning step is complete. Finish the current lesson or reach 80% mastery on the required check, then come back — your progress is saved.";\nconst r=cfg.record||{};\nconst student={id:cfg.mode==="formal"?cfg.learnerId:"preview",name:cfg.nickname||"Scholar",created:r.created||new Date().toISOString(),progress:r.progress||{weeks:{},exams:{},capstone:{logs:[]}}};\nstate={students:[student],activeId:student.id};\nAPP.passingTarget=PASS;\nsave=function(){if(cfg.mode!=="formal")return;try{const raw=localStorage.getItem(RECORDS_KEY);const records=raw?JSON.parse(raw):{};records[cfg.learnerId]={name:cfg.nickname,created:student.created,progress:student.progress,updatedAt:new Date().toISOString()};localStorage.setItem(RECORDS_KEY,JSON.stringify(records));}catch{}};\naddStudent=function(){};demo=function(){};del=function(){};\nconst studentPanel=document.querySelector(".panel");if(studentPanel){const n=document.createElement("div");n.className="notice";n.textContent=cfg.mode==="formal"?"Academy Family Profile active · Grade 09 learner-scoped honors record · 80% mastery progression":"Preview mode · exploration is temporary and does not alter formal Grade 09 records";studentPanel.replaceChildren(n);}\nfunction remind(detail){alert(detail?FRIENDLY+"\\n\\n"+detail:FRIENDLY);}\nfunction weekMastered(n){return cfg.mode!=="formal"||(lp(student,n)===100&&ap(student,n)===100&&qb(student,n)>=PASS);}\nfunction midtermMastered(){return Number(student.progress.exams?.midterm?.best||0)>=PASS;}\nfunction weekUnlocked(n){if(cfg.mode!=="formal"||n<=1)return true;if(n>=19&&!midtermMastered())return false;for(let i=1;i<n;i++)if(!weekMastered(i))return false;return true;}\nfunction dayUnlocked(n,day){if(cfg.mode!=="formal")return true;if(!weekUnlocked(n))return false;const idx=DAYS.indexOf(day);if(idx<=0)return true;const p=wp(student,n);return DAYS.slice(0,idx).every(d=>Boolean(p.lessons[d]));}\nfunction assignmentUnlocked(n,index){if(cfg.mode!=="formal")return true;const p=wp(student,n);const prerequisiteDay=["Tuesday","Wednesday","Thursday"][index-1];return Boolean(p.lessons[prerequisiteDay]);}\nfunction weeklyEvidenceReady(n){const p=wp(student,n);return DAYS.every(d=>Boolean(p.lessons[d]))&&[1,2,3].every(i=>Boolean(p.assignments[i]));}\nfunction masteredThrough(end){for(let i=1;i<=end;i++)if(!weekMastered(i))return false;return true;}\nconst gateStyle=document.createElement("style");gateStyle.textContent=".khaeGate{border:1px dashed rgba(216,180,95,.62);border-radius:14px;padding:15px;margin:10px 0;background:rgba(216,180,95,.08)}.khaeGate strong{display:block;margin-bottom:6px}.weekButton[aria-disabled=true]{opacity:.55}.weekButton[aria-disabled=true] .pill::before{content:'🔒 ';}.lesson[data-khae-locked=true],.assignment[data-khae-locked=true]{opacity:.58}";document.head.appendChild(gateStyle);\nconst originalWeekList=weekList;weekList=function(){originalWeekList();document.querySelectorAll(".weekButton").forEach((btn,i)=>{const n=i+1;btn.dataset.week=String(n);if(cfg.mode==="formal"&&!weekUnlocked(n)){btn.setAttribute("aria-disabled","true");btn.dataset.khaeGate=n>=19&&!midtermMastered()?`Semester II opens after Weeks 1–18 are mastered and the midterm reaches 80% or higher.`:`Week ${n} opens after every earlier week is complete and its mastery check reaches 80% or higher.`;}});};\nconst originalLessonCard=lessonCard;lessonCard=function(w,d,p){if(cfg.mode==="formal"&&!dayUnlocked(w.week,d.day)){const idx=DAYS.indexOf(d.day),prior=DAYS[Math.max(0,idx-1)];return `<div class="khaeGate"><strong>🔒 ${d.day} · ${d.title}</strong><p>Complete ${prior} before opening this lesson.</p><button type="button" class="secondary" data-khae-gate="Complete ${prior} first. ${d.day} will open automatically after that step is complete.">Why is this locked?</button></div>`;}return originalLessonCard(w,d,p);};\nconst originalAssignments=assignments;assignments=function(w,p){if(cfg.mode!=="formal")return originalAssignments(w,p);return w.assignments.map((a,i)=>{const idx=i+1,open=assignmentUnlocked(w.week,idx);return `<div class="assignment" ${open?"":"data-khae-locked='true'"}><label class="check"><input id="assign_${w.week}_${idx}" type="checkbox" ${p.assignments[idx]?"checked":""} ${open?"":"disabled"}> Assignment ${idx}</label><h4>${esc(a.title)}</h4><p class="small">${esc(a.type)} · ${a.points} pts</p><p>${esc(a.instructions)}</p><p class="small"><b>Evidence:</b> ${esc(a.evidence)}</p>${open?"":`<button type="button" class="secondary" data-khae-gate="Assignment ${idx} opens after the ${["Tuesday","Wednesday","Thursday"][i]} lesson is complete.">Why is this locked?</button>`}</div>`;}).join("");};\nconst originalQuiz=quiz;quiz=function(w){if(cfg.mode==="formal"&&!weeklyEvidenceReady(w.week))return `<div class="khaeGate"><strong>🔒 Weekly mastery check</strong><p>Complete all five lessons and all three evidence assignments before taking this mastery check.</p><button type="button" class="secondary" data-khae-gate="Finish the five lesson steps and three evidence assignments for Week ${w.week}. Then the mastery check will open.">Why is this locked?</button></div>`;return originalQuiz(w);};\nconst originalSubmitQuiz=submitQuiz;submitQuiz=function(n){if(cfg.mode==="formal"&&!weeklyEvidenceReady(n)){remind(`Complete all five lessons and all three evidence assignments for Week ${n} first.`);return;}const result=originalSubmitQuiz(n);setTimeout(()=>{const best=qb(student,n);if(best>0&&best<PASS)remind(`Your Week ${n} best is ${best}%. Review your evidence and reassess. Week ${n+1} remains locked until you reach 80%.`);},20);return result;};\nconst originalExamForm=examForm;examForm=function(name,qs){if(cfg.mode!=="formal")return originalExamForm(name,qs);const isMid=name==="midterm",ready=isMid?masteredThrough(18):(masteredThrough(36)&&midtermMastered());if(ready)return originalExamForm(name,qs);const detail=isMid?"The midterm opens after Weeks 1–18 are mastered at 80% or higher.":"The final opens after all 36 weeks are mastered and the midterm is 80% or higher.";return `<div class="khaeGate"><strong>🔒 ${isMid?"Midterm":"Final"}</strong><p>${detail}</p><button type="button" class="secondary" data-khae-gate="${detail}">Why is this locked?</button></div>`;};\nconst originalSubmitExam=submitExam;submitExam=function(name){if(cfg.mode==="formal"){const isMid=name==="midterm",ready=isMid?masteredThrough(18):(masteredThrough(36)&&midtermMastered());if(!ready){remind(isMid?"The midterm opens after Weeks 1–18 are mastered at 80% or higher.":"The final opens after all 36 weeks are mastered and the midterm is 80% or higher.");return;}}const result=originalSubmitExam(name);if(name==="midterm"&&cfg.mode==="formal")setTimeout(()=>{const best=Number(student.progress.exams?.midterm?.best||0);if(best>0&&best<PASS)remind(`Your midterm best is ${best}%. Review and reassess. Semester II remains locked until the midterm reaches 80%.`);},20);return result;};\ndocument.addEventListener("click",event=>{const gate=event.target.closest("[data-khae-gate]");if(!gate)return;event.preventDefault();event.stopImmediatePropagation();remind(gate.dataset.khaeGate||"");},true);\ndocument.addEventListener("click",event=>{const btn=event.target.closest(".weekButton[data-week]");if(!btn||cfg.mode!=="formal")return;const n=Number(btn.dataset.week);if(!weekUnlocked(n)){event.preventDefault();event.stopImmediatePropagation();remind(btn.dataset.khaeGate||`Week ${n} is still locked.`);}},true);\ndocument.addEventListener("click",event=>{const next=event.target.closest('button[onclick*="wk=Math.min"]');if(!next||cfg.mode!=="formal")return;const target=Math.min(APP.weeks.length,wk+1);if(!weekUnlocked(target)){event.preventDefault();event.stopImmediatePropagation();remind(target>=19&&!midtermMastered()?"Semester II opens after the first 18 weeks and midterm are mastered at 80% or higher.":`Week ${target} opens after Week ${wk} reaches 80% mastery.`);}},true);\nrender();\n})();`;
    doc.body.appendChild(script);
    restoreLegacy();
  },{once:true});

  try{localStorage.setItem(LEGACY_KEY,JSON.stringify({students:[{id:"bridge_boot",name:"Bridge Boot",created:new Date().toISOString(),progress:{weeks:{},exams:{},capstone:{logs:[]}}}],activeId:"bridge_boot"}))}catch{}
  frame.src="legacy.html";
  try{window.KhaemenesHighContinuity?.subscribe?.(()=>location.reload())}catch{}
})();
(() => {
"use strict";

const STUDENT_PORTAL="https://vervenveda.com/Khaemenes_Academy.github.io/student/";
const FAMILY_PORTAL="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
const FAMILY_REGISTRY="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js";
const MENTOR_HOME="https://artist1970.github.io/Archaemenes.github.io/high/";
const HIGH_HOME="https://vervenveda.com/Khaemenes_High.github.io/";
const BETA_WIDGET="https://vervenveda.com/assets/vnv-beta-link.js";
const PIN_KEY="khaemenes_course_pins_v1";
const COURSE_ID="pre-algebra";
const COURSE_URL="https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/pre-algebra/";

const css=`
:root{
 --k-paper:#f4f0e7;--k-paper2:#fbf9f4;--k-panel:#fffdf8;--k-ink:#17251f;--k-muted:#66736d;
 --k-forest:#17392f;--k-forest2:#245246;--k-gold:#b48b45;--k-gold2:#e4d2aa;--k-burgundy:#71363e;
 --k-line:rgba(20,40,32,.14);--k-shadow:0 20px 52px rgba(20,40,32,.08);
 --k-formal:Cinzel,"Palatino Linotype",Palatino,Georgia,serif;
 --k-body:"Brandon Grotesque","Avenir Next",Avenir,"Segoe UI",Arial,sans-serif;
}
html,body{background:var(--k-paper)!important;color:var(--k-ink)!important}
body{font-family:var(--k-body)!important;font-size:16px!important;line-height:1.72!important;background:radial-gradient(circle at 50% -12rem,rgba(180,139,69,.13),transparent 36rem),linear-gradient(180deg,#fbfaf6,var(--k-paper))!important}
body::before{opacity:.11!important}
.app{grid-template-columns:minmax(292px,330px) minmax(0,1fr)!important}
.sidebar{background:linear-gradient(180deg,#102f27,#0b241d)!important;border-right:1px solid rgba(255,255,255,.12)!important;box-shadow:10px 0 34px rgba(16,35,29,.08)!important;padding:24px!important}
.sidebar .brand,.sidebar .panel{background:rgba(255,255,255,.055)!important;border-color:rgba(255,255,255,.12)!important;box-shadow:none!important;border-radius:11px!important}
.sidebar .brand h2,.sidebar h3{font-family:var(--k-formal)!important;color:#fff8e8!important;font-weight:500!important}
.sidebar p,.sidebar label,.sidebar .small{color:rgba(255,255,255,.7)!important}
.sidebar .seal{color:#172c25!important;background:linear-gradient(145deg,#f2dfb2,#d0a85a)!important;border-color:#eed49c!important;font-family:var(--k-formal)!important}
.sidebar input,.sidebar select,.sidebar textarea{background:rgba(0,0,0,.22)!important;color:#fff!important;border-color:rgba(255,255,255,.18)!important;border-radius:7px!important}
.sidebar .navBtn,.sidebar .weekBtn{background:rgba(0,0,0,.16)!important;color:#f8f4ea!important;border-color:rgba(255,255,255,.12)!important;border-radius:7px!important}
.sidebar .navBtn.active,.sidebar .weekBtn.active{border-color:var(--k-gold2)!important;background:rgba(222,191,126,.14)!important}
.main{max-width:1420px!important;padding:38px clamp(24px,4vw,60px) 64px!important}
.hero{text-align:center!important;color:var(--k-ink)!important;border:1px solid var(--k-line)!important;border-radius:21px!important;background:radial-gradient(circle at 50% -10rem,rgba(180,139,69,.14),transparent 28rem),linear-gradient(180deg,#fffdf8,#f4eee1)!important;box-shadow:var(--k-shadow)!important;padding:50px clamp(28px,5vw,72px)!important;margin-bottom:22px!important}
.hero:after{color:rgba(23,57,47,.045)!important;right:50%!important;transform:translateX(50%)!important;font-size:18rem!important}
.hero-topline{align-items:center!important}.hero-identity{text-align:left!important}.hero-home-badge{color:#fff!important;background:linear-gradient(145deg,#21483b,#0f2c24)!important;border-color:#2b5c4c!important;box-shadow:none!important;font-family:var(--k-formal)!important}
.hero-route,.hero p{color:var(--k-muted)!important}.eyebrow{color:var(--k-burgundy)!important;font-family:var(--k-formal)!important;font-weight:600!important}
.hero h1{position:relative;z-index:2;max-width:1020px;margin:34px auto 18px!important;color:var(--k-forest)!important;font-family:var(--k-formal)!important;font-size:clamp(3.25rem,7vw,6.25rem)!important;font-weight:500!important;line-height:.96!important;letter-spacing:-.035em!important;text-wrap:balance}
.hero>p{max-width:900px!important;margin-inline:auto!important;font-size:1.04rem!important}.hero .actions{justify-content:center!important}
.header-control,.course-menu>summary{color:var(--k-forest)!important;background:#fff!important;border-color:var(--k-line)!important;border-radius:7px!important;font-family:var(--k-body)!important}.course-menu[open]>summary{background:#f4eee1!important}.course-menu-panel{color:#f9f5ec!important;background:rgba(12,35,29,.985)!important;border-color:rgba(228,210,170,.32)!important;border-radius:11px!important}.course-menu-panel a,.course-menu-panel button{color:#fff!important}.course-menu-label{color:var(--k-gold2)!important}
.tabs{justify-content:center!important;gap:8px!important;padding:12px!important;border:1px solid var(--k-line)!important;border-radius:11px!important;background:rgba(255,255,255,.68)!important}.tab{color:var(--k-forest)!important;background:#fff!important;border-color:var(--k-line)!important;border-radius:7px!important;font-family:var(--k-body)!important}.tab.active{color:#fff!important;background:var(--k-forest)!important;border-color:var(--k-forest)!important}
#content{max-width:1240px;margin:0 auto}#content .card{color:var(--k-ink)!important;background:rgba(255,253,248,.95)!important;border:1px solid var(--k-line)!important;border-radius:21px!important;box-shadow:0 11px 30px rgba(20,40,32,.055)!important}#content .card h3,#content .card h4,#content .card h2{color:var(--k-forest)!important;font-family:var(--k-formal)!important;font-weight:500!important}#content .card p,#content td{color:#46564f!important}#content th{color:var(--k-burgundy)!important;font-family:var(--k-formal)!important}.lesson,.assignment,.q,.toolBox,.rubric-item,.feedback-list{color:var(--k-ink)!important;background:#fbf8f0!important;border-color:var(--k-line)!important;border-radius:11px!important}.choice{color:var(--k-ink)!important;background:#fff!important;border-color:var(--k-line)!important;border-radius:7px!important}.notice{color:#604d27!important;background:#fbf4df!important;border-left-color:var(--k-gold)!important;border-radius:7px!important}.progress{background:#e8e1d5!important;border-color:var(--k-line)!important}.progress span{background:linear-gradient(90deg,#7c9f91,var(--k-gold),#6d9a75)!important}.pill{color:#5f6d66!important;background:#f5f0e5!important;border-color:var(--k-line)!important}.score,.kpi strong{color:var(--k-forest)!important;font-family:var(--k-formal)!important}.toolResult{color:#17392f!important;background:#f1f7f4!important;border-color:rgba(36,82,70,.22)!important}
#content button,#content .button,.hero button,.hero .button{color:#fff!important;background:var(--k-forest)!important;border:1px solid var(--k-forest)!important;box-shadow:none!important;border-radius:7px!important;font-family:var(--k-body)!important}#content button.secondary,#content .button.secondary,.hero button.secondary,.hero .button.secondary{color:var(--k-forest)!important;background:#fff!important;border-color:var(--k-line)!important}#content button.ghost,#content .button.ghost,.hero button.ghost,.hero .button.ghost{color:#6b5328!important;background:#fbf3de!important;border-color:#d7bc81!important}
.khae-family-links{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.khae-family-links a{min-height:38px;display:inline-flex;align-items:center;justify-content:center;padding:7px 10px;border:1px solid rgba(255,255,255,.18);border-radius:7px;color:#fff;text-decoration:none;font-size:.75rem;font-weight:700}.khae-family-note{margin:10px 0 0!important;color:rgba(255,255,255,.76)!important;font-size:.78rem!important}
.khae-mentor{max-width:1240px;margin:0 auto 24px;display:grid;grid-template-columns:minmax(150px,200px) minmax(0,1fr);gap:26px;align-items:center;padding:28px;border:1px solid var(--k-line);border-radius:21px;color:var(--k-ink);background:linear-gradient(135deg,#fffdf8,#f2ead9);box-shadow:var(--k-shadow)}.khae-mentor-portrait{width:150px;height:150px;margin:auto;display:grid;place-items:center;border:1px solid #d4b672;border-radius:50%;background:radial-gradient(circle,#fff8e6,#ead7ad);overflow:hidden}.khae-mentor-portrait img{width:100%;height:100%;object-fit:cover;object-position:center top}.khae-mentor-copy{text-align:left}.khae-mentor-kicker{color:var(--k-burgundy);font:600 .67rem var(--k-formal);letter-spacing:.16em;text-transform:uppercase}.khae-mentor h2{margin:5px 0 8px;color:var(--k-forest);font:500 clamp(1.8rem,4vw,3rem)/1 var(--k-formal)}.khae-mentor p{margin:0;color:var(--k-muted)}.khae-mentor-context{margin-top:12px!important;color:var(--k-forest)!important;font-weight:700}.khae-mentor-actions{margin-top:18px;display:flex;gap:9px;flex-wrap:wrap}.khae-mentor-actions a{min-height:43px;display:inline-flex;align-items:center;justify-content:center;padding:9px 13px;border:1px solid var(--k-line);border-radius:7px;font:700 .68rem var(--k-body);letter-spacing:.07em;text-transform:uppercase;text-decoration:none}.khae-mentor-actions .primary{color:#fff;background:var(--k-forest)}.khae-mentor-actions .secondary{color:var(--k-forest);background:#fff}
.assessment-center{max-width:980px;margin:0 auto}.assessment-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:20px}.assessment-choice{padding:24px;border:1px solid var(--k-line);border-radius:11px;background:#fff;text-align:center}.assessment-choice h4{font:500 1.55rem var(--k-formal)!important;color:var(--k-forest)!important}.assessment-choice p{max-width:48ch;margin-inline:auto}.framework-table{overflow:auto}.family-connected-hidden{display:none!important}
@media(max-width:1000px){.app{grid-template-columns:1fr!important}.sidebar{position:relative!important;height:auto!important}.khae-mentor{grid-template-columns:1fr;text-align:center}.khae-mentor-copy{text-align:center}.khae-mentor-actions{justify-content:center}.header-tools{justify-content:center!important}}
@media(max-width:700px){.main{padding:18px 14px 68px!important}.hero{padding:34px 18px!important}.hero h1{font-size:clamp(2.7rem,13vw,4.2rem)!important}.assessment-grid{grid-template-columns:1fr}.khae-mentor{padding:22px 16px}.khae-family-links a{flex:1 1 100%}}
@media print{.khae-mentor,.header-tools{display:none!important}}
`;

function addStyle(){if(document.getElementById("khaemenes-prealgebra-academic-theme"))return;const s=document.createElement("style");s.id="khaemenes-prealgebra-academic-theme";s.textContent=css;document.head.appendChild(s)}
function loadScript(src,id,onload){if(id&&document.getElementById(id)){onload?.();return}const s=document.createElement("script");if(id)s.id=id;s.src=src;s.defer=true;if(onload)s.onload=onload;document.head.appendChild(s)}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function normalizeName(v){return String(v||"").trim().toLowerCase().replace(/\s+/g," ")}

function patchNavigation(){
 document.querySelectorAll('a[href="../../../index.html#student-portal"]').forEach(a=>{a.href=STUDENT_PORTAL;a.textContent=a.textContent.trim()==="Profile"?"Student Profile":a.textContent});
 const tools=document.querySelector(".header-tools");
 if(tools&&!document.getElementById("familyPortalLink")){
  const a=document.createElement("a");a.id="familyPortalLink";a.className="header-control";a.href=FAMILY_PORTAL;a.textContent="Family Hub";a.setAttribute("aria-label","Open the Khaemenes Academy Family Hub");
  const pin=document.getElementById("pinCourseButton");tools.insertBefore(a,pin||tools.firstChild);
 }
 const menu=document.querySelector("#courseMenu .course-menu-panel");
 if(menu&&!menu.querySelector('[data-khae-family-link]')){
  const profile=[...menu.querySelectorAll("a")].find(a=>a.textContent.trim()==="Student Profile");if(profile)profile.href=STUDENT_PORTAL;
  const a=document.createElement("a");a.href=FAMILY_PORTAL;a.textContent="Family Hub";a.dataset.khaeFamilyLink="true";
  if(profile)profile.after(a);else menu.prepend(a);
 }
}

function familyRegistry(){return window.KhaemenesFamilyRegistry||null}
function activeAcademyLearner(){try{return familyRegistry()?.getLearner?.()||null}catch{return null}}
function activeFamily(){try{return familyRegistry()?.getFamily?.()||null}catch{return null}}
function courseRecordId(learner){return learner?.learnerId?`academy:${learner.learnerId}`:null}
function emptyProgress(){return {weeks:{},exams:{},capstone:{logs:[],score:0,rubric:{}}}}

function ensureCourseRecord(learner){
 if(!learner||typeof state==="undefined"||!Array.isArray(state.students))return null;
 const id=courseRecordId(learner);let record=state.students.find(s=>s.id===id);
 if(!record){
  const prior=state.students.find(s=>normalizeName(s.name)===normalizeName(learner.nickname));
  let progress=prior?.progress;
  try{progress=progress?JSON.parse(JSON.stringify(progress)):emptyProgress()}catch{progress=emptyProgress()}
  record={id,name:learner.nickname||"Learner",created:new Date().toISOString(),progress};state.students.push(record);
 }
 record.name=learner.nickname||record.name||"Learner";state.activeId=id;try{save()}catch{}return record;
}

function familyLearners(){const f=activeFamily();return Array.isArray(f?.learners)?f.learners.filter(l=>l&&!l.selfDirectedAdult):[]}

function installLearnerContinuity(){
 const R=familyRegistry();if(!R)return;
 const learners=familyLearners(),active=activeAcademyLearner();
 learners.forEach(ensureCourseRecord);if(active)ensureCourseRecord(active);
 const originalRenderStudentSelect=typeof renderStudentSelect==="function"?renderStudentSelect:null;
 if(originalRenderStudentSelect){
  renderStudentSelect=function(){
   const currentLearners=familyLearners();
   if(!currentLearners.length){originalRenderStudentSelect();return}
   currentLearners.forEach(ensureCourseRecord);
   const activeLearner=activeAcademyLearner()||currentLearners[0],activeId=courseRecordId(activeLearner);if(activeId)state.activeId=activeId;
   const select=document.getElementById("studentSelect");if(!select)return;
   select.innerHTML=currentLearners.map(l=>`<option value="${esc(courseRecordId(l))}" data-learner-id="${esc(l.learnerId)}" ${courseRecordId(l)===state.activeId?"selected":""}>${esc(l.nickname||"Learner")}</option>`).join("");
  };
 }
 const select=document.getElementById("studentSelect");if(select){select.onchange=e=>{const opt=e.target.selectedOptions[0];state.activeId=e.target.value;const learnerId=opt?.dataset?.learnerId;if(learnerId){const l=R.getLearner?.(learnerId);if(l)R.setActive?.({familyId:l.familyId,learnerId:l.learnerId})}try{save()}catch{}try{render()}catch{}}}
 decorateLearnerPanel();
 try{render()}catch{}
}

function decorateLearnerPanel(){
 const select=document.getElementById("studentSelect");const panel=select?.closest("section.panel");if(!panel)return;
 const h=panel.querySelector("h3");if(h)h.textContent="Course Progress";
 const learners=familyLearners();
 panel.querySelectorAll("label").forEach(label=>{if(/add learner/i.test(label.textContent))label.classList.toggle("family-connected-hidden",learners.length>0);if(/active learner/i.test(label.textContent))label.textContent="Active learner"});
 [document.getElementById("studentName"),document.getElementById("addStudent"),document.getElementById("demo"),document.getElementById("deleteStudent")].forEach(el=>el?.classList.toggle("family-connected-hidden",learners.length>0));
 const inputRow=document.getElementById("studentName")?.closest(".inline");if(inputRow)inputRow.classList.toggle("family-connected-hidden",learners.length>0);
 const actionRow=document.getElementById("demo")?.closest(".actions");if(actionRow)actionRow.classList.toggle("family-connected-hidden",learners.length>0);
 let note=panel.querySelector(".khae-family-note");if(!note){note=document.createElement("p");note.className="khae-family-note";panel.appendChild(note)}
 let links=panel.querySelector(".khae-family-links");if(!links){links=document.createElement("div");links.className="khae-family-links";links.innerHTML=`<a href="${STUDENT_PORTAL}">Student Profile</a><a href="${FAMILY_PORTAL}">Family Hub</a>`;panel.appendChild(links)}
 const active=activeAcademyLearner();note.textContent=active?`Course progress is connected to ${active.nickname||"the active learner"}.`:"Open the Student Profile to choose or register a learner.";
}

function readPins(){try{const value=JSON.parse(localStorage.getItem(PIN_KEY)||"null");return value&&typeof value==="object"?value:{version:1,learners:{}}}catch{return {version:1,learners:{}}}}
function writePins(value){try{localStorage.setItem(PIN_KEY,JSON.stringify(value));return true}catch{return false}}
function pinnedFor(learnerId){const store=readPins(),items=store.learners?.[learnerId];return Array.isArray(items)?items:[]}
function isPinned(){const l=activeAcademyLearner();return Boolean(l&&pinnedFor(l.learnerId).some(x=>x?.id===COURSE_ID))}
function updatePin(){const b=document.getElementById("pinCourseButton");if(!b)return;const learner=activeAcademyLearner();if(!learner){b.setAttribute("aria-pressed","false");b.textContent="☆ Pin to Profile";b.title="Choose a learner in the Student Profile before pinning";return}const yes=isPinned();b.setAttribute("aria-pressed",String(yes));b.textContent=yes?"★ Pinned to Profile":"☆ Pin to Profile";b.title=yes?"Remove Pre-Algebra from the active learner profile":"Pin Pre-Algebra to the active learner profile"}
function togglePin(){const learner=activeAcademyLearner();if(!learner){location.href=STUDENT_PORTAL;return}const store=readPins();store.version=1;store.learners=store.learners&&typeof store.learners==="object"?store.learners:{};let items=pinnedFor(learner.learnerId).filter(x=>x&&x.id!==COURSE_ID);if(!isPinned())items.unshift({id:COURSE_ID,title:"Pre-Algebra",subtitle:"Open-Age Mathematics",href:COURSE_URL,updatedAt:new Date().toISOString()});store.learners[learner.learnerId]=items.slice(0,24);if(!writePins(store)){alert("This browser could not update the pinned course.");return}updatePin();const status=document.getElementById("pinCourseStatus");if(status)status.textContent=isPinned()?"Pre-Algebra is pinned to the active learner profile.":"Pre-Algebra was removed from the active learner profile."}
function installPin(){const b=document.getElementById("pinCourseButton");if(!b)return;b.onclick=togglePin;updatePin();window.addEventListener("storage",e=>{if(e.key===PIN_KEY)updatePin()});window.addEventListener("khaemenes-family-changed",()=>{ensureCourseRecord(activeAcademyLearner());decorateLearnerPanel();updatePin()})}

function hasQuizAttempt(s,w){try{return (weekRec(s,w).quiz.attempts||[]).length>0}catch{return false}}
function hardenedStats(s){
 if(!s)return{lessons:0,assignments:null,quizzes:null,course:null,completion:0,done:0,total:180,needs:[],midterm:null,final:null,capstone:null};
 ensure(s);let done=0,assignments=[],quizzes=[],completion=[],needs=[];
 APP.weeks.forEach(w=>{const lp=lessonPct(s,w.week),ap=assignPct(s,w.week),attempted=hasQuizAttempt(s,w.week),qb=attempted?Math.round(weekRec(s,w.week).quiz.best??0):null,started=lp>0||ap>0||attempted;done+=Math.round(lp/20);if(ap>0)assignments.push(ap);if(attempted)quizzes.push(qb);if(started)completion.push(weekCompletion(s,w.week));if((attempted&&qb<APP.passingTarget)||(started&&(lp<100||ap<100)))needs.push(w.week)});
 const midRec=s.progress.exams?.midterm,finRec=s.progress.exams?.final,midAttempt=Array.isArray(midRec?.attempts)&&midRec.attempts.length>0,finAttempt=Array.isArray(finRec?.attempts)&&finRec.attempts.length>0;
 const rubric=s.progress.capstone?.rubric||{},capAttempt=Object.keys(rubric).length>0||(s.progress.capstone?.logs||[]).length>0;
 const quizAvg=quizzes.length?Math.round(average(quizzes)):null,mid=midAttempt?Math.round(midRec.best??0):null,fin=finAttempt?Math.round(finRec.best??0):null,cap=capAttempt?Math.round(s.progress.capstone.score??0):null;
 const components=[];if(quizAvg!==null)components.push({value:quizAvg,weight:55});if(mid!==null)components.push({value:mid,weight:15});if(fin!==null)components.push({value:fin,weight:20});if(cap!==null)components.push({value:cap,weight:10});const totalWeight=components.reduce((n,p)=>n+p.weight,0),course=totalWeight?Math.round(components.reduce((n,p)=>n+p.value*p.weight,0)/totalWeight):null;
 return{lessons:Math.round(done/180*100),assignments:assignments.length?Math.round(average(assignments)):null,quizzes:quizAvg,completion:completion.length?Math.round(average(completion)):0,course,done,total:180,midterm:mid,final:fin,capstone:cap,needs};
}
function hardenedWeekList(){const s=student(),list=document.getElementById("weekList");if(!list)return;list.innerHTML=APP.weeks.map(w=>{const attempted=s&&hasQuizAttempt(s,w.week),qb=attempted?Math.round(weekRec(s,w.week).quiz.best??0):null,tag=attempted?(qb>=APP.passingTarget?"good":"bad"):"";return `<button class="weekBtn ${w.week===activeWeek?"active":""}" data-week="${w.week}"><span><strong>${w.week}</strong> ${esc(w.title)}</span><span class="pill ${tag}">${attempted?qb:"—"}</span></button>`}).join("");list.querySelectorAll("[data-week]").forEach(b=>b.onclick=()=>{activeWeek=Number(b.dataset.week);view="week";render()})}
function fixZeroLabels(){const s=typeof student==="function"?student():null;if(!s)return;const st=hardenedStats(s);document.querySelectorAll(".kpi").forEach(card=>{const label=card.querySelector("span")?.textContent.trim(),strong=card.querySelector("strong");if(!strong)return;if(label==="Quiz Mastery")strong.textContent=st.quizzes===null?"—":String(st.quizzes)+(view==="reports"?"":"");if(label==="Overall Mastery")strong.textContent=st.course===null?"—":String(st.course)+(view==="reports"?"%":"");if(label==="Midterm")strong.textContent=st.midterm===null?"—":String(st.midterm);if(label==="Final")strong.textContent=st.final===null?"—":String(st.final)});if(view==="week"&&s){const r=weekRec(s,activeWeek),attempted=(r.quiz.attempts||[]).length>0,best=Math.round(r.quiz.best??0);if(attempted&&best<APP.passingTarget&&!document.getElementById("zeroMasteryNotice")){const card=document.querySelector("#content>.card");if(card){const p=document.createElement("p");p.id="zeroMasteryNotice";p.className="notice";p.textContent=`This mastery check is below ${APP.passingTarget}%. Review the unit, correct errors, and retake when ready.`;card.appendChild(p)}}}}

function hardenedProportion(){const a=num("pa"),b=num("pb"),c=num("pc"),out=document.getElementById("propOut");if(!need([a,b,c],"propOut"))return;if(b===0){out.textContent="The proportion is undefined because b cannot be 0.";return}if(a===0&&c===0){out.textContent="The equation does not determine one unique value of x; any nonzero x satisfies 0/b = 0/x.";return}if(a===0||c===0){out.textContent="There is no valid nonzero value of x for these inputs.";return}const x=b*c/a;out.textContent=`x = (b × c) / a = (${b} × ${c}) / ${a} = ${x}`}

function hardenedOverview(){document.getElementById("content").innerHTML=`<div class="grid"><div class="card col12"><span class="pill">Open age</span><span class="pill">36 weeks</span><span class="pill">Foundation · Core · Extended</span><h3>How to Use This Course</h3><p>This level-based course provides a complete bridge from arithmetic and proportional reasoning into Algebra I. Begin with the readiness diagnostic, choose the support pathway that fits the learner, and advance through demonstrated mastery.</p></div><div class="card col6"><h3>Learning Cycle</h3><ol><li>Open the complete unit lesson.</li><li>Study concepts and worked examples.</li><li>Complete practice with written reasoning.</li><li>Use tools to explore or verify the mathematics.</li><li>Analyze errors and complete corrections.</li><li>Retake mastery checks when more practice is needed.</li></ol></div><div class="card col6"><h3>Evidence of Learning</h3><p>Weekly work, mastery checks, cumulative assessments, corrections, and the modelling capstone provide different kinds of evidence. Course progress and cumulative assessment records remain clearly separated so a checked task is never mistaken for mathematical mastery.</p><div class="actions"><a class="button secondary" href="assessments/">Assessment Center</a><button class="secondary" type="button" onclick="view='reports';render()">Course Progress</button></div></div><div class="card col4"><h3>Foundation</h3><p>Concrete models, smaller steps, vocabulary support, worked examples, and additional practice.</p></div><div class="card col4"><h3>Core</h3><p>The full Pre-Algebra pathway with conceptual understanding, fluency, application, and explanation.</p></div><div class="card col4"><h3>Extended</h3><p>Generalization, unfamiliar contexts, deeper modelling, and early Algebra I connections.</p></div><div class="card col12"><h3>Course Exit Evidence</h3><p>Readiness for Algebra I is supported by sustained success with number operations, proportional reasoning, expressions, equations, inequalities, functions, graphs, data, and mathematical modelling.</p><div class="actions"><a class="button" href="diagnostic/">Begin Diagnostic</a><button class="secondary" type="button" onclick="view='scope';render()">View 36-Week Scope</button></div></div></div>`}

function hardenedExams(){document.getElementById("content").innerHTML=`<div class="card assessment-center"><p class="eyebrow">Cumulative assessment</p><h3>Midterm & Final</h3><p>Use the course assessment center for the official cumulative Pre-Algebra assessments and supporting records.</p><div class="assessment-grid"><article class="assessment-choice"><h4>Midterm</h4><p>Covers Units 01–07 and the first half of the 36-week course.</p><div class="actions"><a class="button" href="assessments/midterm-units-01-07.html">Open Midterm</a></div></article><article class="assessment-choice"><h4>Final Cumulative Assessment</h4><p>Covers the complete 36-week Pre-Algebra pathway.</p><div class="actions"><a class="button" href="assessments/final-exam-36-weeks.html">Open Final</a></div></article></div><div class="actions"><a class="button secondary" href="assessments/">Assessment Center</a><a class="button secondary" href="assessments/administration-guide.html">Administration Guide</a></div></div>`}

function hardenedStandards(){const coverage={};APP.weeks.forEach(w=>(w.tags||[]).forEach(tag=>{coverage[tag]??=[];coverage[tag].push(w.week)}));document.getElementById("content").innerHTML=`<div class="grid"><div class="card col12"><p class="eyebrow">Academic alignment</p><h3>Standards & Frameworks</h3><p>The 36-week sequence is organized around widely recognized secondary mathematics expectations while maintaining a coherent Pre-Algebra progression toward Algebra I.</p><p class="section-note">Framework labels are alignment guides. Families and schools may compare them with the requirements that apply in their own jurisdiction.</p></div><div class="card col12 framework-table"><table><thead><tr><th>Framework connection</th><th>Course weeks</th></tr></thead><tbody>${Object.entries(coverage).sort(([a],[b])=>a.localeCompare(b)).map(([tag,weeks])=>`<tr><td>${esc(tag)}</td><td>${weeks.join(", ")}</td></tr>`).join("")}</tbody></table></div></div>`}

function hardenedReports(){const s=student(),st=hardenedStats(s);document.getElementById("content").innerHTML=`<div class="grid"><div class="card kpi"><strong>${st.course===null?"—":st.course+"%"}</strong><span>Current Mastery</span></div><div class="card kpi"><strong>${st.lessons}%</strong><span>Lesson Completion</span></div><div class="card kpi"><strong>${st.quizzes===null?"—":st.quizzes+"%"}</strong><span>Weekly Quiz Mastery</span></div><div class="card kpi"><strong>${st.capstone===null?"—":st.capstone+"%"}</strong><span>Capstone</span></div><div class="card col12"><h3>Course Progress & Backups</h3><p class="section-note">This report summarizes work completed inside the course portal. Cumulative assessment records are available from the Assessment Center.</p><div class="actions"><button type="button" onclick="printReport()">Print</button><button class="secondary" type="button" onclick="downloadReport()">Download HTML</button><button class="secondary" type="button" onclick="downloadCSV()">Download CSV</button><button class="ghost" type="button" onclick="downloadBackup()">Export JSON</button><label class="button secondary">Import JSON <input type="file" accept=".json,application/json" style="display:none" onchange="importBackup(event)"></label><a class="button secondary" href="assessments/">Assessment Center</a></div></div><div class="card col12"><div class="table-wrap">${progressTable(s)}</div></div></div>`}

function currentWeek(){try{return APP.weeks.find(w=>w.week===Number(activeWeek))||APP.weeks[0]}catch{return null}}
function mentorHref(){const w=currentWeek(),q=new URLSearchParams({course:"Pre-Algebra"});if(w){q.set("week",`Week ${w.week}`);q.set("unit",w.unitTitle||"");q.set("lesson",w.title||"");q.set("concept",w.domain||"")}return `${MENTOR_HOME}?${q.toString()}`}
function mentorContext(){const w=currentWeek();return w?`Pre-Algebra · Week ${w.week} · ${w.unitTitle}`:"Pre-Algebra · Open-Age Mathematics"}
function createMentor(){if(document.getElementById("khaeCourseMentor"))return;const main=document.querySelector(".main"),tabs=main?.querySelector(".tabs");if(!main||!tabs)return;const section=document.createElement("section");section.className="khae-mentor";section.id="khaeCourseMentor";section.innerHTML=`<div class="khae-mentor-portrait"><img src="https://artist1970.github.io/Archaemenes.github.io/assets/Archaemens-high.png" alt="Archaemenes, educational mentor"></div><div class="khae-mentor-copy"><div class="khae-mentor-kicker">Scholar · Educational Mentor · Mathematics</div><h2>Study with Archaemenes.</h2><p>Open the mentor when another explanation, a hint, a fresh practice example, or help organizing mathematical reasoning would be useful.</p><p class="khae-mentor-context" id="khaeMentorContext">${esc(mentorContext())}</p><div class="khae-mentor-actions"><a class="primary" id="khaeMentorLink" href="${mentorHref()}">Open Archaemenes</a><a class="secondary" href="${HIGH_HOME}">Khaemenes High</a></div></div>`;tabs.before(section)}
function refreshMentor(){const c=document.getElementById("khaeMentorContext"),a=document.getElementById("khaeMentorLink");if(c)c.textContent=mentorContext();if(a)a.href=mentorHref()}

function installOverrides(){
 try{stats=hardenedStats}catch{}
 try{renderWeekList=hardenedWeekList}catch{}
 try{proportionTool=hardenedProportion}catch{}
 try{overview=hardenedOverview}catch{}
 try{exams=hardenedExams}catch{}
 try{standards=hardenedStandards}catch{}
 try{reports=hardenedReports}catch{}
 const originalWeek=typeof week==="function"?week:null;if(originalWeek){try{week=function(){originalWeek();fixZeroLabels()}}catch{}}
 const originalRender=typeof render==="function"?render:null;if(originalRender){try{render=function(){originalRender();decorateLearnerPanel();updatePin();refreshMentor();fixZeroLabels()}}catch{}}
}

function boot(){addStyle();patchNavigation();installOverrides();createMentor();loadScript(BETA_WIDGET,"vnvBetaWidgetScript");if(familyRegistry()){installLearnerContinuity();installPin()}else loadScript(FAMILY_REGISTRY,"khaemenesFamilyRegistryScript",()=>{installLearnerContinuity();installPin()});document.addEventListener("click",e=>{if(e.target.closest("[data-week],[data-view],[data-go]"))setTimeout(()=>{refreshMentor();decorateLearnerPanel();fixZeroLabels()},20)})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();

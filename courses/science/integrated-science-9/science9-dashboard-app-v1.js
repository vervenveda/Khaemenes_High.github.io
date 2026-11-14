/* Integrated Science 9 dashboard/workspace application.
   Runtime logic extracted from index.html without changing learner-storage or mastery semantics.
*/
const APP=window.KhaemenesScience9CourseData;
if(!APP)throw new Error("Science 9 course data failed to load.");
const ENTRY=window.KhaemenesCourseEntryContract, ENTRY_PROFILE=ENTRY?.readAcademyProfile?.();
const KEY=ENTRY?.scopedKey?.("khae-grade09-integrated-science-portal-v1",ENTRY_PROFILE)||"khae-grade09-integrated-science-portal-v1";
const ENTRY_DECISION=window.KhaemenesScience9Entry?.decision?.()||{allow:false};
const ENTRY_BLOCKED=!ENTRY_DECISION.allow||!ENTRY_PROFILE;
const COURSE_QUERY=new URLSearchParams(location.search),QUERY_WEEK=Math.max(1,Math.min(36,Number(COURSE_QUERY.get("week"))||1)),QUERY_VIEW=COURSE_QUERY.get("view");
let state=loadState(),currentView=["dashboard","week","scope","lab","assessments","reports","standards"].includes(QUERY_VIEW)?QUERY_VIEW:"dashboard",selectedWeek=QUERY_WEEK,sets={},labSet=[];
function blankState(){return {students:[],activeId:null,theme:"light"}}
function loadState(){try{return JSON.parse(localStorage.getItem(KEY))||blankState()}catch{return blankState()}}
function save(){if(ENTRY_BLOCKED)return;try{if(ENTRY?.identityRaw?.()!==JSON.stringify(ENTRY_PROFILE.learnerId))throw Error("The Academy learner changed.");localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function uid(){return "s_"+Date.now()+"_"+Math.random().toString(36).slice(2,8)}
function blankStudent(name){return {id:uid(),name,pathway:"Core",days:{},scores:{},attempts:{},notes:{},exit:{},data:{},safety:{},created:new Date().toISOString()}}
function active(){return state.students.find(s=>s.id===state.activeId)||null}
const SPACE_SEQUENCE_VERSION="unit11-space-v2-20261018";
function alignUnit11Sequence(s){
 if(s.sequenceVersion===SPACE_SEQUENCE_VERSION)return false;
 const fields=["days","scores","attempts","notes","exit","data","safety"],snapshot={};let hasLegacy=false;
 for(const field of fields){const source=s[field]||{};for(const week of [31,32,33])if(Object.prototype.hasOwnProperty.call(source,week)){snapshot[field]??={};snapshot[field][week]=JSON.parse(JSON.stringify(source[week]));delete source[week];hasLegacy=true}}
 if(hasLegacy){s.legacySequenceArchive??={};s.legacySequenceArchive["pre-unit11-space-v2"]={archivedAt:new Date().toISOString(),weeks:[31,32,33],reason:"Portal weeks 31–33 were realigned to the canonical Unit 11 astronomy sequence.",records:snapshot}}
 s.sequenceVersion=SPACE_SEQUENCE_VERSION;return true
}
function ensure(){if(ENTRY_BLOCKED)return;let changed=false;if(!state.students.length){const s=blankStudent(ENTRY_PROFILE?.name||"Student 1");s.id=ENTRY_PROFILE?.learnerId||s.id;state.students=[s];state.activeId=s.id;changed=true}if(!active()){state.activeId=state.students[0].id;changed=true}state.students.forEach(s=>{if(alignUnit11Sequence(s))changed=true});if(changed)save()}
ensure();
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function avg(a){return a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):0}
function portalReviewedDays(){return Object.values(active().days||{}).reduce((n,o)=>n+Object.values(o).filter(Boolean).length,0)}
function detailedUnitRecord(unitNumber){
 const learner=ENTRY_PROFILE?.learnerId;if(!learner)return null;
 const u=String(unitNumber).padStart(2,"0"),key=`kh_sci9_u${u}_learner_v1:${encodeURIComponent(String(learner))}:khaemenes_science_u${u}_v1`;
 try{const record=JSON.parse(localStorage.getItem(key)||"null");return record&&typeof record==="object"&&!Array.isArray(record)?record:null}catch{return null}
}
function detailedDayId(w,lessonIndex){const weeks=APP.weeks.filter(row=>row.unitNumber===w.unitNumber),wi=Math.max(0,weeks.findIndex(row=>row.week===w.week));return "day"+String(wi*5+lessonIndex+1).padStart(2,"0")}
function detailedLessonComplete(w,lessonIndex){
 const record=detailedUnitRecord(w.unitNumber),id=detailedDayId(w,lessonIndex);if(!record)return false;
 if(record.lessonEvidence&&typeof record.lessonEvidence==="object"&&record.lessonEvidence[id]?.complete===true)return true;
 return Array.isArray(record.completedPages)&&record.completedPages.includes(id)
}
function detailedLessonsForWeek(w){return w.lessons.reduce((n,_,i)=>n+Number(detailedLessonComplete(w,i)),0)}
function completedDetailedLessons(){return APP.weeks.reduce((n,w)=>n+detailedLessonsForWeek(w),0)}
function reviewedWeeks(){return APP.weeks.filter(w=>Object.values(active().days?.[w.week]||{}).filter(Boolean).length===5).length}
function masteredWeeks(){return APP.weeks.filter(w=>Number(active().scores?.[w.week]||0)>=APP.passingTarget).length}
function completedWeeks(){return masteredWeeks()}
function masteredThrough(n){for(let w=1;w<=n;w++)if(Number(active().scores?.[w]||0)<APP.passingTarget)return false;return true}
function weekHasEvidence(n){const s=active(),days=s.days?.[n]||{},notes=s.notes?.[n]||{},data=s.data?.[n]||{};return Object.values(days).some(Boolean)||Number(s.scores?.[n]||0)>0||Object.keys(notes).length>0||Object.keys(data).length>0||Boolean(s.exit?.[n])||Boolean(s.safety?.[n])}
function weekUnlocked(n){return n<=1||Number(active().scores?.[n-1]||0)>=APP.passingTarget||weekHasEvidence(n)}
function scores(){return Object.values(active().scores||{}).map(Number).filter(Number.isFinite)}
function weekState(n){const s=active();return {days:s.days?.[n]||{},notes:s.notes?.[n]||{},exit:s.exit?.[n]||"",data:s.data?.[n]||{}}}
function renderAll(){renderStudent();renderPathway();renderWeeks();renderNav();renderView()}
function renderStudent(){$("#studentSelect").innerHTML=state.students.map(s=>`<option value="${s.id}" ${s.id===state.activeId?"selected":""}>${esc(s.name)}</option>`).join("")}
function renderPathway(){const s=active();$("#pathway").innerHTML=APP.pathways.map(p=>`<option ${p===s.pathway?"selected":""}>${p}</option>`).join("");$("#pathwayMessage").textContent=s.pathway==="Foundation"?"Vocabulary support, visual models, smaller steps, guided calculations, scaffolded investigations, and confidence-building practice.":s.pathway==="Extended"?"Honors depth, unfamiliar applications, independent investigation, advanced data interpretation, research, modelling, and deeper evaluation.":"The complete Grade 9 sequence and required scientific practices."}
function renderNav(){$(".navBtn,.tab").forEach(b=>{const active=b.dataset.view===currentView;b.classList.toggle("active",active);b.setAttribute("aria-pressed",active?"true":"false")})}
function renderWeeks(){const s=active();$("#weekList").innerHTML=APP.weeks.map(w=>{const d=Object.values(s.days?.[w.week]||{}).filter(Boolean).length,detail=detailedLessonsForWeek(w),sc=Number(s.scores?.[w.week]||0),unlocked=weekUnlocked(w.week),mastered=sc>=APP.passingTarget,status=mastered?sc+"% Mastered":!unlocked?"Locked":detail?`${detail}/5 lessons${d?` · ${d}/5 review`:""}`:d?`${d}/5 review`:sc?sc+"%":"";return `<button class="weekButton ${selectedWeek===w.week?"active":""}" data-week="${w.week}" ${unlocked?"":`disabled aria-disabled="true" title="Week ${w.week-1} must reach ${APP.passingTarget}% mastery first"`}><span><strong>Week ${w.week}</strong><small>${esc(w.title)}</small></span><span>${status}</span></button>`}).join("");$(".weekButton:not([disabled])").forEach(b=>b.onclick=()=>{selectedWeek=Number(b.dataset.week);setView("week")})}
function setView(v){currentView=v;renderAll();window.scrollTo({top:0,behavior:"smooth"})}
function renderView(){({dashboard:renderDashboard,week:renderWeek,scope:renderScope,lab:renderScienceLab,assessments:renderAssessments,reports:renderReports,standards:renderStandards}[currentView]||renderDashboard)()}
function renderDashboard(){
 const s=active(),sc=scores(),mastered=masteredWeeks(),reviewed=reviewedWeeks(),next=APP.weeks.find(w=>Number(s.scores?.[w.week]||0)<APP.passingTarget)||APP.weeks[35];
 $("#content").innerHTML=`<div class="grid">
 <div class="card kpi"><strong>${mastered}/36</strong><span>Weeks mastered</span></div><div class="card kpi"><strong>${reviewed}/36</strong><span>Weeks reviewed</span></div><div class="card kpi"><strong>${completedDetailedLessons()}/180</strong><span>Detailed lessons complete</span></div><div class="card kpi"><strong>${avg(sc)}%</strong><span>Mastery average</span></div>
 <div class="card col8"><span class="pill good">KH-SCI-IIS9</span><span class="pill">${esc(s.pathway)} pathway</span><h3>Continue with Week ${next.week}</h3><h4>${esc(next.title)}</h4><p>${esc(next.essentialQuestion)}</p><div class="progressbar"><span style="width:${Math.round(mastered/36*100)}%"></span></div><p class="small">${Math.round(mastered/36*100)}% of weekly mastery gates cleared · next week unlocks at ${APP.passingTarget}%.</p><div class="actions"><button data-open="${next.week}">Open Week ${next.week}</button><a class="button secondary" href="${next.unitUrl}">Open Current Detailed Unit</a></div></div>
 <div class="card col4"><h3>Course identity</h3><p>Biology, chemistry, physics, Earth and space science, environmental science, engineering, and scientific information literacy.</p><div class="actions"><a class="button ghost" href="${APP.links.courseCharter}">Course Charter</a></div></div>
 <div class="card col3"><h4>Safety & Diagnostic</h4><p>Verify readiness and laboratory-safety expectations.</p><a class="button secondary" href="${APP.links.diagnostic}">Open Diagnostic</a></div>
 <div class="card col3"><h4>Course Hall</h4><p>Browse the published unit directory. Student progression in this portal remains mastery-gated.</p><a class="button secondary" href="${APP.links.scienceCourse}">Open Course Directory</a></div>
 <div class="card col3"><h4>Assessments</h4><p>Open cumulative practice after the required weekly mastery gates clear.</p><button class="secondary" data-view-assess>Assessment Center</button></div>
 <div class="card col3"><h4>Backup</h4><p>Protect local profiles, notes, graphs, and mastery records.</p><button class="secondary" id="quickBackup">Export Backup</button></div>
 </div>`;$$("[data-open]").forEach(b=>b.onclick=()=>{selectedWeek=Number(b.dataset.open);setView("week")});$("[data-view-assess]").onclick=()=>setView("assessments");$("#quickBackup").onclick=downloadBackup
}
function renderWeek(){
 const w=APP.weeks[selectedWeek-1],p=weekState(w.week),done=Object.values(p.days).filter(Boolean).length,detailedDone=detailedLessonsForWeek(w);
 const sequenceNote=w.week>=31&&w.week<=33?`<div class="notice"><strong>Unit 11 sequence alignment:</strong> Weeks 31–33 now follow the canonical astronomy unit. Any older local Week 31–33 work from the previous labels was preserved in the learner backup archive rather than relabeled as astronomy mastery.</div>`:"";
 if(!weekUnlocked(w.week)){const prior=w.week-1,score=Number(active().scores?.[prior]||0);$("#content").innerHTML=`<div class="card"><span class="pill warn">Mastery gate</span><h3>Week ${w.week} is locked</h3><p>Week ${prior} must reach at least ${APP.passingTarget}% on its open-book formative mastery check before this week opens. Current best: ${score}%.</p><div class="actions"><button id="returnGateWeek">Return to Week ${prior}</button></div></div>`;$("#returnGateWeek").onclick=()=>{selectedWeek=prior;setView("week")};return}
 $("#content").innerHTML=`<div class="grid">
 <div class="card col4"><span class="pill">Week ${w.week}</span><span class="pill">Unit ${String(w.unitNumber).padStart(2,"0")}</span><span class="pill">${esc(active().pathway)}</span><h3>${esc(w.title)}</h3><p>${esc(w.essentialQuestion)}</p><div class="progressbar"><span style="width:${done/5*100}%"></span></div><p class="small">${detailedDone} of 5 detailed lessons complete · ${done} of 5 weekly review checks · Best mastery ${Number(active().scores?.[w.week]||0)}% · ${Number(active().scores?.[w.week]||0)>=APP.passingTarget?"Next week unlocked":"Next week remains locked until 80%"}</p><div class="actions"><a class="button secondary" href="${w.unitUrl}">Open Detailed Unit</a><button class="ghost" id="packetBtn">Download Class Packet</button></div></div>
 <div class="card col8">${sequenceNote}<div class="phenomenon"><h3>Weekly phenomenon</h3><p>${esc(w.phenomenon)}</p></div><h4 style="margin-top:16px">Reading or source suggestion</h4><p>${esc(w.readingSuggestion)}</p><h4>Investigation mode</h4><div class="notice"><strong>${esc(w.mode)}</strong> · Safety instructions must appear before materials or procedures. Stop if supervision, equipment, or conditions are not appropriate.</div><div style="margin-top:12px">${w.vocabulary.map(v=>`<span class="pill">${esc(v)}</span>`).join("")}</div></div>
 <div class="card col12"><h3>Monday–Friday classroom</h3>${w.lessons.map((l,i)=>lessonHTML(w,l,p,i)).join("")}</div>
 <div class="card col12"><h3>Interactive science notebook</h3>${notebookHTML(w,p)}</div>
 <div class="card col12"><h3>Open-book formative mastery check</h3><p class="small">Ten randomized objective items draw from a larger reviewed bank, retain the generated form and answers through refresh, and provide explanations. Best score is retained; 80% unlocks the next week. Official midterm/final mastery remains separately supervised.</p><div id="problemSet">${problemSetHTML(w)}</div></div>
 </div>`;
 $$("[data-day]").forEach(x=>x.onchange=()=>{active().days[w.week]??={};active().days[w.week][x.dataset.day]=x.checked;save();renderWeeks()});
 $$("[data-note]").forEach(x=>x.oninput=()=>{active().notes[w.week]??={};active().notes[w.week][x.dataset.note]=x.value;save()});
 $("#exitTicket").oninput=e=>{active().exit[w.week]=e.target.value;save()};
 $("#safetyCheck").onchange=e=>{active().safety[w.week]=e.target.checked;save()};
 $("#plotBtn").onclick=()=>plotWeekData(w.week);$("#packetBtn").onclick=()=>downloadText(`Science9_Week_${String(w.week).padStart(2,"0")}_Packet.html`,packetHTML(w.week),"text/html");
 wireWeeklyMastery(w);$("#submitPractice").onclick=()=>submitSet(w.week);$("#newPractice").onclick=()=>newWeeklySet(w);
 plotWeekData(w.week,false)
}
function lessonDetailHref(w,lessonIndex){const unitWeeks=APP.weeks.filter(row=>row.unitNumber===w.unitNumber),unitWeekIndex=Math.max(0,unitWeeks.findIndex(row=>row.week===w.week)),day=String(unitWeekIndex*5+lessonIndex+1).padStart(2,"0");return w.unitNumber===0?`diagnostic/lessons/day-${day}.html`:`units/unit-${String(w.unitNumber).padStart(2,"0")}/lessons/day-${day}.html`}function lessonHTML(w,l,p,lessonIndex){const href=lessonDetailHref(w,lessonIndex);return `<article class="lesson"><div class="lessonHeader"><div><span class="pill">${l.day}</span><h4>${esc(l.title)}</h4></div><label class="check"><input type="checkbox" data-day="${l.day}" ${p.days[l.day]?"checked":""}> Weekly review complete</label></div><p><strong>Objective:</strong> ${esc(l.objective)}</p><p><strong>Mini-lesson:</strong> ${esc(l.miniLesson)}</p><p><strong>Activity:</strong> ${esc(l.activity)}</p><p><strong>Assignment:</strong> ${esc(l.assignment)}</p><p class="small"><strong>Evidence:</strong> ${esc(l.evidence)}</p><div class="actions"><a class="button secondary" href="${href}">Open Detailed ${esc(l.day)} Lesson</a></div></article>`}
function notebookHTML(w,p){const n=p.notes||{},d=p.data||{};return `<div class="labGrid">
 <div class="lab"><h4>Phenomenon notebook</h4><label>Direct observations<textarea data-note="observations">${esc(n.observations||"")}</textarea></label><label>Questions / notice and wonder<textarea data-note="questions">${esc(n.questions||"")}</textarea></label><label>Initial model or explanation<textarea data-note="initial">${esc(n.initial||"")}</textarea></label></div>
 <div class="lab"><h4>Investigation planner</h4><label>Testable question<textarea data-note="testable">${esc(n.testable||"")}</textarea></label><label>Independent variable<input data-note="iv" value="${esc(n.iv||"")}"></label><label>Dependent variable<input data-note="dv" value="${esc(n.dv||"")}"></label><label>Controls, repeated trials, and procedure<textarea data-note="controls">${esc(n.controls||"")}</textarea></label><label class="check"><input id="safetyCheck" type="checkbox" ${active().safety?.[w.week]?"checked":""}> Safety, supervision, materials, disposal, and stop conditions verified</label></div>
 <div class="lab"><h4>Data table</h4><div class="dataGrid"><div class="head">Trial / X</div><div class="head">Measurement / Y</div><div class="head">Observation</div>${[0,1,2,3,4,5].map(i=>`<input type="number" step="any" data-x="${i}" value="${esc(d.x?.[i]??"")}" placeholder="X${i+1}"><input type="number" step="any" data-y="${i}" value="${esc(d.y?.[i]??"")}" placeholder="Y${i+1}"><input data-obs="${i}" value="${esc(d.obs?.[i]??"")}" placeholder="Note"></input>`).join("")}</div><div class="actions"><button id="plotBtn">Save & Plot Data</button></div><p class="small" id="dataStats"></p></div>
 <div class="lab"><h4>Graph</h4><div class="graphBox" id="graphBox"><p class="small">Enter numeric X and Y values, then plot.</p></div></div>
 <div class="lab"><h4>Claim–Evidence–Reasoning</h4><label>Claim<textarea data-note="claim">${esc(n.claim||"")}</textarea></label><label>Evidence / data<textarea data-note="evidence">${esc(n.evidence||"")}</textarea></label><label>Reasoning and scientific connection<textarea data-note="reasoning">${esc(n.reasoning||"")}</textarea></label><label>Uncertainty, assumptions, or limitations<textarea data-note="limitations">${esc(n.limitations||"")}</textarea></label></div>
 <div class="lab"><h4>Source evaluation</h4><label>Source and author / organization<input data-note="source" value="${esc(n.source||"")}"></label><label>Evidence, methods, date, and attribution<textarea data-note="sourceEvidence">${esc(n.sourceEvidence||"")}</textarea></label><label>Limits, interests, missing context, or uncertainty<textarea data-note="sourceLimits">${esc(n.sourceLimits||"")}</textarea></label></div>
 <div class="lab"><h4>Friday exit ticket</h4><label>What changed in your explanation? What evidence is strongest? What must be reviewed?<textarea id="exitTicket">${esc(p.exit||"")}</textarea></label></div>
 <div class="lab full"><details><summary><strong>Class materials</strong></summary><div class="materialGrid" style="margin-top:10px">${w.classMaterials.map(m=>`<div class="material"><strong>${esc(m.title)}</strong><span class="small">${esc(m.type)}</span></div>`).join("")}</div></details></div>
 </div>`}
function plotWeekData(weekNo,saveData=true){
 const xs=[...document.querySelectorAll("[data-x]")].map(e=>e.value),ys=[...document.querySelectorAll("[data-y]")].map(e=>e.value),obs=[...document.querySelectorAll("[data-obs]")].map(e=>e.value);
 if(saveData){active().data[weekNo]={x:xs,y:ys,obs};save()}
 const pts=xs.map((x,i)=>({x:Number(x),y:Number(ys[i])})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));
 const box=$("#graphBox"),stats=$("#dataStats");if(!box)return;
 if(!pts.length){box.innerHTML='<p class="small">Enter numeric X and Y values, then plot.</p>';if(stats)stats.textContent="";return}
 let xmin=Math.min(...pts.map(p=>p.x)),xmax=Math.max(...pts.map(p=>p.x)),ymin=Math.min(...pts.map(p=>p.y)),ymax=Math.max(...pts.map(p=>p.y));
 if(xmin===xmax){xmin-=1;xmax+=1}if(ymin===ymax){ymin-=1;ymax+=1}
 const W=520,H=220,L=48,R=18,T=18,B=36,sx=x=>L+(x-xmin)/(xmax-xmin)*(W-L-R),sy=y=>H-B-(y-ymin)/(ymax-ymin)*(H-T-B);
 const sorted=[...pts].sort((a,b)=>a.x-b.x),poly=sorted.map(p=>`${sx(p.x)},${sy(p.y)}`).join(" "),mean=pts.reduce((a,p)=>a+p.y,0)/pts.length;
 box.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Student data graph"><line class="graphAxis" x1="${L}" y1="${T}" x2="${L}" y2="${H-B}"/><line class="graphAxis" x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}"/><polyline class="graphLine" points="${poly}"/>${pts.map(p=>`<circle class="graphPoint" cx="${sx(p.x)}" cy="${sy(p.y)}" r="4"><title>X ${p.x}, Y ${p.y}</title></circle>`).join("")}<text class="graphText" x="${L}" y="${H-8}">X: ${xmin} to ${xmax}</text><text class="graphText" x="${W-125}" y="${H-8}">Y: ${ymin} to ${ymax}</text></svg>`;
 if(stats)stats.textContent=`${pts.length} points · Mean Y = ${Number(mean.toFixed(3))} · Range Y = ${Number((ymax-ymin).toFixed(3))}`
}
function randint(a,b){return Math.floor(Math.random()*(b-a+1))+a}function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function mc(q,a,w,e){return {q,answer:String(a),choices:shuffle([String(a),...w.map(String)]),explanation:e}}function num(q,a,e,t=.001){return {q,answer:Number(a),explanation:e,tolerance:t}}
function makeQuestion(type){
 let a,b,c;
 switch(type){
 case"safety":return mc("What should happen before materials or procedures begin?","Review hazards, controls, supervision, and stop conditions",["Begin quickly and read safety later","Taste a material to identify it","Assume household materials are always harmless"],"Safety instructions and controls come before materials and procedures.");
 case"inquiry":return mc("In a fair test, which variable is deliberately changed?","independent variable",["dependent variable","controlled variable","conclusion"],"The independent variable is deliberately changed; the dependent variable is measured.");
 case"measurement":a=randint(2,90);return num(`Convert ${a} cm to meters.`,a/100,"There are 100 centimeters in one meter.",.0001);
 case"cells":return mc("Which structure controls movement of substances into and out of a cell?","cell membrane",["nucleus","ribosome","chromosome"],"The selectively permeable cell membrane regulates transport.");
 case"membrane":return mc("Osmosis is the net movement of what substance across a selectively permeable membrane?","water",["DNA","oxygen only","proteins only"],"Osmosis describes net water movement across a selectively permeable membrane.");
 case"cell_energy":return mc("Which process stores light energy in glucose?","photosynthesis",["cellular respiration","diffusion","mitosis"],"Photosynthesis uses light energy to build glucose from carbon dioxide and water.");
 case"organization":return mc("Which order moves from smaller to larger biological organization?","cell → tissue → organ → organ system",["tissue → cell → system → organ","organ → cell → tissue → organism","cell → organ system → tissue → organ"],"Cells form tissues, tissues form organs, and organs cooperate in organ systems.");
 case"body_systems":return mc("Which system carries oxygen and nutrients throughout the body?","circulatory system",["digestive system alone","skeletal system","integumentary system"],"The circulatory system transports materials in blood.");
 case"homeostasis":return mc("Sweating when body temperature rises is an example of:","negative feedback",["positive feedback","random mutation","chemical bonding"],"The response counteracts the original temperature change.");
 case"mitosis":return mc("What is the usual result of mitosis?","two genetically similar daughter cells",["four genetically varied gametes","one cell with no DNA","two cells with half the chromosome number"],"Mitosis normally produces two genetically similar cells with the same chromosome number.");
 case"meiosis":return mc("Meiosis normally produces cells with:","half the original chromosome number",["double the chromosome number","no chromosomes","identical chromosome combinations in every cell"],"Meiosis reduces chromosome number in gametes and contributes to variation.");
 case"genetics":return mc("In a simple Aa × Aa cross, what is the probability of genotype aa?","25%",["0%","50%","75%"],"The four equally likely genotypes are AA, Aa, Aa, and aa.");
 case"ecology":return mc("Which organisms recycle nutrients by breaking down dead material?","decomposers",["producers only","top predators only","pollinators only"],"Decomposers break down organic matter and return nutrients to ecosystems.");
 case"population":a=randint(20,90);b=randint(2,10);return num(`A sample area of ${b} m² contains ${a} organisms. What is density in organisms per m²?`,a/b,"Population density equals count divided by area.",.01);
 case"evolution_evidence":return mc("Which statement is a direct observation rather than a historical inference?","A measured allele frequency changed across five generations",["All present species share one unobserved historical ancestor","A fossil proves every detail of an unobserved event","A worldview conclusion requires no interpretation"],"A measured change across observed generations is direct empirical evidence; broader historical claims involve inference.");
 case"atom":a=randint(3,20);b=randint(a,2*a+10);return num(`An atom has atomic number ${a} and mass number ${b}. How many neutrons does it have?`,b-a,"Neutrons = mass number − atomic number.");
 case"periodic":return mc("Elements in the same vertical column of the periodic table are in the same:","group",["period","isotope","compound"],"Vertical columns are groups; elements in a group often show related chemical behavior.");
 case"ions":return mc("An atom that loses one electron becomes:","a positive ion",["a negative ion","an isotope only","a neutral molecule"],"Losing a negative electron leaves a net positive charge.");
 case"bonding":return mc("Which bonding model involves sharing electron pairs between atoms?","covalent bonding",["ionic bonding","nuclear fission","gravitational bonding"],"Covalent bonds are modeled as shared electron pairs.");
 case"reactions":return mc("In a chemical reaction, atoms are:","rearranged but conserved",["created from nothing","destroyed completely","converted into energy with no conditions"],"Chemical reactions rearrange atoms; atom counts are conserved.");
 case"matter":return mc("Which is a physical change?","melting ice",["burning paper","rusting iron","forming a precipitate"],"Melting changes state without creating a new substance.");
 case"motion":a=randint(20,120);b=randint(2,12);return num(`An object travels ${a} m in ${b} s. What is its average speed in m/s?`,a/b,"Average speed = distance ÷ time.",.01);
 case"forces":a=randint(2,15);b=randint(2,10);return num(`What net force accelerates a ${a} kg object at ${b} m/s²?`,a*b,"Use F = ma.");
 case"energy":a=randint(2,12);b=randint(2,10);return num(`Find kinetic energy for mass ${a} kg moving at ${b} m/s.`,.5*a*b*b,"Kinetic energy = ½mv².",.01);
 case"electricity":a=randint(2,12);b=randint(2,10);return num(`A circuit has current ${a} A and resistance ${b} Ω. Find voltage.`,a*b,"Ohm's law: V = IR.");
 case"waves":a=randint(2,12);b=randint(2,10);return num(`A wave has frequency ${a} Hz and wavelength ${b} m. Find speed in m/s.`,a*b,"Wave speed = frequency × wavelength.");
 case"information":return mc("In a communication system, which component detects the transmitted signal?","receiver",["source only","constraint","control group"],"The receiver detects the signal before it is decoded or converted to output.");
 case"earth_systems":return mc("Ocean water belongs primarily to which Earth sphere?","hydrosphere",["geosphere","biosphere","magnetosphere"],"The hydrosphere includes Earth's water.");
 case"cycles":return mc("Which process moves carbon dioxide from the atmosphere into plant biomass?","photosynthesis",["combustion","respiration","erosion"],"Photosynthesis incorporates atmospheric carbon into organic molecules.");
 case"environment":return mc("A defensible environmental decision should explicitly compare:","evidence, criteria, trade-offs, and affected stakeholders",["only the cheapest option","only one source","personal preference without evidence"],"Transparent decisions state evidence, criteria, trade-offs, and impacts.");
 case"tectonics":return mc("Most earthquakes and volcanoes cluster near:","tectonic plate boundaries",["the geographic equator only","all river mouths","the centers of every continent"],"Plate-boundary interactions create strong global patterns of seismic and volcanic activity.");
 case"climate":return mc("Which statement correctly distinguishes weather from climate?","Weather describes short-term conditions; climate describes long-term patterns",["Weather and climate are identical","Climate is one day's temperature","Weather can only be measured globally"],"Weather is short-term; climate concerns statistical patterns over longer periods.");
 case"space":return mc("What primarily causes Earth's seasons?","Earth's axial tilt as it orbits the Sun",["Earth being much closer to the Sun in summer everywhere","daily rotation alone","the Moon blocking sunlight"],"Axial tilt changes solar angle and day length through the year.");
 case"engineering_problem":return mc("Which is a constraint in an engineering design?","A maximum cost of $50",["The desired amount of pollution reduction","A measurement result","A scientific observation"],"A constraint limits the solution; a desired performance is usually a criterion.");
 case"engineering_test":return mc("Why should only one test variable be changed when comparing prototypes?","To make the effect of that change more interpretable",["To guarantee success","To remove all uncertainty","To avoid recording data"],"Controlling other variables improves the fairness and interpretability of the comparison.");
 default:return mc("A strong scientific conclusion should include:","a claim supported by relevant evidence and reasoning",["a claim without evidence","only a personal opinion","certainty beyond the data"],"Scientific explanations connect claims to evidence through reasoning and acknowledge limitations.");
 }}
const WEEKLY_BANK_CONFIG={
 inquiry:{unit:1,domains:["Questions","Variables","Definitions","Design","Study types","Causal reasoning","Questions & hypotheses","Variables & controls","Safety and design","Safety & design"]},
 measurement:{unit:1,domains:["Measurement","Data integrity","Graphing","Graph integrity","Tables & graphs","Data analysis","Uncertainty","Sources","Inference"]},
 cells:{unit:2,domains:["Cell theory","Cell types","Organelles","Plant cells","Microscopy","Cell size","Models","Evidence"]},
 membrane:{unit:2,domains:["Membranes","Diffusion","Osmosis","Transport","Cell size"]},
 cell_energy:{unit:2,domains:["Energy","Organelles","Plant cells","Models","Evidence"]},
 organization:{unit:2,domains:["Specialization","Organization","Cell types","Cell size","Organelles","Models"]},
 body_systems:{unit:3,domains:["Systems and homeostasis","Circulation model","Respiratory response"],prompt:/ventricle|atrium|circulat|capillar|blood|oxygen|alveol|breath|respirat|digest|bile|villi|intestin|kidney|excret|exercise/i},
 homeostasis:{unit:3,domains:["Systems and homeostasis","Thermoregulation data","Feedback data","Water balance","Respiratory response","Thermal energy","Negative feedback evidence","Controlled physiological comparison","Correlation and causation","Model limitation","Data quality","Physiological data ethics"],prompt:/homeostas|feedback|regulat|temperature|thermoreg|dehydrat|ADH|glucose|insulin|glucagon|heat loss|sweat|physiolog|water balance/i},
 mitosis:{unit:4,domains:["Cell cycle","Mitosis","Differentiation","Cell-cycle control","Genetic information"]},
 meiosis:{unit:4,domains:["Reproduction","Meiosis","Variation","Fertilization"]},
 genetics:{unit:4,domains:["Genetic information","Inheritance language","Probability","Non-simple inheritance","Mutation","Trait expression","Evidence and ethics"]},
 ecology:{unit:5,domains:["Ecological organization","Niche","Food webs","Energy transfer","Matter cycles","Biodiversity","Trophic roles","Food-web effects","Energy calculation","Energy","Matter and energy"]},
 population:{unit:5,domains:["Sampling","Population density","Population models","Interactions","Succession","Conservation","Organization","Habitat and niche","Survey design","Population change","Mark–recapture","Population growth","Predator–prey evidence","Resilience","Conservation evidence"]},
 evolution_evidence:{unit:5,domains:["Natural selection","Resistance","Terminology","Species concepts","Equid record","Evidence classification","Worldviews","Stewardship","Observation and inference","Selection","Variation","Microevolution","Speciation","Macroevolution definition","Fossils","Equids","Evidence levels","Methodological naturalism","Source evaluation","Fair assessment"]},
 atom:{unit:6,domains:["Matter","Atomic model","Particles","Atomic number","Mass number","Isotopes","Atomic weight","Atomic evidence","Particle charge","Particle mass","Composition","Nuclear notation","Weighted average","Abundance","Spectra","Model revision"]},
 periodic:{unit:6,domains:["Period","Group","Periodic order","Group 1","Group 17","Noble gases","Periodic history","Modern order","Across-period trend","Group 18","Prediction","Classification"]},
 ions:{unit:6,domains:["Charge","Shells","Valence","Ion charge","Electron configuration","Ion configuration","Group 1","Group 17","Group 18","Prediction"]},
 bonding:{unit:7,domains:["Bonding","Formula","Covalent","Structure","Graphite","Polarity","Formula mass","Notation"]},
 reactions:{unit:7,domains:["Equation","Subscripts","State symbols","Conservation","Evidence","Reaction evidence","Reaction type","Formula"]},
 matter:{unit:7,domains:["Energy","Pathway","Catalyst","Rate","Rate data","Equilibrium","Industry","Measurement","Model limits","Safety"]},
 motion:{unit:8,domains:["Units","Scalars and vectors","Speed","Displacement","Graphs","Measurement","Vector","Velocity","Graph","Graph area","Free fall","Motion graph evidence"]},
 forces:{unit:8,domains:["Acceleration","Net force","First law","Second law","Weight","Third law","Momentum","Impulse","Equilibrium","Mass","Friction","Collision safety","Force–acceleration evidence","Momentum conservation data","Stopping-time design evidence","Free-body model evidence"]},
 energy:{unit:8,domains:["Work","Kinetic energy","Potential energy","Conservation","Power","Efficiency","GPE","Energy system","Machine","Energy accounting","Efficiency evidence","Model evaluation"]},
 electricity:{unit:9,domains:["Current","Voltage","Ohm","Series","Parallel","Power","Energy","Electromagnet","Induction","Charge","Resistance","Junction","I–V graph","Magnetic field","Motor effect","Transformer","Circuit model","Induction model","Transformer model","Ohmic evidence","Circuit comparison","Induction evidence","Safety"]},
 waves:{unit:9,domains:["Wave speed","Amplitude","Reflection","Sound","EM spectrum","Vacuum","Wave model","Wave equation","Period","Refraction","Frequency in refraction","Diffraction","Decibels","EM order","Photon energy","Wave evidence","Photon model","Wave-equation evidence","Safety"]},
 information:{unit:9,domains:["Digital","Noise","Access","Digital sampling","Parity","Digital tradeoff","System model","Digital information model","Signal error data","Sampling evidence","Communication engineering evidence","Sound","EM spectrum","Wave model","Wave evidence","Photon model"]},
 earth_systems:{unit:10,domains:["Systems","Feedback","Interior","Plate boundary","Rock cycle","Weathering","System boundary","Density","Seismic lag","Epicenter","Convection","Divergent boundary","Subduction","Deposition"]},
 cycles:{unit:10,domains:["Water budget","Groundwater","Carbon","Nitrogen","Phosphorus","Residence time","Flux units","Infiltration","Aquifer","Carbon balance","Carbon pathway","Nitrogen fixation","Nitrification","Eutrophication"]},
 environment:{unit:10,domains:["Climate","Albedo","Greenhouse gas","Climate evidence","Human modification","Hazards","Justice","Safety","Energy imbalance","Weather","Climate forcing","Positive feedback","Uncertainty","Mitigation","Adaptation","Risk"]},
 space_orbits:{unit:11,domains:["Sky motion","Lunar phases","Scale","Light-time","Orbit","Earth rotation","Seasons","Moon phases","Light-year conversion","Light travel","Orbital speed","Orbit direction"]},
 space_stars:{unit:11,domains:["Formation","Sun","Space weather","Spectrum","Telescopes","Stars","Stellar evolution","Solar-system formation","Planet types","Solar fusion","Solar observation","Redshift calculation","Velocity approximation","Spectral limitation","Star stability","Mass and lifetime","Supernova products"]},
 space_cosmic:{unit:11,domains:["Transit","Exoplanet evidence","Galaxy","Lookback time","Redshift","Big Bang evidence","Transit radius ratio","Transit bias","Habitability claim","Cosmic nesting","Distance evidence","Hubble law","Hubble interpretation","CMB evidence","Primordial composition","Big Bang misconception","Space responsibility","Night observation safety"]},
 engineering_problem:{unit:12,domains:["Problem definition","Stakeholders","Criteria","Constraint","Baseline","Need statement","Boundary","Criterion","Weights","Weighted score","Constraint failure","Sensitivity","Decision matrix","Concept generation","Biomimicry"]},
 engineering_test:{unit:12,domains:["Prototype","Trials","Uncertainty","Optimization","Mean","Range","Percent improvement","Success rate","Systematic error","Test validity","Reliability","Risk control","Risk score","Risk reduction","Series reliability","Redundancy","Residual risk"]},
 capstone:{unit:12,domains:["Life cycle","Functional unit","Material impact","Transport impact","Use impact","Annualized impact","Recovery","Life-cycle comparison","Accessibility","Ethics","Communication","Course completion","Privacy","Capstone","Optimization"]}
};
function weeklyBankPool(w){
 if(w.week===1)return window.KhaemenesScience9WeeklyReadinessBank||[];
 const cfg=WEEKLY_BANK_CONFIG[w.quizType];if(!cfg)return[];
 const bank=(window.KhaemenesScience9QuestionBanks||{})["unit-"+String(cfg.unit).padStart(2,"0")]||[],domains=new Set(cfg.domains||[]);
 return bank.filter(q=>domains.has(q.domain)&&(!cfg.prompt||cfg.prompt.test(String(q.prompt||"")+" "+String(q.explanation||""))));
}
function weeklyMCKey(w){const version=w.week>=31&&w.week<=33?"::unit11-space-v2":"";return KEY+"::weekly-mc"+version+"::"+String(w.week).padStart(2,"0")}
function openWeeklySet(w,n=10){
 const MC=window.KhaeMonteCarloAssessment,pool=weeklyBankPool(w);
 if(!MC||pool.length<n)return null;
 const key=weeklyMCKey(w),session=MC.openSession(key,pool,{kind:"science9-weekly-"+String(w.week).padStart(2,"0"),count:n}),materialized=MC.materialize(pool,session),responses=MC.getResponses(key,session.id);
 const questions=materialized.map(q=>({id:q.id,q:q.prompt,choices:q.options,answer:q.options[q.answer],answerIndex:q.answer,explanation:q.explanation,domain:q.domain,mc:true,selected:Number.isInteger(Number(responses[q.id]))?Number(responses[q.id]):null}));
 return {mode:"mc",key,session,questions,poolSize:pool.length,completed:false};
}
function getSet(w,n=10){
 if(sets[w.week])return sets[w.week].questions;
 const mc=openWeeklySet(w,n);
 if(mc){sets[w.week]=mc;return mc.questions}
 const questions=Array.from({length:n},()=>makeQuestion(w.quizType));sets[w.week]={mode:"legacy",questions,completed:false};return questions
}
function problemSetHTML(w){const set=getSet(w),meta=sets[w.week];return set.map((p,i)=>`<div class="problem"><p><strong>${i+1}.</strong> ${esc(p.q)}</p>${p.domain?`<p class="small">${esc(p.domain)}${meta?.mode==="mc"?` · randomized from ${meta.poolSize}-question reviewed weekly pool`:""}</p>`:""}${p.choices?`<select data-answer="${i}" ${p.mc?`data-qid="${esc(p.id)}"`:""}><option value="">Choose an answer</option>${p.choices.map((choice,oi)=>`<option ${p.mc?`value="${oi}" ${p.selected===oi?"selected":""}`:`value="${esc(choice)}"`}>${esc(choice)}</option>`).join("")}</select>`:`<input data-answer="${i}" inputmode="decimal" placeholder="Enter answer">`}<div class="feedback hidden" id="fb_${w.week}_${i}"></div></div>`).join("")+`<div class="actions"><button id="submitPractice">Submit Mastery Check</button><button class="secondary" id="newPractice">New Randomized Set</button></div><p class="small">${meta?.mode==="mc"?`Generated form ${esc(meta.session.id)} persists through refresh; a new form opens only after submission.`:"Formative weekly mastery uses reviewed sovereign question banks; formal course assessments remain separate."}</p><p id="practiceScore"></p>`}
function correct(v,p){if(p.choices)return String(v).trim().toLowerCase()===String(p.answer).trim().toLowerCase();const n=Number(String(v).replace(/,/g,""));return Number.isFinite(n)&&Math.abs(n-p.answer)<=Math.max(p.tolerance||.001,Math.abs(p.answer)*.001)}
function wireWeeklyMastery(w){
 const meta=sets[w.week];if(meta?.mode!=="mc")return;
 $("[data-qid]").forEach(x=>x.onchange=()=>{const i=Number(x.dataset.answer),v=Number(x.value),p=meta.questions[i];p.selected=Number.isInteger(v)?v:null;window.KhaeMonteCarloAssessment.saveResponse(meta.key,p.id,v,meta.session.id)})
}
function newWeeklySet(w){
 const meta=sets[w.week];
 if(meta?.mode==="mc"&&window.KhaeMonteCarloAssessment.isActive(meta.key,meta.session.id)){alert("Submit this generated mastery check before requesting a new form. Your current form and answers are preserved.");return}
 delete sets[w.week];renderWeek()
}
function submitSet(weekNo){
 const w=APP.weeks[weekNo-1],set=getSet(w),meta=sets[weekNo];if(meta?.mode==="mc"&&!window.KhaeMonteCarloAssessment.isActive(meta.key,meta.session.id)){alert("This weekly mastery session changed. Reload before submitting to protect newer work.");return}
 let count=0;
 set.forEach((p,i)=>{const el=document.querySelector(`[data-answer="${i}"]`),ok=p.mc?(el.value!==""&&Number(el.value)===p.answerIndex):correct(el.value,p),fb=$(`#fb_${weekNo}_${i}`);if(ok)count++;fb.className=`feedback ${ok?"good":"bad"}`;fb.innerHTML=`<strong>${ok?"Correct":"Review"}</strong> · Answer: ${esc(p.answer)}. ${esc(p.explanation)}`});
 const score=Math.round(count/set.length*100),s=active(),passed=score>=APP.passingTarget;s.attempts[weekNo]=(s.attempts[weekNo]||0)+1;s.scores[weekNo]=Math.max(s.scores[weekNo]||0,score);save();
 if(meta?.mode==="mc"){window.KhaeMonteCarloAssessment.complete(meta.key,{score:count,total:set.length,percent:score,passed,week:weekNo},meta.session.id);meta.completed=true}
 $("#practiceScore").innerHTML=`<span class="score">${score}%</span> · ${count}/${set.length} correct · Best ${s.scores[weekNo]}% · Attempt ${s.attempts[weekNo]} · ${passed?"Mastery target met":"Complete corrections and reassess"}`;renderWeeks()
}
function renderScope(){const s=active();$("#content").innerHTML=`<div class="card"><h3>36-week curriculum scope</h3><p>This portal preserves the published sequence and expands each unit into the recurring phenomenon, concept/model, evidence, investigation, and synthesis rhythm.</p><div style="overflow:auto"><table><thead><tr><th>Week</th><th>Unit</th><th>Focus</th><th>Question</th><th>Mode</th><th>Progress</th><th>Unit</th></tr></thead><tbody>${APP.weeks.map(w=>`<tr><td>${w.week}</td><td>${String(w.unitNumber).padStart(2,"0")} · ${esc(w.unit)}</td><td>${esc(w.title)}</td><td>${esc(w.essentialQuestion)}</td><td>${esc(w.mode)}</td><td>${Object.values(s.days?.[w.week]||{}).filter(Boolean).length}/5 · ${s.scores?.[w.week]||0}%</td><td>${weekUnlocked(w.week)?`<a href="${w.unitUrl}">Open</a>`:`<span class="pill warn" aria-label="Locked until prior week reaches 80 percent mastery">Locked</span>`}</td></tr>`).join("")}</tbody></table></div><div class="actions"><button id="scopeCsv">Download Scope CSV</button><button class="secondary" onclick="window.print()">Print Scope</button></div></div>`;$("#scopeCsv").onclick=downloadScopeCSV}
function renderScienceLab(){$("#content").innerHTML=`<div class="grid"><div class="card col4"><h3>Independent Science Practice</h3><label>Choose a week / domain<select id="labWeek">${APP.weeks.map(w=>`<option value="${w.week}">Week ${w.week} · ${esc(w.title)}</option>`).join("")}</select></label><label>Question count<select id="labCount"><option>5</option><option selected>10</option><option>15</option></select></label><div class="actions"><button id="makeLab">Generate Practice</button></div><div class="notice">Generated questions are formative. Formal repository assessments remain separate.</div></div><div class="card col8"><h3>Practice workspace</h3><div id="labProblems"><p class="small">Choose a week and generate a set.</p></div></div></div>`;$("#makeLab").onclick=()=>{const w=APP.weeks[Number($("#labWeek").value)-1],n=Number($("#labCount").value);labSet=Array.from({length:n},()=>makeQuestion(w.quizType));$("#labProblems").innerHTML=labSet.map((p,i)=>`<div class="problem"><p><strong>${i+1}.</strong> ${esc(p.q)}</p>${p.choices?`<select data-lab-answer="${i}"><option value="">Choose</option>${p.choices.map(c=>`<option>${esc(c)}</option>`).join("")}</select>`:`<input data-lab-answer="${i}" placeholder="Answer">`}<div class="feedback hidden" id="labfb_${i}"></div></div>`).join("")+`<div class="actions"><button id="checkLab">Check Practice</button></div><p id="labScore"></p>`;$("#checkLab").onclick=checkLab}}
function checkLab(){let n=0;labSet.forEach((p,i)=>{const ok=correct(document.querySelector(`[data-lab-answer="${i}"]`).value,p),fb=$(`#labfb_${i}`);if(ok)n++;fb.className=`feedback ${ok?"good":"bad"}`;fb.textContent=`${ok?"Correct":"Review"} · Answer: ${p.answer}. ${p.explanation}`});$("#labScore").innerHTML=`<span class="score">${Math.round(n/labSet.length*100)}%</span> · ${n}/${labSet.length} correct`}
function assessmentGateLink(ok,href,label,requirement){return ok?`<a class="button secondary" href="${href}">${label}</a>`:`<span class="button secondary" aria-disabled="true" title="${esc(requirement)}">Locked · ${esc(requirement)}</span>`}
function renderAssessments(){const g12=masteredThrough(12),g18=masteredThrough(18),g21=masteredThrough(21),g27=masteredThrough(27),g36=masteredThrough(36);$("#content").innerHTML=`<div class="grid">
 <div class="card col6"><span class="pill good">Week 1</span><h3>Readiness Diagnostic & Safety Verification</h3><p>Required before investigations and laboratory materials.</p><a class="button" href="${APP.links.diagnostic}">Open Diagnostic</a></div>
 <div class="card col6"><span class="pill ${g12?"good":"warn"}">After Unit 04 · Week 12</span><h3>Units 01–04 Cumulative Test</h3><p>Scientific inquiry through inheritance.</p>${assessmentGateLink(g12,APP.links.test1,"Open Test","Master Weeks 1–12 at 80%")}</div>
 <div class="card col6"><span class="pill ${g18?"good":"warn"}">After Unit 06 · Week 18</span><h3>Midterm Practice · Units 00–06</h3><p>70-question persisted Monte Carlo practice form plus three constructed/practical responses. Official midterm mastery remains separately supervised and authenticated.</p>${assessmentGateLink(g18,APP.links.midterm,"Open Midterm Practice","Master Weeks 1–18 at 80%")}</div>
 <div class="card col6"><span class="pill ${g21?"good":"warn"}">After Unit 07 · Week 21</span><h3>Units 05–07 Cumulative Test</h3><p>Ecology, atomic science, chemistry, reactions, and matter.</p>${assessmentGateLink(g21,APP.links.test2,"Open Test","Master Weeks 1–21 at 80%")}</div>
 <div class="card col6"><span class="pill ${g27?"good":"warn"}">After Unit 09 · Week 27</span><h3>Units 08–09 Cumulative Test</h3><p>Motion, forces, energy, electricity, waves, and information.</p>${assessmentGateLink(g27,APP.links.test3,"Open Test","Master Weeks 1–27 at 80%")}</div>
 <div class="card col6"><span class="pill ${g36?"good":"warn"}">After Unit 12 · Week 36</span><h3>Units 10–12 Cumulative Test</h3><p>Earth systems, astronomy, evidence, and sustainable engineering synthesis.</p>${assessmentGateLink(g36,APP.links.test4,"Open Test","Master Weeks 1–36 at 80%")}</div>
 <div class="card col12"><span class="pill ${g36?"good":"warn"}">Comprehensive · Units 00–12</span><h3>Comprehensive Final Practice</h3><p>104-question persisted Monte Carlo objective form plus six integrated constructed responses. Official final mastery remains separately supervised and authenticated.</p>${assessmentGateLink(g36,APP.links.final,"Open Final Practice","Master Weeks 1–36 at 80%")}</div>
 <div class="card col12"><h3>Quarterly interdisciplinary investigations</h3><p>Required approximately at Weeks 9, 18, 27, and 36. Preserve investigation plans, data, graphs, CER responses, safety verification, revisions, and reflection in the portfolio.</p></div></div>`}

const ASSESSMENT_RECORD_DEFS=[
 {id:"u14",label:"Units 01–04",key:"khaemenes_science_units01_04_benchmark_v1",kind:"benchmark"},
 {id:"midterm",label:"Midterm Practice",key:"khaemenes_science_midterm_u00_06_v1",kind:"practice"},
 {id:"u57",label:"Units 05–07",key:"khaemenes_science_units05_07_benchmark_v1",kind:"benchmark"},
 {id:"u89",label:"Units 08–09",key:"khaemenes_science_units08_09_benchmark_v1",kind:"benchmark"},
 {id:"u1012",label:"Units 10–12",key:"khaemenes_science_units10_12_benchmark_v1",kind:"benchmark"},
 {id:"final",label:"Final Practice",key:"khaemenes_science9_final_exam_v1",kind:"practice"}
];
function assessmentRecords(){
 return ASSESSMENT_RECORD_DEFS.map(def=>{
  const key=ENTRY?.scopedKey?.(def.key,ENTRY_PROFILE)||def.key;
  let x={};try{x=JSON.parse(localStorage.getItem(key)||"{}")||{}}catch{}
  const history=Array.isArray(x.assessmentHistory)?x.assessmentHistory:[],latest=history.length?history[history.length-1]:null,objective=x.objective||{};
  const total=Number(latest?.total??objective.total??0),score=Number(latest?.score??objective.score),attempts=history.length||Number(objective.attempts||0);
  const percent=Number.isFinite(Number(latest?.percent))?Number(latest.percent):(total>0&&Number.isFinite(score)?Math.round(score/total*100):null);
  const passed=Boolean(latest?.passed??objective.passed??false);
  return {...def,percent,passed,attempts};
 });
}
function rows(){const s=active();return APP.weeks.map(w=>({week:w.week,unit:`${String(w.unitNumber).padStart(2,"0")} ${w.unit}`,focus:w.title,days:Object.values(s.days?.[w.week]||{}).filter(Boolean).length,score:s.scores?.[w.week]||0,attempts:s.attempts?.[w.week]||0,safety:s.safety?.[w.week]?"Verified":"",exit:s.exit?.[w.week]||""}))}
function renderReports(){const s=active(),ar=assessmentRecords();$("#content").innerHTML=`<div class="card"><h3>${esc(s.name)} · Integrated Science Progress Report</h3><p><strong>Course:</strong> ${APP.code} · <strong>Pathway:</strong> ${esc(s.pathway)} · <strong>Weeks mastered:</strong> ${masteredWeeks()}/36 · <strong>Weeks reviewed:</strong> ${reviewedWeeks()}/36 · <strong>Weekly mastery average:</strong> ${avg(scores())}%</p><h4>Weekly learning record</h4><div style="overflow:auto"><table><thead><tr><th>Week</th><th>Focus</th><th>Days</th><th>Best</th><th>Attempts</th><th>Safety</th><th>Reflection</th></tr></thead><tbody>${rows().map(r=>`<tr><td>${r.week}</td><td>${esc(r.focus)}</td><td>${r.days}/5</td><td>${r.score}%</td><td>${r.attempts}</td><td>${r.safety}</td><td>${esc(r.exit)}</td></tr>`).join("")}</tbody></table></div><h4 style="margin-top:24px">Cumulative assessment practice record</h4><p class="small">These browser-local results are formative practice only; official midterm/final mastery remains separately supervised and authenticated.</p><div style="overflow:auto"><table><thead><tr><th>Assessment</th><th>Latest / best visible result</th><th>Attempts</th><th>Status</th></tr></thead><tbody>${ar.map(a=>`<tr><td>${esc(a.label)}</td><td>${a.percent===null?"—":a.percent+"%"}</td><td>${a.attempts||0}</td><td>${a.percent===null?"No attempt":a.passed?(a.kind==="practice"?"Practice target met":"Objective target met"):"Review recommended"}</td></tr>`).join("")}</tbody></table></div><div class="actions"><button id="reportHtml">Download HTML Report</button><button class="secondary" id="reportCsv">Download CSV</button><button class="secondary" id="backupBtn">Export Backup</button><label class="button ghost">Import Backup<input class="hidden" id="backupInput" type="file" accept=".json,application/json"></label><button class="danger" id="clearBtn">Clear Student Progress</button></div></div>`;$("#reportHtml").onclick=downloadReportHTML;$("#reportCsv").onclick=downloadReportCSV;$("#backupBtn").onclick=downloadBackup;$("#backupInput").onchange=importBackup;$("#clearBtn").onclick=()=>{if(confirm("Clear all progress for this student?")){const fresh=blankStudent(s.name);fresh.id=s.id;fresh.pathway=s.pathway;state.students[state.students.findIndex(x=>x.id===s.id)]=fresh;save();renderAll()}}}
function renderStandards(){$("#content").innerHTML=`<div class="grid"><div class="card col8"><h3>Course charter</h3><p><strong>${APP.code}</strong> · ${APP.subtitle} · Grade 9 · 36 weeks · approximately 135–150 instructional hours.</p><p>The course integrates biology, chemistry, physics, Earth and space science, environmental science, engineering, and scientific information literacy.</p><div class="actions"><a class="button secondary" href="${APP.links.courseCharter}">Open Charter</a><a class="button ghost" href="${APP.links.curriculumMap}">Curriculum Map</a><a class="button ghost" href="${APP.links.safety}">Safety Framework</a></div></div><div class="card col4"><h3>Assessment balance</h3>${APP.assessmentDomains.map(d=>`<p><strong>${d.weight}%</strong> · ${esc(d.name)}</p>`).join("")}</div>${APP.masteryScale.map(m=>`<div class="card col3"><span class="pill">Level ${m.level}</span><h4>${m.label}</h4><p>${m.description}</p></div>`).join("")}<div class="card col12"><div class="notice">This is an international/national synthesis, not automatic accreditation or legal equivalence. Formal reporting requires a jurisdiction-specific standards map reviewed for the student’s location or program.</div></div></div>`}
function csv(v){return `"${String(v??"").replace(/"/g,'""')}"`}function safeName(v){return String(v).replace(/[^a-z0-9]+/gi,"_").replace(/^_+|_+$/g,"")||"Student"}
function downloadText(name,text,type){const blob=new Blob([text],{type:type+";charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
function downloadScopeCSV(){const lines=[["Week","Unit","Focus","Essential Question","Phenomenon","Investigation Mode","Unit URL"].map(csv).join(",")];APP.weeks.forEach(w=>lines.push([w.week,w.unit,w.title,w.essentialQuestion,w.phenomenon,w.mode,w.unitUrl].map(csv).join(",")));downloadText("Science9_36_Week_Scope.csv",lines.join("\n"),"text/csv")}
function downloadReportCSV(){const lines=[["Week","Unit","Focus","Days","Best Score","Attempts","Safety","Reflection"].map(csv).join(",")];rows().forEach(r=>lines.push([r.week,r.unit,r.focus,r.days,r.score,r.attempts,r.safety,r.exit].map(csv).join(",")));lines.push("");lines.push(["Assessment","Percent","Attempts","Status"].map(csv).join(","));assessmentRecords().forEach(a=>lines.push([a.label,a.percent===null?"":a.percent,a.attempts||0,a.percent===null?"No attempt":a.passed?(a.kind==="practice"?"Practice target met":"Objective target met"):"Review recommended"].map(csv).join(",")));downloadText(`Science9_${safeName(active().name)}_Progress.csv`,lines.join("\n"),"text/csv")}
function downloadReportHTML(){const s=active(),ar=assessmentRecords();downloadText(`Science9_${safeName(s.name)}_Progress.html`,`<!doctype html><meta charset="utf-8"><title>${esc(s.name)} Science Report</title><style>body{font:16px/1.5 Arial;max-width:1100px;margin:30px auto;padding:20px}table{width:100%;border-collapse:collapse;margin-bottom:24px}th,td{border:1px solid #aaa;padding:8px;text-align:left}h1,h2{font-family:Georgia}</style><h1>International Integrated Science 9 Progress Report</h1><p><strong>Student:</strong> ${esc(s.name)} · <strong>Pathway:</strong> ${esc(s.pathway)} · <strong>Weeks mastered:</strong> ${masteredWeeks()}/36 · <strong>Weeks reviewed:</strong> ${reviewedWeeks()}/36</p><h2>Weekly learning record</h2><table><tr><th>Week</th><th>Unit</th><th>Focus</th><th>Days</th><th>Best</th><th>Attempts</th><th>Safety</th><th>Reflection</th></tr>${rows().map(r=>`<tr><td>${r.week}</td><td>${esc(r.unit)}</td><td>${esc(r.focus)}</td><td>${r.days}/5</td><td>${r.score}%</td><td>${r.attempts}</td><td>${r.safety}</td><td>${esc(r.exit)}</td></tr>`).join("")}</table><h2>Cumulative assessment practice record</h2><p>Browser-local practice only; official midterm/final mastery remains separately supervised and authenticated.</p><table><tr><th>Assessment</th><th>Percent</th><th>Attempts</th><th>Status</th></tr>${ar.map(a=>`<tr><td>${esc(a.label)}</td><td>${a.percent===null?"—":a.percent+"%"}</td><td>${a.attempts||0}</td><td>${a.percent===null?"No attempt":a.passed?(a.kind==="practice"?"Practice target met":"Objective target met"):"Review recommended"}</td></tr>`).join("")}</table>`,"text/html")}
function downloadBackup(){
 if(ENTRY_BLOCKED||!ENTRY_PROFILE?.learnerId||active()?.id!==ENTRY_PROFILE.learnerId){alert("Select the matching Academy learner before exporting. No work was changed.");return}
 const student=active();
 const copy=JSON.parse(JSON.stringify(student));
 const payload={version:2,course:"KH-SCI-IIS9",learnerId:student.id,exported:new Date().toISOString(),state:{students:[copy],activeId:student.id}};
 downloadText("Khaemenes_Science9_"+student.id.replace(/[^a-z0-9_-]/gi,"_")+"_Backup.json",JSON.stringify(payload,null,2),"application/json")
}
function importBackup(e){
 const input=e.target,file=input.files?.[0];if(!file)return;
 const finish=()=>{input.value=""};
 if(file.size>5*1024*1024){alert("Backup exceeds the 5 MB import limit. No records were changed.");finish();return}
 if(ENTRY_BLOCKED||!ENTRY_PROFILE?.learnerId||active()?.id!==ENTRY_PROFILE.learnerId){alert("The active Academy learner must match the Science record before import. No work was changed.");finish();return}
 const guard=window.KhaemenesScience9BackupGuard;
 if(!guard){alert("Safe backup verification is unavailable. Import blocked; existing work is protected.");finish();return}
 const startIdentity=ENTRY_PROFILE.learnerId,baseline=localStorage.getItem(KEY),current=active();
 const r=new FileReader();
 r.onerror=()=>{alert("Backup could not be read. No records were changed.");finish()};
 r.onload=()=>{
  try{
   if(!current||!baseline)throw Error("No saved course record was found. Nothing has been imported.");
   const payload=JSON.parse(r.result);
   const selected=guard.selectRecord(payload,startIdentity);
   const merged=guard.mergeMissing(current,selected.record);
   const {added,conflicts}=merged.counts;
   const message="Khaemenes Academy — Science 9 restore preview\n\n"+
    "Learner: "+current.name+"\nMissing fields eligible to restore: "+added+
    "\nConflicting values retained from this computer: "+conflicts+
    "\nOther learners in uploaded backup ignored: "+selected.ignoredOtherLearners+
    "\n\nRestore is missing-only; existing grades, attempts, notes, and evidence are never overwritten. Continue?";
   if(!window.confirm(message))return;
   if(!added){alert("No missing records to restore. Existing work is unchanged.");return}
   if(ENTRY?.identityRaw?.()!==JSON.stringify(startIdentity)||active()?.id!==startIdentity)throw Error("Active Academy learner changed; import cancelled.");
   if(localStorage.getItem(KEY)!==baseline)throw Error("Saved course records changed in another tab; import cancelled. Reload and review before retrying.");
   const next={...state,students:state.students.map(student=>student.id===startIdentity?merged.result:student)};
   localStorage.setItem(KEY,JSON.stringify(next));
   state=next;
   renderAll();
   alert("Restore complete: "+added+" missing fields added. Existing values retained. Save a fresh learner backup.");
  }catch(err){alert("Science 9 backup not imported: "+String(err.message||err)+". No existing fields were overwritten.")}
  finally{finish()}
 };
 r.readAsText(file)
}
function packetHTML(n){const w=APP.weeks[n-1];return `<!doctype html><meta charset="utf-8"><title>Science 9 Week ${w.week} Packet</title><style>body{font:16px/1.55 Arial;max-width:900px;margin:25px auto;padding:25px;color:#111}h1,h2,h3{font-family:Georgia}section{border:1px solid #aaa;padding:15px;margin:12px 0}@media print{body{margin:0}}</style><h1>Integrated Science 9 · Week ${w.week}</h1><h2>${esc(w.title)}</h2><p><strong>Unit:</strong> ${esc(w.unit)}</p><section><h3>Phenomenon</h3><p>${esc(w.phenomenon)}</p><p>Observations:</p><div style="height:90px;border-bottom:1px solid #aaa"></div><p>Questions:</p><div style="height:90px;border-bottom:1px solid #aaa"></div></section><section><h3>Essential question</h3><p>${esc(w.essentialQuestion)}</p><p><strong>Reading/source:</strong> ${esc(w.readingSuggestion)}</p></section>${w.lessons.map(l=>`<section><h3>${l.day} · ${esc(l.title)}</h3><p><strong>Activity:</strong> ${esc(l.activity)}</p><div style="height:130px;border-bottom:1px solid #aaa"></div></section>`).join("")}<section><h3>Investigation & safety</h3><p>${esc(w.investigation)}</p><p><strong>Mode:</strong> ${esc(w.mode)}</p><p>Hazards, controls, supervision, disposal, and stop conditions:</p><div style="height:110px;border-bottom:1px solid #aaa"></div></section><section><h3>Claim–Evidence–Reasoning</h3><p>Claim:</p><div style="height:70px;border-bottom:1px solid #aaa"></div><p>Evidence:</p><div style="height:100px;border-bottom:1px solid #aaa"></div><p>Reasoning and limitations:</p><div style="height:120px;border-bottom:1px solid #aaa"></div></section>`}
if(!ENTRY_BLOCKED){$("#studentSelect").onchange=e=>{state.activeId=e.target.value;save();renderAll()};$("#addStudentBtn").onclick=()=>{const n=$("#studentName").value.trim();if(!n)return;const s=blankStudent(n);state.students.push(s);state.activeId=s.id;$("#studentName").value="";save();renderAll()};$("#demoBtn").onclick=()=>{const s=blankStudent("Demo Scientist");for(let w=1;w<=4;w++){s.days[w]={Monday:true,Tuesday:true,Wednesday:true,Thursday:w<4,Friday:w<3};s.scores[w]=70+w*5;s.attempts[w]=1;s.safety[w]=true;s.exit[w]="Demo science reflection for Week "+w}state.students.push(s);state.activeId=s.id;save();renderAll()};$("#deleteStudentBtn").onclick=()=>{const s=active();if(!confirm(`Delete ${s.name} and all local records?`))return;state.students=state.students.filter(x=>x.id!==s.id);state.activeId=state.students[0]?.id||null;ensure();save();renderAll()};$("#pathway").onchange=e=>{active().pathway=e.target.value;sets={};save();renderAll()};$$(".navBtn,.tab").forEach(b=>b.onclick=()=>setView(b.dataset.view));const applyReadingContrast=()=>{const high=state.theme==="dark";document.documentElement.dataset.theme=high?"dark":"light";$("#themeBtn").textContent=high?"Standard contrast":"Higher contrast";$("#themeBtn").setAttribute("aria-pressed",high?"true":"false")};$("#themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";applyReadingContrast();save()};applyReadingContrast();renderAll();}


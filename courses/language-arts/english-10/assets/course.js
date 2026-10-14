(() => {
  "use strict";
  const COURSE_ID = "ela10";
  const STATE_KEY = "khae-ela10-state-v1";
  const THEME_KEY = "khae-ela10-theme-v1";
  const root = document.documentElement;
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
  const nowISO = () => new Date().toISOString();
  const today = () => new Date().toISOString().slice(0,10);
  const clamp = (n,min=0,max=100) => Math.max(min,Math.min(max,Number(n)||0));
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const safeParse = (text, fallback={}) => { try{return JSON.parse(text)}catch{return fallback} };
  const defaultState = () => ({
    version: 1,
    courseId: COURSE_ID,
    studentName: "",
    created: nowISO(),
    weeks: {},
    units: {},
    exams: {},
    records: {attendance:[], reading:[]},
    profile: {schoolYear:"", instructor:"", startDate:"", completionDate:""}
  });
  const recordStore = window.KhaemenesEnglishRecords.create(COURSE_ID, STATE_KEY, defaultState);
  let state = recordStore.state;
  const save = () => recordStore.save(state);
  const score = window.KhaemenesEnglishRecords.score;
  const fmt = value => value === null || value === undefined ? "—" : `${value}%`;
  const weekState = w => {
    const key=String(Number(w));
    state.weeks[key] ||= {days:{},quiz:{best:0,attempts:[]},notes:{},reflection:""};
    state.weeks[key].days ||= {};
    state.weeks[key].quiz ||= {best:0,attempts:[]};
    state.weeks[key].quiz.attempts ||= [];
    state.weeks[key].notes ||= {};
    return state.weeks[key];
  };
  const unitState = u => {
    const key=String(Number(u));
    state.units[key] ||= {assessment:{best:0,attempts:[]},projectScore:"",notes:""};
    state.units[key].assessment ||= {best:0,attempts:[]};
    state.units[key].assessment.attempts ||= [];
    return state.units[key];
  };
  const examState = id => {
    state.exams[id] ||= {best:0,attempts:[]};
    state.exams[id].attempts ||= [];
    return state.exams[id];
  };

  // Theme
  try{root.dataset.theme=localStorage.getItem(THEME_KEY)||"light"}catch{root.dataset.theme="light"}
  const themeBtn=$("[data-theme-toggle]");
  const syncTheme=()=>{if(themeBtn){themeBtn.textContent=root.dataset.theme==="dark"?"Light":"Dark";themeBtn.setAttribute("aria-label",`Switch to ${root.dataset.theme==="dark"?"light":"dark"} theme`)}};
  syncTheme();
  themeBtn?.addEventListener("click",()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";try{localStorage.setItem(THEME_KEY,root.dataset.theme)}catch{}syncTheme()});

  // Profile fields
  $$("[data-profile-field]").forEach(field=>{
    const key=field.dataset.profileField;
    field.value=key==="studentName" ? (state.studentName||"") : (state.profile[key]||"");
    field.addEventListener("input",()=>{
      if(key==="studentName") state.studentName=field.value; else state.profile[key]=field.value;
      save(); syncIdentity();
    });
  });
  function syncIdentity(){
    $$("[data-student-name-display]").forEach(el=>el.textContent=state.studentName||"Student");
    $$("[data-instructor-display]").forEach(el=>el.textContent=state.profile.instructor||"Parent / Teacher");
    $$("[data-school-year-display]").forEach(el=>el.textContent=state.profile.schoolYear||"________________");
  }
  syncIdentity();


  // Generic persistent checklists
  state.checks ||= {};
  $$("[data-check-key]").forEach(box=>{
    const key=box.dataset.checkKey;
    box.checked=Boolean(state.checks[key]);
    box.addEventListener("change",()=>{state.checks[key]=box.checked;save();});
  });

  // Week daily completion
  $$("[data-week-day]").forEach(box=>{
    const week=box.dataset.week, day=box.dataset.weekDay;
    box.checked=Boolean(weekState(week).days[day]);
    box.addEventListener("change",()=>{weekState(week).days[day]=box.checked;save();updateProgress()});
  });
  $$("[data-progress-key]").forEach(button=>{
    const key=button.dataset.progressKey;
    const match=key.match(/^week-(\d+)$/);
    if(!match)return;
    const week=match[1], ws=weekState(week);
    const completed=()=>["Monday","Tuesday","Wednesday","Thursday","Friday"].every(d=>ws.days[d]);
    const sync=()=>{const on=completed();button.setAttribute("aria-pressed",String(on));button.textContent=on?"Week Completed ✓":"Mark All Days Complete"};
    sync();
    button.addEventListener("click",()=>{const target=!completed();["Monday","Tuesday","Wednesday","Thursday","Friday"].forEach(d=>ws.days[d]=target);save();$$(`[data-week="${week}"][data-week-day]`).forEach(b=>b.checked=target);sync();updateProgress()});
  });

  // Autosave text fields
  $$("[data-save-field]").forEach(field=>{
    const scope=field.dataset.scope||"general";
    const id=field.dataset.saveField;
    let holder;
    if(scope.startsWith("week:")) holder=weekState(scope.split(":")[1]).notes;
    else if(scope.startsWith("unit:")) holder=unitState(scope.split(":")[1]);
    else {state.misc ||= {}; holder=state.misc}
    field.value=holder[id]||"";
    field.addEventListener("input",()=>{holder[id]=field.value;save()});
  });
  $$("[data-clear-field]").forEach(button=>button.addEventListener("click",()=>{
    const field=document.getElementById(button.dataset.clearField); if(!field)return;
    field.value="";field.dispatchEvent(new Event("input"));field.focus();
  }));
  $$("[data-print]").forEach(button=>button.addEventListener("click",()=>window.print()));

  // Quiz and assessment engine
  function readQuestions(scriptId){
    const node=document.getElementById(scriptId);
    return node ? safeParse(node.textContent,[]) : [];
  }
  function renderQuestionSet(container, questions, name){
    if(!container||!questions.length)return;
    container.innerHTML=questions.map((q,i)=>`
      <fieldset class="quiz-question" data-question="${i}">
        <legend>${i+1}. ${esc(q.question)}</legend>
        ${q.choices.map((choice,j)=>`<label class="quiz-choice"><input type="radio" name="${esc(name)}-${i}" value="${j}"><span>${esc(choice)}</span></label>`).join("")}
        <div class="quiz-feedback" hidden></div>
      </fieldset>`).join("");
  }
  function runQuizPage(){
    const form=$("[data-quiz-form]"); if(!form)return;
    const questions=readQuestions("quiz-data");
    const week=Number(form.dataset.week);
    renderQuestionSet($("[data-question-container]",form),questions,`week-${week}`);
    const result=$("[data-quiz-result]");
    const best=$("[data-quiz-best]");
    const syncBest=()=>{if(best)best.textContent=fmt(score(weekState(week).quiz))};
    syncBest();
    form.addEventListener("submit",e=>{
      e.preventDefault();
      let correct=0, complete=true;
      questions.forEach((q,i)=>{
        const selected=form.querySelector(`input[name="week-${week}-${i}"]:checked`);
        const field=form.querySelector(`[data-question="${i}"]`);
        const feedback=$(".quiz-feedback",field);
        if(!selected){complete=false;feedback.hidden=false;feedback.textContent="Choose an answer before submitting.";return}
        const answer=Number(selected.value), ok=answer===q.answer;
        if(ok)correct++;
        feedback.hidden=false;
        feedback.className=`quiz-feedback ${ok?"good":"bad"}`;
        feedback.innerHTML=`<strong>${ok?"Correct.":"Review."}</strong> ${esc(q.explanation||"")}`;
      });
      if(!complete){result.textContent="Please answer every question.";return}
      const score=Math.round(correct/questions.length*100);
      const record=weekState(week).quiz;
      record.attempts.push({date:nowISO(),score,correct,total:questions.length});
      record.best=Math.max(record.best||0,score);
      const saved=save();syncBest();updateProgress();
      result.innerHTML=`${saved?"Saved. ":"Not saved — export a recovery copy. "}Score: <strong>${score}%</strong> (${correct}/${questions.length}). Best score retained: <strong>${record.best}%</strong>. ${score<80?"Complete corrections, review the lesson, and retake.":"Mastery target met."}`;
    });
    $("[data-reset-quiz]")?.addEventListener("click",()=>{form.reset();$$(".quiz-feedback",form).forEach(x=>{x.hidden=true;x.textContent=""});if(result)result.textContent=""});
  }
  function runAssessmentPage(){
    const form=$("[data-assessment-form]"); if(!form)return;
    const questions=readQuestions("assessment-data");
    const id=form.dataset.assessmentId;
    const kind=form.dataset.assessmentKind||"exam";
    renderQuestionSet($("[data-question-container]",form),questions,id);
    const result=$("[data-assessment-result]");
    const best=$("[data-assessment-best]");
    const getRecord=()=>kind==="unit"?unitState(Number(form.dataset.unit)).assessment:examState(id);
    const sync=()=>{if(best)best.textContent=fmt(score(getRecord()))};sync();
    form.addEventListener("submit",e=>{
      e.preventDefault();
      let correct=0,complete=true,answers=[];
      questions.forEach((q,i)=>{
        const selected=form.querySelector(`input[name="${id}-${i}"]:checked`);
        const field=form.querySelector(`[data-question="${i}"]`);
        const feedback=$(".quiz-feedback",field);
        if(!selected){complete=false;feedback.hidden=false;feedback.textContent="Choose an answer.";return}
        const answer=Number(selected.value), ok=answer===q.answer;answers.push(answer);if(ok)correct++;
        feedback.hidden=false;feedback.className=`quiz-feedback ${ok?"good":"bad"}`;
        feedback.innerHTML=`<strong>${ok?"Correct.":"Review."}</strong> ${esc(q.explanation||"")}`;
      });
      if(!complete){result.textContent="Please answer every question.";return}
      const score=Math.round(correct/questions.length*100), record=getRecord();
      record.attempts.push({date:nowISO(),score,correct,total:questions.length,answers});
      record.best=Math.max(record.best||0,score);const saved=save();sync();updateProgress();
      result.innerHTML=`${saved?"Saved. ":"Not saved — export a recovery copy. "}Score: <strong>${score}%</strong> (${correct}/${questions.length}). Best retained: <strong>${record.best}%</strong>.`;
    });
    $("[data-reset-assessment]")?.addEventListener("click",()=>{form.reset();$$(".quiz-feedback",form).forEach(x=>{x.hidden=true;x.textContent=""});if(result)result.textContent=""});
  }
  runQuizPage();runAssessmentPage();

  function completedDays(week){
    const days=weekState(week).days;
    return ["Monday","Tuesday","Wednesday","Thursday","Friday"].filter(d=>days[d]).length;
  }
  function average(values){const nums=values.filter(v=>typeof v==="number"&&Number.isFinite(v)&&v>=0&&v<=100);return nums.length?Math.round(nums.reduce((a,b)=>a+b,0)/nums.length):null}
  function calcStats(){
    const weekly=Array.from({length:36},(_,i)=>score(weekState(i+1).quiz));
    const units=Array.from({length:12},(_,i)=>score(unitState(i+1).assessment));
    const projects=Array.from({length:12},(_,i)=>unitState(i+1).projectScore===""?null:Number(unitState(i+1).projectScore));
    const mid=score(examState("midterm")), fin=score(examState("final"));
    const dayDone=Array.from({length:36},(_,i)=>completedDays(i+1)).reduce((a,b)=>a+b,0);
    const lessonPct=Math.round(dayDone/180*100);
    const quizAvg=average(weekly),unitAvg=average(units),projectAvg=average(projects);
    const weights=[
      {value:quizAvg,weight:30,active:quizAvg!==null},
      {value:unitAvg,weight:25,active:unitAvg!==null},
      {value:projectAvg,weight:20,active:projectAvg!==null},
      {value:mid,weight:10,active:mid!==null},
      {value:fin,weight:15,active:fin!==null}
    ];
    const activeWeight=weights.filter(x=>x.active).reduce((a,b)=>a+b.weight,0);
    const grade=activeWeight?Math.round(weights.filter(x=>x.active).reduce((a,b)=>a+b.value*b.weight,0)/activeWeight):null;
    return {dayDone,lessonPct,quizAvg,unitAvg,projectAvg,mid,fin,grade};
  }
  function updateProgress(){
    const st=calcStats();
    $$("[data-course-progress]").forEach(bar=>bar.style.width=`${st.lessonPct}%`);
    $$("[data-course-progress-label]").forEach(el=>el.textContent=`${st.dayDone} of 180 daily lessons complete · ${st.lessonPct}%`);
    $$("[data-stat='lessons']").forEach(el=>el.textContent=`${st.lessonPct}%`);
    $$("[data-stat='quiz']").forEach(el=>el.textContent=fmt(st.quizAvg));
    $$("[data-stat='unit']").forEach(el=>el.textContent=fmt(st.unitAvg));
    $$("[data-stat='grade']").forEach(el=>el.textContent=fmt(st.grade));
  }
  updateProgress();

  // Unit project score
  $$("[data-project-score]").forEach(field=>{
    const unit=Number(field.dataset.projectScore);
    field.value=unitState(unit).projectScore??"";
    field.addEventListener("input",()=>{unitState(unit).projectScore=field.value===""?"":clamp(field.value);save();updateProgress()});
  });

  // Dashboard week cards
  $$("[data-week-status]").forEach(el=>{
    const w=Number(el.dataset.weekStatus), ws=weekState(w);
    const days=completedDays(w), quiz=score(ws.quiz);
    el.textContent=`${days}/5 lessons · Quiz ${fmt(quiz)}`;
  });

  // Gradebook
  const gradeBody=$("[data-gradebook-body]");
  if(gradeBody){
    gradeBody.innerHTML=Array.from({length:36},(_,i)=>{
      const w=i+1, ws=weekState(w), days=completedDays(w);
      return `<tr><td>Week ${String(w).padStart(2,"0")}</td><td>${days}/5</td><td>${fmt(score(ws.quiz))}</td><td>${ws.quiz.attempts.length}</td><td><a href="../weeks/week-${String(w).padStart(2,"0")}/index.html">Open</a></td></tr>`;
    }).join("");
    const unitBody=$("[data-unit-gradebook-body]");
    if(unitBody)unitBody.innerHTML=Array.from({length:12},(_,i)=>{
      const u=i+1, us=unitState(u);
      return `<tr><td>Unit ${String(u).padStart(2,"0")}</td><td>${fmt(score(us.assessment))}</td><td><input type="number" min="0" max="100" value="${esc(us.projectScore)}" data-inline-project="${u}" aria-label="Unit ${u} project score"></td><td>${us.assessment.attempts.length}</td></tr>`;
    }).join("");
    $$("[data-inline-project]").forEach(field=>field.addEventListener("input",()=>{unitState(field.dataset.inlineProject).projectScore=field.value===""?"":clamp(field.value);save();renderSummary()}));
    function renderSummary(){
      const s=calcStats();
      $("[data-grade-summary]").innerHTML=`Weekly quiz average: <strong>${fmt(s.quizAvg)}</strong> · Unit assessment average: <strong>${fmt(s.unitAvg)}</strong> · Project average: <strong>${fmt(s.projectAvg)}</strong> · Midterm: <strong>${fmt(s.mid)}</strong> · Final: <strong>${fmt(s.fin)}</strong> · Provisional weighted grade: <strong>${fmt(s.grade)}</strong>`;
    }
    renderSummary();
  }

  // Attendance log
  const attBody=$("[data-attendance-body]");
  function renderAttendance(){
    if(!attBody)return;
    attBody.innerHTML=state.records.attendance.map((r,i)=>`<tr><td>${esc(r.date)}</td><td>${esc(r.minutes)}</td><td>${esc(r.subject)}</td><td>${esc(r.notes)}</td><td class="no-print"><button class="btn danger" type="button" data-remove-att="${i}">Remove</button></td></tr>`).join("")||`<tr><td colspan="5">No attendance entries yet.</td></tr>`;
    $$("[data-remove-att]").forEach(b=>b.addEventListener("click",()=>{state.records.attendance.splice(Number(b.dataset.removeAtt),1);save();renderAttendance()}));
  }
  $("[data-add-attendance]")?.addEventListener("click",()=>{
    const date=$("#att-date")?.value||today(),minutes=clamp($("#att-minutes")?.value,0,1440),subject=$("#att-subject")?.value||"English II",notes=$("#att-notes")?.value||"";
    if(!minutes)return alert("Enter instructional minutes.");
    state.records.attendance.push({date,minutes,subject,notes});save();renderAttendance();
  });renderAttendance();

  // Reading log
  const readBody=$("[data-reading-body]");
  function renderReading(){
    if(!readBody)return;
    readBody.innerHTML=state.records.reading.map((r,i)=>`<tr><td>${esc(r.date)}</td><td>${esc(r.title)}</td><td>${esc(r.author)}</td><td>${esc(r.pages)}</td><td>${esc(r.minutes)}</td><td>${esc(r.response)}</td><td class="no-print"><button class="btn danger" type="button" data-remove-read="${i}">Remove</button></td></tr>`).join("")||`<tr><td colspan="7">No reading entries yet.</td></tr>`;
    $$("[data-remove-read]").forEach(b=>b.addEventListener("click",()=>{state.records.reading.splice(Number(b.dataset.removeRead),1);save();renderReading()}));
  }
  $("[data-add-reading]")?.addEventListener("click",()=>{
    const entry={date:$("#read-date")?.value||today(),title:$("#read-title")?.value||"",author:$("#read-author")?.value||"",pages:$("#read-pages")?.value||"",minutes:$("#read-minutes")?.value||"",response:$("#read-response")?.value||""};
    if(!entry.title)return alert("Enter a title.");state.records.reading.push(entry);save();renderReading();
  });renderReading();

  // Export/import/reset
  function download(name,text,type="application/json"){
    const blob=new Blob([text],{type}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
  }
  $$("[data-export-backup]").forEach(b=>b.addEventListener("click",()=>download(`ELA10_${(state.studentName||"Student").replace(/[^a-z0-9_-]+/gi,"_")}_Backup.json`,JSON.stringify(state,null,2))));
  $$("[data-export-csv]").forEach(b=>b.addEventListener("click",()=>{
    const rows=[["Week","Daily Lessons Complete","Weekly Quiz Best","Quiz Attempts"]];
    for(let w=1;w<=36;w++){const ws=weekState(w);rows.push([w,completedDays(w),score(ws.quiz)??"",ws.quiz.attempts.length])}
    rows.push([]);rows.push(["Unit","Unit Assessment Best","Project Score","Attempts"]);
    for(let u=1;u<=12;u++){const us=unitState(u);rows.push([u,score(us.assessment)??"",us.projectScore??"",us.assessment.attempts.length])}
    rows.push([]);const st=calcStats();rows.push(["Midterm",st.mid??""]);rows.push(["Final",st.fin??""]);rows.push(["Provisional Weighted Grade",st.grade??""]);
    const csv=rows.map(r=>r.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\n");
    download("ELA10_Gradebook.csv",csv,"text/csv");
  }));
  $$("[data-import-backup]").forEach(input=>input.addEventListener("change",e=>{
    const file=e.target.files?.[0];if(!file)return;
    const reader=new FileReader();reader.onload=()=>{const parsed=safeParse(reader.result,null),obj=parsed?.lessonRecord||parsed;if(recordStore.replace(obj)){state=obj;location.reload()}};reader.readAsText(file);
  }));
  $$("[data-reset-course]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Delete all locally stored English 10 progress on this browser?")){const next=defaultState();if(recordStore.replace(next)){state=next;location.reload()}}}));

  // Certificate
  const certName=$("[data-certificate-name]"),certDate=$("[data-certificate-date]");
  if(certName)certName.textContent=state.studentName||"Student Name";
  if(certDate)certDate.textContent=state.profile.completionDate||today();

  // Search cards
  const search=$("[data-card-search]");
  search?.addEventListener("input",()=>{const q=search.value.trim().toLowerCase();$$("[data-search-card]").forEach(card=>card.hidden=Boolean(q&&!card.textContent.toLowerCase().includes(q)))});

  // Course-scoped offline registration
  if("serviceWorker" in navigator && location.protocol.startsWith("http")){
    const scriptSrc=document.currentScript?.src;
    if(scriptSrc){
      const swURL=new URL("../service-worker.js",scriptSrc);
      navigator.serviceWorker.register(swURL,{scope:new URL("../",scriptSrc).pathname}).catch(()=>{});
    }
  }


  // Reuse vetted metadata from the shared ELA video registry; videos are optional.
  function attachOptionalELAStudyVideo(){
    const m=location.pathname.match(/\/weeks\/week-(\d{2})\/(?:index\.html)?$/);
    if(!m || document.querySelector('[data-shared-ela-video]'))return;
    const week=Number(m[1]);
    const choices=[[1,3,"Close reading and annotation","J2KHX1Pm5co"],[7,9,"Identifying theme","C2XYTlnfjgA"],[10,12,"Rhetorical analysis","FnAR2GtFy-E"]];
    const title=(document.querySelector("main h1")?.textContent||document.title).toLowerCase();
    const matched=[["character","Character development","dO5UP9jI4bw"],["diction","Diction analysis","ZDe6FwRiB5o"],["poet","Reading poetry","G5GUUgHVruQ"],["source","Evaluating source credibility","1dOip0k9NgE"],["debate","Debate skills","1TSkkxu8on0"],["drama","Elements of drama","MOD9d5Eo9so"],["revision","Revision process","Mi8tpmuzVw8"],["citation","MLA citations","ypWxhhpGeyM"],["synthesis","Synthesis","uBX01y4sRwA"],["rhetor","Rhetorical appeals","9L_G82HH9Tg"],["symbol","Symbolism","GR9VbSXxouM"],["research","Research questions","71-GucBaM8U"]].find(x=>title.includes(x[0]));
    const chosen=matched?[0,36,matched[1],matched[2]]:choices.find(x=>week>=x[0]&&week<=x[1]);
    if(!chosen)return;
    const main=document.querySelector("main");if(!main)return;
    const box=document.createElement("aside");
    box.dataset.sharedElaVideo="1";
    box.setAttribute("aria-label","Optional video study resource");
    box.style.cssText="max-width:1100px;margin:14px auto;padding:16px;border:1px solid #d7d1c5;border-radius:7px;background:#faf7f0;color:#191919";
    const label=document.createElement("strong");
    label.textContent="Optional video study · "+chosen[2]+": ";
    const a=document.createElement("a");
    a.href="https://www.youtube.com/watch?v="+encodeURIComponent(chosen[3]);
    a.target="_blank";a.rel="noopener noreferrer";
    a.textContent="Watch lesson support";
    const note=document.createElement("p");
    note.textContent="This external video is supplementary; the written reading and assignments remain available offline. Captions and transcripts have not been verified.";
    box.append(label,a,note);main.insertBefore(box,main.firstChild);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attachOptionalELAStudyVideo,{once:true});
  else attachOptionalELAStudyVideo();

  // Non-grading reading-response guide; preserves existing records and assessment contracts.
  function attachReadingResponseGuide(){
    if(!/\/units\/unit-\d{2}\/(?:index\.html)?$/.test(location.pathname))return;
    if(document.getElementById("reading-rubric-heading"))return;
    const main=document.querySelector("main");if(!main)return;
    const section=document.createElement("section");
    section.className="wrap";
    section.setAttribute("aria-labelledby","reading-rubric-heading");
    section.style.margin="1rem auto";
    const article=document.createElement("article");article.className="card";
    const title=document.createElement("h2");title.id="reading-rubric-heading";title.textContent="Unit reading-response guide · 100 points";
    const introduction=document.createElement("p");introduction.textContent="Submit your interpretation and revised draft in the existing portfolio. Teacher-scored guide only; this does not automatically change grades, mastery, or completion.";
    const rows=[["Comprehension",20,"Accurate account of the text"],["Textual evidence",25,"Precise quotations or contextualized details"],["Interpretation",25,"Reasoned and nuanced explanation"],["Writing clarity",15,"Clear and coherent organization"],["Revision",15,"Substantive improvement supported by reflection"]];
    const table=document.createElement("table");const cap=document.createElement("caption");cap.textContent="Reading response scoring criteria";table.append(cap);
    const head=document.createElement("thead");const hr=document.createElement("tr");
    for(const v of ["Criterion","Points","Strong evidence"]){const th=document.createElement("th");th.scope="col";th.textContent=v;hr.append(th)}head.append(hr);table.append(head);
    const body=document.createElement("tbody");
    for(const [name,points,description] of rows){const tr=document.createElement("tr");const th=document.createElement("th");th.scope="row";th.textContent=name;const td=document.createElement("td");td.textContent=String(points);const explain=document.createElement("td");explain.textContent=description;tr.append(th,td,explain);body.append(tr)}table.append(body);
    const note=document.createElement("p");note.textContent="Read → annotate → draft → cite → receive feedback → revise → preserve both versions. Short microtexts supplement, rather than replace, extended literature.";
    article.append(title,introduction,table,note);section.append(article);
    const weeks=main.querySelector("#weeks");main.insertBefore(section,weeks||null);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attachReadingResponseGuide,{once:true});
  else attachReadingResponseGuide();

  // Accessible, device-local reading desk; no new network services, storage keys or grades.
  function enableReadingDesk(){
    if(!/\/units\/unit-\d{2}\/(?:index\.html)?$/.test(location.pathname))return;
    const main=document.querySelector("main");if(!main)return;
    const candidates=Array.from(main.querySelectorAll('#assigned-reading, [aria-label="Extended literary reading"], [aria-label="Extended required reading"], [aria-label="Extended reading"], section:has([id^="literature-depth-"])')).filter(el=>!el.closest('#khae-reading-desk'));
    if(!candidates.length)return;
    const style=document.createElement("style");
    style.textContent=`
      .khae-read-open{margin:.6rem .4rem .6rem 0;padding:.55rem .9rem;border:1px solid #8b7855;border-radius:7px;background:#fffaf1;color:#242018;cursor:pointer}
      #khae-reading-desk{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(16,20,24,.72)}
      #khae-reading-desk[hidden]{display:none}
      #khae-reading-desk .khae-read-panel{box-sizing:border-box;width:min(900px,96vw);height:min(85vh,900px);min-width:min(320px,96vw);min-height:260px;max-width:98vw;max-height:95vh;resize:both;overflow:auto;background:#faf7ef;color:#191919;border:2px solid #ac9673;border-radius:7px;padding:16px;box-shadow:0 12px 45px #0005}
      #khae-reading-desk .khae-read-tools{position:sticky;top:-16px;background:#faf7ef;z-index:1;display:flex;flex-wrap:wrap;gap:8px;padding:8px 0;border-bottom:1px solid #d6cbbb;align-items:center}
      #khae-reading-desk button{border:1px solid #8b7855;border-radius:7px;background:white;color:#191919;padding:8px 12px;cursor:pointer;min-height:42px}
      #khae-reading-desk button:focus-visible,.khae-read-open:focus-visible{outline:3px solid #2369a0;outline-offset:2px}
      #khae-reading-desk .khae-read-content{font-family:Georgia,serif;line-height:1.7;font-size:18px;max-width:72ch;margin:auto}
      #khae-reading-desk .khae-read-content p,#khae-reading-desk .khae-read-content li{font-size:1em!important;line-height:1.7!important}
      #khae-reading-desk .khae-read-content h2{font-size:1.6em!important}
      #khae-reading-desk .khae-read-content h3{font-size:1.25em!important}
      @media print{body.khae-print-reading>*:not(#khae-reading-desk){display:none!important}body.khae-print-reading #khae-reading-desk{position:static;display:block!important;background:white;padding:0}body.khae-print-reading #khae-reading-desk .khae-read-panel{width:auto!important;height:auto!important;max-height:none!important;overflow:visible;resize:none;box-shadow:none;border:0;background:white;color:black}body.khae-print-reading #khae-reading-desk .khae-read-tools{display:none!important}body.khae-print-reading #khae-reading-desk .khae-read-content{max-width:none}}
    `;
    document.head.append(style);
    const overlay=document.createElement("div");overlay.id="khae-reading-desk";overlay.hidden=true;
    overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-label","Adjustable reading desk");
    const panel=document.createElement("div");panel.className="khae-read-panel";panel.tabIndex=-1;
    const bar=document.createElement("div");bar.className="khae-read-tools";
    const content=document.createElement("div");content.className="khae-read-content";
    let font=18;let source=null;let opener=null;
    const button=(label,fn)=>{const el=document.createElement("button");el.type="button";el.textContent=label;el.addEventListener("click",fn);bar.append(el);return el};
    const close=()=>{overlay.hidden=true;document.body.style.overflow="";if(opener?.isConnected)opener.focus()};
    button("− Text",()=>{font=Math.max(14,font-2);content.style.fontSize=font+"px"});
    button("+ Text",()=>{font=Math.min(34,font+2);content.style.fontSize=font+"px"});
    button("Reset",()=>{font=18;content.style.fontSize="18px";panel.style.width="";panel.style.height=""});
    button("Print",()=>{document.body.classList.add("khae-print-reading");window.addEventListener("afterprint",()=>document.body.classList.remove("khae-print-reading"),{once:true});window.print()});
    button("Export .txt",()=>{const txt=content.innerText||content.textContent||"";const blob=new Blob([txt],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="khaemenes-reading-"+(location.pathname.match(/unit-\d{2}/)?.[0]||"selection")+".txt";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)});
    const closeBtn=button("Close ×",close);
    panel.append(bar,content);overlay.append(panel);document.body.append(overlay);
    overlay.addEventListener("mousedown",ev=>{if(ev.target===overlay)close()});
    overlay.addEventListener("keydown",ev=>{if(ev.key==="Escape"){ev.preventDefault();close()}else if(ev.key==="Tab"){const controls=Array.from(bar.querySelectorAll("button"));if(ev.shiftKey&&document.activeElement===controls[0]){ev.preventDefault();controls[controls.length-1].focus()}else if(!ev.shiftKey&&document.activeElement===controls[controls.length-1]){ev.preventDefault();controls[0].focus()}}});
    for(const candidate of candidates){
      if(candidate.querySelector(".khae-read-open"))continue;
      const launch=document.createElement("button");launch.className="khae-read-open";launch.type="button";launch.textContent="Open adjustable reading · Zoom / Print / Export";
      candidate.prepend(launch);
      launch.addEventListener("click",()=>{source=candidate;opener=launch;content.replaceChildren();const copy=candidate.cloneNode(true);copy.querySelectorAll(".khae-read-open, button, input, textarea, script").forEach(el=>el.remove());content.append(copy);overlay.hidden=false;document.body.style.overflow="hidden";panel.focus();closeBtn.focus()});
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enableReadingDesk,{once:true});
  else enableReadingDesk();
})();

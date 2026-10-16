
(() => {
  "use strict";

  function readProfile(){
    try{
      const id=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
      const registry=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null");
      const learner=typeof id==="string"?registry?.learners?.[id]:null;
      return learner && learner.learnerId===id ? {learnerId:id,name:String(learner.nickname||"Learner")} : null;
    }catch{return null;}
  }
  const entryContract=window.KhaemenesCourseEntryContract;
  const academyProfile=entryContract?.readAcademyProfile?.()||readProfile();
  const scopedKey=base=>entryContract?.scopedKey?.(base,academyProfile)||(academyProfile?`${base}:learner:${encodeURIComponent(academyProfile.learnerId)}`:base);
  window.KhaemenesEnglish9Records=Object.freeze({profile:academyProfile,storageKey:scopedKey,version:1});

  function entryDecision(){
    if(!academyProfile)return {allow:false,title:"Choose your learner",message:"Select your learner in the Academy Family Portal before opening English 9. Course records stay separated by Academy learner.",href:"https://vervenveda.com/Khaemenes_Academy.github.io/",label:"Return to Academy sign-in"};
    const readiness=entryContract?.readJSON?.("khaemenes-english9-readiness-v1",null,academyProfile)||(()=>{try{return JSON.parse(localStorage.getItem(scopedKey("khaemenes-english9-readiness-v1"))||"null")}catch{return null}})();
    const essentials=["close_reading_evidence","language_conventions","source_argument"];
    const ready=entryContract?.isReady?.(readiness,essentials,"english-9")||(
      readiness?.course_id==="english-9"&&["advance","advance_with_targeted_refresh"].includes(readiness.route)&&readiness.overall_percent>=80&&essentials.every(id=>Number(readiness.strand_scores?.[id])>=80)
    );
    if(ready)return {allow:true,profile:academyProfile};
    const diagnostic=new URL("assessments/diagnostic/index.html",new URL("../",document.currentScript?.src||location.href)).href;
    const foundations=new URL("foundations/index.html",new URL("../",document.currentScript?.src||location.href)).href;
    return readiness?.route==="unit_0_refresher"
      ? {allow:false,title:"Continue your English foundations",message:"This readiness result recommends a six-week targeted bridge before Official Week 1. Work through the local lessons, print the evidence pages if useful, and return for the exit check when you are ready.",href:foundations,label:"Open Foundations bridge"}
      : {allow:false,title:"Begin with English readiness",message:"This low-stakes check identifies the support that will make the 36-week course more useful. Take it at your own pace.",href:diagnostic,label:"Open readiness check"};
  }
  function mountEntryGate(){
    const result=entryDecision();
    window.KhaemenesEnglish9Entry=Object.freeze({decision:()=>result});
    if(result.allow)return;
    document.documentElement.dataset.english9EntryBlocked="true";
    const gate=document.createElement("section");gate.className="english9-entry-gate";gate.setAttribute("role","dialog");gate.setAttribute("aria-modal","true");gate.setAttribute("aria-labelledby","english9EntryTitle");
    gate.style.cssText="position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:20px;background:#191919eF;color:#fff";
    const card=document.createElement("article");card.style.cssText="max-width:620px;padding:26px;border:1px solid #d7d1c5;border-radius:7px;background:#fff;color:#191919";
    const title=document.createElement("h1");title.id="english9EntryTitle";title.textContent=result.title;title.style.fontWeight="400";
    const message=document.createElement("p");message.textContent=result.message;
    const link=document.createElement("a");link.href=result.href;link.textContent=result.label;link.style.cssText="display:inline-block;padding:12px 16px;border:1px solid #705719;border-radius:7px;background:#705719;color:#fff;text-decoration:none";
    const home=document.createElement("a");home.href=new URL("../",new URL("../",document.currentScript?.src||location.href)).href;home.textContent="English 9 home";home.style.cssText="display:inline-block;margin-left:10px;padding:12px 16px;border:1px solid #d7d1c5;border-radius:7px;color:#191919;text-decoration:none";
    card.append(title,message,link,home);gate.append(card);document.querySelectorAll("body > :not(script)").forEach(node=>{node.inert=true});document.body.append(gate);link.focus();
  }
  const pathName=typeof location!=="undefined"?String(location.pathname||""):"";
  const requiresEntry=document.body?.hasAttribute("data-english9-require-entry")||/\/weeks\/week-\d+(?:\/|$)/.test(pathName);
  if(requiresEntry && document.body && typeof document.createElement==="function")mountEntryGate();
  function showProfileNotice(){
    const main=document.querySelector("main")||document.querySelector(".main");
    if(!main)return;
    const note=document.createElement("p");note.className="notice";note.setAttribute("role","status");
    note.textContent=academyProfile?`Learning profile: ${academyProfile.name}. Work is saved separately for this learner on this device. Protected sign-in and cross-device sync are not connected.`:"No Academy learner is selected. Notes here use the existing unassigned browser workspace. Select a learner in the Academy Family Portal before starting new learner-specific work.";
    if(document.querySelector("#landing-navigation, [data-week1-workspace]"))note.textContent=academyProfile?`Learning profile: ${academyProfile.name} · Saved on this device.`:"Choose your learner in the Academy Family Portal before starting learner-specific work.";
    main.prepend(note);
  }
  showProfileNotice();
  const courseScript=document.currentScript;
  const courseMain=document.querySelector("main")||document.querySelector(".main");
  if(courseScript?.src && courseMain && !document.querySelector("#landing-navigation, [data-week1-workspace]")){
    const tools=document.createElement("p");
    const link=document.createElement("a");
    const url=new URL("../learning-tools.html",courseScript.src);
    const match=location.pathname.match(/weeks\/week-(\d+)/);
    if(match)url.hash="week-"+Number(match[1]);
    link.href=url.href;link.className="btn";link.textContent="Lesson tools, games and return paths";
    tools.appendChild(link);courseMain.prepend(tools);
  }
  window.addEventListener("storage",event=>{if(event.key==="khaemenes_active_learner_v1")location.reload();});

  const root=document.documentElement;
  const themeKey="khae-ela9-theme-v1";
  const themeButton=document.querySelector("[data-theme-toggle]");
  try{root.dataset.theme=localStorage.getItem(themeKey)||"light";}catch{root.dataset.theme="light";}
  function syncTheme(){if(themeButton){themeButton.textContent=root.dataset.theme==="dark"?"Light":"Dark";themeButton.setAttribute("aria-label",`Switch to ${root.dataset.theme==="dark"?"light":"dark"} theme`);}}
  syncTheme();
  themeButton?.addEventListener("click",()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";try{localStorage.setItem(themeKey,root.dataset.theme)}catch{}syncTheme();});

  const courseKey=scopedKey("khae-ela9-progress-v1");
  const load=()=>{try{return JSON.parse(localStorage.getItem(courseKey)||"{}")}catch{return {}}};
  const save=data=>{try{localStorage.setItem(courseKey,JSON.stringify(data))}catch{}};
  const progress=load();
  document.querySelectorAll("[data-progress-key]").forEach(button=>{
    if(button.dataset.managedProgress==="week1"||button.dataset.managedProgress==="week3"||button.dataset.managedProgress==="week4"||button.dataset.managedProgress==="week5"||button.dataset.managedProgress==="week6"||button.dataset.managedProgress==="week7"||button.dataset.managedProgress==="week8"||button.dataset.managedProgress==="week9"||button.dataset.managedProgress==="week10"||button.dataset.managedProgress==="week11"||button.dataset.managedProgress==="week12")return;
    const key=button.dataset.progressKey;
    const on=Boolean(progress[key]);
    button.setAttribute("aria-pressed",String(on));
    const prepared=button.dataset.evidenceOnly==="true" || button.dataset.progressKey.startsWith("week-") && Boolean(document.querySelector('[data-save-field*="-day-"]'));
    button.textContent=on?(prepared?"Evidence prepared ✓":"Completed ✓"):(prepared?"Mark Evidence Prepared":"Mark Complete");
    button.addEventListener("click",()=>{
      progress[key]=!progress[key];save(progress);
      button.setAttribute("aria-pressed",String(progress[key]));
      button.textContent=progress[key]?(prepared?"Evidence prepared ✓":"Completed ✓"):(prepared?"Mark Evidence Prepared":"Mark Complete");
      updateProgress();
    });
  });
  function updateProgress(){
    const bar=document.querySelector("[data-course-progress]");
    const label=document.querySelector("[data-course-progress-label]");
    if(!bar&&!label)return;
    const total=36,done=Array.from({length:36},(_,i)=>progress[`week-${String(i+1).padStart(2,"0")}`]).filter(Boolean).length;
    const pct=Math.round(done/total*100);
    if(bar)bar.style.width=`${pct}%`;
    if(label)label.textContent=`${done} of ${total} weeks complete · ${pct}%`;
  }
  updateProgress();

  document.querySelectorAll("[data-save-field]").forEach(field=>{
    if(field.dataset.managedSave==="week1"||field.dataset.managedSave==="week2"||field.dataset.managedSave==="week3"||field.dataset.managedSave==="week4"||field.dataset.managedSave==="week5"||field.dataset.managedSave==="week6"||field.dataset.managedSave==="week7"||field.dataset.managedSave==="week8"||field.dataset.managedSave==="week9"||field.dataset.managedSave==="week10"||field.dataset.managedSave==="week11"||field.dataset.managedSave==="week12")return;
    const key=scopedKey(`khae-ela9-field:${field.dataset.saveField}`);
    try{field.value=localStorage.getItem(key)||""}catch{}
    field.addEventListener("input",()=>{try{localStorage.setItem(key,field.value)}catch{}});
  });
  document.querySelectorAll("[data-print]").forEach(button=>button.addEventListener("click",()=>window.print()));
  document.querySelectorAll("[data-clear-field]").forEach(button=>button.addEventListener("click",()=>{
    const field=document.getElementById(button.dataset.clearField);if(!field)return;field.value="";field.dispatchEvent(new Event("input"));field.focus();
  }));

  const search=document.querySelector("[data-card-search]");
  if(search){search.addEventListener("input",()=>{const q=search.value.trim().toLowerCase();document.querySelectorAll("[data-search-card]").forEach(card=>{card.hidden=q&&!card.textContent.toLowerCase().includes(q);});});}

  // Required reading route for every weekly lesson; no student storage or assessment mutation.
  function attachUnitReading(){
    const match=location.pathname.match(/\/weeks\/week-(\d{2})\/(?:index\.html)?$/);
    if(!match || document.querySelector('a[href*="#assigned-reading"]')) return;
    const week=Number(match[1]);
    if(week<1 || week>36) return;
    const unit=String(Math.ceil(week/3)).padStart(2,"0");
    const main=document.querySelector("main");
    if(!main)return;
    const notice=document.createElement("aside");
    notice.setAttribute("aria-label","Required weekly reading");
    notice.style.cssText="margin:14px auto;padding:16px;border:1px solid #d7d1c5;border-radius:7px;background:#faf7f0;color:#191919;max-width:1100px";
    const strong=document.createElement("strong");
    strong.textContent="Required reading for this week: ";
    const link=document.createElement("a");
    link.href=new URL("../../units/unit-"+unit+"/index.html#assigned-reading",location.href).href;
    link.textContent="Open Unit "+Number(unit)+" reading and annotation assignment";
    notice.append(strong,link,document.createTextNode(". Complete the source questions and preserve your response in the existing portfolio."));
    main.insertBefore(notice,main.firstChild);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attachUnitReading,{once:true});
  else attachUnitReading();

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

  // Learner-scoped reading notebook. Portable JSON; no automatic cross-origin synchronization.
  function enableReadingNotebook(){
    const u=location.pathname.match(/\/units\/unit-(\d{2})\/(?:index\.html)?$/);
    if(!u)return;
    const target=document.getElementById("assigned-reading");
    if(!target)return;
    const learner=window.KhaemenesCourseEntryContract?.readAcademyProfile?.() || (typeof academyProfile!=="undefined"?academyProfile:null);
    if(!learner?.learnerId)return; // Fail closed: never share anonymous notes across learners.
    const learnerId=String(learner.learnerId), unit=u[1], course=(location.pathname.match(/english-(\d+)/)||[])[1]||"unknown";
    const base="khaemenes-reading-notebook-v1:"+course+":"+unit+":learner:"+encodeURIComponent(learnerId);
    let notes=[];
    try{const parsed=JSON.parse(localStorage.getItem(base)||"[]");if(Array.isArray(parsed))notes=parsed.filter(v=>v&&typeof v.quote==="string"&&typeof v.note==="string").slice(0,200)}catch{}
    const section=document.createElement("section");section.className="card";section.style.cssText="margin:16px auto;padding:18px;max-width:1100px;border-radius:7px;background:#faf7ef;color:#191919;border:1px solid #c8bda9";
    const title=document.createElement("h2");title.textContent="My Reading Notebook · Unit "+Number(unit);
    const help=document.createElement("p");help.textContent="Select a passage in the reading, then capture a quote and your interpretation. Notes and bookmarks are saved only in this browser profile until exported. Browser storage is not a permanent backup.";
    const backup=document.createElement("p");backup.setAttribute("role","note");backup.style.cssText="padding:12px;border:1px solid #9c885f;border-radius:7px;background:#fff4d8;color:#211c13";backup.textContent="SAVE YOUR WORK: Students, parents and teachers—regularly export notebooks, assignments, grades and reports to a dependable device or backup drive. Check that your files open correctly, keep a second copy in a separate safe location, and export again after major work. Clearing browser data, changing devices or using private browsing may erase local work.";const status=document.createElement("p");status.setAttribute("role","status");
    const quote=document.createElement("textarea");quote.rows=3;quote.placeholder="Selected quotation or passage";quote.setAttribute("aria-label","Reading quotation");
    const note=document.createElement("textarea");note.rows=3;note.placeholder="What does this detail suggest?";note.setAttribute("aria-label","My annotation");
    for(const box of [quote,note])box.style.cssText="display:block;box-sizing:border-box;width:100%;margin:.6rem 0;padding:10px;border-radius:7px;border:1px solid #a99b82;background:white;color:black";
    const toolbar=document.createElement("div");toolbar.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin:.8rem 0";
    const list=document.createElement("ol");
    const btn=(name,fn)=>{const b=document.createElement("button");b.type="button";b.textContent=name;b.style.cssText="padding:9px 12px;border:1px solid #847354;border-radius:7px;background:white;color:black;cursor:pointer";b.addEventListener("click",fn);toolbar.append(b);return b};
    const persist=()=>{try{localStorage.setItem(base,JSON.stringify(notes));status.textContent="Saved on this device."}catch{status.textContent="Storage unavailable. Export your notebook before leaving."}};
    const render=()=>{list.replaceChildren();notes.forEach((item,index)=>{const li=document.createElement("li");li.style.marginBottom="12px";const q=document.createElement("blockquote");q.textContent=item.quote;const p=document.createElement("p");p.textContent=item.note||"(Bookmark)";const remove=document.createElement("button");remove.type="button";remove.textContent="Delete entry";remove.addEventListener("click",()=>{notes.splice(index,1);persist();render()});li.append(q,p,remove);list.append(li)})};
    btn("Capture selection",()=>{const selection=window.getSelection()?.toString()?.trim()||"";if(selection){quote.value=selection.slice(0,1200);status.textContent="Selection captured; add a note or bookmark."}else status.textContent="Select text in the page first, then capture."});
    btn("Save annotation",()=>{const q=quote.value.trim();if(!q){status.textContent="Add a quotation first.";return}notes.push({quote:q.slice(0,1200),note:note.value.trim().slice(0,3000),date:new Date().toISOString(),kind:"annotation"});notes=notes.slice(-200);persist();render();quote.value="";note.value=""});
    btn("Bookmark",()=>{const q=quote.value.trim();if(!q){status.textContent="Capture or paste the sentence to bookmark.";return}notes.push({quote:q.slice(0,1200),note:"",date:new Date().toISOString(),kind:"bookmark"});notes=notes.slice(-200);persist();render();quote.value=""});
    btn("Export JSON",()=>{const data=JSON.stringify({schema:"khaemenes-reading-notebook-v1",course,unit,entries:notes},null,2);const blob=new Blob([data],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="khaemenes-english-"+course+"-unit-"+unit+"-reading-notes.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)});
    const file=document.createElement("input");file.type="file";file.accept=".json,application/json";file.hidden=true;
    btn("Import JSON",()=>file.click());file.addEventListener("change",async()=>{const f=file.files?.[0];if(!f||f.size>1000000){status.textContent="Choose a JSON file under 1 MB.";return}try{const data=JSON.parse(await f.text());if(data.schema!=="khaemenes-reading-notebook-v1"||data.course!==course||data.unit!==unit||!Array.isArray(data.entries)||data.entries.length>200)throw Error("format");const incoming=data.entries.filter(x=>x&&typeof x.quote==="string"&&x.quote.length<=1200&&typeof x.note==="string"&&x.note.length<=3000).map(x=>({quote:x.quote,note:x.note,date:typeof x.date==="string"?x.date:"",kind:x.kind==="bookmark"?"bookmark":"annotation"}));if(incoming.length!==data.entries.length)throw Error("invalid entry");if(!window.confirm("Import "+incoming.length+" entries into this learner's notebook? Existing notes will be retained."))return;notes=notes.concat(incoming).slice(-200);persist();render()}catch{status.textContent="Invalid or incompatible notebook file."}file.value=""});
    const companion=document.createElement("p");companion.textContent="Optional ProReSources tools: ";
    const links=[["Reading Response","templates/packs/khaemenes-academic-core/reading-response.html"],["Academic Notes","templates/packs/khaemenes-academic-core/academic-notes.html"],["Evidence & Citation Studio","Protools/Evidence_Citation_Studio/index.html"],["PROSE Editorial Suite","Protools/PROSE/Editorial%20Suite/editorial-suite_core.html"]];
    links.forEach(([name,path],i)=>{const a=document.createElement("a");a.href="https://vervenveda.github.io/proresource_hub.github.io/"+path;a.target="_blank";a.rel="noopener noreferrer";a.textContent=name;companion.append(a,document.createTextNode(i<links.length-1?" · ":""))});
    const privacy=document.createElement("p");privacy.textContent="Export/import transfers a copy manually. ProReSources applications keep separate workspaces; opening a tool does not sync or upload this notebook.";
    section.append(title,help,backup,quote,note,toolbar,file,status,list,companion,privacy);target.after(section);render();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enableReadingNotebook,{once:true});
  else enableReadingNotebook();

  function showCourseBackupReminder(){
    const main=document.querySelector("main");if(!main||document.getElementById("khae-course-backup-reminder"))return;
    const notice=document.createElement("aside");
    notice.id="khae-course-backup-reminder";
    notice.setAttribute("aria-label","Student work backup reminder");
    notice.style.cssText="box-sizing:border-box;max-width:1100px;margin:12px auto;padding:12px 16px;border-radius:7px;border:1px solid #aa9468;background:#fff6e1;color:#252017;font-size:14px;line-height:1.5";
    const strong=document.createElement("strong");strong.textContent="Protect your work · Students, teachers and parents: ";
    notice.append(strong,document.createTextNode("Save assignments, notebooks, portfolios, assessments and reports to a dependable device regularly. Use the course export and print tools where available; check your downloaded files and keep a separate backup. Browser-only storage can be lost or cleared."));
    main.insertBefore(notice,main.firstChild);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",showCourseBackupReminder,{once:true});
  else showCourseBackupReminder();

  function attachArshifReadingReference(){
    if(!/\/units\/unit-\d{2}\/(?:index\.html)?$/.test(location.pathname))return;
    const main=document.querySelector("main");
    if(!main||document.getElementById("arshif-reading-reference"))return;
    const reference=document.createElement("aside");
    reference.id="arshif-reading-reference";
    reference.setAttribute("aria-label","ARSHIF Archives reading reference");
    reference.style.cssText="margin:12px auto;max-width:1100px;padding:14px;border:1px solid #b9a47a;border-radius:7px;background:#faf4e9;color:#242018";
    const label=document.createElement("strong");
    label.textContent="ARSHIF Archives · Main Reading Reference: ";
    const link=document.createElement("a");
    link.href="https://vervenveda.github.io/Arshif.github.io/catalog/index.html";
    link.target="_blank";link.rel="noopener noreferrer";
    link.textContent="Open the Khaemenes High reading catalog";
    reference.append(label,link,document.createTextNode(". The complete assigned reading remains on this Academy page for offline study. Save student work separately; ARSHIF contains public references only."));
    main.insertBefore(reference,main.firstChild);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attachArshifReadingReference,{once:true});
  else attachArshifReadingReference();

  function enableBookReportProgram(){
    if(!/\/reading-list\.html$/.test(location.pathname))return;
    const main=document.querySelector("main");if(!main||document.getElementById("khae-book-report-program"))return;
    const grade=Number((location.pathname.match(/english-(\d+)/)||[])[1]);
    const choices={"9":["The Wonderful Wizard of Oz — L. Frank Baum","The Secret Garden — Frances Hodgson Burnett","Anne of Green Gables — L. M. Montgomery","Treasure Island — Robert Louis Stevenson"],"10":["Little Women — Louisa May Alcott","The Call of the Wild — Jack London","The Time Machine — H. G. Wells","The Adventures of Tom Sawyer — Mark Twain"],"11":["Narrative of the Life of Frederick Douglass — Frederick Douglass","Frankenstein — Mary Shelley","Great Expectations — Charles Dickens","The Adventures of Huckleberry Finn — Mark Twain","Jane Eyre — Charlotte Brontë"],"12":["Pride and Prejudice — Jane Austen","Jane Eyre — Charlotte Brontë","Frankenstein — Mary Shelley","The Picture of Dorian Gray — Oscar Wilde","The Souls of Black Folk — W. E. B. Du Bois"]}[grade];if(!choices)return;
    const count=grade>=11?4:2;
    const section=document.createElement("section");section.id="khae-book-report-program";
    section.style.cssText="max-width:1100px;margin:22px auto;padding:22px;border:1px solid #b9a581;background:#faf6ea;color:#211d19;border-radius:7px";
    const title=document.createElement("h2");title.textContent="Independent Reading · "+count+" Full Book Reports";
    const intro=document.createElement("p");intro.textContent="Choose a grade-appropriate complete book for each report. You may propose another book of equivalent reading challenge for teacher approval. Read the entire work rather than a plot summary. Keep page or chapter references to support your analysis.";
    section.append(title,intro);
    const reportSections=["Bibliographic information and reading dates","Accurate summary of the complete narrative or argument","Central conflict, ideas and major turning points","Character, perspective, form and author's craft","At least three specific passages with page or chapter references","Your interpretation and a plausible alternative reading","Historical or cultural context where relevant","A thoughtful recommendation with reasons","Reflection on feedback and your revision"];
    for(let i=1;i<=count;i++){
      const card=document.createElement("article");card.style.cssText="padding:14px;border:1px solid #d3c6ae;border-radius:7px;margin:12px 0;background:#fffdf8";
      const h=document.createElement("h3");h.textContent="Book Report "+i+" of "+count;
      const select=document.createElement("select");select.setAttribute("aria-label","Choose book for report "+i);select.style.cssText="max-width:100%;padding:9px;border-radius:7px;background:white;color:black";
      for(const t of ["Choose a book",...choices,"Teacher-approved alternative"]){const opt=document.createElement("option");opt.textContent=t;opt.value=t==="Choose a book"?"":t;select.append(opt)}
      const draft=document.createElement("textarea");draft.rows=10;draft.setAttribute("aria-label","Book report draft "+i);draft.placeholder=reportSections.map((t,j)=>(j+1)+". "+t).join("\n\n");draft.style.cssText="width:100%;box-sizing:border-box;display:block;min-height:230px;margin:12px 0;padding:12px;font:16px/1.6 Georgia,serif;border:1px solid #bcae95;border-radius:7px;background:white;color:black";
      const exportButton=document.createElement("button");exportButton.type="button";exportButton.textContent="Export this report (.txt)";exportButton.style.cssText="padding:9px 12px;background:#fff;border:1px solid #9d8a64;border-radius:7px;color:#222;cursor:pointer";
      exportButton.addEventListener("click",()=>{const data="English "+grade+" Book Report "+i+"\nBook: "+(select.value||"not selected")+"\n\n"+reportSections.map((x,j)=>(j+1)+". "+x).join("\n")+"\n\nDRAFT\n"+draft.value;const url=URL.createObjectURL(new Blob([data],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="english-"+grade+"-book-report-"+i+".txt";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)});
      const print=document.createElement("button");print.type="button";print.textContent="Print";print.style.cssText=exportButton.style.cssText+";margin-left:8px";print.addEventListener("click",()=>window.print());
      const reminder=document.createElement("p");reminder.textContent="This report is saved in this browser only when an Academy learner is selected. Regularly export a JSON backup to a dependable device and keep another copy elsewhere. Neither browser storage nor a download alone is a permanent backup. Grades and mastery are unchanged.";
      const saveStatus=document.createElement("p");saveStatus.setAttribute("role","status");saveStatus.setAttribute("aria-live","polite");
      const learner=window.KhaemenesCourseEntryContract?.readAcademyProfile?.();
      const owner=learner?.learnerId?String(learner.learnerId):null;
      const storageKey=owner?"khaemenes-book-report-v1:english-"+grade+":report-"+i+":learner:"+encodeURIComponent(owner):null;
      const stillOwner=()=>!!owner&&window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId===owner;
      const snapshot=()=>({schema:"khaemenes-book-report-v1",grade,report:i,book:select.value,draft:draft.value,savedAt:new Date().toISOString()});
      const persist=()=>{if(!storageKey||!stillOwner()){saveStatus.textContent="Select the correct Academy learner and reload before saving. Export the draft manually if needed.";return}try{localStorage.setItem(storageKey,JSON.stringify(snapshot()));saveStatus.textContent="Saved on this device · "+new Date().toLocaleTimeString()}catch{saveStatus.textContent="Local save failed. Export a backup now."}};
      if(storageKey){try{const recovered=JSON.parse(localStorage.getItem(storageKey)||"null");if(recovered?.schema==="khaemenes-book-report-v1"&&recovered.grade===grade&&recovered.report===i&&typeof recovered.draft==="string"&&recovered.draft.length<=250000){draft.value=recovered.draft;if(Array.from(select.options).some(o=>o.value===recovered.book))select.value=recovered.book;saveStatus.textContent="Previous draft recovered from this device."}else saveStatus.textContent="New report. Save a separate backup regularly."}catch{saveStatus.textContent="Stored draft could not be read; recover from an exported backup."}}else saveStatus.textContent="No active Academy learner: drafts will not save locally. Export your work.";
      let timer;const changed=()=>{saveStatus.textContent="Unsaved changes…";clearTimeout(timer);timer=setTimeout(persist,600)};
      select.addEventListener("change",changed);draft.addEventListener("input",changed);
      draft.addEventListener("blur",()=>{if(timer){clearTimeout(timer);timer=null;persist()}});
      const backup=document.createElement("button");backup.type="button";backup.textContent="Download JSON backup";backup.style.cssText=exportButton.style.cssText+";margin-left:8px";
      backup.addEventListener("click",()=>{const obj=snapshot();const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="english-"+grade+"-book-report-"+i+"-backup.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);saveStatus.textContent="Backup download requested. Verify the file on your device."});
      const restore=document.createElement("input");restore.type="file";restore.accept=".json,application/json";restore.hidden=true;
      const restoreButton=document.createElement("button");restoreButton.type="button";restoreButton.textContent="Restore JSON backup";restoreButton.style.cssText=exportButton.style.cssText+";margin-left:8px";restoreButton.addEventListener("click",()=>restore.click());
      restore.addEventListener("change",async()=>{const file=restore.files?.[0];if(!file)return;try{if(file.size>500000)throw Error("File too large");const obj=JSON.parse(await file.text());if(obj?.schema!=="khaemenes-book-report-v1"||obj.grade!==grade||obj.report!==i||typeof obj.draft!=="string"||obj.draft.length>250000||typeof obj.book!=="string")throw Error("Invalid report file");if(!confirm("Replace the current report draft with the imported backup?"))return;draft.value=obj.draft;select.value=Array.from(select.options).some(o=>o.value===obj.book)?obj.book:"";persist();saveStatus.textContent="Backup restored; "+saveStatus.textContent}catch{saveStatus.textContent="Invalid or incompatible backup. Current draft preserved."}finally{restore.value=""}});
      card.append(h,select,draft,exportButton,print,backup,restoreButton,restore,saveStatus,reminder);section.append(card);
      
    }
    const standards=document.createElement("p");standards.textContent="Suggested pacing: Grades 9–10: one report each semester. Grades 11–12: two reports each semester. Teacher-approved accessibility accommodations and equivalent texts are welcome. Public-domain status varies by jurisdiction and edition; use legally accessible copies.";
    section.append(standards);main.append(section);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enableBookReportProgram,{once:true});
  else enableBookReportProgram();
})();

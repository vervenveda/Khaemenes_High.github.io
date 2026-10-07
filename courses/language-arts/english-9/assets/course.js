
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
    if(button.dataset.managedProgress==="week1")return;
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
    if(field.dataset.managedSave==="week1")return;
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
})();

/* Khaemenes Academy · Algebra I Mathematics Engine v2.2.1 adapter
 * Canonical course-wide lesson-shell normalizer.
 * Preserves lesson curriculum, specialized labs, question banks, learner-record keys and scoring.
 */
(()=>{"use strict";
 if(window.KhaemenesAlgebra1LessonV2)return;
 const VERSION="2.2.2";
 const MANUAL_KEY="sectionChecks";
 const QUICK_KEY="quickChecks";
 const ITEMS=[
  ["learning-goals-warmup","Learning Goals & Warm-up","manual"],
  ["lesson-record","Your Lesson Record","reviewed"],
  ["mystery","Mystery","manual"],
  ["discover","Discover","evidence"],
  ["learn","Learn","manual"],
  ["interactive-lab","Experiment","evidence"],
  ["challenge","Challenge","manual"],
  ["defend","Defend","evidence"],
  ["reading-room","Reading Room","manual"],
  ["quick-check","Quick Check","quick"],
  ["worked-examples","Worked Examples","manual"],
  ["pathway-support","Pathway Support","manual"],
  ["vocabulary-bridge","Vocabulary Bridge","manual"],
  ["global-application","Global Application","manual"],
  ["guided-notes","Guided Notes","notes"],
  ["lesson-practice","Lesson Practice","mastery"],
  ["reflection","Reflection","reflection"]
 ];
 let bound=false,observing=false;
 const $=(s,r=document)=>r.querySelector(s);
 const $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const lessonId=()=>window.LESSON_DATA?.id||document.body?.dataset?.lessonId||location.pathname.split("/").pop()?.replace(/\.html$/,"")||"lesson";
 const threshold=()=>Number(window.LESSON_DATA?.mastery_threshold||80);
 const progressKey=()=>window.UNIT_MAP_FALLBACK?.unit?.progress_key||"khaemenes-algebra1-unit-progress-v2";
 const readProgress=()=>{try{return JSON.parse(localStorage.getItem(progressKey())||"{}")||{}}catch{return {}}};
 const writeProgress=p=>{try{localStorage.setItem(progressKey(),JSON.stringify(p));return true}catch{return false}};
 const ensureProgress=()=>{
   const p=readProgress(),id=lessonId();
   if(!p[MANUAL_KEY]||typeof p[MANUAL_KEY]!=="object")p[MANUAL_KEY]={};
   if(!p[MANUAL_KEY][id]||typeof p[MANUAL_KEY][id]!=="object")p[MANUAL_KEY][id]={};
   if(!p[QUICK_KEY]||typeof p[QUICK_KEY]!=="object")p[QUICK_KEY]={};
   if(!p[QUICK_KEY][id]||typeof p[QUICK_KEY][id]!=="object")p[QUICK_KEY][id]={};
   return p;
 };
 function headingText(section){
   const head=$(".section-head",section);
   const eyebrow=$(".eyebrow",head||section);
   const h2=$("h2",head||section);
   return (eyebrow?.textContent||h2?.textContent||"").trim();
 }
 function normalizeHead(section){
   const head=$(".section-head",section);
   if(!head)return;
   const eyebrow=$(":scope > .eyebrow",head);
   const h2=$(":scope > h2",head);
   if(eyebrow&&h2){
     const title=eyebrow.textContent.trim();
     const desc=h2.textContent.trim();
     const titleEl=document.createElement("h2");
     titleEl.textContent=title.replace(/\s*·\s*Not graded$/i,"").trim();
     titleEl.id=h2.id||eyebrow.id||"";
     const descEl=document.createElement("p");
     descEl.textContent=desc;
     eyebrow.replaceWith(titleEl);
     h2.replaceWith(descEl);
     head.classList.add("kme-section__head");
   }
 }
 function keyFor(section){
   const text=headingText(section).toLowerCase();
   if(/reading/.test(text))return "reading-room";
   if(/quick check/.test(text))return "quick-check";
   if(/worked example/.test(text))return "worked-examples";
   if(/pathway/.test(text))return "pathway-support";
   if(/vocab/.test(text))return "vocabulary-bridge";
   if(/global application|^application$/.test(text))return "global-application";
   if(/guided note/.test(text))return "guided-notes";
   if(/lesson practice|practice.*question/.test(text)||section.id==="practice")return "lesson-practice";
   if(/reflection/.test(text))return "reflection";
   if(/interactive|laboratory|explorer|lab/.test(text))return "interactive-lab";
   return "";
 }
 function labelFor(key,section){
   if(key==="interactive-lab"){
     const raw=headingText(section).replace(/^Interactive\s+/i,"").trim();
     return raw||"Interactive Lab";
   }
   return ITEMS.find(x=>x[0]===key)?.[1]||headingText(section)||key;
 }
 function collapseSection(section,key){
   if(!section||!key)return;
   if($("details.kme-lesson-accordion",section)) {
     const d=$("details.kme-lesson-accordion",section);
     d.dataset.checklistSection=key;
     return;
   }
   const wrap=$(":scope > .wrap",section);
   if(!wrap)return;
   normalizeHead(section);
   const head=$(".section-head",section);
   const details=document.createElement("details");
   details.className="kme-lesson-accordion";
   details.dataset.checklistSection=key;
   const summary=document.createElement("summary");
   summary.textContent=labelFor(key,section);
   const body=document.createElement("div");
   body.className="kme-accordion-body";
   if(head){
     const descriptor=$(":scope > p:not(.help-text)",head);
     const help=$(":scope > .help-text",head);
     const compact=document.createElement("header");
     compact.className="section-head";
     if(descriptor)compact.append(descriptor);
     if(help)compact.append(help);
     head.remove();
     if(compact.childNodes.length)body.append(compact);
   }
   while(wrap.firstChild)body.append(wrap.firstChild);
   details.append(summary,body);
   wrap.classList.add("kme-disclosure-wrap");
   wrap.append(details);
 }
 function normalizeOpening(){
   const section=$("#learn")||$(".lesson-layout")?.closest("section");
   if(!section)return;
   const wrap=$(":scope > .wrap",section)||$(".lesson-layout",section);
   const layout=$(".lesson-layout",section);
   if(!layout||$("details",section))return;
   const main=$(".lesson-main",layout),side=$(".lesson-side",layout);
   if(main){
     const d=document.createElement("details");d.className="kme-lesson-accordion";d.dataset.checklistSection="learning-goals-warmup";
     const s=document.createElement("summary");s.textContent="Learning Goals & Warm-up";
     const b=document.createElement("div");b.className="kme-accordion-body";b.append(main);
     d.append(s,b);layout.before(d);
   }
   if(side){
     const d=document.createElement("details");d.className="kme-lesson-accordion";d.dataset.checklistSection="lesson-record";
     const s=document.createElement("summary");s.textContent="Your Lesson Record";
     const b=document.createElement("div");b.className="kme-accordion-body";b.append(side);
     d.append(s,b);layout.before(d);
   }
   layout.remove();
   (wrap||section).classList.add("kme-opening-stack");
 }
 function stageKey(card){
   const eyebrow=(card.querySelector(".eyebrow")?.textContent||"").toLowerCase();
   const title=(card.querySelector("h2,h3")?.textContent||"").toLowerCase();
   const text=eyebrow+" "+title;
   if(/mystery/.test(text))return "mystery";
   if(/discover/.test(text))return "discover";
   if(/learn|objective/.test(text))return "learn";
   if(/experiment|laboratory/.test(text))return "interactive-lab";
   if(/challenge|wrong answer/.test(text))return "challenge";
   if(/defend|defense/.test(text))return "defend";
   if(/reflect|retrieve|lesson check/.test(text))return "lesson-practice";
   return "";
 }
 function normalizeStageCards(){
   const cards=$("#main article.card");
   if(!cards.length)return false;
   cards.forEach(card=>{
    const key=stageKey(card); if(!key||card.closest("details.kme-lesson-accordion"))return;
    const details=document.createElement("details");
    details.className="kme-lesson-accordion kme-algebra-stage";
    details.dataset.checklistSection=key;
    const summary=document.createElement("summary");
    const eyebrow=(card.querySelector(".eyebrow")?.textContent||"").replace(/^\s*\d+\s*·\s*/,"").trim();
    const title=(card.querySelector("h2,h3")?.textContent||"").trim();
    summary.textContent=eyebrow&&title?eyebrow+" · "+title:(title||eyebrow||labelFor(key,card));
    const body=document.createElement("div"); body.className="kme-accordion-body";
    card.replaceWith(details); body.append(card); details.append(summary,body);
   });
   return true;
 }
 function ensureStageCompletionCard(){
   if($("#lessonCompletion"))return;
   const stages=$("details.kme-algebra-stage");
   if(!stages.length)return;
   const last=stages[stages.length-1];
   const section=document.createElement("section");
   section.className="kme-section"; section.id="lessonCompletion";
   section.innerHTML='<div class="wrap"><article class="kme-completion-card"><header class="section-head"><h2>Lesson Completion Checklist</h2><p>Open every lesson stage, complete the written evidence, and reach at least '+threshold()+'% on Lesson Check before moving forward.</p></header><div id="lessonCompletionChecklist" class="kme-completion-list" aria-live="polite"></div><div class="kme-completion-status" id="lessonCompletionStatus" role="status"></div><nav class="lesson-nav" aria-label="Lesson navigation"></nav></article></div>';
   last.closest(".block,.section")?.after(section) || last.after(section);
 }
 function installFineTuneStyles(){
   if($("#khaemenesAlgebraFineTune"))return;
   const style=document.createElement("style"); style.id="khaemenesAlgebraFineTune";
   style.textContent=`
    html:root:root body{font-size:16px!important;line-height:1.68!important}
    html:root:root body :is(p,li,label,button,input,select,textarea,summary,.feedback,.notice){font-size:max(16px,1em)!important}
    #main{max-width:100%;overflow-x:clip}
    #main .wrap{width:min(calc(100% - 33px),1180px);margin-inline:auto}
    details.kme-algebra-stage{margin:14px auto;border-radius:7px;overflow:hidden}
    details.kme-algebra-stage>summary{min-height:55px;display:flex;align-items:center;padding:14px 18px;cursor:pointer}
    details.kme-algebra-stage .card{margin:0!important;border-radius:0!important;box-shadow:none!important}
    .question{display:grid!important;grid-template-columns:33px minmax(0,1fr);column-gap:11px;align-items:start}
    .question>strong{grid-column:1/-1;display:grid;grid-template-columns:33px minmax(0,1fr);gap:11px}
    .question>strong::first-letter{font-variant-numeric:tabular-nums}
    .question .option,.question .feedback{grid-column:2}
    .actions{display:flex;flex-wrap:wrap;gap:11px!important;align-items:center}
    .actions .btn,.actions button{margin:0!important}
    textarea{min-height:180px;padding:14px!important}
    #lessonCompletion{padding-top:24px;padding-bottom:55px}
    .kme-completion-item{gap:14px!important}
    @media(max-width:700px){#main .wrap{width:min(calc(100% - 24px),1180px)}.question{grid-template-columns:24px minmax(0,1fr)}}
   `;
   document.head.append(style);
 }
 function normalizeReset(){
   $$("strong,h2,h3").forEach(el=>{
     if(/33-second reset/i.test(el.textContent||"")){
       el.textContent="3-Minute Reset";
       const p=el.parentElement?.querySelector("p");
       if(p)p.textContent="Step away from the screen for three minutes. Rest your eyes, stretch your shoulders and hands, get a sip of water if you need one, then return ready to continue. This pause is part of the lesson—not lost time.";
     }
   });
 }
 function algebraLegacyScore(){
   const bodyLesson=Number(document.body?.dataset?.lesson||0);
   const unitMatch=location.pathname.match(/\/unit-(\d+)\//i);
   const unit=unitMatch?String(Number(unitMatch[1])).padStart(2,"0"):"";
   if(!bodyLesson||!unit)return null;
   const keys=[
    "khaemenes-algebra1-unit"+unit+"-a3-v1",
    "khaemenes-algebra1-unit"+unit+"-progress-v1",
    "khaemenes-algebra1-unit"+unit+"-progress-v2"
   ];
   for(const key of keys){
    try{
     const x=JSON.parse(localStorage.getItem(key)||"null");
     const raw=x?.best?.["lesson-"+bodyLesson] ?? x?.lessonScores?.["lesson-"+bodyLesson] ?? x?.lessonScores?.[lessonId()];
     if(Number.isFinite(Number(raw)))return Number(raw);
    }catch{}
   }
   return null;
 }
 function score(){
   const p=readProgress(),raw=p.lessonScores?.[lessonId()];
   if(Number.isFinite(Number(raw)))return Number(raw);
   return algebraLegacyScore();
 }
 function itemComplete(key,mode){
   const p=ensureProgress(),id=lessonId();
   if(mode==="reviewed")return Array.isArray(p.reviewedLessons)&&p.reviewedLessons.includes(id);
   if(mode==="notes")return Boolean((p.lessonNotes?.[id]||"").trim());
   if(mode==="reflection")return Boolean((p.reflections?.[id]||"").trim());
   if(mode==="evidence"){
     const d=document.querySelector('[data-checklist-section="'+CSS.escape(key)+'"]');
     const fields=d?[...d.querySelectorAll("textarea,input[type=text]")]:[];
     return fields.length>0&&fields.every(field=>String(field.value||"").trim().length>=3);
   }
   if(mode==="mastery")return Number(score())>=threshold();
   if(mode==="quick"){
     const total=window.LESSON_DATA?.quick_checks?.length||$$('[data-quick-check]').length;
     const q=p[QUICK_KEY][id]||{};
     return total>0&&Array.from({length:total},(_,i)=>q[i]===true).every(Boolean);
   }
   return p[MANUAL_KEY][id]?.[key]===true;
 }
 function existingKeys(){
   return $$("[data-checklist-section]").map(d=>d.dataset.checklistSection);
 }
 function checklistItems(){
   const keys=new Set(existingKeys());
   return ITEMS.filter(([key])=>keys.has(key));
 }
 function complete(){
   const items=checklistItems();
   return items.length>0&&items.every(([key,,mode])=>itemComplete(key,mode));
 }
 function setManual(key,value){
   const entry=ITEMS.find(x=>x[0]===key);
   if(!entry||entry[2]!=="manual")return;
   const p=ensureProgress(),id=lessonId();
   p[MANUAL_KEY][id][key]=Boolean(value);
   writeProgress(p);renderChecklist();gateNext();
 }
 function jump(key){
   const d=document.querySelector('[data-checklist-section="'+CSS.escape(key)+'"]');
   if(!d)return;
   if(d.tagName==="DETAILS")d.open=true;
   d.scrollIntoView({behavior:"smooth",block:"start"});
   setTimeout(()=>d.querySelector(":scope > summary")?.focus({preventScroll:true}),350);
 }
 function renderChecklist(){
   const target=$("#lessonCompletionChecklist");if(!target)return;
   const items=checklistItems();
   target.innerHTML=items.map(([key,label,mode])=>{
     const done=itemComplete(key,mode),auto=mode!=="manual";
     const actual=key==="interactive-lab"?(document.querySelector('[data-checklist-section="interactive-lab"] > summary')?.textContent||label):label;
     return '<div class="kme-completion-item'+(done?' is-complete':'')+'">'+
       '<input type="checkbox" data-checklist-key="'+key+'" '+(done?'checked ':'')+(auto?'disabled aria-readonly="true" ':'')+'>'+
       '<button type="button" class="kme-completion-jump" data-nav-section="'+key+'"><span class="kme-completion-copy">'+
       '<span class="kme-completion-label">'+actual+'</span>'+
       '<span class="kme-completion-note">'+(auto?'Completes automatically when its activity requirement is met.':'Check when you have reviewed this section.')+'</span>'+
       '</span></button></div>';
   }).join("");
   const done=items.filter(([k,,m])=>itemComplete(k,m)).length;
   const s=score(),ready=complete()&&Number(s)>=threshold();
   const status=$("#lessonCompletionStatus");
   if(status)status.textContent=done+" of "+items.length+" sections complete · Practice mastery: "+(s===null?"not scored":s+"%")+" · "+(ready?"Ready to move forward.":"Complete every box and reach "+threshold()+"% mastery to continue.");
 }
 function ensureCompletionCard(){
   if($("#lessonCompletion"))return;
   const reflection=document.querySelector('[data-checklist-section="reflection"]')?.closest("section");
   if(!reflection)return;
   const section=document.createElement("section");section.className="kme-section";section.id="lessonCompletion";
   section.innerHTML='<div class="wrap"><article class="kme-completion-card"><header class="section-head"><h2>Lesson Completion Checklist</h2><p>Complete every required section and reach at least '+threshold()+'% mastery before moving forward.</p></header><div id="lessonCompletionChecklist" class="kme-completion-list" aria-live="polite"></div><div class="kme-completion-status" id="lessonCompletionStatus" role="status"></div><nav class="lesson-nav" aria-label="Lesson navigation"></nav></article></div>';
   reflection.after(section);
   const nav=$(".lesson-nav",reflection);
   if(nav)$(".lesson-nav",section).replaceWith(nav);
 }
 function gateNext(){
   const next=$("#nextLesson");if(!next)return;
   const mastered=Number(score())>=threshold(),ready=mastered&&complete();
   const targetHref=next.dataset.targetHref||next.getAttribute("href")||"#";
   const targetTitle=next.dataset.targetTitle||"Next Lesson";
   if(!next.dataset.targetHref&&targetHref&&targetHref!=="#practice"&&targetHref!=="#lessonCompletion")next.dataset.targetHref=targetHref;
   next.dataset.locked=String(!ready);
   next.setAttribute("aria-disabled",String(!ready));
   if(ready){
     next.href=next.dataset.targetHref||targetHref;
     next.textContent="Next Lesson · "+targetTitle+" →";
     next.classList.remove("locked");next.classList.add("is-ready");
   }else{
     next.href="#lessonCompletion";
     next.textContent="Next Lesson · Locked until checklist + "+threshold()+"% mastery";
     next.classList.add("locked");next.classList.remove("is-ready");
   }
 }
 function observeQuickChecks(){
   document.addEventListener("click",event=>{
     const button=event.target.closest("[data-check]");
     if(!button)return;
     setTimeout(()=>{
       const i=Number(button.dataset.check);
       const f=$("#quick-feedback-"+i);if(!f)return;
       const correct=f.classList.contains("correct");
       const p=ensureProgress(),id=lessonId();p[QUICK_KEY][id][i]=correct;writeProgress(p);renderChecklist();gateNext();
     },0);
   });
 }
 function bind(){
   if(bound)return; bound=true;
   $("#lessonCompletionChecklist")?.addEventListener("change",e=>{const i=e.target.closest("[data-checklist-key]");if(i)setManual(i.dataset.checklistKey,i.checked)});
   $("#lessonCompletionChecklist")?.addEventListener("click",e=>{const b=e.target.closest("[data-nav-section]");if(b)jump(b.dataset.navSection)});
   document.addEventListener("click",e=>{
     if(e.target.closest("#saveNotes,#saveReflection,#markComplete,#submitPractice"))setTimeout(()=>{renderChecklist();gateNext()},20);
     const next=e.target.closest("#nextLesson");
     if(next&&next.dataset.locked==="true"){e.preventDefault();e.stopImmediatePropagation();$("#lessonCompletion")?.scrollIntoView({behavior:"smooth",block:"start"})}
   },true);
   document.addEventListener("change",e=>{
     if(e.target.closest("#questionList,#pathwaySelect,#vocabLanguage"))setTimeout(()=>{renderChecklist();gateNext()},20);
   });
   observeQuickChecks();
   window.addEventListener("storage",()=>{renderChecklist();gateNext()});
 }
 function normalize(){
   const main=$("#main")||$("main");if(main){main.classList.add("khaemenes-math-engine");main.dataset.khaemenesMathEngine=VERSION}
   installFineTuneStyles();
   const staged=normalizeStageCards();
   if(!staged){
    normalizeOpening();
    $("section").forEach(section=>{normalizeHead(section);const key=keyFor(section);if(key)collapseSection(section,key)});
   }
   normalizeReset();
   if(staged)ensureStageCompletionCard(); else ensureCompletionCard();
   renderChecklist();gateNext();bind();
   document.addEventListener("input",e=>{if(e.target.matches("textarea,input[type=text]"))setTimeout(()=>{renderChecklist();gateNext()},0)},{passive:true});
   document.documentElement.dataset.khaemenesMathEngineActive=VERSION;
 }
 function observeGeneratedLesson(){
   if(observing)return;
   const main=$("#main")||$("main"); if(!main)return;
   if(main.querySelector("article.card, section .wrap"))return;
   observing=true;
   const observer=new MutationObserver(()=>{
     if(!main.querySelector("article.card, section .wrap"))return;
     observer.disconnect(); observing=false;
     requestAnimationFrame(normalize);
   });
   observer.observe(main,{childList:true,subtree:true});
   setTimeout(()=>{observer.disconnect();observing=false},3000);
 }
 const api={version:VERSION,normalize,renderChecklist,gateNext};
 window.KhaemenesAlgebra1LessonV2=Object.freeze(api);
 const start=()=>{normalize();observeGeneratedLesson();setTimeout(normalize,120);setTimeout(normalize,500)};
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
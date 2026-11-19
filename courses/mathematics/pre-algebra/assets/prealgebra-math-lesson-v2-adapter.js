/* Khaemenes Academy · Pre-Algebra Mathematics Engine v2.2.1 adapter
 * Canonical course-wide lesson-shell normalizer.
 * Preserves lesson curriculum, specialized labs, question banks, learner-record keys and scoring.
 */
(()=>{"use strict";
 if(window.KhaemenesPreAlgebraLessonV2)return;
 const VERSION="2.2.1";
 const MANUAL_KEY="sectionChecks";
 const QUICK_KEY="quickChecks";
 const ITEMS=[
  ["learning-goals-warmup","Learning Goals & Warm-up","manual"],
  ["lesson-record","Your Lesson Record","reviewed"],
  ["reading-room","Reading Room","manual"],
  ["interactive-lab","Interactive Lab","manual"],
  ["quick-check","Quick Check","quick"],
  ["worked-examples","Worked Examples","manual"],
  ["pathway-support","Pathway Support","manual"],
  ["vocabulary-bridge","Vocabulary Bridge","manual"],
  ["global-application","Global Application","manual"],
  ["guided-notes","Guided Notes","notes"],
  ["lesson-practice","Lesson Practice","mastery"],
  ["reflection","Reflection","reflection"]
 ];
 const $=(s,r=document)=>r.querySelector(s);
 const $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const lessonId=()=>window.LESSON_DATA?.id||document.body?.dataset?.lessonId||location.pathname.split("/").pop()?.replace(/\.html$/,"")||"lesson";
 const threshold=()=>Number(window.LESSON_DATA?.mastery_threshold||80);
 const progressKey=()=>{
   if(window.UNIT_MAP_FALLBACK?.unit?.progress_key)return window.UNIT_MAP_FALLBACK.unit.progress_key;
   const unit=location.pathname.match(/\/unit-(\d+)\//i)?.[1];
   return unit?"khaemenes-prealgebra-unit"+String(Number(unit)).padStart(2,"0")+"-lesson-shell-v2":"khaemenes-prealgebra-unit-progress-v2";
 };
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
 function normalizeReset(){
   $$("strong,h2,h3").forEach(el=>{
     if(/33-second reset/i.test(el.textContent||"")){
       el.textContent="3-Minute Reset";
       const p=el.parentElement?.querySelector("p");
       if(p)p.textContent="Step away from the screen for three minutes. Rest your eyes, stretch your shoulders and hands, get a sip of water if you need one, then return ready to continue. This pause is part of the lesson—not lost time.";
     }
   });
 }
 function score(){
   const p=readProgress(),raw=p.lessonScores?.[lessonId()];
   return Number.isFinite(Number(raw))?Number(raw):null;
 }
 function itemComplete(key,mode){
   const p=ensureProgress(),id=lessonId();
   if(mode==="reviewed")return Array.isArray(p.reviewedLessons)&&p.reviewedLessons.includes(id);
   if(mode==="notes")return Boolean((p.lessonNotes?.[id]||"").trim());
   if(mode==="reflection")return Boolean((p.reflections?.[id]||"").trim());
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
   document.addEventListener("change",e=>{const i=e.target.closest("#lessonCompletionChecklist [data-checklist-key]");if(i)setManual(i.dataset.checklistKey,i.checked)});
   document.addEventListener("click",e=>{const b=e.target.closest("#lessonCompletionChecklist [data-nav-section]");if(b)jump(b.dataset.navSection)});
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
   normalizeOpening();
   $$("section").forEach(section=>{normalizeHead(section);const key=keyFor(section);if(key)collapseSection(section,key)});
   normalizeReset();
   ensureCompletionCard();
   renderChecklist();gateNext();bind();
   document.documentElement.dataset.khaemenesMathEngineActive=VERSION;
 }
 const api={version:VERSION,normalize,renderChecklist,gateNext};
 window.KhaemenesPreAlgebraLessonV2=Object.freeze(api);
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",normalize,{once:true});else normalize();
})();
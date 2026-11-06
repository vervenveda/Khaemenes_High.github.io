/* Grade 09 index.html blueprint runtime for Grade 10–12.
   Existing grade-specific course/pin and continuation authorities are reused.
   Idempotent DOM rendering; this script does not change registration or mastery.
*/
(()=>{"use strict";
if(window.KhaemenesUpperGrade09Blueprint)return;
const grade=String(document.body.dataset.grade||"");
const grade10Copy=grade==="10";
const grade11Copy=grade==="11";
const grade12Copy=grade==="12";
if(!["10","11","12"].includes(grade))return;
const catalog=window.KhaemenesHighEightClass,pins=window.KhaemenesHighCoursePins,
  profile=window.KhaemenesStudentProfileV2,continuation=window.KhaemenesLearningContinuation;
if(!catalog||!pins)return;
const highRoot="https://vervenveda.com/Khaemenes_High.github.io/";
// All upper grades now own their own Grade 09-style profile editor.
const builder=highRoot+"grades/grade-"+grade+"/student-profile/profile/";
const $=id=>document.getElementById(id);
const make=(tag,value)=>{const n=document.createElement(tag);if(value!==undefined)n.textContent=value;return n};
const nameNode=$("studentName"),metaNode=$("studentMeta"),avatar=$("avatar"),list=$("courseManagerGrid");
const schedule=document.querySelector("[data-grade09-schedule-bar]");
let tools=$("grade09BlueprintTools");
function mountProfileFirst(){
 const main=document.querySelector("main"),grid=main?.querySelector(".section .grid");
 const row=grid?.querySelector(".profile-row");
 const identityCard=row?.closest(".card");
 const todayCard=$("todayTitle")?.closest(".card");
 if(!main||!grid||!identityCard||!todayCard)return;
 let top=$("grade09ProfileFirst");
 if(!top){top=document.createElement("section");top.className="grade09-profile-first";top.id="grade09ProfileFirst";main.prepend(top)}
 if(identityCard.parentElement!==top)top.append(identityCard);
 // Same identity structure and selectors used by Grade 09 photo/detail modules.
 row.querySelector(".profile-name")?.parentElement?.classList.add("grade09-identity-details");
 row.querySelector("#avatar")?.classList.add("grade09-avatar-enhanced");
 // Grade 09 already retires this duplicate link in favor of the Profile Tools rail.
 row.querySelector(".grade09-profile-actions")?.remove();
 if(!tools){tools=document.createElement("section");tools.id="grade09BlueprintTools";const head=document.createElement("h2");head.textContent="My Profile Tools";tools.append(head)}
 if(tools.parentElement!==top)top.append(tools);
 if(todayCard.parentElement!==top)top.append(todayCard);
 // Grade 09 visual order: profile hero -> tools -> To Do Today -> Student Portfolio.
 // Reuse the original portfolio node, preserving its links and its own storage.
 const portfolio=main.querySelector('aside[aria-label="Student Learning Portfolio"]');
 if(portfolio&&portfolio.previousElementSibling!==top)top.insertAdjacentElement("afterend",portfolio);
 const scheduleSection=main.querySelector(".grade09-priority-schedule");
 const predecessor=portfolio||top;
 if(scheduleSection&&scheduleSection.previousElementSibling!==predecessor)
   predecessor.insertAdjacentElement("afterend",scheduleSection);
}
mountProfileFirst();
const langOptions=["spanish","french","german","mandarin","japanese","arabic","russian"];
const learner=()=>profile?.activeLearner?.()||null;
const identity=()=>learner()?.learnerId||pins.activeLearner?.()||null;
const gradeContext=()=>window.KhaemenesHighProfileGradeContext?.active?.()||null;
const readPins=()=>pins.readPins?.()||[];
const lang=()=>pins.readLanguageChoices?.()?.[grade]||"spanish";
const slots=()=>catalog.slots(Number(grade));
function href(item){
 if(item.subject==="foreignLanguage"){
  const language=lang(),params=new URLSearchParams({language,source:"khaemenes-high-grade"+grade});
  if(["arabic","russian"].includes(language))params.set("mode","atlas");
  else params.set("course","hs"+(Number(grade)-8));
  return "https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?"+params;
 }
 const candidate=item.href;
 return typeof candidate==="string"&&/^https:\/\//i.test(candidate)?candidate:null;
}
function snapshots(){const id=identity();return id&&continuation?.readLearner?.(id)||[]}
function step(item){
 const snap=snapshots().find(s=>s.courseId===item.id);
 const dest=href(item);
 return {dest:snap?.nextHref&&item.subject!=="foreignLanguage"?snap.nextHref:dest,
 label:snap?.stale?"Refresh course":snap?.status==="corrections"?"Review corrections":"Open class",
 detail:snap?.nextTitle||snap?.summary||"Ready to open the assigned course."};
}
function link(title,url,cls="btn secondary"){
 const a=make("a",title);a.className=cls;a.href=url;return a;
}
function appearance(id){try{const v=JSON.parse(localStorage.getItem("khaemenes.grade"+grade+".profile.appearance:"+encodeURIComponent(id))||"null");return v&&typeof v==="object"?v:null}catch{return null}}
function selectLearner(){
 const p=learner(),id=identity(),info=gradeContext();
 const wrong=grade==="10"?(!info||info.gradeNumber!==10):Boolean(info&&info.gradeNumber!==Number(grade));
 if(wrong){
  // A Grade 10 learner viewing Grade 11 must never inherit Grade 11
  // photo, details, class controls or local decoration merely by visiting.
  const row=avatar?.closest(".profile-row");
  const identityCard=row?.closest(".card");
  identityCard?.setAttribute("data-grade-mismatch","true");
  avatar.replaceChildren();
  avatar.textContent=info?String(info.gradeNumber):"10";
  avatar.setAttribute("aria-label",info?"Registered Grade "+info.gradeNumber:"Registered Grade 10 learner required");
  row?.querySelector("#grade09PhotoControls")?.remove();
  row?.querySelector("#grade09VisibleProfileDetails")?.remove();
  nameNode.textContent="This is the Grade "+grade+" profile";
  metaNode.textContent=info?"Your selected Academy learner is registered in Grade "+info.gradeNumber+". No Grade "+grade+" profile information or classes will be changed.":"No registered Grade "+grade+" learner is selected. Select your family learner to see private profile data; nothing is saved here.";
  let redirect=$("upperGradeProfileRedirect");
  if(!redirect){
   redirect=make("a",info?"Open My Registered Grade "+info.gradeNumber+" Profile":"Select My Registered Learner");
   redirect.id="upperGradeProfileRedirect";
   redirect.className="btn gold";
   redirect.style.cssText="display:inline-flex;align-items:center;justify-content:center;min-height:48px;margin-top:12px;padding:10px 16px;border-radius:7px;color:#243038;background:#ead6a4;text-decoration:none;font-size:16px";
   metaNode.insertAdjacentElement("afterend",redirect);
  }
  redirect.href=info?highRoot+"grades/grade-"+info.grade+"/student-profile/":"https://vervenveda.com/Khaemenes_Academy.github.io/family/";
  $("learningTodaySummary").textContent="This campus is for Grade "+grade+". Your registered learner's schedules, progress, and saved work remain unchanged.";
  $("learningTodayActions").replaceChildren(link(info?"Go to Grade "+info.grade:"Choose My Learner",redirect.href,"btn gold"));
  list.replaceChildren();schedule.replaceChildren();
  if(tools){
   if(grade==="11"||grade==="12"){
    // Keep the universal eight-button rail visible when visiting another grade.
    // All restricted actions navigate back to the registered student's campus.
    tools.hidden=false;
    renderTools();
   }else tools.hidden=true;
  }
  return false;
 }
 const wrongMarker=$("upperGradeProfileRedirect");
 if(wrongMarker)wrongMarker.remove();
 avatar?.closest(".card")?.removeAttribute("data-grade-mismatch");
 if(tools)tools.hidden=false;
 let savedProfile=null;
 if(id)try{
  const v=JSON.parse(localStorage.getItem("khaemenes-high-profile-v1:learner:"+encodeURIComponent(id))||"null");
  if(v&&typeof v==="object"&&(!v.learnerId||String(v.learnerId)===String(id))
    &&(!v.grade||Number(v.grade)===Number(grade)))savedProfile=v;
 }catch{}
 const name=savedProfile?.name||savedProfile?.displayName||p?.nickname||p?.displayName||p?.name||"Student";
 nameNode.textContent=name;
 metaNode.textContent="Grade "+grade+" · Local profile workspace";
 avatar.replaceChildren();
 const savedAppearance=id?appearance(id):null;
 // Shared background module owns page colors, uploaded images and stickers.
 let sharedPhoto=null;
 if(id)try{sharedPhoto=localStorage.getItem("khaemenes.grade09.profile.photo:"+encodeURIComponent(id))}catch{}
 const pic=(typeof sharedPhoto==="string"&&sharedPhoto.startsWith("data:image/jpeg;base64,")&&sharedPhoto.length<400000)
   ?sharedPhoto:(savedAppearance?.photo||null);
 let shape="circle",badge=null;
 if(id)try{
  const d=JSON.parse(localStorage.getItem("khaemenes-grade09-profile-design-v1:learner:"+encodeURIComponent(id))||"null");
  if(["circle","square","soft-square","rectangle","heart","star","octagon","hectagon"].includes(d?.avatarShape))shape=d.avatarShape;
  const b=localStorage.getItem("khaemenes.grade09.profile.badge:"+encodeURIComponent(id));
  if(b&&b.length<=3)badge=b;
 }catch{}
 const shapes={
  heart:"polygon(50% 95%,43% 88%,31% 76%,20% 64%,10% 51%,4% 39%,4% 25%,10% 13%,21% 7%,32% 7%,42% 13%,50% 24%,58% 13%,68% 7%,79% 7%,90% 13%,96% 25%,96% 39%,90% 51%,80% 64%,69% 76%,57% 88%)",
  star:"polygon(50% 2%,63% 34%,98% 36%,71% 58%,80% 94%,50% 75%,20% 94%,29% 58%,2% 36%,37% 34%)",
  octagon:"polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)"
 };
 avatar.style.setProperty("border-radius",shape==="circle"?"50%":shape==="soft-square"?"24%":"7px","important");
 avatar.style.setProperty("clip-path",shapes[shape]||"none");
 if(typeof pic==="string"&&pic.startsWith("data:image/jpeg;base64,")&&pic.length<400000){
  const img=make("img");img.src=pic;img.alt="Student portrait";
  img.style.cssText="width:100%;height:100%;object-fit:cover";
  avatar.append(img);
 }else avatar.textContent=badge||name.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase()||"S";
 return true;
}
function upperGradeDialog(id,title,renderContents){
 let dlg=$(id);
 if(!dlg){
  dlg=make("dialog");dlg.id=id;
  dlg.setAttribute("aria-label",title+" · Grade "+grade);
  dlg.style.cssText="box-sizing:border-box;width:min(94vw,820px);max-width:820px;max-height:90vh;overflow:auto;margin:auto;padding:18px;border:2px solid #b48b45;border-radius:7px;background:#fffaf0;color:#243038;box-shadow:0 18px 55px #0007";
  const top=make("div");
  top.style.cssText="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:15px";
  const h=make("h2",title+" · Grade "+grade);
  h.style.cssText="margin:0;color:#243038;font:400 25px/1.3 Cinzel,Georgia,serif";
  const close=make("button","Close");
  close.type="button";close.style.cssText="min-height:44px;padding:8px 16px;border:1px solid #243038;border-radius:7px;background:#243038;color:#fff8e9;font:400 16px Nunito,Arial,sans-serif";
  close.addEventListener("click",()=>dlg.close());
  top.append(h,close);
  const content=make("section");content.dataset.upperGradeDialogContent="true";
  content.style.cssText="display:grid;gap:12px";
  dlg.append(top,content);document.body.append(dlg);
  dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
 }
 renderContents(dlg.querySelector("[data-upper-grade-dialog-content]"));
 if(typeof dlg.showModal==="function"){
  if(!dlg.open)dlg.showModal();
  dlg.querySelector("button")?.focus();
 }else dlg.setAttribute("open","");
}
function showUpperProgress(){
 if(window.KhaemenesUpperGradeClassProgressDialog?.open){
  window.KhaemenesUpperGradeClassProgressDialog.open();return;
 }
 upperGradeDialog("upperGradeClassProgressDialog","Class Progress",content=>{
  content.replaceChildren();
  const registered=gradeContext();
  if(!registered||registered.gradeNumber!==Number(grade)){
   content.append(make("p",grade10Copy?"Choose your Grade 10 student profile to see your class progress.":grade11Copy?"Choose your Grade 11 student profile to continue your classes.":grade12Copy?"Choose your Grade 12 student profile to continue and finish your classes.":"Select your registered Grade "+grade+" learner to view class continuation."));return;
  }
  content.append(make("p",grade10Copy?"See where you left off in each class and choose what to continue next. Your official grades stay in your course records.":grade11Copy?"Review where you left off, decide what deserves your attention next, and keep your priorities clear.":grade12Copy?"Review what remains, choose what to finish next, and keep your final priorities clear as you close out senior year.":"Course continuation and pinned classes are displayed here; official grades and mastery remain in their course records."));
  const map=new Map(snapshots().map(entry=>[entry.courseId,entry]));
  for(const item of slots()){
   const card=make("article");
   card.style.cssText="padding:12px;border:1px solid #cbb99c;border-radius:7px;background:#fffdf8";
   const h=make("h3",item.title);h.style.cssText="margin:0 0 5px;font:400 19px Cinzel,Georgia,serif";
   const state=map.get(item.id);
   const detail=state?.summary||state?.nextTitle||(grade10Copy?(readPins().includes(item.id)?"Pinned · ready when you are":"Open this class to begin tracking your next step."):grade11Copy?(readPins().includes(item.id)?"Pinned · keep this priority within reach":"Open this class to set your next step."):(readPins().includes(item.id)?"Pinned · no continuation evidence yet":"No continuation evidence yet"));
   const p=make("p",detail);p.style.cssText="margin:5px 0;font-size:16px";
   card.append(h,p);content.append(card);
  }
 });
}
function showUpperSchedule(){
 upperGradeDialog("upperGradeScheduleDialog","My Schedule",content=>{
  // Grade 10 owns one live manager. Preserve it across repeated popup opens
  // rather than cloning controls or discarding listeners with replaceChildren.
  const manager=Number(grade)===10
    ?document.getElementById("manageClassesTitle")?.closest("section.card"):null;
  content.replaceChildren();
  const registered=gradeContext();
  if(!registered||registered.gradeNumber!==Number(grade)){
   content.append(make("p",grade10Copy?"Choose your Grade 10 student profile to see your schedule.":grade11Copy?"Choose your Grade 11 student profile to see your schedule.":grade12Copy?"Choose your Grade 12 student profile to see your schedule.":"Select your registered Grade "+grade+" learner to view your schedule."));return;
  }
  const intro=make("p",grade10Copy?"These are your Grade 10 classes. Open a class to continue learning, or use the class manager below to organize your schedule.":grade11Copy?"These are your Grade 11 classes. Use your schedule to keep priorities clear, continue active work, and stay aware of the classes that matter most for your goals.":grade12Copy?"These are your Grade 12 classes. Use your schedule to finish remaining work, keep priorities visible, and make sure nothing important gets lost in the final stretch.":"Your eight Grade "+grade+" subjects. Course choices remain managed by the grade-specific curriculum.");
  intro.style.cssText="font-size:16px";content.append(intro);
  const grid=make("div");grid.className="grade09-blueprint-schedule-grid";
  for(const item of slots()){
   const card=make("article");card.className="grade09-blueprint-schedule-item";
   card.append(make("strong",item.label),make("span",item.title));
   const route=href(item);
   if(route)card.append(link((grade10Copy||grade11Copy||grade12Copy)?"Continue Class":"Open class",route,"btn secondary"));
   grid.append(card);
  }
  content.append(grid);
  // Grade 10's original pinned-class and language-selection components retain
  // their source-of-truth listeners. The retired page card lives in this
  // dialog only, never as a second on-page panel.
  if(Number(grade)===10&&manager){
   manager.hidden=false;
   manager.removeAttribute("aria-hidden");
   manager.classList.remove("grade10-retired-manager-data");
   manager.classList.add("grade10-schedule-manager");
   content.append(manager);
  }
 });
}
function revealUpper(id){
 const target=$(id);
 if(!target)return;
 const details=target.closest("details");
 if(details)details.open=true;
 target.scrollIntoView({behavior:"smooth",block:"start"});
 target.setAttribute("tabindex","-1");
 try{target.focus({preventScroll:true})}catch{}
}
function renderTools(){
 if(!tools)return;
 // Share Grade 09's exact eight-button vocabulary and 4×2 order;
 // grade-specific continuation and schedule remain isolated.
 let head=tools.querySelector(":scope > h2");
 if(!head){head=make("h2","My Profile Tools");tools.prepend(head)}
 let wrapper=tools.querySelector("#khaeProfileToolRail");
 if(!wrapper){
  wrapper=make("nav");wrapper.id="khaeProfileToolRail";
  wrapper.setAttribute("aria-label","My Profile Tools");
  wrapper.append(make("div"));tools.append(wrapper);
 }
 const grid=wrapper.firstElementChild;
 grid.classList.add("grade09-blueprint-tool-grid");
 if(grid.querySelector("[data-upper-grade-link]"))return;
 const actions=[
  {label:"Edit Profile",url:builder},
  {label:"Class Progress",run:showUpperProgress},
  {label:"Schedule",run:showUpperSchedule},
  {label:"KlasaiPeer",run:()=>window.KhaemenesUpperGradeStudyStudio?.open?.(document.activeElement)},
  {label:"Yearbook",run:()=>window.KhaemenesUpperGradeYearbook?.open?.(document.activeElement)},
  {label:"Creative Tools",run:()=>revealUpper("grade09BlueprintRooms")},
  {label:"Student Portfolio",run:()=>{
   const area=document.querySelector('aside[aria-label="Student Learning Portfolio"]');
   if(area){area.scrollIntoView({behavior:"smooth",block:"start"});area.querySelector("a")?.focus({preventScroll:true})}
   else location.assign(highRoot+"portfolio/index.html");
  }}
 ];
 for(const action of actions){
  const item=make(action.url?"a":"button",action.label);
  item.className="grade09-blueprint-tool";item.dataset.upperGradeLink="true";
  if(action.url){
   item.href=action.url;
   if(action.preview){
    item.title="KlasaiPeer public design preview (not enrolled adoption or active chat)";
    item.setAttribute("aria-label","KlasaiPeer public design preview");
   }
  }else{
   item.type="button";
   item.addEventListener("click",()=>{
    // Progress is read-only. The dialog itself enforces registered-grade privacy
    // and renders an empty state for visitors enrolled in another grade.
    if(action.label==="Class Progress"||action.label==="KlasaiPeer"){action.run();return;}
    const ctx=gradeContext();
    if(!ctx||ctx.gradeNumber!==Number(grade)){
     if(ctx?.grade&&["11","12"].includes(grade)){
      location.assign(highRoot+"grades/grade-"+ctx.grade+"/student-profile/");
     }
     return;
    }
    action.run();
   });
  }
  grid.append(item);
 }
 // When a Grade 10 learner is visiting Grades 11 or 12, the private background
 // module intentionally does not mount. Preserve the 4×2 rail with a safe route
 // to the registered campus, never a second or unauthorized background editor.
 const ctx=gradeContext();
 if(["11","12"].includes(grade)&&ctx?.gradeNumber!==Number(grade)
    &&!grid.querySelector("#openGrade09BackgroundDialog,[data-background-return]")){
  const back=make("a","Customize Background");
  back.className="grade09-blueprint-tool";
  back.dataset.backgroundReturn="true";
  back.href=ctx?.grade?highRoot+"grades/grade-"+ctx.grade+"/student-profile/":builder;
  back.title="Open your registered student profile to customize its background";
  back.setAttribute("aria-label","Customize background in your registered student profile");
  grid.append(back);
 }
 // For a registered learner, Grade 09's original background-dialog module
 // creates the genuine eighth editor button. Do not duplicate it.
}

function renderSchedule(items){
 if(!schedule)return;schedule.replaceChildren();
 const grid=make("div");grid.className="grade09-blueprint-schedule-grid";
 const selected=new Set(readPins());
 for(const item of items){
  const card=make("article");card.className="grade09-blueprint-schedule-item";
  card.append(make("span",String(item.index).padStart(2,"0")),make("strong",item.label));
  const detail=make("small",item.title);card.append(detail);
  if(selected.has(item.id))card.append(make("span","★ Pinned"));
  const url=href(item);if(url&&identity())card.append(link("Open",url,"btn secondary"));
  grid.append(card);
 }
 schedule.append(grid);
}
function renderCourses(items){
 list.replaceChildren();
 const currentPins=new Set(readPins());
 const editable=!!identity()&&!!gradeContext()&&gradeContext().gradeNumber===Number(grade);
 for(const item of items){
  const card=make("article");card.className="lesson-card";
  const tag=make("div");tag.className="chip-row";
  const chip=make("span",item.label);chip.className="chip";tag.append(chip);
  const flag=make("span",currentPins.has(item.id)?"Pinned":"Available");flag.className="chip";tag.append(flag);
  card.append(tag,make("h3",item.title));
  const next=step(item);
  card.append(make("p",next.detail));
  const actions=make("div");actions.className="actions";
  if(item.id&&item.pinAvailable&&editable){
   const pin=make("button",currentPins.has(item.id)?"★ Pinned":"☆ Pin Class");
   pin.type="button";pin.className="btn secondary";pin.setAttribute("aria-pressed",String(currentPins.has(item.id)));
   pin.addEventListener("click",()=>{
    const old=readPins(),value=old.includes(item.id)?old.filter(x=>x!==item.id):[...old,item.id];
    $("grade09BlueprintStatus").textContent=pins.writePins(value)?"Class preferences saved.":"Could not save pins.";
    render();
   });actions.append(pin);
  }
  if(next.dest&&identity())actions.append(link(next.label,next.dest));
  else actions.append(make("p","Course route is being verified; no lesson is launched."));
  card.append(actions);list.append(card);
 }
}
function renderLanguage(){
 const dest=$("grade09BlueprintLanguage");if(!dest)return;
 dest.replaceChildren();
 const label=make("label","Foreign language selection: ");
 const select=make("select");select.setAttribute("aria-label","Foreign language for Grade "+grade);
 for(const opt of langOptions){const o=make("option",opt[0].toUpperCase()+opt.slice(1));o.value=opt;select.append(o)}
 select.value=lang();label.append(select);dest.append(label);
 select.addEventListener("change",()=>{
  if(!identity()||gradeContext()?.gradeNumber!==Number(grade)){ $("grade09BlueprintStatus").textContent="Select your registered learner before saving language choices.";render();return}
  const prev=pins.readLanguageChoices?.()||{};prev[grade]=select.value;
  const saved=pins.writeLanguageChoices?.(prev);
  $("grade09BlueprintStatus").textContent=saved?"Language preference saved for Grade "+grade+".":"Unable to save language.";
  render();
 });
}
function renderToday(items){
 const current=items.find(i=>i.id&&readPins().includes(i.id))||items[0];
 const next=step(current);
 $("learningTodaySummary").textContent=current.label+" · "+next.detail;
 const actions=$("learningTodayActions");actions.replaceChildren();
 if(next.dest&&identity())actions.append(link(next.label,next.dest,"btn gold"));
 actions.append(link("My Courses","#courseManagerGrid","btn secondary"));
 const other=$("learningTodayCourses");other.replaceChildren();
 for(const item of items.filter(i=>i!==current).slice(0,3)){
  const c=make("div");c.className="lesson-card";c.append(make("h3",item.label));
  const url=href(item);if(url&&identity())c.append(link("Open "+item.title,url,"btn secondary"));
  other.append(c);
 }
}
function render(){
 if(!selectLearner())return;
 const items=slots();
 renderTools();renderSchedule(items);renderCourses(items);renderLanguage();renderToday(items);
 $("todayFocus").textContent="Eight Grade "+grade+" subjects, daily routines, and course-owned learning checkpoints.";
}
// Event subscriptions are installed once by this script guard; render is repeat-safe.
window.addEventListener("pageshow",render);
window.addEventListener("khaemenes-family-changed",render);
window.addEventListener("khaemenes-learning-continuation-changed",render);
window.addEventListener("khaemenes-course-pins-changed",render);
window.addEventListener("khaemenes-high-profile-appearance-changed",render);
window.addEventListener("storage",e=>{if(!e.key||/khaemenes.*(profile|pin|language|continuation|learner)/.test(e.key))render()});
render();
window.KhaemenesUpperGrade09Blueprint=Object.freeze({render,version:"1.0.2"});
})();
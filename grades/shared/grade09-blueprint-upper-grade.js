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
 if(grade10Copy){
  let pinned=$("grade10PinnedClasses");
  if(!pinned){
   pinned=make("section");pinned.id="grade10PinnedClasses";pinned.className="grade09-pinned-classes";
   pinned.setAttribute("aria-labelledby","grade10PinnedClassesTitle");
   const h=make("h2","My Pinned Classes");h.id="grade10PinnedClassesTitle";
   const p=make("p","Open the exact lesson or required step you are working on. Pin or unpin classes from Schedule at any time.");
   const grid=make("div");grid.className="grade09-pinned-class-grid";grid.dataset.grade10PinnedClassGrid="true";
   pinned.append(h,p,grid);
  }
  if(pinned.parentElement!==top)top.append(pinned);
 }
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
const grade10MathPath=()=>{
 if(!grade10Copy)return null;
 const records=snapshots();
 if(records.some(s=>s?.courseId==="geometry"))return "geometry";
 if(records.some(s=>s?.courseId==="algebra-1"))return "algebra-1";
 return null;
};
const slots=()=>catalog.slots(Number(grade),grade10Copy?{mathId:grade10MathPath()}:{});
function href(item){
 if(item.subject==="foreignLanguage"){
  const language=lang(),returnTo=highRoot+"grades/grade-"+grade+"/student-profile/",params=new URLSearchParams({language,source:"khaemenes-high-grade"+grade,return:returnTo});
  if(["arabic","russian"].includes(language))params.set("mode","atlas");
  else params.set("course","hs"+(Number(grade)-8));
  return "https://vervenveda.com/Khaemenes_Linguistics.github.io/Halls/index.html?"+params;
 }
 const candidate=item.href;
 return typeof candidate==="string"&&/^https:\/\//i.test(candidate)?candidate:null;
}
function snapshots(){const id=identity();return id&&continuation?.readLearner?.(id)||[]}
function step(item){
 // Upper English's historical record authority publishes ela10/ela11/ela12.
 // Class cards use english-10/11/12. Match both without migrating records.
 const englishRecordId={"english-10":"ela10","english-11":"ela11","english-12":"ela12"}[item.id];
 const snap=snapshots().find(s=>s.courseId===item.id)||
  (englishRecordId?snapshots().find(s=>s.courseId===englishRecordId):null);
 const courseHome=href(item),first=item.firstStepHref||courseHome;
 const clean=url=>{try{const u=new URL(url,location.href);return u.origin+u.pathname.replace(/\/+$/,"/")}catch{return String(url||"").replace(/[?#].*$/,"").replace(/\/+$/,"/")}};
 const snapshotHref=snap?.nextHref&&item.subject!=="foreignLanguage"?snap.nextHref:null;
 // Math continuation is course-specific. Do not let an old or wrongly scoped
 // snapshot send a learner into another math course (or an external origin).
 // This only validates navigation; it cannot award progress or mastery.
 const mathCourse=/^(pre-algebra|algebra-1|geometry|algebra-2)$/.test(item.id||"");
 const englishCourse=/^english-(?:10|11|12)$/.test(item.id||"");
 const scienceCourse=/^(biology-10|chemistry-11|physics-engineering-12)$/.test(item.id||"");
 const socialCourse=/^social-studies-(10|11|12)$/.test(item.id||"");
 const lessonCourse=mathCourse||englishCourse||scienceCourse||socialCourse;
 const approvedSnapshot=(()=>{
  if(!snapshotHref||!lessonCourse)return snapshotHref;
  try{
   const target=new URL(snapshotHref,location.href),home=new URL(courseHome,location.href);
   const coursePath=home.pathname.endsWith("/")?home.pathname:home.pathname+"/";
   return target.origin===home.origin&&target.pathname.startsWith(coursePath)?snapshotHref:null;
  }catch{return null}
 })();
 const snapshotIsLanding=Boolean(approvedSnapshot&&courseHome&&clean(approvedSnapshot)===clean(courseHome));
 // A damaged saved English record requires its original recovery interface;
 // never silently bypass it by launching a new lesson.
 let destination=(englishCourse||scienceCourse||socialCourse)&&snap?.status==="paused"
  ?courseHome
  :approvedSnapshot&&!snapshotIsLanding?approvedSnapshot:first;
 // Upper English publishes a Week URL when the precise day is not recorded.
 // Student-facing Class doors enter that week's native first lesson instead
 // of a week overview or public course landing. The course owns day mastery.
 if(englishCourse&&destination){
  try{
   const target=new URL(destination,location.href);
   const week=target.pathname.match(/\/weeks\/week-(\d{2})\/?$/);
   if(week){
    // Weekly mastery and correction tasks must keep their quiz destination.
    // Otherwise Week 01 has dedicated first-day files; later weeks teach
    // inside existing weekly pages via the Monday instructional anchor.
    const needQuiz=snap?.status==="mastery"||snap?.status==="corrections";
    const leaf=item.id==="english-10"?"monday/":"lessons/day-01.html";
    destination=needQuiz
     ?target.href.replace(/#.*$/,"")+"#quiz"
     :week[1]==="01"
      ?new URL("weeks/week-01/"+leaf,courseHome).href
      :target.href.replace(/#.*$/,"")+"#monday";
   }
  }catch{}
 }
 // Science weekly planner links are summaries, not the daily laboratory or
 // instruction. Use each native Week NN Day 01 lesson unless the course
 // explicitly requests its assessment/recovery surface.
 if(scienceCourse&&destination&&snap?.status!=="paused"){
  try{
   const target=new URL(destination,location.href);
   const week=target.pathname.match(/\/weeks\/week-(\d{2})\/?$/);
   if(week&&snap?.status!=="mastery"&&snap?.status!=="corrections"){
    destination=new URL("weeks/week-"+week[1]+"/lessons/day-01.html",courseHome).href;
   }
  }catch{}
 }
 // Social Studies uses weekly student packets as the actual instructional
 // workspace; never send a student to a separate public course home.
 if(socialCourse&&destination&&snap?.status!=="paused"){
  try{
   const target=new URL(destination,location.href);
   const week=target.pathname.match(/\/weeks\/week-(\d{2})\/?$/);
   if(week&&snap?.status!=="mastery"&&snap?.status!=="corrections")
    destination=new URL("weeks/week-"+week[1]+"/student-packet.html",courseHome).href;
  }catch{}
 }
 return {dest:destination,
 label:snap?.status==="paused"?"Recover Course Record":snap?.stale?"Refresh course":snap?.status==="corrections"?"Review corrections":"Open class",
 detail:snapshotIsLanding?"Open the first required lesson or readiness step.":snap?.nextTitle||snap?.summary||"Ready to open the assigned course."};
}
// One read-only destination authority for Schedule, pinned classes, and
// Daily Focus. No second learner or lesson progression engine is created.
window.KhaemenesUpperGradeClassRoute=Object.freeze({resolve:item=>step(item).dest});
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
 const opener=document.activeElement;
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
  dlg.addEventListener("close",()=>{if(grade==="11"&&dlg._khaeOpener?.isConnected)dlg._khaeOpener.focus({preventScroll:true})});
 }
 if(grade==="11")dlg._khaeOpener=opener;
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
// Schedule popup is a read-only view over the existing live class manager.
// Profile editing, background editing, learner identity, grades, mastery and
// persistence remain owned by their existing modules.
function restoreScheduleManager(){
 const manager=document.querySelector("#upperGradeScheduleDialog .upper-grade-schedule-manager");
 const home=manager?._khaeScheduleHome;
 if(manager&&home?.isConnected){
  home.parentNode.insertBefore(manager,home);
  manager.hidden=manager._khaeScheduleWasHidden===true;
  if(manager._khaeScheduleWasAriaHidden===null)manager.removeAttribute("aria-hidden");
  else manager.setAttribute("aria-hidden",manager._khaeScheduleWasAriaHidden);
  manager.classList.remove("upper-grade-schedule-manager","grade10-schedule-manager");
 }
}
function showUpperSchedule(){
 upperGradeDialog("upperGradeScheduleDialog","My Schedule",content=>{
  content.replaceChildren();
  const registered=gradeContext();
  if(!registered||registered.gradeNumber!==Number(grade)){
   content.append(make("p",grade10Copy?"Choose your Grade 10 student profile to see your schedule.":grade11Copy?"Choose your Grade 11 student profile to see your schedule.":grade12Copy?"Choose your Grade 12 student profile to see your schedule.":"Select your registered Grade "+grade+" learner to view your schedule."));
   return;
  }
  const dlg=document.getElementById("upperGradeScheduleDialog");
  if(dlg){
   dlg.style.width="min(96vw,1180px)";
   dlg.style.maxWidth="1180px";
   dlg.style.height="min(90dvh,900px)";
   dlg.style.maxHeight="90dvh";
   dlg.style.overflowY="auto";
   dlg.style.overflowX="hidden";
   dlg.style.overscrollBehavior="contain";
  }
  const intro=make("p",grade10Copy?"These are your Grade 10 classes. Open a class to continue learning, or use the class manager below to organize your schedule.":grade11Copy?"These are your Grade 11 classes. Keep priorities clear and continue the work that matters most.":grade12Copy?"These are your Grade 12 classes. Keep remaining work visible as you finish senior year.":"Your eight Grade "+grade+" subjects.");
  intro.style.cssText="font-size:16px";content.append(intro);
  const grid=make("div");grid.className="grade09-blueprint-schedule-grid";
  for(const item of slots()){
   const card=make("article");card.className="grade09-blueprint-schedule-item";
   card.append(make("strong",item.label),make("span",item.title));
   const current=step(item),route=current?.dest||null;
   const resourceDoor=!!(route&&href(item)&&route===href(item));
   if(route){
    const launch=link(resourceDoor?"Course Options":"Class",route,"btn secondary");
    launch.dataset.courseId=item.id||"";
    launch.title=current?.detail||"Continue this class";
    card.append(launch);
   }else card.append(make("span","Choose a course or finish route verification before opening this class."));
   grid.append(card);
  }
  content.append(grid);
  const manager=document.getElementById("manageClassesTitle")?.closest("section.card")||null;
  restoreScheduleManager();
  if(manager){
   if(!manager._khaeScheduleHome){
    const placeholder=document.createComment("Schedule class-manager original owner");
    manager.parentNode.insertBefore(placeholder,manager);
    manager._khaeScheduleHome=placeholder;
    manager._khaeScheduleWasHidden=manager.hidden;
    manager._khaeScheduleWasAriaHidden=manager.getAttribute("aria-hidden");
   }
   manager.hidden=false;
   manager.removeAttribute("aria-hidden");
   manager.classList.remove("grade10-retired-manager-data");
   manager.classList.add("grade10-schedule-manager","upper-grade-schedule-manager");
   content.append(manager);
  }
 });
 const dlg=document.getElementById("upperGradeScheduleDialog");
 if(dlg&&!dlg.dataset.scheduleRestoreBound){
  dlg.dataset.scheduleRestoreBound="true";
  dlg.addEventListener("close",restoreScheduleManager);
 }
}
const openConnectedUpperResource=url=>{try{return !!window.open(url,"_blank","noopener,noreferrer")}catch{return false}};
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
  {label:"Edit Background",run:()=>{
    const popup=document.getElementById("grade09BackgroundDialog");
    if(popup&&typeof popup.showModal==="function"){if(!popup.open)popup.showModal();return true}
    return false;
   }},
  {label:"Student Progress",run:showUpperProgress},
  {label:"Schedule",run:showUpperSchedule},
  {label:"KlasaiPeer",fallback:"https://vervenveda.com/Klasaipeer.github.io/",run:()=>{const studio=window.KhaemenesUpperGradeStudyStudio;if(studio?.open){studio.open(document.activeElement);return true}return false}},
  {label:"Yearbook",fallback:"https://vervenveda.com/Academy-Yearbook.github.io/",run:()=>{const yearbook=window.KhaemenesUpperGradeYearbook;if(yearbook?.open){yearbook.open(document.activeElement);return true}return false}},
  {label:"Creative Tools",run:()=>revealUpper("grade09BlueprintRooms")},
  {label:"Student Portfolio",url:highRoot+"portfolio/index.html?grade="+grade}
 ];
 // One 4 × 2 vocabulary for all high-school grades; preserve each action handler.
 const order=["Schedule","Student Progress","Student Portfolio","KlasaiPeer","Edit Profile","Edit Background","Yearbook","Creative Tools"];
 actions.sort((a,b)=>order.indexOf(a.label)-order.indexOf(b.label));
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
    // Progress is read-only. The dialog itself enforces registered-grade privacy.
    if(action.label==="Student Progress"){action.run();return;}
    const ctx=gradeContext();
    if(action.label!=="KlasaiPeer"&&(!ctx||ctx.gradeNumber!==Number(grade))){
     if(ctx?.grade&&["11","12"].includes(grade)){
      location.assign(highRoot+"grades/grade-"+ctx.grade+"/student-profile/");
     }
     return;
    }
    const handled=action.run?.();
    if(handled===false&&action.fallback){
     if(grade10Copy)openConnectedUpperResource(action.fallback);
     else location.assign(action.fallback);
    }
   });
  }
  grid.append(item);
 }
 // Existing Edit Background action routes mismatched learners back to their registered profile.
 // Never insert a ninth duplicate Edit Background toolbar control.
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
  const url=step(item).dest;if(url&&identity())card.append(link("Open",url,"btn secondary"));
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
  if(next.dest&&identity())actions.append(link(grade10Copy?"Class":next.label,next.dest));
  else actions.append(make("p","Course route is being verified; no lesson is launched."));
  card.append(actions);list.append(card);
 }
}
function renderPinnedClasses(items){
 if(!grade10Copy)return;
 const host=document.querySelector("[data-grade10-pinned-class-grid]");
 if(!host)return;
 host.replaceChildren();
 const selected=new Set(readPins());
 const pinned=items.filter(item=>item.id&&selected.has(item.id));
 if(!pinned.length){
  const empty=make("p","No classes are pinned yet. Open Schedule and choose Pin Class on the courses you want here.");
  empty.className="grade09-pinned-empty";host.append(empty);return;
 }
 for(const item of pinned){
  const current=step(item);
  const card=make("article");card.className="grade09-pinned-class-card";
  const subject=make("span",item.label);subject.className="grade09-pinned-class-subject";
  const title=make("h3",item.title);
  const detail=make("p",current.detail||"Your next class step is ready.");
  const actions=make("div");actions.className="grade09-pinned-class-actions";
  if(current.dest&&identity()){
   const open=link("Class",current.dest,"grade09-pinned-class-open");
   open.title=current.detail||"Open the current required lesson or class step";
   open.setAttribute("aria-label","Open "+item.title+" at the current required lesson or step");
   actions.append(open);
  }
  const unpin=make("button","Unpin");unpin.type="button";unpin.className="grade09-pinned-class-unpin";
  unpin.setAttribute("aria-label","Unpin "+item.title+" from My Profile");
  unpin.addEventListener("click",()=>{
   const old=readPins(),next=old.filter(x=>x!==item.id);
   if(pins.writePins(next)){window.dispatchEvent(new CustomEvent("khaemenes-course-pins-changed"));render()}
  });
  actions.append(unpin);card.append(subject,title,detail,actions);host.append(card);
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
  const url=step(item).dest;if(url&&identity())c.append(link("Open "+item.title,url,"btn secondary"));
  other.append(c);
 }
}
function render(){
 if(!selectLearner())return;
 const items=slots();
 renderTools();renderSchedule(items);renderCourses(items);renderPinnedClasses(items);renderLanguage();renderToday(items);
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

function khaeCanonicalProfileShell(){
 if(document.body?.dataset.khaeCanonicalProfileShell==="1")return;
 document.body.dataset.khaeCanonicalProfileShell="1";
 const grade=String(document.body.dataset.grade||"09").padStart(2,"0");
 const hero=document.querySelector(".grade09-local-masthead .hero");
 if(hero){
   const eyebrow=hero.querySelector(".eyebrow");
   const h1=hero.querySelector("h1");
   const p=hero.querySelector("p:not(.eyebrow)");
   if(eyebrow)eyebrow.textContent="Khaemenes Academy · Grade "+grade;
   if(h1)h1.textContent="My Profile";
   if(p)p.textContent="Your personal High School profile space for identity, progress, learning tools, portfolio work, and the parts of your school experience you choose to share.";
   hero.style.setProperty("padding","55px 24px","important");
   hero.style.setProperty("text-align","center","important");
 }
 if(!document.getElementById("khaeCanonicalProfileShellStyle")){
  const style=document.createElement("style");
  style.id="khaeCanonicalProfileShellStyle";
  style.textContent=`
   html:root:root body #khaeProfileToolRail>div,
   html:root:root body .grade09-blueprint-tool-grid{
    display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;
    gap:11px!important;align-items:stretch!important
   }
   html:root:root body #khaeProfileToolRail :is(.grade09-profile-tool,.grade09-blueprint-tool){
    min-width:0!important;min-height:55px!important;border-radius:7px!important;
    background:#243038!important;background-image:none!important;
    color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important;
    font-size:16px!important;font-weight:400!important;text-align:center!important
   }
   html:root:root body[data-grade="10"] #grade10PinnedClasses{
    box-sizing:border-box;width:100%!important;max-width:1100px!important;margin:0 auto 14px!important;
    padding:16px!important;border:1px solid #b48b45!important;border-radius:7px!important;
    background:#fffaf0!important;color:#243038!important
   }
   html:root:root body[data-grade="10"] #grade10PinnedClasses>h2{
    margin:0 0 7px!important;text-align:center!important;font:400 24px/1.3 Cinzel,Georgia,serif!important
   }
   html:root:root body[data-grade="10"] #grade10PinnedClasses>p{margin:0 auto 14px!important;text-align:center!important;max-width:760px}
   html:root:root body[data-grade="10"] .grade09-pinned-class-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:11px!important}
   html:root:root body[data-grade="10"] .grade09-pinned-class-card{box-sizing:border-box;display:flex;flex-direction:column;min-width:0;padding:14px;border:1px solid #c8b997;border-radius:7px;background:#fffdf8}
   html:root:root body[data-grade="10"] .grade09-pinned-class-subject{font-size:14px!important;letter-spacing:.08em;text-transform:uppercase;color:#685738}
   html:root:root body[data-grade="10"] .grade09-pinned-class-card h3{margin:6px 0 8px;font:400 18px/1.35 Cinzel,Georgia,serif}
   html:root:root body[data-grade="10"] .grade09-pinned-class-card p{margin:0 0 12px;font-size:16px!important;line-height:1.45}
   html:root:root body[data-grade="10"] .grade09-pinned-class-actions{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;margin-top:auto}
   html:root:root body[data-grade="10"] .grade09-pinned-class-actions :is(a,button){
    box-sizing:border-box;display:flex;align-items:center;justify-content:center;min-height:46px;padding:8px 11px;
    border:1px solid #b48b45;border-radius:7px;background:#243038;color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important;
    text-decoration:none;font:400 16px/1.25 "Brandon Grotesque",Nunito,Arial,sans-serif;cursor:pointer
   }
   html:root:root body[data-grade="10"] .grade09-pinned-class-unpin{background:#fffaf0!important;color:#243038!important;-webkit-text-fill-color:#243038!important}
   html:root:root body[data-grade="10"] #vnvClassToolsToolbar{
    width:max-content!important;min-width:0!important;max-width:calc(100vw - 24px)!important
   }
   @media(max-width:900px){html:root:root body[data-grade="10"] .grade09-pinned-class-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
   @media(max-width:520px){html:root:root body[data-grade="10"] .grade09-pinned-class-grid{grid-template-columns:1fr!important}}
   html:root:root body details.khae-profile-accordion{
    box-sizing:border-box;width:min(calc(100% - 33px),1100px)!important;
    max-width:1100px!important;margin:14px auto!important;border:1px solid #b48b45!important;
    border-radius:7px!important;background:#fffaf0!important;overflow:hidden!important;
    grid-column:1/-1!important
   }
   html:root:root body details.khae-profile-accordion>summary{
    box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;
    min-height:55px;padding:14px 18px;cursor:pointer;list-style:none;
    background:#243038!important;background-image:none!important;
    color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important;
    border:0!important;font:400 20px/1.3 Cinzel,Georgia,serif!important
   }
   html:root:root body details.khae-profile-accordion>summary::-webkit-details-marker{display:none}
   html:root:root body details.khae-profile-accordion>summary::after{content:"+";font:400 24px/1 Cinzel,Georgia,serif}
   html:root:root body details.khae-profile-accordion[open]>summary::after{content:"−"}
   html:root:root body details.khae-profile-accordion>.khae-profile-accordion-body{
    padding:18px;background:#fffaf0;color:#243038
   }
   html:root:root body footer{box-sizing:border-box!important;width:100%!important;text-align:center!important;
    align-items:center!important;justify-content:center!important;margin-inline:auto!important}
   @media(max-width:820px){
    html:root:root body #khaeProfileToolRail>div,
    html:root:root body .grade09-blueprint-tool-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
   }
   @media(max-width:520px){
    html:root:root body #khaeProfileToolRail>div,
    html:root:root body .grade09-blueprint-tool-grid{grid-template-columns:1fr!important}
   }`;
  document.head.append(style);
 }
 const identity=document.querySelector(".grade09-profile-first .profile-row")?.closest(".card");
 const rail=document.getElementById("khaeProfileToolRail");
 const titleFor=node=>{
   const heading=node.querySelector?.("h2,h3,h4,strong[id]");
   if(heading?.textContent.trim())return heading.textContent.trim();
   return node.getAttribute?.("aria-label")||node.id?.replace(/([a-z])([A-Z])/g,"$1 $2")||"Student Section";
 };
 const wrap=node=>{
   if(!node||!node.isConnected||node===identity||node===rail||node.closest("dialog")||node.closest("details.khae-profile-accordion"))return;
   if(node.closest("#khaeProfileToolRail"))return;
   const details=document.createElement("details");
   details.className="khae-profile-accordion";
   details.open=false;
   const summary=document.createElement("summary");
   summary.textContent=titleFor(node);
   const body=document.createElement("div");
   body.className="khae-profile-accordion-body";
   node.parentNode.insertBefore(details,node);
   body.append(node);details.append(summary,body);
 };
 const top=document.getElementById("grade09ProfileFirst");
 if(top){
   for(const child of [...top.children]){
    // Only the public identity/photo hero and Profile Tools rail remain exposed.
    // Daily To Do and every other lower profile surface are accordions.
    if(child===identity||child===rail||(grade10Copy&&child.id==="grade10PinnedClasses"))continue;
    if(child.id==="grade09BlueprintTools"&&child.querySelector("#khaeProfileToolRail")){
      for(const nested of [...child.children]){
        if(nested===rail||nested.contains?.(rail))continue;
        wrap(nested);
      }
      continue;
    }
    wrap(child);
   }
 }
 const main=document.querySelector("main");
 if(main){
  // Collapse each actual content card independently; keep the structural grid
  // itself open so one disclosure never expands an entire page of content.
  for(const node of [...main.querySelectorAll(".section .grid > .card")])wrap(node);
  for(const child of [...main.children]){
   if(child===top||child.matches?.("script,style"))continue;
   if(child.matches?.(".section")&&child.querySelector(".grid"))continue;
   wrap(child);
  }
 }
 for(const d of document.querySelectorAll("details.khae-profile-accordion"))d.open=false;
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(khaeCanonicalProfileShell,0),{once:true});
else setTimeout(khaeCanonicalProfileShell,0);
window.addEventListener("load",()=>setTimeout(khaeCanonicalProfileShell,0),{once:true});

})();
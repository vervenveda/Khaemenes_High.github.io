/* Grade 09 index.html blueprint runtime for Grade 10–12.
   Existing grade-specific course/pin and continuation authorities are reused.
   Idempotent DOM rendering; this script does not change registration or mastery.
*/
(()=>{"use strict";
if(window.KhaemenesUpperGrade09Blueprint)return;
const grade=String(document.body.dataset.grade||"");
if(!["10","11","12"].includes(grade))return;
const catalog=window.KhaemenesHighEightClass,pins=window.KhaemenesHighCoursePins,
  profile=window.KhaemenesStudentProfileV2,continuation=window.KhaemenesLearningContinuation;
if(!catalog||!pins)return;
const highRoot="https://vervenveda.com/Khaemenes_High.github.io/";
const builder="https://vervenveda.com/Khaemenes_High.github.io/grades/grade-09/student-profile/profile/";
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
 if(!tools){tools=document.createElement("section");tools.id="grade09BlueprintTools";const head=document.createElement("h2");head.textContent="My Profile Tools";tools.append(head)}
 if(tools.parentElement!==top)top.append(tools);
 if(todayCard.parentElement!==top)top.append(todayCard);
 const scheduleSection=main.querySelector(".grade09-priority-schedule");
 if(scheduleSection&&scheduleSection.previousElementSibling!==top)top.insertAdjacentElement("afterend",scheduleSection);
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
 const wrong=info&&info.gradeNumber!==Number(grade);
 if(wrong){
  nameNode.textContent="Grade "+info.gradeNumber+" learner";
  metaNode.textContent="This is the Grade "+grade+" campus. Open your registered profile to continue.";
  $("learningTodaySummary").textContent="Your existing grades and course records remain unchanged.";
  $("learningTodayActions").replaceChildren(link("Open My Registered Grade",highRoot+"grades/grade-"+info.grade+"/student-profile/","btn gold"));
  list.replaceChildren();schedule.replaceChildren();tools.replaceChildren();
  return false;
 }
 const name=p?.nickname||p?.displayName||p?.name||"Student";
 nameNode.textContent=name;
 metaNode.textContent="Grade "+grade+" · Local profile workspace";
 avatar.replaceChildren();
 const savedAppearance=id?appearance(id):null;
 const savedBackground=savedAppearance?.background;
 if(typeof savedBackground==="string"&&/^#[0-9a-fA-F]{6}$/.test(savedBackground)){
  document.body.style.setProperty("background-color",savedBackground,"important");
  document.documentElement.style.setProperty("--paper",savedBackground);
 }else{
  document.body.style.removeProperty("background-color");
  document.documentElement.style.removeProperty("--paper");
 }
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
 }else avatar.textContent=badge||name[0]?.toUpperCase()||"S";
 return true;
}
function renderTools(){
 if(!tools)return;
 tools.replaceChildren();
 const heading=make("h2","My Profile Tools");tools.append(heading);
 const buttons=[
  ["Edit Profile",builder],["Class Progress","#courseManagerGrid"],
  ["Schedule","#grade09BlueprintSchedule"],["My Grade Campus",highRoot+"grades/grade-"+grade+"/"],
  ["Academy Tour","https://vervenveda.com/Khaemenes_Academy.github.io/tour/"],
  ["Creative Tools","#grade09BlueprintRooms"],["Student Portfolio",highRoot+"portfolio/index.html"],
  ["Customize Background",builder]
 ];
 const rail=make("nav");rail.className="grade09-blueprint-tool-grid";
 rail.setAttribute("aria-label","My Profile Tools");
 for(const [label,url] of buttons)rail.append(link(label,url,"grade09-blueprint-tool"));
 tools.append(rail);
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
window.addEventListener("khaemenes-learning-continuation-changed",render);
window.addEventListener("khaemenes-course-pins-changed",render);
window.addEventListener("khaemenes-high-profile-appearance-changed",render);
window.addEventListener("storage",e=>{if(!e.key||/khaemenes.*(profile|pin|language|continuation|learner)/.test(e.key))render()});
render();
window.KhaemenesUpperGrade09Blueprint=Object.freeze({render,version:"1.0.0"});
})();
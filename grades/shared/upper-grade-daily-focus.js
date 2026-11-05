/* Grades 10–12 · Grade 09 To Do Today design-parity adapter.
 * One ten-activity personal routine per registered grade and learner.
 * Academic scores/mastery remain course-owned; no grades are invented here.
 * Grade 09's approved implementation remains untouched.
 */
(()=>{"use strict";
if(window.KhaemenesUpperGradeDailyFocus)return;
const grade=Number(document.body?.dataset.grade);
if(![10,11,12].includes(grade))return;
const host=document.getElementById("todayTitle")?.closest(".card");
const context=window.KhaemenesHighProfileGradeContext;
const catalog=window.KhaemenesHighEightClass;
if(!host||!context||!catalog)return;
if(document.getElementById("upperGradeDailyFocus"))return;
const create=(tag,className,text)=>{
 const el=document.createElement(tag);if(className)el.className=className;
 if(text!==undefined)el.textContent=text;return el;
};
const date=()=>{
 const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
};
const read=key=>{try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}};
const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
function learner(){
 const active=context.active();
 const academy=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
 return active?.gradeNumber===grade&&(!academy||academy===active.learnerId)?active:null;
}
const key=(ctx,kind)=>"khaemenes-grade"+grade+"-"+kind+"-v1:learner:"+encodeURIComponent(ctx.learnerId);
const breakfast=[
 "Try oatmeal with fruit, or another satisfying breakfast you enjoy.",
 "Try yogurt or a dairy-free alternative with fruit and whole-grain toast.",
 "Try eggs or beans with toast and a piece of fruit.",
 "Try a banana, nut-free spread if needed, and whole-grain toast.",
 "Try a breakfast bowl with fruit, grains, and a protein you enjoy.",
 "Try a smoothie plus a filling snack or toast.",
 "Try leftovers from a balanced meal if that sounds good."
];
const tasks=[
 {key:"breakfast",title:"Breakfast & hydration",detail:()=>breakfast[new Date().getDay()]+" Drink some water, too."},
 {key:"wash",title:"Get ready, stretch & breathe",detail:()=>"Brush your teeth, wash up, then enjoy a gentle stretch and comfortable breathing break.",action:"Visit Aurora",url:"https://vervenveda.com/aurora.github.io/"},
 {key:"journal",title:"Morning journal",detail:()=>"Write a short reflection or set an intention for today.",action:"Open reflection workspace",url:"../../../portfolio/index.html"},
 {key:"lunch",title:"Lunch & rest",detail:()=>"Take time to eat lunch, drink water, and enjoy a screen break."},
 {key:"movement",title:"Afternoon movement / PE",detail:()=>"Choose a comfortable activity or continue your Physical Education class.",action:"Open PE class",subject:"peHealth"},
 {key:"elective",title:"Today's elective",detail:()=>"Explore today's selected elective or creative practice.",action:"Open elective",subject:"elective"},
 {key:"life",title:"Life skills",detail:()=>"Practice a useful household, planning, or everyday independence skill.",action:"Open Psychology / Life Skills",subject:"psychology"},
 {key:"family",title:"Family or friend time",detail:()=>"Make time to connect, talk, play, or help someone you care about."},
 {key:"arcade",title:"Arcade & recreation break",detail:()=>"Enjoy a little free time with a game, puzzle, or another favorite activity. Remember to take screen breaks.",action:"Visit Academy Arcade",url:"https://vervenveda.com/arcade.github.io/"},
 {key:"bedtime",title:"Evening wash-up & bedtime",detail:()=>"Shower or wash up, brush your teeth, and get ready for a comfortable bedtime that allows enough sleep."}
];
const wrap=create("section","grade09-daily-focus");wrap.id="upperGradeDailyFocus";
wrap.setAttribute("aria-label","To Do Today personal routine");
const help=create("p","grade09-daily-focus-explanation","A balanced day beyond lessons. Personal tasks are self-checked and separate from grades.");
const count=create("p","grade09-daily-focus-count");count.setAttribute("role","status");
const list=create("ol","grade09-daily-focus-list");
const note=create("p","grade09-daily-focus-note","Daily checks and family reports are saved on this browser only. Cross-device sending is not connected.");
const family=create("a","grade09-daily-task-link","Open Family Learning Center");
family.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
family.style.cssText="max-width:350px";
wrap.append(help,count,list,note,family);host.append(wrap);
const study=create("section","grade09-academic-checkpoints");
study.id="upperGradeAcademicCheckpoints";
study.style.cssText="margin-top:20px;border-top:1px solid #c5b492;padding-top:18px";
study.append(create("h3","","Today's Class Checkpoints"));
study.append(create("p","grade09-daily-focus-explanation","Academic mastery is recorded only by each course's assessment engine. Personal checkmarks never award credits, scores or lesson unlocks."));
const classGrid=create("div","grade09-academic-grid");
classGrid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:12px;margin-top:12px";
study.append(classGrid);wrap.append(study);
let currentId="";
function slots(){try{return catalog.slots(grade)}catch{return []}}
function route(subject){
 const slot=slots().find(item=>item.subject===subject);
 return slot?.href&&/^https:\/\//.test(slot.href)?slot.href:null;
}
function report(ctx,checks){
 if(!ctx||learner()?.learnerId!==ctx.learnerId)return;
 const today=date(),base=key(ctx,"daily-parent-report");
 const old=read(base);
 const records=old?.reports&&typeof old.reports==="object"?{...old.reports}:{};
 const record={
  schema:"khaemenes-upper-grade-daily-parent-report-v1",learnerId:ctx.learnerId,
  grade,date:today,habits:tasks.map(t=>({key:t.key,label:t.title,checked:checks[t.key]===true})),
  classes:slots().map(s=>({subject:s.label,courseId:s.id||null,courseTitle:s.title,masteredToday:null})),
  masteryRule:"Unverified by this personal task module; use course assessment evidence",
  delivery:"local-family-profile-only"
 };
 const prior=records[today];
 if(prior&&JSON.stringify({...prior,updatedAt:null})===JSON.stringify({...record,updatedAt:null}))return;
 records[today]={...record,updatedAt:new Date().toISOString()};
 const dates=Object.keys(records).sort().reverse().slice(0,31);
 if(learner()?.learnerId!==ctx.learnerId)return;
 write(base,{version:1,learnerId:ctx.learnerId,reports:Object.fromEntries(dates.map(d=>[d,records[d]]))});
}
function render(){
 const ctx=learner();
 const id=ctx?.learnerId||"";
 const saved=ctx?read(key(ctx,"today-habits")):null;
 const checks=saved?.date===date()&&saved.items&&typeof saved.items==="object"?saved.items:{};
 currentId=id;
 list.replaceChildren();classGrid.replaceChildren();
 tasks.forEach((task,index)=>{
  const row=create("li","grade09-daily-task");
  row.append(create("span","grade09-daily-task-number",String(index+1).padStart(2,"0")));
  const label=create("label","grade09-daily-task-check");
  const input=create("input");input.type="checkbox";input.checked=checks[task.key]===true;
  input.disabled=!ctx;input.setAttribute("aria-label","Mark "+task.title+" done");
  label.append(input,create("span","grade09-daily-task-name",task.title));
  row.append(label,create("p","grade09-daily-task-detail",task.detail()));
  if(task.action){
   const href=task.subject?route(task.subject):task.url;
   const registered=context.active();
   const visiting=["11","12"].includes(String(grade))&&!ctx;
   // Public wellness/recreation links are not learner-specific.
   const publicResource=task.key==="wash"||task.key==="arcade";
   const registeredProfile=registered?.gradeNumber>=9&&registered?.gradeNumber<=12
    ?"https://vervenveda.com/Khaemenes_High.github.io/grades/grade-"+
      String(registered.gradeNumber).padStart(2,"0")+"/student-profile/":null;
   let destination=null,labelText=task.action;
   if(ctx&&href)destination=href;
   else if(visiting&&publicResource&&href)destination=href;
   else if(visiting&&registeredProfile){
    destination=registeredProfile;
    labelText="Open in Grade "+registered.gradeNumber;
   }
   if(destination){
    const anchor=create("a","grade09-daily-task-link",labelText);
    anchor.href=destination;
    if(!ctx&&!publicResource)anchor.title="Open the registered learner's own campus before working in private student resources";
    row.append(anchor);
   }else{
    const message=ctx?"Class link unavailable; use My Schedule Bar.":"Select your registered Grade "+grade+" learner to open activities.";
    const text=create("span","grade09-daily-focus-note",message);
    text.style.cssText="grid-column:2;grid-row:3";row.append(text);
   }
  }
  input.addEventListener("change",()=>{
   const current=learner();
   if(!current||current.learnerId!==id||currentId!==id){render();return}
   const fresh=read(key(current,"today-habits"));
   const old=fresh?.date===date()?fresh.items||{}:{};
   const next={...old,[task.key]:input.checked===true};
   if(!write(key(current,"today-habits"),{date:date(),items:next})){
    input.checked=!input.checked;count.textContent="Unable to save on this device.";return;
   }
   count.textContent=list.querySelectorAll('input:checked').length+" of "+tasks.length+" personal activities checked · not an academic grade.";
   report(current,next);
  });
  list.append(row);
 });
 count.textContent=ctx?list.querySelectorAll('input:checked').length+" of "+tasks.length+" personal activities checked · not an academic grade.":"Select a registered Grade "+grade+" learner to save personal activities.";
 if(!ctx){
  const p=create("p","grade09-daily-focus-note","This is the Grade "+grade+" campus. Personal tasks remain viewable but cannot be saved for another grade.");
  classGrid.append(p);
  return;
 }
 slots().forEach((slot,index)=>{
  const box=create("article","grade09-academic-box");
  box.style.cssText="display:grid;gap:7px;min-height:128px;padding:12px;border:1px solid #c5b492;border-radius:7px;background:#fffdf8;color:#243038";
  box.append(create("span","grade09-academic-number",String(index+1).padStart(2,"0")));
  box.append(create("strong","",slot.label));
  box.append(create("small","","Not verified today"));
  const link=slot.href&&/^https:\/\//.test(slot.href)?slot.href:null;
  if(link){const a=create("a","grade09-academic-link","Open class");a.href=link;box.append(a)}
  else box.append(create("small","","Use My Schedule Bar to choose a class"));
  classGrid.append(box);
 });
}
for(const eventName of ["khaemenes-student-profile-changed","khaemenes-course-pins-changed","khaemenes-learning-continuation-changed","pageshow","focus"])
 window.addEventListener(eventName,render);
window.addEventListener("storage",e=>{
 if(!e.key||/khaemenes_active_learner|khaemenes_family_registry|khaemenes-grade(10|11|12)-today-habits/.test(e.key))render();
});
render();
window.KhaemenesUpperGradeDailyFocus=Object.freeze({render,version:1});
})();
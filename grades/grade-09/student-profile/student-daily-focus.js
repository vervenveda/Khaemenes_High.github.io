/* Grade 09 · To Do Today · learner-scoped habits and separate academic evidence.
   Personal checks never award course mastery. Parent digest is local to this origin. */
(()=>{"use strict";
if(window.KhaemenesGrade09DailyFocus)return;
const card=document.getElementById("todayTitle")?.closest(".card");
const catalog=window.KhaemenesHighEightClass,registry=window.KhaemenesGrade09Courses,
pins=window.KhaemenesHighCoursePins,contract=window.KhaemenesCourseEntryContract;
if(!card||!catalog||!registry||!pins||!contract)return;
const HABIT_BASE="khaemenes-grade09-today-habits-v1";
const REPORT_BASE="khaemenes-grade09-daily-parent-report-v1:";
const EVIDENCE_BASE="khaemenes-grade09-dated-assessment-evidence-v1:";
const existingChecksBase="khaemenes-grade09-daily-checks-v1";
const dateString=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
const localDate=()=>dateString(new Date());
const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n};
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch{return null}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
function learner(){
 try{
  const p=contract.readAcademyProfile?.();
  if(!p?.learnerId||!contract.scopedKey)return null;
  const active=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
  if(active&&String(active)!==String(p.learnerId))return null;
  const entry=read("khaemenes_family_registry_v1")?.learners?.[p.learnerId];
  const grade=entry?.grade||p.grade;
  if(grade!==undefined&&grade!==null&&!/^(?:grade[\s-]*)?0?9$/i.test(String(grade)))return null;
  return p;
 }catch{return null}
}
const habitKey=p=>contract.scopedKey(HABIT_BASE,p);
const reportKey=p=>REPORT_BASE+encodeURIComponent(p.learnerId);
const evidenceKey=p=>EVIDENCE_BASE+encodeURIComponent(p.learnerId);
const readHabits=p=>{const v=p?read(habitKey(p)):null;return v?.date===localDate()&&v.items&&typeof v.items==="object"?v.items:{}};
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
 {key:"breakfast",title:"Breakfast & hydration",detail:()=>breakfast[new Date().getDay()]+" Drink some water, too.",},
 {key:"wash",title:"Get ready, stretch & breathe",detail:()=>"Brush your teeth, wash up, then enjoy a gentle stretch and comfortable breathing break.",action:"Visit Aurora",href:"https://vervenveda.com/aurora.github.io/"},
 {key:"journal",title:"Morning journal",detail:()=>"Write a short reflection or set an intention for today.",action:"Open daily journal",href:"daily-lessons/#todaysNote"},
 {key:"lunch",title:"Lunch & rest",detail:()=>"Take time to eat lunch, drink water, and enjoy a screen break."},
 {key:"movement",title:"Afternoon movement / PE",detail:()=>"Choose a comfortable activity or continue your Physical Education class.",action:"Open PE class",subject:"physicalEducation"},
 {key:"elective",title:"Today's elective",detail:()=>"Explore today's selected elective or creative practice.",action:"Open elective",subject:"elective"},
 {key:"life",title:"Life skills",detail:()=>"Practice a useful household, planning, or everyday independence skill.",action:"Open Psychology / Life Skills",subject:"psychology"},
 {key:"family",title:"Family or friend time",detail:()=>"Make time to connect, talk, play, or help someone you care about."},
 {key:"arcade",title:"Arcade & recreation break",detail:()=>"Enjoy a little free time with a game, puzzle, or another favorite activity. Remember to take screen breaks.",action:"Visit Academy Arcade",href:"https://vervenveda.com/arcade.github.io/"},
 {key:"bedtime",title:"Evening wash-up & bedtime",detail:()=>"Shower or wash up, brush your teeth, and get ready for a comfortable bedtime that allows enough sleep."}
];
const container=el("section","grade09-daily-focus");container.id="grade09DailyFocus";
container.setAttribute("aria-label","To Do Today personal routine");
const help=el("p","grade09-daily-focus-explanation","A balanced day beyond lessons. Personal tasks are self-checked and separate from grades.");
const count=el("p","grade09-daily-focus-count");count.setAttribute("role","status");
const list=el("ol","grade09-daily-focus-list");
const academics=el("section","grade09-academic-checkpoints");
academics.id="grade09AcademicCheckpoints";
academics.setAttribute("aria-label","Academic mastery checkpoints for today");
const academicHeading=el("h3","","Today's Class Checkpoints");
const academicHelp=el("p","grade09-daily-focus-explanation","A class highlights when a dated lesson or unit assessment result reports at least 80%. Course-wide progress and personal checks do not count. Assessment integration is still being connected.");
const classGrid=el("div","grade09-academic-grid");
const note=el("p","grade09-daily-focus-note","Daily reports are saved on this browser for an authorized parent to review. Cross-device sending is not connected.");
const familyLink=el("a","grade09-daily-task-link","Open Family Learning Center");
familyLink.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
academics.append(academicHeading,academicHelp,classGrid);
container.append(help,count,list,note,familyLink);
card.append(container);
// Keep academic evidence with the academic schedule, not inside personal wellbeing.
// Schedule and course cards are owned elsewhere; only append this dedicated section.
const scheduleCard=document.querySelector(".grade09-priority-schedule .schedule-card");
if(scheduleCard)scheduleCard.append(academics);
else{
 const fallback=el("p","grade09-daily-focus-note","Academic checkpoints are unavailable until My Schedule Bar loads.");
 container.append(fallback);
}
let revision=0;
function subjectLink(subject,slots){
 const entry=slots.find(x=>x.subject===subject);
 const course=entry?.id?registry.getCourse(entry.id):null;
 return course?.home||"daily-lessons/";
}
function masteredEvidence(p,courseId){
 // Only a dated, assessment-level record qualifies. Course-wide progress percentages
 // and self-reported daily checks never satisfy this test.
 const records=read(evidenceKey(p));
 const items=Array.isArray(records?.assessments)?records.assessments:[];
 return items.find(x=>x?.learnerId===p.learnerId&&x.courseId===courseId&&
  ["lesson","unit"].includes(x.type)&&typeof x.assessmentId==="string"&&x.assessmentId.length>0&&
  Number.isFinite(x.score)&&x.score>=80&&x.score<=100&&
  typeof x.completedAt==="string"&&Number.isFinite(Date.parse(x.completedAt))&&
  dateString(new Date(x.completedAt))===localDate()&&
  x.recordType==="course-assessment-result")||null;
}
function buildReport(p,slots,items){
 const stored=readHabits(p);
 const classes=slots.slice(0,8).map(slot=>{
  const course=slot.id?registry.getCourse(slot.id):null;
  const evidence=p&&course?masteredEvidence(p,course.id):null;
  return {subject:slot.label,courseId:course?.id||null,courseTitle:course?.title||slot.title||slot.label,
    masteredToday:!!evidence,score:evidence?.score??null,assessmentId:evidence?.assessmentId||null};
 });
 return {schema:"khaemenes-grade09-daily-parent-report-v1",learnerId:p.learnerId,grade:9,date:localDate(),
  updatedAt:new Date().toISOString(),habits:items.map(t=>({key:t.key,label:t.title,checked:stored[t.key]===true})),
  classes,masteryRule:"Dated lesson/unit assessment result, score >=80; otherwise unverified",
  delivery:"local-family-profile-only"};
}
function publish(p,slots){
 if(!p)return;
 const current=buildReport(p,slots,tasks);
 const data=read(reportKey(p));
 const reports=data?.reports&&typeof data.reports==="object"?data.reports:{};
 reports[current.date]=current;
 const recent=Object.keys(reports).sort().reverse().slice(0,31);
 write(reportKey(p),{version:1,learnerId:p.learnerId,reports:Object.fromEntries(recent.map(k=>[k,reports[k]]))});
}
function makeHabit(task,i,p,record,slots){
 const row=el("li","grade09-daily-task");
 row.append(el("span","grade09-daily-task-number",String(i+1).padStart(2,"0")));
 const label=el("label","grade09-daily-task-check");
 const check=el("input");check.type="checkbox";check.checked=record[task.key]===true;check.disabled=!p;
 check.setAttribute("aria-label","Mark "+task.title+" done");
 label.append(check,el("span","grade09-daily-task-name",task.title));row.append(label);
 row.append(el("p","grade09-daily-task-detail",task.detail()));
 if(task.action){
  const a=el("a","grade09-daily-task-link",task.action);
  a.href=task.subject?subjectLink(task.subject,slots):task.href;row.append(a);
 }
 check.addEventListener("change",()=>{
  if(!p||learner()?.learnerId!==p.learnerId)return;
  const updated={date:localDate(),items:{...readHabits(p),[task.key]:check.checked}};
  if(!write(habitKey(p),updated)){check.checked=!check.checked;count.textContent="Unable to save on this device.";return}
  updateCount();publish(p,slots);
 });
 return row;
}
function updateCount(){
 const checks=[...list.querySelectorAll('input[type="checkbox"]')];
 count.textContent=checks.filter(x=>x.checked).length+" of "+checks.length+" personal activities checked · not an academic grade.";
}
function drawClasses(p,slots){
 classGrid.replaceChildren();
 slots.slice(0,8).forEach((slot,i)=>{
  const course=slot.id?registry.getCourse(slot.id):null;
  const evidence=p&&course?masteredEvidence(p,course.id):null;
  const box=el("div","grade09-academic-box"+(evidence?" is-mastered":""));
  box.append(el("span","grade09-academic-number",String(i+1).padStart(2,"0")),
   el("strong","",slot.label),el("small","",evidence?"80%+ reported today · "+evidence.score+"%":"Not verified today"));
  if(evidence)box.setAttribute("aria-label",slot.label+" mastered today");
  const a=el("a","grade09-academic-link",course?"Open class":"Choose class");
  a.href=course?.home||"profile/";
  box.append(a);classGrid.append(box);
 });
}
function render(){
 const ticket=++revision,p=learner(),stored=readHabits(p);
 let lang="";try{lang=p?pins.readLanguageChoices()?.["9"]||"":""}catch{}
 const slots=catalog.slots(9,{mathId:p?registry.mathPathway()||null:null,language:lang});
 if(ticket!==revision)return;
 list.replaceChildren(...tasks.map((t,i)=>makeHabit(t,i,p,stored,slots)));
 updateCount();drawClasses(p,slots);
 if(!p)count.textContent="Select an Academy learner to save personal activities.";
 else publish(p,slots);
}
window.KhaemenesGrade09DailyFocus=Object.freeze({render,version:2});
for(const name of ["khaemenes-course-pins-changed","khaemenes-grade09-language-changed","khaemenes-student-profile-changed","khaemenes-learning-continuation-changed","pageshow","focus"])
 window.addEventListener(name,render);
window.addEventListener("storage",e=>{
 if(!e.key||e.key.includes("khaemenes-grade09")||e.key.includes("khaemenes_family_registry")||e.key.includes("khaemenes_active_learner"))render();
});
render();
})();
/* High School 09–12 · My Learning Today visual placement only.
   Moves the existing live card; never clones or re-creates the course engine.
   The registered-grade navigation and learner storage remain with their owners.
*/
(()=>{"use strict";
if(window.KhaemenesLearningTodayPlacement)return;
const main=document.querySelector("main");
const card=document.getElementById("learningToday");
const portfolio=main?.querySelector('aside[aria-label="Student Learning Portfolio"]');
if(!main||!card||!portfolio)return;
if(card.parentElement!==main||card.nextElementSibling!==portfolio)portfolio.before(card);
card.classList.add("khae-learning-today-feature");
card.setAttribute("aria-label","My Learning Today · learning tools");
const grade=String(document.body?.dataset.grade||"09").padStart(2,"0");
// Link to an actual focused lesson/course page, never to a profile section.
// A visitor registered in another grade returns to that grade's course campus.
let ownGrade=grade;
if(grade!=="09"){
 const registered=window.KhaemenesHighProfileGradeContext?.active?.();
 if(registered?.gradeNumber&&Number(registered.gradeNumber)!==Number(grade))
  ownGrade=String(registered.gradeNumber).padStart(2,"0");
}
const actionHref=grade==="09"?"daily-lessons/":"../../grade-"+ownGrade+"/#courses";
const actionLabel=grade==="09"?"Start Daily Lessons":"Go to My Classes";
let dedicated=card.querySelector("#khaeLearningTodayPrimary");
if(!dedicated){
 const holder=document.createElement("div");
 holder.id="khaeLearningTodayPrimary";
 holder.className="khae-learning-today-primary";
 dedicated=document.createElement("a");
 dedicated.className="khae-learning-today-start";
 dedicated.textContent=actionLabel;
 dedicated.href=actionHref;
 holder.append(dedicated);
 card.querySelector("#learningTodayActions")?.before(holder);
}
// The course engine still writes continuation previews to its original nodes.
// Keep those nodes mounted for compatibility, but remove every redundant action
// from visual presentation, assistive navigation, and keyboard focus.
for(const id of ["learningTodayActions","learningTodayCourses"]){
 const oldNode=document.getElementById(id);
 if(!oldNode)continue;
 oldNode.hidden=true;
 oldNode.inert=true;
 oldNode.setAttribute("aria-hidden","true");
}
// In a reused page, normalize the one featured navigation link in place.
dedicated=card.querySelector(".khae-learning-today-start");
if(dedicated){
 dedicated.href=actionHref;
 dedicated.textContent=actionLabel;
}
window.KhaemenesLearningTodayPlacement=Object.freeze({version:2});
})();
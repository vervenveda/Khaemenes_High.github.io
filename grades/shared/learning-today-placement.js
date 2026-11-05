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
const actionHref=grade==="09"?"daily-lessons/":"#courseManagerGrid";
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
window.KhaemenesLearningTodayPlacement=Object.freeze({version:1});
})();
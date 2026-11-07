/* High School dedicated rooms: UI-only learner-switch concealment.
 * No authentication, enrollment, mastery or account authority is granted here.
 * Covers Grade 11/12 independently owned Daily Lessons, Grades, Games, Settings.
 */
(()=>{"use strict";
const match=location.pathname.match(/\/grades\/grade-(11|12)\/student-profile\/(daily-lessons|grades|games|settings)\/?/);
if(!match)return;
const pageGrade=Number(match[1]),gradeContext=window.KhaemenesHighProfileGradeContext;
const profile=window.KhaemenesStudentProfileV2;
const start=gradeContext?.active?.();
const owner=start?.gradeNumber===pageGrade && start?.learnerId &&
  profile?.activeLearner?.()?.learnerId===start.learnerId ? start.learnerId:null;
const content=document.querySelector("main [id$='RoomContent']");
const status=document.querySelector("main [id$='RoomMessage']");
if(!content||!status)return;
let locked=false;
function check(){
 if(locked)return;
 const now=gradeContext?.active?.();
 if(owner&&now?.learnerId===owner&&now?.gradeNumber===pageGrade
    &&profile?.activeLearner?.()?.learnerId===owner)return;
 locked=true;
 // Never leave a previous learner's report, note, or account request in view.
 content.replaceChildren();
 const message=document.createElement("p");
 message.textContent="Your Academy learner selection changed or is unavailable. Open your registered profile again to view personal work. No records were changed.";
 content.append(message);
 status.textContent="This room has been concealed to protect the prior learner's browser-local information.";
 document.querySelectorAll("[data-owner-only]").forEach(node=>{node.hidden=true});
}
["khaemenes-family-changed","khaemenes-student-profile-changed","pageshow","focus"].forEach(event=>window.addEventListener(event,check));
window.addEventListener("storage",event=>{
 if(!event.key||/khaemenes_active_learner_v1|khaemenes_family_registry_v1|khaemenes_active_family_v1/.test(event.key))check();
});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)check()});
check();
})();

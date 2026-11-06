/* Grade 09 only: rehome existing authoritative class checkpoints and progress chart.
   No cloning of records or mastery calculation. Single accessible full-screen dialog. */
(()=>{"use strict";
if(document.getElementById("grade09ClassProgressDialog"))return;
const checkpoints=document.getElementById("grade09AcademicCheckpoints");
const progress=document.getElementById("studentCourseProgress");
if(!checkpoints||!progress||!progress.classList.contains("grade09-class-progress"))return;
const dialog=document.createElement("dialog");
dialog.id="grade09ClassProgressDialog";
dialog.setAttribute("aria-labelledby","grade09ClassProgressTitle");
dialog.setAttribute("aria-modal","true");
const header=document.createElement("header");
header.className="grade09-progress-dialog-header";
const heading=document.createElement("h2");
heading.id="grade09ClassProgressTitle";
heading.textContent="Class Progress";
const close=document.createElement("button");
close.type="button";
close.className="grade09-progress-dialog-close";
close.textContent="Close";
header.append(heading,close);
const content=document.createElement("div");
content.className="grade09-progress-dialog-content";
const left=document.createElement("div");
left.className="grade09-progress-dialog-checkpoints";
const right=document.createElement("div");
right.className="grade09-progress-dialog-chart";
left.append(checkpoints);
right.append(progress);
/* Keep the existing live chart and checkpoint owners; show progress first. */
content.append(right,left);
dialog.append(header,content);
document.body.append(dialog);
close.addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
const launcher=document.querySelector('#khaeProfileToolRail button[aria-controls="grade09ClassProgressDialog"]');
let focusBefore=null;
if(launcher){
 launcher.setAttribute("aria-haspopup","dialog");
 launcher.addEventListener("click",()=>{focusBefore=launcher;});
}
dialog.addEventListener("close",()=>{if(focusBefore?.isConnected)focusBefore.focus()});
window.KhaemenesGrade09ClassProgressDialog=Object.freeze({version:1,open:()=>{if(!dialog.open)dialog.showModal()},close:()=>{if(dialog.open)dialog.close()}});
})();

/* Grade 09 schedule dialog: rehome, never clone, the canonical eight-class schedule.
   Course state, mathematics placement, language preference, and saved pins retain ownership. */
(()=>{"use strict";
if(document.getElementById("grade09ScheduleDialog"))return;
const schedule=document.querySelector(".grade09-priority-schedule");
const card=schedule?.querySelector(".schedule-card");
if(!schedule||!card)return;
const dialog=document.createElement("dialog");
dialog.id="grade09ScheduleDialog";
dialog.setAttribute("aria-labelledby","grade09ScheduleDialogTitle");
dialog.setAttribute("aria-modal","true");
const head=document.createElement("header");
head.className="grade09-schedule-dialog-head";
const title=document.createElement("h2");
title.id="grade09ScheduleDialogTitle";
title.textContent="My Schedule";
const close=document.createElement("button");
close.type="button";
close.className="grade09-schedule-dialog-close";
close.textContent="Close";
head.append(title,close);
const body=document.createElement("div");
body.className="grade09-schedule-dialog-body";
body.append(schedule);
dialog.append(head,body);
document.body.append(dialog);
close.addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
const launchers=[...document.querySelectorAll('#khaeProfileToolRail button[aria-controls="grade09ScheduleDialog"]')];
let lastLauncher=null;
for(const launcher of launchers){
 launcher.setAttribute("aria-haspopup","dialog");
 launcher.addEventListener("click",()=>{lastLauncher=launcher});
}
dialog.addEventListener("close",()=>{if(lastLauncher?.isConnected)lastLauncher.focus()});
window.KhaemenesGrade09ScheduleDialog=Object.freeze({
 version:1,open:()=>{if(!dialog.open)dialog.showModal()},
 close:()=>{if(dialog.open)dialog.close()}
});
})();

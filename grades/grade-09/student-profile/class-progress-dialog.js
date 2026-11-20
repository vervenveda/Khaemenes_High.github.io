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
heading.textContent="Student Progress";
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
/* Preserve the original live checkpoints, but keep their long grid optional. */
const checkpointDisclosure=document.createElement("details");
checkpointDisclosure.className="grade09-checkpoints-disclosure";
const summary=document.createElement("summary");
summary.textContent="Today's Class Checkpoints · 16 cards (expand or collapse)";
summary.setAttribute("aria-label","Expand or collapse sixteen Grade 9 class checkpoints");
checkpointDisclosure.append(summary,checkpoints);
checkpointDisclosure.open=true;
left.append(checkpointDisclosure);
right.append(progress);
/* Keep both live academic owners: graph first, optional checkpoints second. */
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
window.KhaemenesGrade09ClassProgressDialog=Object.freeze({version:2,open:()=>{if(!dialog.open)dialog.showModal();window.dispatchEvent(new Event("khaemenes-grade09-progress-refresh"));},close:()=>{if(dialog.open)dialog.close()}});
})();

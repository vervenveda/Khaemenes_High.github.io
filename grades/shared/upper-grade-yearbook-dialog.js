/* Grade 09-approved Yearbook modal doorway for High School Grades 10–12.
 * The external Yearbook application owns every image and its browser storage.
 * This modal is presentation only; no Academy learner state is read or written.
 */
(()=>{"use strict";
const grade=Number(document.body?.dataset.grade);
const grade10Copy=grade===10;
const grade11Copy=grade===11;
const grade12Copy=grade===12;
if(![10,11,12].includes(grade)||window.KhaemenesUpperGradeYearbook)return;
const url="https://vervenveda.com/Academy-Yearbook.github.io/";
const dialog=document.createElement("dialog");
dialog.id="grade09YearbookDialog";
dialog.className="grade09-yearbook-dialog";
dialog.setAttribute("aria-labelledby","grade09YearbookTitle");
const style=document.createElement("style");
style.id="grade09YearbookDialogStyle";
style.textContent=`
html:root:root body #grade09YearbookDialog{box-sizing:border-box;width:min(1140px,calc(100vw - 24px));height:min(91dvh,950px);max-height:91dvh;margin:auto;padding:0;overflow:hidden;border:2px solid #b48b45;border-radius:7px;background:#fff8e9;color:#243038;box-shadow:0 18px 70px #0007}
html:root:root body #grade09YearbookDialog::backdrop{background:rgba(12,23,25,.76)}
#grade09YearbookDialog .yearbook-modal-shell{display:flex;flex-direction:column;height:100%;min-height:0}
#grade09YearbookDialog .yearbook-modal-header{box-sizing:border-box;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:11px 17px;background:#243038;color:#fff8e9}
#grade09YearbookDialog #grade09YearbookTitle{margin:0;color:#fff8e9;font:400 23px/1.3 Cinzel,Georgia,serif}
#grade09YearbookDialog .yearbook-modal-buttons{display:flex;gap:8px;flex-wrap:wrap}
html:root:root body #grade09YearbookDialog .yearbook-modal-buttons :is(a,button){box-sizing:border-box;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:44px!important;padding:8px 13px!important;border:1px solid #b48b45!important;border-radius:7px!important;background:#fff8e9!important;color:#243038!important;-webkit-text-fill-color:#243038!important;font:400 16px/1.3 "Brandon Grotesque",Nunito,Arial,sans-serif!important;text-decoration:none!important;cursor:pointer}
#grade09YearbookDialog .yearbook-modal-help{margin:0;padding:9px 14px;color:#243038;background:#f5e8ce;border-bottom:1px solid #b48b45;font:400 16px/1.4 "Brandon Grotesque",Nunito,Arial,sans-serif}
#grade09YearbookDialog .yearbook-frame{box-sizing:border-box;border:0;display:block;width:100%;flex:1;min-height:0;background:#182625}
#grade09YearbookDialog .yearbook-modal-buttons :is(a,button):focus-visible{outline:3px solid #d5b77b;outline-offset:2px}
@media(max-width:620px){html:root:root body #grade09YearbookDialog{width:calc(100vw - 12px);height:94dvh;max-height:94dvh}#grade09YearbookDialog .yearbook-modal-header{padding:9px}#grade09YearbookDialog #grade09YearbookTitle{font-size:20px}}
`;
document.head.append(style);
const shell=document.createElement("div");shell.className="yearbook-modal-shell";
const head=document.createElement("div");head.className="yearbook-modal-header";
const heading=document.createElement("h2");heading.id="grade09YearbookTitle";heading.textContent=grade10Copy?"My Grade 10 Yearbook":grade11Copy?"My Grade 11 Yearbook":grade12Copy?"My Senior Yearbook":"My School Yearbook";
const controls=document.createElement("div");controls.className="yearbook-modal-buttons";
const external=document.createElement("a");external.href=url;external.target="_blank";external.rel="noopener noreferrer";external.textContent=grade10Copy?"Open My Yearbook in New Tab":(grade11Copy||grade12Copy)?"Open My Yearbook":"Open full Yearbook";
const close=document.createElement("button");close.type="button";close.textContent="Close";
controls.append(external,close);head.append(heading,controls);
const help=document.createElement("p");help.className="yearbook-modal-help";
help.textContent=grade10Copy?"Collect photos, memories, projects, and moments from your Grade 10 year. Open the full Yearbook whenever you want to keep building it.":grade11Copy?"Capture the people, projects, experiences, milestones, and moments that made your junior year yours. Keep adding to it as the year unfolds.":grade12Copy?"Preserve the people, projects, milestones, and moments that made your senior year yours. Build a yearbook you will still want to open after High School is behind you.":"Create a personal photo yearbook. Photos are stored by the Yearbook application in this browser, not in your Academy learner profile. Export a backup to keep your memories.";
const frame=document.createElement("iframe");frame.className="yearbook-frame";
frame.title="Khaemenes Academy Yearbook Studio";frame.loading="lazy";
frame.referrerPolicy="strict-origin-when-cross-origin";frame.setAttribute("allow","");
frame.src=url;
shell.append(head,help,frame);dialog.append(shell);document.body.append(dialog);
let origin=null,openedLearner=null;
const activeLearner=()=>window.KhaemenesHighProfileGradeContext?.activeForGrade?.(String(grade).padStart(2,"0"))?.learnerId||null;
function open(trigger){
 const owner=activeLearner();
 if(!owner)return false;
 origin=trigger||document.activeElement;openedLearner=owner;
 frame.src=url;
 if(!dialog.open)dialog.showModal();
 close.focus();
 return true;
}
function closeOnLearnerChange(){if(dialog.open&&(!openedLearner||activeLearner()!==openedLearner))dialog.close()}
window.addEventListener("khaemenes-family-changed",closeOnLearnerChange);
window.addEventListener("pageshow",closeOnLearnerChange);
window.addEventListener("storage",event=>{
 if(!event.key||["khaemenes_active_learner_v1","khaemenes_active_family_v1","khaemenes_family_registry_v1"].includes(event.key))closeOnLearnerChange();
});
close.addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener("close",()=>{openedLearner=null;frame.src="about:blank";if(origin?.isConnected)origin.focus()});
window.KhaemenesUpperGradeYearbook=Object.freeze({version:"1.0.0",open,close:()=>dialog.open&&dialog.close()});
})();

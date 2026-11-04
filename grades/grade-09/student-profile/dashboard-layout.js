/* Grade 09 layout steward: keep features, restore a readable daily-start hierarchy. */
(()=>{"use strict";
const main=document.querySelector("main"),schedule=document.querySelector(".grade09-priority-schedule");
if(!main||!schedule)return;
const progress=document.getElementById("studentCourseProgress");
const dashboardWidth="min(calc(100% - 33px), 1100px)";
const align=node=>{if(!node)return;node.style.setProperty("width",dashboardWidth,"important");node.style.setProperty("max-width","1100px","important");node.style.setProperty("margin-left","auto","important");node.style.setProperty("margin-right","auto","important")};
const shortcuts=document.querySelector(".grade09-priority");
const portfolio=main.querySelector('aside[aria-label="Student Learning Portfolio"]');
// Student profile first: identity/photo and first step, then the canonical schedule.
const grid=main.querySelector(".section .grid");
const identity=grid?.querySelector(".profile-row")?.closest(".card");
const firstStep=grid?.querySelector("#todayTitle")?.closest(".card");
const top=document.createElement("section");
top.className="grade09-profile-first";
top.id="grade09ProfileFirst";
top.setAttribute("aria-label","Student profile and daily starting point");
for(const card of [identity,firstStep])if(card)top.append(card);
main.prepend(top);
align(top);

// Profile photo and personal information must lead; the Profile Tools toolbar follows the identity card.
// It reuses existing Grade 09 features; no course records or learner storage are changed.
if(!document.getElementById("khaeProfileToolRail")){
 const rail=document.createElement("nav");
 rail.id="khaeProfileToolRail";
 rail.setAttribute("aria-label","My Profile Tools");
 rail.style.cssText="box-sizing:border-box;width:min(calc(100% - 33px),1100px);max-width:1100px;margin:14px auto 12px;padding:16px;border:1px solid #b48b45;border-radius:7px;background:#242d2b;color:#fff8e9";
 const heading=document.createElement("h2");
 heading.textContent="My Profile Tools";
 heading.style.cssText="margin:0 0 12px;text-align:center;color:#e2bd78;font:400 24px/1.3 Cinzel,Georgia,serif";
 const grid=document.createElement("div");
 grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:9px";
 const reveal=id=>{
  const element=document.getElementById(id);
  if(!element)return false;
  const details=element.closest("details");
  if(details)details.open=true;
  element.scrollIntoView({behavior:"smooth",block:"start"});
  return true;
 };
 const tools=[
  {label:"Edit Profile",href:"https://vervenveda.com/Khaemenes_Academy.github.io/student/profile.html#profileStudio"},
  {label:"Class Progress",target:"grade09ClassProgressDialog",run:()=>{
    const popup=document.getElementById("grade09ClassProgressDialog");
    if(popup&&!popup.open)popup.showModal();
    else if(!popup)reveal("studentCourseProgress");
   }},
  {label:"Schedule",target:"grade09ScheduleDialog",run:()=>{
   const popup=document.getElementById("grade09ScheduleDialog");
   if(popup&&!popup.open)popup.showModal();
  }},
  {label:"KlasaiPeer",target:"grade09StudyStudioDialog",run:()=>{
   const studio=window.KhaemenesGrade09StudyStudio;
   if(studio)studio.open(document.activeElement);
  }},
  {label:"Yearbook",target:"grade09YearbookDialog",run:()=>window.KhaemenesGrade09Yearbook?.open?.(document.activeElement)},
  {label:"Creative Tools",target:"khaeStudentEcosystemTools",run:()=>{
   const section=document.getElementById("khaeStudentEcosystemTools");
   if(!section)return;
   const parent=section.closest("details.grade09-explore-item");
   if(parent)parent.open=true;
   const heading=document.getElementById("grade09Explore");
   const destination=parent?.querySelector("summary")||heading||section;
   const position=window.scrollY+destination.getBoundingClientRect().top-112;
   window.scrollTo({top:Math.max(0,position),behavior:"smooth"});
   destination.setAttribute("tabindex","-1");
   destination.focus({preventScroll:true});
  }},
  {label:"Student Portfolio",run:()=>{
   const evidence=document.querySelector('aside[aria-label="Student Learning Portfolio"]');
   if(evidence){evidence.scrollIntoView({behavior:"smooth",block:"start"});evidence.querySelector("a")?.focus({preventScroll:true});}
   else window.location.assign("../../../portfolio/index.html");
  }}
 ];
 for(const tool of tools){
  const item=document.createElement(tool.href?"a":"button");
  item.className="grade09-profile-tool";
  const label=document.createElement("span");
  label.className="grade09-profile-tool-label";
  label.textContent=tool.label;
  label.style.setProperty("color","#fff8e9","important");
  label.style.setProperty("-webkit-text-fill-color","#fff8e9","important");
  item.append(label);
  if(tool.href)item.href=tool.href;
  else{
   item.type="button";
   if(tool.target)item.setAttribute("aria-controls",tool.target);
   item.addEventListener("click",()=>{
    if(tool.run)tool.run();
    else if(!reveal(tool.target))window.location.assign(tool.fallback);
   });
  }
  item.style.cssText="box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:100%;min-width:0;min-height:56px;padding:10px 12px;border:1px solid #65716c;border-radius:7px;background:#33454b;color:#fff8e9;-webkit-text-fill-color:#fff8e9;text-align:center;text-decoration:none;font:400 16px/1.3 'Brandon Grotesque',Nunito,Arial,sans-serif;cursor:pointer";
  // Keep charcoal and cream even if legacy auto-contrast has restyled controls.
  item.style.setProperty("background-color","#243038","important");
  item.style.setProperty("background-image","none","important");
  item.style.setProperty("color","#fff8e9","important");
  item.style.setProperty("-webkit-text-fill-color","#fff8e9","important");
  item.addEventListener("focus",()=>{item.style.outline="3px solid #e2bd78";item.style.outlineOffset="2px"});
  item.addEventListener("blur",()=>{item.style.outline=""});
  grid.append(item);
 }
 // The redundant Learning Journey toolbar action is retired. The associated
 // evidence and learning-journey implementation remain in place.
 const photoActions=identity?.querySelector(".grade09-profile-actions");
 if(photoActions){
  photoActions.querySelector("#openLearningJourney")?.remove();
  photoActions.querySelector('a.grade09-profile-action[href="profile/"]')?.remove();
  if(!photoActions.children.length)photoActions.remove();
 }
 rail.append(heading,grid);
 top.insertBefore(rail,firstStep||null);
}

/* Yearbook Studio lives in its own repository and browser-storage origin.
   The Grade 09 profile provides a modal doorway, not a second copy of photo data. */
if(!window.KhaemenesGrade09Yearbook){
 const yearbookUrl="https://vervenveda.com/Academy-Yearbook.github.io/";
 const yearbook=document.createElement("dialog");
 yearbook.id="grade09YearbookDialog";
 yearbook.className="grade09-yearbook-dialog";
 yearbook.setAttribute("aria-labelledby","grade09YearbookTitle");
 const style=document.createElement("style");
 style.id="grade09YearbookDialogStyle";
 style.textContent=`
 html:root:root body #grade09YearbookDialog{box-sizing:border-box;width:min(1140px,calc(100vw - 24px));height:min(91dvh,950px);max-height:91dvh;margin:auto;padding:0;overflow:hidden;border:2px solid #b48b45;border-radius:7px;background:#fff8e9;color:#243038;box-shadow:0 18px 70px #0007}
 html:root:root body #grade09YearbookDialog::backdrop{background:rgba(12,23,25,.76)}
 #grade09YearbookDialog .yearbook-modal-shell{display:flex;flex-direction:column;height:100%;min-height:0}
 #grade09YearbookDialog .yearbook-modal-header{box-sizing:border-box;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:11px 17px;background:#243038;color:#fff8e9}
 #grade09YearbookDialog #grade09YearbookTitle{margin:0;color:#fff8e9;font:400 23px/1.3 Cinzel,Georgia,serif}
 #grade09YearbookDialog .yearbook-modal-buttons{display:flex;gap:8px;flex-wrap:wrap}
 html:root:root body #grade09YearbookDialog .yearbook-modal-buttons :is(a,button){box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:8px 13px;border:1px solid #b48b45;border-radius:7px;background:#fff8e9;color:#243038;-webkit-text-fill-color:#243038;font:400 16px/1.3 "Brandon Grotesque",Nunito,Arial,sans-serif;text-decoration:none;cursor:pointer}
 #grade09YearbookDialog .yearbook-modal-help{margin:0;padding:9px 14px;color:#243038;background:#f5e8ce;border-bottom:1px solid #b48b45;font:400 16px/1.4 "Brandon Grotesque",Nunito,Arial,sans-serif}
 #grade09YearbookDialog .yearbook-frame{box-sizing:border-box;border:0;display:block;width:100%;flex:1;min-height:0;background:#182625}
 #grade09YearbookDialog .yearbook-modal-buttons :is(a,button):focus-visible{outline:3px solid #d5b77b;outline-offset:2px}
 @media(max-width:620px){html:root:root body #grade09YearbookDialog{width:calc(100vw - 12px);height:94dvh;max-height:94dvh}#grade09YearbookDialog .yearbook-modal-header{padding:9px}#grade09YearbookDialog #grade09YearbookTitle{font-size:20px}}
 `;
 document.head.append(style);
 const shell=document.createElement("div");shell.className="yearbook-modal-shell";
 const header=document.createElement("div");header.className="yearbook-modal-header";
 const heading=document.createElement("h2");heading.id="grade09YearbookTitle";heading.textContent="My School Yearbook";
 const controls=document.createElement("div");controls.className="yearbook-modal-buttons";
 const launch=document.createElement("a");launch.href=yearbookUrl;launch.target="_blank";launch.rel="noopener noreferrer";launch.textContent="Open full Yearbook";
 const close=document.createElement("button");close.type="button";close.textContent="Close";
 controls.append(launch,close);header.append(heading,controls);
 const help=document.createElement("p");help.className="yearbook-modal-help";
 help.textContent="Create a personal photo yearbook. Photos are stored by the Yearbook application in this browser, not in your Academy learner profile. Export a backup to keep your memories.";
 const frame=document.createElement("iframe");frame.className="yearbook-frame";frame.title="Khaemenes Academy Yearbook Studio";
 frame.referrerPolicy="strict-origin-when-cross-origin";frame.loading="lazy";frame.setAttribute("allow","");frame.src=yearbookUrl;
 shell.append(header,help,frame);yearbook.append(shell);document.body.append(yearbook);
 let trigger=null;
 const open=button=>{trigger=button||document.activeElement;if(!yearbook.open)yearbook.showModal();close.focus();};
 close.addEventListener("click",()=>yearbook.close());
 yearbook.addEventListener("click",e=>{if(e.target===yearbook)yearbook.close();});
 yearbook.addEventListener("close",()=>{if(trigger?.isConnected)trigger.focus();});
 window.KhaemenesGrade09Yearbook=Object.freeze({open});
}

// Grade 09 only: relocate the existing course-manager DOM to one accessible dialog.
// The inline course registry continues rendering into its original #courseManagerGrid.
const managerHeading=document.getElementById("manageClassesTitle");
const managerCard=managerHeading?.closest("section.card");
if(managerCard&&!document.getElementById("grade09ManageClassesDialog")){
 const styles=document.createElement("style");
 styles.id="grade09ManageClassesDialogStyle";
 styles.textContent=`
 /* Dialog owns its own card and button styling; do not override unrelated pages. */
 #grade09ManageClassesDialog{box-sizing:border-box;width:min(1180px,calc(100vw - 26px));max-width:1180px;max-height:92dvh;margin:auto;padding:0;border:2px solid #b48b45;border-radius:7px;background:#fffaf0;color:#202724;box-shadow:0 18px 70px #0007;overflow:auto}
 #grade09ManageClassesDialog::backdrop{background:rgba(12,23,25,.76)}
 #grade09ManageClassesDialog .grade09-manager-head{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 18px;background:#202724;color:#fff8e9}
 #grade09ManageClassesDialog .grade09-manager-head strong{font:400 20px/1.35 Cinzel,Georgia,serif;color:#fff8e9}
 html:root:root body .grade09-manage-trigger,
 html:root:root body #grade09ManageClassesDialog .grade09-manager-close{
  box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:46px!important;padding:9px 16px!important;border:1px solid #b48b45!important;border-radius:7px!important;background:#243038!important;background-image:none!important;color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important;opacity:1!important;visibility:visible!important;font:400 16px/1.3 "Brandon Grotesque",Nunito,Arial,sans-serif!important;text-transform:none!important;text-align:center!important;cursor:pointer!important;
 }
 html:root:root body #grade09ManageClassesDialog .grade09-manager-close{min-width:92px!important}
 html:root:root body .grade09-manage-trigger{width:min(100%,320px)!important;margin:12px 0 4px!important}
 html:root:root body .grade09-manage-trigger:hover,
 html:root:root body #grade09ManageClassesDialog .grade09-manager-close:hover{background:#36504a!important;color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important}
 html:root:root body .grade09-manage-trigger:focus-visible,
 html:root:root body #grade09ManageClassesDialog .grade09-manager-close:focus-visible{outline:3px solid #b48b45!important;outline-offset:2px!important}
 #grade09ManageClassesDialog .grade09-manager-body{padding:18px}
 #grade09ManageClassesDialog .grade09-manager-body>.card{box-sizing:border-box;width:100%;max-width:none;margin:0;padding:18px;background:#fffaf0;border:0;box-shadow:none}
 #grade09ManageClassesDialog .grade09-manager-body>.card>h2{margin:0 0 8px;color:#243038;font:400 24px/1.35 Cinzel,Georgia,serif}
 #grade09ManageClassesDialog .grade09-manager-body>.card>p{margin:0 0 18px;color:#42554c;font:400 16px/1.55 "Brandon Grotesque",Nunito,Arial,sans-serif}
 #grade09ManageClassesDialog #courseManagerGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;align-items:stretch;margin-top:12px}
 #grade09ManageClassesDialog #courseManagerGrid>.lesson-card{box-sizing:border-box;display:flex;flex-direction:column;gap:0;min-width:0;min-height:320px;margin:0;padding:12px;border:1px solid #cbbfaa;border-top:3px solid var(--accent,#315f86);border-radius:7px;background:#fffdf8;box-shadow:0 2px 6px rgba(20,33,29,.045)}
 #grade09ManageClassesDialog #courseManagerGrid>.lesson-card .chip-row{box-sizing:border-box;display:flex;flex-wrap:wrap;gap:5px;align-content:start;align-items:flex-start;min-height:0;margin:0 0 11px;padding:0 0 10px;border-bottom:1px solid #e2d9c9}
 #grade09ManageClassesDialog #courseManagerGrid>.lesson-card .chip{box-sizing:border-box;font:400 16px/1.3 "Brandon Grotesque",Nunito,Arial,sans-serif;white-space:normal;overflow-wrap:break-word;color:#364841;background:#f8f3ea}
 #grade09ManageClassesDialog #courseManagerGrid>.lesson-card h3{min-height:0;margin:0 0 10px;color:#243038;font:400 18px/1.35 Cinzel,Georgia,serif;overflow-wrap:break-word}
 #grade09ManageClassesDialog #courseManagerGrid>.lesson-card p{min-height:0;margin:0 0 16px;color:#4b5b55;font:400 16px/1.45 "Brandon Grotesque",Nunito,Arial,sans-serif;overflow-wrap:break-word}
 #grade09ManageClassesDialog #courseManagerGrid>.lesson-card .actions{display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:minmax(46px,auto);gap:6px;align-content:end;margin-top:auto;padding-top:8px}
 html:root:root body #grade09ManageClassesDialog #courseManagerGrid>.lesson-card .actions>:is(a,button){
  box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;min-height:46px!important;height:auto!important;margin:0!important;padding:6px 8px!important;border:1px solid #b48b45!important;border-radius:7px!important;background:#243038!important;background-image:none!important;color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important;opacity:1!important;font:400 16px/1.25 "Brandon Grotesque",Nunito,Arial,sans-serif!important;letter-spacing:0!important;text-transform:none!important;text-align:center!important;text-decoration:none!important;white-space:normal!important;overflow-wrap:break-word!important;
 }
 html:root:root body #grade09ManageClassesDialog #courseManagerGrid>.lesson-card .actions>:is(a,button):hover{background:#36504a!important;color:#fff8e9!important;-webkit-text-fill-color:#fff8e9!important}
 @media(max-width:1050px){#grade09ManageClassesDialog #courseManagerGrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
 @media(max-width:760px){#grade09ManageClassesDialog #courseManagerGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:540px){#grade09ManageClassesDialog{width:calc(100vw - 16px);max-height:93dvh}#grade09ManageClassesDialog .grade09-manager-head{padding:9px}#grade09ManageClassesDialog .grade09-manager-body{padding:8px}#grade09ManageClassesDialog .grade09-manager-body>.card{padding:10px}#grade09ManageClassesDialog #courseManagerGrid{grid-template-columns:minmax(0,1fr)}}
 `;
 document.head.append(styles);
 const modal=document.createElement("dialog");
 modal.id="grade09ManageClassesDialog";
 modal.setAttribute("aria-labelledby","grade09ManageClassesDialogTitle");
 const bar=document.createElement("div");bar.className="grade09-manager-head";
 const label=document.createElement("strong");label.id="grade09ManageClassesDialogTitle";label.textContent="Manage Classes";
 const close=document.createElement("button");close.type="button";close.className="grade09-manager-close";close.textContent="Close";
 close.addEventListener("click",()=>modal.close());
 bar.append(label,close);
 const body=document.createElement("div");body.className="grade09-manager-body";
 body.append(managerCard);
 modal.append(bar,body);
 document.body.append(modal);
 const open=document.createElement("button");open.type="button";open.className="grade09-manage-trigger";open.textContent="Manage Classes";
 // This trigger is created after the page CSS loads. Set the default colors
 // directly so legacy page-level button overrides cannot make it unreadable.
 open.style.setProperty("background-color","#243038","important");
 open.style.setProperty("background-image","none","important");
 open.style.setProperty("color","#fff8e9","important");
 open.style.setProperty("-webkit-text-fill-color","#fff8e9","important");
 open.style.setProperty("border-color","#b48b45","important");
 const scheduleCard=schedule.querySelector(".schedule-card");
 const scheduleHost=schedule.querySelector("[data-grade09-schedule-bar]");
 if(scheduleHost)scheduleHost.insertAdjacentElement("beforebegin",open);
 else if(scheduleCard)scheduleCard.append(open);
 let returnFocus=null;
 open.addEventListener("click",()=>{returnFocus=document.activeElement;if(!modal.open)modal.showModal();});
 modal.addEventListener("close",()=>{if(returnFocus?.isConnected)returnFocus.focus();});
 modal.addEventListener("click",event=>{if(event.target===modal)modal.close();});
}
if(shortcuts)top.insertAdjacentElement("afterend",shortcuts);

if(shortcuts)shortcuts.insertAdjacentElement("afterend",schedule);
else top.insertAdjacentElement("afterend",schedule);
if(progress)schedule.insertAdjacentElement("afterend",progress);
[shortcuts,schedule,progress,portfolio].forEach(align);
const region=document.createElement("section");region.id="grade09Explore";region.className="grade09-explore";
const title=document.createElement("h2");title.textContent="Explore, Create & Celebrate";region.append(title);
const summary=document.createElement("p");summary.textContent="Your creative spaces, personal dreams and earned stickers—organized together so daily classes stay easy to find.";region.append(summary);
const sections=[
 ["khaeStudentEcosystemTools","Creative & Discovery Tools"],
 ["khaeStickerBox","My Sticker Box"],
 ["khaeDreamsAchievements","Achievements & Dream Board"]
];
for(const [id,label] of sections){
 const node=document.getElementById(id);if(!node)continue;
 const details=document.createElement("details");details.className="grade09-explore-item";
 const toggle=document.createElement("summary");toggle.textContent=label;details.append(toggle,node);region.append(details);
 node.style.margin="0";node.style.maxWidth="none";
}
if(portfolio)portfolio.style.maxWidth="none";
main.append(region);
align(region);
})();

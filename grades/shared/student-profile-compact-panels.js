/* Khaemenes High: optional Grade 10–12 profile panels in accessible native dialogs.
   Presentation only. Moves existing DOM nodes without replacing forms, data, events or grades. */
(()=>{
"use strict";
const grade=String(document.body.dataset.grade||"");
if(!["10","11","12"].includes(grade))return;
const main=document.querySelector("main.ug-shell");
const primary=document.querySelector(".ug-priority-nav");
const classes=document.getElementById("upperClasses");
if(!main||!primary||!classes||typeof document.createElement("dialog").showModal!=="function")return;
if(document.getElementById("khaeProfileToolRail"))return;

const rail=document.createElement("nav");
rail.id="khaeProfileToolRail";
rail.className="ug-popup-rail";
rail.setAttribute("aria-label","Additional profile tools");
primary.insertAdjacentElement("afterend",rail);

const definitions=[
  {id:grade==="10"?"grade10Personalize":"upperGradePersonalize",label:"Edit Profile",title:"My profile and study space"},
  {id:"studentCourseProgress",label:"Class Progress",title:"My class progress"},
  {id:"quick-pins",label:"Quick Pins",title:"My personal shortcuts"},
  {id:"my-profile-extras",label:"Study Studio",title:"Study planner and evidence"},
  {id:"khaeDreamsAchievements",label:"Dreams & Achievements",title:"My achievements and dreams"},
  {id:"khaeStickerBox",label:"Sticker Box",title:"My sticker collection"},
  {id:"khaeStudentEcosystemTools",label:"Creative Tools",title:"Creative and discovery tools"}
];
const dialogs=new Map();
let lastOpener=null;

function open(dialog,opener){
 if(!dialog||dialog.open)return;
 lastOpener=opener||document.activeElement;
 dialog.showModal();
 const close=dialog.querySelector(".ug-dialog-close");
 if(close)close.focus();
}
function close(dialog){if(dialog?.open)dialog.close()}

function install(def){
 const node=document.getElementById(def.id);
 if(!node)return;
 const dialog=document.createElement("dialog");
 dialog.id="khaePopup-"+def.id;
 dialog.className="ug-profile-dialog";
 dialog.setAttribute("aria-label",def.title);
 const header=document.createElement("div");
 header.className="ug-dialog-head";
 const heading=document.createElement("h2");
 heading.textContent=def.title;
 const dismiss=document.createElement("button");
 dismiss.type="button";
 dismiss.className="ug-dialog-close";
 dismiss.textContent="Close ✕";
 dismiss.setAttribute("aria-label","Close "+def.title);
 dismiss.addEventListener("click",()=>close(dialog));
 header.append(heading,dismiss);
 const body=document.createElement("div");
 body.className="ug-dialog-body";
 dialog.append(header,body);
 main.append(dialog);
 body.append(node);

 const trigger=document.createElement("button");
 trigger.type="button";
 trigger.dataset.profileDialogFor=def.id;
 trigger.setAttribute("aria-haspopup","dialog");
 trigger.setAttribute("aria-controls",dialog.id);
 trigger.textContent=def.label;
 trigger.addEventListener("click",()=>open(dialog,trigger));
 rail.append(trigger);

 dialog.addEventListener("close",()=>{
   if(lastOpener?.isConnected&&typeof lastOpener.focus==="function")lastOpener.focus();
   lastOpener=null;
 });
 dialog.addEventListener("click",event=>{
   if(event.target===dialog)close(dialog);
 });
 dialogs.set(def.id,{dialog,body,trigger});
}

// The dream board starts inside the study studio; moving it first retains its event listeners.
const dream=definitions.find(x=>x.id==="khaeDreamsAchievements");
install(dream);
definitions.filter(x=>x!==dream).forEach(install);

// Links in the existing header remain meaningful even though panels now live in dialogs.
document.addEventListener("click",event=>{
 const anchor=event.target.closest?.('a[href^="#"]');
 if(!anchor)return;
 const id=anchor.getAttribute("href").slice(1);
 let target=dialogs.get(id)?.dialog;
 if(!target){
   const element=document.getElementById(id);
   target=element?.closest?.(".ug-profile-dialog")||null;
 }
 if(!target)return;
 event.preventDefault();
 open(target,anchor);
});

// Pin/unpin updates rebuild only the seven-class engine. Replace the optional Quick Pins
// presentation in its dialog, rather than losing the dialog or showing a second inline grid.
const quick=dialogs.get("quick-pins");
if(quick&&typeof MutationObserver!=="undefined"){
 const sync=()=>{
   const fresh=classes.querySelector("#quick-pins");
   if(!fresh)return;
   const old=quick.body.querySelector("#quick-pins");
   if(old&&old!==fresh)old.remove();
   quick.body.append(fresh);
 };
 const observer=new MutationObserver(sync);
 observer.observe(classes,{childList:true});
}
})();
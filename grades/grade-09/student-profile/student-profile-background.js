/* Grade 09 learner-owned background studio.
 * Reuses the original page-color key; keeps profile photo, records, schedules,
 * course pins, and shared Academy components outside this presentation module.
 * No uploads leave this browser and no external libraries are required.
 */
(()=>{
"use strict";
const row=document.querySelector(".grade09-profile-first .profile-row");
const toolGrid=document.querySelector("#khaeProfileToolRail > div");
if(!row||!toolGrid||document.getElementById("grade09BackgroundDialog"))return;

const base="#f4f0e7";
const colorsKey=id=>"khaemenes.grade09.profile.background:"+encodeURIComponent(id);
const sectionsKey=id=>"khaemenes.grade09.profile.background.sections.v1:"+encodeURIComponent(id);
const stickerKey=id=>"khaemenes.grade09.profile.background.sticker:"+encodeURIComponent(id);
const imageKey=id=>"khaemenes.grade09.profile.background.image:"+encodeURIComponent(id);
const emojiList=["","✨","⭐","🌟","🌸","🌿","🌻","🎨","🎓","📚","🎵","🦋","🌈","🪐"];
const isColor=v=>typeof v==="string"&&/^#[0-9a-f]{6}$/i.test(v);
const person=()=>{
 const a=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
 const b=window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId;
 return a&&b&&String(a)!==String(b)?null:(a?String(a):(b?String(b):null));
};
const read=k=>{try{return localStorage.getItem(k)}catch{return null}};
const write=(k,v)=>{try{localStorage.setItem(k,v);return true}catch{return false}};
const erase=k=>{try{localStorage.removeItem(k);return true}catch{return false}};
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
const titleCard=id=>document.getElementById(id)?.closest(".card")||null;
const namedCard=name=>[...document.querySelectorAll("main .card h2")].find(h=>h.textContent.trim()===name)?.closest(".card")||null;

// Each surface has one stable settings identifier and a separately resolved DOM owner.
// Shared header/tickers, photo-dialog internals, class tiles and course logic are untouched.
const surfaces=[
 {key:"identity",title:"Photo & Personal Information",find:()=>row.closest(".card")},
 {key:"tools",title:"My Profile Tools",find:()=>document.getElementById("khaeProfileToolRail")},
 {key:"today",title:"Today's First Step",find:()=>titleCard("todayTitle")},
 {key:"pinned",title:"My Pinned Classes",find:()=>document.getElementById("classes")},
 {key:"schedule",title:"My Schedule Bar",find:()=>document.querySelector(".grade09-priority-schedule .schedule-card")},
 {key:"progress",title:"My Class Progress",find:()=>document.getElementById("studentCourseProgress")},
 {key:"portfolio",title:"Student Learning Portfolio",find:()=>document.querySelector('main aside[aria-label="Student Learning Portfolio"]')},
 {key:"learning",title:"My Learning Today",find:()=>document.getElementById("learningToday")},
 {key:"manager",title:"Manage Classes & Mathematics Pathway",find:()=>titleCard("manageClassesTitle")},
 {key:"rooms",title:"Student Rooms",find:()=>titleCard("doorsTitle")},
 {key:"family",title:"Parent Access Rule",find:()=>namedCard("Parent Access Rule")},
 {key:"campus",title:"Need a Different Door?",find:()=>namedCard("Need a Different Door?")},
 {key:"explore",title:"Explore, Create & Celebrate",find:()=>document.getElementById("grade09Explore")},
 {key:"creative",title:"Creative & Discovery Tools",find:()=>document.getElementById("khaeStudentEcosystemTools")},
 {key:"stickerbox",title:"My Sticker Box",find:()=>document.getElementById("khaeStickerBox")},
 {key:"dreams",title:"Achievements & Dream Board",find:()=>document.getElementById("khaeDreamsAchievements")}
];
const captured=new Map();
function override(element,property,value){
 if(!element)return;
 let saved=captured.get(element);
 if(!saved){saved=new Map();captured.set(element,saved)}
 if(!saved.has(property))saved.set(property,[element.style.getPropertyValue(property),element.style.getPropertyPriority(property)]);
 element.style.setProperty(property,value,"important");
}
function restore(){
 for(const [element,properties] of captured){
  for(const [property,[value,priority]] of properties){
   if(value)element.style.setProperty(property,value,priority);
   else element.style.removeProperty(property);
  }
 }
 captured.clear();
}
const luminance=hex=>{
 const values=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));
 return values[0]*.2126+values[1]*.7152+values[2]*.0722;
};
const inkFor=color=>{
 const l=luminance(color),dark=luminance("#243038"),light=luminance("#fff8e9");
 return (Math.max(l,dark)+.05)/(Math.min(l,dark)+.05)>=(Math.max(l,light)+.05)/(Math.min(l,light)+.05)?"#243038":"#fff8e9";
};
function tile(emoji){
 if(!emojiList.includes(emoji)||!emoji)return "";
 try{
  const canvas=document.createElement("canvas");canvas.width=canvas.height=144;
  const ctx=canvas.getContext("2d");if(!ctx)return "";
  ctx.globalAlpha=.28;ctx.font='35px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
  ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(emoji,72,72);
  return canvas.toDataURL("image/png");
 }catch{return ""}
}
function paintCard(element,mode,color,sticker,isFirstStep=false){
 if(!element)return;
 const stickerImage=tile(sticker);
 if(mode==="default"&&!stickerImage)return;
 const targets=isFirstStep?[element,element.querySelector(".focus-card")].filter(Boolean):[element];
 for(const surface of targets){
  if(mode!=="default"){
   override(surface,"background-color",color);
   override(surface,"background-image",stickerImage?'url("'+stickerImage+'")':"none");
   override(surface,"color",inkFor(color));
   const ink=inkFor(color);
   // Text-only descendants inherit accessible contrast; course tiles, controls,
   // photos, and nested widgets keep their own intentionally distinct styling.
   for(const textNode of surface.querySelectorAll("h2,h3,p,small,.profile-name,.subline")){
    if(textNode.closest("dialog,.schedule-tile,.lesson-card,.door,button,a,.chip,.grade09-photo-controls,.grade09-background-controls"))continue;
    override(textNode,"color",ink);
    override(textNode,"-webkit-text-fill-color",ink);
   }
  }else if(stickerImage){
   const original=getComputedStyle(surface).backgroundImage;
   override(surface,"background-image",'url("'+stickerImage+'")'+(original&&original!=="none"?", "+original:""));
  }
  if(stickerImage){
   override(surface,"background-size","144px 144px");
   override(surface,"background-repeat","repeat");
  }
 }
}
let currentOwner=null, pageColor=base, pageSticker="", savedImage="", sectionPrefs={};
function readSections(owner){
 if(!owner)return {};
 try{
  const data=JSON.parse(read(sectionsKey(owner))||"{}");
  if(!data||typeof data!=="object"||Array.isArray(data))return {};
  const result={};
  for(const s of surfaces){
   const record=data[s.key];if(!record||typeof record!=="object")continue;
   const mode=["default","page","custom"].includes(record.mode)?record.mode:"default";
   result[s.key]={mode,color:isColor(record.color)?record.color:base,emoji:emojiList.includes(record.emoji)?record.emoji:""};
  }
  return result;
 }catch{return {}}
}
function applyAll(){
 restore();
 // The original page-color variables and storage key remain authoritative.
 override(document.documentElement,"--student-custom-bg",pageColor);
 override(document.documentElement,"--paper",pageColor);
 override(document.documentElement,"background-color",pageColor);
 override(document.body,"background-color",pageColor);
 document.body.dataset.studentCustomBackground=luminance(pageColor)>.3?"light":"dark";
 const stickerImage=tile(pageSticker);
 const layers=[];
 if(stickerImage)layers.push('url("'+stickerImage+'")');
 if(savedImage)layers.push('url("'+savedImage+'")');
 if(layers.length){
  override(document.body,"background-image",layers.join(", "));
  override(document.body,"background-size",(stickerImage?"144px 144px":"")+(stickerImage&&savedImage?", ":"")+(savedImage?"cover":""));
  override(document.body,"background-repeat",(stickerImage?"repeat":"")+(stickerImage&&savedImage?", ":"")+(savedImage?"no-repeat":""));
  override(document.body,"background-position",(stickerImage?"center top":"")+(stickerImage&&savedImage?", ":"")+(savedImage?"center center":""));
  override(document.body,"background-attachment",(stickerImage?"scroll":"")+(stickerImage&&savedImage?", ":"")+(savedImage?"fixed":""));
 }
 for(const section of surfaces){
  const pref=sectionPrefs[section.key]||{mode:"default",color:base,emoji:""};
  const color=pref.mode==="page"?pageColor:pref.color;
  paintCard(section.find(),pref.mode,color,pref.emoji,section.key==="today");
 }
}
function message(text){status.textContent=text}
function formInput(type,labelText){
 const wrap=el("label");
 wrap.style.cssText="display:grid;gap:5px;min-width:0;color:#243038;font:400 16px/1.35 Nunito,Arial,sans-serif";
 const label=el("span",labelText);
 const input=document.createElement("input");input.type=type;
 input.style.cssText="box-sizing:border-box;max-width:100%;min-height:44px;border:1px solid #a79b83;border-radius:7px;padding:5px;background:#fffaf0;color:#243038;font:400 16px/1.35 Nunito,Arial,sans-serif";
 wrap.append(label,input);return {wrap,input};
}
function dropdown(labelText,options){
 const wrap=el("label");
 wrap.style.cssText="display:grid;gap:5px;min-width:0;color:#243038;font:400 16px/1.35 Nunito,Arial,sans-serif";
 wrap.append(el("span",labelText));
 const select=document.createElement("select");
 select.style.cssText="box-sizing:border-box;width:100%;min-height:44px;min-width:0;padding:7px;border:1px solid #a79b83;border-radius:7px;background:#fffaf0;color:#243038;font:400 16px/1.35 Nunito,Arial,sans-serif";
 for(const [value,label] of options){const option=el("option",label);option.value=value;select.append(option)}
 wrap.append(select);return {wrap,input:select};
}
function action(label){
 const button=el("button",label);button.type="button";
 button.style.cssText="box-sizing:border-box;min-height:44px;padding:8px 13px;border:1px solid #243038;border-radius:7px;background:#243038;color:#fff8e9;font:400 16px/1.35 Nunito,Arial,sans-serif;cursor:pointer";
 return button;
}
const popup=document.createElement("dialog");
popup.id="grade09BackgroundDialog";
popup.setAttribute("aria-labelledby","grade09BackgroundDialogTitle");
popup.style.cssText="box-sizing:border-box;width:min(96vw,820px);max-width:96vw;max-height:88vh;overflow:auto;margin:auto;padding:20px;border:1px solid #b48b45;border-radius:7px;background:#fffaf0;color:#243038;box-shadow:0 22px 65px rgba(11,22,22,.4)";
const toolbar=el("div");
toolbar.style.cssText="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:10px";
const title=el("h2","Customize My Background");
title.id="grade09BackgroundDialogTitle";
title.style.cssText="margin:0;color:#243038;font:400 26px/1.3 Cinzel,Georgia,serif";
const close=action("Close ✕");close.addEventListener("click",()=>popup.close());
toolbar.append(title,close);
const explanation=el("p","Choose one page background, then optionally give each section its own color and emoji sticker. Original design restores each section's Academy styling. All settings stay with the selected learner on this device.");
explanation.style.cssText="margin:0 0 15px;font:400 16px/1.5 Nunito,Arial,sans-serif";
const status=el("p","");
status.setAttribute("role","status");status.setAttribute("aria-live","polite");
status.style.cssText="margin:12px 0;padding:9px;border:1px solid #b9ac91;border-radius:7px;color:#243038;background:#f5edda;font:400 16px/1.4 Nunito,Arial,sans-serif";

const design=window.KhaemenesGrade09Design;
// Existing Design Studio features now live in the one Customize Background dialog.
const designGroup=el("section");
designGroup.style.cssText="display:grid;gap:12px;padding:14px;border:1px solid #c8b897;border-radius:7px;background:#fffdf8;margin-bottom:16px";
const designHeading=el("h3","Workspace Design");
designHeading.style.cssText="margin:0;font:400 22px/1.25 Cinzel,Georgia,serif;color:#243038";
const designInfo=el("p","Theme, accent and layout density apply across your dashboard. Photo frame and avatar mark choices belong to Customize Picture.");
designInfo.style.cssText="margin:0;color:#243038;font:400 16px/1.5 Nunito,Arial,sans-serif";
const designRow=el("div");
designRow.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:10px";
const themeControl=dropdown("Workspace Theme",[["parchment","Ivory Parchment"],["forest","Forest Study"],["midnight","Midnight Study"]]);
const accentControl=dropdown("Accent",[["gold","Academy Gold"],["teal","Scholar Teal"],["plum","Library Plum"]]);
const densityControl=dropdown("Dashboard Density",[["comfortable","Comfortable"],["compact","Compact"]]);
designRow.append(themeControl.wrap,accentControl.wrap,densityControl.wrap);
const designActions=el("div");designActions.style.cssText="display:flex;flex-wrap:wrap;gap:9px";
const previewDesign=action("Preview Workspace"),saveDesign=action("Save Workspace Design"),restoreDesign=action("Restore Academy Workspace");
designActions.append(previewDesign,saveDesign,restoreDesign);
designGroup.append(designHeading,designInfo,designRow,designActions);
const workspaceValues=()=>({theme:themeControl.input.value,accent:accentControl.input.value,density:densityControl.input.value});
const workspaceResetPreview=()=>{if(design?.apply&&design?.read)design.apply(design.read())};
previewDesign.addEventListener("click",()=>{
 const owner=person();if(!owner||owner!==currentOwner||!design?.apply){message("Select an Academy learner before previewing workspace themes.");return}
 design.apply({...design.read(),...workspaceValues()});
 message("Preview applied. Select Save Workspace Design to keep these preferences.");
});
saveDesign.addEventListener("click",()=>{
 const owner=person();if(!owner||owner!==currentOwner||!design?.write){message("Select an Academy learner before saving workspace settings.");return}
 if(!design.write({...design.read(),...workspaceValues()})){workspaceResetPreview();message("Unable to save the workspace design.");return}
 message("Workspace theme, accent and density saved. Your picture and frame were preserved.");
});
restoreDesign.addEventListener("click",()=>{
 const owner=person();if(!owner||owner!==currentOwner||!design?.write){message("Select an Academy learner before restoring the workspace.");return}
 if(!design.write({...design.read(),theme:"parchment",accent:"gold",density:"comfortable"})){workspaceResetPreview();message("Unable to restore workspace settings.");return}
 themeControl.input.value="parchment";accentControl.input.value="gold";densityControl.input.value="comfortable";
 message("Academy workspace design restored; picture and avatar settings remain saved.");
});
const pageGroup=el("section");
pageGroup.style.cssText="display:grid;gap:12px;padding:14px;border:1px solid #c8b897;border-radius:7px;background:#f8f2e7;margin-bottom:16px";
const pageHeading=el("h3","Page Background");
pageHeading.style.cssText="margin:0;font:400 22px/1.25 Cinzel,Georgia,serif";
const pageColorControl=formInput("color","Page color");
pageColorControl.input.value=base;
pageColorControl.input.setAttribute("aria-label","Choose full-page background color");
const resetPage=action("Restore Default Page Color");
const pageRow=el("div");
pageRow.style.cssText="display:flex;gap:12px;align-items:end;flex-wrap:wrap";
pageRow.append(pageColorControl.wrap,resetPage);
const pageEmoji=dropdown("Page emoji stickers",emojiList.map(v=>[v,v||"No stickers"]));
const upload=formInput("file","Upload a background image (JPG, PNG, WebP, up to 5 MB)");
upload.input.accept="image/jpeg,image/png,image/webp";
const removeImage=action("Remove Background Image");
const imageNote=el("p","An uploaded picture is resized locally for this learner; no image is sent to a server.");
imageNote.style.cssText="margin:0;font:400 16px/1.45 Nunito,Arial,sans-serif";
pageGroup.append(pageHeading,pageRow,pageEmoji.wrap,upload.wrap,removeImage,imageNote);
const sectionsGroup=el("section");
sectionsGroup.style.cssText="display:grid;gap:10px;margin-top:12px";
const sectionsHeading=el("h3","Independent Section Colors & Stickers");
sectionsHeading.style.cssText="margin:0;font:400 22px/1.25 Cinzel,Georgia,serif";
const guidance=el("p","Use Original design to retain each card's original color, Match page color to follow your page selection, or Custom color to choose independently.");
guidance.style.cssText="margin:0 0 5px;font:400 16px/1.4 Nunito,Arial,sans-serif";
sectionsGroup.append(sectionsHeading,guidance);
const rows=new Map();
for(const section of surfaces){
 const panel=el("div");
 panel.style.cssText="display:grid;gap:9px;padding:12px;border:1px solid #c8b897;border-radius:7px;background:#fffdf8";
 const header=el("h4",section.title);
 header.style.cssText="margin:0;font:400 18px/1.3 Cinzel,Georgia,serif;color:#243038";
 const controls=el("div");
 controls.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:9px";
 const mode=dropdown("Background",[
  ["default","Original design"],["page","Match page color"],["custom","Custom color"]
 ]);
 const color=formInput("color","Section color");color.input.value=base;
 const emoji=dropdown("Emoji sticker",emojiList.map(v=>[v,v||"No sticker"]));
 controls.append(mode.wrap,color.wrap,emoji.wrap);
 panel.append(header,controls);sectionsGroup.append(panel);
 rows.set(section.key,{mode:mode.input,color:color.input,emoji:emoji.input});
 const update=()=>{
  const owner=person();if(!owner||owner!==currentOwner){refresh();message("Select your Academy learner before saving colors.");return}
  const last=sectionPrefs[section.key];
  const next={mode:mode.input.value,color:color.input.value,emoji:emoji.input.value};
  sectionPrefs[section.key]=next;
  if(!write(sectionsKey(owner),JSON.stringify(sectionPrefs))){
   if(last)sectionPrefs[section.key]=last;else delete sectionPrefs[section.key];
   refresh();message("Could not save this section. Browser storage may be full.");return;
  }
  color.input.disabled=next.mode!=="custom";
  applyAll();
  message(section.title+" appearance saved.");
 };
 for(const control of [mode.input,color.input,emoji.input])control.addEventListener("change",update);
}
popup.append(toolbar,explanation,designGroup,pageGroup,sectionsGroup,status);
document.body.append(popup);
const opener=action("Customize Background");
opener.id="openGrade09BackgroundDialog";
opener.className="grade09-profile-tool";
opener.setAttribute("aria-haspopup","dialog");
opener.setAttribute("aria-controls",popup.id);
opener.style.cssText="box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:100%;min-width:0;min-height:56px;padding:10px 12px;border:1px solid #65716c;border-radius:7px;background:#33454b;text-align:center;font:400 16px/1.3 Nunito,Arial,sans-serif;cursor:pointer";
opener.style.setProperty("color","#fff8e9","important");
opener.style.setProperty("-webkit-text-fill-color","#fff8e9","important");
opener.addEventListener("click",()=>{refresh();popup.showModal();close.focus()});
popup.addEventListener("close",()=>{workspaceResetPreview();if(opener.isConnected)opener.focus()});
popup.addEventListener("click",event=>{if(event.target===popup)popup.close()});
toolGrid.append(opener);

function refresh(){
 const owner=person();
 currentOwner=owner;
 pageColor=owner&&isColor(read(colorsKey(owner)))?read(colorsKey(owner)):base;
 pageSticker=owner&&emojiList.includes(read(stickerKey(owner)))?read(stickerKey(owner)):"";
 const rawImage=owner?read(imageKey(owner))||"":"";
 savedImage=/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(rawImage)&&rawImage.length<700000?rawImage:"";
 sectionPrefs=readSections(owner);
 const currentDesign=design?.read?.();
 themeControl.input.value=currentDesign?.theme||"parchment";
 accentControl.input.value=currentDesign?.accent||"gold";
 densityControl.input.value=currentDesign?.density||"comfortable";
 for(const control of [themeControl.input,accentControl.input,densityControl.input,previewDesign,saveDesign,restoreDesign])
  control.disabled=!owner||!design?.write;
 pageColorControl.input.value=pageColor;
 pageEmoji.input.value=pageSticker;
 for(const [key,controls] of rows){
  const pref=sectionPrefs[key]||{mode:"default",color:base,emoji:""};
  controls.mode.value=pref.mode;
  controls.color.value=pref.color;
  controls.emoji.value=pref.emoji;
  controls.color.disabled=!owner||pref.mode!=="custom";
 }
 for(const node of [pageColorControl.input,resetPage,pageEmoji.input,upload.input,removeImage]){
  node.disabled=!owner;
 }
 removeImage.disabled=!owner||!savedImage;
 for(const controls of rows.values()){
  controls.mode.disabled=!owner;
  controls.emoji.disabled=!owner;
 }
 if(!owner)message("Choose your Academy learner to save background settings. No personal settings are shown.");
 else message("Changes are stored privately on this device for the selected learner.");
 applyAll();
}
pageColorControl.input.addEventListener("input",()=>{
 if(!currentOwner)return;
 pageColor=pageColorControl.input.value;
 applyAll();message("Preview only. Release the color picker to save.");
});
pageColorControl.input.addEventListener("change",()=>{
 const owner=person();if(!owner||owner!==currentOwner){refresh();return}
 if(!write(colorsKey(owner),pageColorControl.input.value)){
  refresh();message("Unable to save the page color.");return
 }
 pageColor=pageColorControl.input.value;applyAll();message("Page background color saved.");
});
resetPage.addEventListener("click",()=>{
 const owner=person();if(!owner||owner!==currentOwner){refresh();return}
 if(!erase(colorsKey(owner))){message("Unable to restore the page color.");return}
 pageColor=base;pageColorControl.input.value=base;applyAll();message("Default page color restored. Section choices are preserved.");
});
pageEmoji.input.addEventListener("change",()=>{
 const owner=person();if(!owner||owner!==currentOwner){refresh();return}
 const value=pageEmoji.input.value;
 if(value?!write(stickerKey(owner),value):!erase(stickerKey(owner))){
  refresh();message("Unable to save your page sticker.");return
 }
 pageSticker=value;applyAll();message(value?"Page stickers saved.":"Page stickers removed.");
});
upload.input.addEventListener("change",async()=>{
 const owner=person();
 if(!owner||owner!==currentOwner){refresh();return}
 const file=upload.input.files?.[0];if(!file)return;
 if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5*1024*1024){
  message("Choose a JPG, PNG, or WebP image smaller than 5 MB.");upload.input.value="";return
 }
 const url=URL.createObjectURL(file);
 try{
  message("Processing background image locally…");
  const image=new Image();
  await new Promise((ok,fail)=>{image.onload=ok;image.onerror=fail;image.src=url});
  if(person()!==owner||currentOwner!==owner){refresh();return}
  const canvas=document.createElement("canvas");
  const scale=Math.min(1,1280/Math.max(image.naturalWidth,image.naturalHeight));
  canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
  canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
  const context=canvas.getContext("2d");if(!context)throw Error("Canvas unavailable");
  context.drawImage(image,0,0,canvas.width,canvas.height);
  let data=canvas.toDataURL("image/jpeg",.7);
  if(data.length>=650000){
   canvas.width=Math.max(1,Math.round(canvas.width*.72));
   canvas.height=Math.max(1,Math.round(canvas.height*.72));
   context.drawImage(image,0,0,canvas.width,canvas.height);
   data=canvas.toDataURL("image/jpeg",.57);
  }
  if(data.length>=650000)throw Error("Please choose a simpler or smaller image");
  if(person()!==owner||currentOwner!==owner){refresh();return}
  if(!write(imageKey(owner),data))throw Error("Browser storage is full");
  savedImage=data;applyAll();removeImage.disabled=false;
  message("Background image saved on this device for the selected learner.");
 }catch(error){message("Background image could not be saved. Try a smaller image; your previous image is preserved.")}
 finally{URL.revokeObjectURL(url);upload.input.value=""}
});
removeImage.addEventListener("click",()=>{
 const owner=person();if(!owner||owner!==currentOwner){refresh();return}
 if(!erase(imageKey(owner))){message("Unable to remove background image.");return}
 savedImage="";removeImage.disabled=true;applyAll();message("Background image removed; colors and stickers remain.");
});
window.addEventListener("pageshow",refresh);
window.addEventListener("khaemenes-student-profile-changed",refresh);
window.addEventListener("khaemenes-grade09-design-changed",()=>{
 const current=design?.read?.();
 if(current&&person()===currentOwner){
  themeControl.input.value=current.theme;accentControl.input.value=current.accent;densityControl.input.value=current.density;
 }
});
window.addEventListener("storage",event=>{
 if(!event.key||event.key==="khaemenes_active_learner_v1"||
  (currentOwner&&[colorsKey(currentOwner),sectionsKey(currentOwner),stickerKey(currentOwner),imageKey(currentOwner)].includes(event.key)))refresh();
});
refresh();
})();
/* Grade 09 learner-owned background studio.
 * Reuses the original page-color key; keeps profile photo, records, schedules,
 * course pins, and shared Academy components outside this presentation module.
 * No uploads leave this browser and no external libraries are required.
 */
(()=>{
"use strict";
const pageGrade=document.body?.dataset.grade||"";
if(["10","11","12"].includes(pageGrade)){
 const registered=window.KhaemenesHighProfileGradeContext?.active?.();
 // Don't mount an editor for another grade or an unselected learner.
 if(!registered||registered.gradeNumber!==Number(pageGrade))return;
}

const row=document.querySelector(".grade09-profile-first .profile-row");
const toolGrid=document.querySelector("#khaeProfileToolRail > div");
if(!row||!toolGrid||document.getElementById("grade09BackgroundDialog"))return;

const base="#f4f0e7";
const GUEST="__grade09_guest_design__";
const storageOwner=()=>person()||GUEST;
const colorsKey=id=>"khaemenes.grade09.profile.background:"+encodeURIComponent(id);
const sectionsKey=id=>"khaemenes.grade09.profile.background.sections.v1:"+encodeURIComponent(id);
const stickerKey=id=>"khaemenes.grade09.profile.background.sticker:"+encodeURIComponent(id);
const earnedKey=id=>"khaemenes.student.stickers.v1:"+encodeURIComponent(id);
const imageKey=id=>"khaemenes.grade09.profile.background.image:"+encodeURIComponent(id);
const emojiList=["","✨","⭐","🌟","🌸","🌿","🌻","🎨","🎓","📚","🎵","🦋","🌈","🪐"];
const isColor=v=>typeof v==="string"&&/^#[0-9a-f]{6}$/i.test(v);
const person=()=>{
 const a=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
 const b=window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId;
 return a&&b&&String(a)!==String(b)?null:(a?String(a):(b?String(b):null));
};
const read=k=>{try{return localStorage.getItem(k)}catch{return null}};
function earnedStickers(owner){
 if(!owner)return [];
 try{
  const data=JSON.parse(read(earnedKey(owner))||"null");
  return Array.isArray(data?.placed)?[...new Set(data.placed.filter(x=>typeof x==="string"&&x.length<=8))].slice(0,36):[];
 }catch{return []}
}
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
 {key:"today",title:"To Do Today",find:()=>titleCard("todayTitle")},
 {key:"schedule",title:"Schedule Popup",find:()=>document.querySelector("#grade09ScheduleDialog .grade09-schedule-dialog-body")},
 {key:"progress",title:"Class Progress Popup",find:()=>document.querySelector("#grade09ClassProgressDialog .grade09-progress-dialog-content")},
 {key:"klasaipeer",title:"KlasaiPeer Popup",find:()=>document.querySelector("#grade09StudyStudioDialog .g09s-body")},
 {key:"manager",title:"Manage Classes Popup",find:()=>document.querySelector("#grade09ManageClassesDialog .grade09-manager-body")},
 {key:"portfolio",title:"Student Learning Portfolio",find:()=>document.querySelector('main aside[aria-label="Student Learning Portfolio"]')},
 {key:"learning",title:"My Learning Today",find:()=>document.getElementById("learningToday")},
 {key:"rooms",title:"Student Rooms",find:()=>titleCard("doorsTitle")},
 {key:"family",title:"Parent Access Rule",find:()=>namedCard("Parent Access Rule")},
 {key:"campus",title:"Need a Different Door?",find:()=>namedCard("Need a Different Door?")},
 {key:"explore",title:"Explore, Create & Celebrate",find:()=>document.getElementById("grade09Explore")},
 {key:"creative",title:"Creative Tools",find:()=>document.getElementById("khaeStudentEcosystemTools")},
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
 if(typeof emoji!=="string"||!emoji||emoji.length>8)return "";
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
   if(surface.matches(".g09s-body")){
    for(const node of surface.querySelectorAll(":scope > p,:scope > label")){
     override(node,"color",ink);override(node,"-webkit-text-fill-color",ink);
    }
   }
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
 try{
  const data=JSON.parse(read(sectionsKey(owner))||"{}");
  if(!data||typeof data!=="object"||Array.isArray(data))return {};
  const result={};
  for(const s of surfaces){
   const record=data[s.key];if(!record||typeof record!=="object")continue;
   const mode=["default","page","custom"].includes(record.mode)?record.mode:"default";
   result[s.key]={mode,color:isColor(record.color)?record.color:base,emoji:(emojiList.includes(record.emoji)||earnedStickers(owner).includes(record.emoji))?record.emoji:""};
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
const explanation=el("p","Set a different background color and sticker for the page and each popup. Changes are saved on this browser immediately. With a learner selected they are learner-specific; without one they are stored as a separate guest design.");
explanation.style.cssText="margin:0 0 15px;font:400 16px/1.5 Nunito,Arial,sans-serif";
const status=el("p","");
status.setAttribute("role","status");status.setAttribute("aria-live","polite");
status.style.cssText="margin:12px 0;padding:9px;border:1px solid #b9ac91;border-radius:7px;color:#243038;background:#f5edda;font:400 16px/1.4 Nunito,Arial,sans-serif";

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
const rewardInfo=el("p","Earned Sticker Box designs appear here once claimed. Decorative emojis are separate from earned rewards.");
rewardInfo.style.cssText="margin:0;color:#243038;font:400 16px/1.45 Nunito,Arial,sans-serif";
const rewardOpen=action("Open My Sticker Box");
rewardOpen.addEventListener("click",()=>{
 const dialog=window.KhaemenesGrade09StickerBoxDialog;
 if(!dialog?.open){message("Sticker Box is unavailable. The reward records have not been changed.");return}
 dialog.open(rewardOpen);
});
function updateRewardOptions(select,owner){
 const previous=select.value;
 for(const option of [...select.options]){
  if(option.dataset.earnedSticker==="yes")option.remove();
  else option.textContent=option.value||"No sticker";
 }
 const earned=earnedStickers(owner);
 for(const emoji of earned){
  const existing=[...select.options].find(option=>option.value===emoji);
  if(existing){existing.textContent=emoji+" · Earned in Sticker Box";continue}
  const option=el("option",emoji+" · Earned in Sticker Box");
  option.value=emoji;option.dataset.earnedSticker="yes";select.append(option);
 }
 select.value=[...select.options].some(option=>option.value===previous)?previous:"";
 rewardInfo.textContent=owner?(earned.length?earned.length+" claimed Sticker Box designs are ready for page and popup backgrounds.":"No claimed stickers yet. Verified unit-quiz rewards appear after they are claimed in My Sticker Box."):"Select an Academy learner to see earned Sticker Box designs. Decorative emojis remain available for unsaved previews.";
}
const upload=formInput("file","Upload a background image (JPG, PNG, WebP, up to 5 MB)");
upload.input.accept="image/jpeg,image/png,image/webp";
const removeImage=action("Remove Background Image");
const imageNote=el("p","Choose a JPG, PNG, or WebP. The image is resized and stored locally in this browser. Guest uploads stay separate from learner images; nothing is uploaded to a server.");
imageNote.style.cssText="margin:0;font:400 16px/1.45 Nunito,Arial,sans-serif";
pageGroup.append(pageHeading,pageRow,pageEmoji.wrap,rewardInfo,rewardOpen,upload.wrap,removeImage,imageNote);
const saveAll=action("Save All Background Choices");
saveAll.addEventListener("click",()=>{
 const owner=person();
 if(owner!==currentOwner){refresh();message("Learner changed; reopen the editor to save.");return}
 const scope=storageOwner();
 const updates=[[colorsKey(scope),pageColor],[sectionsKey(scope),JSON.stringify(sectionPrefs)],[stickerKey(scope),pageSticker]];
 const previous=updates.map(([key])=>[key,read(key)]);
 let saved=true;
 for(const [key,value] of updates){if(!write(key,value)){saved=false;break}}
 if(!saved){
  for(const [key,value] of previous){if(value===null)erase(key);else write(key,value)}
  message("Could not save choices. Check browser storage and try again.");return
 }
 message(owner?"All background choices saved for the selected learner.":"All background choices saved as an isolated browser-only guest design.");
});
const sectionsGroup=el("section");
sectionsGroup.style.cssText="display:grid;gap:10px;margin-top:12px";
const sectionsHeading=el("h3","Independent Section Colors & Stickers");
sectionsHeading.style.cssText="margin:0;font:400 22px/1.25 Cinzel,Georgia,serif";
const guidance=el("p","Original design retains the Academy styling. Match page color follows the page choice; Custom color lets each screen have its own appearance.");
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
 panel.append(header,controls);
 const popupIds={schedule:"grade09ScheduleDialog",progress:"grade09ClassProgressDialog",klasaipeer:"grade09StudyStudioDialog",manager:"grade09ManageClassesDialog"};
 const targetId=popupIds[section.key];
 if(targetId){
  const preview=action("Preview "+section.title);
  preview.addEventListener("click",()=>{
   const target=document.getElementById(targetId);
   if(!target||typeof target.showModal!=="function"){message("This popup is not mounted on the page. Its saved preference was preserved.");return}
   applyAll();
   if(!target.open)target.showModal();
   target.addEventListener("close",()=>{if(popup.open)preview.focus()},{once:true});
  });
  panel.append(preview);
 }
 sectionsGroup.append(panel);
 rows.set(section.key,{mode:mode.input,color:color.input,emoji:emoji.input,panel});
 const update=()=>{
  const owner=person();if(owner!==currentOwner){refresh();message("Learner selection changed; reopen the editor.");return}
  const last=sectionPrefs[section.key];
  const next={mode:mode.input.value,color:color.input.value,emoji:emoji.input.value};
  sectionPrefs[section.key]=next;
  if(!write(sectionsKey(storageOwner()),JSON.stringify(sectionPrefs))){
   if(last)sectionPrefs[section.key]=last;else delete sectionPrefs[section.key];
   refresh();message("Could not save this section. Browser storage may be full.");return;
  }
  color.input.disabled=next.mode!=="custom";
  applyAll();
  message(section.title+(owner?" appearance saved for learner.":" saved to this browser as guest design."));
 };
 for(const control of [mode.input,color.input,emoji.input])control.addEventListener("change",update);
}
popup.append(toolbar,explanation,pageGroup,sectionsGroup,saveAll,status);
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
popup.addEventListener("close",()=>{refresh();if(opener.isConnected)opener.focus()});
popup.addEventListener("click",event=>{if(event.target===popup)popup.close()});
toolGrid.append(opener);

function refresh(){
 const owner=person();
 currentOwner=owner;
 const canonicalColor=read(colorsKey(storageOwner()));
 let legacyColor=null;
 const grade=document.body.dataset.grade||"";
 if(!isColor(canonicalColor)&&owner&&["10","11","12"].includes(grade)){
  try{
   const prev=JSON.parse(read("khaemenes.grade"+grade+".profile.appearance:"+encodeURIComponent(owner))||"null");
   if(isColor(prev?.background))legacyColor=prev.background;
  }catch{}
 }
 // Existing upper-grade backgrounds are read, not migrated or overwritten.
 // A newly selected background is saved under the canonical learner key.
 pageColor=isColor(canonicalColor)?canonicalColor:(legacyColor||base);
 pageSticker=(emojiList.includes(read(stickerKey(storageOwner())))||earnedStickers(owner).includes(read(stickerKey(storageOwner()))))?read(stickerKey(storageOwner())):"";
 const rawImage=read(imageKey(storageOwner()))||"";
 savedImage=/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(rawImage)&&rawImage.length<700000?rawImage:"";
 sectionPrefs=readSections(storageOwner());
 pageColorControl.input.value=pageColor;
 updateRewardOptions(pageEmoji.input,owner);
 pageEmoji.input.value=pageSticker;
 for(const [key,controls] of rows){
  const surface=surfaces.find(s=>s.key===key);
  controls.panel.hidden=!surface?.find();
  const pref=sectionPrefs[key]||{mode:"default",color:base,emoji:""};
  controls.mode.value=pref.mode;
  controls.color.value=pref.color;
  updateRewardOptions(controls.emoji,owner);
  controls.emoji.value=pref.emoji;
  controls.color.disabled=pref.mode!=="custom";
 }
 for(const node of [pageColorControl.input,resetPage,pageEmoji.input])node.disabled=false;
 upload.input.disabled=false;
 removeImage.disabled=!savedImage;
 for(const controls of rows.values()){
  controls.mode.disabled=false;
  controls.emoji.disabled=false;
 }
 if(!owner)message("Guest design: changes save to this browser only, separately from student profiles. Select a learner for learner-specific settings.");
 else message("Changes are stored privately on this device for the selected learner.");
 applyAll();
}
pageColorControl.input.addEventListener("input",()=>{
 pageColor=pageColorControl.input.value;
 applyAll();message("Preview only. Release the color picker to save.");
});
pageColorControl.input.addEventListener("change",()=>{
 const owner=person();if(owner!==currentOwner){refresh();return}
 if(!write(colorsKey(storageOwner()),pageColorControl.input.value)){
  refresh();message("Unable to save the page color.");return
 }
 pageColor=pageColorControl.input.value;applyAll();message(owner?"Page background color saved for learner.":"Page color saved as browser-only guest design.");
});
resetPage.addEventListener("click",()=>{
 const owner=person();if(owner!==currentOwner){refresh();return}
 if(!erase(colorsKey(storageOwner()))){message("Unable to restore the page color.");return}
 pageColor=base;pageColorControl.input.value=base;applyAll();message("Default page color restored. Section choices are preserved.");
});
pageEmoji.input.addEventListener("change",()=>{
 const owner=person();if(owner!==currentOwner){refresh();return}
 const value=pageEmoji.input.value;
 if(value?!write(stickerKey(storageOwner()),value):!erase(stickerKey(storageOwner()))){
  refresh();message("Unable to save your page sticker.");return
 }
 pageSticker=value;applyAll();message(owner?(value?"Page stickers saved.":"Page stickers removed."):"Guest sticker preference saved on this browser.");
});
upload.input.addEventListener("change",async()=>{
 const owner=person();
 if(owner!==currentOwner){refresh();message("Learner changed during upload. Reopen the editor.");return}
 const file=upload.input.files?.[0];if(!file)return;
 const mime=file.type||({"jpg":"image/jpeg","jpeg":"image/jpeg","png":"image/png","webp":"image/webp"}[file.name.split(".").pop().toLowerCase()]||"");
 if(!["image/jpeg","image/png","image/webp"].includes(mime)||file.size>5*1024*1024){
  message("Choose a JPG, PNG, or WebP image smaller than 5 MB.");upload.input.value="";return
 }
 const url=URL.createObjectURL(file);
 try{
  message("Processing background image locally…");
  const image=new Image();
  await new Promise((ok,fail)=>{image.onload=ok;image.onerror=fail;image.src=url});
  if(person()!==owner||currentOwner!==owner){message("The selected learner changed. Image not saved.");return}
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
  if(person()!==owner||currentOwner!==owner){message("The selected learner changed. Image not saved.");return}
  if(!write(imageKey(storageOwner()),data))throw Error("Browser storage is full");
  savedImage=data;applyAll();removeImage.disabled=false;
  message(owner?"Background image saved on this device for the selected learner.":"Background image saved to a separate guest design on this browser.");
 }catch(error){message("Background image could not be saved. Try a smaller image; your previous image is preserved.")}
 finally{URL.revokeObjectURL(url);upload.input.value=""}
});
removeImage.addEventListener("click",()=>{
 const owner=person();if(owner!==currentOwner){refresh();return}
 if(!erase(imageKey(storageOwner()))){message("Unable to remove background image.");return}
 savedImage="";removeImage.disabled=true;applyAll();message("Background image removed; colors and stickers remain.");
});
window.addEventListener("pageshow",refresh);
window.addEventListener("load",refresh);
window.addEventListener("khaemenes-student-profile-changed",refresh);
window.addEventListener("khaemenes-grade09-sticker-rewards-changed",()=>{updateRewardOptions(pageEmoji.input,person());for(const controls of rows.values())updateRewardOptions(controls.emoji,person())});
window.addEventListener("storage",event=>{
 if(!event.key||event.key==="khaemenes_active_learner_v1"||
  [colorsKey(storageOwner()),sectionsKey(storageOwner()),stickerKey(storageOwner()),imageKey(storageOwner()),...(currentOwner?[earnedKey(currentOwner)]:[])].includes(event.key))refresh();
});
refresh();
})();
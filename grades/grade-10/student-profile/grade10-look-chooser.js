/* Grade 10 Picture & Colors studio, sharing the existing per-learner photo/appearance storage.
 * Photo, badge, and frame settings are learner-specific and shared with the
 * main profile hero. The color swatches affect ONLY that hero's identity card,
 * not the page-wide background or independently customized student sections.
 */
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const badgeKey=id=>"khaemenes.grade09.profile.badge:"+encodeURIComponent(id);
const photoKey=id=>"khaemenes.grade09.profile.photo:"+encodeURIComponent(id);
const pageColorKey=id=>"khaemenes.grade09.profile.background:"+encodeURIComponent(id);
const cardKey=id=>"khaemenes.grade09.profile.background.sections.v1:"+encodeURIComponent(id);
const badges=["★","✦","📚","🧭","⚛","🎨","🎵","🌿","🔬","🧪","🧬","🌌","🌙","☀️","🪐","🌎","⚙️","💻","✏️","🎭","📐","🏛️","🦋","🏆"];
const parchment="#f4f0e7";
const colors=["#D53E4F","#F46D43","#FDAE61","#FEE08B","#E6F598","#ABDDA4","#66C2A5","#3288BD","#243038","#49374B","#7D283C","#254A75","#2C634A","#9A732C","#6A4C93","#A34836","#F4F0E7","#E7D7B6","#D1E3E5","#CAD8BC","#D5C1CF","#B9CBE0","#F2D8B6","#D0D6D1"];
const shapes=[
 ["rectangle","Rectangle"],["square","Square"],["circle","Circle"],
 ["heart","Heart"],["star","Star"],["octagon","Octagon"],
 ["hectagon","Hectagon (100 sides)"]
];
const heart="polygon(50% 95%,43% 88%,31% 76%,20% 64%,10% 51%,4% 39%,4% 25%,10% 13%,21% 7%,32% 7%,42% 13%,50% 24%,58% 13%,68% 7%,79% 7%,90% 13%,96% 25%,96% 39%,90% 51%,80% 64%,69% 76%,57% 88%)";
const star="polygon(50% 2%,63% 34%,98% 36%,71% 58%,80% 94%,50% 75%,20% 94%,29% 58%,2% 36%,37% 34%)";
const octagon="polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)";
const hectagon="polygon("+Array.from({length:100},(_,i)=>{
 const angle=i*Math.PI/50-Math.PI/2;
 return (50+50*Math.cos(angle)).toFixed(3)+"% "+(50+50*Math.sin(angle)).toFixed(3)+"%";
}).join(",")+")";
const learner=()=>{
 try{
  const id=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
  const registry=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null");
  const record=typeof id==="string"?registry?.learners?.[id]:null;
  if(!record||record.learnerId!==id)return null;
  if(record.stage!=="high"||String(Number(record.grade))!=="10")return null;
  const linked=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
  return linked&&String(linked)!==id?null:id;
 }catch{return null}
};
const validColor=color=>typeof color==="string"&&/^#[0-9a-f]{6}$/i.test(color);
let owner=null,badge="★",cardMode="default",cardColor=parchment,photo="",frame="circle";
const status=(text,error=false)=>{
 const node=$("grade09LookStatus");
 if(node){node.textContent=text;node.dataset.error=error?"true":"false"}
};
function cardSettings(id){
 try{
  const all=JSON.parse(localStorage.getItem(cardKey(id))||"{}");
  if(!all||typeof all!=="object"||Array.isArray(all))return {};
  const setting=all.identity;
  return setting&&typeof setting==="object"?setting:{};
 }catch{return {}}
}
function cardPreview(id){
 const setting=id?cardSettings(id):{};
 cardMode=["default","page","custom"].includes(setting.mode)?setting.mode:"default";
 if(cardMode==="custom"&&validColor(setting.color))return setting.color;
 if(cardMode==="page"){
  let page=null;try{page=localStorage.getItem(pageColorKey(id))}catch{}
  return validColor(page)?page:parchment;
 }
 return parchment;
}
function saveCard(color){
 const id=learner();
 if(!id&&!owner){
  cardMode=color?"custom":"default";cardColor=color||parchment;render();
  status("Preview only. Select an Academy learner to save this photo-card color.");return true;
 }
 if(!id||id!==owner){refresh();status("Select the Academy learner before saving the photo-card color.",true);return false}
 try{
  const key=cardKey(id);
  const existing=JSON.parse(localStorage.getItem(key)||"{}");
  const all=existing&&typeof existing==="object"&&!Array.isArray(existing)?existing:{};
  const previous=all.identity&&typeof all.identity==="object"?all.identity:{};
  all.identity={
   ...previous,
   mode:color?"custom":"default",
   color:color||parchment,
   emoji:typeof previous.emoji==="string"?previous.emoji:""
  };
  // Only the identity section is written: preserve all other section choices.
  localStorage.setItem(key,JSON.stringify(all));
  cardColor=cardPreview(id);render();signal();
  status(color?"Photo-card background saved. The page background was not changed.":"Original photo-card background restored; other sections are unchanged.");
  return true;
 }catch{status("Could not save this card background on the current device.",true);return false}
}
function applyPreviewShape(){
 const box=$("grade09LookPreview");if(!box)return;
 const selected=frame==="soft-square"?"square":frame;
 const polygons={heart,star,octagon,hectagon};
 box.style.setProperty("width",selected==="rectangle"?"180px":"160px");
 box.style.setProperty("height",selected==="rectangle"?"132px":"160px");
 box.style.setProperty("max-width","100%");
 box.style.setProperty("clip-path",polygons[selected]||"none");
 box.style.setProperty("border-radius",selected==="circle"?"50%":(selected==="rectangle"||selected==="square"?"7px":"0"));
}
function render(){
 const box=$("grade09LookPreview");if(!box)return;
 box.replaceChildren();
 if(photo){
  const image=document.createElement("img");image.src=photo;
  image.alt="Locally saved student profile picture";box.append(image);
 }else{
  const symbol=document.createElement("span");symbol.textContent=badge;box.append(symbol);
 }
 applyPreviewShape();
 for(const button of document.querySelectorAll("#grade09BadgeChoices button"))
  button.setAttribute("aria-pressed",String(button.dataset.symbol===badge&&!photo));
 for(const button of document.querySelectorAll("#grade09ColorChoices button"))
  button.setAttribute("aria-pressed",String(button.dataset.color?cardMode==="custom"&&button.dataset.color===cardColor:cardMode==="default"));
 for(const button of document.querySelectorAll("#grade09FrameChoices button"))
  button.setAttribute("aria-pressed",String(button.dataset.shape===(frame==="soft-square"?"square":frame)));
 const panel=$("grade09LookPanel");
 panel.style.setProperty("--look-selected-color",cardColor);
 const red=parseInt(cardColor.slice(1,3),16),green=parseInt(cardColor.slice(3,5),16),blue=parseInt(cardColor.slice(5,7),16);
 const luminance=hex=>{
  const channel=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255)
    .map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));
  return channel[0]*.2126+channel[1]*.7152+channel[2]*.0722;
 };
 const ratio=(a,b)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
 const bg=luminance(cardColor);
 const ink=ratio(bg,luminance("#243038"))>=ratio(bg,luminance("#fff8e9"))?"#243038":"#fff8e9";
 panel.style.setProperty("color",ink,"important");
 for(const n of panel.querySelectorAll("h2,h3,p,.grade09-look-help,#grade09LookLabel"))
  {n.style.setProperty("color",ink,"important");
   n.style.setProperty("-webkit-text-fill-color",ink,"important");}
 $("grade09LookLabel").textContent=photo?"My profile picture":"My profile badge";
}
function refresh(){
 owner=learner();
 const design=window.KhaemenesGrade09Design;
 frame=design?.read?.().avatarShape||"circle";
 if(!owner){
  badge="★";cardMode="default";cardColor=parchment;photo="";
  render();status("Preview any picture, badge, frame or color here. Select an Academy learner to save choices.");
 }else{
  try{
   const savedBadge=localStorage.getItem(badgeKey(owner));
   badge=badges.includes(savedBadge)?savedBadge:"★";
   cardColor=cardPreview(owner);
   let raw=localStorage.getItem(photoKey(owner))||"";
    // For students who began in Grades 10–12, read their existing grade
    // appearance photo if the shared learner portrait has not yet been set.
    if(!raw){
      const active=JSON.parse(localStorage.getItem("khaemenes_active_learner_v1")||"null");
      const record=JSON.parse(localStorage.getItem("khaemenes_family_registry_v1")||"null")?.learners?.[active];
      const grade=String(record?.grade||"");
      if(["10","11","12"].includes(grade)&&active===owner){
        const previous=JSON.parse(localStorage.getItem("khaemenes.grade"+grade+".profile.appearance:"+encodeURIComponent(owner))||"null");
        if(typeof previous?.photo==="string")raw=previous.photo;
      }
    }
   photo=/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(raw)&&raw.length<400000?raw:"";
  }catch{badge="★";cardMode="default";cardColor=parchment;photo=""}
  render();status("Picture, frame and photo-card color are saved locally for this learner.");
 }
 const enabled=!!owner;
 for(const button of document.querySelectorAll("#grade09BadgeChoices button,#grade09FrameChoices button,#grade09ColorChoices button"))
  button.disabled=false;
 $("grade09PhotoInput").disabled=false;
 $("grade09RemovePhoto").disabled=!photo;
}
function save(key,value,text){
 const id=learner();
 if(!id||id!==owner){refresh();status("Choose your existing Academy learner before making changes.",true);return false}
 try{localStorage.setItem(key(id),value);status(text);return true}
 catch{status("Unable to save on this browser; storage may be full.",true);return false}
}
function signal(){
 window.dispatchEvent(new Event("khaemenes-grade09-design-changed"));
  window.dispatchEvent(new Event("khaemenes-high-profile-appearance-changed"));
}
async function choosePhoto(file){
 if(!file)return;
 const id=learner();
 if(id!==owner){refresh();status("The active learner changed. Choose your picture again.",true);return}
 if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5*1024*1024){
  status("Choose a JPG, PNG, or WebP picture under 5 MB.",true);$("grade09PhotoInput").value="";return
 }
 const url=URL.createObjectURL(file);
 try{
  const img=new Image();
  await new Promise((ok,fail)=>{img.onload=ok;img.onerror=fail;img.src=url});
  if(id!==learner()||id!==owner)return;
  const canvas=document.createElement("canvas");canvas.width=canvas.height=240;
  const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas unavailable");
  const side=Math.min(img.naturalWidth,img.naturalHeight);
  ctx.drawImage(img,(img.naturalWidth-side)/2,(img.naturalHeight-side)/2,side,side,0,0,240,240);
  const data=canvas.toDataURL("image/jpeg",.78);
  if(data.length>=400000)throw Error("Image remains too large");
  if(!id){
   photo=data;render();$("grade09RemovePhoto").disabled=false;
   status("Picture preview only. Select an Academy learner to save this photograph.");return;
  }
  if(save(photoKey,data,"Picture saved locally for this learner.")){
   photo=data;render();$("grade09RemovePhoto").disabled=false;signal();
  }
 }catch{status("Picture could not be processed or saved. The previous picture is preserved.",true)}
 finally{URL.revokeObjectURL(url);$("grade09PhotoInput").value=""}
}
function mount(){
 if(!$("grade09LookPanel"))return;
 const badgesBox=$("grade09BadgeChoices"),colorsBox=$("grade09ColorChoices"),framesBox=$("grade09FrameChoices");
 if(!badgesBox||!colorsBox||!framesBox||framesBox.children.length)return;
 for(const symbol of badges){
  const button=document.createElement("button");button.type="button";
  button.dataset.symbol=symbol;button.textContent=symbol;
  button.setAttribute("aria-label","Choose "+symbol+" profile badge");
  button.addEventListener("click",()=>{
   if(!owner){
    badge=symbol;render();
    status("Badge preview only. Select an Academy learner to save.");return;
   }
   if(save(badgeKey,symbol,"Badge saved for this learner.")){
    badge=symbol;render();
    if(photo)status("Badge saved. Existing picture preserved; Remove Picture to show your badge.");
    signal();
   }
  });
  badgesBox.append(button);
 }
 for(const [shape,label] of shapes){
  const button=document.createElement("button");button.type="button";
  button.dataset.shape=shape;button.textContent=label;
  button.setAttribute("aria-label","Use "+label+" photo frame");
  button.addEventListener("click",()=>{
   const id=learner(),design=window.KhaemenesGrade09Design;
   if(!id&&!owner){frame=shape;render();status(label+" frame preview only. Select an Academy learner to save.");return}
   if(!id||id!==owner||!design?.write){refresh();status("Select your Academy learner before saving the frame.",true);return}
   if(!design.write({...design.read(),avatarShape:shape})){
    status("Could not save the photo frame.",true);return
   }
   frame=shape;
   // Keep the existing Design Studio selector in sync, so its own Save button
   // cannot accidentally restore the previous shape in the same session.
   if($("avatarShape"))$("avatarShape").value=shape;
   render();status(label+" frame saved for this learner.");signal();
  });
  framesBox.append(button);
 }
 const original=document.createElement("button");
 original.type="button";original.textContent="Academy Default";original.dataset.default="true";
 original.setAttribute("aria-label","Restore the original student photo-card background");
 original.style.setProperty("width","auto","important");
 original.style.setProperty("min-width","120px","important");
 original.style.setProperty("font-size","16px","important");
 original.addEventListener("click",()=>{saveCard(null)});
 colorsBox.append(original);
 for(const hex of colors){
  const button=document.createElement("button");button.type="button";
  button.dataset.color=hex;
  // The shared parchment theme sets button backgrounds !important.
  // These are deliberately user-selected palette swatches, not theme buttons.
  button.style.setProperty("background-color",hex,"important");
  button.style.setProperty("background-image","none","important");
  button.style.setProperty("border-color","#243038","important");
  button.setAttribute("aria-label","Set photo-card background color "+hex);
  button.addEventListener("click",()=>saveCard(hex));
  colorsBox.append(button);
 }
 $("grade09PhotoInput").addEventListener("change",event=>choosePhoto(event.target.files?.[0]));
 $("grade09RemovePhoto").addEventListener("click",()=>{
  const id=learner();
  if(!id&&!owner){
   photo="";render();$("grade09RemovePhoto").disabled=true;
   status("Picture preview cleared. No learner photograph was changed.");return;
  }
  if(!id||id!==owner){refresh();return}
  try{
   localStorage.removeItem(photoKey(id));
   // Clear only legacy photo fields for this learner in upper-grade
   // appearance records. Other colors and grade-specific settings survive.
   for(const grade of ["10","11","12"]){
    const key="khaemenes.grade"+grade+".profile.appearance:"+encodeURIComponent(id);
    const raw=localStorage.getItem(key);
    if(!raw)continue;
    const appearance=JSON.parse(raw);
    if(!appearance||typeof appearance!=="object"||!Object.prototype.hasOwnProperty.call(appearance,"photo"))continue;
    const next={...appearance};delete next.photo;
    localStorage.setItem(key,JSON.stringify(next));
   }
   photo="";render();
   $("grade09RemovePhoto").disabled=true;
   status("Picture removed. Your saved badge and photo frame remain.");signal();
  }catch{status("Could not remove the picture.",true)}
 });
 window.addEventListener("pageshow",refresh);
 window.addEventListener("khaemenes-student-profile-changed",refresh);
 window.addEventListener("storage",refresh);
 refresh();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);
else mount();
})();
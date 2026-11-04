/* Grade 09 private learner photo + frame editor.
   No external uploads; reuses the learner-owned Grade09Design avatarShape preference. */
(()=>{"use strict";
const avatar=document.getElementById("avatar"),row=avatar?.closest(".profile-row");
if(!avatar||!row||document.getElementById("grade09PhotoControls"))return;
const learner=()=>{
  const a=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
  const b=window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId;
  return a&&b&&String(a)!==String(b)?null:(a?String(a):(b?String(b):null));
};
const keyFor=id=>id?"khaemenes.grade09.profile.photo:"+encodeURIComponent(id):null;
const shapes=[["circle","Circle"],["square","Square"],["heart","Heart"],["star","Star"]];
const ui=document.createElement("div");
ui.id="grade09PhotoControls";ui.className="grade09-photo-controls";
const heading=document.createElement("p");heading.className="grade09-photo-heading";heading.textContent="Profile picture";
const controls=document.createElement("div");controls.className="grade09-photo-actions";
const label=document.createElement("label");label.className="grade09-photo-button";label.textContent="Choose photo";
const input=document.createElement("input");input.type="file";input.accept="image/jpeg,image/png,image/webp";
input.setAttribute("aria-label","Choose personal student profile photo");
input.className="grade09-photo-file-input";label.append(input);
const remove=document.createElement("button");remove.type="button";remove.className="grade09-photo-button";remove.textContent="Remove photo";
controls.append(label,remove);
const legend=document.createElement("p");legend.className="grade09-photo-label";legend.textContent="Photo frame";
const shapesGroup=document.createElement("div");shapesGroup.className="grade09-frame-options";
shapesGroup.setAttribute("role","group");shapesGroup.setAttribute("aria-label","Choose your profile picture frame shape");
const buttons=new Map();
for(const [shape,name] of shapes){
  const button=document.createElement("button");button.type="button";button.className="grade09-frame-choice";
  button.dataset.shape=shape;button.textContent=name;button.setAttribute("aria-pressed","false");
  shapesGroup.append(button);buttons.set(shape,button);
  button.addEventListener("click",()=>{
    const owner=learner(),design=window.KhaemenesGrade09Design;
    if(!owner||!design?.write){status.textContent="Choose a student learner to save a frame.";return}
    const saved=design.write({...design.read(),avatarShape:shape});
    if(!saved){status.textContent="Could not save frame on this device.";return}
    updateShape();status.textContent=name+" frame saved for this learner.";
  });
}
const status=document.createElement("p");status.className="grade09-photo-status";
status.setAttribute("role","status");status.setAttribute("aria-live","polite");
ui.append(heading,controls,legend,shapesGroup,status);
const details=row.querySelector(".profile-name")?.parentElement;
if(details)details.classList.add("grade09-identity-details");

// Use the existing student Profile Tools rail; keep the picture editor functional
// inline as a fallback for browsers without native dialogs or missing rail markup.
const toolGrid=document.querySelector("#khaeProfileToolRail > div");
const photoCard=row.closest(".card");
const popup=document.createElement("dialog");
if(toolGrid&&photoCard&&typeof popup.showModal==="function"){
  popup.id="grade09PhotoDialog";
  popup.setAttribute("aria-labelledby","grade09PhotoDialogTitle");
  popup.style.cssText="box-sizing:border-box;width:min(92vw,580px);max-width:92vw;max-height:86vh;overflow:auto;margin:auto;padding:22px;border:1px solid #b48b45;border-radius:7px;background:#fffaf0;color:#243038;box-shadow:0 22px 60px rgba(11,22,22,.38)";
  const topBar=document.createElement("div");
  topBar.style.cssText="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px";
  const title=document.createElement("h2");
  title.id="grade09PhotoDialogTitle";
  title.textContent="Customize My Picture";
  title.style.cssText="margin:0;font:400 26px/1.25 Cinzel,Georgia,serif;color:#243038";
  const close=document.createElement("button");
  close.type="button";
  close.textContent="Close ✕";
  close.setAttribute("aria-label","Close picture customization");
  close.style.cssText="min-height:44px;padding:9px 14px;border:1px solid #243038;border-radius:7px;background:#243038;color:#fff8e9;font:400 16px/1.3 Nunito,Arial,sans-serif;cursor:pointer";
  close.addEventListener("click",()=>popup.close());
  topBar.append(title,close);
  const help=document.createElement("p");
  help.textContent="Choose or remove your profile photograph and select a frame. Changes appear on your student profile and are saved for the selected learner on this device.";
  help.style.cssText="font:400 16px/1.5 Nunito,Arial,sans-serif;margin:0 0 14px;color:#243038";
  popup.append(topBar,help,ui);
  photoCard.append(popup);

  // Preserve the original control classes and handlers while meeting the
  // 16px text / 44px touch-target guideline inside the modal.
  for(const item of ui.querySelectorAll(".grade09-photo-button,.grade09-frame-choice")){
    item.style.setProperty("font-size","16px","important");
    item.style.setProperty("min-height","44px","important");
    item.style.setProperty("height","auto","important");
    item.style.setProperty("width","auto","important");
    item.style.setProperty("min-width","105px","important");
  }
  for(const item of ui.querySelectorAll(".grade09-photo-heading,.grade09-photo-label,.grade09-photo-status"))
    item.style.setProperty("font-size","16px","important");

  const opener=document.createElement("button");
  opener.id="openGrade09PhotoDialog";
  opener.type="button";
  opener.className="grade09-profile-tool";
  opener.textContent="Customize Picture";
  opener.setAttribute("aria-haspopup","dialog");
  opener.setAttribute("aria-controls",popup.id);
  opener.style.cssText="box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:100%;min-width:0;min-height:56px;padding:10px 12px;border:1px solid #65716c;border-radius:7px;background:#33454b;text-align:center;text-decoration:none;font:400 16px/1.3 Nunito,Arial,sans-serif;cursor:pointer";
  opener.style.setProperty("color","#fff8e9","important");
  opener.style.setProperty("-webkit-text-fill-color","#fff8e9","important");
  opener.addEventListener("click",()=>{display();popup.showModal();close.focus()});
  popup.addEventListener("close",()=>{if(opener.isConnected)opener.focus()});
  popup.addEventListener("click",event=>{if(event.target===popup)popup.close()});
  toolGrid.append(opener);
}else if(details)details.insertBefore(ui,details.querySelector(".subline")?.nextSibling||null);
else row.append(ui);
avatar.classList.add("grade09-avatar-enhanced");
function updateShape(){
  const v=window.KhaemenesGrade09Design?.read?.().avatarShape||"circle";
  const selected=v==="soft-square"?"square":v;
  avatar.dataset.profileFrame=selected;
  for(const [shape,button] of buttons)button.setAttribute("aria-pressed",String(shape===selected));
  const available=!!learner();
  for(const button of buttons.values())button.disabled=!available;
}
function display(){
  const owner=learner();let photo="";
  if(owner)try{
    const p=localStorage.getItem(keyFor(owner))||"";
    if(/^data:image\/jpeg;base64,/.test(p)&&p.length<400000)photo=p;
  }catch{}
  const currentImg=avatar.querySelector("img");
  if(photo){
    if(!currentImg||currentImg.src!==photo){
      const image=document.createElement("img");image.src=photo;image.alt="Personal student photograph";
      image.className="grade09-student-photo";avatar.replaceChildren(image);
    }
  }else{
    currentImg?.remove();
    if(!avatar.textContent.trim())avatar.textContent=window.KhaemenesGrade09Design?.avatarText?.("S")||"S";
  }
  remove.hidden=!photo;input.disabled=!owner;label.classList.toggle("is-disabled",!owner);
  updateShape();
  if(!owner)status.textContent="Choose your student learner to save a photo and frame.";
  else if(status.textContent.startsWith("Choose your student learner"))status.textContent="";
}
input.addEventListener("change",async()=>{
  const owner=learner();
  if(!owner){status.textContent="Choose your student learner before uploading a photo.";return}
  const file=input.files?.[0];if(!file)return;
  if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>4*1024*1024){
    status.textContent="Choose JPG, PNG, or WebP under 4 MB.";input.value="";return;
  }
  const url=URL.createObjectURL(file);
  try{
    const im=new Image();await new Promise((ok,fail)=>{im.onload=ok;im.onerror=fail;im.src=url});
    if(learner()!==owner)return;
    const canvas=document.createElement("canvas");canvas.width=canvas.height=240;
    const ctx=canvas.getContext("2d"),side=Math.min(im.naturalWidth,im.naturalHeight);
    if(!ctx)throw Error("canvas");
    ctx.drawImage(im,(im.naturalWidth-side)/2,(im.naturalHeight-side)/2,side,side,0,0,240,240);
    const data=canvas.toDataURL("image/jpeg",0.78);if(data.length>=400000)throw Error("too large");
    localStorage.setItem(keyFor(owner),data);display();status.textContent="Photo saved on this device.";
  }catch{status.textContent="Photo couldn't be saved; try another."}
  finally{URL.revokeObjectURL(url);input.value=""}
});
remove.addEventListener("click",()=>{
  const owner=learner();if(!owner)return;
  try{localStorage.removeItem(keyFor(owner));avatar.replaceChildren(document.createTextNode(window.KhaemenesGrade09Design?.avatarText?.("S")||"S"));display();status.textContent="Photo removed."}
  catch{status.textContent="Unable to remove photo."}
});
window.addEventListener("khaemenes-grade09-design-changed",()=>{updateShape();display()});
window.addEventListener("pageshow",display);
window.addEventListener("focus",display);
window.addEventListener("khaemenes-student-profile-changed",display);
display();
})();
/* Grade 09 private learner photo + frame editor.
   No external uploads; reuses the learner-owned Grade09Design avatarShape preference. */
(()=>{"use strict";
const pageGrade=document.body?.dataset.grade||"";
if(["10","11","12"].includes(pageGrade)){
 const registered=window.KhaemenesHighProfileGradeContext?.active?.();
 // Don't mount an editor for another grade or an unselected learner.
 if(!registered||registered.gradeNumber!==Number(pageGrade))return;
}

const avatar=document.getElementById("avatar"),row=avatar?.closest(".profile-row");
if(!avatar||!row||document.getElementById("grade09PhotoControls"))return;
const learner=()=>{
  const registered=window.KhaemenesHighProfileGradeContext?.activeForGrade?.(pageGrade||"09");
  if(!registered)return null;
  const a=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId;
  const b=window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId;
  if((a&&String(a)!==registered.learnerId)||(b&&String(b)!==registered.learnerId))return null;
  return registered.learnerId;
};
const keyFor=id=>id?"khaemenes.grade09.profile.photo:"+encodeURIComponent(id):null;
const shapes=[["rectangle","Rectangle"],["square","Square"],["circle","Circle"],["heart","Heart"],["star","Star"],["octagon","Octagon"],["hectagon","Hectagon (100 sides)"]];
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
  // Avatar Marks were previously available only in the redundant Design Studio.
  // Keep the same Grade09Design preference and display it when no picture exists.
  const markBox=document.createElement("section");
  markBox.style.cssText="display:grid;gap:9px;margin:17px 0 3px;padding:14px;border:1px solid #c5b492;border-radius:7px;background:#f6f0e5";
  const markLabel=document.createElement("label");
  markLabel.textContent="Avatar Mark (when no photograph is displayed)";
  markLabel.setAttribute("for","grade09AvatarMark");
  markLabel.style.cssText="font:400 16px/1.4 Nunito,Arial,sans-serif;color:#243038";
  const markSelect=document.createElement("select");
  markSelect.id="grade09AvatarMark";
  markSelect.style.cssText="box-sizing:border-box;width:100%;min-height:44px;padding:9px;border:1px solid #b8ac98;border-radius:7px;background:#fffaf0;color:#243038;font:400 16px/1.4 Nunito,Arial,sans-serif";
  const markOptions=[["initials","My Initials / Saved Badge"],["star","Scholar Star"],["book","Open Book"],["compass","Compass"],["atom","Atom"],["palette","Creative Palette"]];
  for(const [value,text] of markOptions){const option=document.createElement("option");option.value=value;option.textContent=text;markSelect.append(option)}
  const markHelp=document.createElement("p");
  markHelp.textContent="A saved photograph always takes priority. Other marks replace the avatar's initials or saved badge until you choose My Initials / Saved Badge again.";
  markHelp.style.cssText="margin:0;font:400 16px/1.5 Nunito,Arial,sans-serif;color:#243038";
  markBox.append(markLabel,markSelect,markHelp);
  popup.append(markBox);
  const syncMark=()=>{
   markSelect.value=window.KhaemenesGrade09Design?.read?.().avatarMark||"initials";
   markSelect.disabled=!learner();
  };
  markSelect.addEventListener("change",()=>{
   const owner=learner(),design=window.KhaemenesGrade09Design;
   if(!owner||!design?.write){syncMark();status.textContent="Choose your Academy learner to save an avatar mark.";return}
   const choice=markSelect.value;
   if(!design.write({...design.read(),avatarMark:choice})){
    syncMark();status.textContent="Unable to save the avatar mark.";return
   }
   display();
   status.textContent="Avatar mark saved for this learner. Your photograph and badges are preserved.";
  });
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
  opener.addEventListener("click",()=>{display();syncMark();popup.showModal();close.focus()});
  popup.addEventListener("close",()=>{if(opener.isConnected)opener.focus()});
  popup.addEventListener("click",event=>{if(event.target===popup)popup.close()});
  // Picture customization remains implemented and learner-scoped, but its
  // redundant Profile Tools button is not inserted. Edit Profile is the entry.
  // Keep the dialog and existing handlers intact for future integrated access.
}else if(details)details.insertBefore(ui,details.querySelector(".subline")?.nextSibling||null);
else row.append(ui);
avatar.classList.add("grade09-avatar-enhanced");
function updateShape(){
  const v=window.KhaemenesGrade09Design?.read?.().avatarShape||"circle";
  const selected=v==="soft-square"?"square":v;
  avatar.dataset.profileFrame=selected;
  // Legacy frames continue to use their existing CSS. New polygon silhouettes
  // are set on the avatar itself, without adding competing stylesheet layers.
  avatar.style.removeProperty("clip-path");
  avatar.style.removeProperty("border-radius");
  if(selected==="rectangle"){
    avatar.style.setProperty("clip-path","polygon(0% 12%,100% 12%,100% 88%,0% 88%)","important");
    avatar.style.setProperty("border-radius","0","important");
  }else if(selected==="octagon"){
    avatar.style.setProperty("clip-path","polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)","important");
    avatar.style.setProperty("border-radius","0","important");
  }else if(selected==="hectagon"){
    const points=Array.from({length:100},(_,i)=>{
      const angle=i*Math.PI/50-Math.PI/2;
      return (50+50*Math.cos(angle)).toFixed(3)+"% "+(50+50*Math.sin(angle)).toFixed(3)+"%";
    });
    avatar.style.setProperty("clip-path","polygon("+points.join(",")+")","important");
    avatar.style.setProperty("border-radius","0","important");
  }
  for(const [shape,button] of buttons)button.setAttribute("aria-pressed",String(shape===selected));
  const available=!!learner();
  for(const button of buttons.values())button.disabled=!available;
}
function fallbackMark(owner){
  const design=window.KhaemenesGrade09Design;
  const preference=design?.read?.();
  const name=document.getElementById("studentName")?.textContent?.trim()||"Student";
  const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join("").toUpperCase()||"S";
  if(preference?.avatarMark&&preference.avatarMark!=="initials")
   return design?.avatarText?.(initials,preference)||initials;
  if(owner)try{
    const badge=localStorage.getItem("khaemenes.grade09.profile.badge:"+encodeURIComponent(owner));
    if(["★","✦","📚","🧭","⚛","🎨","🎵","🌿"].includes(badge))return badge;
  }catch{}
  return design?.avatarText?.(initials,preference)||initials;
}
function display(){
  const owner=learner();let photo="";
  if(owner)try{
    let p=localStorage.getItem(keyFor(owner))||"";
    // Preserve an existing upper-grade photo until its owner saves a new one.
    if(!p&&["10","11","12"].includes(document.body.dataset.grade||"")){
      const old=JSON.parse(localStorage.getItem("khaemenes.grade"+document.body.dataset.grade+".profile.appearance:"+encodeURIComponent(owner))||"null");
      if(typeof old?.photo==="string")p=old.photo;
    }
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
    const mark=fallbackMark(owner);
    if(avatar.textContent!==mark)avatar.textContent=mark;
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
    // Image decode and canvas work may span a sibling switch or another-tab update.
    if(learner()!==owner)return;
    localStorage.setItem(keyFor(owner),data);display();status.textContent="Photo saved on this device.";
  }catch{status.textContent="Photo couldn't be saved; try another."}
  finally{URL.revokeObjectURL(url);input.value=""}
});
remove.addEventListener("click",()=>{
  const owner=learner();if(!owner)return;
  try{
    localStorage.removeItem(keyFor(owner));
    const grade=document.body.dataset.grade||"";
    if(["10","11","12"].includes(grade)){
      const key="khaemenes.grade"+grade+".profile.appearance:"+encodeURIComponent(owner);
      const raw=localStorage.getItem(key);
      if(raw){
        const old=JSON.parse(raw);
        if(old&&typeof old==="object"&&old.photo){
          const next={...old};delete next.photo;localStorage.setItem(key,JSON.stringify(next));
        }
      }
    }
    avatar.replaceChildren(document.createTextNode(fallbackMark(owner)));display();
    status.textContent="Photo removed from this learner's profile.";
   }
  catch{status.textContent="Unable to remove photo."}
});
window.addEventListener("khaemenes-grade09-design-changed",()=>{updateShape();display()});
window.addEventListener("pageshow",display);
window.addEventListener("focus",display);
window.addEventListener("khaemenes-student-profile-changed",display);
window.addEventListener("khaemenes-family-changed",()=>{input.value="";display()});
window.addEventListener("storage",event=>{
 if(!event.key||["khaemenes_active_learner_v1","khaemenes_active_family_v1","khaemenes_family_registry_v1"].includes(event.key))display();
});
display();
})();
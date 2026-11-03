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
if(details){details.classList.add("grade09-identity-details");details.insertBefore(ui,details.querySelector(".subline")?.nextSibling||null)}
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
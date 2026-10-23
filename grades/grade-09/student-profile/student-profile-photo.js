/* Private Grade 09 learner avatar photo; no external uploads. */
(()=>{"use strict";
const avatar=document.getElementById("avatar"),row=avatar?.closest(".profile-row");
if(!avatar||!row)return;
const learner=()=>{const a=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId,b=window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId;return a&&b&&String(a)===String(b)?String(a):null};
const first=learner(),key=first?"khaemenes.grade09.profile.photo:"+encodeURIComponent(first):null;
const wrap=document.createElement("div");wrap.style.cssText="display:flex;flex-direction:column;align-items:center;gap:7px;flex-shrink:0";
avatar.parentNode.insertBefore(wrap,avatar);wrap.append(avatar);
const label=document.createElement("label");label.textContent="Add my photo";label.style.cssText="font:400 14px/1.4 Arial,sans-serif;cursor:pointer;text-decoration:underline;text-underline-offset:3px";
const input=document.createElement("input");input.type="file";input.accept="image/jpeg,image/png,image/webp";input.setAttribute("aria-label","Upload personal student profile photo");input.style.cssText="width:1px;height:1px;position:absolute;opacity:0";label.append(input);
const status=document.createElement("span");status.setAttribute("role","status");status.style.cssText="font-size:12px;max-width:150px;text-align:center";
const remove=document.createElement("button");remove.type="button";remove.textContent="Remove photo";remove.style.cssText="border:0;background:transparent;text-decoration:underline;font-size:13px;cursor:pointer";wrap.append(label,remove,status);
const same=()=>!!key&&learner()===first;
function display(){avatar.querySelector("img")?.remove();let photo="";if(same())try{const p=localStorage.getItem(key)||"";if(/^data:image\/jpeg;base64,/.test(p)&&p.length<400000)photo=p}catch{}if(photo){const image=document.createElement("img");image.src=photo;image.alt="Personal student photograph";image.style.cssText="height:100%;width:100%;border-radius:inherit;object-fit:cover;display:block";avatar.textContent="";avatar.append(image)}remove.hidden=!photo;input.disabled=!same();if(!same())status.textContent="Select a learner to add a photo."}
input.addEventListener("change",async()=>{if(!same())return;const file=input.files?.[0];input.value="";if(!file)return;if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>4*1024*1024){status.textContent="Choose JPG, PNG or WebP under 4 MB.";return}
const url=URL.createObjectURL(file);try{const im=new Image();await new Promise((ok,fail)=>{im.onload=ok;im.onerror=fail;im.src=url});if(!same())return;const canvas=document.createElement("canvas");canvas.width=canvas.height=240;const ctx=canvas.getContext("2d"),side=Math.min(im.naturalWidth,im.naturalHeight);if(!ctx)throw Error("canvas");ctx.drawImage(im,(im.naturalWidth-side)/2,(im.naturalHeight-side)/2,side,side,0,0,240,240);const data=canvas.toDataURL("image/jpeg",0.78);if(data.length>=400000)throw Error("too large");localStorage.setItem(key,data);display();status.textContent="Photo saved on this device."}catch{status.textContent="Photo couldn't be saved; try another."}finally{URL.revokeObjectURL(url)}});
remove.addEventListener("click",()=>{if(!same())return;try{localStorage.removeItem(key);avatar.textContent="S";display();status.textContent="Photo removed."}catch{status.textContent="Unable to remove photo."}});
window.addEventListener("pageshow",display);window.addEventListener("focus",display);window.addEventListener("khaemenes-student-profile-changed",display);display();
})();
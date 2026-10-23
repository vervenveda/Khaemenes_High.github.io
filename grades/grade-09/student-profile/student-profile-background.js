/* Grade 09 custom background spectrum; learner-specific browser preferences. */
(()=>{"use strict";
const row=document.querySelector(".grade09-profile-first .profile-row");if(!row)return;
const person=()=>{const a=window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId,b=window.KhaemenesCourseEntryContract?.readAcademyProfile?.()?.learnerId;return a&&b&&String(a)!==String(b)?null:(a?String(a):(b?String(b):null))};
const key=id=>"khaemenes.grade09.profile.background:"+encodeURIComponent(id);
const standard="#f4f0e7";
const control=document.createElement("div");control.style.cssText="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:10px";
const label=document.createElement("label");label.textContent="My background color";label.style.cssText="font-size:15px;display:flex;gap:8px;align-items:center";
const input=document.createElement("input");input.type="color";input.value=standard;input.setAttribute("aria-label","Choose profile background from color spectrum");label.append(input);
const save=document.createElement("button");save.type="button";save.textContent="Save background";
const reset=document.createElement("button");reset.type="button";reset.textContent="Reset";
for(const b of [save,reset])b.style.cssText="font:inherit;font-size:13px;padding:7px 10px;border:1px solid #a99b82;border-radius:7px;background:#fff9ec;color:#21392f";
const status=document.createElement("span");status.setAttribute("role","status");status.style.fontSize="13px";control.append(label,save,reset,status);row.querySelector(".profile-name")?.parentNode.append(control);
const paint=color=>{
 document.documentElement.style.setProperty("--student-custom-bg",color);
 document.documentElement.style.setProperty("--paper",color);
 document.documentElement.style.setProperty("background-color",color,"important");
 document.body.style.setProperty("background",color,"important");
 // Keep academic cards high-contrast even for very dark or vivid colors.
 const red=parseInt(color.slice(1,3),16),green=parseInt(color.slice(3,5),16),blue=parseInt(color.slice(5,7),16);
 const light=(red*299+green*587+blue*114)/1000>145;
 document.body.dataset.studentCustomBackground=light?"light":"dark";
};
const valid=v=>/^#[0-9a-f]{6}$/i.test(v);
function refresh(){const id=person();let color=standard;if(id)try{const stored=localStorage.getItem(key(id));if(valid(stored))color=stored}catch{}input.value=color;paint(color);save.disabled=reset.disabled=!id;if(!id)status.textContent="Choose your learner to save colors.";else status.textContent=""}
input.addEventListener("input",()=>{paint(input.value);status.textContent="Preview color — select Save background to keep it.";});
save.addEventListener("click",()=>{const id=person();if(!id){status.textContent="Choose your learner to save a background.";return}try{localStorage.setItem(key(id),input.value);status.textContent="Background saved for this learner on this device."}catch{status.textContent="Unable to save color on this device."}});
reset.addEventListener("click",()=>{const id=person();if(!id)return;try{localStorage.removeItem(key(id));input.value=standard;paint(standard);status.textContent="Background reset."}catch{status.textContent="Unable to reset background."}});
for(const ev of ["pageshow","khaemenes-student-profile-changed"])window.addEventListener(ev,refresh);
refresh();
})();
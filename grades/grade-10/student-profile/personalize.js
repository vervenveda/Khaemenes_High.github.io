/* Grade 10 learner-owned appearance and study preferences. No grading or placement writes. */
(()=>{"use strict";
const root=document.getElementById("grade10Personalize");if(!root)return;
const learner=window.KhaemenesStudentProfileV2?.activeLearner?.();
const id=learner?.learnerId;
const key=id?"khaemenes.grade10.profile.preferences:"+id:null;
const sameLearner=()=>!!id&&window.KhaemenesStudentProfileV2?.activeLearner?.()?.learnerId===id;
const defaults={accent:"#9fc9b7",focus:"",motto:""};
let settings={...defaults};
if(key){try{const saved=JSON.parse(localStorage.getItem(key)||"null");if(saved&&typeof saved==="object")settings={...defaults,...saved}}catch{}}
const h=document.createElement("h2");h.textContent="Customize my study space";
const p=document.createElement("p");p.textContent=key?"Choose a color and write your personal study focus. These preferences belong only to your active learner profile.":"Sign in to an Academy learner profile to save customization. Preview changes are not stored.";
const form=document.createElement("form");form.style.cssText="display:grid;gap:12px;max-width:650px";
const make=(name,label,type,max=140)=>{const wrap=document.createElement("label");wrap.textContent=label;wrap.style.display="grid";wrap.style.gap="6px";const input=document.createElement("input");input.name=name;input.type=type;input.value=settings[name]||"";input.maxLength=max;input.style.cssText="padding:10px;border:1px solid #afaeaa;border-radius:7px;background:#fff;color:#22332b";wrap.append(input);form.append(wrap);return input};
const accent=make("accent","My dashboard accent","color");
const focus=make("focus","My current learning goal","text",140);
const motto=make("motto","My encouragement note","text",140);
const preview=document.createElement("div");preview.style.cssText="border-left:5px solid #9fc9b7;padding:12px;background:#20394a;color:#fff;border-radius:7px";
const status=document.createElement("p");status.setAttribute("role","status");status.setAttribute("aria-live","polite");
const paint=()=>{preview.style.borderLeftColor=/^#[0-9a-fA-F]{6}$/.test(accent.value)?accent.value:defaults.accent;preview.textContent=[focus.value,motto.value].filter(Boolean).join(" · ")||"Your learning goal and encouragement will appear here."};
[accent,focus,motto].forEach(e=>e.addEventListener("input",paint));
const save=document.createElement("button");save.type="submit";save.textContent="Save my preferences";save.disabled=!key;save.style.cssText="max-width:240px;padding:10px;border-radius:7px";form.append(save);
form.addEventListener("submit",e=>{e.preventDefault();if(!key||!sameLearner()){status.textContent="Active learner changed. Reload this dashboard before saving preferences.";return}try{localStorage.setItem(key,JSON.stringify({accent:accent.value,focus:focus.value.trim().slice(0,140),motto:motto.value.trim().slice(0,140)}));status.textContent="Your study-space preferences were saved on this device."}catch{status.textContent="Could not save preferences. Your existing profile remains unchanged."}});
const reset=document.createElement("button");reset.type="button";reset.textContent="Reset appearance";reset.disabled=!key;reset.addEventListener("click",()=>{if(!key||!sameLearner()){status.textContent="Active learner changed. Reload this dashboard before resetting preferences.";return}try{localStorage.removeItem(key);accent.value=defaults.accent;focus.value="";motto.value="";paint();status.textContent="Appearance preferences reset."}catch{status.textContent="Unable to reset saved preferences."}});form.append(reset);
root.append(h,p,form,preview,status);paint();
})();
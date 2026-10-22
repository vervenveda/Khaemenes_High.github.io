/* Learner-local profile background and portrait. No network upload or academic writes. */
(()=>{"use strict";
const grade=String(document.body.dataset.grade||"");
if(!["10","11","12"].includes(grade))return;
const mount=document.getElementById(grade==="10"?"grade10Personalize":"upperGradePersonalize");
if(!mount)return;
const api=window.KhaemenesStudentProfileV2;
const learner=api?.activeLearner?.(),id=learner?.learnerId||null;
const key=id?"khaemenes.grade"+grade+".profile.appearance:"+encodeURIComponent(id):null;
const current=()=>!!id&&api?.activeLearner?.()?.learnerId===id;
const defaults={background:"#101c2e",photo:null};
let saved={...defaults};
if(key)try{const v=JSON.parse(localStorage.getItem(key)||"null");if(v&&typeof v==="object"){if(/^#[0-9a-fA-F]{6}$/.test(v.background))saved.background=v.background;if(typeof v.photo==="string"&&/^data:image\/jpeg;base64,/.test(v.photo)&&v.photo.length<400000)saved.photo=v.photo}}catch{}
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
const section=el("section");section.style.cssText="display:grid;gap:12px;margin-top:18px;padding:16px;border:1px solid #b6a787;border-radius:7px";section.setAttribute("aria-label","Background and student photo");
section.append(el("h3","Background color and my photo"));
const desc=el("p","Choose any background color and add an optional photo. Both stay in this browser, associated with the selected learner. Never upload a private photo to a public repository.");section.append(desc);
const colorLabel=el("label","Choose my background color");
colorLabel.style.cssText="display:flex;align-items:center;gap:12px;flex-wrap:wrap";
const color=el("input");color.type="color";color.value=saved.background;color.setAttribute("aria-label","Full-spectrum dashboard background color");colorLabel.append(color);section.append(colorLabel);
const photoLabel=el("label","Select a personal profile photo (JPG, PNG, or WebP; maximum 4 MB)");
photoLabel.style.cssText="display:grid;gap:8px";
const file=el("input");file.type="file";file.accept="image/jpeg,image/png,image/webp";file.disabled=!key;photoLabel.append(file);section.append(photoLabel);
const preview=el("img");preview.alt="Your selected profile portrait";preview.width=112;preview.height=112;preview.style.cssText="width:112px;height:112px;object-fit:cover;border-radius:50%;border:2px solid #b6a787;background:#e9e0cb";preview.hidden=!saved.photo;if(saved.photo)preview.src=saved.photo;section.append(preview);
const actions=el("div");actions.style.cssText="display:flex;gap:10px;flex-wrap:wrap";
const save=el("button","Save background and photo"),reset=el("button","Reset color and remove photo");save.type=reset.type="button";save.disabled=reset.disabled=!key;actions.append(save,reset);section.append(actions);
const status=el("p");status.setAttribute("role","status");status.setAttribute("aria-live","polite");section.append(status);
const setBackground=value=>{document.documentElement.style.setProperty("--ug-bg",value);document.documentElement.style.backgroundColor=value;document.body.style.backgroundColor=value};
function render(){setBackground(color.value);preview.hidden=!saved.photo;if(saved.photo)preview.src=saved.photo;else preview.removeAttribute("src")}
function guard(){if(current())return true;status.textContent="The active learner changed. Reload this page to customize the correct profile.";preview.hidden=true;preview.removeAttribute("src");save.disabled=reset.disabled=file.disabled=true;setBackground(defaults.background);return false}
color.addEventListener("input",()=>{if(guard())setBackground(color.value)});
file.addEventListener("change",async()=>{if(!guard())return;const selected=file.files?.[0];if(!selected)return;
 if(!["image/jpeg","image/png","image/webp"].includes(selected.type)||selected.size>4*1024*1024){status.textContent="Choose a JPG, PNG, or WebP photo under 4 MB.";file.value="";return}
 const url=URL.createObjectURL(selected);
 try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});if(!guard())return;
 const size=240,canvas=document.createElement("canvas");canvas.width=canvas.height=size;const ctx=canvas.getContext("2d");if(!ctx)throw Error("No image support");
 const side=Math.min(img.naturalWidth,img.naturalHeight);ctx.drawImage(img,(img.naturalWidth-side)/2,(img.naturalHeight-side)/2,side,side,0,0,size,size);
 const result=canvas.toDataURL("image/jpeg",0.78);if(result.length>400000)throw Error("Image too large after resizing");
 saved.photo=result;preview.src=result;preview.hidden=false;status.textContent="Photo ready. Choose Save to keep it on this device.";
 }catch{status.textContent="Unable to process this photo. Try another JPG, PNG, or WebP."}finally{URL.revokeObjectURL(url);file.value=""}
});
save.addEventListener("click",()=>{if(!guard())return;try{const record={background:color.value,photo:saved.photo};localStorage.setItem(key,JSON.stringify(record));status.textContent="Background and photo saved to this learner on this device."}catch{status.textContent="Storage unavailable or full. Try removing the photo or freeing browser storage."}});
reset.addEventListener("click",()=>{if(!guard())return;try{localStorage.removeItem(key);saved={...defaults};color.value=defaults.background;render();status.textContent="Background reset and photo removed from this device."}catch{status.textContent="Unable to reset preferences."}});
function refresh(){if(!guard())return}
window.addEventListener("pageshow",refresh);window.addEventListener("focus",refresh);window.addEventListener("khaemenes-student-profile-changed",refresh);
mount.append(section);render();
})();
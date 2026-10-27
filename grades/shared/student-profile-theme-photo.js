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
const desc=el("p","Choose your profile background color and optional photo. Your profile cards and pop-up tools follow your color with readable contrast. Choices stay on this browser for the selected learner; lesson and other-repository pages retain their own designs.");section.append(desc);
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
/* The palette is derived from the learner's chosen background instead of forcing dark text
   onto vivid colors or pale text onto light surfaces. No data is written by this function. */
const isHex=value=>typeof value==="string"&&/^#[0-9a-fA-F]{6}$/.test(value);
const rgb=value=>[1,3,5].map(i=>parseInt(value.slice(i,i+2),16));
const mix=(first,second,part)=>{
 const a=rgb(first),b=rgb(second);
 return "#"+a.map((n,i)=>Math.round(n*(1-part)+b[i]*part).toString(16).padStart(2,"0")).join("");
};
const luminance=value=>rgb(value).map(x=>{const n=x/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4}).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
const setBackground=value=>{
 const chosen=isHex(value)?value:defaults.background;
 // Light colored profiles get pale matching panels with dark text; dark profiles
 // get deep matching panels with light text. Both keep the chosen page color visible.
 const light=luminance(chosen)>=.14,root=document.documentElement;
 const palette={
  "--ug-bg":chosen,
  "--ug-panel":mix(chosen,light?"#ffffff":"#000000",light?.78:.27),
  "--ug-panel2":mix(chosen,light?"#ffffff":"#000000",light?.64:.12),
  "--ug-ink":light?"#182631":"#fffdf6",
  "--ug-muted":light?"#334657":"#ecf2f5",
  "--ug-gold":light?"#5a3913":"#ffe1aa",
  "--ug-forest":light?"#275c46":"#c9f1e2",
  "--ug-danger":light?"#902f36":"#ffc4c4",
  "--ug-line":light?"rgba(24,38,49,.35)":"rgba(255,249,234,.48)",
  "--ug-control-bg":"#fffefa",
  "--ug-control-ink":"#172536"
 };
 for(const [name,color] of Object.entries(palette))root.style.setProperty(name,color);
 root.dataset.khaeProfileTheme=light?"light":"dark";
 root.style.backgroundColor=chosen;
 document.body.style.backgroundColor=chosen;
};
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
save.addEventListener("click",()=>{if(!guard())return;try{const record={background:color.value,photo:saved.photo};localStorage.setItem(key,JSON.stringify(record));setBackground(record.background);status.textContent="Profile and pop-up colors, and optional photo, saved to this learner on this device."}catch{status.textContent="Storage unavailable or full. Try removing the photo or freeing browser storage."}});
reset.addEventListener("click",()=>{if(!guard())return;try{localStorage.removeItem(key);saved={...defaults};color.value=defaults.background;render();status.textContent="Background reset and photo removed from this device."}catch{status.textContent="Unable to reset preferences."}});
function refresh(){if(!guard())return}
window.addEventListener("pageshow",refresh);
window.addEventListener("focus",refresh);
window.addEventListener("khaemenes-student-profile-changed",refresh);
// If the same learner's profile is edited in another tab, restore its saved color.
// Unsaved color-preview changes in this tab remain intact until Save or Reset.
window.addEventListener("storage",event=>{
 if(event.key!==key&&!((event.key===null)&&key))return;
 if(!guard())return;
 try{
  const record=JSON.parse(localStorage.getItem(key)||"null");
  saved={...defaults};
  if(record&&typeof record==="object"){
   if(isHex(record.background))saved.background=record.background;
   if(typeof record.photo==="string"&&/^data:image\/jpeg;base64,/.test(record.photo)&&record.photo.length<400000)saved.photo=record.photo;
  }
  color.value=saved.background;
  render();
 }catch{status.textContent="Unable to reload this learner's saved appearance."}
});
mount.append(section);render();
})();
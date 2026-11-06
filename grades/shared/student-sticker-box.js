/* Profile Sticker Box: cosmetic rewards only; not a grading or mastery system. */
(()=>{"use strict";
const grade=(location.pathname.match(/\/grade-(09|10|11|12)\/student-profile\//)||[])[1];if(!grade||document.getElementById("khaeStickerBox"))return;
const api=window.KhaemenesStudentProfileV2,contract=window.KhaemenesCourseEntryContract;
const active=()=>{const a=api?.activeLearner?.()?.learnerId,b=contract?.readAcademyProfile?.()?.learnerId;return a&&b&&String(a)===String(b)?String(a):null};
const initial=active(),box=document.createElement("section");box.id="khaeStickerBox";
box.style.cssText="margin:0;padding:18px;border:1px solid #b4a17f;border-radius:7px;background:#1a2c40;color:#f3e9d9;font:400 16px/1.5 Nunito,Arial,sans-serif";
const h=document.createElement("h2");h.textContent=grade==="09"?"Earned Stickers & Rewards":"My Sticker Box";h.style.cssText="font-weight:400;font-size:22px;margin:0 0 6px";
const p=document.createElement("p");p.textContent="Celebrate a successful unit quiz! Earn one sticker choice per verified quiz pass (80% or higher). Stickers are just for fun and never change grades.";
const wall=document.createElement("div");wall.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;min-height:36px";
const count=document.createElement("p");count.setAttribute("role","status");count.setAttribute("aria-live","polite");
const chooser=document.createElement("div");chooser.style.cssText="display:flex;flex-wrap:wrap;gap:8px";
box.append(h,p,wall,count,chooser);
{
 const dialog=document.createElement("dialog");
 dialog.id="grade09StickerBoxDialog";
 dialog.setAttribute("aria-labelledby","grade09StickerBoxTitle");
 const header=document.createElement("header");
 header.className="grade09-sticker-dialog-head";
 const title=document.createElement("h2");
 title.id="grade09StickerBoxTitle";title.textContent="My Sticker Box";
 const close=document.createElement("button");close.type="button";close.textContent="Close";
 header.append(title,close);
 const body=document.createElement("div");body.className="grade09-sticker-dialog-body";
 body.append(box);dialog.append(header,body);document.body.append(dialog);
 let trigger=null;
 close.addEventListener("click",()=>dialog.close());
 dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
 dialog.addEventListener("close",()=>{if(trigger?.isConnected)trigger.focus()});
 window.KhaemenesGrade09StickerBoxDialog=Object.freeze({
  open(from){trigger=from||document.activeElement;paint();if(!dialog.open)dialog.showModal()},
  close(){if(dialog.open)dialog.close()},
  version:1
 });
}
const catalog=["🌟","🌈","🦋","🌻","🐬","🦉","🚀","🎨","🔭","🪐","📚","🏆","💎","🧩","🦄","🎵","🐢","🍀","🧠","✨","🌸","🐝","🦕","⚡"];
// Grade 09 may select a learner after this module initializes. Read the current
// learner dynamically there; keep the older grade behavior unchanged.
const currentLearner=()=>active();
const recordKey=()=>{const learner=currentLearner();return learner?"khaemenes.student.stickers.v1:"+encodeURIComponent(learner):null;};
const safe=x=>x&&Array.isArray(x.earned)&&Array.isArray(x.placed);
function read(){const key=recordKey();if(!key)return {earned:[],placed:[]};try{const v=JSON.parse(localStorage.getItem(key)||"null");return safe(v)?{earned:v.earned.filter(x=>typeof x==="string").slice(0,300),placed:v.placed.filter(x=>catalog.includes(x)).slice(0,300)}:{earned:[],placed:[]}}catch{return {earned:[],placed:[]}}}
const same=()=>!!currentLearner()&&(grade==="09"||window.KhaemenesHighProfileGradeContext?.active?.()?.gradeNumber===Number(grade));
function paint(){wall.replaceChildren();chooser.replaceChildren();if(!same()){count.textContent="Select your learner and reload this profile to view your stickers.";return}
 const data=read();data.placed.forEach(x=>{const s=document.createElement("span");s.textContent=x;s.style.fontSize="30px";s.setAttribute("aria-label","Profile sticker "+x);wall.append(s)});
 const remaining=Math.max(0,data.earned.length-data.placed.length);count.textContent=data.placed.length+" stickers on my profile · "+remaining+" sticker "+(remaining===1?"choice":"choices")+" available";
 if(!remaining){const info=document.createElement("span");info.textContent="Your next sticker unlocks after a verified unit-quiz pass.";chooser.append(info);return}
 catalog.forEach(emoji=>{const b=document.createElement("button");b.type="button";b.textContent=emoji;b.setAttribute("aria-label","Choose "+emoji+" sticker");b.style.cssText="font-size:24px;padding:5px 9px;border:1px solid #b6a58c;border-radius:7px;background:#f2e9db";b.onclick=()=>{if(!same())return;const now=read();if(now.placed.length>=now.earned.length)return;now.placed.push(emoji);try{localStorage.setItem(recordKey(),JSON.stringify(now));paint();window.dispatchEvent(new CustomEvent("khaemenes-grade09-sticker-rewards-changed"))}catch{count.textContent="Unable to store sticker on this device."}};chooser.append(b)});
}
paint();window.addEventListener("focus",paint);window.addEventListener("pageshow",paint);window.addEventListener("khaemenes-student-profile-changed",paint);window.addEventListener("storage",e=>{if(!e.key||e.key===recordKey())paint()});
})();
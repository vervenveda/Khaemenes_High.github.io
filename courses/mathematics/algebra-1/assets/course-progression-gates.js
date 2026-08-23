(()=>{
"use strict";
const current=document.currentScript;
const authoritySrc=new URL("mastery-authority-v1.js",current?.src||location.href).href;
function authority(){return window.KhaemenesAlgebra1MasteryAuthority||null}
function failClosed(message){
 const section=document.getElementById("units"),grid=section?.querySelector(".card-grid");
 if(!grid)return;
 [...grid.querySelectorAll(':scope > a.card[href*="units/unit-"]')].forEach((card,i)=>{if(i===0)return;card.dataset.locked="true";card.setAttribute("aria-disabled","true");card.removeAttribute("href");const p=document.createElement("p");p.className="notice";p.textContent="Locked · Mastery evidence authority is unavailable. Reload before continuing.";card.append(p);card.addEventListener("click",e=>e.preventDefault())});
 const note=document.createElement("p");note.className="notice";note.innerHTML=`<strong>Progression protection:</strong> ${message}`;section.querySelector("h2")?.after(note);
}
function boot(){
 const A=authority();if(!A)return failClosed("The canonical Algebra I mastery record could not be loaded, so later units remain locked rather than guessing at progression.");
 const section=document.getElementById("units"),grid=section?.querySelector(".card-grid");if(!grid)return;
 const cards=[...grid.querySelectorAll(':scope > a.card[href*="units/unit-"]')];
 cards.forEach((card,i)=>{const unit=i+1,previousOk=unit===1||A.unitMastered(unit-1),midtermOk=unit<7||A.midtermMastered(),unlocked=previousOk&&midtermOk,mastered=A.unitMastered(unit);if(mastered){const p=document.createElement("p");p.className="eyebrow";p.textContent="✓ 80% unit mastery demonstrated";card.prepend(p)}if(!unlocked){card.dataset.locked="true";card.setAttribute("aria-disabled","true");card.removeAttribute("href");const p=document.createElement("p");p.className="notice";p.textContent=unit>=7&&previousOk&&!midtermOk?"Locked · Full mixed-evidence Midterm mastery at 80% is required before second-half Algebra I progression.":`Locked · Reach 80% mastery on Unit ${String(unit-1).padStart(2,"0")} first.`;card.append(p);card.addEventListener("click",e=>e.preventDefault())}});
 const note=document.createElement("p");note.className="notice";note.innerHTML="<strong>Strict progression:</strong> each lesson check requires 80% to unlock the next lesson; each unit mastery check requires 80% to unlock the next unit; reviewed Midterm mastery is required throughout Units 07–13; graded weekly checks and the Final follow the same 80% rule.";section.querySelector("h2")?.after(note);
}
function start(){if(authority())return boot();const s=document.createElement("script");s.src=authoritySrc;s.async=false;s.onload=boot;s.onerror=()=>failClosed("The canonical Algebra I mastery record failed to load. No later-unit unlocks were granted.");document.head.appendChild(s)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();

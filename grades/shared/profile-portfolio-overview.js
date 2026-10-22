/* Read-only student evidence preview; never writes to the canonical portfolio. */
(()=>{"use strict";
const grade=String(document.body.dataset.grade||document.body.dataset.khaeGrade||"").padStart(2,"0");
if(!["10","11","12"].includes(grade))return;
const mount=document.getElementById("my-profile-extras");if(!mount)return;
const section=document.createElement("section");section.id="my-evidence-overview";section.style.cssText="padding:14px;margin-top:18px;border:1px solid #b6a787;border-radius:7px";
const heading=document.createElement("h2");heading.textContent="My evidence overview";section.append(heading);
const summary=document.createElement("p");summary.setAttribute("role","status");section.append(summary);
const list=document.createElement("ul");section.append(list);
const action=document.createElement("a");action.textContent="Open my full learning portfolio";action.href="../../../portfolio/index.html?grade="+grade;section.append(action);
mount.append(section);
const profileApi=window.KhaemenesStudentProfileV2;
const active=profileApi?.activeLearner?.();
const contract=window.KhaemenesCourseEntryContract;
const canonical=contract?.readAcademyProfile?.();
const learnerId=active?.learnerId&&canonical?.learnerId&&String(active.learnerId)===String(canonical.learnerId)?String(active.learnerId):null;
if(!learnerId){summary.textContent="Select your Academy learner to see evidence. No records are shown unless the learner identity agrees.";return}
const key="khae-learning-portfolio-v1:learner:"+encodeURIComponent(learnerId);
function show(){
 list.replaceChildren();
 const current=profileApi?.activeLearner?.()?.learnerId,verified=contract?.readAcademyProfile?.()?.learnerId;
 if(String(current||"")!==learnerId||String(verified||"")!==learnerId){summary.textContent="Learner changed. Reload this page to view the correct portfolio.";return}
 let records=[];
 try{const parsed=JSON.parse(localStorage.getItem(key)||"[]");if(!Array.isArray(parsed))throw Error("Invalid portfolio");records=parsed.filter(x=>x&&typeof x.title==="string"&&typeof x.subject==="string"&&typeof x.detail==="string").slice(0,500)}
 catch{summary.textContent="Portfolio overview unavailable. Open the portfolio to recover or import a backup.";return}
 summary.textContent=records.length+" evidence "+(records.length===1?"entry":"entries")+" saved on this device. This is a read-only overview, not a gradebook.";
 records.slice(-5).reverse().forEach(record=>{const li=document.createElement("li");li.textContent=String(record.subject).slice(0,80)+" — "+String(record.title).slice(0,140);list.append(li)});
}
show();
window.addEventListener("storage",event=>{if(event.key===key||event.key===null)show()});
window.addEventListener("khaemenes-student-profile-changed",show);
})();
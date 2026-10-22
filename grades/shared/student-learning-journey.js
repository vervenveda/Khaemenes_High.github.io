/* Private journey dialog. Evidence is read only; reflections stay learner-scoped. */
(()=>{"use strict";
const m=location.pathname.match(/\/grade-(09|10|11|12)\/student-profile\//);if(!m)return;
const grade=m[1],profile=window.KhaemenesStudentProfileV2,contract=window.KhaemenesCourseEntryContract;
const element=(t,s)=>{const x=document.createElement(t);if(s!==undefined)x.textContent=s;return x};
const nav=document.querySelector(".ug-priority-nav")||document.querySelector(".grade09-priority")||document.querySelector(".ug-navlinks")||document.querySelector(".navlinks");
if(!nav||document.getElementById("openLearningJourney"))return;
const button=element("button","✦ My Learning Journey");button.type="button";button.id="openLearningJourney";button.style.cssText="padding:9px 13px;border:1px solid #ab9772;border-radius:7px;background:#eedfba;color:#202934;font:inherit;cursor:pointer";nav.append(button);
const dialog=element("dialog");dialog.id="myLearningJourney";dialog.setAttribute("aria-label","My Learning Journey");dialog.style.cssText="width:min(94vw,860px);max-height:88vh;overflow:auto;border:1px solid #b9a37f;border-radius:7px;padding:22px;background:#f6f0e5;color:#222931;font:400 17px/1.55 Arial,sans-serif;box-shadow:0 25px 90px #0008";
const heading=element("h2","My Learning Journey");const caption=element("p","A private record of portfolio evidence, ideas, and reflections. These entries are not official mastery awards.");
const close=element("button","Close");close.type="button";close.style.cssText="float:right;padding:8px 13px;border-radius:7px";close.onclick=()=>dialog.close();
const status=element("p");status.setAttribute("role","status");status.setAttribute("aria-live","polite");
const timeline=element("ol");timeline.style.cssText="padding-left:26px";
const letterLabel=element("label","A Note to My Future Self");letterLabel.style.cssText="display:grid;gap:8px;margin-top:16px";
const letter=element("textarea");letter.rows=5;letter.maxLength=2000;letter.placeholder="What do you hope to learn, discover, or become?";letter.style.cssText="width:100%;padding:12px;border-radius:7px;font:inherit";letterLabel.append(letter);
const save=element("button","Save my letter");save.type="button";save.style.cssText="padding:9px 13px;border-radius:7px;margin:10px 8px 10px 0";
const exportBtn=element("button","Export my journey");exportBtn.type="button";exportBtn.style.cssText="padding:9px 13px;border-radius:7px";
dialog.append(close,heading,caption,status,element("h3","My portfolio timeline"),timeline,letterLabel,save,exportBtn);document.body.append(dialog);
let captured=null,notesKey=null,portfolioKey=null;
const identity=()=>{const a=profile?.activeLearner?.()?.learnerId,b=contract?.readAcademyProfile?.()?.learnerId;return a&&b&&String(a)===String(b)?String(a):null};
const valid=x=>x&&typeof x.id==="string"&&typeof x.subject==="string"&&typeof x.title==="string"&&typeof x.detail==="string"&&typeof x.reference==="string";
function authorized(){if(captured&&identity()===captured)return true;timeline.replaceChildren();letter.value="";save.disabled=exportBtn.disabled=true;status.textContent="The selected learner changed. Close and reopen this window under the correct learner.";return false}
function readEvidence(){try{const v=JSON.parse(localStorage.getItem(portfolioKey)||"[]");return Array.isArray(v)?v.filter(valid).slice(0,500):[]}catch{return []}}
function present(){timeline.replaceChildren();if(!authorized())return;const entries=readEvidence();status.textContent=entries.length+" portfolio "+(entries.length===1?"record":"records")+" on this device. These are evidence entries, not certified achievements.";
entries.slice(-30).reverse().forEach(x=>{const li=element("li");li.style.marginBottom="12px";const name=element("strong",x.subject.slice(0,80)+" — "+x.title.slice(0,140));const ref=element("div",x.reference.slice(0,200)||"Personal academic evidence");li.append(name,ref);timeline.append(li)});
if(!entries.length)timeline.append(element("li","Your journey starts when you save your first learning evidence entry."));
try{letter.value=String(localStorage.getItem(notesKey)||"").slice(0,2000)}catch{letter.value=""}
}
button.onclick=()=>{captured=identity();if(!captured){status.textContent="Select an Academy learner to open a private learning journey.";timeline.replaceChildren();letter.value="";letter.disabled=save.disabled=exportBtn.disabled=true}else{notesKey="khaemenes.learning-journey.letter.v1:"+encodeURIComponent(captured);portfolioKey="khae-learning-portfolio-v1:learner:"+encodeURIComponent(captured);letter.disabled=save.disabled=exportBtn.disabled=false;present()}dialog.showModal()};
save.onclick=()=>{if(!authorized())return;try{localStorage.setItem(notesKey,letter.value.slice(0,2000));status.textContent="Your letter has been saved on this device."}catch{status.textContent="Could not save the letter. Export a copy of your work."}};
exportBtn.onclick=()=>{if(!authorized())return;const data={format:"khaemenes-learning-journey-v1",grade,learnerId:captured,portfolioEvidence:readEvidence(),futureSelfLetter:letter.value.slice(0,2000)};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=element("a");a.href=url;a.download="my-learning-journey.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
dialog.addEventListener("cancel",()=>{captured=null});dialog.addEventListener("close",()=>{captured=null;letter.value="";timeline.replaceChildren()});
window.addEventListener("khaemenes-student-profile-changed",()=>{if(dialog.open)authorized()});
window.addEventListener("focus",()=>{if(dialog.open)authorized()});
})();
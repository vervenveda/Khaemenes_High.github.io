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
const dateLabel=element("label","Open my letter on");dateLabel.style.cssText="display:grid;gap:8px;margin-top:10px";
const openDate=element("input");openDate.type="date";openDate.setAttribute("aria-label","Future Self letter opening date");dateLabel.append(openDate);
const sealed=element("p");sealed.setAttribute("role","status");
const save=element("button","Save or seal my letter");save.type="button";save.style.cssText="padding:9px 13px;border-radius:7px;margin:10px 8px 10px 0";
const exportBtn=element("button","Export my journey");exportBtn.type="button";exportBtn.style.cssText="padding:9px 13px;border-radius:7px";
dialog.append(close,heading,caption,status,element("h3","My portfolio timeline"),timeline,letterLabel,dateLabel,sealed,save,exportBtn);document.body.append(dialog);
let captured=null,notesKey=null,portfolioKey=null,storedLetter=null;
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const validDate=s=>typeof s==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+"T00:00:00"));
function readLetter(){try{const raw=localStorage.getItem(notesKey);if(!raw)return {text:"",openDate:""};try{const data=JSON.parse(raw);if(data&&data.format==="khaemenes-future-letter-v2")return {text:String(data.text||"").slice(0,2000),openDate:validDate(data.openDate)?data.openDate:""}}catch{}return {text:String(raw).slice(0,2000),openDate:""}}catch{return {text:"",openDate:""}}}
function presentLetter(){storedLetter=readLetter();const locked=!!storedLetter.openDate&&storedLetter.openDate>today();letter.value=locked?"":storedLetter.text;letter.disabled=locked;openDate.value=storedLetter.openDate;openDate.disabled=locked;save.disabled=locked;sealed.textContent=locked?"Sealed until "+storedLetter.openDate+". Your letter stays hidden until this date on this device.":"Your letter is available. Choose a future date and save to seal it."}
const identity=()=>{const a=profile?.activeLearner?.()?.learnerId,b=contract?.readAcademyProfile?.()?.learnerId;return a&&b&&String(a)===String(b)?String(a):null};
const valid=x=>x&&typeof x.id==="string"&&typeof x.subject==="string"&&typeof x.title==="string"&&typeof x.detail==="string"&&typeof x.reference==="string";
function authorized(){if(captured&&identity()===captured)return true;timeline.replaceChildren();letter.value="";openDate.value="";sealed.textContent="";letter.disabled=openDate.disabled=true;save.disabled=exportBtn.disabled=true;status.textContent="The selected learner changed. Close and reopen this window under the correct learner.";return false}
function readEvidence(){try{const v=JSON.parse(localStorage.getItem(portfolioKey)||"[]");return Array.isArray(v)?v.filter(valid).slice(0,500):[]}catch{return []}}
function present(){timeline.replaceChildren();if(!authorized())return;const entries=readEvidence();status.textContent=entries.length+" portfolio "+(entries.length===1?"record":"records")+" on this device. These are evidence entries, not certified achievements.";
entries.slice(-30).reverse().forEach(x=>{const li=element("li");li.style.marginBottom="12px";const name=element("strong",x.subject.slice(0,80)+" — "+x.title.slice(0,140));const ref=element("div",x.reference.slice(0,200)||"Personal academic evidence");li.append(name,ref);timeline.append(li)});
if(!entries.length)timeline.append(element("li","Your journey starts when you save your first learning evidence entry."));
presentLetter()
}
button.onclick=()=>{captured=identity();if(!captured){status.textContent="Select an Academy learner to open a private learning journey.";timeline.replaceChildren();letter.value="";openDate.value="";letter.disabled=openDate.disabled=save.disabled=exportBtn.disabled=true}else{notesKey="khaemenes.learning-journey.letter.v1:"+encodeURIComponent(captured);portfolioKey="khae-learning-portfolio-v1:learner:"+encodeURIComponent(captured);letter.disabled=openDate.disabled=save.disabled=exportBtn.disabled=false;present()}dialog.showModal()};
save.onclick=()=>{if(!authorized())return;if(storedLetter?.openDate&&storedLetter.openDate>today()){presentLetter();return}const d=openDate.value;if(d&&(!validDate(d)||d<=today())){status.textContent="Choose a future opening date or leave it blank for an unsealed letter.";return}try{localStorage.setItem(notesKey,JSON.stringify({format:"khaemenes-future-letter-v2",text:letter.value.slice(0,2000),openDate:d}));presentLetter();status.textContent=d?"Your letter is sealed until "+d+".":"Your letter has been saved on this device."}catch{status.textContent="Could not save the letter. Export a copy of your work."}};
exportBtn.onclick=()=>{if(!authorized())return;const data={format:"khaemenes-learning-journey-v1",grade,learnerId:captured,portfolioEvidence:readEvidence(),futureSelfLetter:(storedLetter?.openDate&&storedLetter.openDate>today())?{sealed:true,openDate:storedLetter.openDate}:{text:letter.value.slice(0,2000),openDate:openDate.value}};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=element("a");a.href=url;a.download="my-learning-journey.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
dialog.addEventListener("cancel",()=>{captured=null});dialog.addEventListener("close",()=>{captured=null;letter.value="";openDate.value="";storedLetter=null;timeline.replaceChildren()});
window.addEventListener("khaemenes-student-profile-changed",()=>{if(dialog.open)authorized()});
window.addEventListener("focus",()=>{if(dialog.open)authorized()});
})();
/* Grade 09 Freshman Discovery Studio: personal exploration only.
 * Does not alter curriculum, assessment, course pins, stickers, or mastery.
 * Saved ideas are local to this browser, NOT authenticated private storage.
 */
(()=>{"use strict";
if(!document.body||window.KhaemenesFreshmanDiscoveryStudio)return;
const host=document.getElementById("grade09FreshmanDiscovery"),main=document.querySelector("main");
if(!host||!main)return;
const contract=window.KhaemenesCourseEntryContract,profile=window.KhaemenesStudentProfileV2;
const KEY="khaemenes-grade09-freshman-discovery-v1:learner:";
const DRAFT="khaemenes-grade09-freshman-discovery-draft-v1:learner:";
const create=(tag,cls,label)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(label!==undefined)n.textContent=label;return n};
const steps=[
 ["findClasses","Find my classes and choose where to begin"],
 ["schedule","Make my schedule feel like my own"],
 ["study","Try a study tool or a new learning strategy"],
 ["question","Follow a question I am curious about"],
 ["create","Make something or begin a project"],
 ["support","Discover where I can ask for help"]
];
const fields=[
 ["curiosity","Something I am curious about",600],
 ["experiment","An idea I want to test, build, draw, write, or investigate",1400],
 ["discoveries","What I discovered or want to try next",1400],
 ["proud","Something I am proud of today",600],
 ["growth","A skill I want to grow this year",600]
];
host.replaceChildren();
host.append(create("p","freshman-eyebrow","Grade 9 · Explore · Experiment · Belong"));
const h=create("h2","","My Freshman Discovery Studio");h.id="grade09FreshmanDiscoveryTitle";host.append(h);
host.append(create("p","freshman-intro","Your first year of high school is full of possibilities. Try something new, follow an idea, and collect the moments that matter to you. There is no single right way to begin."));
const status=create("p","freshman-status");status.setAttribute("role","status");status.setAttribute("aria-live","polite");host.append(status);
const grid=create("div","freshman-grid");host.append(grid);
function panel(name,desc){
 const p=create("section","freshman-card");p.append(create("h3","",name),create("p","",desc));grid.append(p);return p;
}
const adventure=panel("My First-Year Adventure","Explore the Academy at your own pace. These are personal discoveries, not graded tasks.");
const tally=create("p","freshman-count");adventure.append(tally);
const checklist=create("div","freshman-checklist");adventure.append(checklist);
const checks=new Map();
for(const [key,label] of steps){const row=create("label","freshman-check"),box=create("input");box.type="checkbox";row.append(box,create("span","",label));checklist.append(row);checks.set(key,box)}
const curiosity=panel("My Curiosity Lab","Have a question, an invention idea, or something you want to make? Give it a place to grow.");
const growth=panel("My Growth & Celebrations","Notice what you've learned, celebrate little victories, and dream about what's next. You never have to compare your progress with anyone else's.");
const areas=new Map();
for(const [key,label,max] of fields){
 const p=["curiosity","experiment","discoveries"].includes(key)?curiosity:growth;
 const wrapper=create("label","freshman-field"),area=create("textarea");
 area.rows=key==="experiment"||key==="discoveries"?3:2;area.maxLength=max;
 wrapper.append(create("span","",label),area);p.append(wrapper);areas.set(key,area);
}
const links=(panel,items)=>{
 const row=create("div","freshman-links");
 for(const [label,href] of items){const a=create("a","freshman-link",label);a.href=href;row.append(a)}
 panel.append(row);
};
links(adventure,[["Open My Schedule","#grade09ProfileFirst"],["Explore My Classes","daily-lessons/"]]);
links(curiosity,[["Science Investigation Notebook","../../../courses/science/"],["Explore My Study Tools","games/"]]);
links(growth,[["My Dreams & Achievements","#khaeDreamsAchievements"],["My Sticker Box","#khaeStickerBox"]]);
const footer=create("div","freshman-footer");
const save=create("button","freshman-save","Save my discoveries");save.type="button";
const clear=create("button","freshman-clear","Clear my saved discoveries");clear.type="button";
const state=create("span","freshman-save-state");state.setAttribute("role","status");
footer.append(save,clear,state);host.append(footer);
host.append(create("p","freshman-privacy","Your ideas are saved only on this browser. Other people using the same browser profile may be able to see them. This does not affect grades or class progress."));
let currentId=null,baseline="",dirty=false;
const storageKey=id=>KEY+encodeURIComponent(id),draftKey=id=>DRAFT+encodeURIComponent(id);
function learner(){
 const academic=contract?.readAcademyProfile?.(),selected=profile?.activeLearner?.();
 if(!academic?.learnerId||!selected?.learnerId||String(academic.learnerId)!==String(selected.learnerId))return null;
 if(selected.stage!=="high"||Number(selected.grade)!==9)return null;
 return String(selected.learnerId);
}
function get(id,draft){
 try{
  const obj=JSON.parse((draft?sessionStorage:localStorage).getItem((draft?draftKey:storageKey)(id))||"null");
  return obj?.version===1&&obj.grade===9&&obj.learnerId===id?obj:null;
 }catch{return null}
}
function snapshot(id){
 return {version:1,grade:9,learnerId:id,
 checks:Object.fromEntries([...checks].map(([key,box])=>[key,box.checked])),
 ...Object.fromEntries(fields.map(([key,,max])=>[key,areas.get(key).value.slice(0,max)]))};
}
function normal(obj){
 return JSON.stringify({checks:Object.fromEntries(steps.map(([k])=>[k,Boolean(obj?.checks?.[k])])),
 ...Object.fromEntries(fields.map(([key])=>[key,typeof obj?.[key]==="string"?obj[key]:""]))});
}
function progress(){tally.textContent=[...checks.values()].filter(x=>x.checked).length+" of "+steps.length+" discoveries explored — your own pace, no grades."}
function keepDraft(id){
 if(!id||learner()!==id)return false;
 try{sessionStorage.setItem(draftKey(id),JSON.stringify(snapshot(id)));return true}catch{return false}
}
function changed(){
 if(!currentId||learner()!==currentId)return;
 dirty=normal(snapshot(currentId))!==baseline;save.disabled=!dirty;
 state.textContent=dirty?(keepDraft(currentId)?"Unsaved ideas kept in this tab.":"Unsaved changes; temporary storage is unavailable."):"All changes saved.";
}
function render(){
 const id=learner();
 if(id===currentId&&dirty)return;
 currentId=id;
 const saved=id?get(id,false):null,draft=id?get(id,true):null,source=draft||saved;
 for(const [key,box] of checks){box.checked=Boolean(source?.checks?.[key]);box.disabled=!id}
 for(const [key,area] of areas){area.value=typeof source?.[key]==="string"?source[key]:"";area.disabled=!id}
 baseline=normal(saved);dirty=Boolean(id&&draft&&normal(draft)!==baseline);
 save.disabled=!id||!dirty;clear.disabled=!id;
 state.textContent=!id?"":dirty?"Your unsaved ideas were restored.":saved?"Your saved discoveries are here.":"Your story starts here.";
 status.textContent=id?"Make this studio your own. Try an idea and save it whenever you're ready.":"You're welcome to explore. Select your registered Grade 9 profile to save your own discoveries.";
 progress();
 if(id&&!dirty&&draft)try{sessionStorage.removeItem(draftKey(id))}catch{}
}
save.addEventListener("click",()=>{
 const id=learner();if(!id||id!==currentId){render();return}
 const value={...snapshot(id),updatedAt:new Date().toISOString()};
 try{
  if(learner()!==id)return;
  localStorage.setItem(storageKey(id),JSON.stringify(value));
  try{sessionStorage.removeItem(draftKey(id))}catch{}
  baseline=normal(value);dirty=false;save.disabled=true;
  state.textContent="Saved "+new Date(value.updatedAt).toLocaleString();
  status.textContent="Your discoveries are saved on this browser. Keep exploring!";
 }catch{state.textContent="Couldn't save. Your ideas are still here in this tab where supported."}
});
clear.addEventListener("click",()=>{
 const id=learner();if(!id||id!==currentId)return;
 if(!window.confirm("Delete your saved discoveries and temporary draft from this browser? This can't be undone."))return;
 if(learner()!==id)return;
 try{localStorage.removeItem(storageKey(id));sessionStorage.removeItem(draftKey(id))}
 catch{status.textContent="Couldn't clear your saved discoveries on this browser.";return}
 currentId=null;dirty=false;render();status.textContent="Your saved discoveries were cleared on this browser.";
});
for(const box of checks.values())box.addEventListener("change",()=>{progress();changed()});
for(const area of areas.values())area.addEventListener("input",changed);
window.addEventListener("beforeunload",e=>{
 if(!dirty||!currentId||learner()!==currentId)return;
 keepDraft(currentId);e.preventDefault();e.returnValue="";
});
function place(){
 const rooms=document.getElementById("studentRoomsAfterPortfolio");
 const portfolio=main.querySelector('aside[aria-label="Student Learning Portfolio"]');
 const anchor=rooms?.parentElement===main?rooms:portfolio?.parentElement===main?portfolio:null;
 if(anchor&&host.previousElementSibling!==anchor)anchor.insertAdjacentElement("afterend",host);
}
place();render();
for(const type of ["pageshow","khaemenes-family-changed","khaemenes-student-profile-changed"])window.addEventListener(type,()=>{place();render()});
window.addEventListener("storage",e=>{if(!e.key||e.key.includes("learner")||e.key.startsWith(KEY))render()});
window.KhaemenesFreshmanDiscoveryStudio=Object.freeze({version:"1.0.0",refresh:render});
})();
/* Grade 10–12 profile enhancements; presentation/preferences only. */
(()=>{"use strict";
const grade=String(document.body.dataset.grade||"");if(!["10","11","12"].includes(grade))return;
const root=document.getElementById("upperClasses");if(!root)return;
const profile=window.KhaemenesStudentProfileV2;
const learner=()=>profile?.activeLearner?.()||null;
const make=(tag,txt)=>{const el=document.createElement(tag);if(txt!=null)el.textContent=txt;return el};
const panel=make("section");panel.className="ug-card";panel.id="my-profile-extras";panel.style.cssText="margin-top:20px;padding:18px;border:1px solid #b6a787;border-radius:7px";
const head=make("h2","My learning studio");panel.append(head);
const note=make("p","Your next lessons remain governed by the Academy course engines. These are personal notes and shortcuts, not grades or official evidence.");
panel.append(note);
const links=make("nav");links.setAttribute("aria-label","Profile tools");links.style.cssText="display:flex;flex-wrap:wrap;gap:12px;margin:10px 0";
for(const [label,target] of [["My seven classes","#seven-classes"],["Learning today","#learning-today"],["Quick Pins","#quick-pins"],["Customize","#"+(grade==="10"?"grade10Personalize":"upperGradePersonalize")]]){const a=make("a",label);a.href=target;links.append(a)}
panel.append(links);
const state=make("p");state.setAttribute("role","status");
const editor=make("div");editor.style.cssText="display:grid;gap:10px;max-width:650px";
const goal=make("textarea");goal.placeholder="My study plan for the week";goal.rows=3;goal.maxLength=600;goal.setAttribute("aria-label","My weekly study plan");
const save=make("button","Save my study plan");save.type="button";save.style.cssText="padding:9px;border-radius:7px;max-width:230px";
const exportBtn=make("button","Export my study plan");exportBtn.type="button";exportBtn.style.cssText="padding:9px;border-radius:7px;max-width:230px";
const keyFor=()=>{const id=learner()?.learnerId;return id?"khaemenes.grade"+grade+".studio:"+id:null};
const originalKey=keyFor();
function load(){if(!originalKey){goal.disabled=save.disabled=exportBtn.disabled=true;state.textContent="Select a learner to save your personal plan.";return}try{goal.value=localStorage.getItem(originalKey)||""}catch{state.textContent="Local storage is unavailable."}}
function scoped(){if(!originalKey||keyFor()!==originalKey){state.textContent="Learner changed. Reload the page before editing this plan.";return false}return true}
save.onclick=()=>{if(!scoped())return;try{localStorage.setItem(originalKey,goal.value.slice(0,600));state.textContent="Study plan saved on this device."}catch{state.textContent="Could not save your plan."}};
exportBtn.onclick=()=>{if(!scoped())return;const data={format:"khaemenes-personal-study-plan-v1",grade,learnerId:learner()?.learnerId,plan:goal.value.slice(0,600),exported:new Date().toISOString()};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=make("a");a.href=url;a.download="my-grade-"+grade+"-study-plan.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
editor.append(goal,save,exportBtn,state);panel.append(editor);
const access=make("fieldset");access.style.cssText="border:1px solid #aeb6b3;border-radius:7px;margin:12px 0;padding:12px";const legend=make("legend","Reading accessibility");access.append(legend);
const big=make("input");big.type="checkbox";const bigLabel=make("label"," Larger text");bigLabel.prepend(big);bigLabel.style.marginRight="20px";
const calm=make("input");calm.type="checkbox";const calmLabel=make("label"," Reduce motion");calmLabel.prepend(calm);
access.append(bigLabel,calmLabel);panel.insertBefore(access,editor);
const accessKey=originalKey?originalKey+":access":null;const initial=(()=>{try{return accessKey?JSON.parse(localStorage.getItem(accessKey)||"{}"):{} }catch{return {}}})();
big.checked=!!initial.largeText;calm.checked=!!initial.reducedMotion;
function applyAccess(){document.documentElement.style.setProperty("--ug-personal-text-scale",big.checked?"1.12":"1");panel.style.fontSize=big.checked?"1.12em":"";if(calm.checked)document.documentElement.dataset.khaeReduceMotion="true";else delete document.documentElement.dataset.khaeReduceMotion}
const motionStyle=make("style");motionStyle.textContent='html[data-khae-reduce-motion="true"] *,html[data-khae-reduce-motion="true"] *::before,html[data-khae-reduce-motion="true"] *::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important;scroll-behavior:auto!important}';document.head.append(motionStyle);
[big,calm].forEach(field=>field.addEventListener("change",()=>{if(!scoped()){big.checked=!!initial.largeText;calm.checked=!!initial.reducedMotion;return}try{localStorage.setItem(accessKey,JSON.stringify({largeText:big.checked,reducedMotion:calm.checked}));state.textContent="Reading preferences saved."}catch{state.textContent="Reading preferences could not be saved."}applyAccess()}));
if(!originalKey){big.disabled=calm.disabled=true}applyAccess();
root.insertAdjacentElement("afterend",panel);load();
})();
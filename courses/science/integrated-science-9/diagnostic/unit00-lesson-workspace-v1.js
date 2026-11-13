/* Science 9 Unit 00 — editable evidence workspaces v1.
 * Enhances printable response lines for five lessons without changing completion,
 * grades, assessments, or the official High School formative-evidence ledger.
 * Saved locally per verified Academy learner + exact lesson path.
 */
(()=>{"use strict";
 if(!/\/courses\/science\/integrated-science-9\/diagnostic\/lessons\/day-0[1-5]\.html$/i.test(location.pathname))return;
 const PREFIX="khaemenes-science9-unit00-written-work-v1";
 const context=()=>window.KhaemenesHighLearningContext?.learner?.();
 const safeId=()=>{const l=context();return l&&typeof l.learnerId==="string"&&l.learnerId.length?l.learnerId:null;};
 const path=location.pathname.replace(/\/+/g,"/").toLowerCase();
 const key=(learner,id)=>PREFIX+"|"+encodeURIComponent(learner)+"|"+path+"|"+id;
 function mount(){
  const lines=[...document.querySelectorAll(".lesson-page .checkpoint .response-lines")];
  if(!lines.length)return;
  for(let i=0;i<lines.length;i++){
   const line=lines[i],id="response-"+String(i+1).padStart(2,"0");
   if(line.dataset.kaWorkspaceReady)return;
   line.dataset.kaWorkspaceReady="true";
   const wrapper=document.createElement("div");wrapper.className="ka-science-workspace";
   const label=document.createElement("label");label.htmlFor="ka-work-"+id;label.textContent="Write your response";
   const area=document.createElement("textarea");area.id="ka-work-"+id;area.rows=6;
   area.setAttribute("aria-describedby","ka-status-"+id);area.placeholder="Explain your reasoning and observations here. Your saved work belongs to your Academy learner profile on this device.";
   const status=document.createElement("p");status.id="ka-status-"+id;status.className="ka-science-workspace-status";status.setAttribute("role","status");
   const controls=document.createElement("div");controls.className="ka-science-workspace-actions";
   const save=document.createElement("button");save.type="button";save.textContent="Save response";
   const isForLearner=Boolean(safeId());let storedLearner=safeId(),dirty=false;
   function restore(){
    const learner=safeId();storedLearner=learner;dirty=false;area.value="";
    if(!learner){status.textContent="Select an Academy learner to enable saved work. Responses are temporary until then.";return;}
    try{const raw=localStorage.getItem(key(learner,id));const record=raw?JSON.parse(raw):null;area.value=record&&typeof record.text==="string"?record.text:"";status.textContent=raw?"Previously saved work restored.":"Ready to save to this learner on this device.";}
    catch{status.textContent="Saved work is unavailable in this browser. You can still write or print.";}
   }
   function persist(){
    const learner=safeId();
    if(!learner){status.textContent="Not saved: select an Academy learner before saving.";return;}
    if(learner!==storedLearner){restore();status.textContent="Learner changed. Previous learner's work was not copied.";return;}
    try{localStorage.setItem(key(learner,id),JSON.stringify({version:1,text:area.value,savedAt:new Date().toISOString()}));dirty=false;status.textContent="Saved on this device for the selected Academy learner.";}
    catch{status.textContent="Could not save in this browser. Copy or print your work before leaving.";}
   }
   area.addEventListener("input",()=>{dirty=true;status.textContent="Unsaved changes — choose Save response.";});
   save.addEventListener("click",persist);
   window.addEventListener("focus",()=>{if(safeId()!==storedLearner)restore();});
   window.addEventListener("storage",event=>{if(event.key===window.KhaemenesHighLearningContext?.contextKey&&safeId()!==storedLearner)restore();});
   controls.append(save);wrapper.append(label,area,controls,status);line.parentNode.insertBefore(wrapper,line);line.classList.add("ka-response-print-lines");
   restore();
  }
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
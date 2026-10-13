(() => {
"use strict";
const id=document.body.dataset.lessonId;
if(!id)return;
const current=document.currentScript;
const run=()=>{
const KEY="khaemenes-algebra2-lesson-progress-v1";
const progress=window.KhaemenesAlgebra2Progression;
const scopedKey=key=>typeof progress.storageKey==="function"?progress.storageKey(key):key;
const read=()=>scopedKey(KEY)===scopedProgressKey?(progress.readJSON(KEY,{})||{}):{};
const record=()=>read()[id]||{};
const noteString=value=>typeof value==="string"?value:"";
const now=()=>new Date().toISOString();
const box=document.getElementById("lessonComplete");
const note=document.getElementById("lessonNote");
const status=document.getElementById("lessonStatus");
const saveButton=document.getElementById("saveLessonNote");
const card=saveButton?.parentNode?.parentNode || (note?.closest ? note.closest(".card"):null);
const draftPrefix=scopedKey("khaemenes-algebra2-note-drafts-v2")+":"+id+":";
const scopedProgressKey=scopedKey(KEY);
const MAX_NOTE=25000;
// A unique ID per page instance avoids collisions when a browser duplicates a tab
// and clones sessionStorage. Drafts survive reload via their shared lesson prefix.
const tabId="t"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);
const draftKey=draftPrefix+tabId;
let seenNote=noteString(record().note),conflict=false,saveTimer=null,learnerScopePaused=false;
let draftPresent=false;
const feedback=document.createElement("p");
feedback.id="algebra2NoteFeedback";
feedback.setAttribute("role","status");feedback.setAttribute("aria-live","polite");
feedback.style.cssText="font-size:14px;line-height:1.45;margin:10px 0;color:inherit;overflow-wrap:anywhere;";
const buttons=document.createElement("div");
buttons.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;";
const makeButton=(text,callback)=>{
 const b=document.createElement("button");
 b.type="button";b.className="btn";b.textContent=text;
 b.style.cssText="min-height:44px;font-size:14px;padding:8px 12px;";
 b.addEventListener("click",callback);buttons.appendChild(b);return b;
};
const fileInput=document.createElement("input");
fileInput.type="file";fileInput.accept=".json,application/json";
fileInput.setAttribute("aria-label","Import an Algebra II lesson note JSON backup");
fileInput.style.cssText="display:none;";
const recovery=makeButton("Restore unsaved draft",()=>restoreDraft());
recovery.hidden=true;
const exportButton=makeButton("Export note JSON",()=>exportNote());
makeButton("Import note JSON",()=>fileInput.click());
const overwrite=makeButton("Review and overwrite newer saved note",()=>overwriteNote());
overwrite.hidden=true;
if(card){card.appendChild(feedback);card.appendChild(buttons);card.appendChild(fileInput);}
function announce(text){feedback.textContent=text;}
function scopeReady(){
 if(!learnerScopePaused&&scopedKey(KEY)===scopedProgressKey)return true;
 if(!learnerScopePaused){
  learnerScopePaused=true;
  // Preserve the original learner's unsaved text under the ORIGINAL learner key.
  if(note&&note.value!==seenNote){
   try{localStorage.setItem(draftKey,JSON.stringify({schema:2,lesson:id,note:note.value,
      changedAt:Date.now(),reason:"learner-changed"}));}catch{}
  }
  for(const control of [note,box,saveButton,overwrite]){
   if(control){control.disabled=true;control.setAttribute("aria-disabled","true");}
  }
  announce("The active learner profile changed. This lesson is paused to protect both learners' records. Export your note if needed, then reopen the lesson under the intended learner.");
 }
 return false;
}
function updateStatus(){
 if(status)status.textContent=box?.checked?"Marked complete on this device.":"Not yet marked complete.";
}
function readDrafts(){
 const drafts=[];
 try{
  for(let i=0;i<localStorage.length;i++){
   const key=localStorage.key(i);
   if(!key?.startsWith(draftPrefix))continue;
   try{
    const entry=JSON.parse(localStorage.getItem(key));
    if(entry?.schema===2&&entry.lesson===id&&typeof entry.note==="string"&&entry.note.length<=MAX_NOTE&&
      Number.isFinite(entry.changedAt))drafts.push({...entry,key});
   }catch{}
  }
 }catch{}
 return drafts.sort((a,b)=>b.changedAt-a.changedAt);
}
function freshestDraft(){return readDrafts().find(entry=>entry.note!==noteString(record().note))||null;}
function refreshRecovery(){
 const found=freshestDraft();draftPresent=!!found;
 recovery.hidden=!draftPresent;
 overwrite.hidden=!conflict;
}
function writeDraft(value,reason="typing"){
 if(!scopeReady())return false;
 if(value.length>MAX_NOTE){announce("Note exceeds 25,000 characters. Shorten it or export your work before saving.");return false;}
 try{
  localStorage.setItem(draftKey,JSON.stringify({schema:2,lesson:id,note:value,changedAt:Date.now(),reason}));
  refreshRecovery();return true;
 }catch{
  announce("Draft storage is unavailable. Keep this page open and use Export note JSON to keep a separate copy.");
  return false;
 }
}
function flushDraft(){
 if(saveTimer!==null){clearTimeout(saveTimer);saveTimer=null;}
 if(note&&note.value!==seenNote)writeDraft(note.value);
}
function safeWrite(next){
 try{return progress.writeJSON(KEY,next)===true;}catch{return false;}
}
function saveNote(force=false){
 if(!note||!scopeReady())return false;
 flushDraft();
 const value=note.value;
 if(value.length>MAX_NOTE){announce("Note too long. Keep it under 25,000 characters before saving.");return false;}
 const latest=read(),current=latest[id]||{},stored=noteString(current.note);
 if(!force&&stored!==seenNote&&stored!==value){
  conflict=true;writeDraft(value,"conflict");
  refreshRecovery();
  announce("Another tab saved a different version of this lesson note. Your draft is preserved. Export it, load the newer saved note, or explicitly review and overwrite.");
  return false;
 }
 const next={...latest,[id]:{...current,note:value,updated:now(),noteUpdated:now()}};
 if(!safeWrite(next)||noteString(record().note)!==value){
  writeDraft(value,"save-failed");
  announce("Saving failed or could not be verified. Your draft remains available; export a JSON backup.");
  return false;
 }
 seenNote=value;conflict=false;
 try{localStorage.removeItem(draftKey);}catch{}
 refreshRecovery();
 announce("Lesson note saved locally. Other lesson records and completion states were preserved.");
 return true;
}
function overwriteNote(){
 if(!conflict||!note||!scopeReady())return;
 const latest=noteString(record().note);
 if(!window.confirm("A newer note exists in another tab. Replace that saved note with your current draft? You can export your draft first."))return;
 if(!scopeReady()||noteString(record().note)!==latest){
  writeDraft(note.value,"conflict");
  announce("The saved note changed again. Review its latest version before deciding whether to replace it.");
  return;
 }
 // Archive the newer stored version separately so the intentional replacement can be reversed.
 const archiveKey=draftPrefix+"saved-copy-"+Date.now()+"-"+Math.random().toString(36).slice(2);
 try{localStorage.setItem(archiveKey,JSON.stringify({schema:2,lesson:id,note:latest,changedAt:Date.now(),reason:"overwritten-saved-copy"}));}
 catch{announce("Could not create a recovery copy. Export both notes before overwriting.");return;}
 seenNote=latest;saveNote(true);
}
function restoreDraft(){
 if(!scopeReady())return;
 const candidate=freshestDraft();
 if(!candidate||!note){announce("No unsaved draft to restore.");refreshRecovery();return;}
 const saved=noteString(record().note);
 if(note.value!==saved&&note.value!==candidate.note&&
  !window.confirm("Replace the text currently in the editor with this recovered draft? Export your current note first if needed."))return;
 note.value=candidate.note;writeDraft(note.value,"restored");
 announce("Unsaved draft restored to the editor. Review it, then choose Save Note.");
}
function exportNote(){
 if(!note)return;
 const payload={schema:"khaemenes-algebra2-lesson-note-v1",course:"algebra2",lesson:id,
  note:note.value,exportedAt:now()};
 const link=document.createElement("a"),blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const href=URL.createObjectURL(blob);
 link.href=href;link.download="algebra2-"+id+"-note-"+new Date().toISOString().slice(0,10)+".json";
 link.click();setTimeout(()=>URL.revokeObjectURL(href),1000);
 announce("A copy of the current editor text was exported. Store the file somewhere safe.");
}
fileInput.addEventListener("change",async()=>{
 const file=fileInput.files?.[0];if(!file)return;
 if(!scopeReady()){fileInput.value="";return;}
 try{
  if(file.size>150000)throw Error("The backup file is too large.");
  const data=JSON.parse(await file.text());
  if(data?.schema!=="khaemenes-algebra2-lesson-note-v1"||data.course!=="algebra2"||
    data.lesson!==id||typeof data.note!=="string"||data.note.length>MAX_NOTE)
   throw Error("The selected JSON file is not a valid backup for this exact lesson.");
  if(!window.confirm("Import this note as an unsaved draft for "+id+"? Official grades and completion records will not change."))return;
  if(note){note.value=data.note;writeDraft(data.note,"imported");}
  announce("Backup imported as an unsaved draft. Review the note and select Save Note to commit it.");
 }catch(e){announce("Import unsuccessful: "+(e?.message||"invalid backup")+". Your current note was preserved.");}
 finally{fileInput.value="";}
});
if(box)box.checked=!!record().complete;
if(note)note.value=seenNote;
updateStatus();
const recovered=freshestDraft();
if(recovered&&note&&recovered.changedAt>(Date.parse(record().noteUpdated||record().updated)||0)){
 note.value=recovered.note;
 announce("An unsaved lesson draft was recovered in the editor. Review it and select Save Note to keep it.");
}else announce("Your saved lesson note is loaded. Unsaved edits are kept in a separate local draft.");
refreshRecovery();
note?.addEventListener("input",()=>{
 if(!scopeReady())return;
 if(saveTimer!==null)clearTimeout(saveTimer);
 saveTimer=setTimeout(()=>{saveTimer=null;writeDraft(note.value);},350);
 if(conflict){writeDraft(note.value,"conflict");refreshRecovery();}
});
saveButton?.addEventListener("click",()=>saveNote());
box?.addEventListener("change",()=>{
 if(!scopeReady()){box.checked=!box.checked;return;}
 const latest=read(),current=latest[id]||{};
 const next={...latest,[id]:{...current,complete:box.checked,updated:now()}};
 if(!safeWrite(next)||record().complete!==box.checked){
  box.checked=!!record().complete;
  announce("Completion could not be verified; your previous completion state was preserved.");
 }else{announce("Lesson completion saved; other notes and lesson records were preserved.");}
 updateStatus();
});
document.getElementById("printLesson")?.addEventListener("click",()=>print());
window.addEventListener?.("pagehide",flushDraft);
window.addEventListener?.("visibilitychange",()=>{if(document.visibilityState==="hidden")flushDraft();});
window.addEventListener?.("storage",event=>{
 if(event.key==="khaemenes_active_learner_v1"||event.key==="khaemenes_family_registry_v1"){
  scopeReady();return;
 }
 if(!scopeReady())return;
 if(event.key!==scopedProgressKey&&!event.key?.startsWith(draftPrefix))return;
 if(event.key===scopedProgressKey){
  const latest=record(),incoming=noteString(latest.note);
  if(incoming!==seenNote){
   if(note?.value!==seenNote&&note?.value!==incoming){
    conflict=true;flushDraft();
    announce("This lesson note was updated in another tab. Your draft is protected; review the conflict before saving.");
   }else{
    seenNote=incoming;if(note)note.value=incoming;
    announce("Saved lesson note was updated from another tab.");
   }
   if(box)box.checked=!!latest.complete;
   updateStatus();
  }else if(box){box.checked=!!latest.complete;updateStatus();}
 }
 refreshRecovery();
});
window.KhaemenesAlgebra2NoteRecovery=Object.freeze({lesson:id,exportNote,restoreDraft,
 get status(){return {conflict,draftPresent,seenNote,editorNote:note?.value||""};}});
};
function showReadOnlyRecovery(){
  // Do not erase the lesson when the progression authority cannot be verified.
  // Keep reading and printing possible, but never record unverified completion.
  const main=document.querySelector("main");
  const completion=document.getElementById("lessonComplete");
  const note=document.getElementById("lessonNote");
  const saveButton=document.getElementById("saveLessonNote");
  for(const control of [completion,note,saveButton]){
    if(control){control.disabled=true;control.setAttribute("aria-disabled","true");}
  }
  const state=document.getElementById("lessonStatus");
  if(state)state.textContent="Progress verification unavailable; this lesson is read-only.";
  if(!main||document.getElementById("algebra2ProgressionRecovery"))return;
  document.getElementById("printLesson")?.addEventListener("click",()=>print());
  const banner=document.createElement("section");
  banner.id="algebra2ProgressionRecovery";
  banner.setAttribute("role","alert");
  banner.setAttribute("aria-live","assertive");
  banner.style.cssText="margin:16px 0;padding:16px;border:1px solid #a57943;border-radius:7px;background:#fff4dd;color:#29231b;text-align:left;";
  const heading=document.createElement("h2");
  heading.textContent="Progress verification temporarily unavailable";
  heading.style.cssText="font-size:24px;line-height:1.35;margin:0 0 8px;font-weight:400;color:#29231b;";
  const message=document.createElement("p");
  message.textContent="The lesson remains available to read or print. Completing lessons, saving course notes, and progression-related actions are paused until the local verification script loads. No lesson completion or assessment credit is granted in this mode.";
  const retry=document.createElement("button");
  retry.type="button";
  retry.textContent="Retry course verification";
  retry.style.cssText="min-height:44px;padding:9px 14px;border:1px solid #a57943;border-radius:7px;background:#44372b;color:white;cursor:pointer;";
  retry.addEventListener("click",()=>location.reload());
  banner.append(heading,message,retry);
  main.insertBefore(banner,main.firstChild);
}
if(window.KhaemenesAlgebra2Progression?.readJSON&&window.KhaemenesAlgebra2Progression?.writeJSON)run();
else if(current){
 const script=document.createElement("script");
 script.src=new URL("./algebra2-progression.js",current.src).href;
 script.onload=()=>{
   if(window.KhaemenesAlgebra2Progression?.readJSON&&window.KhaemenesAlgebra2Progression?.writeJSON)run();
   else showReadOnlyRecovery();
 };
 script.onerror=showReadOnlyRecovery;
 try{document.head.appendChild(script);}catch{showReadOnlyRecovery();}
}else showReadOnlyRecovery();
})();

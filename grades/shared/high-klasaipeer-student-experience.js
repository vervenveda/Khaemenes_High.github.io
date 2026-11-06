/* Khaemenes Academy · KlasaiPeer student experience enhancements 2026-11-06.
 * Grade 09–12: progressive enhancement of the original study studio.
 * No AI claims, telemetry, cloud accounts, academic writes or grade mutations.
 * Existing local note keys and course registries remain the source of truth.
 */
(()=>{"use strict";
const pageGrade=Number(document.body?.dataset.grade||(/\/grade-(09|10|11|12)\/student-profile\//.exec(location.pathname)||[])[1]);
if(![9,10,11,12].includes(pageGrade)||window.KhaemenesHighKlasaiPeerExperience)return;
const d=document.getElementById("grade09StudyStudioDialog");
if(!d||d.dataset.studentExperienceReady==="1")return;
d.dataset.studentExperienceReady="1";
const $=id=>d.querySelector("#"+id);
const notes=$("g09sNotes"),save=$("g09sSave"),course=$("g09sCourse"),status=$("g09sStatus");
const close=$("g09sClose"),cards=$("g09sCard"),flip=$("g09sFlip"),next=$("g09sNext");
const canvas=$("g09sCanvas"),clear=$("g09sClear");
if(!notes||!save||!course||!status||!close||!canvas||!cards||!flip||!next||!clear)return;
const make=(tag,cls,label)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(label!==undefined)el.textContent=label;return el;};
const style=make("style");style.textContent=`
#grade09StudyStudioDialog .kpeer-enhancement-toolbar{
 display:flex;flex-wrap:wrap;align-items:center;gap:11px;margin:12px 0 16px;
 padding:12px;border:1px solid #c5b492;border-radius:7px;background:#f6efdf;color:#243038;
}
#grade09StudyStudioDialog .kpeer-enhancement-toolbar label{
 display:inline-flex;align-items:center;gap:7px;font-size:16px;color:#243038;
}
#grade09StudyStudioDialog .kpeer-enhancement-toolbar select{
 width:auto;min-width:90px;min-height:44px;margin:0;
}
#grade09StudyStudioDialog .kpeer-study-meta{
 margin:8px 0;color:#45554c;font:400 16px/1.5 Nunito,Arial,sans-serif;
}
#grade09StudyStudioDialog .kpeer-enhancement-toolbar button{
 min-height:44px;
}
#grade09StudyStudioDialog .g09s-card[role=button]{cursor:pointer}
#grade09StudyStudioDialog .g09s-card:focus-visible,
#grade09StudyStudioDialog .kpeer-enhancement-toolbar :is(select,button):focus-visible{
 outline:3px solid #b48b45;outline-offset:3px;
}
`;
d.append(style);

// 1. Read-only preview is always available; saving remains governed by
// the two original registered-learner guards in the Grade 09/upper scripts.
const scopeHint=make("p","kpeer-study-meta");
scopeHint.textContent="Study tools are local previews. Notes save only for the registered learner in this grade; progress and official assessments are never changed.";
d.querySelector(".g09s-preview-intro")?.insertAdjacentElement("afterend",scopeHint);

// 2. Unsaved-note feedback, word count and explicit leave protection.
let dirty=false,oldCourse="";
const noteMeta=make("p","kpeer-study-meta");
noteMeta.setAttribute("role","status");noteMeta.setAttribute("aria-live","polite");
notes.insertAdjacentElement("afterend",noteMeta);
function wordCount(){return notes.value.trim()?notes.value.trim().split(/\s+/u).length:0}
function updateMeta(){
 noteMeta.textContent=wordCount()+" words · "+(dirty?"Unsaved changes — select Save Notes":"No unsaved changes");
}
updateMeta();
notes.addEventListener("input",()=>{dirty=true;updateMeta()});
save.addEventListener("click",()=>{
 // The existing save handler executes first; never claim saving when it failed.
 if(status.textContent==="Notes saved locally."){dirty=false;updateMeta();}
});
course.addEventListener("change",event=>{
 if(dirty&&!window.confirm("You have unsaved notes. Switch classes and discard those edits?")){
  event.stopImmediatePropagation();
  course.value=oldCourse;
  return;
 }
 dirty=false;oldCourse=course.value;updateMeta();
},true);
close.addEventListener("click",event=>{
 if(dirty&&!window.confirm("Close KlasaiPeer and discard unsaved note changes?")){
  event.stopImmediatePropagation();event.preventDefault();return;
 }
 dirty=false;updateMeta();
},true);
d.addEventListener("cancel",event=>{
 if(dirty&&!window.confirm("Close KlasaiPeer and discard unsaved note changes?"))event.preventDefault();
 else{dirty=false;updateMeta()}
});
const openWatch=new MutationObserver(()=>{
 if(!d.open)return;
 dirty=false;oldCourse=course.value;updateMeta();
 openWatch.takeRecords();
});
openWatch.observe(d,{attributes:true,attributeFilter:["open"]});

// 3. Export student-created notes offline; no network requests or grades.
const exportNotes=make("button","","Export Notes (.txt)");exportNotes.type="button";
const notesTools=make("div","kpeer-enhancement-toolbar");
notesTools.append(exportNotes);
save.insertAdjacentElement("afterend",notesTools);
exportNotes.addEventListener("click",()=>{
 if(!notes.value.trim()){status.textContent="Write some notes before exporting.";return;}
 const blob=new Blob([notes.value],{type:"text/plain;charset=utf-8"});
 const url=URL.createObjectURL(blob);
 const link=make("a");link.href=url;
 link.download="klasaipeer-grade-"+String(pageGrade).padStart(2,"0")+"-study-notes.txt";
 d.append(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1500);
 status.textContent="Your notes were exported as a text file. They were not uploaded.";
});

// 4. Whiteboard color, brush size, and an eight-step undo history.
const ctx=canvas.getContext("2d");
if(ctx){
 const bar=make("div","kpeer-enhancement-toolbar");
 const colorLabel=make("label","","Pen color");
 const colors=make("select");
 colors.setAttribute("aria-label","Whiteboard pen color");
 for(const [label,value] of [["Charcoal","#243038"],["Burgundy","#7d283c"],["Navy","#254a75"],["Hunter Green","#2c634a"],["Gold","#9a732c"]]){
  const option=make("option","",label);option.value=value;colors.append(option);
 }
 colorLabel.append(colors);
 const sizeLabel=make("label","","Pen width");
 const widths=make("select");widths.setAttribute("aria-label","Whiteboard pen width");
 for(const n of [2,3,5,8,12]){
  const option=make("option","",n+" px");option.value=String(n);widths.append(option);
 }
 widths.value="3";sizeLabel.append(widths);
 const undo=make("button","","Undo Stroke");undo.type="button";
 const toolStatus=make("span","kpeer-study-meta","Undo history: empty");
 let history=[];
 const remember=()=>{
  try{history.push(ctx.getImageData(0,0,canvas.width,canvas.height));if(history.length>8)history.shift()}
  catch{history=[]}
  toolStatus.textContent="Undo history: "+history.length+" stroke"+(history.length===1?"":"s");
 };
 canvas.addEventListener("pointerdown",remember,true);
 const brush=()=>{ctx.strokeStyle=colors.value;ctx.lineWidth=Number(widths.value)};
 colors.addEventListener("change",brush);widths.addEventListener("change",brush);brush();
 undo.addEventListener("click",()=>{
  const prior=history.pop();
  if(prior)ctx.putImageData(prior,0,0);
  toolStatus.textContent="Undo history: "+history.length+" stroke"+(history.length===1?"":"s");
 });
 // Preserve the original Clear action, but allow one-step undo of a clear.
 clear.addEventListener("click",remember,true);
 bar.append(colorLabel,sizeLabel,undo,toolStatus);
 clear.parentElement.insertBefore(bar,canvas);
}

// 5. Accessible keyboard practice and consistent popup re-entry.
cards.setAttribute("role","button");
cards.setAttribute("tabindex","0");
cards.setAttribute("aria-label","Flip the current flashcard");
cards.addEventListener("click",()=>flip.click());
cards.addEventListener("keydown",event=>{
 if(event.key==="Enter"||event.key===" "){event.preventDefault();flip.click()}
});
const hint=make("p","kpeer-study-meta","Keyboard: Enter or Space flips a focused flashcard; Right Arrow advances. Alt+1–4 switches study tabs.");
cards.insertAdjacentElement("afterend",hint);
d.addEventListener("keydown",event=>{
 if(!d.open||event.target===notes||event.target===course||event.target?.tagName==="SELECT")return;
 const tabIndex=event.altKey&&/^[1-4]$/.test(event.key)?Number(event.key)-1:-1;
 if(tabIndex>=0){
  const tab=d.querySelectorAll("[data-room]")[tabIndex];
  if(tab){event.preventDefault();tab.click();tab.focus()}
 }else if(event.key==="ArrowRight"&&event.target===cards){
  event.preventDefault();next.click();
 }
});
window.KhaemenesHighKlasaiPeerExperience=Object.freeze({version:"1.0.0",grade:pageGrade});
})();

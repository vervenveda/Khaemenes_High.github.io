/* Grades 10–12: Grade 09 KlasaiPeer Preview Studio parity.
 * Grade-specific course catalogue and local notes: no cross-grade keys.
 * Existing practice features are local previews, not authenticated AI.
 * Grade 09 source and notes remain authoritative and unchanged.
 */
(()=>{"use strict";
const grade=Number(document.body?.dataset.grade);
const grade10Copy=grade===10;
const grade11Copy=grade===11;
const grade12Copy=grade===12;
if(![10,11,12].includes(grade)||window.KhaemenesUpperGradeStudyStudio)return;
const d=document.createElement("dialog");d.id="grade09StudyStudioDialog";d.setAttribute("aria-labelledby","g09StudioTitle");
d.innerHTML="<header class=\"g09s-head\"><h2 id=\"g09StudioTitle\">KlasaiPeer · My AI Class Pal</h2><button id=\"g09sClose\" type=\"button\">Close</button></header><div class=\"g09s-body\"><section class=\"g09s-construction\" aria-label=\"Development status\"><strong>Under Construction · Development Preview</strong><p>We are building KlasaiPeer as an AI class companion for Khaemenes Academy. This is a visual roadmap; authenticated AI tutoring, adoption and persistent memory are not connected here.</p><a class=\"g09s-landing\" href=\"https://vervenveda.com/Klasaipeer.github.io/\" target=\"_blank\" rel=\"noopener\">Explore the KlasaiPeer Landing Page</a></section><p class=\"g09s-preview-intro\">Choose a class and explore the vision. Local practice tools are separate from course grades and mastery.</p><label>Choose class <select id=\"g09sCourse\"></select></label><nav class=\"g09s-tabs\" aria-label=\"KlasaiPeer feature areas\"><button data-room=\"pal\" aria-pressed=\"true\">Class Pal Vision</button><button data-room=\"notes\" aria-pressed=\"false\">Study Notes</button><button data-room=\"cards\" aria-pressed=\"false\">Flashcards</button><button data-room=\"lab\" aria-pressed=\"false\">Whiteboard</button></nav><section data-panel=\"pal\"><h3>Your Future Class Companion</h3><p>KlasaiPeer is envisioned as a familiar, customizable schoolmate supporting curiosity and practice throughout the Academy.</p><div class=\"g09s-feature-grid\"><article><span class=\"g09s-feature-number\">01 · Planned</span><h4>Personalized AI Tutor</h4><p>Curriculum-aware explanations, reasoning and guidance matched to each course.</p></article><article><span class=\"g09s-feature-number\">02 · Planned</span><h4>Ask KlasaiPeer</h4><p>Syllabus-based conversations and step-by-step guidance for challenging concepts.</p></article><article><span class=\"g09s-feature-number\">03 · Local preview</span><h4>Study Notes & Summaries</h4><p>Local notes and simple outlining are available; AI reading summaries are planned.</p></article><article><span class=\"g09s-feature-number\">04 · Local preview</span><h4>Flashcards & Quizzes</h4><p>Practice cards from personal notes are available; AI quizzes are planned.</p></article><article><span class=\"g09s-feature-number\">05 · Planned</span><h4>Exam Feedback</h4><p>Future practice marking and misconception checks, without changing official grades.</p></article><article><span class=\"g09s-feature-number\">06 · Mixed roadmap</span><h4>Learning Lab</h4><p>Local whiteboard available; 3D worlds, coding IDEs and logic-gate labs are planned.</p></article></div><div class=\"g09s-next\"><h4>Growing with the learner</h4><p>Planned features include profile-based adoption, customizable avatars, voice, language and age-appropriate learning support. Production adoption and private companion memory are not active here.</p><div class=\"g09s-links\"><a href=\"https://vervenveda.com/Klasaipeer.github.io/\" target=\"_blank\" rel=\"noopener\">Visit KlasaiPeer Preview</a><a id=\"g09sMentor\" href=\"../../../mentor/\">Open Academy Mentor</a><a id=\"g09sOpenCourse\" href=\"profile/\">Open Selected Class</a></div></div></section><section data-panel=\"notes\" hidden><h3>My Study Notes</h3><p>Write notes here, or one Term: Explanation per line to create flashcards.</p><textarea id=\"g09sNotes\" rows=\"9\"></textarea><button id=\"g09sSave\">Save Notes</button><button id=\"g09sOutline\">Outline My Notes</button><p id=\"g09sStatus\" role=\"status\"></p><ol id=\"g09sOutlineList\"></ol></section><section data-panel=\"cards\" hidden><h3>Practice Flashcards</h3><button id=\"g09sBuild\">Build From Notes</button><div id=\"g09sCard\" class=\"g09s-card\">Add Term: Explanation lines in Notes.</div><button id=\"g09sFlip\">Reveal</button><button id=\"g09sNext\">Next</button><p id=\"g09sCounter\" role=\"status\"></p></section><section data-panel=\"lab\" hidden><h3>Learning Whiteboard</h3><p>Draw with a mouse, stylus or finger. 3D, IDE and logic gate labs are planned integrations.</p><button id=\"g09sClear\">Clear</button><canvas id=\"g09sCanvas\" width=\"1000\" height=\"340\"></canvas></section></div>";
document.body.append(d);

/* Mentor directory is part of the KlasaiPeer popup, never the main profile.
   Only verified dedicated destinations receive individual landing links. */
const mentors=[
 {name:"NOEMA",role:"Academy Chancellor",mark:"N"},
 {name:"NAIB",role:"Academy administration & navigation",mark:"N"},
 {name:"Archaemenes",role:"Principal & educational mentor",mark:"A",href:"https://vervenveda.com/Khaemenes_Academy.github.io/mentor/"},
 {name:"Aranea & Her Spyders",role:"Sovereign security companions",mark:"A"},
 {name:"Hope",role:"Humanitarian guidance",mark:"H"},
 {name:"Eiren",role:"Language arts & writing",mark:"E"},
 {name:"Aurora",role:"Wellbeing & reflection",mark:"A"},
 {name:"Zelle",role:"Visual arts & creativity",mark:"Z"},
 {name:"Morai",role:"Music & creative expression",mark:"M"},
 {name:"Pierre",role:"Languages & linguistics",mark:"P"},
 {name:"Auren",role:"AI mentor",mark:"A"},
 {name:"Personal KlasaiPeer",role:"Your future AI class companion",mark:"K",href:"https://vervenveda.com/Klasaipeer.github.io/"}
];
const mentorHub="https://vervenveda.com/Khaemenes_Academy.github.io/mentor/";
const directory=document.createElement("section");
directory.className="g09s-mentor-directory";
directory.setAttribute("aria-labelledby","g09sMentorDirectoryHeading");
const heading=document.createElement("h3");
heading.id="g09sMentorDirectoryHeading";heading.textContent="Meet Your AI Mentors";
const introduction=document.createElement("p");
introduction.textContent=grade10Copy?"Explore the mentors who can help with writing, wellbeing, art, music, languages, study habits, and planning your next step.":grade11Copy?"Use your mentors when you want another perspective, help working through a challenge, or guidance planning your next step. Explore support for writing, research, languages, wellbeing, creativity, study habits, and future planning.":grade12Copy?"Use your mentors when you want perspective, help finishing a challenge, or support thinking through what comes next. Explore writing, research, wellbeing, creativity, study habits, transition planning, and the goals you want to carry beyond High School.":"Meet the mentors and companions across our ecosystem. Individual landing pages are linked where verified; other cards lead to the Academy Mentor Hub while their destinations are being confirmed.";
const mentorGrid=document.createElement("div");mentorGrid.className="g09s-mentor-grid";
for(const person of mentors){
 const card=document.createElement("article");card.className="g09s-mentor-card";
 const seal=document.createElement("span");seal.className="g09s-mentor-seal";seal.textContent=person.mark;seal.setAttribute("aria-hidden","true");
 const title=document.createElement("h4");title.textContent=person.name;
 const description=document.createElement("p");description.textContent=person.role;
 const action=document.createElement("a");
 action.href=person.href||mentorHub;
 action.target="_blank";action.rel="noopener";
 action.textContent=person.href?((grade10Copy||grade11Copy||grade12Copy)?"Meet This Mentor":"Visit Landing Page"):((grade10Copy||grade11Copy||grade12Copy)?"Open Mentor Hub":"Academy Mentor Hub");
 if(!person.href)action.setAttribute("aria-label","Open Academy Mentor Hub; individual landing page for "+person.name+" pending verification");
 card.append(seal,title,description,action);mentorGrid.append(card);
}
directory.append(heading,introduction,mentorGrid);
d.querySelector(".g09s-body").append(directory);

const $=x=>d.querySelector("#"+x),contract=window.KhaemenesCourseEntryContract;
const highRoot="https://vervenveda.com/Khaemenes_High.github.io/";
const courseSlots=()=>window.KhaemenesHighEightClass?.slots?.(grade)||[];
const reg={
 get courses(){return courseSlots().map(item=>({id:item.id,title:item.title,home:item.href||highRoot+"grades/grade-"+grade+"/"}))},
 getCourse(id){return this.courses.find(c=>c.id===id)||null},
 resumePriorityCourse(){return this.courses[0]||null},
 mentorFor(){return "https://vervenveda.com/Khaemenes_Academy.github.io/mentor/"}
};
const sel=$("g09sCourse"),notes=$("g09sNotes");let learner="",cards=[],idx=0,flipped=false,origin=null;
let loadedCourse="",savedNotes="";
function verifiedLearner(){
 const p=contract?.readAcademyProfile?.();
 const active=window.KhaemenesStudentProfileV2?.activeLearner?.();
 const ctx=window.KhaemenesHighProfileGradeContext?.active?.();
 return p?.learnerId&&active?.learnerId&&ctx?.gradeNumber===grade&&
   active.stage==="high"&&Number(active.grade)===grade&&
   String(p.learnerId)===String(active.learnerId)&&
   String(ctx.learnerId)===String(active.learnerId)?String(active.learnerId):"";
}
function hasUnsavedNotes(){return notes.value!==savedNotes}
function draftKey(){return key()+":recovery-draft-v1"}
function discardDraft(){if(learner&&sel.value&&verifiedLearner()===learner)try{localStorage.removeItem(draftKey())}catch{}}
function confirmDiscard(){
 if(!hasUnsavedNotes())return true;
 if(!window.confirm("You have unsaved study notes. Leave without saving them?"))return false;
 discardDraft();return true;
}
function recoverDraft(){
 if(!learner||verifiedLearner()!==learner||!sel.value||!reg?.getCourse?.(sel.value))return false;
 try{
  const raw=localStorage.getItem(draftKey());if(!raw)return false;
  const draft=JSON.parse(raw);
  if(!draft||draft.version!==1||typeof draft.text!=="string")return false;
  if(draft.text===savedNotes){discardDraft();return false}
  if(window.confirm("A study-note draft was found on this device for this class. Restore it? Your saved notes will not be overwritten unless you press Save Notes.")){
   notes.value=draft.text;
   return true;
  }
 }catch{}
 return false;
}
notes.addEventListener("input",()=>{
 if(!learner||verifiedLearner()!==learner||!sel.value||!reg?.getCourse?.(sel.value))return;
 try{
  if(!hasUnsavedNotes()){discardDraft();return}
  localStorage.setItem(draftKey(),JSON.stringify({version:1,text:notes.value,updatedAt:new Date().toISOString()}));
 }catch{$("g09sStatus").textContent="Draft recovery is unavailable on this device. Save notes or keep a separate copy."}
});
window.addEventListener("beforeunload",event=>{if(!d.open||!hasUnsavedNotes())return;event.preventDefault();event.returnValue=""});
function key(){return "khae-grade"+grade+"-study-studio-notes-v1:"+encodeURIComponent(learner)+":"+encodeURIComponent(sel.value)}
function refreshCourse(){const c=reg?.getCourse?.(sel.value),openCourse=$("g09sOpenCourse");if(grade10Copy){if(c?.home){openCourse.href=c.home;openCourse.textContent="Open Selected Class";openCourse.setAttribute("aria-disabled","false");openCourse.removeAttribute("tabindex")}else{openCourse.href="#";openCourse.textContent="Choose a Class First";openCourse.setAttribute("aria-disabled","true");openCourse.setAttribute("tabindex","-1")}}else openCourse.href=c?.home||"profile/";$("g09sMentor").href=reg?.mentorFor?.(sel.value)||"../../../mentor/";notes.value="";if(learner&&verifiedLearner()===learner&&sel.value)try{notes.value=localStorage.getItem(key())||""}catch{}loadedCourse=sel.value;savedNotes=notes.value;return recoverDraft()}
function open(source){
 if(d.open&&!confirmDiscard())return;
 origin=source||document.activeElement;
 learner=verifiedLearner();sel.replaceChildren();const option=document.createElement("option");option.textContent="Choose a class";option.value="";sel.append(option);for(const c of reg?.courses||[]){if(!c?.id)continue;const o=document.createElement("option");o.value=c.id;o.textContent=c.title;sel.append(o)}sel.value=reg?.resumePriorityCourse?.()?.id||"";const recovered=refreshCourse();$("g09sStatus").textContent=learner?(grade10Copy?"Your study notes are ready to use here.":grade11Copy?"Your study notes are ready when you need them.":grade12Copy?"Your study notes are here when you need one more place to think things through.":"Notes are saved only on this browser."):(grade10Copy?"Choose your student profile to save study notes.":grade11Copy?"Choose your student profile to save study notes.":grade12Copy?"Choose your student profile to save study notes.":"Select an Academy learner to save notes.");if(recovered)$("g09sStatus").textContent="Unsaved draft restored on this device. Choose Save Notes to keep it.";if(!d.open)d.showModal()}
sel.addEventListener("change",()=>{if(!confirmDiscard()){sel.value=loadedCourse;return}const recovered=refreshCourse();$("g09sStatus").textContent=recovered?"Unsaved draft restored. Choose Save Notes to keep it.":"Notes for this class are stored on this device only."});
$("g09sOpenCourse").addEventListener("click",event=>{if(!reg?.getCourse?.(sel.value)||$("g09sOpenCourse").getAttribute("aria-disabled")==="true"){event.preventDefault();$("g09sStatus").textContent="Choose a class first, then open it from here.";return}if(!confirmDiscard())event.preventDefault()});
for(const b of d.querySelectorAll("[data-room]"))b.addEventListener("click",()=>{for(const p of d.querySelectorAll("[data-panel]"))p.hidden=p.dataset.panel!==b.dataset.room;for(const t of d.querySelectorAll("[data-room]"))t.setAttribute("aria-pressed",String(t===b))});
$("g09sSave").addEventListener("click",()=>{
 if(!learner||verifiedLearner()!==learner||!sel.value||!reg?.getCourse?.(sel.value)){
  $("g09sStatus").textContent="Save blocked: select your registered learner and a valid class. No notes were changed.";return;
 }
 try{
  const noteKey=key(),value=notes.value;
  localStorage.setItem(noteKey,value);
  if(localStorage.getItem(noteKey)!==value)throw new Error("Local note verification failed");
  savedNotes=value;discardDraft();
  $("g09sStatus").textContent="Notes saved and checked on this device only. Cross-device backup is not yet active.";
 }catch{$("g09sStatus").textContent="Notes were not verified as saved on this device. Keep a copy before leaving."}
});
$("g09sOutline").addEventListener("click",()=>{const ol=$("g09sOutlineList");ol.replaceChildren();for(const line of notes.value.split("\n").map(x=>x.trim()).filter(Boolean).slice(0,40)){const li=document.createElement("li");li.textContent=line;ol.append(li)}});
function show(){const c=cards[idx];$("g09sCard").textContent=c?(flipped?c[1]:c[0]):"No practice cards yet.";$("g09sCounter").textContent=cards.length?(idx+1)+" of "+cards.length:"";}
$("g09sBuild").addEventListener("click",()=>{cards=notes.value.split("\n").map(s=>{const i=s.indexOf(":");return i>0?[s.slice(0,i).trim(),s.slice(i+1).trim()]:null}).filter(x=>x&&x[0]&&x[1]).slice(0,60);idx=0;flipped=false;show()});
$("g09sFlip").addEventListener("click",()=>{flipped=true;show()});$("g09sNext").addEventListener("click",()=>{if(cards.length)idx=(idx+1)%cards.length;flipped=false;show()});
const canvas=$("g09sCanvas"),ctx=canvas.getContext("2d");ctx.lineWidth=3;ctx.lineCap="round";let drawing=false;function pos(e){const b=canvas.getBoundingClientRect();return [(e.clientX-b.left)*canvas.width/b.width,(e.clientY-b.top)*canvas.height/b.height]}
canvas.addEventListener("pointerdown",e=>{drawing=true;canvas.setPointerCapture(e.pointerId);ctx.beginPath();ctx.moveTo(...pos(e))});canvas.addEventListener("pointermove",e=>{if(!drawing)return;ctx.lineTo(...pos(e));ctx.stroke()});for(const name of ["pointerup","pointercancel"])canvas.addEventListener(name,()=>drawing=false);$("g09sClear").addEventListener("click",()=>ctx.clearRect(0,0,canvas.width,canvas.height));
$("g09sClose").addEventListener("click",()=>{if(confirmDiscard())d.close()});d.addEventListener("cancel",event=>{if(!confirmDiscard())event.preventDefault()});d.addEventListener("close",()=>origin?.isConnected&&origin.focus());
window.KhaemenesUpperGradeStudyStudio=Object.freeze({open,version:1});
})();
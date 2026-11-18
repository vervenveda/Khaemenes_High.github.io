/* Khaemenes Academy · universal mathematics learning-resource resolver v2.1
   Non-grading UI only. No learner identity, grade, mastery, assessment score,
   or authoritative course-record writes. Assessment scratch notes use
   sessionStorage only and disappear when the browser session ends. */
(()=>{"use strict";
if(window.__KHAE_MATH_TOOLS_V21__||document.getElementById("khae-math-tools"))return;
window.__KHAE_MATH_TOOLS_V21__=true;

const pathname=location.pathname.toLowerCase();
const routeAssessment=/\/(?:assessment|assessments|diagnostic|quiz|quizzes|exam|exams|midterm|final)(?:\/|\.|-|_|$)/.test(pathname);
const routeClosedBook=/(?:^|\/)(?:final(?:-exam)?|cumulative[-_]?final|semester[-_]?exam)(?:\/|\.|-|_|$)/.test(pathname);
const isAssessmentNow=()=>routeAssessment||document.body?.classList?.contains("math-assessment-surface");
const isClosedBookNow=()=>routeClosedBook||document.body?.dataset?.mathAssessmentMode==="final";
const course=pathname.includes("/pre-algebra/")?"pre-algebra":pathname.includes("/algebra-1/")?"algebra-1":pathname.includes("/geometry/")?"geometry":pathname.includes("/algebra-2/")?"algebra-2":"mathematics";
const rootBase="https://vervenveda.com";
const shared={
 Calculator:rootBase+"/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/",
 Games:rootBase+"/arcade.github.io/",
 Search:rootBase+"/PLERASearch.github.io/",
 Parent:rootBase+"/Khaemenes_Academy.github.io/family/"
};
const courseTools={
 "pre-algebra":{Graph:shared.Calculator,Studio:rootBase+"/proresource_hub.github.io/"},
 "algebra-1":{
  Graph:rootBase+"/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/slope-and-rate-studio/",
  Studio:rootBase+"/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/quadratic-graph-lab/"
 },
 "geometry":{Graph:rootBase+"/proresource_hub.github.io/Protools/Ohmic_CAD_Studio.html",Studio:rootBase+"/arcade.github.io/Geometry/"},
 "algebra-2":{
  Graph:rootBase+"/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/quadratic-graph-lab/",
  Studio:rootBase+"/proresource_hub.github.io/"
 },
 mathematics:{Graph:shared.Calculator,Studio:rootBase+"/proresource_hub.github.io/"}
};
const resources={...shared,...courseTools[course]};
const sessionKey="khae-math-scratch:"+pathname;
const openResource=url=>window.open(url,"_blank","noopener,noreferrer");

function toolDialog(){
 let dialog=document.getElementById("khae-math-tool-dialog");
 if(dialog)return dialog;
 dialog=document.createElement("dialog");
 dialog.id="khae-math-tool-dialog";
 dialog.setAttribute("aria-labelledby","khae-math-tool-dialog-title");
 dialog.innerHTML='<div class="khae-math-tool-dialog-shell"><header><h2 id="khae-math-tool-dialog-title">Math Tool</h2><button type="button" data-tool-close aria-label="Close math tool">×</button></header><div id="khae-math-tool-dialog-body"></div></div>';
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 dialog.querySelector("[data-tool-close]").addEventListener("click",()=>dialog.close());
 document.body.append(dialog);
 return dialog;
}
function openTool(title,render){
 const dialog=toolDialog(),body=dialog.querySelector("#khae-math-tool-dialog-body");
 dialog.querySelector("#khae-math-tool-dialog-title").textContent=title;
 body.replaceChildren();render(body);
 if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
}
function notesTool(){
 openTool("Notepad",body=>{
  const p=document.createElement("p");p.textContent="Session-only scratch notes. These notes are not graded and are not part of the official assessment record.";
  const ta=document.createElement("textarea");ta.className="khae-math-notepad";ta.placeholder="Write calculations, reminders, or reasoning here…";
  try{ta.value=sessionStorage.getItem(sessionKey)||""}catch{}
  ta.addEventListener("input",()=>{try{sessionStorage.setItem(sessionKey,ta.value)}catch{}});
  body.append(p,ta);setTimeout(()=>ta.focus(),0);
 });
}
function formulaTool(){
 openTool("Formula Sheet",body=>{
  if(isClosedBookNow()){
   const p=document.createElement("p");p.textContent="The formula sheet is unavailable during this closed-book final assessment.";body.append(p);return;
  }
  const section=document.createElement("div");section.className="khae-formula-sheet";
  section.innerHTML='<p><strong>Linear equations</strong><br>y = mx + b<br>m = (y₂ − y₁) / (x₂ − x₁)</p><p><strong>Point-slope form</strong><br>y − y₁ = m(x − x₁)</p><p><strong>Standard form</strong><br>Ax + By = C</p><p><strong>Exponent reminders</strong><br>aᵐ·aⁿ = aᵐ⁺ⁿ<br>(aᵐ)ⁿ = aᵐⁿ</p><p><strong>Distance</strong><br>d = √((x₂−x₁)² + (y₂−y₁)²)</p>';
  body.append(section);
 });
}
function helpTool(){
 openTool("Assessment Help",body=>{
  const ul=document.createElement("ul");
  ["Read the full problem before choosing an answer.","Use the problem-solving workspace under each item to show calculations and checks.","Save the draft before leaving the page.","If a storage warning appears, keep the page open and export or copy your work before navigating away.","Assessment tools support reasoning; they never change scores or mastery rules."].forEach(t=>{const li=document.createElement("li");li.textContent=t;ul.append(li)});
  body.append(ul);
 });
}
function whiteboardTool(){
 openTool("Whiteboard",body=>{
  const wrap=document.createElement("div");wrap.className="khae-whiteboard-wrap";
  const canvas=document.createElement("canvas");canvas.width=900;canvas.height=520;canvas.setAttribute("aria-label","Scratch whiteboard");
  const actions=document.createElement("div");actions.className="khae-whiteboard-actions";
  const clear=document.createElement("button");clear.type="button";clear.textContent="Clear Whiteboard";
  actions.append(clear);wrap.append(canvas,actions);body.append(wrap);
  const ctx=canvas.getContext("2d");ctx.lineWidth=3;ctx.lineCap="round";ctx.strokeStyle="#252b2b";
  const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height}};
  let drawing=false;
  canvas.addEventListener("pointerdown",e=>{drawing=true;canvas.setPointerCapture?.(e.pointerId);const q=point(e);ctx.beginPath();ctx.moveTo(q.x,q.y)});
  canvas.addEventListener("pointermove",e=>{if(!drawing)return;const q=point(e);ctx.lineTo(q.x,q.y);ctx.stroke()});
  const stop=()=>{drawing=false};canvas.addEventListener("pointerup",stop);canvas.addEventListener("pointercancel",stop);canvas.addEventListener("pointerleave",stop);
  clear.addEventListener("click",()=>ctx.clearRect(0,0,canvas.width,canvas.height));
 });
}

function mount(){
 if(document.getElementById("khae-math-tools"))return;
 const aside=document.createElement("aside");aside.id="khae-math-tools";aside.setAttribute("aria-label","Mathematics learning resources");
 aside.innerHTML='<details><summary data-math-tools-open>Tools</summary><div class="khae-math-tools-grid" role="navigation" aria-label="Course learning resources"></div><p class="khae-math-tools-note"></p></details>';
 const grid=aside.querySelector(".khae-math-tools-grid"),note=aside.querySelector(".khae-math-tools-note");
 const addButton=(label,title,action,disabled=false)=>{
  const b=document.createElement("button");b.type="button";b.textContent=label;b.title=title;b.disabled=disabled;
  if(!disabled)b.addEventListener("click",action);grid.append(b);return b;
 };
 const renderButtons=()=>{
  grid.replaceChildren();
  const assessmentSurface=isAssessmentNow(),closedBook=isClosedBookNow();
  if(assessmentSurface){
   addButton("Notepad","Open session-only assessment notes",notesTool);
   addButton("Calculator","Open the Khaemenes Scientific Calculator",()=>openResource(resources.Calculator));
   addButton("Whiteboard","Open a scratch whiteboard",whiteboardTool);
   addButton("Graph","Open the course graphing tool",()=>openResource(resources.Graph));
   const formula=addButton("Formula",closedBook?"Formula sheet unavailable during the closed-book final":"Open the Algebra formula sheet",formulaTool,closedBook);
   if(closedBook)formula.setAttribute("aria-disabled","true");
   addButton("Help","Open assessment help",helpTool);
   note.textContent=closedBook?"Closed-book final: the formula sheet is disabled. Scratch tools do not affect scoring.":"Scratch tools support problem solving and do not affect scoring or mastery.";
  }else{
   ["Calculator","Graph","Studio","Games","Search","Parent"].forEach(label=>addButton(label,label+" resource",()=>openResource(resources[label])));
   addButton("Print","Print current learning page",()=>window.print());
   addButton("Course","Return to mathematics course home",()=>{
    const match=location.pathname.match(/^(.*\/courses\/mathematics\/(?:pre-algebra|algebra-1|geometry|algebra-2)\/)/i);
    location.href=match?match[1]:"/Khaemenes_High.github.io/courses/mathematics/";
   });
   note.textContent="Learning resources support practice and exploration. Assessment rules remain authoritative.";
  }
 };
 renderButtons();

 const style=document.createElement("style");style.id="khae-math-tools-style";style.textContent=`
 #khae-math-tools{position:fixed;left:14px;bottom:16px;z-index:989;width:min(284px,calc(100vw - 28px));font:400 16px/1.35 "Nunito","Avenir Next",Arial,sans-serif;color:#f6f0df}
 #khae-math-tools details{background:#252b2b;border:1px solid #b68a3e;border-radius:7px;box-shadow:0 10px 28px rgba(0,0,0,.22);overflow:hidden}
 #khae-math-tools summary{min-height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:10px 14px;list-style:none;color:#fff8eb}
 #khae-math-tools summary::-webkit-details-marker{display:none}
 #khae-math-tools .khae-math-tools-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;padding:0 11px 11px}
 #khae-math-tools button{min-width:0;min-height:44px;padding:8px;border:1px solid #b68a3e;border-radius:7px;background:#f7f0df;color:#252b2b;font:400 16px/1.15 "Nunito","Avenir Next",Arial,sans-serif;text-align:center;cursor:pointer}
 #khae-math-tools button:disabled{opacity:.48;cursor:not-allowed}
 #khae-math-tools button:focus-visible,#khae-math-tools summary:focus-visible{outline:3px solid #d9b65d;outline-offset:2px}
 #khae-math-tools .khae-math-tools-note{margin:0;padding:0 12px 12px;font-size:16px;line-height:1.4;color:#f6f0df;text-align:center}
 #khae-math-tool-dialog{width:min(780px,calc(100vw - 28px));max-height:min(82vh,760px);padding:0;border:1px solid #b68a3e;border-radius:7px;background:#fffaf0;color:#252b2b}
 #khae-math-tool-dialog::backdrop{background:rgba(0,0,0,.55)}
 .khae-math-tool-dialog-shell>header{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 18px;background:#252b2b;color:#fffaf0}
 .khae-math-tool-dialog-shell>header h2{margin:0;color:#fffaf0;font:400 24px/1.3 Cinzel,Georgia,serif}
 .khae-math-tool-dialog-shell>header button{width:44px;height:44px;border:1px solid #b68a3e;border-radius:7px;background:#fffaf0;color:#252b2b;font-size:24px}
 #khae-math-tool-dialog-body{padding:18px;font:400 18px/1.55 "Brandon Grotesque","Avenir Next",Arial,sans-serif}
 #khae-math-tool-dialog-body textarea{width:100%;min-height:320px;padding:14px;border:1px solid #bcae90;border-radius:7px;background:repeating-linear-gradient(180deg,#fff 0,#fff 30px,#eee6d6 31px);color:#252b2b;font:400 18px/31px "Avenir Next",Arial,sans-serif;resize:vertical}
 .khae-whiteboard-wrap canvas{display:block;width:100%;height:auto;aspect-ratio:9/5;border:1px solid #bcae90;border-radius:7px;background:#fff;touch-action:none}
 .khae-whiteboard-actions{display:flex;justify-content:center;margin-top:10px}.khae-whiteboard-actions button{min-height:44px;padding:8px 12px;border:1px solid #8d754b;border-radius:7px;background:#252b2b;color:#fffaf0}
 .khae-formula-sheet{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.khae-formula-sheet p{margin:0;padding:12px;border:1px solid #d2c6ae;border-radius:7px;background:#fff}
 @media(max-width:520px){#khae-math-tools{left:7px;bottom:8px;width:min(248px,calc(100vw - 14px))}.khae-formula-sheet{grid-template-columns:1fr}}
 @media print{#khae-math-tools,#khae-math-tool-dialog{display:none!important}}`;
 document.head.append(style);document.body.append(aside);
 window.KHAEMENES_MATH_TOOLS={
  course,
  open:()=>{aside.querySelector("details").open=true},
  refreshPolicy:renderButtons
 };
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
window.addEventListener("khaemenes-math-assessment-mode",()=>window.KHAEMENES_MATH_TOOLS?.refreshPolicy?.());
})();
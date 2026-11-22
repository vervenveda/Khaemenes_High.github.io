/* Khaemenes Academy · Upper Science Instruction Engine v1.0.0
 * Instructional presentation only for Biology 10, Chemistry 11, and Physics & Engineering 12.
 * Existing lesson DOM, course records, mastery, assessment, evidence, routes, and page shell remain authoritative.
 * No storage writes, network calls, grade changes, page chrome, translator, ticker, or toolbar ownership.
 */
(function(global){
"use strict";
if(global.KhaemenesUpperScienceInstructionEngine)return;

const VERSION="1.0.0";
const ENGINE_ID="khaeUpperScienceEngineV1";
const STYLE_ID="khaeUpperScienceEngineV1Style";
const STAGES=[
 {label:"Recall & Prepare",match:[/safety/i]},
 {label:"Learn & Model",match:[/explicit science instruction/i,/worked example/i,/read and reason/i,/reading and understanding/i]},
 {label:"Guided Reasoning",match:[/guided question/i,/guided practice/i]},
 {label:"Investigate & Analyze",match:[/independent work/i,/independent notebook/i,/science journal/i,/data and graph studio/i,/investigation/i]},
 {label:"Check & Correct",match:[/misconception/i,/formative understanding check/i,/retrieval practice/i,/practice questions/i]},
 {label:"Explain & Revise",match:[/mentor evidence conference/i,/claim/i,/cer/i]},
 {label:"Reflect & Transfer",match:[/teacher guidance/i,/continue learning/i,/preserve learning evidence/i]}
];

function text(node){return String(node?.textContent||"").replace(/\s+/g," ").trim()}
function sectionTitle(node){return text(node.querySelector("h2,h3"))}
function style(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement("style");s.id=STYLE_ID;
 s.textContent=`
body.upper-science-engine-on #${ENGINE_ID}{box-sizing:border-box;width:min(calc(100% - 32px),980px);margin:18px auto 24px;padding:18px;border:1px solid #c9bea8;border-radius:7px;background:#fffdf8;color:#243038;text-align:center}
body.upper-science-engine-on #${ENGINE_ID} h2{margin:0;font:400 24px/1.3 Cinzel,Georgia,serif;color:#243038}
body.upper-science-engine-on #${ENGINE_ID} p{margin:8px 0 0;font:400 16px/1.55 Nunito,Arial,sans-serif;color:#40504b}
body.upper-science-engine-on .upper-science-engine-steps{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px;margin:16px 0}
body.upper-science-engine-on #${ENGINE_ID} button{min-height:44px;padding:9px 10px;border:1px solid #243038;border-radius:7px;background:#243038;color:#fff8e9;font:400 16px/1.3 Nunito,Arial,sans-serif;cursor:pointer}
body.upper-science-engine-on #${ENGINE_ID} button[aria-current="step"]{background:#f4f0e7;color:#243038}
body.upper-science-engine-on #${ENGINE_ID} button:focus-visible{outline:3px solid #b48b45;outline-offset:3px}
body.upper-science-engine-on #${ENGINE_ID} button:disabled{opacity:.45;cursor:not-allowed}
body.upper-science-engine-on .upper-science-engine-controls{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
body.upper-science-engine-on .upper-science-engine-meter{height:10px;border:1px solid #c9bea8;border-radius:7px;background:#ece6d9;overflow:hidden}
body.upper-science-engine-on .upper-science-engine-meter span{display:block;width:0;height:100%;background:#556b5f}
body.upper-science-engine-on .upper-science-engine-hidden{display:none!important}
@media(max-width:860px){body.upper-science-engine-on .upper-science-engine-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:520px){body.upper-science-engine-on .upper-science-engine-steps{grid-template-columns:1fr}}
@media print{body.upper-science-engine-on #${ENGINE_ID}{display:none!important}body.upper-science-engine-on .upper-science-engine-hidden{display:block!important}}
`;
 (document.head||document.documentElement).appendChild(s);
}
function button(label){const b=document.createElement("button");b.type="button";b.textContent=label;return b}
function findLessonRoot(){
 return document.querySelector("main.grid, main.wrap, main");
}
function candidateSections(root){
 return [...root.querySelectorAll(":scope > section, :scope > article")].filter(node=>node.querySelector("h2,h3"));
}
function mapStages(nodes){
 const assigned=new Set();
 return STAGES.map(stage=>{
   const matches=[];
   for(const node of nodes){
     if(assigned.has(node))continue;
     const title=sectionTitle(node);
     if(stage.match.some(re=>re.test(title))){
       assigned.add(node);matches.push(node);
     }
   }
   return matches;
 });
}
function mount(){
 if(document.body?.dataset.scienceEngine!=="upper-science-v1")return false;
 if(document.getElementById(ENGINE_ID))return true;
 const root=findLessonRoot();if(!root)return false;
 const nodes=candidateSections(root),groups=mapStages(nodes);
 if(groups.slice(1).filter(g=>g.length).length<5)return false;

 style();
 const safetyNodes=nodes.filter(n=>/safety/i.test(sectionTitle(n))||n.classList.contains("warning")&&/safety/i.test(text(n)));
 const panel=document.createElement("nav");panel.id=ENGINE_ID;panel.setAttribute("aria-label","Guided science lesson");
 const heading=document.createElement("h2");heading.textContent="Scientific Learning Path";
 const note=document.createElement("p");note.textContent="Seven instructional stages · visits are navigation only, not mastery";
 const stepGrid=document.createElement("div");stepGrid.className="upper-science-engine-steps";
 const meter=document.createElement("div");meter.className="upper-science-engine-meter";meter.setAttribute("role","progressbar");meter.setAttribute("aria-valuemin","0");meter.setAttribute("aria-valuemax","7");meter.setAttribute("aria-label","Science lesson stages visited; not mastery");
 const bar=document.createElement("span");meter.appendChild(bar);
 const status=document.createElement("p");status.setAttribute("aria-live","polite");
 const controls=document.createElement("div");controls.className="upper-science-engine-controls";
 const previous=button("Previous step"),next=button("Next step"),all=button("Show complete lesson");
 controls.append(previous,next,all);panel.append(heading,note,stepGrid,meter,status,controls);

 let current=0,expanded=false;const visited=new Set();
 const tabs=STAGES.map((stage,i)=>{const b=button(String(i+1).padStart(2,"0")+" · "+stage.label);b.dataset.upperScienceStep=String(i+1);b.addEventListener("click",()=>show(i,{focus:true}));stepGrid.appendChild(b);return b});
 const anchor=document.querySelector("header.heading, header.wrap, header.top, .heading, .hero");
 if(anchor?.parentNode)anchor.insertAdjacentElement("afterend",panel);else root.before(panel);

 document.body.classList.add("upper-science-engine-on");
 function visible(node,on){node.classList.toggle("upper-science-engine-hidden",!on);node.setAttribute("aria-hidden",on?"false":"true")}
 function show(i,{focus=false}={}){
   expanded=false;current=Math.max(0,Math.min(STAGES.length-1,i));visited.add(current);
   groups.forEach((group,k)=>group.forEach(node=>visible(node,k===current)));
   for(const safeNode of safetyNodes)visible(safeNode,true);
   tabs.forEach((tab,k)=>tab.setAttribute("aria-current",k===current?"step":"false"));
   previous.disabled=current===0;next.disabled=current===STAGES.length-1;
   bar.style.width=Math.round((visited.size/STAGES.length)*100)+"%";meter.setAttribute("aria-valuenow",String(visited.size));
   status.textContent="Step "+(current+1)+" of 7 · "+visited.size+" visited · no mastery credit";
   all.textContent="Show complete lesson";
   panel.dataset.currentStep=String(current+1);
   if(focus)tabs[current].focus({preventScroll:true});
   document.dispatchEvent(new CustomEvent("khaemenes:upper-science-engine-step",{detail:{version:VERSION,step:current+1,visited:visited.size,mastery:false,persistence:false}}));
 }
 previous.addEventListener("click",()=>show(current-1,{focus:true}));
 next.addEventListener("click",()=>show(current+1,{focus:true}));
 all.addEventListener("click",()=>{
   expanded=!expanded;
   if(expanded){
     nodes.forEach(node=>visible(node,true));
     status.textContent="Complete lesson visible · no mastery awarded";
     all.textContent="Return to guided steps";
   }else show(current);
 });
 document.body.dataset.upperScienceEngineMounted="true";
 show(0);
 document.dispatchEvent(new CustomEvent("khaemenes:upper-science-engine-mounted",{detail:{version:VERSION,mastery:false,persistence:false,chrome:false}}));
 return true;
}
global.KhaemenesUpperScienceInstructionEngine=Object.freeze({version:VERSION,mount,stages:STAGES.map(s=>s.label)});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})(window);

/* Khaemenes Academy · Science 9 Instruction Engine v1.0.0
 * Instructional presentation only for Integrated Science 9.
 * Existing lesson DOM, unit records, mastery, assessment, evidence, routes, and page shell remain authoritative.
 * No storage writes, network calls, grade changes, page chrome, translator, ticker, or toolbar ownership.
 */
(function(global){
"use strict";
if(global.KhaemenesScience9InstructionEngine)return;

const VERSION="1.0.0";
const CONTRACT=Object.freeze({
 "essential-question":"prepare","objectives":"prepare","phenomenon":"prepare","safety":"prepare",
 "explicit-teaching":"learn","vocabulary":"learn","worked-example":"learn","model":"learn",
 "guided-practice":"guided",
 "quantitative":"investigate","investigation":"investigate","independent-practice":"investigate",
 "misconception":"check","formative-check":"check","retrieval":"check",
 "explanation":"explain","cer":"explain","evidence-revision":"explain",
 "differentiation":"reflect","teacher-guidance":"reflect","evidence-handoff":"reflect","standards":"reflect"
});
const STAGES=[
 {key:"prepare",label:"Recall & Prepare",match:[/learning objective/i,/essential question/i,/phenomenon/i,/safety/i,/materials/i]},
 {key:"learn",label:"Learn & Model",match:[/learn and practice/i,/observation/i,/concept/i,/worked/i,/model/i,/vocab/i]},
 {key:"guided",label:"Guided Reasoning",match:[/guided/i,/practice/i,/checkpoint/i,/question audit/i]},
 {key:"investigate",label:"Investigate & Analyze",match:[/investigat/i,/data/i,/graph/i,/measurement/i,/engineering/i,/simulation/i]},
 {key:"check",label:"Check & Correct",match:[/misconception/i,/retrieval/i,/exit check/i,/mastery connection/i]},
 {key:"explain",label:"Explain & Revise",match:[/claim/i,/evidence/i,/reasoning/i,/explanation/i,/CER/i,/portfolio evidence/i]},
 {key:"reflect",label:"Reflect & Transfer",match:[/reflect/i,/mentor/i,/portfolio/i,/pathway/i,/approval gate/i]}
];

function text(node){return String(node?.textContent||"").replace(/\s+/g," ").trim()}
function title(node){return text(node.querySelector("h2,h3,[role=heading]"))}
function root(){return document.querySelector("main")}
function nodes(host){return [...host.querySelectorAll("section.lesson-section, .safety-panel, .ka-lesson-stage")]}
function inspectContract(scope=document){
 const found={};
 for(const key of Object.keys(CONTRACT))found[key]=Boolean(scope.querySelector('[data-science-contract~="'+key+'"]'));
 const missing=Object.entries(found).filter(([,ok])=>!ok).map(([key])=>key);
 return Object.freeze({version:VERSION,found:Object.freeze(found),missing:Object.freeze(missing),complete:missing.length===0});
}
function mount(){
 if(document.body?.dataset.scienceEngine!=="science9-v1")return false;
 if(document.body.dataset.science9EngineMounted==="true")return true;
 const host=root();if(!host)return false;
 const lessonNodes=nodes(host);
 for(const node of lessonNodes){
   const explicit=String(node.dataset.scienceContract||"").split(/\s+/).filter(Boolean);
   const stage=explicit.map(token=>CONTRACT[token]).find(Boolean) ||
     STAGES.find(s=>s.match.some(re=>re.test(title(node)+" "+text(node).slice(0,280))))?.key;
   if(stage)node.dataset.scienceStage=stage;
 }
 document.body.dataset.science9EngineMounted="true";
 document.dispatchEvent(new CustomEvent("khaemenes:science9-engine-mounted",{
   detail:{version:VERSION,mastery:false,persistence:false,chrome:false,storage:false,curriculum:inspectContract(document)}
 }));
 return true;
}
global.KhaemenesScience9InstructionEngine=Object.freeze({version:VERSION,mount,inspectContract,contract:CONTRACT,stages:STAGES.map(s=>s.label)});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})(window);

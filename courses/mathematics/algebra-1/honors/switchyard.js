(()=>{
"use strict";
const unitKey=n=>"khaemenes-algebra1-unit"+String(n).padStart(2,"0")+"-a3-v1";
function inspectUnit(n){
 let raw;
 try{raw=localStorage.getItem(unitKey(n))}catch{return {state:"unverified",description:"Storage unavailable"}}
 if(raw===null)return {state:"unverified",description:"No mastery record"};
 let rec;try{rec=JSON.parse(raw)}catch{return {state:"unverified",description:"Malformed record preserved"}}
 if(!rec||!Array.isArray(rec.attempts))return {state:"unverified",description:"Attempt history unavailable"};
 const attempts=rec.attempts.filter(x=>x&&x.key==="mastery");
 if(!attempts.length)return {state:"unverified",description:"No unit mastery attempt"};
 const first=attempts[0],score=Number(first.score);
 if(!Number.isFinite(score)||score<0||score>100||!Number.isInteger(Number(first.attemptNumber)))return {state:"unverified",description:"First-attempt provenance incomplete"};
 const qualifies=attempts.length===1&&Number(first.attemptNumber)===1&&score>=90;
 return {state:qualifies?"candidate":"not-triggered",description:qualifies?"First-attempt unit mastery 90%+ without retakes":"Honors trigger not met",score,attemptCount:attempts.length};
}
function render(){
 const a=inspectUnit(1),b=inspectUnit(2),candidate=a.state==="candidate"&&b.state==="candidate";
 const container=document.getElementById("masteryReadout");
 if(!container)return;
 for(const [n,value] of [[1,a],[2,b]]){
  const card=document.createElement("article");card.className="panel";
  const heading=document.createElement("h2");heading.textContent="Unit "+String(n).padStart(2,"0");
  const p=document.createElement("p");p.textContent=value.description;
  const score=document.createElement("p");score.textContent=Number.isFinite(value.score)?value.score+"% · "+value.attemptCount+" mastery attempt(s)":"No validated numeric mastery score";
  card.append(heading,p,score);container.append(card);
 }
 document.getElementById("candidateStatus").textContent=candidate?
 "Potential Honors candidate · NAIB and Archaemenes review and authenticated parent/guardian approval are still required. Honors lessons remain locked.":
 "Honors placement not triggered or not verifiable. Continue standard Algebra I; no existing records are changed.";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
})();
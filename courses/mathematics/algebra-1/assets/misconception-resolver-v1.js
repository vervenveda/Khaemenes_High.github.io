(()=>{
"use strict";
const current=document.currentScript;
const base=new URL(".",current?.src||location.href);
const reviewedStatuses=new Set(["reviewed-v1","lesson-family-reviewed-v1"]);
let status="loading",dedicated=new Map(),late=new Map(),shared=new Map(),versions={dedicated:null,late:null,shared:null};
function rows(json){return Array.isArray(json?.items)?json.items:Object.values(json?.items||{})}
async function readJson(url){
 const response=await fetch(url,{cache:"no-cache"});
 if(!response.ok)throw new Error("misconception-map-load-"+response.status);
 return response.json();
}
const ready=Promise.all([
 readJson(new URL("../units/dedicated-assessment-misconceptions-v1.json",base)),
 readJson(new URL("late-unit-misconceptions-v1.json",base)),
 readJson(new URL("assessment-misconceptions-v1.json",base))
]).then(([d,l,s])=>{
 dedicated=new Map(rows(d).map(x=>[x.itemId,x]));
 late=new Map(rows(l).map(x=>[x.itemId,x]));
 shared=new Map(rows(s).map(x=>[x.itemId,x]));
 versions={dedicated:d.schemaVersion||d.schema||"1",late:l.schemaVersion||l.schema||"1",shared:s.schemaVersion||s.schema||"1"};
 status="ready";
 return true;
}).catch(error=>{
 status="unavailable";
 console.warn("Algebra I misconception resolver unavailable:",error);
 return false;
});
function lookup(itemId,selectedOriginalIndex){
 const rec=dedicated.get(itemId)||late.get(itemId)||shared.get(itemId);
 if(!rec||!Number.isInteger(Number(selectedOriginalIndex)))return null;
 const distractor=(Array.isArray(rec.distractors)?rec.distractors:[]).find(x=>Number(x.optionIndex)===Number(selectedOriginalIndex));
 if(!distractor)return null;
 const source=dedicated.has(itemId)?"dedicated":late.has(itemId)?"late":"shared";
 return {
  itemId,
  misconceptionTag:distractor.misconceptionTag||null,
  rationale:distractor.rationale||null,
  reviewStatus:rec.reviewStatus||null,
  mapSource:source,
  mapVersion:versions[source],
  learnerFeedbackEligible:reviewedStatuses.has(rec.reviewStatus)
 };
}
window.KhaemenesAlgebra1Misconceptions={ready,lookup,status:()=>status};
})();

/* Khaemenes High Science · reasoning diagnostic guidance v1
   This is a remediation taxonomy, not a claim of item-level misconception proof. */
(()=>{
"use strict";
const byType={
 concept:{tag:"concept-boundary",label:"Concept boundary",why:"Recheck the definition, mechanism, and the counterexample that separates this idea from a similar one.",day:2},
 model:{tag:"model-assumption",label:"Model assumption",why:"Identify what the model represents, what it assumes, and what evidence would fall outside its scope.",day:2},
 quantitative:{tag:"quantitative-setup",label:"Quantitative setup",why:"Rebuild the calculation from units, signs, proportional relationships, and the quantity the question actually asks for.",day:3},
 evidence:{tag:"evidence-inference",label:"Evidence vs. inference",why:"Separate the observed or calculated evidence from the explanation, causal claim, or generalization.",day:3},
 application:{tag:"transfer-constraint",label:"Transfer / constraint",why:"List the conditions and constraints that must remain true before transferring the principle to the new situation.",day:4}
};
function reviewed(map,q,chosenIndex){
 const item=map?.items?.[q?.id];if(!item||!Number.isInteger(chosenIndex)||chosenIndex===q?.answer)return null;
 const hit=Array.isArray(item.distractors)?item.distractors.find(x=>x.optionIndex===chosenIndex):null;
 if(!hit)return null;
 return Object.freeze({
  schema:"khaemenes.science.item-misconception.v1",
  itemId:String(q.id||""),
  label:String(hit.misconceptionTag||"Reviewed misconception"),
  tag:String(hit.misconceptionTag||"reviewed-misconception"),
  guidance:String(hit.rationale||"Review this reasoning path."),
  remediationRoute:"Week "+String(Number(q.week)||"").padStart(2,"0")+" · Day "+String((byType[String(q?.type||"concept").toLowerCase()]||byType.concept).day).padStart(2,"0")+" correction",
  certainty:"reviewed-option-specific",
  note:"This diagnosis is tied to the selected distractor and reviewed item map."
 });
}
function forQuestion(course,q,chosenIndex){
 const type=String(q?.type||"concept").toLowerCase();
 const base=byType[type]||byType.concept;
 const week=Number(q?.week)||null;
 const day=base.day;
 const route=week?"Week "+String(week).padStart(2,"0")+" · Day "+String(day).padStart(2,"0"):"Day "+String(day).padStart(2,"0");
 return Object.freeze({schema:"khaemenes.science.reasoning-diagnostic.v1",course:String(course||"science"),itemId:String(q?.id||""),type,tag:base.tag,label:base.label,guidance:base.why,remediationRoute:route,chosenIndex:Number.isInteger(chosenIndex)?chosenIndex:null,certainty:"reasoning-category-only",note:"This category guides correction. It does not prove the learner holds one specific misconception."});
}
window.KhaeScienceMisconceptionGuidance=Object.freeze({version:1,forQuestion,reviewed});
})();

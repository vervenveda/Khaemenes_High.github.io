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
function forQuestion(course,q,chosenIndex){
 const type=String(q?.type||"concept").toLowerCase();
 const base=byType[type]||byType.concept;
 const week=Number(q?.week)||null;
 const day=base.day;
 const route=week?"Week "+String(week).padStart(2,"0")+" · Day "+String(day).padStart(2,"0"):"Day "+String(day).padStart(2,"0");
 return Object.freeze({schema:"khaemenes.science.reasoning-diagnostic.v1",course:String(course||"science"),itemId:String(q?.id||""),type,tag:base.tag,label:base.label,guidance:base.why,remediationRoute:route,chosenIndex:Number.isInteger(chosenIndex)?chosenIndex:null,certainty:"reasoning-category-only",note:"This category guides correction. It does not prove the learner holds one specific misconception."});
}
window.KhaeScienceMisconceptionGuidance=Object.freeze({version:1,forQuestion});
})();

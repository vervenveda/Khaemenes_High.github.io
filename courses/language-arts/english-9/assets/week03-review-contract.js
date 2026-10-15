/* English 9 · Week 03 Unit 01 local human-review contract.
   Public static JavaScript does not authenticate educators. No external services. */
(function(root){
 "use strict";
 const schema="english9-week03-review-v1";
 const exportSchema="english9-week03-evaluation-export-v1";
 const labels=[
  ["inquiry","Inquiry & Claim"],
  ["evidence","Evidence"],
  ["synthesis","Synthesis"],
  ["reasoning","Reasoning"],
  ["clarity","Clarity & Conventions"]
 ];
 const allowed=Object.freeze(labels.map(x=>x[0]));
 function isObject(x){return !!x&&typeof x==="object"&&!Array.isArray(x);}
 function isISO(x){return typeof x==="string"&&!Number.isNaN(Date.parse(x))&&x.length>=10;}
 function keyPrefix(k){return "khae-ela9-field:"+k;}
 function scoped(base,studentId){return base+":learner:"+encodeURIComponent(studentId);}
 function scoreRows(rows){
  if(!isObject(rows)||Object.keys(rows).length!==allowed.length)return null;
  let total=0;
  for(const id of allowed){
   if(!Object.prototype.hasOwnProperty.call(rows,id)||!Number.isInteger(rows[id])||rows[id]<0||rows[id]>2)return null;
   total+=rows[id];
  }
  return total;
 }
 function validateSubmission(x){
  return isObject(x)&&x.schema===schema&&x.day===15&&
   typeof x.learnerId==="string"&&x.learnerId.trim().length>0&&
   isISO(x.submittedAt)&&Number.isInteger(x.independentDraftWordCount)&&
   x.independentDraftWordCount>=450&&x.independentDraftWordCount<=650&&
   Number.isInteger(x.finalWordCount)&&x.finalWordCount>=450&&x.finalWordCount<=650&&
   Number.isInteger(x.conventionsEntered)&&x.conventionsEntered===10;
 }
 function validateReview(x){
  if(!validateSubmission(x))return false;
  const total=scoreRows(x.rubricRows);
  return total!==null&&x.reviewSource==="english9-gradebook-local-v1"&&
   x.rubricScore===total&&
   x.masteryAwarded===(total>=8)&&
   x.gradeStatus===(total>=8?"passed":"revision-required")&&
   typeof x.evaluatedBy==="string"&&x.evaluatedBy.trim().length>=2&&
   isISO(x.evaluatedAt)&&
   typeof x.teacherFeedback==="string"&&x.teacherFeedback.trim().length>=10;
 }
 function reviewMatchesSubmission(review,submission){
  return validateReview(review)&&validateSubmission(submission)&&
   review.learnerId===submission.learnerId&&
   review.submittedAt===submission.submittedAt&&
   review.independentDraftWordCount===submission.independentDraftWordCount&&
   review.finalWordCount===submission.finalWordCount&&
   review.conventionsEntered===submission.conventionsEntered;
 }
 function makeReview(submission,rows,reviewer,feedback,date){
  if(!validateSubmission(submission))throw Error("Assessment submission is incomplete or invalid.");
  const total=scoreRows(rows);
  if(total===null)throw Error("Enter a score of 0, 1, or 2 for every criterion.");
  if(typeof reviewer!=="string"||reviewer.trim().length<2)throw Error("Enter the evaluator's name.");
  if(typeof feedback!=="string"||feedback.trim().length<10)throw Error("Include meaningful evidence-specific feedback.");
  const time=date||new Date().toISOString();
  if(!isISO(time))throw Error("Invalid review date.");
  const obj={...submission,reviewSource:"english9-gradebook-local-v1",gradeStatus:total>=8?"passed":"revision-required",
   masteryAwarded:total>=8,rubricScore:total,rubricRows:Object.fromEntries(allowed.map(k=>[k,rows[k]])),
   evaluatedBy:reviewer.trim(),evaluatedAt:time,teacherFeedback:feedback.trim()};
  if(!validateReview(obj))throw Error("Review validation failed.");
  return obj;
 }
 function parseEvaluationFile(json){
  if(!isObject(json)||json.schema!==exportSchema||!validateReview(json.review))throw Error("Not a valid English 9 evaluation export.");
  return json.review;
 }
 const api=Object.freeze({schema,exportSchema,labels,allowed,keyPrefix,scoped,scoreRows,validateSubmission,validateReview,reviewMatchesSubmission,makeReview,parseEvaluationFile});
 root.KhaemenesEnglish9Week03Review=api;
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);

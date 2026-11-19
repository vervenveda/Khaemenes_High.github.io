/* Khaemenes Academy · Mathematics assessment directive routing v1.0.0
   Edit this file to change post-assessment routing across the Mathematics portal.
   No scoring, question-bank, attempt-history or mastery calculations live here.
*/
(function(global){
"use strict";
if(global.KhaemenesMathAssessmentDirectiveConfig)return;
const ROOT="/Khaemenes_High.github.io/courses/mathematics/";
const course=(slug,{midtermPath,finalPath,midtermAfterUnit,secondHalfStart})=>Object.freeze({
 root:ROOT+slug+"/",
 unit0:ROOT+slug+"/units/unit-00/",
 unit1:ROOT+slug+"/units/unit-01/",
 records:ROOT+slug+"/records/",
 midterm:ROOT+slug+"/"+midtermPath,
 final:ROOT+slug+"/"+finalPath,
 midtermAfterUnit,
 secondHalfStart
});
const courses=Object.freeze({
 "pre-algebra":course("pre-algebra",{midtermPath:"assessments/midterm-units-01-07.html",finalPath:"assessments/final-exam-36-weeks.html",midtermAfterUnit:7,secondHalfStart:8}),
 "algebra-1":course("algebra-1",{midtermPath:"assessments/midterm-units-01-06.html",finalPath:"assessments/final-exam-36-weeks.html",midtermAfterUnit:6,secondHalfStart:7}),
 "geometry":course("geometry",{midtermPath:"assessments/midterm.html",finalPath:"assessments/final.html",midtermAfterUnit:6,secondHalfStart:7}),
 "algebra-2":course("algebra-2",{midtermPath:"assessments/midterm.html",finalPath:"assessments/final.html",midtermAfterUnit:6,secondHalfStart:7})
});
global.KhaemenesMathAssessmentDirectiveConfig=Object.freeze({
 version:"1.0.0",
 masteryThreshold:80,
 courses,
 readinessBelow:Object.freeze({
  "pre-algebra":Object.freeze({
   title:"Preparatory pathway recommended",
   message:"This readiness result is below 80%. Strengthen the prerequisite foundations in the six-week Unit 0 Foundations & Readiness pathway before beginning Official Unit 1.",
   label:"Begin 6-Week Preparatory Course",
   href:courses["pre-algebra"].unit0
  }),
  "algebra-1":Object.freeze({
   title:"Build the Pre-Algebra foundation first",
   message:"This Algebra I readiness result is below 80%. Continue through Pre-Algebra before returning to the Algebra I readiness assessment.",
   label:"Continue to Pre-Algebra",
   href:courses["pre-algebra"].root
  })
 }),
 passLabels:Object.freeze({
  readiness:"Continue to Unit 1",
  weekly:"Continue to Next Step",
  unit:"Continue to Next Unit",
  midterm:"Continue to Second-Half Course Work",
  final:"Open Course Completion Record",
  assessment:"Continue"
 }),
 retry:Object.freeze({
  title:"More mastery is needed",
  message:"This assessment is below the 80% mastery standard. Review the missed work, correct your reasoning, and retake this assessment.",
  label:"Review & Retake Assessment"
 })
});
})(window);

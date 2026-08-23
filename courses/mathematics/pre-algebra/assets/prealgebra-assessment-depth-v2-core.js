(() => {
"use strict";

const scriptEl=document.currentScript;
const base=new URL("assessment-depth/",scriptEl?.src||location.href);
const PARTS=[
  "prealgebra-weekly-quizzes-v2-a.js",
  "prealgebra-weekly-quizzes-v2-b.js",
  "prealgebra-weekly-quizzes-v2-c.js",
  "prealgebra-weekly-quizzes-v2-d.js"
];
const BLUEPRINT=[
  "procedural-fluency",
  "multi-step-application",
  "representation-interpretation",
  "error-analysis",
  "transfer-reasoning"
];

window.KhaemenesPreAlgebraWeeklyQuizV2={};

function courseApp(){try{return typeof APP!=="undefined"&&APP?APP:null}catch{return null}}
function validQuestion(q){return Array.isArray(q)&&typeof q[0]==="string"&&q[0].trim()&&Array.isArray(q[1])&&q[1].length===4&&q[1].every(choice=>typeof choice==="string"&&choice.trim())&&Number.isInteger(q[2])&&q[2]>=0&&q[2]<4}

function apply(){
  const app=courseApp();
  if(!app||!Array.isArray(app.weeks)){
    console.error("Pre-Algebra assessment depth could not find the course week registry.");
    return false;
  }
  const bank=window.KhaemenesPreAlgebraWeeklyQuizV2||{};
  let patched=0;
  const failures=[];
  app.weeks.forEach(week=>{
    const quiz=bank[String(week.week)];
    if(!Array.isArray(quiz)||quiz.length!==10||!quiz.every(validQuestion)){
      failures.push(week.week);
      return;
    }
    week.quiz=quiz.map(q=>[q[0],[...q[1]],q[2]]);
    week.quizBlueprint={
      version:"2.0",
      questionCount:10,
      masteryThreshold:80,
      masteryRequired:8,
      dimensions:[...BLUEPRINT],
      alignment:"week-specific",
      policy:"Every weekly mastery check must reflect the stated weekly focus rather than reuse a generic unit-domain quiz."
    };
    patched+=1;
  });
  app.assessmentAlignment={
    version:"2.0",
    weeklyChecks:patched,
    questionsPerWeek:10,
    totalWeeklyQuestions:patched*10,
    masteryThreshold:80,
    masteryRequired:8,
    dimensions:[...BLUEPRINT],
    status:failures.length?"incomplete":"aligned",
    failures
  };
  if(failures.length){
    console.error("Pre-Algebra assessment-depth patch incomplete for weeks:",failures.join(", "));
    return false;
  }
  try{if(typeof render==="function")render()}catch(error){console.warn("Pre-Algebra assessment-depth rerender could not complete.",error)}
  return true;
}

function loadPart(index){
  if(index>=PARTS.length){apply();return}
  const script=document.createElement("script");
  script.src=new URL(PARTS[index],base).href;
  script.async=false;
  script.onload=()=>loadPart(index+1);
  script.onerror=()=>console.error("Pre-Algebra assessment-depth dependency could not load:",PARTS[index]);
  document.head.appendChild(script);
}

window.KhaemenesPreAlgebraAssessmentDepthV2={apply,blueprint:[...BLUEPRINT],version:"2.0"};
loadPart(0);
})();

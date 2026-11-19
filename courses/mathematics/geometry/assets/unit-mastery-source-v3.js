(()=>{
"use strict";
const cfg=window.GEO_ASSESSMENT_CONFIG||{},weekly=window.KhaemenesGeometryWeeklyMasteryV2||{},base=Array.isArray(window.GEOMETRY_QUESTIONS)?[...window.GEOMETRY_QUESTIONS]:[];
const MASTERY=80,COUNT=25,DIMS=["procedural-fluency","multi-step-application","representation-interpretation","error-analysis","transfer-reasoning"];
const UNIT_WEEKS={1:[1,2],2:[3,4,5],3:[6,7,8],4:[9,10],5:[11,12,13],6:[14,15,16,17],7:[19,20,21],8:[22,23,24],9:[25,26,27],10:[28,29],11:[30,31],12:[32,33,34],13:[35,36]};
const unit=Number(Array.isArray(cfg.units)&&cfg.units.length===1?cfg.units[0]:0),weeks=UNIT_WEEKS[unit]||[];
function normWeekly(q,w){return{...q,unit,week:w,lesson:null,skill:q.skill||q.dimension,dimension:q.dimension,source:"weekly-mastery-v2",source_week:w,source_question_id:q.id,id:`geo-u${String(unit).padStart(2,"0")}-depth-${q.id}`}}
function normBase(q,i){return{...q,unit,week:null,lesson:null,dimension:DIMS[i%DIMS.length],source:"unit-question-bank",source_week:null,source_question_id:q.id,id:`geo-u${String(unit).padStart(2,"0")}-synthesis-${q.id}`}}
function build(){
 if(!unit||!weeks.length)return[];
 if(!weeks.every(w=>Array.isArray(weekly[String(w)]?.questions)&&weekly[String(w)].questions.length===10))return[];
 const chosen=[],used=new Set();
 for(const dim of DIMS){
  const candidates=[];
  for(const w of weeks)for(const q of weekly[String(w)].questions)if(q.dimension===dim)candidates.push(normWeekly(q,w));
  for(const q of candidates){if(chosen.filter(x=>x.dimension===dim).length>=4)break;if(!used.has(q.source_question_id)){chosen.push(q);used.add(q.source_question_id)}}
 }
 const extras=base.filter(q=>Number(q.unit)===unit).sort((a,b)=>String(a.id).localeCompare(String(b.id))).slice(0,5).map(normBase);
 return [...chosen,...extras].slice(0,COUNT);
}
const set=build(),weekCoverage=new Set(set.filter(q=>q.week).map(q=>q.week)),dimensionCounts=Object.fromEntries(DIMS.map(d=>[d,set.filter(q=>q.dimension===d).length]));
const ready=set.length===COUNT&&weeks.every(w=>weekCoverage.has(w))&&DIMS.every(d=>dimensionCounts[d]===5)&&new Set(set.map(q=>q.id)).size===COUNT;
cfg.count=COUNT;cfg.masteryTarget=MASTERY;cfg.instructions="Answer all 25 questions. Exactly 20/25 correct demonstrates 80% mastery. Below-mastery attempts require corrections and a retry on the same form.";cfg.depthSource="weekly-mastery-v2-plus-unit-bank";cfg.depthSourceReady=ready;cfg.depthBlueprint={questions:COUNT,weeks:[...weeks],dimensions:{...dimensionCounts},retryPolicy:"fixed-no-shuffle"};
if(ready){window.GEOMETRY_QUESTIONS=set}else{window.GEOMETRY_QUESTIONS=[];cfg.masteryTarget=101;cfg.instructions="Formal unit mastery is unavailable because the required week-aligned depth bank did not load completely. No mastery credit can be issued.";const host=document.getElementById("assessmentRoot");if(host)host.innerHTML='<article class="card"><p class="notice"><strong>Unit mastery depth bank unavailable.</strong> Reload online or contact the course evaluator. This assessment fails closed and cannot issue mastery credit.</p></article>'}
})();
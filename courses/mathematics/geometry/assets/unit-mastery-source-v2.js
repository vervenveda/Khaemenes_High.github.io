(()=>{
"use strict";
const cfg=window.GEO_ASSESSMENT_CONFIG||{},bank=window.KhaemenesGeometryWeeklyMasteryV2||{};
const MASTERY=80,COUNT=20,DIMS=["procedural-fluency","multi-step-application","representation-interpretation","error-analysis","transfer-reasoning"];
const UNIT_WEEKS={1:[1,2],2:[3,4,5],3:[6,7,8],4:[9,10],5:[11,12,13],6:[14,15,16,17],7:[19,20,21],8:[22,23,24],9:[25,26,27],10:[28,29],11:[30,31],12:[32,33,34],13:[35,36]};
const unit=Number(Array.isArray(cfg.units)&&cfg.units.length===1?cfg.units[0]:0),weeks=UNIT_WEEKS[unit]||[];
function hashSeed(t){let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function nextSeed(x){x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0}
function orderFor(q){const a=q.options.map((_,i)=>i);let x=hashSeed(`GEO-U${unit}-${q.id}-DEPTH-V2`);for(let i=a.length-1;i>0;i--){x=nextSeed(x);const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function normalized(q,week){const order=orderFor(q);return{...q,unit,week,skill:q.dimension,source_week:week,source_question_id:q.id,id:`geo-u${String(unit).padStart(2,"0")}-depth-${q.id}`,options:order.map(i=>q.options[i]),answer:order.indexOf(q.answer),answer_text:q.answer_text||q.options[q.answer]}}
function build(){if(!unit||!weeks.length)return[];if(!weeks.every(w=>Array.isArray(bank[String(w)]?.questions)&&bank[String(w)].questions.length===10))return[];const out=[];DIMS.forEach((dim,di)=>{const byWeek=weeks.map(w=>bank[String(w)].questions.filter(q=>q.dimension===dim));const chosen=[];for(let pass=0;pass<2&&chosen.length<4;pass++){for(let step=0;step<weeks.length&&chosen.length<4;step++){const wi=(step+di)%weeks.length,q=byWeek[wi]?.[pass];if(q)chosen.push(normalized(q,weeks[wi]))}}if(chosen.length<4){for(const w of weeks){for(const q of bank[String(w)].questions.filter(q=>q.dimension===dim)){if(chosen.length>=4)break;if(!chosen.some(x=>x.source_question_id===q.id))chosen.push(normalized(q,w)}}}out.push(...chosen.slice(0,4))});return out}
const set=build(),weekCoverage=new Set(set.map(q=>q.week)),dimensionCounts=Object.fromEntries(DIMS.map(d=>[d,set.filter(q=>q.dimension===d).length]));
const ready=set.length===COUNT&&weeks.every(w=>weekCoverage.has(w))&&DIMS.every(d=>dimensionCounts[d]===4)&&new Set(set.map(q=>q.id)).size===COUNT;
cfg.count=COUNT;cfg.masteryTarget=MASTERY;cfg.instructions=`Answer all ${COUNT} questions. Reach ${MASTERY}% to advance; below-mastery attempts require corrections and a retake.`;cfg.depthSource="weekly-mastery-v2";cfg.depthSourceReady=ready;cfg.depthBlueprint={questions:COUNT,weeks:[...weeks],dimensions:{...dimensionCounts}};
if(ready){window.GEOMETRY_QUESTIONS=set}else{
 window.GEOMETRY_QUESTIONS=[];cfg.masteryTarget=101;
 cfg.instructions="Formal unit mastery is unavailable because the required week-aligned depth bank did not load completely. No mastery credit can be issued.";
 const host=document.getElementById("assessmentRoot");if(host)host.innerHTML='<article class="card"><p class="notice"><strong>Unit mastery depth bank unavailable.</strong> Reload online or contact the course evaluator. This assessment fails closed and cannot issue mastery credit.</p></article>';
 const start=document.getElementById("startAssessment"),reset=document.getElementById("resetAssessment");if(start)start.disabled=true;if(reset)reset.disabled=true;
}
})();
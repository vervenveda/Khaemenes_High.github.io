/* Algebra I weekly mastery retrieval patch v3
   Keeps 10 questions / five-dimension balance while replacing one procedural and one transfer item
   with delayed retrieval from an earlier week. Does not change unit mastery banks. */
(()=>{"use strict";
if(window.KhaemenesAlgebra1WeeklyRetrievalV3)return;
const bank=window.KhaemenesAlgebra1WeeklyMasteryV2||{};
const dims=["procedural-fluency","transfer-reasoning"];
for(let week=1;week<=36;week++){
 const row=bank[String(week)];if(!row||!Array.isArray(row.questions))continue;
 row.current_count=10;row.delayed_count=0;row.retrieval_from_week=null;
 if(week<=1)continue;
 const lag=1+(week%3),priorWeek=Math.max(1,week-lag),prior=bank[String(priorWeek)];
 if(!prior||!Array.isArray(prior.questions))continue;
 for(const dim of dims){
  const ti=row.questions.findIndex(q=>q.dimension===dim);
  const source=prior.questions.find(q=>q.dimension===dim);
  if(ti<0||!source)continue;
  const target=row.questions[ti];
  row.questions[ti]={...source,id:target.id,retrieval_from_week:priorWeek,retrieval_source_id:source.id};
 }
 row.current_count=8;row.delayed_count=2;row.retrieval_from_week=priorWeek;
}
window.KhaemenesAlgebra1WeeklyRetrievalV3=Object.freeze({version:"3.0.0",weeks:36,blueprint:"8-current+2-delayed",dimensions:dims});
})();

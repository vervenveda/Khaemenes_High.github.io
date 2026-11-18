/* Khaemenes Academy · mathematics learner-progress contract v1
   READ ONLY. No localStorage/sessionStorage writes. No grade inference from missing data. */
(()=>{"use strict";
const path=location.pathname.toLowerCase();
const course=path.includes("/pre-algebra/")?"pre-algebra":path.includes("/algebra-1/")?"algebra-1":path.includes("/geometry/")?"geometry":path.includes("/algebra-2/")?"algebra-2":null;
if(!course||window.KhaemenesMathProgress)return;
const MASTERY=80;
const activeLearner=()=>window.KhaemenesMathLearnerRecord?.learner?.()||null;
const readRaw=key=>{const S=window.KhaemenesMathStorageAdapter;if(S?.readRaw)return S.readRaw(key,null);try{return localStorage.getItem(key)}catch{return null}};
const parse=raw=>{try{return JSON.parse(raw||"null")}catch{return null}};
const read=(key)=>{const learner=activeLearner();if(learner?.verified&&learner.id){const scoped=key+":learner:"+encodeURIComponent(learner.id),value=parse(readRaw(scoped));if(value!==null)return value}return parse(readRaw(key))};
const num=v=>Number.isFinite(Number(v))?Number(v):null;
const avg=arr=>{const xs=arr.map(num).filter(v=>v!==null);return xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null};
const status=v=>v===null||v===undefined?"not_recorded":"recorded";
function base(){
 return {
  schema:"khaemenes-math-progress-v1",
  course,
  generated_at:new Date().toISOString(),
  authority:{mastery_target:MASTERY,missing_is_zero:false,read_only:true},
  progress:{status:"unavailable",completed_units:null,completed_weeks:null,completed_lessons:null,course_percent:null},
  mastery:{status:"unavailable",threshold:MASTERY,unit_mastery:null,weekly_mastery:null,midterm:null,final:null,average:null},
  evidence:{status:"unavailable",classwork:null,assignments:null,projects:null,labs:null,activities:null,notes:null},
  portfolio:{status:"unavailable",artifacts:null,weekly_entries:null,capstone:null,reflection_entries:null},
  provenance:{source:"browser-local",learner_scoped:null,notes:[]}
 };
}
function preAlgebra(){
 const out=base(),root=read("KHAE_OPEN_PREALGEBRA_FORGE_V2");
 const students=Array.isArray(root?.students)?root.students.filter(s=>s&&s.progress):[];
 const active=students.find(s=>s.id===root?.activeId)||null;
 if(!active){out.provenance.learner_scoped=false;out.provenance.notes.push("No active learner-scoped Pre-Algebra course record found.");return out;}
 const weeks=Object.values(active.progress?.weeks||{});
 const lessonChecks=weeks.reduce((n,w)=>n+Object.values(w?.lessons||{}).filter(Boolean).length,0);
 const assignments=weeks.reduce((n,w)=>n+Object.values(w?.assignments||{}).filter(Boolean).length,0);
 const quizBests=weeks.map(w=>num(w?.quiz?.best)).filter(v=>v!==null);
 out.progress={status:"recorded",completed_units:null,completed_weeks:weeks.length,completed_lessons:lessonChecks,course_percent:num(active.progress?.coursePercent)};
 out.mastery={status:quizBests.length?"recorded":"not_recorded",threshold:MASTERY,unit_mastery:null,weekly_mastery:quizBests.filter(v=>v>=MASTERY).length,midterm:num(active.progress?.exams?.midterm),final:num(active.progress?.exams?.final),average:avg(quizBests)};
 out.evidence={status:"recorded",classwork:null,assignments,projects:null,labs:null,activities:null,notes:null};
 out.portfolio={status:active.progress?.capstone?"recorded":"not_recorded",artifacts:null,weekly_entries:null,capstone:active.progress?.capstone??null,reflection_entries:null};
 out.provenance.learner_scoped=true;
 out.provenance.notes.push("Historical unscoped Pre-Algebra records are intentionally excluded.");
 return out;
}
function algebra1(){
 const out=base(),A=window.KhaemenesAlgebra1MasteryAuthority;
 if(A){
   let units=0,weeks=0;const unitScores=[],weekScores=[];
   for(let i=1;i<=13;i++){const e=A.unitEvidence?A.unitEvidence(i):null;if(e?.mastery)units++;if(num(e?.best)!==null)unitScores.push(num(e.best));}
   for(let i=2;i<=36;i++){const e=A.weekEvidence?A.weekEvidence(i):null;if(e?.mastery)weeks++;if(num(e?.best)!==null)weekScores.push(num(e.best));}
   const mid=A.cumulativeEvidence?A.cumulativeEvidence("midterm"):null,fin=A.cumulativeEvidence?A.cumulativeEvidence("final"):null;
   out.progress={status:"recorded",completed_units:units,completed_weeks:weeks,completed_lessons:null,course_percent:null};
   out.mastery={status:"recorded",threshold:MASTERY,unit_mastery:units,weekly_mastery:weeks,midterm:num(mid?.best),final:num(fin?.best),average:avg([...unitScores,...weekScores,num(mid?.best),num(fin?.best)])};
   out.provenance.learner_scoped=null;out.provenance.notes.push("Uses canonical Algebra I mastery authority when available.");
 }else out.provenance.notes.push("Algebra I mastery authority unavailable on this page; no grade inferred.");
 out.evidence.status="not_recorded";out.portfolio.status="not_recorded";
 return out;
}
function geometry(){
 const out=base(),key="khaemenes-geometry-course-v1",state=read(key)||{};
 const weeks=state.weeks&&typeof state.weeks==="object"?Object.values(state.weeks):[];
 const classwork=weeks.map(w=>num(w?.classwork)),mastery=weeks.map(w=>num(w?.masteryBest)),portfolio=weeks.map(w=>num(w?.portfolio));
 const assess=read("khaemenes-geometry-assessment-records-v1")||{};
 let units=0;for(let i=1;i<=13;i++){const r=assess["unit-"+String(i).padStart(2,"0")];if(r?.mastery===true||num(r?.bestScore)>=MASTERY)units++;}
 const weekly=read("khaemenes-geometry-weekly-mastery-v2")?.weeks||{};let masteredWeeks=0;for(let i=1;i<=36;i++){const r=weekly[i]||weekly[String(i)];if(num(r?.best)>=MASTERY||r?.attempts?.some(a=>a?.mastery_met===true))masteredWeeks++;}
 const mid=assess.midterm,fin=assess.final;
 out.progress={status:weeks.length?"recorded":"not_recorded",completed_units:units,completed_weeks:masteredWeeks,completed_lessons:null,course_percent:null};
 out.mastery={status:"recorded",threshold:MASTERY,unit_mastery:units,weekly_mastery:masteredWeeks,midterm:num(mid?.bestScore),final:num(fin?.bestScore),average:avg(mastery)};
 out.evidence={status:weeks.length?"recorded":"not_recorded",classwork:avg(classwork),assignments:null,projects:null,labs:null,activities:null,notes:null};
 out.portfolio={status:portfolio.some(v=>v!==null)?"recorded":"not_recorded",artifacts:null,weekly_entries:portfolio.filter(v=>v!==null).length,capstone:null,reflection_entries:null};
 out.provenance.learner_scoped=null;
 return out;
}
function algebra2(){
 const out=base(),state=read("khaemenes-algebra2-course-v1")||{};
 const weeks=state.weeks&&typeof state.weeks==="object"?Object.values(state.weeks):[];
 const classwork=weeks.map(w=>num(w?.classwork)),mastery=weeks.map(w=>num(w?.masteryBest)),portfolio=weeks.map(w=>num(w?.portfolio));
 const assess=read("khaemenes-algebra2-assessment-records-v1")||{};
 let units=0;for(let i=1;i<=13;i++){const r=assess["unit-"+String(i).padStart(2,"0")+"-mastery"];if(r&&((num(r.bestScore)>=MASTERY)||(num(r.score)>=MASTERY)||r.mastery===true))units++;}
 const mid=assess.midterm,fin=assess.final,mission=read("khaemenes-algebra2-applied-mission-portfolio-v1");
 const missions=mission?.units&&typeof mission.units==="object"?Object.keys(mission.units).length:0;
 out.progress={status:weeks.length?"recorded":"not_recorded",completed_units:units,completed_weeks:weeks.length,completed_lessons:null,course_percent:null};
 out.mastery={status:"recorded",threshold:MASTERY,unit_mastery:units,weekly_mastery:mastery.filter(v=>v!==null&&v>=MASTERY).length,midterm:num(mid?.bestScore??mid?.score),final:num(fin?.bestScore??fin?.score),average:avg(mastery)};
 out.evidence={status:weeks.length?"recorded":"not_recorded",classwork:avg(classwork),assignments:null,projects:missions,labs:null,activities:null,notes:null};
 out.portfolio={status:(portfolio.some(v=>v!==null)||missions)?"recorded":"not_recorded",artifacts:missions,weekly_entries:portfolio.filter(v=>v!==null).length,capstone:num(state?.formal?.capstone),reflection_entries:weeks.filter(w=>String(w?.reflection||"").trim()).length};
 out.provenance.learner_scoped=null;
 return out;
}
function snapshot(){return ({ "pre-algebra":preAlgebra, "algebra-1":algebra1, geometry, "algebra-2":algebra2 }[course])();}
window.KhaemenesMathProgress={schema:"khaemenes-math-progress-v1",course,threshold:MASTERY,snapshot};
window.dispatchEvent(new CustomEvent("khaemenes-math-progress-ready",{detail:{course,schema:"khaemenes-math-progress-v1"}}));
})();
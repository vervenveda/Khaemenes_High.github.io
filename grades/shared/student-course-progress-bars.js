/* Read-only class completion summary; percentages exclusively from course continuation snapshots. */
(()=>{"use strict";
const grade=(location.pathname.match(/\/grade-(09|10|11|12)\/student-profile\//)||[])[1];
if(!grade)return;
const continuation=window.KhaemenesLearningContinuation;
const profile=window.KhaemenesStudentProfileV2;
const contract=window.KhaemenesCourseEntryContract;
const learnerId=()=>{const a=profile?.activeLearner?.()?.learnerId,b=contract?.readAcademyProfile?.()?.learnerId;return a&&b&&String(a)===String(b)?String(a):null};
const initial=learnerId();
const host=document.createElement("section");host.id="studentCourseProgress";host.style.cssText="margin:14px 0 22px;padding:15px;border:1px solid #aa9675;border-radius:7px;background:#182b3c;color:#f1ece3;font:400 15px/1.5 Arial,sans-serif";
const h=document.createElement("h2");h.textContent="My Class Progress";h.style.cssText="margin:0 0 6px;font-size:21px;font-weight:400;color:#f2e6cc";host.append(h);
const explanation=document.createElement("p");explanation.textContent="Completion is shown only when a course has reported a percentage. A blank record is not a zero grade.";explanation.style.margin="3px 0 12px";host.append(explanation);
const area=document.createElement("div");area.style.cssText="display:grid;gap:10px";host.append(area);
const gradeCourses={
"10":[["Mathematics","algebra-1"],["Language Arts","english-10"],["Social Studies","social-studies-10"],["Science","biology-10"],["Physical Education","physical-education-10"],["Foreign Language","world-language-10"],["Elective","elective-10"]],
"11":[["Mathematics","geometry"],["Language Arts","english-11"],["Social Studies","social-studies-11"],["Science","chemistry-11"],["Physical Education","physical-education-11"],["Foreign Language","world-language-11"],["Elective","elective-11"]],
"12":[["Mathematics","algebra-2"],["Language Arts","english-12"],["Social Studies","social-studies-12"],["Science","physics-engineering-12"],["Physical Education","physical-education-12"],["Foreign Language","world-language-12"],["Elective","elective-12"]]};
const classroom=document.getElementById("upperClasses");
const gradeNine=document.querySelector(".grade09-priority-schedule");
if(classroom)classroom.insertAdjacentElement("afterbegin",host);
else if(gradeNine)gradeNine.insertAdjacentElement("afterend",host);
else return;
function classes(){if(grade!=="09")return gradeCourses[grade]||[];
const reg=window.KhaemenesGrade09Courses;
return (reg?.pinnedCourses?.()||[]).map(c=>[String(c.title||c.name||"Class"),String(c.id||"")]).filter(c=>c[1]);}
function render(){
 area.replaceChildren();
 if(!initial||learnerId()!==initial){area.textContent="Select your learner and reload to display private class progress.";return}
 const snapshots=continuation?.readLearner?.(initial)||[];
 const rows=classes();
 if(!rows.length){area.textContent="Pin your classes to display their progress here.";return}
 rows.forEach(([name,id],idx)=>{
  const snap=snapshots.find(s=>s.courseId===id);
  const percentage=snap?.progress?.percent;
  const valid=typeof percentage==="number"&&Number.isFinite(percentage)&&percentage>=0&&percentage<=100;
  const row=document.createElement("div");row.style.cssText="display:grid;grid-template-columns:minmax(105px,190px) minmax(80px,1fr) 88px;gap:10px;align-items:center";
  const label=document.createElement("span");label.textContent=name;label.style.cssText="overflow-wrap:anywhere";
  const track=document.createElement("div");track.style.cssText="height:10px;border-radius:9px;background:#475363;overflow:hidden";
  const fill=document.createElement("div");fill.style.cssText="width:"+(valid?percentage:0)+"%;height:100%;border-radius:9px;background:"+["#7ec6b5","#cfae73","#7cadd4","#af94d5","#e5a2a2","#8ac8d6","#b7c87c"][idx%7];
  track.append(fill);track.setAttribute("role","progressbar");track.setAttribute("aria-label",name+" course completion");track.setAttribute("aria-valuemin","0");track.setAttribute("aria-valuemax","100");
  if(valid)track.setAttribute("aria-valuenow",String(percentage));else track.setAttribute("aria-valuetext","Completion not yet reported");
  const value=document.createElement("span");value.textContent=valid?Math.round(percentage)+"%":"Not reported";value.style.cssText="text-align:right;font-size:13px;color:#f5e8cc";
  row.append(label,track,value);area.append(row);
 });
}
render();
for(const name of ["khaemenes-learning-continuation-changed","khaemenes-course-pins-changed","khaemenes-student-profile-changed","focus","pageshow"])window.addEventListener(name,render);
window.addEventListener("storage",e=>{if(!e.key||e.key==="khaemenes.learning.continuation.v1"||e.key==="khaemenes_active_learner_v1")render()});
})();
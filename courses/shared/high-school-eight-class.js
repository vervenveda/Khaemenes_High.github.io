/* Khaemenes Academy High School · eight-subject plan (9–12).
 * Declarative view shared by the High School front desk, students and family.
 * Pin authority remains KhaemenesHighCoursePins; grades, placement, lesson
 * mastery and course enrollment remain with their existing owners.
 * Idempotent, no storage writes, no external dependencies or account sharing.
 */
(()=>{
"use strict";
if(window.KhaemenesHighEightClass)return;
const SUBJECTS=Object.freeze([
 ["math","Mathematics"],
 ["science","Science"],
 ["languageArts","Language Arts"],
 ["socialStudies","Social Studies"],
 ["peHealth","PE / Health"],
 ["psychology","Psychology / Life Skills"],
 ["foreignLanguage","Foreign Language"],
 ["elective","Elective"]
]);
const COURSES=Object.freeze({
 "9":Object.freeze({
  science:"integrated-science-9",languageArts:"english-9",socialStudies:"global-studies-9",
  peHealth:"physical-education-9",psychology:"psychology-101",elective:"elective-9"
 }),
 "10":Object.freeze({
  math:"algebra-1",science:"biology-10",languageArts:"english-10",
  socialStudies:"social-studies-10",peHealth:"physical-education-10",
  psychology:"life-skills-10",foreignLanguage:"world-language-10",elective:"elective-10"
 }),
 "11":Object.freeze({
  math:"geometry",science:"chemistry-11",languageArts:"english-11",
  socialStudies:"social-studies-11",peHealth:"physical-education-11",
  psychology:"life-skills-11",foreignLanguage:"world-language-11",elective:"elective-11"
 }),
 "12":Object.freeze({
  math:"algebra-2",science:"physics-engineering-12",languageArts:"english-12",
  socialStudies:"social-studies-12",peHealth:"physical-education-12",
  psychology:"life-skills-12",foreignLanguage:"world-language-12",elective:"elective-12"
 })
});
const LANGS=Object.freeze(["spanish","french","german","mandarin","japanese","arabic","russian"]);
function gradeOf(value){
 const grade=String(Number(value));
 return Object.prototype.hasOwnProperty.call(COURSES,grade)?grade:null;
}
function slots(grade,options={}){
 const key=gradeOf(grade);
 if(!key)return [];
 const base=COURSES[key];
 const math=key==="9"
  ? (["pre-algebra","algebra-1"].includes(options.mathId)?options.mathId:null)
  : (options.mathId&&["algebra-1","geometry","algebra-2"].includes(options.mathId)?options.mathId:base.math);
 const language=key==="9"
  ? (LANGS.includes(options.language)?`world-language-9-${options.language}`:null)
  : base.foreignLanguage;
 const pin=window.KhaemenesHighCoursePins;
 return SUBJECTS.map(([subject,label],index)=>{
  const id=subject==="math"?math:subject==="foreignLanguage"?language:base[subject];
  const meta=id?pin?.COURSE_META?.[id]:null;
  return Object.freeze({
   index:index+1,subject,label,id:id||null,
   title:meta?.title||(subject==="math"?"Choose mathematics pathway":subject==="foreignLanguage"?"Choose foreign language":label),
   href:meta?.href||null,
   pinAvailable:!!(id&&meta),
   resourceOnly:subject==="psychology"&&key!=="9",
   isElective:subject==="elective"
  });
 });
}
function summary(grade,pinned=[],options={}){
 const list=slots(grade,options);
 const pins=new Set(Array.isArray(pinned)?pinned:[]);
 return Object.freeze({
  grade:gradeOf(grade),total:list.length,
  count:list.filter(s=>s.id&&pins.has(s.id)).length,
  items:Object.freeze(list.map(s=>Object.freeze({...s,pinned:!!s.id&&pins.has(s.id)})))
 });
}
window.KhaemenesHighEightClass=Object.freeze({
 version:1,subjects:SUBJECTS,gradeOf,slots,summary
});
})();
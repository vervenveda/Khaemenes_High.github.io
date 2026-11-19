/* Khaemenes Academy · canonical High School mathematics course manifest v1
   Read-only topology adapter. Does not mutate learner records, mastery, or legacy course authorities. */
(()=>{"use strict";
if(window.KhaemenesMathCourseManifest)return;
const path=location.pathname.toLowerCase();
const slug=path.includes("/pre-algebra/")?"pre-algebra":path.includes("/algebra-1/")?"algebra-1":path.includes("/geometry/")?"geometry":path.includes("/algebra-2/")?"algebra-2":null;
const META={
 "pre-algebra":{code:"KH-MATH-PA",title:"Pre-Algebra",storage:null,diagnostic:"diagnostic/",weekly:"assessments/weekly-mastery.html",midterm:"assessments/midterm-units-01-07.html",final:"assessments/final-exam-36-weeks.html",unitPattern:"units/unit-{NN}/assessment/mastery-check.html"},
 "algebra-1":{code:"KH-MATH-A1",title:"Algebra I",storage:"khaemenes-algebra1-course-v1",diagnostic:"diagnostic/",weekly:"assessments/weekly-mastery.html",midterm:"assessments/midterm-units-01-06.html",final:"assessments/final-exam-36-weeks.html",unitPattern:"units/unit-{NN}/assessment/mastery-check.html"},
 "geometry":{code:"KH-MATH-GEO",title:"Geometry",storage:"khaemenes-geometry-course-v1",diagnostic:"diagnostic/",weekly:"assessments/weekly-mastery.html",midterm:"assessments/midterm.html",final:"assessments/final.html",unitPattern:"units/unit-{NN}/assessment/mastery-check.html"},
 "algebra-2":{code:"KH-MATH-A2",title:"Algebra II",storage:"khaemenes-algebra2-course-v1",diagnostic:"diagnostic/",weekly:"assessments/weekly-mastery.html",midterm:"assessments/midterm.html",final:"assessments/final.html",unitPattern:"units/unit-{NN}/assessment/mastery-check.html"}
};
const pad=n=>String(n).padStart(2,"0");
function courseRoot(){const i=path.indexOf("/courses/mathematics/");if(i<0)return new URL(location.href);const tail=path.slice(i+"/courses/mathematics/".length),name=tail.split("/")[0];return new URL(path.slice(0,i)+"/courses/mathematics/"+name+"/",location.origin)}
function source(){
 if(slug==="pre-algebra"){try{return typeof APP!=="undefined"?APP:null}catch{return null}}
 if(slug==="algebra-1")return window.ALGEBRA1_DATA||null;
 if(slug==="geometry")return window.GEOMETRY_DATA||null;
 if(slug==="algebra-2")return window.ALGEBRA2_DATA||null;
 return null;
}
function normalizeLessons(unit){const raw=unit?.lessons||[];return raw.map((x,i)=>typeof x==="string"?{id:x,number:i+1,title:x}:{id:x.id||("u"+pad(unit.number)+"-l"+pad(x.number||i+1)),number:Number(x.number||i+1),title:x.title||("Lesson "+pad(i+1)),kind:x.kind||x.family||null})}
function assessment(meta){return {diagnostic:meta.diagnostic,weekly_mastery:meta.weekly,unit_mastery:Array.from({length:13},(_,i)=>meta.unitPattern.replace("{NN}",pad(i+1))),midterm:meta.midterm,final:meta.final}}
function fromStructured(src){
 const meta=META[slug],units=(src?.units||[]).filter(u=>Number(u.number)>=1&&Number(u.number)<=13).map(u=>({number:Number(u.number),title:u.title||("Unit "+pad(u.number)),weeks:Number(u.weeks)||null,week_numbers:Array.isArray(u.week_numbers)?u.week_numbers.map(Number):[],lessons:normalizeLessons(u)}));
 const weeks=(src?.weeks||[]).map(w=>({week:Number(w.week),unit:w.unit==null?null:Number(w.unit),title:w.title||w.focus||("Week "+w.week),lesson_ids:Array.isArray(w.lesson_ids)?w.lesson_ids:[]}));
 const course=src?.course||{};
 return {schema:"khaemenes-math-course-manifest-v1",slug,code:course.code||meta.code,title:course.short_title||course.title||meta.title,duration_weeks:Number(course.duration_weeks)||36,mastery_target:Number(course.mastery_target)||80,prerequisite:course.prerequisite||null,storage_authority:course.storage_key||meta.storage,units,weeks,assessment:assessment(meta),tools:{learning_tools:"../assets/math-learning-tools-v2.js",course_shell:"../assets/math-course-shell-v1.js"},authority:{topology:"normalized-existing-authority",read_only:true}};
}
function fromPreAlgebra(app){
 const meta=META[slug],weekRows=Array.isArray(app?.weeks)?app.weeks:[],unitMap=new Map();
 for(const w of weekRows){const n=Number(w.unitNumber);if(n<1||n>13)continue;if(!unitMap.has(n))unitMap.set(n,{number:n,title:w.unitTitle||("Unit "+pad(n)),weeks:0,week_numbers:[],lessons:[]});const u=unitMap.get(n);u.weeks++;u.week_numbers.push(Number(w.week));}
 return {schema:"khaemenes-math-course-manifest-v1",slug,code:app?.code||meta.code,title:app?.title||meta.title,duration_weeks:36,mastery_target:Number(app?.passingTarget)||80,prerequisite:"Readiness diagnostic / Unit 00 support when assigned",storage_authority:"existing Pre-Algebra learner record authorities",units:Array.from(unitMap.values()).sort((a,b)=>a.number-b.number),weeks:weekRows.map(w=>({week:Number(w.week),unit:Number(w.unitNumber)||null,title:w.title||("Week "+w.week),path:w.path||null})),assessment:assessment(meta),tools:{learning_tools:"../assets/math-learning-tools-v2.js",course_shell:"../assets/math-course-shell-v1.js"},authority:{topology:"normalized-existing-authority",read_only:true}};
}
function build(){if(!slug)return null;const src=source();return slug==="pre-algebra"?fromPreAlgebra(src):fromStructured(src)}
const manifest=build();
window.KhaemenesMathCourseManifest={schema:"khaemenes-math-course-manifest-v1",slug,get:()=>manifest,courseRoot,assessment:name=>manifest?.assessment?.[name]||null};
if(manifest)window.dispatchEvent(new CustomEvent("khaemenes-math-course-manifest",{detail:manifest}));
})();
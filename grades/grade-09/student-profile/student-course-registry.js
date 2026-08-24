(()=>{
"use strict";

const PIN_KEY="khaemenes-high-pinned-courses-v2";
const MATH_PATHWAY_KEY="khaemenes-high-math-pathway-v1";
const PREALGEBRA_CONTINUE_KEY="khaemenes-grade09-last-open-v1";
const LAST_LAUNCH_KEY="khaemenes-grade09-course-launches-v1";
const A1_DIAGNOSTIC_RESULT_KEY="khaemenes-algebra1-diagnostic-result-v1";
const A1_WEEKLY_KEY="khaemenes-algebra1-weekly-mastery-v2";
const A1_MIDTERM_KEY="khaemenes-algebra1-midterm-result-v1";
const A1_FINAL_KEY="khaemenes-algebra1-final-result-v1";
const A1_HOME="/Khaemenes_High.github.io/courses/mathematics/algebra-1/";
const A1_DIAGNOSTIC=`${A1_HOME}diagnostic/`;
const MASTERY=80;
const MATH_IDS=Object.freeze(["pre-algebra","algebra-1"]);
const MATH_ID_SET=new Set(MATH_IDS);

const COURSES=Object.freeze([
  Object.freeze({
    id:"pre-algebra",
    title:"Pre-Algebra",
    subject:"Mathematics",
    short:"Pre-Algebra",
    className:"math",
    home:"/Khaemenes_High.github.io/courses/mathematics/pre-algebra/",
    defaultContinue:"/Khaemenes_High.github.io/courses/mathematics/pre-algebra/",
    prefix:"/Khaemenes_High.github.io/courses/mathematics/pre-algebra/",
    mentorSubject:"mathematics",
    placementBased:true
  }),
  Object.freeze({
    id:"algebra-1",
    title:"Algebra I",
    subject:"Mathematics",
    short:"Algebra I",
    className:"math",
    home:A1_HOME,
    defaultContinue:A1_DIAGNOSTIC,
    prefix:A1_HOME,
    mentorSubject:"mathematics",
    placementBased:true
  }),
  Object.freeze({
    id:"english-9",
    title:"English 9",
    subject:"Language Arts",
    short:"English",
    className:"ela",
    home:"/Khaemenes_High.github.io/courses/language-arts/english-9/",
    defaultContinue:"/Khaemenes_High.github.io/courses/language-arts/english-9/",
    prefix:"/Khaemenes_High.github.io/courses/language-arts/english-9/",
    mentorSubject:"language-arts"
  }),
  Object.freeze({
    id:"integrated-science-9",
    title:"Integrated Science 9",
    subject:"Science",
    short:"Science",
    className:"science",
    home:"/Khaemenes_High.github.io/courses/science/integrated-science-9/",
    defaultContinue:"/Khaemenes_High.github.io/courses/science/integrated-science-9/",
    prefix:"/Khaemenes_High.github.io/courses/science/integrated-science-9/",
    mentorSubject:"science"
  }),
  Object.freeze({
    id:"global-studies-9",
    title:"Global Studies Honors",
    subject:"Social Studies",
    short:"Social Studies",
    className:"social",
    home:"/Khaemenes_High.github.io/courses/social-studies/grade-09/",
    defaultContinue:"/Khaemenes_High.github.io/courses/social-studies/grade-09/",
    prefix:"/Khaemenes_High.github.io/courses/social-studies/grade-09/",
    mentorSubject:"social-studies"
  })
]);

const COURSE_MAP=new Map(COURSES.map(course=>[course.id,course]));
const readJSON=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
const writeJSON=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
const numeric=value=>{if(value===null||value===undefined||value==="")return null;const n=Number(value);return Number.isFinite(n)?n:null};
const pad=n=>String(Number(n)).padStart(2,"0");
const lessonId=(u,l)=>`u${pad(u)}-l${pad(l)}`;
const a1DedicatedKey=n=>`khaemenes-algebra1-unit${pad(n)}-a3-v1`;
const a1SharedKey=n=>`khaemenes-algebra1-unit${pad(n)}-progress-v1`;

const A1_WEEK_LESSONS=Object.freeze({
  2:[[1,1],[1,2],[1,3]],3:[[1,4],[1,5],[1,6]],
  4:[[2,1],[2,2]],5:[[2,3],[2,4],[2,5]],6:[[2,6],[2,7]],
  7:[[3,1],[3,2]],8:[[3,3],[3,4],[3,5]],9:[[3,6],[3,7]],
  10:[[4,1],[4,2],[4,3]],11:[[4,4],[4,5],[4,6]],
  12:[[5,1],[5,2]],13:[[5,3],[5,4],[5,5]],14:[[5,6],[5,7]],
  15:[[6,1],[6,2]],16:[[6,3],[6,4]],17:[[6,5],[6,6]],18:[[6,7],[6,8]],
  19:[[7,1],[7,2],[7,3]],20:[[7,4],[7,5]],21:[[7,6],[7,7]],
  22:[[8,1],[8,2],[8,3]],23:[[8,4],[8,5],[8,6]],
  24:[[9,1],[9,2],[9,3]],25:[[9,4],[9,5]],26:[[9,6],[9,7]],
  27:[[10,1],[10,2]],28:[[10,3],[10,4]],29:[[10,5],[10,6]],30:[[10,7],[10,8]],
  31:[[11,1],[11,2],[11,3]],32:[[11,4],[11,5],[11,6]],
  33:[[12,1],[12,2],[12,3]],34:[[12,4],[12,5]],35:[[12,6],[12,7]],
  36:[[13,1],[13,2],[13,3],[13,4],[13,5]]
});
const A1_UNIT_END_WEEK=Object.freeze({1:3,2:6,3:9,4:11,5:14,6:18,7:21,8:23,9:26,10:30,11:32,12:35,13:36});
let a1UnitMapsPromise=null;

function rawPins(value=readJSON(PIN_KEY,[])){
  const source=Array.isArray(value)?value:[];
  const seen=new Set();
  return source.filter(id=>COURSE_MAP.has(id)&&!seen.has(id)&&seen.add(id));
}
function hasDiagnosticEvidence(){
  const result=readJSON(A1_DIAGNOSTIC_RESULT_KEY,null);
  if(!result)return false;
  if(Array.isArray(result.attempt_history)&&result.attempt_history.length)return true;
  if(result.lastResult)return true;
  return [result.percent,result.bestScore,result.bestSelectedScore].some(value=>numeric(value)!==null);
}
function a1UnitRecords(unit){return {dedicated:readJSON(a1DedicatedKey(unit),null),shared:readJSON(a1SharedKey(unit),null)}}
function a1LessonMastered(unit,lesson){
  const records=a1UnitRecords(unit),scores=[];
  const dedicated=numeric(records.dedicated?.best?.[`lesson-${Number(lesson)}`]);
  if(dedicated!==null)scores.push(dedicated);
  const id=lessonId(unit,lesson),shared=numeric(records.shared?.scores?.[id]);
  if(shared!==null)scores.push(shared);
  if(Array.isArray(records.shared?.completed)&&records.shared.completed.includes(id)&&shared===null)scores.push(MASTERY);
  return scores.some(score=>score>=MASTERY);
}
function a1UnitMastered(unit){
  const records=a1UnitRecords(unit),scores=[];
  const dedicated=numeric(records.dedicated?.best?.mastery);
  if(dedicated!==null)scores.push(dedicated);
  const shared=numeric(records.shared?.scores?.mastery);
  if(shared!==null)scores.push(shared);
  if(Array.isArray(records.shared?.completed)&&records.shared.completed.includes("mastery")&&shared===null)scores.push(MASTERY);
  return scores.some(score=>score>=MASTERY);
}
function a1WeekMastered(week){
  const store=readJSON(A1_WEEKLY_KEY,{weeks:{}}),record=store?.weeks?.[week]||store?.weeks?.[String(week)]||null,best=numeric(record?.best);
  return (best!==null&&best>=MASTERY)||(Array.isArray(record?.attempts)&&record.attempts.some(attempt=>attempt?.mastery_met===true));
}
function a1CumulativeMastered(key){
  const record=readJSON(key,null),attempts=Array.isArray(record?.attempt_history)?record.attempt_history:[];
  if(attempts.some(attempt=>attempt?.mastery===true&&!attempt?.legacy_selected_only&&attempt?.constructed_response?.review_complete===true))return true;
  return record?.mastery===true&&numeric(record?.bestOverallScore)>=MASTERY;
}
function hasAlgebraCourseEvidence(){
  for(let unit=1;unit<=13;unit++){
    const records=a1UnitRecords(unit);
    if(records.dedicated||records.shared)return true;
  }
  const weekly=readJSON(A1_WEEKLY_KEY,null);
  if(weekly&&weekly.weeks&&Object.keys(weekly.weeks).length)return true;
  return !!readJSON(A1_MIDTERM_KEY,null)||!!readJSON(A1_FINAL_KEY,null);
}
function hasPreAlgebraCourseEvidence(){
  const last=readJSON(PREALGEBRA_CONTINUE_KEY,null);
  return !!(last&&(last.course==="pre-algebra"||last.course==="prealgebra")&&last.url);
}
function explicitMathPathway(){const value=readJSON(MATH_PATHWAY_KEY,null);return MATH_ID_SET.has(value)?value:null}
function mathPathway(pinSource=rawPins()){
  if(hasAlgebraCourseEvidence())return "algebra-1";
  const explicit=explicitMathPathway();
  if(explicit==="algebra-1")return explicit;
  if(hasDiagnosticEvidence())return "algebra-1";
  if(explicit==="pre-algebra")return explicit;
  if(hasPreAlgebraCourseEvidence())return "pre-algebra";
  const mathPins=pinSource.filter(id=>MATH_ID_SET.has(id));
  return mathPins.length===1?mathPins[0]:null;
}
function normalizePins(value=readJSON(PIN_KEY,[])){
  const source=rawPins(value),mathPins=source.filter(id=>MATH_ID_SET.has(id));
  if(mathPins.length<2)return source;
  const chosen=mathPathway(source)||mathPins[0];
  return source.filter(id=>!MATH_ID_SET.has(id)||id===chosen);
}
function pinnedIds(){
  const original=rawPins(),normalized=normalizePins(original);
  if(original.join("|")!==normalized.join("|"))writeJSON(PIN_KEY,normalized);
  return normalized;
}
function pinnedCourses(){return pinnedIds().map(id=>COURSE_MAP.get(id)).filter(Boolean)}
function isPinned(id){return pinnedIds().includes(id)}
function isMathCourse(id){return MATH_ID_SET.has(id)}
function setMathPathway(id,{pin=true}={}){
  if(!MATH_ID_SET.has(id))return false;
  if(!writeJSON(MATH_PATHWAY_KEY,id))return false;
  if(!pin)return true;
  const next=[id,...pinnedIds().filter(item=>!MATH_ID_SET.has(item))];
  return writeJSON(PIN_KEY,next);
}
function setPinned(id,shouldPin){
  if(!COURSE_MAP.has(id))return false;
  if(shouldPin&&MATH_ID_SET.has(id))return setMathPathway(id,{pin:true});
  const current=pinnedIds().filter(item=>item!==id),next=shouldPin?[id,...current]:current;
  return writeJSON(PIN_KEY,next);
}
function togglePinned(id){const next=!isPinned(id);return setPinned(id,next)?next:null}

function safeCourseURL(course,value){return typeof value==="string"&&value.startsWith(course.prefix)?value:course.defaultContinue}
function genericContinue(course){
  const launches=readJSON(LAST_LAUNCH_KEY,{}),last=launches&&typeof launches==="object"?launches[course.id]:null,url=safeCourseURL(course,last?.url||course.defaultContinue);
  return {url,label:last?.title?String(last.title):course.title,hasSpecificLocation:Boolean(last&&last.url&&last.url!==course.home),actionLabel:`Open ${course.short}`,detail:`${course.subject} · ready to open`};
}
function continueFor(id){
  const course=COURSE_MAP.get(id);
  if(!course)return null;
  if(id==="pre-algebra"){
    const last=readJSON(PREALGEBRA_CONTINUE_KEY,null);
    if(last&&(last.course==="pre-algebra"||last.course==="prealgebra")&&last.url){
      return {url:safeCourseURL(course,last.url),label:last.title?String(last.title):course.title,hasSpecificLocation:true,actionLabel:"Continue Pre-Algebra",detail:`Continue: ${last.title?String(last.title):"current Pre-Algebra lesson"}`};
    }
    return {url:course.home,label:course.title,hasSpecificLocation:false,actionLabel:"Open Pre-Algebra",detail:"Open the Pre-Algebra course home to begin or resume from its mastery pathway."};
  }
  if(id==="algebra-1"){
    if(!hasDiagnosticEvidence()&&!hasAlgebraCourseEvidence())return {url:A1_DIAGNOSTIC,label:"Algebra I Readiness Diagnostic",hasSpecificLocation:true,actionLabel:"Begin Algebra I Readiness",detail:"Week 1 readiness comes before Unit 01."};
    const launches=readJSON(LAST_LAUNCH_KEY,{}),last=launches&&typeof launches==="object"?launches[id]:null;
    if(last?.url&&last.url.startsWith(A1_HOME)&&!last.url.includes("/diagnostic/"))return {url:safeCourseURL(course,last.url),label:last.title?String(last.title):course.title,hasSpecificLocation:true,actionLabel:"Continue Algebra I",detail:`Return to ${last.title?String(last.title):"your last Algebra I location"}.`};
    return {url:A1_HOME,label:course.title,hasSpecificLocation:false,actionLabel:"Open Algebra I",detail:"Readiness evidence is present. Open Algebra I to continue."};
  }
  return genericContinue(course);
}

async function loadA1UnitMaps(){
  if(a1UnitMapsPromise)return a1UnitMapsPromise;
  a1UnitMapsPromise=Promise.all(Array.from({length:13},(_,index)=>{
    const unit=index+1,url=`${A1_HOME}units/unit-${pad(unit)}/unit-map.json`;
    return fetch(url,{credentials:"same-origin"}).then(response=>{if(!response.ok)throw new Error(`Unit ${unit} map ${response.status}`);return response.json()});
  })).then(maps=>new Map(maps.map(map=>[Number(map.unit),map]))).catch(()=>null);
  return a1UnitMapsPromise;
}
function lessonURLFromMap(map,lesson){
  const entry=Array.isArray(map?.lessons)?map.lessons.find(item=>Number(item.number)===Number(lesson)):null;
  return entry?.file?`${A1_HOME}units/unit-${pad(map.unit)}/${entry.file}`:null;
}
function unitMasteryURLFromMap(map){return map?.mastery?`${A1_HOME}units/unit-${pad(map.unit)}/${map.mastery}`:`${A1_HOME}units/unit-${pad(map?.unit||1)}/`}
async function resolveAlgebraNext(){
  if(!hasDiagnosticEvidence()&&!hasAlgebraCourseEvidence())return continueFor("algebra-1");
  const maps=await loadA1UnitMaps();
  if(!maps)return continueFor("algebra-1");
  for(let week=2;week<=36;week++){
    const refs=A1_WEEK_LESSONS[week]||[];
    for(const [unit,lesson] of refs){
      if(!a1LessonMastered(unit,lesson)){
        const map=maps.get(unit),url=lessonURLFromMap(map,lesson)||`${A1_HOME}units/unit-${pad(unit)}/`;
        const title=map?.lessons?.find(item=>Number(item.number)===Number(lesson))?.title||`Unit ${pad(unit)} · Lesson ${pad(lesson)}`;
        return {url,label:title,hasSpecificLocation:true,actionLabel:`Continue Algebra I · Week ${week}`,detail:`Next required lesson: ${title}`};
      }
    }
    if(!a1WeekMastered(week))return {url:`${A1_HOME}assessments/weekly-mastery.html?week=${week}`,label:`Week ${week} Mastery`,hasSpecificLocation:true,actionLabel:`Take Week ${week} Mastery`,detail:`Week ${week} lessons are mastered. The weekly 80% check is next.`};
    const unit=refs[0]?.[0];
    if(unit&&A1_UNIT_END_WEEK[unit]===week&&!a1UnitMastered(unit)){
      const map=maps.get(unit);
      return {url:unitMasteryURLFromMap(map),label:`Unit ${pad(unit)} Mastery`,hasSpecificLocation:true,actionLabel:`Take Unit ${pad(unit)} Mastery`,detail:`Unit ${pad(unit)} lessons and weekly work are complete. The unit mastery check is next.`};
    }
    if(unit===6&&week===18&&!a1CumulativeMastered(A1_MIDTERM_KEY))return {url:`${A1_HOME}assessments/midterm-units-01-06.html`,label:"Algebra I Midterm",hasSpecificLocation:true,actionLabel:"Take Algebra I Midterm",detail:"Units 01–06 are complete. The reviewed cumulative Midterm is next."};
  }
  if(!a1CumulativeMastered(A1_FINAL_KEY))return {url:`${A1_HOME}assessments/final-exam-36-weeks.html`,label:"Algebra I Final",hasSpecificLocation:true,actionLabel:"Open Algebra I Final",detail:"The instructional pathway is complete. Open the cumulative Final requirements."};
  return {url:A1_HOME,label:"Algebra I",hasSpecificLocation:false,actionLabel:"Review Algebra I Record",detail:"All detected Algebra I mastery gates are complete. Open the course record and completion pathway."};
}
async function resolveContinueFor(id){return id==="algebra-1"?resolveAlgebraNext():continueFor(id)}

function recordLaunch(id,url,title){
  const course=COURSE_MAP.get(id);
  if(!course)return false;
  if(MATH_ID_SET.has(id))writeJSON(MATH_PATHWAY_KEY,id);
  const launches=readJSON(LAST_LAUNCH_KEY,{}),next=launches&&typeof launches==="object"?launches:{};
  next[id]={url:safeCourseURL(course,url||course.home),title:title||course.title,at:new Date().toISOString()};
  return writeJSON(LAST_LAUNCH_KEY,next);
}
function mentorFor(id,source=location.pathname){
  const course=COURSE_MAP.get(id),params=new URLSearchParams({stage:"high",subject:course?.mentorSubject||"general",course:course?.id||"grade-09",source});
  return `/Khaemenes_High.github.io/mentor/?${params.toString()}`;
}
function getCourse(id){return COURSE_MAP.get(id)||null}
function shouldRefreshForStorageKey(key){
  if(!key)return true;
  if([PIN_KEY,MATH_PATHWAY_KEY,PREALGEBRA_CONTINUE_KEY,LAST_LAUNCH_KEY,A1_DIAGNOSTIC_RESULT_KEY,A1_WEEKLY_KEY,A1_MIDTERM_KEY,A1_FINAL_KEY].includes(key))return true;
  return /^khaemenes-algebra1-unit\d{2}-(?:a3|progress)-v1$/.test(key);
}

window.KhaemenesGrade09Courses=Object.freeze({
  PIN_KEY,MATH_PATHWAY_KEY,PREALGEBRA_CONTINUE_KEY,LAST_LAUNCH_KEY,A1_DIAGNOSTIC_RESULT_KEY,A1_WEEKLY_KEY,A1_MIDTERM_KEY,A1_FINAL_KEY,
  courses:COURSES,getCourse,pinnedIds,pinnedCourses,isPinned,isMathCourse,setPinned,togglePinned,setMathPathway,mathPathway,continueFor,resolveContinueFor,recordLaunch,mentorFor,shouldRefreshForStorageKey
});
})();

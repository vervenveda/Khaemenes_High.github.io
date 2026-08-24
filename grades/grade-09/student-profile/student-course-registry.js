(()=>{
"use strict";

const PIN_KEY="khaemenes-high-pinned-courses-v2";
const PREALGEBRA_CONTINUE_KEY="khaemenes-grade09-last-open-v1";
const LAST_LAUNCH_KEY="khaemenes-grade09-course-launches-v1";

const COURSES=Object.freeze([
  Object.freeze({
    id:"pre-algebra",
    title:"Pre-Algebra",
    subject:"Mathematics",
    short:"Math",
    className:"math",
    home:"/Khaemenes_High.github.io/courses/mathematics/pre-algebra/",
    defaultContinue:"/Khaemenes_High.github.io/courses/mathematics/pre-algebra/units/unit-01/lessons/lesson-01-number-systems.html",
    prefix:"/Khaemenes_High.github.io/courses/mathematics/pre-algebra/",
    mentorSubject:"mathematics"
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

function normalizePins(value=readJSON(PIN_KEY,[])){
  const source=Array.isArray(value)?value:[];
  const seen=new Set();
  return source.filter(id=>COURSE_MAP.has(id)&&!seen.has(id)&&seen.add(id));
}
function pinnedIds(){return normalizePins()}
function pinnedCourses(){return pinnedIds().map(id=>COURSE_MAP.get(id)).filter(Boolean)}
function isPinned(id){return pinnedIds().includes(id)}
function setPinned(id,shouldPin){
  if(!COURSE_MAP.has(id))return false;
  const current=pinnedIds().filter(item=>item!==id);
  const next=shouldPin?[id,...current]:current;
  return writeJSON(PIN_KEY,next);
}
function togglePinned(id){const next=!isPinned(id);return setPinned(id,next)?next:null}

function safeCourseURL(course,value){
  return typeof value==="string"&&value.startsWith(course.prefix)?value:course.defaultContinue;
}
function continueFor(id){
  const course=COURSE_MAP.get(id);
  if(!course)return null;
  if(id==="pre-algebra"){
    const last=readJSON(PREALGEBRA_CONTINUE_KEY,null);
    if(last&&(last.course==="pre-algebra"||last.course==="prealgebra")){
      return {
        url:safeCourseURL(course,last.url),
        label:last.title?String(last.title):course.title,
        hasSpecificLocation:true
      };
    }
  }
  const launches=readJSON(LAST_LAUNCH_KEY,{});
  const last=launches&&typeof launches==="object"?launches[id]:null;
  return {
    url:safeCourseURL(course,last?.url||course.defaultContinue),
    label:last?.title?String(last.title):course.title,
    hasSpecificLocation:Boolean(last&&last.url&&last.url!==course.home)
  };
}
function recordLaunch(id,url,title){
  const course=COURSE_MAP.get(id);
  if(!course)return false;
  const launches=readJSON(LAST_LAUNCH_KEY,{});
  const next=launches&&typeof launches==="object"?launches:{};
  next[id]={url:safeCourseURL(course,url||course.home),title:title||course.title,at:new Date().toISOString()};
  return writeJSON(LAST_LAUNCH_KEY,next);
}
function mentorFor(id,source=location.pathname){
  const course=COURSE_MAP.get(id);
  const params=new URLSearchParams({
    stage:"high",
    subject:course?.mentorSubject||"general",
    course:course?.id||"grade-09",
    source
  });
  return `/Khaemenes_High.github.io/mentor/?${params.toString()}`;
}
function getCourse(id){return COURSE_MAP.get(id)||null}

window.KhaemenesGrade09Courses=Object.freeze({
  PIN_KEY,
  PREALGEBRA_CONTINUE_KEY,
  LAST_LAUNCH_KEY,
  courses:COURSES,
  getCourse,
  pinnedIds,
  pinnedCourses,
  isPinned,
  setPinned,
  togglePinned,
  continueFor,
  recordLaunch,
  mentorFor
});
})();

/* Khaemenes High School · shared read-only course catalogue.
 * Catalogue listings are descriptive, NOT enrollment, placement or grade gates.
 * Course routes are sourced from the Academy repository's real entry pages.
 * Planned elective gateways are explicitly labelled under construction.
 * No learner state reads or writes; never changes checkpoint/assessment owners.
 */
(()=>{"use strict";
const grade=Number(document.body?.dataset.grade||(/\/grade-(09|10|11|12)\/student-profile\//.exec(location.pathname)||[])[1]);
if(![9,10,11,12].includes(grade)||window.KhaemenesHighCourseCatalogue)return;
const root="https://vervenveda.com/Khaemenes_High.github.io/";
const courses=[
["Mathematics","Pre-Algebra","9–10","Number sense, expressions, equations, ratios, graphs and readiness for Algebra I.","courses/mathematics/pre-algebra/","Course"],
["Mathematics","Algebra I","9–10","Linear equations, functions, inequalities and mathematical modelling.","courses/mathematics/algebra-1/","Course"],
["Mathematics","Geometry","9–11","Geometric reasoning, transformations, constructions, proofs and measurement.","courses/mathematics/geometry/","Course"],
["Mathematics","Algebra II","10–12","Advanced functions, equations, polynomials, exponentials and logarithms.","courses/mathematics/algebra-2/","Course"],
["Mathematics","Precalculus & Trigonometry","11–12","Trigonometric functions, advanced algebra and preparation for calculus.","courses/mathematics/precalculus-trigonometry/","Course"],
["Mathematics","Calculus I","11–12","Limits, derivatives, integrals and applications of change.","courses/mathematics/calculus-1/","Course"],
["Language Arts","English 9","9","Reading, writing, literary interpretation and evidence-based expression.","courses/language-arts/english-9/","Course"],
["Language Arts","English 10","10","Literary analysis, composition, argument and research.","courses/language-arts/english-10/","Course"],
["Language Arts","English 11","11","Advanced reading, rhetoric, inquiry and analytical writing.","courses/language-arts/english-11/","Course"],
["Language Arts","English 12","12","Senior-level literature, composition, research and independent interpretation.","courses/language-arts/english-12/","Course"],
["Science","Integrated Science 9","9","Scientific inquiry, evidence, measurement and foundational physical and life sciences.","courses/science/integrated-science-9/","Course"],
["Science","Biology 10","10","Living systems, cells, genetics, ecology and investigations.","courses/science/biology-10/","Course"],
["Science","Chemistry 11","11","Matter, reactions, quantitative reasoning and laboratory investigations.","courses/science/chemistry-11/","Course"],
["Science","Physics & Engineering 12","12","Motion, energy, engineering design and experimental problem-solving.","courses/science/physics-engineering-12/","Course"],
["Social Studies","Global Studies Honors 9","9","Geography, civilizations, global history and source-based reasoning.","courses/social-studies/grade-09/","Course"],
["Social Studies","Social Studies 10","10","Historical and civic inquiry with evidence and critical analysis.","courses/social-studies/grade-10/","Course"],
["Social Studies","Social Studies 11","11","Advanced civic, historical and social inquiry; includes personal-finance resources.","courses/social-studies/grade-11/","Course"],
["Social Studies","Global Politics & Senior Research 12","12","International relations, political inquiry, thesis research and oral defense.","courses/social-studies/grade-12/","Course"],
["Health & Life Skills","Physical Education","9–12","Fitness, movement, personal health and lifelong physical wellbeing.","courses/physical-education/","Course"],
["Health & Life Skills","Psychology 101","9–12","Introduction to psychological science, ethics, evidence and human behaviour; offered in the Grade 09 learning campus.","electives/grades/grade-09/psych-101/","Course"],
["Electives & Special Studies","Fine Arts & Visual Studio","9–12","Planned study of drawing, painting, visual storytelling, design and portfolios.","courses/electives/fine-arts-visual-studio/","Under construction"],
["Electives & Special Studies","Music & Music Theory","9–12","Planned music literacy, theory, composition, performance and listening.","courses/electives/music-music-theory/","Under construction"],
["Electives & Special Studies","Computing & Digital Technology","9–12","Planned programming, web creation, digital literacy and responsible technology.","courses/electives/computing-digital-technology/","Under construction"],
["Electives & Special Studies","Career & Professional Studies","9–12","Planned career exploration, workplace communication, portfolios and entrepreneurship.","courses/electives/career-professional-studies/","Under construction"],
["Electives & Special Studies","Health, Wellness & Human Development","9–12","Planned health literacy, wellbeing, safety and human development.","courses/electives/health-wellness-human-development/","Under construction"],
["Electives & Special Studies","World Languages & Linguistics","9–12","Planned language study, culture, communication, translation and comparative linguistics.","courses/electives/world-languages-linguistics/","Under construction"]
];
const categories=[...new Set(courses.map(c=>c[0]))];
const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
const host=node("details","khae-course-catalogue");
host.id="khaeHighSchoolCourseCatalogue";
const summary=node("summary","khae-course-catalogue-summary");
summary.append(node("span","khae-course-catalogue-eyebrow","Khaemenes Academy · High School"),node("span","khae-course-catalogue-title","Course Catalogue"),node("span","khae-course-catalogue-subtitle","Explore subjects, course descriptions, grade-level guidance and electives."));
host.append(summary);
const body=node("div","khae-course-catalogue-body");
const note=node("p","khae-course-catalogue-note","Recommended grade levels are guidance only. Placement, readiness, enrollment, course mastery and learner records remain under their existing Academy rules. Planned electives are marked clearly.");
const controls=node("div","khae-course-catalogue-controls");
const filter=node("select","khae-course-catalogue-select");
filter.setAttribute("aria-label","Filter courses by subject");
for(const name of ["All subjects",...categories]){const option=node("option","",name);option.value=name;filter.append(option);}
const search=node("input","khae-course-catalogue-search");
search.type="search";search.placeholder="Find a course or topic";search.setAttribute("aria-label","Search high school courses");
const count=node("p","khae-course-catalogue-count");
const grid=node("div","khae-course-catalogue-grid");
controls.append(filter,search);
body.append(note,controls,count,grid);
host.append(body);
function render(){
 grid.replaceChildren();
 const term=search.value.trim().toLowerCase();
 const selected=filter.value;
 const matches=courses.filter(row=>(selected==="All subjects"||row[0]===selected)&&(!term||row.join(" ").toLowerCase().includes(term)));
 count.textContent=matches.length+" of "+courses.length+" catalogue listings";
 for(const [subject,title,grades,description,route,status] of matches){
  const card=node("article","khae-course-catalogue-card");
  const over=node("p","khae-course-catalogue-card-subject",subject);
  const h=node("h3","",title);
  const level=node("p","khae-course-catalogue-card-level","Suggested grades: "+grades);
  const p=node("p","khae-course-catalogue-card-description",description);
  const state=node("p","khae-course-catalogue-card-status",status==="Course"?"Course doorway":"Elective · under construction");
  const a=node("a","khae-course-catalogue-link",status==="Course"?"Explore course":"View planned elective");
  a.href=root+route;
  card.append(over,h,level,p,state,a);
  grid.append(card);
 }
}
search.addEventListener("input",render);
filter.addEventListener("change",render);
render();
let observer=null;
function place(){
 const main=document.querySelector("main");
 if(!main)return false;
 const explore=main.querySelector("#grade09Explore");
 const checkpoint=document.getElementById("khaeCheckpointsDisclosure")||document.getElementById("grade10CheckpointsDisclosure");
 if(checkpoint?.parentElement===main){
  if(host.nextElementSibling!==checkpoint)checkpoint.insertAdjacentElement("beforebegin",host);
  return true;
 }
 if(explore){
  if(explore.nextElementSibling!==host)explore.insertAdjacentElement("afterend",host);
  return true;
 }
 return false;
}
function mount(){
 if(place()&&observer){observer.disconnect();observer=null;}
 else if(!observer){
  observer=new MutationObserver(()=>{if(place()){observer.disconnect();observer=null;}});
  observer.observe(document.body,{childList:true,subtree:true});
 }
}
mount();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
window.addEventListener("pageshow",place);
window.KhaemenesHighCourseCatalogue=Object.freeze({version:"1.0.0",count:courses.length,place});
})();

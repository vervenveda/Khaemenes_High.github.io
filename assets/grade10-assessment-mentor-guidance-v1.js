/* Grade 10 assessment mentorship pilot v1.0.0.
 * Presentation-only, idempotent, no persistent state, no grade changes.
 * The course-owned assessment and learner-record engines remain authoritative
 * for their own scoped operations; neither mentor can grant mastery.
 */
(()=>{
"use strict";
const SCRIPT=document.currentScript;
const CONFIG={
 "geometry":{name:"Geometry",prep:"Use the readiness diagnostic to identify prerequisite algebraic reasoning, spatial vocabulary, and proof skills.",review:"Study definitions, diagrams, justifications, and independent proof examples without using protected exam content.",method:"The Geometry course determines its own required mastery checks, reasoning rubrics, and eligible next lesson. Readiness is not a transcript grade."},
 "english-10":{name:"English 10",prep:"Readiness identifies useful reading, research, argument, and language skills before the course assessment sequence.",review:"Revisit the weakest rubric criteria; essays, speeches, research, and complex reasoning need authorized human evaluation.",method:"The course specifies an 80% mastery target, and activity completion alone does not authorize written-performance mastery."},
 "biology-10":{name:"Biology 10",prep:"Review scientific practices, measurement, evidence, and laboratory safety before the next assessment.",review:"Use novel biology examples to improve claims, evidence, reasoning, data interpretation, and lab documentation.",method:"Biology 10 uses its course-owned 80% mastery floor. Lab and written evidence receive appropriate evaluation before official credit."},
 "social-studies-10":{name:"United States History 10",prep:"Check the published exam scope, preparation materials, and allowed conditions before beginning an assessment.",review:"Practice historical source analysis, chronology, constitutional reasoning, and evidence-based argument with fresh examples.",method:"United States History examinations retain their own scoring, written-response review, and correction requirements."}
};
function start(){
 if(document.getElementById("kaGrade10AssessmentMentors"))return;
 const id=SCRIPT?.dataset?.assessmentSubject, cfg=CONFIG[id];
 if(!cfg)return;
 const main=document.querySelector("main");
 if(!main)return;
 const hero=main.querySelector(":scope > section.hero,:scope > section.unit-hero,:scope > .hero,:scope > .unit-hero")
   ||main.querySelector("section.hero,section.unit-hero")
   ||document.querySelector("body > section.hero");
 if(!hero)return; // Never inject into an active question form.
 const section=document.createElement("section");
 section.id="kaGrade10AssessmentMentors";
 section.className="ka-grade10-assessment-mentors";
 section.setAttribute("aria-labelledby","ka-grade10-mentor-title");
 const title=document.createElement("h2");
 title.id="ka-grade10-mentor-title";title.textContent="Assessment Guidance · "+cfg.name;
 const intro=document.createElement("p");
 intro.className="ka-g10-intro";intro.textContent="NAIB coordinates public assessment directions; Archaemenes supports understanding. The assessment engine and authorized evaluator determine scoring and progression.";
 const grid=document.createElement("div");grid.className="ka-g10-mentor-grid";
 function card(name,role,description,url,label){
  const article=document.createElement("article");article.className="ka-g10-mentor-card";
  const h=document.createElement("h3");h.textContent=name;
  const small=document.createElement("p");small.className="ka-g10-role";small.textContent=role;
  const p=document.createElement("p");p.textContent=description;
  const a=document.createElement("a");a.href=url;a.textContent=label;a.setAttribute("aria-label",label+" — "+name);
  article.append(h,small,p,a);return article;
 }
 const academy="https://vervenveda.com/Khaemenes_High.github.io/";
 const mentor=academy+"mentor/?subject="+encodeURIComponent(id)+"&grade=10";
 grid.append(
  card("NAIB","Assessment administration and navigation",cfg.prep,
       "https://artist1970.github.io/NAIB.github.io/#naib-chat","Ask NAIB about the pathway"),
  card("Archaemenes","Instruction and guided corrections",cfg.review,
       mentor,"Ask Archaemenes to help me study")
 );
 const policy=document.createElement("p");policy.className="ka-g10-policy";
 policy.textContent=cfg.method+" Public mentor chats do not access protected questions, official grades, private records, or permission changes.";
 section.append(title,intro,grid,policy);
 const css=document.createElement("style");
 css.id="kaGrade10AssessmentMentorStyles";
 css.textContent=`
 #kaGrade10AssessmentMentors{box-sizing:border-box;max-width:1100px;width:calc(100% - 28px);margin:24px auto 30px;padding:24px;background:#f6f0e4;color:#243038;border:1px solid #bdaa88;border-radius:7px;font:400 16px/1.6 Nunito,"Brandon Grotesque",Arial,sans-serif;scroll-margin-top:96px}
 #kaGrade10AssessmentMentors *{box-sizing:border-box}
 #kaGrade10AssessmentMentors h2{font:400 clamp(24px,3vw,33px)/1.3 Cinzel,Georgia,serif;text-align:center;margin:0 0 10px;color:#243038}
 #kaGrade10AssessmentMentors .ka-g10-intro{max-width:780px;margin:0 auto 20px;text-align:center;font-size:16px;color:#243038}
 #kaGrade10AssessmentMentors .ka-g10-mentor-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
 #kaGrade10AssessmentMentors .ka-g10-mentor-card{display:flex;flex-direction:column;min-width:0;border:1px solid #bdaa88;border-radius:7px;background:#fffaf1;color:#243038;padding:20px;text-align:center}
 #kaGrade10AssessmentMentors .ka-g10-mentor-card:nth-child(2){background:#243038;color:#fffaf1}
 #kaGrade10AssessmentMentors h3{font:400 24px/1.4 Cinzel,Georgia,serif;margin:0 0 4px;color:inherit}
 #kaGrade10AssessmentMentors .ka-g10-role{font-size:16px;margin:0 0 12px}
 #kaGrade10AssessmentMentors .ka-g10-mentor-card>p:not(.ka-g10-role){font-size:16px;margin:0 0 16px;flex:1}
 #kaGrade10AssessmentMentors .ka-g10-mentor-card a{display:grid;place-items:center;min-height:48px;padding:10px 12px;border-radius:7px;text-decoration:none;font:400 16px/1.4 Nunito,Arial,sans-serif;background:#243038;color:#fffaf1;border:1px solid #243038}
 #kaGrade10AssessmentMentors .ka-g10-mentor-card:nth-child(2) a{background:#fffaf1;color:#243038;border-color:#fffaf1}
 #kaGrade10AssessmentMentors a:focus-visible{outline:3px solid #c59f51;outline-offset:3px}
 #kaGrade10AssessmentMentors .ka-g10-policy{text-align:center;font-size:16px;margin:20px auto 0;max-width:900px}
 @media(max-width:650px){#kaGrade10AssessmentMentors{padding:16px 11px}#kaGrade10AssessmentMentors .ka-g10-mentor-grid{grid-template-columns:1fr}}
 @media print{#kaGrade10AssessmentMentors .ka-g10-mentor-card a{display:none}}
 `;
 document.head.append(css);
 hero.insertAdjacentElement("afterend",section);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();

/* Grade 11 assessment mentorship pilot v1.0.0.
 * Presentation-only, idempotent, no persistent state, no grade changes.
 * The course-owned assessment and learner-record engines remain authoritative
 * for their own scoped operations; neither mentor can grant mastery.
 */
(()=>{
"use strict";
const SCRIPT=document.currentScript;
const CONFIG={
 "algebra-2":{name:"Algebra II",prep:"Check readiness in equations, functions, transformations, graphs, and earlier algebra before graded assessments.",review:"Use new examples to reason through function families, algebraic identities, modeling, and error correction without exposing assessment items.",method:"Algebra II keeps its course-owned readiness, weekly mastery, midterm, final, and review requirements. The mentor guide cannot award mastery."},
 "english-11":{name:"English 11",prep:"Review advanced literary interpretation, evidence-based writing, rhetorical analysis, and research skills.",review:"Revise the weakest rubric criterion and request feedback on fresh passages or original writing; complex performances require an authorized evaluator.",method:"The English 11 assessment schema has an 80% threshold and requires human review for essays, research, speech, debate, portfolios, and oral defenses."},
 "chemistry-11":{name:"Chemistry 11",prep:"Review scientific practices, chemical reasoning, measurement, laboratory safety, and evidence before assessments.",review:"Study concepts with new examples, check calculations, and improve claims, evidence, reasoning, and laboratory explanations.",method:"Chemistry 11 retains the course's 80% mastery floor. Written, laboratory, and other performance evidence require appropriate evaluation."},
 "social-studies-11":{name:"Government & Economics 11",prep:"Prepare for the actual Government and Economics examinations, including their published course expectations and permitted materials.",review:"Develop original constitutional analysis, civic argument, economic interpretation, and evidence-based corrections without sharing protected answers.",method:"Government and Economics finals remain separate course-owned assessments. Objective scoring and teacher-reviewed responses retain their original owners."}
};
function start(){
 if(document.getElementById("kaGrade11AssessmentMentors"))return;
 const id=SCRIPT?.dataset?.assessmentSubject, cfg=CONFIG[id];
 if(!cfg)return;
 const main=document.querySelector("main");
 if(!main)return;
 const hero=main.querySelector(":scope > section.hero,:scope > section.unit-hero,:scope > .hero,:scope > .unit-hero")
   ||main.querySelector("section.hero,section.unit-hero")
   ||document.querySelector("body > section.hero");
 if(!hero)return; // Never inject into an active question form.
 const section=document.createElement("section");
 section.id="kaGrade11AssessmentMentors";
 section.className="ka-grade11-assessment-mentors";
 section.setAttribute("aria-labelledby","ka-grade11-mentor-title");
 const title=document.createElement("h2");
 title.id="ka-grade11-mentor-title";title.textContent="Assessment Guidance · "+cfg.name;
 const intro=document.createElement("p");
 intro.className="ka-g11-intro";intro.textContent="NAIB coordinates public assessment directions; Archaemenes supports understanding. The assessment engine and authorized evaluator determine scoring and progression.";
 const grid=document.createElement("div");grid.className="ka-g11-mentor-grid";
 function card(name,role,description,url,label){
  const article=document.createElement("article");article.className="ka-g11-mentor-card";
  const h=document.createElement("h3");h.textContent=name;
  const small=document.createElement("p");small.className="ka-g11-role";small.textContent=role;
  const p=document.createElement("p");p.textContent=description;
  const a=document.createElement("a");a.href=url;a.textContent=label;a.setAttribute("aria-label",label+" — "+name);
  article.append(h,small,p,a);return article;
 }
 const academy="https://vervenveda.com/Khaemenes_High.github.io/";
 const mentor=academy+"mentor/?subject="+encodeURIComponent(id)+"&grade=11";
 grid.append(
  card("NAIB","Assessment administration and navigation",cfg.prep,
       "https://artist1970.github.io/NAIB.github.io/#naib-chat","Ask NAIB about the pathway"),
  card("Archaemenes","Instruction and guided corrections",cfg.review,
       mentor,"Ask Archaemenes to help me study")
 );
 const policy=document.createElement("p");policy.className="ka-g11-policy";
 policy.textContent=cfg.method+" Public mentor chats do not access protected questions, official grades, private records, or permission changes.";
 section.append(title,intro,grid,policy);
 const css=document.createElement("style");
 css.id="kaGrade11AssessmentMentorStyles";
 css.textContent=`
 #kaGrade11AssessmentMentors{box-sizing:border-box;max-width:1100px;width:calc(100% - 28px);margin:24px auto 30px;padding:24px;background:#f6f0e4;color:#243038;border:1px solid #bdaa88;border-radius:7px;font:400 16px/1.6 Nunito,"Brandon Grotesque",Arial,sans-serif;scroll-margin-top:96px}
 #kaGrade11AssessmentMentors *{box-sizing:border-box}
 #kaGrade11AssessmentMentors h2{font:400 clamp(24px,3vw,33px)/1.3 Cinzel,Georgia,serif;text-align:center;margin:0 0 10px;color:#243038}
 #kaGrade11AssessmentMentors .ka-g11-intro{max-width:780px;margin:0 auto 20px;text-align:center;font-size:16px;color:#243038}
 #kaGrade11AssessmentMentors .ka-g11-mentor-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
 #kaGrade11AssessmentMentors .ka-g11-mentor-card{display:flex;flex-direction:column;min-width:0;border:1px solid #bdaa88;border-radius:7px;background:#fffaf1;color:#243038;padding:20px;text-align:center}
 #kaGrade11AssessmentMentors .ka-g11-mentor-card:nth-child(2){background:#243038;color:#fffaf1}
 #kaGrade11AssessmentMentors h3{font:400 24px/1.4 Cinzel,Georgia,serif;margin:0 0 4px;color:inherit}
 #kaGrade11AssessmentMentors .ka-g11-role{font-size:16px;margin:0 0 12px}
 #kaGrade11AssessmentMentors .ka-g11-mentor-card>p:not(.ka-g11-role){font-size:16px;margin:0 0 16px;flex:1}
 #kaGrade11AssessmentMentors .ka-g11-mentor-card a{display:grid;place-items:center;min-height:48px;padding:10px 12px;border-radius:7px;text-decoration:none;font:400 16px/1.4 Nunito,Arial,sans-serif;background:#243038;color:#fffaf1;border:1px solid #243038}
 #kaGrade11AssessmentMentors .ka-g11-mentor-card:nth-child(2) a{background:#fffaf1;color:#243038;border-color:#fffaf1}
 #kaGrade11AssessmentMentors a:focus-visible{outline:3px solid #c59f51;outline-offset:3px}
 #kaGrade11AssessmentMentors .ka-g11-policy{text-align:center;font-size:16px;margin:20px auto 0;max-width:900px}
 @media(max-width:650px){#kaGrade11AssessmentMentors{padding:16px 11px}#kaGrade11AssessmentMentors .ka-g11-mentor-grid{grid-template-columns:1fr}}
 @media print{#kaGrade11AssessmentMentors .ka-g11-mentor-card a{display:none}}
 `;
 document.head.append(css);
 hero.insertAdjacentElement("afterend",section);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();

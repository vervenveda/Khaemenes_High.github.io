/* Grade 09 assessment mentorship pilot v1.0.0.
 * Presentation-only, idempotent, no persistent state, no grade changes.
 * The course-owned assessment and learner-record engines remain authoritative
 * for their own scoped operations; neither mentor can grant mastery.
 */
(()=>{
"use strict";
const SCRIPT=document.currentScript;
const CONFIG={
 "pre-algebra":{name:"Pre-Algebra",prep:"A readiness check identifies useful mathematical foundations. Review before entering the graded lesson sequence.",review:"Check errors in arithmetic, number sense, and algebraic reasoning; request fresh examples without revealing assessment items.",method:"Objective mastery requires 80% under the course's own rules. Readiness evidence is not an official course grade."},
 "english-9":{name:"English 9",prep:"A readiness check explores reading, writing, and supporting claims with evidence.",review:"Revise the lowest-performing criterion; original writing, speeches, and portfolios need authorized human review.",method:"At least 80% applies where specified; completing a written performance does not itself award mastery."},
 "science-9":{name:"Integrated Science 9",prep:"Readiness and safety checks prepare students for inquiry, measurement, data, and laboratory work.",review:"Use scientific practices and data reasoning exercises; laboratory work and constructed responses require appropriate evaluation.",method:"The course assessment rubric and safety prerequisites govern progression; no mentor can bypass them."},
 "social-studies-9":{name:"Global Studies 9",prep:"Readiness explores claims, primary sources, chronology, geography, and evidence.",review:"Practise source corroboration, historical context, and argument using new, ungraded examples.",method:"The current readiness gateway uses 80% overall and each essential strand; authorized review governs official placement."}
};
function start(){
 if(document.getElementById("kaGrade09AssessmentMentors"))return;
 const id=SCRIPT?.dataset?.assessmentSubject, cfg=CONFIG[id];
 if(!cfg)return;
 const main=document.querySelector("main");
 if(!main)return;
 const hero=main.querySelector(":scope > section.hero,:scope > section.unit-hero,:scope > .hero,:scope > .unit-hero")
   ||main.querySelector("section.hero,section.unit-hero");
 if(!hero)return; // Never inject into an active question form.
 const section=document.createElement("section");
 section.id="kaGrade09AssessmentMentors";
 section.className="ka-grade09-assessment-mentors";
 section.setAttribute("aria-labelledby","ka-grade09-mentor-title");
 const title=document.createElement("h2");
 title.id="ka-grade09-mentor-title";title.textContent="Assessment Guidance · "+cfg.name;
 const intro=document.createElement("p");
 intro.className="ka-g9-intro";intro.textContent="NAIB coordinates public assessment directions; Archaemenes supports understanding. The assessment engine and authorized evaluator determine scoring and progression.";
 const grid=document.createElement("div");grid.className="ka-g9-mentor-grid";
 function card(name,role,description,url,label){
  const article=document.createElement("article");article.className="ka-g9-mentor-card";
  const h=document.createElement("h3");h.textContent=name;
  const small=document.createElement("p");small.className="ka-g9-role";small.textContent=role;
  const p=document.createElement("p");p.textContent=description;
  const a=document.createElement("a");a.href=url;a.textContent=label;a.setAttribute("aria-label",label+" — "+name);
  article.append(h,small,p,a);return article;
 }
 const academy="https://vervenveda.com/Khaemenes_High.github.io/";
 const mentor=academy+"mentor/?subject="+encodeURIComponent(id)+"&grade=09";
 grid.append(
  card("NAIB","Assessment administration and navigation",cfg.prep,
       "https://artist1970.github.io/NAIB.github.io/#naib-chat","Ask NAIB about the pathway"),
  card("Archaemenes","Instruction and guided corrections",cfg.review,
       mentor,"Ask Archaemenes to help me study")
 );
 const policy=document.createElement("p");policy.className="ka-g9-policy";
 policy.textContent=cfg.method+" Public mentor chats do not access protected questions, official grades, private records, or permission changes.";
 section.append(title,intro,grid,policy);
 const css=document.createElement("style");
 css.id="kaGrade09AssessmentMentorStyles";
 css.textContent=`
 #kaGrade09AssessmentMentors{box-sizing:border-box;max-width:1100px;width:calc(100% - 28px);margin:24px auto 30px;padding:24px;background:#f6f0e4;color:#243038;border:1px solid #bdaa88;border-radius:7px;font:400 16px/1.6 Nunito,"Brandon Grotesque",Arial,sans-serif;scroll-margin-top:96px}
 #kaGrade09AssessmentMentors *{box-sizing:border-box}
 #kaGrade09AssessmentMentors h2{font:400 clamp(24px,3vw,33px)/1.3 Cinzel,Georgia,serif;text-align:center;margin:0 0 10px;color:#243038}
 #kaGrade09AssessmentMentors .ka-g9-intro{max-width:780px;margin:0 auto 20px;text-align:center;font-size:16px;color:#243038}
 #kaGrade09AssessmentMentors .ka-g9-mentor-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
 #kaGrade09AssessmentMentors .ka-g9-mentor-card{display:flex;flex-direction:column;min-width:0;border:1px solid #bdaa88;border-radius:7px;background:#fffaf1;color:#243038;padding:20px;text-align:center}
 #kaGrade09AssessmentMentors .ka-g9-mentor-card:nth-child(2){background:#243038;color:#fffaf1}
 #kaGrade09AssessmentMentors h3{font:400 24px/1.4 Cinzel,Georgia,serif;margin:0 0 4px;color:inherit}
 #kaGrade09AssessmentMentors .ka-g9-role{font-size:16px;margin:0 0 12px}
 #kaGrade09AssessmentMentors .ka-g9-mentor-card>p:not(.ka-g9-role){font-size:16px;margin:0 0 16px;flex:1}
 #kaGrade09AssessmentMentors .ka-g9-mentor-card a{display:grid;place-items:center;min-height:48px;padding:10px 12px;border-radius:7px;text-decoration:none;font:400 16px/1.4 Nunito,Arial,sans-serif;background:#243038;color:#fffaf1;border:1px solid #243038}
 #kaGrade09AssessmentMentors .ka-g9-mentor-card:nth-child(2) a{background:#fffaf1;color:#243038;border-color:#fffaf1}
 #kaGrade09AssessmentMentors a:focus-visible{outline:3px solid #c59f51;outline-offset:3px}
 #kaGrade09AssessmentMentors .ka-g9-policy{text-align:center;font-size:16px;margin:20px auto 0;max-width:900px}
 @media(max-width:650px){#kaGrade09AssessmentMentors{padding:16px 11px}#kaGrade09AssessmentMentors .ka-g9-mentor-grid{grid-template-columns:1fr}}
 @media print{#kaGrade09AssessmentMentors .ka-g9-mentor-card a{display:none}}
 `;
 document.head.append(css);
 hero.insertAdjacentElement("afterend",section);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();

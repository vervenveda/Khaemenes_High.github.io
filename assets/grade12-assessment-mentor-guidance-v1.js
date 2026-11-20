/* Grade 12 assessment mentorship pilot v1.0.0.
 * Presentation-only, idempotent, no persistent state, no grade changes.
 * The course-owned assessment and learner-record engines remain authoritative
 * for their own scoped operations; neither mentor can grant mastery.
 */
(()=>{
"use strict";
const SCRIPT=document.currentScript;
const CONFIG={
 "english-12":{name:"English 12",prep:"Review advanced reading, rhetoric, research, and evidence-based senior-year writing before the next assessment.",review:"Revise weak rubric criteria with original work and fresh examples; essays, portfolios, oral defense, and other performances need authorized human evaluation.",method:"English 12 retains its 80% course mastery target and teacher-review requirements. Work submission alone never grants mastery."},
 "physics-engineering-12":{name:"Physics & Engineering 12",prep:"Review mathematical models, scientific practices, investigation design, measurements, safety, and evidence before assessment.",review:"Develop original physics examples, explain engineering design decisions, revisit calculations, and improve evidence-based laboratory reasoning.",method:"Physics & Engineering 12 retains its stated 80% mastery floor and course-owned evaluation of laboratory and project evidence."},
 "social-studies-12":{name:"Comparative Politics & Global Studies 12",prep:"Review the published examination coverage, sources, permitted resources, and the course's specific assessment threshold.",review:"Practice original comparative reasoning, diplomatic analysis, economic interpretation, and sourced argument without revealing assessment answers.",method:"The published Grade 12 Social Studies semester and cumulative finals currently specify 70% required scores. These course-owned rules are preserved pending curriculum review; other senior assessments may have different gates."}
};
function start(){
 if(document.getElementById("kaGrade12AssessmentMentors"))return;
 const id=SCRIPT?.dataset?.assessmentSubject, cfg=CONFIG[id];
 if(!cfg)return;
 const main=document.querySelector("main");
 if(!main)return;
 const hero=main.querySelector(":scope > section.hero,:scope > section.unit-hero,:scope > .hero,:scope > .unit-hero")
   ||main.querySelector("section.hero,section.unit-hero")
   ||document.querySelector("body > section.hero");
 if(!hero)return; // Never inject into an active question form.
 const section=document.createElement("section");
 section.id="kaGrade12AssessmentMentors";
 section.className="ka-grade12-assessment-mentors";
 section.setAttribute("aria-labelledby","ka-grade12-mentor-title");
 const title=document.createElement("h2");
 title.id="ka-grade12-mentor-title";title.textContent="Assessment Guidance · "+cfg.name;
 const intro=document.createElement("p");
 intro.className="ka-g12-intro";intro.textContent="NAIB coordinates public assessment directions; Archaemenes supports understanding. The assessment engine and authorized evaluator determine scoring and progression.";
 const grid=document.createElement("div");grid.className="ka-g12-mentor-grid";
 function card(name,role,description,url,label){
  const article=document.createElement("article");article.className="ka-g12-mentor-card";
  const h=document.createElement("h3");h.textContent=name;
  const small=document.createElement("p");small.className="ka-g12-role";small.textContent=role;
  const p=document.createElement("p");p.textContent=description;
  const a=document.createElement("a");a.href=url;a.textContent=label;a.setAttribute("aria-label",label+" — "+name);
  article.append(h,small,p,a);return article;
 }
 const academy="https://vervenveda.com/Khaemenes_High.github.io/";
 const mentor=academy+"mentor/?subject="+encodeURIComponent(id)+"&grade=12";
 grid.append(
  card("NAIB","Assessment administration and navigation",cfg.prep,
       "https://artist1970.github.io/NAIB.github.io/#naib-chat","Ask NAIB about the pathway"),
  card("Archaemenes","Instruction and guided corrections",cfg.review,
       mentor,"Ask Archaemenes to help me study")
 );
 const policy=document.createElement("p");policy.className="ka-g12-policy";
 policy.textContent=cfg.method+" Public mentor chats do not access protected questions, official grades, private records, or permission changes.";
 section.append(title,intro,grid,policy);
 const css=document.createElement("style");
 css.id="kaGrade12AssessmentMentorStyles";
 css.textContent=`
 #kaGrade12AssessmentMentors{box-sizing:border-box;max-width:1100px;width:calc(100% - 28px);margin:24px auto 30px;padding:24px;background:#f6f0e4;color:#243038;border:1px solid #bdaa88;border-radius:7px;font:400 16px/1.6 Nunito,"Brandon Grotesque",Arial,sans-serif;scroll-margin-top:96px}
 #kaGrade12AssessmentMentors *{box-sizing:border-box}
 #kaGrade12AssessmentMentors h2{font:400 clamp(24px,3vw,33px)/1.3 Cinzel,Georgia,serif;text-align:center;margin:0 0 10px;color:#243038}
 #kaGrade12AssessmentMentors .ka-g12-intro{max-width:780px;margin:0 auto 20px;text-align:center;font-size:16px;color:#243038}
 #kaGrade12AssessmentMentors .ka-g12-mentor-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
 #kaGrade12AssessmentMentors .ka-g12-mentor-card{display:flex;flex-direction:column;min-width:0;border:1px solid #bdaa88;border-radius:7px;background:#fffaf1;color:#243038;padding:20px;text-align:center}
 #kaGrade12AssessmentMentors .ka-g12-mentor-card:nth-child(2){background:#243038;color:#fffaf1}
 #kaGrade12AssessmentMentors h3{font:400 24px/1.4 Cinzel,Georgia,serif;margin:0 0 4px;color:inherit}
 #kaGrade12AssessmentMentors .ka-g12-role{font-size:16px;margin:0 0 12px}
 #kaGrade12AssessmentMentors .ka-g12-mentor-card>p:not(.ka-g12-role){font-size:16px;margin:0 0 16px;flex:1}
 #kaGrade12AssessmentMentors .ka-g12-mentor-card a{display:grid;place-items:center;min-height:48px;padding:10px 12px;border-radius:7px;text-decoration:none;font:400 16px/1.4 Nunito,Arial,sans-serif;background:#243038;color:#fffaf1;border:1px solid #243038}
 #kaGrade12AssessmentMentors .ka-g12-mentor-card:nth-child(2) a{background:#fffaf1;color:#243038;border-color:#fffaf1}
 #kaGrade12AssessmentMentors a:focus-visible{outline:3px solid #c59f51;outline-offset:3px}
 #kaGrade12AssessmentMentors .ka-g12-policy{text-align:center;font-size:16px;margin:20px auto 0;max-width:900px}
 @media(max-width:650px){#kaGrade12AssessmentMentors{padding:16px 11px}#kaGrade12AssessmentMentors .ka-g12-mentor-grid{grid-template-columns:1fr}}
 @media print{#kaGrade12AssessmentMentors .ka-g12-mentor-card a{display:none}}
 `;
 document.head.append(css);
 hero.insertAdjacentElement("afterend",section);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();

(() => {
  "use strict";
  const frame=document.getElementById("courseFrame");
  if(!frame)return;
  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument;
    if(!doc)return;
    window.setTimeout(()=>{
      const script=doc.createElement("script");
      script.textContent=`(()=>{
"use strict";
const originalMakeQuestion=makeQuestion;
const PASS=80;
const mcq=(q,answer,wrong,explanation)=>mc(q,answer,wrong,explanation);
const BANK={
 safety:[
  ["Which action belongs first when preparing a supervised investigation?","Identify hazards and controls",["Collect materials before reading directions","Begin the procedure and stop only if something spills","Assume familiar materials have no risks"],"Hazards, controls, supervision, disposal, and stop conditions are reviewed before materials or procedures begin."],
  ["A learner notices an unlabeled liquid at a lab station. What is the safest response?","Do not use it; notify the supervising adult or teacher",["Smell it closely","Taste a tiny amount","Use it if the container looks clean"],"Unknown or unlabeled substances are not used. The supervisor should resolve the identity and safe handling."],
  ["Why are stop conditions written before an investigation begins?","They define when conditions are no longer safe or valid",["They guarantee a desired result","They replace supervision","They make data unnecessary"],"Predetermined stop conditions help protect people and preserve the validity of the investigation."]
 ],
 inquiry:[
  ["Which feature makes a scientific question testable?","It can be investigated using observable or measurable evidence",["It can only be answered by opinion","It guarantees one preferred conclusion","It avoids defining variables"],"Testable questions connect to observations or measurements that can count as evidence."],
  ["Why are controlled variables held as constant as practical?","To make the effect of the independent variable easier to interpret",["To make every trial identical in outcome","To eliminate all uncertainty","To prevent measurement"],"Controls reduce competing explanations without pretending all uncertainty disappears."],
  ["Which is the dependent variable in an investigation?","The outcome that is measured or observed",["The factor deliberately changed","A conclusion written before data","Any factor ignored by the design"],"The dependent variable is the measured response."]
 ],
 cells:[
  ["Which observation best supports cell theory?","New cells are observed forming from existing cells",["All cells have exactly the same shape","Only animals are cellular","Cells can appear without parent cells"],"Modern cell theory includes the principle that cells arise from existing cells."],
  ["Which organelle contains most of a eukaryotic cell's genetic material?","nucleus",["cell wall","ribosome","Golgi apparatus"],"Most eukaryotic DNA is housed in the nucleus."],
  ["Why are microscopes important to cell biology?","They allow structures below unaided-eye resolution to be observed",["They prove every cellular process directly","They remove the need for models","They make all specimens the same size"],"Microscopy expands observable scale, while models and other evidence remain necessary for processes that cannot be seen directly."]
 ],
 membrane:[
  ["What does selectively permeable mean?","Some substances cross a membrane more readily than others",["Nothing can cross the membrane","Every substance crosses at the same rate","Only water can ever cross"],"Selective permeability describes unequal passage of different substances."],
  ["Diffusion tends to produce net movement from:","higher concentration toward lower concentration",["lower concentration toward higher concentration without energy","the nucleus toward every membrane","cold regions toward warm regions only"],"Random molecular motion produces net diffusion down a concentration gradient."],
  ["Osmosis specifically describes net movement of:","water across a selectively permeable membrane",["DNA between cells","proteins through any solid wall","electrons through a circuit"],"Osmosis is the diffusion of water across a selectively permeable membrane."]
 ],
 cell_energy:[
  ["Which process transfers chemical energy from glucose into forms cells can use?","cellular respiration",["osmosis","mitosis","transcription alone"],"Cellular respiration transfers energy from fuel molecules into ATP and other usable forms."],
  ["Which statement best connects photosynthesis and respiration?","Matter cycles between products and reactants while energy is transformed",["They are identical processes","Both create matter from nothing","Neither involves chemical reactions"],"The processes are chemically linked through matter, while energy changes form and flows through systems."],
  ["Where does the carbon in plant glucose primarily come from?","carbon dioxide",["sunlight","soil minerals only","oxygen gas"],"Plants incorporate carbon from carbon dioxide into organic molecules during photosynthesis."]
 ],
 genetics:[
  ["In a simple heterozygous Aa parent, what fraction of gametes is expected to carry allele a?","50%",["0%","25%","100%"],"Alleles separate during gamete formation, so Aa produces A and a gametes in equal expected proportions."],
  ["What is a genotype?","An organism's allele combination for a trait or locus",["Only the visible trait","Any environmental influence","A chromosome count only"],"Genotype refers to genetic constitution; phenotype refers to observable characteristics."],
  ["Why are Punnett squares probability models rather than guarantees?","Each offspring event is probabilistic and small families can differ from expected ratios",["Genes do not influence inheritance","Every family must match the exact ratio","Punnett squares change the alleles"],"Punnett squares represent expected probabilities, not predetermined outcomes for a small number of offspring."]
 ],
 ecology:[
  ["What is the primary role of producers in most ecosystems?","Convert external energy into chemical energy stored in organic matter",["Consume all decomposers","Create matter from nothing","Prevent nutrient cycling"],"Producers capture energy, commonly through photosynthesis, and build organic matter."],
  ["Why are decomposers important to nutrient cycling?","They break down organic material and return nutrients to usable pools",["They stop all energy loss","They replace producers","They create new elements"],"Decomposition returns matter to biogeochemical cycles."],
  ["Why does available energy generally decrease at higher trophic levels?","Organisms use and dissipate much of the energy they obtain",["Energy is destroyed by consumers","Producers contain no energy","Predators cannot metabolize food"],"Energy transfers are inefficient because organisms use energy for life processes and much is dissipated as heat."]
 ],
 periodic:[
  ["What does atomic number identify?","number of protons in the nucleus",["number of neutrons only","total mass in grams","number of electron shells"],"An element is defined by its proton number."],
  ["Elements in the same period are arranged in the same:","horizontal row",["vertical group","isotope","compound family"],"Periods are horizontal rows; groups are vertical columns."],
  ["Why can periodic-table position help predict properties?","Electron structure changes in recurring patterns across the table",["Every element in a row is chemically identical","Atomic masses are all equal","Position determines temperature"],"Recurring electron-configuration patterns underlie many periodic trends."]
 ],
 bonding:[
  ["Which description best matches an ionic bond model?","Attraction between oppositely charged ions after electron transfer",["Shared electron pairs only","Attraction caused by gravity","A change in the atomic nucleus"],"Ionic bonding is modeled as electrostatic attraction between oppositely charged ions."],
  ["Covalent bonding is modeled primarily as:","sharing electron pairs between atoms",["complete proton transfer","gravitational attraction","loss of all valence electrons by both atoms"],"Covalent bonds involve shared electron density between atoms."],
  ["Why do bonding models focus on valence electrons?","Valence electrons are most directly involved in ordinary chemical interactions",["Core protons move between atoms during reactions","Neutrons form molecular bonds","Valence electrons determine isotope mass"],"Chemical bonding chiefly involves the outermost electrons."]
 ],
 reactions:[
  ["What must be conserved when balancing an ordinary chemical equation?","the number of atoms of each element",["the number of molecules on each side","the physical state of every substance","the temperature"],"Balancing represents conservation of atoms during chemical reactions."],
  ["Which observation can be evidence that a chemical reaction occurred?","formation of a new substance indicated by properties such as gas or precipitate",["A container is moved","A solid is cut into smaller pieces","A sample changes location"],"Evidence for reaction concerns formation of substances with new chemical identities, though observations must be interpreted carefully."],
  ["Why do coefficients change when an equation is balanced but subscripts do not?","Coefficients change amounts; changing subscripts would change substance identities",["Subscripts never represent atoms","Coefficients change element identity","Both can be changed freely"],"Balancing adjusts relative amounts without rewriting chemical formulas."]
 ],
 climate:[
  ["Which dataset is most appropriate for describing climate?","long-term records of temperature, precipitation, and related variables",["one afternoon's weather","a single thunderstorm","one thermometer reading"],"Climate is described statistically using long-term patterns and variability."],
  ["Why does one unusually cold day not by itself disprove a long-term warming trend?","Short-term weather variability and long-term climate trends occur on different time scales",["Cold weather cannot occur in a warming climate","Climate is measured only in summer","Trends require no data"],"Individual weather events do not determine a multi-decadal climate trend."],
  ["Which statement distinguishes climate projection from weather forecast?","Climate projections estimate long-term statistical conditions under assumptions; weather forecasts target short-term atmospheric states",["They are identical","Climate projection predicts the exact weather on a future date","Weather forecasts require no observations"],"The two tools address different scales, inputs, and kinds of uncertainty."]
 ],
 space:[
  ["Why do seasons occur on Earth?","Axial tilt changes solar angle and day length during Earth's orbit",["Earth is dramatically closer to the Sun every Northern Hemisphere summer","The Moon changes Earth's distance from the Sun each season","Daily rotation causes the annual seasons"],"Earth's axial tilt produces seasonal changes in incoming solar energy."],
  ["What causes the phases of the Moon?","The changing portion of the Moon's sunlit half visible from Earth",["Earth's shadow covering the Moon every month","Clouds blocking parts of the Moon","The Moon producing different amounts of light"],"Lunar phases are viewing-geometry effects; eclipses are separate events."],
  ["Why do stars appear to move across the sky during a night?","Earth rotates on its axis",["The entire universe circles Earth each day","Earth stops orbiting","The Moon pushes the stars"],"Earth's rotation causes the dominant daily apparent motion of the sky."]
 ],
 engineering_problem:[
  ["What is the difference between a criterion and a constraint?","A criterion describes desired performance; a constraint limits the solution",["They are always identical","A criterion is a scientific law and a constraint is an opinion","Constraints describe only cost"],"Engineering design makes desired performance and limits explicit."],
  ["Why should stakeholders be identified in an engineering problem?","Different people or systems may experience different benefits, costs, and risks",["Stakeholders determine physical laws","Only designers can be affected","Stakeholders eliminate trade-offs"],"Stakeholder analysis reveals impacts and trade-offs that a technical metric alone may miss."],
  ["Which is most clearly a constraint?","The device must use no more than 10 watts",["Maximize water removed per hour","Improve reliability","Increase user satisfaction"],"A constraint is a limit that a design must satisfy." ]
 ],
 engineering_test:[
  ["Why are repeated prototype trials useful?","They reveal variability and make comparisons more reliable",["They guarantee a perfect design","They remove the need to define criteria","They ensure every result is identical"],"Repeated trials help distinguish a consistent effect from random variation."],
  ["What makes a prototype comparison fair?","Use the same criteria and test conditions while changing the intended design feature",["Change several variables at once","Score each design with different rules","Ignore failed trials"],"Controlled comparisons make the effect of a design change easier to interpret."],
  ["What should happen after a prototype fails a criterion?","Analyze evidence, revise the design, and test again",["Hide the failed result","Change the criterion after seeing the score without justification","Declare the project complete"],"Iterative engineering uses failures as evidence for revision." ]
 ]
};
function domainQuestion(w,index){
 const bank=BANK[w.quizType];
 if(bank?.length){const item=bank[(w.week+index)%bank.length];return mcq(item[0],item[1],item[2],item[3]);}
 return originalMakeQuestion(w.quizType);
}
function appliedQuestion(w,kind){
 if(kind===0)return mcq(`For Week ${w.week}, “${w.title},” which record would most improve reproducibility?`,`Units, conditions, procedure, repeated measurements, and anomalies`,[`Only the final conclusion`,`A preferred answer written before data`,`A list of materials with no procedure or measurements`],`A reproducible record states how evidence was produced, including units, conditions, procedure, repeated measurements, and anomalies.`);
 if(kind===1)return mcq(`When answering the Week ${w.week} essential question, which response best follows Claim–Evidence–Reasoning?`,`A clear claim supported by relevant evidence and an explanation connecting the evidence to the claim`,[`A claim with no evidence`,`A list of facts with no conclusion`,`A conclusion stated with more certainty than the data support`],`CER requires a claim, relevant evidence, and reasoning that explains the connection while respecting uncertainty.`);
 return mcq(`For Week ${w.week}, which source-use practice is strongest?`,`Record author or organization, date, methods or evidence, attribution, and important limitations`,[`Use the first result without checking it`,`Accept a source because its title agrees with your prediction`,`Remove uncertainty so the conclusion sounds stronger`],`Scientific source evaluation includes provenance, date, evidence or methods, attribution, and limitations.`);
}
getSet=function(w,n=6){
 if(!sets[w.week]){
  const out=[];
  for(let i=0;i<Math.min(3,n);i++)out.push(domainQuestion(w,i));
  for(let i=3;i<n;i++)out.push(appliedQuestion(w,(i-3)%3));
  sets[w.week]=out;
 }
 return sets[w.week];
};
function clearAssessmentNavLock(){
 document.querySelectorAll('button[data-view="assessments"],.navBtn[data-view="assessments"],.tab[data-view="assessments"]').forEach(el=>{el.removeAttribute("data-mastery-locked");el.removeAttribute("aria-disabled");el.removeAttribute("title");el.style.opacity="";});
}
function masteryThrough(week){for(let i=1;i<=week;i++)if(Number(active().scores?.[i]||0)<PASS)return false;return true;}
function gateAssessmentCards(){
 clearAssessmentNavLock();
 const cards=[...document.querySelectorAll("#content .card")];
 const rules=[
  ["Units 01–04",12,"This cumulative test opens after Weeks 1–12 each reach 80% mastery."],
  ["Midterm Practical",18,"The midterm checkpoint opens after Weeks 1–18 each reach 80% mastery."],
  ["Units 05–07",21,"This cumulative test opens after Weeks 1–21 each reach 80% mastery."],
  ["Units 08–09",27,"This cumulative test opens after Weeks 1–27 each reach 80% mastery."],
  ["Comprehensive Final",36,"The final opens after all 36 weekly mastery gates reach 80% or higher. Formal midterm-score integration is audited separately."]
 ];
 for(const [label,week,message] of rules){
  const card=cards.find(c=>c.querySelector("h3")?.textContent.includes(label));
  const link=card?.querySelector("a.button");
  if(link&&!masteryThrough(week)){
   link.dataset.forensicLocked="true";link.dataset.forensicMessage=message;link.setAttribute("aria-disabled","true");link.style.opacity=".58";link.title=message;
  }
 }
}
const priorRenderAssessments=renderAssessments;
renderAssessments=function(){priorRenderAssessments();gateAssessmentCards();};
document.addEventListener("click",event=>{const lock=event.target.closest('[data-forensic-locked="true"]');if(!lock)return;event.preventDefault();event.stopImmediatePropagation();alert(`You’re almost there. ${lock.dataset.forensicMessage} Review the current learning and come back — your progress is saved.`);},true);
clearAssessmentNavLock();
if(document.querySelector('.navBtn.active[data-view="assessments"],.tab.active[data-view="assessments"]'))gateAssessmentCards();
})();`;
      doc.body.appendChild(script);
    },0);
  });
})();
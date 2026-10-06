"use strict";
const READINESS_QUESTIONS=[{"id": "r01", "domain": "Scientific practices", "prompt": "Which statement is a direct observation?", "options": ["The metal will rust tomorrow.", "The liquid is blue.", "The plant is unhealthy because the soil is poor.", "The animal is frightened."], "answer": 1, "explanation": "“The liquid is blue” reports a directly observable property. The other choices predict or infer causes or internal states."}, {"id": "r02", "domain": "Scientific practices", "prompt": "Which question is testable with a controlled investigation?", "options": ["Which flower is the prettiest?", "Does water temperature affect how quickly a fixed mass of sugar dissolves?", "Should everyone enjoy science?", "Is nature important?"], "answer": 1, "explanation": "Water temperature and dissolving time can be measured while other variables are controlled."}, {"id": "r03", "domain": "Scientific practices", "prompt": "A student changes the amount of light and measures plant growth. What is the independent variable?", "options": ["Plant growth", "Amount of light", "Plant species", "Measurement error"], "answer": 1, "explanation": "The independent variable is the factor deliberately changed: the amount of light."}, {"id": "r04", "domain": "Scientific practices", "prompt": "Why do scientists use models?", "options": ["Models are always exact copies of reality.", "Models make evidence unnecessary.", "Models help represent, explain, or predict systems that may be complex, large, small, slow, or inaccessible.", "Models prove that only one explanation is possible."], "answer": 2, "explanation": "Models are useful representations, but they have assumptions and limitations and are not exact copies of reality."}, {"id": "r05", "domain": "Measurement", "prompt": "Which SI unit is most appropriate for the length of a classroom desk?", "options": ["Kilogram", "Meter", "Liter", "Second"], "answer": 1, "explanation": "Length is measured in meters or a related SI length unit."}, {"id": "r06", "domain": "Measurement", "prompt": "Convert 2.5 liters to milliliters.", "options": ["25 mL", "250 mL", "2,500 mL", "25,000 mL"], "answer": 2, "explanation": "One liter equals 1,000 milliliters, so 2.5 × 1,000 = 2,500 mL."}, {"id": "r07", "domain": "Measurement", "prompt": "A ruler has marks every 1 millimeter. Which recorded length is appropriate for an object ending exactly at the 42-millimeter mark?", "options": ["42 mm", "42 kg", "4,200 mm", "0.42 mL"], "answer": 0, "explanation": "The ruler measures length in millimeters, and the object ends at 42 mm."}, {"id": "r08", "domain": "Measurement", "prompt": "A sample has a mass of 60 grams and a volume of 20 milliliters. What is its density?", "options": ["0.33 g/mL", "3 g/mL", "40 g/mL", "80 g/mL"], "answer": 1, "explanation": "Density = mass ÷ volume = 60 g ÷ 20 mL = 3 g/mL."}, {"id": "r09", "domain": "Data and evidence", "prompt": "Which graph is generally most appropriate for showing how temperature changes every hour during one day?", "options": ["Line graph", "Pie chart", "Unlabeled picture", "Single number"], "answer": 0, "explanation": "A line graph clearly displays change across ordered time intervals."}, {"id": "r10", "domain": "Data and evidence", "prompt": "A seedling study records average heights of 2.0, 2.6, 3.4, 4.1, and 4.3 cm as daily light increases from 0 to 8 hours. Which statement is supported by these data?", "options": ["In this study, average seedling height increased as daily light increased.", "All plants everywhere require exactly 8 hours of light.", "Light is the only factor that affects plant growth.", "The tallest individual seedling was 4.3 cm."], "answer": 0, "explanation": "The averages rise as light increases. The data do not prove universality, exclude other factors, or identify the tallest individual."}, {"id": "r11", "domain": "Data and evidence", "prompt": "Two variables are correlated. What can be concluded from correlation alone?", "options": ["One variable definitely causes the other.", "The variables change together in a pattern, but causation is not established.", "The data must be false.", "No further investigation is useful."], "answer": 1, "explanation": "Correlation identifies an association; it does not by itself demonstrate causation."}, {"id": "r12", "domain": "Data and evidence", "prompt": "Four repeated measurements are 10.1 cm, 10.2 cm, 10.1 cm, and 14.8 cm. What should the investigator do first about 14.8 cm?", "options": ["Delete it without comment.", "Change it to 10.1 cm.", "Check the procedure and equipment, repeat the measurement if possible, and document the anomaly.", "Average only the two smallest values."], "answer": 2, "explanation": "An unusual result should be investigated and documented, not silently changed or discarded."}, {"id": "r13", "domain": "Life science", "prompt": "Which cell structure is the main site of cellular respiration in eukaryotic cells?", "options": ["Mitochondrion", "Cell wall", "Ribosome", "Vacuole"], "answer": 0, "explanation": "Mitochondria are the principal site of cellular respiration in eukaryotic cells."}, {"id": "r14", "domain": "Life science", "prompt": "During simple diffusion, particles have a net movement from:", "options": ["Lower concentration to higher concentration", "Higher concentration to lower concentration", "Cold regions to hot regions only", "The nucleus to the cell wall only"], "answer": 1, "explanation": "Simple diffusion produces net movement down a concentration gradient, from higher to lower concentration."}, {"id": "r15", "domain": "Life science", "prompt": "Which organism is a producer in a typical food web?", "options": ["Green grass", "Hawk", "Mushroom", "Earthworm"], "answer": 0, "explanation": "Green grass produces organic molecules through photosynthesis."}, {"id": "r16", "domain": "Chemistry", "prompt": "The atomic number of an element equals the number of:", "options": ["Protons in each atom of that element", "Neutrons plus electrons", "Energy levels only", "Chemical bonds"], "answer": 0, "explanation": "An element is defined by its number of protons, which is its atomic number."}, {"id": "r17", "domain": "Chemistry", "prompt": "Which change is chemical?", "options": ["Ice melting", "Paper being cut", "Iron rusting", "Water boiling"], "answer": 2, "explanation": "Rusting forms new substances through chemical reactions. The other examples are physical changes."}, {"id": "r18", "domain": "Chemistry", "prompt": "In a closed system, 12 grams of substances react completely. What total mass should the products have?", "options": ["0 g", "6 g", "12 g", "24 g"], "answer": 2, "explanation": "Mass is conserved in a closed system, so the products total 12 g."}, {"id": "r19", "domain": "Physics", "prompt": "A cyclist travels 120 meters in 20 seconds. What is the cyclist’s average speed?", "options": ["6 m/s", "20 m/s", "100 m/s", "2,400 m/s"], "answer": 0, "explanation": "Average speed = distance ÷ time = 120 m ÷ 20 s = 6 m/s."}, {"id": "r20", "domain": "Physics", "prompt": "An object has equal forces acting in opposite directions. What is the net force?", "options": ["Zero", "Twice either force", "Always upward", "Impossible to determine"], "answer": 0, "explanation": "Equal opposite forces cancel, producing a net force of zero."}, {"id": "r21", "domain": "Physics", "prompt": "A switch opens a simple series circuit containing one battery and two lamps. What happens?", "options": ["Both lamps go out because the circuit path is broken.", "Only the battery goes out.", "Both lamps become brighter.", "Current continues through the air gap normally."], "answer": 0, "explanation": "Opening a series circuit breaks its only conducting path, so current stops through both lamps."}, {"id": "r22", "domain": "Earth and space", "prompt": "Ocean water evaporates into the air. Which Earth-system transfer is occurring?", "options": ["Atmosphere to geosphere", "Hydrosphere to atmosphere", "Biosphere to geosphere", "Geosphere to hydrosphere"], "answer": 1, "explanation": "Ocean water belongs to the hydrosphere; water vapor enters the atmosphere."}, {"id": "r23", "domain": "Earth and space", "prompt": "Which statement describes climate rather than weather?", "options": ["A thunderstorm occurred this afternoon.", "Tomorrow’s high may reach 28°C.", "A region’s summers have usually been hot and dry over several decades.", "Wind speed is 20 km/h right now."], "answer": 2, "explanation": "Climate describes long-term patterns, while weather describes short-term atmospheric conditions."}, {"id": "r24", "domain": "Earth and space", "prompt": "Why are earthquakes common near many tectonic plate boundaries?", "options": ["Stress can build as plates move and then be released suddenly.", "Plate boundaries block all rock movement.", "Earthquakes are caused only by daily temperature changes.", "The atmosphere pushes plates apart every night."], "answer": 0, "explanation": "Plate motion can build stress along faults; sudden release of that stress produces earthquakes."}];
(() => {
  const contract=window.KhaemenesCourseEntryContract;
  const profile=contract?.readAcademyProfile?.();
  const KEY=contract?.scopedKey?.("khaemenes_science_u00_v1",profile)||"khaemenes_science_u00_v1";
  const answers=new Array(READINESS_QUESTIONS.length).fill(null);
  let current=0;
  const $=(s,p=document)=>p.querySelector(s);

  function loadState(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return {}}}
  function saveResult(result){
    if(!profile) throw new Error("Select an Academy learner before saving readiness evidence.");
    if(contract?.identityRaw?.()!==JSON.stringify(profile.learnerId)) throw new Error("The Academy learner changed.");
    const state=loadState();
    state.diagnostic=result;
    state.updatedAt=new Date().toISOString();
    localStorage.setItem(KEY,JSON.stringify(state));
  }
  function escape(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
  function render(){
    const q=READINESS_QUESTIONS[current];
    $("#domainLabel").textContent=q.domain;
    $("#questionNumber").textContent=`Question ${current+1} of ${READINESS_QUESTIONS.length}`;
    $("#questionPrompt").textContent=q.prompt;
    $("#options").innerHTML=q.options.map((option,index)=>`
      <label class="option"><input type="radio" name="answer" value="${index}" ${answers[current]===index?"checked":""}><span>${escape(option)}</span></label>`).join("");
    $("#options").querySelectorAll("input").forEach(input=>input.addEventListener("change",event=>{
      answers[current]=Number(event.target.value);renderDots();updateSubmit();
    }));
    $("#previousButton").disabled=current===0;
    $("#nextButton").textContent=current===READINESS_QUESTIONS.length-1?"Review":"Next";
    renderDots();
  }
  function renderDots(){
    $("#questionDots").innerHTML=READINESS_QUESTIONS.map((_,i)=>`<button class="dot ${i===current?"current":""} ${answers[i]!==null?"answered":""}" type="button" data-i="${i}" aria-label="Question ${i+1}">${i+1}</button>`).join("");
    $("#questionDots").querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>{current=Number(button.dataset.i);render();}));
  }
  function updateSubmit(){$("#submitButton").disabled=answers.some(value=>value===null)}
  function recommendation(score){
    if(score<=11)return ["Foundation pathway recommended","Begin with visual support, smaller steps, vocabulary review, and guided practice. Reassess after correction and early units."];
    if(score<=18)return ["Core pathway with targeted support","Begin the complete Core course and use Foundation support in lower-scoring domains."];
    return ["Core or Extended readiness","The learner shows broad readiness. Begin Core and use Extended work where challenge is appropriate."];
  }
  function submit(){
    if(!profile){
      $("#resultMessage").textContent="Select your learner in the Academy Family Portal before recording readiness evidence.";
      return;
    }
    const domain= {};
    let score=0;
    READINESS_QUESTIONS.forEach((q,i)=>{
      domain[q.domain] ||= {correct:0,total:0};
      domain[q.domain].total++;
      if(answers[i]===q.answer){score++;domain[q.domain].correct++;}
    });
    const [label,message]=recommendation(score);
    const result={completed:true,score,total:READINESS_QUESTIONS.length,recommendation:label,domainScores:domain,answers,completedAt:new Date().toISOString()};
    saveResult(result);
    $("#diagnostic").hidden=true;$("#intro").hidden=true;$("#results").hidden=false;
    $("#score").textContent=`${score} / ${READINESS_QUESTIONS.length}`;
    $("#recommendation").textContent=label;
    $("#resultMessage").textContent=message+" This diagnostic is guidance, not a permanent grade.";
    $("#domainGrid").innerHTML=Object.entries(domain).map(([name,data])=>`<div class="domain-result"><strong>${data.correct} / ${data.total}</strong><span>${escape(name)}</span></div>`).join("");
    $("#reviewList").innerHTML=READINESS_QUESTIONS.map((q,i)=>{
      const correct=answers[i]===q.answer;
      return `<article class="review-item ${correct?"correct":"incorrect"}"><strong>${i+1}. ${escape(q.prompt)}</strong><p>Your answer: ${escape(q.options[answers[i]])}</p><p>Correct answer: ${escape(q.options[q.answer])}</p><p>${escape(q.explanation)}</p></article>`;
    }).join("");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function start(){$("#intro").hidden=true;$("#diagnostic").hidden=false;render();updateSubmit();}
  function retake(){answers.fill(null);current=0;$("#results").hidden=true;$("#diagnostic").hidden=false;render();updateSubmit();}
  document.addEventListener("DOMContentLoaded",()=>{
    $("#startButton").addEventListener("click",start);
    $("#previousButton").addEventListener("click",()=>{if(current>0){current--;render();}});
    $("#nextButton").addEventListener("click",()=>{if(current<READINESS_QUESTIONS.length-1)current++;render();});
    $("#submitButton").addEventListener("click",submit);
    $("#retakeButton").addEventListener("click",retake);
    $("#printResults").addEventListener("click",()=>window.print());
  });
})();

(() => {
  "use strict";

  const STORAGE_KEY = "khaemenes_grade09_readiness_progress_v1";
  const RESULT_KEY = "khaemenes_grade09_readiness_result_v1";
  const PAGE_SIZE = 5;

  const DOMAINS = {
    math:{label:"Mathematics", support:"Mathematics Foundations", bridge:"Pre-Algebra Bridge", ready:"Algebra I / Integrated Math I", advanced:"Advanced Mathematics Verification"},
    ela:{label:"Language Arts", support:"Literacy Foundations", bridge:"English 9 Bridge Support", ready:"English 9", advanced:"English 9 Advanced Verification"},
    science:{label:"Science", support:"Science Foundations & Lab Reasoning", bridge:"Integrated Science Bridge Support", ready:"Integrated Science 9", advanced:"Advanced Science Verification"},
    social:{label:"Social Studies", support:"Global Inquiry Foundations", bridge:"Global Studies Bridge Support", ready:"Global Studies 9", advanced:"Global Studies Honors Verification"},
    research:{label:"Research & Academic Readiness", support:"Academic Research & Study Studio", bridge:"Embedded Research Support", ready:"Grade 09 Research Ready", advanced:"Advanced Research Verification"}
  };

  const q=(id,domain,prompt,choices,answer,skill)=>({id,domain,prompt,choices,answer,skill});
  const CORE=[
    q("M01","math","Which value is greatest?",["-8","-2","0","-1"],2,"number sense"),
    q("M02","math","3/4 + 1/8 equals…",["4/12","7/8","5/8","1"],1,"fractions"),
    q("M03","math","A $60 item is discounted 25%. What is the sale price?",["$15","$35","$45","$50"],2,"percent"),
    q("M04","math","Solve: 4x + 3 = 19",["x=3","x=4","x=5","x=6"],1,"equations"),
    q("M05","math","Which ratio is equivalent to 3:5?",["6:8","9:15","12:25","15:20"],1,"ratios"),
    q("M06","math","A line passes through (0,2) and (3,8). What is its slope?",["2","3","6","10/3"],0,"linear reasoning"),
    q("M07","math","2^4 × 2^2 equals…",["2^6","4^6","2^8","4^4"],0,"exponents"),
    q("M08","math","The mean of 4, 8, 8, and 12 is…",["7","8","9","10"],1,"statistics"),
    q("M09","math","A rectangle has length 9 and width 4. Its area is…",["13","26","36","72"],2,"geometry"),
    q("M10","math","Which expression is equivalent to 3(a+4)-2a?",["a+12","5a+4","a+4","3a+12"],0,"algebraic structure"),

    q("E01","ela","Read: 'Although the road was flooded, the crew continued after rerouting through higher ground.' Which relationship is emphasized?",["Cause and contrast","Chronology only","Definition","Comparison of two crews"],0,"reading relationships"),
    q("E02","ela","Which sentence uses the strongest textual evidence in an analysis?",["The character is brave, obviously.","The character seems brave because the narrator says so.","The character's decision to return for the trapped child despite the fire supports the claim that courage guides her choices.","I think the character is brave."],2,"evidence"),
    q("E03","ela","Which sentence is grammatically complete?",["Because the storm arrived early.","Running quickly through the hall.","The storm arrived early, so the team moved indoors.","While the team waited."],2,"sentence structure"),
    q("E04","ela","A source describes an event using emotionally charged words but provides no evidence. What should a careful reader do first?",["Accept it if it agrees with prior beliefs","Check the source, evidence, and corroborating accounts","Reject every emotional source automatically","Quote it as fact"],1,"source reading"),
    q("E05","ela","Which thesis is most defensible?",["Technology is good.","School is important.","Because later start times can improve sleep duration and attendance, schools should evaluate schedules using local evidence and transportation constraints.","Everyone knows sleep matters."],2,"argument"),
    q("E06","ela","Which revision is most concise? 'Due to the fact that the experiment failed, we repeated it again.'",["Because the experiment failed, we repeated it.","Due to the fact it failed, we again repeated it again.","The experiment, due to failure, was repeated again.","We repeated again because of the fact of failure."],0,"revision"),
    q("E07","ela","If a narrator knows only one character's thoughts, the point of view is most likely…",["first-person plural","third-person limited","third-person omniscient","second person"],1,"literary analysis"),
    q("E08","ela","Which transition best signals a counterargument?",["For example","Similarly","However","Therefore"],2,"organization"),
    q("E09","ela","Which is the best paraphrase practice?",["Change a few words and omit citation","Restate the idea fully in your own structure and cite the source","Copy the sentence if it is online","Summarize without naming the source"],1,"paraphrase"),
    q("E10","ela","A paragraph's topic sentence should primarily…",["introduce the paragraph's controlling idea","repeat the title","include every detail","always ask a question"],0,"composition"),

    q("S01","science","In an experiment testing fertilizer amount on plant growth, what is the independent variable?",["Plant growth","Fertilizer amount","Plant species","Height measurement"],1,"variables"),
    q("S02","science","Why are repeated trials useful?",["They guarantee the hypothesis is correct","They reduce the effect of random variation","They eliminate all measurement error","They make controls unnecessary"],1,"experimental design"),
    q("S03","science","A graph shows temperature rising from 20°C to 30°C over 5 minutes. The average rate of change is…",["1°C/min","2°C/min","5°C/min","10°C/min"],1,"data"),
    q("S04","science","Which statement best reflects conservation of matter in an ordinary chemical reaction?",["Atoms disappear when bonds break","The number of atoms of each element is conserved","Mass always increases","Products contain no reactant atoms"],1,"chemistry"),
    q("S05","science","Which organelle contains most eukaryotic genetic material?",["ribosome","nucleus","cell membrane","Golgi apparatus"],1,"cells"),
    q("S06","science","If two variables are correlated, what can you conclude immediately?",["One definitely causes the other","They change together in the data, but causation requires more evidence","The data are invalid","No relationship exists"],1,"scientific reasoning"),
    q("S07","science","Which energy transformation occurs in a battery-powered flashlight?",["Chemical → electrical → light/thermal","Light → chemical only","Thermal → nuclear","Electrical → chemical only"],0,"energy"),
    q("S08","science","What is the safest response to an unlabeled substance in a lab?",["Smell it","Test a tiny amount","Do not use it; notify the supervising adult","Mix it with water"],2,"lab safety"),
    q("S09","science","Why does a scientific model sometimes change?",["Science ignores evidence","New evidence can reveal limits in the earlier model","Models are guesses with no evidence","A model must never be revised"],1,"models"),
    q("S10","science","A claim says a treatment works because 3 people improved. What is the strongest next question?",["Did they like the treatment?","Was there a comparison group and a larger, well-designed sample?","Was the treatment expensive?","Was the claim popular?"],1,"evidence quality"),

    q("H01","social","Which source is primary evidence for studying a 1963 speech?",["A textbook written in 2020","A recording/transcript of the 1963 speech","A modern blog summary","A later encyclopedia entry"],1,"source types"),
    q("H02","social","Chronology is most useful for…",["putting events in time order","proving causation automatically","deciding which culture is best","measuring latitude"],0,"chronology"),
    q("H03","social","What does a map scale help determine?",["Political ideology","Real-world distance","Source reliability by itself","Population age"],1,"geography"),
    q("H04","social","Which is the strongest historical claim?",["One event always has one cause","Historical change often has multiple interacting causes","All sources are equally reliable","Later events cannot affect interpretation"],1,"causation"),
    q("H05","social","If two sources disagree, the best first step is to…",["choose the one you prefer","compare authorship, context, evidence, and corroboration","discard both","average their claims"],1,"corroboration"),
    q("H06","social","Opportunity cost means…",["the money printed by government","the value of the next-best option given up","all choices are free","prices never change"],1,"economics"),
    q("H07","social","Which civic action is most directly connected to evaluating a public policy proposal?",["Compare evidence, stakeholders, legal authority, costs, and trade-offs","Share the first post you see","Assume every claim is equally supported","Ignore implementation"],0,"civics"),
    q("H08","social","Latitude measures distance…",["east/west of the prime meridian","north/south of the equator","above sea level","between time periods"],1,"geography"),
    q("H09","social","A historian says an empire fell only because of one battle. What would strengthen the analysis?",["Ignore economics and politics","Examine multiple causes and longer-term pressures","Use no sources","Treat outcome as inevitable"],1,"historical reasoning"),
    q("H10","social","When reading a political source, 'bias' should be treated as…",["proof the source is useless","a perspective to analyze alongside evidence, purpose, and context","proof the opposite claim is true","a reason to skip corroboration"],1,"source evaluation"),

    q("R01","research","Which citation practice is safest?",["Cite only direct quotations","Cite borrowed ideas, data, and quotations according to the required style","Cite only websites","Do not cite paraphrases"],1,"citation"),
    q("R02","research","A search result makes a surprising factual claim. What should you do?",["Use the headline alone","Open the source and corroborate with reliable independent evidence","Share it immediately","Assume the top result is correct"],1,"verification"),
    q("R03","research","Which source detail most helps establish provenance?",["Font color","Author/organization, date, and publication context","Number of ads","Page background"],1,"provenance"),
    q("R04","research","A table reports 45 out of 60 students. What percentage is that?",["65%","70%","75%","80%"],2,"data literacy"),
    q("R05","research","Which is the best way to break down a large project?",["Wait until the last day","Create milestones, tasks, deadlines, and review points","Do only the easiest part","Skip planning"],1,"project planning"),
    q("R06","research","Which note-taking method best protects against accidental plagiarism?",["Copy text without quotation marks","Clearly label quotations, paraphrases, and your own ideas with source details","Use screenshots only","Remove source names"],1,"research notes"),
    q("R07","research","A graph starts its y-axis at 95 instead of 0. Why should you notice?",["It may visually exaggerate small differences","It makes all data false","Axes never matter","It proves causation"],0,"visual data literacy"),
    q("R08","research","What is lateral reading?",["Reading only left-to-right","Leaving a page to investigate the source using other reliable sources","Reading faster","Using only social media comments"],1,"media literacy"),
    q("R09","research","Which file name is easiest to manage in a long project?",["finalfinal2.doc","document.doc","2026-08-16_lab-report_v03.docx","newfile.doc"],2,"organization"),
    q("R10","research","If instructions contain five required steps, the strongest approach is to…",["complete only the interesting steps","track each requirement and verify completion before submission","assume one step covers all others","ignore the rubric"],1,"academic independence")
  ];

  const VERIFY=[
    q("MV1","math","Solve: 3(2x-5)=21",["x=4","x=5","x=6","x=7"],2,"advanced algebra"),
    q("MV2","math","A line has slope -2 and passes through (1,5). Which point is also on the line?",["(2,3)","(2,7)","(3,1)","(0,1)"],0,"linear verification"),
    q("EV1","ela","Which sentence best integrates a counterclaim?",["Some disagree.","Although opponents argue the policy is too costly, the local cost analysis shows the largest expense is temporary and offset by lower maintenance after year three.","The policy is correct.","There is no other view."],1,"argument verification"),
    q("EV2","ela","A passage shifts from describing a problem to proposing criteria for solutions. What changed?",["The text moved from exposition toward evaluation/argument","The narrator changed person","The evidence disappeared","The chronology reversed"],0,"structure verification"),
    q("SV1","science","Two groups differ in both temperature and light level. Why is causal interpretation difficult?",["There are two changed variables, so effects are confounded","Temperature never affects results","Light cannot be measured","Controls are unnecessary"],0,"design verification"),
    q("SV2","science","A result is statistically unusual but the measurement instrument was uncalibrated. What should happen next?",["Publish the conclusion immediately","Check/calibrate the instrument and replicate before strong claims","Discard all science","Assume the unusual result is correct"],1,"evidence verification"),
    q("HV1","social","Which comparison best avoids false equivalence?",["Use the same analytical criteria while preserving differences in context, scale, institutions, and evidence","Call two societies identical if both had rulers","Ignore chronology","Use only one source"],0,"comparative verification"),
    q("HV2","social","A later memoir conflicts with a contemporary government record. Which approach is strongest?",["The government record automatically wins","The memoir automatically wins","Source both, compare purposes and timing, and seek corroborating evidence","Average the two claims"],2,"source verification"),
    q("RV1","research","Which research question is most workable?",["Is history good?","How did local transit changes from 2018–2025 affect average commute time in the county, and what evidence limits causal claims?","What is everything about climate?","Why are people wrong?"],1,"question design"),
    q("RV2","research","A source cites a dataset you need. What is the strongest next move?",["Quote the secondary source only","Locate the underlying dataset or original report when possible and verify how it was used","Assume the citation is accurate","Ignore methodology"],1,"source tracing")
  ];

  const $=id=>document.getElementById(id);
  const state={phase:"core",page:0,answers:{},verifyDomains:[],result:null};

  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({phase:state.phase,page:state.page,answers:state.answers,verifyDomains:state.verifyDomains}))}catch{}}
  function load(){try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;const s=JSON.parse(raw);state.phase=s.phase||"core";state.page=Number(s.page)||0;state.answers=s.answers||{};state.verifyDomains=Array.isArray(s.verifyDomains)?s.verifyDomains:[]}catch{}}
  function list(){if(state.phase==="core")return CORE;return VERIFY.filter(item=>state.verifyDomains.includes(item.domain));}
  function pages(){return Math.max(1,Math.ceil(list().length/PAGE_SIZE));}
  function currentItems(){const a=state.page*PAGE_SIZE;return list().slice(a,a+PAGE_SIZE);}
  function answered(item){return Number.isInteger(state.answers[item.id]);}
  function pageComplete(){return currentItems().every(answered);}

  function render(){
    const items=currentItems(),total=list().length,done=list().filter(answered).length;
    $("phaseLabel").textContent=state.phase==="core"?"Core Readiness Evidence":"Targeted Verification";
    $("pageLabel").textContent=`Page ${state.page+1} of ${pages()} · ${done} of ${total} answered`;
    $("progressFill").style.width=`${total?Math.round(done/total*100):0}%`;
    const host=$("questions");host.replaceChildren();
    for(const item of items){
      const field=document.createElement("fieldset");field.className="question";
      const legend=document.createElement("legend");legend.textContent=`${DOMAINS[item.domain].label} · ${item.prompt}`;field.appendChild(legend);
      const choices=document.createElement("div");choices.className="choices";
      item.choices.forEach((choice,index)=>{
        const label=document.createElement("label");label.className="choice";
        const input=document.createElement("input");input.type="radio";input.name=item.id;input.value=String(index);input.checked=state.answers[item.id]===index;
        input.addEventListener("change",()=>{state.answers[item.id]=index;save();renderNav();});
        const span=document.createElement("span");span.textContent=choice;label.append(input,span);choices.appendChild(label);
      });
      field.appendChild(choices);host.appendChild(field);
    }
    renderNav();
  }

  function renderNav(){
    $("prevBtn").disabled=state.page===0;
    const last=state.page===pages()-1;
    $("nextBtn").textContent=last?(state.phase==="core"?"Analyze Core Evidence":"Complete Readiness Profile"):"Next";
    $("nextBtn").disabled=!pageComplete();
  }

  function domainScore(domain,source){
    const items=source.filter(i=>i.domain===domain&&answered(i));
    if(!items.length)return {score:0,correct:0,total:0};
    const correct=items.filter(i=>state.answers[i.id]===i.answer).length;
    return {score:Math.round(correct/items.length*100),correct,total:items.length};
  }

  function analyzeCore(){
    const scores={};
    for(const d of Object.keys(DOMAINS))scores[d]=domainScore(d,CORE);
    state.verifyDomains=Object.keys(scores).filter(d=>scores[d].score>=90||(scores[d].score>=70&&scores[d].score<85));
    if(state.verifyDomains.length){state.phase="verify";state.page=0;save();showIntro(`Your core profile is complete. A short verification set will now collect more evidence in ${state.verifyDomains.map(d=>DOMAINS[d].label).join(", ")}.`);render();}
    else finalize();
  }

  function finalScore(domain){
    const core=domainScore(domain,CORE),verify=domainScore(domain,VERIFY);
    if(!verify.total)return {...core,coverage:core.total,verified:false};
    return {score:Math.round(core.score*.7+verify.score*.3),correct:core.correct+verify.correct,total:core.total+verify.total,coverage:core.total+verify.total,verified:true};
  }

  function band(domain,score,verified){
    if(domain==="math"){
      if(score<60)return {key:"foundation",label:"Foundations Recommended",path:DOMAINS[domain].support};
      if(score<80)return {key:"bridge",label:"Pre-Algebra Bridge Recommended",path:DOMAINS[domain].bridge};
      if(score<92)return {key:"ready",label:"Algebra I Ready",path:DOMAINS[domain].ready};
      return {key:"advanced",label:verified?"Advanced Verification Supported":"Advanced Verification Recommended",path:DOMAINS[domain].advanced};
    }
    if(score<60)return {key:"foundation",label:"Foundations Recommended",path:DOMAINS[domain].support};
    if(score<80)return {key:"bridge",label:"Targeted Bridge Support",path:DOMAINS[domain].bridge};
    if(score<92)return {key:"ready",label:"Grade 09 Ready",path:DOMAINS[domain].ready};
    return {key:"advanced",label:verified?"Advanced Verification Supported":"Advanced Verification Recommended",path:DOMAINS[domain].advanced};
  }

  async function requestNaibInterpretation(profile){
    try{
      const router=window.KhaemenesNAIB||window.KhaemenesNAIBMentorRouter||window.KhaemenesNAIBRouter;
      if(router?.delegate){
        return await router.delegate({stage:"high",grade:"grade-09",ageBand:"high-school",interests:[],surface:"grade09-readiness",intent:"interpret-readiness-placement"});
      }
    }catch{}
    return null;
  }

  async function finalize(){
    const profile={};
    for(const d of Object.keys(DOMAINS)){const s=finalScore(d);profile[d]={...s,...band(d,s.score,s.verified)};}
    const naib=await requestNaibInterpretation(profile);
    state.result={version:"1.0.0-forensic-candidate",completedAt:new Date().toISOString(),profile,naib:{delegated:Boolean(naib),destination:naib?.destination||naib?.platform||null},notice:"Readiness evidence supports recommendations only. Family/Academy confirmation is required for formal placement."};
    try{localStorage.setItem(RESULT_KEY,JSON.stringify(state.result))}catch{}
    renderResults();
  }

  function renderResults(){
    $("assessmentPanel").classList.add("hidden");
    const panel=$("resultsPanel");panel.classList.remove("hidden");
    const grid=$("domainGrid");grid.replaceChildren();
    for(const [domain,data] of Object.entries(state.result.profile)){
      const card=document.createElement("article");card.className="domain";
      const title=document.createElement("strong");title.textContent=DOMAINS[domain].label;
      const score=document.createElement("span");score.className="score";score.textContent=`${data.score}%`;
      const badge=document.createElement("span");badge.className="band";badge.textContent=data.label;
      const p=document.createElement("p");p.className=`path-card ${data.key}`;p.textContent=`Recommended starting path: ${data.path}. Evidence items: ${data.total}${data.verified?" including targeted verification":""}.`;
      card.append(title,score,badge,p);grid.appendChild(card);
    }
    $("naibStatus").textContent=state.result.naib.delegated?"NAIB received the readiness interpretation request and delegated the next-step context. Formal placement still requires Family/Academy confirmation.":"The readiness profile is saved locally. NAIB can interpret it when the Academy delegation service is available; no formal placement has been changed.";
  }

  function showIntro(message){const el=$("statusMessage");el.textContent=message;el.classList.remove("hidden");}

  $("prevBtn").addEventListener("click",()=>{if(state.page>0){state.page--;save();render();}});
  $("nextBtn").addEventListener("click",()=>{
    if(!pageComplete())return;
    if(state.page<pages()-1){state.page++;save();render();return;}
    if(state.phase==="core")analyzeCore();else finalize();
  });
  $("resetBtn").addEventListener("click",()=>{if(!confirm("Reset this readiness attempt on this device?"))return;try{localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(RESULT_KEY)}catch{};location.reload();});
  $("printBtn").addEventListener("click",()=>window.print());

  load();
  const savedResult=(()=>{try{return JSON.parse(localStorage.getItem(RESULT_KEY)||"null")}catch{return null}})();
  if(savedResult){state.result=savedResult;renderResults();}else render();
})();
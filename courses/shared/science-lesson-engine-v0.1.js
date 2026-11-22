/* Khaemenes Academy Science Lesson Engine v0.2; Grade 09 Unit 01 Day 01 curriculum-complete pilot.
 * Presentation only: existing lesson DOM, assessment, completion and records stay authoritative.
 * No localStorage writes, no external scripts, no page-wide chrome or duplicate toolbar.
 */
(function(){
"use strict";
if(window.KhaemenesScienceLessonEngineV01)return;
const ENGINE_VERSION="0.2.0";
const names=[
["Recall & Prepare","Essential question","Learning objectives","Materials"],
["Observe & Predict","1. Begin with a phenomenon, not an answer"],
["Learn & Model","Vocabulary & Language of Inquiry","2. Build an investigable question","3. Operational definitions turn vague words into measurable rules"],
["Guided Investigation","4. Not every scientific question requires a controlled experiment"],
["Evidence Investigation","5. Evidence sufficiency: what would actually answer the question?","6. Interactive evidence audit"],
["Explain & Revise","7. Mentor conference prompt","Portfolio evidence","Lesson 01 Evidence Rubric"],
["Reflect & Retrieve","Exit check","Original Interactive Inquiry Tool"]
];
function element(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function mount(){
 if(document.body?.dataset.scienceEngine!=="science9-u01-d01"||document.getElementById("khaeScienceEngineV01"))return false;
 const root=document.querySelector("main .lesson-page");if(!root)return false;
 if(root.dataset.scienceEngineMounted==="true")return true;
 const byName=new Map([...root.querySelectorAll(":scope > section.lesson-section")].map(s=>[s.querySelector("h2")?.textContent.trim(),s]));
 if(names.some(group=>group.slice(1).some(t=>!byName.has(t))))return false;
 if(new Set(byName.values()).size!==byName.size)return false;
 const roadmap=root.querySelector(":scope > .ka-lesson-roadmap"),actions=root.querySelector(":scope > .lesson-actions"),safety=root.querySelector(":scope > .safety-panel");
 if(!roadmap||!actions||!safety)return false;
 const style=element("style");style.id="khaeScienceEngineV01Style";
 style.textContent=".science-engine-on #khaeScienceEngineV01{margin:20px 0;padding:20px;background:#fffdf8;color:#24322b;border:1px solid #c1b6a3;border-radius:7px;text-align:center}.science-engine-on #khaeScienceEngineV01 h2,.science-engine-on .science-engine-note h2{font:400 24px/1.3 Cinzel,Georgia,serif;color:#24322b;margin:0 0 10px}.science-engine-on #khaeScienceEngineV01 p,.science-engine-on .science-engine-note p{font:400 16px/1.55 Nunito,Arial,sans-serif;color:#33483c}.science-engine-on .science-engine-steps{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px;margin:16px 0}.science-engine-on #khaeScienceEngineV01 button,.science-engine-on .science-engine-note button{min-height:44px;padding:9px 11px;border:1px solid #708273;border-radius:7px;background:#2a3c32;color:#fff8ed;font:400 16px/1.3 Nunito,Arial,sans-serif;cursor:pointer}.science-engine-on #khaeScienceEngineV01 button[aria-current=step]{background:#b68d49;color:#152018}.science-engine-on #khaeScienceEngineV01 button:focus-visible,.science-engine-on .science-engine-note textarea:focus-visible,.science-engine-on .science-engine-note select:focus-visible{outline:3px solid #b68d49;outline-offset:3px}.science-engine-on #khaeScienceEngineV01 button:disabled{opacity:.45;cursor:not-allowed}.science-engine-on .science-engine-controls{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:14px auto}.science-engine-on .science-engine-meter{height:11px;border:1px solid #c1b6a3;background:#eae6dd;border-radius:7px;overflow:hidden}.science-engine-on .science-engine-meter span{display:block;height:100%;width:0;background:#3a6650}.science-engine-on .science-engine-note{background:#fffdf8;color:#24322b;padding:18px;border:1px solid #c1b6a3;border-radius:7px;margin:16px 0}.science-engine-on .science-engine-note textarea,.science-engine-on .science-engine-note select{display:block;width:100%;border:1px solid #859a89;border-radius:7px;padding:11px;margin:7px 0 14px;background:white;color:#24322b;font:400 16px Nunito,Arial,sans-serif}.science-engine-on .science-engine-note textarea{min-height:85px}.science-engine-on .science-engine-note label{font:400 16px Nunito,Arial,sans-serif;color:#24322b}.science-engine-on .science-engine-note table{width:100%;border-collapse:collapse}.science-engine-on .science-engine-note td,.science-engine-on .science-engine-note th{border:1px solid #b8c6ba;padding:8px}.science-engine-on .science-engine-graph{display:grid;gap:10px;margin:14px 0;text-align:left}.science-engine-on .science-engine-graph div{display:grid;gap:4px}.science-engine-on .science-engine-graph i{display:block;min-height:18px;background:#3a6650;border-radius:7px}.science-engine-on .science-engine-hidden{display:none!important}@media(max-width:800px){.science-engine-on .science-engine-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:440px){.science-engine-on .science-engine-steps{grid-template-columns:1fr}}@media print{.science-engine-on #khaeScienceEngineV01{display:none!important}.science-engine-on .science-engine-hidden{display:block!important}}";
 const dock=element("nav");dock.id="khaeScienceEngineV01";dock.setAttribute("aria-label","Guided Science lesson");
 dock.append(element("h2",null,"Your Scientific Journey"),element("p",null,"Seven research-informed learning steps · Visits are not mastery"));
 const grid=element("div","science-engine-steps"),meter=element("div","science-engine-meter"),bar=element("span"),state=element("p"),controls=element("div","science-engine-controls");
 meter.setAttribute("role","progressbar");meter.setAttribute("aria-valuemin","0");meter.setAttribute("aria-valuemax","7");meter.setAttribute("aria-label","Sections visited; not mastery");meter.append(bar);state.setAttribute("aria-live","polite");
 const groups=names.map(g=>g.slice(1).map(t=>byName.get(t))),visited=new Set();
 groups.flat().forEach((node,i)=>{if(!node.id)node.id="science-engine-section-"+String(i+1).padStart(2,"0")});
 let current=0,expanded=false;
 const tabs=names.map((group,i)=>{const b=element("button",null,String(i+1).padStart(2,"0")+" · "+group[0]);b.type="button";b.dataset.scienceEngineStep=String(i+1);b.setAttribute("aria-controls",groups[i].map(n=>n.id).join(" "));b.addEventListener("click",()=>show(i,{focus:true}));grid.append(b);return b});
 const back=element("button",null,"Previous step"),forward=element("button",null,"Next step"),all=element("button",null,"Show complete lesson");
 [back,forward,all].forEach(x=>x.type="button");controls.append(back,forward,all);dock.append(grid,meter,state,controls);
 const predict=element("section","science-engine-note");predict.dataset.scienceEngineSupplement="prediction";
 predict.append(element("h2",null,"Observe → Predict → Test"),element("p",null,"Separate what you notice from what you think will happen. A prediction is provisional and must be open to revision."));
 [["Observation","Describe only what could be observed or measured."],["Prediction","What pattern or result do you predict?"],["Evidence that could change my mind","What result would make you revise the prediction?"]].forEach(pair=>{const label=element("label",null,pair[0]),area=element("textarea");area.placeholder=pair[1];label.append(area);predict.append(label)});
 const data=element("section","science-engine-note");data.append(element("h2",null,"Evidence Investigation · Simulated Data"),element("p",null,"Fictional paper-helicopter descent times in seconds. These are teaching examples, not experimental results."));
 const table=element("table");table.innerHTML="<thead><tr><th>Trial</th><th>Short wings</th><th>Long wings</th></tr></thead><tbody><tr><td>1</td><td>1.1</td><td>1.5</td></tr><tr><td>2</td><td>1.2</td><td>1.6</td></tr><tr><td>3</td><td>1.0</td><td>1.4</td></tr></tbody>";
 const prompt=element("label",null,"Which conclusion is supported?"),select=element("select");
 [["","Choose an answer"],["supported","Long wings took longer in these fictional trials"],["universal","Long wings always fall more slowly in every situation"],["cause","The numbers alone prove wing length was the sole cause"]].forEach(pair=>{const option=element("option",null,pair[1]);option.value=pair[0];select.append(option)});
 prompt.append(select);const feedback=element("p");feedback.setAttribute("role","status");const check=element("button",null,"Check reasoning");check.type="button";
 check.addEventListener("click",()=>{feedback.textContent=select.value==="supported"?"Correct: the evidence supports these trials, not every possible situation.":select.value?"Recheck: three illustrative measurements cannot establish a universal causal law.":"Choose a conclusion first."});
 const worked=element("p",null,"Worked example: mean short-wing time = (1.1 + 1.2 + 1.0) ÷ 3 = 1.10 s; mean long-wing time = (1.5 + 1.6 + 1.4) ÷ 3 = 1.50 s. The observed difference in these fictional trials is 0.40 s.");
 const graph=element("div","science-engine-graph");graph.setAttribute("role","img");graph.setAttribute("aria-label","Bar comparison of fictional mean descent times: short wings 1.10 seconds, long wings 1.50 seconds.");
 graph.innerHTML='<div><span>Short wings · 1.10 s</span><i style="width:73%"></i></div><div><span>Long wings · 1.50 s</span><i style="width:100%"></i></div>';
 data.append(table,worked,graph,prompt,check,feedback);
 const reasoning=element("section","science-engine-note");reasoning.dataset.scienceEngineSupplement="reasoning-checks";
 reasoning.append(element("h2",null,"Reasoning Checks"),element("p",null,"Practice scientific reasoning with immediate feedback. These checks do not award mastery."));
 const reasoningItems=[
  {q:"Which statement is an observation rather than an interpretation?",a:"obs",opts:[["","Choose"],["obs","The metal surface felt cool to the touch before the ice was placed on it."],["why","Metal makes ice melt faster because it contains more cold."],["cause","The surface caused the melting difference."]],ok:"Correct: it reports something observable without explaining why."},
  {q:"Which question is most investigable?",a:"measure",opts:[["","Choose"],["broad","Why are plants good?"],["measure","How does daily light duration relate to mean stem-height change over seven days under documented conditions?"],["value","Which plant is the nicest?"]],ok:"Correct: it identifies a measurable outcome and documented conditions."},
  {q:"What can the fictional helicopter dataset justify?",a:"bounded",opts:[["","Choose"],["all","Long wings always descend more slowly."],["cause","Wing length is proven to be the only cause."],["bounded","Long wings had a longer mean descent time in these six fictional measurements."]],ok:"Correct: the claim stays within the evidence actually provided."},
  {q:"Which response best identifies a limitation?",a:"limit",opts:[["","Choose"],["none","The data are numbers, so there are no limitations."],["limit","Only three fictional trials per condition are shown, so broader claims require more evidence."],["proof","The pattern proves the result in every setting."]],ok:"Correct: it identifies a specific boundary on the conclusion."}
 ];
 reasoningItems.forEach((item,idx)=>{const label=element("label",null,(idx+1)+". "+item.q),select=element("select");item.opts.forEach(pair=>{const o=element("option",null,pair[1]);o.value=pair[0];select.append(o)});const fb=element("p");fb.setAttribute("role","status");select.addEventListener("change",()=>{fb.textContent=!select.value?"Choose an answer.":select.value===item.a?item.ok:"Recheck the evidence boundary, measurability, or observation-versus-interpretation distinction."});label.append(select,fb);reasoning.append(label)});
 const cer=element("section","science-engine-note");cer.append(element("h2",null,"Scientific Explanation Studio"),element("p",null,"Draft a claim, evidence, reasoning and limitation before moving the final response into the course-owned evidence/portfolio workflow. This engine draft is not a grade and is not the mastery authority."));
 [["Claim","What pattern do the fictional observations suggest?"],["Evidence","Which values support your claim?"],["Reasoning","Why does the evidence support that interpretation?"],["Limitations","What would you need to test or verify before making a causal claim?"]].forEach(pair=>{const label=element("label",null,pair[0]),area=element("textarea");area.placeholder=pair[1];label.append(area);cer.append(label)});
 const retrieval=element("section","science-engine-note");retrieval.append(element("h2",null,"Reflect & Retrieve"),element("p",null,"Without scrolling back, explain the difference between an observation and an interpretation, and identify one limitation of a proposed method."));
 const recall=element("textarea");recall.setAttribute("aria-label","Ungraded retrieval reflection");recall.placeholder="Explain your thinking in your own words…";retrieval.append(recall,element("p",null,"Practice only. The course-owned completion button and 80% mastery authority remain unchanged."));
 const supplements=[{node:predict,step:1},{node:data,step:4},{node:reasoning,step:4},{node:cer,step:5},{node:retrieval,step:6}];
 roadmap.before(dock);actions.before(data,cer,retrieval);document.head.append(style);
 document.body.classList.add("science-engine-on");roadmap.classList.add("science-engine-hidden");
 [...root.querySelectorAll(":scope > .ka-lesson-stage")].forEach(n=>n.classList.add("science-engine-hidden"));
 function setVisible(node,visible){node.classList.toggle("science-engine-hidden",!visible);node.setAttribute("aria-hidden",visible?"false":"true")}
 function show(i,{focus=false,updateHash=false}={}){expanded=false;current=Math.max(0,Math.min(6,i));visited.add(current);
  groups.forEach((items,k)=>items.forEach(n=>setVisible(n,k===current)));
  supplements.forEach(s=>setVisible(s.node,s.step===current));
  setVisible(actions,current===6);
  tabs.forEach((b,k)=>b.setAttribute("aria-current",k===current?"step":"false"));
  back.disabled=current===0;forward.disabled=current===6;
  bar.style.width=Math.round(visited.size/7*100)+"%";meter.setAttribute("aria-valuenow",String(visited.size));
  state.textContent="Step "+(current+1)+" of 7 · "+visited.size+" visited · no mastery credit";all.textContent="Show complete lesson";
  dock.dataset.currentStep=String(current+1);
  if(updateHash){const target=groups[current][0];if(target?.id&&history?.replaceState)history.replaceState(null,"","#"+target.id)}
  if(focus)tabs[current].focus({preventScroll:true});
  document.dispatchEvent(new CustomEvent("khaemenes:science-engine-step",{detail:{version:ENGINE_VERSION,step:current+1,visited:visited.size,mastery:false}}));
 }
 back.addEventListener("click",()=>{show(current-1,{focus:true,updateHash:true});dock.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})});
 forward.addEventListener("click",()=>{show(current+1,{focus:true,updateHash:true});dock.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})});
 all.addEventListener("click",()=>{expanded=!expanded;
  if(expanded){groups.flat().forEach(n=>setVisible(n,true));supplements.forEach(s=>setVisible(s.node,true));setVisible(actions,true);state.textContent="All instruction visible; no mastery awarded";all.textContent="Return to guided steps"}
  else show(current);
 });
 root.dataset.scienceEngineMounted="true";
 const resolveHash=()=>{const anchor=location.hash?document.getElementById(location.hash.substring(1)):null;return anchor?groups.findIndex(group=>group.some(n=>n===anchor||n.contains(anchor))):-1};
 const initial=resolveHash();show(initial<0?0:initial);
 window.addEventListener("hashchange",()=>{const i=resolveHash();if(i>=0)show(i)},{passive:true});
 document.dispatchEvent(new CustomEvent("khaemenes:science-engine-mounted",{detail:{version:ENGINE_VERSION,pilot:"science9-u01-d01",mastery:false,persistence:false}}));
 return true;
}
window.KhaemenesScienceLessonEngineV01=Object.freeze({version:ENGINE_VERSION,mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
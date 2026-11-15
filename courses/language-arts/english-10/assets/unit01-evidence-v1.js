/* English 10 Unit 01 · spaced retrieval and transfer layer v1
   Presentation/instructional prompts only. No learner storage or grading writes. */
(()=>{"use strict";
if(window.__E10_U01_EVIDENCE_V1__)return;
const path=String(location.pathname||"");
if(!/\/english-10\/weeks\/week-0[123]\//i.test(path))return;
window.__E10_U01_EVIDENCE_V1__=true;
document.documentElement.dataset.e10U01Evidence="v1";
if(!document.querySelector('link[data-e10-u01-evidence-css]')){
 const l=document.createElement("link");l.rel="stylesheet";
 l.href="/Khaemenes_High.github.io/courses/language-arts/english-10/assets/unit01-evidence-v1.css?v=20261115";
 l.dataset.e10U01EvidenceCss="1";document.head.append(l);
}
const weekdayIndex={monday:1,tuesday:2,wednesday:3,thursday:4,friday:5};
let week=Number((path.match(/\/week-(\d+)/i)||[])[1]||0);
let day=null;
const standalone=(path.match(/\/(monday|tuesday|wednesday|thursday|friday)\//i)||[])[1];
if(standalone)day=weekdayIndex[standalone.toLowerCase()];
const MAP={
1:[
["Reconnect English 9's claim → evidence → explanation cycle. Before reading, write one broad claim and revise it so its scope matches evidence you could actually collect.","Prior-course retrieval and baseline.","Establish a truthful starting point rather than a confident overclaim."],
["Without reopening Monday's notes, distinguish observation, inference, and limitation. Which one tells what evidence cannot establish?","One-day retrieval.","Use context and source conditions to judge an interpretation."],
["Reconstruct Tuesday's evidence ladder from memory. Then explain how two readers can observe the same event yet form different defensible interpretations.","Retrieves evidence structure and adds perspective.","Compare interpretations rather than searching for one automatic answer."],
["From memory, name two words that often signal overclaiming, such as every, always, proves, or caused. Rewrite one as a qualified claim.","Interleaves scope, evidence, and audience.","Revise meaning and scope, not just surface errors."],
["Closed notes: summarize the Week 1 process from broad assertion to evidence-based qualified interpretation. Cite one change you made in your own work after checking.","Cumulative Week 1 retrieval.","Use preserved evidence to explain growth and next steps."]
],
2:[
["A week later, reconstruct the difference between a missing case and a negative finding. What can omission establish, and what can it not establish?","Delayed retrieval from Week 1 context/limitation work.","Annotate claims for scope, quantifiers, method, and missing evidence."],
["Without notes, explain why a photograph, map, or record can be accurate yet still invite an unsupported conclusion. Name the missing context you would seek.","Retrieves source-condition reasoning.","Compare what a source shows with what its wording encourages readers to infer."],
["Rebuild the chain observation → evidence → inference → reasoning → significance. Where should qualification enter if the source method is limited?","Retrieves analytic architecture.","Write a paragraph whose claim is no broader than its evidence."],
["State the strongest alternative reading of your own paragraph before defending it. What evidence would make that counterreading stronger?","Interleaves fair interpretation with revision.","Revise against a real counterreading without inventing motives."],
["Closed notes: write a two-source thesis about the map/survey problem that includes one precise limitation. Then check it against both texts.","Cumulative Week 2 transfer.","Synthesize paired evidence into a narrower, more defensible conclusion."]
],
3:[
["Define quotation, paraphrase, summary, and analysis from memory. Which preserve source wording, which preserve meaning, and which add your reasoning?","Retrieves source-use distinctions.","Represent another person's language and ideas honestly."],
["Without notes, explain why 'six of seven with records' differs from 'six of eight participants' and from 'every family.' What changes when the denominator changes?","Retrieves scope and evidence limits.","Summarize accurately without expanding the population or causal claim."],
["Recall one rule for comparing conflicting records fairly. What may you state as shared fact, and what must remain unresolved?","Retrieves source comparison.","Preserve disagreement rather than manufacturing consensus."],
["Put the source away and explain one idea in your own sentence structure. Before checking, identify what must remain unchanged in meaning and attribution.","Retrieves paraphrase process.","Revise for independent language while preserving source meaning."],
["Unit preflight, closed notes: reconstruct the path from observation to qualified interpretation, then distinguish quotation, paraphrase, summary, analysis, and synthesis. Name one evidence limit you should disclose automatically.","Cumulative retrieval across all three weeks.","Produce an ethical synthesis and prepare for Unit 01 assessment/portfolio review."]
]
};
function make(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
function add(article,idx){
 const cfg=MAP[week]?.[idx-1];if(!cfg||article.querySelector(".e10-u01-retrieve"))return;
 const ret=make("aside","e10-u01-retrieve");ret.setAttribute("aria-label","Retrieve prior learning before looking");
 ret.append(make("p","kicker","RETRIEVE · BEFORE LOOKING"),make("h3","",idx===1?"Reconnect prior learning":"Bring earlier learning forward"),make("p","",cfg[0]),make("p","e10-u01-spacing",cfg[1]),make("span","e10-u01-transfer",cfg[2]));
 const obj=[...article.children].find(n=>n.tagName==="P"&&/objective:/i.test(n.textContent||""));
 const h=article.querySelector("h2");
 (obj||h)?.insertAdjacentElement("afterend",ret);
 const exit=make("aside","e10-u01-exit");exit.setAttribute("aria-label","Exit retrieval and correction");
 exit.append(make("p","kicker","EXIT · RETRIEVE, CHECK, CORRECT"),make("h3","","Reconstruct before reopening the lesson"));
 const last=week===3&&idx===5;
 exit.append(make("p","",last?"Without sources, state the strongest conclusion you can defend from this unit, the evidence type that supports it, and the most important limitation. Then check your portfolio and correct only your reflection—not an independent assessment response.":"Close notes and sources. In 3–5 sentences, reconstruct today's reasoning move, give one example from your own work, and identify one uncertainty or correction. Then verify against the lesson."));
 const toolbar=article.querySelector(".lesson-toolbar");
 if(toolbar)toolbar.insertAdjacentElement("beforebegin",exit);else article.append(exit);
}
function boot(){
 if(day){
  const a=document.querySelector("article.lesson-day")||document.querySelector(".lesson-day");
  if(a)add(a,day);
  return;
 }
 const lessons=[...document.querySelectorAll("article.lesson-day")];
 lessons.forEach((a,i)=>add(a,i+1));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
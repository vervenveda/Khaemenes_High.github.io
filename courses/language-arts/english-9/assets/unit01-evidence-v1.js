/* English 9 Unit 01 · evidence-based spacing and retrieval layer v1
   No learner storage, scores, assessment keys, or mastery authority are modified. */
(()=>{"use strict";
if(window.__E9_U01_EVIDENCE_V1__)return;
const path=String(location.pathname||"");
if(!/\/english-9\/weeks\/week-0[123]\/day-\d+\//i.test(path))return;
const m=path.match(/\/day-(\d+)\//i);if(!m)return;
const day=Number(m[1]);if(day<1||day>15)return;
window.__E9_U01_EVIDENCE_V1__=true;
document.documentElement.dataset.e9U01Evidence="v1";
const css=document.createElement("link");css.rel="stylesheet";css.href="/Khaemenes_High.github.io/courses/language-arts/english-9/assets/unit01-evidence-v1.css?v=20261115";css.dataset.e9U01EvidenceCss="1";document.head.append(css);

const MAP={
1:{recall:"Before reading, define the difference between something a text directly states and something a reader infers. If you are unsure, write your best distinction first.",spacing:"Prequestion · establishes a baseline before instruction.",transfer:"Today: separate observation from inference."},
2:{recall:"Close yesterday's page. From memory, write one observation and one inference you made about Lena. What evidence made the inference reasonable?",spacing:"Retrieves Day 1 after one day.",transfer:"Today: connect details into a defensible pattern."},
3:{recall:"Without reopening your notes, explain why underlining everything is not useful annotation. Name one kind of note that helped Lena think.",spacing:"Retrieves Days 1–2 before a new annotation strategy.",transfer:"Today: annotate for a purpose, not decoration."},
4:{recall:"From memory, complete this chain: observation → inference → _____. Explain what makes the final step defensible rather than personal.",spacing:"Retrieves the first three days before claim construction.",transfer:"Today: turn reading evidence into a claim and reasoning."},
5:{recall:"Without notes, write the three distinctions you most need for close reading: observation vs. inference, evidence vs. assumption, and claim vs. opinion.",spacing:"Cumulative Week 1 retrieval before an unfamiliar text.",transfer:"Today: use the process independently on new reading."},
6:{recall:"One week has begun to separate you from Day 1. Without notes, reconstruct how a careful reader moves from a detail to an inference and then to a claim.",spacing:"Delayed retrieval of Week 1 knowledge.",transfer:"Today: build a specific, arguable, supportable claim."},
7:{recall:"Write your strongest Day 6 claim from memory or reconstruct its structure. What two pieces must a paragraph add so the claim becomes an argument rather than an assertion?",spacing:"Retrieves claim construction before paragraph architecture.",transfer:"Today: connect claim, evidence, warrant, and significance."},
8:{recall:"Without looking at yesterday's paragraph, state the job of a claim, the job of evidence, and the job of a warrant. Which one explains why the quotation matters?",spacing:"Retrieves Day 7 before quotation integration.",transfer:"Today: integrate evidence into your own sentence and reasoning."},
9:{recall:"Reconstruct one sentence from your analysis in meaning, not exact wording. What would make it more precise: a stronger verb, narrower claim, better evidence, or clearer warrant?",spacing:"Retrieves claim/evidence/warrant before revision.",transfer:"Today: revise ideas and language for precision."},
10:{recall:"Close all Week 2 notes. Sketch the analytical paragraph architecture from memory and list the three tests of a defensible claim.",spacing:"Cumulative Week 2 retrieval before unfamiliar transfer.",transfer:"Today: independently analyze a new literary text."},
11:{recall:"Bring two earlier skills forward without looking: (1) observation vs. inference from Week 1 and (2) the three tests of a defensible claim from Week 2. How could those skills improve a question?",spacing:"Interleaves Week 1 and Week 2 after a delay.",transfer:"Today: ask questions that demand evidence and reasoning."},
12:{recall:"From memory, define claim, evidence, and warrant. Then imagine two readers use different details from the same passage. What would you compare before deciding which interpretation is stronger?",spacing:"Retrieves Week 2 argument structure inside interpretation comparison.",transfer:"Today: compare competing readings fairly."},
13:{recall:"Without notes, summarize the strongest interpretation from Day 12 as fairly as possible before stating whether you agree. What would count as misrepresenting it?",spacing:"Retrieves comparison and adds listening accuracy.",transfer:"Today: respond to another person's reasoning, not just their conclusion."},
14:{recall:"Name one idea from Text A and one earlier skill that could help combine it with a second text. What must synthesis do beyond listing similarities?",spacing:"Retrieves evidence selection, comparison, and claim building.",transfer:"Today: use two texts to build a new conclusion."},
15:{recall:"Unit preflight, closed notes: define observation, inference, claim, evidence, warrant, paraphrase, synthesis, and attribution in your own words. Then write the sequence you use to move from unfamiliar text to defensible interpretation.",spacing:"Cumulative retrieval across all fifteen days before independent assessment.",transfer:"Today: transfer the full Unit 01 process to unfamiliar paired texts."}
};
const cfg=MAP[day];
const main=document.querySelector("main");if(!main||!cfg)return;
function make(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
const retrieve=make("section","e9-u01-retrieve");
retrieve.setAttribute("aria-label","Retrieve prior learning before looking");
retrieve.append(make("p","eyebrow","Retrieve Before Looking"));
retrieve.append(make("h2","",day===1?"Start with what you already think":"Bring earlier learning forward"));
retrieve.append(make("p","",cfg.recall));
retrieve.append(make("p","spacing-note",cfg.spacing));
retrieve.append(make("span","e9-u01-transfer",cfg.transfer));
const status=main.querySelector(".daily-status");
const gate=main.querySelector(".daily-gate");
const anchor=(gate&&!gate.hidden?gate:status)||main.querySelector(".daily-nav")||main.querySelector("header");
anchor?.insertAdjacentElement("afterend",retrieve);

const exit=make("section","e9-u01-exit");
exit.setAttribute("aria-label","Exit retrieval and correction");
exit.append(make("p","eyebrow","Exit Retrieval"));
exit.append(make("h2","","Close the lesson before checking your notes"));
const prompt=day===15
?"From memory, name the two Unit 01 moves you used most effectively today and one place your reasoning remains uncertain. Then compare that account with your preserved work; correct the account, not the independent assessment."
:"Without looking back, explain today's central move in 2–4 sentences and give one example from your own work. Then reopen the lesson, check your explanation, and correct one omission or misconception.";
exit.append(make("p","",prompt));
exit.append(make("p","spacing-note",day<15?"This idea will return in a later lesson; correction now prepares the next retrieval.":"This final retrieval becomes a study record for later cumulative review."));
const finish=main.querySelector(".daily-finish");
if(finish)finish.insertAdjacentElement("beforebegin",exit);
else main.append(exit);
})();
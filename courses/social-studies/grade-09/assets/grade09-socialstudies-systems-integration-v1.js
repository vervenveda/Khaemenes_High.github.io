(() => {
'use strict';

/*
  Grade 9 Global Studies Honors — Historical Systems Integration v1
  Purpose: connect the ProResource Empire Systems Lab to the existing weekly
  curriculum without replacing the course's historical evidence requirements.

  Canonical mastery gate: 80% across all student-facing mastery gates.
  HonorsTarget remains a reporting/grade distinction, not a progression gate.
*/

const COURSE = window.KHAEMENES_SOCIAL_STUDIES_DATA;
if (!COURSE?.metadata) return;

const MASTER = 80;
COURSE.metadata.passingTarget = MASTER;
COURSE.metadata.masteryTarget = MASTER;
COURSE.metadata.masteryPolicy = '80% across all mastery gates';

const LAB_URL = 'https://github.com/vervenveda/proresource_hub.github.io/blob/main/Protools/empire-systems-lab_index.html';
const ROADMAP_URL = './systems-lab-roadmap.html';

const stages = [
  { weeks:[1,2], name:'Observer', focus:'Identify systems, variables, observations, predictions, and model limitations.', task:'Observe one variable change. Record a prediction, result, and one thing the model cannot establish.' },
  { weeks:[3,4,5], name:'Mapper', focus:'Connect geography, environment, resources, settlement, and political organization.', task:'Map a historical system and identify at least two interacting conditions before making a causal claim.' },
  { weeks:[6,7,8], name:'Causation Investigator', focus:'Separate correlation, mechanism, and causation.', task:'Record one model observation, two alternative explanations, and the evidence needed to discriminate among them.' },
  { weeks:[9,10,11,12], name:'Network Analyst', focus:'Trace networks among cities, states, religions, technologies, and knowledge.', task:'Trace one network pathway and identify a feedback, dependency, or unintended consequence.' },
  { weeks:[13,14,15,16,17], name:'Exchange Analyst', focus:'Analyze flows of goods, people, ideas, technology, opportunity, and cost.', task:'Compare a model pathway with historical exchange evidence and identify who gains, who bears costs, and what is missing.' },
  { weeks:[18,19,20,21,22,23], name:'Historical Investigator', focus:'Use scenarios to generate questions and then test them against historical evidence.', task:'Run or inspect a scenario, preserve the output, corroborate it with primary/secondary evidence, and revise the conclusion if needed.' },
  { weeks:[24,25], name:'Systems Analyst', focus:'Analyze institutions, rights, revolutions, ideals, outcomes, and structural tradeoffs.', task:'Build an ideals-versus-outcomes comparison and identify at least one structural tradeoff and one counterexample.' },
  { weeks:[26,27], name:'Applied Analyst', focus:'Connect industrialization and economic systems to welfare, institutions, and distribution.', task:'Use controlled modeling, record distributional effects, identify model limitations, and corroborate with historical evidence.' },
  { weeks:[28,29,30,31,32,33,34,35,36], name:'Forensic Historian', focus:'Construct and test complex historical systems arguments.', task:'Construct a scenario, compare alternatives, investigate agency/resistance, document uncertainty, and produce a qualified causal argument.' }
];

function stageFor(week) {
  return stages.find(s => s.weeks.includes(Number(week))) || stages[stages.length - 1];
}

function selectedWeek() {
  const urlWeek = Number(new URLSearchParams(location.search).get('week'));
  if (urlWeek >= 1 && urlWeek <= 36) return urlWeek;
  const active = document.querySelector('#weekList .weekBtn.active, #weekList .weekButton.active');
  const n = Number(active?.dataset?.week || active?.getAttribute('data-week'));
  return n >= 1 && n <= 36 ? n : 1;
}

function inject() {
  const content = document.getElementById('content');
  if (!content || document.getElementById('ss9SystemsCheckpoint')) return;
  const week = selectedWeek();
  const data = COURSE.weeks?.find(w => Number(w.week) === week);
  const stage = stageFor(week);
  if (!data) return;

  const card = document.createElement('section');
  card.id = 'ss9SystemsCheckpoint';
  card.className = 'card';
  card.innerHTML = `
    <div class="pills"><span class="pill">Historical Systems Laboratory</span><span class="pill">Weeks ${stage.weeks[0]}–${stage.weeks[stage.weeks.length-1]}</span><span class="pill">${stage.name}</span></div>
    <h2>Systems Thinking Checkpoint · Week ${week}</h2>
    <p><strong>Purpose:</strong> ${stage.focus}</p>
    <div class="notice"><strong>This is a reasoning laboratory, not a substitute for historical evidence.</strong> Simulation output may generate observations and hypotheses. Historical claims must still be tested against appropriate primary and secondary evidence.</div>
    <h3>Weekly connection</h3>
    <p>${data.title}: ${data.essentialQuestion}</p>
    <h3>Student checkpoint</h3>
    <p>${stage.task}</p>
    <ol>
      <li>State the historical question or claim you are investigating.</li>
      <li>Identify the relevant variables, actors, institutions, geography, or networks.</li>
      <li>Record what the model or activity actually shows.</li>
      <li>Identify at least one alternative explanation or limitation.</li>
      <li>Corroborate the conclusion with historical evidence before treating it as a historical claim.</li>
    </ol>
    <div class="actions">
      <a class="button secondary" href="${ROADMAP_URL}">View Systems Roadmap</a>
      <a class="button" href="${LAB_URL}" target="_blank" rel="noopener">Open Empire Systems Lab</a>
    </div>
    <p class="small"><strong>Mastery standard:</strong> 80% is the canonical mastery threshold. A systems checkpoint does not create a second grading gate.</p>`;

  content.prepend(card);
}

function schedule() { requestAnimationFrame(() => setTimeout(inject, 0)); }

const style = document.createElement('style');
style.id = 'ss9-systems-integration-v1-style';
style.textContent = `#ss9SystemsCheckpoint{border-top:3px solid #b48b45} #ss9SystemsCheckpoint .actions{display:flex;flex-wrap:wrap;gap:9px} #ss9SystemsCheckpoint ol{padding-left:1.35rem}`;
document.head.appendChild(style);

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
else schedule();

new MutationObserver(() => {
  const existing = document.getElementById('ss9SystemsCheckpoint');
  if (!existing) schedule();
}).observe(document.getElementById('content') || document.documentElement, {childList:true,subtree:true});

document.addEventListener('click', () => setTimeout(() => {
  const old = document.getElementById('ss9SystemsCheckpoint');
  if (old) old.remove();
  schedule();
}, 0));
})();

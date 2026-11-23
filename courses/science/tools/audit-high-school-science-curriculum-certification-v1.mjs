#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");
const scienceRoot = path.join(repoRoot, "courses", "science");
const argv = new Set(process.argv.slice(2));
const jsonMode = argv.has("--json");
const strictMode = argv.has("--strict");

const COURSES = [
  { grade: 9, slug: "integrated-science-9", label: "Integrated Science 9", expected: 180, engine: "science-9" },
  { grade: 10, slug: "biology-10", label: "Biology & Biotechnology 10", expected: 180, engine: "upper-science" },
  { grade: 11, slug: "chemistry-11", label: "Chemistry & Materials Science 11", expected: 180, engine: "upper-science" },
  { grade: 12, slug: "physics-engineering-12", label: "Physics & Engineering 12", expected: 180, engine: "upper-science" }
];

const CORE = [
  ["phenomenon", /phenomen|hook|notice|observe|prediction/i],
  ["explicitTeaching", /explicit[- ]teaching|deep lesson|concept|reading|instruction/i],
  ["vocabulary", /vocab|key term|terminology/i],
  ["workedExample", /worked[- ]example|worked example|example\s*\d|model solution/i],
  ["dataOrModel", /data|graph|table|model|diagram/i],
  ["investigation", /investigat|laborator|lab\b|simulation|field study|engineering challenge/i],
  ["practice", /guided[- ]practice|independent[- ]practice|practice check|formative/i],
  ["misconception", /misconception|common error|why this is wrong/i],
  ["retrieval", /retrieval|recall|review challenge|spaced review/i],
  ["evidence", /claim.{0,20}evidence.{0,20}reason|\bCER\b|constructed explanation|evidence revision/i],
  ["differentiation", /foundation|core pathway|extended|scaffold|differentiation/i],
  ["teacherGuidance", /teacher guidance|teacher note|parent note|expected response|rubric/i],
  ["standards", /NGSS|standard|HS-[A-Z]{2,4}\d/i]
];

const DISCIPLINE = {
  "integrated-science-9": [
    ["crossDisciplinaryReasoning", /system|cause and effect|energy and matter|scale|stability and change/i],
    ["sourceEvaluation", /source evaluation|source reliability|credible source|evidence quality/i]
  ],
  "biology-10": [
    ["structureFunctionOrMechanism", /structure.{0,20}function|mechanism|homeostasis|feedback|gene|cell|ecosystem/i],
    ["biologicalEvidence", /biological evidence|population|trait|molecular|organism|ecolog/i]
  ],
  "chemistry-11": [
    ["particleOrMolecularModel", /particle|atom|ion|molecule|bond|electron|mole/i],
    ["quantitativeChemistry", /stoichiometr|molar|mol\b|concentration|enthalpy|equilibrium|pH|rate law|dimensional analysis/i]
  ],
  "physics-engineering-12": [
    ["mathematicalModel", /equation|calculate|vector|graph|slope|model|quantitative/i],
    ["engineeringDecision", /constraint|criterion|prototype|design|trade[- ]?off|optimi[sz]|engineering/i]
  ]
};

const SAFETY = /safety|hazard|risk|stop condition|supervision|safe alternative/i;
const UNCERTAINTY = /uncertaint|error|precision|accuracy|limitation|source of error/i;
const ENGINE_UPPER = /data-science-engine=["']upper-science-v1["']|upper-science-instruction-engine-v1\.js/i;
const ENGINE_G9 = /science-instruction-engine|data-science-engine|science lesson engine|curriculum-contract|lesson-engine/i;
const WORD_TARGET = { 9: 350, 10: 500, 11: 500, 12: 500 };

const strip = html => html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--([\s\S]*?)-->/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&[a-z#0-9]+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function rel(file) { return path.relative(repoRoot, file).split(path.sep).join("/"); }
function lessonFiles(root) {
  return walk(root).filter(file => /[\\/]lessons[\\/]day-\d+\.html$/i.test(file)).sort();
}
function countWords(text) { return text ? text.split(/\s+/).filter(Boolean).length : 0; }
function has(html, re) { return re.test(html); }
function pct(n, d) { return d ? Math.round((n / d) * 1000) / 10 : 0; }

const report = {
  schema: "khaemenes.high-school-science.curriculum-certification.v1",
  generatedAt: new Date().toISOString(),
  expectedDailyLessons: 720,
  totals: { lessons: 0, engineMounted: 0, coreCertified: 0, depthCertified: 0, inquiryEvidence: 0, vocabulary: 0, evidenceReasoning: 0 },
  courses: [],
  bubbles: []
};

for (const course of COURSES) {
  const root = path.join(scienceRoot, course.slug);
  const files = lessonFiles(root);
  const result = {
    grade: course.grade,
    slug: course.slug,
    label: course.label,
    expectedLessons: course.expected,
    lessons: files.length,
    counts: { engineMounted: 0, coreCertified: 0, depthCertified: 0, inquiryEvidence: 0, vocabulary: 0, evidenceReasoning: 0, safety: 0, uncertainty: 0, disciplineDepth: 0 },
    missingCore: Object.fromEntries(CORE.map(([key]) => [key, 0])),
    missingDiscipline: Object.fromEntries((DISCIPLINE[course.slug] || []).map(([key]) => [key, 0])),
    shallow: []
  };

  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const plain = strip(html);
    const words = countWords(plain);
    const engineMounted = course.engine === "upper-science" ? has(html, ENGINE_UPPER) : has(html, ENGINE_G9);
    const core = {};
    for (const [key, re] of CORE) {
      core[key] = has(html, re);
      if (!core[key]) result.missingCore[key]++;
    }
    const discipline = {};
    for (const [key, re] of DISCIPLINE[course.slug] || []) {
      discipline[key] = has(html, re);
      if (!discipline[key]) result.missingDiscipline[key]++;
    }
    const coreCertified = Object.values(core).every(Boolean);
    const disciplineDepth = Object.values(discipline).every(Boolean);
    const depthCertified = coreCertified && disciplineDepth && words >= WORD_TARGET[course.grade];

    if (engineMounted) result.counts.engineMounted++;
    if (coreCertified) result.counts.coreCertified++;
    if (depthCertified) result.counts.depthCertified++;
    if (core.investigation) result.counts.inquiryEvidence++;
    if (core.vocabulary) result.counts.vocabulary++;
    if (core.evidence) result.counts.evidenceReasoning++;
    if (has(html, SAFETY)) result.counts.safety++;
    if (has(html, UNCERTAINTY)) result.counts.uncertainty++;
    if (disciplineDepth) result.counts.disciplineDepth++;

    const missing = Object.entries(core).filter(([, ok]) => !ok).map(([key]) => key);
    const missingD = Object.entries(discipline).filter(([, ok]) => !ok).map(([key]) => key);
    if (!depthCertified && result.shallow.length < 40) {
      result.shallow.push({ path: rel(file), words, engineMounted, missing: [...missing, ...missingD] });
    }
  }

  result.rates = Object.fromEntries(Object.entries(result.counts).map(([key, value]) => [key, pct(value, result.lessons)]));
  report.courses.push(result);
  report.totals.lessons += result.lessons;
  for (const key of ["engineMounted", "coreCertified", "depthCertified", "inquiryEvidence", "vocabulary", "evidenceReasoning"]) report.totals[key] += result.counts[key];
}

report.totals.rates = Object.fromEntries(
  Object.entries(report.totals)
    .filter(([key]) => key !== "lessons" && key !== "rates")
    .map(([key, value]) => [key, pct(value, report.totals.lessons)])
);

for (const course of report.courses) {
  if (course.lessons !== course.expectedLessons) report.bubbles.push(`${course.label}: expected ${course.expectedLessons} daily lessons, found ${course.lessons}.`);
  if (course.rates.engineMounted < 100) report.bubbles.push(`${course.label}: ${course.rates.engineMounted}% of daily lessons visibly mount the designated science engine.`);
  if (course.rates.depthCertified < 100) report.bubbles.push(`${course.label}: ${course.rates.depthCertified}% meet the complete visible depth contract; certify remaining lessons before A+++ release.`);
  if (course.rates.inquiryEvidence < 25) report.bubbles.push(`${course.label}: only ${course.rates.inquiryEvidence}% of daily pages visibly expose investigation/lab/simulation/design language; verify the >=25% inquiry target.`);
  if (course.rates.uncertainty < 50) report.bubbles.push(`${course.label}: uncertainty/error/limitations are visible on only ${course.rates.uncertainty}% of daily lessons; strengthen evidence-quality progression.`);
}

if (jsonMode) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("Khaemenes Academy — High School Science Curriculum Certification Audit v1");
  console.log(`Daily lessons: ${report.totals.lessons}/${report.expectedDailyLessons}`);
  for (const course of report.courses) {
    console.log(`\nGrade ${course.grade} — ${course.label}`);
    console.log(`  lesson inventory: ${course.lessons}/${course.expectedLessons}`);
    console.log(`  engine mounted: ${course.counts.engineMounted}/${course.lessons} (${course.rates.engineMounted}%)`);
    console.log(`  complete core contract: ${course.counts.coreCertified}/${course.lessons} (${course.rates.coreCertified}%)`);
    console.log(`  complete depth certification: ${course.counts.depthCertified}/${course.lessons} (${course.rates.depthCertified}%)`);
    console.log(`  inquiry/lab/design evidence: ${course.counts.inquiryEvidence}/${course.lessons} (${course.rates.inquiryEvidence}%)`);
    console.log(`  vocabulary visible: ${course.counts.vocabulary}/${course.lessons} (${course.rates.vocabulary}%)`);
    console.log(`  CER/constructed evidence visible: ${course.counts.evidenceReasoning}/${course.lessons} (${course.rates.evidenceReasoning}%)`);
    console.log(`  safety visible: ${course.counts.safety}/${course.lessons} (${course.rates.safety}%)`);
    console.log(`  uncertainty/limitations visible: ${course.counts.uncertainty}/${course.lessons} (${course.rates.uncertainty}%)`);
    console.log(`  discipline-specific depth markers: ${course.counts.disciplineDepth}/${course.lessons} (${course.rates.disciplineDepth}%)`);
    const topMissing = Object.entries(course.missingCore).sort((a,b)=>b[1]-a[1]).slice(0,5).filter(([,n])=>n>0);
    if (topMissing.length) console.log("  largest visible contract gaps: " + topMissing.map(([k,n])=>`${k} ${n}`).join(", "));
  }
  console.log("\nBubbles to push out:");
  if (report.bubbles.length) report.bubbles.forEach((x, i) => console.log(`  ${i + 1}. ${x}`));
  else console.log("  none detected by the source-level certification audit");
  console.log("\nInterpretation: source-level certification is intentionally conservative. A missing marker means the element is not clearly visible in the daily page source; it does not prove the underlying curriculum lacks the concept. Browser interaction, scientific-answer review, and human evaluation remain separate release gates.");
}

const inventoryFailure = report.totals.lessons !== report.expectedDailyLessons || report.courses.some(c => c.lessons !== c.expectedLessons);
const strictFailure = strictMode && report.courses.some(c =>
  c.rates.engineMounted < 100 ||
  c.rates.coreCertified < 100 ||
  c.rates.depthCertified < 100
);
if (inventoryFailure || strictFailure) process.exitCode = 1;

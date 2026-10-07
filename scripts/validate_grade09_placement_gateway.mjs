import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
  checks.push(message);
}

function compile(label, source) {
  new vm.Script(source, { filename: label });
  checks.push(`compiled ${label}`);
}

function scriptSources(html) {
  return [...html.matchAll(/<script\\b[^>]*\\bsrc=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
}

const registry = read("grades/grade-09/student-profile/student-course-registry.js");
const catalog = JSON.parse(read("courses/shared/course-entry-catalog.json"));
const preAlgebraIndex = read("courses/mathematics/pre-algebra/index.html");
const englishIndex = read("courses/language-arts/english-9/index.html");
const scienceIndex = read("courses/science/integrated-science-9/index.html");
const socialIndex = read("courses/social-studies/grade-09/index.html");
const socialApp = read("courses/social-studies/grade-09/app.html");
const preAlgebraGate = read("courses/mathematics/pre-algebra/assets/prealgebra-course-gates-v1.js");
const socialGate = read("courses/social-studies/grade-09/assets/grade09-entry-gate.js");

for (const courseId of [
  "pre-algebra",
  "algebra-1",
  "english-9",
  "integrated-science-9",
  "global-studies-9"
]) {
  assert(registry.includes(`id:"${courseId}"`), `Grade 09 registry contains ${courseId}`);
}

for (const catalogId of [
  "math-prealgebra",
  "math-algebra1",
  "english-9",
  "integrated-science-9",
  "grade09-global-studies-honors"
]) {
  assert(
    catalog.courses.some((course) => course.course_id === catalogId),
    `shared entry catalog contains ${catalogId}`
  );
}

assert(
  scriptSources(preAlgebraIndex).includes("assets/prealgebra-course-gates-v1.js"),
  "Pre-Algebra entry loads its existing placement gate"
);
assert(
  scriptSources(englishIndex).some((src) => src.includes("shared/course-entry-contract.js")) &&
    scriptSources(englishIndex).some((src) => src.includes("assets/course.js")),
  "English 9 entry loads the shared contract and course gate"
);
assert(
  scriptSources(scienceIndex).some((src) => src.includes("shared/course-entry-contract.js")) &&
    scriptSources(scienceIndex).some((src) => src.includes("assets/science9-entry-gate.js")),
  "Integrated Science 9 entry loads the shared contract and course gate"
);
for (const [label, html] of [
  ["Global Studies 9 entrance", socialIndex],
  ["Global Studies 9 official course", socialApp]
]) {
  const sources = scriptSources(html);
  assert(
    sources.some((src) => src.includes("shared/course-entry-contract.js")) &&
      sources.some((src) => src.includes("assets/grade09-entry-gate.js")),
    `${label} loads the shared contract and course gate`
  );
}
assert(
  scriptSources(socialIndex).some((src) => src.includes("assets/grade09-records.js")),
  "Global Studies 9 entrance loads its record guard"
);
assert(
  scriptSources(socialApp).some((src) => src.includes("assets/grade09-records.js")),
  "Global Studies 9 official course loads its record guard"
);

assert(
  !socialGate.includes("return {allow:true,pathway:'returning_learner'}"),
  "Social Studies no longer grants entry from saved work alone"
);
assert(
  socialGate.includes("hasReturningWork") &&
    socialGate.includes("Complete readiness before resuming"),
  "Social Studies preserves returning work while requiring readiness"
);
assert(
  registry.split("/Khaemenes_High.github.io/").length - 1 === 1,
  "Grade 09 registry keeps only its legacy-route normalizer"
);

compile("student-course-registry.js", registry);
compile("prealgebra-course-gates-v1.js", preAlgebraGate);
compile("grade09-entry-gate.js", socialGate);

function socialDecision(values) {
  const context = {
    window: {
      KhaemenesSS9Records: {
        storage: {
          getItem(key) {
            return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : null;
          }
        },
        isBlocked() {
          return false;
        }
      },
      KhaemenesCourseEntryContract: {
        overallReadyPercent: 80,
        essentialStrandFloorPercent: 80,
        isReady(record, strands) {
          return record?.route === "advance" &&
            Number(record.overall_percent) >= 80 &&
            strands.every((strand) => Number(record.strand_scores?.[strand]) >= 80 &&
              Number(record.strand_scores?.[strand]) <= 100);
        }
      }
    },
    document: {
      readyState: "loading",
      addEventListener() {}
    }
  };
  vm.runInNewContext(socialGate, context, { filename: "grade09-entry-gate.js" });
  return context.window.KhaemenesSocialStudies9Entry.decision();
}

const savedWork = JSON.stringify({
  activeId: "learner-1",
  students: [{
    id: "learner-1",
    completedLessons: { week1: [true] },
    assignments: {},
    quizzes: {},
    exams: {}
  }]
});
const blockedReturningDecision = socialDecision({
  khaemenes_grade09_social_studies_v1: savedWork
});
assert(
  blockedReturningDecision.allow === false &&
    blockedReturningDecision.title === "Complete readiness before resuming",
  "returning Social Studies work cannot bypass placement"
);

const strandScores = {
  claim_evidence_inference: 90,
  source_provenance_corroboration: 90,
  chronology_causation_change: 90,
  geography_maps_networks: 90,
  data_quantitative_reasoning: 90,
  argument_comparison_ethics: 90
};
const readyDecision = socialDecision({
  khaemenes_grade09_social_studies_v1: JSON.stringify({
    activeId: "learner-1",
    students: [{ id: "learner-1", completedLessons: {}, assignments: {}, quizzes: {}, exams: {} }]
  }),
  khaemenes_ss9_readiness_v1: JSON.stringify({
    route: "advance",
    overall_percent: 90,
    strand_scores: strandScores
  })
});
assert(
  readyDecision.allow === true && readyDecision.pathway === "core_36_week",
  "ready Social Studies learner enters the core pathway"
);

console.log(`Grade 09 placement gateway validation passed (${checks.length} checks).`);

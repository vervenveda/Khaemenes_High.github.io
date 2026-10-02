import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const failures = [];
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const json = relative => JSON.parse(read(relative));
const must = (condition, message) => { if (!condition) failures.push(message); };

const contract = json("grades/grade-09/placement-contract.json");
must(contract.authority === "STOS", "placement authority must be STOS");
must(contract.reference_implementation === "courses/mathematics/pre-algebra", "Pre-Algebra must remain the reference implementation");
must(contract.mastery_threshold_percent === 80, "mastery threshold must be 80%");
must(contract.official_course_duration_weeks === 36, "official duration must be 36 weeks");
must(contract.foundation_duration_weeks === 6, "foundation duration must be six weeks");
must(contract.supported_duration_weeks === 42, "supported duration must be 42 weeks");
must(contract.readiness_counts_toward_official_grade === false, "readiness must remain outside the official grade");
must(contract.foundation_counts_toward_official_grade === false, "foundation work must remain outside the official grade");
must(contract.subjects?.mathematics?.course_options?.includes("math-prealgebra"), "Grade 09 math must preserve Pre-Algebra placement");
must(contract.subjects?.mathematics?.course_options?.includes("math-algebra1"), "Grade 09 math must preserve Algebra I placement");

const pre = json("courses/mathematics/pre-algebra/course-map.json");
must(pre.course?.duration_weeks === contract.official_course_duration_weeks, "Pre-Algebra official duration disagrees with Grade 09 contract");
must(pre.course?.supported_duration_weeks === contract.supported_duration_weeks, "Pre-Algebra supported duration disagrees with Grade 09 contract");
must(pre.conditional_unit_0?.duration_weeks === contract.foundation_duration_weeks, "Pre-Algebra Unit 0 duration disagrees with Grade 09 contract");
must(pre.readiness_gateway?.mastery_threshold_percent === contract.mastery_threshold_percent, "Pre-Algebra readiness threshold disagrees with Grade 09 contract");

const scienceRouting = read("courses/science/integrated-science-9/diagnostic/readiness-routing.js");
must(/const MASTERY = 80;/.test(scienceRouting), "Science 9 overall readiness threshold must be 80%");
must(/const ESSENTIAL_MIN = 80;/.test(scienceRouting), "Science 9 essential-strand threshold must be 80%");
must(fs.existsSync(path.join(root, "courses/science/integrated-science-9/foundations/week-06.html")), "Science 9 must preserve all six Foundation Weeks");
must(fs.existsSync(path.join(root, "courses/science/integrated-science-9/units/unit-01/unit01-entry-gate.js")), "Science 9 Unit 01 entry gate is missing");

const socialShell = read("courses/social-studies/grade-09/app.html");
const socialGate = read("courses/social-studies/grade-09/assets/grade09-entry-gate.js");
must(/course-data\.js/.test(socialShell) && /app\.js/.test(socialShell), "Social Studies official course shell is incomplete");
must(/grade09-entry-gate\.js/.test(socialShell), "Social Studies official course shell must load its entry gate");
must(/supported_42_week/.test(socialGate) && /core_36_week/.test(socialGate), "Social Studies gate must distinguish 36- and 42-week pathways");
must(/scores\.length === 6/.test(socialGate) && /score >= MASTERY/.test(socialGate), "Social Studies must verify all six Foundation Weeks at 80%");

const required = [
  "courses/language-arts/english-9",
  "courses/mathematics/pre-algebra",
  "courses/mathematics/algebra-1",
  "courses/science/integrated-science-9",
  "courses/social-studies/grade-09"
];
for (const relative of required) must(fs.existsSync(path.join(root, relative)), `${relative} is missing`);

if (failures.length) {
  console.error("Grade 09 placement contract validation failed:");
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log("Grade 09 placement contract validation passed.");
console.log("- Pre-Algebra is preserved as the reference implementation");
console.log("- official pathway: 36 weeks");
console.log("- supported pathway: 6 + 36 = 42 weeks");
console.log("- mastery threshold: 80%");
console.log("- mathematics course placement remains separate from duration pathway");
console.log("- Science 9 uses 80% overall and essential-strand readiness thresholds");
console.log("- Social Studies 9 official application and fail-closed entrance are present");

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve('courses/mathematics/algebra-1/readiness');
const contractPath = path.join(root, 'transition-contract.json');
const requiredIncoming = new Set([
  'PA.NUMBER_RATIONAL_FLUENCY',
  'PA.PROPORTIONAL_REASONING',
  'PA.POWERS_ROOTS',
  'PA.EXPRESSIONS',
  'PA.EQUATIONS',
  'PA.INEQUALITIES',
  'PA.FUNCTIONS_LINEAR_RELATIONSHIPS',
  'PA.GEOMETRY_COORDINATES',
  'PA.DATA_STATISTICS',
  'PA.MODELLING'
]);
const requiredGeometry = new Set([
  'A1.REAL_NUMBERS_PRECISION',
  'A1.LINEAR_EQUATIONS',
  'A1.FUNCTIONS_LINEAR_MODELS',
  'A1.SYSTEMS_CONSTRAINTS',
  'A1.EXPONENT_RADICAL_READINESS',
  'A1.COORDINATE_GEOMETRY',
  'A1.MODELLING_REASONING'
]);
const requiredAlgebra2 = new Set([
  'A1.FUNCTIONS_LINEAR_MODELS',
  'A1.SYSTEMS_CONSTRAINTS',
  'A1.EXPONENT_RADICAL_READINESS',
  'A1.POLYNOMIAL_STRUCTURE',
  'A1.QUADRATIC_REASONING',
  'A1.STATISTICAL_EVIDENCE',
  'A1.MODELLING_REASONING'
]);

let problems = 0;
function check(condition, label) {
  if (condition) console.log(`OK ${label}`);
  else { console.error(`FAIL ${label}`); problems += 1; }
}

const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
check(contract.schema === 'khaemenes.math.transition.v1', 'transition schema is canonical v1');
check(contract.course?.id === 'KH-MATH-A1', 'transition contract belongs to Algebra I');
check(contract.course?.masteryTarget === 80, 'transition contract preserves 80% mastery target');
check(contract.principles?.courseGradeIsNotReadinessProfile === true, 'grade and readiness evidence remain separate');
check(contract.principles?.priorEvidenceInformsDiagnostic === true, 'prior evidence informs receiving diagnostic');
check(contract.principles?.diagnosticMayOverrideRouting === true, 'receiving diagnostic may adjust routing');
check(contract.principles?.unfinishedLearningDoesNotAutomaticallyBlockProgression === true, 'unfinished learning does not create an automatic progression block');

const incoming = contract.incoming?.skillFamilies ?? [];
check(contract.incoming?.from === 'KH-MATH-PA', 'incoming bridge identifies Pre-Algebra');
check(incoming.length === requiredIncoming.size, 'incoming bridge has expected skill-family count');
for (const id of requiredIncoming) check(incoming.some(x => x.source === id), `incoming bridge maps ${id}`);
check(incoming.every(x => typeof x.target === 'string' && x.target.startsWith('A1.')), 'all incoming mappings target Algebra I skill families');
check(incoming.every(x => Array.isArray(x.supports) && x.supports.length > 0), 'all incoming mappings identify Algebra I support units');

const geometry = contract.outgoing?.geometry?.skillFamilies ?? [];
check(contract.outgoing?.geometry?.course === 'KH-MATH-GEO', 'outgoing Geometry bridge identifies Geometry');
for (const id of requiredGeometry) check(geometry.some(x => x.source === id), `Geometry bridge exports ${id}`);
check(geometry.every(x => typeof x.target === 'string' && x.target.startsWith('GEO.')), 'all Geometry mappings target Geometry skill families');

const algebra2 = contract.outgoing?.algebra2?.skillFamilies ?? [];
check(contract.outgoing?.algebra2?.course === 'KH-MATH-A2', 'outgoing Algebra II bridge identifies Algebra II');
for (const id of requiredAlgebra2) check(algebra2.some(x => x.source === id), `Algebra II bridge exports ${id}`);
check(algebra2.every(x => typeof x.target === 'string' && x.target.startsWith('A2.')), 'all Algebra II mappings target Algebra II skill families');

const fields = new Set(contract.evidenceRecord?.requiredFields ?? []);
for (const field of ['courseId','completionStatus','masteryTarget','skillEvidence','supportFlags','recommendedPathway','evidenceTimestamp']) {
  check(fields.has(field), `evidence record requires ${field}`);
}
check((contract.evidenceRecord?.allowedStatus ?? []).join('|') === 'Beginning|Developing|Proficient|Mastered', 'shared mastery status vocabulary is preserved');
check(typeof contract.routing?.rule === 'string' && contract.routing.rule.length > 20, 'routing rule is documented');

if (problems) {
  console.error(`Algebra I readiness bridge validation failed: ${problems} problem(s).`);
  process.exit(1);
}
console.log('Algebra I readiness bridge validation passed.');

Course Charter — International Integrated Science 9
Identity
Course: International Integrated Science 9
Code: KH-SCI-IIS9
Subtitle: Life, Matter, Energy and Earth Systems
Grade: 9
Length: 36 weeks
Instructional time: Approximately 135–150 hours
Recommended credit: One high-school science credit, subject to local requirements
Companion mathematics: Grade 9 Pre-Algebra
Purpose

This course develops scientifically literate students who can explain phenomena, conduct safe investigations, analyze data, evaluate information, design solutions, and make evidence-aware decisions.

It is an integrated course, not a biology-only course. It combines:

Biology
Chemistry
Physics
Earth and space science
Environmental science
Engineering
Scientific information literacy
International benchmark model

The curriculum is a Khaemenes synthesis informed by widely used international and national frameworks. It does not claim automatic legal equivalence, accreditation, or examination-board approval.

Formal reporting must use a separate jurisdiction-specific standards mapping reviewed for the student's location or program.

Learning pathways
Foundation

Vocabulary support, visual models, smaller steps, guided calculations, extra examples, scaffolded laboratories, and confidence-building practice.

Core

The complete Grade 9 sequence and required scientific practices.

Extended

Honors depth, unfamiliar applications, more independent investigation, advanced data interpretation, research, mathematical modeling, and deeper evaluation of scientific impacts.

A student may use different pathways in different skills.

Course-wide outcomes

Students will:

Explain major concepts across life, physical, chemical, Earth, environmental, and space science.
Ask testable questions and plan safe, ethical investigations.
Use measurements, SI units, tables, graphs, models, and introductory mathematics.
Analyze uncertainty, variability, anomalies, limitations, correlation, and causation.
Construct and evaluate evidence-based scientific explanations.
Research scientific information and judge source quality.
Apply engineering design through criteria, constraints, testing, and revision.
Examine ethical, cultural, economic, civic, and environmental consequences.
Communicate clearly to scientific and public audiences.
Maintain a laboratory, fieldwork, project, and learning portfolio.
Non-negotiable quality rules
Scored objective questions must have exactly one definitive, defensible answer.
Constructed responses must use explicit rubrics with observable evidence.
No unspecified convention may determine whether an answer is correct.
Safety instructions must be visible before materials or procedures.
Home-safe and supervised-laboratory activities must be clearly distinguished.
Simulations may supplement but should not routinely replace hands-on observation.
Claims, graphs, quotations, datasets, and images require source attribution.
Scientific uncertainty must not be misrepresented as ignorance or certainty.
Cultural and traditional knowledge must be presented respectfully and contextually.
Student privacy and local-first records must be protected.
Completion evidence

A complete course record should include:

Unit mastery records
Laboratory and fieldwork portfolio
Midterm assessment
Final examination
Sustainable engineering capstone
Source-evaluation assignment
Final teacher or parent-educator verification
Certificate of completion
Transcript-ready course summary
"""), encoding="utf-8")

weeks_rows = "\n".join(
f"| {u['number']:02d} | {u['title']} | {u['weeks']} | {u['path']} |"
for u in units
)
(course_root / "CURRICULUM_MAP.md").write_text(textwrap.dedent(f"""\

Curriculum Map — International Integrated Science 9
Thirty-six-week sequence
Unit	Title	Weeks	Course path
{weeks_rows}			

Total: 36 weeks

Recurring weekly rhythm

A normal five-lesson week should include:

Phenomenon or question — observe, notice, predict, and activate prior knowledge.
Concept and model — direct instruction, reading, vocabulary, diagrams, and worked examples.
Practice and evidence — calculations, models, source analysis, or data interpretation.
Investigation or engineering — hands-on, field, dataset, or simulation work.
Synthesis and mastery — explanation, quiz, reflection, correction, and portfolio update.

The rhythm may be adapted for laboratories requiring longer blocks.

Cross-course threads

These must recur in every unit:

Measurement and SI units
Models and systems
Cause and effect
Energy and matter
Scale and proportion
Stability and change
Data quality and uncertainty
Source evaluation
Ethics and scientific impacts
Engineering design
Environmental responsibility
Scientific communication
Major assessments
Diagnostic and safety verification: Week 1
Quarterly interdisciplinary investigations: approximately Weeks 9, 18, 27, and 36
Midterm practical and written assessment: after Unit 06
Final cumulative examination: after Unit 12
Sustainable engineering capstone: Units 10–12, completed in Unit 12
"""), encoding="utf-8")

(course_root / "ASSESSMENT_FRAMEWORK.md").write_text(textwrap.dedent("""\

Assessment Framework
Four equal domains
Domain	Weight
Scientific knowledge and application	25%
Inquiry and investigation design	25%
Data processing, interpretation and evaluation	25%
Science, society, ethics and communication	25%
Required assessment types
Readiness diagnostic
Safety verification
Unit mastery checks
Laboratory and field investigations
Data-analysis tasks
Model construction and critique
Scientific source-evaluation tasks
Quarterly interdisciplinary projects
Midterm practical and written assessment
Final cumulative examination
Sustainable engineering capstone
Laboratory and learning portfolio
Definitive-answer standard

Every automatically or objectively scored item must:

Have one clearly intended answer.
State all required conventions, units, rounding rules, assumptions, and reference conditions.
Avoid two equivalent answer choices.
Avoid subjective words such as “best” unless criteria are explicitly supplied.
Avoid testing trivia that is not part of the taught curriculum.
Use distractors that are wrong for identifiable scientific reasons.
Include an answer explanation.
Be independently checked against the lesson, formula, data, and source.
Constructed-response standard

Every open response must include a rubric specifying:

Required scientific idea
Required evidence or data
Required reasoning
Vocabulary or representation expectations
Accuracy criteria
Communication criteria
Acceptable alternative reasoning
Common misconceptions
Point allocation or mastery descriptors
Mastery scale
Beginning — needs direct instruction and supported practice.
Developing — partial understanding or inconsistent use of evidence.
Proficient — accurate application in familiar contexts.
Mastered — accurate explanation, transfer, evaluation, and application in unfamiliar contexts.
Reassessment

Students may correct work and reassess essential outcomes after feedback. The learning record should retain the first attempt, feedback, revised evidence, and final mastery level.

Assessment integrity

Teacher and answer-key resources must not be linked from the public student navigation. Public repositories should avoid placing unprotected complete answer keys next to student assessments when practical.
"""), encoding="utf-8")

(course_root / "LAB_SAFETY_FRAMEWORK.md").write_text(textwrap.dedent("""\

Laboratory and Field Safety Framework
Safety tiers
Tier 1 — Independent home-safe

Low-risk observation, modeling, measurement, household-material activities, digital investigations, and outdoor observations that do not require hazardous chemicals, flames, pressure, blades, live electricity, unknown organisms, or ingestion.

Tier 2 — Responsible-adult supervision

Activities using heat, glassware, small electrical components, household chemicals, biological samples, tools, or field locations where direct supervision and a documented risk check are required.

Tier 3 — Qualified laboratory only

Activities involving concentrated chemicals, open flame, pressurized systems, mains electricity, radiation sources, culturing unknown microorganisms, dissections requiring regulated materials, hazardous waste, or specialized protective equipment.

Tier 3 activities may be studied through demonstrations, datasets, simulations, videos, or supervised partner laboratories when facilities are unavailable.

Required lesson safety panel

Every investigation must state:

Safety tier
Required supervision
Personal protective equipment
Materials
Known hazards
Prohibited actions
Disposal and cleanup
Allergy, accessibility, and environmental considerations
Emergency response
Stop conditions
Universal rules
Never taste laboratory or field materials.
Never mix substances unless the written procedure explicitly directs it.
Never use medication, bodily fluids, unknown organisms, or unknown chemicals.
Never use damaged glassware, exposed wiring, or unlabeled containers.
Keep food and drink away from investigations.
Tie back hair and secure loose clothing.
Wash hands after practical work.
Protect human and animal welfare.
Minimize environmental disturbance and waste.
Obtain permission before collecting samples or entering field sites.
Record incidents, near misses, and procedural changes.
Digital and data safety
Use privacy-respecting datasets.
Do not publish a student's precise home location.
Remove personal identifiers from health or family data.
Do not require accounts when an account-free source is available.
Distinguish simulated data from measured data.
Safety validation gate

An investigation cannot be released until a reviewer confirms that the tier, materials, supervision, hazards, disposal, accessibility, and emergency directions are complete and internally consistent.
"""), encoding="utf-8")

(course_root / "MATERIALS_FRAMEWORK.md").write_text(textwrap.dedent("""\

Materials Framework
Purpose

Science 9 should remain rigorous without requiring an expensive formal laboratory. Every unit should offer an appropriate combination of home-safe, supervised, field, dataset, and simulation options.

Core reusable kit

Recommended low-cost reusable materials:

Metric ruler and measuring tape
Stopwatch or timer
Thermometer suitable for the activity
Digital kitchen scale
Measuring cups or graduated containers
Graph paper and science notebook
Calculator
Safety glasses
Disposable gloves for appropriate supervised tasks
Flashlight
Magnifying lens
Batteries, insulated wires, switches, lamps or LEDs, and resistors for low-voltage circuits
Simple magnets
pH paper for supervised activities
Microscope access or virtual microscopy alternative
Materials classifications

Each item must be labeled:

Reusable
Consumable
Optional
Household
School laboratory
Digital
Field
Accessibility substitute
Prohibited for independent use
Equity rule

No essential learning outcome may depend solely on a costly material. Where equipment is unavailable, provide a scientifically meaningful alternative using public data, remote observation, a model, a simulation, or an instructor demonstration.

Procurement rule

Materials lists should use generic descriptions rather than retail links unless a specific technical specification is necessary.
"""), encoding="utf-8")

(course_root / "STANDARDS_CROSSWALK.md").write_text(textwrap.dedent("""\

International Standards Crosswalk — Planning Layer
Status

This document is a planning crosswalk, not a certification or compliance statement. Exact codes and legal requirements must be reviewed separately for each jurisdiction or examination program.

Framework roles
Framework	Primary contribution to Khaemenes Science 9
IB Middle Years Programme Sciences	Inquiry, criteria-based assessment, ethics, global contexts, reflection on scientific impacts
Cambridge lower-secondary/IGCSE science	Disciplinary rigor, laboratory experience, experimental skills, clear biology/chemistry/physics progression
Next Generation Science Standards	Three-dimensional learning, science and engineering practices, crosscutting concepts, performance expectations
Australian Curriculum Year 9	Specific integrated grade-level expectations across biological, chemical, physical, and Earth sciences
British Columbia Science 9	Integrated Grade 9 content, Earth systems, sustainability, and respectful inclusion of First Peoples knowledge
England KS3/KS4 Science	Working scientifically and strong disciplinary foundations
Singapore Lower Secondary Science	Core scientific ideas, practices, values, ethics, and application
New Zealand Science	Nature of science, local context, community knowledge, and respectful Indigenous integration
OECD PISA Science	Scientific literacy, source evaluation, evidence-based decisions, environmental agency, and real-world contexts
Course-domain crosswalk
Khaemenes domain	International alignment
Scientific inquiry and evidence	All frameworks
Cells, body systems, reproduction, inheritance	IB, Cambridge, NGSS, Australia, British Columbia, England, Singapore
Ecosystems, evolution, biodiversity	IB, Cambridge, NGSS, Australia, England, New Zealand, PISA
Atomic structure, bonding, reactions	IB, Cambridge, NGSS, Australia, British Columbia, England, Singapore
Motion, forces, energy	IB, Cambridge, NGSS, Australia, England, Singapore
Electricity, waves, information	IB, Cambridge, NGSS, British Columbia, England, Singapore
Earth systems, climate, geology, space	IB, NGSS, Australia, British Columbia, New Zealand, PISA
Engineering and sustainable design	NGSS, IB, Australia, PISA
Ethics, culture, and scientific impacts	IB, Singapore, New Zealand, British Columbia, PISA
Scientific media and source literacy	PISA, NGSS practices, IB communication and reflection
Crosswalk development rule

Each unit release must contain a STANDARDS_MAPPING.md file with:

Universal learning outcomes
Framework strand or practice
Exact code only when verified from the current official framework
Evidence produced by the student
Assessment location
Notes on partial, full, or extended alignment
Date and reviewer of the mapping
"""), encoding="utf-8")

release_plan = """\

Grade 9 Science Release Plan
Repository target

vervenveda/Khaemenes_High.github.io

Canonical course path

courses/science/international-integrated-science-9/

Systematic build sequence
Phase 1 — Architecture and governance
Course charter
Machine-readable course map
Curriculum map
International planning crosswalk
Assessment framework
Laboratory safety framework
Materials framework
Grade 9 catalog replacement entry
Directory skeleton
Phase 2 — Course shell
Course landing page
Shared course CSS and JavaScript
Breadcrumbs and Grade 9 navigation
Foundation/Core/Extended pathway controls
Local progress
Export/import
Print support
Accessibility and RTL validation
Offline route planning
Phase 3 — Diagnostic and Unit 01
Science readiness diagnostic
Safety verification
Unit 01 five-day lesson sequence
Investigation
Student pages
Teacher guide
Definitive answer key
Unit quiz
Unit exam or performance task
Validation and release files
Phase 4 — Units 02–06

Life science and introductory chemistry, released one unit at a time.

Phase 5 — Midterm

Practical, written, answer-key, rubric, correction, and record pages.

Phase 6 — Units 07–12

Chemistry, physics, Earth/space, environmental science, and engineering capstone.

Phase 7 — Final completion system

Final exam, capstone rubric, portfolio review, course record, transcript summary, and certificate.

Phase 8 — Integration and audit

Update Grade 9 catalog, High School landing page, manifest, service worker, README, and release documentation. Run navigation, answer, accessibility, print, offline, and route audits.

Unit release gate

A unit is not complete until all of the following exist:

index.html
Daily lessons
Vocabulary and multilingual-ready terms
Student activity or investigation
Teacher guide
Answer key
Quiz or mastery check
Explicit rubric where needed
Standards mapping
Accessibility review
Link and route review
UNIT##_VALIDATION.md
UNIT##_RELEASE.md
Upload order
Course directories and assets
Grade 9 catalog update
Root landing-page integration
Manifest update
Service-worker update and cache-version change
Final route checks on the deployed GitHub Pages site
"""
(planning_root / "GRADE9_SCIENCE_RELEASE.md").write_text(release_plan, encoding="utf-8")

catalog_patch = {
"operation": "replace_course",
"replace_id": "science-biology",
"course": {
"id": "science-integrated9",
"code": "KH-SCI-IIS9",
"department": "Science",
"title": "International Integrated Science 9",
"type": "Core",
"status": "planned",
"path": "../../courses/science/international-integrated-science-9/",
"summary": "A 36-week integrated course in biology, chemistry, physics, Earth and space science, environmental science, engineering, scientific inquiry, and evidence literacy.",
"recommended_for": [
"Grade 9 core science",
"International and homeschool learners",
"Foundation, Core, and Extended pathways",
"Preparation for later Biology, Chemistry, Physics, and Earth Science courses"
]
}
}
(integration_root / "grade-09-course-catalog-replacement.json").write_text(
json.dumps(catalog_patch, indent=2) + "\n", encoding="utf-8"
)

(integration_root / "CATALOG_PATCH_INSTRUCTIONS.md").write_text(textwrap.dedent("""\

Grade 9 Catalog Integration

Target file:

grades/grade-09/course-catalog.json

Find the course object with:

"id": "science-biology"

Replace that complete object with the course object contained in:

grade-09-course-catalog-replacement.json

Do not remove the separate connected course:

science-earth — Earth, Climate & Space Science

That connected resource may remain as a companion laboratory and enrichment destination while International Integrated Science 9 becomes the primary Grade 9 science course.

After the course landing page exists and its route has been tested, change the new course status from planned to open.
"""), encoding="utf-8")

Create empty planned directories in the package.

empty_dirs = [
course_root / "diagnostic",
course_root / "assessments" / "quizzes",
course_root / "assessments" / "unit-exams",
course_root / "assessments" / "midterm",
course_root / "assessments" / "final-exam",
course_root / "assessments" / "capstone",
course_root / "assessments" / "assets",
course_root / "laboratories",
course_root / "student-resources",
course_root / "teacher-resources",
course_root / "answer-keys",
course_root / "records",
course_root / "certificate",
course_root / "docs",
]
for i in range(1, 13):
empty_dirs.append(course_root / "units" / f"unit-{i:02d}")
for d in empty_dirs:
d.mkdir(parents=True, exist_ok=True)
(d / ".gitkeep").write_text("", encoding="utf-8")

Add a top-level manifest of this phase.

manifest = {
"package": "Khaemenes Science 9 Phase 1",
"repository": "vervenveda/Khaemenes_High.github.io",
"course_path": "courses/science/international-integrated-science-9/",
"phase": 1,
"status": "architecture-ready",
"files_created": sorted(str(p.relative_to(root)) for p in root.rglob("*") if p.is_file())
}
(root / "PHASE_1_MANIFEST.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

zip_path = Path("/mnt/data/Khaemenes_Science_9_Phase_1.zip")
if zip_path.exists():
zip_path.unlink()

with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
for path in sorted(root.rglob("*")):
arcname = path.relative_to(root)
if path.is_dir():
zf.writestr(str(arcname).rstrip("/") + "/", "")
else:
zf.write(path, arcname)

print(f"Created: {zip_path}")
print(f"Files: {sum(1 for p in root.rglob('*') if p.is_file())}")
print("Course weeks:", sum(u["weeks"] for u in units))

Phase 1 complete: Architecture and governance

I created the first structured build package for International Integrated Science 9 in:

courses/science/international-integrated-science-9/

It follows the existing Pre-Algebra conventions: a 36-week machine-readable course map, Foundation/Core/Extended pathways, mastery levels, local-first records, offline planning, and unit-by-unit validation.

Download

Download Khaemenes Science 9 — Phase 1 Package

The package contains 38 files, including the complete directory skeleton.

Foundational files
course-map.json — all 36 weeks and 13 course sections
COURSE_CHARTER.md
CURRICULUM_MAP.md
STANDARDS_CROSSWALK.md
ASSESSMENT_FRAMEWORK.md
LAB_SAFETY_FRAMEWORK.md
MATERIALS_FRAMEWORK.md
README.md
docs/planning/GRADE9_SCIENCE_RELEASE.md
Grade 9 catalog replacement instructions
Empty folders for all units, assessments, laboratories, records and completion materials
Course sequence

The package establishes:

Section	Weeks
Readiness, safety and scientific habits	1
Scientific inquiry, measurement and evidence	2
Cells and organization of life	3
Body systems and homeostasis	3
Cell division, reproduction and inheritance	3
Ecosystems, evolution and biodiversity	3
Atomic structure and periodic patterns	3
Bonding, chemical reactions and matter	3
Motion, forces and energy	3
Electricity, waves and information	3
Earth systems and biogeochemical cycles	3
Dynamic Earth, climate and space	3
Sustainable engineering capstone	3
Total	36
Assessment safeguards

The framework now requires:

Exactly one definitive, defensible answer for objectively scored questions
Explicit units, assumptions, conventions and rounding directions
Evidence-based rubrics for constructed responses
Independent answer verification
First-attempt, feedback, revision and final-mastery records
Equal emphasis on knowledge, inquiry, data analysis, and scientific impacts
Catalog integration

The existing Grade 9 catalog currently lists Biology & Living Systems as a planned course. The package includes a controlled replacement entry for International Integrated Science 9 without removing the separate connected Earth, Climate & Space Science resource.

The connected GitHub access presently provides read access but not repository push permission, so I prepared the files as an upload-ready package rather than claiming to have committed them.

Next systematic phase

Phase 2 will build the Science 9 course shell:

index.html
course-ui.css
course-ui.js
diagnostic/index.html

That phase will establish navigation, the 36-week unit display, pathways, student progress, export/import, printing, accessibility, multilingual readiness and the visual connection to the Khaemenes High campus.

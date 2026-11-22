import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const languageArts=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const pad=n=>String(n).padStart(2,"0");
const exists=p=>fs.existsSync(p);
const read=p=>fs.readFileSync(p,"utf8");
const json=p=>JSON.parse(read(p));
const grades=[9,10,11,12];
const expectedRoles={9:"foundation",10:"intermediate",11:"advanced",12:"senior_scholar"};
const specificityLayer=path.resolve(languageArts,"..","shared","english-week-specificity-v1.js");
assert.ok(exists(specificityLayer),"shared English specificity layer missing");
const specificitySource=read(specificityLayer);
assert.match(specificitySource,/Specific Teaching Focus/);
assert.match(specificitySource,/Watch for:/);
assert.match(specificitySource,/Evidence target:/);

const learningOrganization=path.resolve(languageArts,"..","shared","english-learning-page-organization-v1.js");
assert.ok(exists(learningOrganization),"shared focused-learning contract missing");
const learningOrganizationSource=read(learningOrganization);
assert.match(learningOrganizationSource,/Khaemenes Academy · Evidence-Based English Page Organization v1/);
assert.match(learningOrganizationSource,/Expand All/);
assert.match(learningOrganizationSource,/Collapse All/);
assert.match(learningOrganizationSource,/article\.lesson-day/);
assert.match(learningOrganizationSource,/article\.lesson-detail/);


function duplicateIds(html){
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  return ids.filter((id,i)=>ids.indexOf(id)!==i);
}
function assessmentBank(html){
  const m=html.match(/<script type="application\/json" id="assessment-data">([\s\S]*?)<\/script>/);
  return m?JSON.parse(m[1]):null;
}
function assertAssessmentBank(bank,label){
  assert.ok(Array.isArray(bank)&&bank.length>=10,label+" bank must contain at least 10 questions");
  const ids=new Set();
  for(const [i,q] of bank.entries()){
    assert.ok(String(q.question??q.q??q.prompt??"").trim(),label+" question "+(i+1)+" missing prompt");
    const choices=Array.isArray(q.choices)?q.choices:q.options;
    assert.ok(Array.isArray(choices)&&choices.length>=2,label+" question "+(i+1)+" choices malformed");
    assert.ok(Number.isInteger(Number(q.answer))&&Number(q.answer)>=0&&Number(q.answer)<choices.length,label+" question "+(i+1)+" answer malformed");
    if(q.id){assert.ok(!ids.has(q.id),label+" duplicate question id "+q.id);ids.add(q.id)}
  }
}

const canonicalMd=path.join(languageArts,"ENGLISH_9_12_A_PLUS_PLUS_PLUS_CANONICAL_CONTRACT.md");
const canonicalJson=path.join(languageArts,"ENGLISH_9_12_A_PLUS_PLUS_PLUS_CONTRACT.json");
assert.ok(exists(canonicalMd),"canonical governance markdown missing");
assert.ok(exists(canonicalJson),"canonical governance JSON missing");
const canonical=json(canonicalJson);
assert.equal(canonical.mastery.threshold,0.8);
assert.equal(canonical.mastery.completionGrantsMastery,false);
assert.deepEqual(canonical.courseShape,{units:12,weeks:36,dailyBlocks:180});

for(const grade of grades){
  const root=path.join(languageArts,"english-"+grade);
  assert.ok(exists(root),"English "+grade+" root missing");

  const manifest=json(path.join(root,"02_course_mastery_manifest.json"));
  assert.equal(manifest.courseId,"english-"+grade,"course id drift English "+grade);
  assert.equal(manifest.gradeRole,expectedRoles[grade],"grade role drift English "+grade);
  assert.equal(manifest.canonicalContract,"../ENGLISH_9_12_A_PLUS_PLUS_PLUS_CONTRACT.json");
  assert.equal(manifest.mastery.threshold,0.8);
  assert.equal(manifest.mastery.completionGrantsMastery,false);
  assert.equal(manifest.mastery.preservePriorMastery,true);
  assert.equal(manifest.courseUnits,12);
  assert.equal(manifest.weeks,36);
  assert.equal(manifest.dailyBlocks,180);
  assert.deepEqual(manifest.attemptHistory,canonical.attemptHistory,"attempt-history contract drift English "+grade);
  assert.deepEqual(manifest.humanReview,canonical.humanReview,"human-review contract drift English "+grade);
  assert.deepEqual(manifest.weeklyLoop,canonical.weeklyLoop,"weekly-loop contract drift English "+grade);

  assert.ok(exists(path.join(root,"index.html")),"course landing missing English "+grade);
  const landing=read(path.join(root,"index.html"));
  assert.match(landing,/KHAEMENES_ENGLISH_LANDING_RELEASE_V1/,"canonical landing presentation contract missing English "+grade);
  assert.match(landing,/KHAEMENES_ENGLISH_CENTERED_LANDING_V1/,"centered landing contract missing English "+grade);
  assert.match(landing,/class="centered-course-controls/,"centered course controls missing English "+grade);
  assert.doesNotMatch(landing,/<aside class="sidebar/,"side navigation must not return English "+grade);
  if(grade>=10){
    assert.match(landing,/class="topbar"[^>]*data-retired-course-header="true"[^>]*hidden/,"legacy local course header must remain retired English "+grade);
    assert.match(landing,/<html lang="en" data-theme="light">/,"English "+grade+" landing must open in canonical light presentation");
  }
  assert.ok(exists(path.join(root,"curriculum.json")),"curriculum missing English "+grade);
  assert.ok(exists(path.join(root,"reading-list.html")),"reading list missing English "+grade);
  const readingHub=read(path.join(root,"reading-list.html"));
  assert.match(readingHub,/data-reading-headquarters="v1"/,"36-week reading headquarters missing English "+grade);
  assert.match(readingHub,/records\/reading-log\.html/,"reading log route missing from headquarters English "+grade);
  assert.match(readingHub,/records\/progress-report\.html/,"progress route missing from headquarters English "+grade);
  assert.equal((readingHub.match(/units\/unit-[0-9]{2}\/reading-dossier\.html/g)||[]).length,12,"reading headquarters must expose 12 unit dossiers English "+grade);
  for(const range of ["01-06","07-12","13-18","19-24","25-30","31-36"]){
    assert.match(readingHub,new RegExp("offline-reading-pack-weeks-"+range+"\\.html"),"reading headquarters offline pack "+range+" missing English "+grade);
  }
  assert.ok(exists(path.join(root,"rubrics","index.html")),"rubric hub missing English "+grade);
  const productRubric=path.join(root,"rubrics","product-companion.html");
  assert.ok(exists(productRubric),"product companion rubric missing English "+grade);
  const productRubricHtml=read(productRubric);
  assert.equal((productRubricHtml.match(/<article class="card">/g)||[]).length,12,"product companion must cover 12 units English "+grade);
  assert.match(productRubricHtml,/does not independently award mastery|without changing the 80% mastery threshold/i,"product companion mastery boundary missing English "+grade);
  const assessmentHub=read(path.join(root,"assessments","index.html"));
  assert.match(assessmentHub,/rubrics\/product-companion\.html/,"assessment hub missing product companion link English "+grade);
  const offlineRanges=["01-06","07-12","13-18","19-24","25-30","31-36"];
  for(const range of offlineRanges){
    const op=path.join(root,"offline-reading-pack-weeks-"+range+".html");
    assert.ok(exists(op),"offline reading companion "+range+" missing English "+grade);
    const oh=read(op);
    assert.ok(oh.length>5000,"offline reading companion "+range+" unexpectedly thin English "+grade);
    assert.doesNotMatch(oh,/<script\s+[^>]*src=/i,"offline companion "+range+" has network script dependency English "+grade);
    assert.doesNotMatch(oh,/<link\s+[^>]*rel=["']?stylesheet/i,"offline companion "+range+" has external stylesheet dependency English "+grade);
  }
  assert.ok(exists(path.join(root,"records","reading-log.html")),"reading log missing English "+grade);
  const progressReport=path.join(root,"records","progress-report.html");
  assert.ok(exists(progressReport),"student progress report missing English "+grade);
  const prh=read(progressReport);
  assert.match(prh,/@media\s*\([^)]*max-width/i,"responsive progress-report rule missing English "+grade);
  assert.match(prh,/@media\s+print/i,"print progress-report rule missing English "+grade);
  assert.match(prh,/Gradebook|gradebook\.html/i,"gradebook return path missing English "+grade);

  const courseJs=read(path.join(root,"assets","course.js"));
  assert.match(courseJs,/english-week-specificity-v1\.js/,"week-specific instruction loader missing English "+grade);
  assert.doesNotMatch(courseJs,/Mark All Days Complete/,"one-click week completion must not return English "+grade);
  assert.match(courseJs,/english-learning-page-organization-v1\.js/,"focused learning organization loader missing English "+grade);
  assert.match(courseJs,/data-khae-english-page-organization|khaeEnglishPageOrganization/,"focused learning organization marker missing English "+grade);
  const curriculum=json(path.join(root,"curriculum.json"));
  assert.equal(curriculum.quizDiversityVersion,"v1","quiz diversity version missing English "+grade);
  assert.equal(curriculum.instructionalSpecificityVersion,"v1","instructional specificity version missing English "+grade);
  if(grade===9){
    assert.equal(curriculum.weekPlans.length,36,"English 9 week plan count drift");
    for(const [kind,expected] of [["midterm",30],["final",50]]){
      const page=read(path.join(root,"assessments",kind,"index.html"));
      const bankMatch=page.match(/<script[^>]+id="assessment-data"[^>]*>([\s\S]*?)<\/script>/i);
      assert.ok(bankMatch,"English 9 "+kind+" assessment bank missing");
      const bank=JSON.parse(bankMatch[1]);
      const prompts=bank.map(q=>String(q.question||q.prompt||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim());
      assert.equal(prompts.length,expected,"English 9 "+kind+" question count drift");
      assert.equal(new Set(prompts).size,expected,"English 9 "+kind+" duplicate prompt");
    }
    for(const plan of curriculum.weekPlans){
      assert.ok(plan.specificity,"English 9 specificity missing week "+plan.n);
      for(const day of ["monday","tuesday","wednesday","thursday","friday"]){
        assert.ok(plan.specificity[day]?.model,"English 9 "+day+" model missing week "+plan.n);
        assert.ok(plan.specificity[day]?.misconception,"English 9 "+day+" misconception missing week "+plan.n);
        assert.ok(plan.specificity[day]?.evidence,"English 9 "+day+" evidence target missing week "+plan.n);
      }
    }
    const readingLog=read(path.join(root,"records","reading-log.html"));
    assert.match(readingLog,/english9-reading-log-context-v1\.js/,"curriculum-aware reading log missing English 9");
    const readingContext=read(path.resolve(languageArts,"..","shared","english9-reading-log-context-v1.js"));
    for(const token of ["reading-week-","reading-unit-","reading-curriculum-type-","reading-source-status-"]){
      assert.match(readingContext,new RegExp(token.replace(/[.*+?^$\{\}()|[\]\\]/g,"\\  if(grade===9){
")),"English 9 reading context field missing: "+token);
    }
    const gradebook=read(path.join(root,"records","gradebook.html"));
    assert.match(gradebook,/Evaluator|evaluator/,"English 9 evaluator record missing");
    assert.match(gradebook,/Rubric|rubric/,"English 9 rubric record missing");
    assert.match(gradebook,/Feedback|feedback/,"English 9 feedback record missing");
    assert.match(courseJs,/grade9EvidenceReady/,"evidence-aware weekly completion missing English 9");
    assert.match(courseJs,/Evidence needed ·/,"English 9 evidence status messaging missing");
  }else{
    assert.match(courseJs,/weekEvidenceReady/,"evidence-aware weekly completion missing English "+grade);
    assert.match(courseJs,/I preserved .* evidence/,"daily evidence confirmation missing English "+grade);
    assert.match(courseJs,/quizAttempted/,"weekly quiz evidence requirement missing English "+grade);
  }

  const css=read(path.join(root,"assets","course.css"));
  assert.match(css,/KHAEMENES_ENGLISH_RELEASE_TYPOGRAPHY_V1/,"release typography override missing English "+grade);
  assert.match(css,/html:root:root:root body\s*\{[\s\S]*?font-size:\s*16px\s*!important/,"16px body release rule missing English "+grade);
  assert.match(css,/\.eyebrow[\s\S]*?font-size:\s*14px\s*!important/,"14px eyebrow release rule missing English "+grade);

  for(let unit=1;unit<=12;unit++){
    const unitRoot=path.join(root,"units","unit-"+pad(unit));
    const unitPage=path.join(unitRoot,"index.html");
    const dossier=path.join(unitRoot,"reading-dossier.html");
    const alignment=path.join(root,"UNIT"+pad(unit)+"_EVIDENCE_ALIGNMENT.md");
    const assessment=path.join(root,"assessments","unit-"+pad(unit),"index.html");
    assert.ok(exists(unitPage),"missing English "+grade+" unit "+unit);
    assert.ok(exists(dossier),"missing English "+grade+" reading dossier "+unit);
    assert.ok(exists(alignment),"missing English "+grade+" evidence alignment "+unit);
    assert.ok(exists(assessment),"missing English "+grade+" unit assessment "+unit);

    const uh=read(unitPage);
    assert.equal(duplicateIds(uh).length,0,"duplicate IDs English "+grade+" unit "+unit);

    const ah=read(assessment);
    assert.equal(duplicateIds(ah).length,0,"duplicate IDs English "+grade+" assessment "+unit);
    assert.match(ah,/data-assessment-navigation="v1"/,"assessment navigation missing English "+grade+" unit "+unit);
    assert.match(ah,/records\/progress-report\.html/,"student progress return missing English "+grade+" unit "+unit);
    assert.match(ah,/records\/gradebook\.html/,"gradebook return missing English "+grade+" unit "+unit);
    assert.match(ah,/units\/unit-[0-9]{2}\/index\.html/,"unit overview return missing English "+grade+" unit "+unit);
    if(grade===9){
    const offlineManifestPath=path.join(root,"OFFLINE_ACCESS_MANIFEST.json");
    assert.ok(exists(offlineManifestPath),"offline access manifest missing English 9");
    const offlineManifest=json(offlineManifestPath);
    assert.equal(offlineManifest.readingPacks.length,6,"English 9 offline pack manifest drift");
    assert.equal(offlineManifest.unitReadingDossiers.length,12,"English 9 offline dossier manifest drift");
    assert.equal(offlineManifest.boundaries.readingPacksSelfContained,true);
      assert.match(ah,/human evaluator review/i,"English 9 unit "+unit+" must preserve human-review authority");
      assert.match(ah,/8\/10 \(80%\)/,"English 9 unit "+unit+" mastery threshold drift");
      assert.match(ah,/does not grant mastery/i,"English 9 unit "+unit+" completion boundary missing");
    }else{
      assert.match(ah,/data-assessment-form/,"English "+grade+" unit "+unit+" assessment form missing");
      assertAssessmentBank(assessmentBank(ah),"English "+grade+" Unit "+unit);
    }
  }

  for(let week=1;week<=36;week++){
    const wp=path.join(root,"weeks","week-"+pad(week),"index.html");
    assert.ok(exists(wp),"missing English "+grade+" week "+week);
    const wh=read(wp);
    assert.equal(duplicateIds(wh).length,0,"duplicate IDs English "+grade+" week "+week);
    const hasCourseCss=/assets\/course\.css/i.test(wh);
    const hasGlobalTypography=/high-school-global-chrome-v2\.js/i.test(wh);
    assert.ok(hasCourseCss||hasGlobalTypography,"typography enforcement path missing English "+grade+" week "+week);
  }

  for(const kind of ["diagnostic","midterm","final"]){
    const ap=path.join(root,"assessments",kind,"index.html");
    assert.ok(exists(ap),"missing English "+grade+" "+kind);
    assert.equal(duplicateIds(read(ap)).length,0,"duplicate IDs English "+grade+" "+kind);
  }

  if(grade===9){
    const authority=json(path.join(root,"UNIT_ASSESSMENT_AUTHORITY_MAP.json"));
    assert.equal(authority.unitAssessments.length,12);
    for(const row of authority.unitAssessments){
      assert.equal(row.masteryThreshold,80);
      assert.equal(row.authority,"teacher_review");
      assert.equal(row.completionGrantsMastery,false);
    }
    for(const [kind,count] of [["midterm",30],["final",50]]){
      const h=read(path.join(root,"assessments",kind,"index.html"));
      assert.match(h,/data-e9-fixed-assessment/,"English 9 "+kind+" fixed runtime marker missing");
      const bank=assessmentBank(h);
      assert.equal(bank.length,count,"English 9 "+kind+" cumulative bank-count drift");
      assertAssessmentBank(bank,"English 9 "+kind);
      assert.equal(new Set(bank.map(q=>String(q.question??q.q??q.prompt??"").trim().toLowerCase().replace(/\s+/g," "))).size,bank.length,"duplicate prompts English 9 "+kind);
    }
  }else{
    assert.equal(curriculum.weeks.length,36,"English "+grade+" curriculum week count drift");
    const canonicalPrompts=[];
    for(const week of curriculum.weeks){
      for(const q of week.quiz||[]) canonicalPrompts.push(String(q.question||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim());
    }
    assert.equal(canonicalPrompts.length,180,"canonical weekly quiz count drift English "+grade);
    assert.equal(new Set(canonicalPrompts).size,180,"duplicate canonical weekly quiz prompt English "+grade);
    const specificBank=json(path.join(root,"assets","quiz-specific-bank.json"));
    const supplementalPrompts=(specificBank.rows||[]).flat().map(row=>String(row?.[0]||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()).filter(Boolean);
    assert.equal(supplementalPrompts.length,72,"supplemental quiz count drift English "+grade);
    assert.equal(new Set(supplementalPrompts).size,72,"duplicate supplemental quiz prompt English "+grade);
    for(const week of curriculum.weeks){
      assert.ok(week.specificity,"specificity missing English "+grade+" week "+week.week);
      for(const day of ["monday","tuesday","wednesday","thursday","friday"]){
        assert.ok(week.specificity[day]?.model,day+" model missing English "+grade+" week "+week.week);
        assert.ok(week.specificity[day]?.misconception,day+" misconception missing English "+grade+" week "+week.week);
        assert.ok(week.specificity[day]?.evidence,day+" evidence target missing English "+grade+" week "+week.week);
      }
    }
    const readingLog=read(path.join(root,"records","reading-log.html"));
    for(const id of ["read-week","read-type","read-source-status"]){
      assert.match(readingLog,new RegExp('id="'+id+'"'),"curriculum-aware reading log missing English "+grade+" field "+id);
    }
    assert.match(courseJs,/readingType/,"reading type record missing English "+grade);
    assert.match(courseJs,/sourceStatus/,"reading source-status record missing English "+grade);
    assert.match(courseJs,/unit:week\?Math\.ceil\(week\/3\)/,"reading week-to-unit mapping missing English "+grade);
    assert.match(courseJs,/r\.week\|\|"—"/,"legacy reading entries must remain renderable English "+grade);
    assert.match(courseJs,/projectReview/,"project review provenance missing English "+grade);
    assert.match(courseJs,/artifactRef/,"project artifact reference missing English "+grade);
    assert.match(courseJs,/companionReviewed/,"product companion review marker missing English "+grade);
    assert.match(courseJs,/reviewDate/,"project review date missing English "+grade);
    const gradebook=read(path.join(root,"records","gradebook.html"));
    assert.match(gradebook,/data-project-review-editor/,"project review editor missing English "+grade);
    const progressReport=read(path.join(root,"records","progress-report.html"));
    assert.match(progressReport,/Review Record/,"project review status missing from progress report English "+grade);
    const swPath=path.join(root,"service-worker.js");
    assert.ok(exists(swPath),"offline service worker missing English "+grade);
    const sw=read(swPath);
    assert.match(sw,/english-learning-page-organization-v1\.js/,"focused-learning runtime missing from offline cache English "+grade);
    assert.match(sw,/records\/progress-report\.html/,"progress report missing from offline cache English "+grade);
    assert.match(sw,/rubrics\/product-companion\.html/,"product companion missing from offline cache English "+grade);
    for(const range of ["01-06","07-12","13-18","19-24","25-30","31-36"]){
      assert.match(sw,new RegExp("offline-reading-pack-weeks-"+range+"\\.html"),"offline pack "+range+" missing from service worker English "+grade);
    }
    for(let unit=1;unit<=12;unit++){
      assert.match(sw,new RegExp("units/unit-"+pad(unit)+"/reading-dossier\\.html"),"unit dossier "+unit+" missing from service worker English "+grade);
    }
    for(const kind of ["midterm","final"]){
      const h=read(path.join(root,"assessments",kind,"index.html"));
      assert.match(h,/high-school-assessment-adapter-v1\.js/,"English "+grade+" "+kind+" shared assessment adapter missing");
      const bank=assessmentBank(h);
      assertAssessmentBank(bank,"English "+grade+" "+kind);
      assert.equal(new Set(bank.map(q=>String(q.question??q.q??q.prompt??"").trim().toLowerCase().replace(/\s+/g," "))).size,bank.length,"duplicate prompts English "+grade+" "+kind);
    }
  }
}

// Shared runtime syntax and fixed-mode compatibility.
const monteCarlo=read(path.join(languageArts,"shared","monte-carlo-assessment-v1.js"));
const highAdapter=read(path.join(languageArts,"shared","high-school-assessment-adapter-v1.js"));
new vm.Script(monteCarlo);
new vm.Script(highAdapter);
assert.match(monteCarlo,/function openFixedSession/,"fixed-form shared session support missing");
assert.match(highAdapter,/config\.fixedOrder===true/,"fixed-order adapter branch missing");
assert.match(highAdapter,/reshuffleOnRetake:fixedOrder!==true/,"fixed retry policy drift");

console.log("PASS English 9-12 shared regression: governance, 12/36/180 shape, 48 unit routes, 48 reading dossiers, 48 evidence alignments, 144 week hubs, 24 self-contained offline reading companions, assessment topology, duplicate-ID scan, typography, and shared assessment runtime.");

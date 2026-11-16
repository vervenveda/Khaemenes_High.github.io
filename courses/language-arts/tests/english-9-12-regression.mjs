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
const globalChrome=path.resolve(languageArts,"..","..","assets","high-school-global-chrome-v2.js");
const globalChromeSource=read(globalChrome);
assert.match(globalChromeSource,/khaemenesHighTypography="16-33-66"/,"global typography contract marker missing");
assert.match(globalChromeSource,/font-size","16px","important"/,"global 16px readable floor missing");
assert.match(globalChromeSource,/font-size:33px!important/,"global 33px heading rule missing");
assert.match(globalChromeSource,/font-size:66px!important/,"global 66px primary-title rule missing");


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
  assert.ok(exists(path.join(root,"curriculum.json")),"curriculum missing English "+grade);
  assert.ok(exists(path.join(root,"reading-list.html")),"reading list missing English "+grade);
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
    for(const [kind,count] of [["midterm",12],["final",16]]){
      const h=read(path.join(root,"assessments",kind,"index.html"));
      assert.match(h,/data-e9-fixed-assessment/,"English 9 "+kind+" fixed runtime marker missing");
      const bank=assessmentBank(h);
      assert.equal(bank.length,count,"English 9 "+kind+" legacy bank-count drift");
      assertAssessmentBank(bank,"English 9 "+kind);
    }
  }else{
    for(const kind of ["midterm","final"]){
      const h=read(path.join(root,"assessments",kind,"index.html"));
      assert.match(h,/high-school-assessment-adapter-v1\.js/,"English "+grade+" "+kind+" shared assessment adapter missing");
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

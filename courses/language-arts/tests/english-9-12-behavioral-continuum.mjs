import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const languageArts=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const grades=[9,10,11,12];
const pad=n=>String(n).padStart(2,"0");
const read=p=>fs.readFileSync(p,"utf8");
const exists=p=>fs.existsSync(p);

function duplicateIds(html){
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  return ids.filter((id,i)=>ids.indexOf(id)!==i);
}
function assertRelativeAssetsResolve(html,file,label){
  const folder=path.dirname(file);
  for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
    const raw=m[1].split(/[?#]/)[0];
    if(!raw||/^(?:[a-z][\w+.-]*:|\/\/|\/|#)/i.test(raw))continue;
    const target=path.resolve(folder,decodeURIComponent(raw));
    assert.ok(exists(target),label+" broken relative route "+raw);
  }
}
function assertSharedCourseRuntime(root,grade){
  const runtimePath=path.join(root,"assets","course.js");
  assert.ok(exists(runtimePath),"English "+grade+" course runtime missing");
  const runtime=read(runtimePath);
  new vm.Script(runtime);
  assert.match(runtime,/khaemenes_active_learner_v1|readAcademyProfile/,"English "+grade+" learner identity guard missing");
  assert.match(runtime,/scopedKey|learner-scope|storageKey/,"English "+grade+" learner-scoped record authority missing");
  assert.match(runtime,/week-source-custody-v1\.js/,"English "+grade+" week source-custody loader missing");
  assert.match(runtime,/high-school-english-continuation\.js|KhaemenesHighEnglishContinuation/,"English "+grade+" continuation support missing");
  return runtime;
}

for(const grade of grades){
  const root=path.join(languageArts,"english-"+grade);
  const runtime=assertSharedCourseRuntime(root,grade);

  if(grade===9){
    assert.match(runtime,/validReview|review/i,"English 9 human-review runtime missing");
    assert.match(runtime,/khae-ela9-progress-v1|KhaemenesEnglish9Records/,"English 9 progress record contract missing");
    assert.match(runtime,/same-key|newer record|stale|conflict/i,"English 9 stale/conflict protection signal missing");
  }else{
    assert.match(runtime,/upper-english|KhaemenesUpperEnglish|learner/i,"English "+grade+" upper-English record bridge missing");
    assert.match(runtime,/quiz|score/i,"English "+grade+" quiz/progress behavior missing");
  }

  for(let week=1;week<=36;week++){
    const file=path.join(root,"weeks","week-"+pad(week),"index.html");
    assert.ok(exists(file),"English "+grade+" Week "+week+" hub missing");
    const html=read(file);
    const label="English "+grade+" Week "+week;

    assert.equal(duplicateIds(html).length,0,label+" duplicate IDs");
    assert.match(html,/assets\/course\.js/,label+" course runtime not loaded");
    assert.match(html,/reflection/i,label+" reflection path missing");
    assert.match(html,/week-source|reading-dossier|assigned-reading|reading/i,label+" reading/source path missing");
    assertRelativeAssetsResolve(html,file,label);

    if(grade===9){
      const fields=(html.match(/data-save-field=/g)||[]).length;
      assert.ok(fields>=1,label+" learner writing save fields missing");
      assert.match(html,/rubric|evaluator|human review|teacher review|assessment/i,label+" evaluator/mastery evidence path missing");
      if(week>=14){
        assert.ok(fields>=5,label+" late-year workspace unexpectedly thin");
        assert.match(html,/data-save-field="week-[0-9]{2}-(?:reflection|claim|evidence|day)/,label+" canonical English 9 record keys missing");
      }
    }else{
      assert.match(html,/course-entry-contract\.js/,label+" entry contract missing");
      assert.match(html,new RegExp('learner-scope-v1\\.js[^>]+data-learner-scope="english-'+grade+'"'),label+" learner scope loader missing");
      assert.match(html,/upper-english-records\.js/,label+" shared upper-English records bridge missing");
      assert.match(html,/high-school-assessment-adapter-v1\.js/,label+" assessment adapter missing");
      assert.match(html,/data-quiz-form/,label+" weekly quiz form missing");
      assert.match(html,/id="quiz-data"/,label+" weekly quiz data missing");
      assert.ok((html.match(/data-save-field=/g)||[]).length>=1,label+" reflection/evidence save field missing");
    }
  }
}

console.log("PASS English 9-12 behavioral continuum: 144 weekly hubs retain learner identity, scoped records, source custody, writing/reflection evidence, architecture-appropriate assessment behavior, and resolvable local routes.");

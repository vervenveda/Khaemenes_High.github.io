const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const html=fs.readFileSync(path.join(__dirname,"../courses/mathematics/algebra-1/diagnostic/index.html"),"utf8");
test("Algebra I diagnostic uses canonical shared high-school chrome and avoids duplicate scripts",()=>{
 assert.match(html,/assets\/vnv-dual-ticker-v1\.js/);
 assert.match(html,/assets\/high-school-global-chrome-v2\.js/);
 assert.equal((html.match(/vnv-dual-ticker-v1\.js/g)||[]).length,1);
 assert.equal((html.match(/high-school-global-chrome-v2\.js/g)||[]).length,1);
 assert.match(html,/data-khaemenes-high-canonical-header/);
});
test("diagnostic six-button class toolbar uses existing canonical tool rather than copies",()=>{
 assert.match(html,/window\.KhaemenesClassToolsConfigV1=/);
 assert.match(html,/assets\/vnv-class-tools-toolbar\.js/);
 const section=html.match(/<script id="algebra1-diagnostic-class-tools-config">([\s\S]*?)<\/script>/);
 assert.ok(section);
 const labels=[...section[1].matchAll(/label:"([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(labels,["Course","Lessons","Records","Parent","Search","Help"]);
});
test("start assessment and existing scoring engine are still present",()=>{
 assert.match(html,/id="startAssessmentButton" href="#assessmentQuestions"/);
 assert.match(html,/id="assessmentQuestions"/);
 assert.match(html,/id="questionHost"/);
 assert.match(html,/id="submitButton"/);
 assert.match(html,/window\.EXAM_CONFIG=/);
 assert.match(html,/"question_count":36/);
 assert.match(html,/assets\/exam-engine\.js/);
});

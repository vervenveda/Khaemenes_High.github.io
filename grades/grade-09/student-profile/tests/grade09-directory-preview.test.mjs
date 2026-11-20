import assert from "node:assert/strict";
import {TOOL_REGISTRY,buildGrade09DirectoryDraft,validateGrade09DirectoryDraft} from "../account-cloud/grade09-directory-preview.mjs";
const p=()=>buildGrade09DirectoryDraft();
const checks=[
["eight-toolbar-sections",()=>assert.equal(p().sections.length,8)],
["schedule-first",()=>assert.equal(p().sections[0].tool,"Schedule")],
["creative-tools-last",()=>assert.equal(p().sections[7].tool,"Creative Tools")],
["no-student-payload",()=>assert.equal(p().studentDataIncluded,false)],
["no-write",()=>assert.equal(p().accountCloudWriteEnabled,false)],
["no-delete",()=>assert.equal(p().storageDeleteEnabled,false)],
["only-not-collected",()=>assert(p().sections.every(x=>x.state==="NOT_COLLECTED"))],
["all-unique",()=>assert.equal(new Set(TOOL_REGISTRY.map(x=>x.tool)).size,8)],
["course-engines-own-progress",()=>assert.equal(p().sections[1].owner,"course-engines")],
["portfolio-consent",()=>assert.equal(p().sections[6].action,"consent-required")],
["valid-schema",()=>assert.equal(validateGrade09DirectoryDraft(p()),true)],
["reject-id-injection",()=>assert.throws(()=>buildGrade09DirectoryDraft({learnerId:"private"}))],
["reject-credentials",()=>assert.equal(validateGrade09DirectoryDraft({...p(),token:"x"}),false)],
["reject-live-mode",()=>assert.equal(validateGrade09DirectoryDraft({...p(),mode:"SYNCED"}),false)],
["reject-extra-section",()=>assert.equal(validateGrade09DirectoryDraft({...p(),sections:[...p().sections,{}]}),false)],
["reject-unknown-status",()=>assert.throws(()=>buildGrade09DirectoryDraft({sourceStatus:"live"}))],
["valid-synthetic",()=>assert.equal(validateGrade09DirectoryDraft(buildGrade09DirectoryDraft({sourceStatus:"synthetic"})),true)],
["deny-mutated-section",()=>assert.equal(validateGrade09DirectoryDraft({...p(),sections:[{...p().sections[0],state:"COMMITTED"},...p().sections.slice(1)]}),false)]
];
for(const [name,run] of checks){run();console.log("PASS",name)}
console.log("GRADE09_DIRECTORY_PREVIEW_SYNTHETIC_PASS="+checks.length+" LIVE_WRITES=DISABLED");

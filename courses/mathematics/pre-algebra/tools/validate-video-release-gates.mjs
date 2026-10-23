import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const root="courses/mathematics/pre-algebra/";
const guards=[
 ["unit-01",'c.video.placement_enabled!==true||c.video.certification?.student_release_approved!==true'],
 ["unit-02",'c.video.placement_enabled!==true||c.video.certification?.student_release_approved!==true'],
 ["unit-03",'c.video?.placement_enabled===true&&c.video?.certification?.student_release_approved===true']
];
for(const [unit,guard] of guards){
 const source=fs.readFileSync(root+"units/"+unit+"/assets/lesson-engine.js","utf8");
 new vm.Script(source);
 assert.ok(source.includes(guard),unit+" must require placement enablement and explicit student release approval");
 assert.ok(source.includes("youtube-nocookie.com"),unit+" keeps previously reviewed candidate metadata for later QA");
 assert.ok(source.includes("learning-games"),unit+" preserved native game links");
 const pending={id:"candidate",placement_enabled:false,certification:{student_release_approved:false}};
 assert.equal(pending.placement_enabled&&pending.certification.student_release_approved,false);
 const approved={...pending,placement_enabled:true,certification:{student_release_approved:true}};
 assert.equal(approved.placement_enabled&&approved.certification.student_release_approved,true);
}
console.log("PASS: Pre-Algebra Units 01–03 video companions fail closed until explicit placement enablement and QA approval; standalone games remain in lessons.");

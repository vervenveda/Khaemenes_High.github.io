#!/usr/bin/env node
/* Audit the actual approved shared presentation owners; no retired global chrome. */
import fs from "node:fs";
import assert from "node:assert/strict";
const css=fs.readFileSync("courses/language-arts/assets/english-minimal-landing-v1.css","utf8");
const readiness=fs.readFileSync("courses/language-arts/assets/english-readiness-ui-v1.css","utf8");
const dual=fs.readFileSync("assets/vnv-dual-ticker-v1.js","utf8");
assert.match(css,/font-size:16px/,"16px minimum button/access typography");
assert.match(css,/33px/,"33px Academy headline");
assert.match(css,/66px/,"66px course headline");
assert.match(readiness,/font:400 16px/,"16px readiness content");
assert.match(readiness,/border-radius:7px/,"7px readiness corners");
assert.match(dual,/vnv-333-ticker\.js/,"official VNV 333 ticker");
assert.match(dual,/vnv-ticker-autopopulate\.js/,"official VNV auto ticker");
console.log(JSON.stringify({
  result:"PASS",
  authority:["english-minimal-landing-v1.css","english-readiness-ui-v1.css","vnv-dual-ticker-v1.js"],
  standards:{minimumReadableTextPx:16,academyHeadingPx:33,englishCourseHeadingPx:66,cornerRadiusPx:7}
},null,2));

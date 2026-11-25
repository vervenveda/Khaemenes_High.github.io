#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";
const legacy="courses/electives/fine-arts-visual-studio";
assert.equal(fs.existsSync(legacy+"/course-map.json"),false,"legacy Fine Arts map must remain purged");
const html=fs.readFileSync(legacy+"/index.html","utf8");
assert(html.includes('url=../art-101/'),"legacy doorway must redirect to Art 101");
assert(html.includes('href="../art-201/"'),"legacy doorway must preserve Art 201 succession notice");
assert(fs.existsSync("courses/electives/art-201/course-map.json"),"Art 201 must own the preserved advanced map");
console.log("PASS: legacy Fine Arts authority is redirect-only; Art 201 owns the preserved advanced course map.");

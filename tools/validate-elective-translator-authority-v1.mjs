#!/usr/bin/env node
import fs from "node:fs";
import assert from "node:assert/strict";

const shellPath="assets/high-department-landing-shell-v1.js";
const toolsPath="assets/high-school-subject-landing-class-tools-v1.js";
const hallPath="courses/electives/index.html";
const electivePages=[
 hallPath,
 "courses/electives/art-101/index.html",
 "courses/electives/art-201/index.html",
 "courses/electives/career-professional-studies/index.html",
 "courses/electives/computing-digital-technology/index.html",
 "courses/electives/health-wellness-human-development/index.html",
 "courses/electives/music-music-theory/index.html",
 "courses/electives/psychology-101/index.html",
 "courses/electives/world-languages-linguistics/index.html"
];

const shell=fs.readFileSync(shellPath,"utf8");
for(const token of [
 "https://vervenveda.com/assets/khaemenes-campus-phrases.js",
 "https://vervenveda.com/assets/khaemenes-interlingual-core.js",
 "https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1",
 "ensure?.({full:true,upgradeLegacyCore:true})",
 'dataset.vnvTranslatorAuthority="linguistics"',
 'dataset.vnvTranslatorAuthority="vnv-fallback"',
 "https://vervenveda.com/assets/vnv-language.js?v=20261124-header-slot"
]) assert(shell.includes(token),"shared shell missing translator authority token: "+token);

const iCampus=shell.indexOf("khaemenes-campus-phrases.js");
const iCore=shell.indexOf("khaemenes-interlingual-core.js");
const iLoader=shell.indexOf("khaemenes-translator-loader.js?v=1.1.1");
const iEnsure=shell.indexOf("ensure?.({full:true,upgradeLegacyCore:true})");
const iUi=shell.indexOf("vnv-language.js?v=20261124-header-slot");
assert(iCampus>=0 && iCore>iCampus && iLoader>iCore && iEnsure>iLoader && iUi>iEnsure,
 "translator chain must load seeds -> fallback core -> Linguistics loader -> full canonical ensure -> UI");

const tools=fs.readFileSync(toolsPath,"utf8");
assert(tools.includes('if(document.body?.dataset.electiveLanding==="v1")return;'),
 "elective pages must not create the legacy left-toolbar translator panel");

for(const page of electivePages){
 const html=fs.readFileSync(page,"utf8");
 assert(html.includes("high-department-landing-shell-v1.js"),page+" must use the shared shell");
 for(const forbidden of [
  "vnv-language.js?v=20261108-cream-buttons",
  "vnv-language.js?v=20261121-half-height",
  "khaemenes-translator-loader.js?v=1.1.1",
  "khaemenes-interlingual-core.js",
  "khaemenes-campus-phrases.js",
  "vnv-header-autopopulate.js",
  "vnv-333-ticker.js",
  "vnv-ticker-autopopulate.js",
  "vnv-class-tools-toolbar.js?v=1.6.1",
  "vnv-ecosystem-toolbar.js"
 ]){
  assert(!html.includes(forbidden),page+" must not directly load shared chrome/translator resource: "+forbidden);
 }
}
const hall=fs.readFileSync(hallPath,"utf8");
assert(!hall.includes("VNV_HEADER.mount("),"Discovery Hall must not directly mount a second header");
assert(!hall.includes("VNV_TICKER.autoPopulate("),"Discovery Hall must not directly mount a second auto ticker");

console.log("PASS: elective translator ownership is single-source; full Linguistics resources load before the VNV translation UI, with explicit fallback authority.");

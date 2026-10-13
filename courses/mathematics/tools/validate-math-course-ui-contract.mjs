import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];
const notes = [];
const exists = p => fs.existsSync(p);
const read = p => fs.readFileSync(p, "utf8");
function walk(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
function check(condition, message) {
  if (!condition) failures.push(message);
}
const mathRoot = path.join(root,"courses","mathematics");
const courseIds = ["pre-algebra","algebra-1","algebra-2","geometry"];
const summary = {};
for (const id of courseIds) {
  const courseRoot = path.join(mathRoot,id);
  const lessonFiles = walk(path.join(courseRoot,"units")).filter(file => file.includes(path.sep+"lessons"+path.sep) && file.endsWith(".html"));
  summary[id] = {lessons:lessonFiles.length,checked:0};
  check(lessonFiles.length > 0, id+": no lesson pages found.");
  for (const file of lessonFiles) {
    const html = read(file);
    const rel = path.relative(root,file).split(path.sep).join("/");
    if (id === "pre-algebra") {
      check(html.includes("assets/lesson-engine.js"), rel+": expected lesson engine reference.");
      const match = rel.match(/units\/(unit-\d+)\//);
      const cssPath = match ? path.join(courseRoot,"units",match[1],"assets","unit.css") : "";
      check(cssPath && exists(cssPath), rel+": unit stylesheet missing.");
      if (cssPath && exists(cssPath)) check(read(cssPath).includes("math-course-standard-v1.css"), path.relative(root,cssPath)+": shared UI contract not imported.");
    } else if (id === "algebra-1") {
      check(html.includes("deep-lesson-engine-v1.js"), rel+": expected shared lesson engine reference.");
      const match = rel.match(/units\/(unit-\d+)\//);
      const cssPath = match ? path.join(courseRoot,"units",match[1],"assets",match[1].replace("unit-","unit")+".css") : "";
      check(cssPath && exists(cssPath), rel+": unit stylesheet missing.");
      if (cssPath && exists(cssPath)) check(read(cssPath).includes("math-course-standard-v1.css"), path.relative(root,cssPath)+": shared UI contract not imported.");
    } else {
      check(html.includes("assets/lesson-tools.js"), rel+": expected shared lesson tools reference.");
      const cssPath = path.join(courseRoot,"assets","styles.css");
      check(exists(cssPath), id+": shared stylesheet missing.");
      if (exists(cssPath)) check(read(cssPath).includes("math-course-standard-v1.css"), path.relative(root,cssPath)+": shared UI contract not imported.");
    }
    summary[id].checked++;
  }
  const home = path.join(courseRoot,"index.html");
  check(exists(home), id+": course home page missing.");
  if (exists(home)) {
    const html = read(home);
    check(html.includes("math-course-standard-v1.css"), id+": course home does not load shared typography/grid contract.");
    check(html.includes("vnv-beta-link.js"), id+": course home does not load Beta Program button.");
  }
}
const standardCss = path.join(mathRoot,"assets","math-course-standard-v1.css");
check(exists(standardCss), "Shared math UI stylesheet missing.");
if (exists(standardCss)) {
  const css = read(standardCss);
  check(/font-size:\s*55px\s*!important/.test(css), "Shared UI contract must set eyebrow to 55px.");
  check(/font-size:\s*33px\s*!important/.test(css), "Shared UI contract must set H1 to 33px.");
  check(/font-size:\s*24px\s*!important/.test(css), "Shared UI contract must set H2 to 24px.");
  check(css.includes("grid-template-columns:repeat(auto-fit"), "Shared UI contract must provide responsive equal-card grids.");
}
const standardJs = path.join(mathRoot,"assets","math-course-page-standard-v1.js");
check(exists(standardJs), "Shared lesson enhancement script missing.");
if (exists(standardJs)) {
  const js = read(standardJs);
  check(js.includes("function addBreadcrumb"), "Shared lesson enhancement must provide breadcrumb fallback.");
  check(js.includes("function addGame"), "Shared lesson enhancement must provide a learning-game fallback.");
  check(js.includes("function loadBetaButton"), "Shared lesson enhancement must load the Beta Program button.");
}
const gamesRoot = path.join(mathRoot,"assets","learning-games");
const gamePages = walk(gamesRoot).filter(file => file.endsWith(path.sep+"index.html"));
const gameNav = path.join(gamesRoot,"math-game-navigation-v1.js");
check(exists(gameNav), "Shared game breadcrumb script missing.");
for (const file of gamePages) {
  const html = read(file);
  const rel = path.relative(root,file).split(path.sep).join("/");
  check(html.includes("math-game-navigation-v1.js"), rel+": game return-breadcrumb script not loaded.");
}
summary.learningGames = {pages:gamePages.length,returnNavigationScriptLoaded:gamePages.filter(file=>read(file).includes("math-game-navigation-v1.js")).length};
const preEngines = walk(path.join(mathRoot,"pre-algebra","units")).filter(file => file.endsWith(path.sep+"lesson-engine.js"));
for (const file of preEngines) check(read(file).includes("math-course-page-standard-v1.js"), path.relative(root,file)+": shared page standard not loaded.");
for (const file of [
  path.join(mathRoot,"algebra-1","assets","deep-lesson-engine-v1.js"),
  path.join(mathRoot,"algebra-2","assets","lesson-tools.js"),
  path.join(mathRoot,"geometry","assets","lesson-tools.js")
]) check(exists(file) && read(file).includes("math-course-page-standard-v1.js"), path.relative(root,file)+": shared page standard not loaded.");
const gameSlugs = new Set(gamePages.map(file=>path.basename(path.dirname(file))));
for (const file of preEngines) {
  const source = read(file);
  for (const match of source.matchAll(/(?:sharedGame|game)\s*:\s*"([a-z0-9-]+)"/g)) {
    check(gameSlugs.has(match[1]), "Pre-Algebra companion game "+match[1]+" has no published game page.");
  }
}
for (const slug of ["number-family","equation-balance-lab","function-transformation-studio","proof-path-builder","integer-compass","fraction-forge","ratio-atelier","polynomial-factoring-forge","inequality-number-line","slope-and-rate-studio","quadratic-graph-lab","exponential-logarithm-lab","sequence-series-studio","right-triangle-trig","complex-plane-lab","statistics-detective"]) {
  check(gameSlugs.has(slug), "Shared lesson fallback game "+slug+" has no published game page.");
}
notes.push("Source-level validation does not simulate clicks, test remote HTTP status, or replace desktop/mobile/screen-reader QA.");
console.log(JSON.stringify({summary,failures,notes},null,2));
if (failures.length) process.exitCode = 1;

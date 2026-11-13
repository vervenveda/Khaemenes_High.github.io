"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),base="courses/science/integrated-science-9/";
const html=fs.readFileSync(path.join(root,base,"index.html"),"utf8");
const css=fs.readFileSync(path.join(root,base,"science9-vnv-ka-blueprint-v1.css"),"utf8");
function count(needle){return html.split(needle).length-1}
assert.equal(count('href="science9-vnv-ka-blueprint-v1.css"'),1,"One scoped blueprint stylesheet");
assert.equal(count('class="ka-science9-blueprint"'),1,"Only the Science landing page receives styling");
assert.equal(count('<main class="main">'),1);
assert.equal(count('<aside class="sidebar">'),1);
assert.ok(html.indexOf('<aside class="sidebar">')>html.indexOf('<section class="hero">'),"Course controls must follow hero");
assert.ok(html.indexOf('<aside class="sidebar">')<html.indexOf('<nav class="tabs'),"Course controls must precede lesson tabs");
assert.equal(count('<details class="sideBox science-week-drawer">'),1,"Weeks must be collapsible");
for(const id of ["studentSelect","studentName","addStudentBtn","demoBtn","deleteStudentBtn","pathway","pathwayMessage","weekList","content","themeBtn"]){
 assert.equal(count('id="'+id+'"'),1,"One and only one "+id);
}
for(const view of ["dashboard","week","scope","lab","assessments","reports","standards"]){
 assert.ok(html.includes('data-view="'+view+'"'),"View navigation retained: "+view);
}
assert.match(html,/<h1>Integrated Science 9<\/h1>/);
assert.match(html,/class="academy-eyebrow">Khaemenes Academy/);
assert.ok(html.includes('passingTarget":80'),"80% assessment requirement preserved");
assert.ok(html.includes('src="science9-backup-guard-v1.js"'),"Protected backup guard retained");
assert.ok(html.includes('assets/science9-entry-gate.js'),"Existing science entrance policy retained");
assert.ok(html.includes('data-official-vnv-ecosystem-toolbar="true"'),"Canonical toolbar retained");
assert.ok(css.includes("max-width:1120px!important"),"Centered Academy layout");
assert.ok(css.includes("background:#243038!important"),"Charcoal Academy hero");
assert.ok(css.includes("background:#fffdf8!important"),"Parchment Academy cards");
assert.ok(css.includes("font-size:16px!important"),"Readable controls");
assert.ok(css.includes("@media(max-width:540px)"),"Narrow-screen breakpoint");
const marker="const APP=",start=html.indexOf(marker),end=html.indexOf("</script>",start);
assert.ok(start>=0&&end>start,"Core science course app remains present");
assert.doesNotThrow(()=>new vm.Script(html.slice(start,end),{filename:"science9-main-inline-script.js"}),"Core learning JS syntax");
console.log("PASS Science 9 approved landing blueprint: centered page, preserved learner IDs, mastery, lessons, lab, archive and course engine.");

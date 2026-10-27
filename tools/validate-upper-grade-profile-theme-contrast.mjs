/* Verifies the ACTUAL palette implementation in student-profile-theme-photo.js
   with fictional theme values; no learner records or network access. */
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const src=fs.readFileSync("grades/shared/student-profile-theme-photo.js","utf8");
const css=fs.readFileSync("grades/shared/upper-grade-profile.css","utf8");
const start=src.indexOf("const isHex=");
const end=src.indexOf("function render()",start);
assert.ok(start>0&&end>start,"Real palette implementation is accessible for regression tests");
const paletteCode=src.slice(start,end);
assert.match(paletteCode,/luminance\(chosen\)/,"palette uses perceived luminance");
assert.match(paletteCode,/dataset\.khaeProfileTheme/,"profile theme state is broadcast to CSS");
assert.match(src,/window\.addEventListener\("storage"/,"saved color changes are observed");
assert.match(src,/khaemenes\.grade/,"original learner-specific appearance key remains");
assert.match(css,/dialog\.ug-profile-dialog[\s\S]*1060px/,"profile dialog uses wide viewport-safe layout");
assert.match(css,/#myLearningJourney/,"learning-journey popup uses coordinated theme");
assert.match(css,/--ug-control-ink/,"form controls have explicit readable ink");
assert.match(css,/min-width:0!important/,"dialogs can fit narrow devices");

function luminance(hex){
 const values=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
 const linear=values.map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);
 return linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
}
function contrast(a,b){
 const x=luminance(a),y=luminance(b);
 return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
const examples=[
 "#101c2e","#ffffff","#000000","#ff0000","#00ff00","#0000ff",
 "#787878","#686868","#ff00ff","#ffff00","#e8cfc5","#007a7b",
 "#9361ac","#123456","#b78f00","#333333","#fc8f8f"
];
for(const chosen of examples){
 const values={};
 const document={
  documentElement:{
   style:{setProperty(name,value){values[name]=value}},
   dataset:{}
  },
  body:{style:{}}
 };
 const code=paletteCode+"\nsetBackground("+JSON.stringify(chosen)+");";
 vm.runInNewContext(code,{defaults:{background:"#101c2e"},document},{timeout:1200});
 assert.equal(values["--ug-bg"],chosen,"chosen background must be preserved");
 const ink=values["--ug-ink"],panel=values["--ug-panel"],button=values["--ug-panel2"],muted=values["--ug-muted"];
 for(const [name,bg,fg] of [["panel",panel,ink],["secondary",button,ink],["body text",panel,muted]]){
   const ratio=contrast(bg,fg);
   assert.ok(ratio>=4.5,chosen+" "+name+" is only "+ratio.toFixed(2)+":1; requires 4.5:1");
 }
 assert.equal(document.body.style.backgroundColor,chosen);
}
console.log("PASS theme contrast for "+examples.length+" learner colors, wide dialogs, and saved-key isolation");

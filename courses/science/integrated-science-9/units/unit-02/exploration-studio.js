"use strict";
(()=>{
const page=location.pathname.split("/").pop();
const mode=page==="virtual-microscopy.html"?"microscope":page==="cell-model-gallery.html"?"cells":page==="membrane-transport-lab.html"?"osmosis":null;
if(!mode)return;
const html=s=>{const t=document.createElement("template");t.innerHTML=s.trim();return t.content.firstElementChild};
const setup=()=>{
 const main=document.querySelector("main");if(!main||document.getElementById("khaeExploration"))return;
 const host=html('<section id="khaeExploration" class="card lesson-page" style="max-width:1100px;margin:22px auto;padding:20px;border-radius:7px"><h2>Khaemenes Academy · Investigation Studio</h2><p>Original interactive practice model. These observations are formative, not a scored assessment. Models are simplified and cannot replace measurements on physical specimens.</p><div id="exploreControls"></div><div id="exploreOutput" role="status" aria-live="polite"></div><label for="exploreEvidence" style="display:block;margin-top:14px">Observation, scientific explanation, and one model limitation</label><textarea id="exploreEvidence" rows="5" style="display:block;width:100%;max-width:100%;font:inherit" placeholder="I changed... I observed... This suggests... One limitation is..."></textarea><div style="margin-top:12px"><button type="button" id="explorePrint">Print investigation evidence</button></div><p class="explorePrintHeading" style="display:none">Khaemenes Academy · Grade 9 Science · Unit 02<br>Student name: __________________________ Date: _________________</p></section>');
 main.append(host);
 const controls=host.querySelector("#exploreControls"),out=host.querySelector("#exploreOutput");
 const show=message=>out.textContent=message;
 if(mode==="microscope"){
  controls.innerHTML='<label for="imageWidth">Measured model image width (mm)</label><input type="number" min="0.1" max="1000" step="0.1" value="24" id="imageWidth"><label for="magFactor">Magnification (×)</label><input type="range" min="40" max="1000" step="20" value="400" id="magFactor"><output id="magValue">400×</output><p>Calculate: actual width = measured image width ÷ magnification. Convert millimetres to micrometres.</p>';
  const recalc=()=>{const w=Number(controls.querySelector("#imageWidth").value),mag=Number(controls.querySelector("#magFactor").value);controls.querySelector("#magValue").textContent=mag+"×";show(Number.isFinite(w)&&w>0?"Estimated actual width: "+(w*1000/mag).toFixed(2)+" µm. A larger display does not improve optical resolution; these station drawings are not calibrated photomicrographs.":"Enter a positive measured width.")};controls.addEventListener("input",recalc);recalc();
 }else if(mode==="cells"){
  const data={plant:["Cell wall","Plasma membrane","Nucleus","Chloroplasts","Mitochondria"],animal:["Plasma membrane","Nucleus","Mitochondria","No cellulose cell wall"],bacterium:["Plasma membrane","Cell wall (common but not universal)","Nucleoid","Ribosomes","No membrane-bound nucleus"]};
  controls.innerHTML='<label for="cellType">Compare a simplified cell model</label><select id="cellType"><option value="plant">Photosynthetic plant cell</option><option value="animal">Animal cell</option><option value="bacterium">Bacterial cell</option></select><p>Inspect the matching original diagrams above. Decide which visible structures support your classification.</p>';
  const recalc=()=>show("Model features: "+data[controls.querySelector("#cellType").value].join("; ")+". Colors and relative organelle size are schematic, not measured.");controls.addEventListener("change",recalc);recalc();
 }else{
  controls.innerHTML='<label for="outsideSolute">Outside sucrose concentration (mol/L)</label><input type="range" id="outsideSolute" min="0" max="0.8" step="0.05" value="0.4"><output id="soluteValue">0.40 mol/L</output><p>Reference model: potato tissue equilibrium near 0.40 mol/L, based only on the fictional dataset in this lesson.</p><label for="waterModel">Predicted water movement</label><select id="waterModel"><option value="water">Simplified water-potential model</option></select>';
  const calc=()=>{let v=Number(controls.querySelector("#outsideSolute").value);controls.querySelector("#soluteValue").textContent=v.toFixed(2)+" mol/L";let change=(0.4-v)*20;show("Illustrative predicted mass change: "+(change>=0?"+":"")+change.toFixed(1)+"%. "+(change>0?"Net water enters the tissue.":change<0?"Net water leaves the tissue.":"Approximately zero net movement; water molecules still move both ways.")+" This is linear interpolation/extrapolation of a fictional classroom dataset, not a validated biological prediction.");};controls.addEventListener("input",calc);calc();
 }
 host.querySelector("#explorePrint").addEventListener("click",()=>window.print());
 const style=document.createElement("style");style.textContent='#khaeExploration input,#khaeExploration select{display:block;max-width:100%;margin:5px 0 12px;padding:8px}#khaeExploration input[type=range]{width:min(100%,480px)}@media print{#khaeExploration .explorePrintHeading{display:block!important}#explorePrint{display:none!important}#khaeExploration{break-inside:avoid}#exploreEvidence{border:1px solid #555;color:#111}}';document.head.append(style);
};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});else setup();
})();
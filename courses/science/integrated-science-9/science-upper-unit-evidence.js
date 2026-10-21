"use strict";
/* Optional evidence notes for established Unit 07–12 labs; never changes scored records. */
(()=>{
const allowed={
"07":["bonding-formula-lab","equation-conservation-lab","energy-rate-lab","structure-property-lab"],
"08":["motion-graph-lab","force-newton-lab","momentum-impulse-lab","energy-work-power-lab"],
"09":["wave-equation-lab","circuit-data-lab","magnetism-induction-lab","information-signal-lab"],
"10":["earth-interior-plate-lab","watershed-surface-lab","biogeochemical-cycle-lab","climate-energy-balance-lab"],
"11":["solar-system-orbit-lab","stellar-spectra-lab","exoplanet-transit-lab","galaxy-expansion-lab"],
"12":["decision-matrix-lab","prototype-testing-lab","life-cycle-lab","risk-reliability-lab"]};
const match=location.pathname.match(/\/units\/unit-(0[7-9]|1[0-2])\/([^/]+)\.html$/);if(!match||!allowed[match[1]]?.includes(match[2]))return;
function mount(){const main=document.querySelector("main");if(!main||document.getElementById("khUpperEvidence"))return;
const section=document.createElement("section");section.id="khUpperEvidence";section.className="card lesson-page";
const title=match[2].replace(/-/g," ");
section.innerHTML='<h2>Khaemenes Academy · Investigation Evidence</h2><p>Grade 9 Science · Unit '+match[1]+' · '+title+'</p><p>Student name: __________________________ Date: ________________</p><p>Record observations and limitations from the existing laboratory. This optional evidence does not award mastery or change grades.</p><p><label for="khUpperNotes">Observation, calculations, conclusion, uncertainty and source notes</label><textarea id="khUpperNotes" rows="6" style="display:block;width:min(100%,650px);max-width:100%;font:inherit"></textarea></p><p id="khUpperStatus" role="status" aria-live="polite">Describe what the evidence supports and what it cannot establish.</p><button type="button" id="khUpperPrint">Print investigation</button>';
main.append(section);const style=document.createElement("style");style.textContent='#khUpperEvidence{box-sizing:border-box;max-width:1050px;width:min(100%,1050px);margin:22px auto;padding:18px;border-radius:7px;overflow-wrap:anywhere}#khUpperEvidence label{display:block;margin-bottom:7px}@media print{#khUpperPrint{display:none!important}#khUpperEvidence{color:#111;break-inside:avoid}}';document.head.append(style);
section.querySelector("#khUpperPrint").addEventListener("click",()=>window.print());
const loader=document.createElement("script");loader.src=new URL("science-formative-evidence.js",document.currentScript?.src||new URL("../../science-upper-unit-evidence.js",location.href)).href;loader.defer=true;document.head.append(loader);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
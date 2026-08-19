(() => {
"use strict";

const BETA_WIDGET = "https://vervenveda.com/assets/vnv-beta-link.js";
const SCRIPT_ID = "vnvBetaWidgetScript";

function removeLegacyBeta(){
  document.querySelectorAll(
    ".khae-ss-beta, .kbeta, #khaeSSBeta, #kssBeta, [data-khae-legacy-beta]"
  ).forEach(el => el.remove());
}

function loadUniversalBeta(){
  if(document.getElementById("vnvBetaProgramLink")) return;
  if(document.getElementById(SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = BETA_WIDGET;
  script.defer = true;
  document.head.appendChild(script);
}

function boot(){
  removeLegacyBeta();
  loadUniversalBeta();
  setTimeout(removeLegacyBeta, 50);
  setTimeout(removeLegacyBeta, 250);
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", boot, {once:true});
}else{
  boot();
}
})();
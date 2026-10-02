(() => {
"use strict";
/* Optional host seam. Grade 9 never downloads a beta widget merely to boot. */
function removeLegacyBeta(){document.querySelectorAll(".khae-ss-beta,.kbeta,#khaeSSBeta,#kssBeta,[data-khae-legacy-beta]").forEach(el=>el.remove())}
function boot(){removeLegacyBeta();const host=window.KhaemenesBetaWidget;if(host&&typeof host.mount==="function"){try{host.mount({course:"global-studies-9"})}catch(e){console.warn("Optional host beta widget unavailable",e)}}}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();

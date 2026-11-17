/* Compatibility shim · current deployment endpoint: vervenveda.com/assets/vnv-class-tools-toolbar.js\n   Canonical v1.1 source is mirrored in KhaemenesAcademy/vervenveda.github.io for gateway migration. */
(()=>{"use strict";
if(window.VNVClassToolsToolbar){void window.VNVClassToolsToolbar.mount();return;}
if(document.querySelector('script[data-vnv-class-tools]'))return;
const s=document.createElement("script");
s.src="https://vervenveda.com/assets/vnv-class-tools-toolbar.js";
s.defer=true;
s.dataset.vnvClassTools="1";
(document.head||document.documentElement).append(s);
})();
/* Compatibility shim · canonical engine lives at vervenveda.com/assets/vnv-class-tools-toolbar.js */
(()=>{"use strict";
if(window.VNVClassToolsToolbar){void window.VNVClassToolsToolbar.mount();return;}
if(document.querySelector('script[data-vnv-class-tools]'))return;
const s=document.createElement("script");
s.src="https://vervenveda.com/assets/vnv-class-tools-toolbar.js";
s.defer=true;
s.dataset.vnvClassTools="1";
(document.head||document.documentElement).append(s);
})();
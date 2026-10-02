'use strict';
if('serviceWorker' in navigator&&location.protocol!=='file:'){const script=document.currentScript;const swUrl=script?new URL('../service-worker.js',script.src).href:new URL('service-worker.js',location.href).href;window.addEventListener('load',()=>navigator.serviceWorker.register(swUrl).catch(()=>{}));}

const CACHE='khaemenes-ss10-v1-repair-20261012';
const CORE=['./','./index.html','./styles.css','./app.js','./course-data.js','./offline.html','./manifest.webmanifest','./assessments/midterm.html','./assessments/final.html','./assessments/correction-form.html','./resources/index.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("khaemenes-ss10-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(matchReleaseCache(e.request).then(hit=>hit||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>matchReleaseCache('./offline.html'))))});

function matchReleaseCache(request){return caches.open(CACHE).then(cache=>cache.match(request));}

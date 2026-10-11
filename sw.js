/* Service worker : l'outil et les fiches PDF restent disponibles sans connexion.
   Après une mise à jour des PDF, augmenter VERSION pour les recharger. */
const VERSION='tt-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
const PDFS=["pdf/1re-S1.pdf","pdf/1re-S2.pdf","pdf/1re-S3.pdf","pdf/1re-S4.pdf","pdf/1re-S5.pdf","pdf/1re-S6.pdf","pdf/1re-S7.pdf","pdf/1re-S8.pdf","pdf/1re-S9.pdf","pdf/Auto-L1.pdf","pdf/Auto-L2.pdf","pdf/Auto-L3.pdf","pdf/Auto-L4.pdf","pdf/Auto-L5.pdf","pdf/Auto-L6.pdf","pdf/Auto-L7.pdf","pdf/Auto-L8.pdf","pdf/Auto-L9.pdf","pdf/Autonomie-etoile-grille.pdf","pdf/Banque-exercices.pdf","pdf/Carnet-entrainement.pdf","pdf/Catalogue-autonomie.pdf","pdf/Cycle-Autonomie.pdf","pdf/Cycle-Premiere.pdf","pdf/Cycle-Terminale.pdf","pdf/Fiche-echauffement-equipe.pdf","pdf/Fiche-evaluation-finale.pdf","pdf/Tle-S1.pdf","pdf/Tle-S2.pdf","pdf/Tle-S3.pdf","pdf/Tle-S4.pdf","pdf/Tle-S5.pdf","pdf/Tle-S6.pdf","pdf/Tle-S7.pdf","pdf/Tle-S8.pdf","pdf/Tle-S9.pdf"];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(VERSION);await c.addAll(SHELL);await Promise.all(PDFS.map(u=>c.add(u).catch(()=>{})));self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==VERSION)await caches.delete(k);await self.clients.claim()})())});
/* Page : réseau d'abord (3 s max), sinon la copie en cache. PDF, icônes, polices : cache d'abord. */
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){e.respondWith((async()=>{const c=await caches.open(VERSION);
    try{const net=await Promise.race([fetch(r),new Promise((_,no)=>setTimeout(no,3000))]);if(net&&net.ok)c.put('index.html',net.clone());return net}
    catch(x){return (await c.match('index.html'))||(await c.match('./'))||Response.error()}})());return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith((async()=>{const c=await caches.open(VERSION);const hit=await c.match(r,{ignoreSearch:u.origin===location.origin});if(hit)return hit;
      try{const net=await fetch(r);if(net&&(net.ok||net.type==='opaque'))c.put(r,net.clone());return net}catch(x){return hit||Response.error()}})());
  }
});

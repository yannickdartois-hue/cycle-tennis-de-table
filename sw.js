/* Service worker : l'appli et ses fiches PDF restent disponibles sans connexion.
   Mises à jour automatiques : quand le réseau est là, l'appli demande une vérification ;
   la page et les fichiers modifiés sur GitHub sont rechargés tout seuls, sans changer de numéro de version.
   Fichiers listés ci-dessous : à compléter si tu ajoutes une fiche PDF (la vérification GitHub le signale). */
const CACHE='cycle-tennis-de-table-v19';
// Toutes les applis partagent le même stockage (même adresse github.io) : on n'efface QUE les anciennes versions de CETTE appli.
const MES_CACHES=/^(?:cycle\-tennis\-de\-table\-v|tt\-)\d+$/;

const SHELL=["tennis-de-table-donnees.js", "outils.html", "tennis-de-table-old.html", "polices/archivo.woff2", "polices/atkinson-400.woff2", "polices/atkinson-700.woff2", "eps-design.css", "eps-outil.css", "eps-charte-v1.css", "ecran.css", "ecran.js", "aide-ecran.js", "eps-aide.js", "eps-commun.js", "./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-32.png", "icon-512.png"];
const FILES=["pdf/1re-S1.pdf", "pdf/1re-S2.pdf", "pdf/1re-S3.pdf", "pdf/1re-S4.pdf", "pdf/1re-S5.pdf", "pdf/1re-S6.pdf", "pdf/1re-S7.pdf", "pdf/1re-S8.pdf", "pdf/1re-S9.pdf", "pdf/Auto-L1.pdf", "pdf/Auto-L2.pdf", "pdf/Auto-L3.pdf", "pdf/Auto-L4.pdf", "pdf/Auto-L5.pdf", "pdf/Auto-L6.pdf", "pdf/Auto-L7.pdf", "pdf/Auto-L8.pdf", "pdf/Auto-L9.pdf", "pdf/Autonomie-etoile-grille.pdf", "pdf/Banque-exercices.pdf", "pdf/Carnet-entrainement.pdf", "pdf/Catalogue-autonomie.pdf", "pdf/Cycle-Autonomie.pdf", "pdf/Cycle-Premiere.pdf", "pdf/Cycle-Terminale.pdf", "pdf/Fiche-echauffement-equipe.pdf", "pdf/Fiche-evaluation-finale.pdf", "pdf/Tle-S1.pdf", "pdf/Tle-S2.pdf", "pdf/Tle-S3.pdf", "pdf/Tle-S4.pdf", "pdf/Tle-S5.pdf", "pdf/Tle-S6.pdf", "pdf/Tle-S7.pdf", "pdf/Tle-S8.pdf", "pdf/Tle-S9.pdf"];

self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  await c.addAll(SHELL);
  await Promise.all(FILES.map(u=>c.add(u).catch(()=>{})));
  self.skipWaiting();
})())});

self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(MES_CACHES.test(k)&&k!==CACHE)await caches.delete(k);
  await self.clients.claim();
})())});

/* Page : réseau d'abord (3 s max), sinon la copie en cache. Le reste : cache d'abord. */
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){e.respondWith((async()=>{
    const c=await caches.open(CACHE);const K=(/\/(index\.html)?$/.test(u.pathname))?'index.html':r;
    try{const net=await Promise.race([fetch(r),new Promise((_,no)=>setTimeout(no,3000))]);
      if(net&&net.ok){c.put(K,net.clone());return net}
      throw 0}
    catch(x){return (await c.match(K))||(await c.match('index.html'))||(await c.match('./'))||fetch(r)}
  })());return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith((async()=>{
    const c=await caches.open(CACHE);const hit=await c.match(r,{ignoreSearch:u.origin===location.origin});if(hit)return hit;
    try{const net=await fetch(r);if(net&&(net.ok||net.type==='opaque'))c.put(r,net.clone());return net}catch(x){return Response.error()}
  })())}
});

/* Vérification des mises à jour, demandée par la page quand le réseau est là. */
const sig=res=>res?[res.headers.get('etag'),res.headers.get('last-modified'),res.headers.get('content-length')].join('|'):'';
async function check(){
  const c=await caches.open(CACHE);let page=false,files=0;
  try{
    const net=await fetch('index.html',{cache:'no-store'});
    if(net.ok){const old=await c.match('index.html'),a=await net.clone().text(),b=old?await old.text():'';
      if(a!==b){await c.put('index.html',net);page=true}}
  }catch(x){return null}
  for(const u of SHELL.concat(FILES)){
    if(u==='./'||u==='index.html')continue;
    try{const old=await c.match(u);if(!old)continue;
      const net=await fetch(u,{cache:'no-cache'});
      if(net.ok&&sig(net)!==sig(old)){await c.put(u,net);files++}}catch(x){}
  }
  return {page,files};
}
self.addEventListener('message',e=>{
  if(!e.data||e.data.type!=='check')return;
  e.waitUntil((async()=>{
    const res=await check();if(!res||(!res.page&&!res.files))return;
    for(const cl of await self.clients.matchAll({type:'window'}))cl.postMessage(Object.assign({type:'sw-updated'},res));
  })());
});

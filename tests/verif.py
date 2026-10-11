"""Vérification automatique de l'appli, lancée par GitHub à chaque modification.

Contrôle : fichiers présents, page sans erreur, fonctionnement hors ligne,
synchro Google Sheet sans aucun nom d'élève envoyé.
Réglages dans tests/config.json. Lancement local : python tests/verif.py
"""
import asyncio, json, os, re, subprocess, sys, time, urllib.request
from playwright.async_api import async_playwright

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
CONFIG = json.load(open(os.path.join(ICI, 'config.json'), encoding='utf-8'))
NOMS = ['Léa Martin', 'Lucas Moreau', 'Lina Mercier', 'Hugo Dupont', 'Élodie Faure']
ECHECS = []


def ok(cond, msg):
    print(('  ✔ ' if cond else '  ✘ ') + msg, flush=True)
    if not cond:
        ECHECS.append(msg)


def liste_sw(dossier, nom):
    s = open(os.path.join(dossier, 'sw.js'), encoding='utf-8').read()
    m = re.search(r'const ' + nom + r'\s*=\s*(\[[^\]]*\])', s)
    return json.loads(m.group(1)) if m else []


def verifier_fichiers(dossier):
    shell, files = liste_sw(dossier, 'SHELL'), liste_sw(dossier, 'FILES')
    ok(bool(shell), 'sw.js contient la liste des fichiers de base')
    manquants = [f for f in shell + files if f != './' and not os.path.exists(os.path.join(dossier, f))]
    ok(not manquants, 'tous les fichiers listés dans sw.js existent' + (f' — manquent : {manquants}' if manquants else ''))
    html = open(os.path.join(dossier, 'index.html'), encoding='utf-8').read()
    lies = sorted(set(m for m in re.findall(r'["\'(]((?:pdf/)?[\w\-]+\.pdf)["\')]', html)))
    absents = [f for f in lies if not os.path.exists(os.path.join(dossier, f))]
    ok(not absents, f'les {len(lies)} fiches PDF appelées par la page existent' + (f' — manquent : {absents}' if absents else ''))
    sur_disque = sorted(set(
        ['pdf/' + f for f in os.listdir(os.path.join(dossier, 'pdf'))] if os.path.isdir(os.path.join(dossier, 'pdf')) else []
    ) | set(f for f in os.listdir(dossier) if f.endswith('.pdf')))
    hors_liste = [f for f in sur_disque if f.endswith('.pdf') and f not in files]
    ok(not hors_liste, 'toutes les fiches PDF sont gardées pour le hors ligne' + (f' — à ajouter dans FILES de sw.js : {hors_liste}' if hors_liste else ''))


def serveur(dossier, port, faux_sheet):
    args = [sys.executable, os.path.join(ICI, 'faux_sheet.py'), str(port), dossier] if faux_sheet else \
           [sys.executable, '-m', 'http.server', str(port), '-d', dossier]
    p = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    return p


async def contexte(nav, port, sw=True):
    c = await nav.new_context(service_workers='allow' if sw else 'block')
    await c.route(lambda u: f':{port}/' not in u, lambda r: r.abort())  # rien d'extérieur : comme au gymnase
    p = await c.new_page()
    erreurs = []
    p.on('pageerror', lambda e: erreurs.append(str(e)))
    return c, p, erreurs


async def verifier_hors_ligne(nav, dossier, port):
    srv = serveur(dossier, port, False)
    try:
        c, p, err = await contexte(nav, port)
        url = f'http://localhost:{port}/'
        await p.goto(url, wait_until='domcontentloaded')
        await p.evaluate("navigator.serviceWorker.ready.then(()=>1)")
        await p.reload(wait_until='domcontentloaded')
        await p.wait_for_timeout(5000)
        titre = await p.title()
        ok(bool(titre), f'la page s’ouvre (« {titre} »)')
        await c.set_offline(True)
        await p.reload(wait_until='domcontentloaded')
        ok(await p.title() == titre, 'la page s’ouvre sans réseau')
        files = liste_sw(dossier, 'FILES')
        if files:
            r = await p.evaluate(f"fetch('{files[0]}').then(r=>r.status).catch(()=>0)")
            ok(r == 200, f'une fiche s’ouvre sans réseau ({files[0]})')
        ok(not err, 'aucune erreur JavaScript' + (f' : {err[:2]}' if err else ''))
        await c.close()
    finally:
        srv.kill()


def magasin(port):
    o = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    return json.loads(o.open(f'http://127.0.0.1:{port}/__store').read())


DONNEES = {
    'tournoi': """tsSave({id:'mdT1',seance:'S2',classe:'2nde 3',mode:'simple',maxT:7,matchMin:4,changeMin:1,date:new Date().toISOString(),
      rounds:[{s:'S2',tables:[['Léa Martin','Lucas Moreau'],['Lina Mercier','Hugo Dupont']],sc:{'0-0-1':[11,7]},sub:0,m:'simple'}]});
      tsSave({id:'evT1',type:'eval',classe:'2nde 3',seance:'Évaluation',binomes:[{name:'Léa Martin / Élodie Faure',win:null,pts:null}],
      eleves:[{name:'Léa Martin',b:0},{name:'Élodie Faure',b:0}],date:new Date().toISOString()});""",
    'volley': """tsSave({id:'mdT1',kind:'classe',name:'2nde 3',students:[{n:'Léa Martin',g:'F',lvl:2,e1:'12'},{n:'Lucas Moreau',g:'G',lvl:3},
      {n:'Lina Mercier',g:'F',lvl:1},{n:'Hugo Dupont',g:'G',lvl:2},{n:'Élodie Faure',g:'F',lvl:2}],capM:{},capN:{},tid:'',date:new Date().toISOString()});
      tsSave({id:'oT1',kind:'obs',mode:'ind',who:'Lucas Moreau',by:'Lina Mercier',match:'A-B',date:new Date().toISOString(),c:{passe:3}});""",
}


async def verifier_synchro(nav, dossier, port, app, modele):
    srv = serveur(dossier, port, True)
    try:
        base = f'http://127.0.0.1:{port}/'
        regl = f"localStorage.setItem('sy-{app}-url',JSON.stringify('{base}exec'));localStorage.setItem('sy-{app}-key',JSON.stringify('secret'))"
        cA, A, eA = await contexte(nav, port, sw=False)
        await A.goto(base, wait_until='domcontentloaded')
        ok(await A.locator('.sy-btn').count() == 1, 'bouton de synchro présent')
        await A.evaluate(regl)
        await A.reload(wait_until='domcontentloaded')
        await A.wait_for_timeout(800)
        await A.evaluate(DONNEES[modele])
        await A.wait_for_timeout(5000)
        envoye = json.dumps(magasin(port), ensure_ascii=False)
        ok('mdT1' in envoye, 'les données arrivent dans le Sheet')
        fuites = [n for n in NOMS + ['Léa', 'Lucas', 'Martin', 'Dupont'] if n in envoye]
        ok(not fuites, 'aucun nom d’élève envoyé au Sheet' + (f' — FUITE : {fuites}' if fuites else ''))
        cB, B, eB = await contexte(nav, port, sw=False)
        await B.goto(base, wait_until='domcontentloaded')
        await B.evaluate(regl)
        await B.reload(wait_until='domcontentloaded')
        await B.wait_for_timeout(3000)
        await B.evaluate("const r=TS.list.mdT1;r.retour='ok';tsSave(r)")
        await B.wait_for_timeout(4500)
        await A.evaluate("window.dispatchEvent(new Event('online'))")
        await A.wait_for_timeout(3000)
        ra = await A.evaluate("JSON.stringify(TS.list.mdT1)")
        ok('"retour":"ok"' in ra and 'Léa Martin' in ra and 'L.M.' not in ra,
           'une modif faite sur un autre appareil revient avec les vrais noms')
        ok(not (eA + eB), 'aucune erreur JavaScript' + (f' : {(eA + eB)[:2]}' if eA + eB else ''))
        await cA.close(); await cB.close()
    finally:
        srv.kill()


async def principal():
    async with async_playwright() as pw:
        nav = await pw.chromium.launch()
        port = 8900
        for a in CONFIG['applis']:
            dossier = os.path.join(RACINE, a['dossier'])
            print(f"\n=== {a['nom']}", flush=True)
            verifier_fichiers(dossier)
            port += 1
            await verifier_hors_ligne(nav, dossier, port)
            if a.get('synchro'):
                port += 1
                await verifier_synchro(nav, dossier, port, a['synchro'], a['modele'])
        await nav.close()
    print('\n' + ('TOUT EST BON' if not ECHECS else f'{len(ECHECS)} PROBLÈME(S) :\n- ' + '\n- '.join(ECHECS)))
    sys.exit(1 if ECHECS else 0)


asyncio.run(principal())

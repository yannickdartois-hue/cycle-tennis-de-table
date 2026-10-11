/* ============================================================
   Synchro des applis EPS Pompidou (volley, badminton, tennis de table)
   avec ce Google Sheet.

   1. Remplace « à changer » ci-dessous par un mot de passe à toi.
   2. Déployer > Nouveau déploiement > Application Web
        Exécuter en tant que : Moi
        Qui peut accéder : Tout le monde
   3. Copie l'adresse qui se termine par /exec : tu la colles dans chaque appli.

   Les noms des élèves n'arrivent jamais ici : chaque appli les remplace
   par des initiales avant l'envoi.
   ============================================================ */

const MOT_DE_PASSE = 'à changer';

const ONGLET = 'Données';
const ENTETE = ['Appli', 'Identifiant', 'Modifié (ms)', 'Supprimé', 'Modifié le', 'Type', 'Classe', 'Séance'];
const COL_JSON = ENTETE.length + 1;  // les données commencent après les colonnes lisibles
const MORCEAU = 45000;               // une cellule Google Sheet contient au plus 50 000 caractères

function doGet() {
  return texte('La synchro EPS Pompidou fonctionne. Colle cette adresse dans les applis.');
}

function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (x) { return json({ ok: false, err: 'requete' }); }
  if (MOT_DE_PASSE === 'à changer') return json({ ok: false, err: 'mot_de_passe_non_defini' });
  if (!req || req.key !== MOT_DE_PASSE) return json({ ok: false, err: 'mot_de_passe' });
  const app = String(req.app || '');
  if (!/^[a-z]{2,12}$/.test(app)) return json({ ok: false, err: 'appli' });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = onglet();
    if (req.action === 'pull') return json({ ok: true, docs: lire(sh, app) });
    if (req.action === 'push') return json(Object.assign({ ok: true }, ecrire(sh, app, req.docs || [])));
    return json({ ok: false, err: 'action' });
  } finally {
    lock.releaseLock();
  }
}

function onglet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ONGLET);
  if (!sh) {
    sh = ss.insertSheet(ONGLET);
    sh.getRange(1, 1, 1, ENTETE.length).setValues([ENTETE]).setFontWeight('bold');
    sh.getRange(1, COL_JSON).setValue('Données (initiales uniquement)').setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function lignes(sh) {
  const n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, sh.getLastColumn()).getValues();
}

function lire(sh, app) {
  return lignes(sh)
    .filter(r => r[0] === app)
    .map(r => ({ id: String(r[1]), updated: Number(r[2]) || 0, deleted: r[3] === true || r[3] === 'oui', json: r.slice(COL_JSON - 1).join('') }));
}

function ecrire(sh, app, docs) {
  const rows = lignes(sh), index = {};
  rows.forEach((r, i) => { if (r[0] === app) index[String(r[1])] = { ligne: i + 2, updated: Number(r[2]) || 0 }; });
  const acceptes = [], refuses = [];
  docs.forEach(d => {
    if (!d || !d.id || typeof d.json !== 'string') return;
    const id = String(d.id), up = Number(d.updated) || 0, deja = index[id];
    if (deja && deja.updated >= up) { refuses.push(id); return; }  // le Sheet a déjà plus récent ou identique
    let info = {};
    try { info = JSON.parse(d.json) || {}; } catch (x) {}
    const morceaux = [];
    for (let i = 0; i < d.json.length; i += MORCEAU) morceaux.push(d.json.slice(i, i + MORCEAU));
    const val = [app, id, up, d.deleted ? 'oui' : 'non',
      Utilities.formatDate(new Date(up || Date.now()), 'Europe/Paris', 'dd/MM/yyyy HH:mm'),
      info.type || info.kind || info.mode || '', info.classe || info.name || '', info.seance || ''].concat(morceaux);
    const ligne = deja ? deja.ligne : sh.getLastRow() + 1;
    const largeur = Math.max(sh.getLastColumn(), val.length);
    if (deja) sh.getRange(ligne, 1, 1, largeur).clearContent();
    const cellules = sh.getRange(ligne, 1, 1, val.length);
    cellules.setNumberFormat('@');                       // texte brut : Google ne transforme rien
    sh.getRange(ligne, 3).setNumberFormat('0');
    cellules.setValues([val]);
    index[id] = { ligne: ligne, updated: up };
    acceptes.push(id);
  });
  return { accepted: acceptes, rejected: refuses };
}

function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function texte(s) { return ContentService.createTextOutput(s); }

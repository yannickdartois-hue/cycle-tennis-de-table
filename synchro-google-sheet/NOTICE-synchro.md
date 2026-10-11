# Synchro Google Sheet — mise en place (une seule fois, 5 minutes)

Un seul Google Sheet sert aux trois applis (volley, badminton, tennis de table).
Tu continues à taper les vrais noms dans les applis : seules des initiales partent dans le Sheet.

## 1. Créer le Sheet et le script (sur ordinateur)

1. Sur drive.google.com : Nouveau → Google Sheets. Nomme-le par exemple « Synchro EPS Pompidou ».
2. Menu **Extensions → Apps Script**.
3. Efface tout le contenu de `Code.gs`, colle à la place tout le fichier `Code.gs` fourni.
4. Ligne `const MOT_DE_PASSE = 'à changer';` : remplace `à changer` par un mot de passe à toi (gardé entre les apostrophes).
5. Enregistre (icône disquette).

## 2. Publier le script

1. Bouton **Déployer → Nouveau déploiement**.
2. Roue dentée à côté de « Sélectionner le type » → **Application Web**.
3. Exécuter en tant que : **Moi**. Qui peut accéder : **Tout le monde**.
4. **Déployer**, puis autorise l'accès avec ton compte Google (Google affiche un avertissement « application non validée » : Paramètres avancés → Accéder au projet. C'est ton propre script).
5. Copie l'adresse **Application Web**, celle qui se termine par `/exec`.

« Tout le monde » veut dire : toute personne qui a l'adresse ET le mot de passe. Sans le mot de passe, le script refuse tout.

## 3. Régler chaque appli, sur chaque appareil

1. Ouvre l'appli (depuis son icône sur l'iPad).
2. Bouton **☁** en bas à droite.
3. Colle l'adresse `/exec` et le mot de passe → **Enregistrer et synchroniser**.
4. La pastille du bouton passe au vert quand tout est envoyé.

Pastille : verte = synchronisé · orange = en attente d'envoi · rouge = problème (le message s'affiche en ouvrant ☁) · grise = pas réglé.

## À savoir

- **Hors ligne**, tout s'enregistre sur l'appareil ; l'envoi se fait tout seul au retour du réseau (ou à la réouverture de l'appli).
- **Sur le PC**, les résultats arrivent en initiales. Pour voir les vrais noms : sur l'iPad, ☁ → **Exporter la correspondance**, puis sur le PC, ☁ → **Importer**.
- **Garde une copie de la correspondance** sur ton ordinateur. Si l'iPad est perdu ou réinitialisé, c'est le seul moyen de retrouver les noms ; sans elle, tu récupères tout en initiales.
- **Un nom tapé en texte libre** (remarque, observateur) qui n'est dans aucune liste de classe ou de tournoi n'est pas détecté et partirait tel quel.
- **Si deux appareils modifient le même tournoi**, c'est la modification la plus récente qui gagne.
- Après une modification du script, refais **Déployer → Gérer les déploiements → Modifier → Nouvelle version** : l'adresse reste la même.

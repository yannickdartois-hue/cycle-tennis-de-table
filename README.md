# Cycles Tennis de table — Première et Terminale (CA4)

Outil de cycle pour le lycée Georges Pompidou (Castelnau-le-Lez) : deux entrées (cycle guidé, travail en autonomie GAREEPS), 9 séances de 75 min par cycle, évaluation en S9, tournois (montante-descendante, ronde suisse, défi ATP), plan d'observation et fiche d'évaluation. Les fiches imprimables sont dans `pdf/`.

## Hors ligne
À la première ouverture avec internet, l'outil et les 36 PDF sont gardés sur l'appareil. Ensuite il s'ouvre sans connexion. Sur iPad : Safari → Partager → « Sur l'écran d'accueil ».

## Mise à jour
- `index.html` modifié : la nouvelle version est prise à la prochaine ouverture avec internet.
- PDF modifiés : augmenter `VERSION` dans `sw.js` (tt-v1 → tt-v2) pour qu'ils soient rechargés.

## Données
Tournois, classes, séance du jour, évaluations : enregistrés dans le navigateur de l'appareil uniquement. Exporter régulièrement depuis l'onglet Tournois.

## Design commun (17/10/2026)
- `eps-design.css` et `eps-commun.js` : socle visuel partagé par tous les cycles (volley, badminton, demi-fond, tennis de table, step). Le fichier est identique dans chaque dépôt : en cas de modification, recopier la même version partout.
- Couleur de l'activité : ligne `<style>:root{--sport:…}</style>` dans `index.html`.
- **Mode gymnase** : bouton en haut à droite. Actif par défaut quand l'appli est ouverte depuis l'écran d'accueil de l'iPad.
- `index-old.html` : la version d'avant, gardée telle quelle (bandeau jaune « Ancienne version »).

## Organisation des pages (18/10/2026)
- `index.html` : **la version actuelle du cycle**, l'écran de cours (même famille que le volley et le step). Séances dans le bandeau, bascule de niveau, déroulé ajustable (rallonger, zapper, remplacer), variables, schémas.
- `tennis-de-table-old.html` : l'outil précédent, gardé par sécurité, inchangé. Tous les outils y restent (bouton « Préparer ») : c'est là qu'on marque la séance du jour.
- `tennis-de-table-donnees.js` : séances, schémas et échauffements, partagés par les deux pages.
- `polices/` : polices embarquées pour le hors ligne (licence SIL OFL).

# dsae-unikal-frontend — notes de travail

Portail public (Next.js 14, app router) du DSAE UNIKAL. Il partage le backend
Render `dsae-backend` avec le back-office `dsae-admin`.

## Commandes

```bash
npm install
npx next build      # le build doit passer sans erreur ni avertissement
npx next start      # sert le build de production (utile pour voir les erreurs runtime)
```

L'URL du backend vient de `NEXT_PUBLIC_API_URL` (repli :
`https://dsae-backend.onrender.com/api`).

## Pièges à connaître

- **Composant serveur → composant client : jamais de fonction.** Une page
  serveur (ex. `app/equipe/page.tsx`) ne peut pas passer une fonction
  (`tabOf`, `hrefOf`, `filters`, un rendu de carte) à un composant client : le
  build passe, mais la page plante à l'exécution avec « Functions cannot be
  passed directly to Client Components ». On passe des **données** (taxonomie,
  listes) et le composant client dérive ses onglets, liens et filtres lui-même
  (voir `components/PeopleCatalog.tsx`). Pour reproduire ce type de plantage en
  local : `npx next build && npx next start`, puis `curl` la page — le
  `error.tsx` renvoie 200, c'est le log serveur qui porte la trace.

- **Le nom du fichier joint ne doit jamais s'afficher.** Ni dans la fiche, ni
  dans le lecteur. Côté protocole, `media.controller.ts` renvoie
  `content-disposition: inline` **sans** `filename` en lecture ; seul le
  téléchargement (`?download=1`) porte le vrai nom.

- **Les adresses de médias sont relatives** (`/api/public/media/<id>`) et se
  rattachent à l'origine du backend via `mediaUrl()` de `lib/backend.ts`. Ne pas
  concaténer la base complète (`.../api`) : cela donne `/api/api/...` → 404.

## Vérifier un déploiement Vercel sans le tableau de bord

```bash
curl -s https://dsae-unikal-frontend.vercel.app/<page> | grep -c "Une erreur est survenue"
```
`0` = pas d'erreur. Les pages dynamiques sont servies côté serveur : le HTML
renvoyé contient déjà le contenu réel (les pages statiques, elles, montrent le
squelette « Chargement du contenu scientifique... »).

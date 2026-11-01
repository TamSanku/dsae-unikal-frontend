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

## Réglages du portail : le logo du site

Le logo s'affiche en tête et en pied de page à la place du repère écrit
« DSAE ». Il se publie depuis l'espace de gestion (`dsae-admin`, écran
« Paramètres ») et le portail le relit à chaque chargement.

- Lecture publique : `GET /api/public/site` → `{ logo: { url, alt } }`.
- Écriture (session requise) : `GET /api/settings`, `PUT /api/settings/logo`.
- Sans logo publié, `url` est vide : `BrandMark` garde le repère écrit. Le
  portail n'affiche jamais une image inventée.
- Les logos de partenaires du carrousel viennent de la rubrique « Partenaires »
  (collection `dsae-partners`) ; seuls les contenus **publiés** sont visibles.
- Le bandeau des partenaires ne montre **que des logos** : ni nom, ni carte, ni
  cadre. Il est transparent et chaque logo se pose sur la couleur de fond de
  l'endroit où la bande est placée. Un partenaire sans logo publié ne paraît pas.
- Le défilement est automatique et sans fin (deux copies de la liste, boucle
  invisible) ; aucune commande visible, survol en pause. Tous les logos ont le
  même cadre fixe. La bande est séparée de l'hero par un trait et une barre
  dégradée.
- Le logo du site se pose de la même façon, sans vignette ni cadre.
- Page Université : le bouton « En savoir plus sur l'université de Kalemie »
  mène au site officiel https://unikal.ac.cd.
- Menu principal (`components/SiteHeader.tsx`, `navItems`) et pied de page : la
  même suite, `Accueil → Actualités → À propos → Université → Équipe → Recherche
  → Publications → S’engager → Alumni` (puis « Légal et confiance » au pied de
  page). `S’engager` mène à `/s-engager`.
- Fin de fiche : un carrousel « à lire aussi » (`components/RelatedCarousel.tsx`,
  `'use client'`) ferme `app/actualites/[slug]` (les autres actualités) et
  `app/publications/[id]` (les autres documents, même domaine d'abord). Les
  cartes sont écrites par la page et passées en `children` ; le composant ne
  gère que le défilement (flèches d'un cran, éteintes aux deux bouts). La
  section disparaît s'il n'y a rien d'autre à lire.
- Le titre d'une fiche d'actualité (`.news-detail .detail-copy h1`) est réduit
  comme celui d'une publication : `clamp(1.5rem, 2vw, 2.05rem)`.
- Pied de page : fond blanc beige (`#f6f1e7`). Les rubriques sont en accordéon
  sur **tous** les écrans (`components/SiteFooter.tsx`, `'use client'`). Une
  rubrique sans sous-page est un lien direct, **sans** le repère « + » ; toute
  rubrique qui a des sous-liens porte le « + ». Les sous-menus viennent du
  contenu publié via `getSiteNav()` (`lib/backend.ts`), appelé dans
  `app/layout.tsx` et passé en prop `nav`. `getSiteNav` fournit `news` (tous les
  types d'actualité), `team`, `research`, `publications`, `engager` (les volets
  de `lib/engager.ts`) et `alumni` (domaines des diplômés publiés, à défaut la
  liste de référence).
- Le pied de page marque l'entrée courante d'après le **chemin et la requête**
  (`isHere`, table `LINK_PARAM`) : `?type=` pour Actualités, `?domain=` pour
  Publications et Alumni, `?volet=` pour S'engager. La rubrique ouverte est
  dépliée (`activeGroup`). `SiteFooter` lit `useSearchParams()`, donc il est
  enveloppé d'un `<Suspense>` dans `app/layout.tsx` — sans quoi toutes les pages
  échouent au prérendu.
- Les pages `actualites`, `equipe`, `publications`, `alumni` et `s-engager`
  lisent leur paramètre (`?type=`, `?category=`, `?domain=`, `?volet=`) et
  l'ouvrent via `initialTab`. Un paramètre inconnu est ignoré.

## Filières et axes de recherche (`/a-propos`)

La section « Filières et axes de recherche » de `app/a-propos/page.tsx` n'est pas
écrite en dur : elle lit la rubrique **Filières** (`dsae-filieres`, `kind:
research`) publiée depuis `dsae-admin` (écran « Filières »), via `getFilieres()`
de `lib/backend.ts`. Chaque fiche porte le nom de la filière et, en `summary`,
les axes de recherche qui s'y rattachent. Les quatre filières semées à
l'installation (migration `0014-seed-filieres`) sont Agroéconomie, Production
végétale, Production animale et Gestion des ressources naturelles et
renouvelables ; le semis n'a lieu que si la rubrique est vide, donc une filière
corrigée depuis l'admin n'est jamais réécrite. Sans filière publiée, la section
affiche `EmptyState`.

## Ordre d'affichage des contenus (équipe, etc.)

Chaque rubrique de l'admin se réordonne depuis la liste : deux flèches « Monter »
/ « Descendre » sur chaque fiche (`components/content/ContentView.jsx`, fonction
`move`). Le rang est porté par `sortOrder` (colonne `sort_order`, entier) ; le
backend liste déjà par `sort_order ASC, COALESCE(published_at, created_at) DESC`
(`content.service.ts`), donc l'ordre se retrouve tel quel sur le portail.
Déplacer une fiche réécrit la position de chaque ligne d'après sa place et
n'enregistre que les rangs qui changent — les contenus créés à la suite
partagent souvent le rang 0.

## Onglets des catalogues : « tout voir »

`CatalogExplorer` accepte `allTabKey` (la clé qui montre toute la liste),
`allTabLabel` et `showAllTab`. Par défaut, un bouton « Tout » (clé vide) est
ajouté en tête — équipe, publications, alumni s'en servent. Les actualités
gardent la clé vide mais donnent au bouton le libellé du serveur
(`taxonomy.newsFeaturedLabel`, « À la une ») : « À la une » n'est plus un type
d'actualité, c'est la vue d'ensemble du fil. Une actualité paraît donc à la fois
sous « À la une » et sous son type.

## Piège connu (backend)

Un contenu **publié** exige un résumé, un contenu ou un bloc, sinon `POST
/api/content/<collection>` renvoie `400`. Pour un partenaire publié, fournir au
minimum `summary`.

## Vérifier en local (bout en bout)

```bash
# Postgres + backend
docker run -d --name dsae-pg -p 5433:5432 -e POSTGRES_USER=dsae \
  -e POSTGRES_PASSWORD=dsae -e POSTGRES_DB=dsae postgres:16-alpine
cd dsae-backend && DATABASE_URL=postgres://dsae:dsae@127.0.0.1:5433/dsae \
  DSAE_DB_SCHEMA=dsae JWT_SECRET=test-secret-for-local-verification \
  PORT=3001 node dist/main.js

# Portail et back-office, pointés sur le backend local
cd dsae-unikal-frontend && NEXT_PUBLIC_API_URL=http://127.0.0.1:3001/api npx next build && npx next start -p 3100
cd dsae-admin          && NEXT_PUBLIC_API_URL=http://127.0.0.1:3001/api npx next build && npx next start -p 3101
```

Piège : `NEXT_PUBLIC_API_URL` est **figé au build**. Rebuilder après tout
changement, sinon l'ancienne adresse reste dans les chunks.

```bash
# Contrôle rapide du rendu
curl -s http://127.0.0.1:3100/ | grep -o 'brand-logo\|brand-mark\|partners-band' | sort | uniq -c
```

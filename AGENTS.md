# dsae-unikal-frontend — notes de travail

Portail public (Next.js 14, app router) du DSAE UNIKAL. Il partage le backend
Render `dsae-backend` avec le back-office `dsae-admin`.

## Commandes

```bash
npm install
npm run build       # copie le moteur PDF.js puis `next build`, sans erreur ni avertissement
npx next start      # sert le build de production (utile pour voir les erreurs runtime)
```

L'URL du backend vient de `NEXT_PUBLIC_API_URL` (repli :
`https://dsae-backend.onrender.com/api`).

`npm run dev` et `npm run build` commencent tous deux par
`npm run sync:pdf-worker` : le script recopie `pdf.worker.min.mjs` de
`pdfjs-dist` dans `public/`. Le fichier n'est **pas** versionné (il est dans
`.gitignore`) et suit la version installée — le lecteur PDF ne charge donc
jamais un moteur qui ne correspond pas à sa bibliothèque.

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

- **`xlsx` vient du CDN SheetJS, pas de npm.** `package.json` pointe sur
  `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`. La version npm est
  figée à 0.18.5, qui porte des vulnérabilités connues (prototype pollution) —
  et ce lecteur ouvre des fichiers **téléversés**, donc non fiables. Ne pas
  « simplifier » en `npm i xlsx`. L'alternative serait `exceljs`, mais il ne lit
  pas le `.xls` ni l'`.ods`.

## Vérifier un déploiement Vercel sans le tableau de bord

```bash
curl -s https://dsae-unikal-frontend.vercel.app/<page> | grep -c "Une erreur est survenue"
```
`0` = pas d'erreur. Les pages dynamiques sont servies côté serveur : le HTML
renvoyé contient déjà le contenu réel (les pages statiques, elles, montrent le
squelette « Chargement du contenu scientifique... »).

## Le lecteur plein écran (`components/DocumentReader.tsx`)

« Lire », sur une fiche de publication, n'ouvre plus un onglet : le document
prend tout l'écran par-dessus la fiche, qui reste en dessous. Rien n'est
inventé : sans document joint, la fiche affiche un message au lieu des boutons.

- **Le nom du fichier n'apparaît jamais.** La barre haute porte le retour et le
  **titre de l'article** — jamais `DSAE-UNIKAL_04.pdf`. C'est aussi la règle du
  protocole (voir « Pièges à connaître »).
- **Pas de `<iframe>` pour un PDF.** Un `<iframe>` ou un `<embed>` n'ouvre rien
  sur Android et fait apparaître le bouton « Ouvrir » du lecteur natif, ce qui
  faisait sortir le visiteur. Le PDF est dessiné dans la page par PDF.js
  (`react-pdf`), avec le moteur servi depuis notre domaine (`/pdf.worker.min.mjs`).
- **La visionneuse suit le format** (`lib/document-kind.ts`) : PDF → `react-pdf` ;
  `.docx` → `mammoth`, converti en HTML ; classeurs et CSV → `xlsx` (SheetJS),
  une feuille par onglet ; diaporamas et anciens formats bureautiques →
  visionneuse Office en ligne dans un `<iframe>` ; image, son, vidéo, texte →
  affichage direct ; le reste → message clair avec le téléchargement.
- **`.doc` et `.rtf` ne passent pas par mammoth** : il ne lit que le format
  OOXML, un ancien `.doc` lui arrive illisible. Ils vont à la visionneuse en
  ligne, qui les affiche vraiment.
- **Le HTML converti (Word, classeur) est monté par le navigateur**, jamais par
  `dangerouslySetInnerHTML` : un document venu de l'extérieur n'écrit pas dans
  notre page. Le texte brut est posé comme nœud de texte, pas comme HTML.
- **Le zoom PDF est une fraction de la largeur disponible**, pas des pixels :
  sur téléphone, « 100 % » montre la page entière, sans défilement horizontal.
- **Le lecteur pèse lourd** (PDF.js, mammoth, SheetJS). Il est chargé en
  `dynamic(() => import(...), { ssr: false })` **au clic sur « Lire »** : la
  fiche reste à ~5 ko, sinon elle monterait à ~116 ko. Ne pas le remonter en
  import statique.
- **Le retour du navigateur ferme le lecteur**, il ne quitte pas la fiche : un
  état est poussé dans l'historique à l'ouverture, et retiré à la fermeture.
  Échap ferme aussi, le focus entre sur le bouton « Retour », et le défilement
  du corps est figé pendant la lecture.

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
- Le bandeau de tête des pages intérieures est unique : `components/PageHero.tsx`
  (client), posé par chaque page avec `title`. Il ne porte **que le nom de la
  page** — l'étiquette « eyebrow » qui le répétait a été retirée. L'accroche de
  `/aide` est descendue sous le titre de la page, dans le volet.
- Le bandeau est **centré** et il **monte du bas** à l'ouverture, puis le
  contenu de la page apparaît (classe `page-enter` sur le premier bloc). Le
  bandeau reste dans le flux et la hauteur de page ne change pas : pas de saut.
  Le premier bloc de chaque page porte `page-enter` ; en ajouter un nouveau sur
  une page, c'est poser cette classe sur son premier bloc.
- Les deux retards du titre (écriture des lettres, défilement de la vague) sont
  des variables distinctes, `--letter-delay` et `--sheen-delay`. Un
  `animation-delay` unique les écraserait tous les deux et **figerait la vague**.
- Le mouvement est exprimé en `vh`, jamais en pixels : une barre de navigateur
  qui se range sur téléphone ne peut pas le fausser.
- Le titre s'écrit lettre à lettre dans un dégradé qui défile sans fin (vague de
  couleur). Les lettres sont groupées **par mot** : un titre long se replie entre
  les mots, jamais au milieu d'un mot. `aria-label` porte le nom entier ; les
  lettres sont décoratives. `prefers-reduced-motion` fige le titre.
- L'accueil garde son propre héros (`hero-shell home-panel-hero`) : il n'utilise
  pas `PageHero`. La page 404 l'utilise, sous le nom « Page introuvable ».
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

## Aide et support (`/aide`) et recherche globale

- **En-tête.** Toutes les entrées de `navItems` (`components/SiteHeader.tsx`)
  sont des liens simples, **sans** « + » ni sous-menu : « Aide et support » mène
  à `/aide` comme les autres. Les volets (FAQ, guides, signalement) sont des
  onglets **dans** la page. Un clic sur la loupe ouvre la recherche globale
  (`components/SiteSearch.tsx`, `'use client'`), posée sous la barre.
- **Page Aide.** `app/aide/page.tsx` monte `components/AideTabs.tsx` : trois
  onglets alignés sur une ligne (mêmes classes `.catalog-tabs`/`.catalog-tab`),
  un seul volet visible — choisir « FAQ » ne montre que la FAQ. Le volet suit
  l'ancre (`/aide#faq`, `/aide#guides`, `/aide#signaler`) : les liens de
  l'en-tête et du pied de page ouvrent le bon volet, et un clic met l'ancre à
  jour (`history.replaceState`). `AIDE_LINKS` (`lib/aide.ts`) reste la source
  des clés et des libellés (page, en-tête, pied de page).
- **Contenu de l'aide.** Les textes vivent dans `app/aide/content.tsx`
  (`FAQ_GROUPS`, `GUIDES_GROUPS`), pas dans la page : celle-ci ne fait que les
  ranger en onglets. Chaque entrée porte un champ `search` — la question ou le
  titre, le corps en clair, plus des synonymes. La recherche lit ce champ, jamais
  le HTML rendu. La FAQ (6 thèmes) et les guides (4 thèmes, avec étapes et
  astuce) sont rendus par `components/HelpBrowser.tsx` : recherche locale sans
  accents ni casse, un mot par terme (ET), thèmes vides masqués, compteur, et
  état « aucun résultat ». Chaque volet passe sa propre `key` — sans elle, React
  réutilise le composant d'un onglet à l'autre et la requête fuit d'un volet au
  suivant. Rien n'est inventé : les textes décrivent ce que le portail fait
  réellement (loupe + Ctrl/⌘ K, entonnoir, « À la une », avis sans compte,
  « Gérer les cookies »).
- **Recherche globale.** Le backend expose `GET /api/public/content/search?q=`
  (`public-content.controller.ts`, `content.service.ts: search()`), déclaré
  **avant** `:collection` — sinon « search » serait pris pour une rubrique. Il
  interroge toutes les rubriques publiées ; chaque mot de la requête doit se
  retrouver dans la fiche (ET), un titre qui contient la requête passe devant,
  puis les plus récentes. Le portail traduit chaque résultat en lien via
  `resultHref()` / `collectionLabel()` (`lib/backend.ts`). `SiteSearch`
  interroge après une pause de 250 ms et ignore une réponse périmée (numéro de
  requête). Sans correspondance, la liste le dit franchement.
- **Anciennes classes retirées** : `.nav-group`, `.nav-group-trigger`,
  `.nav-group-plus`, `.nav-submenu`, `.nav-sublink` (en-tête) et `.aide-nav`.
  Le `.nav-group` du **pied de page** n'existe pas : l'accordéon du pied de
  page a ses propres classes `.footer-accordion-*`.

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

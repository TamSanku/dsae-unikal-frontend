# DSAE UNIKAL Frontend

Frontend institutionnel de la faculté scientifique de l’Université de Kalemie (UNIKAL), construit avec Next.js.

## Démarrage

1. Installer les dépendances
   npm install

2. Configurer les variables d’environnement
   cp .env.example .env.local

3. Lancer le projet
   npm run dev

4. Ouvrir le navigateur
   http://localhost:3000

## Backend partagé

Ce frontend consomme le backend NestJS partagé `dsae-backend`, déployé sur Render :
`https://dsae-backend.onrender.com/api`

L’URL est configurable via la variable `NEXT_PUBLIC_API_URL`. En production, elle
doit pointer vers le service Render ; en développement, elle peut pointer vers
`http://localhost:3001/api`.

Les services backend sont centralisés dans `lib/backend.ts` (avec normalisation
des champs renvoyés par l’API). Une route de diagnostic est disponible : `/api/health`.

## Déploiement sur Vercel

1. Importer le dépôt `dsae-unikal-frontend` dans Vercel (framework détecté : Next.js).
2. Dans **Settings → Environment Variables**, ajouter :

   | Nom | Valeur |
   | --- | --- |
   | `NEXT_PUBLIC_API_URL` | `https://dsae-backend.onrender.com/api` |
   | `NEXT_PUBLIC_APP_ENV` | `production` |

3. Lancer le déploiement (build : `next build`, aucune configuration supplémentaire requise).

> Les variables `NEXT_PUBLIC_*` sont lues à la compilation : après les avoir
> modifiées, relancez un déploiement pour qu’elles soient prises en compte.

## Structure principale

- app/ : pages et routes Next.js
- components/ : composants réutilisables
- lib/ : intégration de l’API DSAE (aucune donnée en dur : le contenu vient de l’admin)

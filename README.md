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

## Préparation de l’intégration backend

Le frontend est prêt à communiquer avec le backend `dsae-backend` via la variable :

- NEXT_PUBLIC_API_URL

Exemple :
- http://localhost:8000/api

Les services backend sont centralisés dans :
- lib/backend.ts

Une route de diagnostic est aussi disponible :
- /api/health

## Structure principale

- app/ : pages et routes Next.js
- components/ : composants réutilisables
- lib/ : données, mocks et intégration API

## Remarque

Les données de démonstration sont séparées des composants pour préparer la future connexion au backend sans réécrire l’architecture du site.

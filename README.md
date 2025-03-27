# CyberArk API Explorer

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-development-orange)

Une application web moderne permettant d'explorer et d'interagir avec les API CyberArk, avec exportation des résultats en formats CSV ou JSON.

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Développement](#développement)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Roadmap](#roadmap)
- [Licence](#licence)
- [Contact](#contact)

## Vue d'ensemble

CyberArk API Explorer est une interface utilisateur moderne qui vous permet d'interagir facilement avec toutes les API GET de CyberArk. Cette application simplifie la découverte, l'exploration et l'utilisation des API CyberArk sans avoir à écrire de code, tout en offrant des fonctionnalités d'exportation pour une utilisation ultérieure des données.

### Problème résolu

Les administrateurs et développeurs travaillant avec CyberArk doivent souvent:
- Explorer manuellement les API disponibles
- Construire des requêtes API compliquées
- Gérer l'authentification et les sessions
- Formater et exporter les résultats pour analyse

CyberArk API Explorer offre une solution intégrée à ces problèmes, permettant aux utilisateurs de se concentrer sur l'utilisation des données plutôt que sur les aspects techniques de l'API.

### Technologies clés

- **Next.js 15** - Framework React avec Server Components
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utilitaire
- **Shadcn UI** - Composants UI
- **Zustand** - Gestion d'état
- **Zod** - Validation de schéma

## Fonctionnalités

### Version 1 (Actuelle)

- **Authentification simplifiée** - Connexion à n'importe quelle instance CyberArk
- **Exploration d'endpoints** - Interface intuitive pour parcourir toutes les API GET disponibles
- **Construction de requêtes** - Interface graphique pour paramétrer les requêtes API
- **Visualisation des résultats** - Affichage formaté et navigable des réponses JSON
- **Exportation de données** - Export en CSV ou JSON pour analyse ultérieure
- **Proxy API** - Contourne les problèmes CORS courants avec les API CyberArk

### Futures versions

- **Historique des requêtes** - Sauvegarde des requêtes précédentes
- **Collections** - Organisation des requêtes en collections
- **Authentification persistante** - Option de sauvegarde des informations de connexion
- **Support API POST/PUT/DELETE** - Support complet des opérations CRUD
- **Dashboards personnalisés** - Visualisations et rapports personnalisés

## Architecture

CyberArk API Explorer utilise une architecture moderne basée sur les principes suivants:

- **Server Components** - Utilisation de React Server Components pour améliorer les performances
- **API Proxy** - Contournement des problèmes CORS via un proxy Next.js
- **State Management** - Gestion d'état côté client avec Zustand
- **Progressive Enhancement** - Utilisation de React Suspense pour le chargement progressif

Pour plus de détails, voir [ARCHITECTURE.md](ARCHITECTURE.md).

## Installation

### Prérequis

- Node.js 20.x ou supérieur
- pnpm 8.x ou supérieur

### Installation rapide

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/cyberark-api-explorer.git
cd cyberark-api-explorer

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm dev
```

L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes:

```
# Environnement
NODE_ENV=development

# Configuration du serveur
PORT=3000
```

## Utilisation

### Connexion à CyberArk

1. Accédez à la page d'accueil
2. Entrez l'URL du serveur PVWA CyberArk (ex: https://cyberark.monentreprise.com)
3. Saisissez vos identifiants (nom d'utilisateur et mot de passe)
4. Sélectionnez la méthode d'authentification appropriée
5. Cliquez sur "Se connecter"

### Exploration des API

1. Parcourez les catégories d'API disponibles dans le menu de gauche
2. Sélectionnez un endpoint spécifique à explorer
3. Configurez les paramètres de requête selon vos besoins
4. Cliquez sur "Exécuter" pour voir les résultats

### Exportation des résultats

1. Après avoir exécuté une requête, cliquez sur le bouton "Exporter"
2. Choisissez le format souhaité (CSV ou JSON)
3. Configurez les options d'exportation si nécessaire
4. Cliquez sur "Télécharger" pour enregistrer le fichier

## Structure du projet

```
API_V2/
├── app/                      # Next.js App Router
├── components/               # Composants React
├── lib/                      # Bibliothèques et utilitaires
├── hooks/                    # Hooks React personnalisés
├── types/                    # Définitions de types TypeScript
├── store/                    # Stores Zustand
├── schemas/                  # Schémas Zod
├── actions/                  # Actions serveur
├── tests/                    # Tests
├── public/                   # Ressources statiques
└── docs/                     # Documentation
```

## Développement

### Scripts disponibles

```bash
# Démarrer le serveur de développement
pnpm dev

# Construire l'application pour la production
pnpm build

# Démarrer l'application en mode production
pnpm start

# Lancer les tests
pnpm test

# Vérifier le formatage et le linting
pnpm lint
```

### Conventions de code

- **Nommage des fichiers**:
  - Composants React: `PascalCase.tsx`
  - Utilitaires et hooks: `kebab-case.ts`
  - Types et interfaces: `kebab-case.d.ts`

- **Structure des composants**:
  - Préférer l'approche fonctionnelle avec hooks
  - Utiliser `export function` sans default exports
  - Typer les props explicitement

- **Styling**:
  - Utiliser Tailwind CSS pour tous les styles
  - Suivre l'approche mobile-first
  - Préférer `flex gap-n` à `space-y-n`

Pour plus de détails, voir le [Guide de contribution](CONTRIBUTING.md).

## Tests

L'application utilise plusieurs niveaux de tests:

### Tests unitaires

Tests des fonctions et composants isolés avec Jest et React Testing Library.

```bash
pnpm test:unit
```

### Tests d'intégration

Tests des interactions entre composants et des flux complets.

```bash
pnpm test:integration
```

### Tests end-to-end

Tests des parcours utilisateur complets avec Cypress.

```bash
pnpm test:e2e
```

## Déploiement

### Docker

Nous fournissons un Dockerfile pour faciliter le déploiement:

```bash
# Construire l'image
docker build -t cyberark-api-explorer .

# Exécuter le conteneur
docker run -p 3000:3000 cyberark-api-explorer
```

### Vercel / Netlify

L'application est compatible avec les plateformes de déploiement automatisé comme Vercel et Netlify.

## Roadmap

### Version 1.0 (Actuelle)
- ✅ Support d'authentification CyberArk
- ✅ Exploration des API GET
- ✅ Exportation CSV et JSON

### Version 2.0
- 🔄 Historique des requêtes
- 🔄 Collections de requêtes
- 🔄 Support de plusieurs sessions

### Version 3.0
- 🔄 Support API POST/PUT/DELETE
- 🔄 Intégration de base de données
- 🔄 Dashboards personnalisés

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Pour toute question ou suggestion, veuillez contacter l'équipe de développement à [email@exemple.com](mailto:email@exemple.com).

### Déploiement

L'application peut être déployée facilement en utilisant Docker :

```bash
# Construction du conteneur
docker-compose build

# Démarrage des services
docker-compose up -d
```

Pour plus d'informations sur le déploiement, consultez [docs/deployment/DOCKER.md](docs/deployment/DOCKER.md).# CyberArk API Explorer

![Version](https://img.shields.io/badge/version-0.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-development-orange)

Une application web moderne permettant d'explorer et d'interagir avec les API CyberArk, avec exportation des résultats en formats CSV ou JSON.

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [État du projet](#état-du-projet)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Développement](#développement)
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

### Implémentées (Phases 1-3)

- **Authentification CyberArk** - Connexion à n'importe quelle instance CyberArk avec gestion sécurisée du token
- **Exploration d'endpoints** - Interface intuitive pour parcourir les API disponibles
- **Construction de requêtes** - Interface graphique pour paramétrer les requêtes API
- **Visualisation des résultats** - Affichage formaté des réponses JSON avec options de visualisation
- **Recherche dans les résultats** - Filtrage et mise en évidence des résultats
- **Pagination** - Navigation facile dans les grands ensembles de données
- **Proxy API** - Contourne les problèmes CORS courants avec les API CyberArk
- **Exportation de données** - Export en CSV et JSON pour analyse ultérieure
- **Améliorations UX/UI** - Optimisations de l'interface utilisateur et des animations
- **Gestion d'état avancée** - Historique des requêtes et préférences utilisateur

### Prévues (Phases futures)

- **Collections** - Organisation des requêtes en collections
- **Authentification persistante** - Option de sauvegarde des informations de connexion
- **Support API POST/PUT/DELETE** - Support complet des opérations CRUD
- **Dashboards personnalisés** - Visualisations et rapports personnalisés

## État du projet

Le projet est actuellement en développement actif :

- **Phase 1 (Infrastructure) ✅** - Configuration de l'environnement et authentification
- **Phase 2 (Fonctionnalités de base) ✅** - Explorateur d'endpoints, requêtes API et affichage des résultats
- **Phase 3 (Exportation et UX) ✅** - Export de données, améliorations UX/UI, gestion d'état
- **Phase 4 (Tests et documentation) ✅** - Tests unitaires, intégration, E2E, et documentation complète
- **Phase 5 (Finalisation) 📅** - Planifiée

Pour suivre l'avancement détaillé, consultez le [document de roadmap](docs/development/ROADMAP.md).

## Architecture

CyberArk API Explorer utilise une architecture moderne basée sur les principes suivants:

- **Server Components** - Utilisation de React Server Components pour améliorer les performances
- **API Proxy** - Contournement des problèmes CORS via un proxy Next.js
- **State Management** - Gestion d'état côté client avec Zustand
- **Progressive Enhancement** - Utilisation de React Suspense pour le chargement progressif

L'application utilise une approche modulaire avec des composants spécialisés pour :
- **Authentification** - Gestion sécurisée des tokens
- **Exploration d'API** - Interface de navigation des endpoints
- **Visualisation de données** - Affichage structuré des résultats
- **Exportation** - Fonctionnalités d'exportation CSV et JSON
- **Optimisation** - Métriques Web Vitals et performance

Pour plus de détails, voir [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) et [docs/architecture/UX_UI_COMPONENTS.md](docs/architecture/UX_UI_COMPONENTS.md).

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

Pour des instructions d'installation détaillées, voir [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Utilisation

### Connexion à CyberArk

1. Accédez à la page d'accueil à l'adresse http://localhost:3000
2. Entrez l'URL du serveur PVWA CyberArk (ex: https://cyberark.example.com)
3. Saisissez vos identifiants (nom d'utilisateur et mot de passe)
4. Sélectionnez la méthode d'authentification appropriée (CyberArk, LDAP, Windows, RADIUS)
5. Cliquez sur "Se connecter"

### Exploration des API

1. Après connexion, parcourez les catégories d'API disponibles (Comptes, Coffres, Utilisateurs, etc.)
2. Sélectionnez un endpoint spécifique pour voir ses détails
3. Configurez les paramètres de requête selon vos besoins
4. Cliquez sur "Exécuter" pour voir les résultats

### Visualisation des résultats

1. Les résultats s'affichent dans un panneau dédié
2. Choisissez le mode de visualisation (JSON, Tableau, Brut)
3. Utilisez la barre de recherche pour filtrer les résultats
4. Naviguez dans les grands ensembles de données avec la pagination
5. Copiez ou téléchargez les résultats selon vos besoins

Pour un guide d'utilisation complet, voir [docs/USAGE.md](docs/USAGE.md).

## Structure du projet

```
API_V2/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes (proxy)
│   │   └── cyberark/         # Endpoints CyberArk
│   ├── dashboard/            # Dashboard pages
│   └── ...                   # Other app pages
├── components/               # Composants React
│   ├── credential/           # Authentication components
│   ├── endpoint/             # API endpoint components
│   ├── results/              # Results display components
│   └── ui/                   # UI components (Shadcn)
├── lib/                      # Bibliothèques et utilitaires
│   ├── cyberark/             # CyberArk utilities
│   └── utils.ts              # Common utilities
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
  - Stores Zustand: `kebab-case.store.ts`
  - Schémas Zod: `kebab-case.schema.ts`

- **Structure des composants**:
  - Utiliser `export function` sans default exports
  - Props comme premier argument avec type inline pour 1-2 props
  - Pour 3+ props, créer type nommé `PascalCaseProps`

- **Distinctions Server/Client**:
  - Server Components TOUJOURS `async`
  - Client Components TOUJOURS avec `'use client'` en haut
  - Jamais de hooks dans Server Components

Pour plus de détails, voir le [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

## Roadmap

### Phase 1: Infrastructure (Terminée ✅)
- ✅ Configuration du projet Next.js/TypeScript/Tailwind
- ✅ Structure de dossiers et architecture
- ✅ Authentification CyberArk (formulaire et API proxy)

### Phase 2: Fonctionnalités de base (Terminée ✅)
- ✅ Explorateur d'endpoints
- ✅ Requêtes API vers CyberArk
- ✅ Affichage des résultats

### Phase 3: Exportation et UX (Terminée ✅)
- ✅ Fonctionnalités d'exportation (CSV/JSON)
- ✅ Améliorations UX/UI
- ✅ Gestion d'état globale

### Phase 4: Tests et documentation (Terminée ✅)
- ✅ Tests complets (unitaires, intégration, E2E)
- ✅ Documentation améliorée
- ✅ Préparation au déploiement (Docker, CI/CD)

### Phase 5: Finalisation (À venir)
- 📅 Revue de code et refactoring
- 📅 Tests de sécurité
- 📅 Livraison V1

Pour plus de détails, consultez la [feuille de route complète](docs/development/ROADMAP.md).

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Pour toute question ou suggestion, veuillez contacter l'équipe de développement à [email@exemple.com](mailto:email@exemple.com).

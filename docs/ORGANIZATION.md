# Organisation du Code - CyberArk API Explorer

Ce document décrit l'organisation du code source du projet CyberArk API Explorer. Il explique la structure des dossiers et les conventions utilisées.

## Structure Principale

Le projet est organisé selon une architecture modulaire qui favorise la séparation des préoccupations et la réutilisabilité. Voici la structure principale :

```
API_V2/
├── app/                  # Application Next.js (App Router)
├── components/           # Composants React
├── lib/                  # Bibliothèques et utilitaires
├── hooks/                # Hooks React personnalisés
├── store/                # Gestion d'état avec Zustand
├── types/                # Types TypeScript
├── schemas/              # Schémas de validation Zod
├── tests/                # Tests unitaires, d'intégration et E2E
├── scripts/              # Scripts utilitaires
├── public/               # Ressources statiques
└── docs/                 # Documentation
```

## Organisation des Composants

Les composants sont organisés en trois catégories principales :

### 1. Core (`components/core/`)

Composants fondamentaux qui définissent la structure de base de l'application :
- Layouts
- Headers
- Navigation
- Etc.

### 2. Features (`components/features/`)

Composants organisés par fonctionnalité métier :

- **Auth** (`components/features/auth/`) : Authentification et gestion des credentials
- **Endpoints** (`components/features/endpoints/`) : Exploration et interaction avec les endpoints API
- **Results** (`components/features/results/`) : Affichage et manipulation des résultats d'API
- **History** (`components/features/history/`) : Gestion de l'historique des requêtes

### 3. Shared (`components/shared/`)

Composants partagés et réutilisables :

- **UI** (`components/shared/ui/`) : Composants UI de base (boutons, inputs, etc.)
- **Theme** (`components/shared/theme/`) : Composants liés au thème et à l'apparence

## Organisation des Utilitaires (lib/)

Le dossier `lib/` contient toutes les fonctions utilitaires et services :

- **Analytics** (`lib/analytics/`) : Outils d'analyse comme Web Vitals
- **Config** (`lib/config/`) : Configuration de l'application
- **CyberArk** (`lib/cyberark/`) : Utilitaires spécifiques à l'API CyberArk
- **Utils** (`lib/utils/`) : Utilitaires généraux et fonctions d'exportation

## Hooks Personnalisés

Les hooks sont organisés par domaine fonctionnel :

- **API** (`hooks/api/`) : Hooks liés aux appels API

## Stores (État Global)

Les stores Zustand sont organisés par domaine :

- `auth.store.ts` : Gestion de l'authentification
- `endpoint.store.ts` : Gestion des endpoints
- `export.store.ts` : Configuration d'exportation
- `history.store.ts` : Gestion de l'historique
- `preferences.store.ts` : Préférences utilisateur

## Tests

Les tests sont organisés selon leur portée :

- **Unit** (`tests/unit/`) : Tests unitaires pour les fonctions isolées
- **Integration** (`tests/integration/`) : Tests d'intégration entre composants
- **E2E** (`tests/e2e/`) : Tests end-to-end qui simulent l'interaction utilisateur

## Scripts Utilitaires

Le dossier `scripts/` contient des utilitaires de développement :

- `update-imports.js` : Script pour mettre à jour les imports après restructuration

## Conventions de Nommage

- **Fichiers de composants** : `pascal-case.tsx` (exemple : `CredentialForm.tsx`)
- **Fichiers utilitaires** : `kebab-case.ts` (exemple : `web-vitals.ts`)
- **Stores** : `kebab-case.store.ts` (exemple : `auth.store.ts`)
- **Hooks** : `use-kebab-case.ts` (exemple : `use-cyberark-query.ts`)
- **Schémas** : `kebab-case.schema.ts` (exemple : `auth.schema.ts`)

## Bonnes Pratiques

1. **Organisation par fonctionnalité** : Les composants sont regroupés par fonctionnalité plutôt que par type
2. **Réutilisabilité** : Les composants UI génériques sont dans le dossier `shared/ui`
3. **Séparation des préoccupations** : La logique métier est séparée de l'UI
4. **Cohérence** : Les conventions de nommage sont appliquées uniformément

Cette organisation facilite la maintenabilité du code et permet à de nouveaux développeurs de comprendre rapidement la structure du projet. 
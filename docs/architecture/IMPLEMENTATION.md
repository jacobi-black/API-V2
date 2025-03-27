# Implémentation de l'Architecture - CyberArk API Explorer

Ce document décrit l'implémentation actuelle de l'architecture technique de l'application CyberArk API Explorer suite à la Phase 1 du développement.

## Vue d'ensemble

L'application CyberArk API Explorer est construite sur une architecture moderne utilisant Next.js 15 avec App Router, React 19, et TypeScript. L'architecture suit les principes de séparation des préoccupations, de modularité, et exploite les Server Components de React.

## Stack technologique implémentée

### Frontend

- **Framework**: Next.js 15 avec App Router
- **Bibliothèque UI**: React 19
- **Langage**: TypeScript 5.3
- **Styles**: Tailwind CSS 3.3
- **Composants UI**: Shadcn UI (basé sur Radix UI)
- **Validation**: Zod 3.22
- **Gestion d'état**: Zustand 4.4

### Backend (intégré à Next.js)

- **Serveur**: Next.js API Routes (pour le proxy vers CyberArk)
- **Authentication**: Proxy vers l'API d'authentification CyberArk

## Fonctionnalités implémentées

### Module d'authentification

L'authentification est implémentée avec les composants suivants :

1. **Interface utilisateur**:
   - Formulaire d'authentification (`components/credential/credential-form.tsx`)
   - Validation des champs côté client avec Zod

2. **API Proxy**:
   - Endpoint d'authentification (`app/api/cyberark/auth/route.ts`)
   - Endpoint de déconnexion (`app/api/cyberark/auth/logout/route.ts`)

3. **Gestion d'état**:
   - Store Zustand pour la session (`store/auth.store.ts`)
   - Conservation du token en mémoire (jamais en localStorage)

4. **Utilitaires**:
   - Fonctions d'aide pour interagir avec l'API CyberArk (`lib/cyberark/api.ts`)
   - Schémas de validation Zod (`schemas/auth.schema.ts`)

## Architecture des composants

### Server Components vs Client Components

Conformément aux meilleures pratiques, nous avons implémenté:

- **Server Components (async)**: 
  - Layout principal (`app/layout.tsx`)
  - Page d'accueil (`app/page.tsx`)
  - Page dashboard (`app/dashboard/page.tsx`)

- **Client Components ('use client')**: 
  - Formulaire d'authentification (`components/credential/credential-form.tsx`)
  - Composant de gestion d'erreur (`app/error.tsx`)

### Gestion des états

1. **État local**: Géré par React `useState` pour les états spécifiques aux composants (loading dans formulaire d'authentification)
2. **État global**: Géré par Zustand pour les données partagées (session d'authentification)

## Stratégie de proxy d'API

Un proxy est mis en place pour résoudre les problèmes CORS potentiels avec l'API CyberArk:

```
Client Browser <-> Next.js API Routes <-> CyberArk API
```

Les requêtes d'authentification sont relayées par nos API Routes vers CyberArk:

```typescript
// POST /api/cyberark/auth
export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = CredentialsSchema.safeParse(body);
  // Validation et transmission à CyberArk...
}
```

## Flux d'authentification

Le flux d'authentification implémenté est le suivant:

1. L'utilisateur saisit les informations d'authentification CyberArk dans le formulaire
2. Les données sont validées côté client avec Zod
3. Si valides, elles sont envoyées à notre API proxy (`/api/cyberark/auth`)
4. L'API proxy transmet la demande à l'API CyberArk
5. CyberArk retourne un token d'authentification
6. Le token est stocké dans le store Zustand (uniquement en mémoire)
7. L'application peut utiliser ce token pour les requêtes ultérieures

## Structure des dossiers

La structure de dossiers actuelle est la suivante:

```
API_V2/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   ├── dashboard/            # Pages Dashboard
│   └── ...                   # Autres fichiers de page
├── components/               # Composants React
│   ├── credential/           # Composants d'authentification
│   └── ui/                   # Composants UI réutilisables
├── lib/                      # Bibliothèques et utilitaires
│   ├── cyberark/             # Utilitaires CyberArk
│   └── utils.ts              # Utilitaires génériques
├── hooks/                    # Hooks React (à implémenter)
├── types/                    # Définitions de types TypeScript
├── store/                    # Stores Zustand
├── schemas/                  # Schémas Zod
├── actions/                  # Actions serveur (à implémenter)
├── tests/                    # Tests (à implémenter)
└── public/                   # Ressources statiques
```

## Sécurité

Les mesures de sécurité suivantes ont été implémentées:

1. **Gestion des jetons**: 
   - Stockage uniquement en mémoire (pas de localStorage)
   - Non accessible depuis JavaScript client

2. **Validation des entrées**:
   - Toutes les entrées utilisateur sont validées via Zod
   - Validation à la fois côté client et côté serveur

3. **Protection des données sensibles**:
   - Le mot de passe n'est jamais stocké après l'authentification
   - Les erreurs d'authentification ne révèlent pas d'informations sensibles

## Étapes futures

Dans les prochaines phases, nous allons:

1. **Implémenter les endpoints API supplémentaires**:
   - Routes proxy pour tous les endpoints CyberArk
   - Hooks personnalisés pour les requêtes API

2. **Développer l'explorateur d'endpoints**:
   - Interface pour parcourir les endpoints disponibles
   - Formulaires dynamiques pour les paramètres

3. **Ajouter l'affichage des résultats**:
   - Visualisation des réponses JSON
   - Exportation CSV et JSON

4. **Améliorer la gestion d'état**:
   - Historique des requêtes
   - Mémorisation des paramètres fréquents

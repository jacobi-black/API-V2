# Architecture Technique - CyberArk API Explorer

Ce document décrit l'architecture technique de l'application CyberArk API Explorer conformément aux exigences spécifiées.

## Vue d'ensemble

CyberArk API Explorer est une application web qui permet d'explorer et d'interagir avec toutes les API GET de CyberArk, avec la possibilité d'exporter les résultats en formats CSV ou JSON. L'application est conçue pour être évolutive, maintenable et sécurisée.

## Principes architecturaux

1. **Séparation des préoccupations** - Modèle client-serveur avec une séparation claire entre l'interface utilisateur, la logique métier et la couche de données.
2. **Modularité** - Composants indépendants et réutilisables.
3. **Performance** - Utilisation de React Server Components et optimisations pour des temps de chargement rapides.
4. **Sécurité** - Gestion sécurisée des jetons d'authentification et des données sensibles.
5. **Extensibilité** - Architecture conçue pour faciliter l'ajout de fonctionnalités futures.

## Stack technologique

### Frontend

- **Framework**: Next.js 15
- **Bibliothèque UI**: React 19
- **Langage**: TypeScript
- **Styles**: Tailwind CSS
- **Composants UI**: Shadcn UI
- **Validation de formulaires**: Zod
- **Gestion d'état**: Zustand
- **Requêtes API**: React Query / TanStack Query
- **Streaming des données**: React Suspense
- **Exportation de données**: Bibliothèques CSV et JSON personnalisées

### Backend (intégré à Next.js)

- **Serveur**: Next.js API Routes (pour proxy)
- **Server Components**: Pour les opérations côté serveur
- **Authentification**: Gestion des jetons CyberArk
- **Logging**: Winston ou similaire

### Futures versions (V3/V4)

- **Base de données**: PostgreSQL
- **ORM**: Prisma
- **Migration**: Utilitaires de migration Prisma

## Architecture de l'application

### Structure des dossiers

```
API_V2/
├── app/                             # Next.js App Router
│   ├── page.tsx                     # Page d'accueil (Server Component)
│   ├── layout.tsx                   # Layout racine
│   ├── error.tsx                    # Gestion d'erreur globale
│   ├── loading.tsx                  # Composant de chargement global
│   ├── api/                         # API Routes pour proxy
│   │   └── cyberark/                
│   │       ├── auth/                # Routes d'authentification
│   │       ├── accounts/            # Routes des comptes
│   │       ├── safes/               # Routes des coffres
│   │       └── [...]               
│   ├── dashboard/                   # Dashboard principal
│   └── settings/                    # Page des paramètres
├── components/                      # Composants React
│   ├── ui/                          # Composants UI réutilisables (Shadcn)
│   ├── credential/                  # Composants liés aux identifiants
│   ├── endpoint/                    # Composants pour les endpoints API
│   ├── results/                     # Composants d'affichage des résultats
│   └── layout/                      # Composants de mise en page
├── lib/                             # Bibliothèques et utilitaires
│   ├── cyberark/                    # Utilitaires d'API CyberArk
│   ├── export/                      # Utilitaires d'exportation
│   └── utils/                       # Fonctions utilitaires génériques
├── hooks/                           # Hooks React personnalisés
├── types/                           # Définitions de types TypeScript
├── store/                           # Stores Zustand
├── schemas/                         # Schémas Zod
├── actions/                         # Actions serveur
├── tests/                           # Tests
│   ├── unit/                        # Tests unitaires
│   ├── integration/                 # Tests d'intégration
│   └── e2e/                         # Tests end-to-end
└── public/                          # Ressources statiques
```

## Principes de conception des composants

### Server Components vs Client Components

- **Server Components (async)**: Utilisés pour la récupération de données et le rendu initial
  - Endpoints API
  - Récupération des données
  - Rendu initial
  
- **Client Components ('use client')**: Utilisés pour l'interactivité
  - Formulaires de saisie
  - Gestion des états locaux
  - Interactions utilisateur
  - Exportation de données

### Stratégie de gestion des états

1. **État serveur**: Géré par les Server Components
2. **État global**: Géré par Zustand pour les états partagés entre composants
3. **État local**: Géré par useState pour les états spécifiques aux composants

## Architecture du proxy d'API

Pour résoudre les problèmes CORS potentiels avec l'API CyberArk, nous utilisons une architecture de proxy:

```
Client Browser <-> Next.js API Routes <-> CyberArk API
```

Chaque endpoint API CyberArk est mappé à un endpoint correspondant dans nos API Routes Next.js:

```typescript
// app/api/cyberark/accounts/route.ts
export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization');
  // Forward request to CyberArk API
  const response = await fetch(`${CYBERARK_API_URL}/Accounts`, {
    headers: {
      'Authorization': token
    }
  });
  
  return NextResponse.json(await response.json());
}
```

## Flux d'authentification

1. L'utilisateur saisit les informations d'identification CyberArk (URL, nom d'utilisateur, mot de passe)
2. Les informations sont envoyées à notre API proxy
3. L'API proxy fait une demande d'authentification à l'API CyberArk
4. Un jeton d'authentification est retourné et stocké en mémoire (jamais en localStorage)
5. Le jeton est utilisé pour toutes les requêtes suivantes

## Sécurité

1. **Gestion des jetons**:
   - Stockage en mémoire uniquement
   - Pas de persistance dans localStorage ou cookies
   - Transmission sécurisée via HTTPS

2. **Validation des entrées**:
   - Toutes les entrées utilisateur sont validées via Zod

3. **Bonnes pratiques**:
   - Headers de sécurité appropriés
   - Pas d'exposition des détails d'erreur sensibles
   - Validation des paramètres de requête

## Stratégie de cache et de performance

1. **Cache côté client**:
   - Mise en cache des résultats d'API avec React Query
   - TTL (Time To Live) approprié pour chaque type de données

2. **Optimisations de rendu**:
   - Utilisation de React.memo pour les composants coûteux
   - Suspense pour le chargement progressif
   - Streaming pour les grands ensembles de données

3. **Optimisations de bundle**:
   - Chargement dynamique des composants non critiques
   - Code splitting basé sur les routes

## Exportation de données

1. **Exportation CSV**:
   - Conversion du JSON en format CSV
   - Gestion correcte des headers CSV
   - Support de l'encodage UTF-8

2. **Exportation JSON**:
   - Formatage propre du JSON
   - Options d'indentation
   - Support de l'encodage UTF-8

## Architecture pour les futures versions (V3/V4)

Dans les futures versions, nous intégrerons une base de données PostgreSQL pour:

1. **Historique des requêtes**:
   - Sauvegarde des requêtes effectuées
   - Paramètres utilisés
   - Résultats obtenus

2. **Analyses et tableaux de bord**:
   - Métriques d'utilisation
   - Statistiques des endpoints les plus utilisés
   - Temps de réponse des API

3. **Préférences utilisateur**:
   - Configuration personnalisée
   - Requêtes favorites
   - Historique personnel

## Stratégie de tests

1. **Tests unitaires**:
   - Tests des hooks et utilitaires
   - Tests des composants isolés
   - Tests des validateurs

2. **Tests d'intégration**:
   - Tests des flux complets
   - Tests d'interaction entre composants
   - Tests des API Routes

3. **Tests end-to-end**:
   - Tests des parcours utilisateur complets
   - Tests de l'interface utilisateur
   - Tests de performance

## Mesures de qualité

1. **Couverture de code**:
   - Objectif de 80% de couverture
   - Rapports de couverture automatisés

2. **Linting et formatage**:
   - ESLint pour les règles de code
   - Prettier pour le formatage
   - Husky pour les hooks git pre-commit

3. **Documentation**:
   - Documentation du code
   - Documentation de l'API
   - Documentation utilisateur

## Conclusion

Cette architecture est conçue pour être robuste, évolutive et maintenable. Elle suit les meilleures pratiques de développement moderne tout en respectant les contraintes techniques spécifiées dans les règles du projet. L'utilisation de Next.js avec React 19 nous permet de bénéficier des dernières avancées en termes de performance et d'expérience développeur.

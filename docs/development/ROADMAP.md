# ROADMAP - CyberArk API Explorer

## Introduction pour l'Agent IA

Bonjour Agent,

En tant que manager de ce projet, je te confie le développement de notre application "CyberArk API Explorer". Cette application permettra d'explorer les API CyberArk, d'exécuter des requêtes et d'exporter les résultats en formats CSV et JSON.

Ce document détaille précisément les étapes de développement, les conventions à suivre et les résultats attendus. Chaque point est critique et doit être implémenté conformément aux directives fournies.

**Objectif principal** : Créer une interface web moderne permettant d'interagir avec toutes les endpoints GET de l'API CyberArk sans authentification préalable, en proposant un formulaire pour saisir les credentials à la volée.

---

## Conventions Techniques Obligatoires

Avant de commencer le développement, assure-toi de respecter scrupuleusement ces conventions:

### Conventions de Nommage
- Fichiers source: `kebab-case.ts`
- Composants React: `PascalCase.tsx`
- Tests: `[filename].spec.ts`
- Stores Zustand: `kebab-case.store.ts`
- Schémas Zod: `kebab-case.schema.ts`
- Actions serveur: `kebab-case.action.ts`

### Structure des Composants React
- TOUJOURS utiliser `export function` sans "default"
- Props comme premier argument avec type inline pour 1-2 props
- Pour 3+ props, créer type nommé `PascalCaseProps`

### Distinctions Server/Client
- Server Components TOUJOURS `async`
- Client Components TOUJOURS avec `'use client'` en haut
- Jamais de hooks dans Server Components

### Performance
- Minimiser `use client`, `useEffect` et `setState`
- Privilégier React Server Components
- Utiliser `<Suspense>` pour streaming avec skeletons

### Technologies
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- Zod pour validation
- Zustand pour state management

---

## Plan de Développement Détaillé

### Phase 1: Mise en place de l'infrastructure (Semaines 1-2) ✅

#### 1.1 Configuration du projet ✅
**Actions:**
- ✅ Initialiser Next.js avec TypeScript
- ✅ Configurer Tailwind CSS et installer composants Shadcn UI
- ✅ Mettre en place ESLint et Prettier selon nos conventions
- ✅ Configurer Jest et React Testing Library

**Résultats:**
- ✅ Projet qui compile sans erreur
- ✅ Tous les outils configurés et fonctionnels
- ✅ Structure initiale en place

#### 1.2 Architecture de base ✅
**Actions:**
- ✅ Créer structure de dossiers exactement comme définie
- ✅ Implémenter types et interfaces de base
- ✅ Configurer la structure initiale avec app router
- ✅ Créer les types et schémas pour l'API CyberArk

**Résultats:**
- ✅ Structure claire et organisée
- ✅ Types bien définis et réutilisables
- ✅ Architecture conforme aux spécifications

#### 1.3 Authentification CyberArk ✅
**Actions:**
- ✅ Implémenter `credential-form.tsx` en tant que Client Component
- ✅ Créer route API proxy pour l'authentification à `/api/cyberark/auth`
- ✅ Implémenter le store Zustand pour stocker credentials et token

**Résultats:**
- ✅ Formulaire d'authentification fonctionnel
- ✅ Conservation du token en mémoire (jamais en localStorage)
- ✅ Gestion appropriée des erreurs d'authentification

### Phase 2: Fonctionnalités de base (Semaines 3-4) ✅

#### 2.1 Explorateur d'endpoints ✅
**Actions:**
- ✅ Créer `endpoint-explorer.tsx` pour afficher tous les endpoints disponibles
- ✅ Implémenter composant de détail endpoint `endpoint-detail.tsx`
- ✅ Créer formulaire dynamique pour paramètres `endpoint-params.tsx`

**Résultats:**
- ✅ Interface intuitive pour parcourir et sélectionner les endpoints
- ✅ Affichage clair de la documentation pour chaque endpoint
- ✅ Formulaire adapté aux paramètres spécifiques de chaque endpoint

**Conventions spécifiques:**
- ✅ Utiliser Suspense pour les chargements
- ✅ GridLayout responsive avec Tailwind
- ✅ Préférer `flex gap-n` avec `flex-col` à `space-y-n`

#### 2.2 Requêtes API ✅
**Actions:**
- ✅ Développer routes proxy `/api/cyberark/[service]/route.ts` pour chaque endpoint CyberArk
- ✅ Implémenter hook personnalisé `use-cyberark-query.ts`
- ✅ Créer mécanisme de gestion des erreurs API

**Résultats:**
- ✅ Proxy fonctionnel qui contourne les problèmes CORS
- ✅ Transmission correcte du token d'authentification
- ✅ Gestion appropriée des timeouts et erreurs réseau

**Conventions spécifiques:**
- ✅ Traitement des erreurs avec statut HTTP approprié
- ✅ Logs clairs mais sans exposer d'informations sensibles

#### 2.3 Affichage des résultats ✅
**Actions:**
- ✅ Développer `results-viewer.tsx` pour afficher résultats JSON structurés
- ✅ Implémenter pagination pour grands ensembles de données
- ✅ Créer composant d'affichage d'erreurs `results-error.tsx`

**Résultats:**
- ✅ Affichage clair et formaté des résultats JSON
- ✅ Navigation intuitive dans les grands ensembles de données
- ✅ Messages d'erreur explicites et actions correctives

**Conventions spécifiques:**
- ✅ Utiliser Suspense avec fallback skeleton
- ✅ Design responsive pour tous les écrans

### Phase 3: Exportation et UX (Semaines 5-6)

#### 3.1 Fonctionnalités d'exportation
**Actions:**
- Implémenter `csv-export.ts` pour conversion JSON vers CSV
- Créer `json-export.ts` pour export JSON formaté
- Développer `results-export.tsx` avec options d'exportation

**Résultats attendus:**
- Export CSV propre avec en-têtes appropriés
- Export JSON formaté et téléchargeable
- Interface intuitive pour choisir options d'exportation

**Conventions spécifiques:**
- Utiliser streams quand possible pour grands ensembles de données
- Noms de fichiers dynamiques basés sur endpoint et date

#### 3.2 Améliorations UX/UI
**Actions:**
- Implémenter design responsive complet
- Créer skeletons et animations de chargement
- Ajouter transitions et feedback visuel

**Résultats attendus:**
- Design coloré, moderne et minimaliste comme demandé
- Expérience fluide sur tous appareils
- Temps de chargement perçu réduit grâce aux skeletons

**Conventions spécifiques:**
- Utiliser les couleurs primaires définies dans Tailwind
- Respecter les best practices d'accessibilité
- Design mobile-first systématique

#### 3.3 Gestion d'état globale
**Actions:**
- Finaliser stores Zustand pour l'application
- Implémenter mémorisation des derniers paramètres utilisés
- Créer historique de requêtes en mémoire

**Résultats attendus:**
- État cohérent à travers l'application
- Persistence des préférences utilisateur pendant la session
- Navigation fluide dans l'historique des requêtes

**Conventions spécifiques:**
- Séparation claire des stores par domaine
- Pas de logique métier dans les stores

### Phase 4: Tests et documentation (Semaines 7-8)

#### 4.1 Tests complets
**Actions:**
- Écrire tests unitaires pour fonctions utilitaires
- Créer tests d'intégration pour flux d'authentification et requêtes
- Implémenter tests end-to-end pour parcours utilisateur

**Résultats attendus:**
- Couverture de tests > 80%
- Tests automatisés pour tous endpoints
- Documentation des tests claire

**Conventions spécifiques:**
- Tests unitaires pour chaque fonction utilitaire
- Tests d'intégration pour chaque flow d'API
- Mocks appropriés pour éviter appels API réels

#### 4.2 Documentation
**Actions:**
- Rédiger README.md complet selon nos standards
- Créer ARCHITECTURE.md détaillant la structure
- Documenter tous les endpoints disponibles dans API.md
- Développer documentation utilisateur

**Résultats attendus:**
- Documentation complète pour développeurs et utilisateurs
- Clarté sur l'utilisation de chaque endpoint
- Explication des choix d'architecture

**Conventions spécifiques:**
- Format markdown strict pour tous documents
- Structure précise comme définie dans 103-readme.mdc

#### 4.3 Préparation au déploiement
**Actions:**
- Configurer Docker
- Optimiser les performances (bundle size, LCP, CLS)
- Mettre en place pipeline CI/CD

**Résultats attendus:**
- Application conteneurisée prête pour déploiement
- Métriques Web Vitals optimisées
- Intégration/déploiement continu fonctionnel

**Conventions spécifiques:**
- Docker multi-stage pour optimisation
- Tests automatisés dans la CI

### Phase 5: Finalisation (Semaine 9)

#### 5.1 Revue de code et refactoring
**Actions:**
- Vérifier couverture de tests 80%
- Valider conventions de nommage
- Optimiser taille des bundles

**Résultats attendus:**
- Code propre et respectant toutes conventions
- Performance optimale
- Dette technique minimale

**Conventions spécifiques:**
- Pas de TODO dans le code final
- Documentation pour toutes fonctions complexes

#### 5.2 Tests de sécurité
**Actions:**
- Réaliser audit de sécurité
- Vérifier gestion des tokens
- Valider bonnes pratiques OWASP

**Résultats attendus:**
- Rapport de sécurité
- Aucune vulnérabilité critique
- Gestion sécurisée des credentials

**Conventions spécifiques:**
- Jamais de credentials en clair dans les logs
- Validation stricte de toutes entrées utilisateur

#### 5.3 Livraison V1
**Actions:**
- Déployer version de production
- Préparer documentation finale
- Documenter problèmes connus

**Résultats attendus:**
- Application fonctionnelle et déployée
- Documentation complète
- Plan pour V2

---

## Endpoints CyberArk à implémenter (V1)

Voici la liste exhaustive des endpoints GET à implémenter dans la V1:

### 1. Authentification
- **Logon** (POST mais nécessaire): `/API/auth/Logon` ✅
- **Logoff**: `/API/auth/Logoff` ✅

### 2. Comptes
- **GetAccounts**: `/API/Accounts` ✅
- **GetAccountDetails**: `/API/Accounts/{id}` ✅
- **GetAccountActivity**: `/API/Accounts/{id}/Activities` ✅

### 3. Coffres
- **GetSafes**: `/API/Safes` ✅
- **GetSafeDetails**: `/API/Safes/{safeName}`
- **GetSafeMembers**: `/API/Safes/{safeName}/Members`

### 4. Utilisateurs
- **GetUsers**: `/API/Users`
- **GetUserDetails**: `/API/Users/{id}`

### 5. Plateformes
- **GetPlatforms**: `/API/Platforms`
- **GetPlatformDetails**: `/API/Platforms/{id}`

### 6. Groupes
- **GetGroups**: `/API/UserGroups`
- **GetGroupMembers**: `/API/UserGroups/{id}/Members`

### 7. Rapports
- **GetReports**: `/API/Reports`
- **RunReport**: `/API/Reports/{id}/RunReport`

---

## Critères de validation finale

- Application fonctionnelle pour tous les endpoints listés
- Couverture de tests ≥ 80%
- Documentation complète et précise
- Interface responsive, moderne et minimaliste
- Performance optimisée (Web Vitals)
- Sécurité validée
- Conformité totale aux conventions techniques spécifiées

J'attends des mises à jour hebdomadaires sur l'avancement et les défis rencontrés. Nous planifierons des revues de code à la fin de chaque phase.

Bon développement!
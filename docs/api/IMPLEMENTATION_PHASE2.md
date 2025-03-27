# Implémentation des APIs - Phase 2

Ce document décrit les APIs implémentées dans la Phase 2 du développement de CyberArk API Explorer, détaillant les routes proxy pour les endpoints CyberArk et leur fonctionnement.

## Structure des routes API

Toutes les routes API suivent une structure cohérente :

1. **Prefix de base** : `/api/cyberark/`
2. **Catégorie** : `accounts`, `safes`, etc.
3. **Identifiant** (si applicable) : `[id]`, `[safeName]`, etc.
4. **Action** (si applicable) : `activities`, `members`, etc.

## Routes proxy implémentées

### Comptes (Accounts)

#### Liste des comptes

```
GET /api/cyberark/accounts
```

Récupère la liste des comptes CyberArk.

**Paramètres de requête** :
- `baseUrl` : URL de l'instance CyberArk **(Requis)**
- `search` : Termes de recherche
- `limit` : Nombre maximum de résultats
- `offset` : Décalage pour la pagination
- `sort` : Champ de tri suivi de `:asc` ou `:desc`
- `filter` : Filtre sur les propriétés

**Exemple de réponse** :
```json
{
  "success": true,
  "data": [
    {
      "id": "12_3",
      "name": "AdminAccount",
      "address": "server.example.com",
      "username": "admin",
      "safeName": "AdminSafe",
      "platformId": "WinServer",
      "secretType": "password",
      "createdAt": "2023-01-01T12:00:00Z"
    },
    ...
  ]
}
```

#### Détails d'un compte

```
GET /api/cyberark/accounts/[id]
```

Récupère les détails d'un compte spécifique.

**Paramètres de chemin** :
- `id` : Identifiant du compte **(Requis)**

**Paramètres de requête** :
- `baseUrl` : URL de l'instance CyberArk **(Requis)**

**Exemple de réponse** :
```json
{
  "success": true,
  "data": {
    "id": "12_3",
    "name": "AdminAccount",
    "address": "server.example.com",
    "username": "admin",
    "safeName": "AdminSafe",
    "platformId": "WinServer",
    "secretType": "password",
    "createdAt": "2023-01-01T12:00:00Z",
    "status": "active",
    "lastModifiedAt": "2023-05-15T09:30:00Z",
    "lastSuccessVerification": "2023-05-15T09:30:00Z",
    "properties": [
      { "key": "Description", "value": "Server admin account" },
      { "key": "Department", "value": "IT" }
    ]
  }
}
```

#### Activités d'un compte

```
GET /api/cyberark/accounts/[id]/activities
```

Récupère l'historique des activités pour un compte spécifique.

**Paramètres de chemin** :
- `id` : Identifiant du compte **(Requis)**

**Paramètres de requête** :
- `baseUrl` : URL de l'instance CyberArk **(Requis)**

**Exemple de réponse** :
```json
{
  "success": true,
  "data": [
    {
      "id": "activity_1",
      "timestamp": "2023-05-15T10:30:00Z",
      "action": "Verify",
      "user": "CPM_User",
      "status": "Success"
    },
    {
      "id": "activity_2",
      "timestamp": "2023-05-14T15:20:00Z",
      "action": "Retrieve",
      "user": "John.Doe",
      "status": "Success"
    },
    ...
  ]
}
```

### Coffres (Safes)

#### Liste des coffres

```
GET /api/cyberark/safes
```

Récupère la liste des coffres CyberArk.

**Paramètres de requête** :
- `baseUrl` : URL de l'instance CyberArk **(Requis)**
- `search` : Recherche par nom de coffre
- `limit` : Nombre maximum de résultats
- `offset` : Décalage pour la pagination
- `includeAccounts` : Inclure les comptes dans chaque coffre (true/false)

**Exemple de réponse** :
```json
{
  "success": true,
  "data": [
    {
      "safeId": "1",
      "safeName": "AdminSafe",
      "description": "Administrative accounts",
      "location": "/",
      "creator": "Admin",
      "olacEnabled": true,
      "managingCPM": "PasswordManager"
    },
    ...
  ]
}
```

## Hook React pour les requêtes API

Un hook personnalisé `useCyberArkQuery` a été implémenté pour faciliter l'utilisation des APIs :

```typescript
const {
  execute,         // Fonction pour exécuter la requête
  data,            // Données de la réponse
  error,           // Message d'erreur (le cas échéant)
  isLoading,       // État de chargement
  isSuccess,       // État de succès
  isError,         // État d'erreur
  isIdle,          // État initial
  state            // État complet (idle, loading, success, error)
} = useCyberArkQuery<ResultType>(endpoint, options);
```

### Paramètres

- `endpoint` : Chemin de l'API (sans le préfixe `/api/cyberark/`)
- `options` : Options de requête
  - `params` : Paramètres d'URL
  - `headers` : En-têtes HTTP supplémentaires
  - `cache` : Stratégie de cache

### Exemple d'utilisation

```typescript
const { execute, data, error, isLoading } = useCyberArkQuery<Account[]>(null);

// Exécuter la requête avec des paramètres personnalisés
const handleFetchAccounts = async () => {
  await execute('accounts', {
    params: {
      baseUrl: session.baseUrl,
      limit: 20,
      offset: 0
    }
  });
};
```

## Gestion des erreurs

### Structure des erreurs

Toutes les réponses d'erreur suivent le format suivant :

```json
{
  "success": false,
  "error": "Message d'erreur explicite"
}
```

### Codes HTTP

Les codes d'erreur HTTP suivants sont utilisés de manière cohérente :

| Code | Description | Exemple |
|------|-------------|---------|
| 400 | Requête invalide | Paramètres manquants ou invalides |
| 401 | Non authentifié | Token manquant ou expiré |
| 403 | Accès refusé | Permissions insuffisantes |
| 404 | Ressource introuvable | Compte ou coffre inexistant |
| 500 | Erreur serveur | Erreur interne du serveur |
| 502 | Erreur de passerelle | Erreur de communication avec CyberArk |
| 504 | Timeout | Requête trop longue |

### Composant d'affichage des erreurs

Un composant `ResultsError` a été créé pour afficher les erreurs de manière conviviale, avec :
- Titre explicite basé sur le type d'erreur
- Message d'erreur détaillé
- Suggestions de résolution
- Possibilité de réessayer la requête

## Prochaines étapes d'implémentation

### Endpoints restants à implémenter

1. **Détails et membres d'un coffre**
   - `GET /api/cyberark/safes/[safeName]`
   - `GET /api/cyberark/safes/[safeName]/members`

2. **Endpoints utilisateurs**
   - `GET /api/cyberark/users`
   - `GET /api/cyberark/users/[id]`

3. **Endpoints plateformes**
   - `GET /api/cyberark/platforms`
   - `GET /api/cyberark/platforms/[id]`

4. **Endpoints groupes**
   - `GET /api/cyberark/groups`
   - `GET /api/cyberark/groups/[id]/members`

5. **Endpoints rapports**
   - `GET /api/cyberark/reports`
   - `GET /api/cyberark/reports/[id]/run`

### Fonctionnalités d'API prévues

1. **Endpoints d'exportation**
   - `GET /api/cyberark/export/json`
   - `GET /api/cyberark/export/csv`

2. **Métadonnées d'API**
   - `GET /api/cyberark/meta/endpoints`
   - `GET /api/cyberark/status`

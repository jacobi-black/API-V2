# CyberArk API Explorer - Catalogue des Endpoints

Ce document détaille tous les endpoints API CyberArk disponibles pour l'implémentation dans l'application CyberArk API Explorer.

## Authentification

L'authentification est requise pour accéder à toutes les API CyberArk. Un jeton de session est retourné après l'authentification et doit être inclus dans toutes les requêtes d'API subséquentes.

### Logon

| Méthode | URL | Description |
|---------|-----|-------------|
| **POST** | `/PasswordVault/API/auth/Cyberark/Logon` | Authentification par CyberArk |
| **POST** | `/PasswordVault/API/auth/LDAP/Logon` | Authentification par LDAP |
| **POST** | `/PasswordVault/API/auth/Windows/Logon` | Authentification par Windows |
| **POST** | `/PasswordVault/API/auth/RADIUS/Logon` | Authentification par RADIUS |

#### Paramètres du corps de la requête

```json
{
  "username": "<username>",
  "password": "<password>",
  "concurrentSession": true
}
```

#### Réponse

```json
{
  "<session_token>"
}
```

### Logoff

| Méthode | URL | Description |
|---------|-----|-------------|
| **POST** | `/PasswordVault/API/auth/Logoff` | Déconnexion et invalidation du jeton |

## Comptes

### Obtenir les comptes

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Accounts` | Liste tous les comptes dans le coffre |

#### Paramètres d'URL optionnels

| Paramètre | Description |
|-----------|-------------|
| `search` | Mots-clés à rechercher dans les comptes, séparés par un espace |
| `searchType` | Type de recherche: `contains` (défaut) ou `startswith` |
| `sort` | Propriété de tri, suivie de `asc` (défaut) ou `desc` |
| `offset` | Décalage du premier compte retourné |
| `limit` | Nombre maximum de comptes retournés (max: 1000) |
| `filter` | Filtre selon les propriétés des comptes |
| `safefilter` | Recherche de comptes en utilisant un filtre enregistré |

#### Paramètres de filtre

| Paramètre | Description |
|-----------|-------------|
| `safeName` | Filtrer par nom de coffre |
| `modificationTime` | Filtrer par date de modification |

### Obtenir les détails d'un compte

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Accounts/{id}` | Obtient les détails d'un compte spécifique |

### Obtenir l'activité d'un compte

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Accounts/{id}/Activities` | Obtient l'historique d'activité pour un compte spécifique |

## Coffres (Safes)

### Obtenir tous les coffres

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Safes` | Liste tous les coffres dans le Vault |

#### Paramètres d'URL optionnels

| Paramètre | Description |
|-----------|-------------|
| `search` | Recherche selon le nom du coffre |
| `offset` | Décalage du premier coffre retourné |
| `limit` | Nombre maximum de coffres retournés |
| `sort` | Trie selon la propriété safeName, suivi de `asc` (par défaut) ou `desc` |
| `includeAccounts` | Inclure les comptes pour chaque coffre (défaut: False) |
| `extendedDetails` | Retourner tous les détails ou seulement le nom du coffre (défaut: True) |

### Obtenir les détails d'un coffre

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Safes/{safeName}` | Obtient les détails d'un coffre spécifique |

### Obtenir les membres d'un coffre

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Safes/{safeName}/Members` | Liste tous les membres d'un coffre spécifique |

## Utilisateurs

### Obtenir les utilisateurs

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Users` | Liste tous les utilisateurs existants dans le Vault |

#### Paramètres d'URL optionnels

| Paramètre | Description |
|-----------|-------------|
| `filter` | Filtrer par type d'utilisateur, utilisateur de composant ou nom d'utilisateur |
| `sort` | Trie par nom d'utilisateur, source, type, etc. |
| `search` | Recherche dans les noms d'utilisateur, prénom, nom |
| `ExtendedDetails` | Retourne des détails supplémentaires comme les groupes d'utilisateurs |
| `pageOffset` | Décalage du premier utilisateur retourné |
| `pageSize` | Nombre maximum d'utilisateurs à retourner |

### Obtenir les détails d'un utilisateur

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Users/{id}` | Obtient les détails d'un utilisateur spécifique |

## Groupes d'utilisateurs

### Obtenir les groupes

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/UserGroups` | Liste tous les groupes d'utilisateurs existants |

#### Paramètres d'URL optionnels

| Paramètre | Description |
|-----------|-------------|
| `filter` | Filtrer par type de groupe ou nom de groupe |
| `sort` | Trie par nom de groupe, répertoire, emplacement |
| `search` | Recherche dans les noms de groupe |
| `includeMembers` | Inclure les membres pour chaque groupe (défaut: False) |

### Obtenir les détails d'un groupe

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/UserGroups/{id}` | Obtient les détails d'un groupe spécifique |

### Obtenir les membres d'un groupe

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/UserGroups/{id}/Members` | Liste tous les membres d'un groupe spécifique |

## Plateformes

### Obtenir toutes les plateformes

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Platforms` | Liste toutes les plateformes de comptes existantes |

#### Paramètres d'URL optionnels

| Paramètre | Description |
|-----------|-------------|
| `Active` | Filtrer selon que la plateforme est active ou non |
| `PlatformType` | Filtrer par type de plateforme (Group ou Regular) |
| `PlatformName` | Rechercher par nom de plateforme |

### Obtenir les détails d'une plateforme

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Platforms/{id}` | Obtient les détails d'une plateforme spécifique |

## Rapports

### Obtenir les rapports disponibles

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Reports` | Liste tous les rapports disponibles |

### Exécuter un rapport

| Méthode | URL | Description |
|---------|-----|-------------|
| **GET** | `/PasswordVault/API/Reports/{id}/RunReport` | Exécute un rapport spécifique |

## Notes importantes sur l'API

1. **Authentification** - Pour toute requête d'API (sauf Logon), l'entête de requête HTTPS doit inclure un champ Authorization contenant la valeur du jeton de session reçu de l'activité Logon.

2. **Jeton de session** - La durée par défaut d'un jeton de session est de 20 minutes.

3. **Format des URLs** - Assurez-vous qu'il n'y a pas d'espaces dans l'URL. Les caractères +, & et % ne sont pas supportés dans les valeurs d'URL. Si l'URL inclut un point (.), ajoutez une barre oblique (/) à la fin de l'URL (ex: api/Safes/MySafe/Members/user@cyber.com/)

4. **Codes de retour** - Les API REST CyberArk retournent des codes d'état HTTP standard (200 pour succès, 401 pour non autorisé, etc.)

5. **CORS** - Les API CyberArk peuvent avoir des restrictions CORS. L'utilisation d'un proxy est recommandée pour contourner ces problèmes dans une application web.

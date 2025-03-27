# Endpoints API V2

Ce document décrit les endpoints disponibles dans l'API V2 de CyberArk API Explorer.

## Structure des URLs

Tous les endpoints de l'API sont préfixés par `/api/v2`.

## Endpoints d'authentification

### Authentification CyberArk

```
POST /api/v2/auth/cyberark
```

Permet de s'authentifier auprès de l'API CyberArk selon la méthode documentée dans [Cyberark Authentication](https://docs.cyberark.com/pam-self-hosted/14.2/en/content/sdk/cyberark%20authentication%20-%20logon_v10.htm).

**Corps de la requête**:
```json
{
  "baseUrl": "https://cyberark-instance.example.com",
  "username": "api_user",
  "password": "password",
  "concurrentSession": true
}
```

**Réponse**:
```json
{
  "success": true,
  "expiresAt": "2023-05-30T15:00:00Z"
}
```

### Vérification de session

```
GET /api/v2/auth/status
```

Vérifie si la session CyberArk est active.

**Réponse**:
```json
{
  "authenticated": true,
  "expiresAt": "2023-05-30T15:00:00Z"
}
```

### Déconnexion

```
POST /api/v2/auth/logout
```

Termine la session CyberArk active.

## Endpoints CyberArk (Proxy)

Les endpoints suivants agissent comme un proxy vers l'API CyberArk, en transformant les requêtes et les réponses selon les besoins.

### Safes

```
GET /api/v2/safes
GET /api/v2/safes/{safeId}
```

Récupère la liste des coffres-forts ou un coffre-fort spécifique.

### Comptes

```
GET /api/v2/accounts
GET /api/v2/accounts/{accountId}
```

Récupère la liste des comptes ou un compte spécifique.

### Utilisateurs

```
GET /api/v2/users
GET /api/v2/users/{userId}
```

Récupère la liste des utilisateurs ou un utilisateur spécifique.

### Applications

```
GET /api/v2/applications
GET /api/v2/applications/{appId}
```

Récupère la liste des applications ou une application spécifique.

### Politiques de plateforme

```
GET /api/v2/platforms
GET /api/v2/platforms/{platformId}
```

Récupère la liste des plateformes ou une plateforme spécifique.

## Endpoints d'export

### Export JSON

```
GET /api/v2/export/json
```

Exporte les résultats d'une requête au format JSON.

**Paramètres**:
- `endpoint`: Endpoint CyberArk à appeler (obligatoire)
- `params`: Paramètres supplémentaires (optionnel)

### Export CSV

```
GET /api/v2/export/csv
```

Exporte les résultats d'une requête au format CSV.

**Paramètres**:
- `endpoint`: Endpoint CyberArk à appeler (obligatoire)
- `params`: Paramètres supplémentaires (optionnel)
- `fields`: Champs à inclure dans le CSV (optionnel)

## Endpoints de métadonnées

### Liste des endpoints disponibles

```
GET /api/v2/meta/endpoints
```

Renvoie la liste complète des endpoints CyberArk disponibles.

**Réponse**:
```json
{
  "endpoints": [
    {
      "name": "Safes",
      "path": "/safes",
      "methods": ["GET"],
      "description": "Get all safes"
    },
    ...
  ]
}
```

### Documentation OpenAPI

```
GET /api/v2/docs
```

Renvoie la documentation OpenAPI complète de l'API.

## Codes d'erreur communs

| Code | Description |
|------|-------------|
| 400  | Requête invalide |
| 401  | Non authentifié |
| 403  | Non autorisé |
| 404  | Ressource non trouvée |
| 500  | Erreur serveur |
| 502  | Erreur de l'API CyberArk |
| 504  | Timeout de l'API CyberArk |

## Pagination

La plupart des endpoints qui renvoient des listes supportent la pagination via les paramètres suivants:

- `limit`: Nombre d'éléments par page (défaut: 50, max: 1000)
- `offset`: Index de départ (défaut: 0)

**Exemple**:
```
GET /api/v2/accounts?limit=10&offset=20
```

## Filtrage

Les endpoints qui renvoient des listes supportent également le filtrage via le paramètre `filter`:

**Exemple**:
```
GET /api/v2/accounts?filter=username:contains:admin
```

## Tri

Les endpoints qui renvoient des listes supportent le tri via le paramètre `sort`:

**Exemple**:
```
GET /api/v2/accounts?sort=name:asc,createdAt:desc
```
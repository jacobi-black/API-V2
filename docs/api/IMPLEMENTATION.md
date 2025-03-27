# Implémentation des APIs - CyberArk API Explorer

Ce document décrit les APIs implémentées dans la Phase 1 du développement de CyberArk API Explorer, notamment les endpoints d'authentification.

## Structure des URLs

Tous les endpoints de l'API sont préfixés par `/api/cyberark`.

## APIs implémentées

### Authentification

#### Authentifier avec CyberArk

```
POST /api/cyberark/auth
```

Authentifie un utilisateur auprès de l'API CyberArk selon la méthode spécifiée.

**Corps de la requête**:

```json
{
  "baseUrl": "https://cyberark-instance.example.com",
  "username": "api_user",
  "password": "password",
  "authType": "CYBERARK",
  "concurrentSession": true
}
```

Les types d'authentification supportés (`authType`) sont :

- `CYBERARK` (défaut) - Authentification standard CyberArk
- `LDAP` - Authentification via LDAP
- `Windows` - Authentification Windows
- `RADIUS` - Authentification RADIUS

**Réponse en cas de succès**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2023-05-30T15:00:00Z"
}
```

**Réponse en cas d'échec**:

```json
{
  "success": false,
  "error": "Identifiants invalides"
}
```

#### Déconnexion

```
POST /api/cyberark/auth/logout
```

Termine la session CyberArk active.

**Corps de la requête**:

```json
{
  "baseUrl": "https://cyberark-instance.example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse en cas de succès**:

```json
{
  "success": true
}
```

**Réponse en cas d'échec**:

```json
{
  "success": false,
  "error": "Échec de la déconnexion"
}
```

## Validation et Sécurité

### Validation des Entrées

Toutes les entrées API sont validées à l'aide de schémas Zod. Le schéma de validation pour les credentials d'authentification est le suivant :

```typescript
export const CredentialsSchema = z.object({
  baseUrl: z.string().url("L'URL doit être une URL valide").min(1, "L'URL ne peut pas être vide"),
  username: z.string().min(1, "Le nom d'utilisateur ne peut pas être vide"),
  password: z.string().min(1, "Le mot de passe ne peut pas être vide"),
  authType: z
    .nativeEnum(AuthType, {
      errorMap: () => ({ message: "Type d'authentification invalide" }),
    })
    .default(AuthType.CYBERARK),
  concurrentSession: z.boolean().default(false),
  newPassword: z.string().optional(),
});
```

### Gestion des Erreurs

Les erreurs sont gérées de manière cohérente à travers toutes les APIs :

- **400 Bad Request** - Requête invalide, données manquantes ou malformées
- **401 Unauthorized** - Authentification échouée ou token invalide
- **500 Internal Server Error** - Erreur serveur interne

Les réponses d'erreur incluent toujours un champ `success: false` et un champ `error` avec un message explicatif.

## Implémentation Proxy vers CyberArk

Les API Routes Next.js agissent comme un proxy vers l'API CyberArk, permettant de contourner les problèmes CORS que les applications frontend pourraient rencontrer. L'implémentation traduit les requêtes de notre format vers le format attendu par CyberArk :

```typescript
// Exemple d'authentification CyberArk
export async function authenticateCyberArk(credentials: CyberArkCredentials, authType: AuthType) {
  const baseUrl = ensureTrailingSlash(credentials.baseUrl);
  const endpoint = getAuthEndpoint(authType);
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      concurrentSession: credentials.concurrentSession || false,
      newPassword: credentials.newPassword,
    }),
  });

  // Traitement de la réponse...
}
```

## Endpoints CyberArk supportés

Les constantes pour tous les endpoints CyberArk sont définies dans `lib/cyberark/api.ts` :

```typescript
export const CYBERARK_ENDPOINTS = {
  AUTH: {
    CYBERARK: "PasswordVault/API/auth/CYBERARK/Logon",
    LDAP: "PasswordVault/API/auth/LDAP/Logon",
    WINDOWS: "PasswordVault/API/auth/Windows/Logon",
    RADIUS: "PasswordVault/API/auth/RADIUS/Logon",
    LOGOFF: "PasswordVault/API/auth/Logoff",
  },
  ACCOUNTS: {
    LIST: "PasswordVault/API/Accounts",
    GET: "PasswordVault/API/Accounts/{id}",
    ACTIVITIES: "PasswordVault/API/Accounts/{id}/Activities",
  },
  SAFES: {
    LIST: "PasswordVault/API/Safes",
    GET: "PasswordVault/API/Safes/{safeName}",
    MEMBERS: "PasswordVault/API/Safes/{safeName}/Members",
  },
  // ... autres endpoints
};
```

Ces constantes serviront de base pour implémenter les autres endpoints dans les phases suivantes.

## Roadmap des APIs

Pour les prochaines phases, nous prévoyons d'implémenter les APIs suivantes :

### Phase 2

1. **Endpoints Comptes** :

   - `GET /api/cyberark/accounts` - Liste des comptes
   - `GET /api/cyberark/accounts/{id}` - Détails d'un compte
   - `GET /api/cyberark/accounts/{id}/activities` - Activités d'un compte

2. **Endpoints Coffres** :

   - `GET /api/cyberark/safes` - Liste des coffres
   - `GET /api/cyberark/safes/{safeName}` - Détails d'un coffre
   - `GET /api/cyberark/safes/{safeName}/members` - Membres d'un coffre

3. **Endpoints Utilisateurs** :
   - `GET /api/cyberark/users` - Liste des utilisateurs
   - `GET /api/cyberark/users/{id}` - Détails d'un utilisateur

### Phase 3

1. **Endpoints d'Exportation** :

   - `GET /api/cyberark/export/json` - Exporter les résultats en JSON
   - `GET /api/cyberark/export/csv` - Exporter les résultats en CSV

2. **Endpoints Utilitaires** :
   - `GET /api/cyberark/meta/endpoints` - Liste des endpoints disponibles
   - `GET /api/cyberark/status` - État du service et de l'authentification

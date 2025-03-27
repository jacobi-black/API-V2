# Modèles de données - API V2

Ce document décrit les principaux modèles de données utilisés dans l'application CyberArk API Explorer.

## Types communs

### BaseModel

Interface de base pour tous les modèles avec des propriétés communes.

```typescript
interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Modèles d'authentification

### CyberArkCredentials

Modèle pour les informations d'authentification CyberArk.

```typescript
interface CyberArkCredentials {
  baseUrl: string;          // URL de base de l'instance CyberArk
  username: string;         // Nom d'utilisateur API
  password: string;         // Mot de passe
  concurrentSession?: boolean; // Autoriser les sessions concurrentes
  newPassword?: string;     // Nouveau mot de passe (pour la rotation)
}
```

### CyberArkSession

Modèle représentant une session CyberArk authentifiée.

```typescript
interface CyberArkSession {
  token: string;            // Token d'authentification
  createdAt: Date;          // Date de création
  expiresAt: Date;          // Date d'expiration
  baseUrl: string;          // URL de base utilisée
  username: string;         // Utilisateur authentifié
}
```

## Modèles CyberArk (Mappage API)

Ces modèles correspondent aux structures de données renvoyées par l'API CyberArk.

### Safe

Représentation d'un coffre-fort CyberArk.

```typescript
interface Safe {
  safeId: string;           // Identifiant unique
  safeName: string;         // Nom du coffre-fort
  description: string;      // Description
  location: string;         // Emplacement dans la hiérarchie
  creator: string;          // Créateur
  olacEnabled: boolean;     // OLAC activé
  managingCPM: string;      // CPM gérant ce coffre
  numberOfVersionsRetention: number; // Rétention des versions
  numberOfDaysRetention: number;     // Rétention en jours
  automaticPurgeEnabled: boolean;    // Purge automatique
  members: SafeMember[];    // Membres du coffre-fort
}

interface SafeMember {
  memberId: string;         // Identifiant du membre
  memberName: string;       // Nom du membre
  memberType: MemberType;   // Type (utilisateur, groupe, etc.)
  permissions: Permission[]; // Permissions
}

enum MemberType {
  User = 'User',
  Group = 'Group',
  Role = 'Role'
}

interface Permission {
  name: string;             // Nom de la permission
  value: boolean;           // Valeur (activé/désactivé)
}
```

### Account

Représentation d'un compte CyberArk.

```typescript
interface Account {
  id: string;               // Identifiant unique
  name: string;             // Nom du compte
  address: string;          // Adresse du système cible
  username: string;         // Nom d'utilisateur
  platformId: string;       // ID de la plateforme
  safeName: string;         // Nom du coffre-fort
  secretType: SecretType;   // Type de secret
  secretManagement: SecretManagement; // Gestion du secret
  createdAt: Date;          // Date de création
  status: AccountStatus;    // Statut du compte
  lastModifiedAt: Date;     // Dernière modification
  lastSuccessVerification: Date; // Dernière vérification réussie
  lastFailedVerification: Date;  // Dernière vérification échouée
  properties: AccountProperty[]; // Propriétés supplémentaires
}

enum SecretType {
  Password = 'Password',
  Key = 'Key',
  Certificate = 'Certificate',
  File = 'File'
}

enum AccountStatus {
  Active = 'active',
  Disabled = 'disabled',
  PendingReconciliation = 'pendingReconciliation'
}

interface AccountProperty {
  key: string;
  value: string;
}

interface SecretManagement {
  automatic: boolean;       // Gestion automatique
  manualManagementReason: string; // Raison de gestion manuelle
  lastModifiedAt: Date;     // Dernière modification
}
```

### User

Représentation d'un utilisateur CyberArk.

```typescript
interface User {
  id: string;               // Identifiant unique
  username: string;         // Nom d'utilisateur
  firstName: string;        // Prénom
  lastName: string;         // Nom
  email: string;            // Email
  vaultAuthorization: VaultAuthorization[]; // Autorisations dans le coffre
  userType: UserType;       // Type d'utilisateur
  disabled: boolean;        // Utilisateur désactivé
  suspended: boolean;       // Utilisateur suspendu
  lastLogonDate: Date;      // Dernière connexion
  source: UserSource;       // Source de l'utilisateur
}

enum UserType {
  Regular = 'Regular',
  EPV = 'EPV',
  PSMP = 'PSMP',
  CPM = 'CPM'
}

enum UserSource {
  Internal = 'Internal',
  LDAP = 'LDAP',
  Directory = 'Directory'
}

interface VaultAuthorization {
  authorizationId: string;  // Identifiant de l'autorisation
  authorizationName: string;// Nom de l'autorisation
}
```

## Modèles d'extension (Spécifiques à l'application)

Ces modèles sont spécifiques à notre application et étendent les modèles CyberArk.

### ApiRequest

Modèle pour les requêtes API enregistrées.

```typescript
interface ApiRequest extends BaseModel {
  name: string;                 // Nom convivial de la requête
  endpoint: string;             // Endpoint CyberArk
  parameters: Record<string, any>; // Paramètres
  favorite: boolean;            // Requête favorite
  lastExecuted: Date;           // Dernière exécution
  executionCount: number;       // Nombre d'exécutions
  averageResponseTime: number;  // Temps de réponse moyen
}
```

### ExportFormat

Configuration pour l'export de données.

```typescript
interface ExportFormat extends BaseModel {
  name: string;                 // Nom du format
  format: 'CSV' | 'JSON';       // Type de format
  fields: ExportField[];        // Champs à exporter
  includeHeaders: boolean;      // Inclure les en-têtes (CSV)
  delimiter: string;            // Délimiteur (CSV)
  prettyPrint: boolean;         // Formater proprement (JSON)
}

interface ExportField {
  sourceField: string;          // Champ source dans les données
  targetField: string;          // Nom dans l'export
  transformation?: string;      // Transformation à appliquer
}
```

## Modèles futurs (V3/V4)

Ces modèles seront implémentés dans les versions futures avec la base de données.

### User (Application)

```typescript
interface AppUser extends BaseModel {
  username: string;             // Nom d'utilisateur
  passwordHash: string;         // Hachage du mot de passe
  email: string;                // Email
  role: UserRole;               // Rôle
  lastLogin: Date;              // Dernière connexion
  preferences: UserPreferences; // Préférences
  apiRequests: ApiRequest[];    // Requêtes enregistrées
  exportFormats: ExportFormat[]; // Formats d'export
}

enum UserRole {
  Admin = 'admin',
  User = 'user',
  ReadOnly = 'readonly'
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  defaultExportFormat: string;
  pageSize: number;
}
```

### AuditLog

```typescript
interface AuditLog extends BaseModel {
  user: string;                 // Utilisateur
  action: string;               // Action effectuée
  endpoint: string;             // Endpoint concerné
  parameters: Record<string, any>; // Paramètres
  responseStatus: number;       // Code de statut HTTP
  responseTime: number;         // Temps de réponse (ms)
  ipAddress: string;            // Adresse IP
  userAgent: string;            // User-Agent
}
```

## Relations entre les modèles

Dans la version V3/V4 avec base de données, les relations suivantes seront implémentées :

- `AppUser` 1:N `ApiRequest` - Un utilisateur peut avoir plusieurs requêtes enregistrées
- `AppUser` 1:N `ExportFormat` - Un utilisateur peut avoir plusieurs formats d'export
- `AppUser` 1:N `AuditLog` - Les actions d'un utilisateur sont tracées
- `ApiRequest` N:1 `ExportFormat` - Une requête peut être associée à un format d'export par défaut
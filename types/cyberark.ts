/**
 * Types pour les modèles CyberArk (mappage API)
 */

/**
 * Représentation d'un coffre-fort CyberArk
 */
export interface Safe {
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

export interface SafeMember {
  memberId: string;         // Identifiant du membre
  memberName: string;       // Nom du membre
  memberType: MemberType;   // Type (utilisateur, groupe, etc.)
  permissions: Permission[]; // Permissions
}

export enum MemberType {
  User = 'User',
  Group = 'Group',
  Role = 'Role'
}

export interface Permission {
  name: string;             // Nom de la permission
  value: boolean;           // Valeur (activé/désactivé)
}

/**
 * Représentation d'un compte CyberArk
 */
export interface Account {
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
  lastSuccessVerification?: Date; // Dernière vérification réussie
  lastFailedVerification?: Date;  // Dernière vérification échouée
  properties: AccountProperty[]; // Propriétés supplémentaires
}

export enum SecretType {
  Password = 'Password',
  Key = 'Key',
  Certificate = 'Certificate',
  File = 'File'
}

export enum AccountStatus {
  Active = 'active',
  Disabled = 'disabled',
  PendingReconciliation = 'pendingReconciliation'
}

export interface AccountProperty {
  key: string;
  value: string;
}

export interface SecretManagement {
  automatic: boolean;       // Gestion automatique
  manualManagementReason?: string; // Raison de gestion manuelle
  lastModifiedAt: Date;     // Dernière modification
}

/**
 * Représentation d'un utilisateur CyberArk
 */
export interface User {
  id: string;               // Identifiant unique
  username: string;         // Nom d'utilisateur
  firstName: string;        // Prénom
  lastName: string;         // Nom
  email: string;            // Email
  vaultAuthorization: VaultAuthorization[]; // Autorisations dans le coffre
  userType: UserType;       // Type d'utilisateur
  disabled: boolean;        // Utilisateur désactivé
  suspended: boolean;       // Utilisateur suspendu
  lastLogonDate?: Date;      // Dernière connexion
  source: UserSource;       // Source de l'utilisateur
}

export enum UserType {
  Regular = 'Regular',
  EPV = 'EPV',
  PSMP = 'PSMP',
  CPM = 'CPM'
}

export enum UserSource {
  Internal = 'Internal',
  LDAP = 'LDAP',
  Directory = 'Directory'
}

export interface VaultAuthorization {
  authorizationId: string;  // Identifiant de l'autorisation
  authorizationName: string;// Nom de l'autorisation
}

/**
 * Types pour la pagination
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
  filter?: string;
  search?: string;
  sort?: string;
}

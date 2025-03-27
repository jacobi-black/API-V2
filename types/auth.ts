/**
 * Modèle pour les informations d'authentification CyberArk.
 */
export interface CyberArkCredentials {
  baseUrl: string;          // URL de base de l'instance CyberArk
  username: string;         // Nom d'utilisateur API
  password: string;         // Mot de passe
  concurrentSession?: boolean; // Autoriser les sessions concurrentes
  newPassword?: string;     // Nouveau mot de passe (pour la rotation)
}

/**
 * Modèle représentant une session CyberArk authentifiée.
 */
export interface CyberArkSession {
  token: string;            // Token d'authentification
  createdAt: Date;          // Date de création
  expiresAt: Date;          // Date d'expiration
  baseUrl: string;          // URL de base utilisée
  username: string;         // Utilisateur authentifié
}

/**
 * Types d'authentification supportés
 */
export enum AuthType {
  CyberArk = 'Cyberark',
  LDAP = 'LDAP',
  Windows = 'Windows',
  RADIUS = 'RADIUS'
}

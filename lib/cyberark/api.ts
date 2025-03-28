import { CyberArkCredentials, AuthType } from "@/types/auth";
import { ensureTrailingSlash, handleFetchError } from "@/lib/utils/utils";

/**
 * Constantes pour les endpoints CyberArk
 */
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
  USERS: {
    LIST: "PasswordVault/API/Users",
    GET: "PasswordVault/API/Users/{id}",
  },
  PLATFORMS: {
    LIST: "PasswordVault/API/Platforms",
    GET: "PasswordVault/API/Platforms/{id}",
  },
  GROUPS: {
    LIST: "PasswordVault/API/UserGroups",
    MEMBERS: "PasswordVault/API/UserGroups/{id}/Members",
  },
  REPORTS: {
    LIST: "PasswordVault/API/Reports",
    RUN: "PasswordVault/API/Reports/{id}/RunReport",
  },
  SYSTEM: {
    SUMMARY: "PasswordVault/API/SystemHealth/Summary",
    DETAILS: "PasswordVault/API/SystemHealth/Details",
  },
};

/**
 * Obtient l'endpoint d'authentification selon le type
 */
export function getAuthEndpoint(authType: AuthType): string {
  switch (authType) {
    case AuthType.CYBERARK:
      return CYBERARK_ENDPOINTS.AUTH.CYBERARK;
    case AuthType.LDAP:
      return CYBERARK_ENDPOINTS.AUTH.LDAP;
    case AuthType.Windows:
      return CYBERARK_ENDPOINTS.AUTH.WINDOWS;
    case AuthType.RADIUS:
      return CYBERARK_ENDPOINTS.AUTH.RADIUS;
    default:
      return CYBERARK_ENDPOINTS.AUTH.CYBERARK;
  }
}

/**
 * Authentification CyberArk
 */
export async function authenticateCyberArk(credentials: CyberArkCredentials, authType: AuthType) {
  const baseUrl = ensureTrailingSlash(credentials.baseUrl);
  const endpoint = getAuthEndpoint(authType);
  const url = `${baseUrl}${endpoint}`;

  try {
    console.error(`Tentative d'authentification à ${url}`);

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

    if (!response.ok) {
      throw await handleFetchError(response);
    }

    // Le token est retourné directement comme une chaîne texte
    const responseText = await response.text();

    // Vérifier si la réponse ressemble à du HTML
    if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
      console.error("Réponse HTML reçue au lieu du token:", responseText.substring(0, 200));
      throw new Error(
        "Le serveur a répondu avec une page HTML au lieu du token. Vérifiez l'URL et les identifiants."
      );
    }

    // Le token est une simple chaîne de texte - s'assurer qu'il n'y a pas de guillemets
    let token = responseText.trim();

    // Enlever les guillemets si présents
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.substring(1, token.length - 1);
      console.error("Token nettoyé des guillemets dans la fonction d'authentification");
    }

    console.error(`Token récupéré (${token.length} caractères): ${token.substring(0, 15)}...`);

    // Créer une date d'expiration (20 minutes par défaut)
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 20 * 60 * 1000);

    return {
      success: true,
      token,
      createdAt,
      expiresAt,
      baseUrl,
      username: credentials.username,
    };
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Déconnexion CyberArk
 */
export async function logoffCyberArk(baseUrl: string, token: string) {
  const url = `${ensureTrailingSlash(baseUrl)}${CYBERARK_ENDPOINTS.AUTH.LOGOFF}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw await handleFetchError(response);
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

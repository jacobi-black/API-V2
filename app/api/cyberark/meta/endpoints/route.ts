import { NextRequest, NextResponse } from "next/server";
import { CYBERARK_ENDPOINTS } from "@/lib/cyberark/api";

/**
 * Structure d'un endpoint pour l'affichage
 */
type EndpointDisplay = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  requiresAuth: boolean;
  parameters?: {
    query?: { name: string; description: string; required: boolean }[];
    path?: { name: string; description: string }[];
  };
};

/**
 * Gestionnaire pour récupérer la liste des endpoints API disponibles
 * GET /api/cyberark/meta/endpoints
 * Cette route ne nécessite pas d'authentification
 */
export async function GET(_request: NextRequest) {
  try {
    // Formatter les endpoints pour l'affichage
    const endpoints: EndpointDisplay[] = [
      // Auth endpoints
      {
        path: "/api/cyberark/auth/cyberark",
        method: "POST",
        description: "Authentification avec les identifiants CyberArk",
        requiresAuth: false,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },
      {
        path: "/api/cyberark/auth/ldap",
        method: "POST",
        description: "Authentification avec LDAP",
        requiresAuth: false,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },
      {
        path: "/api/cyberark/auth/windows",
        method: "POST",
        description: "Authentification avec Windows",
        requiresAuth: false,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },
      {
        path: "/api/cyberark/auth/radius",
        method: "POST",
        description: "Authentification avec RADIUS",
        requiresAuth: false,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },
      {
        path: "/api/cyberark/auth/logout",
        method: "POST",
        description: "Déconnexion et invalidation du jeton",
        requiresAuth: true,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },

      // Accounts endpoints
      {
        path: "/api/cyberark/accounts",
        method: "GET",
        description: "Récupérer la liste des comptes",
        requiresAuth: true,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
            { name: "search", description: "Termes de recherche", required: false },
            { name: "filter", description: "Filtre sur les propriétés", required: false },
            { name: "limit", description: "Nombre maximum de résultats", required: false },
            { name: "offset", description: "Décalage pour la pagination", required: false },
          ],
        },
      },
      {
        path: "/api/cyberark/accounts/[id]",
        method: "GET",
        description: "Récupérer les détails d'un compte",
        requiresAuth: true,
        parameters: {
          path: [{ name: "id", description: "Identifiant du compte" }],
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },
      {
        path: "/api/cyberark/accounts/[id]/activities",
        method: "GET",
        description: "Récupérer les activités d'un compte",
        requiresAuth: true,
        parameters: {
          path: [{ name: "id", description: "Identifiant du compte" }],
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },

      // Safes endpoints
      {
        path: "/api/cyberark/safes",
        method: "GET",
        description: "Récupérer la liste des coffres",
        requiresAuth: true,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
            { name: "search", description: "Recherche par nom de coffre", required: false },
            { name: "limit", description: "Nombre maximum de résultats", required: false },
            { name: "offset", description: "Décalage pour la pagination", required: false },
          ],
        },
      },
      {
        path: "/api/cyberark/safes/[safeName]",
        method: "GET",
        description: "Récupérer les détails d'un coffre",
        requiresAuth: true,
        parameters: {
          path: [{ name: "safeName", description: "Nom du coffre" }],
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },
      {
        path: "/api/cyberark/safes/[safeName]/members",
        method: "GET",
        description: "Récupérer les membres d'un coffre",
        requiresAuth: true,
        parameters: {
          path: [{ name: "safeName", description: "Nom du coffre" }],
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },

      // Users endpoints
      {
        path: "/api/cyberark/users",
        method: "GET",
        description: "Récupérer la liste des utilisateurs",
        requiresAuth: true,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
            {
              name: "search",
              description: "Recherche dans les noms d'utilisateur",
              required: false,
            },
            { name: "filter", description: "Filtre par type d'utilisateur", required: false },
          ],
        },
      },
      {
        path: "/api/cyberark/users/[id]",
        method: "GET",
        description: "Récupérer les détails d'un utilisateur",
        requiresAuth: true,
        parameters: {
          path: [{ name: "id", description: "Identifiant de l'utilisateur" }],
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },

      // Groups endpoints
      {
        path: "/api/cyberark/groups",
        method: "GET",
        description: "Récupérer la liste des groupes d'utilisateurs",
        requiresAuth: true,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
            { name: "search", description: "Recherche dans les noms de groupe", required: false },
          ],
        },
      },
      {
        path: "/api/cyberark/groups/[id]",
        method: "GET",
        description: "Récupérer les membres d'un groupe d'utilisateurs",
        requiresAuth: true,
        parameters: {
          path: [{ name: "id", description: "Identifiant du groupe" }],
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },

      // Platforms endpoints
      {
        path: "/api/cyberark/platforms",
        method: "GET",
        description: "Récupérer la liste des plateformes",
        requiresAuth: true,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },
      {
        path: "/api/cyberark/platforms/[id]",
        method: "GET",
        description: "Récupérer les détails d'une plateforme",
        requiresAuth: true,
        parameters: {
          path: [{ name: "id", description: "Identifiant de la plateforme" }],
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },

      // System health endpoints
      {
        path: "/api/cyberark/system/summary",
        method: "GET",
        description: "Récupérer le résumé de santé du système",
        requiresAuth: true,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
          ],
        },
      },
      {
        path: "/api/cyberark/system/details",
        method: "GET",
        description: "Récupérer les détails de santé du système",
        requiresAuth: true,
        parameters: {
          query: [
            { name: "baseUrl", description: "URL de base de l'instance CyberArk", required: true },
            { name: "component", description: "ID du composant à vérifier", required: false },
          ],
        },
      },

      // Meta endpoints
      {
        path: "/api/cyberark/meta/endpoints",
        method: "GET",
        description: "Récupérer la liste des endpoints API disponibles",
        requiresAuth: false,
      },
    ];

    // Ajouter les endpoints originaux CyberArk pour référence
    const originalEndpoints = CYBERARK_ENDPOINTS;

    return NextResponse.json({
      success: true,
      data: {
        endpoints,
        originalEndpoints,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des endpoints:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

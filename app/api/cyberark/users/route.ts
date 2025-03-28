import { NextRequest, NextResponse } from "next/server";
import { CYBERARK_ENDPOINTS } from "@/lib/cyberark/api";
import { ensureTrailingSlash, handleFetchError } from "@/lib/utils/utils";

/**
 * Gestionnaire pour récupérer la liste des utilisateurs CyberArk
 * GET /api/cyberark/users
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer le token d'authentification de l'en-tête
    const authHeader = request.headers.get("Authorization");

    // Déboguer l'en-tête d'authentification et extraire uniquement le token
    console.log(
      "Token d'authentification:",
      authHeader
        ? `${authHeader.substring(0, 10)}... (${authHeader.length} caractères)`
        : "Manquant"
    );

    // Vérifie si le token contient des caractères indésirables ou des espaces
    if (authHeader) {
      const containsSpaces = authHeader.includes(" ");
      const containsNewlines = authHeader.includes("\n") || authHeader.includes("\r");
      const containsQuotes = authHeader.includes('"') || authHeader.includes("'");

      console.log("Analyse du token:", {
        containsSpaces,
        containsNewlines,
        containsQuotes,
        length: authHeader.length,
      });
    }

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          error: "Non authentifié",
        },
        { status: 401 }
      );
    }

    // Récupérer les paramètres de requête
    const searchParams = request.nextUrl.searchParams;
    const baseUrl = searchParams.get("baseUrl");
    const search = searchParams.get("search");
    const filter = searchParams.get("filter");

    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "URL de base requise",
        },
        { status: 400 }
      );
    }

    // Construire l'URL de l'API CyberArk
    let apiUrl = `${ensureTrailingSlash(baseUrl)}${CYBERARK_ENDPOINTS.USERS.LIST}`;

    // Ajouter les paramètres de requête à l'URL CyberArk
    const cyberArkParams = new URLSearchParams();

    if (search) cyberArkParams.append("search", search);
    if (filter) cyberArkParams.append("filter", filter);

    const queryString = cyberArkParams.toString();
    if (queryString) {
      apiUrl += `?${queryString}`;
    }

    console.log("Requête à l'API CyberArk:", apiUrl);

    // Effectuer la requête à l'API CyberArk avec des en-têtes vérifiés
    const headers = {
      Authorization: authHeader.trim(), // Enlever les espaces en début/fin
      "Content-Type": "application/json",
    };

    console.log("En-têtes envoyés:", {
      Authorization: headers.Authorization
        ? `${headers.Authorization.substring(0, 10)}...`
        : "Manquant",
      ContentType: headers["Content-Type"],
    });

    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
    });

    // Log de la réponse pour débogage
    console.log("Statut de la réponse:", response.status, response.statusText);
    console.log("En-têtes de réponse:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw await handleFetchError(response);
    }

    // Lire d'abord la réponse comme texte
    const textResponse = await response.text();

    // Vérifier si c'est du JSON valide
    try {
      const data = JSON.parse(textResponse);

      return NextResponse.json({
        success: true,
        data,
      });
    } catch (/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ error) {
      console.error("Erreur de parsing JSON:", textResponse.substring(0, 200));

      return NextResponse.json(
        {
          success: false,
          error:
            "Le serveur a répondu avec un format invalide. Vérifiez l'URL et l'authentification.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { CYBERARK_ENDPOINTS } from "@/lib/cyberark/api";
import { ensureTrailingSlash, handleFetchError } from "@/lib/utils/utils";

/**
 * Gestionnaire pour récupérer le résumé de santé du système CyberArk
 * GET /api/cyberark/system/summary
 * @see https://docs.cyberark.com/pam-self-hosted/14.2/en/content/webservices/systemsummary.htm
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer le token d'authentification de l'en-tête
    const authHeader = request.headers.get("Authorization");

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
    const apiUrl = `${ensureTrailingSlash(baseUrl)}${CYBERARK_ENDPOINTS.SYSTEM.SUMMARY}`;

    console.log("Requête à l'API CyberArk:", apiUrl);

    // Effectuer la requête à l'API CyberArk
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

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
    } catch (/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ _error) {
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
    console.error("Erreur lors de la récupération du résumé de santé:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

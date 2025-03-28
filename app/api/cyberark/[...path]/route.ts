import { NextRequest, NextResponse } from "next/server";
import { ensureTrailingSlash, handleFetchError } from "@/lib/utils/utils";

/**
 * Gestionnaire générique pour les requêtes CyberArk
 * Proxy toutes les requêtes vers l'API CyberArk
 * Route: /api/cyberark/[...path]
 */
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Récupérer le token d'authentification de l'en-tête
    const authHeader = request.headers.get("Authorization");

    // Forcer les logs avec console.error pour être sûr qu'ils apparaissent
    console.error("## DÉBOGAGE 401 ERROR ##");
    console.error(
      "En-tête d'authentification:",
      authHeader
        ? `${authHeader.substring(0, 10)}...${authHeader.substring(authHeader.length - 10)} (${authHeader.length} caractères)`
        : "MANQUANT"
    );
    console.error("URL de la requête:", request.url);
    console.error("Headers complets:", Object.fromEntries(request.headers.entries()));

    // Vérifier et nettoyer le token (enlever les guillemets)
    let cleanToken = authHeader;
    if (authHeader) {
      // Supprimer les guillemets qui entourent le token
      if (authHeader.startsWith('"') && authHeader.endsWith('"')) {
        cleanToken = authHeader.substring(1, authHeader.length - 1);
        console.error("Token nettoyé des guillemets externes");
      }

      // Vérifier si le token commence par "Bearer "
      if (cleanToken.startsWith("Bearer ")) {
        cleanToken = cleanToken.substring(7).trim();
        console.error("Préfixe Bearer supprimé");
      }

      // Enlever les espaces en début/fin
      cleanToken = cleanToken.trim();

      console.error(
        "Token après nettoyage:",
        `${cleanToken.substring(0, 10)}...${cleanToken.substring(cleanToken.length - 10)} (${cleanToken.length} caractères)`
      );
    }

    if (!cleanToken) {
      console.error("ERREUR: Token d'authentification manquant");
      return NextResponse.json(
        {
          success: false,
          error: "Non authentifié (token manquant)",
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

    // Construire le chemin de l'API CyberArk
    const pathSegments = params.path;
    const cyberarkPath = `PasswordVault/API/${pathSegments.join("/")}`;

    // Construire l'URL complète avec les paramètres
    let apiUrl = `${ensureTrailingSlash(baseUrl)}${cyberarkPath}`;

    // Transférer les paramètres originaux sauf baseUrl
    const cyberArkParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "baseUrl") {
        cyberArkParams.append(key, value);
      }
    });

    const queryString = cyberArkParams.toString();
    if (queryString) {
      apiUrl += `?${queryString}`;
    }

    console.log("Requête à l'API CyberArk:", apiUrl);

    // Effectuer la requête à l'API CyberArk
    const headers = {
      Authorization: cleanToken,
      "Content-Type": "application/json",
    };

    console.error("En-têtes de la requête CyberArk:", {
      Authorization: headers.Authorization
        ? `${headers.Authorization.substring(0, 10)}...${headers.Authorization.substring(headers.Authorization.length - 10)} (${headers.Authorization.length} chars)`
        : "MANQUANT",
      ContentType: headers["Content-Type"],
    });

    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
    });

    // Journaliser la réponse
    console.error("Réponse CyberArk:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    // Si erreur 401, journalisons plus de détails
    if (response.status === 401) {
      try {
        const errorText = await response.text();
        console.error("Détails de l'erreur 401:", errorText);

        // Réponse d'erreur avec informations de débogage
        return NextResponse.json(
          {
            success: false,
            error: "Non authentifié (erreur 401 de CyberArk)",
            details: errorText.substring(0, 500), // Limiter à 500 caractères
            tokenLength: cleanToken.length,
          },
          { status: 401 }
        );
      } catch (readError) {
        console.error("Impossible de lire le corps de l'erreur:", readError);
      }
    }

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
    console.error("Erreur lors de la requête à l'API CyberArk:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { CYBERARK_ENDPOINTS } from "@/lib/cyberark/api";
import { ensureTrailingSlash, handleFetchError } from '@/lib/utils/utils";

/**
 * Gestionnaire pour récupérer les détails d'un compte CyberArk spécifique
 * GET /api/cyberark/accounts/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'ID du compte à partir des paramètres de route
    const accountId = params.id;
    
    if (!accountId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "ID de compte requis" 
        }, 
        { status: 400 }
      );
    }
    
    // Récupérer le token d'authentification de l'en-tête
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Non authentifié" 
        }, 
        { status: 401 }
      );
    }
    
    // Récupérer l'URL de base des paramètres de requête
    const searchParams = request.nextUrl.searchParams;
    const baseUrl = searchParams.get("baseUrl");
    
    if (!baseUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: "URL de base requise" 
        }, 
        { status: 400 }
      );
    }
    
    // Construire l'URL de l'API CyberArk en remplaçant {id} par l'ID du compte
    const apiEndpoint = CYBERARK_ENDPOINTS.ACCOUNTS.GET.replace("{id}", accountId);
    const apiUrl = `${ensureTrailingSlash(baseUrl)}${apiEndpoint}`;
    
    // Effectuer la requête à l'API CyberArk
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw await handleFetchError(response);
    }
    
    // Analyser et retourner la réponse
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data
    });
    
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du compte:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      }, 
      { status: 500 }
    );
  }
}

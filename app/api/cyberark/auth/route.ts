import { NextRequest, NextResponse } from "next/server";
import { CredentialsSchema } from "@/schemas/auth.schema";
import { authenticateCyberArk } from "@/lib/cyberark/api";

/**
 * Handler pour l'authentification CyberArk
 * POST /api/cyberark/auth
 */
export async function POST(request: NextRequest) {
  try {
    // Parsing de la requête
    const body = await request.json();
    
    // Validation des données avec Zod
    const result = CredentialsSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Données d'authentification invalides",
          details: result.error.format()
        }, 
        { status: 400 }
      );
    }
    
    // Données validées
    const credentials = result.data;
    
    // Authentification via CyberArk
    const authResult = await authenticateCyberArk(credentials, credentials.authType);
    
    if (!authResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: authResult.error || "Échec de l'authentification"
        }, 
        { status: 401 }
      );
    }
    
    // Succès - retourner le token et la date d'expiration
    return NextResponse.json({
      success: true,
      token: authResult.token,
      expiresAt: authResult.expiresAt.toISOString(),
    });
    
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    );
  }
}

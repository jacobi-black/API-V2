import { NextRequest, NextResponse } from "next/server";
import { logoffCyberArk } from "@/lib/cyberark/api";

/**
 * Handler pour la déconnexion CyberArk
 * POST /api/cyberark/auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer les informations de session du corps de la requête
    const body = await request.json();
    const { baseUrl, token } = body;
    
    if (!baseUrl || !token) {
      return NextResponse.json(
        { 
          success: false, 
          error: "URL de base et token requis" 
        }, 
        { status: 400 }
      );
    }
    
    // Déconnexion de CyberArk
    const logoffResult = await logoffCyberArk(baseUrl, token);
    
    if (!logoffResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: logoffResult.error || "Échec de la déconnexion" 
        }, 
        { status: 500 }
      );
    }
    
    // Succès
    return NextResponse.json({ 
      success: true 
    });
    
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      }, 
      { status: 500 }
    );
  }
}

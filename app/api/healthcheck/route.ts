import { NextResponse } from 'next/server';

/**
 * Point de contrôle de santé (healthcheck) pour l'application
 * 
 * Cette route est utilisée par les conteneurs Docker, les équilibreurs de charge,
 * et les systèmes de surveillance pour vérifier que l'application fonctionne correctement.
 */
export async function GET() {
  try {
    // Vérifier les connexions aux services externes si nécessaire
    // Par exemple, vérifier la connexion à la base de données
    
    // Status actuel de l'application
    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };
    
    // Retourner un code 200 avec les détails du statut
    return NextResponse.json(status);
  } catch (error) {
    console.error('Health check failed:', error);
    
    // En cas d'erreur, retourner un code 503 Service Unavailable
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: 'Service unavailable',
        timestamp: new Date().toISOString() 
      },
      { status: 503 }
    );
  }
}

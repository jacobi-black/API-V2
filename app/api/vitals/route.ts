import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint API pour collecter les métriques Core Web Vitals
 * 
 * Cette route reçoit les métriques de performance envoyées depuis le client
 * et les stocke pour analyse ultérieure.
 */
export async function POST(request: NextRequest) {
  try {
    // Extraire les données du corps de la requête
    const metrics = await request.json();
    
    // Ajouter un horodatage
    const metricWithTimestamp = {
      ...metrics,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      // Ajouter d'autres métadonnées utiles si nécessaire
    };
    
    // En environnement de production, nous enverrions ces données
    // à un service de surveillance comme Google Analytics, CloudWatch, etc.
    // Pour cet exemple, nous allons simplement les logger
    
    if (process.env.NODE_ENV === 'production') {
      // Exemple : envoyer à un service externe
      // await sendToAnalyticsService(metricWithTimestamp);
      
      // Pour le moment, nous les enregistrons en console
      console.log('[Web Vitals]', JSON.stringify(metricWithTimestamp));
    }
    
    // Répondre avec succès
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Web Vitals API Error]', error);
    return NextResponse.json(
      { error: 'Failed to process web vitals metrics' },
      { status: 500 }
    );
  }
}

// Cette fonction est un placeholder pour envoyer les données à un service externe
async function sendToAnalyticsService(metric: any) {
  // Exemple d'implémentation :
  // Si nous utilisions AWS CloudWatch :
  /*
  const cloudwatch = new AWS.CloudWatch();
  await cloudwatch.putMetricData({
    Namespace: 'CyberArkExplorer/WebVitals',
    MetricData: [
      {
        MetricName: metric.name,
        Value: metric.value,
        Unit: 'Milliseconds',
        Dimensions: [
          { Name: 'Page', Value: metric.path },
          { Name: 'Rating', Value: metric.rating }
        ]
      }
    ]
  }).promise();
  */
  
  // Ou si nous utilisions Google Analytics :
  /*
  await fetch(`https://www.google-analytics.com/collect?v=1&tid=${process.env.GA_TRACKING_ID}&t=event&ec=Web%20Vitals&ea=${metric.name}&el=${metric.path}&ev=${Math.round(metric.value)}`);
  */
}

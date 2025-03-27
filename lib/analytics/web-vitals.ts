/**
 * Web Vitals - Optimisation des Core Web Vitals
 * 
 * Ce module implémente la collecte et le rapport des Core Web Vitals
 * pour optimiser et surveiller les performances de l'application.
 * 
 * Référence: https://web.dev/vitals/
 */

import { 
  getCLS, 
  getFID, 
  getLCP, 
  getFCP, 
  getTTFB,
  type Metric 
} from 'web-vitals';

const ANALYTICS_ENDPOINT = '/api/vitals';

// Types des métriques Web Vitals
export type WebVitalsMetric = {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
};

/**
 * Détermine la classification de la métrique (good, needs-improvement, poor)
 * en fonction des seuils de Google
 */
const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'good';
  }
};

/**
 * Récupère le type de navigation de la page
 */
const getNavigationType = (): string => {
  const nav = window.performance?.getEntriesByType?.('navigation')?.[0] as any;
  return nav?.type || 'navigate';
};

/**
 * Envoie les métriques à notre endpoint d'analytics
 */
const sendToAnalytics = async (metric: WebVitalsMetric) => {
  try {
    // Ne pas envoyer les métriques en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric);
      return;
    }

    const body = JSON.stringify({
      name: metric.name,
      id: metric.id,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: getNavigationType(),
      path: window.location.pathname,
    });

    // Utiliser sendBeacon si disponible pour des rapports plus fiables
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ANALYTICS_ENDPOINT, body);
    } else {
      // Fallback à fetch avec keepalive
      await fetch(ANALYTICS_ENDPOINT, {
        body,
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('[Web Vitals] Error sending metrics:', error);
  }
};

/**
 * Fonction de rappel pour les métriques Web Vitals
 */
const reportWebVitals = (metric: Metric) => {
  const { name, id, value, delta } = metric;
  const rating = getRating(name, value);
  
  const webVitalsMetric: WebVitalsMetric = {
    id,
    name,
    value,
    delta,
    rating,
  };
  
  sendToAnalytics(webVitalsMetric);
};

/**
 * Initialise la capture de toutes les métriques Core Web Vitals
 */
export const initWebVitals = () => {
  // Ne pas capturer les métriques en mode SSR
  if (typeof window === 'undefined') return;
  
  // Largest Contentful Paint
  getLCP(reportWebVitals);
  
  // First Input Delay
  getFID(reportWebVitals);
  
  // Cumulative Layout Shift
  getCLS(reportWebVitals);
  
  // First Contentful Paint (bonus)
  getFCP(reportWebVitals);
  
  // Time to First Byte (bonus)
  getTTFB(reportWebVitals);
};

export default initWebVitals;

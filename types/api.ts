/**
 * Interface pour les réponses d'API standard
 */
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}

/**
 * Structure d'erreur API
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Options de requête API
 */
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  cache?: RequestCache;
}

/**
 * État d'une requête API
 */
export type ApiRequestState = 'idle' | 'loading' | 'success' | 'error';

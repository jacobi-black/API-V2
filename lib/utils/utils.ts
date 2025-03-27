import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine multiple class values into a single className string
 * using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Ensure URL has trailing slash
 */
export function ensureTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

/**
 * Handle fetch errors and format them appropriately
 */
export async function handleFetchError(response: Response): Promise<Error> {
  try {
    // Lire la réponse comme texte d'abord
    const textResponse = await response.text();

    // Vérifier si la réponse ressemble à du HTML
    if (textResponse.trim().startsWith("<!DOCTYPE") || textResponse.trim().startsWith("<html")) {
      console.error("Réponse HTML reçue au lieu de JSON:", textResponse.substring(0, 200));

      // Si c'est une redirection vers une page de connexion (code 302 typiquement)
      if (response.status === 302 || response.status === 301) {
        return new Error(
          `Redirection détectée (${response.status}). La session a probablement expiré.`
        );
      }

      // Autres cas de réponses HTML
      return new Error(
        `Le serveur a répondu avec une page HTML au lieu de JSON. Vérifiez l'URL et l'authentification.`
      );
    }

    // Essayer de parser comme JSON
    try {
      const data = JSON.parse(textResponse);
      return new Error(
        data.message || data.error || `Erreur ${response.status}: ${response.statusText}`
      );
    } catch (_parseError) {
      // Si ce n'est pas du JSON valide, retourner le contenu brut comme message d'erreur
      console.error("Réponse non-JSON:", textResponse);
      return new Error(
        `Réponse non-JSON (${response.status}): ${textResponse.substring(0, 100)}...`
      );
    }
  } catch (_error) {
    return new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
}

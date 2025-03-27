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
    const data = await response.json();
    return new Error(
      data.message || data.error || `Erreur ${response.status}: ${response.statusText}`
    );
  } catch (error) {
    return new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
}

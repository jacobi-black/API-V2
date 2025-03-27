import { exportToCsv, CsvExportOptions, detectColumns, formatHeaderTitle } from "./csv-export";
import { exportToJson, JsonExportOptions } from "./json-export";

export type ExportFormat = 'csv' | 'json';

export interface ExportOptions {
  /**
   * Format d'exportation
   * @default "json"
   */
  format?: ExportFormat;
  
  /**
   * Options spécifiques pour l'exportation CSV
   */
  csvOptions?: CsvExportOptions;
  
  /**
   * Options spécifiques pour l'exportation JSON
   */
  jsonOptions?: JsonExportOptions;
  
  /**
   * Nom du fichier d'exportation (sans extension)
   * @default "cyberark-export"
   */
  fileName?: string;

  /**
   * Inclure un horodatage dans le nom du fichier
   * @default true
   */
  includeTimestamp?: boolean;
}

/**
 * Interface générique pour un résultat d'exportation
 */
export interface ExportResult {
  url: string;
  fileName: string;
  download: () => void;
  cleanup: () => void;
}

/**
 * Exporte des données dans le format spécifié
 * 
 * @param data Les données à exporter
 * @param options Options d'exportation
 * @returns Un objet avec une URL de téléchargement et une fonction de téléchargement
 */
export function exportData(data: any, options: ExportOptions = {}): ExportResult {
  const { 
    format = 'json',
    fileName = 'cyberark-export',
    includeTimestamp = true,
    csvOptions = {},
    jsonOptions = {}
  } = options;
  
  // Préparer les options de fichier
  const fileOptions = {
    fileName,
    includeTimestamp
  };
  
  // Exporter selon le format
  if (format === 'csv') {
    // Vérifier que les données sont un tableau pour l'export CSV
    if (!Array.isArray(data)) {
      throw new Error('Les données doivent être un tableau pour l'exportation CSV');
    }
    
    // Auto-détection des colonnes et formatage des en-têtes si nécessaire
    if (!csvOptions.columns) {
      csvOptions.columns = detectColumns(data);
    }
    
    if (!csvOptions.formatHeader) {
      csvOptions.formatHeader = formatHeaderTitle;
    }
    
    return exportToCsv(data, {
      ...csvOptions,
      ...fileOptions
    });
  } else {
    return exportToJson(data, {
      ...jsonOptions,
      ...fileOptions
    });
  }
}

/**
 * Détermine si les données peuvent être exportées au format CSV
 * 
 * @param data Les données à exporter
 * @returns true si les données peuvent être exportées au format CSV
 */
export function canExportAsCsv(data: any): boolean {
  return Array.isArray(data) && data.length > 0;
}

/**
 * Récupère les données à exporter depuis une réponse API
 * 
 * @param data Les données de la réponse API
 * @returns Les données préparées pour l'exportation
 */
export function prepareExportData(data: any): any {
  // Si les données ont une structure standard d'API, extraire le contenu
  if (data && data.data !== undefined) {
    return data.data;
  }
  
  // Sinon, retourner les données telles quelles
  return data;
}

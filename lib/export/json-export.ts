/**
 * Utilitaires pour l'exportation de données au format JSON
 */

/**
 * Options pour l'exportation JSON
 */
export interface JsonExportOptions {
  /**
   * Inclure une indentation pour un JSON formaté (pretty print)
   * @default true
   */
  prettyPrint?: boolean;

  /**
   * Niveau d'indentation (nombre d'espaces)
   * @default 2
   */
  indentation?: number;

  /**
   * Nom du fichier d'exportation (sans extension)
   * @default "cyberark-export"
   */
  fileName?: string;

  /**
   * Fonction de transformation appliquée aux données avant l'exportation
   */
  transform?: (data: any) => any;

  /**
   * Inclure un horodatage dans le nom du fichier
   * @default true
   */
  includeTimestamp?: boolean;
}

/**
 * Exporte des données au format JSON
 * 
 * @param data Les données à exporter
 * @param options Options d'exportation
 * @returns Un objet avec une URL de téléchargement et une fonction de téléchargement
 */
export function exportToJson(data: any, options: JsonExportOptions = {}) {
  const {
    prettyPrint = true,
    indentation = 2,
    fileName = "cyberark-export",
    transform,
    includeTimestamp = true
  } = options;

  // Appliquer la transformation si spécifiée
  const processedData = transform ? transform(data) : data;
  
  // Convertir en chaîne JSON
  const jsonString = prettyPrint 
    ? JSON.stringify(processedData, null, indentation)
    : JSON.stringify(processedData);
  
  // Créer un blob JSON
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Générer un nom de fichier
  let outputFileName = fileName;
  
  if (includeTimestamp) {
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    outputFileName = `${fileName}-${timestamp}`;
  }
  
  outputFileName = `${outputFileName}.json`;
  
  // Créer une URL pour le téléchargement
  const url = URL.createObjectURL(blob);
  
  // Fonction pour déclencher le téléchargement
  const download = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = outputFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return {
    url,
    fileName: outputFileName,
    download,
    cleanup: () => URL.revokeObjectURL(url)
  };
}

/**
 * Génère une chaîne JSON pour l'affichage ou le copier-coller
 * 
 * @param data Les données à formater
 * @param prettyPrint Inclure une indentation pour un JSON formaté
 * @param indentation Niveau d'indentation (nombre d'espaces)
 * @returns Chaîne JSON formatée
 */
export function formatJsonString(
  data: any, 
  prettyPrint: boolean = true, 
  indentation: number = 2
): string {
  return prettyPrint 
    ? JSON.stringify(data, null, indentation)
    : JSON.stringify(data);
}

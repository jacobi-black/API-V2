/**
 * Utilitaires pour l'exportation de données au format CSV
 */

/**
 * Options pour l'exportation CSV
 */
export interface CsvExportOptions {
  /**
   * Délimiteur à utiliser pour séparer les valeurs
   * @default ","
   */
  delimiter?: string;

  /**
   * Caractère d'échappement pour les valeurs contenant le délimiteur
   * @default '"'
   */
  quoteChar?: string;

  /**
   * Inclure les en-têtes de colonnes
   * @default true
   */
  includeHeaders?: boolean;

  /**
   * Nom du fichier d'exportation (sans extension)
   * @default "cyberark-export"
   */
  fileName?: string;

  /**
   * Liste des colonnes à inclure dans l'export
   * Si non spécifié, toutes les colonnes seront incluses
   */
  columns?: string[];
  
  /**
   * Fonction de transformation appliquée aux données avant l'exportation
   */
  transform?: (data: any) => any;

  /**
   * Inclure un horodatage dans le nom du fichier
   * @default true
   */
  includeTimestamp?: boolean;
  
  /**
   * Fonction personnalisée pour extraire un nom de colonne à partir de la clé d'objet
   */
  formatHeader?: (key: string) => string;
}

/**
 * Interface pour un mappage de champs d'exportation
 */
export interface ExportFieldMapping {
  /** Nom du champ source dans les données */
  source: string;
  /** Nom du champ dans le CSV exporté */
  target: string;
  /** Fonction de transformation pour la valeur du champ (optionnelle) */
  transform?: (value: any, row: any) => any;
}

/**
 * Échapper une valeur CSV
 */
function escapeCsvValue(value: any, quoteChar: string, delimiter: string): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Convertir les valeurs en chaînes
  const stringValue = typeof value === 'object' 
    ? JSON.stringify(value) 
    : String(value);
  
  // Échapper les guillemets en les doublant
  const escapedValue = stringValue.replace(
    new RegExp(quoteChar, 'g'), 
    quoteChar + quoteChar
  );
  
  // Si la valeur contient des délimiteurs ou des sauts de ligne, 
  // ou des guillemets, l'entourer de guillemets
  if (
    escapedValue.includes(delimiter) || 
    escapedValue.includes('\n') ||
    escapedValue.includes('\r') || 
    escapedValue.includes(quoteChar)
  ) {
    return quoteChar + escapedValue + quoteChar;
  }
  
  return escapedValue;
}

/**
 * Exporte des données au format CSV
 * 
 * @param data Les données à exporter (tableau d'objets)
 * @param options Options d'exportation
 * @returns Un objet avec une URL de téléchargement et une fonction de téléchargement
 */
export function exportToCsv(data: any[], options: CsvExportOptions = {}) {
  if (!Array.isArray(data)) {
    throw new Error('Les données doivent être un tableau');
  }
  
  const {
    delimiter = ',',
    quoteChar = '"',
    includeHeaders = true,
    fileName = 'cyberark-export',
    columns,
    transform,
    includeTimestamp = true,
    formatHeader = (key: string) => key
  } = options;
  
  // Appliquer la transformation si spécifiée
  const processedData = transform ? transform(data) : data;
  
  if (processedData.length === 0) {
    // Créer un fichier CSV vide
    const blob = new Blob([''], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Générer un nom de fichier
    let outputFileName = fileName;
    
    if (includeTimestamp) {
      const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
      outputFileName = `${fileName}-${timestamp}`;
    }
    
    outputFileName = `${outputFileName}.csv`;
    
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
  
  // Déterminer les colonnes à inclure
  const firstRow = processedData[0];
  const headerKeys = columns || Object.keys(firstRow);
  
  // Créer la ligne d'en-tête
  let csvContent = '';
  
  if (includeHeaders) {
    const headerRow = headerKeys
      .map(key => escapeCsvValue(formatHeader(key), quoteChar, delimiter))
      .join(delimiter);
    csvContent += headerRow + '\r\n';
  }
  
  // Ajouter les lignes de données
  for (const row of processedData) {
    const rowContent = headerKeys
      .map(key => {
        const value = key.includes('.') 
          ? getNestedProperty(row, key) 
          : row[key];
        return escapeCsvValue(value, quoteChar, delimiter);
      })
      .join(delimiter);
    csvContent += rowContent + '\r\n';
  }
  
  // Créer un blob CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Générer un nom de fichier
  let outputFileName = fileName;
  
  if (includeTimestamp) {
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    outputFileName = `${fileName}-${timestamp}`;
  }
  
  outputFileName = `${outputFileName}.csv`;
  
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
 * Récupère une propriété imbriquée d'un objet en utilisant une notation pointée
 * Exemple: getNestedProperty({a: {b: {c: 1}}}, 'a.b.c') retourne 1
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
}

/**
 * Détecte automatiquement les colonnes à partir d'un tableau d'objets
 * 
 * @param data Tableau d'objets
 * @param maxDepth Profondeur maximale pour les propriétés imbriquées
 * @returns Liste des colonnes détectées
 */
export function detectColumns(data: any[], maxDepth: number = 2): string[] {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  const columns = new Set<string>();
  
  // Parcourir un échantillon de données (max 100 éléments) pour détecter toutes les colonnes
  const sampleSize = Math.min(100, data.length);
  
  for (let i = 0; i < sampleSize; i++) {
    const item = data[i];
    if (typeof item === 'object' && item !== null) {
      // Ajouter les propriétés de premier niveau
      const keys = Object.keys(item);
      for (const key of keys) {
        columns.add(key);
        
        // Explorer les propriétés imbriquées si nécessaire
        if (maxDepth > 1 && typeof item[key] === 'object' && item[key] !== null && !Array.isArray(item[key])) {
          exploreNestedProperties(item[key], key, columns, 1, maxDepth);
        }
      }
    }
  }
  
  return Array.from(columns);
}

/**
 * Explore récursivement les propriétés imbriquées d'un objet
 */
function exploreNestedProperties(
  obj: any, 
  parentPath: string, 
  columns: Set<string>, 
  currentDepth: number, 
  maxDepth: number
): void {
  if (currentDepth >= maxDepth || typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return;
  }
  
  const keys = Object.keys(obj);
  for (const key of keys) {
    const path = `${parentPath}.${key}`;
    columns.add(path);
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      exploreNestedProperties(obj[key], path, columns, currentDepth + 1, maxDepth);
    }
  }
}

/**
 * Formate un nom d'en-tête en format titre (première lettre majuscule, espaces entre mots)
 * Exemple: "userName" devient "User Name"
 */
export function formatHeaderTitle(key: string): string {
  // Remplacer les points par des espaces
  let formatted = key.replace(/\./g, ' ');
  
  // Ajouter des espaces avant les majuscules
  formatted = formatted.replace(/([A-Z])/g, ' $1');
  
  // Supprimer les espaces multiples et les espaces en début/fin
  formatted = formatted.replace(/\s+/g, ' ').trim();
  
  // Mettre en majuscule la première lettre de chaque mot
  return formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

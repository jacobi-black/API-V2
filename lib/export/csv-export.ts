/**
 * Utilitaires pour l'exportation de données au format CSV
 */

/**
 * Options pour la conversion de JSON en CSV
 */
export interface CsvExportOptions {
  /**
   * Inclure les en-têtes de colonnes
   * @default true
   */
  includeHeaders?: boolean;

  /**
   * Caractère délimiteur entre les valeurs
   * @default ","
   */
  delimiter?: string;

  /**
   * Liste des champs à inclure (si vide, tous les champs sont inclus)
   */
  fields?: string[];

  /**
   * Transformations personnalisées pour les valeurs
   * Fonction qui prend une valeur et retourne une chaîne formatée
   */
  transforms?: Record<string, (value: any) => string>;

  /**
   * Caractère pour encadrer les chaînes (quotation)
   * @default "\""
   */
  quote?: string;
  
  /**
   * Caractère de fin de ligne
   * @default "\n"
   */
  newline?: string;
}

/**
 * Convertit un objet JavaScript en chaîne CSV
 * 
 * @param data Données à convertir (objet ou tableau d'objets)
 * @param options Options de conversion
 * @returns Chaîne CSV générée
 */
export function jsonToCsv(data: any, options: CsvExportOptions = {}): string {
  // Valeurs par défaut des options
  const includeHeaders = options.includeHeaders !== false;
  const delimiter = options.delimiter || ',';
  const quoteChar = options.quote || '"';
  const newline = options.newline || '\n';
  const transforms = options.transforms || {};
  
  // Si les données ne sont pas un tableau, les convertir en tableau
  const dataArray = Array.isArray(data) ? data : [data];
  
  // Si le tableau est vide, retourner une chaîne vide
  if (dataArray.length === 0) {
    return '';
  }
  
  // Déterminer les champs à inclure
  const firstItem = dataArray[0];
  const allFields = Object.keys(firstItem);
  const fields = options.fields && options.fields.length > 0 
    ? options.fields.filter(field => allFields.includes(field))
    : allFields;
  
  // Fonction pour échapper les valeurs avec des délimiteurs, guillemets ou retours à la ligne
  const escapeValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    
    const stringValue = String(value);
    
    // Si la valeur contient des délimiteurs, des guillemets ou des retours à la ligne,
    // l'encadrer avec des guillemets et échapper les guillemets internes
    if (
      stringValue.includes(delimiter) || 
      stringValue.includes(quoteChar) || 
      stringValue.includes('\n') || 
      stringValue.includes('\r')
    ) {
      return quoteChar + stringValue.replace(new RegExp(quoteChar, 'g'), quoteChar + quoteChar) + quoteChar;
    }
    
    return stringValue;
  };
  
  // Générer les en-têtes
  let csv = '';
  if (includeHeaders) {
    csv = fields.map(escapeValue).join(delimiter) + newline;
  }
  
  // Générer les lignes de données
  for (const item of dataArray) {
    const row = fields.map(field => {
      const value = item[field];
      
      // Appliquer la transformation si définie pour ce champ
      if (transforms[field]) {
        return escapeValue(transforms[field](value));
      }
      
      // Traitement spécial pour les objets et les tableaux
      if (typeof value === 'object' && value !== null) {
        return escapeValue(JSON.stringify(value));
      }
      
      return escapeValue(value);
    });
    
    csv += row.join(delimiter) + newline;
  }
  
  return csv;
}

/**
 * Télécharge les données CSV dans le navigateur
 * 
 * @param csvString Chaîne CSV à télécharger
 * @param filename Nom du fichier (sans extension)
 */
export function downloadCsv(csvString: string, filename: string): void {
  // Créer un objet Blob avec le contenu CSV
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Créer un URL pour le Blob
  const url = URL.createObjectURL(blob);
  
  // Créer un élément <a> pour le téléchargement
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  
  // Ajouter l'élément au DOM, cliquer dessus, puis le supprimer
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Libérer l'URL créé
  URL.revokeObjectURL(url);
}

/**
 * Convertit et télécharge les données JSON au format CSV
 * 
 * @param data Données à convertir (objet ou tableau d'objets)
 * @param filename Nom du fichier (sans extension)
 * @param options Options de conversion
 */
export function exportToCsv(
  data: any, 
  filename: string, 
  options: CsvExportOptions = {}
): void {
  if (!data) {
    console.error('Aucune donnée à exporter');
    return;
  }
  
  try {
    const csvString = jsonToCsv(data, options);
    downloadCsv(csvString, filename);
  } catch (error) {
    console.error('Erreur lors de l\'exportation CSV:', error);
  }
}

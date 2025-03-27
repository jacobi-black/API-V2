/**
 * Utilitaires pour l'exportation de données au format JSON
 */

/**
 * Options pour l'exportation JSON
 */
export interface JsonExportOptions {
  /**
   * Indenter le JSON pour le rendre plus lisible
   * @default true
   */
  prettyPrint?: boolean;
  
  /**
   * Nombre d'espaces pour l'indentation (si prettyPrint est true)
   * @default 2
   */
  indent?: number;
  
  /**
   * Liste des champs à inclure (si vide, tous les champs sont inclus)
   */
  fields?: string[];
  
  /**
   * Transformations personnalisées pour les valeurs
   * Fonction qui prend une valeur et retourne une valeur transformée
   */
  transforms?: Record<string, (value: any) => any>;
}

/**
 * Filtre et transforme un objet JSON selon les options spécifiées
 * 
 * @param data Données à filtrer et transformer
 * @param options Options de filtrage et transformation
 * @returns Données filtrées et transformées
 */
export function processJsonData(data: any, options: JsonExportOptions = {}): any {
  const { fields, transforms } = options;
  
  // Si pas de filtrage ni de transformation, retourner les données telles quelles
  if ((!fields || fields.length === 0) && (!transforms || Object.keys(transforms).length === 0)) {
    return data;
  }
  
  // Fonction pour traiter un objet unique
  const processObject = (obj: Record<string, any>): Record<string, any> => {
    const result: Record<string, any> = {};
    
    // Détermine les champs à inclure
    const keysToInclude = fields && fields.length > 0
      ? Object.keys(obj).filter(key => fields.includes(key))
      : Object.keys(obj);
    
    // Traite chaque champ
    for (const key of keysToInclude) {
      let value = obj[key];
      
      // Applique la transformation si définie pour ce champ
      if (transforms && transforms[key]) {
        value = transforms[key](value);
      }
      
      // Traitement récursif pour les tableaux et objets
      if (value !== null && typeof value === 'object') {
        if (Array.isArray(value)) {
          value = value.map(item => 
            typeof item === 'object' && item !== null ? processObject(item) : item
          );
        } else {
          value = processObject(value);
        }
      }
      
      result[key] = value;
    }
    
    return result;
  };
  
  // Traitement selon que les données sont un tableau ou un objet
  if (Array.isArray(data)) {
    return data.map(item => 
      typeof item === 'object' && item !== null ? processObject(item) : item
    );
  }
  
  if (typeof data === 'object' && data !== null) {
    return processObject(data);
  }
  
  return data;
}

/**
 * Télécharge les données JSON dans le navigateur
 * 
 * @param data Données JSON à télécharger
 * @param filename Nom du fichier (sans extension)
 * @param options Options d'exportation
 */
export function downloadJson(
  data: any, 
  filename: string, 
  options: JsonExportOptions = {}
): void {
  const prettyPrint = options.prettyPrint !== false;
  const indent = options.indent || 2;
  
  // Convertir les données en chaîne JSON
  const jsonString = prettyPrint 
    ? JSON.stringify(data, null, indent)
    : JSON.stringify(data);
  
  // Créer un objet Blob avec le contenu JSON
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  
  // Créer un URL pour le Blob
  const url = URL.createObjectURL(blob);
  
  // Créer un élément <a> pour le téléchargement
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.json`);
  
  // Ajouter l'élément au DOM, cliquer dessus, puis le supprimer
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Libérer l'URL créé
  URL.revokeObjectURL(url);
}

/**
 * Traite et télécharge les données au format JSON
 * 
 * @param data Données à exporter
 * @param filename Nom du fichier (sans extension)
 * @param options Options d'exportation
 */
export function exportToJson(
  data: any, 
  filename: string, 
  options: JsonExportOptions = {}
): void {
  if (!data) {
    console.error('Aucune donnée à exporter');
    return;
  }
  
  try {
    // Filtrer et transformer les données si nécessaire
    const processedData = processJsonData(data, options);
    
    // Télécharger le fichier JSON
    downloadJson(processedData, filename, options);
  } catch (error) {
    console.error('Erreur lors de l\'exportation JSON:', error);
  }
}

# Fonctionnalités d'Exportation - CyberArk API Explorer

Ce document détaille l'implémentation des fonctionnalités d'exportation dans l'application CyberArk API Explorer, qui permettent aux utilisateurs d'exporter les résultats des requêtes API en formats CSV et JSON.

## Table des matières

- [Architecture](#architecture)
- [Bibliothèques et modules d'exportation](#bibliothèques-et-modules-dexportation)
  - [Module CSV](#module-csv)
  - [Module JSON](#module-json)
  - [Utilitaires d'exportation](#utilitaires-dexportation)
- [Interface utilisateur](#interface-utilisateur)
- [Gestion d'état](#gestion-détat)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Bonnes pratiques](#bonnes-pratiques)

## Architecture

Les fonctionnalités d'exportation suivent une architecture modulaire, avec une séparation claire entre:

1. **Modules d'exportation** - Fonctions utilitaires pour convertir des données en formats spécifiques
2. **Composants UI** - Interface utilisateur permettant de configurer les options d'exportation
3. **État global** - Stockage des préférences d'exportation de l'utilisateur

Les fichiers clés sont organisés comme suit:

```
lib/export/
  ├── csv-export.ts       # Fonctions d'exportation CSV
  ├── json-export.ts      # Fonctions d'exportation JSON
  └── export-utils.ts     # Utilitaires partagés

components/results/
  └── results-export.tsx  # Interface utilisateur d'exportation

store/
  └── export.store.ts     # Gestion d'état pour les préférences d'exportation
```

## Bibliothèques et modules d'exportation

### Module CSV

`csv-export.ts` fournit les fonctionnalités pour convertir des données JSON en format CSV.

#### Fonctionnalités principales

- Conversion de données structurées en CSV
- Support des options de formatage (délimiteurs, guillemets, etc.)
- Gestion des données imbriquées via notation par points
- Détection automatique des colonnes
- Formatage personnalisable des en-têtes

#### Interface

```typescript
export interface CsvExportOptions {
  delimiter?: string;           // Délimiteur (par défaut ",")
  quoteChar?: string;           // Caractère de citation (par défaut '"')
  includeHeaders?: boolean;     // Inclure les en-têtes (par défaut true)
  fileName?: string;            // Nom du fichier (sans extension)
  columns?: string[];           // Colonnes à inclure
  transform?: (data: any) => any; // Transformation des données
  includeTimestamp?: boolean;   // Inclure horodatage dans le nom
  formatHeader?: (key: string) => string; // Formatage des en-têtes
}
```

#### Méthodes

- `exportToCsv(data: any[], options?: CsvExportOptions)`: Convertit les données en CSV et renvoie un objet permettant de télécharger le fichier
- `detectColumns(data: any[], maxDepth?: number)`: Détecte automatiquement les colonnes dans un jeu de données
- `formatHeaderTitle(key: string)`: Formate les clés d'objets en titres lisibles

### Module JSON

`json-export.ts` gère l'exportation des données au format JSON.

#### Fonctionnalités principales

- Export de données JSON avec formatage configurable
- Options d'indentation personnalisables
- Génération de fichiers téléchargeables
- Support de transformation des données

#### Interface

```typescript
export interface JsonExportOptions {
  prettyPrint?: boolean;        // JSON formaté (par défaut true)
  indentation?: number;         // Niveau d'indentation (par défaut 2)
  fileName?: string;            // Nom du fichier (sans extension)
  transform?: (data: any) => any; // Transformation des données
  includeTimestamp?: boolean;   // Inclure horodatage dans le nom
}
```

#### Méthodes

- `exportToJson(data: any, options?: JsonExportOptions)`: Convertit les données en JSON et renvoie un objet permettant de télécharger le fichier
- `formatJsonString(data: any, prettyPrint?: boolean, indentation?: number)`: Génère une chaîne JSON formatée

### Utilitaires d'exportation

`export-utils.ts` fournit des utilitaires communs aux deux formats d'exportation.

#### Fonctionnalités principales

- Interface unifiée pour les deux formats d'exportation
- Détection automatique du type de données pour l'exportation CSV
- Préparation des données pour l'exportation

#### Interface

```typescript
export interface ExportOptions {
  format?: 'csv' | 'json';       // Format d'exportation
  csvOptions?: CsvExportOptions; // Options CSV
  jsonOptions?: JsonExportOptions; // Options JSON
  fileName?: string;             // Nom du fichier
  includeTimestamp?: boolean;    // Inclure horodatage
}
```

#### Méthodes

- `exportData(data: any, options?: ExportOptions)`: Point d'entrée principal pour l'exportation
- `canExportAsCsv(data: any)`: Détermine si les données peuvent être exportées en CSV
- `prepareExportData(data: any)`: Prépare les données de l'API pour l'exportation

## Interface utilisateur

Le composant `results-export.tsx` fournit une interface utilisateur complète pour configurer les options d'exportation.

### Caractéristiques

- Dialogue modal pour les options d'exportation
- Sélection du format (CSV/JSON)
- Configuration du nom de fichier
- Options spécifiques au format (délimiteur CSV, indentation JSON, etc.)
- Sélection des colonnes pour l'exportation CSV
- Prévisualisation des options avant exportation

### Intégration

Pour intégrer le composant d'exportation dans une page de résultats:

```tsx
import { ResultsExport } from '@/components/results/results-export';

// Dans votre composant de résultats
<ResultsViewer data={apiResults}>
  <ResultsExport 
    data={apiResults}
    suggestedFileName="cyberark-accounts"
    disabled={isLoading}
  />
</ResultsViewer>
```

## Gestion d'état

`export.store.ts` gère les préférences d'exportation à l'aide de Zustand.

### État stocké

- Format d'exportation par défaut (CSV/JSON)
- Options CSV personnalisées 
- Options JSON personnalisées
- Préréglages d'exportation enregistrés

### Méthodes

- `setFormat(format)`: Change le format d'exportation par défaut
- `setCsvOptions(options)`: Met à jour les options CSV
- `setJsonOptions(options)`: Met à jour les options JSON
- `savePreset(name)`: Enregistre les paramètres actuels comme préréglage
- `loadPreset(id)`: Charge un préréglage enregistré
- `deletePreset(id)`: Supprime un préréglage
- `resetOptions()`: Réinitialise les options aux valeurs par défaut

## Exemples d'utilisation

### Exportation programmatique

```typescript
import { exportData } from '@/lib/export/export-utils';

// Exporter des données en JSON
const jsonResult = exportData(apiData, {
  format: 'json',
  fileName: 'cyberark-accounts',
  jsonOptions: {
    prettyPrint: true,
    indentation: 2
  }
});
jsonResult.download();

// Exporter des données en CSV
const csvResult = exportData(apiData, {
  format: 'csv',
  fileName: 'cyberark-accounts',
  csvOptions: {
    delimiter: ',',
    includeHeaders: true
  }
});
csvResult.download();
```

### Utilisation avec le store global

```typescript
import { useExportStore } from '@/store/export.store';

// Dans un composant
const { format, csvOptions, jsonOptions, setFormat } = useExportStore();

// Changer le format par défaut
setFormat('csv');

// Exporter avec les préférences de l'utilisateur
const result = exportData(apiData, {
  format: format,
  csvOptions: format === 'csv' ? csvOptions : undefined,
  jsonOptions: format === 'json' ? jsonOptions : undefined
});
result.download();
```

## Bonnes pratiques

1. **Grands ensembles de données** - Pour les grands ensembles de données, utilisez le paramètre `transform` pour filtrer ou limiter les données avant l'exportation.

2. **Données imbriquées** - Les données fortement imbriquées peuvent ne pas bien se traduire en CSV. Utilisez une fonction de transformation pour aplatir les données si nécessaire.

3. **Formatage des colonnes** - Les noms de colonnes générés automatiquement peuvent ne pas être idéaux. Utilisez l'option `formatHeader` pour personnaliser les en-têtes CSV.

4. **Internationalisation** - Pour les applications multilingues, les en-têtes et les délimiteurs peuvent nécessiter des ajustements en fonction des paramètres régionaux.

5. **Nettoyage des ressources** - Appelez toujours `cleanup()` sur le résultat de l'exportation après utilisation pour éviter les fuites de mémoire.

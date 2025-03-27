"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserPreferences {
  // Préférences d'affichage
  defaultPageSize: number;
  defaultResultView: "json" | "table" | "raw";
  expandAllNodesByDefault: boolean;
  
  // Préférences d'exportation
  defaultExportFormat: "json" | "csv";
  defaultCsvDelimiter: "," | ";" | "\t" | "|";
  includeHeadersInCsv: boolean;
  prettyPrintJson: boolean;
  jsonIndent: number;
  
  // Autres préférences
  rememberLastEndpoint: boolean;
  showRequestHistory: boolean;
  cacheResponses: boolean;
}

interface PreferencesState extends UserPreferences {
  // Actions
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
}

// Valeurs par défaut
const DEFAULT_PREFERENCES: UserPreferences = {
  defaultPageSize: 10,
  defaultResultView: "json",
  expandAllNodesByDefault: false,
  
  defaultExportFormat: "json",
  defaultCsvDelimiter: ",",
  includeHeadersInCsv: true,
  prettyPrintJson: true,
  jsonIndent: 2,
  
  rememberLastEndpoint: true,
  showRequestHistory: true,
  cacheResponses: true,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      // État initial (valeurs par défaut)
      ...DEFAULT_PREFERENCES,
      
      // Actions
      updatePreference: (key, value) => {
        set({ [key]: value });
      },
      
      resetPreferences: () => {
        set(DEFAULT_PREFERENCES);
      }
    }),
    {
      name: "cyberark-preferences",
      skipHydration: true
    }
  )
);

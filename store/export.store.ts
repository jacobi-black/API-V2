"use client";

import { create } from "zustand";
import { CsvExportOptions, JsonExportOptions } from "@/lib/export";

export type ExportFormat = "csv" | "json";

export interface ExportPresetType {
  id: string;
  name: string;
  format: ExportFormat;
  options: CsvExportOptions | JsonExportOptions;
}

interface ExportStoreState {
  // État
  format: ExportFormat;
  csvOptions: CsvExportOptions;
  jsonOptions: JsonExportOptions;
  presets: ExportPresetType[];
  selectedPresetId: string | null;
  
  // Actions
  setFormat: (format: ExportFormat) => void;
  setCsvOptions: (options: Partial<CsvExportOptions>) => void;
  setJsonOptions: (options: Partial<JsonExportOptions>) => void;
  savePreset: (name: string) => string; // Retourne l'ID du nouveau preset
  deletePreset: (id: string) => void;
  loadPreset: (id: string) => void;
  resetOptions: () => void;
}

export const useExportStore = create<ExportStoreState>((set, get) => ({
  // État initial
  format: "json",
  csvOptions: {
    delimiter: ",",
    includeHeaders: true,
    textDelimiter: '"',
    includeDate: true,
    filename: "cyberark-export"
  },
  jsonOptions: {
    indent: 2,
    includeDate: true,
    filename: "cyberark-export"
  },
  presets: [],
  selectedPresetId: null,
  
  // Actions
  setFormat: (format) => set({ format }),
  
  setCsvOptions: (options) => set(state => ({
    csvOptions: { ...state.csvOptions, ...options }
  })),
  
  setJsonOptions: (options) => set(state => ({
    jsonOptions: { ...state.jsonOptions, ...options }
  })),
  
  savePreset: (name) => {
    const { format, csvOptions, jsonOptions } = get();
    const id = `preset-${Date.now()}`;
    
    const newPreset: ExportPresetType = {
      id,
      name,
      format,
      options: format === "csv" ? { ...csvOptions } : { ...jsonOptions }
    };
    
    set(state => ({
      presets: [...state.presets, newPreset],
      selectedPresetId: id
    }));
    
    return id;
  },
  
  deletePreset: (id) => set(state => ({
    presets: state.presets.filter(preset => preset.id !== id),
    selectedPresetId: state.selectedPresetId === id ? null : state.selectedPresetId
  })),
  
  loadPreset: (id) => {
    const { presets } = get();
    const preset = presets.find(p => p.id === id);
    
    if (!preset) return;
    
    if (preset.format === "csv") {
      set({
        format: "csv",
        csvOptions: preset.options as CsvExportOptions,
        selectedPresetId: id
      });
    } else {
      set({
        format: "json",
        jsonOptions: preset.options as JsonExportOptions,
        selectedPresetId: id
      });
    }
  },
  
  resetOptions: () => set({
    csvOptions: {
      delimiter: ",",
      includeHeaders: true,
      textDelimiter: '"',
      includeDate: true,
      filename: "cyberark-export"
    },
    jsonOptions: {
      indent: 2,
      includeDate: true,
      filename: "cyberark-export"
    },
    selectedPresetId: null
  })
}));

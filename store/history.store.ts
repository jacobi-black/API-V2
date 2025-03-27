"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Endpoint } from "@/store/endpoint.store";

export interface RequestHistoryEntry {
  id: string;
  timestamp: Date;
  endpointId: string;
  endpointName: string;
  category: string;
  path: string;
  parameters: {
    path: Record<string, string>;
    query: Record<string, string | number | boolean>;
  };
  success: boolean;
  responseTime: number;  // en millisecondes
  resultCount?: number;  // pour les réponses de type array
}

interface HistoryState {
  // Données
  entries: RequestHistoryEntry[];
  favorites: string[];  // IDs des entrées favorites
  
  // Actions
  addEntry: (entry: Omit<RequestHistoryEntry, "id">) => string;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  toggleFavorite: (id: string) => void;
  getEntry: (id: string) => RequestHistoryEntry | undefined;
  getLastEntries: (count: number) => RequestHistoryEntry[];
  getEndpointHistory: (endpointId: string) => RequestHistoryEntry[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      // État initial
      entries: [],
      favorites: [],
      
      // Actions
      addEntry: (entry) => {
        const id = `history-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newEntry = { ...entry, id };
        
        set(state => ({
          entries: [{ ...newEntry, id }, ...state.entries.slice(0, 99)]  // Garder les 100 derniers
        }));
        
        return id;
      },
      
      removeEntry: (id) => {
        set(state => ({
          entries: state.entries.filter(entry => entry.id !== id),
          favorites: state.favorites.filter(favId => favId !== id)
        }));
      },
      
      clearHistory: () => {
        set({ entries: [], favorites: [] });
      },
      
      toggleFavorite: (id) => {
        set(state => {
          const isFavorite = state.favorites.includes(id);
          
          return {
            favorites: isFavorite
              ? state.favorites.filter(favId => favId !== id)
              : [...state.favorites, id]
          };
        });
      },
      
      getEntry: (id) => {
        return get().entries.find(entry => entry.id === id);
      },
      
      getLastEntries: (count) => {
        return get().entries.slice(0, count);
      },
      
      getEndpointHistory: (endpointId) => {
        return get().entries.filter(entry => entry.endpointId === endpointId);
      }
    }),
    {
      name: "cyberark-history",
      skipHydration: true,
      partialize: (state) => ({
        entries: state.entries,
        favorites: state.favorites
      })
    }
  )
);

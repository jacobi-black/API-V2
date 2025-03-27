"use client";

import { create } from "zustand";
import { CyberArkCredentials, CyberArkSession, AuthType } from "@/types/auth";

interface AuthState {
  // Données de session
  session: CyberArkSession | null;
  credentials: Omit<CyberArkCredentials, "password"> | null;
  isAuthenticated: boolean;
  authError: string | null;
  
  // Actions
  setSession: (session: CyberArkSession) => void;
  setCredentials: (credentials: Omit<CyberArkCredentials, "password">) => void;
  clearSession: () => void;
  setAuthError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // État initial
  session: null,
  credentials: null,
  isAuthenticated: false,
  authError: null,
  
  // Actions
  setSession: (session: CyberArkSession) => 
    set({ 
      session, 
      isAuthenticated: true, 
      authError: null 
    }),
    
  setCredentials: (credentials: Omit<CyberArkCredentials, "password">) => 
    set({ credentials }),
    
  clearSession: () => 
    set({ 
      session: null, 
      isAuthenticated: false 
    }),
    
  setAuthError: (error: string | null) => 
    set({ authError: error }),
}));

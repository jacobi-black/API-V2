"use client";

import { create } from "zustand";
import { CyberArkCredentials, CyberArkSession, AuthType } from "@/types/auth";

interface AuthState {
  // Données de session
  session: CyberArkSession | null;
  credentials: Omit<CyberArkCredentials, "password"> | null;
  isAuthenticated: boolean;
  authError: string | null;
  isAuthenticating: boolean;

  // Actions
  setSession: (session: CyberArkSession) => void;
  setCredentials: (credentials: Omit<CyberArkCredentials, "password">) => void;
  clearSession: () => void;
  setAuthError: (error: string | null) => void;
  setAuthenticating: (isAuthenticating: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // État initial
  session: null,
  credentials: null,
  isAuthenticated: false,
  authError: null,
  isAuthenticating: false,

  // Actions
  setSession: (session: CyberArkSession) =>
    set({
      session,
      isAuthenticated: true,
      authError: null,
    }),

  setCredentials: (credentials: Omit<CyberArkCredentials, "password">) => set({ credentials }),

  clearSession: () =>
    set({
      session: null,
      isAuthenticated: false,
    }),

  setAuthError: (error: string | null) => set({ authError: error }),

  setAuthenticating: (isAuthenticating: boolean) => set({ isAuthenticating }),
}));

// S'authentifier avec CyberArk
const login = async (credentials: CyberArkCredentials): Promise<boolean> => {
  try {
    useAuthStore.getState().setAuthenticating(true);
    useAuthStore.getState().setAuthError(null);

    // Déterminer le endpoint en fonction du type d'authentification
    const endpoint = getAuthEndpoint(credentials.authType || AuthType.CYBERARK);
    const requestBody = {
      username: credentials.username,
      password: credentials.password,
      concurrentSession: credentials.concurrentSession || false,
      ...(credentials.newPassword ? { newPassword: credentials.newPassword } : {}),
    };

    // Construire l'URL complète avec l'URL de base + endpoint
    const baseUrl = ensureTrailingSlash(credentials.baseUrl);
    const url = `${baseUrl}${endpoint}`;

    console.log("Tentative d'authentification à:", url);

    // Effectuer la requête
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Vérifier les erreurs HTTP
    if (!response.ok) {
      // Tentative de lire la réponse comme texte
      const errorText = await response.text();

      // Tentative de parser en JSON si possible
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { ErrorMessage: errorText };
      }

      throw new Error(
        errorData.ErrorMessage || `Erreur ${response.status}: ${response.statusText}`
      );
    }

    // Récupérer le token de la réponse
    const responseData = await response.text();

    console.log(
      "Réponse d'authentification reçue, longueur du token:",
      responseData.length,
      "début:",
      responseData.substring(0, 10)
    );

    // Calculer la date d'expiration (20 minutes par défaut)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 20);

    // Sauvegarder la session
    const session: CyberArkSession = {
      token: responseData.trim(), // Enlever les espaces ou retours à la ligne
      baseUrl: credentials.baseUrl,
      username: credentials.username,
      createdAt: new Date(),
      expiresAt,
    };

    // Log du token (sécurisé)
    console.log(
      "Token stocké, format:",
      `${session.token.substring(0, 10)}... (${session.token.length} caractères)`
    );

    // Mettre à jour l'état
    useAuthStore.getState().setSession(session);
    useAuthStore.getState().setAuthenticating(false);

    return true;
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    useAuthStore
      .getState()
      .setAuthError(error instanceof Error ? error.message : "Erreur inconnue");
    useAuthStore.getState().setAuthenticating(false);
    return false;
  }
};

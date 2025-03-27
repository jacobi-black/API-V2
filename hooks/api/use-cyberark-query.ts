"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { ApiRequestOptions, ApiRequestState } from "@/types/api";

export function useCyberArkQuery<T>(endpoint: string | null, options: ApiRequestOptions = {}) {
  const [state, setState] = useState<ApiRequestState>("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuthStore();

  // Fonction pour exécuter la requête
  const execute = async (customEndpoint?: string, customOptions?: ApiRequestOptions) => {
    // Utiliser l'endpoint personnalisé ou l'endpoint par défaut
    const targetEndpoint = customEndpoint || endpoint;

    // Combiner les options
    const mergedOptions = { ...options, ...customOptions };

    // Vérifier si un endpoint est défini
    if (!targetEndpoint) {
      setError("Aucun endpoint spécifié");
      setState("error");
      return { success: false, error: "Aucun endpoint spécifié" };
    }

    // Vérifier si l'utilisateur est authentifié
    if (!session?.token) {
      setError("Vous devez être authentifié pour effectuer cette requête");
      setState("error");
      return { success: false, error: "Non authentifié" };
    }

    try {
      setState("loading");
      setError(null);

      // Construire l'URL avec les paramètres de requête
      let url = `/api/cyberark/${targetEndpoint}`;

      // Ajouter les paramètres d'URL si nécessaire
      if (mergedOptions.params && Object.keys(mergedOptions.params).length > 0) {
        const searchParams = new URLSearchParams();

        Object.entries(mergedOptions.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
          }
        });

        const searchString = searchParams.toString();
        if (searchString) {
          url += `?${searchString}`;
        }
      }

      // Effectuer la requête
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session.token,
          ...mergedOptions.headers,
        },
        cache: mergedOptions.cache || "no-store",
      });

      // Récupérer d'abord la réponse sous forme de texte
      const responseText = await response.text();

      // Vérifier si la réponse ressemble à du HTML
      if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
        console.error("Réponse HTML reçue au lieu de JSON:", responseText.substring(0, 200));
        throw new Error(
          "Le serveur a répondu avec une page HTML. Vérifiez l'URL et l'authentification."
        );
      }

      // Essayer de parser le texte en JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (_parseError) {
        console.error("Erreur de parsing JSON:", responseText);
        throw new Error(
          `La réponse n'est pas un JSON valide: ${responseText.substring(0, 100)}...`
        );
      }

      if (!response.ok) {
        throw new Error(result.error || `Erreur ${response.status}`);
      }

      // Mettre à jour l'état avec les données
      setData(result.data);
      setState("success");

      return { success: true, data: result.data };
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Une erreur inconnue s'est produite";

      setError(errorMessage);
      setState("error");

      return { success: false, error: errorMessage };
    }
  };

  // Exécuter la requête automatiquement si autoExecute est activé
  useEffect(() => {
    if (endpoint && options.cache === "force-cache") {
      execute();
    }
  }, [endpoint, options.cache]);

  return {
    execute,
    data,
    error,
    isLoading: state === "loading",
    isSuccess: state === "success",
    isError: state === "error",
    isIdle: state === "idle",
    state,
  };
}

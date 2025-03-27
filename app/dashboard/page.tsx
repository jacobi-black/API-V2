import React from "react";
import { Suspense } from "react";
import { Skeleton } from "@/components/shared/ui/skeleton";

export default async function DashboardPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col gap-8">
        <h1 className="mb-6 text-3xl font-bold">CyberArk API Explorer</h1>

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardClient />
        </Suspense>
      </div>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full" />
        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  );
}

("use client");

import { useState } from "react";
import { useEndpointStore } from "@/store/endpoint.store";
import { useCyberArkQuery } from "@/hooks/api/use-cyberark-query";
import { useAuthStore } from "@/store/auth.store";
import { EndpointExplorer } from "@/components/features/endpoints/endpoint-explorer";
import { EndpointDetail } from "@/components/features/endpoints/endpoint-detail";
import { ResultsViewer } from "@/components/features/results/results-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";
import { LogIn } from "lucide-react";
import { Button } from "@/components/shared/ui/button";

function DashboardClient() {
  const { selectedEndpoint, selectedCategory, pathParams, queryParams } = useEndpointStore();
  const { session, isAuthenticated } = useAuthStore();
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { execute, isLoading } = useCyberArkQuery(null);

  // Fonction pour exécuter la requête
  const handleExecuteQuery = async () => {
    if (!selectedEndpoint || !isAuthenticated) return;

    // Déterminer la catégorie et l'endpoint pour la requête
    let endpointPath = selectedEndpoint.category;

    // Remplacer les paramètres de chemin s'il y en a
    let pathWithParams = selectedEndpoint.path;

    // Vérification des paramètres obligatoires
    let missingParams = false;
    let missingParamName = "";

    // Vérifier les paramètres de chemin requis
    if (selectedEndpoint.pathParams) {
      for (const param of selectedEndpoint.pathParams) {
        if (param.required && (!pathParams[param.name] || pathParams[param.name].trim() === "")) {
          missingParams = true;
          missingParamName = param.name;
          break;
        }

        // Remplacer le paramètre dans le chemin
        pathWithParams = pathWithParams.replace(`{${param.name}}`, pathParams[param.name]);
      }
    }

    if (missingParams) {
      setError(`Paramètre obligatoire manquant : ${missingParamName}`);
      return;
    }

    // Construire l'endpoint final
    if (pathWithParams.includes("/")) {
      const segments = pathWithParams.split("/").filter(Boolean);
      endpointPath = segments.join("/");
    }

    // Ajouter l'URL de base aux paramètres
    const params = {
      ...queryParams,
      baseUrl: session?.baseUrl || "",
    };

    try {
      setError(null);
      const result = await execute(endpointPath, { params });

      if (result.success && result.data) {
        setResults(result.data);
      } else {
        setError(result.error || "Erreur inconnue");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inconnue");
    }
  };

  // Réinitialiser les résultats
  const resetResults = () => {
    setResults(null);
    setError(null);
  };

  // Afficher un message d'invitation à la connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Connexion requise
          </CardTitle>
          <CardDescription>
            Pour accéder au tableau de bord et explorer les API CyberArk, veuillez vous connecter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Utilisez le bouton "Se connecter" en haut à droite de l'écran pour saisir vos
            identifiants CyberArk.
          </p>
          <p>
            Une fois connecté, vous pourrez explorer et tester les endpoints API, visualiser les
            réponses et gérer vos requêtes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        {!selectedEndpoint ? (
          <EndpointExplorer />
        ) : (
          <EndpointDetail
            onExecute={handleExecuteQuery}
            onReset={resetResults}
            isLoading={isLoading}
          />
        )}
      </div>

      <div>
        <ResultsViewer
          data={results}
          error={error}
          isLoading={isLoading}
          onRetry={handleExecuteQuery}
        />
      </div>
    </div>
  );
}

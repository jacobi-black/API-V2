"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/tabs";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Database, ExternalLink, Unlock } from "lucide-react";
import Link from "next/link";

type EndpointInfo = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  requiresAuth: boolean;
  parameters?: {
    query?: { name: string; description: string; required: boolean }[];
    path?: { name: string; description: string }[];
  };
};

export function AvailableEndpoints() {
  const [endpoints, setEndpoints] = useState<EndpointInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Grouper les endpoints par catégorie
  const categorizedEndpoints = React.useMemo(() => {
    const categories: Record<string, EndpointInfo[]> = {
      auth: [],
      accounts: [],
      safes: [],
      users: [],
      groups: [],
      platforms: [],
      system: [],
      meta: [],
    };

    endpoints.forEach((endpoint) => {
      const path = endpoint.path.split("/");
      if (path.length >= 3) {
        const category = path[2]; // /api/cyberark/[category]
        if (categories[category]) {
          categories[category].push(endpoint);
        } else {
          categories["meta"].push(endpoint);
        }
      }
    });

    return categories;
  }, [endpoints]);

  useEffect(() => {
    async function loadEndpoints() {
      try {
        setLoading(true);
        const response = await fetch("/api/cyberark/meta/endpoints");

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des endpoints");
        }

        const data = await response.json();

        if (data.success && data.data.endpoints) {
          setEndpoints(data.data.endpoints);
        } else {
          throw new Error(data.error || "Erreur inconnue");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    loadEndpoints();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des endpoints API disponibles...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Impossible de charger les endpoints API : {error}</p>
        </CardContent>
      </Card>
    );
  }

  const categoryNames: Record<string, string> = {
    auth: "Authentification",
    accounts: "Comptes",
    safes: "Coffres",
    users: "Utilisateurs",
    groups: "Groupes",
    platforms: "Plateformes",
    system: "Santé système",
    meta: "Métadonnées",
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          <CardTitle>Endpoints API disponibles</CardTitle>
        </div>
        <CardDescription>
          Voici tous les endpoints API que vous pouvez utiliser avec CyberArk API Explorer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="auth" className="w-full">
          <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-4">
            {Object.keys(categorizedEndpoints).map(
              (category) =>
                categorizedEndpoints[category].length > 0 && (
                  <TabsTrigger key={category} value={category}>
                    {categoryNames[category]}
                  </TabsTrigger>
                )
            )}
          </TabsList>

          {Object.keys(categorizedEndpoints).map(
            (category) =>
              categorizedEndpoints[category].length > 0 && (
                <TabsContent key={category} value={category}>
                  <div className="space-y-4">
                    {categorizedEndpoints[category].map((endpoint, index) => (
                      <div key={index} className="rounded-md border p-4 hover:border-primary">
                        <div className="mb-2 flex w-full items-center gap-3 text-left">
                          <Badge variant={endpoint.requiresAuth ? "default" : "outline"}>
                            {endpoint.method}
                          </Badge>
                          <span className="font-mono text-sm">{endpoint.path}</span>
                          {!endpoint.requiresAuth && (
                            <Badge variant="secondary" className="ml-auto flex gap-1">
                              <Unlock className="h-3 w-3" />
                              Sans auth
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-3 pl-2">
                          <div>
                            <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                          </div>

                          {endpoint.parameters && (
                            <>
                              {endpoint.parameters.path && endpoint.parameters.path.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium">Paramètres de chemin :</p>
                                  <ul className="ml-4 list-disc text-xs text-muted-foreground">
                                    {endpoint.parameters.path.map((param, idx) => (
                                      <li key={idx}>
                                        <span className="font-mono">{param.name}</span> -{" "}
                                        {param.description}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {endpoint.parameters.query &&
                                endpoint.parameters.query.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium">Paramètres de requête :</p>
                                    <ul className="ml-4 list-disc text-xs text-muted-foreground">
                                      {endpoint.parameters.query.map((param, idx) => (
                                        <li key={idx}>
                                          <span className="font-mono">{param.name}</span>
                                          {param.required && (
                                            <span className="text-destructive">*</span>
                                          )}{" "}
                                          - {param.description}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )
          )}
        </Tabs>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground">
            Pour utiliser ces endpoints, vous devez être connecté à votre instance CyberArk. Les
            endpoints marqués{" "}
            <Badge variant="secondary" className="mx-1">
              Sans auth
            </Badge>
            sont accessibles sans authentification.
          </p>
          <div className="mt-4">
            <Link href="/dashboard" passHref>
              <Button className="w-full">
                Commencer à explorer <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

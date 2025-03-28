"use client";

import React from "react";
import { useEndpointStore } from "@/store/endpoint.store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import { EndpointParamsForm } from "./endpoint-params";
import { ArrowLeft, Play } from "lucide-react";

export interface EndpointDetailProps {
  onExecute?: () => void;
  onReset?: () => void;
  isLoading?: boolean;
}

export function EndpointDetail({ onExecute, onReset, isLoading }: EndpointDetailProps) {
  const { selectedEndpoint, resetSelectedEndpoint, resetParams } = useEndpointStore();

  if (!selectedEndpoint) {
    return null;
  }

  // Fonction pour gérer le retour à la liste des endpoints
  const handleBack = () => {
    resetSelectedEndpoint();
  };

  // Fonction pour réinitialiser les paramètres
  const handleReset = () => {
    resetParams();
    if (onReset) {
      onReset();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <Button variant="ghost" size="sm" onClick={handleBack} className="-ml-2 mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Retour
            </Button>
            <CardTitle>{selectedEndpoint.name}</CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline" className="mr-2 font-mono">
                {selectedEndpoint.fullPath}
              </Badge>
              {selectedEndpoint.category && (
                <Badge variant="secondary">{selectedEndpoint.category}</Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">{selectedEndpoint.description}</p>
        </div>

        <div className="mb-6 rounded-md bg-secondary/50 p-4">
          <h3 className="mb-2 text-sm font-medium">Requête API</h3>
          <div className="overflow-auto rounded bg-background p-2 font-mono text-xs">
            {selectedEndpoint.fullPath}
          </div>
        </div>

        <EndpointParamsForm endpoint={selectedEndpoint} />
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0">
        <Button variant="outline" onClick={handleReset}>
          Réinitialiser
        </Button>
        <Button onClick={onExecute} disabled={isLoading}>
          <Play className="mr-2 h-4 w-4" />
          {isLoading ? "Chargement..." : "Exécuter"}
        </Button>
      </CardFooter>
    </Card>
  );
}

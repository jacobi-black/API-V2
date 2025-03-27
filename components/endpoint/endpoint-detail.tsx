"use client";

import React from "react";
import { useEndpointStore } from "@/store/endpoint.store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EndpointParamsForm } from "./endpoint-params";
import { ArrowLeft, Play } from "lucide-react";

export interface EndpointDetailProps {
  onExecute?: () => void;
  onReset?: () => void;
  isLoading?: boolean;
}

export function EndpointDetail({ onExecute, onReset, isLoading }: EndpointDetailProps) {
  const { 
    selectedEndpoint, 
    selectedCategory,
    selectCategory,
    resetParams
  } = useEndpointStore();

  if (!selectedEndpoint) {
    return null;
  }

  // Fonction pour gérer le retour à la liste des endpoints
  const handleBack = () => {
    if (selectedCategory) {
      selectCategory(selectedCategory);
    }
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
        <div className="flex justify-between items-start">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <CardTitle>{selectedEndpoint.name}</CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline" className="font-mono mr-2">
                {selectedEndpoint.fullPath}
              </Badge>
              {selectedEndpoint.category && (
                <Badge variant="secondary">
                  {selectedEndpoint.category}
                </Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">{selectedEndpoint.description}</p>
        </div>
        
        <div className="bg-secondary/50 p-4 rounded-md mb-6">
          <h3 className="text-sm font-medium mb-2">Requête API</h3>
          <div className="font-mono text-xs bg-background p-2 rounded overflow-auto">
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
          <Play className="h-4 w-4 mr-2" />
          {isLoading ? "Chargement..." : "Exécuter"}
        </Button>
      </CardFooter>
    </Card>
  );
}

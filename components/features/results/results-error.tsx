"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shared/ui/card";
import { Button } from '@/components/shared/ui/button";
import { RefreshCw } from "lucide-react";

export interface ResultsErrorProps {
  error: string;
  onRetry?: () => void;
}

export function ResultsError({ error, onRetry }: ResultsErrorProps) {
  // Analyser le code d'erreur potentiel
  const errorMatch = error.match(/Erreur (\d+)/);
  const errorCode = errorMatch ? parseInt(errorMatch[1]) : null;
  
  // Déterminer le type d'erreur
  let errorType = "Erreur inconnue";
  let errorDescription = "Une erreur s'est produite lors de la requête";
  
  if (errorCode) {
    switch (errorCode) {
      case 400:
        errorType = "Requête invalide";
        errorDescription = "La requête est mal formée ou contient des paramètres invalides";
        break;
      case 401:
        errorType = "Non autorisé";
        errorDescription = "Authentification requise ou session expirée";
        break;
      case 403:
        errorType = "Accès refusé";
        errorDescription = "Vous n'avez pas les droits nécessaires pour accéder à cette ressource";
        break;
      case 404:
        errorType = "Ressource introuvable";
        errorDescription = "La ressource demandée n'existe pas";
        break;
      case 500:
        errorType = "Erreur serveur";
        errorDescription = "Une erreur est survenue sur le serveur";
        break;
      case 502:
        errorType = "Erreur de passerelle";
        errorDescription = "Erreur de communication avec l'API CyberArk";
        break;
      case 504:
        errorType = "Délai d'attente dépassé";
        errorDescription = "La requête a pris trop de temps à s'exécuter";
        break;
      default:
        errorType = `Erreur ${errorCode}`;
        errorDescription = "Une erreur s'est produite lors de la requête";
        break;
    }
  }
  
  // Suggestions selon le type d'erreur
  let suggestions: string[] = [];
  
  if (errorCode) {
    switch (errorCode) {
      case 400:
        suggestions = [
          "Vérifiez les paramètres de votre requête",
          "Assurez-vous que les formats des valeurs sont corrects"
        ];
        break;
      case 401:
        suggestions = [
          "Reconnectez-vous à l'API",
          "Votre session a peut-être expiré"
        ];
        break;
      case 403:
        suggestions = [
          "Vérifiez que votre compte a les permissions nécessaires",
          "Contactez un administrateur pour obtenir les droits d'accès"
        ];
        break;
      case 404:
        suggestions = [
          "Vérifiez que l'identifiant de la ressource est correct",
          "La ressource a peut-être été supprimée"
        ];
        break;
      case 500:
      case 502:
      case 504:
        suggestions = [
          "Réessayez plus tard",
          "Vérifiez l'état du serveur CyberArk",
          "Contactez l'administrateur système si le problème persiste"
        ];
        break;
      default:
        suggestions = [
          "Essayez de rafraîchir la page",
          "Vérifiez votre connexion internet"
        ];
        break;
    }
  } else {
    suggestions = [
      "Vérifiez votre connexion internet",
      "Assurez-vous que l'URL de l'API est correcte",
      "Réessayez plus tard"
    ];
  }

  return (
    <Card className="w-full border-destructive/50">
      <CardHeader className="bg-destructive/10">
        <CardTitle className="text-destructive">{errorType}</CardTitle>
        <CardDescription>{errorDescription}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Message d'erreur :</h3>
          <div className="p-3 bg-muted rounded-md text-sm font-mono whitespace-pre-wrap">
            {error}
          </div>
        </div>
        
        {suggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Suggestions :</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      {onRetry && (
        <CardFooter className="border-t bg-muted/50 flex justify-end gap-2">
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

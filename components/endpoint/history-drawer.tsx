"use client";

import React from "react";
import { useHistoryStore, HistoryEntry } from "@/store/history.store";
import { useEndpointStore } from "@/store/endpoint.store";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, SearchIcon, Trash2Icon, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface HistoryDrawerProps {
  onSelectEntry?: (entry: HistoryEntry) => void;
}

export function HistoryDrawer({ onSelectEntry }: HistoryDrawerProps) {
  const { entries, clearHistory, removeEntry } = useHistoryStore();
  const { selectCategory, selectEndpoint } = useEndpointStore();
  const [open, setOpen] = React.useState(false);
  
  // Fonction pour charger une entrée d'historique
  const handleSelectEntry = (entry: HistoryEntry) => {
    // Sélectionner la catégorie
    selectCategory(entry.category);
    
    // Puis sélectionner l'endpoint
    selectEndpoint(entry.endpoint);
    
    // Informer le parent (pour recharger les données)
    if (onSelectEntry) {
      onSelectEntry(entry);
    }
    
    // Fermer le drawer
    setOpen(false);
  };
  
  // Si pas d'historique, ne rien afficher
  if (entries.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled>
        <ClockIcon className="h-4 w-4 mr-1" />
        Historique
      </Button>
    );
  }
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Historique</span>
          <Badge variant="secondary" className="ml-1">{entries.length}</Badge>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Historique des requêtes</SheetTitle>
          <SheetDescription>
            Vos requêtes récentes sont sauvegardées jusqu'à ce que vous fermiez l'application.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex justify-end mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => clearHistory()}
            className="text-muted-foreground"
          >
            <Trash2Icon className="h-4 w-4 mr-1" />
            Effacer l'historique
          </Button>
        </div>
        
        <div className="mt-4 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
          {entries.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Aucun historique de requête disponible.
            </div>
          ) : (
            entries.map((entry) => (
              <HistoryEntryCard 
                key={entry.id} 
                entry={entry} 
                onSelect={handleSelectEntry}
                onRemove={removeEntry}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface HistoryEntryCardProps {
  entry: HistoryEntry;
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
}

function HistoryEntryCard({ entry, onSelect, onRemove }: HistoryEntryCardProps) {
  // Formater le chemin avec les paramètres
  const formattedPath = React.useMemo(() => {
    let path = entry.path;
    
    // Remplacer les paramètres de chemin
    if (entry.pathParams) {
      Object.entries(entry.pathParams).forEach(([key, value]) => {
        path = path.replace(`{${key}}`, value);
      });
    }
    
    return path;
  }, [entry.path, entry.pathParams]);
  
  return (
    <div className="border rounded-md p-3 hover:bg-accent/10 transition-colors">
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium truncate">{entry.category} - {formattedPath}</div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => onSelect(entry)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="sr-only">Réexécuter</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground" 
            onClick={() => onRemove(entry.id)}
          >
            <Trash2Icon className="h-3.5 w-3.5" />
            <span className="sr-only">Supprimer</span>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <span>{formatDate(entry.timestamp)}</span>
        <span>•</span>
        <span>{entry.responseTime}ms</span>
        <span>•</span>
        <Badge variant={entry.success ? "secondary" : "destructive"} className="text-[10px] px-1 py-0">
          {entry.success ? "Succès" : "Échec"}
        </Badge>
      </div>
      
      {entry.resultCount !== undefined && (
        <div className="text-xs flex items-center gap-1 text-muted-foreground">
          <SearchIcon className="h-3 w-3" />
          <span>{entry.resultCount} résultat{entry.resultCount !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  );
}

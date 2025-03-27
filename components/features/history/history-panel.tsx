"use client";

import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/shared/ui/sheet";
import { Button } from '@/components/shared/ui/button";
import { Input } from '@/components/shared/ui/input";
import { Badge } from '@/components/shared/ui/badge";
import { Clock, Search, Star, StarOff, Trash2, RotateCw } from "lucide-react";
import { useHistoryStore } from "@/store/history.store";
import { useEndpointStore } from "@/store/endpoint.store";
import { formatDate } from '@/lib/utils/utils";

export function HistoryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const { entries, favorites, toggleFavorite, removeEntry, clearHistory } = useHistoryStore();
  const { selectEndpoint } = useEndpointStore();
  
  // Filtrer les entrées
  const filteredEntries = entries.filter(entry => {
    // Filtrer par favoris si nécessaire
    if (showFavoritesOnly && !favorites.includes(entry.id)) {
      return false;
    }
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        entry.endpointName.toLowerCase().includes(searchLower) ||
        entry.category.toLowerCase().includes(searchLower) ||
        entry.path.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Sélectionner un endpoint à partir de l'historique
  const handleSelectHistoryItem = (entry: any) => {
    selectEndpoint(entry.endpointId);
    setIsOpen(false);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Clock className="h-5 w-5" />
          {entries.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
              {entries.length > 99 ? "99+" : entries.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <SheetTitle>Historique des requêtes</SheetTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-muted-foreground"
              onClick={() => clearHistory()}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span className="text-xs">Effacer</span>
            </Button>
          </div>
        </SheetHeader>
        
        <div className="p-6 pt-2 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="icon"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="h-10 w-10"
            >
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="px-6 overflow-y-auto h-[calc(100vh-150px)]">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {entries.length === 0 
                ? "Aucune requête dans l'historique" 
                : "Aucune requête ne correspond à votre recherche"}
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {filteredEntries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="border rounded-lg p-3 hover:bg-accent/40 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-medium text-sm">{entry.endpointName}</h3>
                      <p className="text-xs font-mono text-muted-foreground truncate max-w-[350px]">
                        {entry.path}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(entry.id);
                        }}
                      >
                        {favorites.includes(entry.id) ? (
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        ) : (
                          <StarOff className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEntry(entry.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] h-5">
                        {entry.category}
                      </Badge>
                      {entry.success ? (
                        <Badge className="bg-green-500 text-[10px] h-5">
                          Succès
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px] h-5">
                          Échec
                        </Badge>
                      )}
                      {entry.resultCount !== undefined && entry.resultCount > 0 && (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {entry.resultCount} résultat{entry.resultCount > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => handleSelectHistoryItem(entry)}
                    >
                      <RotateCw className="h-3 w-3 mr-1" />
                      Réutiliser
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

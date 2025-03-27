"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shared/ui/sheet";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Badge } from "@/components/shared/ui/badge";
import { Clock, Search, Star, StarOff, Trash2, RotateCw } from "lucide-react";
import { useHistoryStore } from "@/store/history.store";
import { useEndpointStore } from "@/store/endpoint.store";
import { formatDate } from "@/lib/utils/utils";

export function HistoryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { entries, favorites, toggleFavorite, removeEntry, clearHistory } = useHistoryStore();
  const { selectEndpoint } = useEndpointStore();

  // Filtrer les entrées
  const filteredEntries = entries.filter((entry) => {
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
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-[10px]">
              {entries.length > 99 ? "99+" : entries.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] p-0 sm:w-[540px]">
        <SheetHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <SheetTitle>Historique des requêtes</SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
              onClick={() => clearHistory()}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              <span className="text-xs">Effacer</span>
            </Button>
          </div>
        </SheetHeader>

        <div className="p-6 pb-0 pt-2">
          <div className="mb-4 flex items-center gap-2">
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

        <div className="h-[calc(100vh-150px)] overflow-y-auto px-6">
          {filteredEntries.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {entries.length === 0
                ? "Aucune requête dans l'historique"
                : "Aucune requête ne correspond à votre recherche"}
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent/40"
                >
                  <div className="mb-1 flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{entry.endpointName}</h3>
                      <p className="max-w-[350px] truncate font-mono text-xs text-muted-foreground">
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

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="h-5 text-[10px]">
                        {entry.category}
                      </Badge>
                      {entry.success ? (
                        <Badge className="h-5 bg-green-500 text-[10px]">Succès</Badge>
                      ) : (
                        <Badge variant="destructive" className="h-5 text-[10px]">
                          Échec
                        </Badge>
                      )}
                      {entry.resultCount !== undefined && entry.resultCount > 0 && (
                        <Badge variant="secondary" className="h-5 text-[10px]">
                          {entry.resultCount} résultat{entry.resultCount > 1 ? "s" : ""}
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
                      <RotateCw className="mr-1 h-3 w-3" />
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

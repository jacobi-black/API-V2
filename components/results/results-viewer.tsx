"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Copy, Search } from "lucide-react";
import { useEndpointStore } from "@/store/endpoint.store";
import { ResultsError } from "./results-error";
import { ResultsSkeleton } from "./results-skeleton";
import { ResultsPagination } from "./results-pagination";
import { ResultsExport } from "./results-export";

export interface ResultsViewerProps {
  data: any;
  error?: string | null;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function ResultsViewer({ data, error, isLoading, onRetry }: ResultsViewerProps) {
  const [activeTab, setActiveTab] = useState("json");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { selectedEndpoint } = useEndpointStore();

  // Si chargement, afficher le skeleton
  if (isLoading) {
    return <ResultsSkeleton />;
  }

  // Si erreur, afficher le composant d'erreur
  if (error) {
    return <ResultsError error={error} onRetry={onRetry} />;
  }

  // Si pas de données, afficher un message
  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Résultats</CardTitle>
          <CardDescription>
            {selectedEndpoint 
              ? "Exécutez une requête pour voir les résultats" 
              : "Sélectionnez un endpoint pour effectuer une requête"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground min-h-[200px] flex items-center justify-center">
          <p>Aucune donnée à afficher</p>
        </CardContent>
      </Card>
    );
  }

  const toggleNodeExpansion = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const copyToClipboard = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2))
        .then(() => {
          // On pourrait ajouter un toast ici pour confirmer
          console.log("Copié dans le presse-papier");
        })
        .catch(err => {
          console.error("Erreur de copie:", err);
        });
    }
  };

  // Déterminer si les données sont un tableau
  const isArray = Array.isArray(data);
  
  // Préparation des données pour la pagination
  const { paginatedData, totalItems } = useMemo(() => {
    if (!isArray) {
      return { paginatedData: data, totalItems: 1 };
    }
    
    // Filtrer par terme de recherche si nécessaire
    const filteredData = searchTerm
      ? data.filter((item: any) => 
          Object.values(item).some((value: any) => 
            value !== null && 
            value !== undefined && 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : data;
    
    // Calculer la pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataPage = filteredData.slice(startIndex, endIndex);
    
    return { paginatedData: dataPage, totalItems: filteredData.length };
  }, [data, isArray, searchTerm, currentPage, pageSize]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Résultats</CardTitle>
            <CardDescription>
              {isArray 
                ? `${totalItems} élément${totalItems > 1 ? 's' : ''} trouvé${totalItems > 1 ? 's' : ''}`
                : "Données récupérées avec succès"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-1" />
              Copier
            </Button>
            <ResultsExport 
              data={data} 
              isArray={isArray} 
              endpointName={selectedEndpoint?.id || "results"}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="json" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-2">
            <TabsList>
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="table" disabled={!isArray}>Tableau</TabsTrigger>
              <TabsTrigger value="raw">Brut</TabsTrigger>
            </TabsList>
            
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher dans les données" 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Réinitialiser la page lors d'une nouvelle recherche
                }}
              />
            </div>
          </div>
          
          <TabsContent value="json" className="mt-2">
            <div className="bg-background p-4 rounded-md border overflow-auto max-h-[600px]">
              <JsonTree 
                data={isArray ? paginatedData : data}
                expandedNodes={expandedNodes} 
                toggleNodeExpansion={toggleNodeExpansion}
                path=""
                searchTerm={searchTerm}
              />
            </div>
            
            {isArray && (
              <ResultsPagination
                currentPage={currentPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            )}
          </TabsContent>
          
          <TabsContent value="table" className="mt-2">
            {isArray ? (
              <>
                <div className="overflow-auto max-h-[600px]">
                  <JsonTable 
                    data={paginatedData} 
                    searchTerm={searchTerm} 
                  />
                </div>
                
                <ResultsPagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                L'affichage tableau n'est disponible que pour les données de type tableau.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="raw" className="mt-2">
            <div className="bg-background p-4 rounded-md border overflow-auto max-h-[600px]">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {JSON.stringify(isArray ? paginatedData : data, null, 2)}
              </pre>
            </div>
            
            {isArray && (
              <ResultsPagination
                currentPage={currentPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface JsonTreeProps {
  data: any;
  expandedNodes: Set<string>;
  toggleNodeExpansion: (path: string) => void;
  path: string;
  searchTerm: string;
  level?: number;
}

function JsonTree({ 
  data, 
  expandedNodes, 
  toggleNodeExpansion, 
  path, 
  searchTerm,
  level = 0 
}: JsonTreeProps) {
  if (data === null || data === undefined) {
    return <span className="text-muted-foreground">null</span>;
  }

  // Si c'est une valeur primitive, afficher directement
  if (typeof data !== 'object') {
    return <span className={typeof data === 'string' ? "text-green-600" : "text-blue-600"}>
      {typeof data === 'string' ? `"${data}"` : String(data)}
    </span>;
  }

  // Vérifier si c'est un tableau ou un objet
  const isArray = Array.isArray(data);
  const isEmpty = Object.keys(data).length === 0;
  
  if (isEmpty) {
    return <span>{isArray ? "[]" : "{}"}</span>;
  }

  const currentPath = path || "root";
  const isExpanded = expandedNodes.has(currentPath);
  
  // Fonction pour vérifier si un nœud correspond au terme de recherche
  const matchesSearch = (key: string, value: any): boolean => {
    if (!searchTerm) return false;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Vérifier si la clé correspond
    if (key.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Vérifier si la valeur correspond (si c'est une chaîne ou un nombre)
    if (typeof value === 'string' && value.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    if (typeof value === 'number' && String(value).includes(searchTerm)) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="pl-4 border-l border-border">
      <div 
        className={`flex items-center cursor-pointer hover:bg-accent/30 rounded py-0.5 -ml-4 pl-2 ${matchesSearch("", data) ? "bg-yellow-100/50 dark:bg-yellow-900/30" : ""}`}
        onClick={() => toggleNodeExpansion(currentPath)}
      >
        <span className="mr-1">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
        <span className="font-mono text-xs">
          {isArray 
            ? `Array(${Object.keys(data).length})` 
            : `Object {${Object.keys(data).length}}`}
        </span>
      </div>
      
      {isExpanded && (
        <div className="ml-2">
          {Object.entries(data).map(([key, value], index) => {
            const childPath = `${currentPath}.${key}`;
            const isMatch = matchesSearch(key, value);
            
            return (
              <div 
                key={childPath} 
                className={`my-1 ${isMatch ? "bg-yellow-100/50 dark:bg-yellow-900/30 rounded px-1" : ""}`}
              >
                <div className="flex">
                  <span className="text-xs font-mono mr-2 text-muted-foreground">
                    {isArray ? index : key}:
                  </span>
                  <div className="flex-1">
                    <JsonTree 
                      data={value}
                      expandedNodes={expandedNodes}
                      toggleNodeExpansion={toggleNodeExpansion}
                      path={childPath}
                      searchTerm={searchTerm}
                      level={level + 1}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface JsonTableProps {
  data: any[];
  searchTerm: string;
}

function JsonTable({ data, searchTerm }: JsonTableProps) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">Aucune donnée à afficher</div>;
  }

  // Extraire les colonnes à partir des clés du premier élément
  const firstItem = data[0];
  const columns = Object.keys(firstItem);

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-secondary/50">
            {columns.map(column => (
              <th key={column} className="text-left p-2 text-sm font-medium text-muted-foreground border">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-accent/30">
              {columns.map(column => (
                <td key={`${index}-${column}`} className="p-2 text-sm border">
                  {renderTableCell(item[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center p-4 text-muted-foreground">
          Aucun résultat ne correspond à votre recherche.
        </div>
      )}
    </div>
  );
}

// Fonction pour rendre une cellule de tableau
function renderTableCell(value: any): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">null</span>;
  }

  if (typeof value === 'object') {
    return <span className="text-muted-foreground">{JSON.stringify(value)}</span>;
  }

  if (typeof value === 'boolean') {
    return <span>{value ? 'true' : 'false'}</span>;
  }

  return <span>{String(value)}</span>;
}

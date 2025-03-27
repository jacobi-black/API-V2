"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileJson, FileText, Settings } from "lucide-react";
import { exportToCsv, CsvExportOptions } from "@/lib/export/csv-export";
import { exportToJson, JsonExportOptions } from "@/lib/export/json-export";

export interface ResultsExportProps {
  data: any;
  isArray?: boolean;
  endpointName?: string;
}

export function ResultsExport({ data, isArray, endpointName }: ResultsExportProps) {
  const [exportType, setExportType] = useState<"csv" | "json">("json");
  const [open, setOpen] = useState(false);
  const [filename, setFilename] = useState(() => {
    const date = new Date().toISOString().slice(0, 10);
    return `cyberark-${endpointName || "export"}-${date}`;
  });
  
  // Options CSV
  const [csvIncludeHeaders, setCsvIncludeHeaders] = useState(true);
  const [csvDelimiter, setCsvDelimiter] = useState(",");
  const [csvFields, setCsvFields] = useState<string[]>([]);
  const [csvFieldsFilterType, setCsvFieldsFilterType] = useState<"include" | "exclude">("include");
  
  // Options JSON
  const [jsonPrettyPrint, setJsonPrettyPrint] = useState(true);
  const [jsonIndent, setJsonIndent] = useState(2);
  const [jsonFields, setJsonFields] = useState<string[]>([]);
  const [jsonFieldsFilterType, setJsonFieldsFilterType] = useState<"include" | "exclude">("include");
  
  // Détection des champs disponibles
  const availableFields = useMemo(() => {
    if (!data) return [];
    
    const sampleData = Array.isArray(data) ? data[0] : data;
    return sampleData ? Object.keys(sampleData) : [];
  }, [data]);
  
  // Gestion des champs sélectionnés pour CSV
  const handleCsvFieldToggle = (field: string) => {
    setCsvFields(prev => 
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };
  
  // Gestion des champs sélectionnés pour JSON
  const handleJsonFieldToggle = (field: string) => {
    setJsonFields(prev => 
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };
  
  // Export rapide sans ouvrir la boîte de dialogue
  const handleQuickExport = () => {
    if (!data) return;
    
    const date = new Date().toISOString().slice(0, 10);
    const quickFilename = `cyberark-${endpointName || "export"}-${date}`;
    
    if (exportType === "csv") {
      exportToCsv(data, quickFilename);
    } else {
      exportToJson(data, quickFilename);
    }
  };
  
  // Export avec les options configurées
  const handleConfiguredExport = () => {
    if (!data) return;
    
    if (exportType === "csv") {
      const options: CsvExportOptions = {
        includeHeaders: csvIncludeHeaders,
        delimiter: csvDelimiter,
        fields: csvFieldsFilterType === "include" && csvFields.length > 0 
          ? csvFields 
          : csvFieldsFilterType === "exclude" 
            ? availableFields.filter(field => !csvFields.includes(field))
            : undefined
      };
      
      exportToCsv(data, filename, options);
    } else {
      const options: JsonExportOptions = {
        prettyPrint: jsonPrettyPrint,
        indent: jsonIndent,
        fields: jsonFieldsFilterType === "include" && jsonFields.length > 0
          ? jsonFields
          : jsonFieldsFilterType === "exclude"
            ? availableFields.filter(field => !jsonFields.includes(field))
            : undefined
      };
      
      exportToJson(data, filename, options);
    }
    
    setOpen(false);
  };
  
  // Si pas de données, désactiver le bouton
  if (!data) {
    return (
      <Button disabled variant="outline" size="sm">
        <Download className="h-4 w-4 mr-1" />
        Exporter
      </Button>
    );
  }
  
  return (
    <div className="flex gap-2">
      <Select defaultValue={exportType} onValueChange={(value) => setExportType(value as "csv" | "json")}>
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="json">
            <div className="flex items-center">
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </div>
          </SelectItem>
          <SelectItem value="csv">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              CSV
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <Button variant="outline" size="sm" onClick={handleQuickExport}>
        <Download className="h-4 w-4 mr-1" />
        Exporter
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Options d'exportation</DialogTitle>
            <DialogDescription>
              Configurez les paramètres pour l'exportation de vos données.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue={exportType} onValueChange={(value) => setExportType(value as "csv" | "json")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="csv">CSV</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="filename">Nom du fichier</Label>
                <Input
                  id="filename"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="Nom du fichier (sans extension)"
                />
              </div>
            </div>
            
            <TabsContent value="json" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="jsonPrettyPrint"
                  checked={jsonPrettyPrint}
                  onCheckedChange={(checked) => setJsonPrettyPrint(checked === true)}
                />
                <Label htmlFor="jsonPrettyPrint">Formater le JSON (pretty print)</Label>
              </div>
              
              {jsonPrettyPrint && (
                <div>
                  <Label htmlFor="jsonIndent">Indentation</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="jsonIndent"
                      type="number"
                      min="1"
                      max="8"
                      value={jsonIndent}
                      onChange={(e) => setJsonIndent(parseInt(e.target.value) || 2)}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">espaces</span>
                  </div>
                </div>
              )}
              
              {isArray && availableFields.length > 0 && (
                <div className="space-y-2">
                  <Label>Filtrage des champs</Label>
                  <Select
                    value={jsonFieldsFilterType}
                    onValueChange={(value) => setJsonFieldsFilterType(value as "include" | "exclude")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de filtre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="include">Inclure uniquement</SelectItem>
                      <SelectItem value="exclude">Exclure</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="border rounded-md p-3 max-h-48 overflow-y-auto mt-2">
                    <div className="space-y-2">
                      {availableFields.map((field) => (
                        <div key={field} className="flex items-center space-x-2">
                          <Checkbox
                            id={`json-field-${field}`}
                            checked={jsonFields.includes(field)}
                            onCheckedChange={() => handleJsonFieldToggle(field)}
                          />
                          <Label htmlFor={`json-field-${field}`} className="text-sm font-normal">
                            {field}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="csv" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="csvIncludeHeaders"
                  checked={csvIncludeHeaders}
                  onCheckedChange={(checked) => setCsvIncludeHeaders(checked === true)}
                />
                <Label htmlFor="csvIncludeHeaders">Inclure les en-têtes de colonnes</Label>
              </div>
              
              <div>
                <Label htmlFor="csvDelimiter">Délimiteur</Label>
                <Select
                  value={csvDelimiter}
                  onValueChange={setCsvDelimiter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un délimiteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Virgule (,)</SelectItem>
                    <SelectItem value=";">Point-virgule (;)</SelectItem>
                    <SelectItem value="\t">Tabulation</SelectItem>
                    <SelectItem value="|">Pipe (|)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isArray && availableFields.length > 0 && (
                <div className="space-y-2">
                  <Label>Filtrage des champs</Label>
                  <Select
                    value={csvFieldsFilterType}
                    onValueChange={(value) => setCsvFieldsFilterType(value as "include" | "exclude")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de filtre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="include">Inclure uniquement</SelectItem>
                      <SelectItem value="exclude">Exclure</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="border rounded-md p-3 max-h-48 overflow-y-auto mt-2">
                    <div className="space-y-2">
                      {availableFields.map((field) => (
                        <div key={field} className="flex items-center space-x-2">
                          <Checkbox
                            id={`csv-field-${field}`}
                            checked={csvFields.includes(field)}
                            onCheckedChange={() => handleCsvFieldToggle(field)}
                          />
                          <Label htmlFor={`csv-field-${field}`} className="text-sm font-normal">
                            {field}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfiguredExport}>
              Exporter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

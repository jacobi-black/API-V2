"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportData, ExportFormat, canExportAsCsv, prepareExportData } from '@/lib/export/export-utils';
import { detectColumns } from '@/lib/export/csv-export';
import { Badge } from '@/components/ui/badge';

export interface ResultsExportProps {
  /**
   * Données à exporter
   */
  data: any;
  
  /**
   * Nom suggéré pour le fichier d'exportation
   */
  suggestedFileName?: string;
  
  /**
   * Désactiver le bouton si aucune donnée n'est disponible
   */
  disabled?: boolean;
}

export function ResultsExport({ data, suggestedFileName, disabled = false }: ResultsExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('json');
  const [fileName, setFileName] = useState(suggestedFileName || 'cyberark-export');
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [prettyPrint, setPrettyPrint] = useState(true);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [delimiter, setDelimiter] = useState(',');
  
  // Vérifier si l'export CSV est possible
  const csvExportable = canExportAsCsv(data);
  
  // Détecter les colonnes si les données sont exportables en CSV
  const detectedColumns = csvExportable ? detectColumns(data) : [];
  const [selectedColumns, setSelectedColumns] = useState<string[]>(detectedColumns);
  const [selectAllColumns, setSelectAllColumns] = useState(true);
  
  // Gérer la sélection/désélection de toutes les colonnes
  const handleSelectAllColumns = (checked: boolean) => {
    setSelectAllColumns(checked);
    if (checked) {
      setSelectedColumns(detectedColumns);
    } else {
      setSelectedColumns([]);
    }
  };
  
  // Gérer la sélection/désélection d'une colonne
  const handleColumnToggle = (column: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns(prev => [...prev, column]);
    } else {
      setSelectedColumns(prev => prev.filter(col => col !== column));
    }
    
    // Mettre à jour l'état "tout sélectionner"
    const allSelected = detectedColumns.every(col => 
      checked ? 
        [...selectedColumns, column].includes(col) : 
        selectedColumns.filter(c => c !== column).includes(col)
    );
    setSelectAllColumns(allSelected);
  };
  
  // Fonction pour exporter les données
  const handleExport = () => {
    try {
      const dataToExport = prepareExportData(data);
      
      const options = {
        format,
        fileName,
        includeTimestamp,
        csvOptions: {
          includeHeaders,
          delimiter,
          columns: selectedColumns
        },
        jsonOptions: {
          prettyPrint
        }
      };
      
      const result = exportData(dataToExport, options);
      result.download();
      
      // Fermer le dialogue
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      // Gérer l'erreur ici (afficher une notification, etc.)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsOpen(true)}
          disabled={disabled || !data}
        >
          <Download className="h-4 w-4 mr-1" />
          Exporter
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exporter les résultats</DialogTitle>
          <DialogDescription>
            Configurez les options d'exportation ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              Format
            </Label>
            <RadioGroup 
              id="format" 
              value={format} 
              onValueChange={(value) => setFormat(value as ExportFormat)}
              className="flex items-center space-x-4 col-span-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json">JSON</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="csv" 
                  id="csv" 
                  disabled={!csvExportable} 
                />
                <Label 
                  htmlFor="csv" 
                  className={!csvExportable ? "text-muted-foreground" : ""}
                >
                  CSV
                  {!csvExportable && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Non disponible
                    </Badge>
                  )}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fileName" className="text-right">
              Nom du fichier
            </Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right">
              <Label>Options</Label>
            </div>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeTimestamp" 
                  checked={includeTimestamp} 
                  onCheckedChange={(checked) => setIncludeTimestamp(checked === true)}
                />
                <Label htmlFor="includeTimestamp">
                  Inclure un horodatage
                </Label>
              </div>
              
              {format === 'json' && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="prettyPrint" 
                    checked={prettyPrint} 
                    onCheckedChange={(checked) => setPrettyPrint(checked === true)}
                  />
                  <Label htmlFor="prettyPrint">
                    Formatage JSON (pretty print)
                  </Label>
                </div>
              )}
              
              {format === 'csv' && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeHeaders" 
                      checked={includeHeaders} 
                      onCheckedChange={(checked) => setIncludeHeaders(checked === true)}
                    />
                    <Label htmlFor="includeHeaders">
                      Inclure les en-têtes de colonnes
                    </Label>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-2 mt-3">
                    <Label htmlFor="delimiter" className="text-right">
                      Délimiteur
                    </Label>
                    <Select 
                      value={delimiter} 
                      onValueChange={setDelimiter}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Délimiteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=",">Virgule (,)</SelectItem>
                        <SelectItem value=";">Point-virgule (;)</SelectItem>
                        <SelectItem value="\t">Tabulation</SelectItem>
                        <SelectItem value="|">Pipe (|)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {format === 'csv' && detectedColumns.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-2">
              <div className="text-right pt-2">
                <Label>Colonnes</Label>
              </div>
              <div className="col-span-3 border rounded-md p-3">
                <div className="flex items-center space-x-2 mb-3 pb-2 border-b">
                  <Checkbox 
                    id="selectAllColumns" 
                    checked={selectAllColumns} 
                    onCheckedChange={(checked) => handleSelectAllColumns(checked === true)}
                  />
                  <Label htmlFor="selectAllColumns" className="font-medium">
                    Sélectionner toutes les colonnes ({detectedColumns.length})
                  </Label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                  {detectedColumns.map(column => (
                    <div key={column} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`column-${column}`} 
                        checked={selectedColumns.includes(column)} 
                        onCheckedChange={(checked) => handleColumnToggle(column, checked === true)}
                      />
                      <Label 
                        htmlFor={`column-${column}`} 
                        className="text-sm truncate"
                        title={column}
                      >
                        {column}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4 mr-1" />
            Annuler
          </Button>
          <Button onClick={handleExport} disabled={format === 'csv' && selectedColumns.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            Exporter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

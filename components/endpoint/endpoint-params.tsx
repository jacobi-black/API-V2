"use client";

import React from "react";
import { Endpoint, EndpointParam, useEndpointStore } from "@/store/endpoint.store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface EndpointParamsFormProps {
  endpoint: Endpoint;
}

export function EndpointParamsForm({ endpoint }: EndpointParamsFormProps) {
  const { 
    pathParams, 
    queryParams, 
    setPathParam,
    setQueryParam
  } = useEndpointStore();

  // Combiner tous les paramètres en sections
  const sections = [
    {
      id: "path",
      title: "Paramètres de chemin",
      params: endpoint.pathParams || [],
      values: pathParams,
      setter: setPathParam,
      required: true
    },
    {
      id: "query",
      title: "Paramètres de requête",
      params: endpoint.queryParams || [],
      values: queryParams,
      setter: setQueryParam,
      required: false
    }
  ];

  // Filtrer les sections vides
  const nonEmptySections = sections.filter(section => section.params.length > 0);
  
  if (nonEmptySections.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Cet endpoint ne nécessite pas de paramètres.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {nonEmptySections.map(section => (
        <div key={section.id} className="space-y-4">
          <h3 className="text-sm font-medium mb-2">{section.title}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {section.params.map(param => (
              <ParamField
                key={param.name}
                param={param}
                value={section.values[param.name]}
                onChange={(value) => section.setter(param.name, value)}
                required={section.required && param.required}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ParamFieldProps {
  param: EndpointParam;
  value: any;
  onChange: (value: any) => void;
  required: boolean;
}

function ParamField({ param, value, onChange, required }: ParamFieldProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: string | number | boolean = e.target.value;
    
    // Convertir la valeur selon le type attendu
    if (param.type === "number") {
      newValue = e.target.value === "" ? "" : Number(e.target.value);
    }
    
    onChange(newValue);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(checked);
  };

  const handleSelectChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={param.name} className="flex justify-between">
        <span>
          {param.name}
          {required && <span className="text-destructive ml-1">*</span>}
        </span>
        <span className="text-xs text-muted-foreground">{param.type}</span>
      </Label>
      
      {param.description && (
        <p className="text-xs text-muted-foreground mb-1">{param.description}</p>
      )}
      
      {param.type === "boolean" ? (
        <Checkbox 
          id={param.name}
          checked={value === true}
          onCheckedChange={handleCheckboxChange}
        />
      ) : param.options && param.options.length > 0 ? (
        <Select 
          value={String(value || "")} 
          onValueChange={handleSelectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une option" />
          </SelectTrigger>
          <SelectContent>
            {param.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={param.name}
          value={value || ""}
          onChange={handleInputChange}
          placeholder={param.example || `Entrer ${param.name}`}
          type={param.type === "number" ? "number" : "text"}
        />
      )}
    </div>
  );
}

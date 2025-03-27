"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface JsonTreeProps {
  data: any;
  level?: number;
  expandAll?: boolean;
  initialExpanded?: boolean;
}

export function JsonTree({ 
  data, 
  level = 0,
  expandAll = false,
  initialExpanded = false,
}: JsonTreeProps) {
  const [isExpanded, setIsExpanded] = useState(expandAll || initialExpanded || level < 1);
  
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

  return (
    <div className="pl-4 border-l border-border">
      <div 
        className="flex items-center cursor-pointer hover:bg-accent/30 rounded py-0.5 -ml-4 pl-2"
        onClick={() => setIsExpanded(!isExpanded)}
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
          {Object.entries(data).map(([key, value], index) => (
            <div key={`${level}-${key}-${index}`} className="my-1">
              <div className="flex">
                <span className="text-xs font-mono mr-2 text-muted-foreground">
                  {isArray ? index : key}:
                </span>
                <div className="flex-1">
                  <JsonTree 
                    data={value}
                    level={level + 1}
                    expandAll={expandAll}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

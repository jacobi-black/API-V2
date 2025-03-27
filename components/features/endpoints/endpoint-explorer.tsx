"use client";

import React from "react";
import { useEndpointStore } from "@/store/endpoint.store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/tabs";

export function EndpointExplorer() {
  const { categories, selectedCategory, selectCategory } = useEndpointStore();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Explorateur d'API CyberArk</CardTitle>
        <CardDescription>Parcourez et explorez les différentes API disponibles</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={selectedCategory || categories[0]?.id}
          onValueChange={selectCategory}
          className="w-full"
        >
          <TabsList className="mb-4 grid grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.endpoints.length > 0 ? (
                  category.endpoints.map((endpoint) => (
                    <EndpointCard
                      key={endpoint.id}
                      id={endpoint.id}
                      name={endpoint.name}
                      description={endpoint.description}
                      path={endpoint.fullPath}
                    />
                  ))
                ) : (
                  <div className="col-span-full p-6 text-center text-muted-foreground">
                    Cette catégorie sera disponible prochainement.
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface EndpointCardProps {
  id: string;
  name: string;
  description: string;
  path: string;
}

function EndpointCard({ id, name, description, path }: EndpointCardProps) {
  const { selectEndpoint } = useEndpointStore();

  return (
    <Card
      className="cursor-pointer transition-colors hover:border-primary"
      onClick={() => selectEndpoint(id)}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="font-mono text-xs">{path}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

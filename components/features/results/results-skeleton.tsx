"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";
import { Skeleton } from "@/components/shared/ui/skeleton";

export function ResultsSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="w-full space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 space-y-2">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-9 w-64" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <div className="space-y-2 pl-4">
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

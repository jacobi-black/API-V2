"use client";

import { Button } from "@/components/shared/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-2xl font-bold">Une erreur est survenue</h2>
      <p className="mb-6 text-muted-foreground">
        {error.message || "Désolé, quelque chose s'est mal passé."}
      </p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}

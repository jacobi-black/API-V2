"use client";

import { Button } from '@/components/shared/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
      <p className="text-muted-foreground mb-6">{error.message || "Désolé, quelque chose s'est mal passé."}</p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}

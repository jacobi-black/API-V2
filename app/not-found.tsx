import Link from "next/link";
import { Button } from "@/components/shared/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-2xl font-bold">Page non trouvée</h2>
      <p className="mb-6 text-muted-foreground">
        Désolé, la page que vous recherchez n'existe pas.
      </p>
      <Button asChild>
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}

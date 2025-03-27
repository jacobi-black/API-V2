import Link from "next/link";
import { Button } from '@/components/shared/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Page non trouvée</h2>
      <p className="text-muted-foreground mb-6">Désolé, la page que vous recherchez n'existe pas.</p>
      <Button asChild>
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}

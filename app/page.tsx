"use client";

import { Button } from "@/components/shared/ui/button";
import Link from "next/link";
import { Database, ArrowRight, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";

export default function HomePage() {
  return (
    <main className="container mx-auto flex flex-1 flex-col items-center p-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="flex items-center justify-center gap-3">
            <Database className="h-10 w-10" />
            CyberArk API Explorer
          </span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground">
          Explorez et interagissez avec les API CyberArk de manière simple et intuitive. Pour
          commencer, connectez-vous en haut à droite de l'écran.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Explorer les endpoints</CardTitle>
              <CardDescription>Accédez à tous les endpoints CyberArk</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Parcourez les différentes API CyberArk, regroupées par catégories et
                fonctionnalités.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard" passHref>
                <Button>
                  Commencer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tester les requêtes</CardTitle>
              <CardDescription>Construisez et exécutez des requêtes</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Configurez les paramètres de chaque API et visualisez les résultats en temps réel.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard" passHref>
                <Button>
                  Commencer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Ressources officielles</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Consultez la documentation officielle CyberArk pour comprendre les API disponibles.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <a
                  href="https://docs.cyberark.com/pam-self-hosted/latest/en/content/webservices/implementing%20privileged%20account%20security%20web%20services.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}

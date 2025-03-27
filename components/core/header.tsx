"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/shared/ui/button";
import { ThemeToggle } from "@/components/shared/theme/theme-toggle";
import { LogOut, Database, LogIn } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shared/ui/sheet";
import { CredentialForm } from "@/components/features/auth/credential-form";

export function Header() {
  const { isAuthenticated, session, clearSession } = useAuthStore();
  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);

  const handleLogout = async () => {
    if (!session) return;

    try {
      // Appeler l'API de déconnexion
      const response = await fetch("/api/cyberark/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          baseUrl: session.baseUrl,
          token: session.token,
        }),
      });

      if (!response.ok) {
        console.error("Erreur de déconnexion:", await response.text());
      }
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      // Effacer la session côté client
      clearSession();
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Database className="h-6 w-6" />
          <span>CyberArk API Explorer</span>
        </Link>

        <nav className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden text-sm text-muted-foreground md:block">
                <span className="mr-1">Connecté à</span>
                <span className="font-mono">{session?.baseUrl}</span>
              </div>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </div>
          ) : (
            <Sheet open={isLoginSheetOpen} onOpenChange={setIsLoginSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Se connecter</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Connexion à CyberArk</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <CredentialForm onSuccess={handleLoginSuccess} compact />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </nav>
      </div>
    </header>
  );
}

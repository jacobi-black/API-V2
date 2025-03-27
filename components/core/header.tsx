"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { Button } from '@/components/shared/ui/button";
import { ThemeToggle } from '@/components/shared/theme/theme-toggle";
import { LogOut, Database } from "lucide-react";

export function Header() {
  const { isAuthenticated, session, clearSession } = useAuthStore();
  
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
      
      // Rediriger vers la page d'accueil
      window.location.href = "/";
    }
  };
  
  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Database className="h-6 w-6" />
          <span>CyberArk API Explorer</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground hidden md:block">
                <span className="mr-1">Connecté à</span>
                <span className="font-mono">{session?.baseUrl}</span>
              </div>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Déconnexion</span>
              </Button>
            </div>
          ) : (
            <Link href="/" passHref>
              <Button size="sm">Se connecter</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

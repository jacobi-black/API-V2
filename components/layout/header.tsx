"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
    <header className="bg-background border-b">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          CyberArk API Explorer
        </Link>
        
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="text-sm text-muted-foreground mr-2">
                <span className="mr-1">Connecté à</span>
                <span className="font-mono">{session?.baseUrl}</span>
              </div>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </>
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

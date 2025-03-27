"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AuthType } from "@/types/auth";
import { CredentialsSchema, CredentialsSchemaType } from "@/schemas/auth.schema";
import { useAuthStore } from "@/store/auth.store";

// UI Components
import { Button } from '@/components/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shared/ui/form";
import { Input } from '@/components/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select";
import { Checkbox } from '@/components/shared/ui/checkbox";

export function CredentialForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { setSession, setCredentials, setAuthError, authError } = useAuthStore();
  const router = useRouter();

  const form = useForm<CredentialsSchemaType>({
    resolver: zodResolver(CredentialsSchema),
    defaultValues: {
      baseUrl: "",
      username: "",
      password: "",
      authType: AuthType.CyberArk,
      concurrentSession: false,
    },
  });

  async function onSubmit(data: CredentialsSchemaType) {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await fetch("/api/cyberark/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Échec de l'authentification");
      }

      // Stocker les informations sans le mot de passe
      const { password, ...safeCredentials } = data;
      setCredentials(safeCredentials);

      // Créer et stocker la session
      setSession({
        token: result.token,
        createdAt: new Date(),
        expiresAt: new Date(result.expiresAt),
        baseUrl: data.baseUrl,
        username: data.username,
      });

      // Rediriger vers le dashboard
      router.push("/dashboard");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Erreur inconnue");
      console.error("Erreur d'authentification:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-sm border border-border">
      <h2 className="text-2xl font-semibold mb-6">Connexion à CyberArk</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="baseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de l'instance CyberArk</FormLabel>
                <FormControl>
                  <Input placeholder="https://cyberark.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d'utilisateur</FormLabel>
                <FormControl>
                  <Input placeholder="Utilisateur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="authType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Méthode d'authentification</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une méthode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={AuthType.CyberArk}>CyberArk</SelectItem>
                    <SelectItem value={AuthType.LDAP}>LDAP</SelectItem>
                    <SelectItem value={AuthType.Windows}>Windows</SelectItem>
                    <SelectItem value={AuthType.RADIUS}>RADIUS</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="concurrentSession"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Autoriser les sessions simultanées</FormLabel>
              </FormItem>
            )}
          />
          
          {authError && (
            <div className="p-3 text-sm text-white bg-destructive rounded">
              {authError}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

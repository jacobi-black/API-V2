"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthType } from "@/types/auth";
import { CredentialsSchema, CredentialsSchemaType } from "@/schemas/auth.schema";
import { useAuthStore } from "@/store/auth.store";

// UI Components
import { Button } from "@/components/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shared/ui/form";
import { Input } from "@/components/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select";
import { Checkbox } from "@/components/shared/ui/checkbox";

interface CredentialFormProps {
  onSuccess?: () => void;
  className?: string;
  compact?: boolean;
}

export function CredentialForm({
  onSuccess,
  className = "",
  compact = false,
}: CredentialFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setSession, setCredentials, setAuthError, authError } = useAuthStore();

  const form = useForm<CredentialsSchemaType>({
    resolver: zodResolver(CredentialsSchema),
    defaultValues: {
      baseUrl: "",
      username: "",
      password: "",
      authType: AuthType.CYBERARK,
      concurrentSession: false,
    },
  });

  async function onSubmit(data: CredentialsSchemaType) {
    setIsLoading(true);
    setAuthError(null);

    try {
      console.log("Tentative d'authentification avec:", {
        baseUrl: data.baseUrl,
        username: data.username,
        authType: data.authType,
      });

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

      console.log(
        "Authentification réussie, token reçu:",
        result.token
          ? `${result.token.substring(0, 10)}... (${result.token.length} caractères)`
          : "Vide"
      );

      // Stocker les informations sans le mot de passe en ignorant l'avertissement du linter
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeCredentials } = data;
      setCredentials(safeCredentials);

      // Créer et stocker la session
      const session = {
        token: result.token.trim(), // Suppression des espaces superflus
        createdAt: new Date(),
        expiresAt: new Date(result.expiresAt),
        baseUrl: data.baseUrl.trim(), // Suppression des espaces superflus
        username: data.username,
      };

      console.log("Session stockée:", {
        tokenLength: session.token.length,
        expiresAt: session.expiresAt,
        baseUrl: session.baseUrl,
      });

      setSession(session);

      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Erreur inconnue");
      console.error("Erreur d'authentification:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`rounded-lg border border-border bg-card p-${compact ? "4" : "6"} shadow-sm ${className}`}
    >
      {!compact && <h2 className="mb-6 text-2xl font-semibold">Connexion à CyberArk</h2>}

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
                    <SelectItem value={AuthType.CYBERARK}>CyberArk</SelectItem>
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
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Autoriser les sessions simultanées</FormLabel>
              </FormItem>
            )}
          />

          {authError && (
            <div className="rounded bg-destructive p-3 text-sm text-white">{authError}</div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

import { z } from "zod";
import { AuthType } from "@/types/auth";

/**
 * Schéma de validation pour les identifiants CyberArk
 */
export const CredentialsSchema = z.object({
  baseUrl: z
    .string()
    .url("L'URL doit être une URL valide")
    .min(1, "L'URL ne peut pas être vide"),
  username: z
    .string()
    .min(1, "Le nom d'utilisateur ne peut pas être vide"),
  password: z
    .string()
    .min(1, "Le mot de passe ne peut pas être vide"),
  authType: z.nativeEnum(AuthType, {
    errorMap: () => ({ message: "Type d'authentification invalide" }),
  }).default(AuthType.CyberArk),
  concurrentSession: z
    .boolean()
    .default(false),
  newPassword: z
    .string()
    .optional(),
});

export type CredentialsSchemaType = z.infer<typeof CredentialsSchema>;

/**
 * Schéma pour la réponse d'authentification
 */
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  error: z.string().optional(),
});

export type AuthResponseType = z.infer<typeof AuthResponseSchema>;

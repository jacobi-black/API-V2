"use client";

import { CredentialForm } from "@/components/features/auth/credential-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-center text-4xl font-bold">CyberArk API Explorer</h1>
        <p className="mb-8 text-center text-lg">
          Explorez et interagissez avec les API CyberArk de manière simple et intuitive.
        </p>

        <div className="flex justify-center">
          <AuthenticationClient />
        </div>
      </div>
    </main>
  );
}

function AuthenticationClient() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Si l'utilisateur est déjà authentifié, rediriger vers le dashboard
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return <CredentialForm />;
}

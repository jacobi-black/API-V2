import { CredentialForm } from '@/components/features/auth/credential-form";

export default async function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          CyberArk API Explorer
        </h1>
        <p className="text-lg text-center mb-8">
          Explorez et interagissez avec les API CyberArk de manière simple et intuitive.
        </p>
        
        <div className="flex justify-center">
          <AuthenticationClient />
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

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

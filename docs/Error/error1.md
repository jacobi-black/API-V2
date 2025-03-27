Console Error


Error: fetch failed

components/features/auth/credential-form.tsx (71:15) @ onSubmit


  69 |
  70 |       if (!response.ok || !result.success) {
> 71 |         throw new Error(result.error || "Échec de l'authentification");
     |               ^
  72 |       }
  73 |
  74 |       // Stocker les informations sans le mot de passe en ignorant l'avertissement du linter
Call Stack
2

Hide 1 ignore-listed frame(s)
onSubmit
components/features/auth/credential-form.tsx (71:15)
async eval
node_modules/.pnpm/react-hook-form@7.54.2_react@19.0.0/node_modules/react-hook-form/dist/index.esm.mjs (2301:1)
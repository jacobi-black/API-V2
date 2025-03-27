CyberArk API Explorer
Changer de thème
Connecté àhttps://euws31071.sgp.st.com

Déconnexion
CyberArk API Explorer
Retour
Liste des utilisateurs
GET PasswordVault/API/Usersusers

Récupérer la liste des utilisateurs

Requête API
GET PasswordVault/API/Users
Paramètres de requête
search
string
Recherche dans les noms d'utilisateur

admin
filter
string
Filtrer par type d'utilisateur

userType=EPV
Réinitialiser
Exécuter
Résultats
Exécutez une requête pour voir les résultats

Aucune donnée à afficher

CyberArk API Explorer © 2025

Console Error


In HTML, <div> cannot be a descendant of <p>.
This will cause a hydration error.

See more info here: https://nextjs.org/docs/messages/react-hydration-error


...
    <main className="container ...">
      <div className="flex flex-...">
        <h1>
        <Suspense fallback={<DashboardSkeleton>}>
          <DashboardClient>
            <div className="grid grid-...">
              <div className="space-y-6">
                <EndpointDetail onExecute={function handleExecuteQuery} onReset={function resetResults} isLoading={false}>
                  <_c className="w-full">
                    <div ref={null} className="rounded-lg...">
                      <_c2 className="pb-4">
                        <div ref={null} className="flex flex-...">
                          <div className="flex items...">
                            <div>
                              <Button>
                              <_c4>
                              <_c6 className="mt-1">
>                               <p ref={null} className="text-sm text-muted-foreground mt-1">
                                  <Badge variant="outline" className="mr-2 font-...">
>                                   <div
>                                     className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs fo..."
>                                   >
                                  ...
                      ...
              ...
components/shared/ui/badge.tsx (30:10) @ Badge


  28 |
  29 | export function Badge({ className, variant, ...props }: BadgeProps) {
> 30 |   return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
     |          ^
  31 | }
  32 |
Call Stack
21

Hide 16 ignore-listed frame(s)
createUnhandledError
../src/client/components/errors/console-error.ts (18:35)
handleClientError
../src/client/components/errors/use-error-handler.ts (31:13)
console.error
../src/client/components/globals/intercept-console-error.ts (32:9)
validateDOMNesting
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (2604:1)
completeWork
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (13747:1)
runWithFiberInDEV
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (1510:1)
completeUnitOfWork
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (15255:1)
performUnitOfWork
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (15136:1)
workLoopSync
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (14943:39)
renderRootSync
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (14923:1)
performWorkOnRoot
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (14410:1)
performSyncWorkOnRoot
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (16289:1)
flushSyncWorkAcrossRoots_impl
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (16137:1)
processRootScheduleInMicrotask
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (16174:1)
eval
node_modules/.pnpm/next@15.2.4_@babel+core@7.26.10_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js (16308:1)
div
<anonymous> (0:0)
Badge
components/shared/ui/badge.tsx (30:10)
EndpointDetail
components/features/endpoints/endpoint-detail.tsx (57:15)
DashboardClient
app/dashboard/page.tsx (157:11)
DashboardPage
app/dashboard/page.tsx (29:11)
ClientPageRoot
../src/client/components/client-page.tsx (60:12)
Was this helpful?



1
2

1/2

Next.js 15.2.4

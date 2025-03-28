Error: Erreur 401: Unauthorized

hooks/api/use-cyberark-query.ts (123:15) @ execute


  121 |
  122 |       if (!response.ok) {
> 123 |         throw new Error(result.error || `Erreur ${response.status}`);
      |               ^
  124 |       }
  125 |
  126 |       // Mettre à jour l'état avec les données
Call Stack
2

execute
hooks/api/use-cyberark-query.ts (123:15)
async handleExecuteQuery
app/dashboard/page.tsx (120:22)
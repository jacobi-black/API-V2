Réponse HTML reçue au lieu de JSON: "<!DOCTYPE html><html lang=\"fr\"><head><meta charSet=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/><link rel=\"stylesheet\" href=\"/_next/static/css/app/layout.css?v=1743145"

hooks/api/use-cyberark-query.ts (74:17) @ execute


  72 |       // Vérifier si la réponse ressemble à du HTML
  73 |       if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
> 74 |         console.error("Réponse HTML reçue au lieu de JSON:", responseText.substring(0, 200));
     |                 ^
  75 |         throw new Error(
  76 |           "Le serveur a répondu avec une page HTML. Vérifiez l'URL et l'authentification."
  77 |         );
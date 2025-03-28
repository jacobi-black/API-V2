## DÉBOGAGE 401 ERROR ##
En-tête d'authentification: "OTEwYWYzN...wMDAwMDA7" (246 caractères)
URL de la requête: http://localhost:3000/api/cyberark/Accounts?limit=50&offset=0&baseUrl=https%3A%2F%2Feuws31071.sgp.st.com
Headers complets: {
  accept: '*/*',
  'accept-encoding': 'gzip, deflate, br, zstd',
  'accept-language': 'en-US,en;q=0.9',
  authorization: '"OTEwYWYzNGEtOGJkYi00ZmM1LTkxZTAtOTU4OWQzMjdkM2Y0OzkzODMzNTYzRkZBMkM3Mzk2RDVFNDZBREVENzc0MkI3MENENDE5MzI2MTIwNzIxRTcyMzU1MkJDQjY4NjZGRTA7MDAwMDAwMDJCQ0MyMDc1RURGNUM3NjFBMTREMzlBNjYyODA0OTc4QUYwNjUyREFBNUNCNTA5RkUwQjk1MERBQzJFQzU4NDUzMDAwMDAwMDA7"',
  connection: 'keep-alive',
  'content-type': 'application/json',
  host: 'localhost:3000',
  referer: 'http://localhost:3000/dashboard',
  'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  'x-forwarded-for': '::1',
  'x-forwarded-host': 'localhost:3000',
  'x-forwarded-port': '3000',
  'x-forwarded-proto': 'http'
}
Analyse du token: {
  containsSpaces: false,
  containsNewlines: false,
  containsQuotes: true,
  startsWithBearer: false,
  length: 246
}
Token nettoyé: "OTEwYWYzN... (246 caractères)
Error: Route "/api/cyberark/[...path]" used `params.path`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at GET (app/api/cyberark/[...path]/route.ts:75:32)
  73 |
  74 |     // Construire le chemin de l'API CyberArk
> 75 |     const pathSegments = params.path;
     |                                ^
  76 |     const cyberarkPath = `PasswordVault/API/${pathSegments.join("/")}`;
  77 |
  78 |     // Construire l'URL complète avec les paramètres
Requête à l'API CyberArk: https://euws31071.sgp.st.com/PasswordVault/API/Accounts?limit=50&offset=0
En-têtes de la requête CyberArk: {
  Authorization: '"OTEwYWYzN...wMDAwMDA7" (246 chars)',
  ContentType: 'application/json'
}
Réponse CyberArk: {
  status: 401,
  statusText: 'Unauthorized',
  headers: {
    'access-control-expose-headers': 'Warning',
    'cache-control': 'no-cache',
    'content-length': '92',
    'content-security-policy': "frame-ancestors 'self';",
    'content-type': 'application/json; charset=utf-8',
    date: 'Fri, 28 Mar 2025 07:34:51 GMT',
    expires: '-1',
    pragma: 'no-cache',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'set-cookie': 'mobileState=Desktop; path=/PasswordVault/; SameSite=None; secure; HttpOnly',
    'strict-transport-security': 'max-age=31536000; includeSubDomains',
    'x-content-type-options': 'nosniff'
  }
}
Détails de l'erreur 401: {"ErrorCode":"PASWS006E","ErrorMessage":"The session token is missing, invalid or expired."}
 GET /api/cyberark/Accounts?limit=50&offset=0&baseUrl=https%3A%2F%2Feuws31071.sgp.st.com 401 in 6357ms
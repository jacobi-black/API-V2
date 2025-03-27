# Stage 1: Dépendances et build
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Installer PNPM globalement
RUN npm install -g pnpm

# Copier package.json et pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste du code source
COPY . .

# Construction de l'application
RUN pnpm build

# Stage 2: Image de production
FROM node:20-alpine AS runner

WORKDIR /app

# Installer PNPM globalement
RUN npm install -g pnpm

# Définir les variables d'environnement pour la production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Créer un utilisateur non-root pour plus de sécurité
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires depuis le stage de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Passage à l'utilisateur non-root
USER nextjs

# Exposer le port
EXPOSE 3000

# Définir la variable d'environnement pour le port
ENV PORT 3000

# Démarrer l'application
CMD ["node", "server.js"]

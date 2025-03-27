# Guide de Déploiement Docker - CyberArk API Explorer

Ce document détaille les procédures et configurations pour déployer l'application CyberArk API Explorer à l'aide de Docker et Docker Compose.

## Table des matières

- [Prérequis](#prérequis)
- [Configuration Docker](#configuration-docker)
  - [Dockerfile](#dockerfile)
  - [Docker Compose](#docker-compose)
  - [Nginx Reverse Proxy](#nginx-reverse-proxy)
- [Options de déploiement](#options-de-déploiement)
  - [Déploiement local](#déploiement-local)
  - [Déploiement sur serveur](#déploiement-sur-serveur)
  - [Déploiement cloud](#déploiement-cloud)
- [Variables d'environnement](#variables-denvironnement)
- [Santé et surveillance](#santé-et-surveillance)
- [Pipelines CI/CD](#pipelines-cicd)
- [Bonnes pratiques de sécurité](#bonnes-pratiques-de-sécurité)
- [Dépannage](#dépannage)

## Prérequis

- Docker (version 20.10.0 ou supérieure)
- Docker Compose (version 2.0.0 ou supérieure)
- Git
- Accès réseau aux registres Docker

## Configuration Docker

### Dockerfile

Notre application utilise une approche multi-stage pour optimiser la taille et la sécurité de l'image:

1. **Stage builder**: Compilation de l'application Next.js
2. **Stage runner**: Image allégée pour l'exécution en production

```dockerfile
# Stage 1: Dépendances et build
FROM node:18-alpine AS builder

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
FROM node:18-alpine AS runner

WORKDIR /app

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
```

### Docker Compose

Le fichier `docker-compose.yml` définit les services nécessaires à l'application:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    restart: always
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/healthcheck"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - app
    restart: always
```

### Nginx Reverse Proxy

Nous utilisons Nginx comme proxy inverse pour:
- Gérer les terminaisons SSL/TLS
- Mettre en cache les ressources statiques
- Ajouter des en-têtes de sécurité
- Gérer la compression et l'optimisation

Configuration dans `nginx/conf.d/default.conf`:

```
server {
    listen 443 ssl http2;
    server_name cyberark-api-explorer.example.com;
    
    # Certificats SSL
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # Configuration sécurisée SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # En-têtes de sécurité
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    
    # Proxy vers Next.js
    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Cache des assets statiques
    location /_next/static/ {
        proxy_pass http://app:3000;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

## Options de déploiement

### Déploiement local

Pour déployer l'application localement:

```bash
# Construire et démarrer tous les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f
```

### Déploiement sur serveur

Pour déployer sur un serveur de production:

1. Cloner le dépôt sur le serveur
2. Créer un fichier `.env` avec les variables d'environnement
3. Générer des certificats SSL (Let's Encrypt recommandé)
4. Lancer avec Docker Compose

```bash
git clone https://github.com/votre-organisation/cyberark-api-explorer.git
cd cyberark-api-explorer
cp .env.example .env
# Éditer .env avec les valeurs appropriées

# Configurer SSL avec Certbot (example)
certbot certonly --standalone -d cyberark-api-explorer.example.com
ln -s /etc/letsencrypt/live/cyberark-api-explorer.example.com/fullchain.pem nginx/ssl/
ln -s /etc/letsencrypt/live/cyberark-api-explorer.example.com/privkey.pem nginx/ssl/

# Démarrer l'application
docker-compose up -d
```

### Déploiement cloud

#### AWS ECS

Pour déployer sur AWS Elastic Container Service:

1. Créer un ECR repository
2. Pousser l'image Docker vers ECR
3. Créer une définition de tâche ECS
4. Configurer un service ECS avec équilibrage de charge

Exemple d'utilisation avec AWS CLI:

```bash
# Connexion à ECR
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com

# Construire et tagger l'image
docker build -t cyberark-api-explorer .
docker tag cyberark-api-explorer:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/cyberark-api-explorer:latest

# Pousser l'image vers ECR
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/cyberark-api-explorer:latest

# Créer ou mettre à jour le service ECS
aws ecs update-service --cluster <cluster-name> --service <service-name> --force-new-deployment
```

#### Azure Container Instances

Pour déployer sur Azure:

```bash
# Connexion à Azure
az login

# Créer un registre de conteneurs
az acr create --resource-group myResourceGroup --name myContainerRegistry --sku Basic

# Construire et pousser l'image
az acr build --registry myContainerRegistry --image cyberark-api-explorer:latest .

# Déployer le conteneur
az container create --resource-group myResourceGroup --name cyberark-api-explorer \
  --image myContainerRegistry.azurecr.io/cyberark-api-explorer:latest \
  --dns-name-label cyberark-api-explorer --ports 80
```

## Variables d'environnement

Les variables d'environnement suivantes sont disponibles pour configurer l'application:

| Variable | Description | Défaut | Obligatoire |
|----------|-------------|--------|-------------|
| `NODE_ENV` | Environnement d'exécution | `production` | Non |
| `PORT` | Port d'écoute du serveur | `3000` | Non |
| `NEXT_PUBLIC_API_URL` | URL de base de l'API CyberArk | - | Oui |
| `NEXT_PUBLIC_APP_VERSION` | Version de l'application | `1.0.0` | Non |

## Santé et surveillance

L'application expose un endpoint de santé à `/api/healthcheck` qui peut être utilisé par Docker, les équilibreurs de charge et les outils de surveillance.

### Métriques et surveillance

Pour implémenter une surveillance complète:

1. **Prometheus**: Collection de métriques
   - Ajouter un endpoint `/metrics` à l'application
   - Configurer Prometheus pour récupérer les métriques

2. **Grafana**: Visualisation des métriques
   - Créer des tableaux de bord pour les métriques clés:
     - Performance des requêtes
     - Utilisation des ressources
     - Métriques Web Vitals
     - Taux d'erreur

3. **Alertmanager**: Alertes basées sur les métriques
   - Configurer des alertes pour les conditions critiques

## Pipelines CI/CD

Notre configuration CI/CD est définie dans `.github/workflows/ci.yml` et inclut:

1. **Lint et tests**:
   - Vérification du code avec ESLint
   - Exécution des tests unitaires et d'intégration
   - Génération de rapports de couverture

2. **Build**:
   - Construction de l'application Next.js
   - Construction de l'image Docker

3. **Déploiement**:
   - Publication de l'image sur le registre de conteneurs
   - Déploiement automatique sur l'environnement cible

## Bonnes pratiques de sécurité

1. **Utiliser un utilisateur non-root** dans les conteneurs
2. **Minimiser la surface d'attaque** en utilisant des images minimalistes
3. **Scanner les vulnérabilités** dans les images avec Trivy ou Clair
4. **Appliquer le principe du moindre privilège** pour les permissions
5. **Isoler les réseaux** avec des réseaux Docker dédiés
6. **Sécuriser les secrets** en utilisant Docker secrets ou des gestionnaires de secrets externes

Exemple de scan de sécurité avec Trivy:

```bash
# Installer Trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Scanner l'image Docker
trivy image cyberark-api-explorer:latest
```

## Dépannage

### Problèmes courants et solutions

| Problème | Cause possible | Solution |
|----------|----------------|----------|
| Échec du démarrage du conteneur | Variables d'environnement manquantes | Vérifier le fichier `.env` |
| Erreur 502 Bad Gateway | Application non démarrée | Vérifier les logs de l'application |
| Performances lentes | Ressources insuffisantes | Augmenter les limites de ressources Docker |
| Erreurs de certificat SSL | Certificats invalides ou expirés | Renouveler les certificats |
| Échec de healthcheck | Endpoint inaccessible | Vérifier les règles de pare-feu |

### Commandes utiles pour le dépannage

```bash
# Vérifier l'état des conteneurs
docker-compose ps

# Voir les logs de l'application
docker-compose logs app

# Voir les logs Nginx
docker-compose logs nginx

# Entrer dans un conteneur en cours d'exécution
docker-compose exec app sh

# Vérifier l'utilisation des ressources
docker stats
```

### Support

Pour tout problème non résolu, veuillez:

1. Consulter la [documentation](https://github.com/votre-organisation/cyberark-api-explorer/docs)
2. Ouvrir une issue sur notre [dépôt GitHub](https://github.com/votre-organisation/cyberark-api-explorer/issues)
3. Contacter l'équipe de support via Slack ou email

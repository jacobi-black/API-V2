# Guide d'installation - CyberArk API Explorer

Ce document fournit des instructions détaillées pour installer et configurer l'application CyberArk API Explorer.

## Table des matières

- [Prérequis](#prérequis)
- [Installation locale](#installation-locale)
  - [Cloner le dépôt](#cloner-le-dépôt)
  - [Installer les dépendances](#installer-les-dépendances)
  - [Configuration](#configuration)
  - [Démarrer l'application](#démarrer-lapplication)
- [Installation avec Docker](#installation-avec-docker)
- [Déploiement en production](#déploiement-en-production)
- [Dépannage](#dépannage)

## Prérequis

Avant de commencer, assurez-vous que votre environnement répond aux exigences suivantes :

- **Node.js** : Version 20.x ou supérieure
  - [Télécharger Node.js](https://nodejs.org/)
  - Vérifiez votre version avec `node --version`

- **pnpm** : Version 8.x ou supérieure
  - Installation : `npm install -g pnpm`
  - Vérifiez votre version avec `pnpm --version`

- **Git** : Pour cloner le dépôt
  - [Télécharger Git](https://git-scm.com/downloads)
  - Vérifiez votre version avec `git --version`

## Installation locale

### Cloner le dépôt

Commencez par cloner le dépôt sur votre machine locale :

```bash
git clone https://github.com/votre-organisation/cyberark-api-explorer.git
cd cyberark-api-explorer
```

### Installer les dépendances

Installez toutes les dépendances nécessaires avec pnpm :

```bash
pnpm install
```

Cette commande installe toutes les dépendances listées dans le fichier `package.json`, y compris :
- Next.js et React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Zod et Zustand
- Outils de développement (ESLint, Prettier, Jest)

### Configuration

#### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet pour configurer les variables d'environnement :

```bash
# Créer le fichier .env.local
touch .env.local
```

Ajoutez les variables suivantes au fichier :

```
# Environnement
NODE_ENV=development

# Configuration du serveur
PORT=3000

# Facultatif : URL de base de l'API CyberArk (pour tests)
# NEXT_PUBLIC_DEFAULT_CYBERARK_URL=https://cyberark.example.com
```

#### Configuration TypeScript (facultatif)

Le fichier `tsconfig.json` est déjà configuré, mais vous pouvez l'ajuster selon vos besoins spécifiques.

### Démarrer l'application

#### Mode développement

Pour démarrer l'application en mode développement avec rechargement à chaud :

```bash
pnpm dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

#### Construction et démarrage en mode production

Pour une exécution en production locale :

```bash
# Construire l'application
pnpm build

# Démarrer en mode production
pnpm start
```

## Installation avec Docker

> Note: Cette section sera complétée dans une phase ultérieure du projet.

## Déploiement en production

### Vercel

Pour déployer sur Vercel, la méthode la plus simple est de connecter votre dépôt GitHub à Vercel :

1. Créez un compte sur [Vercel](https://vercel.com/)
2. Importez votre dépôt depuis GitHub
3. Configurez les variables d'environnement selon vos besoins
4. Déployez l'application

### Déploiement personnalisé

Pour un déploiement sur votre propre serveur :

1. Clonez le dépôt sur votre serveur
2. Installez les dépendances : `pnpm install`
3. Créez un fichier `.env.local` avec la configuration appropriée
4. Construisez l'application : `pnpm build`
5. Démarrez l'application : `pnpm start`

Pour une utilisation en production, nous recommandons d'utiliser un gestionnaire de processus comme PM2 :

```bash
# Installation de PM2
npm install -g pm2

# Démarrage de l'application avec PM2
pm2 start npm --name "cyberark-api-explorer" -- start
```

## Dépannage

### Problèmes courants

#### Erreur "Module not found"

Si vous rencontrez des erreurs de module introuvable, essayez :

```bash
# Nettoyer le cache de pnpm
pnpm store prune

# Réinstaller les dépendances
pnpm install
```

#### Erreurs de port

Si le port 3000 est déjà utilisé, vous pouvez spécifier un port différent :

```bash
# Utiliser le port 3001
PORT=3001 pnpm dev
```

#### Problèmes de compatibilité Node.js

Si vous rencontrez des problèmes liés à la version de Node.js, assurez-vous d'utiliser une version compatible (20.x ou supérieure). Vous pouvez utiliser [nvm](https://github.com/nvm-sh/nvm) pour gérer facilement plusieurs versions de Node.js.

### Support

Si vous rencontrez des problèmes persistants, veuillez :

1. Consulter les [issues GitHub](https://github.com/votre-organisation/cyberark-api-explorer/issues) pour voir si le problème a déjà été signalé
2. Ouvrir une nouvelle issue si nécessaire, en fournissant :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Logs d'erreur
   - Environnement (OS, versions de Node.js et pnpm)

#!/bin/bash

# Script de déploiement pour CyberArk API Explorer
# Ce script automatise le déploiement de l'application en production

# Configuration
APP_NAME="cyberark-api-explorer"
DOCKER_REPO="example.com/cyberark-api-explorer"
VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')
TAG="${VERSION}"
DEPLOY_DIR="/opt/cyberark-api-explorer"
BACKUP_DIR="/opt/cyberark-api-explorer/backups"
LOG_FILE="/var/log/cyberark-api-explorer-deploy.log"

# Fonction pour enregistrer les logs
log() {
  local message="[$(date +'%Y-%m-%d %H:%M:%S')] $1"
  echo "$message" | tee -a $LOG_FILE
}

# Vérification des prérequis
check_prerequisites() {
  log "Vérification des prérequis..."
  
  # Vérifier que Docker est installé
  if ! command -v docker &> /dev/null; then
    log "ERREUR: Docker n'est pas installé."
    exit 1
  fi

  # Vérifier que Docker Compose est installé
  if ! command -v docker-compose &> /dev/null; then
    log "ERREUR: Docker Compose n'est pas installé."
    exit 1
  }

  log "Prérequis vérifiés avec succès."
}

# Sauvegarder les données existantes
backup() {
  log "Sauvegarde des données existantes..."
  
  # Créer le répertoire de sauvegarde s'il n'existe pas
  mkdir -p $BACKUP_DIR
  
  # Nom du fichier de sauvegarde avec la date et l'heure
  local backup_file="$BACKUP_DIR/backup-$(date +'%Y%m%d_%H%M%S').tar.gz"
  
  # Sauvegarder les fichiers de configuration
  if [ -d "$DEPLOY_DIR/config" ]; then
    tar -czf $backup_file -C $DEPLOY_DIR config
    log "Sauvegarde créée: $backup_file"
  else
    log "Aucune donnée à sauvegarder."
  fi
}

# Construire l'image Docker
build_image() {
  log "Construction de l'image Docker..."
  
  # Construire l'image Docker avec le tag de version
  docker build -t ${DOCKER_REPO}:${TAG} .
  
  if [ $? -ne 0 ]; then
    log "ERREUR: Échec de la construction de l'image Docker."
    exit 1
  fi
  
  # Taguer également comme 'latest'
  docker tag ${DOCKER_REPO}:${TAG} ${DOCKER_REPO}:latest
  
  log "Image Docker construite avec succès: ${DOCKER_REPO}:${TAG}"
}

# Déployer l'application
deploy() {
  log "Déploiement de l'application version $VERSION..."
  
  # Créer le répertoire de déploiement s'il n'existe pas
  mkdir -p $DEPLOY_DIR
  
  # Copier les fichiers de configuration
  log "Copie des fichiers de configuration..."
  cp -r docker-compose.yml $DEPLOY_DIR/
  cp -r nginx $DEPLOY_DIR/
  
  # Si un fichier .env.production existe, le copier
  if [ -f ".env.production" ]; then
    cp .env.production $DEPLOY_DIR/.env
  else
    log "AVERTISSEMENT: Fichier .env.production non trouvé. Assurez-vous de configurer les variables d'environnement."
  fi
  
  # Se déplacer dans le répertoire de déploiement
  cd $DEPLOY_DIR
  
  # Arrêter les conteneurs existants
  log "Arrêt des conteneurs existants..."
  docker-compose down
  
  # Lancer les nouveaux conteneurs
  log "Démarrage des nouveaux conteneurs..."
  docker-compose up -d
  
  if [ $? -ne 0 ]; then
    log "ERREUR: Échec du déploiement des conteneurs."
    exit 1
  fi
  
  log "Application déployée avec succès!"
}

# Vérifier l'état du déploiement
check_deployment() {
  log "Vérification de l'état du déploiement..."
  
  # Attendre que les conteneurs soient prêts
  sleep 10
  
  # Vérifier que les conteneurs sont en cours d'exécution
  if ! docker-compose ps | grep -q "Up"; then
    log "ERREUR: Les conteneurs ne sont pas en cours d'exécution."
    docker-compose logs
    exit 1
  fi
  
  # Effectuer une requête de santé
  local health_check_url="http://localhost/api/healthcheck"
  log "Effectuer une vérification de santé: $health_check_url"
  
  if ! curl -s -o /dev/null -w "%{http_code}" $health_check_url | grep -q "200"; then
    log "AVERTISSEMENT: La vérification de santé a échoué. L'application pourrait ne pas fonctionner correctement."
  else
    log "Vérification de santé réussie!"
  fi
}

# Nettoyage après déploiement
cleanup() {
  log "Nettoyage post-déploiement..."
  
  # Supprimer les images Docker inutilisées
  docker system prune -af --volumes
  
  # Conserver seulement les 5 dernières sauvegardes
  if [ -d "$BACKUP_DIR" ]; then
    log "Conservation des 5 dernières sauvegardes uniquement..."
    ls -tp $BACKUP_DIR | grep -v '/$' | tail -n +6 | xargs -I {} rm -- $BACKUP_DIR/{}
  fi
  
  log "Nettoyage terminé."
}

# Fonction principale
main() {
  log "=== DÉBUT DU DÉPLOIEMENT: CyberArk API Explorer v$VERSION ==="
  
  check_prerequisites
  backup
  build_image
  deploy
  check_deployment
  cleanup
  
  log "=== FIN DU DÉPLOIEMENT ==="
}

# Exécuter la fonction principale
main "$@" 
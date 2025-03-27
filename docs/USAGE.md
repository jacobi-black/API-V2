# Guide d'utilisation - CyberArk API Explorer

Ce document explique comment utiliser l'application CyberArk API Explorer dans son état actuel (Phase 1).

## Table des matières

- [Présentation](#présentation)
- [Authentification](#authentification)
  - [Connexion à CyberArk](#connexion-à-cyberark)
  - [Gestion de session](#gestion-de-session)
  - [Déconnexion](#déconnexion)
- [Dashboard](#dashboard)
- [Prochaines fonctionnalités](#prochaines-fonctionnalités)

## Présentation

CyberArk API Explorer est une application web qui vous permet d'explorer et d'interagir avec les API CyberArk sans avoir à écrire de code. L'application est actuellement en phase de développement, avec la Phase 1 (infrastructure et authentification) terminée.

## Authentification

### Connexion à CyberArk

L'écran d'authentification est la première page que vous verrez en accédant à l'application.

#### Étapes pour se connecter

1. Ouvrez l'application dans votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000)
2. Remplissez le formulaire d'authentification :
   - **URL de l'instance CyberArk** : Entrez l'URL complète de votre serveur PVWA CyberArk
     - Exemple : `https://cyberark.example.com`
   - **Nom d'utilisateur** : Votre nom d'utilisateur CyberArk
   - **Mot de passe** : Votre mot de passe CyberArk
   - **Sessions simultanées** (optionnel) : Cochez cette option pour permettre plusieurs sessions avec le même utilisateur

3. Cliquez sur le bouton "Se connecter"

#### Messages d'erreur courants

Si l'authentification échoue, vous verrez un message d'erreur explicatif :

- **URL de base invalide** : L'URL fournie n'est pas une URL valide
- **Échec de l'authentification** : Les identifiants fournis sont incorrects
- **Erreur de connexion** : Impossible de se connecter au serveur CyberArk (vérifiez l'URL et la connectivité réseau)

### Gestion de session

Une fois authentifié, votre session est gérée automatiquement par l'application :

- Le token d'authentification est stocké **uniquement en mémoire** pour des raisons de sécurité
- La session a une durée limitée (généralement 20 minutes par défaut avec CyberArk)
- L'état d'authentification est conservé pendant la navigation dans l'application

### Déconnexion

La fonctionnalité de déconnexion sera disponible dans la Phase 2 du développement. Actuellement, vous pouvez "vous déconnecter" en fermant l'application ou en actualisant la page (ce qui effacera le token de la mémoire).

## Dashboard

Une fois authentifié, vous serez redirigé vers le dashboard de l'application. Dans la version actuelle (Phase 1), le dashboard présente une interface simplifiée avec des boutons pour les différentes sections d'API qui seront disponibles dans les prochaines phases :

- **Comptes** - Explorer et gérer les comptes dans CyberArk
- **Coffres** - Consulter les coffres-forts et leurs membres
- **Utilisateurs** - Gérer les utilisateurs et leurs permissions
- **Plateformes** - Consulter les plateformes disponibles
- **Groupes** - Visualiser les groupes et leurs membres
- **Rapports** - Exécuter des rapports prédéfinis

Ces sections sont actuellement des placeholders qui seront implémentés dans la Phase 2 du développement.

## Prochaines fonctionnalités

Les fonctionnalités suivantes sont en cours de développement pour la Phase 2 :

### Explorateur d'endpoints

- Interface pour parcourir tous les endpoints API disponibles
- Documentation intégrée pour chaque endpoint
- Sélection facile des endpoints à utiliser

### Construction de requêtes

- Formulaires dynamiques adaptés à chaque type d'endpoint
- Validation des paramètres en temps réel
- Suggestions et aides contextuelles

### Affichage des résultats

- Visualisation claire et formatée des réponses JSON
- Navigation dans les grands ensembles de données
- Filtrage et recherche dans les résultats

### Exportation de données

- Export des résultats en formats CSV et JSON
- Options de personnalisation pour les exports
- Nommage automatique des fichiers

Pour suivre l'avancement du développement, consultez la [feuille de route](development/ROADMAP.md).

## Retour d'information

Vos commentaires sont essentiels pour améliorer CyberArk API Explorer. Si vous avez des suggestions, des idées ou des problèmes à signaler, veuillez :

1. Ouvrir une issue sur le dépôt GitHub du projet
2. Contacter l'équipe de développement à [email@exemple.com](mailto:email@exemple.com)

Nous apprécions particulièrement les retours sur l'expérience utilisateur et les fonctionnalités qui seraient les plus utiles pour votre travail avec CyberArk.

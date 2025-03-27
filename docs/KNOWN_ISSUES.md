# Problèmes connus - CyberArk API Explorer V1

Ce document répertorie les problèmes connus dans la version actuelle (V1) de CyberArk API Explorer, ainsi que des solutions de contournement lorsqu'elles existent.

## Problèmes d'interface utilisateur

### 1. Rafraîchissement de session

**Description**: L'application ne détecte pas de manière proactive l'expiration imminente du jeton de session. L'utilisateur peut recevoir une erreur d'authentification soudaine lorsque le jeton expire.

**Contournement**: Déconnectez-vous et reconnectez-vous manuellement toutes les 15 minutes environ pour éviter une expiration inattendue.

**Statut**: Prévu pour correction dans la V1.1.

### 2. Support de la navigation mobile

**Description**: Bien que l'interface soit responsive, certains éléments de l'interface peuvent être difficiles à utiliser sur des appareils mobiles avec des écrans très petits (< 320px).

**Contournement**: Utilisez l'application en mode paysage sur les appareils mobiles à petit écran.

**Statut**: Amélioration prévue dans la V1.2.

### 3. Thème sombre

**Description**: Le mode sombre n'est pas entièrement implémenté dans tous les composants.

**Contournement**: Utilisez le mode clair pour une expérience visuelle cohérente.

**Statut**: Prévu pour la V1.1.

## Problèmes fonctionnels

### 1. Limitation de la taille des résultats

**Description**: Les ensembles de résultats très volumineux (>10 000 éléments) peuvent entraîner des problèmes de performance lors de l'affichage et de l'exportation.

**Contournement**: Utilisez des filtres pour réduire la taille des résultats ou exportez par lots plus petits.

**Statut**: Optimisations prévues dans la V2.0.

### 2. Synchronisation multi-onglets

**Description**: L'état d'authentification n'est pas synchronisé entre plusieurs onglets ou fenêtres du navigateur.

**Contournement**: Évitez d'utiliser l'application dans plusieurs onglets simultanément, ou reconnectez-vous dans chaque onglet.

**Statut**: Résolution prévue dans la V1.1.

### 3. Support partiel des paramètres d'URL

**Description**: Tous les paramètres d'API ne sont pas automatiquement détectés et exposés dans l'interface.

**Contournement**: Pour les paramètres non exposés, utilisez la section "Paramètres personnalisés" disponible dans chaque endpoint.

**Statut**: Amélioration continue prévue pour les versions V1.x.

## Problèmes de compatibilité

### 1. Versions de CyberArk

**Description**: L'application est principalement testée avec les versions 12.x et 13.x de CyberArk. Des problèmes mineurs peuvent survenir avec d'autres versions.

**Contournement**: Signalez les problèmes spécifiques à la version que vous utilisez.

**Statut**: Support étendu des versions prévu dans les mises à jour futures.

### 2. Navigateurs anciens

**Description**: L'application nécessite un navigateur moderne. Internet Explorer n'est pas pris en charge, et les anciennes versions d'Edge peuvent rencontrer des problèmes.

**Contournement**: Utilisez Chrome, Firefox, Edge Chromium ou Safari dans leurs versions récentes.

**Statut**: Aucun plan pour supporter les navigateurs obsolètes.

## Problèmes de déploiement

### 1. Configuration CORS

**Description**: Des problèmes CORS peuvent survenir selon la configuration du serveur CyberArk.

**Contournement**: Déployez l'application sur le même domaine que votre serveur CyberArk ou configurez correctement les règles CORS.

**Statut**: Documentation améliorée prévue dans la V1.1.

### 2. Configuration de proxy inverse

**Description**: Certaines configurations de proxy inverse peuvent nécessiter des ajustements spécifiques.

**Contournement**: Consultez la documentation de déploiement pour les configurations recommandées.

**Statut**: Guide détaillé prévu dans la V1.1.

## Comment signaler un problème

Si vous rencontrez un problème qui n'est pas répertorié ici, veuillez le signaler en fournissant les informations suivantes:

1. Description détaillée du problème
2. Étapes pour reproduire le problème
3. Version de CyberArk utilisée
4. Navigateur et système d'exploitation
5. Captures d'écran si applicable

Envoyez ces informations à [support@example.com](mailto:support@example.com) ou créez une issue sur le dépôt GitHub du projet.

## Mises à jour et corrections

Les corrections pour les problèmes connus sont publiées régulièrement. Consultez les notes de version pour chaque mise à jour afin de connaître les problèmes résolus.

---

Dernière mise à jour: 27 mars 2023 
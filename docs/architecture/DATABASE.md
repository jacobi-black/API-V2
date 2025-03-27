# Architecture de la base de données - V3/V4

Ce document décrit l'architecture de la base de données qui sera implémentée dans les versions futures (V3/V4) de CyberArk API Explorer.

## Vue d'ensemble

L'intégration d'une base de données permettra de stocker et d'analyser les données récupérées via l'API CyberArk, offrant des fonctionnalités avancées comme l'historisation, les rapports et les analyses de tendances.

## Choix technologiques

### Base de données

**PostgreSQL** est recommandé pour plusieurs raisons :

- Support avancé des types JSON pour stocker les données flexibles de l'API
- Performances élevées pour les requêtes complexes
- Capacités d'indexation avancées
- Support transactionnel robuste
- Mature et largement adopté dans l'industrie

### ORM

**TypeORM** est recommandé pour l'intégration avec NestJS :

- Support natif de TypeScript
- Modèles définis par des classes décorées
- Migrations automatisées
- Intégration facile avec NestJS
- Support des relations complexes

## Schéma de la base de données

### Entités principales

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│     User      │       │  ApiRequest   │       │  ApiResponse  │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id            │       │ id            │       │ id            │
│ username      │ 1   * │ name          │ 1   * │ requestId     │
│ email         ├───────┤ endpoint      ├───────┤ timestamp     │
│ passwordHash  │       │ parameters    │       │ statusCode    │
│ role          │       │ userId        │       │ responseData  │
│ lastLogin     │       │ createdAt     │       │ responseTime  │
│ preferences   │       │ updatedAt     │       │ createdAt     │
└───────────────┘       └───────────────┘       └───────────────┘
        │                                                │
        │                                                │
        │ 1                                              │ *
        ▼                                                ▼
┌───────────────┐                               ┌───────────────┐
│ ExportFormat  │                               │   AuditLog    │
├───────────────┤                               ├───────────────┤
│ id            │                               │ id            │
│ name          │                               │ userId        │
│ format        │                               │ action        │
│ fields        │                               │ endpoint      │
│ userId        │                               │ parameters    │
│ createdAt     │                               │ ipAddress     │
│ updatedAt     │                               │ userAgent     │
└───────────────┘                               │ timestamp     │
                                                └───────────────┘
```

### Structure détaillée des tables

#### Users

Table des utilisateurs de l'application.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    last_login TIMESTAMP,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

#### ApiRequests

Table des requêtes API enregistrées par les utilisateurs.

```sql
CREATE TABLE api_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    parameters JSONB DEFAULT '{}',
    favorite BOOLEAN DEFAULT FALSE,
    last_executed TIMESTAMP,
    execution_count INTEGER DEFAULT 0,
    average_response_time INTEGER DEFAULT 0,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_requests_user_id ON api_requests(user_id);
CREATE INDEX idx_api_requests_endpoint ON api_requests(endpoint);
```

#### ApiResponses

Table des réponses API stockées pour analyse et historique.

```sql
CREATE TABLE api_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES api_requests(id) ON DELETE CASCADE,
    status_code INTEGER NOT NULL,
    response_data JSONB NOT NULL,
    response_time INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_responses_request_id ON api_responses(request_id);
CREATE INDEX idx_api_responses_created_at ON api_responses(created_at);
```

#### ExportFormats

Table des formats d'export personnalisés.

```sql
CREATE TABLE export_formats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    format VARCHAR(50) NOT NULL,
    fields JSONB NOT NULL,
    include_headers BOOLEAN DEFAULT TRUE,
    delimiter VARCHAR(10) DEFAULT ',',
    pretty_print BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_export_formats_user_id ON export_formats(user_id);
```

#### AuditLogs

Table pour l'audit des activités utilisateurs.

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255),
    parameters JSONB,
    response_status INTEGER,
    response_time INTEGER,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## Stratégie de migration

La migration vers le stockage en base de données sera progressive :

1. **Phase 1** : Implémentation de la base de données avec tables utilisateurs et préférences
2. **Phase 2** : Ajout du stockage des requêtes API favorites
3. **Phase 3** : Implémentation de l'historique des réponses API
4. **Phase 4** : Ajout des fonctionnalités d'analyse et de reporting

## Optimisations de performances

### Indexation

Des index seront créés pour optimiser les requêtes fréquentes :

- Index sur les clés étrangères
- Index sur les colonnes de tri courantes
- Index sur les champs de recherche fréquents

### Partitionnement

Pour les tables qui grandiront rapidement (ApiResponses, AuditLogs) :

```sql
-- Exemple de partitionnement par plage de dates pour ApiResponses
CREATE TABLE api_responses (
    id UUID NOT NULL,
    request_id UUID NOT NULL,
    status_code INTEGER NOT NULL,
    response_data JSONB NOT NULL,
    response_time INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);

-- Création des partitions par mois
CREATE TABLE api_responses_y2023m01 PARTITION OF api_responses
    FOR VALUES FROM ('2023-01-01') TO ('2023-02-01');

CREATE TABLE api_responses_y2023m02 PARTITION OF api_responses
    FOR VALUES FROM ('2023-02-01') TO ('2023-03-01');
```

### Caching

Une stratégie de cache à plusieurs niveaux sera implémentée :

1. **Cache en mémoire** : Pour les requêtes fréquentes
2. **Redis** : Pour le cache distribué entre instances
3. **Matérialisation** : Vues matérialisées pour les rapports complexes

## Sécurité des données

### Chiffrement

Les données sensibles seront chiffrées dans la base de données :

```sql
-- Extension pgcrypto pour le chiffrement
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Exemple de fonction pour chiffrer/déchiffrer
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT, key TEXT) 
RETURNS TEXT AS $$
BEGIN
    RETURN encode(encrypt(data::bytea, key::bytea, 'aes-cbc/pad:pkcs'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Isolation des données

Le modèle d'accès multi-tenant sera implémenté via :

- Filtrage au niveau de l'application
- Politiques de sécurité RLS (Row Level Security)

```sql
-- Exemple de RLS pour isoler les données par utilisateur
ALTER TABLE api_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY api_requests_isolation ON api_requests
    USING (user_id = current_setting('app.current_user_id')::UUID);
```

## Maintenance et sauvegarde

### Stratégie de sauvegarde

- Sauvegardes complètes quotidiennes
- Journaux de transactions en continu (WAL)
- Rétention de 30 jours minimum

### Maintenance

- Vacuum automatique pour récupérer l'espace
- Analyse des statistiques pour l'optimiseur
- Surveillance des performances

## Plans d'évolution future

### Analyses avancées

Dans les versions ultérieures, des tables d'analyse seront ajoutées :

```sql
-- Table d'analyse des tendances
CREATE TABLE trend_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric VARCHAR(255) NOT NULL,
    time_period TSRANGE NOT NULL,
    aggregation_type VARCHAR(50) NOT NULL,
    value NUMERIC NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table de détection d'anomalies
CREATE TABLE anomaly_detection (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint VARCHAR(255) NOT NULL,
    detection_time TIMESTAMP NOT NULL,
    severity VARCHAR(50) NOT NULL,
    details JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Intégration BI

Les données stockées pourront être exploitées par des outils BI externes :

- Vues dédiées pour l'intégration BI
- API d'export dédiée
- Connecteurs pour outils standards (Tableau, Power BI)
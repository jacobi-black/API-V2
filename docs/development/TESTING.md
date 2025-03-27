# Guide de Tests - CyberArk API Explorer

Ce document détaille la stratégie de tests et la configuration mise en place pour assurer la qualité et la fiabilité de l'application CyberArk API Explorer.

## Table des matières

- [Stratégie de tests](#stratégie-de-tests)
- [Configuration et outils](#configuration-et-outils)
- [Structure des tests](#structure-des-tests)
- [Tests unitaires](#tests-unitaires)
- [Tests d'intégration](#tests-dintégration)
- [Tests end-to-end](#tests-end-to-end)
- [Couverture de tests](#couverture-de-tests)
- [Tests en CI/CD](#tests-en-cicd)
- [Bonnes pratiques](#bonnes-pratiques)

## Stratégie de tests

La stratégie de tests de CyberArk API Explorer suit une approche pyramidale:

1. **Tests unitaires**: Nombreux tests de granularité fine pour les fonctions et composants individuels
2. **Tests d'intégration**: Tests de niveau intermédiaire vérifiant l'interaction entre plusieurs composants
3. **Tests end-to-end**: Tests de haut niveau simulant les parcours utilisateur complets

Cette approche nous permet de détecter rapidement les régressions, d'assurer le bon fonctionnement des interactions entre composants, et de valider l'expérience utilisateur globale.

## Configuration et outils

Le projet utilise les outils suivants pour les tests:

- **Jest**: Framework de test principal
- **React Testing Library**: Tests des composants React
- **JSDOM**: Environnement DOM simulé pour les tests
- **Mock Service Worker (MSW)**: Interception et mock des requêtes réseau

Configuration principale dans:
- `jest.config.js`: Configuration Jest
- `jest.setup.js`: Configuration additionnelle et imports globaux

## Structure des tests

Les tests sont organisés selon la structure suivante:

```
/tests/
  /unit/           # Tests unitaires
  /integration/    # Tests d'intégration
  /e2e/            # Tests end-to-end
```

Chaque fichier de test suit la convention de nommage `[nom].spec.ts` ou `[nom].spec.tsx`.

## Tests unitaires

Les tests unitaires ciblent des fonctions ou composants isolés. Ils sont rapides, nombreux et précis.

### Exemple de test unitaire

```typescript
// tests/unit/utils.spec.ts
import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  it('doit formater une date correctement', () => {
    const testDate = new Date(2023, 5, 15, 14, 30);
    const formattedDate = formatDate(testDate);
    expect(formattedDate).toBe("15/06/2023, 14:30");
  });
});
```

### Modules couverts par les tests unitaires

- `lib/utils.ts`: Fonctions utilitaires générales
- `lib/export/csv-export.ts`: Exports CSV
- `lib/export/json-export.ts`: Exports JSON
- `components/ui/*`: Composants UI réutilisables

## Tests d'intégration

Les tests d'intégration vérifient l'interaction entre plusieurs composants ou modules.

### Exemple de test d'intégration

```typescript
// tests/integration/auth-flow.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CredentialForm } from '@/components/credential/credential-form';
import { useAuthStore } from '@/store/auth.store';

jest.mock('@/store/auth.store');

describe('Flux d\'authentification', () => {
  it('doit appeler login quand le formulaire est soumis', () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      login: jest.fn(),
      credentials: { url: '', username: '', password: '' }
    });
    
    render(<CredentialForm />);
    const form = screen.getByTestId('credential-form');
    fireEvent.submit(form);
    
    expect(useAuthStore().login).toHaveBeenCalledTimes(1);
  });
});
```

### Modules couverts par les tests d'intégration

- Flux d'authentification
- Requêtes API et hook `useCyberArkQuery`
- Stores Zustand et leur interaction
- Formulaires et leur validation

## Tests end-to-end

Les tests end-to-end simulent des parcours utilisateur complets et assurent que toutes les parties de l'application fonctionnent ensemble correctement.

### Exemple de test end-to-end

```typescript
// tests/e2e/user-journey.spec.tsx
describe('Parcours utilisateur E2E', () => {
  it('doit permettre à un utilisateur de se connecter, sélectionner un endpoint et exécuter une requête', async () => {
    // Simuler une connexion
    // ...
    
    // Sélectionner un endpoint
    // ...
    
    // Exécuter une requête
    // ...
    
    // Vérifier les résultats
    // ...
  });
});
```

### Parcours utilisateur testés

1. Connexion → Navigation → Exécution requête → Visualisation résultats → Export
2. Navigation entre différents endpoints
3. Gestion des erreurs API
4. Manipulation des préférences utilisateur

## Couverture de tests

Notre objectif est de maintenir une couverture de tests d'au moins 80% pour garantir la qualité du code.

Pour générer et afficher les rapports de couverture:

```bash
pnpm test:coverage
```

Le rapport détaillé est disponible dans le dossier `/coverage` après exécution.

## Tests en CI/CD

Les tests sont automatiquement exécutés dans notre pipeline CI/CD à chaque pull request et push sur la branche principale.

Configuration dans:
- `.github/workflows/ci.yml`

Fonctionnalités du CI:
- Linting et validation TypeScript
- Exécution de tous les tests
- Génération de rapports de couverture
- Échec du build si la couverture est inférieure au seuil minimum

## Bonnes pratiques

- **Isolation**: Chaque test doit être indépendant et ne pas dépendre d'autres tests
- **Prévisibilité**: Éviter les dépendances externes réelles, préférer les mocks
- **Lisibilité**: Tests clairs avec arrange-act-assert (AAA) pattern
- **Maintenance**: Grouper logiquement les tests et éviter la duplication
- **Snapshots**: Utiliser avec parcimonie, préférer les assertions explicites
- **Données de test**: Utiliser des factory functions pour générer des données de test

### Comment ajouter de nouveaux tests

1. Identifier la partie à tester
2. Choisir le niveau de test approprié (unitaire, intégration, e2e)
3. Créer le fichier `.spec.ts(x)` dans le dossier correspondant
4. Implémenter les tests en suivant les patterns existants
5. Vérifier la couverture locale
6. Soumettre une pull request

## Ressources supplémentaires

- [Documentation Jest](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Tests avec Next.js](https://nextjs.org/docs/testing)

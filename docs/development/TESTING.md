# Stratégie de tests - CyberArk API Explorer

Ce document décrit la stratégie de tests complète pour CyberArk API Explorer, visant à atteindre une couverture de code de 80% minimum.

## Objectifs des tests

Les objectifs principaux de notre stratégie de tests sont:

1. **Fiabilité** - Assurer que l'application fonctionne comme prévu dans toutes les conditions
2. **Régression** - Détecter rapidement les problèmes de régression lors de l'ajout de nouvelles fonctionnalités
3. **Couverture** - Maintenir une couverture de code d'au moins 80%
4. **Documentation** - Fournir des exemples fonctionnels de l'utilisation des composants et APIs

## Types de tests

### 1. Tests unitaires

Les tests unitaires se concentrent sur les plus petites unités de code testables isolément.

#### Cibles principales:

- Fonctions utilitaires
- Hooks React personnalisés
- Composants React isolés
- Validation des schémas Zod
- Stores Zustand individuels

#### Outils:

- Jest
- React Testing Library
- @testing-library/hooks

#### Exemple:

```typescript
// lib/utils/url-helpers.spec.ts
import { buildApiUrl } from './url-helpers';

describe('buildApiUrl', () => {
  it('should build a correct URL with query parameters', () => {
    const baseUrl = 'https://api.example.com';
    const endpoint = '/users';
    const params = { filter: 'active', sort: 'name' };
    
    const result = buildApiUrl(baseUrl, endpoint, params);
    
    expect(result).toBe('https://api.example.com/users?filter=active&sort=name');
  });
});
```

### 2. Tests d'intégration

Les tests d'intégration vérifient les interactions entre différentes parties de l'application.

#### Cibles principales:

- API proxy Routes
- Flux d'authentification
- Interaction entre composants
- Interactions avec les stores globaux

#### Outils:

- Jest
- React Testing Library
- MSW (Mock Service Worker)

#### Exemple:

```typescript
// tests/integration/auth-flow.spec.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { AuthProvider } from '@/components/auth/auth-provider';
import { LoginForm } from '@/components/auth/login-form';

const server = setupServer(
  rest.post('/api/cyberark/auth/Logon', (req, res, ctx) => {
    return res(ctx.json({ token: 'mock-token' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Authentication Flow', () => {
  it('should authenticate user and store token', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    // Fill login form
    fireEvent.change(screen.getByLabelText(/username/i), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'password123' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Verify authenticated state
    await waitFor(() => {
      expect(screen.getByText(/logged in/i)).toBeInTheDocument();
    });
  });
});
```

### 3. Tests end-to-end (E2E)

Les tests E2E simulent les interactions d'utilisateurs réels avec l'application complète.

#### Cibles principales:

- Parcours utilisateur complets
- Authentification et navigation
- Exploration d'endpoints API
- Exportation de données

#### Outils:

- Cypress
- Playwright

#### Exemple:

```typescript
// cypress/e2e/api-exploration.cy.ts
describe('API Exploration', () => {
  beforeEach(() => {
    // Mock login
    cy.intercept('POST', '/api/cyberark/auth/Logon', {
      body: { token: 'mock-token' }
    });
    
    // Login
    cy.visit('/');
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
  });
  
  it('should allow exploring and selecting an API endpoint', () => {
    // Navigate to endpoint explorer
    cy.get('[data-testid="navbar-link-explore"]').click();
    
    // Select Accounts category
    cy.get('[data-testid="category-accounts"]').click();
    
    // Select specific endpoint
    cy.get('[data-testid="endpoint-get-accounts"]').click();
    
    // Verify endpoint details are displayed
    cy.get('[data-testid="endpoint-title"]')
      .should('contain.text', 'Get accounts');
    
    // Configure endpoint parameters
    cy.get('[data-testid="param-filter"]')
      .type('safeName eq "MySafe"');
    
    // Execute request
    cy.get('[data-testid="execute-button"]').click();
    
    // Verify results are displayed
    cy.get('[data-testid="results-container"]')
      .should('be.visible');
  });
});
```

### 4. Tests de snapshot

Les tests de snapshot capturent l'état du rendu des composants UI pour détecter les changements inattendus.

#### Cibles principales:

- Composants UI
- Pages
- Messages d'erreur

#### Outils:

- Jest Snapshot Testing

#### Exemple:

```typescript
// components/ui/button.spec.tsx
import { render } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('matches snapshot for primary variant', () => {
    const { container } = render(
      <Button variant="primary">Click Me</Button>
    );
    expect(container).toMatchSnapshot();
  });
  
  it('matches snapshot for secondary variant', () => {
    const { container } = render(
      <Button variant="secondary">Click Me</Button>
    );
    expect(container).toMatchSnapshot();
  });
});
```

## Organisation des tests

### Structure des dossiers

```
API_V2/
├── tests/
│   ├── unit/               # Tests unitaires
│   │   ├── components/     # Tests de composants
│   │   ├── hooks/          # Tests de hooks
│   │   ├── lib/            # Tests d'utilitaires
│   │   └── store/          # Tests de stores
│   ├── integration/        # Tests d'intégration
│   ├── e2e/                # Tests end-to-end
│   └── __mocks__/          # Mocks globaux
├── cypress/                # Configuration Cypress
│   ├── e2e/                # Tests e2e Cypress
│   ├── fixtures/           # Données de test
│   └── support/            # Support code
└── jest.config.js          # Configuration Jest
```

### Convention de nommage

- Tests unitaires: `[filename].spec.ts`
- Tests d'intégration: `[feature].spec.ts`
- Tests E2E: `[flow].cy.ts`

## Mocking

### Mocking des API CyberArk

Pour les tests, nous mockons toutes les API CyberArk externes pour:

1. Assurer la stabilité des tests
2. Éviter de dépendre d'une infrastructure externe
3. Simuler divers scénarios, y compris les cas d'erreur

```typescript
// tests/__mocks__/cyberark-api.ts
export const mockCyberArkResponses = {
  auth: {
    success: { token: 'mock-valid-token' },
    failure: { error: 'Authentication failed' }
  },
  accounts: {
    list: [
      {
        id: 'account1',
        name: 'Test Account',
        safeName: 'TestSafe',
        // ...autres propriétés
      }
    ]
  },
  // ...autres endpoints
};
```

### Mocking des composants UI

Pour isoler les composants lors des tests unitaires, nous utilisons les mocks de composants:

```typescript
// tests/__mocks__/ui-components.tsx
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, ...props }) => (
    <div data-testid="mock-dialog" {...props}>
      {children}
    </div>
  )
}));
```

## Environnement CI/CD

Notre pipeline CI/CD exécute tous les tests automatiquement:

1. Tests unitaires et d'intégration sur chaque commit
2. Tests E2E sur les pull requests
3. Tests de couverture sur les pull requests

### Configuration GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm test:unit
      
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm test:integration
      
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test:e2e
      
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v2
```

## Rapports de couverture

Nous générons des rapports de couverture après chaque exécution de tests:

```json
// jest.config.js
{
  "collectCoverage": true,
  "coverageDirectory": "coverage",
  "coverageReporters": ["text", "lcov", "html"],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

## Bonnes pratiques

1. **Tests d'abord (TDD)** - Écrivez les tests avant le code quand c'est possible
2. **Tests isolés** - Chaque test doit être indépendant et ne pas dépendre d'autres tests
3. **Tests rapides** - Les tests doivent s'exécuter rapidement pour faciliter le développement
4. **Tests lisibles** - Utilisez des noms descriptifs et structurez clairement les tests
5. **Tests maintenables** - Évitez la duplication et utilisez des utilitaires de test

## Conclusion

Cette stratégie de tests complète et rigoureuse garantit une application fiable et maintenable. En suivant ces pratiques, nous atteindrons notre objectif de 80% de couverture de code tout en assurant une expérience utilisateur de qualité.

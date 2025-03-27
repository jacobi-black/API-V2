import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import React, { useState } from 'react';

// Ce test simule un parcours utilisateur complet dans l'application
// Note: Dans un environnement de production, ces tests E2E seraient
// plutôt implémentés avec Cypress, Playwright ou un outil similaire

// Mocks globaux
global.fetch = jest.fn();

// Mock des stores Zustand
jest.mock('@/store/auth.store', () => {
  let isLoggedIn = false;
  let token = null;
  
  return {
    useAuthStore: jest.fn(() => ({
      isLoggedIn,
      token,
      credentials: {
        url: 'https://test.cyberark.cloud',
        username: '',
        password: ''
      },
      setCredentials: jest.fn((creds) => {
        // Mise à jour des credentials
      }),
      login: jest.fn(async () => {
        // Simuler un login réussi
        isLoggedIn = true;
        token = 'test-token';
        return true;
      }),
      logout: jest.fn(() => {
        isLoggedIn = false;
        token = null;
      })
    }))
  };
});

jest.mock('@/store/endpoint.store', () => {
  let selectedEndpointId = null;
  
  const endpoints = [
    {
      id: 'accounts-list',
      name: 'Liste des comptes',
      category: 'Comptes',
      path: '/API/Accounts',
      description: 'Récupère la liste des comptes'
    },
    {
      id: 'safes-list',
      name: 'Liste des coffres',
      category: 'Coffres',
      path: '/API/Safes',
      description: 'Récupère la liste des coffres'
    }
  ];
  
  return {
    useEndpointStore: jest.fn(() => ({
      endpoints,
      categories: ['Comptes', 'Coffres'],
      selectedEndpointId,
      selectEndpoint: jest.fn((id) => {
        selectedEndpointId = id;
      }),
      getEndpoint: jest.fn((id) => endpoints.find(e => e.id === id))
    }))
  };
});

// Mock des composants
jest.mock('@/components/credential/credential-form', () => ({
  CredentialForm: ({ onSubmit }) => (
    <form
      data-testid="mock-credential-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit();
      }}
    >
      <input data-testid="url-input" placeholder="URL" />
      <input data-testid="username-input" placeholder="Username" />
      <input data-testid="password-input" placeholder="Password" type="password" />
      <button type="submit" data-testid="login-button">Login</button>
    </form>
  )
}));

jest.mock('@/components/endpoint/endpoint-explorer', () => ({
  EndpointExplorer: () => (
    <div data-testid="mock-endpoint-explorer">
      <div data-testid="endpoint-accounts-list" onClick={() => selectEndpoint('accounts-list')}>
        Comptes
      </div>
      <div data-testid="endpoint-safes-list" onClick={() => selectEndpoint('safes-list')}>
        Coffres
      </div>
    </div>
  )
}));

jest.mock('@/components/endpoint/endpoint-detail', () => ({
  EndpointDetail: ({ endpointId, onExecute }) => (
    <div data-testid="mock-endpoint-detail">
      Détails de l'endpoint: {endpointId}
      <button data-testid="execute-button" onClick={onExecute}>Exécuter</button>
    </div>
  )
}));

jest.mock('@/components/results/results-viewer', () => ({
  ResultsViewer: ({ data }) => (
    <div data-testid="mock-results-viewer">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button data-testid="export-button">Exporter</button>
    </div>
  )
}));

// Fonctions de support pour le test
function selectEndpoint(id) {
  const { useEndpointStore } = require('@/store/endpoint.store');
  useEndpointStore().selectEndpoint(id);
}

// Fonction pour simuler une réponse API
function mockApiResponse(data) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValue({ data })
  });
}

// Composant App simplifié pour le test
function MockApp() {
  const { isLoggedIn, login } = require('@/store/auth.store').useAuthStore();
  const { selectedEndpointId } = require('@/store/endpoint.store').useEndpointStore();
  
  const [results, setResults] = useState(null);
  
  const handleLogin = async () => {
    await login();
  };
  
  const handleExecuteQuery = async () => {
    // Simuler une requête API
    const response = await fetch('/api/mock');
    const result = await response.json();
    setResults(result.data);
  };
  
  return (
    <div>
      {!isLoggedIn ? (
        <div data-testid="login-section">
          <h1>Connexion</h1>
          <CredentialForm onSubmit={handleLogin} />
        </div>
      ) : (
        <div data-testid="main-app">
          <div className="sidebar">
            <EndpointExplorer />
          </div>
          <div className="content">
            {selectedEndpointId && (
              <EndpointDetail 
                endpointId={selectedEndpointId} 
                onExecute={handleExecuteQuery}
              />
            )}
            {results && <ResultsViewer data={results} />}
          </div>
        </div>
      )}
    </div>
  );
}

// Import des composants mockés
const { CredentialForm } = require('@/components/credential/credential-form');
const { EndpointExplorer } = require('@/components/endpoint/endpoint-explorer');
const { EndpointDetail } = require('@/components/endpoint/endpoint-detail');
const { ResultsViewer } = require('@/components/results/results-viewer');

describe('Parcours utilisateur E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Réinitialiser l'état des stores mockés
    jest.resetModules();
  });
  
  it('doit permettre à un utilisateur de se connecter, sélectionner un endpoint et exécuter une requête', async () => {
    const { useAuthStore } = require('@/store/auth.store');
    
    // Rendre l'application
    render(<MockApp />);
    
    // 1. Étape de connexion
    expect(screen.getByTestId('login-section')).toBeInTheDocument();
    
    // Remplir et soumettre le formulaire
    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);
    
    // Vérifier que login a été appelé
    await waitFor(() => {
      expect(useAuthStore().login).toHaveBeenCalledTimes(1);
    });
    
    // Mettre à jour le rendu après connexion
    const { rerender } = render(<MockApp />);
    
    // 2. Sélectionner un endpoint
    expect(screen.getByTestId('main-app')).toBeInTheDocument();
    expect(screen.getByTestId('mock-endpoint-explorer')).toBeInTheDocument();
    
    // Cliquer sur un endpoint
    const accountsEndpoint = screen.getByTestId('endpoint-accounts-list');
    fireEvent.click(accountsEndpoint);
    
    // Vérifier que l'endpoint a été sélectionné
    const { useEndpointStore } = require('@/store/endpoint.store');
    expect(useEndpointStore().selectEndpoint).toHaveBeenCalledWith('accounts-list');
    
    // Mettre à jour le rendu après sélection de l'endpoint
    rerender(<MockApp />);
    
    // 3. Exécuter une requête
    expect(screen.getByTestId('mock-endpoint-detail')).toBeInTheDocument();
    
    // Préparer la réponse API simulée
    const mockData = [
      { id: 1, name: "Compte 1" },
      { id: 2, name: "Compte 2" }
    ];
    mockApiResponse(mockData);
    
    // Cliquer sur le bouton d'exécution
    const executeButton = screen.getByTestId('execute-button');
    fireEvent.click(executeButton);
    
    // Attendre que la requête soit traitée
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    
    // Mettre à jour le rendu après réception des résultats
    rerender(<MockApp />);
    
    // 4. Vérifier l'affichage des résultats
    expect(screen.getByTestId('mock-results-viewer')).toBeInTheDocument();
    
    // Vérifier que les données sont correctement affichées
    const resultsText = screen.getByText(JSON.stringify(mockData, null, 2));
    expect(resultsText).toBeInTheDocument();
    
    // 5. Exporter les résultats
    const exportButton = screen.getByTestId('export-button');
    expect(exportButton).toBeInTheDocument();
  });
  
  it('doit permettre de naviguer entre différents endpoints', async () => {
    // Simuler un utilisateur déjà connecté
    const { useAuthStore } = require('@/store/auth.store');
    (useAuthStore as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      token: 'test-token',
      credentials: {
        url: 'https://test.cyberark.cloud',
        username: 'testuser',
        password: '*****'
      },
      login: jest.fn(),
      logout: jest.fn()
    });
    
    // Rendre l'application
    render(<MockApp />);
    
    // Vérifier que l'utilisateur est dans l'application principale
    expect(screen.getByTestId('main-app')).toBeInTheDocument();
    
    // Sélectionner un endpoint
    const accountsEndpoint = screen.getByTestId('endpoint-accounts-list');
    fireEvent.click(accountsEndpoint);
    
    // Vérifier la sélection
    const { useEndpointStore } = require('@/store/endpoint.store');
    expect(useEndpointStore().selectEndpoint).toHaveBeenCalledWith('accounts-list');
    
    // Mettre à jour le rendu
    const { rerender } = render(<MockApp />);
    expect(screen.getByText(/Détails de l'endpoint: accounts-list/)).toBeInTheDocument();
    
    // Sélectionner un autre endpoint
    const safesEndpoint = screen.getByTestId('endpoint-safes-list');
    fireEvent.click(safesEndpoint);
    
    // Vérifier la nouvelle sélection
    expect(useEndpointStore().selectEndpoint).toHaveBeenCalledWith('safes-list');
    
    // Mettre à jour le rendu
    rerender(<MockApp />);
    
    // Vérifier que les détails de l'endpoint ont changé
    expect(screen.getByText(/Détails de l'endpoint: safes-list/)).toBeInTheDocument();
  });
  
  it('doit gérer les erreurs de requête API', async () => {
    // Simuler un utilisateur déjà connecté
    const { useAuthStore } = require('@/store/auth.store');
    (useAuthStore as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      token: 'test-token',
      credentials: {
        url: 'https://test.cyberark.cloud',
        username: 'testuser',
        password: '*****'
      },
      login: jest.fn(),
      logout: jest.fn()
    });
    
    // Simuler une erreur API
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: jest.fn().mockResolvedValue({ 
        error: "Accès refusé" 
      })
    });
    
    // Composant spécial pour tester les erreurs
    function ErrorTestApp() {
      const [results, setResults] = useState(null);
      const [error, setError] = useState(null);
      
      const handleExecute = async () => {
        try {
          const response = await fetch('/api/mock');
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
          }
          const data = await response.json();
          setResults(data);
        } catch (err) {
          setError(err.message);
        }
      };
      
      return (
        <div>
          <button data-testid="error-test-button" onClick={handleExecute}>
            Tester l'erreur
          </button>
          {error && <div data-testid="error-message">{error}</div>}
        </div>
      );
    }
    
    render(<ErrorTestApp />);
    
    // Déclencher la requête
    const testButton = screen.getByTestId('error-test-button');
    fireEvent.click(testButton);
    
    // Vérifier que l'erreur est affichée
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Accès refusé');
    });
  });
});

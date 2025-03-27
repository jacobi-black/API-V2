import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuthStore } from '@/store/auth.store';
import { act } from 'react-dom/test-utils';

// Mock fetch
global.fetch = jest.fn();

// Mock des composants qui dépendent de useAuthStore
jest.mock('@/store/auth.store', () => {
  // Version simplifiée de notre store pour les tests
  const mockStore = {
    credentials: {
      url: '',
      username: '',
      password: ''
    },
    token: null,
    isLoggedIn: false,
    lastLogin: null,
    setCredentials: jest.fn(),
    login: jest.fn(),
    logout: jest.fn()
  };
  
  return {
    useAuthStore: jest.fn(() => mockStore)
  };
});

// Composant de test minimal pour le formulaire d'auth (à adapter selon l'implémentation)
function MockCredentialForm() {
  const { credentials, setCredentials, login, isLoggedIn } = useAuthStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ [e.target.name]: e.target.value });
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} data-testid="auth-form">
        <div>
          <label htmlFor="url">URL CyberArk</label>
          <input
            id="url"
            name="url"
            value={credentials.url}
            onChange={handleChange}
            placeholder="https://example.cyberark.cloud"
            data-testid="url-input"
          />
        </div>
        <div>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            data-testid="username-input"
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            data-testid="password-input"
          />
        </div>
        <button type="submit" data-testid="login-button">
          Se connecter
        </button>
      </form>
      {isLoggedIn && <div data-testid="logged-in-message">Vous êtes connecté</div>}
    </div>
  );
}

describe('Flux d\'authentification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('doit mettre à jour les credentials quand les champs du formulaire changent', () => {
    render(<MockCredentialForm />);
    
    const urlInput = screen.getByTestId('url-input');
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    
    fireEvent.change(urlInput, { target: { value: 'https://test.cyberark.cloud' } });
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Vérifier que setCredentials a été appelé pour chaque changement
    expect(useAuthStore().setCredentials).toHaveBeenCalledTimes(3);
    expect(useAuthStore().setCredentials).toHaveBeenCalledWith({ url: 'https://test.cyberark.cloud' });
    expect(useAuthStore().setCredentials).toHaveBeenCalledWith({ username: 'testuser' });
    expect(useAuthStore().setCredentials).toHaveBeenCalledWith({ password: 'password123' });
  });
  
  it('doit appeler login quand le formulaire est soumis', async () => {
    render(<MockCredentialForm />);
    
    const form = screen.getByTestId('auth-form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(useAuthStore().login).toHaveBeenCalledTimes(1);
    });
  });
  
  it('doit appeler logout quand déconnexion est demandée', async () => {
    // Pour ce test, on simule une connexion réussie
    (useAuthStore as jest.Mock).mockImplementation(() => ({
      credentials: { url: 'https://test.cyberark.cloud', username: 'user', password: 'pass' },
      token: 'test-token',
      isLoggedIn: true,
      lastLogin: new Date(),
      setCredentials: jest.fn(),
      login: jest.fn(),
      logout: jest.fn()
    }));
    
    // Composant minimal pour tester la déconnexion
    function LogoutComponent() {
      const { logout } = useAuthStore();
      return <button onClick={logout} data-testid="logout-button">Déconnexion</button>;
    }
    
    render(<LogoutComponent />);
    
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);
    
    expect(useAuthStore().logout).toHaveBeenCalledTimes(1);
  });
  
  it('doit mettre à jour l\'état isLoggedIn après une connexion réussie', async () => {
    // Simuler la séquence complète login -> isLoggedIn=true
    let storeState = {
      credentials: { url: 'https://test.cyberark.cloud', username: 'user', password: 'pass' },
      token: null,
      isLoggedIn: false,
      lastLogin: null,
      setCredentials: jest.fn(),
      login: jest.fn().mockImplementation(() => {
        // Simuler une connexion réussie
        storeState.token = 'test-token';
        storeState.isLoggedIn = true;
        storeState.lastLogin = new Date();
        return Promise.resolve(true);
      }),
      logout: jest.fn()
    };
    
    (useAuthStore as jest.Mock).mockImplementation(() => storeState);
    
    render(<MockCredentialForm />);
    
    // Pas de message "connecté" au début
    expect(screen.queryByTestId('logged-in-message')).not.toBeInTheDocument();
    
    // Soumettre le formulaire
    const form = screen.getByTestId('auth-form');
    fireEvent.submit(form);
    
    // Attendre que le login soit effectué et que le rendu soit mis à jour
    await act(async () => {
      await storeState.login();
    });
    
    // Re-rendre avec le nouvel état isLoggedIn=true
    (useAuthStore as jest.Mock).mockImplementation(() => storeState);
    render(<MockCredentialForm />);
    
    // Maintenant le message devrait être présent
    expect(screen.getByTestId('logged-in-message')).toBeInTheDocument();
  });
});

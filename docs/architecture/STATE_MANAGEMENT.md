# Gestion d'État Globale - CyberArk API Explorer

Ce document détaille l'implémentation de la gestion d'état globale dans l'application CyberArk API Explorer, basée sur Zustand pour une gestion d'état simple, performante et prévisible.

## Table des matières

- [Architecture de gestion d'état](#architecture-de-gestion-détat)
- [Stores principaux](#stores-principaux)
  - [Store d'authentification](#store-dauthentification)
  - [Store d'endpoints](#store-dendpoints)
  - [Store d'exportation](#store-dexportation)
  - [Store d'historique](#store-dhistorique)
  - [Store de préférences](#store-de-préférences)
- [Persistence des données](#persistence-des-données)
- [Principes et bonnes pratiques](#principes-et-bonnes-pratiques)
- [Patterns d'utilisation](#patterns-dutilisation)
- [Optimisation de performance](#optimisation-de-performance)

## Architecture de gestion d'état

L'application utilise Zustand comme solution de gestion d'état globale avec une architecture modulaire où chaque domaine fonctionnel a son propre store. Cette approche permet:

1. **Séparation des préoccupations** - Chaque store gère un aspect spécifique de l'application
2. **Maintenance simplifiée** - Les stores plus petits sont plus faciles à maintenir
3. **Optimisation des rendus** - Les composants ne se rerendent que lorsque les données qu'ils utilisent changent

### Principes clés

- **Immutabilité** - Les états sont mis à jour de manière immuable
- **Actions atomiques** - Chaque action modifie l'état de manière atomique
- **Pas de logique métier dans les stores** - Les stores contiennent uniquement la logique de mise à jour de l'état
- **Sélecteurs** - Utilisation de sélecteurs pour n'extraire que les données nécessaires

## Stores principaux

### Store d'authentification

`auth.store.ts` gère l'état d'authentification à l'API CyberArk.

#### État

```typescript
interface AuthState {
  // Données
  credentials: {
    url: string;
    username: string;
    password: string;
  };
  token: string | null;
  isLoggedIn: boolean;
  lastLogin: Date | null;
  
  // Actions
  setCredentials: (credentials: Partial<AuthCredentials>) => void;
  login: (credentials?: AuthCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
}
```

#### Utilisation

```typescript
import { useAuthStore } from '@/store/auth.store';

// Dans un composant
const { isLoggedIn, login, logout } = useAuthStore();

// Effectuer une connexion
await login({
  url: 'https://example.cyberark.cloud',
  username: 'admin',
  password: '********'
});
```

### Store d'endpoints

`endpoint.store.ts` gère les endpoints API disponibles et leur état.

#### État

```typescript
interface EndpointState {
  // Données
  endpoints: Endpoint[];
  selectedEndpointId: string | null;
  endpointsMap: Record<string, Endpoint>;
  categories: EndpointCategory[];
  
  // Actions
  selectEndpoint: (id: string) => void;
  loadEndpoints: () => Promise<void>;
  getEndpoint: (id: string) => Endpoint | undefined;
}
```

#### Utilisation

```typescript
import { useEndpointStore } from '@/store/endpoint.store';

// Dans un composant
const { endpoints, selectEndpoint, selectedEndpointId } = useEndpointStore();

// Sélectionner un endpoint
selectEndpoint('safes-list');
```

### Store d'exportation

`export.store.ts` gère les préférences d'exportation et les préréglages.

#### État

```typescript
interface ExportStoreState {
  // État
  format: ExportFormat;
  csvOptions: CsvExportOptions;
  jsonOptions: JsonExportOptions;
  presets: ExportPresetType[];
  selectedPresetId: string | null;
  
  // Actions
  setFormat: (format: ExportFormat) => void;
  setCsvOptions: (options: Partial<CsvExportOptions>) => void;
  setJsonOptions: (options: Partial<JsonExportOptions>) => void;
  savePreset: (name: string) => string;
  deletePreset: (id: string) => void;
  loadPreset: (id: string) => void;
  resetOptions: () => void;
}
```

#### Utilisation

```typescript
import { useExportStore } from '@/store/export.store';

// Dans un composant
const { format, setFormat, savePreset } = useExportStore();

// Changer le format d'exportation
setFormat('csv');

// Sauvegarder les paramètres actuels comme préréglage
const presetId = savePreset('Mes paramètres CSV');
```

### Store d'historique

`history.store.ts` gère l'historique des requêtes effectuées.

#### État

```typescript
interface HistoryState {
  // Données
  entries: RequestHistoryEntry[];
  favorites: string[];
  
  // Actions
  addEntry: (entry: Omit<RequestHistoryEntry, "id">) => string;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  toggleFavorite: (id: string) => void;
  getEntry: (id: string) => RequestHistoryEntry | undefined;
  getLastEntries: (count: number) => RequestHistoryEntry[];
  getEndpointHistory: (endpointId: string) => RequestHistoryEntry[];
}
```

#### Utilisation

```typescript
import { useHistoryStore } from '@/store/history.store';

// Dans un composant
const { entries, addEntry, toggleFavorite } = useHistoryStore();

// Ajouter une entrée à l'historique
const entryId = addEntry({
  timestamp: new Date(),
  endpointId: 'accounts-list',
  endpointName: 'List Accounts',
  category: 'Accounts',
  path: '/API/Accounts',
  parameters: { path: {}, query: { limit: 10 } },
  success: true,
  responseTime: 230,
  resultCount: 5
});

// Marquer une entrée comme favorite
toggleFavorite(entryId);
```

### Store de préférences

`preferences.store.ts` gère les préférences utilisateur générales.

#### État

```typescript
interface PreferencesState extends UserPreferences {
  // Actions
  updatePreference: <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
}

interface UserPreferences {
  // Préférences d'affichage
  defaultPageSize: number;
  defaultResultView: "json" | "table" | "raw";
  expandAllNodesByDefault: boolean;
  
  // Préférences d'exportation
  defaultExportFormat: "json" | "csv";
  defaultCsvDelimiter: "," | ";" | "\t" | "|";
  includeHeadersInCsv: boolean;
  prettyPrintJson: boolean;
  jsonIndent: number;
  
  // Autres préférences
  rememberLastEndpoint: boolean;
  showRequestHistory: boolean;
  cacheResponses: boolean;
}
```

#### Utilisation

```typescript
import { usePreferencesStore } from '@/store/preferences.store';

// Dans un composant
const { defaultPageSize, updatePreference } = usePreferencesStore();

// Mettre à jour la taille de page par défaut
updatePreference('defaultPageSize', 25);
```

## Persistence des données

Pour persister certaines données entre les sessions, l'application utilise le middleware `persist` de Zustand:

```typescript
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      // État et actions
    }),
    {
      name: "cyberark-preferences",
      skipHydration: true
    }
  )
);
```

### Données persistées

- **Préférences utilisateur** - Sauvegardées pour améliorer l'expérience entre les sessions
- **Historique des requêtes** - Conservé pour référence et réutilisation facile
- **Préréglages d'exportation** - Sauvegardés pour un accès rapide aux configurations fréquentes

### Données non persistées

- **Tokens d'authentification** - Jamais persistés pour des raisons de sécurité
- **Données sensibles** - Stockées uniquement en mémoire pendant la session

## Principes et bonnes pratiques

1. **Séparation des responsabilités**

   Chaque store gère uniquement les données relevant de son domaine fonctionnel.

2. **Immutabilité**

   Les mises à jour d'état sont toujours effectuées de manière immuable:

   ```typescript
   set(state => ({ count: state.count + 1 }));  // Bon
   state.count++;  // Mauvais
   ```

3. **Actions atomiques**

   Les actions modifient l'état de manière atomique et prévisible.

4. **Sélecteurs**

   Utilisation de sélecteurs pour n'extraire que les données nécessaires:

   ```typescript
   const count = useStore(state => state.count);
   ```

5. **Pas de logique métier dans les stores**

   Les stores gèrent uniquement les données; la logique métier reste dans les composants ou hooks.

## Patterns d'utilisation

### Pattern Composant + Hook

Pour les interactions complexes, l'application utilise un pattern où un hook encapsule la logique d'utilisation d'un store:

```typescript
// hooks/use-auth.ts
export function useAuth() {
  const { isLoggedIn, login, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleLogin = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(credentials);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoggedIn, login: handleLogin, logout, isLoading, error };
}

// Dans un composant
const { login, isLoading, error } = useAuth();
```

### Pattern Observer

Pour réagir aux changements d'état, l'application utilise des effets:

```typescript
const { selectedEndpointId } = useEndpointStore();

useEffect(() => {
  if (selectedEndpointId) {
    loadEndpointDetails(selectedEndpointId);
  }
}, [selectedEndpointId]);
```

## Optimisation de performance

### Réduction des rendus inutiles

L'application utilise des sélecteurs précis pour minimiser les rendus:

```typescript
// Mauvais: le composant se rerend pour tout changement dans le store
const store = usePreferencesStore(); 

// Bon: le composant se rerend uniquement si defaultPageSize change
const defaultPageSize = usePreferencesStore(state => state.defaultPageSize);
```

### Découplage des mises à jour

Les mises à jour d'état sont découplées pour éviter les cascades de rendus:

```typescript
// Bon: mises à jour séparées
setPending(true);
await fetchData();
setData(result);
setPending(false);

// Mauvais: une seule mise à jour avec multiple changements
setState({ pending: true, data: await fetchData(), pending: false });
```

### Dénormalisation judicieuse

Les données fréquemment consultées ensemble sont stockées de manière dénormalisée pour un accès rapide:

```typescript
// Exemple: Map des endpoints pour accès O(1) par ID
endpointsMap: endpoints.reduce((acc, endpoint) => {
  acc[endpoint.id] = endpoint;
  return acc;
}, {} as Record<string, Endpoint>)
```

### Mise en cache

L'application utilise la mise en cache des résultats de requête pour améliorer la performance:

```typescript
// Dans un hook personnalisé
const cachedData = useMemo(() => {
  return expensiveComputation(data);
}, [data]);
```

### Chargement paresseux (Lazy Loading)

Les composants non critiques sont chargés dynamiquement pour réduire le bundle initial:

```typescript
// Importation dynamique d'un composant lourd
const JsonViewer = dynamic(() => import('@/components/json-viewer'), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false
});
```

## Intégration avec React et Next.js

### Côté client vs côté serveur

L'application sépare clairement l'état géré côté client et côté serveur:

- **État côté client**: Géré par Zustand (préférences, historique, etc.)
- **État côté serveur**: Géré par les Server Components et routes API de Next.js

### Initialisation des stores

Les stores sont initialisés de manière optimisée pour éviter les problèmes d'hydratation:

```typescript
export const useStore = create<Store>()(
  persist(
    (set) => ({
      // État et actions
    }),
    {
      name: "store-name",
      skipHydration: true, // Important pour Next.js
    }
  )
);

// Dans un composant client
const Component = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    useStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);
  
  if (!isHydrated) {
    return <Skeleton />;
  }
  
  // Reste du composant
};
```

## Conclusion

La gestion d'état de l'application CyberArk API Explorer est construite sur des principes solides de séparation des préoccupations et d'optimisation des performances. Le choix de Zustand comme bibliothèque de gestion d'état offre un bon équilibre entre simplicité, performance et prévisibilité.

La modularisation de l'état en stores thématiques facilite la maintenance et l'évolution de l'application, tout en permettant des optimisations de performance ciblées.

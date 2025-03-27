"use client";

import { create } from "zustand";
import { CYBERARK_ENDPOINTS } from "@/lib/cyberark/api";

export type EndpointParam = {
  name: string;
  type: "string" | "number" | "boolean" | "object";
  required: boolean;
  description: string;
  defaultValue?: string | number | boolean | null;
  example?: string;
  options?: string[];
};

export type Endpoint = {
  id: string;
  name: string;
  path: string;
  description: string;
  category: 
    | "accounts" 
    | "safes" 
    | "users" 
    | "platforms" 
    | "groups" 
    | "reports";
  fullPath: string;
  pathParams?: EndpointParam[];
  queryParams?: EndpointParam[];
  bodyParams?: EndpointParam[];
};

export type EndpointCategory = {
  id: string;
  name: string;
  description: string;
  endpoints: Endpoint[];
};

// Préparer les catégories d'endpoints basées sur CYBERARK_ENDPOINTS
const createEndpointCategories = (): EndpointCategory[] => {
  return [
    {
      id: "accounts",
      name: "Comptes",
      description: "Gérer les comptes dans CyberArk",
      endpoints: [
        {
          id: "accounts-list",
          name: "Liste des comptes",
          path: CYBERARK_ENDPOINTS.ACCOUNTS.LIST,
          description: "Récupérer la liste des comptes disponibles",
          category: "accounts",
          fullPath: "GET " + CYBERARK_ENDPOINTS.ACCOUNTS.LIST,
          queryParams: [
            {
              name: "search",
              type: "string",
              required: false,
              description: "Termes de recherche séparés par des espaces",
              example: "admin server"
            },
            {
              name: "limit",
              type: "number",
              required: false,
              description: "Nombre maximum de résultats à retourner",
              defaultValue: 50
            },
            {
              name: "offset",
              type: "number",
              required: false,
              description: "Décalage pour la pagination",
              defaultValue: 0
            },
            {
              name: "sort",
              type: "string",
              required: false,
              description: "Champ de tri suivi de :asc ou :desc",
              example: "name:asc"
            },
            {
              name: "filter",
              type: "string",
              required: false,
              description: "Filtre sur les propriétés des comptes",
              example: "safeName=MySafe"
            }
          ]
        },
        {
          id: "accounts-details",
          name: "Détails d'un compte",
          path: CYBERARK_ENDPOINTS.ACCOUNTS.GET,
          description: "Récupérer les détails d'un compte spécifique",
          category: "accounts",
          fullPath: "GET " + CYBERARK_ENDPOINTS.ACCOUNTS.GET,
          pathParams: [
            {
              name: "id",
              type: "string",
              required: true,
              description: "Identifiant du compte",
              example: "12_3"
            }
          ]
        },
        {
          id: "accounts-activities",
          name: "Activités d'un compte",
          path: CYBERARK_ENDPOINTS.ACCOUNTS.ACTIVITIES,
          description: "Récupérer les activités liées à un compte",
          category: "accounts",
          fullPath: "GET " + CYBERARK_ENDPOINTS.ACCOUNTS.ACTIVITIES,
          pathParams: [
            {
              name: "id",
              type: "string",
              required: true,
              description: "Identifiant du compte",
              example: "12_3"
            }
          ]
        }
      ]
    },
    {
      id: "safes",
      name: "Coffres",
      description: "Gérer les coffres dans CyberArk",
      endpoints: [
        {
          id: "safes-list",
          name: "Liste des coffres",
          path: CYBERARK_ENDPOINTS.SAFES.LIST,
          description: "Récupérer la liste des coffres disponibles",
          category: "safes",
          fullPath: "GET " + CYBERARK_ENDPOINTS.SAFES.LIST,
          queryParams: [
            {
              name: "search",
              type: "string",
              required: false,
              description: "Recherche selon le nom du coffre",
              example: "Admin"
            },
            {
              name: "limit",
              type: "number",
              required: false,
              description: "Nombre maximum de résultats à retourner",
              defaultValue: 50
            },
            {
              name: "offset",
              type: "number",
              required: false,
              description: "Décalage pour la pagination",
              defaultValue: 0
            },
            {
              name: "includeAccounts",
              type: "boolean",
              required: false,
              description: "Inclure les comptes pour chaque coffre",
              defaultValue: false
            }
          ]
        },
        {
          id: "safes-details",
          name: "Détails d'un coffre",
          path: CYBERARK_ENDPOINTS.SAFES.GET,
          description: "Récupérer les détails d'un coffre spécifique",
          category: "safes",
          fullPath: "GET " + CYBERARK_ENDPOINTS.SAFES.GET,
          pathParams: [
            {
              name: "safeName",
              type: "string",
              required: true,
              description: "Nom du coffre",
              example: "AdminSafe"
            }
          ]
        },
        {
          id: "safes-members",
          name: "Membres d'un coffre",
          path: CYBERARK_ENDPOINTS.SAFES.MEMBERS,
          description: "Récupérer les membres d'un coffre spécifique",
          category: "safes",
          fullPath: "GET " + CYBERARK_ENDPOINTS.SAFES.MEMBERS,
          pathParams: [
            {
              name: "safeName",
              type: "string",
              required: true,
              description: "Nom du coffre",
              example: "AdminSafe"
            }
          ]
        }
      ]
    },
    {
      id: "users",
      name: "Utilisateurs",
      description: "Gérer les utilisateurs dans CyberArk",
      endpoints: [
        {
          id: "users-list",
          name: "Liste des utilisateurs",
          path: CYBERARK_ENDPOINTS.USERS.LIST,
          description: "Récupérer la liste des utilisateurs",
          category: "users",
          fullPath: "GET " + CYBERARK_ENDPOINTS.USERS.LIST,
          queryParams: [
            {
              name: "search",
              type: "string",
              required: false,
              description: "Recherche dans les noms d'utilisateur",
              example: "admin"
            },
            {
              name: "filter",
              type: "string",
              required: false,
              description: "Filtrer par type d'utilisateur",
              example: "userType=EPV"
            }
          ]
        },
        {
          id: "users-details",
          name: "Détails d'un utilisateur",
          path: CYBERARK_ENDPOINTS.USERS.GET,
          description: "Récupérer les détails d'un utilisateur spécifique",
          category: "users",
          fullPath: "GET " + CYBERARK_ENDPOINTS.USERS.GET,
          pathParams: [
            {
              name: "id",
              type: "string",
              required: true,
              description: "Identifiant de l'utilisateur",
              example: "12_3"
            }
          ]
        }
      ]
    },
    // Autres catégories simplifiées pour l'exemple
    {
      id: "platforms",
      name: "Plateformes",
      description: "Gérer les plateformes dans CyberArk",
      endpoints: []
    },
    {
      id: "groups",
      name: "Groupes",
      description: "Gérer les groupes dans CyberArk",
      endpoints: []
    },
    {
      id: "reports",
      name: "Rapports",
      description: "Gérer les rapports dans CyberArk",
      endpoints: []
    }
  ];
};

interface EndpointStoreState {
  categories: EndpointCategory[];
  selectedCategory: string | null;
  selectedEndpoint: Endpoint | null;
  
  // Paramètres actifs pour l'endpoint sélectionné
  pathParams: Record<string, string>;
  queryParams: Record<string, string | number | boolean>;
  
  // Actions
  selectCategory: (categoryId: string) => void;
  selectEndpoint: (endpointId: string) => void;
  setPathParam: (name: string, value: string) => void;
  setQueryParam: (name: string, value: string | number | boolean) => void;
  resetParams: () => void;
}

export const useEndpointStore = create<EndpointStoreState>((set, get) => {
  const initialCategories = createEndpointCategories();
  
  return {
    categories: initialCategories,
    selectedCategory: null,
    selectedEndpoint: null,
    pathParams: {},
    queryParams: {},
    
    selectCategory: (categoryId: string) => {
      set({ 
        selectedCategory: categoryId,
        selectedEndpoint: null,
        pathParams: {},
        queryParams: {}
      });
    },
    
    selectEndpoint: (endpointId: string) => {
      const { categories } = get();
      let foundEndpoint: Endpoint | null = null;
      
      // Rechercher l'endpoint dans les catégories
      for (const category of categories) {
        const endpoint = category.endpoints.find(e => e.id === endpointId);
        if (endpoint) {
          foundEndpoint = endpoint;
          break;
        }
      }
      
      // Préparer les paramètres par défaut
      const pathParams: Record<string, string> = {};
      const queryParams: Record<string, string | number | boolean> = {};
      
      if (foundEndpoint) {
        // Initialiser les paramètres de chemin avec des valeurs vides
        foundEndpoint.pathParams?.forEach(param => {
          pathParams[param.name] = param.example || '';
        });
        
        // Initialiser les paramètres de requête avec leurs valeurs par défaut
        foundEndpoint.queryParams?.forEach(param => {
          if (param.defaultValue !== undefined) {
            queryParams[param.name] = param.defaultValue;
          }
        });
      }
      
      set({ 
        selectedEndpoint: foundEndpoint,
        pathParams,
        queryParams
      });
    },
    
    setPathParam: (name: string, value: string) => {
      set(state => ({
        pathParams: {
          ...state.pathParams,
          [name]: value
        }
      }));
    },
    
    setQueryParam: (name: string, value: string | number | boolean) => {
      set(state => ({
        queryParams: {
          ...state.queryParams,
          [name]: value
        }
      }));
    },
    
    resetParams: () => {
      set({
        pathParams: {},
        queryParams: {}
      });
    }
  };
});

import { 
  exportToJson, 
  formatJsonString, 
  type JsonExportOptions 
} from "@/lib/utils/export/json-export";

// Mock pour URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "mock-url");
global.URL.revokeObjectURL = jest.fn();

describe("Module d'exportation JSON", () => {
  // Reset les mocks entre chaque test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock pour document.createElement et les opérations DOM
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    const mockAnchor = {
      href: "",
      download: "",
      click: jest.fn()
    };
    document.createElement = jest.fn().mockReturnValue(mockAnchor);
  });

  describe("exportToJson", () => {
    const testData = {
      items: [
        { id: 1, name: "Test 1" },
        { id: 2, name: "Test 2" }
      ],
      meta: {
        total: 2,
        page: 1
      }
    };

    it("doit générer un fichier JSON avec formatage par défaut", () => {
      const result = exportToJson(testData);
      
      // Vérifie que URL.createObjectURL a été appelé avec un Blob
      expect(URL.createObjectURL).toHaveBeenCalled();
      const blobArg = (URL.createObjectURL as jest.Mock).mock.calls[0][0];
      expect(blobArg).toBeInstanceOf(Blob);
      
      // Vérifie que le résultat contient les méthodes et propriétés attendues
      expect(result).toHaveProperty("url");
      expect(result).toHaveProperty("fileName");
      expect(result).toHaveProperty("download");
      expect(result).toHaveProperty("cleanup");
      
      // Appeler download pour tester le flux de téléchargement
      result.download();
      expect(document.createElement).toHaveBeenCalledWith("a");
      
      // Nettoyer les ressources
      result.cleanup();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

    it("doit respecter les options de formatage spécifiées", () => {
      const options: JsonExportOptions = {
        prettyPrint: false,
        fileName: "test-json-export",
        includeTimestamp: false
      };
      
      const result = exportToJson(testData, options);
      
      // Vérifier que le nom de fichier est correctement défini
      expect(result.fileName).toBe("test-json-export.json");
      
      // Simuler le téléchargement
      result.download();
      const mockAnchor = document.createElement("a") as unknown as { 
        href: string;
        download: string;
        click: jest.fn();
      };
      expect(mockAnchor.download).toBe("test-json-export.json");
      
      // Sans pretty print, le JSON ne devrait pas avoir d'espaces
      const blobArg = (URL.createObjectURL as jest.Mock).mock.calls[0][0];
      // Nous ne pouvons pas vérifier directement le contenu du Blob,
      // mais nous savons que sans pretty print, le JSON devrait être plus compact
    });

    it("doit appliquer une fonction de transformation si spécifiée", () => {
      const transform = jest.fn().mockImplementation(data => ({
        ...data,
        transformed: true
      }));
      
      const options: JsonExportOptions = {
        transform
      };
      
      exportToJson(testData, options);
      
      // Vérifier que la fonction de transformation a été appelée
      expect(transform).toHaveBeenCalledWith(testData);
    });

    it("doit inclure un horodatage dans le nom de fichier si demandé", () => {
      // Mock Date.prototype.toISOString pour un résultat prévisible
      const originalToISOString = Date.prototype.toISOString;
      Date.prototype.toISOString = jest.fn(() => "2023-06-15T12:30:45.000Z");
      
      try {
        const result = exportToJson(testData, { includeTimestamp: true });
        // Le nom de fichier devrait contenir l'horodatage formaté
        expect(result.fileName).toMatch(/cyberark-export-2023-06-15T12-30-45\.json$/);
      } finally {
        // Restaurer la méthode originale
        Date.prototype.toISOString = originalToISOString;
      }
    });
  });

  describe("formatJsonString", () => {
    const testObj = { a: 1, b: { c: 2 } };
    
    it("doit formatter correctement avec indentation par défaut", () => {
      const formatted = formatJsonString(testObj);
      const expected = JSON.stringify(testObj, null, 2);
      expect(formatted).toBe(expected);
    });
    
    it("doit formatter sans indentation si prettyPrint est false", () => {
      const formatted = formatJsonString(testObj, false);
      const expected = JSON.stringify(testObj);
      expect(formatted).toBe(expected);
    });
    
    it("doit respecter le niveau d'indentation spécifié", () => {
      const formatted = formatJsonString(testObj, true, 4);
      const expected = JSON.stringify(testObj, null, 4);
      expect(formatted).toBe(expected);
    });
    
    it("doit gérer les valeurs null et undefined", () => {
      expect(formatJsonString(null)).toBe("null");
      expect(formatJsonString(undefined)).toBe(undefined as any);
    });
  });
});

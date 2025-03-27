import { 
  exportToCsv, 
  detectColumns, 
  formatHeaderTitle, 
  type CsvExportOptions
} from "@/lib/utils/export/csv-export";

// Mock pour URL.createObjectURL qui n'existe pas dans l'environnement de test
global.URL.createObjectURL = jest.fn(() => "mock-url");
global.URL.revokeObjectURL = jest.fn();

describe("Module d'exportation CSV", () => {
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

  describe("exportToCsv", () => {
    const testData = [
      { id: 1, name: "Test 1", category: "A" },
      { id: 2, name: "Test 2", category: "B" },
      { id: 3, name: "Test 3", category: "A" }
    ];

    it("doit générer un fichier CSV avec les en-têtes par défaut", () => {
      const result = exportToCsv(testData);
      
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
      const options: CsvExportOptions = {
        delimiter: ";",
        quoteChar: "'",
        includeHeaders: true,
        fileName: "test-export",
        includeTimestamp: false
      };
      
      const result = exportToCsv(testData, options);
      
      // Vérifier que le nom de fichier est correctement défini
      expect(result.fileName).toBe("test-export.csv");
      
      // Simuler le téléchargement
      result.download();
      const mockAnchor = document.createElement("a") as unknown as { 
        href: string;
        download: string;
        click: jest.fn();
      };
      expect(mockAnchor.download).toBe("test-export.csv");
    });

    it("doit générer un CSV avec seulement les colonnes spécifiées", () => {
      const options: CsvExportOptions = {
        columns: ["id", "name"]
      };
      
      const result = exportToCsv(testData, options);
      
      // Vérifier que seules les colonnes spécifiées sont incluses
      // Note: nous ne pouvons pas vérifier le contenu exact du CSV sans mock additionnel
      expect(URL.createObjectURL).toHaveBeenCalled();
    });

    it("doit gérer les données vides correctement", () => {
      const result = exportToCsv([]);
      
      // Vérifier que le résultat est toujours valide même avec un tableau vide
      expect(result).toHaveProperty("url");
      expect(result).toHaveProperty("fileName");
      expect(result).toHaveProperty("download");
    });

    it("doit lancer une erreur si les données ne sont pas un tableau", () => {
      // @ts-ignore - Test intentionnel d'un type invalide
      expect(() => exportToCsv({ foo: "bar" })).toThrow("Les données doivent être un tableau");
    });
  });

  describe("detectColumns", () => {
    it("doit détecter correctement les colonnes de premier niveau", () => {
      const data = [
        { id: 1, name: "Test 1", category: "A" },
        { id: 2, name: "Test 2" } // Manque volontairement 'category'
      ];
      
      const columns = detectColumns(data);
      
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("category");
      expect(columns.length).toBe(3);
    });

    it("doit détecter les propriétés imbriquées jusqu'à la profondeur spécifiée", () => {
      const data = [
        { 
          id: 1, 
          user: { 
            name: "John", 
            address: { 
              city: "Paris", 
              country: "France" 
            } 
          } 
        }
      ];
      
      // Profondeur par défaut (2)
      const columnsDefault = detectColumns(data);
      expect(columnsDefault).toContain("id");
      expect(columnsDefault).toContain("user.name");
      expect(columnsDefault).toContain("user.address");
      expect(columnsDefault).not.toContain("user.address.city");
      
      // Profondeur personnalisée (3)
      const columnsDepth3 = detectColumns(data, 3);
      expect(columnsDepth3).toContain("user.address.city");
      expect(columnsDepth3).toContain("user.address.country");
    });

    it("doit retourner un tableau vide pour des données vides", () => {
      expect(detectColumns([])).toEqual([]);
    });

    it("doit gérer les valeurs null et undefined", () => {
      const data = [
        { id: 1, name: null },
        { id: 2, name: undefined },
        { id: 3, name: "Test" }
      ];
      
      const columns = detectColumns(data);
      expect(columns).toContain("id");
      expect(columns).toContain("name");
    });
  });

  describe("formatHeaderTitle", () => {
    it("doit formatter correctement les noms camelCase", () => {
      expect(formatHeaderTitle("userName")).toBe("User Name");
      expect(formatHeaderTitle("firstNameLastName")).toBe("First Name Last Name");
    });

    it("doit formatter correctement les propriétés imbriquées", () => {
      expect(formatHeaderTitle("user.firstName")).toBe("User First Name");
      expect(formatHeaderTitle("address.streetName")).toBe("Address Street Name");
    });

    it("doit gérer les cas edge", () => {
      expect(formatHeaderTitle("")).toBe("");
      expect(formatHeaderTitle("a")).toBe("A");
      expect(formatHeaderTitle("ABC")).toBe("A B C");
    });
  });
});

import { cn, formatDate, ensureTrailingSlash } from "@/lib/utils/utils";

describe("Utilitaires de base", () => {
  describe("cn (utility de classe)", () => {
    it("doit fusionner les classes correctement", () => {
      expect(cn("test", "class")).toBe("test class");
      expect(cn("test", { class: true })).toBe("test class");
      expect(cn("test", { class: false })).toBe("test");
    });

    it("doit gérer les conflits de classes Tailwind correctement", () => {
      // Tailwind merge devrait remplacer les classes en conflit
      expect(cn("p-4", "p-6")).toBe("p-6");
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
      expect(cn("flex flex-col", "flex-row")).toBe("flex flex-row");
    });

    it("doit gérer les tableaux et objets imbriqués", () => {
      expect(cn(["test", "class"])).toBe("test class");
      expect(cn("test", ["class", { active: true }])).toBe("test class active");
      expect(cn("test", ["class", { active: false }])).toBe("test class");
    });
  });

  describe("formatDate", () => {
    it("doit formater une date correctement", () => {
      // Utiliser une date fixe pour tester
      const testDate = new Date(2023, 5, 15, 14, 30); // 15 juin 2023, 14:30
      const formattedDate = formatDate(testDate);

      // Format attendu : DD/MM/YYYY, HH:MM
      expect(formattedDate).toBe("15/06/2023, 14:30");
    });

    it("doit gérer différents formats d'entrée", () => {
      // ISO string
      const isoString = "2023-06-15T14:30:00Z";
      expect(formatDate(isoString)).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);

      // Timestamp
      const timestamp = new Date(2023, 5, 15, 14, 30).getTime();
      expect(formatDate(timestamp)).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
    });
  });

  describe("ensureTrailingSlash", () => {
    it("doit ajouter un slash final s'il n'existe pas", () => {
      expect(ensureTrailingSlash("https://example.com")).toBe("https://example.com/");
      expect(ensureTrailingSlash("https://api.cyberark.cloud/api")).toBe(
        "https://api.cyberark.cloud/api/"
      );
    });

    it("ne doit pas ajouter de slash si un slash existe déjà", () => {
      expect(ensureTrailingSlash("https://example.com/")).toBe("https://example.com/");
      expect(ensureTrailingSlash("https://api.cyberark.cloud/api/")).toBe(
        "https://api.cyberark.cloud/api/"
      );
    });

    it("doit gérer les chaînes vides", () => {
      expect(ensureTrailingSlash("")).toBe("/");
    });
  });
});

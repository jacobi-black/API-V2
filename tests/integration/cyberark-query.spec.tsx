import { renderHook, act } from "@testing-library/react";
import { useCyberArkQuery } from "@/hooks/api/use-cyberark-query";
import { useAuthStore } from "@/store/auth.store";

// Mock du store d'authentification
jest.mock("@/store/auth.store", () => ({
  useAuthStore: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn();

describe("useCyberArkQuery Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Configuration par défaut du mock useAuthStore
    (useAuthStore as jest.Mock).mockReturnValue({
      session: {
        token: "test-token",
        url: "https://test.cyberark.cloud",
      },
    });

    // Configuration par défaut du mock fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: { result: "success" },
      }),
    });
  });

  it("doit initialiser avec l'état idle", () => {
    const { result } = renderHook(() => useCyberArkQuery<any>("test-endpoint"));

    expect(result.current.state).toBe("idle");
    expect(result.current.isIdle).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("doit retourner une erreur si aucun endpoint n'est spécifié", async () => {
    const { result } = renderHook(() => useCyberArkQuery<any>(null));

    await act(async () => {
      const response = await result.current.execute();
      expect(response.success).toBe(false);
      expect(response.error).toBe("Aucun endpoint spécifié");
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe("Aucun endpoint spécifié");
  });

  it("doit retourner une erreur si l'utilisateur n'est pas authentifié", async () => {
    // Simuler un utilisateur non authentifié
    (useAuthStore as jest.Mock).mockReturnValue({
      session: null,
    });

    const { result } = renderHook(() => useCyberArkQuery<any>("test-endpoint"));

    await act(async () => {
      const response = await result.current.execute();
      expect(response.success).toBe(false);
      expect(response.error).toBe("Non authentifié");
    });

    expect(result.current.isError).toBe(true);
  });

  it("doit effectuer une requête GET à l'endpoint spécifié", async () => {
    const { result } = renderHook(() => useCyberArkQuery<any>("accounts"));

    await act(async () => {
      await result.current.execute();
    });

    // Vérifier que fetch a été appelé avec les bons paramètres
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/cyberark/accounts",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "test-token",
        }),
      })
    );

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual({ result: "success" });
  });

  it("doit inclure les paramètres de requête dans l'URL", async () => {
    const { result } = renderHook(() =>
      useCyberArkQuery<any>("accounts", {
        params: {
          limit: 10,
          filter: "active",
        },
      })
    );

    await act(async () => {
      await result.current.execute();
    });

    // Vérifier que l'URL contient les paramètres de requête
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/cyberark/accounts?limit=10&filter=active",
      expect.anything()
    );
  });

  it("doit ignorer les paramètres de requête vides ou null", async () => {
    const { result } = renderHook(() =>
      useCyberArkQuery<any>("accounts", {
        params: {
          limit: 10,
          filter: "",
          page: null,
          sort: undefined,
        },
      })
    );

    await act(async () => {
      await result.current.execute();
    });

    // Vérifier que seuls les paramètres non vides sont inclus
    expect(global.fetch).toHaveBeenCalledWith("/api/cyberark/accounts?limit=10", expect.anything());
  });

  it("doit gérer les erreurs de requête", async () => {
    // Simuler une erreur de requête
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({
        error: "Resource not found",
      }),
    });

    const { result } = renderHook(() => useCyberArkQuery<any>("non-existent"));

    await act(async () => {
      const response = await result.current.execute();
      expect(response.success).toBe(false);
      expect(response.error).toBe("Resource not found");
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe("Resource not found");
  });

  it("doit gérer les erreurs réseau", async () => {
    // Simuler une erreur réseau
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCyberArkQuery<any>("accounts"));

    await act(async () => {
      const response = await result.current.execute();
      expect(response.success).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe("Network error");
  });

  it("doit permettre de personnaliser l'endpoint et les options lors de l'exécution", async () => {
    const { result } = renderHook(() => useCyberArkQuery<any>("accounts"));

    await act(async () => {
      await result.current.execute("safes", { params: { limit: 5 } });
    });

    // Vérifier que l'endpoint et les paramètres personnalisés ont été utilisés
    expect(global.fetch).toHaveBeenCalledWith("/api/cyberark/safes?limit=5", expect.anything());
  });

  it("doit exécuter automatiquement la requête si cache est force-cache", () => {
    renderHook(() => useCyberArkQuery<any>("accounts", { cache: "force-cache" }));

    // La requête devrait être exécutée automatiquement en raison de force-cache
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

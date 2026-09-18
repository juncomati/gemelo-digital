import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DemoState, ResolveApprovalInput, RubroId, Source } from "@/domain/types";
import { mockRepository } from "@/repositories/mock/MockRepository";

interface ToastMessage {
  id: string;
  text: string;
}

interface DemoContextValue {
  state: DemoState | null;
  loading: boolean;
  error: string | null;
  toast: ToastMessage | null;
  activeRubros: RubroId[];
  setActiveRubros: (rubros: RubroId[]) => void;
  toggleRubro: (rubro: RubroId) => void;
  refresh: () => Promise<void>;
  resolveApproval: (input: ResolveApprovalInput) => Promise<void>;
  resetDemo: () => Promise<void>;
  markDocumentReviewed: (id: string) => Promise<void>;
  simulateUpload: (meta: { name: string; type: string; size: number }) => Promise<void>;
  updateSettings: (patch: Partial<DemoState["settings"]>) => Promise<void>;
  updateSourceStatus: (id: string, status: Source["status"]) => Promise<void>;
  updateAreaPositions: (positions: Record<string, { x: number; y: number }>) => Promise<void>;
  askConsultor: (question: string) => Promise<void>;
  showToast: (text: string) => void;
  clearToast: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [activeRubros, setActiveRubros] = useState<RubroId[]>([]);

  const showToast = useCallback((text: string) => {
    setToast({ id: String(Date.now()), text });
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  const toggleRubro = useCallback((rubro: RubroId) => {
    setActiveRubros((prev) =>
      prev.includes(rubro) ? prev.filter((r) => r !== rubro) : [...prev, rubro],
    );
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await mockRepository.getState();
      setState(next);
    } catch {
      setError("No pudimos cargar esta sección. Tus datos no se modificaron.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const resolveApprovalAction = useCallback(
    async (input: ResolveApprovalInput) => {
      const next = await mockRepository.resolveApproval(input);
      setState(next);
      showToast("Simulación completada. No se realizó ninguna operación externa.");
    },
    [showToast],
  );

  const resetDemo = useCallback(async () => {
    const next = await mockRepository.resetDemo();
    setState(next);
    setActiveRubros([]);
    showToast("Demo restablecida al escenario canónico.");
  }, [showToast]);

  const markDocumentReviewed = useCallback(
    async (id: string) => {
      const next = await mockRepository.markDocumentReviewed(id);
      setState(next);
      showToast("Acción registrada en la demo. No se ejecutó ninguna operación externa.");
    },
    [showToast],
  );

  const simulateUpload = useCallback(
    async (meta: { name: string; type: string; size: number }) => {
      const next = await mockRepository.simulateUpload(meta);
      setState(next);
      showToast("En la demo el archivo no será procesado ni enviado.");
    },
    [showToast],
  );

  const updateSettings = useCallback(
    async (patch: Partial<DemoState["settings"]>) => {
      const next = await mockRepository.updateSettings(patch);
      setState(next);
      showToast("Preferencias guardadas en este navegador.");
    },
    [showToast],
  );

  const updateSourceStatus = useCallback(
    async (id: string, status: Source["status"]) => {
      const next = await mockRepository.updateSourceStatus(id, status);
      setState(next);
      showToast("Acción registrada en la demo. No se ejecutó ninguna operación externa.");
    },
    [showToast],
  );

  const updateAreaPositions = useCallback(
    async (positions: Record<string, { x: number; y: number }>) => {
      const next = await mockRepository.updateAreaPositions(positions);
      setState(next);
    },
    [],
  );

  const askConsultor = useCallback(
    async (question: string) => {
      const next = await mockRepository.askConsultor(question);
      setState(next);
    },
    [],
  );

  const value = useMemo(
    () => ({
      state,
      loading,
      error,
      toast,
      activeRubros,
      setActiveRubros,
      toggleRubro,
      refresh,
      resolveApproval: resolveApprovalAction,
      resetDemo,
      markDocumentReviewed,
      simulateUpload,
      updateSettings,
      updateSourceStatus,
      updateAreaPositions,
      askConsultor,
      showToast,
      clearToast,
    }),
    [
      state,
      loading,
      error,
      toast,
      activeRubros,
      toggleRubro,
      refresh,
      resolveApprovalAction,
      resetDemo,
      markDocumentReviewed,
      simulateUpload,
      updateSettings,
      updateSourceStatus,
      updateAreaPositions,
      askConsultor,
      showToast,
      clearToast,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

/* eslint-disable react-refresh/only-export-components -- hook paired with provider */
export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo debe usarse dentro de DemoProvider");
  return ctx;
}

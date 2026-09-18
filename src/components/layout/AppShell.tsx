import { Outlet, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { RubroFilterBar } from "./RubroFilterBar";
import { useDemo } from "@/app/DemoProvider";
import { Button } from "@/components/ui/Button";

const pageMeta: Record<string, { title: string; description: string; period?: boolean }> = {
  "/inicio": {
    title: "Inicio",
    description: "Situaciones que requieren atención y pulso operativo.",
    period: true,
  },
  "/proceso": {
    title: "Proceso",
    description: "Del arranque con el cliente al ritmo semana a semana.",
  },
  "/consultor": {
    title: "Consultor",
    description: "Consultá el conocimiento simulado de la empresa.",
  },
  "/novedades": {
    title: "Novedades",
    description: "Leyes, decretos y señales de mercado del sector.",
  },
  "/documentacion": {
    title: "Documentación",
    description: "Fuentes, vigencia y contribución al Gemelo.",
  },
  "/gemelo": {
    title: "Gemelo",
    description: "Modelo vivo de la empresa y sus relaciones.",
  },
  "/resultados": {
    title: "Resultados",
    description: "Riesgos, oportunidades y recomendaciones del sistema.",
  },
  "/aprobaciones": {
    title: "Aprobaciones",
    description: "Control humano sobre decisiones sensibles.",
  },
  "/actividad": {
    title: "Actividad",
    description: "Trazabilidad cronológica y auditable.",
    period: true,
  },
  "/metricas": {
    title: "Métricas",
    description: "Adopción, calidad e impacto estimado.",
    period: true,
  },
  "/configuracion": {
    title: "Configuración",
    description: "Adaptación por empresa sin revelar herramientas internas.",
  },
};

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { loading, error, refresh, toast, clearToast } = useDemo();

  const meta = useMemo(() => {
    const base = Object.keys(pageMeta).find((key) => location.pathname.startsWith(key));
    return pageMeta[base ?? "/inicio"] ?? pageMeta["/inicio"];
  }, [location.pathname]);

  return (
    <div className="app-canvas flex min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar
          title={meta.title}
          description={meta.description}
          onMenu={() => setMenuOpen(true)}
          showPeriod={meta.period}
        />
        <RubroFilterBar />
        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 lg:px-8">
          {error ? (
            <div className="card-surface p-6" role="alert">
              <p className="font-semibold text-text-900">{error}</p>
              <div className="mt-4 flex gap-3">
                <Button onClick={() => void refresh()}>Reintentar</Button>
                <Button variant="secondary" onClick={() => (window.location.href = "/inicio")}>
                  Volver a Inicio
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="space-y-4" aria-busy="true" aria-label="Cargando">
              <div className="h-28 animate-pulse rounded-xl bg-border-200/50" />
              <div className="grid gap-4 md:grid-cols-3">
                <div className="h-40 animate-pulse rounded-xl bg-border-200/50" />
                <div className="h-40 animate-pulse rounded-xl bg-border-200/50" />
                <div className="h-40 animate-pulse rounded-xl bg-border-200/50" />
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
      {toast ? (
        <div
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-border-200 bg-surface-0 px-4 py-3 text-sm shadow-[var(--shadow-elevated)]"
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{toast.text}</p>
            <button type="button" className="text-text-600" onClick={clearToast} aria-label="Cerrar aviso">
              ×
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

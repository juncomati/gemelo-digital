import { NavLink } from "react-router-dom";
import {
  Activity,
  Boxes,
  FileText,
  Gauge,
  Home,
  MessageSquare,
  Newspaper,
  Route,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useDemo } from "@/app/DemoProvider";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/format";

const links = [
  { to: "/inicio", label: "Inicio", icon: Home },
  { to: "/proceso", label: "Proceso", icon: Route },
  { to: "/documentacion", label: "Documentación", icon: FileText },
  { to: "/gemelo", label: "Gemelo", icon: Boxes },
  { to: "/resultados", label: "Resultados", icon: Sparkles },
  { to: "/aprobaciones", label: "Aprobaciones", icon: ShieldCheck },
  { to: "/actividad", label: "Actividad", icon: Activity },
  { to: "/metricas", label: "Métricas", icon: Gauge },
  { to: "/consultor", label: "Consultor", icon: MessageSquare },
  { to: "/novedades", label: "Novedades", icon: Newspaper },
  { to: "/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, resetDemo } = useDemo();
  const [confirmReset, setConfirmReset] = useState(false);
  const user = state?.users.find((u) => u.id === state.currentUserId);

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-white/5 bg-navy-950 text-white transition-transform duration-200 ease-[var(--ease-out-soft)] lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Navegación principal"
      >
        <div className="relative overflow-hidden border-b border-white/10 px-5 py-6">
          <div
            className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-cyan-500/15 blur-2xl"
            aria-hidden
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Makers
          </p>
          <h1 className="font-display mt-2 text-[1.35rem] font-semibold leading-tight tracking-tight">
            Gemelo Digital Operativo
          </h1>
          <p className="mt-2 text-xs text-white/55">Conocimiento operable para decidir</p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition duration-150 hover:bg-white/5 hover:text-white",
                  isActive && "bg-navy-800 text-white shadow-inner ring-1 ring-cyan-500/25",
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80 group-hover:opacity-100" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-3 border-t border-white/10 bg-navy-900/50 px-4 py-4 text-sm">
          <div>
            <p className="font-semibold">{state?.tenant.name}</p>
            <p className="text-white/55">Entorno Demo</p>
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-white/55">{user?.area}</p>
          </div>
          <Button
            variant="secondary"
            className="w-full border-white/15 bg-transparent text-white hover:bg-navy-800"
            onClick={() => setConfirmReset(true)}
          >
            Restablecer demo
          </Button>
        </div>
      </aside>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-navy-950/50 backdrop-blur-[2px] lg:hidden"
          aria-label="Cerrar menú"
          onClick={onClose}
        />
      ) : null}
      <ConfirmDialog
        open={confirmReset}
        title="Restablecer demo"
        description="Se perderán decisiones, comentarios, filtros y preferencias locales. La semilla canónica se volverá a cargar."
        confirmLabel="Restablecer demo"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          setConfirmReset(false);
          void resetDemo();
        }}
      />
    </>
  );
}

import { RUBROS, type RubroId } from "@/domain/types";
import { useDemo } from "@/app/DemoProvider";
import { cn } from "@/lib/format";

export function RubroFilterBar() {
  const { activeRubros, toggleRubro, setActiveRubros } = useDemo();

  return (
    <div
      className="flex flex-wrap items-center gap-2 border-b border-border-200/80 bg-surface-0/70 px-4 py-2.5 lg:px-8"
      role="group"
      aria-label="Filtro por rubro"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-text-600">Rubros</span>
      <button
        type="button"
        className={cn(
          "rounded-full border px-3 py-1 text-xs font-semibold transition",
          activeRubros.length === 0
            ? "border-petrol-700 bg-petrol-700 text-white"
            : "border-border-200 bg-surface-0 text-text-700 hover:border-cyan-500",
        )}
        onClick={() => setActiveRubros([])}
      >
        Todos
      </button>
      {RUBROS.map((rubro) => {
        const active = activeRubros.includes(rubro.id as RubroId);
        return (
          <button
            key={rubro.id}
            type="button"
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              active
                ? "border-cyan-500 bg-cyan-500/15 text-petrol-700"
                : "border-border-200 bg-surface-0 text-text-700 hover:border-cyan-500",
            )}
            aria-pressed={active}
            onClick={() => toggleRubro(rubro.id)}
          >
            {rubro.label}
          </button>
        );
      })}
      {activeRubros.length > 0 ? (
        <span className="text-xs text-text-600">
          Filtrando {activeRubros.length} rubro{activeRubros.length > 1 ? "s" : ""}
        </span>
      ) : null}
    </div>
  );
}

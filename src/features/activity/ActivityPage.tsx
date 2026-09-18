import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useDemo } from "@/app/DemoProvider";
import { Button } from "@/components/ui/Button";
import { formatAbsoluteDate } from "@/lib/format";

function entityPath(type: string, id: string): string {
  if (type === "result") return `/resultados/${id}`;
  if (type === "approval") return `/aprobaciones/${id}`;
  if (type === "document") return `/documentacion/${id}`;
  return `/gemelo/${id}`;
}

export function ActivityPage() {
  const { state } = useDemo();
  const [query, setQuery] = useState("");
  const [entityType, setEntityType] = useState("");

  const events = useMemo(() => {
    if (!state) return [];
    return state.activity
      .filter((e) => {
        if (entityType && e.entityType !== entityType) return false;
        if (query && !`${e.summary} ${e.actorName} ${e.action}`.toLowerCase().includes(query.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [state, query, entityType]);

  if (!state) return null;

  return (
    <div className="page-enter space-y-6">
      <section className="card-surface flex flex-wrap gap-3 p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar actividad…"
          className="h-10 min-w-[220px] flex-1 rounded-lg border border-border-200 px-3 text-sm"
          aria-label="Buscar actividad"
        />
        <select
          className="h-10 rounded-lg border border-border-200 px-3 text-sm"
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
          aria-label="Filtrar por tipo de entidad"
        >
          <option value="">Todos los tipos</option>
          <option value="result">Resultado</option>
          <option value="approval">Aprobación</option>
          <option value="document">Documento</option>
        </select>
        <Button
          variant="secondary"
          onClick={() => {
            setQuery("");
            setEntityType("");
          }}
        >
          Limpiar
        </Button>
      </section>

      <ol className="space-y-3">
        {events.map((event) => (
          <li key={event.id} className="card-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-text-600">{formatAbsoluteDate(event.createdAt)}</p>
                <p className="mt-1 text-sm">
                  <span className="font-semibold">{event.actorName}</span> {event.summary}
                </p>
                {event.previousState && event.nextState ? (
                  <p className="mt-1 text-xs text-text-600">
                    Estado: {event.previousState} → {event.nextState}
                  </p>
                ) : null}
              </div>
              <Link
                className="text-sm font-semibold text-petrol-700 hover:underline"
                to={entityPath(event.entityType, event.entityId)}
              >
                Ver detalle
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

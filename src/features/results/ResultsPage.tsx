import { Link, useParams, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useDemo } from "@/app/DemoProvider";
import { ConfidenceIndicator } from "@/components/domain/ConfidenceIndicator";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  findUserName,
  formatAbsoluteDate,
  priorityLabel,
  resultStatusLabel,
} from "@/lib/format";
import { matchesRubroFilter } from "@/lib/rubros";
import { OptionComparison } from "./OptionComparison";

export function ResultsPage() {
  const { state } = useDemo();
  const { resultadoId } = useParams();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const typeFilter = params.get("tipo") ?? "";
  const { activeRubros } = useDemo();

  const filtered = useMemo(() => {
    if (!state) return [];
    return state.results.filter((r) => {
      if (!matchesRubroFilter(r.rubroIds, activeRubros)) return false;
      if (typeFilter && r.type !== typeFilter) return false;
      if (query && !`${r.title} ${r.summary}`.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [state, typeFilter, query, activeRubros]);

  if (!state) return null;
  const selected = resultadoId ? state.results.find((r) => r.id === resultadoId) : null;
  const evidences = selected
    ? state.evidence.filter((e) => selected.evidenceIds.includes(e.id))
    : [];

  return (
    <div className="page-enter space-y-6">
      <OptionComparison />
      <section className="card-surface flex flex-wrap gap-3 p-4">
        <select
          className="h-10 rounded-lg border border-border-200 px-3 text-sm"
          value={typeFilter}
          onChange={(e) => {
            const next = new URLSearchParams(params);
            if (e.target.value) next.set("tipo", e.target.value);
            else next.delete("tipo");
            setParams(next);
          }}
          aria-label="Filtrar por tipo"
        >
          <option value="">Todos los tipos</option>
          <option value="risk">Riesgo</option>
          <option value="opportunity">Oportunidad</option>
          <option value="recommendation">Recomendación</option>
          <option value="report">Informe</option>
          <option value="analysis">Análisis</option>
        </select>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar resultados…"
          className="h-10 min-w-[220px] flex-1 rounded-lg border border-border-200 px-3 text-sm"
          aria-label="Buscar resultados"
        />
        <Button
          variant="secondary"
          onClick={() => {
            setQuery("");
            setParams({});
          }}
        >
          Limpiar
        </Button>
      </section>

      <div className={`grid gap-6 ${selected ? "xl:grid-cols-[1fr_480px]" : ""}`}>
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((result) => (
            <Link
              key={result.id}
              to={`/resultados/${result.id}`}
              className="card-surface card-interactive p-5"
            >
              <div className="flex flex-wrap gap-2">
                <Badge tone="info">{result.type}</Badge>
                <Badge tone={result.priority === "critical" ? "danger" : "medium"}>
                  {priorityLabel(result.priority)}
                </Badge>
                <Badge>{resultStatusLabel(result.status)}</Badge>
              </div>
              <h3 className="font-display mt-3 text-lg font-semibold">{result.title}</h3>
              <p className="mt-2 text-sm text-text-600">{result.summary}</p>
              <p className="mt-3 text-sm font-medium">{result.expectedImpact}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <ConfidenceIndicator value={result.confidence} />
                <span className="text-xs text-text-600">
                  {findUserName(state, result.ownerId)} · {formatAbsoluteDate(result.generatedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {selected ? (
          <aside className="card-surface-panel p-5">
            <h3 className="font-display text-xl font-semibold">{selected.title}</h3>
            <p className="mt-2 text-sm text-text-600">{selected.summary}</p>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Impacto estimado</h4>
                <p>{selected.expectedImpact}</p>
              </div>
              <div>
                <h4 className="font-semibold">Recomendación</h4>
                <p>{selected.recommendation}</p>
              </div>
              <ConfidenceIndicator value={selected.confidence} />
            </div>
            <h4 className="mt-5 font-semibold">Evidencias</h4>
            <ul className="mt-2 space-y-2">
              {evidences.map((e) => (
                <li key={e.id} className="rounded-lg border border-border-200 p-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Badge>
                      {e.factOrEstimate === "fact"
                        ? "Hecho"
                        : e.factOrEstimate === "estimate"
                          ? "Estimación"
                          : "Hipótesis"}
                    </Badge>
                    <span className="font-medium">{e.label}</span>
                  </div>
                  <p className="mt-1 text-text-600">{e.excerpt}</p>
                  <p className="mt-1 text-xs text-text-600">{formatAbsoluteDate(e.observedAt)}</p>
                </li>
              ))}
            </ul>
            {selected.approvalId ? (
              <Button
                className="mt-5"
                onClick={() => (window.location.href = `/aprobaciones/${selected.approvalId}`)}
              >
                Abrir aprobación vinculada
              </Button>
            ) : null}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

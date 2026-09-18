import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useDemo } from "@/app/DemoProvider";
import { ConfidenceIndicator } from "@/components/domain/ConfidenceIndicator";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProcessSummary } from "@/features/process/ProcessSummary";
import { deriveDashboardCounters } from "@/domain/resolveApproval";
import { RUBROS } from "@/domain/types";
import { matchesRubroFilter } from "@/lib/rubros";
import {
  findUserName,
  formatAbsoluteDate,
  formatPercent,
  priorityLabel,
  resultStatusLabel,
} from "@/lib/format";

export function DashboardPage() {
  const { state, refresh, activeRubros } = useDemo();

  const results = useMemo(
    () =>
      state
        ? state.results.filter((r) => matchesRubroFilter(r.rubroIds, activeRubros))
        : [],
    [state, activeRubros],
  );

  if (!state) return null;

  const counters = deriveDashboardCounters(state);
  const main =
    results.find((r) => r.id === "result_risk_liner") ??
    results.find((r) => r.priority === "critical") ??
    results[0];
  const attention = results.filter((r) => r.id !== main?.id).slice(0, 3);
  const latest = results.slice(0, 4);
  const activity = state.activity.slice(0, 5);
  const coverage = state.metrics.rubroCoverage.filter((c) =>
    activeRubros.length ? activeRubros.includes(c.rubroId) : true,
  );
  const weakRubros = state.metrics.rubroCoverage.filter((c) => c.coverageScore < 0.35);

  return (
    <div className="page-enter space-y-6">
      <ProcessSummary />

      {weakRubros.length > 0 && activeRubros.length === 0 ? (
        <Card variant="quiet" className="p-4">
          <p className="text-sm font-semibold text-text-900">Cobertura desigual por rubro</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {weakRubros.map((c) => {
              const label = RUBROS.find((r) => r.id === c.rubroId)?.label ?? c.rubroId;
              return (
                <li key={c.rubroId}>
                  <Badge tone="medium">
                    {label}: {c.documentCount} docs · cobertura baja
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}

      <Card variant="panel" className="p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h3 className="font-display text-2xl font-semibold leading-snug text-text-900 md:text-[1.85rem]">
              Buen día, Laura. Estas son las situaciones que requieren atención hoy.
            </h3>
            <p className="mt-2 text-sm text-text-600">{state.metadata.disclaimer}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/proceso#semana">
              <Button variant="secondary">Ver resumen semanal</Button>
            </Link>
            <Link to="/resultados">
              <Button variant="secondary">Explorar resultados</Button>
            </Link>
            <Button onClick={() => void refresh()}>Actualizar vista</Button>
          </div>
        </div>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Cobertura del conocimiento", value: formatPercent(counters.knowledgeCoverage) },
          { label: "Confianza promedio", value: formatPercent(counters.averageConfidence) },
          { label: "Resultados visibles", value: String(results.length) },
          {
            label: "Aprobaciones pendientes",
            value: String(counters.pendingApprovals),
            to: "/aprobaciones?bandeja=pendientes",
          },
          {
            label: "Fuentes por revisar",
            value: String(counters.sourcesToReview),
            to: "/documentacion?vista=atencion",
          },
        ].map((item) =>
          item.to ? (
            <Link key={item.label} to={item.to}>
              <Card interactive className="h-full p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-text-600">
                  {item.label}
                </p>
                <p className="stat-value mt-2 text-3xl text-text-900">{item.value}</p>
              </Card>
            </Link>
          ) : (
            <Card key={item.label} className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-text-600">
                {item.label}
              </p>
              <p className="stat-value mt-2 text-3xl text-text-900">{item.value}</p>
            </Card>
          ),
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {coverage.map((c) => {
          const label = RUBROS.find((r) => r.id === c.rubroId)?.label ?? c.rubroId;
          return (
            <Card key={c.rubroId} className="p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text-600">
                {label}
              </p>
              <p className="stat-value mt-1 text-xl">{formatPercent(c.coverageScore)}</p>
              <p className="text-xs text-text-600">
                {c.documentCount} docs · {c.resultCount} resultados
              </p>
            </Card>
          );
        })}
      </section>

      {main ? (
        <Card variant="priority" className="p-6 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <Badge tone="danger">Prioridad crítica</Badge>
              <h3 className="font-display mt-3 text-2xl font-semibold md:text-3xl">{main.title}</h3>
              <p className="mt-3 text-text-700">{main.summary}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-text-900">
                <li>{main.expectedImpact}</li>
                <li>Responsable: {findUserName(state, main.ownerId)}.</li>
              </ul>
              <div className="mt-5">
                <ConfidenceIndicator value={main.confidence} />
              </div>
            </div>
            <Link to={`/resultados/${main.id}`}>
              <Button className="min-w-[12rem]">Revisar recomendación</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <p className="text-sm text-text-600">
            No hay resultados para los rubros seleccionados. Probá limpiar el filtro.
          </p>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <h4 className="section-title">Requiere tu atención</h4>
          <ul className="mt-4 space-y-3">
            {attention.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/resultados/${item.id}`}
                  className="block rounded-xl border border-border-200 bg-surface-0/60 p-3.5 transition hover:border-cyan-500"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={item.priority === "high" ? "danger" : "medium"}>
                      {priorityLabel(item.priority)}
                    </Badge>
                    <span className="font-semibold">{item.title}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-text-600">{item.expectedImpact}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h4 className="section-title">Últimos resultados</h4>
          <ul className="mt-4 space-y-3">
            {latest.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 border-b border-border-100 pb-3 last:border-0"
              >
                <div>
                  <Link to={`/resultados/${item.id}`} className="font-semibold hover:text-petrol-700">
                    {item.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-text-600">
                    {item.area} · {formatAbsoluteDate(item.generatedAt)}
                  </p>
                </div>
                <Badge>{resultStatusLabel(item.status)}</Badge>
              </li>
            ))}
          </ul>
          <h4 className="section-title mt-6">Actividad reciente</h4>
          <ul className="mt-3 space-y-2">
            {activity.map((event) => (
              <li key={event.id} className="text-sm text-text-700">
                <span className="font-semibold text-text-900">{event.actorName}</span> {event.summary}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

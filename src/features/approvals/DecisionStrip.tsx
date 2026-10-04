import { Link, useParams } from "react-router-dom";
import { useDemo } from "@/app/DemoProvider";
import {
  approvalArea,
  formatHoursUntil,
  formatSimulatedArs,
  hoursUntil,
  projectApprovalImpact,
  readDecisionImpact,
} from "@/domain/pitchScenario";
import { cn } from "@/lib/format";

export function DecisionStrip() {
  const { state } = useDemo();
  const { aprobacionId } = useParams();
  if (!state) return null;

  const impact = readDecisionImpact(state.metrics.current);
  const open = state.approvals.filter(
    (item) => item.status === "pending" || item.status === "in_review",
  );

  return (
    <section aria-label="Recomendaciones abiertas por área">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="section-title">Recomendaciones abiertas</h3>
          <p className="mt-1 text-sm text-text-600">
            Cada tarjeta proyecta costo, caja y entregas. El plazo es el tiempo que falta para
            aprobar. Al confirmar, Actividad suma un evento y Métricas mueve esas tres cifras.
          </p>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {open.map((item) => {
          const area =
            approvalArea(item.id) ??
            state.results.find((result) => result.id === item.resultId)?.area ??
            "Área";
          const projected = projectApprovalImpact(impact, item.id);
          const hours = hoursUntil(item.dueAt, state.metadata.demoNow);
          const selected = aprobacionId === item.id;
          return (
            <Link
              key={item.id}
              to={`/aprobaciones/${item.id}`}
              className={cn(
                "card-surface block min-w-[280px] max-w-[320px] shrink-0 snap-start p-4",
                selected && "border-cyan-500 ring-2 ring-cyan-500/30",
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-petrol-700">
                {area}
              </p>
              <p className="mt-1 font-display text-base font-semibold leading-snug">{item.title}</p>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-text-600">Costo</dt>
                  <dd className="text-right font-semibold">
                    {projected ? formatSimulatedArs(projected.costoUsd) : "Sin cifra simulada"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-text-600">Caja</dt>
                  <dd className="text-right font-semibold">
                    {projected ? formatSimulatedArs(projected.cajaUsd) : "Sin cifra simulada"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-text-600">Entregas</dt>
                  <dd className="text-right font-semibold">
                    {projected
                      ? `${projected.entregasEnRiesgo} en riesgo · simulado`
                      : "Sin cifra simulada"}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs font-semibold text-amber-700">{formatHoursUntil(hours)}</p>
            </Link>
          );
        })}
        {open.length === 0 ? (
          <p className="text-sm text-text-600">No hay recomendaciones abiertas en la demo.</p>
        ) : null}
      </div>
    </section>
  );
}

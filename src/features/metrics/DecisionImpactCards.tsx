import { Card } from "@/components/ui/Card";
import {
  IMPACT_BASELINE,
  formatSimulatedArs,
  readDecisionImpact,
} from "@/domain/pitchScenario";
import type { MetricCurrent } from "@/domain/types";

export function DecisionImpactCards({ current }: { current: MetricCurrent }) {
  const impact = readDecisionImpact(current);
  const rows = [
    {
      label: "Costo expuesto",
      value: formatSimulatedArs(impact.costoUsd),
      before: formatSimulatedArs(IMPACT_BASELINE.costoUsd),
      moved: impact.costoUsd !== IMPACT_BASELINE.costoUsd,
    },
    {
      label: "Caja disponible",
      value: formatSimulatedArs(impact.cajaUsd),
      before: formatSimulatedArs(IMPACT_BASELINE.cajaUsd),
      moved: impact.cajaUsd !== IMPACT_BASELINE.cajaUsd,
    },
    {
      label: "Entregas en riesgo",
      value: `${impact.entregasEnRiesgo} · simulado`,
      before: `${IMPACT_BASELINE.entregasEnRiesgo} · simulado`,
      moved: impact.entregasEnRiesgo !== IMPACT_BASELINE.entregasEnRiesgo,
    },
  ];

  return (
    <section aria-label="Costo, caja y entregas">
      <p className="text-sm text-text-600">
        Estas tres cifras se mueven cuando se aprueba una recomendación. El resto del tablero
        permanece en el escenario simulado.
      </p>
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        {rows.map((row) => (
          <Card key={row.label} className={row.moved ? "p-4 ring-2 ring-cyan-500" : "p-4"}>
            <p className="text-xs font-medium uppercase tracking-wide text-text-600">{row.label}</p>
            <p className="stat-value mt-2 text-2xl">{row.value}</p>
            <p className="mt-1 text-xs text-text-600">
              {row.moved ? `Antes ${row.before}` : "Sin movimiento de aprobación"}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

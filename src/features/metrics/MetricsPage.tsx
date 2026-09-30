import { useMemo, useState } from "react";
import { useDemo } from "@/app/DemoProvider";
import { TrendChart } from "@/components/charts/TrendChart";
import { HealthPieChart, RubroBarChart } from "@/components/charts/BoardCharts";
import { Card } from "@/components/ui/Card";
import { RUBROS } from "@/domain/types";
import { formatPercent } from "@/lib/format";
import { matchesRubroFilter, pymeSolidity } from "@/lib/rubros";
import { DecisionImpactCards } from "./DecisionImpactCards";

export function MetricsPage() {
  const { state, activeRubros } = useDemo();
  const [period, setPeriod] = useState<"30" | "90">("30");

  const trend = useMemo(() => {
    if (!state) return [];
    const points = period === "30" ? state.metrics.trend.slice(-4) : state.metrics.trend;
    return points.map((p) => ({
      period: p.period,
      cobertura: Math.round(p.knowledgeCoverage * 100),
      confianza: Math.round(p.averageConfidence * 100),
      horas: p.estimatedHoursSaved,
      decisiones: p.decisionsSupported,
    }));
  }, [state, period]);

  if (!state) return null;
  const m = state.metrics.current;
  const decisions = m.decisionsSupported ?? 9;
  const risksResolved = m.risksResolved ?? 0;
  const solidity = pymeSolidity(state.businessAreas);
  const painsOpen = state.pains.filter((p) => matchesRubroFilter(p.rubroIds, activeRubros)).length;
  const actionsOpen = state.actions.filter((a) => a.status !== "done").length;
  const newsHigh = state.newsItems.filter(
    (n) => n.severity === "high" && matchesRubroFilter(n.rubroIds, activeRubros),
  ).length;

  const rubroBars = state.metrics.rubroCoverage
    .filter((c) => (activeRubros.length ? activeRubros.includes(c.rubroId) : true))
    .map((c) => ({
      name: RUBROS.find((r) => r.id === c.rubroId)?.label ?? c.rubroId,
      cobertura: Math.round(c.coverageScore * 100),
      documentos: c.documentCount,
    }));

  const healthPie = [
    { name: "Cumple", value: solidity.healthy },
    { name: "Débil", value: solidity.weak },
    { name: "Faltante", value: solidity.missing },
  ];

  const actionFunnel = [
    {
      name: "Planificadas",
      value: state.actions.filter((a) => a.status === "planned").length,
    },
    {
      name: "En curso",
      value: state.actions.filter((a) => a.status === "in_progress").length,
    },
    {
      name: "Hechas",
      value: state.actions.filter((a) => a.status === "done").length,
    },
  ];

  return (
    <div className="page-enter space-y-6">
      <DecisionImpactCards current={state.metrics.current} />
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-text-700">
          Período
          <select
            className="ml-2 h-10 rounded-lg border border-border-200 bg-surface-0 px-3"
            value={period}
            onChange={(e) => setPeriod(e.target.value as "30" | "90")}
          >
            <option value="30">30 días</option>
            <option value="90">90 días</option>
          </select>
        </label>
        <p className="text-sm text-text-600">
          Tablero general simulado · impacto marcado como estimado · filtro de rubro activo arriba.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Solidez pyme", solidity.solid ? "Sólida" : "En riesgo", "regla demo"],
          ["Dolores abiertos", String(painsOpen), "conteo"],
          ["Acciones en curso", String(actionsOpen), "conteo"],
          ["Novedades críticas", String(newsHigh), "periodo simulado"],
          ["Quiebres anticipados", String(m.potentialStockoutsAnticipated), "unidades"],
          ["Horas ahorradas (est.)", String(m.estimatedHoursSavedMonthly), "horas"],
          [
            "Entregas en fecha",
            `${formatPercent(m.onTimeDelivery)} / base ${formatPercent(m.onTimeDeliveryBaseline)}`,
            "%",
          ],
          ["Decisiones / riesgos", `${decisions} / ${risksResolved}`, "conteo"],
          [
            "Cotizaciones",
            `${m.quotePreparationHours}h vs ${m.quotePreparationBaselineHours}h`,
            "horas",
          ],
          [
            "Oportunidades",
            `USD ${m.estimatedOpportunitiesEquivalentUsd.toLocaleString("es-AR")}`,
            "estimado",
          ],
          ["Cobertura conocimiento", formatPercent(m.knowledgeCoverage), "%"],
          ["Confianza promedio", formatPercent(m.averageConfidence), "%"],
        ].map(([label, value, unit]) => (
          <Card key={label} className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-text-600">{label}</p>
            <p className="stat-value mt-2 text-xl md:text-2xl">{value}</p>
            <p className="mt-1 text-xs text-text-600">
              {unit} · {period} días
            </p>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <h3 className="section-title">Cobertura por rubro</h3>
          <p className="mt-1 text-sm text-text-600">Porcentaje derivado de documentos y resultados.</p>
          <div className="mt-3">
            <RubroBarChart data={rubroBars} ariaLabel="Cobertura por rubro" />
          </div>
          <ul className="mt-3 space-y-1 text-sm text-text-600">
            {rubroBars.map((r) => (
              <li key={r.name}>
                {r.name}: {r.cobertura}% · {r.documentos} documentos
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="section-title">Salud de áreas del Gemelo</h3>
          <p className="mt-1 text-sm text-text-600">Distribución verde / ámbar / rojo.</p>
          <HealthPieChart data={healthPie} ariaLabel="Salud de áreas" />
          <ul className="mt-2 flex flex-wrap gap-3 text-sm text-text-700">
            {healthPie.map((h) => (
              <li key={h.name}>
                <strong>{h.name}:</strong> {h.value}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <h3 className="section-title">Tendencia cobertura y confianza</h3>
          <div className="mt-3 rounded-xl border border-border-100 bg-surface-50/50 p-3">
            <TrendChart data={trend} ariaLabel="Tendencia semanal" />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="section-title">Embudo de acciones</h3>
          <p className="mt-1 text-sm text-text-600">Estado de la red de acciones del Proceso.</p>
          <div className="mt-4 space-y-3">
            {actionFunnel.map((row) => (
              <div key={row.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{row.name}</span>
                  <strong>{row.value}</strong>
                </div>
                <div className="h-2 rounded-full bg-border-100">
                  <div
                    className="h-2 rounded-full bg-petrol-700"
                    style={{ width: `${Math.min(100, row.value * 20)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

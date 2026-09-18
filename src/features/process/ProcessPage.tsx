import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PROCESS_STEPS } from "./processSteps";
import { useDemo } from "@/app/DemoProvider";
import { matchesRubroFilter } from "@/lib/rubros";

export function ProcessPage() {
  return (
    <div className="page-enter space-y-8">
      <Card variant="panel" className="overflow-hidden p-0">
        <div className="relative border-b border-border-200 bg-gradient-to-br from-navy-950 via-navy-900 to-petrol-700 px-6 py-8 text-white md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Cómo funciona
          </p>
          <h3 className="font-display mt-3 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            Del primer contacto con el cliente al ritmo semana a semana
          </h3>
          <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">
            El Gemelo Digital Operativo no es una consulta puntual: es un ciclo que arranca con un
            caso de uso, conecta conocimiento y termina en decisiones trazables que se repiten cada
            semana.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-2 px-6 py-4 md:px-8"
          aria-label="Etapas del proceso"
        >
          {PROCESS_STEPS.map((step) => (
            <a
              key={step.id}
              href={`#${step.id}`}
              className="rounded-full border border-border-200 bg-surface-0 px-3 py-1.5 text-xs font-semibold text-text-700 transition hover:border-cyan-500 hover:text-petrol-700"
            >
              {step.number} · {step.shortTitle}
            </a>
          ))}
          <a
            href="#dolores"
            className="rounded-full border border-border-200 bg-surface-0 px-3 py-1.5 text-xs font-semibold text-text-700 transition hover:border-cyan-500"
          >
            Dolores
          </a>
          <a
            href="#acciones"
            className="rounded-full border border-border-200 bg-surface-0 px-3 py-1.5 text-xs font-semibold text-text-700 transition hover:border-cyan-500"
          >
            Acciones
          </a>
        </nav>
      </Card>

      <ol className="relative space-y-6">
        <div
          className="absolute left-[1.35rem] top-4 bottom-4 hidden w-px bg-gradient-to-b from-cyan-500 via-border-300 to-petrol-700 md:block"
          aria-hidden
        />
        {PROCESS_STEPS.map((step) => (
          <li key={step.id} id={step.id} className="scroll-mt-28">
            <Card className="relative md:ml-2 md:pl-4">
              <div className="flex flex-col gap-5 p-5 md:flex-row md:gap-8 md:p-7">
                <div className="flex shrink-0 items-start gap-3">
                  <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-cyan-500 bg-navy-950 font-display text-sm font-semibold text-cyan-400 shadow-[var(--shadow-card)]">
                    {step.number}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="section-title text-xl md:text-2xl">{step.title}</h4>
                    <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-petrol-700">
                      {step.demoState}
                    </span>
                  </div>
                  <p className="mt-2 text-base text-text-700">{step.summary}</p>
                  <p className="mt-3 text-sm leading-relaxed text-text-600">{step.detail}</p>
                  {step.ritual ? (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {step.ritual.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 rounded-lg border border-border-100 bg-surface-50/80 px-3 py-2 text-sm text-text-700"
                        >
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-teal-500"
                            aria-hidden
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-5">
                    <Link to={step.cta.to}>
                      <Button>
                        {step.cta.label}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ol>

      <PainsAndActions />

      <Card variant="quiet" className="p-5 md:p-6">
        <p className="text-sm text-text-600">
          En esta demo el ciclo ya está en marcha con AndesPack Industrial S.A. Podés ensayar el
          recorrido ejecutivo desde Inicio: riesgo de liner → evidencia → aprobación → actividad →
          métricas.
        </p>
        <Link to="/inicio" className="mt-3 inline-flex text-sm font-semibold text-petrol-700 hover:underline">
          Volver a Inicio
        </Link>
      </Card>
    </div>
  );
}

function PainsAndActions() {
  const { state, activeRubros } = useDemo();
  if (!state) return null;

  const pains = state.pains.filter((p) => matchesRubroFilter(p.rubroIds, activeRubros));
  const actions = state.actions.filter((a) => {
    const pain = state.pains.find((p) => p.id === a.painId);
    return pain ? matchesRubroFilter(pain.rubroIds, activeRubros) : true;
  });

  return (
    <>
      <section id="dolores" className="scroll-mt-28 space-y-4">
        <Card variant="panel" className="p-5 md:p-6">
          <h3 className="font-display text-2xl font-semibold">Dolores de la empresa</h3>
          <p className="mt-2 text-sm text-text-600">
            Situaciones que hoy frenan o exponen a AndesPack. Cada dolor genera acciones concretas.
          </p>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {pains.map((pain) => (
            <Card key={pain.id} className="p-5">
              <Badge tone={pain.severity === "critical" || pain.severity === "high" ? "danger" : "medium"}>
                {pain.severity}
              </Badge>
              <h4 className="mt-3 font-display text-lg font-semibold">{pain.title}</h4>
              <p className="mt-2 text-sm text-text-700">{pain.summary}</p>
              <p className="mt-3 text-xs text-text-600">Evidencia: {pain.evidence}</p>
              <p className="mt-2 text-xs font-semibold text-petrol-700">
                {pain.actionIds.length} acciones vinculadas
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section id="acciones" className="scroll-mt-28 space-y-4">
        <Card variant="panel" className="p-5 md:p-6">
          <h3 className="font-display text-2xl font-semibold">Red de acciones</h3>
          <p className="mt-2 text-sm text-text-600">
            Del dolor a la acción y al área del Gemelo responsable de ejecutarla.
          </p>
        </Card>
        <Card className="overflow-hidden p-0">
          <div className="relative min-h-[280px] bg-gradient-to-br from-surface-50 to-surface-100 p-6">
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              {actions.map((action, index) => {
                const x1 = 12;
                const y1 = 40 + index * 36;
                const x2 = 48;
                const y2 = y1;
                const x3 = 82;
                return (
                  <g key={action.id}>
                    <line x1={`${x1}%`} y1={y1} x2={`${x2}%`} y2={y2} stroke="#B3C0CD" strokeWidth="1.5" />
                    <line x1={`${x2}%`} y1={y2} x2={`${x3}%`} y2={y2} stroke="#19B5D1" strokeWidth="1.5" />
                  </g>
                );
              })}
            </svg>
            <div className="relative grid gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-600">Dolor</p>
                {actions.map((action) => {
                  const pain = state.pains.find((p) => p.id === action.painId);
                  return (
                    <div
                      key={`pain-${action.id}`}
                      className="rounded-xl border border-border-200 bg-surface-0 px-3 py-2 text-sm font-medium"
                    >
                      {pain?.title ?? action.painId}
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-600">Acción</p>
                {actions.map((action) => (
                  <div
                    key={action.id}
                    className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-3 py-2 text-sm"
                  >
                    <p className="font-semibold">{action.title}</p>
                    <p className="text-xs text-text-600">{action.estimatedImpact}</p>
                    {action.resultId ? (
                      <Link
                        className="mt-1 inline-block text-xs font-semibold text-petrol-700 hover:underline"
                        to={`/resultados/${action.resultId}`}
                      >
                        Ver resultado
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-600">Área</p>
                {actions.map((action) => {
                  const area = state.businessAreas.find((a) => a.id === action.areaId);
                  return (
                    <Link
                      key={`area-${action.id}`}
                      to={`/gemelo?area=${action.areaId}`}
                      className="block rounded-xl border border-border-200 bg-surface-0 px-3 py-2 text-sm font-semibold hover:border-cyan-500"
                    >
                      {area?.name ?? action.areaId}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}

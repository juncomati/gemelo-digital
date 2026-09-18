import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PROCESS_STEPS } from "@/features/process/processSteps";
import { Card } from "@/components/ui/Card";

export function ProcessSummary() {
  return (
    <Card variant="panel" className="overflow-hidden p-0">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border-200 bg-gradient-to-r from-navy-950 to-navy-800 px-5 py-4 text-white">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-400">
            Proceso del Gemelo
          </p>
          <p className="font-display mt-1 text-lg font-semibold">
            Del cliente al ritmo semanal
          </p>
        </div>
        <Link
          to="/proceso"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 transition hover:text-cyan-400/80"
        >
          Ver proceso completo
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <ol className="grid gap-0 sm:grid-cols-5">
        {PROCESS_STEPS.map((step, index) => (
          <li key={step.id} className="relative border-border-200 sm:border-r sm:last:border-r-0">
            <Link
              to={`/proceso#${step.id}`}
              className="group block h-full px-4 py-4 transition hover:bg-cyan-500/5"
            >
              <span className="font-display text-xs font-semibold text-cyan-500">{step.number}</span>
              <p className="mt-1 text-sm font-semibold text-text-900 group-hover:text-petrol-700">
                {step.shortTitle}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-snug text-text-600">{step.summary}</p>
              {index < PROCESS_STEPS.length - 1 ? (
                <span
                  className="pointer-events-none absolute top-1/2 -right-2 z-10 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-border-200 bg-surface-0 sm:block"
                  aria-hidden
                />
              ) : null}
            </Link>
          </li>
        ))}
      </ol>
    </Card>
  );
}

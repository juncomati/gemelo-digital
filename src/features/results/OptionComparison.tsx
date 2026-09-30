import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BUY_OPTIONS } from "@/domain/pitchScenario";
import { cn } from "@/lib/format";

const SHARED = [
  { id: "pedido", label: "Pedido", x: 70 },
  { id: "corte", label: "Corte", x: 230 },
  { id: "consumo", label: "Consumo de liner", x: 430 },
  { id: "armado", label: "Armado", x: 640 },
  { id: "despacho", label: "Despacho", x: 830 },
];

export function OptionComparison() {
  const legend = BUY_OPTIONS[0]?.figures ?? [];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="p-4 md:p-5">
        <h3 className="section-title">Opciones para el liner</h3>
        <p className="mt-1 text-sm text-text-600">
          Tres alternativas simuladas. Cada barra agrupa costo, plazo, calidad y caja. La altura
          es un índice simulado: mayor es mejor resultado. La opción recomendada queda resaltada.
        </p>
        <ul className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-text-700">
          {legend.map((figure) => (
            <li key={figure.key} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: figure.color }} />
              {figure.label}
            </li>
          ))}
        </ul>
        <div
          className="mt-4 grid gap-3 md:grid-cols-3"
          role="group"
          aria-label="Barras agrupadas de comprar ya, comprar parcial y esperar"
        >
          {BUY_OPTIONS.map((option) => (
            <article
              key={option.id}
              className={cn(
                "rounded-2xl border p-3",
                option.recommended
                  ? "border-cyan-500 bg-cyan-500/10 shadow-[var(--shadow-elevated)]"
                  : "border-border-200 bg-surface-0",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-display text-base font-semibold">{option.label}</h4>
                {option.recommended ? <Badge tone="info">Recomendado</Badge> : null}
              </div>
              <div className="mt-3 flex h-36 items-end gap-2 border-b border-border-200" aria-hidden>
                {option.figures.map((figure) => (
                  <div key={figure.key} className="flex h-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: `${figure.score}%`,
                        background: option.recommended ? figure.color : "#C5D0DB",
                      }}
                      title={`${figure.label}: ${figure.display} simulado`}
                    />
                  </div>
                ))}
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {option.figures.map((figure) => (
                  <li key={figure.key} className="flex items-baseline justify-between gap-2">
                    <span className="text-text-600">{figure.label}</span>
                    <span className={cn("font-semibold", option.recommended && "text-navy-950")}>
                      {figure.display} · simulado
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Card>

      <Card className="p-4 md:p-5">
        <h3 className="section-title">Plan y con quiebre</h3>
        <p className="mt-1 text-sm text-text-600">
          El mismo mapa superpuesto. Los pasos compartidos quedan atenuados. La única diferencia
          de color fuerte es el camino extra: compra urgente y reproceso.
        </p>
        <ul className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-text-700">
          <li className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-border-300" /> pasos compartidos
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span className="h-1 w-6 rounded-full bg-petrol-600/50" /> plan
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-red-600" /> con quiebre
          </li>
        </ul>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border-200 bg-[#f7fafc]">
          <svg viewBox="0 0 920 300" className="h-auto w-full" role="img" aria-labelledby="variant-title variant-desc">
            <title id="variant-title">Comparación de variantes del flujo</title>
            <desc id="variant-desc">
              Plan y con quiebre comparten pedido, corte, consumo de liner, armado y despacho en
              gris. Con quiebre agrega compra urgente y reproceso en rojo.
            </desc>
            <path
              d="M 70 92 H 830"
              fill="none"
              stroke="#C5D0DB"
              strokeWidth={16}
              strokeLinecap="round"
            />
            <path
              d="M 70 128 H 830"
              fill="none"
              stroke="#176384"
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.28}
            />
            <path
              d="M 230 116 L 310 198 L 430 116"
              fill="none"
              stroke="#C93C43"
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 640 116 L 720 198 L 830 116"
              fill="none"
              stroke="#C93C43"
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {SHARED.map((node) => (
              <g key={node.id} transform={`translate(${node.x - 58} 68)`}>
                <rect width={116} height={48} rx={12} fill="#EEF2F6" stroke="#C5D0DB" />
                <text
                  x={58}
                  y={29}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill="#5C6B7A"
                  fontFamily="IBM Plex Sans, sans-serif"
                >
                  {node.label}
                </text>
              </g>
            ))}
            <g transform="translate(246 176)">
              <rect width={128} height={44} rx={12} fill="#C93C43" />
              <text
                x={64}
                y={27}
                textAnchor="middle"
                fontSize={12}
                fontWeight={700}
                fill="#ffffff"
                fontFamily="IBM Plex Sans, sans-serif"
              >
                Compra urgente
              </text>
            </g>
            <g transform="translate(656 176)">
              <rect width={128} height={44} rx={12} fill="#C93C43" />
              <text
                x={64}
                y={27}
                textAnchor="middle"
                fontSize={12}
                fontWeight={700}
                fill="#ffffff"
                fontFamily="IBM Plex Sans, sans-serif"
              >
                Reproceso
              </text>
            </g>
          </svg>
        </div>
        <ul className="mt-3 space-y-1 text-sm text-text-700">
          <li>Plan: pedido → corte → consumo de liner → armado → despacho.</li>
          <li>Con quiebre: el mismo recorrido más compra urgente y reproceso.</li>
          <li>Cifras y caminos: simulados.</li>
        </ul>
      </Card>
    </div>
  );
}

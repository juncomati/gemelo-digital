import { useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  CAUSAL_EDGES,
  CAUSAL_KIND_LABEL,
  CAUSAL_NODES,
  CAUSAL_PATH_LABEL,
  causalNodeMap,
  type CausalEdge,
  type CausalKind,
} from "@/domain/pitchScenario";

const KIND_COLOR: Record<CausalKind, string> = {
  evidencia: "#176384",
  depende: "#B7791F",
  hueco: "#C93C43",
};

const NODE_W = 196;
const NODE_H = 68;

function nodeById(id: string) {
  const node = causalNodeMap().get(id);
  if (!node) throw new Error(`Nodo causal ausente: ${id}`);
  return node;
}

function edgeGeometry(edge: CausalEdge) {
  const from = nodeById(edge.from);
  const to = nodeById(edge.to);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const pad = NODE_H / 2 + 8;
  const x1 = from.x + (dx / len) * (Math.abs(dx) > Math.abs(dy) ? NODE_W / 2 + 6 : pad);
  const y1 = from.y + (dy / len) * (Math.abs(dy) >= Math.abs(dx) ? pad : NODE_H / 2 + 4);
  const x2 = to.x - (dx / len) * (Math.abs(dx) > Math.abs(dy) ? NODE_W / 2 + 10 : pad);
  const y2 = to.y - (dy / len) * (Math.abs(dy) >= Math.abs(dx) ? pad + 4 : NODE_H / 2 + 4);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * edge.bend;
  const cy = my + ny * edge.bend;
  const horizontal = Math.abs(dy) < Math.abs(dx);
  const labelX = edge.onPath ? from.x + 214 : horizontal ? mx : cx;
  const labelY = edge.onPath ? (y1 + y2) / 2 : horizontal ? my - 22 : cy;
  const d =
    edge.bend === 0 ? `M ${x1} ${y1} L ${x2} ${y2}` : `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  return { d, labelX, labelY };
}

export function CausalAreaGraph() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pathActive = selectedId === "quiebre";

  const select = (id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  };

  return (
    <Card className="p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="section-title">Relaciones del quiebre de liner</h3>
          <p className="mt-1 max-w-2xl text-sm text-text-600">
            Áreas de AndesPack y el quiebre de papel liner. Las flechas son evidencia, depende de
            o hueco. Seleccioná el quiebre para iluminar un solo camino.
          </p>
        </div>
        <ul className="flex flex-wrap gap-3 text-xs font-semibold text-text-700">
          {(Object.keys(KIND_COLOR) as CausalKind[]).map((kind) => (
            <li key={kind} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-6 rounded-full"
                style={{
                  background: KIND_COLOR[kind],
                  outline: kind === "hueco" ? "1px dashed #C93C43" : undefined,
                }}
              />
              {CAUSAL_KIND_LABEL[kind]}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-border-200 bg-[linear-gradient(180deg,#f8fbfc_0%,#eef3f7_100%)]">
        <svg viewBox="0 0 900 640" className="h-auto w-full" role="group" aria-label="Grafo de áreas">
          <defs>
            {(Object.keys(KIND_COLOR) as CausalKind[]).map((kind) => (
              <marker
                key={kind}
                id={`arrow-${kind}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M 0 1.2 L 10 5 L 0 8.8 Z" fill={KIND_COLOR[kind]} />
              </marker>
            ))}
          </defs>

          {CAUSAL_EDGES.map((edge) => {
            const geo = edgeGeometry(edge);
            const incident =
              selectedId !== null &&
              selectedId !== "quiebre" &&
              (edge.from === selectedId || edge.to === selectedId);
            const visible = pathActive ? edge.onPath : selectedId ? incident : true;
            const color = KIND_COLOR[edge.kind];
            const strong = pathActive && edge.onPath;
            if (!visible) return null;
            const label = CAUSAL_KIND_LABEL[edge.kind];
            const pillW = Math.max(96, label.length * 8 + 18);
            return (
              <g key={edge.id}>
                <path
                  d={geo.d}
                  fill="none"
                  stroke={visible ? color : "#94A3B3"}
                  strokeWidth={strong ? 3.6 : visible ? 2.2 : 1.4}
                  strokeDasharray={
                    edge.kind === "hueco" ? "1.5 5" : edge.kind === "depende" ? "7 4" : undefined
                  }
                  strokeLinecap="round"
                  markerEnd={`url(#arrow-${edge.kind})`}
                />
                <g transform={`translate(${geo.labelX} ${geo.labelY})`}>
                  <rect
                    x={-pillW / 2}
                    y={-11}
                    width={pillW}
                    height={20}
                    rx={10}
                    fill="#ffffff"
                    stroke={color}
                    strokeWidth={1}
                  />
                  <text
                    textAnchor="middle"
                    y={3.5}
                    fontSize={11}
                    fontWeight={600}
                    fill={color}
                    fontFamily="IBM Plex Sans, sans-serif"
                  >
                    {CAUSAL_KIND_LABEL[edge.kind]}
                  </text>
                </g>
              </g>
            );
          })}

          {CAUSAL_NODES.map((node) => {
            const selected = selectedId === node.id;
            const dim = pathActive && !node.onPath && node.id !== "quiebre";
            const onPathLit = pathActive && node.onPath;
            const fill = selected && node.id === "quiebre" ? "#C93C43" : "#ffffff";
            const titleFill = selected && node.id === "quiebre" ? "#ffffff" : "#15202B";
            const detailFill = selected && node.id === "quiebre" ? "#ffe8e8" : "#5C6B7A";
            const stroke = onPathLit || selected ? "#19B5D1" : "#D0DAE4";
            return (
              <g
                key={node.id}
                className="cursor-pointer outline-none"
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                aria-label={
                  node.id === "quiebre"
                    ? "Quiebre de liner. Ilumina un solo camino entre áreas."
                    : `${node.label}, ${node.detail}`
                }
                opacity={dim ? 0.38 : 1}
                transform={`translate(${node.x - NODE_W / 2} ${node.y - NODE_H / 2})`}
                onClick={() => select(node.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select(node.id);
                  }
                }}
              >
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={16}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={onPathLit || selected ? 2.5 : 1.25}
                />
                <text
                  x={16}
                  y={28}
                  fontSize={15}
                  fontWeight={600}
                  fill={titleFill}
                  fontFamily="IBM Plex Serif, serif"
                >
                  {node.label}
                </text>
                <text
                  x={16}
                  y={48}
                  fontSize={12}
                  fill={detailFill}
                  fontFamily="IBM Plex Sans, sans-serif"
                >
                  {node.detail}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-3 text-sm text-text-700" aria-live="polite">
        {pathActive
          ? `Camino iluminado: ${CAUSAL_PATH_LABEL}.`
          : "Ningún camino resaltado. El resto de las flechas sigue visible hasta que elijas el quiebre."}
      </p>

      <ul className="mt-3 grid gap-1 text-xs text-text-600 sm:grid-cols-2">
        {CAUSAL_EDGES.map((edge) => {
          const from = nodeById(edge.from);
          const to = nodeById(edge.to);
          return (
            <li key={edge.id}>
              {from.label} → {to.label}: {CAUSAL_KIND_LABEL[edge.kind]}
              {edge.onPath ? " · camino del quiebre" : ""}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

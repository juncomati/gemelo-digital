import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  FLOW_AREAS,
  FLOW_CANVAS,
  FLOW_EDGES,
  FLOW_LENS_FRAME,
  FLOW_LENSES,
  FLOW_NODES,
  flowNodeMap,
  volumeWidth,
  waitColor,
  waitTone,
  type FlowArea,
  type FlowEdge,
  type FlowLens,
} from "@/domain/pitchScenario";
import { cn } from "@/lib/format";

const FULL = { x: 0, y: 0, w: FLOW_CANVAS.width, h: FLOW_CANVAS.height };

type Box = { x: number; y: number; w: number; h: number };

function nodePad(id: string, horizontal: boolean): number {
  if (id === "consumo") return horizontal ? 92 : 46;
  return horizontal ? 68 : 34;
}

function edgePath(edge: FlowEdge): string {
  const nodes = flowNodeMap();
  const from = nodes.get(edge.from);
  const to = nodes.get(edge.to);
  if (!from || !to) return "";
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const horizontal = Math.abs(dx) >= Math.abs(dy);
  const padStart = nodePad(from.id, horizontal);
  const padEnd = nodePad(to.id, horizontal);
  const x1 = from.x + (dx / len) * padStart;
  const y1 = from.y + (dy / len) * padStart;
  const x2 = to.x - (dx / len) * padEnd;
  const y2 = to.y - (dy / len) * padEnd;
  if (Math.abs(dy) < 12 || Math.abs(dx) < 12) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }
  const mx = (x1 + x2) / 2 + (dy > 0 ? 28 : -28);
  const my = (y1 + y2) / 2;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

function useLensBox(lens: FlowLens | null): Box {
  const target = lens ? FLOW_LENS_FRAME[lens] : FULL;
  const [box, setBox] = useState<Box>(FULL);
  const current = useRef<Box>(FULL);

  useEffect(() => {
    const from = current.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      current.current = target;
      setBox(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 520);
      const e = 1 - (1 - t) ** 3;
      const next = {
        x: from.x + (target.x - from.x) * e,
        y: from.y + (target.y - from.y) * e,
        w: from.w + (target.w - from.w) * e,
        h: from.h + (target.h - from.h) * e,
      };
      current.current = next;
      setBox(next);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return box;
}

export function OrderFlowMap() {
  const [lens, setLens] = useState<FlowLens | null>(null);
  const [areasOn, setAreasOn] = useState<Record<FlowArea, boolean>>({
    operaciones: true,
    compras: true,
    finanzas: true,
    calidad: true,
    personas: true,
  });
  const box = useLensBox(lens);
  const nodes = flowNodeMap();

  const toggleLens = (id: FlowLens) => {
    setLens((current) => (current === id ? null : id));
  };

  const toggleArea = (id: FlowArea) => {
    setAreasOn((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <Card className="p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 id="flujo-pedidos" className="section-title">
            Flujo de pedido
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-text-600">
            Pedido, corte, consumo de liner, armado y despacho. El grosor es el volumen de pedidos
            y el color es la espera. El tramo hacia consumo de liner concentra ambos.
          </p>
        </div>
        <ul className="flex flex-wrap gap-3 text-xs font-semibold text-text-700">
          <li className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-green-600" /> espera baja
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-amber-500" /> espera media
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span className="h-2 w-8 rounded-full bg-red-600" /> espera alta
          </li>
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Lentes del flujo">
        {FLOW_LENSES.map((item) => {
          const active = lens === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggleLens(item.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                active
                  ? "border-petrol-700 bg-petrol-700 text-white"
                  : "border-border-200 bg-surface-0 text-text-700 hover:border-cyan-500",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        className="mt-3 flex flex-wrap gap-2"
        role="group"
        aria-label="Enlaces por área"
      >
        {FLOW_AREAS.map((area) => {
          const on = areasOn[area.id];
          return (
            <button
              key={area.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggleArea(area.id)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-semibold",
                on
                  ? "border-cyan-500/40 bg-cyan-500/10 text-petrol-700"
                  : "border-border-200 bg-surface-50 text-text-600 line-through",
              )}
            >
              {area.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border-200 bg-[#f7fafc]">
        <svg
          viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
          className="h-[440px] w-full"
          role="group"
          aria-label="Mapa del flujo de pedido"
        >
          {FLOW_EDGES.map((edge) => {
            if (!areasOn[edge.area]) return null;
            const color = waitColor(edge.waitHours);
            const width = volumeWidth(edge.volume);
            const from = nodes.get(edge.from);
            const to = nodes.get(edge.to);
            const labelX = from && to ? (from.x + to.x) / 2 : 0;
            const labelY = from && to ? Math.min(from.y, to.y) - 28 : 0;
            return (
              <g key={edge.id}>
                <path
                  d={edgePath(edge)}
                  fill="none"
                  stroke={color}
                  strokeWidth={width}
                  strokeLinecap="round"
                >
                  <title>
                    {edge.volume} pedidos · {edge.waitHours.toLocaleString("es-AR")} h de espera ·{" "}
                    {edge.area}
                  </title>
                </path>
                {edge.id === "f_cor_con" ? (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={700}
                    fill="#C93C43"
                    fontFamily="IBM Plex Sans, sans-serif"
                  >
                    {edge.waitHours.toLocaleString("es-AR")} h · {edge.volume} pedidos
                  </text>
                ) : null}
              </g>
            );
          })}
          {FLOW_NODES.map((node) => {
            const emphasized = lens === null || node.lenses.includes(lens);
            const wide = node.id === "consumo";
            const w = wide ? 168 : 124;
            const h = node.waiting ? 78 : 56;
            return (
              <g key={node.id} opacity={emphasized ? 1 : 0.72} transform={`translate(${node.x - w / 2} ${node.y - h / 2})`}>
                <rect
                  width={w}
                  height={h}
                  rx={14}
                  fill="#ffffff"
                  stroke={node.waiting ? "#C93C43" : emphasized && lens ? "#19B5D1" : "#D0DAE4"}
                  strokeWidth={node.waiting ? 2.4 : emphasized && lens ? 2.2 : 1.2}
                />
                <text
                  x={w / 2}
                  y={node.waiting ? 22 : node.inProgress ? 24 : 33}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={600}
                  fill="#15202B"
                  fontFamily="IBM Plex Sans, sans-serif"
                >
                  {node.label}
                </text>
                {node.inProgress ? (
                  <text
                    x={w / 2}
                    y={node.waiting ? 40 : 42}
                    textAnchor="middle"
                    fontSize={11}
                    fill="#5C6B7A"
                    fontFamily="IBM Plex Sans, sans-serif"
                  >
                    {node.inProgress} en curso
                  </text>
                ) : null}
                {node.waiting ? (
                  <text
                    x={w / 2}
                    y={58}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={700}
                    fill="#C93C43"
                    fontFamily="IBM Plex Sans, sans-serif"
                  >
                    {node.waiting} en espera
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-3 text-sm text-text-600" aria-live="polite">
        {lens
          ? `Lente ${FLOW_LENSES.find((item) => item.id === lens)?.label}: el mismo mapa, recentrado.`
          : "Mapa completo. Un lente recentra el mismo grafo."}{" "}
        {FLOW_AREAS.filter((area) => !areasOn[area.id])
          .map((area) => `Enlaces de ${area.label} ocultos.`)
          .join(" ")}
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">Volumen y espera de cada tramo del flujo</caption>
          <thead className="text-xs uppercase tracking-wide text-text-600">
            <tr>
              <th className="py-2 pr-3 font-semibold">Tramo</th>
              <th className="py-2 pr-3 font-semibold">Volumen</th>
              <th className="py-2 pr-3 font-semibold">Espera</th>
              <th className="py-2 font-semibold">Área</th>
            </tr>
          </thead>
          <tbody>
            {FLOW_EDGES.map((edge) => {
              const from = nodes.get(edge.from);
              const to = nodes.get(edge.to);
              const hidden = !areasOn[edge.area];
              return (
                <tr key={edge.id} className={cn("border-t border-border-100", hidden && "text-text-600")}>
                  <td className="py-2 pr-3">
                    {from?.label} → {to?.label}
                    {edge.id === "f_cor_con" ? " · tramo crítico" : ""}
                  </td>
                  <td className="py-2 pr-3">{edge.volume} pedidos</td>
                  <td className="py-2 pr-3">
                    <span style={{ color: waitColor(edge.waitHours) }}>
                      {edge.waitHours.toLocaleString("es-AR")} h ·{" "}
                      {waitTone(edge.waitHours) === "high"
                        ? "alta"
                        : waitTone(edge.waitHours) === "mid"
                          ? "media"
                          : "baja"}
                    </span>
                  </td>
                  <td className="py-2">
                    {FLOW_AREAS.find((area) => area.id === edge.area)?.label}
                    {hidden ? " · oculto" : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

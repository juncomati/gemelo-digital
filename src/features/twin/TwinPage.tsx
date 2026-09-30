import { Link, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useDemo } from "@/app/DemoProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { AreaHealth, BusinessArea } from "@/domain/types";
import { cn, findUserName, formatAbsoluteDate } from "@/lib/format";
import { matchesRubroFilter, pymeSolidity } from "@/lib/rubros";
import { CausalAreaGraph } from "./CausalAreaGraph";

const healthTone: Record<AreaHealth, string> = {
  healthy: "border-green-600 bg-green-600 text-white",
  weak: "border-amber-500 bg-amber-500 text-navy-950",
  missing: "border-red-600 bg-red-600 text-white",
};

const healthLabel: Record<AreaHealth, string> = {
  healthy: "Cumple",
  weak: "Débil",
  missing: "Faltante",
};

export function TwinPage() {
  const { state, activeRubros, updateAreaPositions } = useDemo();
  const [params, setParams] = useSearchParams();
  const [mode, setMode] = useState<"areas" | "conocimiento">("areas");
  const [selectedId, setSelectedId] = useState<string | null>(params.get("area"));
  const [dragging, setDragging] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragMoved = useRef(false);

  const areas = useMemo(() => {
    if (!state) return [];
    return state.businessAreas
      .filter((a) => matchesRubroFilter(a.rubroIds, activeRubros))
      .map((a) => ({
        ...a,
        position: state.areaPositions[a.id] ?? a.position,
      }));
  }, [state, activeRubros]);

  useEffect(() => {
    const fromUrl = params.get("area");
    if (fromUrl) setSelectedId(fromUrl);
  }, [params]);

  const solidity = pymeSolidity(state?.businessAreas ?? []);
  const selected = state?.businessAreas.find((a) => a.id === selectedId) ?? null;

  const onPointerDown = (areaId: string, e: ReactPointerEvent) => {
    e.preventDefault();
    dragMoved.current = false;
    setDragging(areaId);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!dragging || !canvasRef.current) return;
      dragMoved.current = true;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.min(92, Math.max(8, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(92, Math.max(8, ((e.clientY - rect.top) / rect.height) * 100));
      void updateAreaPositions({ [dragging]: { x, y } });
    },
    [dragging, updateAreaPositions],
  );

  const onPointerUp = (areaId: string) => {
    setDragging(null);
    if (!dragMoved.current) {
      setSelectedId(areaId);
      const next = new URLSearchParams(params);
      next.set("area", areaId);
      setParams(next, { replace: true });
    }
  };

  if (!state) return null;

  return (
    <div className="page-enter space-y-6">
      <CausalAreaGraph />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-600">Solidez pyme</p>
          <p className="stat-value mt-2 text-2xl">{solidity.solid ? "Sólida" : "En riesgo"}</p>
          <p className="mt-1 text-xs text-text-600">0 faltantes y ≤2 débiles</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-600">Verdes</p>
          <p className="stat-value mt-2 text-2xl text-green-600">{solidity.healthy}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-600">Ámbar</p>
          <p className="stat-value mt-2 text-2xl text-amber-500">{solidity.weak}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-600">Rojos</p>
          <p className="stat-value mt-2 text-2xl text-red-600">{solidity.missing}</p>
        </Card>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button variant={mode === "areas" ? "primary" : "secondary"} onClick={() => setMode("areas")}>
          Áreas
        </Button>
        <Button
          variant={mode === "conocimiento" ? "primary" : "secondary"}
          onClick={() => setMode("conocimiento")}
        >
          Conocimiento
        </Button>
        <div className="ml-auto flex flex-wrap gap-3 text-xs font-medium text-text-700">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-600" /> Cumple
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Débil
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600" /> Faltante
          </span>
        </div>
      </div>

      {mode === "areas" ? (
        <Card className="p-4 md:p-5">
          <p className="mb-3 text-sm text-text-600">
            Arrastrá las áreas para reorganizar la red. Clic abre el detalle. Estas 12 áreas son el
            mínimo operativo para una pyme sólida en la demo.
          </p>
          <div
            ref={canvasRef}
            className="relative h-[520px] overflow-hidden rounded-2xl border border-border-200 bg-gradient-to-br from-navy-950 via-navy-900 to-petrol-700"
            onPointerMove={onPointerMove}
            onPointerUp={() => setDragging(null)}
          >
            <svg className="absolute inset-0 h-full w-full" aria-hidden>
              {areas.map((area) => {
                const hub = areas.find((a) => a.id === "area_direccion") ?? areas[0];
                if (!hub || hub.id === area.id) return null;
                return (
                  <line
                    key={`edge-${area.id}`}
                    x1={`${hub.position.x}%`}
                    y1={`${hub.position.y}%`}
                    x2={`${area.position.x}%`}
                    y2={`${area.position.y}%`}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={1}
                  />
                );
              })}
            </svg>
            {areas.map((area) => (
              <button
                key={area.id}
                type="button"
                className={cn(
                  "absolute max-w-[140px] -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-xl border-2 px-3 py-2 text-left shadow-lg active:cursor-grabbing",
                  healthTone[area.health],
                  selectedId === area.id && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-navy-950",
                )}
                style={{ left: `${area.position.x}%`, top: `${area.position.y}%` }}
                onPointerDown={(e) => onPointerDown(area.id, e)}
                onPointerUp={() => onPointerUp(area.id)}
                aria-label={`Área ${area.name}, estado ${healthLabel[area.health]}`}
              >
                <span className="block text-[10px] font-semibold uppercase opacity-90">
                  {healthLabel[area.health]}
                </span>
                <span className="block text-sm font-semibold leading-snug">{area.name}</span>
              </button>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-5">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.twinEntities.map((entity) => (
              <li key={entity.id} className="rounded-xl border border-border-200 p-3">
                <p className="font-semibold">{entity.title}</p>
                <p className="mt-1 text-sm text-text-600">{entity.description}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {selected ? (
        <AreaModal
          area={selected}
          onClose={() => {
            setSelectedId(null);
            const next = new URLSearchParams(params);
            next.delete("area");
            setParams(next, { replace: true });
          }}
        />
      ) : null}
    </div>
  );
}

function AreaModal({ area, onClose }: { area: BusinessArea; onClose: () => void }) {
  const { state } = useDemo();
  if (!state) return null;

  const tasks = state.areaTasks.filter((t) => area.taskIds.includes(t.id));
  const improvements = state.areaImprovements.filter((i) => area.improvementIds.includes(i.id));
  const docs = state.documents.filter((d) => area.documentIds.includes(d.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/45 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="area-modal-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-200 bg-surface-0 p-6 shadow-[var(--shadow-elevated)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone={area.health === "healthy" ? "high" : area.health === "weak" ? "medium" : "danger"}>
              {healthLabel[area.health]}
            </Badge>
            <h3 id="area-modal-title" className="font-display mt-2 text-2xl font-semibold">
              {area.name}
            </h3>
            <p className="mt-2 text-sm text-text-600">{area.description}</p>
            <p className="mt-2 text-sm">
              Responsable: <strong>{findUserName(state, area.ownerId)}</strong>
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} aria-label="Cerrar">
            Cerrar
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="section-title text-base">Cumple</h4>
            <ul className="mt-2 space-y-1 text-sm text-text-700">
              {area.objectivesMet.length ? (
                area.objectivesMet.map((o) => <li key={o}>• {o}</li>)
              ) : (
                <li className="text-text-600">Sin objetivos cumplidos aún.</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="section-title text-base">No cumple / faltantes</h4>
            <ul className="mt-2 space-y-1 text-sm text-text-700">
              {area.objectivesGap.length ? (
                area.objectivesGap.map((o) => <li key={o}>• {o}</li>)
              ) : (
                <li className="text-text-600">Sin brechas registradas.</li>
              )}
            </ul>
          </div>
        </div>

        <h4 className="section-title mt-6 text-base">Documentación</h4>
        <ul className="mt-2 space-y-2">
          {docs.length ? (
            docs.map((d) => (
              <li key={d.id}>
                <Link className="text-sm font-semibold text-petrol-700 hover:underline" to={`/documentacion/${d.id}`}>
                  {d.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-sm text-text-600">Sin documentos vinculados (área a construir).</li>
          )}
        </ul>

        <h4 className="section-title mt-6 text-base">Tareas</h4>
        <ul className="mt-2 space-y-2 text-sm">
          {tasks.map((t) => (
            <li key={t.id} className="rounded-lg border border-border-200 px-3 py-2">
              <span className="font-medium">{t.title}</span>
              <span className="mt-1 block text-xs text-text-600">
                {t.status} · {findUserName(state, t.ownerId)} · {formatAbsoluteDate(t.dueAt)}
              </span>
            </li>
          ))}
        </ul>

        <h4 className="section-title mt-6 text-base">Mejoras aplicadas</h4>
        <ul className="mt-2 space-y-2 text-sm">
          {improvements.length ? (
            improvements.map((i) => (
              <li key={i.id} className="rounded-lg border border-border-100 bg-surface-50 px-3 py-2">
                {i.text}
                <span className="mt-1 block text-xs text-text-600">{formatAbsoluteDate(i.at)}</span>
              </li>
            ))
          ) : (
            <li className="text-text-600">Todavía no hay mejoras registradas.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

import { Link, useParams, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useDemo } from "@/app/DemoProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { findUserName, formatAbsoluteDate, freshnessLabel } from "@/lib/format";
import { matchesRubroFilter } from "@/lib/rubros";

export function DocumentsPage() {
  const { state, markDocumentReviewed, simulateUpload, activeRubros } = useDemo();
  const { documentoId } = useParams();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const vista = params.get("vista") ?? "todos";

  const filtered = useMemo(() => {
    if (!state) return [];
    return state.documents.filter((d) => {
      if (!matchesRubroFilter(d.rubroIds, activeRubros)) return false;
      if (vista === "atencion") {
        const attention =
          d.freshnessStatus === "review" ||
          d.freshnessStatus === "stale" ||
          d.inconsistencyStatus === "detected";
        if (!attention) return false;
      }
      if (query && !`${d.title} ${d.category}`.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [state, vista, query, activeRubros]);

  if (!state) return null;
  const selected = documentoId
    ? state.documents.find((d) => d.id === documentoId)
    : null;
  const sourceName = (id: string) => state.sources.find((s) => s.id === id)?.name ?? id;

  return (
    <div className="page-enter space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Documentos", state.documents.length],
          ["Procesados", state.documents.filter((d) => d.processingStatus === "processed").length],
          [
            "Por revisar",
            state.documents.filter((d) => d.freshnessStatus === "review").length,
          ],
          ["Desactualizados", state.documents.filter((d) => d.freshnessStatus === "stale").length],
          [
            "Inconsistencias",
            state.documents.filter((d) => d.inconsistencyStatus === "detected").length,
          ],
        ].map(([label, value]) => (
          <div key={String(label)} className="card-surface p-4">
            <p className="text-sm text-text-600">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="card-surface p-4">
        <div className="flex flex-wrap items-center gap-3">
          {[
            ["todos", "Todos"],
            ["atencion", "Requieren atención"],
          ].map(([id, label]) => (
            <Button
              key={id}
              variant={vista === id ? "primary" : "secondary"}
              onClick={() => {
                const next = new URLSearchParams(params);
                next.set("vista", id);
                setParams(next);
              }}
            >
              {label}
            </Button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar documentos…"
            className="h-10 min-w-[220px] flex-1 rounded-lg border border-border-200 px-3 text-sm"
            aria-label="Buscar documentos"
          />
          <Button
            variant="secondary"
            onClick={() => {
              setQuery("");
              setParams({});
            }}
          >
            Limpiar filtros
          </Button>
          <label className="inline-flex cursor-pointer items-center">
            <span className="sr-only">Agregar documento</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                void simulateUpload({ name: file.name, type: file.type, size: file.size });
                e.target.value = "";
              }}
            />
            <span className="inline-flex min-h-10 items-center rounded-lg bg-petrol-700 px-4 text-sm font-semibold text-white">
              Agregar documento
            </span>
          </label>
        </div>
      </section>

      <div className={`grid gap-6 ${selected ? "xl:grid-cols-[1fr_420px]" : ""}`}>
        <div className="card-surface overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-surface-50 text-text-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Categoría</th>
                <th className="px-4 py-3 font-semibold">Fuente</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Actualización</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-text-600">
                    Todavía no hay resultados con estos criterios. Modificá los filtros o restablecé la
                    vista.
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr key={doc.id} className="border-t border-border-200 hover:bg-surface-50">
                    <td className="px-4 py-3">
                      <Link className="font-medium text-petrol-700 hover:underline" to={`/documentacion/${doc.id}`}>
                        {doc.title}
                      </Link>
                      {doc.inconsistencyStatus === "detected" ? (
                        <Badge tone="danger" className="ml-2">
                          Inconsistencia
                        </Badge>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">{doc.category}</td>
                    <td className="px-4 py-3">{sourceName(doc.sourceId)}</td>
                    <td className="px-4 py-3">
                      <Badge>
                        {doc.processingStatus === "processed" ? "Procesado" : doc.processingStatus} ·{" "}
                        {freshnessLabel(doc.freshnessStatus)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{formatAbsoluteDate(doc.updatedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selected ? (
          <aside className="card-surface p-5">
            <h3 className="text-xl font-semibold">{selected.title}</h3>
            <p className="mt-2 text-sm text-text-600">
              Propietario: {findUserName(state, selected.ownerId)} · Fuente:{" "}
              {sourceName(selected.sourceId)}
            </p>
            <p className="mt-4 text-sm">
              Vista previa simulada. En la demo el archivo no será procesado ni enviado.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>Procesamiento:</strong> {selected.processingStatus}
              </p>
              <p>
                <strong>Vigencia:</strong> {freshnessLabel(selected.freshnessStatus)}
              </p>
              <p>
                <strong>Inconsistencia:</strong> {selected.inconsistencyStatus}
              </p>
            </div>
            <h4 className="mt-5 font-semibold">Entidades relacionadas</h4>
            <ul className="mt-2 space-y-1 text-sm">
              {selected.knowledgeEntityIds.map((id) => {
                const entity = state.twinEntities.find((e) => e.id === id);
                return (
                  <li key={id}>
                    <Link className="text-petrol-700 hover:underline" to={`/gemelo/${id}`}>
                      {entity?.title ?? id}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <h4 className="mt-5 font-semibold">Evidencias</h4>
            <ul className="mt-2 space-y-2 text-sm">
              {state.evidence
                .filter((e) => e.documentId === selected.id)
                .map((e) => (
                  <li key={e.id} className="rounded-lg border border-border-200 p-2">
                    <p className="font-medium">{e.label}</p>
                    <p className="text-text-600">{e.excerpt}</p>
                  </li>
                ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => void markDocumentReviewed(selected.id)}>Marcar revisado</Button>
              <Button variant="secondary" onClick={() => (window.location.href = "/documentacion")}>
                Cerrar
              </Button>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

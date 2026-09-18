import { useMemo, useState } from "react";
import { useDemo } from "@/app/DemoProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { RUBROS, type NewsType } from "@/domain/types";
import { formatAbsoluteDate } from "@/lib/format";
import { matchesRubroFilter } from "@/lib/rubros";

export function NewsPage() {
  const { state, activeRubros } = useDemo();
  const [type, setType] = useState<NewsType | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(() => {
    if (!state) return [];
    return state.newsItems
      .filter((n) => matchesRubroFilter(n.rubroIds, activeRubros))
      .filter((n) => (type ? n.type === type : true))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [state, activeRubros, type]);

  if (!state) return null;
  const selected = items.find((n) => n.id === selectedId) ?? items[0] ?? null;

  return (
    <div className="page-enter space-y-6">
      <Card variant="panel" className="p-5">
        <h3 className="font-display text-2xl font-semibold">Novedades de mercado</h3>
        <p className="mt-2 text-sm text-text-600">
          Señales simuladas (leyes, decretos y mercado) que pueden afectar el rubro de embalajes /
          agroindustria en Cuyo.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${type === "" ? "border-petrol-700 bg-petrol-700 text-white" : "border-border-200"}`}
            onClick={() => setType("")}
          >
            Todas
          </button>
          {(["ley", "decreto", "mercado"] as NewsType[]).map((t) => (
            <button
              key={t}
              type="button"
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${type === t ? "border-cyan-500 bg-cyan-500/15 text-petrol-700" : "border-border-200"}`}
              onClick={() => setType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`w-full rounded-xl border p-4 text-left transition ${selected?.id === item.id ? "border-cyan-500 bg-cyan-500/5" : "border-border-200 hover:border-petrol-700"}`}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="flex flex-wrap gap-2">
                  <Badge tone="info">{item.type}</Badge>
                  <Badge tone={item.severity === "high" ? "danger" : "medium"}>{item.severity}</Badge>
                </div>
                <p className="mt-2 font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-text-600">{item.summary}</p>
                <p className="mt-2 text-xs text-text-600">
                  {formatAbsoluteDate(item.publishedAt)} · puede afectar{" "}
                  {item.rubroIds
                    .map((id) => RUBROS.find((r) => r.id === id)?.label ?? id)
                    .join(", ")}
                </p>
              </button>
            </li>
          ))}
        </ul>

        {selected ? (
          <Card variant="panel" className="p-5">
            <Badge>{selected.type}</Badge>
            <h4 className="font-display mt-3 text-xl font-semibold">{selected.title}</h4>
            <p className="mt-2 text-sm text-text-600">{selected.sourceLabel}</p>
            <p className="mt-4 text-sm leading-relaxed text-text-700">{selected.detail}</p>
            <p className="mt-4 text-xs font-semibold text-petrol-700">
              Impacto posible:{" "}
              {selected.rubroIds
                .map((id) => RUBROS.find((r) => r.id === id)?.label ?? id)
                .join(", ")}
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

import { Menu, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDemo } from "@/app/DemoProvider";
import { formatAbsoluteDate } from "@/lib/format";
import { mockRepository } from "@/repositories/mock/MockRepository";

export function Topbar({
  title,
  description,
  onMenu,
  showPeriod = false,
}: {
  title: string;
  description: string;
  onMenu: () => void;
  showPeriod?: boolean;
}) {
  const { state } = useDemo();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<
    Array<{ type: string; id: string; title: string; context: string; to: string }>
  >([]);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!query.trim()) {
        setHits([]);
        return;
      }
      const next = await mockRepository.search(query);
      if (!cancelled) setHits(next);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const user = useMemo(
    () => state?.users.find((u) => u.id === state.currentUserId),
    [state],
  );

  return (
    <header className="sticky top-0 z-20 border-b border-border-200/80 bg-surface-0/85 backdrop-blur-md">
      <div className="flex min-h-16 items-start justify-between gap-4 px-4 py-3.5 lg:px-8">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            className="mt-1 rounded-lg border border-border-200 bg-surface-0 p-2 transition hover:border-cyan-500 lg:hidden"
            aria-label="Abrir menú"
            onClick={onMenu}
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h2 className="font-display truncate text-[1.65rem] font-semibold leading-tight text-text-900 md:text-[1.85rem]">
              {title}
            </h2>
            <p className="mt-0.5 text-sm text-text-600">{description}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-600" />
            <input
              id="global-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar… (Ctrl+K)"
              className="h-10 w-64 rounded-lg border border-border-200 bg-surface-50/80 pl-9 pr-3 text-sm transition focus:border-cyan-500 focus:bg-surface-0"
              aria-label="Búsqueda global"
            />
            {hits.length > 0 ? (
              <div className="absolute right-0 z-30 mt-1 w-80 rounded-xl border border-border-200 bg-surface-0 p-2 shadow-[var(--shadow-elevated)]">
                {hits.map((hit) => (
                  <Link
                    key={`${hit.type}-${hit.id}`}
                    to={hit.to}
                    className="block rounded-lg px-3 py-2 text-sm transition hover:bg-surface-50"
                    onClick={() => {
                      setQuery("");
                      setHits([]);
                    }}
                  >
                    <span className="font-semibold text-text-900">{hit.title}</span>
                    <span className="mt-0.5 block text-xs text-text-600">
                      {hit.type} · {hit.context}
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {showPeriod ? (
            <label className="text-sm text-text-600">
              Período
              <select
                className="ml-2 h-10 rounded-lg border border-border-200 bg-surface-0 px-2 transition focus:border-cyan-500"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                aria-label="Selector de período"
              >
                <option value="30">30 días</option>
                <option value="90">90 días</option>
              </select>
            </label>
          ) : null}
          <span
            className="rounded-md border border-amber-500/35 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500"
            title="Esta experiencia utiliza información ficticia y no ejecuta acciones externas."
          >
            Demo · Datos simulados
          </span>
          <div className="text-right text-xs text-text-600">
            <p>Última actualización</p>
            <p className="font-medium text-text-900">
              {state ? formatAbsoluteDate(state.metadata.demoNow) : "—"}
            </p>
          </div>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-petrol-600 to-navy-950 text-sm font-semibold text-white ring-2 ring-cyan-500/20"
            aria-label={user ? `Usuario ${user.name}` : "Usuario"}
          >
            {user?.avatarInitials ?? "—"}
          </div>
        </div>
      </div>
    </header>
  );
}

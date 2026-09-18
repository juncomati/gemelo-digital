import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useDemo } from "@/app/DemoProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ConsultorPage() {
  const { state, askConsultor } = useDemo();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  if (!state) return null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    try {
      await askConsultor(draft);
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-enter mx-auto flex max-w-3xl flex-col gap-4">
      <Card variant="panel" className="p-5">
        <h3 className="font-display text-2xl font-semibold">Consultor</h3>
        <p className="mt-2 text-sm text-text-600">
          Conversá con el conocimiento simulado de AndesPack para orientar decisiones. Las respuestas
          se generan en la demo a partir de evidencias locales; no hay conexión externa.
        </p>
      </Card>

      <Card className="flex min-h-[420px] flex-col p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
          {state.consultorHistory.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-200 bg-surface-50 p-4 text-sm text-text-600">
              Probá: “¿Cuál es el riesgo de liner?”, “¿Cómo está Finanzas?”, “¿Qué novedades afectan
              Comercial?” o “¿La pyme es sólida?”.
            </div>
          ) : (
            state.consultorHistory.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "user"
                    ? "ml-8 rounded-2xl bg-petrol-700 px-4 py-3 text-sm text-white"
                    : "mr-8 rounded-2xl border border-border-200 bg-surface-50 px-4 py-3 text-sm text-text-900"
                }
              >
                <p>{msg.text}</p>
                {msg.links?.length ? (
                  <ul className="mt-2 space-y-1">
                    {msg.links.map((link) => (
                      <li key={link.to}>
                        <Link className="font-semibold text-cyan-500 hover:underline" to={link.to}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))
          )}
        </div>
        <form onSubmit={onSubmit} className="flex gap-2 border-t border-border-200 p-3">
          <label className="sr-only" htmlFor="consultor-input">
            Pregunta
          </label>
          <input
            id="consultor-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escribí tu pregunta…"
            className="h-11 flex-1 rounded-lg border border-border-200 px-3 text-sm"
          />
          <Button type="submit" disabled={sending || !draft.trim()}>
            {sending ? "…" : "Enviar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

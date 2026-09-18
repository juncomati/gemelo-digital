import { Link, useParams, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useDemo } from "@/app/DemoProvider";
import { ConfidenceIndicator } from "@/components/domain/ConfidenceIndicator";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { approvalStatusLabel, findUserName, formatAbsoluteDate } from "@/lib/format";

export function ApprovalsPage() {
  const { state, resolveApproval } = useDemo();
  const { aprobacionId } = useParams();
  const [params, setParams] = useSearchParams();
  const bandeja = params.get("bandeja") ?? "pendientes";
  const [dialog, setDialog] = useState<"approve" | "reject" | "changes" | null>(null);
  const [comment, setComment] = useState("");

  const filtered = useMemo(() => {
    if (!state) return [];
    return state.approvals.filter((a) => {
      if (bandeja === "pendientes") return a.status === "pending" || a.status === "in_review";
      if (bandeja === "resueltas") {
        return a.status === "approved" || a.status === "rejected" || a.status === "changes_requested";
      }
      return true;
    });
  }, [state, bandeja]);

  if (!state) return null;
  const selected = aprobacionId
    ? state.approvals.find((a) => a.id === aprobacionId)
    : filtered[0] ?? null;
  const linkedResult = selected
    ? state.results.find((r) => r.id === selected.resultId)
    : null;
  const evidences = linkedResult
    ? state.evidence.filter((e) => linkedResult.evidenceIds.includes(e.id))
    : [];

  const pendingCount = state.approvals.filter(
    (a) => a.status === "pending" || a.status === "in_review",
  ).length;

  return (
    <div className="page-enter space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-600">Pendientes</p>
          <p className="stat-value mt-2 text-2xl">{pendingCount}</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-600">
            Aprobadas en el período
          </p>
          <p className="stat-value mt-2 text-2xl">12</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-600">Descartadas</p>
          <p className="stat-value mt-2 text-2xl">2</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-600">
            Tiempo medio simulado
          </p>
          <p className="stat-value mt-2 text-2xl">6,4 h</p>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {[
          ["pendientes", "Pendientes"],
          ["resueltas", "Resueltas"],
          ["todas", "Todas"],
        ].map(([id, label]) => (
          <Button
            key={id}
            variant={bandeja === id ? "primary" : "secondary"}
            onClick={() => {
              const next = new URLSearchParams(params);
              next.set("bandeja", id);
              setParams(next);
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_480px]">
        <ul className="space-y-3">
          {filtered.map((item) => (
            <li key={item.id}>
              <Link
                to={`/aprobaciones/${item.id}?bandeja=${bandeja}`}
                className={`card-surface block p-4 hover:border-cyan-500 ${
                  selected?.id === item.id ? "border-cyan-500" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{approvalStatusLabel(item.status)}</Badge>
                  <span className="font-semibold">{item.title}</span>
                </div>
                <p className="mt-2 text-sm text-text-600">
                  Responsable: {findUserName(state, item.assignedTo)} · Límite:{" "}
                  {formatAbsoluteDate(item.dueAt)}
                </p>
                {item.estimatedProtectedValue ? (
                  <p className="mt-1 text-sm">{item.estimatedProtectedValue}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        {selected ? (
          <aside className="card-surface p-5">
            <h3 className="text-xl font-semibold">{selected.title}</h3>
            <p className="mt-2 text-sm text-text-600">
              Solicitada por Sistema · Responsable {findUserName(state, selected.assignedTo)}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-text-600">Costo estimado</dt>
                <dd className="font-medium">{selected.estimatedCost}</dd>
              </div>
              <div>
                <dt className="text-text-600">Valor protegido estimado</dt>
                <dd className="font-medium">{selected.estimatedProtectedValue}</dd>
              </div>
            </dl>
            {linkedResult ? (
              <div className="mt-4">
                <ConfidenceIndicator value={linkedResult.confidence} />
                <p className="mt-3 text-sm">{linkedResult.recommendation}</p>
                <Link
                  className="mt-2 inline-block text-sm text-petrol-700 hover:underline"
                  to={`/resultados/${linkedResult.id}`}
                >
                  Ver resultado vinculado
                </Link>
              </div>
            ) : null}
            <h4 className="mt-5 font-semibold">Evidencia</h4>
            <ul className="mt-2 space-y-2 text-sm">
              {evidences.slice(0, 4).map((e) => (
                <li key={e.id} className="rounded-lg border border-border-200 p-2">
                  <p className="font-medium">{e.label}</p>
                  <p className="text-text-600">{e.excerpt}</p>
                </li>
              ))}
            </ul>
            <h4 className="mt-5 font-semibold">Historial</h4>
            <ul className="mt-2 space-y-2 text-sm">
              {selected.history.map((h, idx) => (
                <li key={`${h.at}-${idx}`}>
                  {formatAbsoluteDate(h.at)} · {h.actorName} · {h.action}: {h.comment}
                </li>
              ))}
            </ul>
            {selected.status === "pending" || selected.status === "in_review" ? (
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setComment("");
                    setDialog("approve");
                  }}
                >
                  Aprobar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setComment("");
                    setDialog("reject");
                  }}
                >
                  Rechazar
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setComment("");
                    setDialog("changes");
                  }}
                >
                  Solicitar cambios
                </Button>
              </div>
            ) : (
              <p className="mt-5 text-sm text-text-600">Esta aprobación ya fue resuelta en la demo.</p>
            )}
          </aside>
        ) : null}
      </div>

      <ConfirmDialog
        open={dialog === "approve"}
        title="Confirmar aprobación"
        description="La demo actualizará el resultado, la actividad y las métricas locales. No se ejecutará ninguna operación externa."
        confirmLabel="Aprobar"
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          if (!selected) return;
          void resolveApproval({
            approvalId: selected.id,
            action: "approve",
            comment: comment || "Aprobación registrada en la demo.",
            actorId: state.currentUserId,
          });
          setDialog(null);
        }}
      />
      <ConfirmDialog
        open={dialog === "reject"}
        title="Confirmar rechazo"
        description="Se registrará el rechazo en la demo. No se ejecutará ninguna operación externa."
        confirmLabel="Rechazar"
        requireComment
        comment={comment}
        onCommentChange={setComment}
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          if (!selected) return;
          void resolveApproval({
            approvalId: selected.id,
            action: "reject",
            comment,
            actorId: state.currentUserId,
          });
          setDialog(null);
        }}
      />
      <ConfirmDialog
        open={dialog === "changes"}
        title="Solicitar cambios"
        description="Se registrará la solicitud en la demo. No se ejecutará ninguna operación externa."
        confirmLabel="Solicitar cambios"
        requireComment
        comment={comment}
        onCommentChange={setComment}
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          if (!selected) return;
          void resolveApproval({
            approvalId: selected.id,
            action: "request_changes",
            comment,
            actorId: state.currentUserId,
          });
          setDialog(null);
        }}
      />
    </div>
  );
}

import type {
  Approval,
  ApprovalStatus,
  DemoState,
  ResultStatus,
  ResolveApprovalInput,
} from "./types";

const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
  pending: "Pendiente",
  in_review: "En revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
  changes_requested: "Cambios solicitados",
};

function countPendingApprovals(approvals: Approval[]): number {
  return approvals.filter((a) => a.status === "pending" || a.status === "in_review").length;
}

function deriveSourcesToReview(state: DemoState): number {
  const reviewSources = state.sources.filter((s) => s.status === "review").length;
  const attentionDocs = state.documents.filter(
    (d) =>
      d.freshnessStatus === "review" ||
      d.freshnessStatus === "stale" ||
      d.inconsistencyStatus === "detected",
  ).length;
  return Math.max(reviewSources, attentionDocs, state.metrics.current.sourcesToReview);
}

export function resolveApproval(state: DemoState, input: ResolveApprovalInput): DemoState {
  const approval = state.approvals.find((a) => a.id === input.approvalId);
  if (!approval) {
    throw new Error(`Aprobación no encontrada: ${input.approvalId}`);
  }

  const actor = state.users.find((u) => u.id === input.actorId);
  const actorName = actor?.name ?? "Usuario";
  const at = input.at ?? state.metadata.demoNow;

  let nextApprovalStatus: ApprovalStatus;
  let historyAction: "approved" | "rejected" | "returned";
  let nextResultStatus: ResultStatus;
  let summary: string;
  const previousApproval = APPROVAL_STATUS_LABEL[approval.status];
  let nextApprovalLabel: string;

  if (input.action === "approve") {
    nextApprovalStatus = "approved";
    historyAction = "approved";
    nextResultStatus = "approved";
    nextApprovalLabel = APPROVAL_STATUS_LABEL.approved;
    summary = `Aprobó la propuesta: ${approval.title}.`;
  } else if (input.action === "reject") {
    if (!input.comment.trim()) {
      throw new Error("Rechazar requiere un comentario.");
    }
    nextApprovalStatus = "rejected";
    historyAction = "rejected";
    nextResultStatus = "discarded";
    nextApprovalLabel = APPROVAL_STATUS_LABEL.rejected;
    summary = `Rechazó la propuesta: ${approval.title}.`;
  } else {
    if (!input.comment.trim()) {
      throw new Error("Solicitar cambios requiere un comentario.");
    }
    nextApprovalStatus = "changes_requested";
    historyAction = "returned";
    nextResultStatus = "in_review";
    nextApprovalLabel = APPROVAL_STATUS_LABEL.changes_requested;
    summary = `Solicitó cambios en: ${approval.title}.`;
  }

  const result = state.results.find((r) => r.id === approval.resultId);

  const approvals = state.approvals.map((item) =>
    item.id === approval.id
      ? {
          ...item,
          status: nextApprovalStatus,
          history: [
            ...item.history,
            {
              at,
              actorName,
              action: historyAction,
              comment: input.comment.trim() || "Aprobación registrada en la demo.",
            },
          ],
        }
      : item,
  );

  const results = state.results.map((item) =>
    item.id === approval.resultId ? { ...item, status: nextResultStatus } : item,
  );

  const eventId = `event_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const activity = [
    {
      id: eventId,
      tenantId: state.tenant.id,
      actorType: "user" as const,
      actorId: input.actorId,
      actorName,
      action:
        input.action === "approve"
          ? "aprobó"
          : input.action === "reject"
            ? "rechazó"
            : "solicitó cambios",
      entityType: "approval",
      entityId: approval.id,
      summary,
      createdAt: at,
      previousState: previousApproval,
      nextState: nextApprovalLabel,
    },
    ...state.activity,
  ];

  const pendingApprovals = countPendingApprovals(approvals);
  const decisionsSupported =
    (state.metrics.current.decisionsSupported ?? 9) + (input.action === "approve" ? 1 : 0);
  const risksResolved =
    (state.metrics.current.risksResolved ?? 0) +
    (input.action === "approve" && result?.type === "risk" ? 1 : 0);

  return {
    ...state,
    approvals,
    results,
    activity,
    metrics: {
      ...state.metrics,
      current: {
        ...state.metrics.current,
        pendingApprovals,
        decisionsSupported,
        risksResolved,
        newResults: results.filter((r) => r.status === "new").length || state.metrics.current.newResults,
      },
    },
  };
}

export function deriveDashboardCounters(state: DemoState) {
  const pendingApprovals = countPendingApprovals(state.approvals);
  const sourcesToReview = deriveSourcesToReview(state);
  return {
    knowledgeCoverage: state.metrics.current.knowledgeCoverage,
    averageConfidence: state.metrics.current.averageConfidence,
    newResults: state.results.filter((r) => r.status === "new").length || state.metrics.current.newResults,
    pendingApprovals,
    sourcesToReview,
  };
}

export { APPROVAL_STATUS_LABEL };

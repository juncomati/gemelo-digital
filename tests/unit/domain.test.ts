import { describe, expect, it } from "vitest";
import { resolveApproval, deriveDashboardCounters } from "@/domain/resolveApproval";
import { loadCanonicalSeed } from "@/repositories/mock/loadSeed";
import { confidenceLabel, formatPercent } from "@/lib/format";

describe("seed and metrics", () => {
  it("loads pyme areas and rubro coverage", () => {
    const state = loadCanonicalSeed();
    expect(state.businessAreas).toHaveLength(12);
    expect(state.metrics.rubroCoverage.length).toBe(6);
    expect(state.documents.every((d) => d.rubroIds.length > 0)).toBe(true);
  });

  it("derives dashboard counters from collections", () => {
    const state = loadCanonicalSeed();
    const counters = deriveDashboardCounters(state);
    expect(counters.pendingApprovals).toBe(3);
    expect(counters.knowledgeCoverage).toBe(0.87);
  });
});

describe("resolveApproval", () => {
  it("updates approval, result, activity and metrics atomically", () => {
    const state = loadCanonicalSeed();
    const next = resolveApproval(state, {
      approvalId: "approval_purchase_liner",
      action: "approve",
      comment: "Adelantar compra en la demo",
      actorId: "user_laura",
      at: "2026-09-18T11:00:00-03:00",
    });

    const approval = next.approvals.find((a) => a.id === "approval_purchase_liner");
    const result = next.results.find((r) => r.id === "result_risk_liner");
    expect(approval?.status).toBe("approved");
    expect(result?.status).toBe("approved");
    expect(next.activity[0]?.entityId).toBe("approval_purchase_liner");
    expect(next.metrics.current.pendingApprovals).toBe(2);
    expect((next.metrics.current.decisionsSupported ?? 0) >= 10).toBe(true);
  });

  it("requires comment for reject", () => {
    const state = loadCanonicalSeed();
    expect(() =>
      resolveApproval(state, {
        approvalId: "approval_purchase_liner",
        action: "reject",
        comment: "",
        actorId: "user_laura",
      }),
    ).toThrow(/comentario/i);
  });
});

describe("format helpers", () => {
  it("formats confidence bands", () => {
    expect(confidenceLabel(0.91)).toBe("Alta");
    expect(confidenceLabel(0.7)).toBe("Media");
    expect(confidenceLabel(0.5)).toBe("Baja");
    expect(formatPercent(0.87)).toBe("87%");
  });
});

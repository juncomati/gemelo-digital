import { describe, expect, it } from "vitest";
import { resolveApproval, deriveDashboardCounters } from "@/domain/resolveApproval";
import { CAUSAL_EDGES, FLOW_EDGES, FLOW_NODES, hoursUntil, waitTone } from "@/domain/pitchScenario";
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
    expect(next.activity).toHaveLength(state.activity.length + 1);
    expect(next.metrics.current.pendingApprovals).toBe(2);
    expect(next.metrics.current.simulatedCostUsd).toBe(11700);
    expect(next.metrics.current.simulatedCashUsd).toBe(42300);
    expect(next.metrics.current.deliveriesAtRisk).toBe(1);
    expect(next.metrics.current.knowledgeCoverage).toBe(state.metrics.current.knowledgeCoverage);
    expect(next.metrics.current.onTimeDelivery).toBe(state.metrics.current.onTimeDelivery);
    expect(next.metrics.current.estimatedHoursSavedMonthly).toBe(
      state.metrics.current.estimatedHoursSavedMonthly,
    );
  });

  it("does not move costo, caja or entregas when the approval is rejected", () => {
    const state = loadCanonicalSeed();
    const next = resolveApproval(state, {
      approvalId: "approval_purchase_liner",
      action: "reject",
      comment: "No adelantar en la demo",
      actorId: "user_laura",
    });
    expect(next.metrics.current.simulatedCostUsd).toBe(18400);
    expect(next.metrics.current.simulatedCashUsd).toBe(54000);
    expect(next.metrics.current.deliveriesAtRisk).toBe(6);
    expect(next.activity).toHaveLength(state.activity.length + 1);
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

describe("pitch scenario", () => {
  it("lights a single stockout path across the five areas", () => {
    const path = CAUSAL_EDGES.filter((edge) => edge.onPath);
    expect(path.map((edge) => `${edge.from}->${edge.to}`)).toEqual([
      "calidad->compras",
      "compras->operaciones",
      "operaciones->finanzas",
      "finanzas->personas",
    ]);
    expect(new Set(path.map((edge) => edge.kind))).toEqual(
      new Set(["evidencia", "depende", "hueco"]),
    );
    expect(CAUSAL_EDGES.some((edge) => !edge.onPath)).toBe(true);
  });

  it("makes the edge into liner consumption the thick red wait", () => {
    const intoLiner = FLOW_EDGES.filter((edge) => edge.to === "consumo");
    const thickest = [...FLOW_EDGES].sort((a, b) => b.volume - a.volume)[0];
    expect(thickest?.id).toBe("f_cor_con");
    expect(thickest && waitTone(thickest.waitHours)).toBe("high");
    expect(intoLiner.some((edge) => edge.id === "f_cor_con")).toBe(true);
    const node = FLOW_NODES.find((item) => item.id === "consumo");
    expect(node?.waiting).toBe(24);
    expect(node?.inProgress).toBe(18);
  });

  it("counts hours until the liner approval", () => {
    expect(hoursUntil("2026-09-18T17:00:00-03:00", "2026-09-18T10:30:00-03:00")).toBeCloseTo(6.5);
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

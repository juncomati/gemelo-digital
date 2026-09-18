import seed from "../../../mock-data/canonical-scenario.json" with { type: "json" };
import extension from "../../../mock-data/pyme-extension.json" with { type: "json" };
import type { DemoState, DocumentItem, Result, RubroId, RubroCoverage } from "@/domain/types";
import { RUBROS } from "@/domain/types";
import { rubrosFromCategory, rubrosFromResultArea } from "@/lib/rubros";

function buildRubroCoverage(
  documents: DocumentItem[],
  results: Result[],
): RubroCoverage[] {
  return RUBROS.map(({ id }) => {
    const documentCount = documents.filter((d) => d.rubroIds.includes(id)).length;
    const resultCount = results.filter((r) => r.rubroIds.includes(id)).length;
    const maxDocs = Math.max(documents.length, 1);
    const coverageScore = Math.min(1, (documentCount * 2 + resultCount) / (maxDocs * 1.5));
    return { rubroId: id, documentCount, resultCount, coverageScore };
  });
}

export function loadCanonicalSeed(): DemoState {
  const data = structuredClone(seed) as Omit<
    DemoState,
    | "currentUserId"
    | "businessAreas"
    | "areaTasks"
    | "areaImprovements"
    | "pains"
    | "actions"
    | "newsItems"
    | "consultorReplies"
    | "consultorHistory"
    | "areaPositions"
  > & {
    documents: Array<Omit<DocumentItem, "rubroIds"> & { rubroIds?: RubroId[] }>;
    results: Array<Omit<Result, "rubroIds"> & { rubroIds?: RubroId[] }>;
  };

  const documents: DocumentItem[] = data.documents.map((d) => ({
    ...d,
    rubroIds: d.rubroIds ?? rubrosFromCategory(d.category),
  }));

  const results: Result[] = data.results.map((r) => ({
    ...r,
    rubroIds: r.rubroIds ?? rubrosFromResultArea(r.area),
  }));

  const ext = structuredClone(extension);
  const areaPositions: Record<string, { x: number; y: number }> = {};
  for (const area of ext.businessAreas) {
    areaPositions[area.id] = { ...area.position };
  }

  return {
    ...data,
    metadata: {
      ...data.metadata,
      seedVersion: "2026.09.18-2",
    },
    tenant: { ...data.tenant, dataMode: "synthetic" },
    documents,
    results,
    metrics: {
      ...data.metrics,
      rubroCoverage: buildRubroCoverage(documents, results),
    },
    businessAreas: ext.businessAreas as DemoState["businessAreas"],
    areaTasks: ext.areaTasks as DemoState["areaTasks"],
    areaImprovements: ext.areaImprovements as DemoState["areaImprovements"],
    pains: ext.pains as DemoState["pains"],
    actions: ext.actions as DemoState["actions"],
    newsItems: ext.newsItems as DemoState["newsItems"],
    consultorReplies: ext.consultorReplies as DemoState["consultorReplies"],
    consultorHistory: [],
    areaPositions,
    currentUserId: "user_laura",
  };
}

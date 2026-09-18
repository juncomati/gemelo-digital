import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seedPath = path.join(root, "mock-data", "canonical-scenario.json");

const Id = z.string().min(1);
const Confidence = z.number().min(0).max(1);

const SeedSchema = z.object({
  metadata: z.object({
    schemaVersion: z.literal(1),
    seedVersion: z.string(),
    demoNow: z.string(),
    dataMode: z.literal("synthetic"),
    disclaimer: z.string(),
  }),
  tenant: z.object({
    id: Id,
    name: z.string(),
    industry: z.string(),
    timezone: z.string(),
    currencyLabel: z.string(),
    location: z.string().optional(),
    employees: z.number().optional(),
    activeCustomers: z.number().optional(),
    productionLines: z.number().optional(),
    warehouses: z.number().optional(),
  }),
  users: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      name: z.string(),
      role: z.enum(["admin", "direction", "owner", "viewer"]),
      area: z.string(),
      avatarInitials: z.string(),
    }),
  ),
  sources: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      name: z.string(),
      type: z.enum(["erp", "crm", "drive", "email", "spreadsheet"]),
      status: z.enum(["connected", "review", "disconnected"]),
      simulated: z.literal(true),
      lastSyncAt: z.string(),
    }),
  ),
  documents: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      title: z.string(),
      category: z.string(),
      sourceId: Id,
      ownerId: Id,
      processingStatus: z.enum(["pending", "processing", "processed", "error"]),
      freshnessStatus: z.enum(["current", "review", "stale", "unknown"]),
      inconsistencyStatus: z.enum(["none", "detected", "resolved"]),
      updatedAt: z.string(),
      knowledgeEntityIds: z.array(Id),
    }),
  ),
  evidence: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      documentId: Id,
      label: z.string(),
      excerpt: z.string(),
      observedAt: z.string(),
      confidence: Confidence,
      factOrEstimate: z.enum(["fact", "estimate", "hypothesis"]),
    }),
  ),
  twinEntities: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      type: z.enum([
        "fact",
        "hypothesis",
        "decision",
        "process",
        "risk",
        "opportunity",
        "product",
        "supplier",
        "metric",
      ]),
      title: z.string(),
      description: z.string(),
      ownerId: Id,
      confidence: Confidence,
      updatedAt: z.string(),
      evidenceIds: z.array(Id),
    }),
  ),
  relationships: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      fromId: Id,
      toId: Id,
      type: z.string(),
      rationale: z.string(),
    }),
  ),
  knowledgeObjectives: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      question: z.string(),
      domain: z.string(),
      priority: z.enum(["low", "medium", "high"]),
      status: z.enum(["open", "in_review", "closed"]),
      ownerId: Id,
    }),
  ),
  results: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      title: z.string(),
      type: z.enum(["risk", "opportunity", "recommendation", "report", "analysis"]),
      area: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
      status: z.enum([
        "new",
        "in_review",
        "requires_approval",
        "approved",
        "discarded",
        "completed",
      ]),
      summary: z.string(),
      expectedImpact: z.string(),
      recommendation: z.string(),
      confidence: Confidence,
      evidenceIds: z.array(Id),
      approvalId: Id.optional(),
      ownerId: Id,
      generatedAt: z.string(),
    }),
  ),
  approvals: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      resultId: Id,
      title: z.string(),
      status: z.enum(["pending", "in_review", "approved", "rejected", "changes_requested"]),
      requestedBy: z.union([z.literal("system"), Id]),
      assignedTo: Id,
      dueAt: z.string(),
      estimatedCost: z.string().optional(),
      estimatedProtectedValue: z.string().optional(),
      history: z.array(
        z.object({
          at: z.string(),
          actorName: z.string(),
          action: z.enum(["requested", "approved", "rejected", "returned"]),
          comment: z.string(),
        }),
      ),
    }),
  ),
  activity: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      actorType: z.enum(["user", "system"]),
      actorId: Id.optional(),
      actorName: z.string(),
      action: z.string(),
      entityType: z.string(),
      entityId: Id,
      summary: z.string(),
      createdAt: z.string(),
      previousState: z.string().optional(),
      nextState: z.string().optional(),
    }),
  ),
  metrics: z.object({
    current: z.record(z.string(), z.union([z.string(), z.number()])),
    trend: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
  }),
  settings: z.record(z.string(), z.unknown()),
});

const raw = JSON.parse(fs.readFileSync(seedPath, "utf8"));
const parsed = SeedSchema.safeParse(raw);
if (!parsed.success) {
  console.error(parsed.error.message);
  process.exit(1);
}

const ids = {
  users: new Set(raw.users.map((u) => u.id)),
  sources: new Set(raw.sources.map((s) => s.id)),
  documents: new Set(raw.documents.map((d) => d.id)),
  evidence: new Set(raw.evidence.map((e) => e.id)),
  entities: new Set(raw.twinEntities.map((e) => e.id)),
  results: new Set(raw.results.map((r) => r.id)),
  approvals: new Set(raw.approvals.map((a) => a.id)),
};

const errors = [];
for (const doc of raw.documents) {
  if (!ids.sources.has(doc.sourceId)) errors.push(`document ${doc.id} source missing`);
  if (!ids.users.has(doc.ownerId)) errors.push(`document ${doc.id} owner missing`);
  for (const kid of doc.knowledgeEntityIds) {
    if (!ids.entities.has(kid)) errors.push(`document ${doc.id} entity ${kid} missing`);
  }
}
for (const ev of raw.evidence) {
  if (!ids.documents.has(ev.documentId)) errors.push(`evidence ${ev.id} document missing`);
}
for (const ent of raw.twinEntities) {
  if (!ids.users.has(ent.ownerId)) errors.push(`entity ${ent.id} owner missing`);
  for (const eid of ent.evidenceIds) {
    if (!ids.evidence.has(eid)) errors.push(`entity ${ent.id} evidence ${eid} missing`);
  }
}
for (const rel of raw.relationships) {
  if (!ids.entities.has(rel.fromId) || !ids.entities.has(rel.toId)) {
    errors.push(`relationship ${rel.id} endpoints missing`);
  }
}
for (const result of raw.results) {
  if (result.approvalId && !ids.approvals.has(result.approvalId)) {
    errors.push(`result ${result.id} approval missing`);
  }
  for (const eid of result.evidenceIds) {
    if (!ids.evidence.has(eid)) errors.push(`result ${result.id} evidence ${eid} missing`);
  }
}
for (const approval of raw.approvals) {
  if (!ids.results.has(approval.resultId)) errors.push(`approval ${approval.id} result missing`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const extPath = path.join(root, "mock-data", "pyme-extension.json");
const Rubro = z.enum([
  "comercial",
  "operaciones",
  "finanzas",
  "institucional",
  "personas",
  "calidad",
]);
const ExtSchema = z.object({
  businessAreas: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      name: z.string(),
      description: z.string(),
      health: z.enum(["missing", "weak", "healthy"]),
      ownerId: Id,
      rubroIds: z.array(Rubro),
      objectivesMet: z.array(z.string()),
      objectivesGap: z.array(z.string()),
      documentIds: z.array(Id),
      taskIds: z.array(Id),
      improvementIds: z.array(Id),
      relatedEntityIds: z.array(Id),
      position: z.object({ x: z.number(), y: z.number() }),
    }),
  ),
  areaTasks: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      areaId: Id,
      title: z.string(),
      status: z.enum(["open", "in_progress", "done"]),
      dueAt: z.string(),
      ownerId: Id,
    }),
  ),
  areaImprovements: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      areaId: Id,
      text: z.string(),
      at: z.string(),
    }),
  ),
  pains: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      title: z.string(),
      summary: z.string(),
      severity: z.enum(["low", "medium", "high", "critical"]),
      rubroIds: z.array(Rubro),
      evidence: z.string(),
      actionIds: z.array(Id),
    }),
  ),
  actions: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      painId: Id,
      title: z.string(),
      summary: z.string(),
      areaId: Id,
      status: z.enum(["planned", "in_progress", "done"]),
      estimatedImpact: z.string(),
      resultId: Id.optional(),
    }),
  ),
  newsItems: z.array(
    z.object({
      id: Id,
      tenantId: Id,
      title: z.string(),
      type: z.enum(["ley", "decreto", "mercado"]),
      publishedAt: z.string(),
      summary: z.string(),
      detail: z.string(),
      rubroIds: z.array(Rubro),
      severity: z.enum(["low", "medium", "high"]),
      sourceLabel: z.string(),
    }),
  ),
  consultorReplies: z.array(
    z.object({
      id: Id,
      keywords: z.array(z.string()),
      answer: z.string(),
      linkHints: z.array(z.object({ label: z.string(), to: z.string() })),
    }),
  ),
});

const extRaw = JSON.parse(fs.readFileSync(extPath, "utf8"));
const extParsed = ExtSchema.safeParse(extRaw);
if (!extParsed.success) {
  console.error(extParsed.error.message);
  process.exit(1);
}

const areaIds = new Set(extRaw.businessAreas.map((a) => a.id));
const taskIds = new Set(extRaw.areaTasks.map((t) => t.id));
const impIds = new Set(extRaw.areaImprovements.map((i) => i.id));
const painIds = new Set(extRaw.pains.map((p) => p.id));
const actionIds = new Set(extRaw.actions.map((a) => a.id));
const extErrors = [];

for (const area of extRaw.businessAreas) {
  if (!ids.users.has(area.ownerId)) extErrors.push(`area ${area.id} owner missing`);
  for (const d of area.documentIds) {
    if (!ids.documents.has(d)) extErrors.push(`area ${area.id} doc ${d} missing`);
  }
  for (const t of area.taskIds) {
    if (!taskIds.has(t)) extErrors.push(`area ${area.id} task ${t} missing`);
  }
  for (const i of area.improvementIds) {
    if (!impIds.has(i)) extErrors.push(`area ${area.id} improvement ${i} missing`);
  }
}
for (const task of extRaw.areaTasks) {
  if (!areaIds.has(task.areaId)) extErrors.push(`task ${task.id} area missing`);
}
for (const pain of extRaw.pains) {
  for (const a of pain.actionIds) {
    if (!actionIds.has(a)) extErrors.push(`pain ${pain.id} action ${a} missing`);
  }
}
for (const action of extRaw.actions) {
  if (!painIds.has(action.painId)) extErrors.push(`action ${action.id} pain missing`);
  if (!areaIds.has(action.areaId)) extErrors.push(`action ${action.id} area missing`);
}

if (extErrors.length) {
  console.error(extErrors.join("\n"));
  process.exit(1);
}

console.log(`seed:validate OK — ${path.basename(seedPath)} + ${path.basename(extPath)}`);

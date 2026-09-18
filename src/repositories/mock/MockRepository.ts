import { resolveApproval } from "@/domain/resolveApproval";
import type { DemoState, DocumentItem, ResolveApprovalInput, Source } from "@/domain/types";
import { env } from "@/lib/env";
import { readJson, removeKey, SCHEMA_VERSION, STORAGE_KEY, writeJson } from "@/lib/storage";
import type {
  ActivityFilters,
  DemoRepository,
  DocumentFilters,
  ResultFilters,
} from "@/repositories/contracts";
import { loadCanonicalSeed } from "./loadSeed";
import type { PersistedDemoState } from "@/domain/types";

function delay(): Promise<void> {
  if (!env.fakeLatency) return Promise.resolve();
  const ms = env.minDelay + Math.random() * (env.maxDelay - env.minDelay);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function persist(state: DemoState): void {
  const payload: PersistedDemoState = {
    schemaVersion: SCHEMA_VERSION,
    seedVersion: state.metadata.seedVersion,
    savedAt: new Date().toISOString(),
    state,
  };
  writeJson(STORAGE_KEY, payload);
}

function hydrate(): DemoState {
  const seed = loadCanonicalSeed();
  const saved = readJson<PersistedDemoState>(STORAGE_KEY);
  if (!saved) {
    persist(seed);
    return seed;
  }
  if (saved.schemaVersion !== SCHEMA_VERSION || saved.seedVersion !== seed.metadata.seedVersion) {
    removeKey(STORAGE_KEY);
    persist(seed);
    return seed;
  }
  return saved.state;
}

export class MockRepository implements DemoRepository {
  private state: DemoState;

  constructor() {
    this.state = hydrate();
  }

  private async commit(next: DemoState): Promise<DemoState> {
    this.state = next;
    persist(next);
    await delay();
    return next;
  }

  async getState(): Promise<DemoState> {
    await delay();
    return structuredClone(this.state);
  }

  async listResults(filters: ResultFilters = {}): Promise<DemoState["results"]> {
    await delay();
    return this.state.results.filter((r) => {
      if (filters.status && r.status !== filters.status) return false;
      if (filters.area && r.area !== filters.area) return false;
      if (filters.type && r.type !== filters.type) return false;
      if (filters.priority && r.priority !== filters.priority) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const hay = `${r.title} ${r.summary} ${r.area}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  async getResult(id: string) {
    await delay();
    return this.state.results.find((r) => r.id === id) ?? null;
  }

  async listApprovals(statusGroup: "pending" | "resolved" | "all" = "all") {
    await delay();
    return this.state.approvals.filter((a) => {
      if (statusGroup === "pending") return a.status === "pending" || a.status === "in_review";
      if (statusGroup === "resolved") {
        return a.status === "approved" || a.status === "rejected" || a.status === "changes_requested";
      }
      return true;
    });
  }

  async getApproval(id: string) {
    await delay();
    return this.state.approvals.find((a) => a.id === id) ?? null;
  }

  async resolveApproval(input: ResolveApprovalInput) {
    const next = resolveApproval(this.state, input);
    return this.commit(next);
  }

  async listDocuments(filters: DocumentFilters = {}) {
    await delay();
    return this.state.documents.filter((d) => {
      if (filters.category && d.category !== filters.category) return false;
      if (filters.sourceId && d.sourceId !== filters.sourceId) return false;
      if (filters.attentionOnly) {
        const attention =
          d.freshnessStatus === "review" ||
          d.freshnessStatus === "stale" ||
          d.inconsistencyStatus === "detected";
        if (!attention) return false;
      }
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!`${d.title} ${d.category}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  async getDocument(id: string) {
    await delay();
    return this.state.documents.find((d) => d.id === id) ?? null;
  }

  async markDocumentReviewed(id: string) {
    const doc = this.state.documents.find((d) => d.id === id);
    if (!doc) throw new Error("Documento no encontrado");
    const documents = this.state.documents.map((d) =>
      d.id === id
        ? {
            ...d,
            freshnessStatus: "current" as const,
            inconsistencyStatus:
              d.inconsistencyStatus === "detected" ? ("resolved" as const) : d.inconsistencyStatus,
          }
        : d,
    );
    const activity = [
      {
        id: `event_doc_${Date.now()}`,
        tenantId: this.state.tenant.id,
        actorType: "user" as const,
        actorId: this.state.currentUserId,
        actorName:
          this.state.users.find((u) => u.id === this.state.currentUserId)?.name ?? "Usuario",
        action: "marcó como revisado",
        entityType: "document",
        entityId: id,
        summary: `Marcó como revisado: ${doc.title}.`,
        createdAt: this.state.metadata.demoNow,
        previousState: "Requiere atención",
        nextState: "Revisado",
      },
      ...this.state.activity,
    ];
    const attention = documents.filter(
      (d) =>
        d.freshnessStatus === "review" ||
        d.freshnessStatus === "stale" ||
        d.inconsistencyStatus === "detected",
    ).length;
    return this.commit({
      ...this.state,
      documents,
      activity,
      metrics: {
        ...this.state.metrics,
        current: {
          ...this.state.metrics.current,
          sourcesToReview: Math.max(attention, this.state.sources.filter((s) => s.status === "review").length),
        },
      },
    });
  }

  async simulateUpload(meta: { name: string; type: string; size: number }) {
    const id = `doc_upload_${Date.now()}`;
    const doc: DocumentItem = {
      id,
      tenantId: this.state.tenant.id,
      title: meta.name,
      category: "Operaciones",
      sourceId: "source_drive",
      ownerId: this.state.currentUserId,
      processingStatus: "processed",
      freshnessStatus: "current",
      inconsistencyStatus: "none",
      updatedAt: this.state.metadata.demoNow,
      knowledgeEntityIds: [],
      rubroIds: ["operaciones"],
    };
    const activity = [
      {
        id: `event_upload_${Date.now()}`,
        tenantId: this.state.tenant.id,
        actorType: "user" as const,
        actorId: this.state.currentUserId,
        actorName:
          this.state.users.find((u) => u.id === this.state.currentUserId)?.name ?? "Usuario",
        action: "simuló carga",
        entityType: "document",
        entityId: id,
        summary: `Simuló la carga de ${meta.name} (${meta.type || "archivo"}, ${meta.size} bytes). El archivo no se envió ni procesó realmente.`,
        createdAt: this.state.metadata.demoNow,
      },
      ...this.state.activity,
    ];
    return this.commit({
      ...this.state,
      documents: [doc, ...this.state.documents],
      activity,
    });
  }

  async listEvidence(ids: string[]) {
    await delay();
    const set = new Set(ids);
    return this.state.evidence.filter((e) => set.has(e.id));
  }

  async listEntities() {
    await delay();
    return this.state.twinEntities;
  }

  async getEntity(id: string) {
    await delay();
    return this.state.twinEntities.find((e) => e.id === id) ?? null;
  }

  async listObjectives() {
    await delay();
    return this.state.knowledgeObjectives;
  }

  async listActivity(filters: ActivityFilters = {}) {
    await delay();
    return this.state.activity
      .filter((e) => {
        if (filters.entityType && e.entityType !== filters.entityType) return false;
        if (filters.actorName && e.actorName !== filters.actorName) return false;
        if (filters.query) {
          const q = filters.query.toLowerCase();
          if (!`${e.summary} ${e.action} ${e.actorName}`.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async listSources() {
    await delay();
    return this.state.sources;
  }

  async updateSettings(patch: Partial<DemoState["settings"]>) {
    return this.commit({
      ...this.state,
      settings: { ...this.state.settings, ...patch },
    });
  }

  async updateSourceStatus(id: string, status: Source["status"]) {
    const sources = this.state.sources.map((s) => (s.id === id ? { ...s, status } : s));
    return this.commit({ ...this.state, sources });
  }

  async updateAreaPositions(positions: Record<string, { x: number; y: number }>) {
    return this.commit({
      ...this.state,
      areaPositions: { ...this.state.areaPositions, ...positions },
      businessAreas: this.state.businessAreas.map((a) => ({
        ...a,
        position: positions[a.id] ?? a.position,
      })),
    });
  }

  async askConsultor(question: string) {
    const q = question.trim().toLowerCase();
    const now = this.state.metadata.demoNow;
    const replies = this.state.consultorReplies;
    let match =
      replies.find((r) => r.keywords.some((k) => k !== "*" && q.includes(k.toLowerCase()))) ??
      replies.find((r) => r.keywords.includes("*"));
    if (!match) {
      match = {
        id: "fallback",
        keywords: ["*"],
        answer:
          "No encontré una respuesta específica en el conocimiento simulado. Revisá Inicio, Gemelo o Novedades.",
        linkHints: [{ label: "Inicio", to: "/inicio" }],
      };
    }
    const userMsg = {
      id: `msg_u_${Date.now()}`,
      role: "user" as const,
      text: question.trim(),
      at: now,
    };
    const systemMsg = {
      id: `msg_s_${Date.now()}`,
      role: "system" as const,
      text: match.answer,
      at: now,
      links: match.linkHints,
    };
    const history = [...this.state.consultorHistory, userMsg, systemMsg].slice(-40);
    return this.commit({ ...this.state, consultorHistory: history });
  }

  async resetDemo() {
    removeKey(STORAGE_KEY);
    const seed = loadCanonicalSeed();
    return this.commit(seed);
  }

  async search(query: string) {
    await delay();
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hits: Array<{ type: string; id: string; title: string; context: string; to: string }> = [];
    for (const d of this.state.documents) {
      if (d.title.toLowerCase().includes(q)) {
        hits.push({
          type: "Documento",
          id: d.id,
          title: d.title,
          context: d.category,
          to: `/documentacion/${d.id}`,
        });
      }
    }
    for (const e of this.state.twinEntities) {
      if (e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)) {
        hits.push({
          type: "Entidad",
          id: e.id,
          title: e.title,
          context: e.type,
          to: `/gemelo/${e.id}`,
        });
      }
    }
    for (const r of this.state.results) {
      if (`${r.title} ${r.summary}`.toLowerCase().includes(q)) {
        hits.push({
          type: "Resultado",
          id: r.id,
          title: r.title,
          context: r.area,
          to: `/resultados/${r.id}`,
        });
      }
    }
    for (const a of this.state.approvals) {
      if (a.title.toLowerCase().includes(q)) {
        hits.push({
          type: "Decisión",
          id: a.id,
          title: a.title,
          context: a.status,
          to: `/aprobaciones/${a.id}`,
        });
      }
    }
    return hits.slice(0, 20);
  }
}

export const mockRepository = new MockRepository();

import type {
  ActivityEvent,
  Approval,
  DemoState,
  DocumentItem,
  Evidence,
  KnowledgeObjective,
  Result,
  ResolveApprovalInput,
  Source,
  TwinEntity,
} from "@/domain/types";

export interface ResultFilters {
  status?: string;
  area?: string;
  type?: string;
  priority?: string;
  query?: string;
}

export interface DocumentFilters {
  query?: string;
  category?: string;
  attentionOnly?: boolean;
  area?: string;
  sourceId?: string;
}

export interface ActivityFilters {
  query?: string;
  entityType?: string;
  actorName?: string;
}

export interface DemoRepository {
  getState(): Promise<DemoState>;
  listResults(filters?: ResultFilters): Promise<Result[]>;
  getResult(id: string): Promise<Result | null>;
  listApprovals(statusGroup?: "pending" | "resolved" | "all"): Promise<Approval[]>;
  getApproval(id: string): Promise<Approval | null>;
  resolveApproval(input: ResolveApprovalInput): Promise<DemoState>;
  listDocuments(filters?: DocumentFilters): Promise<DocumentItem[]>;
  getDocument(id: string): Promise<DocumentItem | null>;
  markDocumentReviewed(id: string): Promise<DemoState>;
  simulateUpload(meta: { name: string; type: string; size: number }): Promise<DemoState>;
  listEvidence(ids: string[]): Promise<Evidence[]>;
  listEntities(): Promise<TwinEntity[]>;
  getEntity(id: string): Promise<TwinEntity | null>;
  listObjectives(): Promise<KnowledgeObjective[]>;
  listActivity(filters?: ActivityFilters): Promise<ActivityEvent[]>;
  listSources(): Promise<Source[]>;
  updateSettings(patch: Partial<DemoState["settings"]>): Promise<DemoState>;
  updateSourceStatus(id: string, status: Source["status"]): Promise<DemoState>;
  updateAreaPositions(positions: Record<string, { x: number; y: number }>): Promise<DemoState>;
  askConsultor(question: string): Promise<DemoState>;
  resetDemo(): Promise<DemoState>;
  search(query: string): Promise<
    Array<{ type: string; id: string; title: string; context: string; to: string }>
  >;
}

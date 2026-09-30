export type Id = string;

export type RubroId =
  | "comercial"
  | "operaciones"
  | "finanzas"
  | "institucional"
  | "personas"
  | "calidad";

export const RUBROS: Array<{ id: RubroId; label: string }> = [
  { id: "comercial", label: "Comercial" },
  { id: "operaciones", label: "Operaciones" },
  { id: "finanzas", label: "Finanzas" },
  { id: "institucional", label: "Institucional" },
  { id: "personas", label: "Personas" },
  { id: "calidad", label: "Calidad" },
];

export type UserRole = "admin" | "direction" | "owner" | "viewer";
export type SourceType = "erp" | "crm" | "drive" | "email" | "spreadsheet";
export type SourceStatus = "connected" | "review" | "disconnected";
export type ProcessingStatus = "pending" | "processing" | "processed" | "error";
export type FreshnessStatus = "current" | "review" | "stale" | "unknown";
export type InconsistencyStatus = "none" | "detected" | "resolved";
export type TwinEntityType =
  | "fact"
  | "hypothesis"
  | "decision"
  | "process"
  | "risk"
  | "opportunity"
  | "product"
  | "supplier"
  | "metric";
export type ResultType = "risk" | "opportunity" | "recommendation" | "report" | "analysis";
export type ResultStatus =
  | "new"
  | "in_review"
  | "requires_approval"
  | "approved"
  | "discarded"
  | "completed";
export type Priority = "low" | "medium" | "high" | "critical";
export type ApprovalStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "changes_requested";
export type ApprovalAction = "approved" | "rejected" | "returned";
export type FactOrEstimate = "fact" | "estimate" | "hypothesis";
export type AreaHealth = "missing" | "weak" | "healthy";
export type AreaTaskStatus = "open" | "in_progress" | "done";
export type ActionStatus = "planned" | "in_progress" | "done";
export type NewsType = "ley" | "decreto" | "mercado";
export type NewsSeverity = "low" | "medium" | "high";

export interface Tenant {
  id: Id;
  name: string;
  industry: string;
  timezone: string;
  currencyLabel: string;
  location?: string;
  employees?: number;
  activeCustomers?: number;
  productionLines?: number;
  warehouses?: number;
  dataMode?: "synthetic";
}

export interface User {
  id: Id;
  tenantId: Id;
  name: string;
  role: UserRole;
  area: string;
  avatarInitials: string;
}

export interface Source {
  id: Id;
  tenantId: Id;
  name: string;
  type: SourceType;
  status: SourceStatus;
  simulated: true;
  lastSyncAt: string;
}

export interface DocumentItem {
  id: Id;
  tenantId: Id;
  title: string;
  category: string;
  sourceId: Id;
  ownerId: Id;
  processingStatus: ProcessingStatus;
  freshnessStatus: FreshnessStatus;
  inconsistencyStatus: InconsistencyStatus;
  updatedAt: string;
  knowledgeEntityIds: Id[];
  rubroIds: RubroId[];
}

export interface Evidence {
  id: Id;
  tenantId: Id;
  documentId: Id;
  label: string;
  excerpt: string;
  observedAt: string;
  confidence: number;
  factOrEstimate: FactOrEstimate;
}

export interface TwinEntity {
  id: Id;
  tenantId: Id;
  type: TwinEntityType;
  title: string;
  description: string;
  ownerId: Id;
  confidence: number;
  updatedAt: string;
  evidenceIds: Id[];
  rubroIds?: RubroId[];
}

export interface Relationship {
  id: Id;
  tenantId: Id;
  fromId: Id;
  toId: Id;
  type: string;
  rationale: string;
}

export interface KnowledgeObjective {
  id: Id;
  tenantId: Id;
  question: string;
  domain: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_review" | "closed";
  ownerId: Id;
}

export interface Result {
  id: Id;
  tenantId: Id;
  title: string;
  type: ResultType;
  area: string;
  priority: Priority;
  status: ResultStatus;
  summary: string;
  expectedImpact: string;
  recommendation: string;
  confidence: number;
  evidenceIds: Id[];
  approvalId?: Id;
  ownerId: Id;
  generatedAt: string;
  rubroIds: RubroId[];
}

export interface ApprovalHistoryItem {
  at: string;
  actorName: string;
  action: "requested" | "approved" | "rejected" | "returned";
  comment: string;
}

export interface Approval {
  id: Id;
  tenantId: Id;
  resultId: Id;
  title: string;
  status: ApprovalStatus;
  requestedBy: "system" | Id;
  assignedTo: Id;
  dueAt: string;
  estimatedCost?: string;
  estimatedProtectedValue?: string;
  history: ApprovalHistoryItem[];
}

export interface ActivityEvent {
  id: Id;
  tenantId: Id;
  actorType: "user" | "system";
  actorId?: Id;
  actorName: string;
  action: string;
  entityType: string;
  entityId: Id;
  summary: string;
  createdAt: string;
  previousState?: string;
  nextState?: string;
}

export interface MetricCurrent {
  tenantId: Id;
  period: string;
  knowledgeCoverage: number;
  averageConfidence: number;
  newResults: number;
  pendingApprovals: number;
  sourcesToReview: number;
  potentialStockoutsAnticipated: number;
  estimatedHoursSavedMonthly: number;
  onTimeDelivery: number;
  onTimeDeliveryBaseline: number;
  quotePreparationHours: number;
  quotePreparationBaselineHours: number;
  estimatedOpportunitiesEquivalentUsd: number;
  decisionsSupported?: number;
  risksResolved?: number;
  /** Costo expuesto de la decisión de liner. Cifra simulada. */
  simulatedCostUsd?: number;
  /** Caja disponible. Cifra simulada. */
  simulatedCashUsd?: number;
  /** Entregas en riesgo. Cifra simulada. */
  deliveriesAtRisk?: number;
}

export interface MetricTrendPoint {
  tenantId: Id;
  period: string;
  knowledgeCoverage: number;
  averageConfidence: number;
  decisionsSupported: number;
  approvalsOnTime: number;
  staleSources: number;
  estimatedHoursSaved: number;
}

export interface RubroCoverage {
  rubroId: RubroId;
  documentCount: number;
  resultCount: number;
  coverageScore: number;
}

export interface BusinessArea {
  id: Id;
  tenantId: Id;
  name: string;
  description: string;
  health: AreaHealth;
  ownerId: Id;
  rubroIds: RubroId[];
  objectivesMet: string[];
  objectivesGap: string[];
  documentIds: Id[];
  taskIds: Id[];
  improvementIds: Id[];
  relatedEntityIds: Id[];
  position: { x: number; y: number };
}

export interface AreaTask {
  id: Id;
  tenantId: Id;
  areaId: Id;
  title: string;
  status: AreaTaskStatus;
  dueAt: string;
  ownerId: Id;
}

export interface AreaImprovement {
  id: Id;
  tenantId: Id;
  areaId: Id;
  text: string;
  at: string;
}

export interface Pain {
  id: Id;
  tenantId: Id;
  title: string;
  summary: string;
  severity: Priority;
  rubroIds: RubroId[];
  evidence: string;
  actionIds: Id[];
}

export interface ActionItem {
  id: Id;
  tenantId: Id;
  painId: Id;
  title: string;
  summary: string;
  areaId: Id;
  status: ActionStatus;
  estimatedImpact: string;
  resultId?: Id;
}

export interface NewsItem {
  id: Id;
  tenantId: Id;
  title: string;
  type: NewsType;
  publishedAt: string;
  summary: string;
  detail: string;
  rubroIds: RubroId[];
  severity: NewsSeverity;
  sourceLabel: string;
}

export interface ConsultorReply {
  id: Id;
  keywords: string[];
  answer: string;
  linkHints: Array<{ label: string; to: string }>;
}

export interface ConsultorMessage {
  id: Id;
  role: "user" | "system";
  text: string;
  at: string;
  links?: Array<{ label: string; to: string }>;
}

export interface DemoSettings {
  tenantId: Id;
  locale: string;
  timezone: string;
  dateFormat: string;
  currencyLabel: string;
  notifications: {
    criticalAlerts: boolean;
    dailyDigest: boolean;
    approvalReminders: boolean;
  };
  approvalPolicies: Array<{
    id: string;
    label: string;
    condition: string;
    approverRole: string;
  }>;
}

export interface SeedMetadata {
  schemaVersion: 1;
  seedVersion: string;
  demoNow: string;
  dataMode: "synthetic";
  disclaimer: string;
}

export interface DemoState {
  metadata: SeedMetadata;
  tenant: Tenant;
  users: User[];
  sources: Source[];
  documents: DocumentItem[];
  evidence: Evidence[];
  twinEntities: TwinEntity[];
  relationships: Relationship[];
  knowledgeObjectives: KnowledgeObjective[];
  results: Result[];
  approvals: Approval[];
  activity: ActivityEvent[];
  metrics: {
    current: MetricCurrent;
    trend: MetricTrendPoint[];
    rubroCoverage: RubroCoverage[];
  };
  settings: DemoSettings;
  businessAreas: BusinessArea[];
  areaTasks: AreaTask[];
  areaImprovements: AreaImprovement[];
  pains: Pain[];
  actions: ActionItem[];
  newsItems: NewsItem[];
  consultorReplies: ConsultorReply[];
  consultorHistory: ConsultorMessage[];
  areaPositions: Record<string, { x: number; y: number }>;
  currentUserId: Id;
}

export interface PersistedDemoState {
  schemaVersion: 1;
  seedVersion: string;
  savedAt: string;
  state: DemoState;
}

export interface ResolveApprovalInput {
  approvalId: Id;
  action: "approve" | "reject" | "request_changes";
  comment: string;
  actorId: Id;
  at?: string;
}

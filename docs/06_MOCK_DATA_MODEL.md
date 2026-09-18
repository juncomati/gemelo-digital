# 06 — Modelo de datos mock

## Principios

- Una única fuente de verdad para toda la demo.
- Todas las entidades incluyen `tenantId`.
- IDs estables, descriptivos y sin datos personales reales.
- Fechas coherentes con `demoNow`.
- Valores agregados derivados siempre que sea posible.
- Datos validados al iniciar la aplicación y en CI.
- Estado local versionado para permitir migración o restablecimiento.

## Entidades

```ts
type Id = string;

interface Tenant {
  id: Id;
  name: string;
  industry: string;
  timezone: string;
  currencyLabel: string;
  dataMode: "synthetic";
}

interface User {
  id: Id;
  tenantId: Id;
  name: string;
  role: "admin" | "direction" | "owner" | "viewer";
  area: string;
  avatarInitials: string;
}

interface Source {
  id: Id;
  tenantId: Id;
  name: string;
  type: "erp" | "crm" | "drive" | "email" | "spreadsheet";
  status: "connected" | "review" | "disconnected";
  simulated: true;
  lastSyncAt: string;
}

interface Document {
  id: Id;
  tenantId: Id;
  title: string;
  category: string;
  sourceId: Id;
  ownerId: Id;
  processingStatus: "pending" | "processing" | "processed" | "error";
  freshnessStatus: "current" | "review" | "stale" | "unknown";
  inconsistencyStatus: "none" | "detected" | "resolved";
  updatedAt: string;
  knowledgeEntityIds: Id[];
}

interface Evidence {
  id: Id;
  tenantId: Id;
  documentId: Id;
  label: string;
  excerpt: string;
  observedAt: string;
  confidence: number;
  factOrEstimate: "fact" | "estimate" | "hypothesis";
}

interface TwinEntity {
  id: Id;
  tenantId: Id;
  type: "fact" | "hypothesis" | "decision" | "process" | "risk" | "opportunity" | "product" | "supplier" | "metric";
  title: string;
  description: string;
  ownerId: Id;
  confidence: number;
  updatedAt: string;
  evidenceIds: Id[];
}

interface Relationship {
  id: Id;
  tenantId: Id;
  fromId: Id;
  toId: Id;
  type: string;
  rationale: string;
}

interface KnowledgeObjective {
  id: Id;
  tenantId: Id;
  question: string;
  domain: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_review" | "closed";
  ownerId: Id;
}

interface Result {
  id: Id;
  tenantId: Id;
  title: string;
  type: "risk" | "opportunity" | "recommendation" | "report" | "analysis";
  area: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "new" | "in_review" | "requires_approval" | "approved" | "discarded" | "completed";
  summary: string;
  expectedImpact: string;
  recommendation: string;
  confidence: number;
  evidenceIds: Id[];
  approvalId?: Id;
  ownerId: Id;
  generatedAt: string;
}

interface Approval {
  id: Id;
  tenantId: Id;
  resultId: Id;
  title: string;
  status: "pending" | "in_review" | "approved" | "rejected" | "changes_requested";
  requestedBy: "system" | Id;
  assignedTo: Id;
  dueAt: string;
  estimatedCost?: string;
  estimatedProtectedValue?: string;
  history: ApprovalHistoryItem[];
}

interface ApprovalHistoryItem {
  at: string;
  actorName: string;
  action: "requested" | "approved" | "rejected" | "returned";
  comment: string;
}

interface ActivityEvent {
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

interface MetricSnapshot {
  tenantId: Id;
  period: string;
  knowledgeCoverage: number;
  averageConfidence: number;
  decisionsSupported: number;
  approvalsOnTime: number;
  staleSources: number;
  estimatedHoursSaved: number;
}
```

## Relaciones esenciales

```text
Documento aporta Evidencia
Evidencia respalda Elemento de conocimiento
Elemento se relaciona con Elemento
Resultado utiliza Evidencia
Resultado genera Aprobación
Aprobación produce Evento de actividad
Resultado impacta Métrica
Usuario pertenece a Área
Usuario resuelve Aprobación
```

## Transición de aprobación

Una sola función de dominio debe actualizar de forma atómica el estado local:

```ts
resolveApproval({ approvalId, action, comment, actorId })
```

Efectos:

1. agregar historial a la aprobación;
2. cambiar su estado;
3. cambiar el resultado vinculado;
4. crear evento de actividad;
5. recalcular contadores;
6. persistir el nuevo snapshot.

## Persistencia

Clave sugerida:

```text
makers.gemelo-demo.v1
```

Estructura:

```ts
interface PersistedDemoState {
  schemaVersion: 1;
  seedVersion: string;
  savedAt: string;
  state: DemoState;
}
```

Si la versión no coincide, mostrar una explicación en desarrollo y ofrecer restablecer.

## Validación

Crear esquemas Zod equivalentes y validar:

- al importar la semilla;
- en pruebas;
- durante el build;
- antes de persistir una transición compleja en desarrollo.

## Reglas de consistencia

- Cada aprobación enlaza exactamente un resultado.
- Cada resultado importante tiene al menos dos evidencias.
- Un mismo resultado conserva título, impacto, responsable y estado en todos los módulos.
- Las relaciones apuntan a IDs existentes.
- Las fechas no superan arbitrariamente `demoNow` salvo vencimientos o proyecciones.
- Confianza se almacena entre 0 y 1 y se formatea como porcentaje.
- Los impactos económicos se guardan como texto con `estimado` y `USD equivalentes`.
- Los contadores visibles se derivan de colecciones o de agregados documentados.

## Archivo canónico

`mock-data/canonical-scenario.json` contiene el escenario transversal. Cursor puede ampliarlo de manera determinística, pero no debe cambiar los IDs, valores o fechas del caso principal sin actualizar todas las especificaciones.

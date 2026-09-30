import type { MetricCurrent } from "./types";

export type CausalKind = "evidencia" | "depende" | "hueco";
export type FlowArea = "operaciones" | "compras" | "finanzas" | "calidad" | "personas";
export type FlowLens = "pedido" | "compra" | "lote" | "factura";

export const CAUSAL_KIND_LABEL: Record<CausalKind, string> = {
  evidencia: "evidencia",
  depende: "depende de",
  hueco: "hueco",
};

export interface CausalNode {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  onPath: boolean;
}

export interface CausalEdge {
  id: string;
  from: string;
  to: string;
  kind: CausalKind;
  onPath: boolean;
  /** Vertical offset of the quadratic control point. 0 draws a straight segment. */
  bend: number;
}

export const CAUSAL_NODES: CausalNode[] = [
  { id: "calidad", label: "Calidad", detail: "spec de liner", x: 400, y: 78, onPath: true },
  { id: "compras", label: "Compras", detail: "plazo", x: 400, y: 198, onPath: true },
  { id: "operaciones", label: "Operaciones", detail: "colas", x: 400, y: 318, onPath: true },
  { id: "finanzas", label: "Finanzas", detail: "caja", x: 400, y: 438, onPath: true },
  { id: "personas", label: "Personas", detail: "turno extra", x: 400, y: 558, onPath: true },
  { id: "quiebre", label: "Quiebre de liner", detail: "cobertura 9 días", x: 140, y: 318, onPath: false },
];

export const CAUSAL_EDGES: CausalEdge[] = [
  { id: "e_cal_com", from: "calidad", to: "compras", kind: "evidencia", onPath: true, bend: 0 },
  { id: "e_com_ops", from: "compras", to: "operaciones", kind: "depende", onPath: true, bend: 0 },
  { id: "e_ops_fin", from: "operaciones", to: "finanzas", kind: "depende", onPath: true, bend: 0 },
  { id: "e_fin_per", from: "finanzas", to: "personas", kind: "hueco", onPath: true, bend: 0 },
  { id: "e_quiebre_cal", from: "quiebre", to: "calidad", kind: "evidencia", onPath: false, bend: -70 },
  { id: "e_ops_quiebre", from: "operaciones", to: "quiebre", kind: "evidencia", onPath: false, bend: 0 },
  { id: "e_com_fin", from: "compras", to: "finanzas", kind: "hueco", onPath: false, bend: -360 },
  { id: "e_per_ops", from: "personas", to: "operaciones", kind: "depende", onPath: false, bend: -200 },
];

export const CAUSAL_PATH_LABEL =
  "Calidad (spec de liner) → Compras (plazo) → Operaciones (colas) → Finanzas (caja) → Personas (turno extra)";

export interface FlowNode {
  id: string;
  label: string;
  x: number;
  y: number;
  /** Pedidos que siguen de largo. */
  inProgress?: number;
  /** Segundo conteo: pedidos detenidos en el nodo. */
  waiting?: number;
  lenses: FlowLens[];
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  volume: number;
  waitHours: number;
  area: FlowArea;
  lenses: FlowLens[];
}

export const FLOW_AREAS: Array<{ id: FlowArea; label: string }> = [
  { id: "operaciones", label: "Operaciones" },
  { id: "compras", label: "Compras" },
  { id: "finanzas", label: "Finanzas" },
  { id: "calidad", label: "Calidad" },
  { id: "personas", label: "Personas" },
];

export const FLOW_LENSES: Array<{ id: FlowLens; label: string }> = [
  { id: "pedido", label: "Pedido" },
  { id: "compra", label: "Compra" },
  { id: "lote", label: "Lote" },
  { id: "factura", label: "Factura" },
];

export const FLOW_NODES: FlowNode[] = [
  { id: "pedido", label: "Pedido", x: 90, y: 250, inProgress: 46, lenses: ["pedido"] },
  { id: "corte", label: "Corte", x: 300, y: 250, inProgress: 42, lenses: ["pedido", "lote"] },
  {
    id: "consumo",
    label: "Consumo de liner",
    x: 530,
    y: 250,
    inProgress: 18,
    waiting: 24,
    lenses: ["pedido", "compra", "lote"],
  },
  { id: "armado", label: "Armado", x: 760, y: 250, inProgress: 16, lenses: ["pedido", "lote"] },
  { id: "despacho", label: "Despacho", x: 970, y: 250, inProgress: 14, lenses: ["pedido", "factura"] },
  { id: "compra", label: "Compra", x: 530, y: 78, inProgress: 12, lenses: ["compra"] },
  { id: "lote", label: "Lote", x: 300, y: 78, inProgress: 30, lenses: ["lote"] },
  { id: "factura", label: "Factura", x: 970, y: 78, inProgress: 11, lenses: ["factura"] },
  { id: "spec", label: "Spec de liner", x: 120, y: 420, lenses: ["lote"] },
  { id: "turno", label: "Turno extra", x: 760, y: 420, inProgress: 4, lenses: ["lote"] },
];

export const FLOW_EDGES: FlowEdge[] = [
  {
    id: "f_ped_cor",
    from: "pedido",
    to: "corte",
    volume: 28,
    waitHours: 2,
    area: "operaciones",
    lenses: ["pedido"],
  },
  {
    id: "f_cor_con",
    from: "corte",
    to: "consumo",
    volume: 58,
    waitHours: 18,
    area: "operaciones",
    lenses: ["pedido", "lote"],
  },
  {
    id: "f_con_arm",
    from: "consumo",
    to: "armado",
    volume: 18,
    waitHours: 3.5,
    area: "operaciones",
    lenses: ["pedido", "lote"],
  },
  {
    id: "f_arm_des",
    from: "armado",
    to: "despacho",
    volume: 16,
    waitHours: 2.5,
    area: "operaciones",
    lenses: ["pedido"],
  },
  {
    id: "f_lote_cor",
    from: "lote",
    to: "corte",
    volume: 30,
    waitHours: 1.5,
    area: "operaciones",
    lenses: ["lote"],
  },
  {
    id: "f_com_con",
    from: "compra",
    to: "consumo",
    volume: 12,
    waitHours: 6.5,
    area: "compras",
    lenses: ["compra"],
  },
  {
    id: "f_des_fac",
    from: "despacho",
    to: "factura",
    volume: 14,
    waitHours: 6,
    area: "finanzas",
    lenses: ["factura"],
  },
  {
    id: "f_spec_con",
    from: "spec",
    to: "consumo",
    volume: 8,
    waitHours: 4,
    area: "calidad",
    lenses: ["lote"],
  },
  {
    id: "f_turno_arm",
    from: "turno",
    to: "armado",
    volume: 6,
    waitHours: 5,
    area: "personas",
    lenses: ["lote"],
  },
];

export const FLOW_CANVAS = { width: 1040, height: 520 };

export const FLOW_LENS_FRAME: Record<FlowLens, { x: number; y: number; w: number; h: number }> = {
  pedido: { x: 0, y: 150, w: 520, h: 260 },
  compra: { x: 360, y: 20, w: 400, h: 320 },
  lote: { x: 40, y: 10, w: 960, h: 490 },
  factura: { x: 780, y: 20, w: 260, h: 320 },
};

export type WaitTone = "low" | "mid" | "high";

export function waitTone(hours: number): WaitTone {
  if (hours >= 8) return "high";
  if (hours >= 4) return "mid";
  return "low";
}

export function waitColor(hours: number): string {
  const tone = waitTone(hours);
  if (tone === "high") return "#C93C43";
  if (tone === "mid") return "#E7A11A";
  return "#16875B";
}

export function volumeWidth(volume: number): number {
  return 2.4 + volume / 4;
}

export interface BuyFigure {
  key: "costo" | "plazo" | "calidad" | "caja";
  label: string;
  /** 0–100, mayor es mejor resultado. Solo para la altura de la barra. */
  score: number;
  display: string;
  color: string;
}

export interface BuyOption {
  id: "ya" | "parcial" | "esperar";
  label: string;
  recommended: boolean;
  figures: BuyFigure[];
}

const FIG_COLORS = {
  costo: "#12506A",
  plazo: "#176384",
  calidad: "#16875B",
  caja: "#19B5D1",
} as const;

export const BUY_OPTIONS: BuyOption[] = [
  {
    id: "ya",
    label: "Comprar ya",
    recommended: true,
    figures: [
      { key: "costo", label: "Costo", score: 62, display: "USD 11.700", color: FIG_COLORS.costo },
      { key: "plazo", label: "Plazo", score: 92, display: "5 días", color: FIG_COLORS.plazo },
      { key: "calidad", label: "Calidad", score: 96, display: "96", color: FIG_COLORS.calidad },
      { key: "caja", label: "Caja", score: 74, display: "USD 42.300", color: FIG_COLORS.caja },
    ],
  },
  {
    id: "parcial",
    label: "Comprar parcial",
    recommended: false,
    figures: [
      { key: "costo", label: "Costo", score: 78, display: "USD 6.400", color: FIG_COLORS.costo },
      { key: "plazo", label: "Plazo", score: 58, display: "9 días", color: FIG_COLORS.plazo },
      { key: "calidad", label: "Calidad", score: 84, display: "84", color: FIG_COLORS.calidad },
      { key: "caja", label: "Caja", score: 82, display: "USD 47.600", color: FIG_COLORS.caja },
    ],
  },
  {
    id: "esperar",
    label: "Esperar",
    recommended: false,
    figures: [
      { key: "costo", label: "Costo", score: 22, display: "USD 28.400", color: FIG_COLORS.costo },
      { key: "plazo", label: "Plazo", score: 28, display: "14 días", color: FIG_COLORS.plazo },
      { key: "calidad", label: "Calidad", score: 48, display: "48", color: FIG_COLORS.calidad },
      { key: "caja", label: "Caja", score: 36, display: "USD 19.600", color: FIG_COLORS.caja },
    ],
  },
];

export const IMPACT_BASELINE = {
  costoUsd: 18400,
  cajaUsd: 54000,
  entregasEnRiesgo: 6,
} as const;

export interface ApprovalImpactDelta {
  approvalId: string;
  area: string;
  costoUsd: number;
  cajaUsd: number;
  entregasEnRiesgo: number;
}

export const APPROVAL_IMPACTS: ApprovalImpactDelta[] = [
  {
    approvalId: "approval_purchase_liner",
    area: "Compras",
    costoUsd: -6700,
    cajaUsd: -11700,
    entregasEnRiesgo: -5,
  },
  {
    approvalId: "approval_customer_reactivation",
    area: "Comercial",
    costoUsd: 1200,
    cajaUsd: 4200,
    entregasEnRiesgo: 0,
  },
  {
    approvalId: "approval_discount_policy",
    area: "Finanzas",
    costoUsd: -900,
    cajaUsd: 600,
    entregasEnRiesgo: 0,
  },
];

export interface DecisionImpact {
  costoUsd: number;
  cajaUsd: number;
  entregasEnRiesgo: number;
}

export function readDecisionImpact(current: MetricCurrent): DecisionImpact {
  return {
    costoUsd: current.simulatedCostUsd ?? IMPACT_BASELINE.costoUsd,
    cajaUsd: current.simulatedCashUsd ?? IMPACT_BASELINE.cajaUsd,
    entregasEnRiesgo: current.deliveriesAtRisk ?? IMPACT_BASELINE.entregasEnRiesgo,
  };
}

export function projectApprovalImpact(
  current: DecisionImpact,
  approvalId: string,
): DecisionImpact | null {
  const delta = APPROVAL_IMPACTS.find((item) => item.approvalId === approvalId);
  if (!delta) return null;
  return {
    costoUsd: current.costoUsd + delta.costoUsd,
    cajaUsd: current.cajaUsd + delta.cajaUsd,
    entregasEnRiesgo: Math.max(0, current.entregasEnRiesgo + delta.entregasEnRiesgo),
  };
}

export function approvalArea(approvalId: string): string | null {
  return APPROVAL_IMPACTS.find((item) => item.approvalId === approvalId)?.area ?? null;
}

export function applyApprovalImpact(
  current: DecisionImpact,
  approvalId: string,
): DecisionImpact {
  return projectApprovalImpact(current, approvalId) ?? current;
}

export function formatSimulatedUsd(value: number): string {
  return `USD ${Math.round(value).toLocaleString("es-AR")} simulado`;
}

export function hoursUntil(dueAt: string, nowIso: string): number {
  const ms = new Date(dueAt).getTime() - new Date(nowIso).getTime();
  return ms / 3_600_000;
}

export function formatHoursUntil(hours: number): string {
  if (hours <= 0) return "Plazo vencido";
  const label = hours.toLocaleString("es-AR", { maximumFractionDigits: 1 });
  return `${label} h para aprobar`;
}

export function causalNodeMap(): Map<string, CausalNode> {
  return new Map(CAUSAL_NODES.map((node) => [node.id, node]));
}

export function flowNodeMap(): Map<string, FlowNode> {
  return new Map(FLOW_NODES.map((node) => [node.id, node]));
}

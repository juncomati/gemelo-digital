import type { DemoState, Priority, ResultStatus, ApprovalStatus, TwinEntityType } from "@/domain/types";

const arsFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatArs(value: number): string {
  return arsFormatter.format(Math.round(value));
}

export function confidenceLabel(value: number): "Alta" | "Media" | "Baja" {
  const pct = value * 100;
  if (pct >= 85) return "Alta";
  if (pct >= 65) return "Media";
  return "Baja";
}

export function confidenceTone(value: number): "high" | "medium" | "low" {
  const label = confidenceLabel(value);
  if (label === "Alta") return "high";
  if (label === "Media") return "medium";
  return "low";
}

export function formatRelativeDate(iso: string, demoNow: string): string {
  const now = new Date(demoNow).getTime();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 60) return `Hace ${Math.max(1, minutes)} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `Hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `Hace ${days} días`;
}

export function formatAbsoluteDate(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(iso));
}

export function freshnessLabel(status: string): string {
  switch (status) {
    case "current":
      return "Actualizado";
    case "review":
      return "A revisar";
    case "stale":
      return "Desactualizado";
    default:
      return "Requiere validación";
  }
}

export function priorityLabel(priority: Priority): string {
  switch (priority) {
    case "critical":
      return "Crítica";
    case "high":
      return "Alta";
    case "medium":
      return "Media";
    default:
      return "Baja";
  }
}

export function resultStatusLabel(status: ResultStatus): string {
  const map: Record<ResultStatus, string> = {
    new: "Nuevo",
    in_review: "En revisión",
    requires_approval: "Requiere aprobación",
    approved: "Aprobado",
    discarded: "Descartado",
    completed: "Completado",
  };
  return map[status];
}

export function approvalStatusLabel(status: ApprovalStatus): string {
  const map: Record<ApprovalStatus, string> = {
    pending: "Pendiente",
    in_review: "En revisión",
    approved: "Aprobada",
    rejected: "Rechazada",
    changes_requested: "Cambios solicitados",
  };
  return map[status];
}

export function twinTypeLabel(type: TwinEntityType): string {
  const map: Record<TwinEntityType, string> = {
    fact: "Hecho verificado",
    hypothesis: "Hipótesis",
    decision: "Decisión",
    process: "Proceso",
    risk: "Riesgo",
    opportunity: "Oportunidad",
    product: "Producto",
    supplier: "Proveedor",
    metric: "Indicador",
  };
  return map[type];
}

export function findUserName(state: DemoState, userId: string): string {
  return state.users.find((u) => u.id === userId)?.name ?? "Sin asignar";
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

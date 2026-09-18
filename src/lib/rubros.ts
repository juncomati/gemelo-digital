import type { RubroId } from "@/domain/types";

const CATEGORY_MAP: Record<string, RubroId[]> = {
  Comercial: ["comercial"],
  Clientes: ["comercial"],
  Operaciones: ["operaciones"],
  Compras: ["operaciones"],
  Finanzas: ["finanzas"],
  Estrategia: ["institucional"],
  "Políticas y procedimientos": ["institucional", "comercial"],
  Personas: ["personas"],
  Productos: ["calidad", "operaciones"],
  Calidad: ["calidad"],
};

const AREA_MAP: Record<string, RubroId[]> = {
  Comercial: ["comercial"],
  Operaciones: ["operaciones"],
  Calidad: ["calidad"],
  "Dirección General": ["institucional"],
  Administración: ["finanzas", "institucional"],
  Finanzas: ["finanzas"],
  Personas: ["personas"],
};

export function rubrosFromCategory(category: string): RubroId[] {
  return CATEGORY_MAP[category] ?? ["institucional"];
}

export function rubrosFromResultArea(area: string): RubroId[] {
  return AREA_MAP[area] ?? ["operaciones"];
}

export function matchesRubroFilter(
  itemRubros: RubroId[] | undefined,
  active: RubroId[],
): boolean {
  if (!active.length) return true;
  if (!itemRubros?.length) return false;
  return itemRubros.some((r) => active.includes(r));
}

export function pymeSolidity(areas: Array<{ health: string }>): {
  healthy: number;
  weak: number;
  missing: number;
  solid: boolean;
} {
  const healthy = areas.filter((a) => a.health === "healthy").length;
  const weak = areas.filter((a) => a.health === "weak").length;
  const missing = areas.filter((a) => a.health === "missing").length;
  return { healthy, weak, missing, solid: missing === 0 && weak <= 2 };
}

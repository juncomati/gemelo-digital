export type ProcessStepId = "arranque" | "fuentes" | "gemelo" | "decisiones" | "semana";

export interface ProcessStep {
  id: ProcessStepId;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  detail: string;
  ritual?: string[];
  cta: { label: string; to: string };
  demoState: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "arranque",
    number: "01",
    title: "Arranque con el cliente",
    shortTitle: "Arranque",
    summary: "Se elige un caso concreto, responsables y el alcance del piloto.",
    detail:
      "En AndesPack el primer caso es el riesgo de quiebre de papel liner. Se acuerdan dueños (Operaciones y Dirección), indicadores a medir y qué queda fuera del piloto.",
    cta: { label: "Ver prioridad actual", to: "/inicio" },
    demoState: "Caso activo en esta demo",
  },
  {
    id: "fuentes",
    number: "02",
    title: "Fuentes y conocimiento",
    shortTitle: "Fuentes",
    summary: "Se conectan fuentes simuladas y se revisa vigencia e inconsistencias.",
    detail:
      "ERP, CRM, Drive y planillas aportan documentos. El sistema distingue lo procesado de lo actualizado y marca políticas contradictorias o fichas por vencer.",
    cta: { label: "Abrir Documentación", to: "/documentacion?vista=atencion" },
    demoState: "12 documentos · 4 fuentes por revisar",
  },
  {
    id: "gemelo",
    number: "03",
    title: "Gemelo vivo",
    shortTitle: "Gemelo",
    summary: "Documentos y hechos se relacionan en un modelo operable de la empresa.",
    detail:
      "Producto, materia prima, proveedor, demanda y riesgo quedan conectados. Hechos e hipótesis se distinguen; los vacíos aparecen como objetivos de conocimiento.",
    cta: { label: "Explorar el Gemelo", to: "/gemelo/entity_product_wine6" },
    demoState: "Nodo focal: Caja Vino x6 Reforzada",
  },
  {
    id: "decisiones",
    number: "04",
    title: "Resultados y control humano",
    shortTitle: "Decisiones",
    summary: "El sistema propone; la empresa aprueba, rechaza o pide cambios.",
    detail:
      "Cada resultado muestra evidencia, confianza e impacto estimado. Las decisiones sensibles pasan por aprobación y quedan registradas sin ejecutar operaciones externas.",
    cta: { label: "Revisar aprobación pendiente", to: "/aprobaciones/approval_purchase_liner" },
    demoState: "Recorrido ejecutivo listo para ensayar",
  },
  {
    id: "semana",
    number: "05",
    title: "Semana a semana",
    shortTitle: "Semana",
    summary: "Un ritual semanal mantiene el Gemelo útil y las decisiones trazables.",
    detail:
      "Cada semana el equipo prioriza en Inicio, decide con evidencia, registra en Actividad, revisa Métricas y ajusta fuentes o vacíos de conocimiento.",
    ritual: [
      "Priorizar situaciones en Inicio",
      "Decidir con evidencia y aprobación",
      "Registrar la decisión en Actividad",
      "Revisar cobertura e impacto en Métricas",
      "Ajustar fuentes y objetivos abiertos",
    ],
    cta: { label: "Ver métricas de la semana", to: "/metricas" },
    demoState: "Ritmo operativo simulado",
  },
];

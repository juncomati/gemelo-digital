# 01 — Product brief

## Nombre de trabajo

**Gemelo Digital Operativo v2**

## Propósito de la demo

La demo debe permitir que un dueño o directivo comprenda, en menos de cinco minutos, que la plataforma:

- concentra el conocimiento disperso de la empresa;
- conecta documentos, procesos, indicadores y decisiones;
- identifica riesgos y oportunidades sin esperar una consulta;
- genera resultados explicables y listos para usar;
- solicita aprobación antes de una decisión sensible;
- registra quién decidió, con qué evidencia y qué cambió.

La experiencia debe sentirse como un producto empresarial terminado, no como un prototipo técnico.

## Propuesta de valor

Gemelo Digital Operativo crea una representación viva del funcionamiento de una empresa. Convierte información fragmentada en contexto verificable para apoyar decisiones, priorizar situaciones relevantes y dar seguimiento al trabajo.

No sustituye al ERP, al CRM ni al equipo. Organiza el conocimiento que hoy se encuentra repartido, lo relaciona con la operación y lo convierte en resultados accionables.

## Público de la demo

- dueños de pymes;
- dirección general;
- responsables de Operaciones, Comercial y Administración;
- potenciales aliados e incubadoras;
- equipo interno de Makers.

## Principios de producto

### Caja negra total

El cliente ve únicamente la plataforma de Makers. La interfaz no revela motores, modelos, proveedores, herramientas, prompts ni procesos internos.

### Lenguaje empresarial

Usar palabras que describen el trabajo del cliente: hallazgo, resultado, evidencia, recomendación, aprobación, proceso, riesgo, oportunidad y actividad del sistema.

### Confianza verificable

Toda recomendación relevante debe mostrar las fuentes utilizadas, su fecha, el nivel de confianza, los supuestos y la información que todavía falta validar.

### Proactividad visible

El sistema prioriza situaciones y propone próximos pasos. La demo no debe depender de un cuadro de chat como experiencia principal.

### Control humano

Las decisiones de impacto requieren una aprobación explícita. Aprobar en la demo modifica el estado local, pero nunca ejecuta una acción externa.

### Una sola historia

Inicio, Gemelo, Resultados, Aprobaciones, Actividad y Métricas deben mostrar el mismo acontecimiento con valores, fechas y responsables consistentes.

## Empresa ficticia

### AndesPack Industrial S.A.

Empresa ficticia de San Juan dedicada a fabricar embalajes de cartón corrugado para bodegas, productores agroindustriales y distribuidores.

| Dato | Valor simulado |
|---|---:|
| Colaboradores | 82 |
| Clientes B2B activos | 126 |
| Líneas de producción | 2 |
| Productos principales | 18 |
| Depósitos | 3 |
| Cobertura comercial | Cuyo y región Centro |

La demo expresa impactos económicos en `USD equivalentes` para mantener la historia estable en el tiempo. Todos los valores son simulados.

## Personas visibles

| Persona | Rol | Interés principal |
|---|---|---|
| Laura Quiroga | Directora general | Riesgos, oportunidades y decisiones |
| Martín Castro | Jefe de Operaciones | Producción, inventario y entregas |
| Sofía Pérez | Responsable Comercial | Clientes, cotizaciones y recuperación |
| Valentina Ruiz | Administradora | Fuentes, usuarios y permisos |

## Historia principal

La demanda prevista del producto **Caja Vino x6 Reforzada** aumentó un 21%. El stock de papel liner alcanza para nueve días y el plazo habitual de reposición es de doce días.

La plataforma:

1. relaciona el pronóstico comercial, las órdenes abiertas, el inventario y el plazo del proveedor;
2. identifica riesgo de quiebre entre el 28 y el 30 de septiembre de 2026;
3. estima USD 18.400 equivalentes de ventas expuestas;
4. recomienda adelantar una orden de compra de 18 toneladas;
5. solicita aprobación de Operaciones;
6. registra la decisión simulada;
7. actualiza la actividad y las métricas de la demo.

## Historias secundarias

- Reactivación potencial de 14 clientes inactivos, con USD 32.000 equivalentes de oportunidad estimada.
- Tres fichas técnicas próximas a vencer.
- Dos entregas con probabilidad de demora.
- Tiempo simulado de preparación de cotizaciones: 5,2 horas de línea base frente a 1,4 horas actuales.
- Dos versiones contradictorias de la política de descuentos.

## Alcance de la primera versión

Incluye:

- ocho secciones navegables;
- filtros y búsqueda local;
- paneles de detalle;
- datos mock centralizados;
- simulación de aprobaciones;
- actividad auditable;
- persistencia en el navegador;
- restablecimiento de la demo;
- diseño responsive para escritorio y tablet;
- estados de carga, vacío, error y permiso.

No incluye:

- autenticación real;
- base de datos;
- carga o procesamiento real de archivos;
- integraciones con sistemas de clientes;
- motor de IA;
- acciones sobre ERP, CRM, correo o compras;
- facturación;
- administración multitenant real;
- despliegue en esta fase.

## Éxito de la demo

La demo cumple su propósito cuando una persona no técnica puede:

1. identificar el riesgo principal desde Inicio;
2. revisar el resultado y sus evidencias;
3. aprobar o rechazar la recomendación;
4. ver la decisión reflejada en Actividad y Métricas;
5. comprender el valor sin recibir una explicación de la tecnología interna.


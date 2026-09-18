# Cursor — Empezar aquí

## Objetivo

Construir una demo local, navegable y visualmente terminada de **Gemelo Digital Operativo v2**. La demo debe funcionar con datos sintéticos, sin servicios externos, y contar una historia empresarial coherente de principio a fin.

## Lectura obligatoria antes de programar

Leer en este orden:

1. `README.md`
2. `docs/01_PRODUCT_BRIEF.md`
3. `docs/02_INFORMATION_ARCHITECTURE.md`
4. `docs/03_SCREEN_SPECIFICATIONS.md`
5. `docs/04_USER_FLOWS.md`
6. `docs/05_DESIGN_SYSTEM.md`
7. `docs/06_MOCK_DATA_MODEL.md`
8. `docs/07_TECHNICAL_ARCHITECTURE.md`
9. `docs/08_IMPLEMENTATION_PLAN.md`
10. `docs/09_ACCEPTANCE_CRITERIA.md`
11. `mock-data/canonical-scenario.json`

Si existe una contradicción, aplicar este orden de prioridad:

1. criterios de aceptación;
2. arquitectura técnica;
3. especificación de pantallas;
4. sistema visual;
5. resto de la documentación.

## Reglas no negociables

- No conectar APIs, modelos, agentes, hosting ni servicios de terceros.
- No crear autenticación que pueda confundirse con seguridad real.
- No usar datos de clientes ni archivos reales.
- No mostrar en la interfaz ni en el bundle público los términos prohibidos definidos en la documentación.
- No hardcodear métricas por pantalla. Todo debe salir de un repositorio mock central.
- Mantener `tenantId` en las entidades aunque la demo muestre una sola empresa.
- Toda acción simulada debe aclarar que no produjo una operación externa.
- Mantener visible la insignia `Demo · Datos simulados`.
- No crear todavía repositorio remoto ni desplegar en Hostinger.

## Primer encargo recomendado para Cursor

Copiar este texto en Cursor:

> Leé todos los documentos indicados en `CURSOR_START_HERE.md`. Prepará un plan breve y luego implementá solamente el Hito 1 de `docs/08_IMPLEMENTATION_PLAN.md`: estructura base React + TypeScript + Vite, sistema visual, shell responsive, navegación de ocho secciones y repositorio mock tipado cargado desde `mock-data/canonical-scenario.json`. No implementes todavía las pantallas completas, no crees repositorio remoto y no despliegues. Al terminar, ejecutá las verificaciones disponibles y documentá cualquier decisión que se aparte de las especificaciones.

## Orden de hitos

1. Base técnica, navegación y tokens visuales.
2. Datos canónicos y estado local.
3. Circuito Inicio → Resultado → Aprobación → Actividad.
4. Documentación y Gemelo.
5. Métricas y Configuración.
6. Estados alternativos, accesibilidad y responsive.
7. Revisión comercial completa.
8. Repositorio privado y Hostinger, solo después de aprobación expresa.

## Salida esperada en cada hito

- resumen de cambios;
- decisiones tomadas;
- comandos de validación ejecutados;
- capturas o URL local cuando corresponda;
- lista corta de pendientes;
- confirmación de que no hubo despliegues ni conexiones externas.


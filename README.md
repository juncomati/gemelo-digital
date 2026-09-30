# CAUCE — Paquete de demo

**CAUCE.** El sistema de IA que entiende tu negocio y ordena tus decisiones.

Este directorio contiene la definición funcional, visual y técnica para que Cursor construya una demo navegable de **CAUCE** con datos completamente simulados.

La demo tiene un objetivo comercial: permitir que un prospecto comprenda el producto en menos de cinco minutos y vea un recorrido coherente desde una señal operativa hasta una decisión aprobada y trazable.

## Estado del proyecto

| Elemento | Estado |
|---|---|
| Alcance de la demo | Definido |
| Arquitectura de información | Definida |
| Especificación de pantallas | Definida |
| Sistema visual | Definido |
| Escenario y datos canónicos | Definidos |
| Arquitectura técnica | Definida |
| Implementación local (hitos 1–7) | Lista para revisión |
| Repositorio remoto | Pendiente de aprobación expresa |
| Despliegue en Hostinger | Pendiente de aprobación expresa |

## Cómo correr la demo local

Requisito: Node 22+. En esta máquina se usó un Node portable en `C:\Users\Matias\.gemelo-tools\node`.

```bash
npm install
npm run dev
```

Abrir `http://127.0.0.1:5173`.

Validación:

```bash
npm run check
npm run test:e2e
```


## Decisiones confirmadas

- La primera versión será una SPA estática construida con React, TypeScript y Vite.
- No tendrá backend, base de datos, autenticación real ni integraciones reales.
- Todos los datos serán ficticios y la interfaz mostrará siempre `Demo · Datos simulados`.
- El cliente verá únicamente la plataforma de Makers.
- La interfaz nunca nombrará motores, modelos, agentes, proveedores ni herramientas internas.
- Toda recomendación importante mostrará evidencia, confianza, vigencia y responsable.
- Las acciones sensibles se simularán mediante aprobaciones y nunca ejecutarán operaciones externas.
- La demo se validará localmente antes de crear el repositorio remoto o configurar Hostinger.

## Índice

1. [CURSOR_START_HERE.md](CURSOR_START_HERE.md) — instrucciones de inicio y prompt recomendado para Cursor.
2. [01_PRODUCT_BRIEF.md](docs/01_PRODUCT_BRIEF.md) — propósito, alcance, empresa ficticia y narrativa.
3. [02_INFORMATION_ARCHITECTURE.md](docs/02_INFORMATION_ARCHITECTURE.md) — navegación, rutas, taxonomías y terminología.
4. [03_SCREEN_SPECIFICATIONS.md](docs/03_SCREEN_SPECIFICATIONS.md) — especificación de las ocho secciones.
5. [04_USER_FLOWS.md](docs/04_USER_FLOWS.md) — recorridos de demostración.
6. [05_DESIGN_SYSTEM.md](docs/05_DESIGN_SYSTEM.md) — identidad visual, componentes y accesibilidad.
7. [06_MOCK_DATA_MODEL.md](docs/06_MOCK_DATA_MODEL.md) — entidades, relaciones y reglas de consistencia.
8. [07_TECHNICAL_ARCHITECTURE.md](docs/07_TECHNICAL_ARCHITECTURE.md) — stack y límites técnicos.
9. [08_IMPLEMENTATION_PLAN.md](docs/08_IMPLEMENTATION_PLAN.md) — hitos de construcción en Cursor.
10. [09_ACCEPTANCE_CRITERIA.md](docs/09_ACCEPTANCE_CRITERIA.md) — condiciones verificables de aprobación.
11. [10_REPOSITORY_AND_HOSTINGER.md](docs/10_REPOSITORY_AND_HOSTINGER.md) — flujo posterior de GitHub y despliegue.
12. [11_COMMERCIAL_PRESENTATION_SCRIPT.md](docs/11_COMMERCIAL_PRESENTATION_SCRIPT.md) — fuente narrativa de la presentación de diez diapositivas.
13. [canonical-scenario.json](mock-data/canonical-scenario.json) — escenario principal y registros relacionados.

## Forma de trabajo recomendada

1. Abrir este directorio como proyecto en Cursor.
2. Pedirle que lea `CURSOR_START_HERE.md` y todos los documentos enlazados.
3. Implementar un hito por vez.
4. Validar el recorrido principal antes de ampliar módulos secundarios.
5. Crear el repositorio privado recién cuando la demo local haya sido aceptada.
6. Conectar Hostinger al repositorio, sin editar archivos directamente en producción.

## Recorrido prioritario

```text
Inicio
  → Resultado: riesgo de quiebre de papel liner
  → Evidencias y recomendación
  → Aprobación simulada
  → Actividad registrada
  → Métricas actualizadas
```

## Propiedad y confidencialidad

Este paquete es documentación interna de Makers. Puede nombrar componentes técnicos para orientar al equipo, pero el producto visible, la presentación comercial y cualquier material entregado al cliente deben respetar el enfoque de caja negra.


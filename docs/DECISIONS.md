# Decisiones de implementación

## 2026-09-18 — Rubros, Gemelo por áreas, Consultor y Novedades

- **Decisión:** Filtro global por rubro (opción A); 12 áreas mínimas pyme con semáforo; dolores/acciones en Proceso; Consultor con respuestas mock (pedido comercial “Consultor IA”, etiqueta UI “Consultor”); Novedades sectoriales simuladas; extensión en `pyme-extension.json`.
- **Motivo:** Segmentar cobertura desigual, mostrar solidez operativa y ayudar a decidir sin backend.
- **Alternativas descartadas:** LLM real; filtro solo en Documentación; mapa de áreas no interactivo.
- **Impacto:** Nav ampliada; semilla `2026.09.18-2`; persistencia de posiciones y chat en localStorage.
- **Documentos afectados:** IA, screen specs, DECISIONS, reglas Cursor.

## 2026-09-18 — Visual premium y sección Proceso

- **Decisión:** Tipografías IBM Plex Sans/Serif empaquetadas; tokens de superficie/borde ampliados; sección navegable `/proceso` más resumen en Inicio (opción C).
- **Motivo:** Elevar el acabado frente a un dashboard genérico y hacer explícito el arco cliente → semana a semana.
- **Alternativas descartadas:** Solo overlay en Inicio; tipografías remotas por CDN; rediseño oscuro/neón.
- **Impacto:** Menú pasa a 9 ítems; IA y design system actualizados; E2E cubre Proceso. `lint:brand` ignora assets binarios (woff/woff2) para evitar falsos positivos.
- **Documentos afectados:** `02_INFORMATION_ARCHITECTURE.md`, `05_DESIGN_SYSTEM.md`, `03_SCREEN_SPECIFICATIONS.md` (referencia de Proceso).

## 2026-09-18 — Node portable local

- **Decisión:** Usar Node 22 portable en `C:\Users\Matias\.gemelo-tools\node` porque no había Node/npm en PATH.
- **Motivo:** Permitir `npm install`, build y tests sin instalar un paquete de sistema.
- **Alternativas descartadas:** winget (bloqueado inicialmente), Node embebido de Cursor (sin npm).
- **Impacto:** Los scripts locales deben anteponer esa ruta al PATH en la sesión.
- **Documentos afectados:** ninguno de producto; entorno de desarrollo.

## 2026-09-18 — Scaffold manual en el paquete de docs

- **Decisión:** Crear la SPA en la raíz del paquete documental (no en subcarpeta).
- **Motivo:** `create-vite` canceló por directorio no vacío; el paquete ya contiene `docs/` y `mock-data/`.
- **Alternativas descartadas:** subcarpeta `gemelo-digital-demo/`.
- **Impacto:** `package.json`, `src/` y scripts conviven con la documentación.
- **Documentos afectados:** `README.md`, `07_TECHNICAL_ARCHITECTURE.md` (estructura lógica equivalente).

## 2026-09-18 — Persistencia y transición única

- **Decisión:** Clave `makers.gemelo-demo.v1` y función `resolveApproval` atómica.
- **Motivo:** Cumplir criterios de consistencia entre Resultado, Aprobación, Actividad e Inicio/Métricas.
- **Alternativas descartadas:** stores globales separados por módulo.
- **Impacto:** Restablecer limpia localStorage y recarga la semilla.
- **Documentos afectados:** `06_MOCK_DATA_MODEL.md`, `09_ACCEPTANCE_CRITERIA.md`.

## 2026-09-18 — Chequeo de marca para "Cursor"

- **Decisión:** El término `Cursor` se valida con C mayúscula; no se bloquea `cursor` en minúscula.
- **Motivo:** El bundle incluye CSS (`cursor:pointer`) y APIs de gráficos (`cursor` en Recharts).
- **Alternativas descartadas:** bloquear cualquier substring `cursor` (falsos positivos en `dist`).
- **Impacto:** Sigue detectando la marca del producto de desarrollo si aparece en UI o bundle.
- **Documentos afectados:** `02_INFORMATION_ARCHITECTURE.md`, `scripts/check-forbidden-brands.mjs`.


- **Decisión:** No crear repositorio remoto ni Hostinger en esta fase.
- **Motivo:** Requiere aprobación expresa según `CURSOR_START_HERE.md` y `10_REPOSITORY_AND_HOSTINGER.md`.
- **Alternativas descartadas:** publicación anticipada.
- **Impacto:** Entrega local lista para revisión comercial.
- **Documentos afectados:** `08_IMPLEMENTATION_PLAN.md`, `10_REPOSITORY_AND_HOSTINGER.md`.

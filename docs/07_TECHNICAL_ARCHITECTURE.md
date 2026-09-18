# 07 — Arquitectura técnica

## Decisión

La primera demo será una SPA frontend-only.

### Stack

- React
- TypeScript estricto
- Vite
- React Router
- Tailwind CSS
- componentes accesibles basados en Radix o shadcn/ui
- Lucide para iconos
- Recharts para gráficos
- Zod para validar datos
- repositorios mock locales, con MSW opcional
- Vitest y Testing Library
- Playwright para el recorrido principal
- npm
- Node 22.x

No usar Next.js, backend, base de datos, autenticación real ni servicios externos en esta etapa.

## Arquitectura lógica

```text
Navegador
  └── React / Vite
      ├── shell y rutas
      ├── módulos de producto
      ├── casos de uso
      ├── contratos de repositorio
      │   └── MockRepository
      │       ├── semilla JSON
      │       ├── latencia opcional
      │       └── errores simulados
      └── estado local versionado
          └── localStorage
```

## Estructura objetivo

```text
gemelo-digital-demo/
├── .cursor/rules/
├── .github/workflows/
├── docs/
├── public/
├── scripts/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── charts/
│   │   └── domain/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── documents/
│   │   ├── twin/
│   │   ├── results/
│   │   ├── approvals/
│   │   ├── activity/
│   │   ├── metrics/
│   │   └── settings/
│   ├── mocks/
│   │   ├── data/
│   │   ├── handlers.ts
│   │   └── scenarios.ts
│   ├── repositories/
│   │   ├── contracts/
│   │   └── mock/
│   ├── domain/
│   ├── lib/
│   ├── types/
│   └── styles/
├── tests/
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Capa de repositorios

Las pantallas no importan JSON directamente. Consumen contratos:

```ts
interface ResultsRepository {
  list(filters?: ResultFilters): Promise<Result[]>;
  getById(id: string): Promise<Result | null>;
  updateStatus(id: string, status: ResultStatus): Promise<Result>;
}
```

La primera implementación es local. Una implementación futura podrá llamar a la API de Makers sin cambiar los componentes de presentación.

## Estado

Separar:

- estado de servidor simulado: repositorios y caché;
- estado de interfaz: filtros, paneles y selección;
- estado persistente de demo: decisiones, comentarios y preferencias.

Puede usarse TanStack Query para uniformar el acceso asíncrono. Evitar un store global único para todo.

## Latencia y errores

La latencia simulada puede activarse en desarrollo. Valor recomendado: 250–900 ms.

Los errores se habilitan mediante un selector solo disponible en modo desarrollo. No mostrar controles de prueba en el build comercial.

## Variables públicas

```dotenv
VITE_APP_NAME=Gemelo Digital Operativo
VITE_DEMO_MODE=true
VITE_DEFAULT_TENANT_ID=tenant_andespack
VITE_ENABLE_FAKE_LATENCY=true
VITE_MOCK_MIN_DELAY_MS=250
VITE_MOCK_MAX_DELAY_MS=900
VITE_ENABLE_TENANT_SWITCHER=false
VITE_BUILD_SHA=local
```

Todas las variables `VITE_*` son públicas. Nunca contienen credenciales, tokens o secretos.

## Scripts esperados

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:brand": "node scripts/check-forbidden-brands.mjs",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "seed:validate": "node scripts/validate-seeds.mjs",
    "format:check": "prettier --check .",
    "check": "npm run lint && npm run lint:brand && npm run typecheck && npm run seed:validate && npm run test && npm run build"
  }
}
```

## Caja negra en el código público

- Revisar texto visible, comentarios enviados al bundle, nombres de fixtures y metadatos públicos.
- Crear `scripts/check-forbidden-brands.mjs` para inspeccionar `src`, `public` y `dist`.
- Permitir documentación interna fuera del bundle.
- No realizar llamadas directas desde el navegador a motores internos.

## Arquitectura futura

La evolución productiva deberá mantener esta frontera:

```text
Plataforma del cliente
  → API de Makers
  → cola y orquestador
  → adaptador privado por tenant
  → perímetro operativo dedicado
  → sistemas autorizados
```

La demo no depende de una integración externa específica. Las capacidades oficiales actuales del motor previsto no publican una API operativa general para iniciar y consultar trabajos arbitrarios, por lo que la integración productiva debe permanecer detrás de un adaptador y validarse mediante un POC antes de comprometer automatización o SLA.

## Multitenancy futura

- Toda entidad mantiene `tenantId`.
- El navegador nunca decide el tenant autorizado.
- La API futura resuelve tenant desde la sesión.
- La capa de datos aplica aislamiento obligatorio.
- Cada empresa mantiene un perímetro operativo dedicado.
- No se comparten sesiones, documentos o credenciales entre empresas.

## Seguridad de la demo

- Solo datos ficticios.
- Sin datos personales reales.
- Sin claves.
- `robots.txt` y meta `noindex,nofollow` al publicar.
- Repositorio privado.
- No presentar un login visual como mecanismo de protección.
- Si el enlace requiere restricción, usar protección real del hosting.
- No guardar el contenido de archivos seleccionados en la simulación de carga.

## Rendimiento

- Carga diferida por ruta.
- Dependencias visuales controladas.
- Imágenes optimizadas y locales.
- Sin fuentes externas.
- Evitar renders completos del mapa ante cambios menores.
- Objetivo orientativo: navegación fluida en notebook empresarial estándar.


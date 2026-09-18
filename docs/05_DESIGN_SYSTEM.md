# 05 — Sistema de diseño

## Dirección visual

La demo debe sentirse como un producto B2B premium, sobrio y confiable. La tecnología se expresa mediante orden, trazabilidad y precisión, no mediante robots, cerebros luminosos o efectos futuristas.

## Tema

La aplicación usa un tema claro para facilitar la lectura durante reuniones y demostraciones.

### Colores

| Token | Valor | Uso |
|---|---|---|
| `--navy-950` | `#071825` | barra lateral, fondos oscuros |
| `--navy-800` | `#0E2A3A` | encabezados y navegación activa |
| `--petrol-700` | `#12506A` | acciones principales |
| `--cyan-500` | `#19B5D1` | conocimiento y relaciones |
| `--teal-500` | `#22B8A7` | confianza alta |
| `--surface-50` | `#EEF2F6` | fondo general con atmósfera |
| `--surface-0` | `#FFFFFF` | tarjetas y paneles |
| `--border-100` | `#E8EEF3` | bordes sutiles |
| `--border-200` | `#D0DAE4` | bordes estándar |
| `--border-300` | `#B3C0CD` | bordes fuertes |
| `--text-900` | `#15202B` | texto principal |
| `--text-700` | `#3D4B5A` | texto intermedio |
| `--text-600` | `#5C6B7A` | texto secundario |
| `--green-600` | `#16875B` | aprobado y saludable |
| `--amber-500` | `#E7A11A` | atención |
| `--red-600` | `#C93C43` | riesgo crítico y rechazo |

El color rojo queda reservado para riesgo real dentro de la demo. No usarlo como decoración.

## Tipografía

Fuentes empaquetadas localmente (sin CDN):

```css
--font-sans: "IBM Plex Sans", "Segoe UI", Arial, sans-serif;
--font-display: "IBM Plex Serif", "Cambria", "Times New Roman", serif;
```

Los títulos de página y sección usan la familia display. El cuerpo usa la sans.

| Nivel | Tamaño orientativo | Peso | Familia |
|---|---:|---:|---|
| Título de página | 28–32 px | 600–700 | display |
| Título de sección | 20–24 px | 600 | display |
| Título de tarjeta | 16–18 px | 600 | sans |
| Texto base | 15–16 px | 400 | sans |
| Etiqueta | 12–13 px | 550–600 | sans |

No cargar fuentes remotas.

## Espaciado y forma

- Escala base: 4 px.
- Espaciado habitual: 8, 12, 16, 24, 32 y 48 px.
- Radio de tarjetas: 12 px.
- Radio de controles: 8 px.
- Sombra de tarjetas: discreta y visible solo sobre el fondo general.
- Bordes de 1 px para separar información sin recargar.
- Ancho máximo de contenido: 1600 px.

## Shell

### Escritorio

- barra lateral de 248 px;
- barra superior de 64 px;
- área de contenido con 24–32 px de margen;
- panel lateral de detalle de 420–520 px.

### Tablet

- barra lateral colapsable;
- tablas con columnas prioritarias y detalle expandible;
- panel lateral puede ocupar toda la vista.

### Móvil

No es el dispositivo principal, pero las rutas deben seguir siendo utilizables desde 360 px. La visualización del mapa cambia automáticamente a Explorador.

## Componentes

### Insignia de demo

Texto exacto: `Demo · Datos simulados`.

Siempre visible en la barra superior. Tooltip:

> Esta experiencia utiliza información ficticia y no ejecuta acciones externas.

### Tarjeta de prioridad

Contiene severidad, título, síntesis, impacto, confianza, vencimiento, responsable y acción principal.

### Chip de estado

Incluye icono y texto. Nunca depender solo del color.

### Indicador de confianza

Combina porcentaje, etiqueta Alta/Media/Baja y ayuda contextual.

### Indicador de vigencia

Muestra fecha relativa y estado. Al pasar el cursor, muestra fecha absoluta.

### Panel de evidencia

Debe poder abrirse desde Resultado, Gemelo y Aprobación sin perder contexto.

### Tabla

- encabezado fijo;
- ordenamiento visible;
- filtros claros;
- paginación local o virtualización cuando corresponda;
- foco de teclado y etiquetas accesibles.

### Timeline

Fecha, actor, acción, entidad, consecuencia y acceso al detalle.

### Modal de confirmación

Explica la consecuencia simulada. El botón primario repite el verbo de la acción.

### Toast

Confirma acciones breves. No reemplaza información importante ni errores que requieren decisión.

## Gráficos

- Mostrar siempre unidad y período.
- Ofrecer valores textuales equivalentes.
- Evitar gráficos decorativos.
- No usar 3D.
- No usar más de seis colores por gráfico.
- Marcar `Estimado` cuando corresponda.

## Mapa del Gemelo

- Mostrar entre 8 y 16 nodos en la vista inicial.
- Nodo focal destacado.
- Relaciones con etiqueta breve.
- Leyenda persistente para hecho, hipótesis, decisión, riesgo y oportunidad.
- Panel Explorador como alternativa accesible.

## Motion

- Transiciones de 120–200 ms.
- Respetar `prefers-reduced-motion`.
- No animar cifras de manera que dificulte compararlas.
- La latencia ficticia se representa con skeletons, no con esperas largas.

## Accesibilidad

- Contraste WCAG AA.
- Foco de teclado visible.
- Orden lógico de tabulación.
- Iconos con nombre accesible.
- Texto base mínimo de 14 px, preferentemente 16 px.
- Botones con área mínima aproximada de 40 × 40 px.
- Estados comunicados por icono y texto.
- Gráficos acompañados de resumen textual.

## Evitar

- gradientes intensos;
- neón;
- glassmorphism excesivo;
- robots o avatares de IA;
- fondos con redes digitales genéricas;
- demasiadas tarjetas del mismo peso visual;
- lenguaje técnico en controles visibles;
- párrafos largos dentro de dashboards.


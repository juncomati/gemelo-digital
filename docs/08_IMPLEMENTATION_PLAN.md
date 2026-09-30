# 08 — Plan de implementación

## Criterio de trabajo

Cursor debe implementar un hito por vez. Cada hito termina con verificación local y un resumen de decisiones. No se crea repositorio remoto ni se despliega hasta aprobar la experiencia completa.

## Hito 1 — Base técnica y shell

### Alcance

- Scaffold React + TypeScript + Vite.
- Configuración estricta de TypeScript, ESLint y Prettier.
- Tailwind y tokens visuales.
- Layout responsive con barra lateral y superior.
- Ocho rutas principales.
- Página 404 dentro del shell.
- Insignia `Demo · Datos simulados`.
- Carga validada de la semilla JSON.

### Demostración

Todas las rutas abren una pantalla provisional consistente y la navegación funciona con teclado.

## Hito 2 — Dominio y estado local

### Alcance

- Tipos de dominio.
- Esquemas Zod.
- Contratos de repositorio.
- `MockRepository`.
- Estado persistente versionado.
- Acción Restablecer demo.
- Latencia y errores opcionales en desarrollo.
- Script de términos prohibidos.

### Demostración

Modificar un registro, recargar y restablecer el estado.

## Hito 3 — Circuito de valor

### Alcance

- Inicio completo.
- Lista y detalle de Resultados.
- Bandeja y detalle de Aprobaciones.
- Actividad.
- Panel de evidencia.
- Transición Aprobar, Rechazar y Solicitar cambios.

### Demostración

Recorrido Inicio → Resultado → Aprobación → Actividad, con propagación de estado.

## Hito 4 — Documentación y CAUCE

### Alcance

- Biblioteca con filtros.
- Detalle de documento.
- Simulación de carga.
- Mapa simplificado.
- Explorador accesible.
- Detalle de entidad.
- Objetivos de conocimiento.

### Demostración

Recorrido Documento → Evidencia → Entidad → Riesgo → Resultado.

## Hito 5 — Métricas y Configuración

### Alcance

- Métricas con 30 y 90 días.
- Metodología y etiquetas de estimación.
- Configuración editable.
- Fuentes simuladas.
- Preferencias persistentes.

### Demostración

Mostrar cambio de métricas luego de una aprobación y persistencia de preferencias.

## Hito 6 — Estados alternativos y accesibilidad

### Alcance

- Carga, vacío, error, permiso y fuente desconectada.
- Navegación completa por teclado.
- Contraste y nombres accesibles.
- `prefers-reduced-motion`.
- Responsive 1440, 1280, 1024, 768 y 360 px.
- Revisión del Explorador como alternativa al mapa.

## Hito 7 — Revisión comercial

### Alcance

- Ensayo de recorrido menor a cinco minutos.
- Eliminación de texto técnico.
- Verificación de números entre módulos.
- Optimización de imágenes y bundle.
- `npm run check`.
- Playwright del recorrido principal.
- Capturas finales de las ocho secciones.

## Hito 8 — Repositorio y hosting

Este hito requiere aprobación expresa.

- Crear repositorio privado.
- Configurar CI.
- Subir `main`.
- Crear sitio en Hostinger.
- Configurar build y dominio.
- Aplicar noindex y protección si corresponde.
- Ejecutar smoke test en producción.

## Orden interno de pantallas

1. Shell.
2. Inicio.
3. Resultados.
4. Aprobaciones.
5. Actividad.
6. Documentación.
7. CAUCE.
8. Métricas.
9. Configuración.

## Registro de decisiones

Crear `docs/DECISIONS.md` durante la implementación. Cada entrada debe incluir:

- fecha;
- decisión;
- motivo;
- alternativas descartadas;
- impacto;
- documentos afectados.

## Regla de alcance

Si Cursor propone una función no definida, debe registrarla como pendiente. No debe implementarla automáticamente salvo que sea necesaria para un criterio de aceptación.


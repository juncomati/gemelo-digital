# 09 — Criterios de aceptación

## Criterios globales

La demo puede presentarse cuando:

1. Las ocho secciones funcionan sin enlaces rotos.
2. La historia del papel liner es consistente de extremo a extremo.
3. La interfaz y el bundle público no revelan herramientas o proveedores internos.
4. `Demo · Datos simulados` permanece visible.
5. Todos los datos provienen de un repositorio mock central.
6. Los filtros, búsquedas y paneles funcionan.
7. Aprobar o rechazar actualiza Resultado, Aprobación, Actividad, Inicio y Métricas.
8. Restablecer devuelve exactamente el estado inicial.
9. La experiencia funciona a 1440, 1280 y 1024 px.
10. Las rutas principales siguen siendo utilizables a 768 y 360 px.
11. No hay errores visibles en consola durante el recorrido principal.
12. Los números coinciden entre módulos.
13. La demo puede explicarse sin lenguaje técnico.
14. El recorrido ejecutivo tarda menos de cinco minutos.
15. Cada recomendación importante expone evidencia, confianza y vigencia.

## Datos

- La semilla pasa validación Zod.
- No existen relaciones a IDs ausentes.
- Confianza se encuentra entre 0 y 1.
- Fechas se interpretan en `America/Argentina/Buenos_Aires`.
- Impactos económicos incluyen `estimado` o `equivalentes`.
- Los valores del caso principal coinciden en todos los archivos.
- El estado persistente incluye versión de esquema.

## Caja negra

El chequeo automático debe fallar si `src`, `public` o `dist` contienen términos prohibidos, ignorando únicamente archivos de prueba explícitamente autorizados.

Además, revisar manualmente:

- textos alternativos;
- títulos del navegador;
- metadatos;
- mensajes de error;
- nombres de archivos públicos;
- source maps, si se publican;
- comentarios visibles en el bundle.

## Inicio

- La prioridad principal abre el resultado correcto.
- Los contadores enlazan filtros correctos.
- La jerarquía visual destaca una sola situación principal.
- Actividad y métricas usan datos actuales.

## Documentación

- Buscar `descuentos` encuentra la inconsistencia.
- Los filtros se combinan y restablecen.
- El detalle enlaza entidades y resultados.
- La carga simulada no lee ni sube contenido.

## Gemelo

- Mapa y Explorador muestran las mismas entidades clave.
- El nodo focal se selecciona correctamente.
- Hechos e hipótesis se distinguen sin depender del color.
- El panel de evidencia abre desde un nodo relacionado.

## Resultados

- Los siete resultados abren detalle.
- El riesgo principal muestra al menos tres evidencias.
- El impacto aparece como estimación.
- La aprobación vinculada abre directamente.

## Aprobaciones

- Aprobar requiere confirmación.
- Rechazar y Solicitar cambios requieren comentario.
- La transición se refleja inmediatamente.
- El mensaje final aclara que no hubo ejecución externa.

## Actividad

- Los eventos se filtran y ordenan.
- La aprobación simulada genera un evento.
- Cuando cambia un estado se muestra antes y después.
- Los eventos enlazan el objeto correcto.

## Métricas

- Cada gráfico muestra período y unidad.
- Existe resumen textual equivalente.
- 30 y 90 días actualizan el contenido.
- Las estimaciones están identificadas.

## Configuración

- Guardar persiste localmente.
- Desconectar requiere confirmación.
- El entorno se describe como dedicado y aislado.
- No se muestran controles de infraestructura interna.

## Accesibilidad

- El recorrido principal se completa con teclado.
- No hay trampas de foco.
- Modales devuelven foco al control de origen.
- Contraste AA.
- Iconos interactivos tienen nombre accesible.
- Gráficos tienen descripción y datos equivalentes.
- El mapa tiene alternativa de lista.

## Pruebas mínimas

### Unitarias

- validación de semilla;
- derivación de indicadores;
- transición de aprobación;
- restablecimiento;
- filtros y formato.

### Integración

- Inicio abre resultado;
- resultado abre evidencia y aprobación;
- aprobación actualiza actividad;
- persistencia sobrevive recarga.

### E2E

```text
Abrir Inicio
Abrir riesgo principal
Revisar evidencia
Abrir aprobación
Aprobar
Confirmar mensaje de simulación
Abrir Actividad
Confirmar evento
Abrir Métricas
Confirmar actualización
Restablecer demo
Confirmar estado inicial
```

## Comandos de entrega

La entrega local requiere que finalicen correctamente:

```bash
npm run lint
npm run lint:brand
npm run typecheck
npm run seed:validate
npm run test
npm run build
npm run test:e2e
```


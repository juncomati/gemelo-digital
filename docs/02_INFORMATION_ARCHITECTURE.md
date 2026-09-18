# 02 — Arquitectura de información

## Navegación principal

La barra lateral es persistente y contiene:

1. Inicio
2. Proceso
3. Documentación
4. Gemelo
5. Resultados
6. Aprobaciones
7. Actividad
8. Métricas
9. Consultor
10. Novedades
11. Configuración

Filtro global de **rubros** (Comercial, Operaciones, Finanzas, Institucional, Personas, Calidad) en la barra superior; vacío = todos.

En el pie de la barra lateral se muestran:

- AndesPack Industrial S.A.;
- entorno `Demo`;
- usuario y rol;
- ayuda;
- acción `Restablecer demo`.

No debe existir un selector de empresa en la experiencia del cliente. La separación multitenant es una propiedad técnica, no una opción visible para recorrer otros entornos.

## Barra superior

Elementos permanentes:

- título y descripción breve de la página;
- buscador global;
- indicador de última actualización;
- notificaciones;
- avatar del usuario;
- insignia `Demo · Datos simulados`.

El selector de período aparece solamente donde modifica información: Inicio, Actividad y Métricas.

## Rutas

```text
/
/inicio
/proceso
/documentacion
/documentacion/:documentoId
/gemelo
/gemelo/:entidadId
/resultados
/resultados/:resultadoId
/aprobaciones
/aprobaciones/:aprobacionId
/actividad
/metricas
/consultor
/novedades
/configuracion
```

`/proceso` admite anclas `#arranque`, `#fuentes`, `#gemelo`, `#decisiones`, `#semana`, `#dolores` y `#acciones`.
`/gemelo?area=` abre el modal de un área mínima pyme.

`/` redirige a `/inicio`. Las rutas de detalle pueden implementarse como página o panel lateral, pero deben admitir enlace directo y botón Atrás.

## Búsqueda global

La búsqueda encuentra y agrupa:

- documentos;
- productos;
- clientes;
- proveedores;
- procesos;
- resultados;
- decisiones.

Cada coincidencia indica tipo, contexto y destino. Atajo sugerido: `Ctrl/Cmd + K`.

## Taxonomía de conocimiento

- Hecho verificado
- Hipótesis
- Decisión
- Regla
- Proceso
- Riesgo
- Oportunidad
- Objetivo de conocimiento

Hechos e hipótesis siempre se distinguen mediante etiqueta e icono. El color por sí solo no es suficiente.

## Niveles de confianza

| Rango | Etiqueta | Uso visual |
|---|---|---|
| 85–100% | Alta | Verde o turquesa |
| 65–84% | Media | Ámbar |
| Menor a 65% | Baja | Rojo |

Tooltip obligatorio:

> La confianza combina calidad, cantidad, consistencia y actualidad de las evidencias disponibles.

La confianza no debe describirse como probabilidad matemática ni garantía.

## Vigencia

| Antigüedad | Estado |
|---|---|
| Menos de 30 días | Actualizada |
| 30 a 90 días | A revisar |
| Más de 90 días | Desactualizada |
| Sin fecha | Requiere validación |

## Estados de resultados

- Nuevo
- En revisión
- Requiere aprobación
- Aprobado
- Descartado
- Completado
- Vencido

## Estados de aprobaciones

- Pendiente
- En revisión
- Aprobada
- Rechazada
- Cambios solicitados
- Vencida

## Panel de evidencia

Toda recomendación relevante abre un panel con:

- conclusión;
- nivel de confianza;
- fuentes utilizadas;
- fragmento o dato relevante;
- fecha de cada evidencia;
- relaciones consideradas;
- información faltante;
- responsable sugerido.

## Terminología visible

| Evitar | Usar |
|---|---|
| El agente ejecutó | El sistema procesó |
| Prompt | Instrucción operativa |
| Respuesta del modelo | Resultado |
| Memoria del agente | Conocimiento de la empresa |
| Razonamiento interno | Evidencias consideradas |
| Workflow técnico | Flujo de trabajo |
| Score | Indicador o nivel |

## Términos prohibidos en la interfaz y el bundle público

- Grok
- Grok Bot
- xAI
- Cursor
- LLM
- token
- prompt
- agente
- sesión de modelo
- máquina virtual
- proveedor técnico

El control automático de marca debe buscar variantes en mayúsculas y minúsculas. La documentación interna puede explicar la arquitectura futura, pero el código entregado al navegador no debe incluir estos términos.

## Estados comunes

### Carga

Usar skeletons con la forma aproximada del contenido. Evitar un único spinner para toda la página.

### Vacío

> Todavía no hay resultados con estos criterios. Modificá los filtros o restablecé la vista.

### Sin coincidencias

> No encontramos elementos para esta búsqueda. Probá con otro término.

### Error recuperable

> No pudimos cargar esta sección. Tus datos no se modificaron.

Acciones: `Reintentar` y `Volver a Inicio`.

### Sin permiso

> Tu rol permite consultar este contenido, pero no modificarlo.

### Acción completada

> Acción registrada en la demo. No se ejecutó ninguna operación externa.


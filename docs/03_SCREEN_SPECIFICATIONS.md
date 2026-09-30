# 03 — Especificación de pantallas

## 1. Inicio

### Objetivo

Responder al ingresar:

- cómo está operando la empresa;
- qué requiere atención;
- qué detectó el sistema;
- qué decisiones están pendientes.

### Encabezado

> Buen día, Laura. Estas son las situaciones que requieren atención hoy.

Acciones: `Ver resumen semanal` (lleva a `/proceso#semana`), `Explorar resultados`, `Actualizar vista`.

### Resumen del proceso

Bloque compacto con las cinco etapas (Arranque, Fuentes, CAUCE, Decisiones, Semana) y enlace `Ver proceso completo` a `/proceso`.

### Indicadores

| Indicador | Valor simulado |
|---|---:|
| Cobertura del conocimiento | 87% |
| Confianza promedio | 84% |
| Resultados nuevos | 7 |
| Aprobaciones pendientes | 3 |
| Fuentes por revisar | 4 |

### Prioridad principal

**Riesgo de quiebre de materia prima**

- Producto: Caja Vino x6 Reforzada.
- Ventana estimada: 28–30 de septiembre de 2026.
- Ventas expuestas: USD 18.400 equivalentes.
- Confianza: 91%.
- Responsable: Martín Castro.
- Acción: `Revisar recomendación`.

### Secciones

1. **Requiere tu atención:** tres situaciones con severidad, impacto, vencimiento y responsable.
2. **Pulso operativo:** producción, entregas en fecha, cobertura de inventario y cotizaciones pendientes.
3. **Últimos resultados:** cuatro resultados con tipo, área, fecha y estado.
4. **Estado de CAUCE:** cobertura por área, fuentes desactualizadas y objetivos pendientes.
5. **Actividad reciente:** cinco eventos con enlace al detalle.

### Interacciones

- El riesgo principal abre `resultado_riesgo_liner`.
- El contador de aprobaciones abre Aprobaciones filtrado por Pendiente.
- El contador de fuentes abre Documentación filtrado por Requiere atención.
- Cambiar el período actualiza tendencias, no el estado actual.

### Criterios

- La prioridad se reconoce en menos de cinco segundos.
- Valores y estados coinciden con los demás módulos.
- Toda tarjeta tiene un destino útil.
- Los valores económicos indican `estimado` o `equivalentes`.

## 1b. Proceso

### Objetivo

Explicar el arco de CAUCE desde el arranque con el cliente hasta el ritmo semana a semana.

### Etapas

1. Arranque con el cliente (`#arranque`)
2. Fuentes y conocimiento (`#fuentes`)
3. CAUCE (`#gemelo`)
4. Resultados y control humano (`#decisiones`)
5. Semana a semana (`#semana`) — incluye ritual semanal

Cada etapa tiene CTA a la pantalla operativa correspondiente y etiqueta de estado en la demo.

### Criterios

- Accesible desde el menú y desde Inicio.
- Anclas directas funcionan.
- Lenguaje empresarial; sin términos de caja negra.

## 2. Documentación

### Objetivo

Mostrar qué información está disponible, su calidad, vigencia y contribución a CAUCE.

### Resumen

- 12 documentos en la semilla inicial.
- 12 procesados.
- 3 por revisar.
- 1 desactualizado.
- 1 inconsistencia activa.

### Vistas

- Todos
- Por área
- Por fuente
- Requieren atención

### Categorías

- Estrategia
- Comercial
- Operaciones
- Finanzas
- Personas
- Clientes
- Productos
- Políticas y procedimientos

### Tabla

Columnas:

- nombre;
- categoría;
- fuente;
- propietario;
- última actualización;
- estado;
- conocimientos relacionados;
- acciones.

Registros importantes:

| Documento | Categoría | Fuente | Estado |
|---|---|---|---|
| Pronóstico comercial Q4 | Comercial | CRM | Actualizado |
| Inventario de materias primas | Operaciones | ERP | Actualizado |
| Política de descuentos 2025 | Comercial | Drive | Inconsistencia |
| Ficha técnica Caja Vino x6 | Productos | Drive | Próxima a vencer |
| Plazos de proveedores | Compras | Planilla | A revisar |

### Detalle

- vista previa simulada;
- metadatos;
- propietario;
- fecha y versión;
- estado de procesamiento;
- hechos extraídos;
- entidades relacionadas;
- resultados donde se utilizó;
- inconsistencias detectadas.

### Interacciones

- Buscar y combinar filtros.
- Abrir detalle.
- Marcar documento como revisado.
- Simular carga de archivo.
- Mostrar: `En la demo el archivo no será procesado ni enviado`.

### Criterios

- Buscar `descuentos` encuentra las versiones contradictorias.
- El usuario diferencia `procesado` de `actualizado`.
- Cada documento muestra relación con CAUCE.
- Los filtros pueden limpiarse con una sola acción.

## 3. CAUCE

### Objetivo

Visualizar el modelo vivo de la empresa y las relaciones que sustentan decisiones.

### Modos

- **Mapa:** red simplificada de entidades y relaciones.
- **Explorador:** listado jerárquico accesible.

### Dominios

- Clientes
- Productos
- Proveedores
- Procesos
- Personas
- Indicadores
- Decisiones
- Riesgos y oportunidades

### Indicadores simulados

- 48 elementos de conocimiento.
- 87% de cobertura.
- 84% de confianza media.
- 12 objetivos abiertos.
- 4 fuentes por actualizar.

### Nodo focal

**Caja Vino x6 Reforzada**

Relaciones:

- utiliza → Papel liner 200 g;
- abastecido por → Papeles Cuyo;
- producido en → Línea 2;
- comprado por → Segmento Bodegas;
- afectado por → Pronóstico vendimia;
- condicionado por → Stock mínimo;
- relacionado con → Riesgo de quiebre.

### Detalle de entidad

- descripción y tipo;
- propietario;
- confianza y vigencia;
- hechos conocidos;
- hipótesis;
- decisiones relacionadas;
- fuentes;
- relaciones;
- preguntas sin responder.

### Objetivos de conocimiento

- Validar capacidad extraordinaria del proveedor Papeles Cuyo.
- Confirmar elasticidad de demanda del segmento Bodegas.
- Actualizar tiempos de cambio de formato de Línea 2.

### Criterios

- El usuario alterna entre mapa y explorador.
- Elegir un nodo actualiza el panel de detalle.
- Hechos e hipótesis se distinguen por texto e icono.
- El mapa muestra un subconjunto útil, no todos los nodos.
- Las relaciones coinciden con el riesgo de inventario.

## 4. Resultados

### Objetivo

Concentrar alertas, recomendaciones, informes y oportunidades generadas por el sistema.

### Filtros

- estado;
- área;
- tipo;
- prioridad;
- fecha;
- responsable.

### Tipos

- Riesgo
- Oportunidad
- Recomendación
- Informe
- Análisis
- Acción completada

### Resultados iniciales

1. Riesgo de quiebre de papel liner.
2. Oportunidad de reactivar 14 clientes.
3. Dos entregas con probabilidad de demora.
4. Tres fichas técnicas próximas a vencer.
5. Inconsistencia en política de descuentos.
6. Resumen ejecutivo semanal.
7. Propuesta de optimización de cambios de línea.

### Tarjeta

- tipo;
- título;
- síntesis;
- impacto;
- prioridad;
- confianza;
- fecha;
- estado;
- responsable;
- llamada a la acción.

### Detalle

1. Resumen ejecutivo.
2. Situación detectada.
3. Impacto estimado.
4. Evidencias.
5. Recomendación.
6. Alternativas consideradas.
7. Riesgos de actuar y de no actuar.
8. Próximo paso.
9. Aprobación vinculada.
10. Historial.

### Criterios

- Todos los resultados abren un detalle.
- El resultado principal enlaza su aprobación.
- Las fuentes se consultan sin abandonar la pantalla.
- Se distinguen hechos, estimaciones e hipótesis.
- Ningún impacto estimado se presenta como garantía.

## 5. Aprobaciones

### Objetivo

Dar control humano sobre decisiones y acciones sensibles.

### Resumen

- 3 pendientes.
- 12 aprobadas en el período simulado.
- 2 descartadas.
- Tiempo medio simulado de resolución: 6,4 horas.

### Bandejas

- Pendientes
- Resueltas
- Todas

### Aprobación principal

**Adelantar compra de 18 toneladas de papel liner**

- Solicitada por: Sistema.
- Responsable: Martín Castro.
- Límite: 18 de septiembre de 2026, 17:00.
- Costo estimado: USD 11.700 equivalentes.
- Ventas protegidas estimadas: USD 18.400 equivalentes.
- Confianza: 91%.

### Detalle

- propuesta;
- motivo;
- evidencia;
- impacto y costo;
- riesgo;
- alcance;
- paso posterior;
- reversibilidad;
- comentarios.

### Acciones

- Aprobar
- Rechazar
- Solicitar cambios
- Asignar
- Comentar

### Transición simulada

Al aprobar:

1. pedir confirmación;
2. actualizar la aprobación;
3. actualizar el resultado;
4. registrar un evento;
5. recalcular indicadores locales;
6. mostrar `Simulación completada. No se realizó ninguna operación externa`.

Rechazar o solicitar cambios exige comentario.

### Criterios

- Toda acción sensible requiere confirmación.
- Los cambios se propagan a Resultados, Actividad e Inicio.
- El usuario puede restablecer el estado.
- Nunca se afirma que una compra real fue creada.

## 6. Actividad

### Objetivo

Ofrecer trazabilidad cronológica y auditable.

### Filtros

- fecha;
- usuario;
- área;
- tipo;
- entidad;
- estado.

### Eventos principales

- Resultado `Riesgo de quiebre` generado.
- Aprobación solicitada a Martín Castro.
- Documento `Inventario de materias primas` actualizado.
- Hipótesis de demanda validada.
- Sofía Pérez revisó una oportunidad comercial.
- Laura Quiroga aprobó el resumen semanal.
- Política de descuentos marcada como inconsistente.

### Anatomía

- fecha y hora;
- actor: persona o `Sistema`;
- acción;
- objeto;
- módulo;
- consecuencia;
- enlace al detalle.

Cuando corresponda, mostrar estado anterior, estado nuevo y motivo.

### Criterios

- Se puede ordenar y filtrar.
- Cada evento enlaza su entidad.
- La aprobación simulada aparece inmediatamente.
- El registro no expone detalles internos del motor.

## 7. Métricas

### Objetivo

Mostrar adopción, calidad del conocimiento e impacto potencial.

### Impacto operativo simulado

- 2 quiebres potenciales anticipados.
- 37 horas mensuales estimadas ahorradas.
- 86% de entregas en fecha frente a 78% de línea base.
- 5,2 h de línea base frente a 1,4 h para preparar cotizaciones.
- USD 48.600 equivalentes de oportunidades detectadas.

### Calidad del conocimiento

- cobertura general;
- confianza;
- vigencia;
- documentos inconsistentes;
- objetivos cerrados.

### Uso

- usuarios activos;
- resultados revisados;
- aprobaciones dentro de plazo;
- áreas activas.

### Tendencias

- cobertura por semana;
- resultados por categoría;
- tiempo medio de aprobación;
- documentos actualizados;
- riesgos detectados frente a resueltos.

### Reglas

- Indicar período y línea base.
- Usar `estimado` para ahorro e impacto.
- Incluir tooltip de metodología.
- No afirmar causalidad cuando la demo solo muestra correlación.

### Criterios

- Todos los gráficos tienen etiqueta, unidad y período.
- Inicio y Métricas usan los mismos valores.
- El usuario alterna entre 30 y 90 días.
- Las proyecciones se distinguen de los registros simulados.

## 8. Configuración

### Objetivo

Mostrar adaptación por empresa sin revelar herramientas internas.

### Secciones

1. **Perfil de empresa:** nombre, industria, zona horaria, moneda y áreas.
2. **Usuarios y roles:** Administrador, Dirección, Responsable y Consulta.
3. **Fuentes:** ERP, CRM, Drive, correo y planillas.
4. **Notificaciones:** alertas, resúmenes y recordatorios.
5. **Políticas de aprobación:** umbrales, responsables y suplentes.
6. **Privacidad y datos:** retención, exportación y aislamiento.
7. **Preferencias:** idioma, fecha, unidades y horario operativo.

### Fuentes simuladas

| Fuente | Estado | Última sincronización simulada |
|---|---|---|
| ERP Andino | Conectada | Hace 12 min |
| CRM Comercial | Conectada | Hace 18 min |
| Google Drive | Conectada | Hace 34 min |
| Correo corporativo | Requiere revisión | Hace 2 días |

Cada fila muestra la etiqueta `Simulación`.

### Interacciones

- Editar formularios localmente.
- Guardar preferencias en navegador.
- Confirmar antes de desconectar una fuente.
- Restablecer configuración inicial.

### Criterios

- Guardar conserva los datos al recargar.
- Ninguna opción menciona proveedores internos.
- El entorno se describe como `dedicado y aislado` sin explicar infraestructura.
- Desconectar una fuente no realiza llamadas externas.

## Pitch de cuatro minutos

Lecturas adicionales sobre el caso simulado de papel liner. No reemplazan el semáforo de áreas, el ciclo con el cliente, el listado de resultados ni la bandeja de aprobaciones.

### CAUCE

Grafo dirigido con Operaciones, Compras, Finanzas, Calidad, Personas y el quiebre de liner. Cada flecha es `evidencia`, `depende de` o `hueco`. Al seleccionar el quiebre se ilumina un solo camino: Calidad (spec de liner) → Compras (plazo) → Operaciones (colas) → Finanzas (caja) → Personas (turno extra).

### Proceso

Un flujo: Pedido → corte → consumo de liner → armado → despacho. El grosor es volumen de pedidos y el color es espera. El tramo hacia consumo de liner es el más grueso y rojo, y ese nodo muestra un segundo conteo de pedidos en espera. Los lentes Pedido, Compra, Lote y Factura recentran el mismo mapa. Cada área muestra u oculta solo sus enlaces.

### Resultados

Tres opciones en barras agrupadas: comprar ya, comprar parcial y esperar. Cada una muestra costo, plazo, calidad y caja, con la marca `simulado`. Comprar ya es la barra resaltada. El mismo mapa se superpone en dos variantes: los pasos compartidos quedan atenuados y la diferencia fuerte es el camino extra (compra urgente, reproceso).

### Aprobaciones y métricas

Tira de recomendaciones abiertas por área, con impacto proyectado en costo, caja y entregas, y horas hasta la aprobación. Confirmar la aprobación agrega un evento en Actividad y mueve solo esas tres cifras en Métricas.

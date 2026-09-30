# 04 — Flujos de usuario

## Flujo A — Recorrido ejecutivo

### Propósito

Comunicar el valor central en menos de cinco minutos.

### Pasos

1. Abrir Inicio.
2. Identificar `Riesgo de quiebre de materia prima`.
3. Abrir el resultado.
4. Revisar impacto, confianza y evidencias.
5. Abrir la aprobación vinculada.
6. Aprobar la simulación.
7. Confirmar que no se ejecutó una acción externa.
8. Abrir Actividad y localizar el evento nuevo.
9. Abrir Métricas y ver la actualización del riesgo resuelto.

### Estado final

- aprobación: Aprobada;
- resultado: Aprobado;
- actividad: evento agregado;
- Inicio: contador pendiente reducido;
- Métricas: decisión asistida y riesgo resuelto actualizados.

## Flujo B — De documento a decisión

1. Abrir Documentación.
2. Buscar `Pronóstico comercial Q4`.
3. Abrir el detalle.
4. Revisar hechos extraídos y entidades relacionadas.
5. Abrir `Caja Vino x6 Reforzada` en CAUCE.
6. Explorar el vínculo con stock, proveedor y riesgo.
7. Abrir el resultado relacionado.

El usuario siempre debe poder volver al documento sin perder filtros.

## Flujo C — Calidad del conocimiento

1. Desde Inicio, seleccionar `4 fuentes por revisar`.
2. Llegar a Documentación filtrada.
3. Abrir `Política de descuentos 2025`.
4. Comparar las dos versiones contradictorias.
5. Marcar una versión como revisada.
6. Ver la actualización en Actividad.
7. Confirmar el cambio en el indicador de fuentes por revisar.

## Flujo D — Oportunidad comercial

1. Abrir Resultados.
2. Filtrar por Oportunidad.
3. Abrir `Reactivación de 14 clientes`.
4. Revisar criterios y lista simulada.
5. Asignar revisión a Sofía Pérez.
6. Ver responsable y estado actualizados.
7. Ver el evento en Actividad.

## Flujo E — Carga simulada

1. Abrir Documentación.
2. Seleccionar `Agregar documento`.
3. Elegir un archivo local.
4. Conservar solamente nombre, tipo y tamaño en memoria local.
5. Mostrar estado Procesando durante una latencia simulada.
6. Cambiar a Analizado.
7. Informar que el archivo no se envió ni procesó realmente.

Nunca leer, persistir o subir el contenido del archivo.

## Flujo F — Restablecer demo

1. Abrir el menú del entorno Demo.
2. Seleccionar `Restablecer demo`.
3. Mostrar qué se perderá: decisiones, comentarios, filtros y preferencias locales.
4. Solicitar confirmación.
5. Eliminar el estado local versionado.
6. Recargar la semilla canónica.
7. Volver a Inicio con un mensaje de éxito.

## Recuperación de errores

### Repositorio mock no disponible

- mostrar error recuperable;
- ofrecer Reintentar;
- no alterar el estado actual.

### Semilla incompatible

- bloquear la demo con un mensaje claro de configuración;
- registrar el detalle técnico solo en desarrollo;
- no intentar completar datos faltantes silenciosamente.

### Ruta inexistente

- mostrar página 404 dentro del shell;
- ofrecer `Volver a Inicio`.

### Acción sin permiso

- mantener visible el contenido;
- deshabilitar la acción;
- explicar qué rol puede realizarla.


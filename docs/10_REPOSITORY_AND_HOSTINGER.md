# 10 — Repositorio y Hostinger

## Momento correcto

No crear repositorio remoto ni configurar Hostinger hasta aprobar localmente:

- recorrido principal;
- diseño responsive;
- términos visibles;
- datos simulados;
- build de producción.

## Repositorio

Nombre sugerido: `gemelo-digital-demo`.

Configuración recomendada:

- privado;
- rama desplegable `main`;
- ramas cortas `feat/...`, `fix/...` y `chore/...`;
- pull request antes de fusionar;
- CI requerido;
- Conventional Commits;
- etiquetas `demo-v0.1.0`, `demo-v0.2.0`.

No crear rama `develop` hasta que exista un equipo o un entorno staging que la justifique.

## CI sugerido

1. Checkout.
2. Node 22.
3. `npm ci`.
4. `npm run check`.
5. `npm run test:e2e` cuando el entorno lo permita.
6. Guardar `dist` como artefacto opcional.

## Opción recomendada en Hostinger

Para esta demo, usar el flujo gestionado de aplicaciones web de Hostinger en un plan compatible.

Configuración esperada:

| Campo | Valor |
|---|---|
| Framework | Vite / React |
| Node | 22.x |
| Instalación | `npm ci` |
| Build | `npm run build` |
| Salida | `dist` |
| Proceso persistente | No requerido para SPA estática |

Hostinger documenta despliegue de React y Vite desde GitHub con builds automáticos en planes Business Web Hosting y Cloud. Confirmar el plan contratado y las opciones visibles en hPanel antes de ejecutar.

## Alternativa

Si el plan no ofrece el flujo de aplicación web:

1. construir `dist` en CI;
2. publicar el contenido como sitio estático personalizado;
3. configurar fallback de rutas a `index.html`;
4. evitar cambios manuales en producción.

## Rutas de SPA

La recarga directa de `/resultados/:id`, `/gemelo/:id` y otras rutas debe servir `index.html`. Validar el mecanismo disponible en el tipo de hosting elegido antes de publicar.

## Dominio y acceso

- Usar inicialmente subdominio, por ejemplo `demo.dominio.com`.
- Activar SSL.
- Agregar `robots.txt` y `noindex,nofollow`.
- Si se comparte con pocos prospectos, usar protección real del hosting.
- No considerar un formulario de login mock como barrera de seguridad.

## Variables

Las variables de despliegue se cargan desde hPanel. No subir `.env` al repositorio.

En esta demo las variables solo configuran comportamiento público. No existen secretos.

## Cursor y Hostinger

Hostinger ofrece un conector oficial para Cursor mediante OAuth o token. Puede gestionar sitios, dominios, DNS y VPS.

Uso recomendado:

1. validar localmente;
2. crear el repositorio privado;
3. conectar GitHub desde hPanel;
4. usar el conector de Cursor únicamente para operaciones de despliegue autorizadas;
5. habilitar solo Websites al inicio;
6. agregar Domains o DNS cuando exista una tarea concreta;
7. revisar cada acción que cambie hosting o DNS.

Preferir OAuth. Si se usa token manual, almacenarlo como variable del entorno de usuario, nunca dentro del proyecto.

## Riesgos

- Cambiar el repositorio conectado puede sobrescribir contenido publicado.
- Los directorios administrados por el despliegue no deben editarse manualmente.
- Las opciones dependen del plan y pueden cambiar.
- El acceso de un IDE al hosting amplía permisos y debe limitarse.
- Un VPS agrega mantenimiento, firewall, backups y monitoreo. No se recomienda para esta demo.

## Checklist previo al despliegue

- [ ] `npm run check` completo.
- [ ] E2E completo.
- [ ] Repositorio privado.
- [ ] Sin secretos en historial.
- [ ] `noindex,nofollow` activo.
- [ ] Rutas directas probadas.
- [ ] Dominio y SSL verificados.
- [ ] Protección de acceso definida.
- [ ] Copia del build identificado por commit.
- [ ] Plan de rollback documentado.

## Fuentes oficiales verificadas el 18 de septiembre de 2026

- [Desplegar una aplicación Node.js, React o Vite en Hostinger](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
- [Desplegar un repositorio Git en Hostinger](https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/)
- [Configurar variables de entorno](https://www.hostinger.com/support/how-to-add-environment-variables-during-node-js-application-deployment/)
- [Configurar Hostinger MCP en Cursor y otros IDE](https://www.hostinger.com/support/how-to-set-up-web-hosting-mcp-on-local-ides/)


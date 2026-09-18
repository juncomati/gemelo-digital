import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

test("recorrido ejecutivo principal", async ({ page }) => {
  await page.goto("/inicio");
  await expect(page.getByText("Demo · Datos simulados")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Buen día, Laura/i })).toBeVisible();
  await expect(page.getByText("Proceso del Gemelo")).toBeVisible();
  await expect(page.getByRole("group", { name: "Filtro por rubro" })).toBeVisible();

  await page.getByRole("button", { name: "Finanzas" }).click();
  await expect(page.getByText(/Filtrando 1 rubro/i)).toBeVisible();
  await page.getByRole("button", { name: "Todos" }).click();

  await page.getByRole("link", { name: "Ver proceso completo" }).click();
  await expect(page).toHaveURL(/\/proceso/);
  await expect(page.getByRole("heading", { name: "Dolores de la empresa" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Red de acciones" })).toBeVisible();

  await page.goto("/gemelo");
  await expect(page.getByText(/Solidez pyme/i).first()).toBeVisible();
  await page.getByRole("button", { name: /Área Operaciones/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Operaciones" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar" }).click();

  await page.goto("/consultor");
  await page.getByLabel("Pregunta").fill("quiebre de liner");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText(/riesgo de quiebre de papel liner/i).first()).toBeVisible();

  await page.goto("/novedades");
  await expect(page.getByRole("heading", { name: /Novedades de mercado/i })).toBeVisible();
  await expect(page.getByText(/vendimia/i).first()).toBeVisible();

  await page.goto("/inicio");
  await page.getByRole("button", { name: "Revisar recomendación" }).click();
  await expect(page).toHaveURL(/\/resultados\/result_risk_liner/);

  await page.getByRole("button", { name: "Abrir aprobación vinculada" }).click();
  await expect(page).toHaveURL(/\/aprobaciones\/approval_purchase_liner/);

  await page.getByRole("button", { name: "Aprobar", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Aprobar" }).click();
  await expect(page.getByText(/Simulación completada/i)).toBeVisible();

  await page.getByRole("link", { name: "Actividad" }).click();
  await expect(page.getByText(/Aprobó la propuesta/i).first()).toBeVisible();

  await page.getByRole("link", { name: "Métricas" }).click();
  await expect(page.getByText(/Decisiones \/ riesgos/i).first()).toBeVisible();

  await page.getByRole("button", { name: "Restablecer demo" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Restablecer demo" }).click();
  await expect(page.getByText(/Demo restablecida/i)).toBeVisible();
});

function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === "true";
}

function num(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? "Gemelo Digital Operativo",
  demoMode: bool(import.meta.env.VITE_DEMO_MODE, true),
  tenantId: import.meta.env.VITE_DEFAULT_TENANT_ID ?? "tenant_andespack",
  fakeLatency: bool(import.meta.env.VITE_ENABLE_FAKE_LATENCY, false),
  minDelay: num(import.meta.env.VITE_MOCK_MIN_DELAY_MS, 250),
  maxDelay: num(import.meta.env.VITE_MOCK_MAX_DELAY_MS, 900),
  tenantSwitcher: bool(import.meta.env.VITE_ENABLE_TENANT_SWITCHER, false),
  buildSha: import.meta.env.VITE_BUILD_SHA ?? "local",
};

import { defineConfig, devices } from "@playwright/test";

const portableNode = "C:\\Users\\Matias\\.gemelo-tools\\node";
const pathEnv =
  process.platform === "win32"
    ? `${portableNode};${process.env.PATH ?? ""}`
    : (process.env.PATH ?? "");

const webServerEnv: Record<string, string> = {};
for (const [key, value] of Object.entries(process.env)) {
  if (typeof value === "string") webServerEnv[key] = value;
}
webServerEnv.PATH = pathEnv;
webServerEnv.Path = pathEnv;
webServerEnv.CI = "";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5173",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
    timeout: 120_000,
    env: webServerEnv,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

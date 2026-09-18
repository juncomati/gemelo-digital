/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_DEMO_MODE: string;
  readonly VITE_DEFAULT_TENANT_ID: string;
  readonly VITE_ENABLE_FAKE_LATENCY: string;
  readonly VITE_MOCK_MIN_DELAY_MS: string;
  readonly VITE_MOCK_MAX_DELAY_MS: string;
  readonly VITE_ENABLE_TENANT_SWITCHER: string;
  readonly VITE_BUILD_SHA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_AUTH_BASE_URL?: string;
  readonly VITE_CUSTOMERS_BASE_URL?: string;
  readonly VITE_INVOICES_BASE_URL?: string;
  readonly VITE_USERS_BASE_URL?: string;
  readonly VITE_ACTUATOR_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

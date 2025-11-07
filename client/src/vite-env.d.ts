/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_TIME?: string;
  readonly VITE_VERSION?: string;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  // add more custom env vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

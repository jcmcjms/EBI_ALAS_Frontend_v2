const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5007',
  APP_URL: import.meta.env.VITE_APP_URL ?? 'http://localhost:5173',
} as const;

export type Env = typeof env;

export default env;
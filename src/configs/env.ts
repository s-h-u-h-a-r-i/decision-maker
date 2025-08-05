function getEnvVar(name: string, defaultValue?: string): string {
  const value = import.meta.env[name];

  if (!value && !defaultValue) {
    throw new Error(`Environment variable "${name}" is not set`);
  }

  return value || defaultValue;
}

export const env = {
  baseApiUrl: getEnvVar("VITE_BASE_API_URL"),
} as const;

console.log("Loaded env", env);

export type Env = typeof env;

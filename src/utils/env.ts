interface IEnv {
  supabaseUrl: string;
  supabasePublishableKey: string;
}

export function readEnvVar(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Переменная окружения ${key} не задана`);
  }
  return value;
}

export const env: IEnv = {
  supabaseUrl: readEnvVar("VITE_SUPABASE_URL"),
  supabasePublishableKey: readEnvVar("VITE_SUPABASE_PUBLISHABLE_KEY"),
};

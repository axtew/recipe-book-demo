interface IEnv {
  supabaseUrl: string;
  supabasePublishableKey: string;
}

function readEnvVar(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (value.length === 0) {
    throw new Error(`Переменная окружения ${key} не задана`);
  }
  return value;
}

export const env: IEnv = {
  supabaseUrl: readEnvVar("VITE_SUPABASE_URL"),
  supabasePublishableKey: readEnvVar("VITE_SUPABASE_PUBLISHABLE_KEY"),
};

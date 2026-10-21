interface IDemoCredentials {
  email: string;
  password: string;
}

interface IEnv {
  supabaseUrl: string;
  supabasePublishableKey: string;
  /** Демо-сборка: общий публичный стенд с плашкой, готовым логином и закрытой загрузкой фото. */
  isDemo: boolean;
  /** Публичный логин демо-стенда; `null` в рабочей сборке. */
  demoCredentials: IDemoCredentials | null;
}

export function readEnvVar(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Переменная окружения ${key} не задана`);
  }
  return value;
}

// Демо-переменные читаются только за проверкой флага: в рабочей сборке он
// сворачивается в константу, и ни имена переменных, ни логин в бандл не попадают.
const isDemo = import.meta.env.VITE_DEMO === "true";

export const env: IEnv = {
  supabaseUrl: readEnvVar("VITE_SUPABASE_URL"),
  supabasePublishableKey: readEnvVar("VITE_SUPABASE_PUBLISHABLE_KEY"),
  isDemo,
  demoCredentials: isDemo
    ? { email: readEnvVar("VITE_DEMO_EMAIL"), password: readEnvVar("VITE_DEMO_PASSWORD") }
    : null,
};

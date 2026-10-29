interface IDemoCredentials {
  email: string;
  password: string;
}

interface IEnv {
  supabaseUrl: string;
  supabasePublishableKey: string;
  /** Demo build: a shared public stand with a banner, a ready-made login and photo upload disabled. */
  isDemo: boolean;
  /** Public login of the demo stand; `null` in the working build. */
  demoCredentials: IDemoCredentials | null;
}

export function readEnvVar(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

// Demo variables are read only behind the flag check: in the working build it
// folds into a constant, and neither the variable names nor the login end up in the bundle.
const isDemo = import.meta.env.VITE_DEMO === "true";

export const env: IEnv = {
  supabaseUrl: readEnvVar("VITE_SUPABASE_URL"),
  supabasePublishableKey: readEnvVar("VITE_SUPABASE_PUBLISHABLE_KEY"),
  isDemo,
  demoCredentials: isDemo
    ? { email: readEnvVar("VITE_DEMO_EMAIL"), password: readEnvVar("VITE_DEMO_PASSWORD") }
    : null,
};

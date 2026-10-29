// Demo Worker script: every few days, on a Cron Trigger, it pokes the demo project's REST API.
//
// A free Supabase project is paused after a week without activity, and its own
// `pg_cron` does not count as activity. A request that reaches Postgres is needed:
// the `rpc` of the `demo_last_reset` function from `setup.sql` (granted to the anon role).
//
// The Worker usually serves static files itself, without calling the script; the
// `fetch` below is a fallback path for requests that did not reach the static files
// (for example, not a browser navigation to the address of a nested screen):
// they go to the same asset serving.
//
// The URL and the publishable key come from `vars` in `wrangler.demo.jsonc`; the key
// is not a secret — it is already in the app bundle.

// The Workers types (`@cloudflare/workers-types`) are not connected to the project, so
// only the part of the environment the script uses is described.
interface IKeepAliveEnv {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
}

const PLACEHOLDER = "REPLACE";

export default {
  fetch(request: Request, env: IKeepAliveEnv): Promise<Response> {
    return env.ASSETS.fetch(request);
  },

  async scheduled(_controller: unknown, env: IKeepAliveEnv): Promise<void> {
    if (
      env.SUPABASE_URL.includes(PLACEHOLDER) ||
      env.SUPABASE_PUBLISHABLE_KEY.includes(PLACEHOLDER)
    ) {
      throw new Error(
        "SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are not set in wrangler.demo.jsonc",
      );
    }

    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/demo_last_reset`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
      body: "{}",
    });

    // An error in the Cloudflare logs is the only way to learn that the ping did not arrive.
    if (!response.ok) {
      throw new Error(`Demo project ping returned ${response.status}`);
    }
  },
};

// Скрипт демо-Worker: раз в несколько дней по Cron Trigger дёргает REST демо-проекта.
//
// Бесплатный проект Supabase встаёт на паузу после недели без активности, а
// собственный `pg_cron` активностью не считается. Нужен запрос, который доходит до
// Postgres: `rpc` функции `demo_last_reset` из `setup.sql` (выдана роли anon).
//
// Статику Worker обычно отдаёт сам, без вызова скрипта; `fetch` ниже — запасной
// путь для запросов, которые до статики не дошли (например, не навигация браузера
// по адресу вложенного экрана): они уходят в ту же раздачу.
//
// Адрес и publishable key приходят из `vars` в `wrangler.demo.jsonc`; ключ не
// секрет — он и так лежит в бандле приложения.

// Типы Workers (`@cloudflare/workers-types`) в проект не подключены, поэтому
// описана только та часть окружения, которой пользуется скрипт.
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
      throw new Error("В wrangler.demo.jsonc не заполнены SUPABASE_URL и SUPABASE_PUBLISHABLE_KEY");
    }

    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/demo_last_reset`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
      body: "{}",
    });

    // Ошибка в логах Cloudflare — единственный способ узнать, что пинг не дошёл.
    if (!response.ok) {
      throw new Error(`Пинг демо-проекта вернул ${response.status}`);
    }
  },
};

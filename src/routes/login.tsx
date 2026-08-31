import { createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "@/pages/LoginPage";

interface ILoginSearch {
  redirect: string;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): ILoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/",
  }),
  component: LoginPage,
});

import { createFileRoute } from "@tanstack/react-router";

import { RouteStub } from "@/components/RouteStub";
import { useI18nSelector } from "@/context/I18nContext";

export const Route = createFileRoute("/")({
  component: RecipesStub,
});

function RecipesStub() {
  const l = useI18nSelector(({ l }) => l.navigation.recipes);
  return <RouteStub title={l} />;
}

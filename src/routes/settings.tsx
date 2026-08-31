import { createFileRoute } from "@tanstack/react-router";

import { RouteStub } from "@/components/RouteStub";
import { useI18nSelector } from "@/context/I18nContext";

export const Route = createFileRoute("/settings")({
  component: SettingsStub,
});

function SettingsStub() {
  const l = useI18nSelector(({ l }) => l.navigation.settings);
  return <RouteStub title={l} />;
}

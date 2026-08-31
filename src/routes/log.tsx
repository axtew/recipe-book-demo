import { createFileRoute } from "@tanstack/react-router";

import { RouteStub } from "@/components/RouteStub";
import { useI18nSelector } from "@/context/I18nContext";

export const Route = createFileRoute("/log")({
  component: LogStub,
});

function LogStub() {
  const l = useI18nSelector(({ l }) => l.navigation.log);
  return <RouteStub title={l} />;
}

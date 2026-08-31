import { createFileRoute } from "@tanstack/react-router";

import { RouteStub } from "@/components/RouteStub";
import { useI18nSelector } from "@/context/I18nContext";

export const Route = createFileRoute("/products")({
  component: ProductsStub,
});

function ProductsStub() {
  const l = useI18nSelector(({ l }) => l.navigation.products);
  return <RouteStub title={l} />;
}

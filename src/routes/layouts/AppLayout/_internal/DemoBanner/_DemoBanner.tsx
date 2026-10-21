import { Caption1 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { SBanner } from "./_styles";

/** Плашка демо-стенда: предупреждает, что данные общие и ночью сбрасываются. */
export function DemoBanner() {
  const l = useI18nSelector(({ l }) => l.demo);

  return (
    <SBanner role="status">
      <Caption1 color="text">{l.banner}</Caption1>
    </SBanner>
  );
}

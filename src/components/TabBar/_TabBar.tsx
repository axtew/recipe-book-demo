import { useI18nSelector } from "@/context/I18nContext";

import { SBar, SLink } from "./_styles";

/** Нижняя навигация с четырьмя вкладками, видна на всех основных экранах. */
export function TabBar() {
  const l = useI18nSelector(({ l }) => l.navigation);

  return (
    <SBar>
      <SLink to="/" activeOptions={{ exact: true }} activeProps={{ className: "active" }}>
        {l.recipes}
      </SLink>
      <SLink to="/products" activeProps={{ className: "active" }}>
        {l.products}
      </SLink>
      <SLink to="/log" activeProps={{ className: "active" }}>
        {l.log}
      </SLink>
      <SLink to="/settings" activeProps={{ className: "active" }}>
        {l.settings}
      </SLink>
    </SBar>
  );
}

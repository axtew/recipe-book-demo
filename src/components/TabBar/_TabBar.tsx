import { Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { routerPaths } from "@/routes/_paths";

import { SBar, SLink } from "./_styles";

/** Bottom navigation with four tabs, visible on all main screens. */
export function TabBar() {
  const l = useI18nSelector(({ l }) => l.navigation);

  return (
    <SBar>
      <SLink
        to={routerPaths.home}
        activeOptions={{ exact: true }}
        activeProps={{ className: "active" }}
      >
        <Caption2 as="span">{l.recipes}</Caption2>
      </SLink>
      <SLink to={routerPaths.products} activeProps={{ className: "active" }}>
        <Caption2 as="span">{l.products}</Caption2>
      </SLink>
      <SLink to={routerPaths.log} activeProps={{ className: "active" }}>
        <Caption2 as="span">{l.log}</Caption2>
      </SLink>
      <SLink to={routerPaths.settings} activeProps={{ className: "active" }}>
        <Caption2 as="span">{l.settings}</Caption2>
      </SLink>
    </SBar>
  );
}

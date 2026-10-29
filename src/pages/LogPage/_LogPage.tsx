import { B1, B2, H1 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { MonthGroup } from "./_internal/MonthGroup";
import { SPage, SPlaceholder } from "./_styles";
import { useLogPage } from "./_useLogPage";

/** Cook log: a feed of entries by descending date, grouped by month. */
export function LogPage() {
  const l = useI18nSelector(({ l }) => ({ ...l.cookLog, navigation: l.navigation }));
  const { groups, recipeNames, isEmpty } = useLogPage();

  return (
    <SPage>
      <H1>{l.navigation.log}</H1>

      {isEmpty && (
        <SPlaceholder>
          <B1 color="textMuted">{l.emptyTitle}</B1>
          <B2 color="textMuted">{l.emptyHint}</B2>
        </SPlaceholder>
      )}

      {groups.map((group) => (
        <MonthGroup key={group.key} group={group} recipeNames={recipeNames} />
      ))}
    </SPage>
  );
}

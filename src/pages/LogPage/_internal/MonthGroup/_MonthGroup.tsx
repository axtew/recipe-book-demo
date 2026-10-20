import { H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import type { IMonthGroup } from "../../_helpers";
import { LogEntry } from "../LogEntry";
import { SGroup, SList } from "./_styles";

interface IProps {
  group: IMonthGroup;
  recipeNames: Map<string, string>;
}

/** Месяц с заголовком «Октябрь 2026» и записями журнала в нём. */
export function MonthGroup({ group, recipeNames }: IProps) {
  const l = useI18nSelector(({ l }) => l.cookLog);

  return (
    <SGroup>
      <H3>{`${l.months[group.month - 1]} ${group.year}`}</H3>
      <SList>
        {group.logs.map((log) => (
          <LogEntry key={log.id} log={log} recipeName={recipeNames.get(log.recipeId) ?? null} />
        ))}
      </SList>
    </SGroup>
  );
}

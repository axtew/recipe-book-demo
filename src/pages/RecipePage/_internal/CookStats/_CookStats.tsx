import { useMemo } from "react";

import { B2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { ICookLog } from "@/types/cookLogs.types";
import { formatDecimal } from "@/utils/helpers/nutrients";

import { calculateCookStats, formatCookDate } from "./_helpers";
import { SRow, SSection } from "./_styles";

interface IProps {
  cookLogs: ICookLog[];
}

/**
 * Статистика из журнала: сколько раз готовили, когда в последний раз, средний
 * фактический выход и на сколько дней в среднем хватало. Нет данных для
 * среднего — прочерк, а не ноль.
 */
export function CookStats({ cookLogs }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeCard.stats);
  const stats = useMemo(() => calculateCookStats(cookLogs), [cookLogs]);

  if (stats.count === 0) {
    return (
      <SSection>
        <H3>{l.title}</H3>
        <B2 color="textMuted">{l.never}</B2>
      </SSection>
    );
  }

  const rows = [
    { label: l.count, value: String(stats.count) },
    {
      label: l.lastCooked,
      value: stats.lastCookedAt === null ? l.empty : formatCookDate(stats.lastCookedAt),
    },
    {
      label: l.averageYield,
      value:
        stats.averageYieldGrams === null
          ? l.empty
          : `${Math.round(stats.averageYieldGrams)} ${l.gramsUnit}`,
    },
    {
      label: l.averageDays,
      value:
        stats.averageDaysToFinish === null
          ? l.empty
          : `${formatDecimal(stats.averageDaysToFinish)} ${l.daysUnit}`,
    },
  ];

  return (
    <SSection>
      <H3>{l.title}</H3>
      {rows.map(({ label, value }) => (
        <SRow key={label}>
          <B2 color="textMuted">{label}</B2>
          <B2>{value}</B2>
        </SRow>
      ))}
    </SSection>
  );
}

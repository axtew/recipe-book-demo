import { Rating } from "@mantine/core";
import { useState } from "react";

import { useFinishCookLogMutation } from "@/api/mutations/cookLogs.mutations";
import { Button, SButtonRow } from "@/components/Button";
import { B1, B2, Caption1, Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { routerPaths } from "@/routes/_paths";
import type { ICookLog } from "@/types/cookLogs.types";
import { formatCookDate, getTodayDate } from "@/utils/helpers/dates";
import { formatDecimal, formatKcal, formatMultiplier } from "@/utils/helpers/nutrients";

import { FinishSheet } from "../FinishSheet";
import { SHeader, SItem, SMeta, SNote, SRecipeLink } from "./_styles";

interface IProps {
  log: ICookLog;
  /** Название рецепта; `null`, если рецепта с таким id в данных нет. */
  recipeName: string | null;
}

/**
 * Запись журнала: рецепт со ссылкой на карточку, дата, множитель, выход,
 * контейнеры, оценка, заметка и КБЖУ на 100 г из снимка записи.
 *
 * У записи без даты «доели» — кнопка «Доели», ставящая сегодняшнюю дату одним
 * тапом, и «Другая дата» для выбора вручную.
 */
export function LogEntry({ log, recipeName }: IProps) {
  const l = useI18nSelector(({ l }) => ({ ...l.cookLog, nutrients: l.nutrients }));
  const { mutate, isPending } = useFinishCookLogMutation();
  const [isFinishSheetOpened, setIsFinishSheetOpened] = useState(false);

  const meta = [
    formatMultiplier(log.multiplier),
    ...(log.actualYieldGrams === null
      ? []
      : [`${l.yieldLabel}: ${formatDecimal(log.actualYieldGrams)} ${l.gramsUnit}`]),
    ...(log.containers === null ? [] : [`${l.containersLabel}: ${log.containers}`]),
  ];

  // КБЖУ берётся из снимка записи, а не из текущего рецепта: смена активного
  // варианта продукта историю не переписывает.
  const nutrition = log.snapshot?.nutrition ?? null;
  const isSnapshotIncomplete = nutrition !== null && nutrition.incompleteProducts.length > 0;
  const snapshotLine =
    nutrition === null
      ? null
      : [
          `${formatKcal(nutrition.per100g.kcal)} ${l.nutrients.kcal} ${l.per100g}`,
          ...(isSnapshotIncomplete ? [l.nutrients.incomplete] : []),
        ].join(" · ");

  return (
    <SItem>
      <SHeader>
        {recipeName === null ? (
          <B1 color="textMuted">{l.unknownRecipe}</B1>
        ) : (
          <SRecipeLink to={routerPaths.recipeCard} params={{ recipeId: log.recipeId }}>
            <B1 as="span">{recipeName}</B1>
          </SRecipeLink>
        )}
        <Caption1 color="textMuted">{formatCookDate(log.cookedAt)}</Caption1>
      </SHeader>

      <SMeta>
        <Caption1 color="textMuted">{meta.join(" · ")}</Caption1>
        {log.rating !== null && <Rating readOnly size="sm" value={log.rating} />}
      </SMeta>

      {snapshotLine !== null && (
        <Caption2 color={isSnapshotIncomplete ? "danger" : "textMuted"}>{snapshotLine}</Caption2>
      )}

      {log.note !== null && (
        <SNote>
          <B2>{log.note}</B2>
        </SNote>
      )}

      {log.finishedAt === null ? (
        <SButtonRow>
          <Button
            variant="primary"
            type="button"
            disabled={isPending}
            onClick={() => mutate({ id: log.id, finishedAt: getTodayDate() })}
          >
            {l.finishButton}
          </Button>
          <Button
            variant="primaryOutline"
            type="button"
            onClick={() => setIsFinishSheetOpened(true)}
          >
            {l.otherDateButton}
          </Button>
          <FinishSheet
            isOpened={isFinishSheetOpened}
            logId={log.id}
            cookedAt={log.cookedAt}
            onClose={() => setIsFinishSheetOpened(false)}
          />
        </SButtonRow>
      ) : (
        <Caption1 color="textMuted">{`${l.finishedLabel}: ${formatCookDate(log.finishedAt)}`}</Caption1>
      )}
    </SItem>
  );
}

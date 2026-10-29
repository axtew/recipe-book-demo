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
  /** Recipe name; `null` if there is no recipe with that id in the data. */
  recipeName: string | null;
}

/**
 * A log entry: the recipe with a link to its card, date, multiplier, yield, containers, rating,
 * note and nutrition per 100 g from the entry snapshot.
 *
 * An entry without a “finished” date gets a “Finished” button that sets today's date in one tap,
 * and “Other date” for picking one manually.
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

  // Nutrition is taken from the entry snapshot, not from the current recipe: changing the product's
  // active variant does not rewrite the history.
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

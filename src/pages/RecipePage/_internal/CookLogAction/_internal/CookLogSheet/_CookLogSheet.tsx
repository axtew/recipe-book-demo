import { NumberInput, Rating } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

import { SBottomSheetDrawer } from "@/components/BottomSheetDrawer";
import { Button } from "@/components/Button";
import { SSheetActions, SSheetField, SSheetForm } from "@/components/SheetForm";
import { STextArea } from "@/components/TextArea";
import { B2, B3, Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { MULTIPLIER_MAX } from "@/domain/schemas";
import { getTodayDate } from "@/utils/helpers/dates";

import { MULTIPLIER_PRESETS, RATING_STAR_SIZE_PX } from "./_constants";
import { SClearRating, SPreset, SPresets, SRatingRow } from "./_styles";
import type { ICookLogSheetProps } from "./_types";
import { useCookLogForm } from "./_useCookLogForm";

/**
 * Bottom sheet быстрой записи готовки.
 *
 * Обязательны только дата и множитель, и оба уже заполнены (сегодня, ×1), так
 * что запись создаётся в два тапа: открыть лист и подтвердить. Выход,
 * контейнеры, оценка и заметка — по желанию. Снимок КБЖУ приходит снаружи и
 * уходит в запись без пересчёта.
 */
export function CookLogSheet({ isOpened, recipeId, snapshot, onClose }: ICookLogSheetProps) {
  const l = useI18nSelector(({ l }) => l.cookLogSheet);

  const {
    cookedAt,
    multiplier,
    actualYieldGrams,
    containers,
    rating,
    note,
    error,
    isSubmitDisabled,
    setCookedAt,
    setMultiplier,
    setActualYieldGrams,
    setContainers,
    setRating,
    setNote,
    handleSubmit,
  } = useCookLogForm({
    isOpened,
    recipeId,
    snapshot,
    validationError: l.validationError,
    submitError: l.submitError,
    onSaved: onClose,
  });

  return (
    <SBottomSheetDrawer opened={isOpened} onClose={onClose} position="bottom" title={l.title}>
      <SSheetForm onSubmit={handleSubmit}>
        <SSheetField as="div">
          <Caption2 color="textMuted">{l.dateLabel}</Caption2>
          <DatePickerInput
            size="md"
            aria-label={l.dateLabel}
            valueFormat="D MMMM YYYY"
            maxDate={getTodayDate()}
            dropdownType="modal"
            value={cookedAt}
            onChange={(nextValue) => {
              if (nextValue !== null) setCookedAt(nextValue);
            }}
          />
        </SSheetField>

        <SSheetField as="div">
          <Caption2 color="textMuted">{l.multiplierLabel}</Caption2>
          <SPresets>
            {MULTIPLIER_PRESETS.map((preset) => (
              <SPreset
                key={preset}
                type="button"
                $isActive={multiplier === preset}
                aria-pressed={multiplier === preset}
                onClick={() => setMultiplier(preset)}
              >
                <B2 as="span">{`×${preset}`}</B2>
              </SPreset>
            ))}
          </SPresets>
          <NumberInput
            size="md"
            aria-label={l.multiplierCustomLabel}
            placeholder={l.multiplierCustomLabel}
            min={0.01}
            max={MULTIPLIER_MAX}
            decimalScale={2}
            allowNegative={false}
            value={multiplier}
            onChange={(nextValue) => setMultiplier(typeof nextValue === "number" ? nextValue : "")}
          />
        </SSheetField>

        <SSheetField as="div">
          <Caption2 color="textMuted">{`${l.yieldLabel}, ${l.gramsUnit}`}</Caption2>
          <NumberInput
            size="md"
            aria-label={l.yieldLabel}
            min={0.1}
            decimalScale={1}
            allowNegative={false}
            value={actualYieldGrams}
            onChange={(nextValue) =>
              setActualYieldGrams(typeof nextValue === "number" ? nextValue : "")
            }
          />
        </SSheetField>

        <SSheetField as="div">
          <Caption2 color="textMuted">{l.containersLabel}</Caption2>
          <NumberInput
            size="md"
            aria-label={l.containersLabel}
            min={1}
            allowDecimal={false}
            allowNegative={false}
            value={containers}
            onChange={(nextValue) => setContainers(typeof nextValue === "number" ? nextValue : "")}
          />
        </SSheetField>

        <SSheetField as="div">
          <Caption2 color="textMuted">{l.ratingLabel}</Caption2>
          <SRatingRow>
            <Rating
              size={RATING_STAR_SIZE_PX}
              aria-label={l.ratingLabel}
              value={rating ?? 0}
              onChange={(nextValue) => setRating(nextValue === 0 ? null : nextValue)}
            />
            {rating !== null && (
              <SClearRating type="button" onClick={() => setRating(null)}>
                <B3 as="span">{l.ratingClear}</B3>
              </SClearRating>
            )}
          </SRatingRow>
        </SSheetField>

        <SSheetField as="div">
          <Caption2 color="textMuted">{l.noteLabel}</Caption2>
          <STextArea
            aria-label={l.noteLabel}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </SSheetField>

        {error !== null && <B3 color="danger">{error}</B3>}

        <SSheetActions>
          <Button variant="secondary" type="button" onClick={onClose}>
            {l.cancelButton}
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitDisabled}>
            {l.submitButton}
          </Button>
        </SSheetActions>
      </SSheetForm>
    </SBottomSheetDrawer>
  );
}

import { DatePicker } from "@mantine/dates";

import { SBottomSheetDrawer } from "@/components/BottomSheetDrawer";
import { B2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { getTodayDate } from "@/utils/helpers/dates";

import { SActions, SCancel, SForm, SPicker, SSubmit } from "./_styles";
import type { IFinishSheetProps } from "./_types";
import { useFinishForm } from "./_useFinishForm";

/** Bottom sheet выбора даты «доели», когда сегодняшняя не подходит. */
export function FinishSheet({ isOpened, logId, cookedAt, onClose }: IFinishSheetProps) {
  const l = useI18nSelector(({ l }) => l.cookLog.finishSheet);
  const { finishedAt, isSubmitDisabled, setFinishedAt, handleSubmit } = useFinishForm({
    isOpened,
    logId,
    onSaved: onClose,
  });

  return (
    <SBottomSheetDrawer opened={isOpened} onClose={onClose} position="bottom" title={l.title}>
      <SForm onSubmit={handleSubmit}>
        <SPicker>
          <DatePicker
            value={finishedAt}
            minDate={cookedAt}
            maxDate={getTodayDate()}
            onChange={(nextValue) => {
              if (nextValue !== null) setFinishedAt(nextValue);
            }}
          />
        </SPicker>

        <SActions>
          <SCancel type="button" onClick={onClose}>
            <B2 as="span">{l.cancelButton}</B2>
          </SCancel>
          <SSubmit type="submit" disabled={isSubmitDisabled}>
            <B2 as="span">{l.submitButton}</B2>
          </SSubmit>
        </SActions>
      </SForm>
    </SBottomSheetDrawer>
  );
}

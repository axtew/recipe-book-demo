import { DatePicker } from "@mantine/dates";

import { SBottomSheetDrawer } from "@/components/BottomSheetDrawer";
import { Button } from "@/components/Button";
import { SSheetActions, SSheetForm } from "@/components/SheetForm";
import { useI18nSelector } from "@/context/I18nContext";
import { getTodayDate } from "@/utils/helpers/dates";

import { SPicker } from "./_styles";
import type { IFinishSheetProps } from "./_types";
import { useFinishForm } from "./_useFinishForm";

/** Bottom sheet for picking the “finished” date when today's does not fit. */
export function FinishSheet({ isOpened, logId, cookedAt, onClose }: IFinishSheetProps) {
  const l = useI18nSelector(({ l }) => l.cookLog.finishSheet);
  const { finishedAt, isSubmitDisabled, setFinishedAt, handleSubmit } = useFinishForm({
    isOpened,
    logId,
    onSaved: onClose,
  });

  return (
    <SBottomSheetDrawer opened={isOpened} onClose={onClose} position="bottom" title={l.title}>
      <SSheetForm onSubmit={handleSubmit}>
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

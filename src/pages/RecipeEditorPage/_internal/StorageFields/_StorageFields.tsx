import { NumberInput } from "@mantine/core";

import { B2, Caption2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { SField, SFieldRow, SSection } from "../../_styles";
import type { TUpdateField } from "../../_types";
import { SSwitch, SSwitchLabel } from "./_styles";

interface IProps {
  freezable: boolean;
  freezerDays: number | "";
  fridgeDays: number | "";
  onChange: TUpdateField;
}

/** The storage block: a “can be frozen” switch, and when it is on — the storage times. */
export function StorageFields({ freezable, freezerDays, fridgeDays, onChange }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.storage);

  return (
    <SSection>
      <H3>{l.title}</H3>

      <SSwitchLabel>
        <B2 as="span">{l.freezableLabel}</B2>
        <SSwitch
          type="checkbox"
          role="switch"
          checked={freezable}
          onChange={(event) => onChange("freezable", event.target.checked)}
        />
      </SSwitchLabel>

      {freezable && (
        <SFieldRow>
          <SField>
            <Caption2 color="textMuted">{l.freezerDaysLabel}</Caption2>
            <NumberInput
              size="md"
              enterKeyHint="done"
              min={0}
              allowDecimal={false}
              value={freezerDays}
              onChange={(value) => onChange("freezerDays", typeof value === "number" ? value : "")}
            />
          </SField>
          <SField>
            <Caption2 color="textMuted">{l.fridgeDaysLabel}</Caption2>
            <NumberInput
              size="md"
              enterKeyHint="done"
              min={0}
              allowDecimal={false}
              value={fridgeDays}
              onChange={(value) => onChange("fridgeDays", typeof value === "number" ? value : "")}
            />
          </SField>
        </SFieldRow>
      )}
    </SSection>
  );
}

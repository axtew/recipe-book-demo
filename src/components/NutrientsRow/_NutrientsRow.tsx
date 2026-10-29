import { Caption2, Num2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { formatKcal, formatMacro } from "@/utils/helpers/nutrients";

import { SCell, SRow, SWrapper } from "./_styles";

interface IProps {
  kcal: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
}

/**
 * A “kcal / P / F / C” block per 100 g.
 *
 * An unfilled value is shown as a dash, and an incomplete set additionally gets a warning under the
 * row: a zero in place of a missing number is indistinguishable from an honest zero, and this is
 * exactly what the “no silent zeros” invariant forbids. The warning is decided inside the
 * component, not by the consumer — otherwise every screen would write the same check.
 */
export function NutrientsRow({ kcal, protein, fat, carbs }: IProps) {
  const l = useI18nSelector(({ l }) => l.nutrients);

  const cells = [
    { key: "kcal", label: l.kcal, value: kcal === null ? l.empty : formatKcal(kcal) },
    { key: "protein", label: l.protein, value: protein === null ? l.empty : formatMacro(protein) },
    { key: "fat", label: l.fat, value: fat === null ? l.empty : formatMacro(fat) },
    { key: "carbs", label: l.carbs, value: carbs === null ? l.empty : formatMacro(carbs) },
  ];

  const isIncomplete = [kcal, protein, fat, carbs].some((value) => value === null);

  return (
    <SWrapper>
      <SRow>
        {cells.map((cell) => (
          <SCell key={cell.key}>
            <Num2>{cell.value}</Num2>
            <Caption2 color="textMuted">{cell.label}</Caption2>
          </SCell>
        ))}
      </SRow>
      {isIncomplete && <Caption2 color="danger">{l.incomplete}</Caption2>}
    </SWrapper>
  );
}

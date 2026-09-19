import { Caption2, Num2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { formatKcal, formatMacro } from "./_helpers";
import { SCell, SRow, SWrapper } from "./_styles";

interface IProps {
  kcal: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
}

/**
 * Блок «ккал / Б / Ж / У» на 100 г.
 *
 * Незаполненное значение показывается прочерком, а неполный набор — ещё и
 * предупреждением под строкой: ноль на месте отсутствующей цифры неотличим от
 * честного нуля, и именно это запрещает инвариант «молчаливых нулей не бывает».
 * Предупреждение решается внутри компонента, а не потребителем, — иначе каждый
 * экран писал бы одну и ту же проверку.
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

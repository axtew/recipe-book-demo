import { B1, B2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { SRow, SSection } from "./_styles";

interface IProps {
  freezerDays: number | null;
  fridgeDays: number | null;
}

/** Сроки хранения; рисуется родителем только для замораживаемого рецепта. */
export function StorageBlock({ freezerDays, fridgeDays }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeCard.storage);

  return (
    <SSection>
      <H3>{l.title}</H3>
      <B1>{l.freezable}</B1>
      {freezerDays !== null && (
        <SRow>
          <B2 color="textMuted">{l.freezer}</B2>
          <B2>{`${freezerDays} ${l.daysUnit}`}</B2>
        </SRow>
      )}
      {fridgeDays !== null && (
        <SRow>
          <B2 color="textMuted">{l.fridge}</B2>
          <B2>{`${fridgeDays} ${l.daysUnit}`}</B2>
        </SRow>
      )}
    </SSection>
  );
}

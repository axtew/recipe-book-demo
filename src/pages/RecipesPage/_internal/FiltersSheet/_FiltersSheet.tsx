import { SBottomSheetDrawer } from "@/components/BottomSheetDrawer";
import { B1, B2, H3 } from "@/components/Typography";
import { COOK_TIME_FILTERS } from "@/constants/recipes.constants";
import { useI18nSelector } from "@/context/I18nContext";
import type { IRecipesSearch } from "@/types/recipes.types";

import { SActions, SContent, SDone, SLegend, SOption, SReset, SSection } from "./_styles";

interface IProps {
  isOpened: boolean;
  freezable: boolean;
  time: IRecipesSearch["time"];
  onChange: (next: Pick<IRecipesSearch, "freezable" | "time">) => void;
  onClose: () => void;
}

/**
 * Лист фильтров: «только замораживаемые» и время готовки.
 *
 * Изменения применяются сразу, по мере выбора; «Готово» только закрывает лист.
 */
export function FiltersSheet({ isOpened, freezable, time, onChange, onClose }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeList.filters);

  return (
    <SBottomSheetDrawer opened={isOpened} onClose={onClose} position="bottom" title={l.title}>
      <SContent>
        <SSection>
          <SOption>
            <input
              type="checkbox"
              checked={freezable}
              onChange={(event) =>
                onChange({ freezable: event.target.checked ? true : undefined, time })
              }
            />
            <B1 as="span">{l.freezableLabel}</B1>
          </SOption>
        </SSection>

        <SSection>
          <SLegend>
            <H3>{l.timeTitle}</H3>
          </SLegend>
          <SOption>
            <input
              type="radio"
              name="cook-time"
              checked={time === undefined}
              onChange={() =>
                onChange({ freezable: freezable ? true : undefined, time: undefined })
              }
            />
            <B1 as="span">{l.timeAny}</B1>
          </SOption>
          {COOK_TIME_FILTERS.map((option) => (
            <SOption key={option}>
              <input
                type="radio"
                name="cook-time"
                checked={time === option}
                onChange={() => onChange({ freezable: freezable ? true : undefined, time: option })}
              />
              <B1 as="span">{l.time[option]}</B1>
            </SOption>
          ))}
        </SSection>

        <SActions>
          <SReset type="button" onClick={() => onChange({ freezable: undefined, time: undefined })}>
            <B2 as="span">{l.resetButton}</B2>
          </SReset>
          <SDone type="button" onClick={onClose}>
            <B2 as="span">{l.doneButton}</B2>
          </SDone>
        </SActions>
      </SContent>
    </SBottomSheetDrawer>
  );
}

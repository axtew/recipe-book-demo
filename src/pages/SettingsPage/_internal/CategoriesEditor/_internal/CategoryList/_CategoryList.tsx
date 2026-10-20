import { B2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { ICategory, TCategoryKind } from "@/types/categories.types";

import { CategoryRow } from "./_internal/CategoryRow";
import { SList } from "./_styles";
import { useCategoryList } from "./_useCategoryList";

interface IProps {
  kind: TCategoryKind;
  title: string;
  categories: ICategory[];
}

/** Список категорий одного справочника с перестановкой стрелками. */
export function CategoryList({ kind, title, categories }: IProps) {
  const l = useI18nSelector(({ l }) => l.settings.categories);
  const { moveCategory, isPending } = useCategoryList(kind, categories);

  return (
    <div>
      <H3>{title}</H3>

      {categories.length === 0 && <B2 color="textMuted">{l.emptyHint}</B2>}

      <SList>
        {categories.map((category, index) => (
          // Имя в ключе: после переименования строка пересоздаётся и берёт значение из данных.
          <CategoryRow
            key={`${category.id}:${category.name}`}
            kind={kind}
            category={category}
            isMoveUpDisabled={isPending || index === 0}
            isMoveDownDisabled={isPending || index === categories.length - 1}
            onMoveUp={() => moveCategory(index, -1)}
            onMoveDown={() => moveCategory(index, 1)}
          />
        ))}
      </SList>
    </div>
  );
}

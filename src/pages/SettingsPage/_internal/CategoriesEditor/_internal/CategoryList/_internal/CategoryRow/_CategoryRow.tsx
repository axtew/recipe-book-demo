import { Button } from "@/components/Button";
import { useI18nSelector } from "@/context/I18nContext";
import type { ICategory, TCategoryKind } from "@/types/categories.types";

import { SNameInput, SRow } from "./_styles";
import { useCategoryRow } from "./_useCategoryRow";

interface IProps {
  kind: TCategoryKind;
  category: ICategory;
  isMoveUpDisabled: boolean;
  isMoveDownDisabled: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

/** A category row: the name is edited in place, with order arrows next to it. */
export function CategoryRow({
  kind,
  category,
  isMoveUpDisabled,
  isMoveDownDisabled,
  onMoveUp,
  onMoveDown,
}: IProps) {
  const l = useI18nSelector(({ l }) => l.settings.categories);
  const { name, setName, commitName, handleKeyDown } = useCategoryRow(kind, category);

  return (
    <SRow>
      <SNameInput
        aria-label={l.nameLabel}
        value={name}
        enterKeyHint="done"
        onChange={(event) => setName(event.target.value)}
        onBlur={commitName}
        onKeyDown={handleKeyDown}
      />
      <Button
        variant="secondary"
        type="button"
        aria-label={l.moveUp}
        disabled={isMoveUpDisabled}
        onClick={onMoveUp}
      >
        ↑
      </Button>
      <Button
        variant="secondary"
        type="button"
        aria-label={l.moveDown}
        disabled={isMoveDownDisabled}
        onClick={onMoveDown}
      >
        ↓
      </Button>
    </SRow>
  );
}

import { B2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { SSecondaryButton, SSubmit } from "../../_styles";
import { SCard } from "./_styles";

interface IProps {
  onRestore: () => void;
  onDiscard: () => void;
}

/** Вопрос при открытии редактора, когда в localStorage нашёлся несохранённый черновик. */
export function DraftPrompt({ onRestore, onDiscard }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.draftPrompt);

  return (
    <SCard>
      <H3>{l.title}</H3>
      <B2 color="textMuted">{l.hint}</B2>
      <SSubmit type="button" onClick={onRestore}>
        <B2 as="span">{l.restore}</B2>
      </SSubmit>
      <SSecondaryButton type="button" onClick={onDiscard}>
        <B2 as="span">{l.discard}</B2>
      </SSecondaryButton>
    </SCard>
  );
}

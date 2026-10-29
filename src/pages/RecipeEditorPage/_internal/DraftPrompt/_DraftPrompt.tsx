import { Button } from "@/components/Button";
import { B2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { SCard } from "./_styles";

interface IProps {
  onRestore: () => void;
  onDiscard: () => void;
}

/** The question on opening the editor when an unsaved draft was found in localStorage. */
export function DraftPrompt({ onRestore, onDiscard }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.draftPrompt);

  return (
    <SCard>
      <H3>{l.title}</H3>
      <B2 color="textMuted">{l.hint}</B2>
      <Button variant="primary" type="button" onClick={onRestore}>
        {l.restore}
      </Button>
      <Button variant="secondary" type="button" onClick={onDiscard}>
        {l.discard}
      </Button>
    </SCard>
  );
}
